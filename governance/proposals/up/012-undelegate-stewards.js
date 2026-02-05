/**
 * Undelegate UP voting power from DAO stewards via MultiDelegator
 *
 * Each Delegate proxy approved the timelock for type(uint).max at deploy
 * time, so no prior approve call is needed — undelegate() pulls the full
 * proxy balance back to the timelock in a single call per steward.
 *
 * ---------------------------------------------------------------------------
 * UPDATE BEFORE SUBMITTING:
 *   • STEWARDS — must match the addresses that were delegated in 010
 * ---------------------------------------------------------------------------
 */
const { ethers } = require('hardhat')

// MultiDelegator contract on Base
const MULTI_DELEGATOR_ADDRESS = '0x72f43EF65660941c9DCDf8548b8dE249C4bdaf88'

// DAO Timelock (executes the proposal — owner in the MultiDelegator mapping)
const TIMELOCK_ADDRESS = '0xB34567C4cA697b39F72e1a8478f285329A98ed1b'

const multiDelegatorInterface = new ethers.Interface([
  'function undelegate(address delegatee)',
  'function getDelegateContractAddress(address owner, address delegatee) external view returns (address)',
])

// Stewards to undelegate
const STEWARDS = [
  '0x0000000000000000000000000000000000000001',
  '0x0000000000000000000000000000000000000002',
  '0x0000000000000000000000000000000000000003',
]

module.exports = async () => {
  const multiDelegator = await ethers.getContractAt(
    multiDelegatorInterface.fragments,
    MULTI_DELEGATOR_ADDRESS
  )

  // Filter to only stewards that have an active delegation from the timelock
  const active = []
  for (const address of STEWARDS) {
    const proxy = await multiDelegator.getDelegateContractAddress(
      TIMELOCK_ADDRESS,
      address
    )
    if (proxy === ethers.ZeroAddress) {
      console.log(`No delegation exists for address ${address} — skipping`)
      continue
    }
    console.log(`Active delegation found for ${address} (proxy: ${proxy})`)
    active.push(address)
  }

  if (active.length === 0) {
    throw new Error(
      'No active delegations found for any of the steward addresses. Nothing to undelegate.'
    )
  }

  const calls = active.map((address) => ({
    contractAddress: MULTI_DELEGATOR_ADDRESS,
    calldata: multiDelegatorInterface.encodeFunctionData('undelegate', [
      address,
    ]),
  }))

  const stewardRows = active.map((address) => `| \`${address}\` |`).join('\n')

  const proposalName = `# Undelegate UP Voting Power from DAO Stewards

**Author:** Danny Thomx (Blahkheart)
**Created:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

## Executive Summary

This proposal revokes the voting-power delegations established in
[010 — Delegate UP Voting Power to DAO Stewards](https://basescan.org/address/${MULTI_DELEGATOR_ADDRESS}).
For each steward, the full token balance held in their delegation proxy is
returned to the DAO Timelock in a single call.

## Implementation

No token approval is required.  Each delegation proxy granted the Timelock
an unlimited allowance at deploy time, so \`undelegate(address)\` transfers
the entire proxy balance back in one step.

The proposal executes one \`undelegate()\` call per steward:

| Steward Address |
|---|
${stewardRows}

## References

- MultiDelegator contract: \`${MULTI_DELEGATOR_ADDRESS}\`
- Original delegation proposal: 010-delegate-to-stewards
`

  return { proposalName, calls }
}
