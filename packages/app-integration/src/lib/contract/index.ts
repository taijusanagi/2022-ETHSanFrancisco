/* eslint-disable camelcase */
import { defaultAbiCoder as abi } from "@ethersproject/abi";
import { ethers } from "ethers";

import deployments from "../../../../contracts/deployments.json";
import { VerificationResistory, VerificationResistory__factory } from "../../../../contracts/typechain-types";

export const verificationType = {
  worldId: "0",
};

export class Contract {
  verificationResistory: VerificationResistory;
  constructor(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
    this.verificationResistory = VerificationResistory__factory.connect(
      deployments.verificationResistory,
      signerOrProvider
    );
  }

  verify = async (type: string, data: string) => {
    return this.verificationResistory.verify(type, data);
  };

  isVerified = async (type: string, sub: string) => {
    return this.verificationResistory.isVerified(sub, type);
  };

  encodeWorldIdProof = (input: string, root: string, nullifierHash: string, proof: string) => {
    return this.verificationResistory.encodeWorldIdProof(
      input,
      root,
      nullifierHash,
      abi.decode(["uint256[8]"], proof)[0]
    );
  };
}
