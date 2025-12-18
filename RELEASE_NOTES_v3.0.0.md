# Release Notes - v3.0.0

## 🎉 Major Release

We're excited to announce the release of **stripe-pwa-elements v3.0.0**! This release includes significant improvements, architectural changes, and important breaking changes that align the component names with Stripe's official naming conventions.

---

## ⚠️ Breaking Changes

### Component Name Changes

To align with Stripe Elements naming conventions, we've renamed all components. **You must update your code** to use the new component names:

#### Component Renaming Map

| Old Component Name | New Component Name |
|-------------------|-------------------|
| `<stripe-payment-sheet>` | `<stripe-card-element>` |
| `<stripe-payment-sheet-modal>` | `<stripe-card-element-modal>` |
| `<stripe-element-modal>` | `<stripe-modal>` |

#### Migration Guide

**1. Update HTML Tags**

```html
<!-- Before (v2.x) -->
<stripe-payment-sheet
  publishable-key="pk_test_xxxxx"
  intent-client-secret="pi_xxxxxx"
></stripe-payment-sheet>

<!-- After (v3.0.0) -->
<stripe-card-element
  publishable-key="pk_test_xxxxx"
  intent-client-secret="pi_xxxxxx"
></stripe-card-element>
```

**2. Update JavaScript createElement Calls**

```javascript
// Before (v2.x)
const element = document.createElement('stripe-payment-sheet');
await customElements.whenDefined('stripe-payment-sheet');

// After (v3.0.0)
const element = document.createElement('stripe-card-element');
await customElements.whenDefined('stripe-card-element');
```

**3. Update TypeScript Type References**

```typescript
// Before (v2.x)
const element: HTMLStripePaymentSheetElement = document.querySelector('stripe-payment-sheet');

// After (v3.0.0)
const element: HTMLStripeCardElementElement = document.querySelector('stripe-card-element');
```

**4. Update Modal Components**

```html
<!-- Before (v2.x) -->
<stripe-element-modal open="true">
  <stripe-payment-sheet-modal
    publishable-key="pk_test_xxxxx"
    intent-client-secret="pi_xxxxxx"
  ></stripe-payment-sheet-modal>
</stripe-element-modal>

<!-- After (v3.0.0) -->
<stripe-modal open="true">
  <stripe-card-element-modal
    publishable-key="pk_test_xxxxx"
    intent-client-secret="pi_xxxxxx"
  ></stripe-card-element-modal>
</stripe-modal>
```

**5. Update Event Listeners**

Event names remain the same, but make sure to update component references:

```javascript
// Before (v2.x)
const sheetElement = document.querySelector('stripe-payment-sheet');
sheetElement.addEventListener('formSubmit', handler);

// After (v3.0.0)
const cardElement = document.querySelector('stripe-card-element');
cardElement.addEventListener('formSubmit', handler);
```

---

## ✨ New Features

### Stencil 4 Migration

- **Upgraded to Stencil 4**: Migrated from Stencil 3 to Stencil 4 (`@stencil/core@^4.38.3`)
- Improved build performance and better TypeScript support
- Enhanced developer experience with better error messages

### Service Pattern Architecture

- **Refactored to Service Pattern**: Migrated from Stencil Store to a Service pattern with dependency injection
- Better separation of concerns and improved testability
- Enhanced error handling and element management

### Enhanced Error Handling

- Improved StripeService error handling and element finding
- Better error messages and debugging capabilities
- Fixed memory leaks in component lifecycle management

---

## 🐛 Bug Fixes

- **Fixed memory leaks**: Resolved memory leaks in component lifecycle management
- **Type fixes**: 
  - Updated type references from `HTMLStripePaymentElement` to `HTMLStripeCardElementElement`
  - Fixed `StripePaymentRequestButtonElement` type usage
  - Resolved TypeScript `noUnusedLocals` errors
- **Example fixes**: 
  - Fixed `cardNumberElement` usage in examples
  - Resolved client errors in example code
- **Error logging**: Improved error message logging on default submit events

---

## 🔧 Improvements

### Dependencies

- **Stripe.js**: Upgraded to `@stripe/stripe-js@^8.4.0`
- **i18next**: Updated to `^25.6.2`
- **Other dependencies**: Updated to latest compatible versions

### Testing

- Expanded unit test coverage for utility functions and components
- Rewrote tests to avoid private method mocking
- Removed obsolete snapshots after component rename
- Added tests for each method

### Documentation

- Added comprehensive `CLAUDE.md` for AI assistant guidance
- Updated auto-generated component documentation
- Improved example layouts and code

### CI/CD

- Updated GitHub Actions workflows
- Improved CI pipeline reliability

---

## 📦 Installation

```bash
npm install stripe-pwa-elements@3.0.0
# or
yarn add stripe-pwa-elements@3.0.0
```

---

## 🔄 Upgrade Steps

1. **Update package version**:
   ```bash
   npm install stripe-pwa-elements@3.0.0
   ```

2. **Update component names** in your codebase:
   - Search and replace `stripe-payment-sheet` → `stripe-card-element`
   - Search and replace `stripe-payment-sheet-modal` → `stripe-card-element-modal`
   - Search and replace `stripe-element-modal` → `stripe-modal`

3. **Update TypeScript types** if using TypeScript:
   - Update `HTMLStripePaymentSheetElement` → `HTMLStripeCardElementElement`
   - Update other related type references

4. **Test your application** thoroughly after migration

5. **Update any custom CSS selectors** that target the old component names

---

## 📚 Documentation

- [Component Documentation](https://github.com/wpkyoto/stripe-pwa-elements)
- [Migration Guide](#migration-guide) (see above)
- [Examples](https://github.com/wpkyoto/stripe-pwa-elements/tree/main/example)

---

## 🙏 Thank You

Thank you to all contributors who made this release possible! Special thanks to everyone who provided feedback and helped test the migration.

---

## 📝 Full Changelog

For a complete list of changes, see the [comparison between v3.0.0-0 and v3.0.0](https://github.com/wpkyoto/stripe-pwa-elements/compare/v3.0.0-0...v3.0.0).

---

**Note**: If you encounter any issues during migration, please [open an issue](https://github.com/wpkyoto/stripe-pwa-elements/issues) on GitHub.

