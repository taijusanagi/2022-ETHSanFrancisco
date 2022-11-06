/* eslint-disable camelcase */
import fs from "fs";
import { ethers } from "hardhat";
import path from "path";

const hexToBytes = (hex: string) => {
  // eslint-disable-next-line no-var
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    /**
     * @dev parseInt 16 = parsed as a hexadecimal number
     */
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
};

const fromLittleEndian = (bytes: number[]) => {
  const n256 = BigInt(256);
  let result = BigInt(0);
  let base = BigInt(1);
  bytes.forEach((byte) => {
    result += base * BigInt(byte);
    base = base * n256;
  });
  return result;
};

async function main() {
  /*
   * world id
   */
  // this is obtained from
  // https://developer.worldcoin.org/
  const worldIDAddress = "0xABB70f7F39035586Da57B3c8136035f87AC0d2Aa";
  const actionId = "wid_staging_17c2f1a21976f1848a55ff7fdde682a0";

  /*
   * deployment
   */
  const VerificationResistory = await ethers.getContractFactory("VerificationResistory");
  const verificationResistory = await VerificationResistory.deploy(worldIDAddress, actionId);
  console.log("contract deployed at", verificationResistory.address);
  const result = {
    verificationResistory: verificationResistory.address,
  };
  fs.writeFileSync(path.join(__dirname, `../deployments.json`), JSON.stringify(result));

  /*
   * polygon id
   * this is set after deployement
   * copied from
   * https://github.com/codingwithmanny/polygonid-on-chain-verification/blob/main/scripts/erc20ZkpRequest.ts
   * modified with
   * https://github.com/codingwithmanny/polygonid-on-chain-verification
   */
  // Main scope circuit identifier supported
  // - avoid changing as it's currently the only one supported
  const circuitId = "credentialAtomicQuerySig";

  // Main validator address on mumbai - https://mumbai.polygonscan.com/address/0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB#code
  // - do not change for testnet
  const validatorAddress = "0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB";

  // CHANGE THESE
  // Schema has provided by the issuer
  // - typically found in https://platform-test.polygonid.com/claiming/created-schemas

  // ChiroProtect schema hash
  const schemaHash = "5870bca071b968ad8b755ee82a74fa96"; // extracted from PID Platform

  const schemaEnd = fromLittleEndian(hexToBytes(schemaHash));
  const query = {
    schema: ethers.BigNumber.from(schemaEnd),
    slotIndex: 2, // slotIndex2 indicates the value stored as Attribute 1 inside the claim
    operator: 1,
    // 20020101 refers to the numerical date we're using for our proof request
    // - see proofRequest.ts L489
    value: [1, ...new Array(63).fill(0).map((i) => 0)], // the value must be 1 = true
    circuitId,
  };

  /*
   * polygon id setup after deployment
   */

  try {
    // Use as a means to keep track in the contract for number of mints a person can perform from a specific wallet address
    const requestId = await verificationResistory.TRANSFER_REQUEST_ID();
    const tx = await verificationResistory.setZKPRequest(
      requestId, // 1
      validatorAddress,
      query
    );
    await tx.wait();
    console.log(
      `Request set at:\nNOTE: May take a little bit to show up\nhttps://mumbai.polygonscan.com/tx/${tx.hash}`
    );
  } catch (e) {
    console.error("Error: ", e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
