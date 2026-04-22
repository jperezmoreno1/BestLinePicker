import os
import firebase_admin
from firebase_admin import credentials, firestore

_db = None

def get_db():
    global _db
    if _db is not None:
        return _db
    
    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "").strip()
    if not service_account_path:
        raise RuntimeError("Missing FIREBASE_SERVICE_ACCOUNT_PATH in environment")
    
    if not firebase_admin._apps:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)

    _db = firestore.client()
    return _db