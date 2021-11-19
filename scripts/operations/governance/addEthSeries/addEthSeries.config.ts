import { BigNumber } from 'ethers'
import { stringToBytes6 } from '../../../../shared/helpers'
import { ETH, DAI, USDC, WBTC, WSTETH, STETH, WAD } from '../../../../shared/constants'

export const EOMAR22 = 1648177200 // Friday, March 25, 2022 3:00:00 AM GMT+0
export const EOJUN22 = 1656039600 // Friday, June 24, 2022 3:00:00 PM GMT+0
export const FYETH2203 = stringToBytes6('0005') // End of 5th quarter from 1st January 2021
export const FYETH2206 = stringToBytes6('0006') // End of 6th quarter from 1st January 2021
export const YSETH6MMS = 'YSETH6MMS' // Yield Strategy ETH 6M Mar Sep
export const YSETH6MJD = 'YSETH6MJD' // Yield Strategy ETH 6M Jun Dec
export const CHAINLINK = 'chainlinkOracle'
export const COMPOUND = 'compoundOracle'
export const COMPOSITE = 'compositeOracle'

export const poolsInit: Array<[string, BigNumber]> = [
  // poolId, initAmount
  [FYETH2203, WAD.div(50)],
  [FYETH2206, WAD.div(50)],
]

export const newSeries: Array<[string, string, number, string[], string, string]> = [
  // name, baseId, maturity, ilkIds, name, symbol
  [FYETH2203, ETH, EOMAR22, [ETH, DAI, USDC, WBTC, WSTETH], 'FYETH2203', 'FYETH2203'], // Mar22
  [FYETH2206, ETH, EOJUN22, [ETH, DAI, USDC, WBTC, WSTETH], 'FYETH2206', 'FYETH2206'], // Jun22
]

export const newStrategies: Array<[string, string, string]> = [
  // name, symbol, baseId
  ['Yield Strategy ETH 6M Mar Sep',  YSETH6MMS,  ETH],
  ['Yield Strategy ETH 6M Jun Dec',  YSETH6MJD,  ETH],
]

// Input data
export const strategiesInit: Array<[string, string, BigNumber]> = [
  // [strategyId, startPoolId, initAmount]
  [YSETH6MMS, FYETH2203, WAD.div(50)], // The March/September Strategy invests in the March series
  [YSETH6MJD, FYETH2206, WAD.div(50)], // The June/December Strategy invests in the June series
]

export const newChiSources = new Map([
  [1, [[ETH,  '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5']]],
  [42, [[ETH,  '0x41b5844f4680a8c38fbb695b7f9cfd1f64474a72']]],
])

export const newRateSources = new Map([
  [1, [[ETH,  '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5']]],
  [42, [[ETH,  '0x41b5844f4680a8c38fbb695b7f9cfd1f64474a72']]],
])

// Input data: assetId, assetId, [intermediate assetId]
export const newCompositePaths: Array<[string, string, Array<string>]> = [
  [ETH, WSTETH, [STETH]],
]

export const newBases: Array<[string, string]> = [
  [ETH, COMPOUND],
]

// Input data: baseId, ilkId, oracle name, ratio (1000000 == 100%), inv(ratio), line, dust, dec
export const newChainlinkIlks: Array<[string, string, string, number, number, number, number, number]> = [
  [ETH, ETH, CHAINLINK, 1000000, 1000000, 2500, 0, 18], // Constant 1, no dust
  [ETH, DAI, CHAINLINK, 1500000, 666000, 250, 1, 18],
  [ETH, USDC, CHAINLINK, 1500000, 666000, 250, 1, 18],
  [ETH, WBTC, CHAINLINK, 1500000, 666000, 250, 1, 18],
]

// Input data: baseId, ilkId, oracle name, ratio (1000000 == 100%), inv(ratio), line, dust, dec
export const newCompositeIlks: Array<[string, string, string, number, number, number, number, number]> = [
  [ETH, WSTETH, COMPOSITE, 1500000, 666000, 250, 1, 6], // Via ETH
]