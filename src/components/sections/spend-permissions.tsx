"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useBaseAccountSdk, useWallets } from "@privy-io/react-auth";
import {
  requestSpendPermission,
  prepareSpendCallData,
  fetchPermissions,
  getPermissionStatus,
} from "@base-org/account/spend-permission/browser";
import { base } from "@privy-io/chains";
import Section from "../reusables/section";
import { showSuccessToast, showErrorToast } from "@/components/ui/custom-toast";

const SpendPermissions = () => {
  const { baseAccountSdk } = useBaseAccountSdk();
  const { wallets } = useWallets();
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Default spend permission configuration
  const spenderAddress = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
  const tokenAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // USDC on Base

  // Find the Base Account wallet
  const baseAccount = useMemo(() => {
    return wallets.find((wallet) => wallet.walletClientType === 'base_account');
  }, [wallets]);

  const provider = baseAccountSdk?.getProvider();
  const account = baseAccount?.address;

  const loadPermissions = useCallback(async () => {
    if (!account || !provider || !spenderAddress) return;
    
    try {
      setLoading(true);
      const fetchedPermissions = await fetchPermissions({
        account,
        chainId: base.id,
        spender: spenderAddress,
        provider,
      });
      setPermissions(fetchedPermissions);
    } catch (error) {
      console.error("Failed to load permissions:", error);
      showErrorToast("Failed to load spend permissions");
    } finally {
      setLoading(false);
    }
  }, [account, provider, spenderAddress]);

  useEffect(() => {
    if (account && provider && spenderAddress) {
      loadPermissions();
    }
  }, [loadPermissions, account, provider, spenderAddress]);

  const handleRequestSpendPermission = async () => {
    if (!account || !provider || !spenderAddress || !tokenAddress) {
      showErrorToast("Base Account not found or missing configuration");
      return;
    }

    try {
      setLoading(true);
      
      const permission = await requestSpendPermission({
        account,
        spender: spenderAddress,
        token: tokenAddress,
        chainId: base.id,
        allowance: BigInt(1) * BigInt(10 ** 6), // 1 USDC (6 decimals)
        periodInDays: 1, // 1 day
        provider,
      });

      showSuccessToast("Spend permission created successfully!");
      setPermissions([...permissions, permission]);
    } catch (error) {
      console.error("Failed to create spend permission:", error);
      showErrorToast("Failed to create spend permission");
    } finally {
      setLoading(false);
    }
  };

  const handleUseSpendPermission = async () => {
    if (!selectedPermission || !provider || !spenderAddress) {
      showErrorToast("Please select a permission and set spender address");
      return;
    }

    try {
      setLoading(true);
      
      // Check permission status first
      const { isActive, remainingSpend } = await getPermissionStatus(selectedPermission);
      
      if (!isActive) {
        showErrorToast("Selected permission is not active");
        return;
      }

      const spendAmount = BigInt(100) * BigInt(10 ** 6); // 100 USDC
      
      if (remainingSpend < spendAmount) {
        showErrorToast("Insufficient remaining allowance");
        return;
      }

      // Prepare spend calls - using the actual API signature (permission, amount)
      const spendCalls = await prepareSpendCallData(selectedPermission, spendAmount);

      // Note: In a real implementation, you would submit these calls using your app's spender account
      // This is just for demonstration purposes
      console.log("Spend calls prepared:", spendCalls);
      showSuccessToast("Spend calls prepared successfully! Check console for details.");
      
    } catch (error) {
      console.error("Failed to use spend permission:", error);
      showErrorToast("Failed to use spend permission");
    } finally {
      setLoading(false);
    }
  };


  const availableActions = [
    {
      name: "Create Spend Permission",
      function: handleRequestSpendPermission,
      disabled: loading || !account || !spenderAddress || !tokenAddress,
    },
    {
      name: "Load Permissions",
      function: loadPermissions,
      disabled: loading || !account || !spenderAddress,
    },
    {
      name: "Use Permission",
      function: handleUseSpendPermission,
      disabled: loading || !selectedPermission,
    },
  ];

  return (
    <Section
      name="Spend Permissions"
      description="Create and manage spend permissions to allow trusted spenders to move assets from your Base Account without additional signatures."
      filepath="src/components/sections/spend-permissions"
      actions={availableActions}
    >
      <div className="space-y-4">
        {/* Default spend permission configuration */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">Spend Permission Configuration</h4>
          <div className="text-sm space-y-1">
            <div><strong>Spender:</strong> {spenderAddress}</div>
            <div><strong>Token:</strong> {tokenAddress} (USDC)</div>
            <div><strong>Allowance:</strong> $1 USDC per day</div>
          </div>
        </div>

        {/* Permissions list */}
        {permissions.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Existing Permissions</h4>
            <div className="space-y-2">
              {permissions.map((permission, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedPermission === permission
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedPermission(permission)}
                >
                  <div className="text-sm">
                    <div><strong>Spender:</strong> {permission.spender?.slice(0, 10) || 'N/A'}...</div>
                    <div><strong>Token:</strong> {permission.token?.slice(0, 10) || 'N/A'}...</div>
                    <div><strong>Allowance:</strong> {permission.allowance?.toString() || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status display */}
        <div className="text-sm text-gray-600">
          {account && <div><strong>Account:</strong> {account}</div>}
          {selectedPermission && (
            <div className="mt-2">
              <strong>Selected Permission:</strong> Spender {selectedPermission.spender?.slice(0, 10) || 'N/A'}...
            </div>
          )}
          {loading && <div className="text-blue-600">Loading...</div>}
        </div>
      </div>
    </Section>
  );
};

export default SpendPermissions;
