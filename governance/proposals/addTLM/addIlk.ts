import { parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

import { DssTlm__factory, Vat__factory, Spotter__factory, DSValue__factory, AuthGemJoin__factory } from '../../../typechain'
import { impersonate, getOwnerOrImpersonate } from '../../../shared/helpers'
import { TLM, PAUSE_PROXY, VAT, SPOT, ILK_A, ILK_A_B32, ILK_A_PIP, ILK_A_JOIN } from '../../../shared/constants'
const { developer, deployers, dssTlm, makerdao } = require(process.env.CONF as string)

const wad = (x: number) => parseUnits(x.toString(), 18)
const ray = (x: number) => parseUnits(x.toString(), 27)
const rad = (x: number) => parseUnits(x.toString(), 45)

/**
 * @dev This script adds an Ilk to the Vat and the TLM
 */
;(async () => {
  let ownerAcc = (await ethers.getSigners())[0]
  const tlm = DssTlm__factory.connect(dssTlm.getOrThrow(TLM), ownerAcc)
  const ilkPip = DSValue__factory.connect(dssTlm.getOrThrow(ILK_A_PIP), ownerAcc)
  const ilkJoin = AuthGemJoin__factory.connect(dssTlm.getOrThrow(ILK_A_JOIN), ownerAcc)
  
  const dsPauseProxyAddress = makerdao.getOrThrow(PAUSE_PROXY)
  const dsPauseAcc = await impersonate(dsPauseProxyAddress)
  const vat = Vat__factory.connect(makerdao.getOrThrow(VAT), dsPauseAcc)
  const spot = Spotter__factory.connect(makerdao.getOrThrow(SPOT), dsPauseAcc);

  // Init Ilk in DSS
  (await vat.rely(ilkJoin.address)).wait(1)
  console.log(`Gave ilk join at ${ilkJoin.address} auth on vat`);
  (await vat.init(ILK_A_B32)).wait(1)
  console.log(`Ilk ${ILK_A} initialized in vat`);
  (await ilkPip.poke(ethers.utils.formatBytes32String(wad(1)))).wait(1) // Spot = 1:1 (1 WAD)
  console.log(`Ilk price set to 1 DAI on pip`);
  (await spot['file(bytes32,bytes32,address)'](ILK_A_B32, ethers.utils.formatBytes32String('pip'), ilkPip.address)).wait(1)
  console.log(`Ilk ${ILK_A} pip added to spotter`);
  (await spot['file(bytes32,bytes32,uint256)'](ILK_A_B32, ethers.utils.formatBytes32String('mat'), ray(1))).wait(1) // 1 RAY
  console.log(`Ilk ${ILK_A} mat (collateralization ratio) set to 100%`);
  (await vat['file(bytes32,bytes32,uint256)'](ILK_A_B32, ethers.utils.formatBytes32String('line'), ray(1000000))).wait(1) // 1000 RAY
  console.log(`Ilk ${ILK_A} line (debt ceiling) set to 1000000 DAI`);
  (await spot.poke(ILK_A_B32, { gasLimit: 1000000 })).wait(1)
  console.log(`Ilk ${ILK_A} price updated on spotter`);

  // Init Ilk in TLM
  const target = '1000000001547125985827094528'; // 5% per year is (1.05)^(1/seconds_in_a_year) * RAY
  (await tlm.init(ILK_A_B32, ilkJoin.address, target)).wait(1)
})()
