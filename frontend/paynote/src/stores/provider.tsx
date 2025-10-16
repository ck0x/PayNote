"use client";
import React from "react";
import { rootStore, RootStore } from "./root.store";

const StoreCtx = React.createContext<RootStore>(rootStore);
export const useStore = () => React.useContext(StoreCtx);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <StoreCtx.Provider value={rootStore}>{children}</StoreCtx.Provider>;
}
