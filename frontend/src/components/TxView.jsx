import { FileText, Copy, Check } from 'lucide-react';
import { formatValue, copyToClipboard } from '../utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DetailsView.css';

export function TxView({ tx }) {
  const [copied, setCopied] = useState(null);
  const navigate = useNavigate();

  if (!tx) return null;

  const handleCopy = (text, key) => {
    copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="details-view">
      <div className="header-row">
        <h2><FileText size={24} /> Transaction Details</h2>
        <button className="back-btn" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
      <div className="card">
        <div className="row">
          <span className="label">Hash:</span>
          <div className="value-with-copy">
            <span className="value mono">{tx.hash}</span>
            <button className="copy-btn" onClick={() => handleCopy(tx.hash, 'hash')}>
              {copied === 'hash' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <div className="row">
          <span className="label">Block Number:</span>
          <span className="value mono">{tx.block_number}</span>
        </div>
        <div className="row">
          <span className="label">From:</span>
          <div className="value-with-copy">
            <span className="value mono">{tx.from_address}</span>
            <button className="copy-btn" onClick={() => handleCopy(tx.from_address, 'from')}>
              {copied === 'from' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <div className="row">
          <span className="label">To:</span>
          <div className="value-with-copy">
            <span className="value mono">{tx.to_address || 'Contract Creation'}</span>
            {tx.to_address && (
              <button className="copy-btn" onClick={() => handleCopy(tx.to_address, 'to')}>
                {copied === 'to' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
        <div className="row">
          <span className="label">Value:</span>
          <span className="value bold">{formatValue(tx.value)}</span>
        </div>
        {tx.data && tx.data !== '0x' && (
          <div className="row column">
            <span className="label">Data:</span>
            <span className="value mono wrap">{tx.data}</span>
          </div>
        )}
      </div>
    </div>
  );
}
