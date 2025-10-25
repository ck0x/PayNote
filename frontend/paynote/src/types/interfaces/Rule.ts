import type { UUID } from '../primitives/UUID';

/** Rule (org auto-tagging / automation) */
export type Rule = {
  ruleId: UUID;
  orgId: UUID;
  name: string;
  predicate: any;
  actions: any;
  enabled: boolean;
}
