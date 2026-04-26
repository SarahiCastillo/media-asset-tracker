from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timezone
from threading import Lock
from data import SEED_DATA

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])

VALID_STATUSES = [
    "ingested",
    "qc_pending",
    "qc_passed",
    "qc_failed",
    "encoding",
    "delivered",
    "failed"
]

REQUIRED_FIELDS = [
    "title",
    "format",
    "codec",
    "resolution",
    "file_size_gb",
    "territory",
    "language"
]

id_lock = Lock()

def current_date():
    """
    Returns current UTC time as ISO string.
    """
    return datetime.now(timezone.utc).isoformat()

def generate_id():
    """
    Generates a unique asset ID like ASSET-001.
    """
    with id_lock:
        if not SEED_DATA:
            return "ASSET-001"
        
        valid_ids = []
        
        for asset in SEED_DATA:
            asset_id = asset.get("id")
            
            if asset_id and "-" in asset_id:
                prefix, number = asset_id.split("-")
                
                if number.isdigit():
                    valid_ids.append((prefix, int(number)))
            
        if not valid_ids:
            return "ASSET-001"
        
        valid_ids.sort(key=lambda x:x[1])
        prefrix, last_id = valid_ids[-1]
        
        id_len = max(3, len(str(last_id)))
        next_id = str(int(last_id) + 1).zfill(id_len)
        
        return f"{prefix}-{next_id}"

def find_asset(asset_id):
    """
    Returns the asset dict or None.
    """
    return next((asset for asset in SEED_DATA if asset["id"] == asset_id), None)
  

@app.route("/v1/api/assets", methods=["GET"])
def get_assets():
    """
    Get /api/assets
    Optional query params:
    ?status=qc_pending
    ?search=heist
    """
    status_filter = request.args.get("status", "").strip().lower()
    search_filter = request.args.get("search", "").strip().lower()
    
    results = SEED_DATA
    
    if status_filter:
        results = [asset for asset in results if asset["status"] == status_filter]
        
    if search_filter:
        results = [asset for asset in results if search_filter in asset["title"].lower()]
        
    
    return jsonify({ "assets": results, "total": len(results)}), 200


@app.route("/v1/api/assets/<string:asset_id>", methods=["GET"])
def get_asset(asset_id):
    """
    GET /api/assets/<id>
    Returns a single asset or 404.
    """
    asset = find_asset(asset_id)
    
    if not asset:
        return jsonify({"error": "Asset not found"}), 404
    
    return jsonify(asset), 200

@app.route("/v1/api/assets", methods=["POST"])
def ingest_asset():
    """
    POST /api/assets
    Registers a new asset. Auto-assigns id, status=ingested, timestamps.
    """
    body = request.get_json(silent=True) or {}
    
    missing = [field for field in REQUIRED_FIELDS if not body.get(field)]

    if missing: 
        return jsonify({
            "error": "Missing required fields",
            "missing_fields": missing,
        }), 400
        

    new_asset = {
        "id": generate_id(),
        "title": body["title"],
        "format": body["format"],
        "codec": body["codec"],
        "resolution": body["resolution"],
        "file_size_gb": float(body["file_size_gb"]),
        "territory": body["territory"],
        "language": body["language"],
        "status": "ingested",
        "created_at": current_date(),
        "updated_at": current_date(),
    }

    SEED_DATA.append(new_asset)
    return jsonify(new_asset), 201

@app.route("/v1/api/assets/<string:asset_id>/status", methods=["PUT"])
def update_status(asset_id):
    """
    PUT /api/assets/<id>/status
    Body: { "status": "qc_passed" }
    """
    asset = find_asset(asset_id)
    
    if not asset:
        return jsonify({"error": "Asset not found"}), 404
    
    body = request.get_json(silent=True) or {}
    new_status = body.get("status", "")
    
    if new_status not in VALID_STATUSES:
        return jsonify({"error": f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}"}), 400
    
    asset["status"] = new_status
    asset["updated_at"] = current_date()
    
    return jsonify(asset), 200

@app.route("/v1/api/stats", methods=["GET"])
def get_status():
    """
    GET /api/stats
    Returns total count and breakdown by status.
    """
    by_status = {status: 0 for status in VALID_STATUSES}
    
    for asset in SEED_DATA:
        asset_status = asset.get("status")
        
        if asset_status in by_status:
            by_status[asset_status] += 1
            
    return jsonify({
        "total": len(SEED_DATA),
        "number_assets_by_status": by_status
    }), 200

if __name__ == "__main__":
    app.run(debug=True, port=8000)
    
        
    