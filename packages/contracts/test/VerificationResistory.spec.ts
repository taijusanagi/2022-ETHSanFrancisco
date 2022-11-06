import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import { getProof, getRoot, prepareWorldID, registerIdentity, setUpWorldID } from "./helpers/InteractsWithWorldID";

// try to focus on positive test case for the hackathon
describe("VerificationResistory", function () {
  const ACTION_ID = "wid_test_1234";
  let verificationResistory: Contract;
  let callerAddr: string;

  this.beforeAll(async () => {
    await prepareWorldID();
  });

  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    const worldIDAddress = await setUpWorldID();
    const VerificationResistory = await ethers.getContractFactory("VerificationResistory");
    verificationResistory = await VerificationResistory.deploy(worldIDAddress, ACTION_ID);
    await verificationResistory.deployed();
    callerAddr = await signer.getAddress();
  });

  describe("world id verification", function () {
    it("Should work", async function () {
      await registerIdentity();
      const [nullifierHash, proof] = await getProof(ACTION_ID, callerAddr);
      const tx = await verificationResistory.verifyWithWorldId(callerAddr, await getRoot(), nullifierHash, proof);
      await tx.wait();
      expect(await verificationResistory.isVerified(callerAddr, "0")).to.be.eq(true);
    });
  });
});
