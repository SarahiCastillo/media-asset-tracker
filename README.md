# media-asset-tracker
A lightweight internal web app built to give teams real‑time operational visibility into the media pipeline. It includes search and filtering capabilities, along with tools to update asset status as content moves through ingest, processing, QC, and delivery stages.

## Tech Stack
- **Backend**: Python 3.13.5, Flask 3.x, flask-cors
- **Frontend**: React 18, Vite, React Router v6

## Prerequisites
- Python 3.11.9
- Node.js 18+
- npm

## How to Run Locally
### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py 
# Runs at http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start
# Runs at http://localhost:3000
```

## API Endpoints
### GET /v1/api/assets
Description: List all assets. Supports `?search=` and `?status=`

### GET /v1/api/assets/:id
Description: Get isngle asset by ID

### POST /v1/api/assets
Description: Ingest a new asset

### PUT /v1/api/assets/:id/status
Description: Update pipeline status

### GET /v1/api/stats
Description: Aggregate counts by pipeline status


## Pipeline Status Flow
ingested -> qc_pending -> qc_passed | qc_failed -> enconding -> delivered | failed


## Project Structure
```
media-asset-tracker/
├── backend/
│   ├── app.py            # Flask API
│   ├── data.py           # In-memory seed data
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── api.js        # All API calls
│       ├── App.jsx       # Routes and nav
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── AssetList.jsx
│       │   ├── AssetDetail.jsx
│       │   └── IngestAsset.jsx
│       └── components/
│           └── StatusBadge.jsx
└── README.md
```

### Dashboard Preview
![Dashboard Preview](.frontend/assets/dashboard.png)
