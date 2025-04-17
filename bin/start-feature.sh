#!/bin/bash

FEATURE=$1

if [ -z "$FEATURE" ]; then
  echo "Usage: $0 <feature-name>"
  exit 1
fi

FEATURE_BRANCH="feature/$FEATURE"

# Save current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Stash uncommitted changes
STASHED=false
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "🔒 Stashing uncommitted changes..."
  git stash push -u -m "temp-stash-before-feature-switch"
  STASHED=true
fi

# Switch to main and update
echo "📦 Switching to main and pulling latest..."
git checkout main && git pull

# Create new feature branch
echo "🌱 Creating new branch $FEATURE_BRANCH..."
git checkout -b "$FEATURE_BRANCH"

# Reapply stashed changes if needed
if $STASHED; then
  echo "🔁 Reapplying stashed changes..."
  git stash pop
fi

echo "✅ Switched to $FEATURE_BRANCH"
