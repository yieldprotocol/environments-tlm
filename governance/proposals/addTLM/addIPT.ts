import { parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

import { DssTlm__factory, Vat__factory, Spotter__factory, DSValue__factory, AuthGemJoin__factory } from '../../../typechain'
import { impersonate } from '../../../shared/helpers'
import { TLM, PAUSE_PROXY, VAT, SPOT, IPT_A, IPT_A_B32, IPT_A_PIP, IPT_A_JOIN } from '../../../shared/constants'
const { deployers, dssTlm, makerdao } = require(process.env.CONF as string)

const wad = (x: number) => parseUnits(x.toString(), 18).toString()
const ray = (x: number) => parseUnits(x.toString(), 27).toString()
const rad = (x: number) => parseUnits(x.toString(), 45).toString()

/**
 * @dev This script adds an iPT to the Vat and the TLM
 */
;(async () => {
  let ownerAcc = (await ethers.getSigners())[0]
  let iPTPip = DSValue__factory.connect(dssTlm.getOrThrow(IPT_A_PIP), ownerAcc)
  let iPTJoin = AuthGemJoin__factory.connect(dssTlm.getOrThrow(IPT_A_JOIN), ownerAcc)
  
  const dsPauseAcc = await impersonate(makerdao.getOrThrow(PAUSE_PROXY))
  const tlm = DssTlm__factory.connect(dssTlm.getOrThrow(TLM), dsPauseAcc)
  const vat = Vat__factory.connect(makerdao.getOrThrow(VAT), dsPauseAcc)
  const spot = Spotter__factory.connect(makerdao.getOrThrow(SPOT), dsPauseAcc);

  //   Give authority to DSPauseProxy on the iPT pip and join, and remove it from the deployer
  let deployerAcc = await impersonate(deployers.getOrThrow(iPTPip.address))
  await iPTPip.connect(deployerAcc).setOwner(dsPauseAcc.address);
  console.log(`iPTPip: ${iPTPip.address} owner is now DSPauseProxy (${dsPauseAcc.address})`);

  deployerAcc = await impersonate(deployers.getOrThrow(iPTJoin.address))
  await iPTJoin.connect(deployerAcc).rely(dsPauseAcc.address);
  console.log(`iPTJoin: ${tlm.address} is now authorized to be called by DSPauseProxy (${dsPauseAcc.address})`)
  await iPTJoin.connect(deployerAcc).deny(deployerAcc.address)
  console.log(`iPTJoin: ${iPTJoin.address} is no longer authorized to be called by deployer (${deployerAcc.address})`);

  iPTPip = DSValue__factory.connect(dssTlm.getOrThrow(IPT_A_PIP), dsPauseAcc)
  iPTJoin = AuthGemJoin__factory.connect(dssTlm.getOrThrow(IPT_A_JOIN), dsPauseAcc);

//  // Init iPT in DSS
  (await vat.rely(iPTJoin.address)).wait(1)
  console.log(`Vat: Gave iPT join at ${iPTJoin.address} auth on vat`);
  (await vat.init(IPT_A_B32)).wait(1)
  console.log(`Vat: iPT ${IPT_A} initialized in vat`);
  (await iPTPip.poke('0x0000000000000000000000000000000000000000000000000de0b6b3a7640000')).wait(1) // Spot = 1:1 (1 WAD) in bytes32 hexadecimal
  console.log(`iPTPip: iPT price set to 1 DAI on pip`);
  (await spot['file(bytes32,bytes32,address)'](IPT_A_B32, ethers.utils.formatBytes32String('pip'), iPTPip.address)).wait(1)
  console.log(`Spot: iPT ${IPT_A} pip added to spotter`);
  (await spot['file(bytes32,bytes32,uint256)'](IPT_A_B32, ethers.utils.formatBytes32String('mat'), ray(1))).wait(1) // 1 RAY
  console.log(`Spot: iPT ${IPT_A} mat (collateralization ratio) set to 100%`);
  (await vat['file(bytes32,bytes32,uint256)'](IPT_A_B32, ethers.utils.formatBytes32String('line'), rad(1000000))).wait(1) // 1000000 RAD
  console.log(`Vat: iPT ${IPT_A} line (debt ceiling) set to 1000000 DAI`);
  (await spot.poke(IPT_A_B32, { gasLimit: 1000000 })).wait(1)
  console.log(`Spot: iPT ${IPT_A} price updated on spotter`);
  (await iPTJoin.rely(tlm.address)).wait(1)
  console.log(`iPTJoin: iPT ${IPT_A} join authorized to be called by TLM`);

  // Init iPT in TLM
  const target = '1000000001547125985827094528'; // 5% per year is (1.05)^(1/seconds_in_a_year) * RAY
  (await tlm.init(IPT_A_B32, iPTJoin.address, target, { gasLimit: 1000000 })).wait(1)
  console.log(`TLM: iPT ${IPT_A} initialized in TLM`);
})()
