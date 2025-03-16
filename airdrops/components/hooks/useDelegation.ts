import { ethers } from 'ethers'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useQuery } from '@tanstack/react-query'
import { AirdropData } from '../Campaigns'
import { isEligible } from '../../src/utils/eligibility'
import { hasClaimed } from '../CampaignDetailContent'

// Function to check if an address has delegated their tokens
async function hasDelegated(
  address: string,
  tokenAddress: string,
  chainId: number
) {
  try {
    // Connect to the network
    const provider = new ethers.JsonRpcProvider(
      `https://rpc.unlock-protocol.com/${chainId}`
    )

    // ERC20 token with delegation (like UP token)
    const delegationAbi = ['function delegates(address) view returns (address)']

    const tokenContract = new ethers.Contract(
      tokenAddress,
      delegationAbi,
      provider
    )

    // Get the delegate of the address
    const delegate = await tokenContract.delegates(address)

    // If the address hasn't delegated, the delegate will be the zero address
    return delegate !== ethers.ZeroAddress
  } catch (error) {
    console.error('Error checking delegation status:', error)
    return false
  }
}

export function useDelegation(airdrop: AirdropData) {
  const { authenticated } = usePrivy()
  const { wallets } = useWallets()

  return useQuery({
    queryKey: ['useDelegation', wallets, airdrop],
    queryFn: async () => {
      const address = wallets[0].address

      // Check if user is eligible and the amount
      const eligibleAmount = await isEligible(address, airdrop)

      // Check if already claimed
      const alreadyClaimed =
        eligibleAmount !== '0'
          ? await hasClaimed(address, eligibleAmount, airdrop)
          : false

      // Check delegation status if eligible
      const delegationStatus =
        eligibleAmount !== '0'
          ? await hasDelegated(
              address,
              airdrop.token?.address || '',
              airdrop.chainId
            )
          : false

      // User can claim if eligible, not claimed, and has delegated
      const canClaim =
        eligibleAmount !== '0' && !alreadyClaimed && delegationStatus

      return {
        eligible: eligibleAmount,
        claimed: alreadyClaimed,
        hasDelegated: delegationStatus,
        canClaim,
      }
    },
    initialData: {
      eligible: '0',
      claimed: false,
      hasDelegated: false,
      canClaim: false,
    },
    enabled: !!(authenticated && wallets?.[0]),
    refetchOnWindowFocus: false,
  })
}
