/**
 * OpenClaw Solana Connect
 * A toolkit for OpenClaw agents to interact with Solana blockchain
 */

const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const { getAssociatedTokenAddress, getAccount, transfer: splTransfer, createTransferInstruction } = require('@solana/spl-token');

// Default RPC (can be overridden via env)
const DEFAULT_RPC = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

/**
 * Get Solana connection
 */
function getConnection(rpcUrl = DEFAULT_RPC) {
  return new Connection(rpcUrl, 'confirmed');
}

/**
 * Connect wallet from private key
 * @param {string} privateKeyBase58 - Base58 encoded private key (optional, generates new if not provided)
 * @returns {Object} { address, privateKey }
 */
async function connectWallet(privateKeyBase58 = null) {
  if (!privateKeyBase58) {
    // Generate new wallet
    const keypair = Keypair.generate();
    return {
      address: keypair.publicKey.toBase58(),
      privateKey: Array.from(keypair.secretKey).join(','),
      keypair: keypair
    };
  }
  
  // Import existing wallet
  try {
    const privateKeyArray = privateKeyBase58.split(',').map(Number);
    const keypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
    return {
      address: keypair.publicKey.toBase58(),
      privateKey: privateKeyBase58,
      keypair: keypair
    };
  } catch (e) {
    // Try base58 decode
    const bs58 = require('bs58');
    const keypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKeyBase58)));
    return {
      address: keypair.publicKey.toBase58(),
      privateKey: privateKeyBase58,
      keypair: keypair
    };
  }
}

/**
 * Get balance for any Solana address
 * @param {string} address - Solana address
 * @returns {Object} { sol, tokens, nfts }
 */
async function getBalance(address, rpcUrl = DEFAULT_RPC) {
  const connection = getConnection(rpcUrl);
  const pubKey = new PublicKey(address);
  
  // Get SOL balance
  const solBalance = await connection.getBalance(pubKey);
  
  // Get token accounts
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
  });
  
  const tokens = [];
  const nfts = [];
  
  for (const account of tokenAccounts.value) {
    const info = account.account.data.parsed.info;
    const mint = info.mint;
    const balance = info.tokenAmount.uiAmount;
    
    if (balance > 0) {
      // Check if NFT (usually supply is 1)
      if (info.tokenAmount.decimals === 0 && info.tokenAmount.amount === '1') {
        nfts.push({ mint, balance: 1 });
      } else {
        tokens.push({ mint, balance });
      }
    }
  }
  
  return {
    sol: solBalance / 1e9,
    tokens,
    nfts
  };
}

/**
 * Send SOL from one address to another
 * @param {string} fromPrivateKey - Sender's private key (base58 or array)
 * @param {string} toAddress - Recipient address
 * @param {number} amountInSol - Amount in SOL
 * @returns {Object} Transaction result
 */
async function sendSol(fromPrivateKey, toAddress, amountInSol, rpcUrl = DEFAULT_RPC) {
  const connection = getConnection(rpcUrl);
  
  // Parse private key
  let keypair;
  try {
    const privateKeyArray = fromPrivateKey.split(',').map(Number);
    keypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
  } catch (e) {
    const bs58 = require('bs58');
    keypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(fromPrivateKey)));
  }
  
  const toPubKey = new PublicKey(toAddress);
  const lamports = amountInSol * 1e9;
  
  // Create transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: toPubKey,
      lamports
    })
  );
  
  // Sign and send
  const signature = await connection.sendTransaction(transaction, [keypair]);
  
  return {
    signature,
    from: keypair.publicKey.toBase58(),
    to: toAddress,
    amount: amountInSol,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get token accounts for an address
 * @param {string} address - Solana address
 * @returns {Array} Token accounts
 */
async function getTokenAccounts(address, rpcUrl = DEFAULT_RPC) {
  const connection = getConnection(rpcUrl);
  const pubKey = new PublicKey(address);
  
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
  });
  
  const result = [];
  for (const account of tokenAccounts.value) {
    const info = account.account.data.parsed.info;
    result.push({
      mint: info.mint,
      balance: info.tokenAmount.uiAmountString,
      decimals: info.tokenAmount.decimals,
      address: account.pubkey.toBase58()
    });
  }
  
  return result;
}

/**
 * Send SPL tokens
 * @param {string} fromPrivateKey - Sender's private key
 * @param {string} toAddress - Recipient address
 * @param {string} tokenMint - Token mint address
 * @param {number} amount - Amount to send
 * @returns {Object} Transaction result
 */
async function sendToken(fromPrivateKey, toAddress, tokenMint, amount, rpcUrl = DEFAULT_RPC) {
  const connection = getConnection(rpcUrl);
  
  // Parse private key
  let keypair;
  try {
    const privateKeyArray = fromPrivateKey.split(',').map(Number);
    keypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
  } catch (e) {
    const bs58 = require('bs58');
    keypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(fromPrivateKey)));
  }
  
  const mint = new PublicKey(tokenMint);
  const toPubKey = new PublicKey(toAddress);
  
  // Get sender's token account
  const fromAta = await getAssociatedTokenAddress(mint, keypair.publicKey);
  const toAta = await getAssociatedTokenAddress(mint, toPubKey);
  
  // Get token info for decimals
  const tokenInfo = await connection.getParsedAccountInfo(mint);
  const decimals = tokenInfo.value.data.parsed.info.decimals;
  const rawAmount = Math.round(amount * Math.pow(10, decimals));
  
  // Create transfer instruction
  const instruction = createTransferInstruction(
    fromAta,
    toAta,
    keypair.publicKey,
    rawAmount
  );
  
  // Send transaction
  const transaction = new Transaction().add(instruction);
  const signature = await connection.sendTransaction(transaction, [keypair]);
  
  return {
    signature,
    token: tokenMint,
    from: keypair.publicKey.toBase58(),
    to: toAddress,
    amount
  };
}

/**
 * Get recent transactions for an address
 * @param {string} address - Solana address
 * @param {number} limit - Number of transactions
 * @returns {Array} Transactions
 */
async function getTransactions(address, limit = 10, rpcUrl = DEFAULT_RPC) {
  const connection = getConnection(rpcUrl);
  const pubKey = new PublicKey(address);
  
  const signatures = await connection.getSignaturesForAddress(pubKey, { limit });
  
  return signatures.map(sig => ({
    signature: sig.signature,
    slot: sig.slot,
    blockTime: sig.blockTime,
    status: sig.err ? 'failed' : 'success'
  }));
}

module.exports = {
  connectWallet,
  getBalance,
  sendSol,
  getTokenAccounts,
  sendToken,
  getTransactions,
  getConnection
};
