#!/bin/bash
# switch-feature.sh — Switch to a feature branch by name or interactively

FEATURE_BRANCH=""

if [ -n "$1" ]; then
  # Use provided feature name
  FEATURE_BRANCH="feature/$1"
else
  # Interactive selection
  if command -v fzf > /dev/null; then
    FEATURE_BRANCH=$(git branch --list 'feature/*' | sed 's/^..//' | fzf)
  else
    echo "Select a feature branch:"
    select choice in $(git branch --list 'feature/*' | sed 's/^..//'); do
      FEATURE_BRANCH=$choice
      break
    done
  fi
fi

if [ -z "$FEATURE_BRANCH" ]; then
  echo "❌ No feature branch selected or provided."
  exit 1
fi

# Switch to the selected branch if it exists
if git rev-parse --verify "$FEATURE_BRANCH" >/dev/null 2>&1; then
  git checkout "$FEATURE_BRANCH"
  echo "✅ Switched to '$FEATURE_BRANCH'"
else
  echo "❌ Feature branch '$FEATURE_BRANCH' does not exist."
  exit 1
fi
