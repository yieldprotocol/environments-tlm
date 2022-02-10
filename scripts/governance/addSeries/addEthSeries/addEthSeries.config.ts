import { BigNumber } from 'ethers'
import { ETH, DAI, USDC, WBTC, WSTETH, STETH, LINK, ENS, WAD } from '../../../../shared/constants'
import { EOMAR22, EOJUN22, FYETH2203, FYETH2206, YSETH6MMS, YSETH6MJD } from '../../../../shared/constants'
import { CHAINLINK, COMPOSITE, UNISWAP } from '../../../../shared/constants'

export const developer: Map<number, string> = new Map([
  [1, '0xC7aE076086623ecEA2450e364C838916a043F9a8'],
  [4, '0x5AD7799f02D5a829B2d6FA085e6bd69A872619D5'],
  [42, '0x5AD7799f02D5a829B2d6FA085e6bd69A872619D5'],
])

export const whale = new Map([
  [1, '0x06920c9fc643de77b99cb7670a944ad31eaaa260'],
  [4, '0x5AD7799f02D5a829B2d6FA085e6bd69A872619D5'],
  [42, '0x5AD7799f02D5a829B2d6FA085e6bd69A872619D5'],
])

export const assets: Map<number, Map<string, string>> = new Map([
  [
    1,
    new Map([
      [ETH, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
      [DAI, '0x6B175474E89094C44Da98b954EedeAC495271d0F'],
      [USDC, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
      [WBTC, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'],
      [WSTETH, '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0'],
      [STETH, '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'],
      [LINK, '0x514910771af9ca656af840dff83e8264ecf986ca'],
      [ENS, '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72'],
    ]),
  ],
  [
    4,
    new Map([
      [ETH, '0x67c5279f044A40746017Ae1edD8bb7573273aA8b'],
      [DAI, '0x32E85Fa11a53ac73067881ef7E56d47a3BCe3e2C'],
      [USDC, '0xf4aDD9708888e654C042613843f413A8d6aDB8Fe'],
      [WBTC, '0x69A11AA0D394337570d84ce824a1ca6aFA0765DF'],
      [WSTETH, '0xf9F4D9e05503D416E95f05831A95ff43c3A01182'],
      [STETH, '0xE910c4D4802898683De478e57852738e773dBCD9'],
      [LINK, '0xfdf099372cded51a9dA9c0431707789f08B06C70'],
      [ENS, '0x5BeAdC789F094741DEaacd5a1499aEd7E9d7FB78'],
    ]),
  ],
  [
    42,
    new Map([
      [ETH, '0x55C0458edF1D8E07DF9FB44B8960AecC515B4492'],
      [DAI, '0xaFCdc724EB8781Ee721863db1B15939675996484'],
      [USDC, '0xeaCB3AAB4CA68F1e6f38D56bC5FCc499B76B4e2D'],
      [WBTC, '0xD5FafCE68897bdb55fA11Dd77858Df7a9a458D92'],
      [WSTETH, '0x273325FeB84B5FBCD6ebdd5862FE2FCB0a02FE7C'],
      [STETH, '0x7188e9DBdDf607474a44c653C693Aab99dB92a16'],
      [LINK, '0xB62FCB2ef1d1819aED135F567859b080ddFe1008'],
      [ENS, '0xA24b97c7617cc40dCc122F6dF813584A604a6C28'],
    ]),
  ],
])

export const poolsInit: Array<[string, BigNumber]> = [
  // poolId, initAmount
  [FYETH2203, WAD.div(50)],
  [FYETH2206, WAD.div(50)],
]

export const newSeries: Array<[string, string, number, string[], string, string]> = [
  // name, baseId, maturity, ilkIds, name, symbol
  [FYETH2203, ETH, EOMAR22, [ETH, DAI, USDC, WBTC, WSTETH, LINK, ENS], 'FYETH2203', 'FYETH2203'], // Mar22
  [FYETH2206, ETH, EOJUN22, [ETH, DAI, USDC, WBTC, WSTETH, LINK, ENS], 'FYETH2206', 'FYETH2206'], // Jun22
]

export const newStrategies: Array<[string, string, string]> = [
  // name, symbol, baseId
  ['Yield Strategy ETH 6M Mar Sep', YSETH6MMS, ETH],
  ['Yield Strategy ETH 6M Jun Dec', YSETH6MJD, ETH],
]

// Input data
export const strategiesInit: Array<[string, string, BigNumber]> = [
  // [strategyId, startPoolId, initAmount]
  [YSETH6MMS, FYETH2203, WAD.div(50)], // The March/September Strategy invests in the March series
  [YSETH6MJD, FYETH2206, WAD.div(50)], // The June/December Strategy invests in the June series
]

export const newChiSources = new Map([
  [1, [[ETH, '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5']]],
  [4, [[ETH, '0xd6801a1dffcd0a410336ef88def4320d6df1883e']]],
  [42, [[ETH, '0x41b5844f4680a8c38fbb695b7f9cfd1f64474a72']]],
])

export const newRateSources = new Map([
  [1, [[ETH, '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5']]],
  [4, [[ETH, '0xd6801a1dffcd0a410336ef88def4320d6df1883e']]],
  [42, [[ETH, '0x41b5844f4680a8c38fbb695b7f9cfd1f64474a72']]],
])

// Input data: assetId, assetId, [intermediate assetId]
export const newCompositePaths: Array<[string, string, Array<string>]> = [[ETH, WSTETH, [STETH]]]

export const newBases: Array<string> = [ETH]

// Input data: baseId, ilkId, oracle name, ratio (1000000 == 100%), inv(ratio), line, dust, dec
export const newChainlinkLimits: Map<
  number,
  Array<[string, string, string, number, number, number, number, number]>
> = new Map([
  [
    1,
    [
      [ETH, ETH, CHAINLINK, 1000000, 1000000, 2500000000, 0, 12], // Constant 1, no dust
      [ETH, DAI, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, USDC, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, WBTC, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, LINK, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
    ],
  ],
  [
    4,
    [
      [ETH, ETH, CHAINLINK, 1000000, 1000000, 2500000000, 0, 12], // Constant 1, no dust
      [ETH, DAI, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, USDC, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, WBTC, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, LINK, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, ENS, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
    ],
  ],
  [
    42,
    [
      [ETH, ETH, CHAINLINK, 1000000, 1000000, 2500000000, 0, 12], // Constant 1, no dust
      [ETH, DAI, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, USDC, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, WBTC, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, LINK, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
      [ETH, ENS, CHAINLINK, 1500000, 666000, 250000000, 10000, 12],
    ],
  ],
])

// Input data: baseId, ilkId, oracle name, ratio (1000000 == 100%), inv(ratio), line, dust, dec
export const newCompositeLimits: Array<[string, string, string, number, number, number, number, number]> = [
  [ETH, WSTETH, COMPOSITE, 1000000, 666000, 250000000, 10000, 12],
]

// Input data: baseId, ilkId, oracle name, ratio (1000000 == 100%), inv(ratio), line, dust, dec
export const newUniswapLimits: Map<
  number,
  Array<[string, string, string, number, number, number, number, number]>
> = new Map([
  [1, [[ETH, ENS, UNISWAP, 1500000, 666000, 250000000, 10000, 12]]],
  [4, []],
  [42, []],
])
