#!/bin/bash

# Quick fix script for pushing to GitHub

cd "/Users/vardaangahlot/Projects/VeritasAI/Prototype 1"

echo "📝 Staging changes..."
git add VERCEL_DEPLOYMENT.md GITHUB_FIX.md RUNNING_LOCALLY.md

echo "💾 Committing..."
git commit -m "Remove API keys from documentation"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Done! Check Vercel for automatic deployment."
