// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "on-chain-verification-test/contracts/verifiers/ZKPVerifier.sol";
import "on-chain-verification-test/contracts/interfaces/ICircuitValidator.sol";
import "on-chain-verification-test/contracts/lib/GenesisUtils.sol";

import "./lib/WorldIDVerifier.sol";

/*
 * definition order is as the following
 * 1. common
 * 2. world id integration
 * 3. polygon id integration
 */
contract VerificationResistory is WorldIDVerifier, ZKPVerifier {
  /* ====================
   * enum, event, storage
   * ====================
   * / 

  /*
   * common
   */
  enum ProofType {
    WorldId,
    PolygonId
  }
  event Verified(address sub, ProofType proofType);
  mapping(address => mapping(ProofType => bool)) internal _isVerified;

  /*
   * polygon id
   */
  uint64 public constant TRANSFER_REQUEST_ID = 1;

  /* ====================
   * constructor
   * ====================
   */
  constructor(IWorldID _worldId, string memory _actionId) WorldIDVerifier(_worldId, _actionId) {}

  /* ====================
   * functions
   * ====================
   */

  /*
   * common
   */

  function isVerified(address sub, ProofType proofType) public view returns (bool) {
    return _isVerified[sub][proofType];
  }

  function _verify(address sub, ProofType proofType) internal {
    require(!_isVerified[sub][proofType], "VerificationResistory: already verified");
    _isVerified[sub][proofType] = true;
    emit Verified(sub, proofType);
  }

  /*
   * world id integration
   */
  function verifyWithWorldId(address sub, uint256 root, uint256 nullifierHash, uint256[8] memory proof) public {
    require(_msgSender() == sub, "VerificationResistory: sender invalid");
    _verifyByWorldId(sub, root, nullifierHash, proof);
    _verify(sub, ProofType.WorldId);
  }

  /*
   * polygon id integration
   */
  function _beforeProofSubmit(
    uint64 /* requestId */,
    uint256[] memory inputs,
    ICircuitValidator validator
  ) internal view override {
    // check that challenge input of the proof is equal to the msg.sender
    address addr = GenesisUtils.int256ToAddress(inputs[validator.getChallengeInputIndex()]);
    require(_msgSender() == addr, "VerificationResistory: sender invalid");
  }

  function _afterProofSubmit(uint64 requestId, uint256[] memory inputs, ICircuitValidator validator) internal override {
    address sub = _msgSender();
    require(requestId == TRANSFER_REQUEST_ID, "VerificationResistory: reuqest id invalid");
    require(!_isVerified[sub][ProofType.PolygonId], "VerificationResistory: already verified");
    _verify(sub, ProofType.PolygonId);
  }
}
