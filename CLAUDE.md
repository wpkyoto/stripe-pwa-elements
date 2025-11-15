# CLAUDE.md - AI Assistant Guide for stripe-pwa-elements

This document provides comprehensive guidance for AI assistants working with the stripe-pwa-elements codebase.

## Project Overview

**stripe-pwa-elements** is a web component library that provides Stripe payment elements for Progressive Web Apps. It uses Stencil.js (version 4.30.0+) to build framework-agnostic web components that can be used across any web platform.

- **Repository**: https://github.com/wpkyoto/stripe-pwa-elements
- **License**: MIT
- **Version**: 3.0.0-0
- **Main Technology**: Stencil.js 4.x (web components framework)
- **Primary Dependencies**: @stripe/stripe-js, i18next for internationalization

## Repository Structure

```
stripe-pwa-elements/
├── .github/                    # GitHub configuration
│   ├── workflows/
│   │   └── ci.yml             # CI/CD pipeline (runs tests and build)
│   ├── CODE_OF_CONDUCT.md
│   └── CONTRIBUTING.md         # Contribution guidelines with commit conventions
├── example/                    # Example HTML files demonstrating usage
│   ├── index.html
│   └── example2.html
├── src/                        # Source code
│   ├── components/            # Web components
│   │   ├── stripe-element-modal/          # Modal wrapper component
│   │   ├── stripe-payment-sheet/          # Main payment sheet component
│   │   │   ├── store/                     # Stencil store for state management
│   │   │   ├── stripe-payment-sheet.tsx
│   │   │   ├── stripe-payment-sheet.scss
│   │   │   ├── readme.md                  # Auto-generated component docs
│   │   │   └── test/                      # Component tests
│   │   ├── stripe-payment-sheet-modal/    # Combined payment sheet with modal
│   │   └── stripe-payment-request-button/ # Payment Request API button (Beta)
│   ├── utils/                 # Utility functions
│   │   ├── error.ts          # Error handling utilities
│   │   ├── i18n.ts           # Internationalization setup
│   │   ├── platform.ts       # Platform detection utilities
│   │   └── utils.ts          # General utilities
│   ├── style/                 # Global styles
│   │   ├── rest.scss         # CSS reset styles
│   │   └── theme.scss        # Theme variables
│   ├── components.d.ts        # Generated TypeScript definitions
│   ├── index.ts              # Entry point
│   ├── index.html            # Development/demo page
│   └── interfaces.ts         # TypeScript interfaces and types
├── stencil.config.ts          # Stencil build configuration
├── tsconfig.json              # TypeScript configuration
├── .eslintrc.json            # ESLint configuration
├── .prettierrc.json          # Prettier configuration
├── package.json               # Project dependencies and scripts
└── readme.md                  # Project README
```

## Core Components

### 1. stripe-payment-sheet
Main component providing a Stripe card form similar to iOS/Android payment sheets.
- Location: `src/components/stripe-payment-sheet/`
- Tag: `<stripe-payment>`
- Features: Card number, expiry, CVC, optional ZIP code fields
- Uses Stencil Store for state management
- Supports both PaymentIntent and SetupIntent

### 2. stripe-element-modal
Simple modal wrapper for payment components.
- Location: `src/components/stripe-element-modal/`
- Provides modal functionality with open/close events

### 3. stripe-payment-request-button (Beta)
Payment Request API button component.
- Location: `src/components/stripe-payment-request-button/`
- Status: Beta

### 4. stripe-payment-sheet-modal
Combined component integrating payment sheet with modal.
- Location: `src/components/stripe-payment-sheet-modal/`

## Development Workflows

### Environment Requirements
- Node.js >= 12.0.0 (CI uses Node.js 18.x)
- npm or yarn
- Package manager: Both npm and yarn are supported (CONTRIBUTING.md mentions yarn, but package.json uses npm scripts)

### Setup
```bash
npm install          # Install dependencies
npm start            # Start dev server with watch mode
npm run build        # Production build
npm test             # Run unit tests
npm run lint         # Lint TypeScript/TSX files
npm run format       # Format code with Prettier
npm run generate     # Generate new Stencil component
```

### Build Process
- Build tool: Stencil CLI
- Output targets:
  - `dist/` - Standard distribution with ESM loader
  - `dist-custom-elements/` - Custom elements bundle
  - `docs-readme` - Auto-generated README files for components
  - `www/` - Development server output
- Build command generates documentation automatically

### Testing
- Test framework: Jest + Puppeteer
- Test location: `src/components/*/test/`
- Test commands:
  - `npm test` - Run unit tests
  - `npm run test:e2e` - Run E2E tests
  - `npm run test.watch` - Watch mode for all tests
- Tests include snapshots (stored in `__snapshots__/` directories)

### CI/CD Pipeline
- Platform: GitHub Actions
- Workflow file: `.github/workflows/ci.yml`
- Triggers: On push and pull_request
- Steps:
  1. Checkout code
  2. Setup Node.js 18.x
  3. Cache node_modules
  4. Run `npm ci`
  5. Run tests (`npm test`)
  6. Build project (`npm run build`)

### Publishing
- Uses `np` package for releases
- Command: `npm run release`
- Pre-publish: Automatically runs build via `prepublishOnly` script

## Code Conventions

### TypeScript/JavaScript
- **Target**: ES2017
- **Module**: ESNext
- **JSX Factory**: `h` (Stencil's JSX pragma)
- **Decorators**: Enabled (required for Stencil)
- **Strict Options**:
  - `noUnusedLocals`: true
  - `noUnusedParameters`: true
  - `allowUnreachableCode`: false

### Stencil Component Conventions
- **Component Structure**:
  ```tsx
  import { Component, Prop, State, Method, Event, Element, Watch, h } from '@stencil/core';

  @Component({
    tag: 'component-name',
    styleUrl: 'component-name.scss',
    shadow: false,  // Note: Shadow DOM is disabled
  })
  export class ComponentName {
    @Element() el: HTMLElement;
    @Prop() propName: type;
    @State() stateName: type;
    @Method() async methodName() {}
    @Event() eventName: EventEmitter<type>;
    @Watch('propName') watchHandler() {}

    render() {
      return <div>...</div>;
    }
  }
  ```

- **Decorator Style** (enforced by ESLint):
  - `@Prop`, `@State`, `@Element`, `@Event`: inline style
  - `@Method`, `@Watch`, `@Listen`: multiline style

- **Method Visibility**:
  - Public methods (exposed API): Use `@Method()` decorator, must be async
  - Private methods: Prefix with private keyword
  - Component props must be public and readonly

### ESLint Rules
Configuration: `.eslintrc.json`
- Extends: `eslint:recommended`, `@typescript-eslint/recommended`, `@stencil-community/recommended`
- Key rules:
  - `@stencil-community/async-methods`: error - All @Method() must be async
  - `@stencil-community/ban-prefix`: Bans "stencil" and "stnl" prefixes
  - `@stencil-community/required-jsdoc`: error - JSDoc required
  - `padding-line-between-statements`: Enforces blank lines between blocks
  - `curly`: error - Always use curly braces
  - Explicit module boundary types: off
  - Non-null assertions: allowed

### Prettier Configuration
Configuration: `.prettierrc.json`
- **Print Width**: 180 characters (notably wide!)
- **Quotes**: Single quotes
- **Semi**: true (semicolons required)
- **Tab Width**: 2 spaces
- **Arrow Parens**: avoid
- **Trailing Comma**: all
- **Bracket Spacing**: true
- **JSX Brackets**: On next line (false)

### Styling
- **Preprocessor**: SCSS (via @stencil/sass plugin)
- **Shadow DOM**: Disabled (shadow: false)
- **Style Organization**:
  - Component styles: Co-located with component (`.scss` files)
  - Global styles: `src/style/` directory
  - CSS Reset: `src/style/rest.scss`
  - Theme variables: `src/style/theme.scss`

### File Naming
- Components: kebab-case (e.g., `stripe-payment-sheet.tsx`)
- Utilities: camelCase (e.g., `error.ts`, `i18n.ts`)
- Tests: `*.spec.tsx` in `test/` subdirectory
- Styles: Match component name (e.g., `stripe-payment-sheet.scss`)

### State Management
- Uses `@stencil/store` for shared state
- Store pattern: See `src/components/stripe-payment-sheet/store/`
- Store files:
  - `store.ts` - Store definition and initialization
  - `CardElement.ts` - Stripe element management
  - `index.ts` - Exports

### Internationalization
- Library: i18next with browser language detector
- Configuration: `src/utils/i18n.ts`
- Recommended translatable strings documented in component props

### Type Definitions
- Shared types: `src/interfaces.ts`
- Component-specific types: Usually defined in component file or interfaces
- Stripe types: Imported from `@stripe/stripe-js`
- Key custom types:
  - `FormSubmitEvent`, `FormSubmitHandler` - Form submission
  - `StripeLoadedEvent`, `StripeDidLoadedHandler` - Stripe initialization
  - `ProgressStatus` - Activity states: '', 'loading', 'success', 'failure'
  - `IntentType` - 'setup' | 'payment'

## Git Workflow

### Commit Message Convention
Follows **Conventional Commits** specification (v1.0.0):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `BREAKING CHANGE`: Breaking change (major update)
- `feat`: New feature (minor update)
- `fix`: Bug fix (patch update)
- `style`: Code formatting (patch update)
- `refactor`: Code refactoring (patch update)
- `perf`: Performance improvement (patch update)
- `test`: Test updates (patch update)
- `docs`: Documentation updates (patch update)
- `chore`: Other changes (patch update)

**Examples**:
```bash
# New feature
feat: add new feature

Describe in details.

fix #42

# Bug fix
fix: `tryUpdateState` should be called before finished

Describe in details.

fix #42

# Breaking change
feat: Change default StoreGroup

BREAKING CHANGE: make `StoreGroup` as default store

fix #42
```

### Branching Strategy
- Fork the repository
- Create feature branches: `git checkout -b my-new-feature`
- Submit Pull Requests to main repository

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes with conventional commits
4. Ensure tests pass (`npm test`)
5. Ensure build succeeds (`npm run build`)
6. Submit PR

## Common Development Tasks

### Creating a New Component
```bash
npm run generate
# or
stencil generate
```
Follow Stencil prompts to scaffold a new component.

### Running Examples Locally
```bash
# Build and copy to example directory
npm run example:copy

# Serve examples
npm run example:serve
```

### Debugging
- Development server runs at default Stencil port (typically 3333)
- Use browser DevTools to debug web components
- Check `src/index.html` for development test page

## Important Notes for AI Assistants

### When Making Changes

1. **Always run tests** after code changes:
   ```bash
   npm test
   ```

2. **Lint before committing**:
   ```bash
   npm run lint
   ```

3. **Format code**:
   ```bash
   npm run format
   ```

4. **Build to verify**:
   ```bash
   npm run build
   ```

5. **Follow commit conventions**: Use conventional commits format

### Component Development Guidelines

1. **Shadow DOM is disabled** - Styles are not encapsulated
2. **All @Method() must be async** - Enforced by ESLint
3. **JSDoc is required** - Document all public APIs
4. **Props should be readonly** - Follow Stencil best practices
5. **Use Stencil Store for shared state** - Not React context or similar
6. **Support internationalization** - Use i18next for user-facing strings
7. **Platform detection** - Use `src/utils/platform.ts` utilities

### Testing Guidelines

1. Unit tests should cover:
   - Component rendering
   - Prop changes
   - Event emissions
   - Public methods
   - State updates

2. Use snapshots for UI testing
3. Test files go in component's `test/` directory
4. Follow existing test patterns in the codebase

### Common Pitfalls to Avoid

1. **Don't use shadow: true** - Project uses light DOM
2. **Don't skip semicolons** - Required by Prettier config
3. **Don't exceed 180 character line width** - Prettier will wrap
4. **Don't use stencil/stnl prefixes** - Banned by ESLint
5. **Don't forget to make public methods async** - Required by @stencil-community rules
6. **Don't commit without conventional commit format** - Will break release workflow
7. **Don't modify components.d.ts** - Auto-generated file

### Working with Stripe

1. **Never commit real API keys** - Use test keys (pk_test_*)
2. **Handle both PaymentIntent and SetupIntent** - Use intentType prop
3. **Stripe elements are lazy loaded** - Wait for stripeLoaded event
4. **Error handling** - Use StripeAPIError utility from `src/utils/error.ts`
5. **Test mode** - All examples and tests should use Stripe test mode

### Documentation

1. **Component READMEs are auto-generated** - Run `npm run build --docs`
2. **Update main README.md** - For major feature additions
3. **JSDoc comments** - Will appear in generated docs
4. **Example usage** - Add to `example/` directory if adding new features

## Migration Notes

### Recent Migration to Stencil 4
The project recently migrated from Stencil 3 to Stencil 4 (see commit 99a0f5c).
Key changes:
- Updated to `@stencil/core@^4.30.0`
- Updated build configuration
- CI actions updated

Be aware of Stencil 4 breaking changes when making updates.

## Resources

- [Stencil Documentation](https://stenciljs.com/docs/introduction)
- [Stripe.js Documentation](https://stripe.com/docs/js)
- [Conventional Commits](https://conventionalcommits.org/)
- [i18next Documentation](https://www.i18next.com/)

## Maintainers

- Hidetaka Okamoto (@hideokamoto) - [@hide__dev](https://twitter.com/hide__dev)
- Masaki Hirano (@contiki9) - [@maki_saki](https://twitter.com/maki_saki)
- Masahiko Sakakibara (@rdlabo) - [@rdlabo](https://twitter.com/rdlabo)

---

**Last Updated**: 2025-11-15
**Stencil Version**: 4.30.0
**Node Version (CI)**: 18.x
