import { parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

import { DssTlm__factory, Vat__factory, Spotter__factory, DSValue__factory, AuthGemJoin__factory } from '../../../typechain'
import { impersonate } from '../../../shared/helpers'
import { TLM, PAUSE_PROXY, VAT, SPOT, ILK_A, ILK_A_B32, ILK_A_PIP, ILK_A_JOIN } from '../../../shared/constants'
const { deployers, dssTlm, makerdao } = require(process.env.CONF as string)

const wad = (x: number) => parseUnits(x.toString(), 18)
const ray = (x: number) => parseUnits(x.toString(), 27)
const rad = (x: number) => parseUnits(x.toString(), 45)

/**
 * @dev This script adds an Ilk to the Vat and the TLM
 */
;(async () => {
  let ownerAcc = (await ethers.getSigners())[0]
  const ilkPip = DSValue__factory.connect(dssTlm.getOrThrow(ILK_A_PIP), ownerAcc)
  const ilkJoin = AuthGemJoin__factory.connect(dssTlm.getOrThrow(ILK_A_JOIN), ownerAcc)
  
  const dsPauseAcc = await impersonate(makerdao.getOrThrow(PAUSE_PROXY))
  const tlm = DssTlm__factory.connect(dssTlm.getOrThrow(TLM), dsPauseAcc)
  const vat = Vat__factory.connect(makerdao.getOrThrow(VAT), dsPauseAcc)
  const spot = Spotter__factory.connect(makerdao.getOrThrow(SPOT), dsPauseAcc);

  //   Give authority to DSPauseProxy on the ilk pip and join, and remove it from the deployer
  let deployerAcc = await impersonate(deployers.getOrThrow(ilkPip.address))
  await ilkPip.connect(deployerAcc).setOwner(dsPauseAcc.address);
  console.log(`IlkPip: ${ilkPip.address} owner is now DSPauseProxy (${dsPauseAcc.address})`);

  deployerAcc = await impersonate(deployers.getOrThrow(ilkJoin.address))
  await tlm.connect(deployerAcc).rely(dsPauseAcc.address);
  console.log(`TLM: ${tlm.address} is now authorized to be called by DSPauseProxy (${dsPauseAcc.address})`)
  await tlm.connect(deployerAcc).deny(deployerAcc.address)
  console.log(`IlkJoin: ${ilkJoin.address} is no longer authorized to be called by deployer (${deployerAcc.address})`);

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
  (await ilkJoin.rely(tlm.address)).wait(1)
  console.log(`Ilk ${ILK_A} join authorized to be called by TLM`);

  // Init Ilk in TLM
  const target = '1000000001547125985827094528'; // 5% per year is (1.05)^(1/seconds_in_a_year) * RAY
  (await tlm.init(ILK_A_B32, ilkJoin.address, target, { gasLimit: 1000000 })).wait(1)
  console.log(`Ilk ${ILK_A} initialized in TLM`);
})()
