import type { UUID } from '../primitives/UUID';
import type { DocType } from '../enums/DocType';

/** SearchIndex (denormalized search doc) */
export type SearchIndex = {
  docId: string;
  docType: DocType;
  orgId?: UUID | null;
  terms: string;
  payload: any;
}
