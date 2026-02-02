# Quick Push Guide

## The Problem
GitHub is blocking your push because it detected API keys in documentation files.

## ✅ I've Fixed It
Removed the actual API key from:
- `VERCEL_DEPLOYMENT.md`
- `GITHUB_FIX.md`
- `RUNNING_LOCALLY.md`

## 🚀 Push to GitHub

### Option 1: Run the Script (Easiest)
```bash
cd "/Users/vardaangahlot/Projects/VeritasAI/Prototype 1"
./push-to-github.sh
```

### Option 2: Manual Commands
```bash
cd "/Users/vardaangahlot/Projects/VeritasAI/Prototype 1"
git add VERCEL_DEPLOYMENT.md GITHUB_FIX.md RUNNING_LOCALLY.md
git commit -m "Remove API keys from documentation"
git push
```

## 📋 After Pushing

1. **Vercel will auto-deploy** your full-stack app
2. **Add the environment variable** to Vercel:
   - Go to Settings → Environment Variables
   - Add `GROQ_API_KEY` with your actual key (from `backend/.env`)
   - The key starts with `gsk_`

3. **Test your deployment**:
   - Visit your Vercel URL
   - Upload a PDF
   - Click "DEEP SCAN"
   - All AI agents should work!

## 🔑 Your API Key Location

Your actual API key is safely stored in:
- ✅ `backend/.env` (local only, not in Git)
- ❌ NOT in any documentation files anymore

When you add it to Vercel, copy it from `backend/.env`.
