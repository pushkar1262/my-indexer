import React, { useState, useEffect } from 'react';
import { fetchLatestBtcBlocks } from '../api-btc';
import { Box, Clock, ChevronRight } from 'lucide-react';
import Card from './Card';
import './LatestList.css';

function LatestBtcBlocks({ onSelectBlock }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlocks = async () => {
    try {
      const data = await fetchLatestBtcBlocks();
      setBlocks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching BTC blocks:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
    const interval = setInterval(fetchBlocks, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loader">Loading Bitcoin blocks...</div>;

  return (
    <Card title="Latest Bitcoin Blocks" delay={0.1}>
      <div className="list-container">
        {blocks.map((block, index) => (
          <div 
            key={block.block_number} 
            className="list-item" 
            onClick={() => onSelectBlock(block.block_number)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="item-icon block-icon" style={{ color: '#f7931a', background: 'rgba(247, 147, 26, 0.1)' }}>
              <Box size={20} />
            </div>
            <div className="item-details">
              <span className="item-primary mono">#{block.block_number}</span>
              <span className="item-secondary">
                <Clock size={12} style={{ marginRight: 4 }} />
                {new Date(block.timestamp * 1000).toLocaleTimeString()}
              </span>
            </div>
            <div className="item-meta">
              <span className="tx-count" style={{ color: '#f7931a', background: 'rgba(247, 147, 26, 0.1)' }}>
                {block.tx_count} txs
              </span>
              <ChevronRight size={16} className="chevron" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default LatestBtcBlocks;
