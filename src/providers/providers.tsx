"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { base } from "@privy-io/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!}
      config={{
        appearance: {
          walletList: ['base_account'],
          showWalletLoginFirst: true
        },
        defaultChain: base,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
