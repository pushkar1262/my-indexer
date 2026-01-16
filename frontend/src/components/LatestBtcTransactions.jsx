import React, { useState, useEffect } from 'react';
import { fetchLatestBtcTransactions } from '../api-btc';
import { Activity, ChevronRight } from 'lucide-react';
import Card from './Card';
import './LatestList.css';

function LatestBtcTransactions({ onSelectTx }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const data = await fetchLatestBtcTransactions();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching BTC transactions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loader">Loading Bitcoin transactions...</div>;

  return (
    <Card title="Latest Bitcoin Transactions" delay={0.2}>
      <div className="list-container">
        {transactions.map((tx, index) => (
          <div 
            key={tx.tx_hash} 
            className="list-item" 
            onClick={() => onSelectTx(tx.tx_hash)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="item-icon tx-icon" style={{ color: '#f7931a', background: 'rgba(247, 147, 26, 0.1)' }}>
              <Activity size={20} />
            </div>
            <div className="item-details">
              <span className="item-primary mono">{tx.tx_hash.substring(0, 16)}...</span>
              <span className="item-secondary">
                Size: {tx.size} bytes
              </span>
            </div>
            <div className="item-meta">
              <ChevronRight size={16} className="chevron" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default LatestBtcTransactions;
