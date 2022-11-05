// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./WorldIDVerifier.sol";

contract VerifiableNFTMarketplace is WorldIDVerifier {
  event Fulfilled();

  enum ProofType {
    None,
    WorldId,
    PolygonId
  }

  constructor(IWorldID _worldId, string memory _actionId) WorldIDVerifier(_worldId, _actionId) {}

  function fulfill(ProofType proofType, bytes memory data) public {
    if (proofType == ProofType.WorldId) {
      (address input, uint256 root, uint256 nullifierHash, uint256[8] memory proof) = abi.decode(
        data,
        (address, uint256, uint256, uint256[8])
      );
      _verifyByWorldId(input, root, nullifierHash, proof);
    } else if (proofType == ProofType.PolygonId) {
      //TODO: integrate polygon ID
    }
    emit Fulfilled();
  }
}
