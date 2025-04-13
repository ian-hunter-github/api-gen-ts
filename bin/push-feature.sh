#!/bin/bash
# push-feature.sh

BRANCH=$(git branch --show-current)
PARENT_BRANCH="main"  # You can change this if you use 'develop' etc.
COMPLETE=false
COMMIT_MSG=""

# Parse arguments
for arg in "$@"; do
  case $arg in
    -c|--complete)
      COMPLETE=true
      shift
      ;;
    *)
      COMMIT_MSG="$COMMIT_MSG $arg"
      ;;
  esac
done

COMMIT_MSG=$(echo "$COMMIT_MSG" | sed 's/^ *//') # trim leading spaces

# Default message fallback
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="$BRANCH"
else
  COMMIT_MSG="$BRANCH: $COMMIT_MSG"
fi

# Commit and push
git add .
git commit -m "$COMMIT_MSG"
git push -u origin "$BRANCH"

echo "✔️  Committed and pushed '$BRANCH' with message: '$COMMIT_MSG'"

# If --complete is set, merge and clean up
if $COMPLETE; then
  echo "🔁 Completing feature: merging into $PARENT_BRANCH..."

  git checkout "$PARENT_BRANCH" || exit 1
  git pull origin "$PARENT_BRANCH"
  git merge --no-ff "$BRANCH" -m "Merge $BRANCH"
  git push origin "$PARENT_BRANCH"

  git branch -d "$BRANCH"
  git push origin --delete "$BRANCH"

  echo "✅ Feature branch '$BRANCH' merged and cleaned up. Now on '$PARENT_BRANCH'."
fi
