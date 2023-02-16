import { parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

import { DssTlm__factory, IFYToken__factory } from '../../../typechain'
import { impersonate } from '../../../shared/helpers'
import { TLM, ILK_A, ILK_A_B32 } from '../../../shared/constants'
import { LADLE } from '../../../shared/constants'
const { dssTlm, yieldprotocol } = require(process.env.CONF as string)

const wad = (x: number) => parseUnits(x.toString(), 18)
const ray = (x: number) => parseUnits(x.toString(), 27)
const rad = (x: number) => parseUnits(x.toString(), 45)

/**
 * @dev This script sells an amount of Ilk to the TLM
 */
;(async () => {
  let ownerAcc = (await ethers.getSigners())[0]
  const tlm = DssTlm__factory.connect(dssTlm.getOrThrow(TLM), ownerAcc)
  const ladleAcc = await impersonate(yieldprotocol.getOrThrow(LADLE), BigNumber.from(wad(1)));
  const ilk = IFYToken__factory.connect(dssTlm.getOrThrow(ILK_A), ownerAcc)

  // Give some fyToken to owner
  await ilk.connect(ladleAcc).mint(ownerAcc.address, wad(1000))
  console.log(`Minted 1000 ${ILK_A} to owner`);

  // Sell the fyToken on the TLM
  await ilk.connect(ownerAcc).approve(tlm.address, wad(1000))
  console.log(`Approved TLM to spend 1000 ${ILK_A}`);

  await tlm.sellGem(ILK_A_B32, ownerAcc.address, wad(1000), { gasLimit: 1000000 })
  console.log(`Sold 1000 ${ILK_A} to the TLM`);
})()
