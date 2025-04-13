#!/bin/bash
# list-features.sh

echo "📂 Local feature branches:"
git branch --list 'feature/*'

echo ""
echo "🌐 Remote feature branches:"
git branch -r --list 'origin/feature/*'
