## Key Directory Structure

- src/app/[localel/ - Internationalized routes
- (public) / - Public pages
- (auth) / - Authentication pages
- (app) / - Protected user pages
- admin/ - Admin pages
- src/components/ - Reusable components
- ui/ - ShadCN Ul components
- features/ - Feature-specific components
- src/services/ - Business logic layer

- src/db/ - Database layer
- src/lib/ - Utilities and helpers

## Coding Style Rule: Functional over OOP

Always prefer functional programming over object-oriented programming (OOP).

- Write pure functions instead of classes.
- Favor composition, immutability, and stateless services.
- Use functional modules (export function) rather than singletons or global objects.
- Wrap external SDKs (e.g., Stripe, Resend) in functional adapters when they expose OOP APls.
- OOP should only be used when handling truly complex, persistent state that is hard to model otherwise (rare in SaaS)

## Development Guidelines
Authentication
- Uses Better Auth with Stripe integration
- Multi-organization support with role-based access
- TOTP 2FA support

## Database

- Uses Drizzle ORM with PostgreSQL
- Seed data in src/db/scripts/seed.ts
- Always use transactions for related operations

## Styling

- Tailwind CSS v4 with utility-first approach
- ShadCN Ul components for consistency
- Dark mode support with next-themes

## Testing

- Vitest with pool=forks for isolation
- Test files in sry_tests_/ and src/services/_tests_/
- Mock databaselconnections in tests

## Internationalization

- next-intl for i18n
- Messages in messages/ directory (en.json, fr.json, es.json)
- Locale-based routing

## File Organization

- Use kebab-case for new files

- Feature-based organization in colonents
- Strict layer separation (no cross-layer calls)


## Environment Setup

Required environment variables:

- DATABASE_URL - PostgreSQL connection string
- AUTH_SECRET - Authentication secret (generate with openssl rand -base64 32)
- RESEND_API_KEY - For email sending
- STRIPE_SECRET_KEY - Stripe secret key
- STRIPE VEBHOOK SECRET - Stripe webhook seet


## Code Generation Prerequisites

Before generating ANY new code, you MUST complete these two verification steps:

1. Check Existing Codebase Patterns
Find and analyze at least three existing examples of similar functionality in the codebase. Look for:
• Similar components, functions, or modules
• Existing patterns that solve comparable problems
• Code structure and conventions already in use
If no such examples exist, explicitly state that fact before proceeding.

If a rule exists, you MUST follow it exactly. If no rule exists, mention this before propo:


Until both verifications are complete, do NOT proceed with implementation.


## Coding Guidelines

• Ne pas utiliser de commentaires pour expliquer le code, seulement pour le code complexe
• Ne lance pas de pnpm build a la fin