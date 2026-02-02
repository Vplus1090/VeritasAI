# Running VeritasAI Locally

## ✅ Backend is Now Running!

Your backend server is running at: **http://127.0.0.1:8000**

## 🚀 How to Use

### 1. Keep Backend Running (Current Terminal)
The backend is running in the background. You can check its status anytime.

To stop it later:
```bash
# Press Ctrl+C in the terminal where it's running
```

### 2. Start Frontend (New Terminal)
Open a **new terminal** and run:

```bash
cd "/Users/vardaangahlot/Projects/VeritasAI/Prototype 1/frontend"
npm run dev
```

Then open the URL shown (usually `http://localhost:5173`)

### 3. Test the AI Agents

1. Upload a PDF file
2. Click "DEEP SCAN" to run all agents
3. Or click individual agent tabs and use "RE-ANALYZE"

## 🔧 Troubleshooting

### If Backend Stops Working

Restart it with:
```bash
cd "/Users/vardaangahlot/Projects/VeritasAI/Prototype 1/backend"
export GROQ_API_KEY=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
python3 -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### If You See "Connection Failed"

1. Make sure backend is running (check terminal)
2. Verify URL is `http://127.0.0.1:8000` (not localhost)
3. Check if port 8000 is already in use

### API Documentation

Visit: http://127.0.0.1:8000/docs to see all available endpoints

## 📝 What Was Fixed

1. ✅ **Vite chunk size warning** - Increased limit in `vite.config.js`
2. ✅ **Backend server** - Now running with environment variable
3. ✅ **API key** - Loaded from environment (not hardcoded)

## 🌐 For Vercel Deployment

The local setup uses `http://127.0.0.1:8000`, but for Vercel you'll need to:

1. Deploy your backend separately (e.g., on Vercel, Railway, or Render)
2. Update the frontend API URLs to point to your deployed backend
3. Add `GROQ_API_KEY` to your backend's environment variables

Would you like help setting up the backend for Vercel deployment?
