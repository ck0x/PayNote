import type { UUID } from '../primitives/UUID';
import type { Email } from '../primitives/Email';
import type { Role } from '../enums/Role';

/** Account (org member) */
export type Account = {
  accountId: UUID;
  orgId: UUID;
  email: Email;
  displayName: string;
  role: Role;
  defaultWalletId?: UUID | null;
}
