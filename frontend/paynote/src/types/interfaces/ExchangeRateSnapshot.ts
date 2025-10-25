import type { UUID } from '../primitives/UUID';
import type { UnixTime } from '../primitives/UnixTime';
import type { FiatCode } from '../primitives/FiatCode';

/** ExchangeRateSnapshot (for fiat conversions) */
export type ExchangeRateSnapshot = {
  fxId: UUID;
  timestamp: UnixTime;
  base: FiatCode;
  rates: Record<FiatCode, string>;
}
