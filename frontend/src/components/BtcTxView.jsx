import React, { useState } from 'react';
import { FileText, Copy, Check, ArrowLeft, ArrowRight, Hash } from 'lucide-react';
import { copyToClipboard } from '../utils';
import { useNavigate, Link } from 'react-router-dom';
import Card from './Card';
import './DetailsView.css';

export function BtcTxView({ tx }) {
  const [copied, setCopied] = useState(null);
  const navigate = useNavigate();

  if (!tx) return null;

  const handleCopy = (text, key) => {
    copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatBtc = (sats) => {
    if (sats === undefined || sats === null) return '0.00000000 BTC';
    const btcValue = parseFloat(sats) / 100000000;
    return btcValue.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }) + ' BTC';
  };

  const totalValueSats = tx.vout?.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0) || 0;

  return (
    <div className="view-container fade-in">
      <Link to="/btc" className="back-link">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="view-header">
        <h1><FileText size={24} style={{ marginRight: '10px' }} /> Transaction Details</h1>
        <div className="hash-display">
          <span className="mono">{tx.tx_hash || tx.txid}</span>
          <button className="icon-btn" onClick={() => handleCopy(tx.tx_hash || tx.txid, 'hash')}>
            {copied === 'hash' ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="grid-2">
        <Card title="Overview" delay={0.1}>
          <div className="detail-row">
            <span className="label">Block Height</span>
            <span className="value highlight mono">{tx.block_number || tx.blockHeight}</span>
          </div>
          <div className="detail-row">
            <span className="label">Total Output</span>
            <span className="value highlight bold">{formatBtc(totalValueSats)}</span>
          </div>
          <div className="detail-row">
            <span className="label">Size</span>
            <span className="value">{tx.size ? `${tx.size} bytes` : 'N/A'}</span>
          </div>
          {tx.fees && (
            <div className="detail-row">
              <span className="label">Fees</span>
              <span className="value">{formatBtc(tx.fees)}</span>
            </div>
          )}
        </Card>

        <Card title="Status" delay={0.2}>
          <div className="detail-row">
            <span className="label">Confirmations</span>
            <span className="value">{tx.confirmations || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Timestamp</span>
            <span className="value">
              {tx.timestamp || tx.blockTime 
                ? new Date((tx.timestamp || tx.blockTime) * 1000).toLocaleString() 
                : 'Pending'}
            </span>
          </div>
        </Card>
      </div>

      <div className="tx-details-grid">
        <div className="inputs-col">
          <h3 className="section-title">Inputs ({tx.vin?.length || 0})</h3>
          {tx.vin && tx.vin.map((input, idx) => (
            <Card key={idx} delay={0.3 + (idx * 0.05)} className="mini-card">
              <div className="detail-row">
                <span className="label">From Address</span>
                <div className="value-stack">
                  {input.addresses ? input.addresses.map((addr, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Link to={`/btc/address/${addr}`} className="link mono small">
                        {addr}
                      </Link>
                      <button className="icon-btn" style={{ padding: '2px' }} onClick={() => handleCopy(addr, `in-${idx}-${i}`)}>
                        {copied === `in-${idx}-${i}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      </button>
                    </div>
                  )) : <span className="mono small">Coinbase / Unknown</span>}
                </div>
              </div>
              <div className="detail-row">
                <span className="label">Value</span>
                <span className="value small">{formatBtc(input.value)}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="arrow-divider">
          <ArrowRight size={32} />
        </div>

        <div className="outputs-col">
          <h3 className="section-title">Outputs ({tx.vout?.length || 0})</h3>
          {tx.vout && tx.vout.map((output, idx) => (
            <Card key={idx} delay={0.3 + (idx * 0.05)} className="mini-card">
              <div className="detail-row">
                <span className="label">To Address</span>
                <div className="value-stack">
                  {output.addresses ? output.addresses.map((addr, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Link to={`/btc/address/${addr}`} className="link mono small">
                        {addr}
                      </Link>
                      <button className="icon-btn" style={{ padding: '2px' }} onClick={() => handleCopy(addr, `out-${idx}-${i}`)}>
                        {copied === `out-${idx}-${i}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      </button>
                    </div>
                  )) : <span className="mono small">OpReturn / Unknown</span>}
                </div>
              </div>
              <div className="detail-row">
                <span className="label">Value</span>
                <span className="value highlight small">{formatBtc(output.value)}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
