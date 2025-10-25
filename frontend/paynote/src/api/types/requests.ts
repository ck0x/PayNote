/**
 * Organization creation request
 */
export type OrganizationCreate = {
  name: string;
  slug: string;
  billingPlan: "Free" | "Team" | "Enterprise";
  primaryCurrency: string;
};

/**
 * Organization update request
 */
export type OrganizationUpdate = {
  name?: string;
  billingPlan?: "Free" | "Team" | "Enterprise";
  primaryCurrency?: string;
};

/**
 * Category creation request
 */
export type CategoryCreate = {
  name: string;
  color: string;
  icon: string;
  visibility: "Public" | "Private";
};

/**
 * Rule creation request
 */
export type RuleCreate = {
  name: string;
  predicate: any;
  actions: any;
  enabled: boolean;
};

/**
 * Attachment creation request
 */
export type AttachmentCreate = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageUrl: string;
};
