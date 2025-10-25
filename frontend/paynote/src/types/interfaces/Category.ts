import type { UUID } from '../primitives/UUID';
import type { HexColor } from '../primitives/HexColor';
import type { IconKey } from '../primitives/IconKey';
import type { Visibility } from '../enums/Visibility';

/** Category (org taxonomy) */
export type Category = {
  categoryId: UUID;
  orgId: UUID;
  name: string;
  color: HexColor;
  icon: IconKey;
  visibility: Visibility;
}
