/**
 * PayNote API Client
 * Centralized exports for all API modules
 */

// Import all API modules
import { networksApi } from "./routes/networks";
import { organizationsApi } from "./routes/organizations";
import { walletsApi } from "./routes/wallets";
import { categoriesApi } from "./routes/categories";
import { rulesApi } from "./routes/rules";
import { counterpartiesApi } from "./routes/counterparties";
import { bindingsApi } from "./routes/bindings";
import { paynotesApi } from "./routes/paynotes";
import { analyticsApi } from "./routes/analytics";
import { fxSnapshotsApi } from "./routes/fx-snapshots";
import { searchApi } from "./routes/search";
import { attachmentsApi } from "./routes/attachments";

// Export all API modules
export { networksApi } from "./routes/networks";
export { organizationsApi } from "./routes/organizations";
export { walletsApi } from "./routes/wallets";
export { categoriesApi } from "./routes/categories";
export { rulesApi } from "./routes/rules";
export { counterpartiesApi } from "./routes/counterparties";
export { bindingsApi } from "./routes/bindings";
export { paynotesApi } from "./routes/paynotes";
export { analyticsApi } from "./routes/analytics";
export { fxSnapshotsApi } from "./routes/fx-snapshots";
export { searchApi } from "./routes/search";
export { attachmentsApi } from "./routes/attachments";

// Export error classes
export { ApiError, RateLimitError } from "./lib/errors";

// Export request types
export type {
  OrganizationCreate,
  OrganizationUpdate,
  CategoryCreate,
  RuleCreate,
  AttachmentCreate,
} from "./types/requests";

/**
 * Unified API client object
 */
export const api = {
  networks: networksApi,
  organizations: organizationsApi,
  wallets: walletsApi,
  categories: categoriesApi,
  rules: rulesApi,
  counterparties: counterpartiesApi,
  bindings: bindingsApi,
  paynotes: paynotesApi,
  analytics: analyticsApi,
  fxSnapshots: fxSnapshotsApi,
  search: searchApi,
  attachments: attachmentsApi,
} as const;
