# 🚀 Milestone Funding DApp

A decentralized application (DApp) that enables secure milestone-based funding using blockchain technology. Built using Solidity, Scaffold-ETH 2, Next.js, MongoDB, and deployed on the Ethereum Sepolia testnet.

---

## 📌 Features

* Create milestone-based funding projects
* Fund projects using MetaMask wallet
* Release funds only after milestone completion
* Store project data in MongoDB
* Fully deployed DApp (Frontend + Backend + Smart Contract)

---

## 🧱 Tech Stack

### Frontend

* Next.js (Scaffold-ETH 2)
* Tailwind CSS
* Wagmi + Viem

### Backend

* Node.js
* Express.js
* MongoDB Atlas

### Blockchain

* Solidity Smart Contract
* Hardhat
* Ethereum Sepolia Testnet

---

## 🌐 Live Demo

* Frontend (Vercel): https://milestone-dapp-nextjs-2yjzlwerg-krish7grgs-projects.vercel.app/ 
* Backend (Render): https://milestonedapp.onrender.com/
* Smart Contract (Etherscan): https://sepolia.etherscan.io/address/0x27EAC216B942E1c245c966899423E9DeDc69458c

---

## ⚙️ Installation Guide

### 1. Clone Repository

```bash
git clone https://github.com/your-username/Milestone-dapp.git
cd Milestone-dapp
```

---

### 2. Install Dependencies

```bash
yarn install
cd backend
npm install
```

---

### 3. Setup Environment Variables

#### Frontend (.env.local)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

#### Backend (.env)

```env
MONGODB_URI=not allowed to share

PORT=5000
```

#### Smart Contract (packages/hardhat/.env)

```env
ALCHEMY_API_KEY=not allowed to share
DEPLOYER_PRIVATE_KEY=not allowed to share
ETHERSCAN_API_KEY=not allowed to share
```

---

### 4. Run Locally

Start blockchain:

```bash
yarn chain
```

Deploy contract:

```bash
yarn deploy
```

Start frontend:

```bash
yarn start
```

Start backend:

```bash
cd backend
npm run dev
```

---

## 🧪 How to Use

1. Connect MetaMask (Sepolia)
2. Create a project
3. Fund the project (from another account)
4. Release milestone payments
5. View projects in UI

---

## 📊 Project Structure

```
packages/
  nextjs/        → Frontend
  hardhat/       → Smart contracts
backend/         → Node + MongoDB API
```

---

## 📌 Author

Krish

---

## 📜 License

This project is for academic purposes.
