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

export function detectBtcType(query) {
  // Bitcoin block hash - 64 hex characters
  if (/^[a-fA-F0-9]{64}$/.test(query)) {
    return 'block';
  }
  // Bitcoin block number - digits only
  if (/^\d+$/.test(query)) {
    return 'block';
  }
  // Bitcoin transaction hash - 64 hex characters
  if (/^[a-fA-F0-9]{64}$/.test(query)) {
    return 'tx';
  }
  
  return 'unknown';
}
