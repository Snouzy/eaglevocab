# Refactor: Simplify ReviewRequestModal

## Objective
Simplify the ReviewRequestModal component without changing functionality. Focus on:
- Extracting step content into separate components
- Consolidating platform URL configuration
- Reducing styled component duplication

## Changes to Make

### 1. Consolidate Platform URLs
Replace separate TRUSTPILOT_URL and CAPTERRA_URLS with unified config:
```tsx
const PLATFORM_CONFIG = {
  trustpilot: {
    name: "Trustpilot",
    urls: { fr: "...", en: "...", es: "...", pt: "..." }
  },
  capterra: {
    name: "Capterra",
    urls: { fr: "...", en: "...", es: "...", pt: "..." }
  }
} as const;
```

### 2. Extract Step Components
Create internal components for each step to reduce renderContent complexity:
- `InitialStep` - for step === "initial"
- `GeneratingStep` - for step === "generating"
- `EditingStep` - for step === "editing"
- `SubmittingStep` - for step === "submitting"

Pass only the props each component needs.

### 3. Consolidate Similar Styled Components
- Merge `IconWrapper` and `SuccessIconWrapper` using a prop for color variant
- Keep button styles (PrimaryButton, SecondaryButton, DismissButton) as they are different enough

### 4. Simplify StepIndicator
Create a reusable StepIndicator component that takes `currentStep: number` prop instead of manually specifying $active and $completed for each dot.

## Constraints
- Preserve ALL existing functionality exactly
- Keep the same visual appearance
- Do not change props interface
- Do not change hook usage patterns
- Keep styled components in the same file (don't extract to separate file)
