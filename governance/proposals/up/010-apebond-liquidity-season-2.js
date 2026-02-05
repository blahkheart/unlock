/**
 * Season 2 — Sustainable $UP Liquidity via ICHI Vault
 * This proposal transfers UP from the DAO timelock to the DAO SAFE multisig on Base
 * to deepen liquidity in the ApeBond x ICHI strategy.
 *
 * UP token reference price at time of proposal: ~$0.002172 (Dec 19, 2025)
 * Target value: ~$16,000 in UP (~7,366,400 UP)
 **/
const { ethers } = require('hardhat')
const ERC20_ABI = require('@unlock-protocol/hardhat-helpers/dist/ABIs/erc20.json')
const { getTokenInfo } = require('@unlock-protocol/hardhat-helpers')

module.exports = async () => {
  // Base SAFE multisig for Unlock DAO
  const baseMultisigAddress = '0xf88e5D0A879a709d0B1cB794d5E0b8c61783cA10'

  // UP token on Base
  const upTokenAddress = '0xaC27fa800955849d6D17cC8952Ba9dD6EAA66187'
  const { decimals: tokenDecimals } = await getTokenInfo(upTokenAddress)

  // ~7,366,400 UP ≈ $16,000 at ~$0.002172 per UP
  const upTransferAmount = ethers.parseUnits('7366400', tokenDecimals)
  const upTransferAmountFormatted = '7,366,400'

  const calls = [
    {
      contractAddress: upTokenAddress,
      contractNameOrAbi: ERC20_ABI,
      functionName: 'transfer',
      functionArgs: [baseMultisigAddress, upTransferAmount],
      value: 0,
    },
  ]

  const proposalName = `# Season 2 — Sustainable $UP Liquidity via ICHI Vault

**Author:** Danny Thomx / Technology and Innovation Steward 
**Created:** December 16, 2025  

## Executive Summary

This proposal initiates "Season 2" of the ApeBond x ICHI liquidity strategy. Following the review of the "First Season" performance (Sep 2024 – Dec 2025), the DAO is choosing to double down on our automated liquidity position rather than unwind it.

We propose transferring approximately $16,000 USD worth of $UP tokens from the DAO Treasury to the DAO's SAFE multisig on Base and beginning research on a follow-up proposal template to withdraw ~$10 worth of WETH from the vault back to the DAO Treasury. This action is intended to reduce price impact (slippage) from the current ~5% to a target of 2–3%, further stabilizing token liquidity, creating a safer environment for new Liquidity Providers (LPs) to enter, and going full circle on the automated liquidity strategy.

## Motivation & Background

In September 2024, Unlock DAO partnered with ApeBond and ICHI Finance to establish sustainable, protocol-owned liquidity. The "First Season" concluded with a review call on December 10, 2025.

### The Current State

- The ICHI Vault is currently the source of the deepest liquidity for $UP on Base.  
- The vault utilizes automated liquidity management on Uniswap V3.  
- However, the current depth is insufficient for larger trades, resulting in a ~5% price impact (slippage). Buying $UP is currently more difficult than selling due to this illiquidity, which discourages new participants.

### The Decision

After the review, a hybrid approach is presented by the Council of Stewards:

1. **Add Liquidity:** Inject more $UP (~$16k) to deepen the pool and lower slippage.  
2. **Research Retrieving Liquidity:** Research the process and template for a later DAO proposal to retrieve a small amount of WETH (~$10) from the vault back to the DAO Treasury (going full circle on exploring the initiative).

## Implementation

On-chain, this proposal performs a single transfer of $UP from the DAO Timelock (Treasury) to the DAO’s SAFE multisig on Base. From there, DAO stewards can connect to ICHI and deposit into the ICHI Vault via the ICHI interface.

- **Asset:** $UP Token (Base)  
- **Source (Treasury / Timelock):** Unlock DAO Timelock  
- **Destination (DAO Multisig):** ${baseMultisigAddress}  
- **Value:** ≈ $16,000 USD  
- **Token Amount:** ${upTransferAmountFormatted} $UP (@ $0.002172 per $UP)

## Rationale

- **Reduced Slippage:** Targeting a reduction of price impact on trades to ~2–3%.  
- **Community Trust:** Deepening protocol-aligned liquidity and signaling long-term commitment.  
- **Attracting New LPs:** A deeper, more stable pool makes it safer and more attractive for new LPs to join.

## Supporting Documents

- ApeBond x ICHI Vaults — Season 1 Review: https://docs.google.com/document/d/1fTTxYr95ckomjOLqEz-UFNCQwtBROxoG8b5NbBm55iI/edit?tab=t.0#heading=h.cn6wrslzm8e4  
- Vault Metrics Dashboard: https://vaultmetrics.io/?vault_address=0xF349Fa49651d5ae67771B61840c4CCC7a2565764&chain_id=8453&days=180
`

  return { proposalName, calls }
}
