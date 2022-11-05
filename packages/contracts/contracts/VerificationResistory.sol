// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./interfaces/IVerificationResistory.sol";
import "./WorldIDVerifier.sol";

contract VerificationResistory is IVerificationResistory, WorldIDVerifier {
  constructor(IWorldID _worldId, string memory _actionId) WorldIDVerifier(_worldId, _actionId) {}

  mapping(address => mapping(ProofType => bool)) internal _isVerified;

  function verify(ProofType proofType, bytes memory data) public override {
    address sub;
    if (proofType == ProofType.WorldId) {
      (address input, uint256 root, uint256 nullifierHash, uint256[8] memory proof) = abi.decode(
        data,
        (address, uint256, uint256, uint256[8])
      );
      _verifyByWorldId(input, root, nullifierHash, proof);
      sub = input;
    } else if (proofType == ProofType.PolygonId) {
      //TODO: integrate polygon ID
    }
    require(!_isVerified[sub][proofType], "VerificationResistory: already verified");
    _isVerified[sub][proofType] = true;
    emit Verified(sub, proofType);
  }

  function isVerified(address sub, ProofType proofType) public view override returns (bool) {
    return _isVerified[sub][proofType];
  }

  function encodeWorldIdProof(
    address input,
    uint256 root,
    uint256 nullifierHash,
    uint256[8] memory proof
  ) public pure returns (bytes memory) {
    return abi.encode(input, root, nullifierHash, proof);
  }
}
