import type { Account } from "@/types/interfaces/Account";
import type { Organization } from "@/types/interfaces/Organization";
import type { Wallet } from "@/types/interfaces/Wallet";
import type { UUID } from "@/types/primitives/UUID";

type StoredAccount = Account & {
  privyUserId: string;
};

type StoredOrganization = Organization & {
  ownerAccountId: UUID;
};

type StoredWallet = Wallet;

type AuthStoreShape = {
  accountsByPrivyId: Map<string, StoredAccount>;
  organizationsByOrgId: Map<UUID, StoredOrganization>;
  walletsByWalletId: Map<UUID, StoredWallet>;
  walletIdsByAddress: Map<string, UUID>;
  organizationMemberships: Map<UUID, Set<UUID>>;
};

const GLOBAL_STORE_KEY = Symbol.for("paynote.auth-store");

function initStore(): AuthStoreShape {
  return {
    accountsByPrivyId: new Map(),
    organizationsByOrgId: new Map(),
    organizationMemberships: new Map(),
    walletsByWalletId: new Map(),
    walletIdsByAddress: new Map(),
  };
}

function getStore(): AuthStoreShape {
  const globalSymbolRegistry = globalThis as typeof globalThis & {
    [GLOBAL_STORE_KEY]?: AuthStoreShape;
  };

  if (!globalSymbolRegistry[GLOBAL_STORE_KEY]) {
    globalSymbolRegistry[GLOBAL_STORE_KEY] = initStore();
  }

  return globalSymbolRegistry[GLOBAL_STORE_KEY]!;
}

export function findAccountByPrivyId(privyUserId: string) {
  const store = getStore();
  return store.accountsByPrivyId.get(privyUserId);
}

export function saveAccount(account: Account, privyUserId: string) {
  const store = getStore();
  const storedAccount: StoredAccount = {
    ...account,
    privyUserId,
  };

  store.accountsByPrivyId.set(privyUserId, storedAccount);

  const memberships =
    store.organizationMemberships.get(account.accountId) ?? new Set<UUID>();
  memberships.add(account.orgId);
  store.organizationMemberships.set(account.accountId, memberships);

  return storedAccount;
}

export function updateAccountDefaultWallet(accountId: UUID, walletId: UUID | null) {
  const store = getStore();

  for (const [privyUserId, account] of store.accountsByPrivyId.entries()) {
    if (account.accountId === accountId) {
      const updated: StoredAccount = {
        ...account,
        defaultWalletId: walletId,
      };
      store.accountsByPrivyId.set(privyUserId, updated);
      return updated;
    }
  }

  return undefined;
}

export function saveOrganization(organization: Organization, ownerAccountId: UUID) {
  const store = getStore();
  const storedOrganization: StoredOrganization = {
    ...organization,
    ownerAccountId,
  };

  store.organizationsByOrgId.set(organization.orgId, storedOrganization);

  let memberships = store.organizationMemberships.get(ownerAccountId);
  if (!memberships) {
    memberships = new Set();
    store.organizationMemberships.set(ownerAccountId, memberships);
  }

  memberships.add(organization.orgId);

  return storedOrganization;
}

export function listOrganizationsForAccount(accountId: UUID): Organization[] {
  const store = getStore();
  const memberships = store.organizationMemberships.get(accountId);

  if (!memberships?.size) {
    return [];
  }

  const organizations: Organization[] = [];
  for (const orgId of memberships.values()) {
    const organization = store.organizationsByOrgId.get(orgId);
    if (organization) {
      organizations.push(organization);
    }
  }

  return organizations;
}

export function saveWallet(wallet: Wallet) {
  const store = getStore();
  store.walletsByWalletId.set(wallet.walletId, wallet);
  store.walletIdsByAddress.set(wallet.address.toLowerCase(), wallet.walletId);
  return wallet;
}

export function findWalletById(walletId: UUID) {
  const store = getStore();
  return store.walletsByWalletId.get(walletId);
}

export function findWalletByAddress(address: string) {
  const store = getStore();
  const walletId = store.walletIdsByAddress.get(address.toLowerCase());
  return walletId ? store.walletsByWalletId.get(walletId) : undefined;
}

export function listWalletsForAccount(accountId: UUID): Wallet[] {
  const store = getStore();
  const wallets: Wallet[] = [];

  for (const wallet of store.walletsByWalletId.values()) {
    if (wallet.ownerAccountId === accountId) {
      wallets.push(wallet);
    }
  }

  return wallets;
}
