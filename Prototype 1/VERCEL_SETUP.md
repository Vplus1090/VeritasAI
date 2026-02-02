# VeritasAI - Vercel Deployment Guide

## 🎯 Problem Solved
Git doesn't allow API keys to be committed. We've configured your project to use **environment variables** instead.

## 🚀 How to Deploy to Vercel

### Step 1: Add Environment Variable to Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your **VeritasAI** project
3. Click **Settings** → **Environment Variables**
4. Add this variable:
   ```
   Name:  GROQ_API_KEY
   Value: <your_groq_api_key_from_backend/.env>
   ```
   
   **Note:** Use the API key from your `backend/.env` file (it starts with `gsk_`)
5. Select **All Environments** (Production, Preview, Development)
6. Click **Save**

### Step 2: Push Your Code to Git

Now you can safely push to Git without exposing your API key:

```bash
cd "/Users/vardaangahlot/Projects/VeritasAI/Prototype 1"
git add .
git commit -m "Configure environment variables for API keys"
git push
```

### Step 3: Vercel Auto-Deploy

Vercel will automatically:
- Detect your push
- Build your project
- Inject the `GROQ_API_KEY` environment variable
- Deploy successfully ✅

## 📁 What Changed

### Backend Changes
- ✅ `backend/main.py` - Now loads API key from `os.getenv("GROQ_API_KEY")`
- ✅ `backend/requirements.txt` - Added `python-dotenv` dependency
- ✅ `backend/.env` - Local development file (ignored by Git)
- ✅ `backend/.env.example` - Template for team members

### Project Configuration
- ✅ `.gitignore` - Prevents `.env` files from being committed
- ✅ API key removed from source code

## 🔒 Security Benefits

| Before | After |
|--------|-------|
| ❌ API key hardcoded in `main.py` | ✅ API key in environment variables |
| ❌ Key visible in Git history | ✅ Key never committed to Git |
| ❌ Key exposed if repo is public | ✅ Key stored securely in Vercel |

## 🧪 Testing Locally

To run the backend locally:

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# The .env file is already configured
# Start the server
uvicorn main:app --reload
```

The backend will automatically load the API key from `backend/.env`.

## 📝 For Team Members

If someone else clones this repo, they should:

1. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Add their own API key to `.env`:
   ```bash
   GROQ_API_KEY=their_actual_api_key_here
   ```

## ⚠️ Important Notes

- **Never commit `.env` files** - They're in `.gitignore`
- **Only commit `.env.example`** - With placeholder values
- **Vercel reads from Environment Variables** - Not from `.env` files
- **Each environment can have different keys** - Production vs Preview

## 🎉 You're Done!

Your API key is now secure and your Vercel deployment will work! Just:
1. Add the environment variable to Vercel (Step 1)
2. Push your code (Step 2)
3. Watch it deploy automatically (Step 3)
