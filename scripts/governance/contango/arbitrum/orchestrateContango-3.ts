import { ethers } from 'hardhat'
import { contangoCauldron_key, contangoLadle_key, contangoWitch_key } from '../../../../shared/constants'
import { getOwnerOrImpersonate, proposeApproveExecute } from '../../../../shared/helpers'
import { orchestrateContangoWitch } from '../shared/orchestrateContangoWitch'
import { revokeContangoWitch } from '../shared/revokeContangoWitch'

const { protocol, governance, developer, auctionLineAndLimits, bases, fyTokens, contangoAddress } = require(process.env
  .CONF as string)

  /**
   * @dev This script orchestrates the Cauldron, Ladle, Witch (and Wand?)
   */

  ; (async () => {
    const ownerAcc = await getOwnerOrImpersonate(developer as string)

    const cloak = await ethers.getContractAt('EmergencyBrake', governance.get('cloak') as string, ownerAcc)
    const timelock = await ethers.getContractAt('Timelock', governance.get('timelock') as string, ownerAcc)
    const contangoWitch = await ethers.getContractAt('ContangoWitch', protocol.get(contangoWitch_key) as string, ownerAcc)
    const contangoLadle = await ethers.getContractAt('ContangoLadle', protocol.get(contangoLadle_key) as string, ownerAcc)
    const contangoCauldron = await ethers.getContractAt('Cauldron', protocol.get(contangoCauldron_key) as string, ownerAcc)

    const badWitch = await ethers.getContractAt('ContangoWitch', "0x????", ownerAcc)

    // Build the proposal
    const proposal = [
      await revokeContangoWitch(badWitch, contangoCauldron),
      await orchestrateContangoWitch(
        ownerAcc,
        contangoWitch,
        cloak,
        timelock,
        contangoCauldron,
        contangoLadle,
        auctionLineAndLimits,
        bases,
        fyTokens
      )
    ].flat(1)

    // Propose, Approve & execute
    await proposeApproveExecute(timelock, proposal, governance.get('multisig') as string, developer)
  })()
