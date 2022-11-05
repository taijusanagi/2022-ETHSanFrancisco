// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IVerificationResistory {
  enum ProofType {
    WorldId,
    PolygonId
  }

  event Verified(address sub, ProofType proofType);

  function verify(ProofType proofType, bytes memory data) external;

  function isVerified(address sub, ProofType proofType) external view returns (bool);
}
