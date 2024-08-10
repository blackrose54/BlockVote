import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const VotingModule = buildModule("VotingModule", (m) => {
 
  const lock = m.contract("Voting");

  return { lock };
});

export default VotingModule;
