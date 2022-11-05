/* eslint-disable camelcase */
import { defaultAbiCoder as abi } from "@ethersproject/abi";
import { ethers } from "ethers";

import deployments from "../../../../contracts/deployments.json";
import { VerificationResistory, VerificationResistory__factory } from "../../../../contracts/typechain-types";

export class Contract {
  signer: ethers.Signer;
  verificationResistory: VerificationResistory;
  constructor(signer: ethers.Signer) {
    this.signer = signer;
    this.verificationResistory = VerificationResistory__factory.connect(deployments.verificationResistory, signer);
  }

  verify = async (type: string, data: string) => {
    this.verificationResistory.verify(type, data);
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
