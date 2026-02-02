# api/index.py - Vercel Serverless Function Entry Point
import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
sys.path.insert(0, os.path.abspath(backend_path))

# Import the FastAPI app
from main import app as fastapi_app

# Create a wrapper app that mounts the FastAPI app at /api
from fastapi import FastAPI

app = FastAPI()

# Mount the main app at /api so routes like /api/analyze/accountant work
app.mount("/api", fastapi_app)

# Export for Vercel
__all__ = ['app']
