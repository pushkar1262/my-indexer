import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBtcAddress } from '../api-btc';
import { Copy, QrCode, ArrowLeft, Check, Hash } from 'lucide-react';
import { copyToClipboard } from '../utils';
import Card from './Card';

function BtcAddressView({ address }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadAddress() {
      if (!address) return;
      try {
        setLoading(true);
        setError(null);
        const result = await fetchBtcAddress(address);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAddress();
  }, [address]);

  const handleCopy = (text) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="loader">Loading Address Details...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!data) return <div className="error-message">No data found</div>;

  const formatBtc = (sats) => {
    if (sats === undefined || sats === null) return '0.00000000 BTC';
    const btcValue = parseFloat(sats) / 100000000;
    return btcValue.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }) + ' BTC';
  };

  return (
    <div className="view-container fade-in">
      <Link to="/btc" className="back-link">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="view-header">
        <h1>Address Details</h1>
        <div className="hash-display">
          <span className="mono">{address}</span>
          <button className="icon-btn" onClick={() => handleCopy(address)} title="Copy Address">
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto 2rem 0' }}>
        <Card title="Overview" delay={0.1}>
          <div className="detail-row">
            <span className="label">Balance</span>
            <span className="value highlight bold">{formatBtc(data.balance)}</span>
          </div>
        </Card>
      </div>

      <h2 className="section-title">Latest Transactions</h2>
      <Card delay={0.3}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hash</th>
                <th>Block</th>
                <th>Time</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions && data.transactions.map((tx) => (
                <tr key={tx.txid}>
                  <td>
                    <Link to={`/btc/tx/${tx.txid}`} className="mono link">
                      {tx.txid.substring(0, 16)}...
                    </Link>
                  </td>
                  <td>
                    <Link to={`/btc/block/${tx.blockHeight}`} className="link">
                      {tx.blockHeight}
                    </Link>
                  </td>
                  <td>{tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleTimeString() : 'Pending'}</td>
                  <td>
                    <span className="value mono highlight">
                      {formatBtc(tx.value)}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data.transactions || data.transactions.length === 0) && (
                 <tr>
                     <td colSpan="4" className="empty-state">No recent transactions found</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default BtcAddressView;
