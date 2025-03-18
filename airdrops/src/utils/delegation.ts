import { ethers } from 'ethers'

export const hasDelegated = async (
  address: string,
  tokenAddress: string,
  chainId: number
): Promise<boolean> => {
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://rpc.unlock-protocol.com/${chainId}`
    )
    const delegationAbi = ['function delegates(address) view returns (address)']
    const tokenContract = new ethers.Contract(
      tokenAddress,
      delegationAbi,
      provider
    )
    const delegate = await tokenContract.delegates(address)
    return delegate !== ethers.ZeroAddress
  } catch (error) {
    console.error('Error checking delegation status:', error)
    return false
  }
}
