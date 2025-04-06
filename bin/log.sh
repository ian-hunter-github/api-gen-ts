./gitlogshsh#!/bin/bash

# Get number of commits to show (default 10)
count=${1:-10}

# Show formatted git log
git log --pretty=format:"%h | %s" -n $count | awk '{
    printf("%3d | %s\n", NR, $0)
}'
