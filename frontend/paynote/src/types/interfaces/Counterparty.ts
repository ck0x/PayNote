import type { UUID } from '../primitives/UUID';
import type { CPType } from '../enums/CPType';

/** Counterparty (org directory, backed by a wallet) */
export type Counterparty = {
  counterpartyId: UUID;
  orgId: UUID;
  walletId: UUID;
  type: CPType;
  displayName: string;
}
