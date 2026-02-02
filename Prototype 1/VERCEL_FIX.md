# 🔧 VeritasAI - Vercel Deployment Fix

## Problem
Your AI stopped working on Vercel because the `GROQ_API_KEY` environment variable is not set.

## Root Cause
- Vercel deployments need environment variables to be configured in the dashboard
- Your `.env` file is only for local development (not deployed to Vercel)
- The `vercel.json` was referencing a non-existent secret `@groq_api_key`

## ✅ Solution: Add Environment Variable to Vercel

### Step 1: Add the API Key to Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your VeritasAI project**
3. Click **Settings** (top navigation bar)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New** button
6. Enter the following:
   ```
   Key:   GROQ_API_KEY
   Value: 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
   ```
7. **Select ALL environments**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
8. Click **Save**

### Step 2: Redeploy Your Application

1. Go to the **Deployments** tab
2. Find your latest deployment
3. Click the **three dots (⋯)** menu on the right
4. Click **Redeploy**
5. Wait for deployment to complete (~2-3 minutes)

### Step 3: Test Your Application

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Upload a PDF file
3. Click "deep scan"
4. Verify that all agents complete successfully ✅

## 🎉 That's It!

Your AI should now work perfectly on Vercel.

---

## 📝 What Changed Locally

I've cleaned up your `vercel.json` file to remove the broken secret reference. You can now commit and push these changes:

```bash
git add vercel.json
git commit -m "Fix: Remove broken Vercel secret reference"
git push
```

This will trigger a new deployment, but **make sure you've added the environment variable first** (Step 1 above).

---

## 🔒 Security Note

Your API key is now stored securely in Vercel's environment variables and will never be exposed in:
- Git commits
- Public repositories
- Client-side code
- Build logs

---

## 🐛 Troubleshooting

### If the AI still doesn't work after redeploying:

1. **Check the environment variable is set**:
   - Go to Settings → Environment Variables
   - Verify `GROQ_API_KEY` exists for all environments

2. **Check deployment logs**:
   - Go to Deployments → Click on latest deployment
   - Click "View Function Logs"
   - Look for errors like "GROQ_API_KEY environment variable is not set"

3. **Verify the API key is valid**:
   - Go to https://console.groq.com/keys
   - Check if your API key is still active
   - Generate a new one if needed and update Vercel

4. **Force a fresh deployment**:
   - Make a small change to any file (e.g., add a comment)
   - Commit and push to trigger a new build

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [Groq API Documentation](https://console.groq.com/docs)
