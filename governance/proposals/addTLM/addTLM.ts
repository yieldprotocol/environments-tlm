import { DssTlm__factory } from '../../../typechain'
import { getOwnerOrImpersonate } from '../../../shared/helpers'
import { TLM, PAUSE_PROXY } from '../../../shared/constants'
// 
const { developer, deployers, changelog } = require(process.env.CONF as string)

/**
 * @dev This script orchestrates the TLM
 */
;(async () => {
  let ownerAcc = await getOwnerOrImpersonate(developer)
  const tlm = DssTlm__factory.connect(changelog.getOrThrow(TLM), ownerAcc)
  const dsPauseProxyAddress = changelog.getOrThrow(PAUSE_PROXY)

  //   Give authority to DSPauseProxy and remove it from the deployer
  let deployerAcc = await getOwnerOrImpersonate(deployers.getOrThrow(tlm.address))
  await tlm.connect(deployerAcc).rely(dsPauseProxyAddress);
  console.log(`TLM: ${tlm.address} is now authorized to be called by DSPauseProxy (${dsPauseProxyAddress})`)

  await tlm.connect(deployerAcc).deny(deployers.getOrThrow(tlm.address));
  console.log(`TLM: ${tlm.address} is no longer authorized to be called by deployer (${deployers.getOrThrow(tlm.address)})`)
})()
