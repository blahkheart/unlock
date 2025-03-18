import { AirdropData } from '../../components/Campaigns'

// Environment flag for development mode - set this to true for testing
const DEV_MODE = true
// Amount to return in dev mode (100 tokens with 18 decimals)
const DEV_AMOUNT = '100000000000000000000'

/**
 * Checks if an address is eligible for an airdrop and returns the token amount
 * Fetches the recipients file and checks if the address exists in it
 * In dev mode, always returns the test amount
 */
export const isEligible = async (
  address: string,
  airdrop: AirdropData
): Promise<string> => {
  // If in dev mode, always return a fixed amount
  if (DEV_MODE) {
    console.log('🧪 DEV MODE: Treating all addresses as eligible')
    return DEV_AMOUNT
  }

  if (!airdrop.recipientsFile || !address) {
    return '0'
  }

  const request = await fetch(airdrop.recipientsFile)
  const recipients = await request.json()
  const recipient = recipients.values.find((recipient: any) => {
    return recipient.value[0].toLowerCase() === address.toLowerCase()
  })

  if (!recipient) {
    return '0'
  }

  return recipient.value[1]
}
