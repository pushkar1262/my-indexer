# BlockChain Indexer

Multi-chain blockchain indexer supporting Ethereum and Bitcoin with a modern web interface.

## Features

- **Ethereum Indexing**: Indexes Ethereum blocks and transactions
- **Bitcoin Indexing**: Indexes Bitcoin testnet blocks and transactions
- **REST API**: Query blockchain data via RESTful endpoints
- **Web Dashboard**: Modern React-based UI with real-time updates
- **Multi-chain Support**: Seamlessly switch between Ethereum and Bitcoin

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Running the Application

1. **Start all services**:
   ```bash
   docker-compose up -d
   ```

2. **Access the application**:
   - **Frontend**: http://localhost
   - **API**: http://localhost:3000
   - **pgAdmin**: http://localhost:5050 (admin@example.com / admin)

3. **Stop all services**:
   ```bash
   docker-compose down
   ```

4. **View logs**:
   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f api
   docker-compose logs -f eth-indexer
   docker-compose logs -f btc-indexer
   ```

### Services

- **postgres**: PostgreSQL database
- **pgadmin**: Database management interface
- **api**: REST API server (port 3000)
- **eth-indexer**: Ethereum blockchain indexer
- **btc-indexer**: Bitcoin blockchain indexer
- **frontend**: React web application (port 80)

## Development Setup

### Prerequisites
- Node.js 22+
- PostgreSQL
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Setup database**:
   ```bash
   docker-compose up -d postgres
   ```

3. **Configure environment** (`.env`):
   ```env
   RPC_URL=https://eth-mainnet.public.blastapi.io
   DATABASE_URL=postgresql://user:password@localhost:5432/eth_indexer
   BITCOIN_RPC_URL=https://chain.instanodes.io/btcbbk-testnet/api/v2
   BITCOIN_API_KEY=your-api-key-here
   ```

4. **Run services**:
   ```bash
   # Terminal 1: Ethereum Indexer
   npm run start:indexer

   # Terminal 2: Bitcoin Indexer
   npm run start:btc-indexer

   # Terminal 3: API Server
   npm run start:api

   # Terminal 4: Frontend
   cd frontend && npm run dev
   ```

## API Endpoints

### Ethereum
- `GET /block/:id` - Get block by number or hash
- `GET /tx/:hash` - Get transaction details
- `GET /address/:address` - Get address history and balance
- `GET /blocks/latest` - Get latest 10 blocks
- `GET /transactions/latest` - Get latest 10 transactions

### Bitcoin
- `GET /btc/block/:id` - Get Bitcoin block
- `GET /btc/tx/:hash` - Get Bitcoin transaction
- `GET /btc/blocks/latest` - Get latest Bitcoin blocks
- `GET /btc/transactions/latest` - Get latest Bitcoin transactions

## Architecture

```
┌─────────────┐
│   Frontend  │ (React + Vite)
│  (port 80)  │
└──────┬──────┘
       │
┌──────▼──────────────────────┐
│      API Server             │
│      (port 3000)            │
└──────┬──────────────────────┘
       │
┌──────▼──────┬────────────────┐
│  PostgreSQL │   Indexers     │
│  Database   │  (ETH + BTC)   │
└─────────────┴────────────────┘
```

## License

MIT
