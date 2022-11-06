/* eslint-disable camelcase */
import { defaultAbiCoder as abi } from "@ethersproject/abi";
import { ethers } from "ethers";

import deployments from "../../../../contracts/deployments.json";
import { VerificationResistory, VerificationResistory__factory } from "../../../../contracts/typechain-types";

export const verificationType = {
  worldId: "0",
  polygonId: "1",
};

export class Contract {
  verificationResistory: VerificationResistory;
  constructor(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
    this.verificationResistory = VerificationResistory__factory.connect(
      deployments.verificationResistory,
      signerOrProvider
    );
  }

  verifyWithWorldId = async (input: string, root: string, nullifierHash: string, proof: string) => {
    return this.verificationResistory.verifyWithWorldId(
      input,
      root,
      nullifierHash,
      abi.decode(["uint256[8]"], proof)[0]
    );
  };

  isVerified = async (type: string, sub: string) => {
    return this.verificationResistory.isVerified(sub, type);
  };
}
