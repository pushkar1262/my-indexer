const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const db = require('../db');

const app = express();
app.use(cors());
const port = 3000;

app.get('/blocks/latest', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM blocks ORDER BY number DESC LIMIT 10'
    );
    
    // For each block, count transactions
    const blocksWithTxCount = await Promise.all(result.rows.map(async (block) => {
        const txCountRes = await db.query('SELECT COUNT(*) FROM transactions WHERE block_number = $1', [block.number]);
        return {
            ...block,
            tx_count: txCountRes.rows[0].count
        };
    }));

    res.json(blocksWithTxCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/transactions/latest', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM transactions ORDER BY block_number DESC, hash DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/block/:id_or_hash', async (req, res) => {
  const { id_or_hash } = req.params;
  let query = '';
  let params = [];

  if (id_or_hash.startsWith('0x')) {
    query = 'SELECT * FROM blocks WHERE hash = $1';
    params = [id_or_hash];
  } else {
    query = 'SELECT * FROM blocks WHERE number = $1';
    params = [id_or_hash];
  }

  try {
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Block not found' });
    }
    const block = result.rows[0];
    
    // Fetch transactions for this block
    const txResult = await db.query('SELECT * FROM transactions WHERE block_number = $1', [block.number]);
    block.transactions = txResult.rows;

    res.json(block);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tx/:hash', async (req, res) => {
  const { hash } = req.params;
  try {
    const result = await db.query('SELECT * FROM transactions WHERE hash = $1', [hash]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

app.get('/address/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const transactions = await db.query(
      'SELECT * FROM transactions WHERE from_address = $1 OR to_address = $1 ORDER BY block_number DESC LIMIT 50',
      [address]
    );
    
    // Fetch balance from RPC
    let balance = '0';
    try {
        const balanceBigInt = await provider.getBalance(address);
        balance = ethers.formatEther(balanceBigInt);
    } catch (e) {
        console.error('Error fetching balance:', e);
    }

    res.json({
        address,
        balance,
        transactions: transactions.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==== BITCOIN ENDPOINTS ====

// Get Bitcoin block by number or hash
app.get('/btc/block/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const isHash = id.length === 64;
    
    const query = isHash
      ? 'SELECT * FROM btc_blocks WHERE block_hash = $1'
      : 'SELECT * FROM btc_blocks WHERE block_number = $1';
    
    const blockResult = await db.query(query, [id]);
    
    if (blockResult.rows.length === 0) {
      return res.status(404).json({ error: 'Block not found' });
    }
    
    const block = blockResult.rows[0];
    
    // Get transactions for this block
    const txResult = await db.query(
      'SELECT * FROM btc_transactions WHERE block_number = $1',
      [block.block_number]
    );
    
    block.transactions = txResult.rows.map(tx => ({
      ...tx,
      vin: JSON.parse(tx.vin || '[]'),
      vout: JSON.parse(tx.vout || '[]')
    }));
    res.json(block);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Bitcoin transaction by hash
app.get('/btc/tx/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const result = await db.query('SELECT * FROM btc_transactions WHERE tx_hash = $1', [hash]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const tx = result.rows[0];
    tx.vin = JSON.parse(tx.vin || '[]');
    tx.vout = JSON.parse(tx.vout || '[]');
    
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Get latest Bitcoin blocks
app.get('/btc/blocks/latest', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT block_number, block_hash, timestamp, tx_count FROM btc_blocks ORDER BY block_number DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get latest Bitcoin transactions
app.get('/btc/transactions/latest', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT tx_hash, block_number, timestamp, size FROM btc_transactions ORDER BY block_number DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
