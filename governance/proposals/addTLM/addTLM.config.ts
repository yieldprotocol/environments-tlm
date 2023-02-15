import { TLM, DAI_JOIN } from '../../../shared/constants'
import * as base_config from '../base.mainnet.config'
import { ContractDeployment } from '../confTypes'

export const developer: string = base_config.developer
export const deployers: Map<string, string> = base_config.deployers
export const whales: Map<string, string> = base_config.whales
export const changelog: Map<string, string> = base_config.changelog

// ----- deployment parameters -----
export const contractDeployments: ContractDeployment[] = [
  {
    addressFile: 'makerdao.json',
    name: TLM,
    contract: 'DssTlm',
    args: [
      () => changelog.getOrThrow(DAI_JOIN)!,
      () => changelog.getOrThrow(VOW)!,
  ],
  },
]
