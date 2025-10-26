import { makeAutoObservable, flow, runInAction } from "mobx";
import { api } from "@/api";
import type { Organization } from "@/types/interfaces/Organization";
import type { Account } from "@/types/interfaces/Account";
import type { UUID } from "@/types/primitives/UUID";
import type { OrganizationCreate } from "@/api/types/requests";

export class OrganizationStore {
  currentOrg: Organization | null = null;
  currentAccount: Account | null = null;
  organizations: Organization[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {
      fetchOrganizations: flow,
      createOrganization: flow,
      switchOrganization: flow,
    });
    this.loadFromLocalStorage();
  }

  // Load saved organization ID from localStorage
  private loadFromLocalStorage() {
    if (typeof window === "undefined") return;
    const savedOrgId = localStorage.getItem("currentOrgId");
    if (savedOrgId) {
      // Will be loaded when fetchOrganizations is called
      console.log("Saved org ID:", savedOrgId);
    }
  }

  // Save current organization ID to localStorage
  private saveToLocalStorage() {
    if (typeof window === "undefined") return;
    if (this.currentOrg) {
      localStorage.setItem("currentOrgId", this.currentOrg.orgId);
    } else {
      localStorage.removeItem("currentOrgId");
    }
  }

  setCurrentOrg(org: Organization | null) {
    this.currentOrg = org;
    this.saveToLocalStorage();
  }

  setCurrentAccount(account: Account | null) {
    this.currentAccount = account;
  }

  // Fetch all organizations for the current user
  *fetchOrganizations(userEmail?: string) {
    console.log("OrganizationStore.fetchOrganizations - Start", { userEmail });
    this.isLoading = true;
    this.error = null;

    try {
      const response: Organization[] = yield api.organizations.list();
      const organizations = Array.isArray(response) ? response : [];

      console.log("OrganizationStore.fetchOrganizations - Response", {
        count: organizations.length,
        organizations: organizations.map((o) => ({
          id: o.orgId,
          name: o.name,
        })),
      });

      runInAction(() => {
        this.organizations = organizations;

        // Set initial organization
        const savedOrgId =
          typeof window !== "undefined"
            ? localStorage.getItem("currentOrgId")
            : null;
        const initialOrg =
          organizations.find((o) => o.orgId === savedOrgId) ||
          organizations[0] ||
          null;

        console.log("OrganizationStore.fetchOrganizations - Initial org", {
          savedOrgId,
          initialOrg: initialOrg
            ? { id: initialOrg.orgId, name: initialOrg.name }
            : null,
        });

        if (initialOrg) {
          // Don't await, just trigger switch
          this.switchOrganization(initialOrg.orgId, userEmail);
        }
      });
    } catch (err) {
      console.error("OrganizationStore.fetchOrganizations - Error", err);
      runInAction(() => {
        this.error =
          err instanceof Error ? err.message : "Failed to load organizations";
        console.error("Failed to fetch organizations:", err);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
        console.log("OrganizationStore.fetchOrganizations - Complete", {
          organizationsCount: this.organizations.length,
          currentOrg: this.currentOrg
            ? { id: this.currentOrg.orgId, name: this.currentOrg.name }
            : null,
          isLoading: this.isLoading,
          error: this.error,
        });
      });
    }
  }

  // Create a new organization
  *createOrganization(data: OrganizationCreate, userEmail?: string) {
    console.log("OrganizationStore.createOrganization - Start", {
      data,
      userEmail,
    });
    this.isLoading = true;
    this.error = null;

    try {
      const newOrg: Organization = yield api.organizations.create(data);
      console.log("OrganizationStore.createOrganization - Created", {
        id: newOrg.orgId,
        name: newOrg.name,
      });

      runInAction(() => {
        // Add to organizations list
        this.organizations.push(newOrg);
        console.log("OrganizationStore.createOrganization - Added to list", {
          totalCount: this.organizations.length,
        });
        this.isLoading = false;
      });

      // Switch to the new organization
      console.log(
        "OrganizationStore.createOrganization - Switching to new org"
      );
      yield this.switchOrganization(newOrg.orgId, userEmail);

      console.log("OrganizationStore.createOrganization - Complete", {
        currentOrg: this.currentOrg
          ? { id: this.currentOrg.orgId, name: this.currentOrg.name }
          : null,
        organizationsCount: this.organizations.length,
      });

      return newOrg;
    } catch (err) {
      console.error("OrganizationStore.createOrganization - Error", err);
      runInAction(() => {
        this.error =
          err instanceof Error ? err.message : "Failed to create organization";
        this.isLoading = false;
      });
      throw err;
    }
  }

  // Switch to a different organization
  *switchOrganization(orgId: UUID, userEmail?: string) {
    this.error = null;

    try {
      const org: Organization = yield api.organizations.get(orgId);

      runInAction(() => {
        this.currentOrg = org;
        this.saveToLocalStorage();
      });

      // Fetch accounts for this organization
      const accountsResponse: Account[] = yield api.organizations.listAccounts(
        orgId
      );
      const accounts = Array.isArray(accountsResponse) ? accountsResponse : [];

      const userAccount = userEmail
        ? accounts.find((acc) => acc.email === userEmail)
        : accounts[0];

      runInAction(() => {
        this.currentAccount = userAccount || null;
      });
    } catch (err) {
      runInAction(() => {
        this.error =
          err instanceof Error ? err.message : "Failed to switch organization";
        console.error("Failed to switch organization:", err);
      });
      throw err;
    }
  }

  // Refresh organizations list
  *refreshOrganizations() {
    this.error = null;

    try {
      const response: Organization[] = yield api.organizations.list();
      const organizations = Array.isArray(response) ? response : [];

      runInAction(() => {
        this.organizations = organizations;
      });
    } catch (err) {
      runInAction(() => {
        this.error =
          err instanceof Error
            ? err.message
            : "Failed to refresh organizations";
        console.error("Failed to refresh organizations:", err);
      });
      throw err;
    }
  }

  // Permission helpers
  get isOwner() {
    return this.currentAccount?.role === "Owner";
  }

  get isAdmin() {
    return (
      this.currentAccount?.role === "Owner" ||
      this.currentAccount?.role === "Admin"
    );
  }

  get canManageMembers() {
    return this.isAdmin;
  }

  get canManageSettings() {
    return this.isOwner;
  }

  // Reset store
  reset() {
    this.currentOrg = null;
    this.currentAccount = null;
    this.organizations = [];
    this.isLoading = false;
    this.error = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentOrgId");
    }
  }
}
