import { id } from '@yield-protocol/utils-v2'

import { LidoOracle } from '../../../typechain/LidoOracle'
import { EmergencyBrake } from '../../../typechain/EmergencyBrake'
import { Timelock } from '../../../typechain/Timelock'

/**
 * @dev This script orchestrates the LidoOracle
 *
 * It takes as inputs the governance and protocol json address files.
 * Expectes the Timelock to have ROOT permissions on the LidoOracle.
 * The Cloak gets ROOT access. Root access is removed from the deployer.
 * The Timelock gets access to governance functions.
 */

export const orchestrateLidoOracleProposal = async (
    ownerAcc: any, 
    lidoOracle: LidoOracle,
    timelock: Timelock,
    cloak: EmergencyBrake
  ): Promise<Array<{ target: string; data: string }>>  => {
  const ROOT = await lidoOracle.ROOT()

  // Give access to each of the governance functions to the timelock, through a proposal to bundle them
  // Give ROOT to the cloak, revoke ROOT from the deployer
  const proposal: Array<{ target: string; data: string }> = []

  proposal.push({
      target: lidoOracle.address,
      data: lidoOracle.interface.encodeFunctionData('grantRoles', [
          [
              id(lidoOracle.interface, 'setSource(address)'),
          ],
          timelock.address
      ])
  })
  console.log(`lidoOracle.grantRoles(gov, timelock)`)

  proposal.push({
      target: lidoOracle.address,
      data: lidoOracle.interface.encodeFunctionData('grantRole', [ROOT, cloak.address])
  })
  console.log(`lidoOracle.grantRole(ROOT, cloak)`)

  proposal.push({
      target: lidoOracle.address,
      data: lidoOracle.interface.encodeFunctionData('revokeRole', [ROOT, ownerAcc.address])
  })
  console.log(`lidoOracle.revokeRole(ROOT, deployer)`)

  return proposal
}