#!/bin/bash

# Get number of commits to show (default 10)
count=${1:-10}

# Show formatted git log with date/time
git log --pretty=format:"%h | %ad | %s" --date=local -n $count | awk '{
    printf("%3d | %s\n", NR, $0)
}'
