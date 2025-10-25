import type { Bytes32 } from '../primitives/Bytes32';
import type { FileId } from '../primitives/FileId';

/** Junction: PayNote ↔ Attachment (M:N) */
export type PayNoteAttachment = {
  payNoteId: Bytes32;
  fileId: FileId;
}
