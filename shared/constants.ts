import { ethers, BigNumber } from 'ethers'

export const ZERO = BigNumber.from(0)
export const ZERO_ADDRESS = '0x' + '00'.repeat(20)
export const DEC6 = BigNumber.from(10).pow(6)
export const WAD = BigNumber.from(10).pow(18)
export const ONEUSDC = BigNumber.from(10).pow(6)
export const ONEWBTC = BigNumber.from(10).pow(8)
export const RAY = BigNumber.from(10).pow(27)
export const MAX128 = BigNumber.from(2).pow(128).sub(1)
export const MAX256 = BigNumber.from(2).pow(256).sub(1)
export const THREE_MONTHS: number = 3 * 30 * 24 * 60 * 60
export const ROOT = '0x00000000'

export function stringToBytes6(x: string): string {
  return ethers.utils.formatBytes32String(x).slice(0, 14)
}

export const TLM = 'MCD_TLM'
export const DAI = 'MCD_DAI'
export const DAI_JOIN = 'MCD_JOIN_DAI'
export const VAT = 'MCD_VAT'
export const SPOT = 'MCD_SPOT'
export const VOW = 'MCD_VOW'
export const PAUSE_PROXY = 'MCD_PAUSE_PROXY'
export const ILK_A = 'ILK_A'
export const ILK_A_B32 = ethers.utils.formatBytes32String(ILK_A) // 0x494c4b5f41
export const ILK_A_PIP = 'ILK_A_PIP'
export const ILK_A_JOIN = 'ILK_A_JOIN'
export const IPT_A = 'IPT_A'
export const IPT_A_B32 = ethers.utils.formatBytes32String(IPT_A) // 0x4950545f41
export const IPT_A_PIP = 'IPT_A_PIP'
export const IPT_A_JOIN = 'IPT_A_JOIN'
export const LADLE = 'LADLE'

export const DISPLAY_NAMES = new Map([
  [TLM, 'TLM'],
  [DAI, 'DAI'],
  [DAI_JOIN, 'DAI_JOIN'],
  [VOW, 'VOW'],
  [VAT, 'VAT'],
  [SPOT, 'SPOT'],
  [PAUSE_PROXY, 'PAUSE_PROXY'],
  [ILK_A, 'ILK_A'],
  [ILK_A_PIP, 'ILK_A_PIP'],
  [ILK_A_JOIN, 'ILK_A_JOIN'],
  [IPT_A, 'IPT_A'],
  [IPT_A_PIP, 'IPT_A_PIP'],
  [IPT_A_JOIN, 'IPT_A_JOIN'],
  [LADLE, 'LADLE'],
])
