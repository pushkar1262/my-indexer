const API_URL = 'http://localhost:3000';

export async function fetchBlock(idOrHash) {
  const res = await fetch(`${API_URL}/block/${idOrHash}`);
  if (!res.ok) throw new Error('Block not found');
  return res.json();
}

export async function fetchTx(hash) {
  const res = await fetch(`${API_URL}/tx/${hash}`);
  if (!res.ok) throw new Error('Transaction not found');
  return res.json();
}

export async function fetchAddress(address) {
  const res = await fetch(`${API_URL}/address/${address}`);
  if (!res.ok) throw new Error('Address not found');
  return res.json();
}

export async function fetchLatestBlocks() {
  const res = await fetch(`${API_URL}/blocks/latest`);
  if (!res.ok) throw new Error('Failed to fetch latest blocks');
  return res.json();
}

export async function fetchLatestTransactions() {
  const res = await fetch(`${API_URL}/transactions/latest`);
  if (!res.ok) throw new Error('Failed to fetch latest transactions');
  return res.json();
}

export function detectType(query) {
  if (!query) return null;
  if (/^\d+$/.test(query)) return 'block';
  if (/^0x[a-fA-F0-9]{40}$/.test(query)) return 'address';
  // Increase strictness or check length mainly. Tx hash is 66 chars (0x + 64 hex). Block hash is same.
  // We can default to 'tx' and if it fails, try 'block' in the UI logic.
  if (/^0x[a-fA-F0-9]{64}$/.test(query)) return 'tx'; 
  return 'unknown';
}
