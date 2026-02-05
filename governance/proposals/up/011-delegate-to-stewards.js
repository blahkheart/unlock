/**
 * Delegate UP voting power to DAO stewards via MultiDelegator
 *
 * The MultiDelegator contract deploys a per-delegatee proxy for each
 * (owner, delegatee) pair and transfers tokens into it.  Voting power
 * flows to the delegatee while the DAO retains the ability to
 * undelegate at any time through a future proposal.
 *
 * Steps executed on-chain:
 *   1. Approve the MultiDelegator to spend the total delegation amount.
 *   2. For each steward, call delegate(address, amount) which moves
 *      tokens into the proxy and activates the delegation.
 *
 * ---------------------------------------------------------------------------
 * UPDATE BEFORE SUBMITTING:
 *   • DELEGATIONS — set each steward address and their UP amount (whole units)
 * ---------------------------------------------------------------------------
 */
const { ethers } = require('hardhat')
const ERC20_ABI = require('@unlock-protocol/hardhat-helpers/dist/ABIs/erc20.json')
const { getTokenInfo } = require('@unlock-protocol/hardhat-helpers')

// MultiDelegator contract on Base
const MULTI_DELEGATOR_ADDRESS = '0x72f43EF65660941c9DCDf8548b8dE249C4bdaf88'

// UP token on Base
const UP_TOKEN_ADDRESS = '0xaC27fa800955849d6D17cC8952Ba9dD6EAA66187'

const multiDelegatorInterface = new ethers.Interface([
  'function delegate(address to, uint256 amount)',
])

// ---------------------------------------------------------------------------
// Steward delegation targets.  Each entry specifies a steward wallet and the
// number of UP tokens (in whole units, e.g. '500000') to delegate to them.
// ---------------------------------------------------------------------------
const DELEGATIONS = [
  { address: '0x0000000000000000000000000000000000000001', amount: '100000' },
  { address: '0x0000000000000000000000000000000000000002', amount: '100000' },
  { address: '0x0000000000000000000000000000000000000003', amount: '100000' },
]

module.exports = async () => {
  const { decimals } = await getTokenInfo(UP_TOKEN_ADDRESS)

  const delegations = DELEGATIONS.map((d) => ({
    address: d.address,
    amount: ethers.parseUnits(d.amount, decimals),
  }))

  // Single approval covering every delegate() call in this proposal
  const totalAmount = delegations.reduce((sum, d) => sum + d.amount, 0n)

  const calls = [
    // 1. Approve MultiDelegator to pull tokens from the timelock
    {
      contractAddress: UP_TOKEN_ADDRESS,
      contractNameOrAbi: ERC20_ABI,
      functionName: 'approve',
      functionArgs: [MULTI_DELEGATOR_ADDRESS, totalAmount],
    },
    // 2. One delegate() call per steward
    ...delegations.map((d) => ({
      contractAddress: MULTI_DELEGATOR_ADDRESS,
      calldata: multiDelegatorInterface.encodeFunctionData('delegate', [
        d.address,
        d.amount,
      ]),
    })),
  ]

  // Build a human-readable delegation table for the proposal body
  const delegationRows = DELEGATIONS.map(
    (d) => `| \`${d.address}\` | ${Number(d.amount).toLocaleString()} |`
  ).join('\n')

  const proposalName = `# Delegate UP Voting Power to DAO Stewards

**Author:** Danny Thomx (Blahkheart)
**Created:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

## Executive Summary

This proposal delegates UP voting power from the DAO Treasury to a set of
designated stewards via the
[MultiDelegator](https://basescan.org/address/${MULTI_DELEGATOR_ADDRESS})
contract.  Each steward receives an independent delegation, and the DAO
retains full ownership of the underlying tokens — undelegation can be
executed through a future governance proposal at any time.

## Motivation

Governance participation requires active voting.  Delegating a portion of
the DAO's voting power to stewards allows experienced community members to
represent the DAO's interests in governance proceedings and seed
participation across the ecosystem, while keeping custody of the tokens
firmly in the Treasury.

## Implementation

The proposal executes the following on-chain steps:

1. **Approve** the MultiDelegator contract (\`${MULTI_DELEGATOR_ADDRESS}\`) to
   spend a total of **${Number(totalAmount / 10n ** BigInt(decimals)).toLocaleString()} UP** from the DAO
   Timelock.
2. **Delegate** to each steward individually.  The MultiDelegator deploys a
   lightweight proxy per delegation — the proxy holds the tokens and
   activates the ERC20Votes delegation in a single transaction.

### Delegation Table

| Steward Address | Amount (UP) |
|---|---|
${delegationRows}

**Total delegated:** ${Number(totalAmount / 10n ** BigInt(decimals)).toLocaleString()} UP

## Reversal

Delegations can be fully reversed at any time by submitting a new proposal
that calls \`undelegate(address)\` on the MultiDelegator for each steward.
No tokens leave the DAO's control.

## References

- MultiDelegator contract: \`${MULTI_DELEGATOR_ADDRESS}\`
- UP token: \`${UP_TOKEN_ADDRESS}\`
`

  return { proposalName, calls }
}
