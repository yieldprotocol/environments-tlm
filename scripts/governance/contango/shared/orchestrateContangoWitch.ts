/**
 * @dev This script makes one or more assets into ilks for one or more bases.
 *
 * It takes as inputs the governance and protocol address files.
 * It uses the Wand to set the spot oracle, debt limits, and allow the Witch to liquidate collateral.
 * A plan is recorded in the Cloak to isolate the Join from the Witch.
 */

import { id } from '@yield-protocol/utils-v2'
import { ethers } from 'hardhat'
import { bytesToString } from '../../../../shared/helpers'
import { Cauldron, ContangoLadle, ContangoWitch, EmergencyBrake, Timelock } from '../../../../typechain'
import { AuctionLineAndLimit } from '../arbitrum/contango.arb_mainnet.config'

export const orchestrateContangoWitch = async (
  ownerAcc: any,
  witch: ContangoWitch,
  cloak: EmergencyBrake,
  timelock: Timelock,
  cauldron: Cauldron,
  ladle: ContangoLadle,
  auctionLineAndLimits: AuctionLineAndLimit[],
  bases: Array<[string, string]>,
  fyTokens: Map<string, string>
): Promise<Array<{ target: string; data: string }>> => {
  const proposal: Array<{ target: string; data: string }> = []

  proposal.push({
    target: witch.address,
    data: witch.interface.encodeFunctionData('grantRoles', [
      [
        id(witch.interface, 'point(bytes32,address)'),
        id(witch.interface, 'setAuctioneerReward(uint256)'),
        id(witch.interface, 'setAnotherWitch(address,bool)'),
        id(witch.interface, 'setLineAndLimit(bytes6,bytes6,uint32,uint64,uint64,uint128)'),
        id(witch.interface, 'setLineAndLimit(bytes6,bytes6,uint32,uint64,uint64,uint128)'),
      ],
      timelock.address,
    ]),
  })
  console.log(`witch.grantRoles(timelock)`)

  proposal.push({
    target: cauldron.address,
    data: cauldron.interface.encodeFunctionData('grantRoles', [
      [id(cauldron.interface, 'give(bytes12,address)'), id(cauldron.interface, 'slurp(bytes12,uint128,uint128)')],
      witch.address,
    ]),
  })
  console.log(`cauldron.grantRoles(witch)`)

  const plan = [
    {
      contact: cauldron.address,
      signatures: [id(cauldron.interface, 'slurp(bytes12,uint128,uint128)')],
    },
  ]

  proposal.push({
    target: cloak.address,
    data: cloak.interface.encodeFunctionData('plan', [witch.address, plan]),
  })
  console.log(`cloak.plan(witch): ${await cloak.hash(witch.address, plan)}`)

  for (const [assetId] of bases) {
    const join = await ethers.getContractAt('Join', await ladle.joins(assetId), ownerAcc)

    // Allow Witch to join base
    proposal.push({
      target: join.address,
      data: join.interface.encodeFunctionData('grantRoles', [
        [id(join.interface, 'join(address,uint128)')],
        witch.address,
      ]),
    })

    // Allow to revoke the above permission on emergencies
    const plan = [
      {
        contact: join.address,
        signatures: [id(join.interface, 'join(address,uint128)')],
      },
    ]

    if ((await cloak.plans(await cloak.hash(witch.address, plan))).state === 0) {
      proposal.push({
        target: cloak.address,
        data: cloak.interface.encodeFunctionData('plan', [witch.address, plan]),
      })
      console.log(`cloak.plan(witch, join(${bytesToString(assetId)})): ${await cloak.hash(witch.address, plan)}`)
    }
  }

  for (const [seriesId] of fyTokens) {
    const fyToken = await ethers.getContractAt('FYToken', (await cauldron.series(seriesId)).fyToken, ownerAcc)

    // Allow Witch to burn fyTokens
    proposal.push({
      target: fyToken.address,
      data: fyToken.interface.encodeFunctionData('grantRoles', [
        [id(fyToken.interface, 'burn(address,uint256)')],
        witch.address,
      ]),
    })

    // Allow to revoke the above permission on emergencies
    const plan = [
      {
        contact: fyToken.address,
        signatures: [id(fyToken.interface, 'burn(address,uint256)')],
      },
    ]

    if ((await cloak.plans(await cloak.hash(witch.address, plan))).state === 0) {
      proposal.push({
        target: cloak.address,
        data: cloak.interface.encodeFunctionData('plan', [witch.address, plan]),
      })
      console.log(`cloak.plan(witch, burn(${bytesToString(seriesId)})): ${await cloak.hash(witch.address, plan)}`)
    }
  }

  for (const { ilkId, baseId, duration, vaultProportion, collateralProportion, max } of auctionLineAndLimits) {
    proposal.push({
      target: witch.address,
      data: witch.interface.encodeFunctionData('setLineAndLimit', [
        ilkId,
        baseId,
        duration,
        vaultProportion,
        collateralProportion,
        max,
      ]),
    })
    console.log(`Adding baseId: ${bytesToString(baseId)} - ilkId: ${bytesToString(ilkId)} to the Witch`)
  }

  const ilkIds = new Set(auctionLineAndLimits.map(({ ilkId }) => ilkId))
  for (const ilkId of ilkIds) {
    const join = await ethers.getContractAt('Join', await ladle.joins(ilkId), ownerAcc)
    // Allow Witch to exit ilk
    proposal.push({
      target: join.address,
      data: join.interface.encodeFunctionData('grantRoles', [
        [id(join.interface, 'exit(address,uint128)')],
        witch.address,
      ]),
    })

    // Log a plan to undo the orchestration above in emergencies
    const plan = [
      {
        contact: join.address,
        signatures: [id(join.interface, 'exit(address,uint128)')],
      },
    ]

    if ((await cloak.plans(await cloak.hash(witch.address, plan))).state === 0) {
      proposal.push({
        target: cloak.address,
        data: cloak.interface.encodeFunctionData('plan', [witch.address, plan]),
      })
      console.log(`cloak.plan(witch, exit(${bytesToString(ilkId)})): ${await cloak.hash(witch.address, plan)}`)
    }
  }

  return proposal
}
