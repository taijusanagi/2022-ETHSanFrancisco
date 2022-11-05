import "@nomicfoundation/hardhat-toolbox";
import "hardhat-dependency-compiler";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  dependencyCompiler: {
    paths: ["@appliedzkp/semaphore-contracts/base/Verifier.sol", "@worldcoin/world-id-contracts/src/Semaphore.sol"],
  },
};

export default config;
