import { TLM, DAI_JOIN, VOW } from '../../../shared/constants'
import * as base_config from '../base.mainnet.config'
import { ContractDeployment } from '../confTypes'

export const developer: string = base_config.developer
export const deployers: Map<string, string> = base_config.deployers
export const whales: Map<string, string> = base_config.whales
export const makerdao: Map<string, string> = base_config.makerdao
export const dssTlm: Map<string, string> = base_config.dssTlm


// ----- deployment parameters -----
export const contractDeployments: ContractDeployment[] = [
  {
    addressFile: 'dssTlm.json',
    name: TLM,
    contract: 'DssTlm',
    args: [
      () => makerdao.getOrThrow(DAI_JOIN)!,
      () => makerdao.getOrThrow(VOW)!,
  ],
  },
]
