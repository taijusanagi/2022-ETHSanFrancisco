import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import {
  getProof,
  getRoot,
  prepareWorldID,
  registerIdentity,
  registerInvalidIdentity,
  setUpWorldID,
} from "./helpers/InteractsWithWorldID";

const ACTION_ID = "wid_test_1234";

describe("WorldIDVerifier", function () {
  let worldID: Contract;
  let testWorldIDVerifier: Contract;
  let callerAddr: string;

  this.beforeAll(async () => {
    await prepareWorldID();
  });

  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    const worldIDAddress = await setUpWorldID();
    // this is added for check custom error
    worldID = await ethers.getContractAt("Semaphore", worldIDAddress);
    const TestWorldIDVerifierFactory = await ethers.getContractFactory("TestWorldIDVerifier");
    testWorldIDVerifier = await TestWorldIDVerifierFactory.deploy(worldIDAddress, ACTION_ID);
    await testWorldIDVerifier.deployed();
    callerAddr = await signer.getAddress();
  });

  describe("verify", function () {
    it("Should work", async function () {
      await registerIdentity();
      const [nullifierHash, proof] = await getProof(ACTION_ID, callerAddr);
      const tx = await testWorldIDVerifier.verify(callerAddr, await getRoot(), nullifierHash, proof);
      await tx.wait();
    });

    it("Should not work", async function () {
      await registerInvalidIdentity();
      const [nullifierHash, proof] = await getProof(ACTION_ID, callerAddr);
      // sample code is not working, so modified to check custom error
      await expect(
        testWorldIDVerifier.verify(callerAddr, await getRoot(), nullifierHash, proof)
      ).to.be.revertedWithCustomError(worldID, "InvalidProof");
    });
  });
});
