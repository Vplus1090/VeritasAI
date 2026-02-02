# api/index.py - Vercel Serverless Function Entry Point
import sys
import os

# Add backend directory to Python path so we can import main.py
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

# Import the FastAPI app from backend/main.py
from main import app

# Vercel will automatically wrap this FastAPI app with its ASGI handler
# The app variable is what Vercel looks for
