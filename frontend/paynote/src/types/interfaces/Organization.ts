import type { UUID } from '../primitives/UUID';
import type { Slug } from '../primitives/Slug';
import type { Plan } from '../enums/Plan';
import type { FiatCode } from '../primitives/FiatCode';

/** Organization (tenant) */
export type Organization = {
  orgId: UUID;
  name: string;
  slug: Slug;
  billingPlan: Plan;
  primaryCurrency: FiatCode;
}
