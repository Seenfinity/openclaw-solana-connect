# 🔗 OpenClaw Solana Connect

> The missing link between OpenClaw agents and Solana blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://opensource.org/licenses/MIT)
[![Solana](https://img.shields.io/badge/Built%20for-Solana-blue?style=flat-square)](https://solana.com)

---

## What is OpenClaw Solana Connect?

**OpenClaw Solana Connect** is a purpose-built toolkit that enables autonomous AI agents running on OpenClaw to interact seamlessly with the Solana blockchain.

While most Solana toolkits are designed for human developers, this toolkit is built specifically for AI agents:

- 🧠 **AI-First Design** — Natural language inputs, automatic validation
- 🔄 **OpenClaw Native** — Works out of the box with OpenClaw skills
- 🤖 **Agent-Friendly** — Autonomous, programmable blockchain interactions
- 🛡️ **Secure by Default** — Sandboxed transactions, clear permissions

---

## Why This Toolkit?

AI agents on OpenClaw can now:

1. **Manage wallets** — Generate, connect, track
2. **Send transactions** — SOL, tokens, NFTs
3. **Analyze on-chain data** — Balances, history, DeFi
4. **Execute strategies** — Autonomous trading, yield optimization

---

## Installation

### Via ClawHub (Recommended)

```bash
clawhub install solana-connect
```

### Manual

```bash
git clone https://github.com/Seenfinity/openclaw-solana-connect.git
cd openclaw-solana-connect
npm install @solana/web3.js @solana/spl-token bs58
```

---

## Configuration

Set your Solana RPC endpoint:

```bash
export SOLANA_RPC_URL=https://api.mainnet.helius-rpc.com
```

**Recommended RPCs:**
- Helius (free tier) — `https://api.mainnet.helius-rpc.com`
- QuickNode — `https://api.mainnet-beta.quiknode.pro/...`
- Default — `https://api.mainnet-beta.solana.com`

---

## Quick Start

```javascript
const { connectWallet, getBalance, sendSol } = require('./scripts/solana.js');

// Generate new wallet for your agent
const wallet = await connectWallet();
// Returns: { address, privateKey }

// Or connect existing
const existing = await connectWallet('your-base58-private-key');

// Check balance
const balance = await getBalance(wallet.address);
// Returns: { sol: 12.5, tokens: [...], nfts: [...] }

// Send SOL
const tx = await sendSol(wallet.privateKey, 'recipient-address', 1.0);
```

---

## Functions

| Function | Description |
|----------|-------------|
| `connectWallet(privateKey?)` | Generate new or connect existing wallet |
| `getBalance(address)` | Get SOL, tokens, NFTs |
| `sendSol(from, to, amount)` | Send SOL |
| `getTokenAccounts(address)` | List all token holdings |
| `sendToken(from, to, mint, amount)` | Send SPL tokens |
| `getTransactions(address, limit)` | Get transaction history |

---

## Use Cases

### 1. Autonomous Trading
Build AI agents that autonomously trade on Solana DEXs based on market analysis.

### 2. NFT Floor Monitor
Create agents that monitor NFT collections and alert on price changes.

### 3. DeFi Analytics
Agents that analyze on-chain data and generate DeFi insights.

### 4. Wallet Manager
Automated portfolio management and payments.

---

## Example: Agent Portfolio Tracker

```javascript
const { getBalance, getTransactions } = require('./scripts/solana.js');

async function trackPortfolio(walletAddress) {
  // Get current holdings
  const balance = await getBalance(walletAddress);
  
  // Get recent activity
  const history = await getTransactions(walletAddress, 10);
  
  return {
    sol: balance.sol,
    tokens: balance.tokens.length,
    nfts: balance.nfts.length,
    recentTxs: history.length
  };
}
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│            OpenClaw Agent                    │
│         (Your AI Agent)                      │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│       OpenClaw Solana Connect                │
│  ┌─────────┐ ┌──────────┐ ┌─────────────┐   │
│  │ Wallet  │ │Transaction│ │   Token    │   │
│  │ Manager │ │  Handler  │ │  Manager   │   │
│  └─────────┘ └──────────┘ └─────────────┘   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         @solana/web3.js                     │
│            Solana RPC                        │
└─────────────────────────────────────────────┘
```

---

## Requirements

- OpenClaw agent
- Node.js 18+
- Solana RPC endpoint

---

## Roadmap

- [x] Basic wallet operations
- [x] SOL transfers
- [x] Token operations
- [x] Transaction history
- [ ] NFT-specific functions
- [ ] DeFi integrations (Jupiter, Raydium)
- [ ] MCP server mode

---

## Related Projects

- [Presage](https://github.com/Seenfinity/presage-skill) — AI Prediction Market Skill
- [solana-agent-kit](https://github.com/sendaifun/solana-agent-kit) — General Solana agent toolkit

---

## License

MIT © 2026 Seenfinity

---

## Connect

- GitHub: [github.com/Seenfinity](https://github.com/Seenfinity)
- OpenClaw: [openclaw.ai](https://openclaw.ai)

---

*Built for OpenClaw agents. Powered by Solana.*
