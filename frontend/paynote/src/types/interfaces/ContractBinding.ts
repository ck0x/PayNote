import type { UUID } from '../primitives/UUID';
import type { ChainId } from '../primitives/ChainId';
import type { Address } from '../primitives/Address';

/** ContractBinding (per network, optional org override) */
export type ContractBinding = {
  bindingId: UUID;
  chainId: ChainId;
  contractName: string;
  address: Address;
  verified: boolean;
  orgId?: UUID | null;
}
