import { parseUnits } from 'ethers/lib/utils'

import { DssTlm__factory, DSValue__factory, AuthGemJoin__factory } from '../../../typechain'
import { getOwnerOrImpersonate } from '../../../shared/helpers'
import { TLM, PAUSE_PROXY, ILK_A, ILK_A_PIP, ILK_A_JOIN } from '../../../shared/constants'
const { developer, deployers, changelog, ilkAAddress } = require(process.env.CONF as string)

/**
 * @dev This script adds an Ilk to the Vat and the TLM
 */
;(async () => {
  let ownerAcc = await getOwnerOrImpersonate(developer)
  const tlm = DssTlm__factory.connect(changelog.getOrThrow(TLM), ownerAcc)
  const dsPauseProxyAddress = changelog.getOrThrow(PAUSE_PROXY)
  const ilkPip = DSValue__factory.connect(changelog.getOrThrow(ILK_A_PIP), ownerAcc)
  const ilkJoin = AuthGemJoin__factory.connect(changelog.getOrThrow(ILK_A_JOIN), ownerAcc)


//  // Init Ilk in DSS
//  vat.rely(address(gemJoinA));
//  pip.poke(bytes32(uint256(1 ether))); // Spot = $1
//  vat.init(ilkA);
//  spot.file(ilkA, bytes32("pip"), address(pip));
//  spot.file(ilkA, bytes32("mat"), ray(1 ether));
//  spot.poke(ilkA);
//  vat.file(ilkA, "line", rad(1000 ether));
//  vat.file("Line",      rad(1000 ether));


  //   Give authority to DSPauseProxy and remove it from the deployer
  let deployerAcc = await getOwnerOrImpersonate(deployers.getOrThrow(tlm.address))
  await tlm.connect(deployerAcc).rely(dsPauseProxyAddress);
  console.log(`TLM: ${tlm.address} is now authorized to be called by DSPauseProxy (${dsPauseProxyAddress})`)
  
  await tlm.connect(deployerAcc).deny(deployers.getOrThrow(tlm.address));
  console.log(`TLM: ${tlm.address} is no longer authorized to be called by deployer (${deployers.getOrThrow(tlm.address)})`)
})()
