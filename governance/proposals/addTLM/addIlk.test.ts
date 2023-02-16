import { parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

import { DssTlm__factory, FYToken__factory } from '../../../typechain'
import { impersonate } from '../../../shared/helpers'
import { PAUSE_PROXY, VAT, SPOT } from '../../../shared/constants'
import { TLM, ILK_A, ILK_A_B32, ILK_A_PIP, ILK_A_JOIN } from '../../../shared/constants'
import { LADLE } from '../../../shared/constants'
const { developer, deployers, dssTlm, makerdao, yieldprotocol } = require(process.env.CONF as string)

const wad = (x: number) => parseUnits(x.toString(), 18)
const ray = (x: number) => parseUnits(x.toString(), 27)
const rad = (x: number) => parseUnits(x.toString(), 45)

/**
 * @dev This script adds an Ilk to the Vat and the TLM
 */
;(async () => {
  let ownerAcc = (await ethers.getSigners())[0]
  const tlm = DssTlm__factory.connect(dssTlm.getOrThrow(TLM), ownerAcc)
  const ladleAcc = await impersonate(yieldprotocol.getOrThrow(LADLE));
  const ilk = FYToken__factory.connect(dssTlm.getOrThrow(ILK_A), ownerAcc)

  // Give some fyToken to owner

})()
