# Library Setup & Configuration

## Angular Workspace Creation

### Initial Setup Commands

```bash
# Create new Angular workspace
ng new ngx-table-layout-picker --create-application=false --package-manager=npm

cd ngx-table-layout-picker

# Generate library
ng generate library ngx-table-layout-picker --prefix=ngx

# Generate demo application
ng generate application demo --routing --style=scss

# Install dependencies
npm install @angular/material @angular/cdk
npm install --save-dev @angular-devkit/build-angular
```

---

## Project Structure

### Workspace Configuration

```json
// angular.json
{
  "$schema": "./node_modules/@angular/cdk/schematics/collection.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "ngx-table-layout-picker": {
      "projectType": "library",
      "root": "projects/ngx-table-layout-picker",
      "sourceRoot": "projects/ngx-table-layout-picker/src",
      "prefix": "ngx",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "projects/ngx-table-layout-picker/ng-package.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "projects/ngx-table-layout-picker/tsconfig.lib.prod.json"
            },
            "development": {
              "tsConfig": "projects/ngx-table-layout-picker/tsconfig.lib.json"
            }
          },
          "defaultConfiguration": "production"
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "tsConfig": "projects/ngx-table-layout-picker/tsconfig.spec.json",
            "polyfills": ["zone.js", "zone.js/testing"]
          }
        }
      }
    },
    "demo": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss",
          "standalone": true
        }
      },
      "root": "projects/demo",
      "sourceRoot": "projects/demo/src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/demo",
            "index": "projects/demo/src/index.html",
            "browser": "projects/demo/src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "projects/demo/tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "projects/demo/src/favicon.ico",
              "projects/demo/src/assets"
            ],
            "styles": [
              "@angular/material/prebuilt-themes/indigo-pink.css",
              "projects/demo/src/styles.scss"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                }
              ],
              "outputHashing": "all",
              "baseHref": "/ngx-table-layout-picker/"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "demo:build:production"
            },
            "development": {
              "buildTarget": "demo:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
```

---

## Library Package Configuration

### ng-package.json

```json
// projects/ngx-table-layout-picker/ng-package.json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/ngx-table-layout-picker",
  "lib": {
    "entryFile": "src/public-api.ts",
    "umdModuleIds": {
      "@angular/cdk": "ng.cdk",
      "@angular/material": "ng.material"
    }
  },
  "allowedNonPeerDependencies": [],
  "whitelistedNonPeerDependencies": []
}
```

### package.json (Library)

```json
// projects/ngx-table-layout-picker/package.json
{
  "name": "@your-org/ngx-table-layout-picker",
  "version": "1.0.0",
  "description": "Angular table layout picker component for rich text editors",
  "keywords": [
    "angular",
    "table",
    "layout",
    "selector",
    "component",
    "ui"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/ngx-table-layout-picker.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/ngx-table-layout-picker/issues"
  },
  "homepage": "https://github.com/your-username/ngx-table-layout-picker#readme",
  "peerDependencies": {
    "@angular/common": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/cdk": "^20.0.0",
    "@angular/material": "^20.0.0"
  },
  "dependencies": {
    "tslib": "^2.3.0"
  },
  "sideEffects": false
}
```

---

## TypeScript Configuration

### tsconfig.json (Root)

```json
// tsconfig.json
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
    ],
    "paths": {
      "@your-org/ngx-table-layout-picker": [
        "dist/ngx-table-layout-picker"
      ]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

### tsconfig.lib.json

```json
// projects/ngx-table-layout-picker/tsconfig.lib.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/lib",
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "types": []
  },
  "exclude": [
    "**/*.spec.ts",
    "src/test-setup.ts"
  ]
}
```

### tsconfig.spec.json

```json
// projects/ngx-table-layout-picker/tsconfig.spec.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/spec",
    "types": [
      "jasmine"
    ]
  },
  "include": [
    "**/*.spec.ts",
    "**/*.d.ts"
  ]
}
```

---

## Public API Definition

### public-api.ts

```typescript
// projects/ngx-table-layout-picker/src/public-api.ts

/*
 * Public API Surface of ngx-table-layout-picker
 */

// Components
export * from './lib/components/ngx-table-layout-picker/ngx-table-layout-picker.component';
export * from './lib/components/ngx-table-layout-picker-dropdown/ngx-table-layout-picker-dropdown.component';

// Models
export * from './lib/models/table-cell.model';
export * from './lib/models/table-selection.model';
export * from './lib/models/grid-dimensions.model';
export * from './lib/models/table-layout-config.model';
export * from './lib/models/theme.model';

// Services
export * from './lib/services/table-layout.service';
export * from './lib/services/theme.service';
export * from './lib/services/responsive.service';

// Constants
export * from './lib/constants/responsive.constants';
export * from './lib/constants/theme.constants';

// Directives (if any)
// export * from './lib/directives/...';

// Utilities (if any)
// export * from './lib/utils/...';
```

---

## Build Scripts

### package.json (Root)

```json
{
  "name": "ngx-table-layout-picker",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve demo",
    "build": "ng build ngx-table-layout-picker",
    "build:demo": "ng build demo --configuration production",
    "watch": "ng build ngx-table-layout-picker --watch --configuration development",
    "test": "ng test ngx-table-layout-picker",
    "test:coverage": "ng test ngx-table-layout-picker --code-coverage",
    "test:ci": "ng test ngx-table-layout-picker --watch=false --browsers=ChromeHeadless --code-coverage",
    "lint": "ng lint",
    "format": "prettier --write \"**/*.{ts,html,scss,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,html,scss,json,md}\"",
    "pack": "cd dist/ngx-table-layout-picker && npm pack",
    "publish:lib": "npm publish dist/ngx-table-layout-picker --access public"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/cdk": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/compiler": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "@angular/material": "^20.0.0",
    "@angular/platform-browser": "^20.0.0",
    "@angular/platform-browser-dynamic": "^20.0.0",
    "@angular/router": "^20.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^20.0.0",
    "@angular/cli": "^20.0.0",
    "@angular/compiler-cli": "^20.0.0",
    "@types/jasmine": "~5.1.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "ng-packagr": "^20.0.0",
    "prettier": "^3.0.0",
    "typescript": "~5.2.2"
  }
}
```

---

## ESLint Configuration

### .eslintrc.json

```json
{
  "root": true,
  "ignorePatterns": [
    "projects/**/*"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "ngx",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "ngx",
            "style": "kebab-case"
          }
        ],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off"
      }
    },
    {
      "files": [
        "*.html"
      ],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility"
      ],
      "rules": {}
    }
  ]
}
```

---

## Prettier Configuration

### .prettierrc

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

### .prettierignore

```
dist
node_modules
coverage
.angular
*.md
package-lock.json
```

---

## Git Configuration

### .gitignore

```
# See http://help.github.com/ignore-files/ for more about ignoring files.

# Compiled output
/dist
/tmp
/out-tsc
/bazel-out

# Node
/node_modules
npm-debug.log
yarn-error.log

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings

# System files
.DS_Store
Thumbs.db

# Build artifacts
*.tgz
/dist/ngx-table-layout-picker/*.tgz
```

---

## README Files

### Library README.md

```markdown
# @your-org/ngx-table-layout-picker

Angular table layout picker component for rich text editors and content management systems.

## Features

- 🎨 Dark & Light theme support
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ WCAG AA accessible
- ⌨️ Keyboard navigation
- 👆 Touch-friendly
- 🎯 Inline or dropdown modes
- 🎭 Material Design integration
- 📦 Tree-shakeable
- 🧪 Fully tested

## Installation

```bash
npm install @your-org/ngx-table-layout-picker
```

## Peer Dependencies

```bash
npm install @angular/common @angular/core @angular/cdk @angular/material
```

## Usage

### Inline Mode

```typescript
import { NgxTableLayoutPickerComponent } from '@your-org/ngx-table-layout-picker';

@Component({
  standalone: true,
  imports: [NgxTableLayoutPickerComponent],
  template: `
    <ngx-table-layout-picker
      [rows]="10"
      [cols]="10"
      (selectionChange)="onSelect($event)">
    </ngx-table-layout-picker>
  `
})
export class MyComponent {
  onSelect(selection: TableSelection) {
    console.log(selection);
  }
}
```

### Dropdown Mode

```typescript
import { NgxTableLayoutPickerDropdownComponent } from '@your-org/ngx-table-layout-picker';

@Component({
  standalone: true,
  imports: [NgxTableLayoutPickerDropdownComponent],
  template: `
    <ngx-table-layout-picker-dropdown
      buttonLabel="Insert Table"
      (tableSelected)="onSelect($event)">
    </ngx-table-layout-picker-dropdown>
  `
})
export class MyComponent { }
```

## Documentation

Full documentation available at: [GitHub Pages URL]

## License

MIT
```

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server for demo
npm start

# Build library in watch mode
npm run watch

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
# Build library
npm run build

# Build demo
npm run build:demo

# Create package tarball
npm run pack
```

### Publishing

```bash
# Build library
npm run build

# Publish to npm
npm run publish:lib
```

---

## Best Practices Implemented

1. **Strict TypeScript**: Enabled strict mode for type safety
2. **Standalone Components**: Using Angular 20+ standalone APIs
3. **Tree-shakeable**: Proper module exports for tree-shaking
4. **Semantic Versioning**: Following semver for releases
5. **Code Quality**: ESLint + Prettier configured
6. **Testing**: Comprehensive test coverage
7. **Documentation**: Inline JSDoc + README files
8. **Accessibility**: ARIA attributes and keyboard support
9. **Performance**: OnPush change detection, optimized rendering
10. **Maintainability**: Clear project structure and naming conventions
