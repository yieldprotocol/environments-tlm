/**
 * @dev This script tests the dust limits for one or more base/ilk pairs.
 *
 * It takes as inputs the governance and protocol address files.
 */

import { ethers } from 'hardhat'
import * as hre from 'hardhat'
import * as fs from 'fs'

import { bytesToString, jsonToMap } from '../../../../shared/helpers'
import { Cauldron } from '../../../../typechain/Cauldron'
import { newMin, linkAddress } from './ypp-0009.config'

;(async () => {
  let chainId: number

  // Because in forks the network name gets replaced by 'localhost' and chainId by 31337, we rely on checking known contracts to find out which chain are we on.
  if ((await ethers.provider.getCode(linkAddress.get(1) as string)) !== '0x') chainId = 1
  else if ((await ethers.provider.getCode(linkAddress.get(42) as string)) !== '0x') chainId = 42
  else throw 'Unrecognized chain'

  const path = chainId == 1 ? './addresses/archive/mainnet/' : './addresses/archive/rc12/'
  const protocol = jsonToMap(fs.readFileSync(path + 'protocol.json', 'utf8')) as Map<string, string>

  let [ownerAcc] = await ethers.getSigners()

  // Contract instantiation
  const cauldron = ((await ethers.getContractAt(
    'Cauldron',
    protocol.get('cauldron') as string,
    ownerAcc
  )) as unknown) as Cauldron
  for (let [baseId, ilkId, minDebt] of newMin) {
    const debt = await cauldron.debt(baseId, ilkId)
    if (debt.min.toString() === minDebt.toString())
      console.log(`${bytesToString(baseId)}/${bytesToString(ilkId)} set: ${debt.min}`)
    else console.log(`${bytesToString(baseId)}/${bytesToString(ilkId)} not updated, still at ${debt.min}`)
  }
})()