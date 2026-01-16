import React, { useState, useEffect } from 'react';
import { fetchLatestTransactions } from '../api';
import { Activity, Clock, ChevronRight } from 'lucide-react';
import Card from './Card';
import './LatestList.css';

function LatestTransactions({ onSelectTx }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const data = await fetchLatestTransactions();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loader">Loading transactions...</div>;

  return (
    <Card title="Latest Ethereum Transactions" delay={0.2}>
      <div className="list-container">
        {transactions.map((tx, index) => (
          <div 
            key={tx.hash} 
            className="list-item" 
            onClick={() => onSelectTx(tx.hash)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="item-icon tx-icon">
              <Activity size={20} />
            </div>
            <div className="item-details">
              <span className="item-primary mono">{tx.hash.substring(0, 16)}...</span>
              <span className="item-secondary">
                From: {tx.from_address.substring(0, 8)}...
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

export default LatestTransactions;
