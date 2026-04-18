# CI/CD & Deployment Strategy

## Overview

### Goals
- ✅ Automated testing on every push
- ✅ Automated deployment to GitHub Pages
- ✅ Semantic versioning and releases
- ✅ NPM package publishing
- ✅ Code quality checks
- ✅ Build validation

### Tools
- **GitHub Actions**: CI/CD automation
- **GitHub Pages**: Demo hosting
- **NPM**: Package registry
- **Semantic Release**: Automated versioning

---

## GitHub Actions Workflows

### Workflow Files Structure

```
.github/
└── workflows/
    ├── ci.yml              # Continuous Integration
    ├── deploy.yml          # Deploy to GitHub Pages
    ├── release.yml         # Release & Publish to NPM
    └── pr-checks.yml       # Pull Request validation
```

---

## CI Workflow

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [20.x]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Format check
        run: npm run format:check
      
      - name: Build library
        run: npm run build
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/ngx-table-layout-picker/lcov.info
          flags: unittests
          name: codecov-umbrella
      
      - name: Build demo
        run: npm run build:demo
      
      - name: Archive build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist-${{ matrix.node-version }}
          path: dist/
          retention-days: 7

  lint:
    name: Lint & Format
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  build:
    name: Build Check
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npm run build:demo
      
      - name: Check bundle size
        run: |
          ls -lh dist/ngx-table-layout-picker
          size=$(du -sh dist/ngx-table-layout-picker | cut -f1)
          echo "Bundle size: $size"
```

---

## Deployment Workflow

### .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    name: Build Demo
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build library
        run: npm run build
      
      - name: Build demo
        run: npm run build:demo
        env:
          NODE_ENV: production
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist/demo/browser'

  deploy:
    name: Deploy to Pages
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v3
      
      - name: Add deployment comment
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.sha,
              environment: 'production',
              description: 'Deployed to GitHub Pages'
            })
```

---

## Release Workflow

### .github/workflows/release.yml

```yaml
name: Release

on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - 'projects/ngx-table-layout-picker/**'

jobs:
  release:
    name: Release & Publish
    runs-on: ubuntu-latest
    
    permissions:
      contents: write
      packages: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build library
        run: npm run build
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Semantic Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
      
      - name: Publish to NPM
        if: success()
        run: |
          cd dist/ngx-table-layout-picker
          npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Create GitHub Release
        if: success()
        uses: softprops/action-gh-release@v1
        with:
          files: |
            dist/ngx-table-layout-picker/*.tgz
          generate_release_notes: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Pull Request Checks

### .github/workflows/pr-checks.yml

```yaml
name: PR Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  pr-validation:
    name: Validate PR
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate commit messages
        run: |
          npx commitlint --from ${{ github.event.pull_request.base.sha }} \
                        --to ${{ github.event.pull_request.head.sha }}
      
      - name: Check for breaking changes
        run: |
          echo "Checking for breaking changes..."
          # Add custom breaking change detection logic
      
      - name: Run all checks
        run: |
          npm run lint
          npm run test:ci
          npm run build
          npm run build:demo
      
      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ All checks passed! Ready for review.'
            })
```

---

## Semantic Release Configuration

### .releaserc.json

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/npm",
      {
        "pkgRoot": "dist/ngx-table-layout-picker"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}
```

### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test updates
- `chore`: Build/tool changes
- `BREAKING CHANGE`: Breaking change (major version bump)

**Examples**:
```bash
feat(selector): add keyboard navigation support
fix(dropdown): correct menu positioning on mobile
docs(readme): update installation instructions
BREAKING CHANGE: remove deprecated cellBorderColor option
```

---

## Commitlint Configuration

### .commitlintrc.json

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "revert"
      ]
    ],
    "subject-case": [2, "never", ["pascal-case", "upper-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 72]
  }
}
```

---

## Husky Git Hooks

### .husky/pre-commit

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged

# Run tests
npm run test:ci
```

### .husky/commit-msg

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate commit message
npx --no -- commitlint --edit $1
```

### package.json lint-staged config

```json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{html,scss,json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## GitHub Pages Configuration

### Environment Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Branch: Deploy from GitHub Actions

2. **Configure Base HREF**:
   ```json
   // angular.json
   {
     "configurations": {
       "production": {
         "baseHref": "/ngx-table-layout-picker/"
       }
     }
   }
   ```

3. **Add 404.html** for SPA routing:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <title>Table Layout Selection</title>
     <script>
       sessionStorage.redirect = location.href;
     </script>
     <meta http-equiv="refresh" content="0;URL='/ngx-table-layout-picker'">
   </head>
   <body></body>
   </html>
   ```

---

## NPM Publishing Setup

### NPM Token Setup

1. **Generate NPM token**:
   ```bash
   npm login
   npm token create
   ```

2. **Add to GitHub Secrets**:
   - Go to repository Settings → Secrets and variables → Actions
   - Add secret: `NPM_TOKEN`

3. **Configure .npmrc** (in library):
   ```
   //registry.npmjs.org/:_authToken=${NPM_TOKEN}
   ```

### Publishing Strategy

- **Automated**: Via GitHub Actions on main branch push
- **Manual**: `npm run publish:lib`
- **Beta**: Tag as `@beta` for pre-releases

---

## Status Badges

### README Badges

```markdown
# NgxTableLayoutPicker

[![CI](https://github.com/your-username/ngx-table-layout-picker/workflows/CI/badge.svg)](https://github.com/your-username/ngx-table-layout-picker/actions)
[![codecov](https://codecov.io/gh/your-username/ngx-table-layout-picker/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/ngx-table-layout-picker)
[![npm version](https://badge.fury.io/js/%40your-org%2Fngx-table-layout-picker.svg)](https://www.npmjs.com/package/@your-org/ngx-table-layout-picker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

---

## Monitoring & Notifications

### Slack Notifications (Optional)

```yaml
# Add to workflow
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Build ${{ job.status }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

### Email Notifications

Configure in GitHub repository settings:
- Settings → Notifications
- Enable email notifications for:
  - Failed workflows
  - Successful deployments

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Lint checks passing
- [ ] Code coverage meets threshold (80%)
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped (semantic-release handles this)

### Post-Deployment
- [ ] Verify GitHub Pages deployment
- [ ] Check NPM package published
- [ ] Test npm install in fresh project
- [ ] Verify demo app functionality
- [ ] Update documentation links
- [ ] Announce release (if major)

---

## Rollback Procedure

### Rollback GitHub Pages

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

### Rollback NPM Package

```bash
# Deprecate version
npm deprecate @your-org/ngx-table-layout-picker@1.2.3 "Use version 1.2.2 instead"

# Or unpublish (within 72 hours)
npm unpublish @your-org/ngx-table-layout-picker@1.2.3
```

---

## Performance Monitoring

### Lighthouse CI

```yaml
# Add to deploy workflow
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      https://your-username.github.io/ngx-table-layout-picker/
    uploadArtifacts: true
    temporaryPublicStorage: true
```

### Bundle Size Check

```yaml
- name: Check bundle size
  uses: andresz1/size-limit-action@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

---

## Security Scanning

### Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-username"
    labels:
      - "dependencies"
```

### CodeQL Analysis

```yaml
# .github/workflows/codeql.yml
name: CodeQL

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, typescript
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

---

## Documentation Deployment

### Auto-generate API docs

```bash
# Install typedoc
npm install --save-dev typedoc

# Generate docs
npx typedoc --out docs projects/ngx-table-layout-picker/src/public-api.ts

# Deploy docs to gh-pages branch
npm run deploy:docs
```

### Storybook Deployment (Optional)

```yaml
# .github/workflows/storybook.yml
- name: Build Storybook
  run: npm run build-storybook

- name: Deploy to Chromatic
  uses: chromaui/action@v1
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```
