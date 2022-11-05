// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
 * This is for unit testing of WorldIDVerifier.sol
 */

import "../WorldIDVerifier.sol";

contract TestWorldIDVerifier is WorldIDVerifier {
  constructor(IWorldID _worldId, string memory _actionId) WorldIDVerifier(_worldId, _actionId) {}

  function verify(address input, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public {
    _verify(input, root, nullifierHash, proof);
  }

  function getNullifierHashes(uint256 getNullifierHash) public view returns (bool) {
    return nullifierHashes[getNullifierHash];
  }
}