# Vibeforge-decrypto-
# Vibeforge — SmartSplit 💸

> Gamified Web3 expense splitting. Built for DECRYPTO Hackathon @ BMSITM.

## Problem Statement
PS 2: Split-the-Bill Smart Contract (DeFi)

## Tech Stack
- Frontend: React + Vite + Tailwind CSS + ethers.js
- Backend: Node.js + Express + MongoDB
- Blockchain: Solidity + Hardhat (EVM)
- Wallet: MetaMask

## Team Branches
- `frontend-dev` → frontend/
- `backend-dev` → backend/
- `contract-dev` → contracts/

## Running Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI
npm run dev
```

### Contracts
```bash
cd contracts
npm install
cp .env.example .env
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```
