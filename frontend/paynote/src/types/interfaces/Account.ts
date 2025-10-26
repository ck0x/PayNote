import type { UUID } from "../primitives/UUID";
import type { Email } from "../primitives/Email";
import type { Role } from "../enums/Role";

export type Account = {
  accountId: UUID;
  orgId: UUID;
  email: Email | null;
  displayName: string;
  role: Role;
  defaultWalletId?: UUID | null;
};
