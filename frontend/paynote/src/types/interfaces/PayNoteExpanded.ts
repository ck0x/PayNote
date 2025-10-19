import type { PayNote } from './PayNote';
import type { Wallet } from './Wallet';
import type { Category } from './Category';
import type { Attachment } from './Attachment';
import type { Network } from './Network';

export type PayNoteExpanded = PayNote & {
  sender?: Wallet;
  recipient?: Wallet;
  categories?: Category[];
  attachments?: Attachment[];
  network?: Network;
}
