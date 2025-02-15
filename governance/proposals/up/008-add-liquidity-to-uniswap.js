const { ethers } = require('hardhat')
const { getNetwork } = require('@unlock-protocol/hardhat-helpers')
const {
  getUniswapV3Contracts,
  getPoolState,
  getPoolImmutables,
  createOrGetUniswapV3Pool,
  getTokenInfo,
  encodePriceSqrt,
} = require('../../helpers/uniswap')
const { Pool, Position, nearestUsableTick } = require('@uniswap/v3-sdk')
const { Token, CurrencyAmount, Percent } = require('@uniswap/sdk-core')

// Configuration
const BASE_TIMELOCK_ADDRESS = '0xB34567C4cA697b39F72e1a8478f285329A98ed1b'
const FEE_TIER = 3000 // 0.3% fee tier
const UP_TOKEN_ADDRESS = '0xaC27fa800955849d6D17cC8952Ba9dD6EAA66187' // Replace with actual address
const ETH_AMOUNT = 10

async function addLiquidityProposal() {
  const { id, name } = await getNetwork()
  console.log(`Proposal to be submitted on ${name} (${id})`)
  const { WETH } = await getNetwork()

  // Get contracts using helper
  const { positionManager } = await getUniswapV3Contracts()

  // Get token info using helper
  const { decimals: wethDecimals } = await getTokenInfo(WETH)
  const {
    address: upAddress,
    decimals: upDecimals,
    symbol: upSymbol,
  } = await getTokenInfo(UP_TOKEN_ADDRESS)

  // Get or create pool using helper
  const pool = await createOrGetUniswapV3Pool(
    WETH,
    upAddress,
    FEE_TIER,
    [ETH_AMOUNT, 0] // Initial reserves
  )

  // Get pool state using helper
  const poolState = await getPoolState(pool)
  const immutables = await getPoolImmutables(pool)

  // Create Token instances
  const token0 = new Token(id, WETH, wethDecimals, 'WETH')
  const token1 = new Token(id, upAddress, upDecimals, upSymbol)

  // Calculate position using helper's price encoding
  const position = Position.fromAmounts({
    pool: new Pool(
      token0,
      token1,
      immutables.fee,
      poolState.sqrtPriceX96.toString(),
      poolState.liquidity.toString(),
      poolState.tick
    ),
    tickLower:
      nearestUsableTick(poolState.tick, immutables.tickSpacing) -
      immutables.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolState.tick, immutables.tickSpacing) +
      immutables.tickSpacing * 2,
    amount0: CurrencyAmount.fromRawAmount(
      token0,
      ethers.parseUnits(ETH_AMOUNT.toString(), wethDecimals)
    ),
    amount1: CurrencyAmount.fromRawAmount(
      token1,
      ethers.parseUnits(
        (ETH_AMOUNT / encodePriceSqrt(1, 1)).toString(), // Use helper's price encoding
        upDecimals
      )
    ),
    useFullPrecision: true,
  })

  // Generate transaction data
  const deadline = Math.floor(Date.now() / 1000) + 1200 // 20 minutes
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    position,
    {
      slippageTolerance: new Percent(50, 10_000),
      deadline,
      recipient: BASE_TIMELOCK_ADDRESS,
    }
  )

  // Generate approval calls using helper's contract interface
  const approvalCalls = await Promise.all(
    [WETH, upAddress].map(async (tokenAddress) => {
      const token = await ethers.getContractAt('IERC20', tokenAddress)
      return {
        calldata: token.interface.encodeFunctionData('approve', [
          await positionManager.getAddress(),
          ethers.MaxUint256,
        ]),
        contractAddress: tokenAddress,
      }
    })
  )

  return {
    proposalName: `Add ${ETH_AMOUNT} ETH/${upSymbol} Liquidity`,
    calls: [
      ...approvalCalls,
      {
        calldata,
        contractAddress: await positionManager.getAddress(),
        value,
      },
    ],
  }
}

module.exports = addLiquidityProposal
