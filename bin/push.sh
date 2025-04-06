#!/bin/bash

# Check if commit message was provided
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message"
  echo "Usage: ./gitpush.sh \"Your commit message\""
  exit 1
fi

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit"
  exit 0
fi

# Add all changes
git add .

# Commit with provided message
git commit -m "$1"

# Push to remote
git push
