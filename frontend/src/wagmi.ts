import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "BlockVote",
  projectId: "a8b4aff6778bc3142e21f849a0c767cb",
  chains: [hardhat],

  ssr: true,
});
