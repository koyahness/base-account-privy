"use client";

import { useState, useMemo } from "react";
import { useWallets } from "@privy-io/react-auth";
import Section from "../reusables/section";
import { showSuccessToast, showErrorToast } from "@/components/ui/custom-toast";

type AuthResult = {
  address: string;
  message: string;
  signature: string;
};

const Authentication = () => {
  const { wallets } = useWallets();
  const [authResult, setAuthResult] = useState<AuthResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Find the Base Account wallet
  const baseAccount = useMemo(() => {
    return wallets.find((wallet) => wallet.walletClientType === 'base_account');
  }, [wallets]);

  const generateNonce = () => {
    return window.crypto.randomUUID().replace(/-/g, '');
  };

  const handleSignInWithBase = async () => {
    if (!baseAccount) {
      showErrorToast("No Base Account found. Please connect your Base Account first.");
      return;
    }

    setIsLoading(true);
    try {
      const provider = await baseAccount.getEthereumProvider();

      // 1. Generate a fresh nonce
      const nonce = generateNonce();

      // 2. Switch to Base Mainnet (0x2105 = 8453)
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: '0x2105' }],
      });

      // 3. Connect and authenticate with Sign in with Ethereum
      const response = await provider.request({
        method: 'wallet_connect',
        params: [{
          version: '1',
          capabilities: {
            signInWithEthereum: { 
              nonce, 
              chainId: '0x2105' // Base Mainnet - 8453
            }
          }
        }]
      });

      const { accounts } = response as { accounts: any[] };
      const { address } = accounts[0];
      const { message, signature } = accounts[0].capabilities.signInWithEthereum;

      const authData = { address, message, signature };
      setAuthResult(authData);

      showSuccessToast("Successfully authenticated with Base Account!");
      
      // Here you would normally send this to your backend for verification
      console.log("Authentication data:", authData);

    } catch (error) {
      console.error("Error authenticating with Base:", error);
      const message = error?.toString?.() ?? "Failed to authenticate with Base";
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAuth = () => {
    setAuthResult(null);
    showSuccessToast("Authentication data cleared");
  };

  const availableActions = [
    {
      name: "Sign in with Base",
      function: handleSignInWithBase,
      disabled: !baseAccount || isLoading,
    },
    {
      name: "Clear Authentication",
      function: handleClearAuth,
      disabled: !authResult || isLoading,
    },
  ];

  return (
    <Section
      name="Authentication"
      description={
        "Authenticate users with Base Account using wallet signatures instead of passwords. Follows the Sign in with Ethereum (SIWE) standard."
      }
      filepath="src/components/sections/authentication"
      actions={availableActions}
    >
      <div className="mb-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Base Account Status: {baseAccount ? `Connected (${baseAccount.address})` : "Not connected"}
          </p>
          {baseAccount && (
            <p className="text-xs text-gray-500 mb-4">
              Network: Base Mainnet (Chain ID: 8453)
            </p>
          )}
        </div>

        {/* Custom Sign in with Base Button */}
        {!authResult && (
          <div className="mb-4">
            <button
              onClick={handleSignInWithBase}
              disabled={!baseAccount || isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #E2E3F0',
                borderRadius: '8px',
                cursor: baseAccount && !isLoading ? 'pointer' : 'not-allowed',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000000',
                minWidth: '180px',
                height: '44px',
                opacity: baseAccount && !isLoading ? 1 : 0.5
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#0000FF',
                borderRadius: '2px',
                flexShrink: 0
              }} />
              <span>{isLoading ? 'Signing in...' : 'Sign in with Base'}</span>
            </button>
          </div>
        )}

        {authResult && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-green-600">✅ Authentication Successful</h4>
            <div className="space-y-3">
              <div className="p-3 border border-green-200 rounded-md bg-green-50">
                <div className="text-xs text-gray-700 space-y-2">
                  <div>
                    <p><strong>Address:</strong></p>
                    <p className="font-mono break-all text-xs">{authResult.address}</p>
                  </div>
                  <div>
                    <p><strong>Message:</strong></p>
                    <p className="font-mono break-all text-xs bg-gray-100 p-2 rounded">
                      {authResult.message}
                    </p>
                  </div>
                  <div>
                    <p><strong>Signature:</strong></p>
                    <p className="font-mono break-all text-xs bg-gray-100 p-2 rounded">
                      {authResult.signature}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-md">
                <p><strong>Next Steps:</strong></p>
                <p>Send this authentication data to your backend server for verification using viem's <code>verifyMessage</code> function.</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Authenticating...</span>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Authentication;
