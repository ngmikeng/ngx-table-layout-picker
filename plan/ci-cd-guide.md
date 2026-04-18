# GitHub Actions CI/CD Setup

This directory contains the CI/CD workflows for the ngx-table-layout-picker project.

## Workflows

### ci.yml
Runs on every push and pull request to `main` and `develop` branches.
- Tests on Node.js 20.x
- Builds library and demo
- Archives build artifacts

### deploy.yml
Deploys the demo application to GitHub Pages.
- Runs on push to `main` branch
- Can be triggered manually via workflow_dispatch
- Deploys to: https://ngmikeng.github.io/ngx-table-layout-picker/

### release.yml
Handles automated releases and NPM publishing.
- Triggered on changes to library code in `projects/ngx-table-layout-picker/`
- Uses semantic-release for versioning
- Publishes to NPM (requires NPM_TOKEN secret)
- Creates GitHub releases

### pr-checks.yml
Validates pull requests before merging.
- Runs all checks (build, test)
- Comments on PR when checks pass

### codeql.yml
Security scanning with CodeQL.
- Runs on push to `main`
- Runs on pull requests
- Scheduled weekly scans

## Setup Instructions

### 1. Enable GitHub Pages
1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. The demo will be deployed to: `https://ngmikeng.github.io/ngx-table-layout-picker/`

### 2. Configure NPM Publishing (Optional)
To enable automated NPM publishing:

1. Generate an NPM token:
   ```bash
   npm login
   npm token create
   ```

2. Add the token to GitHub Secrets:
   - Go to repository Settings → Secrets and variables → Actions
   - Add new secret: `NPM_TOKEN`
   - Paste your NPM token

### 3. Configure Semantic Release
The semantic release configuration is in `.releaserc.json` at the workspace root.

Commit message format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test updates
- `chore`: Build/tool changes
- `BREAKING CHANGE`: Major version bump

### 4. Install Commitlint (Optional)
To validate commit messages locally:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

### 5. Enable Dependabot
Dependabot is configured in `.github/dependabot.yml` and will automatically:
- Check for dependency updates weekly
- Create pull requests for updates
- Group Angular packages together

## Manual Deployment

To manually trigger a deployment:
1. Go to Actions tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select branch (usually `main`)
5. Click "Run workflow"

## Monitoring

All workflow runs can be monitored in the Actions tab of the repository.

## Troubleshooting

### Build Failures
- Check Node.js version compatibility
- Ensure all dependencies are installed
- Verify tests pass locally

### Deployment Failures
- Verify GitHub Pages is enabled
- Check workflow permissions
- Ensure base href is correctly set

### NPM Publishing Failures
- Verify NPM_TOKEN secret is set correctly
- Check package version is not already published
- Ensure you have publishing rights to the package

## Badge Status

Add these badges to your README.md:

```markdown
[![CI](https://github.com/ngmikeng/ngx-table-layout-picker/workflows/CI/badge.svg)](https://github.com/ngmikeng/ngx-table-layout-picker/actions)
[![Deploy](https://github.com/ngmikeng/ngx-table-layout-picker/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/ngmikeng/ngx-table-layout-picker/actions)
[![CodeQL](https://github.com/ngmikeng/ngx-table-layout-picker/workflows/CodeQL/badge.svg)](https://github.com/ngmikeng/ngx-table-layout-picker/actions)
```
