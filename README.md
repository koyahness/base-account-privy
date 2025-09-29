# Build on Base with Privy

A Next.js starter template for building on Base with Privy's authentication and wallet infrastructure. Features Base Account integration, smart wallet management, and seamless onchain experiences.

## 🚀 Features

This demo showcases the full spectrum of Base Account capabilities:

- **Base Account Authentication** - Passwordless sign-in using wallet signatures
- **Sub Accounts Management** - Create and manage app-specific wallet accounts
- **Wallet Operations** - Complete wallet interaction functionality
- **Account Linking/Unlinking** - Connect and disconnect various account types
- **Multi-Factor Authentication** - Enhanced security features

## 🏗️ Architecture

### Provider Configuration (`src/providers/providers.tsx`)

The application is configured to prioritize Base Account as the primary wallet option:

```tsx
<PrivyProvider
  config={{
    appearance: {
      walletList: ['base_account'],
      showWalletLoginFirst: true
    },
    defaultChain: base,
  }}
>
```

This configuration ensures that Base Account appears first in the wallet connection flow, providing the optimal user experience for Base Account users.

## 🔐 Authentication Section

The authentication component implements the "Sign in with Base" flow using Base Account's wallet signature authentication:

### Key Features:
- **Passwordless Authentication** - No passwords required, uses wallet signatures
- **SIWE Standard** - Follows the "Sign in with Ethereum" (EIP-4361) standard
- **Nonce Generation** - Secure random nonce generation for each authentication
- **Chain Switching** - Automatically switches to Base Mainnet
- **Custom Button** - Branded "Sign in with Base" button following Base guidelines

### Implementation:
- Uses `wallet_connect` RPC method with `signInWithEthereum` capabilities
- Generates secure nonces using `window.crypto.randomUUID()`
- Provides complete authentication data (address, message, signature) for backend verification
- Ready for backend integration with viem's `verifyMessage` function

**Learn more:** [Base Account Authentication Guide](https://docs.base.org/base-account/guides/authenticate-users)

## 🏦 Sub Accounts Section

Sub Accounts allow you to create app-specific wallet accounts that provide a frictionless transaction experience:

### Key Features:
- **Get Existing Sub Accounts** - Retrieve sub accounts for the current domain
- **Create New Sub Accounts** - Generate new sub accounts tied to your app
- **Domain-Specific** - Each sub account is bound to your application's domain
- **Frictionless Transactions** - Eliminate repeated signing prompts
- **Spend Permissions Ready** - Can spend from parent account balance

### Implementation:
- Uses `wallet_getSubAccounts` RPC method to fetch existing accounts
- Uses `wallet_addSubAccount` RPC method to create new sub accounts
- Automatically switches to Base Sepolia for testing
- Displays sub account details including addresses and public keys

**Learn more:** [Base Account Sub Accounts Guide](https://docs.base.org/base-account/improve-ux/sub-accounts)

## 🔧 Additional Sections

### Wallet Actions
Comprehensive wallet operation functionality including:
- Transaction sending and management
- Smart contract interactions
- Balance checking and transfers

### Link Accounts
Connect various account types to your Base Account:
- Social accounts integration
- Email account linking
- Additional wallet connections

### Unlink Accounts
Manage and disconnect linked accounts:
- Remove connected social accounts
- Unlink email addresses
- Disconnect additional wallets

### Multi-Factor Authentication (MFA)
Enhanced security features:
- Enable/disable MFA
- Manage authentication factors
- Security settings configuration

## 🛠️ Getting Started

### Prerequisites

Make sure you have the following environment variables set:

```bash
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_privy_client_id
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd base-account-privy

# Install dependencies
npm install
# or
pnpm install
# or
yarn install

# Run the development server
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Main application page
│   └── layout.tsx              # Root layout
├── components/
│   ├── sections/
│   │   ├── authentication.tsx   # Base Account authentication
│   │   ├── sub-accounts.tsx    # Sub accounts management
│   │   ├── wallet-actions.tsx  # Wallet operations
│   │   ├── link-accounts.tsx   # Account linking
│   │   ├── unlink-accounts.tsx # Account unlinking
│   │   ├── mfa.tsx            # Multi-factor auth
│   │   └── user-object.tsx    # User information
│   ├── reusables/
│   │   └── section.tsx        # Reusable section component
│   └── ui/                    # UI components
├── providers/
│   └── providers.tsx          # Privy provider configuration
```

## 🔗 Resources

### Base Account Documentation
- [Base Account Overview](https://docs.base.org/base-account)
- [Authentication Guide](https://docs.base.org/base-account/guides/authenticate-users)
- [Sub Accounts Guide](https://docs.base.org/base-account/improve-ux/sub-accounts)
- [Base Account SDK](https://docs.base.org/base-account/reference/account-sdk)

### Privy Documentation
- [Privy Documentation](https://docs.privy.io/)
- [Privy React SDK](https://docs.privy.io/reference/react-auth)

### Development Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Viem Documentation](https://viem.sh/)
- [Base Chain Documentation](https://docs.base.org/)

## 🚀 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new):

1. Push your code to a Git repository
2. Import your project to Vercel
3. Add your environment variables
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).