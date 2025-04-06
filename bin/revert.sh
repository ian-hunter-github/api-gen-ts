#!/bin/bash

# Interactive mode
if [[ "$1" == "-i" || "$1" == "--interactive" ]]; then
    # Show commit history
    echo "Recent commits:"
    ./gitlog.sh 15
    
    # Get user selection
    read -p "Enter commit number to revert to: " commit_num
    
    # Get commit hash
    commit_hash=$(git log --pretty=format:"%h" -n 15 | sed -n "${commit_num}p")
    
    if [ -z "$commit_hash" ]; then
        echo "Invalid commit number"
        exit 1
    fi
    
    # Reset to selected commit
    git reset --hard $commit_hash
    exit 0
fi

# Default behavior - reset to remote
git fetch origin
git reset --hard origin/$(git branch --show-current)
git clean -fd
