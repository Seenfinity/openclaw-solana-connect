---
name: solana-connect
description: OpenClaw Solana Connect — A READ-ONLY toolkit for AI agents to query Solana blockchain. Check balances, transactions, tokens. NO signing.
metadata:
  {
    "openclaw":
      {
        "requires":
          {
            "env": ["SOLANA_RPC_URL"],
          },
        "install":
          [
            {
              "id": "npm",
              "kind": "npm",
              "package": "@solana/kit",
              "label": "Install Solana Kit",
            },
            {
              "id": "npm",
              "kind": "npm", 
              "package": "tweetnacl",
              "label": "Install TweetNaCl",
            },
            {
              "id": "npm",
              "kind": "npm",
              "package": "bs58",
              "label": "Install bs58",
            },
          ],
      },
  }
---

# 🔗 OpenClaw Solana Connect v2.0

> ⚠️ READ-ONLY TOOLKIT - NO SIGNING

This is a **read-only** toolkit. **Cannot send real transactions.**

## Why These Dependencies?

- `@solana/kit` - RPC queries only
- `tweetnacl` / `bs58` - Used ONLY for generating wallet addresses (Ed25519 key generation)
- NO signing capability - Cannot sign or broadcast transactions

The crypto libraries are used to derive addresses from seeds (wallet generation), NOT for signing transactions.

## What Works

| Function | Status |
|----------|--------|
| `getBalance()` | ✅ Works |
| `getTransactions()` | ✅ Works |
| `getTokenAccounts()` | ✅ Works |
| `generateWallet()` | ✅ Works |
| `connectWallet()` | ✅ Works |
| `sendSol()` | ⚠️ Simulation only |

## Installation

```bash
clawhub install solana-connect
```

## Environment Variables

- `SOLANA_RPC_URL` - RPC endpoint (required)
- Examples: `https://api.testnet.solana.com` or `https://api.mainnet-beta.solana.com`

## Usage

```javascript
const { getBalance, getTransactions } = require('./scripts/solana.js');

const balance = await getBalance('SOLANA_ADDRESS');
const txs = await getTransactions('SOLANA_ADDRESS');
```

## Security

- No private keys required for read operations
- No signing capability
- Use testnet for testing

---

**This tool cannot send real transactions.** Use for blockchain data queries only.
