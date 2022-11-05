// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./interfaces/IVerificationResistory.sol";
import "./WorldIDVerifier.sol";

contract VerificationResistory is IVerificationResistory, WorldIDVerifier {
  constructor(IWorldID _worldId, string memory _actionId) WorldIDVerifier(_worldId, _actionId) {}

  mapping(address => mapping(ProofType => bool)) internal _isVerified;

  function verify(ProofType proofType, bytes memory data) public override {
    if (proofType == ProofType.WorldId) {
      (address input, uint256 root, uint256 nullifierHash, uint256[8] memory proof) = abi.decode(
        data,
        (address, uint256, uint256, uint256[8])
      );
      _verifyByWorldId(input, root, nullifierHash, proof);
    } else if (proofType == ProofType.PolygonId) {
      //TODO: integrate polygon ID
    }
  }

  function isVerified(address sub, ProofType proofType) public view override returns (bool) {
    return _isVerified[sub][proofType];
  }
}
