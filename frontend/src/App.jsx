import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { SearchBar } from './components/SearchBar';
import { BlockView } from './components/BlockView';
import { TxView } from './components/TxView';
import { AddressView } from './components/AddressView';
import { BtcBlockView } from './components/BtcBlockView';
import { BtcTxView } from './components/BtcTxView';
import { fetchBlock, fetchTx, fetchAddress, detectType } from './api';
import { fetchBtcBlock, fetchBtcTx, detectBtcType } from './api-btc';
import LatestBlocks from './components/LatestBlocks';
import LatestTransactions from './components/LatestTransactions';
import LatestBtcBlocks from './components/LatestBtcBlocks';
import LatestBtcTransactions from './components/LatestBtcTransactions';
import ChainSelector from './components/ChainSelector';
import { LayoutDashboard } from 'lucide-react';
import './App.css';

// Ethereum Dashboard
function EthHome() {
  const navigate = useNavigate();
  return (
    <div className="home-view">
      <div className="dashboard-grid">
        <div className="dashboard-col">
            <LatestBlocks onSelectBlock={(blockNum) => navigate(`/eth/block/${blockNum}`)} />
        </div>
        <div className="dashboard-col">
            <LatestTransactions onSelectTx={(hash) => navigate(`/eth/tx/${hash}`)} />
        </div>
      </div>
    </div>
  );
}

// Bitcoin Dashboard
function BtcHome() {
  const navigate = useNavigate();
  return (
    <div className="home-view">
      <div className="dashboard-grid">
        <div className="dashboard-col">
            <LatestBtcBlocks onSelectBlock={(blockNum) => navigate(`/btc/block/${blockNum}`)} />
        </div>
        <div className="dashboard-col">
            <LatestBtcTransactions onSelectTx={(hash) => navigate(`/btc/tx/${hash}`)} />
        </div>
      </div>
    </div>
  );
}

// Ethereum Explorer
function EthExplore() {
  const { type: urlType, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const query = id || searchParams.get('q');

  useEffect(() => {
    if (!query) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const type = urlType || detectType(query);
        if (!type || type === 'unknown') {
          throw new Error('Invalid search query');
        }

        let result;
        if (type === 'block') {
          result = await fetchBlock(query);
          if (urlType !== 'block') navigate(`/eth/block/${query}`, { replace: true });
        } else if (type === 'tx') {
          try {
            result = await fetchTx(query);
            if (urlType !== 'tx') navigate(`/eth/tx/${query}`, { replace: true });
          } catch {
            result = await fetchBlock(query);
            if (urlType !== 'block') navigate(`/eth/block/${query}`, { replace: true });
          }
        } else if (type === 'address') {
          result = await fetchAddress(query);
          if (urlType !== 'address') navigate(`/eth/address/${query}`, { replace: true });
        }
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [query, urlType, navigate]);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null;

  return (
    <div className="content">
      {(urlType === 'block') && <BlockView block={data} onSelectTx={(hash) => navigate(`/eth/tx/${hash}`)} />}
      {(urlType === 'tx') && <TxView tx={data} />}
      {(urlType === 'address') && <AddressView address={data?.address} balance={data?.balance} transactions={data?.transactions} onSelectTx={(hash) => navigate(`/eth/tx/${hash}`)} />}
    </div>
  );
}

// Bitcoin Explorer
function BtcExplore() {
  const { type: urlType, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const query = id || searchParams.get('q');

  useEffect(() => {
    if (!query) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const type = urlType || detectBtcType(query);
        if (!type || type === 'unknown') {
          throw new Error('Invalid search query');
        }

        let result;
        if (type === 'block') {
          result = await fetchBtcBlock(query);
          if (urlType !== 'block') navigate(`/btc/block/${query}`, { replace: true });
        } else if (type === 'tx') {
          result = await fetchBtcTx(query);
          if (urlType !== 'tx') navigate(`/btc/tx/${query}`, { replace: true });
        }
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [query, urlType, navigate]);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null;

  return (
    <div className="content">
      {(urlType === 'block') && <BtcBlockView block={data} onSelectTx={(hash) => navigate(`/btc/tx/${hash}`)} />}
      {(urlType === 'tx') && <BtcTxView tx={data} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <Link to="/eth" className="logo">
            <LayoutDashboard size={28} />
            <h1>BlockChain Indexer</h1>
          </Link>
          <div className="header-right">
            <SearchBar />
            <ChainSelector />
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<EthHome />} />
            <Route path="/eth" element={<EthHome />} />
            <Route path="/eth/search" element={<EthExplore />} />
            <Route path="/eth/:type/:id" element={<EthExplore />} />
            
            <Route path="/btc" element={<BtcHome />} />
            <Route path="/btc/search" element={<BtcExplore />} />
            <Route path="/btc/:type/:id" element={<BtcExplore />} />
            
            <Route path="*" element={<div className="error-message">Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
