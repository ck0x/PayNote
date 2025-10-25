import type { UUID } from '../primitives/UUID';
import type { ChainId } from '../primitives/ChainId';
import type { Wei } from '../primitives/Wei';

/** AnalyticsDaily (pre-aggregated metrics) */
export type AnalyticsDaily = {
  orgId: UUID;
  date: string;
  chainId: ChainId;
  totalTx: number;
  sumInWei: Wei;
  sumOutWei: Wei;
  topCategories: any;
}
