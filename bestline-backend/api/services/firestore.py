import os
import firebase_admin
from firebase_admin import credentials, firestore

_app = None
_db = None

def get_db():
    global _app, _db
    if _db is not None:
        return _db
    
    path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "")
    if not path:
        raise RuntimeError("Missing FIREBASE_SERVICE_ACCOUNT_PATH in .env")
    
    if not firebase_admin._apps:
        cred = credentials.Certificate(path)
        _app = firebase_admin.initalize_app(cred)

    _db = firestore.client()
    return _db