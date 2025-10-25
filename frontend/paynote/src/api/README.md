# PayNote API Client

Type-safe API client for PayNote application built on Next.js App Router.

## Structure

```
src/api/
├── index.ts              # Main exports
├── lib/
│   ├── http.ts          # HTTP client with timeout & error handling
│   └── errors.ts        # API error classes
├── routes/              # API endpoint modules
│   ├── networks.ts
│   ├── organizations.ts
│   ├── wallets.ts
│   ├── categories.ts
│   ├── rules.ts
│   ├── counterparties.ts
│   ├── bindings.ts
│   ├── paynotes.ts
│   ├── analytics.ts
│   ├── fx-snapshots.ts
│   ├── search.ts
│   └── attachments.ts
└── types/
    └── requests.ts      # Request DTOs
```

## Usage

### Basic Usage

```typescript
import { api } from "@/api";

// List networks
const networks = await api.networks.list();

// Get organization
const org = await api.organizations.get("org-uuid");

// List paynotes with filters
const paynotes = await api.paynotes.list({
  chainId: 1,
  address: "0x...",
});

// Search
const results = await api.search.search({
  q: "invoice",
  docType: "PayNote",
});
```

### Error Handling

```typescript
import { api, ApiError, RateLimitError } from "@/api";

try {
  const org = await api.organizations.get(orgId);
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfterSeconds}s`);
  } else if (error instanceof ApiError) {
    if (error.isAuthError()) {
      // Redirect to login
    } else if (error.isValidationError()) {
      const fieldErrors = error.getFieldErrors();
      // Display validation errors
    }
  }
}
```

### In React Components

```typescript
"use client";

import { useEffect, useState } from "react";
import { api } from "@/api";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";

export function TransactionsList() {
  const [paynotes, setPaynotes] = useState<PayNoteExpanded[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.paynotes.list()
      .then(setPaynotes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {paynotes.map((note) => (
        <div key={note.payNoteId}>{note.payReference}</div>
      ))}
    </div>
  );
}
```

### Creating Resources

```typescript
import { api } from "@/api";

// Create organization
const newOrg = await api.organizations.create({
  name: "Acme Corp",
  slug: "acme-corp",
  billingPlan: "Team",
  primaryCurrency: "USD",
});

// Create category
const category = await api.categories.create(orgId, {
  name: "Marketing",
  color: "#FF6B6B",
  icon: "📊",
  visibility: "Private",
});

// Create rule
const rule = await api.rules.create(orgId, {
  name: "Auto-tag invoices",
  predicate: { /* rule logic */ },
  actions: { /* actions */ },
  enabled: true,
});
```

### Updating Resources

```typescript
import { api } from "@/api";

// Update organization
const updated = await api.organizations.update(orgId, {
  name: "New Name",
  billingPlan: "Enterprise",
});
```

### Analytics & Reporting

```typescript
import { api } from "@/api";

// Get daily analytics
const analytics = await api.analytics.daily({
  orgId: "org-uuid",
  from: "2025-01-01",
  to: "2025-01-31",
  chainId: 1,
});

// Get FX rates
const rates = await api.fxSnapshots.list({
  base: "USD",
  since: Date.now() / 1000,
});
```

## API Modules

### Networks
- `list()` - List all supported blockchain networks

### Organizations
- `list()` - List user's organizations
- `get(orgId)` - Get organization by ID
- `create(data)` - Create new organization
- `update(orgId, data)` - Update organization
- `delete(orgId)` - Delete organization
- `listAccounts(orgId)` - List organization members

### Wallets
- `list(params?)` - List wallets with optional filters

### Categories
- `list(orgId)` - List categories for organization
- `create(orgId, data)` - Create new category

### Rules
- `list(orgId)` - List automation rules
- `create(orgId, data)` - Create new rule

### Counterparties
- `list(orgId, params?)` - List counterparties with optional type filter

### Contract Bindings
- `list(params?)` - List contract bindings by chain/org

### PayNotes (Transactions)
- `list(params?)` - List transactions with filters
- `get(payNoteId)` - Get transaction by ID

### Analytics
- `daily(params)` - Get daily aggregated metrics

### FX Snapshots
- `list(params?)` - List exchange rate snapshots

### Search
- `search(params)` - Search across all documents

### Attachments
- `create(orgId, data)` - Create attachment metadata

## Configuration

Set the API base URL in your environment:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.paynote.app
```

Default: `/api` (uses Next.js API routes)

## HTTP Client Features

- ✅ Automatic JSON serialization
- ✅ Request timeout (default 30s)
- ✅ Typed error handling
- ✅ Query parameter building
- ✅ TypeScript inference
- ✅ Problem Details (RFC 7807) support
- ✅ Rate limit handling with retry-after

## Error Types

### ApiError
Base error class for all HTTP errors.

Properties:
- `status: number` - HTTP status code
- `problemDetail: ProblemDetail` - RFC 7807 problem details
- `response?: Response` - Original fetch response

Methods:
- `is(status)` - Check specific status code
- `isAuthError()` - Check if 401
- `isForbidden()` - Check if 403
- `isNotFound()` - Check if 404
- `isConflict()` - Check if 409
- `isValidationError()` - Check if 400/422
- `getFieldErrors()` - Get field-level validation errors

### RateLimitError
Extends `ApiError` for 429 responses.

Additional:
- `retryAfterSeconds?: number` - Seconds until retry allowed

## Type Safety

All API methods are fully typed using the entities from `src/types/`:

```typescript
import type { Organization } from "@/types/interfaces/Organization";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";
import type { Category } from "@/types/interfaces/Category";

// TypeScript knows the return types
const org: Organization = await api.organizations.get(id);
const notes: PayNoteExpanded[] = await api.paynotes.list();
const categories: Category[] = await api.categories.list(orgId);
```
