const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const axios = require('axios');
const pool = require('../db');
const fs = require('fs');

const BITCOIN_RPC_URL = process.env.BITCOIN_RPC_URL;
const BITCOIN_API_KEY = process.env.BITCOIN_API_KEY;

// Initialize database schema
async function initDb() {
  const schemaPath = path.join(__dirname, '../../schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schema);
  console.log('Database schema initialized.');
}

// Get latest block number from Bitcoin API
async function getLatestBlockNumber() {
  try {
    console.log(BITCOIN_RPC_URL);
    console.log(BITCOIN_API_KEY);
    const response = await axios.get(`${BITCOIN_RPC_URL}?apikey=${BITCOIN_API_KEY}`);

    console.log(JSON.stringify(response.data, null, 2));

    return response.data.blockbook.bestHeight;
  } catch (error) {
    console.error('Error fetching latest block:', error.message);
    throw error;
  }
}

// Get block data from Bitcoin API
async function getBlock(blockNumber) {
  try {
    const response = await axios.get(`${BITCOIN_RPC_URL}/block/${blockNumber}?apikey=${BITCOIN_API_KEY}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching block ${blockNumber}:`, error.message);
    throw error;
  }
}

// Process and store a block
async function processBlock(blockNumber) {
  try {
    console.log(`Processing block ${blockNumber}...`);
    const block = await getBlock(blockNumber);

    // Insert block
    await pool.query(
      `INSERT INTO btc_blocks (block_number, block_hash, parent_hash, timestamp, nonce, difficulty, size, tx_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (block_number) DO NOTHING`,
      [
        block.height,
        block.hash,
        block.previousBlockHash || null,
        block.time,
        block.nonce || null,
        block.difficulty || null,
        block.size || null,
        block.txCount || block.txs?.length || 0
      ]
    );

    // Process transactions
    if (block.txs && block.txs.length > 0) {
      console.log(`Processing ${block.txs.length} transactions...`);
      let skipped = 0;

      for (const tx of block.txs) {
        try {
          await pool.query(
            `INSERT INTO btc_transactions (tx_hash, block_number, block_hash, timestamp, vin, vout, size, weight)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (tx_hash) DO NOTHING`,
            [
              tx.txid,
              block.height,
              block.hash,
              block.time,
              JSON.stringify(tx.vin || []),
              JSON.stringify(tx.vout || []),
              tx.size || null,
              tx.vsize || null
            ]
          );
        } catch (err) {
          skipped++;
        }
      }

      console.log(`Indexed block ${blockNumber} with ${block.txs.length} transactions (${skipped} skipped).`);
    } else {
      console.log(`Indexed block ${blockNumber} with 0 transactions.`);
    }
  } catch (error) {
    console.error(`Error processing block ${blockNumber}:`, error.message);
    throw error;
  }
}

// Main indexing loop
async function startIndexing() {
  await initDb();

  // Find the last indexed block
  const result = await pool.query('SELECT MAX(block_number) as last_block FROM btc_blocks');
  let currentBlock = result.rows[0].last_block ? result.rows[0].last_block + 1 : 0;

  console.log(`Starting Bitcoin indexer from block ${currentBlock}...`);

  while (true) {
    try {
      const latestBlock = await getLatestBlockNumber();

      while (currentBlock <= latestBlock) {
        await processBlock(currentBlock);
        currentBlock++;
      }

      // Wait before polling again
      // await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds
    } catch (error) {
      console.error('Error in loop:', error.message);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

startIndexing().catch(console.error);
