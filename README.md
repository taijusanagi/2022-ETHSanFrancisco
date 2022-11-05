# 2022-ETHSanFrancisco

## Contracts

This is an NFT marketplace contract that integrates an identity-proof verification

For this hackathon, selected identity-proof providers are

- Worldcoin
- Polygon ID

### Worldcoin

- This contract verifies the proof generated by Worldcoin, it enables users to sell NFT only to humans, not bots.
- The main reference of this implementation is the following.
  - https://github.com/worldcoin/world-id-starter-hardhat/blob/main/contracts/Contract.sol

### Polygon ID

- This contract verifies the proof generated by Polygon ID, it enables users to sell NFT only to those who have specified credentials, such as certain DAO members.
- The main reference of this implementation is the following.
  - https://wiki.polygon.technology/docs/polygonid/verifier/on-chain-verification/overview

## App

This is a simple NFT marketplace frontend.

The above identity-proof verification is integrated with the selling/buying process.
