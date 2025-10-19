import type { ChainId } from '../primitives/ChainId';
import type { URLString } from '../primitives/URLString';

/** Network is a root dictionary for EVM chains */
export type Network = {
  chainId: ChainId;
  name: string;
  explorerBaseUrl: URLString;
  nativeSymbol: string;
}
