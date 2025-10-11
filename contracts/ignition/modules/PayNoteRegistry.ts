import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PayNoteRegistryModule = buildModule("PayNoteRegistryModule", (m) => {
  // Get the deployer account - it will be the initial owner
  const deployer = m.getAccount(0);

  // Deploy the PayNoteRegistry with the deployer as the initial owner
  const payNoteRegistry = m.contract("PayNoteRegistry", [deployer]);

  return { payNoteRegistry };
});

export default PayNoteRegistryModule;
