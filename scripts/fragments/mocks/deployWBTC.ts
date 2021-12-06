import { ethers, waffle } from 'hardhat'
import { verify, getOriginalChainId, getOwnerOrImpersonate } from '../../../shared/helpers'
import WBTCMockArtifact from '../../../artifacts/contracts/mocks/WBTCMock.sol/WBTCMock.json'

import { WBTCMock } from '../../../typechain/WBTCMock'
const { deployContract } = waffle

/**
 * @dev This script deploys a WBTC Mock
 */

;(async () => {
  const chainId = await getOriginalChainId()
  if (!(chainId === 1 || chainId === 4 || chainId === 42)) throw 'Only Rinkeby, Kovan and Mainnet supported'

  const developer = new Map([
    [1, '0xC7aE076086623ecEA2450e364C838916a043F9a8'],
    [4, '0xf1a6ffa6513d0cC2a5f9185c4174eFDb51ba3b13'],
    [42, '0x5AD7799f02D5a829B2d6FA085e6bd69A872619D5'],
  ])

  let ownerAcc = await getOwnerOrImpersonate(developer.get(chainId) as string)

  const args: any = []
  const asset = (await deployContract(ownerAcc, WBTCMockArtifact, args)) as unknown as WBTCMock
  await asset.deployed()
  console.log(`${await asset.symbol()} deployed at ${asset.address}`)
  verify(asset.address, args)
})()