import type { FileId } from '../primitives/FileId';
import type { UUID } from '../primitives/UUID';
import type { URLString } from '../primitives/URLString';

/** Attachment (off-chain file store) */
export type Attachment = {
  fileId: FileId;
  orgId: UUID;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageUrl: URLString;
}
