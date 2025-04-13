# 🛠️ Git Feature Branch Workflow (Solo Dev)

This document describes a lightweight Git feature branching workflow using shell scripts — perfect for solo development where you want clean separation of features and an easy way to manage them.

---

## 📁 Available Scripts

### 1. `start-feature.sh <feature-name>`
Creates and checks out a new feature branch from `main`.

**Example:**
```bash
./start-feature.sh login-form
```
Creates and switches to `feature/login-form`.

---

### 2. `push-feature.sh [<commit-message>] [-c|--complete]`
Stages, commits, and pushes your work to the current feature branch.  
If `-c` or `--complete` is passed, it will:
- Merge the feature branch back into `main`
- Delete the local and remote feature branch
- Leave you on `main`

**Examples:**
```bash
./push-feature.sh "Initial form layout"
# Commits with message: "feature/login-form: Initial form layout"

./push-feature.sh -c "Finish form validation"
# Commits, pushes, merges to main, deletes feature branch
```

If no message is provided, the branch name is used as the commit message.

---

### 3. `abort-feature.sh [<feature-name>]`
Deletes a feature branch both locally and remotely.

- If no name is provided, uses the current branch
- You can run it from any branch if you provide the feature name

**Examples:**
```bash
./abort-feature.sh
# Deletes the current branch if it's a feature branch

./abort-feature.sh search-bar
# Deletes feature/search-bar from local and remote
```

Handles missing local or remote branches gracefully.

---

### 4. `list-features.sh`
Lists all local and remote feature branches.

**Example:**
```bash
./list-features.sh
```

Output:
```
📂 Local feature branches:
  feature/login-form
  feature/search-bar

🌐 Remote feature branches:
  origin/feature/login-form
  origin/feature/search-bar
```

---

### 5. `switch-feature.sh [<feature-name>]`
Switches to an existing local feature branch.

- If a name is provided, it switches to `feature/<name>`
- If no name is provided, you can select one interactively (via `fzf` or simple prompt)

**Examples:**
```bash
./switch-feature.sh search-bar
# → switches to feature/search-bar

./switch-feature.sh
# → interactively lists feature branches for selection
```

---

## 🔀 Typical Workflow

### ✅ Start a Feature
```bash
./start-feature.sh search-bar
```

### 📂 Save Work
```bash
./push-feature.sh "Add input and debounce"
```

### 🚀 Complete the Feature
```bash
./push-feature.sh -c "Finalize styling and tests"
```
> Now you're back on `main` and the feature branch is gone.

### ❌ Abort a Feature
```bash
./abort-feature.sh buggy-idea
```

### 📋 List In-Progress Features
```bash
./list-features.sh
```

### 🔄 Switch Between Features
```bash
./switch-feature.sh
# or
./switch-feature.sh login-form
```

---

## ✅ Benefits
- Consistent naming and isolation of features
- Easy cleanup after merge
- Clear history of what each feature branch did
- Flexible: works solo, no GitFlow complexity

---

## 🔧 Tip: Make These Scripts Executable
```bash
chmod +x *.sh
```

You can also move them to a `bin/` directory and add that to your PATH.

---

