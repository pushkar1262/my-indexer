import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchBar.css';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Detect which chain based on current route
      const chain = location.pathname.startsWith('/btc') ? 'btc' : 'eth';
      navigate(`/${chain}/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <Search className="search-icon" size={20} />
      <input
        type="text"
        placeholder="Search Block, Hash, or Address..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-btn">
        <Search size={18} />
        <span>Search</span>
      </button>
    </form>
  );
}
