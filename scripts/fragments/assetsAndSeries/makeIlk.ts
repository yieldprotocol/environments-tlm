// Make an asset into an ilk.
// - Collateralization config is set for the base/ilk pair.
// - Debt limits are set for the base/ilk pair.
// - The asset is added to the Witch.

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Cauldron, Join__factory, EmergencyBrake, Witch } from '../../../typechain'
import { Ilk } from '../../governance/confTypes'
import { addIlkToWitch } from '../witch/addIlkToWitch'
import { setLineAndLimit } from '../witch/setLineAndLimit'
import { updateDebtLimits } from '../limits/updateDebtLimits'
import { updateCollateralization } from '../oracles/updateCollateralization'

export const makeIlk = async (
  ownerAcc: SignerWithAddress,
  cloak: EmergencyBrake,
  cauldron: Cauldron,
  witch: Witch,
  ilk: Ilk,
  joins: Map<string, string> // assetId, joinAddress
): Promise<Array<{ target: string; data: string }>> => {
  let proposal: Array<{ target: string; data: string }> = []

  const join = Join__factory.connect(joins.get(ilk.ilkId)!, ownerAcc)

  proposal = proposal.concat(await updateCollateralization(cauldron, ilk))
  proposal = proposal.concat(await updateDebtLimits(cauldron, ilk))
  proposal = proposal.concat(await addIlkToWitch(cloak, witch, ilk.ilkId, join))
  proposal = proposal.concat(await setLineAndLimit(witch, ilk.auctionLineAndLimit))

  return proposal
}
