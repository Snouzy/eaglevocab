## Project Overview

- **Monorepo** Turborepo avec 3 apps (web qui est la landing, api qui est l'API et app qui est l'application web) et 3 packages partagés. Location `./`
- **Contexte** : Nouveau back-office de gestion viticole (apports / réception de vendange) pour Henri Ehrhart & Fils, Ammerschwihr.
- **Migration** : Remplace progressivement un ancien back-office Laravel. La BDD MySQL existante est partagée et ne doit PAS être modifiée en Phase 1.

### System Components

1. **Web Client** (`apps/app/`)
   - ViteJS + React 19 + TypeScript
   - Routing : `react-router-dom` — point d'entrée `apps/app/src/App.tsx`
   - Routes protégées via `apps/app/src/components/require-auth.tsx`

2. **API** (`apps/api/`)
   - Express + TypeScript, architecture 3 couches
   - Point d'entrée : `apps/api/src/index.ts`

3. **Packages partagés** (`packages/`)
   - `@eagle-vocab/types` — Types TypeScript partagés (User, AuthTokens, Sv12Data, DashboardKpis...) : `packages/types/src/index.ts`
   - `@eagle-vocab/ui` — Composants React partagés : `packages/ui/src/index.ts`
   - `@eagle-vocab/config` — ESLint + Prettier config partagée

Si il y a besoin de connaître quelques chose à propos de l'UI (User Interface), les animations, composants, etc, un fichier résume tout cela : `product-development/ui.md`. Sens toi libre de le consulter pour les détails techniques liés à l'interface utilisateur, les choix de design, les librairies utilisées, etc. C'est un document vivant qui évoluera au fur et à mesure du développement pour rester à jour avec les décisions prises.

## State Management

- **Zustand** pour le state client global — stores dans `apps/web/src/lib/`
- **TanStack Query** pour le server state (cache, refetch, invalidation) — config dans `apps/web/src/lib/query-client.ts`

```tsx
const user = useAuth((s) => s.user);
const clearAuth = useAuth((s) => s.clearAuth);
```

## API Calls

- **ky** comme client HTTP — instance configurée dans `apps/web/src/lib/api-client.ts`
- Interceptors automatiques :
  - `beforeRequest` → injecte le Bearer token depuis le store Zustand
  - `afterResponse` → sur 401, tente un refresh token, sinon logout + redirect `/login`
- **TanStack Query** pour les hooks de fetching. Un fichier de queries par domaine métier.
- Hooks dans `apps/web/src/hooks/` : `use-dashboard.ts`, `use-sv12.ts`

```tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useApporteurs() {
  return useQuery({
    queryKey: ["apporteurs"],
    queryFn: () => api.get("apporteurs").json(),
  });
}
```

## Data Table

- **TanStack Table** (`@tanstack/react-table`) pour les tableaux complexes
- Composant réutilisable.
- Colonnes définies dans un fichier séparé. Exemple : `apps/web/src/components/columns.tsx`

## Architecture API (3 couches)

```
apps/api/src/
├── presentation/     → Interface HTTP
│   ├── routes/       → Définition des routes Express
│   ├── controllers/  → Logique requête/réponse
│   ├── middlewares/   → Auth, rôles, error handling
│   └── validation/   → Schémas Zod
├── service/          → Logique métier, autorisations, sanitize
└── persistence/      → Repositories, Drizzle client, requêtes BDD
    ├── db.ts         → Connexion MySQL via mysql2
    ├── schema.ts     → Schéma Drizzle (tables: users, apporteurs, tickets, ticketinfos, parcelles, cepages, coordonnees, categories, fichepressoirs, vcis, contracts)
    └── *.repository.ts → Requêtes par domaine (user, dashboard, sv12)
```

### Conventions API

- Zod pour la validation des inputs (`presentation/validation/`)
- Pino pour les logs (`apps/api/src/logger.ts`)
- Variables d'environnement typées via t3-env (`apps/api/src/env.ts`)
- Pour les agrégats numériques, utiliser `ROUND(..., 2)` côté SQL pour éviter les flottants imprécis

### Backend middlewares

- `requireAuth()` → verifies JWT, attaches payload to `req.user` — `apps/api/src/presentation/middlewares/auth.middleware.ts`
- `requireRole('GESTION')` → checks `req.user.groupe` against allowed roles


## Conventions générales

- ESLint 9 flat config partagé via `@ehrhart/config` — auto-fix on save dans VS Code
- Prettier — format on save (`.prettierrc.js` à la racine)
- TOUJOURS vérifier les diagnostics LSP après édition
- Avant de créer un composant, vérifier s'il existe dans shadcn/ui
- db/dump.sql dans .gitignore (données confidentielles)
- Boutons : grands (`h-10`), `rounded-xl`, labels explicites ("Actualiser", "Exporter"), action principale en `default`, secondaire en `outline`
- Textes : courts, directs, langage simple. Pas de jargon.
- Navigation : parcours linéaires, max 2-3 choix par étape

Dans tous les cas, fais au plus simple (KISS principle), maintenable et réutilisable afin que n'importe quel développeur (moi, un junior ou une IA) dans 6 mois puisse comprendre le code. 

Des patterns, c'est bien, nous ne sommes pas contre ! Mais faut-il encore les comprendre et les documenter : il s'agit d'un projet où différents développeurs peuvent intervenir et des développeurs juniors doivent être en mesure de comprendre.

Keep It Stupid Simple ! 

Pour finir, si tu mets des commentaires, mets les en anglais.