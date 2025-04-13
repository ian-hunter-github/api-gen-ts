#!/bin/bash
# abort-feature.sh

# Get branch to delete: argument or current branch
if [ -n "$1" ]; then
  FEATURE_BRANCH="feature/$1"
else
  FEATURE_BRANCH=$(git branch --show-current)
fi

# Check it's a feature branch
if [[ "$FEATURE_BRANCH" != feature/* ]]; then
  echo "❌ '$FEATURE_BRANCH' is not a valid feature branch."
  echo "You must be on or specify a branch like: feature/my-feature"
  exit 1
fi

# Confirm deletion
echo "🗑️ This will delete the feature branch '$FEATURE_BRANCH' locally and remotely (if exists)."
read -p "Are you sure? [y/N] " confirm

if [[ "$confirm" == "y" ]]; then
  # Delete local branch (if it exists)
  if git rev-parse --verify "$FEATURE_BRANCH" >/dev/null 2>&1; then
    git branch -D "$FEATURE_BRANCH"
    echo "✅ Deleted local branch '$FEATURE_BRANCH'"
  else
    echo "⚠️ Local branch '$FEATURE_BRANCH' does not exist."
  fi

  # Check and delete remote branch (if exists)
  if git ls-remote --exit-code --heads origin "$FEATURE_BRANCH" >/dev/null 2>&1; then
    git push origin --delete "$FEATURE_BRANCH"
    echo "✅ Deleted remote branch 'origin/$FEATURE_BRANCH'"
  else
    echo "⚠️ Remote branch 'origin/$FEATURE_BRANCH' does not exist."
  fi
else
  echo "❌ Aborted."
fi
