# OpenClaw Solana Connect v2.0

> ⚠️ READ-ONLY TOOLKIT - Cannot send real transactions

## Overview

A **read-only** toolkit for AI agents to query Solana blockchain data. **Signing and real transactions are NOT supported.**

## What Works

| Function | Status | Description |
|----------|--------|-------------|
| `getBalance()` | ✅ Works | Read SOL/token/NFT balances |
| `getTransactions()` | ✅ Works | Read transaction history |
| `getTokenAccounts()` | ✅ Works | Read token holdings |
| `generateWallet()` | ✅ Works | Generate new addresses |
| `connectWallet()` | ✅ Works | Validate addresses |
| `sendSol()` | ⚠️ Simulation Only | Cannot send real transactions |

## Installation

```bash
# Via ClawHub
clawhub install solana-connect

# Or manually
git clone https://github.com/Seenfinity/openclaw-solana-connect.git
cd openclaw-solana-connect
npm install
```

## Configuration

```bash
# Required: RPC endpoint
export SOLANA_RPC_URL=https://api.testnet.solana.com

# Optional: For future use (not implemented)
export MAX_SOL_PER_TX=10
export MAX_TOKENS_PER_TX=1000
```

## Quick Start

```javascript
const { getBalance, getTransactions, generateWallet } = require('./scripts/solana.js');

// Generate a wallet address (read-only)
const wallet = generateWallet();
console.log('Address:', wallet.address);

// Check balance
const balance = await getBalance(wallet.address);
console.log('SOL:', balance.sol);

// Get transactions
const txs = await getTransactions(wallet.address, 10);
console.log('Transactions:', txs.length);
```

## ⚠️ Important

**This tool cannot send real transactions.**

- `sendSol()` only simulates transactions
- No private key signing implemented
- Use for blockchain data queries only

## Testing

```bash
npm install
node test.js
```

## GitHub

[github.com/Seenfinity/openclaw-solana-connect](https://github.com/Seenfinity/openclaw-solana-connect)

---

MIT © 2026 Seenfinity
