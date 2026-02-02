# Deploying VeritasAI to Vercel (Full Stack)

## 🎯 What Changed

I've configured your project to deploy **both frontend AND backend** to Vercel as a full-stack application.

### Changes Made:

1. ✅ **Created `/api` directory** - Vercel Serverless Functions for Python backend
2. ✅ **Updated `vercel.json`** - Configured routing for API and frontend
3. ✅ **Updated frontend** - API calls now use `/api` in production, `localhost:8000` in development
4. ✅ **Added `api/requirements.txt`** - Python dependencies for Vercel

## 🚀 Deployment Steps

### Step 1: Add Environment Variable to Vercel

1. Go to https://vercel.com/dashboard
2. Select your **VeritasAI** project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:
   ```
   Name:  GROQ_API_KEY
   Value: <your_groq_api_key_here>
   ```
   **Note:** Use your actual Groq API key (starts with `gsk_`)
5. Select **All Environments** (Production, Preview, Development)
6. Click **Save**

### Step 2: Push to GitHub

```bash
cd "/Users/vardaangahlot/Projects/VeritasAI/Prototype 1"
git add .
git commit -m "Configure full-stack Vercel deployment with Python backend"
git push
```

### Step 3: Vercel Auto-Deploy

Vercel will automatically:
- ✅ Build the React frontend
- ✅ Deploy Python backend as serverless functions
- ✅ Route `/api/*` requests to the backend
- ✅ Serve frontend from root `/`

## 📁 Project Structure

```
Prototype 1/
├── api/                    # Vercel Serverless Functions (NEW)
│   ├── index.py           # Entry point that imports backend/main.py
│   └── requirements.txt   # Python dependencies
├── backend/               # Original FastAPI code
│   ├── main.py           # FastAPI app (unchanged)
│   ├── .env              # Local development only (not deployed)
│   └── requirements.txt  # Local development
├── frontend/             # React app
│   ├── src/
│   │   └── App.jsx      # Updated to use /api in production
│   └── package.json
└── vercel.json          # Vercel configuration (NEW)
```

## 🔄 How It Works

### Development (Local)
- Frontend: `http://localhost:5173`
- Backend: `http://127.0.0.1:8000`
- API calls go to `http://127.0.0.1:8000/analyze/*`

### Production (Vercel)
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.vercel.app/api/*`
- API calls go to `/api/analyze/*` (same domain)

The frontend automatically detects the environment:
```javascript
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000'
```

## 🧪 Testing After Deployment

1. Visit your Vercel URL
2. Upload a PDF
3. Click "DEEP SCAN"
4. All AI agents should work!

## ⚠️ Important Notes

### API Routes
Vercel will route all `/api/*` requests to your Python backend:
- `/api/analyze/accountant` → `backend/main.py` accountant endpoint
- `/api/analyze/legal` → `backend/main.py` legal endpoint
- `/api/analyze/skeptic` → `backend/main.py` skeptic endpoint
- `/api/analyze/bloodhound` → `backend/main.py` bloodhound endpoint
- `/api/analyze/justice` → `backend/main.py` justice endpoint

### Environment Variables
- **Local**: Uses `backend/.env` file
- **Vercel**: Uses Vercel Environment Variables dashboard

### Cold Starts
Serverless functions may have a ~1-2 second delay on first request (cold start). Subsequent requests are fast.

## 🐛 Troubleshooting

### If API calls fail on Vercel:

1. **Check Vercel Logs**:
   - Go to your project → Deployments → Click latest deployment
   - Check "Functions" tab for errors

2. **Verify Environment Variable**:
   - Settings → Environment Variables
   - Make sure `GROQ_API_KEY` is set

3. **Check Build Logs**:
   - Look for Python dependency installation errors
   - Ensure all packages in `api/requirements.txt` installed successfully

### If you see CORS errors:

The backend already has CORS enabled for all origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    ...
)
```

## 🎉 You're Done!

Once you push to GitHub and add the environment variable, your full-stack app will be live on Vercel!

**Next deployment**: Just `git push` and Vercel auto-deploys everything.
