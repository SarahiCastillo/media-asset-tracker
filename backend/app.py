from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timezone
import uuid
from data import SEED_DATA

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])

@app.route("/api/assets", methods=["GET"])
def get_assets():
    """
    Get /api/assets
    Optional query params: 
    """
    pass

@app.route("/api/assets/<string:asset_id", methods=["GET"])
def get_assets(asset_id):
    """
    GET /api/assets/<id>
    Returns a single asset or 404.
    """
    pass

@app.route("/api/assets", methods=["POST"])
def ingest_asset():
    """
    POST /api/assets
    Registers a new asset. Auto-assigns id, status=ingested, timestamps.
    """
    pass

@app.route("/api/assets/<string:asset_id>/status", methods=["PUT"])
def update_status(asset_id):
    """
    PUT /api/assets/<id>/status
    Body: { "status": "qc_passed" }
    """
    pass

@app.route("/api/stats", methods=["GET"])
def get_status():
    """
    GET /api/stats
    Returns total count and breakdown by status.
    """
    pass

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    
        
    