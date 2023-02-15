import { VAT, ILK_A, ILK_A_PIP, ILK_A_JOIN } from '../../../shared/constants'
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
    addressFile: 'changelog.json',
    name: ILK_A_PIP,
    contract: 'DSValue',
    args: [],
  },
  {
    addressFile: 'changelog.json',
    name: ILK_A_JOIN,
    contract: 'AuthGemJoin',
    args: [
      () => makerdao.getOrThrow(VAT)!,
      () => ILK_A,
      () => dssTlm.getOrThrow(ILK_A)!,
    ],
  },
]
