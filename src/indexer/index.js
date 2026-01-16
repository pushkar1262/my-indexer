const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { ethers } = require('ethers');
const db = require('../db');
const fs = require('fs');

// Initialize Provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

async function initDb() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, '../../schema.sql'), 'utf8');
    await db.query(schema);
    console.log('Database schema initialized.');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

async function getLatestIndexedBlock() {
  const res = await db.query('SELECT MAX(number) as max_number FROM blocks');
  return res.rows[0].max_number ? BigInt(res.rows[0].max_number) : null;
}

async function processBlock(blockNumber) {
  try {
    // Fetch block with prefetched transactions
    const block = await provider.getBlock(blockNumber, true);
    if (!block) return;

    console.log(`Processing block ${blockNumber}...`);

    // Insert Block
    await db.query(
      'INSERT INTO blocks (number, hash, parent_hash, timestamp) VALUES ($1, $2, $3, $4) ON CONFLICT (number) DO NOTHING',
      [block.number, block.hash, block.parentHash, block.timestamp]
    );

    // Process transactions - use prefetchedTransactions if available
    const transactions = block.prefetchedTransactions || block.transactions || [];
    
    if (transactions.length > 0) {
      console.log(`Processing ${transactions.length} transactions...`);
      
      let successCount = 0;
      let skipCount = 0;
      
      for (let i = 0; i < transactions.length; i++) {
        let tx = transactions[i];
        
        // If tx is just a hash string, skip it (we'll fetch on-demand via API)
        if (typeof tx === 'string') {
          skipCount++;
          continue;
        }
        
        // Skip if transaction object doesn't have required fields
        if (!tx || !tx.hash) {
          skipCount++;
          continue;
        }

        try {
          await db.query(
            `INSERT INTO transactions (hash, block_number, from_address, to_address, value, data) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             ON CONFLICT (hash) DO NOTHING`,
            [tx.hash, block.number, tx.from, tx.to, tx.value?.toString() || '0', tx.data || '0x']
          );
          successCount++;
        } catch (err) {
          console.error(`Failed to insert tx ${tx.hash}:`, err.message);
          skipCount++;
        }
      }
      
      console.log(`Indexed block ${blockNumber} with ${successCount} transactions (${skipCount} skipped).`);
    } else {
      console.log(`Indexed block ${blockNumber} with 0 transactions.`);
    }
  } catch (err) {
    console.error(`Error processing block ${blockNumber}:`, err.message);
  }
}

async function main() {
  await initDb();

  let currentBlock = await provider.getBlockNumber();
  const lastIndexed = await getLatestIndexedBlock();
  
  let startBlock = lastIndexed !== null ? lastIndexed + 1n : BigInt(currentBlock);

  console.log(`Starting indexer from block ${startBlock}...`);

  // Simple polling loop
  while (true) {
    try {
      const latestBlock = await provider.getBlockNumber();
      if (BigInt(latestBlock) >= startBlock) {
        await processBlock(Number(startBlock));
        startBlock++;
      } else {
        // Wait for new blocks
        await new Promise(r => setTimeout(r, 12000)); // ~12s block time
      }
    } catch (err) {
      console.error('Error in loop:', err);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

main();
