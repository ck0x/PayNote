import type { Bytes32 } from '../primitives/Bytes32';
import type { UUID } from '../primitives/UUID';

/** Junction: PayNote ↔ Category (M:N) */
export type PayNoteCategory = {
  payNoteId: Bytes32;
  categoryId: UUID;
}
