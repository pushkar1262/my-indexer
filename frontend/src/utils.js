import { ethers } from 'ethers';

export function formatValue(wei) {
  if (!wei || wei === '0') return '0 ETH';
  try {
    const eth = ethers.formatEther(wei);
    // If it's a very small number, show more precision
    const ethNum = parseFloat(eth);
    if (ethNum > 0 && ethNum < 0.0001) {
      return `${eth} ETH`;
    }
    return `${ethNum.toLocaleString(undefined, { maximumFractionDigits: 6 })} ETH`;
  } catch (e) {
    return '0 ETH';
  }
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
}
