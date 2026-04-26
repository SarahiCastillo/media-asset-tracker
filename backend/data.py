from datetime import datetime, timezone

def now_iso():
    return datetime.now(timezone.utc).isoformat()

SEED_DATA = [
    { 
        "id": "ASSET-001",
        "title": "The Great Heist - S01E01",
        "format": "MOV",
        "codec": "ProRes 422",
        "territory": "US",
        "resolution": "4K",
        "file_size_gb": 42.1,
        "language": "en",
        "status": "delivered",
        "created_at": "2026-04-01T08:00:00Z",
        "updated_at": "2026-04-03T14:22:00Z" 
    }
]