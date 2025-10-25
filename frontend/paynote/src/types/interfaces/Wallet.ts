import type { UUID } from '../primitives/UUID';
import type { Address } from '../primitives/Address';
import type { ENSName } from '../primitives/ENSName';
import type { UnixTime } from '../primitives/UnixTime';

/** Wallet (may be user- or org-linked) */
export type Wallet = {
  walletId: UUID;
  address: Address;
  ensName?: ENSName | null;
  label?: string | null;
  ownerAccountId?: UUID | null;
  createdAt: UnixTime;
}
