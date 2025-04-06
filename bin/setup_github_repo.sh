#!/bin/bash

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first."
    echo "Installation instructions: https://cli.github.com/manual/installation"
    exit 1
fi

# Check if already in a git repo
if [ ! -d .git ]; then
    echo "Initialising local GIT"
    git init
fi

# Initialize local Git repo
git add .
git commit -m "Initial commit"

# Create GitHub repo
echo "Creating GitHub repository..."
repo_name=$(basename "$PWD")
gh repo create "$repo_name" --public --source=. --remote=origin

# Push to GitHub
git push -u origin main

echo "Successfully created and connected to GitHub repository:"
gh repo view --web
