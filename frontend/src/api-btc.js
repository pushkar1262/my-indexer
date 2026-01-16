const API_URL = 'http://localhost:3000';

export async function fetchBtcBlock(blockIdOrHash) {
  const response = await fetch(`${API_URL}/btc/block/${blockIdOrHash}`);
  if (!response.ok) throw new Error('Block not found');
  return response.json();
}

export async function fetchBtcTx(hash) {
  const response = await fetch(`${API_URL}/btc/tx/${hash}`);
  if (!response.ok) throw new Error('Transaction not found');
  return response.json();
}

export async function fetchLatestBtcBlocks() {
  const response = await fetch(`${API_URL}/btc/blocks/latest`);
  if (!response.ok) throw new Error('Failed to fetch latest blocks');
  return response.json();
}

export async function fetchLatestBtcTransactions() {
  const response = await fetch(`${API_URL}/btc/transactions/latest`);
  if (!response.ok) throw new Error('Failed to fetch latest transactions');
  return response.json();
}

export async function fetchBtcAddress(address) {
  const response = await fetch(`${API_URL}/btc/address/${address}`);
  if (!response.ok) throw new Error('Address not found');
  return response.json();
}

export function detectBtcType(query) {
  // Bitcoin block number - digits only
  if (/^\d+$/.test(query)) {
    return 'block';
  }

  // Bitcoin hashes (Block or Tx) - 64 hex characters
  if (/^[a-fA-F0-9]{64}$/.test(query)) {
    // Block hashes in Bitcoin usually start with many leading zeros
    if (query.startsWith('00000000')) {
      return 'block';
    }
    return 'tx';
  }
  
  // Legacy address (1...) or P2SH (3...) or Bech32 (bc1...)
  if (/^(1|3|bc1|tb1)[a-zA-Z0-9]{25,62}$/.test(query)) {
    return 'address';
  }

  return 'unknown';
}
