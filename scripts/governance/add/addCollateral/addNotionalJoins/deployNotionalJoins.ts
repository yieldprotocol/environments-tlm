import { ethers, waffle } from 'hardhat'
import {
  getOwnerOrImpersonate,
  readAddressMappingIfExists,
  proposeApproveExecute,
  writeAddressMap,
} from '../../../../../shared/helpers'

import { FDAI2209, FDAI2209ID, FUSDC2209, FUSDC2209ID, FDAI2212, FUSDC2212 } from '../../../../../shared/constants'

import { Timelock, NotionalJoinFactory, NotionalJoin } from '../../../../../typechain'
import { orchestrateNotionalJoinProposal } from '../../../../fragments/utils/orchestrateNotionalJoinProposal'
const { developer, deployer } = require(process.env.CONF as string)
const notionalAssetAddress = '0x1344A36A1B56144C3Bc62E7757377D288fDE0369'
const salt = ethers.BigNumber.from('1')

/**
 * @dev This script deploys Notional Joins via Notional Join Factory
 */

;(async () => {
  let ownerAcc = await getOwnerOrImpersonate(deployer)

  const protocol = readAddressMappingIfExists('protocol.json')
  const governance = readAddressMappingIfExists('governance.json')
  const joins = readAddressMappingIfExists('joins.json')

  const timelock = (await ethers.getContractAt(
    'Timelock',
    governance.get('timelock') as string,
    ownerAcc
  )) as unknown as Timelock
  console.log(`timelock: ${timelock.address}`)

  const notionalJoinFactory = (await ethers.getContractAt(
    'NotionalJoinFactory',
    protocol.get('notionalJoinFactory') as string,
    ownerAcc
  )) as unknown as NotionalJoinFactory
  console.log(`notionalJoinFactory: ${notionalJoinFactory.address}`)

  //let proposal: Array<{ target: string; data: string }> = []

  // Permissions
  //proposal = proposal.concat(await orchestrateNotionalJoinProposal(ownerAcc, deployer, timelock))

  // Propose, Approve & execute
  //if (proposal.length > 0) {
  //  await proposeApproveExecute(timelock, proposal, governance.get('multisig') as string, developer)
  // }

  // add FDAI2209
  //await notionalJoinFactory.addFCash(FDAI2209, FDAI2209ID)
  console.log(`FDAI2209 added as reference`)

  // add FUSDC2209
  //await notionalJoinFactory.addFCash(FUSDC2209, FUSDC2209ID)
  console.log(`FUSDC2209 added as reference`)

  // deploy FDAI2212 | args = oldAssetId, newAssetId, newAssetAddress, salt
  const fDAI2212Join = (await notionalJoinFactory.deploy(FDAI2209, FDAI2212, notionalAssetAddress, salt, {
    gasLimit: 10000000,
  })) as unknown as NotionalJoin

  joins.set(FDAI2212, fDAI2212Join.address)
  console.log(`code works till here`)
  console.log(fDAI2212Join)

  writeAddressMap('joins.json', joins)
  console.log(`fDAI2212Join deployed at: ${fDAI2212Join.address}`)

  // deploy FUSDC2212 | args = oldAssetId, newAssetId, newAssetAddress, salt
  const fUSDC2212Join = (await notionalJoinFactory.deploy(
    FUSDC2209,
    FUSDC2212,
    notionalAssetAddress,
    salt
  )) as unknown as NotionalJoin
  joins.set(FUSDC2212, fUSDC2212Join.address)
  writeAddressMap('joins.json', joins)
  console.log(`fUSDC2212Join deployed at: ${fUSDC2212Join.address}`)

  console.log(`completed`)
})()
