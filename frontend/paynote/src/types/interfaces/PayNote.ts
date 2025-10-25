import type { Bytes32 } from '../primitives/Bytes32';
import type { TxHash } from '../primitives/TxHash';
import type { ChainId } from '../primitives/ChainId';
import type { UUID } from '../primitives/UUID';
import type { Wei } from '../primitives/Wei';
import type { UnixTime } from '../primitives/UnixTime';
import type { Status } from '../enums/Status';

/** PayNote (atomic transaction + reference) */
export type PayNote = {
  payNoteId: Bytes32;
  txHash: TxHash;
  chainId: ChainId;
  senderWalletId: UUID;
  recipientWalletId: UUID;
  amountWei: Wei;
  payReference: string;
  timestamp: UnixTime;
  status: Status;
  orgId?: UUID | null;
}
