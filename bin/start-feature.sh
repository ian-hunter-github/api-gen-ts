#!/bin/bash
# start-feature.sh

if [ -z "$1" ]; then
  echo "Usage: $0 feature-name"
  exit 1
fi

FEATURE="feature/$1"

# Create and switch to new branch
git checkout -b "$FEATURE"

echo "Switched to new branch: $FEATURE"
