'use client'

import { useState } from 'react'
import { Container } from '../../components/layout/Container'
import { Input } from '@unlock-protocol/ui'
import CampaignDetailContent from '../../components/CampaignDetailContent'

// Mock data for testing
const mockAirdrop = {
  id: 'dev-test',
  name: 'Development Test Airdrop',
  description: 'This is a mock airdrop for testing the delegation feature.',
  contractAddress: '0x3b26D06Ea8252a73742d2125D1ACEb594ECEE5c6', // Replace with the actual address from your config
  recipientsFile:
    'https://merkle-trees.unlock-protocol.com/0xe238effc14b43022c9ce132e22f0baa73cdd8696f4b435150a4c9341c83abfbf.json',
  token: {
    address: '0xaC27fa800955849d6D17cC8952Ba9dD6EAA66187', // UP token on Base
    symbol: 'UP',
    decimals: 18,
  },
  chainId: 8453, // Base chain ID
}

export default function DevTestPage() {
  const [contractAddress, setContractAddress] = useState(
    mockAirdrop.contractAddress
  )
  const [tokenAddress, setTokenAddress] = useState(mockAirdrop.token.address)
  const [chainId, setChainId] = useState(mockAirdrop.chainId.toString())

  // Create a custom airdrop configuration based on inputs
  const customAirdrop = {
    ...mockAirdrop,
    contractAddress,
    token: {
      ...mockAirdrop.token,
      address: tokenAddress,
    },
    chainId: parseInt(chainId),
  }

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">
            Development Testing Mode
          </h2>
          <p className="text-yellow-700 mb-4">
            This page is for testing the airdrop delegation feature. In this
            mode, any connected wallet will be treated as eligible for the
            airdrop. Make sure to set{' '}
            <code className="bg-yellow-100 px-1 rounded">
              NEXT_PUBLIC_AIRDROP_DEV_MODE=true
            </code>{' '}
            in your environment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contract Address
              </label>
              <Input
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="Airdrop contract address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Token Address
              </label>
              <Input
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Token contract address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chain ID</label>
              <Input
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                placeholder="Chain ID"
                type="number"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>Testing delegation with:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Contract: {contractAddress}</li>
              <li>Token: {tokenAddress}</li>
              <li>Chain: {chainId}</li>
            </ul>
          </div>
        </div>

        {/* The main component to test */}
        <CampaignDetailContent airdrop={customAirdrop} />
      </div>
    </Container>
  )
}
