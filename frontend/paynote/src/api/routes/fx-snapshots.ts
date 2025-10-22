import { http } from "../lib/http";
import type { ExchangeRateSnapshot } from "@/types/interfaces/ExchangeRateSnapshot";
import type { FiatCode } from "@/types/primitives/FiatCode";
import type { UnixTime } from "@/types/primitives/UnixTime";

/**
 * FX Snapshots API query parameters
 */
interface FxSnapshotsParams {
  base?: FiatCode;
  since?: UnixTime;
}

/**
 * FX Snapshots API
 * Access exchange rate data for fiat conversions
 */
export const fxSnapshotsApi = {
  /**
   * List FX snapshots
   * GET /fx-snapshots
   */
  list: (params?: FxSnapshotsParams) =>
    http.get<ExchangeRateSnapshot[]>("/fx-snapshots", { params: params as any }),
};
