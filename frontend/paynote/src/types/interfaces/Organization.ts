import type { UUID } from "../primitives/UUID";
import type { Slug } from "../primitives/Slug";
import type { FiatCode } from "../primitives/FiatCode";

export type Organization = {
  orgId: UUID;
  name: string;
  slug: Slug;
  primaryCurrency: FiatCode;
};
