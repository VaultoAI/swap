# Vaulto Swap

Decentralized interface for swapping tokenized real-world assets (RWAs) across EVM chains. Part of VaultoAI's DeFi product suite.

## Overview

Vaulto Swap is a permissionless DeFi front end for trading tokenized US Treasuries, equities, commodities, and ETFs. It uses CoW Swap's MEV-protected batch auction engine for execution and supports Ethereum, Arbitrum, Optimism, Base, and Polygon. The application is non-custodial and does not require KYC. It is maintained by VaultoAI and available at [app.vaulto.ai](https://app.vaulto.ai).

## Features

- **RWA trading** — Swap tokenized US Treasuries, equities, commodities, and ETFs
- **MEV protection** — CoW Protocol integration to reduce front-running and sandwich risk
- **Multi-chain support** — Trade on Ethereum, Arbitrum, Optimism, Base, and Polygon
- **Intent-based trading** — Submit intents for batch execution
- **Non-custodial** — Decentralized; no KYC required
- **Professional interface** — Mobile-optimized, institutional-grade UX

## Technology Stack

- **Languages:** TypeScript
- **Frameworks / libraries:** Next.js 14, React, CoW Swap widget, Wagmi, Viem, WalletConnect v2, RainbowKit, Tailwind CSS, TanStack Query, Ethers, LiFi, Solana wallet adapters (where applicable)

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn)
- MetaMask or compatible Web3 wallet

### Installation

```bash
npm install
```

### Running

1. Copy `.env.example` to `.env.local` and set at least `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (from [WalletConnect Cloud](https://cloud.walletconnect.com)).
2. Run the development server:

```bash
npm run dev
```

3. Open http://localhost:3000.

## Configuration

Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local`. For deployment, add the same variable in your platform (e.g. Vercel, Netlify).

## Project Structure

- `app/` — Next.js app (page, providers, swap components)
- `config/` — Chain and token configuration
- `contracts/` — Optional smart contracts

## Contributing

See CONTRIBUTING.md for guidelines, or contact VaultoAI engineering.

## License

MIT. See LICENSE file.

## Contact

VaultoAI Engineering. For support or questions, see the repository or organization documentation.

**Notice:** Users are responsible for ensuring RWA trading complies with applicable laws in their jurisdiction. Conduct your own research and understand the risks before trading RWAs.
