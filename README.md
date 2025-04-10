![MIT License](https://img.shields.io/github/license/AshleyMelling/melling-holdings-group)
![GitHub Repo Stars](https://img.shields.io/github/stars/AshleyMelling/melling-holdings-group)
![GitHub Last Commit](https://img.shields.io/github/last-commit/AshleyMelling/melling-holdings-group)


# Melling Holdings Group — Bitcoin Dashboard

A modern Bitcoin-native financial dashboard built for internal operations at Melling Holdings Group.  
This platform is designed to provide clear, auditable tracking of Bitcoin wallets, exchange activity, governance records, and company operations — all in one place.

---

## Vision

> *"Built for Bitcoin. Structured like a business. Auditable like a bank."*

The Melling Holdings Group Dashboard is the operational command center for managing Bitcoin holdings at a corporate level — combining clean UX with real-time data pulled directly from the Bitcoin blockchain and exchanges like Kraken.

---

## Features

### Wallet Tracking
- Manage on-chain Bitcoin wallets
- Real-time balance fetching via Mempool.space API
- UTXO breakdown & detailed transaction history
- Categorize wallets (Personal, Business, Cold Storage)

### Exchange Tracking
- Automated Kraken integration
- Full trade history & ledger syncing
- Incremental syncing for live updates
- Clean, sortable, searchable transaction tables

### Governance System
- Immutable governance logs
- File upload & document management
- OpenTimestamps integration (Bitcoin anchoring)
- Visual timeline of company activity

### Account & Ownership Layer
- Group wallets by owner or entity
- Account overviews with total BTC holdings
- Detailed drawers with linked wallets & activity

---

## Tech Stack

| Tech        | Purpose                               |
|-------------|---------------------------------------|
| Next.js     | Frontend Framework                   |
| Tailwind CSS| Styling                              |
| Shadcn/UI   | Components & UI primitives           |
| FastAPI     | Backend API                          |
| PostgreSQL  | Relational Data Storage              |
| Mempool API | Bitcoin Blockchain Data             |
| Kraken API  | Exchange Data & History              |
| OpenTimestamps | Anchoring Governance Logs to Bitcoin |

---

## Setup & Development

# Clone the repo
git clone https://github.com/mellingholdingsgroup/dashboard.git

# Backend (FastAPI)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (Next.js)
cd frontend
npm install
npm run dev
Roadmap

 Wallet tracking with UTXO details

 Kraken integration with full history sync

 Immutable governance logging

 Bitcoin anchoring for documents

 Role-based access & permissions

 Public homepage for Melling Holdings Group

 Multi-chain asset support (Bitcoin-only for now)

Philosophy
Melling Holdings Group operates with a Bitcoin-first mindset:

Minimal trust, maximum verification

Corporate-grade tracking for individual freedom

Transparent, immutable record-keeping

Long-term Bitcoin custody infrastructure

License
MIT License — feel free to fork, build, and contribute.

About
Melling Holdings Group is building the future of Bitcoin-native corporate finance.
This dashboard is an internal tool — but open to the world.
