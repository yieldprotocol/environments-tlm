/**
 * @dev This script tests the dust limits for one or more base/ilk pairs.
 *
 * It takes as inputs the protocol address files.
 */

import { ethers } from 'hardhat'
import * as fs from 'fs'

import { bytesToString, jsonToMap, getOriginalChainId, getOwnerOrImpersonate } from '../../../../shared/helpers'
import { Cauldron } from '../../../../typechain/Cauldron'
import { newMin } from './ypp-0009.config'

;(async () => {
  const chainId = await getOriginalChainId()
  if (chainId !== 1 && chainId !== 42) throw 'Only Kovan and Mainnet supported'
  const path = chainId === 1 ? './addresses/mainnet/' : './addresses/kovan/'

  const developer = new Map([
    [1, '0xC7aE076086623ecEA2450e364C838916a043F9a8'],
    [42, '0x5AD7799f02D5a829B2d6FA085e6bd69A872619D5'],
  ])

  let ownerAcc = await getOwnerOrImpersonate(developer.get(chainId) as string)

  const protocol = jsonToMap(fs.readFileSync(path + 'protocol.json', 'utf8')) as Map<string, string>

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