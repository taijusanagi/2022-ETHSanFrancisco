/* eslint-disable camelcase */
import fs from "fs";
import { ethers } from "hardhat";
import path from "path";

import { VerificationResistory__factory } from "../typechain-types";
import { DeterministicDeployer } from "./helpers/DeterministicDeployer";

async function main() {
  // this is obtained from
  // https://developer.worldcoin.org/
  const worldIDAddress = "0xABB70f7F39035586Da57B3c8136035f87AC0d2Aa";
  const actionId = "wid_staging_17c2f1a21976f1848a55ff7fdde682a0";

  const argument = ethers.utils.defaultAbiCoder.encode(["address", "string"], [worldIDAddress, actionId]);
  const verificationResistory__factoryCreationCode = ethers.utils.solidityPack(
    ["bytes", "bytes"],
    [VerificationResistory__factory.bytecode, argument]
  );
  const verificationResistory = await DeterministicDeployer.deploy(verificationResistory__factoryCreationCode);
  const result = {
    verificationResistory,
  };
  fs.writeFileSync(path.join(__dirname, `../deployments.json`), JSON.stringify(result));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
