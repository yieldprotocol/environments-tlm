import { VAT, IPT_A, IPT_A_B32, IPT_A_PIP, IPT_A_JOIN } from '../../../shared/constants'
import * as base_config from '../base.mainnet.config'
import { ContractDeployment } from '../confTypes'

export const developer: string = base_config.developer
export const deployers: Map<string, string> = base_config.deployers
export const whales: Map<string, string> = base_config.whales
export const makerdao: Map<string, string> = base_config.makerdao
export const dssTlm: Map<string, string> = base_config.dssTlm
export const yieldprotocol: Map<string, string> = base_config.yieldprotocol

// ----- deployment parameters -----
export const contractDeployments: ContractDeployment[] = [
  {
    addressFile: 'dssTlm.json',
    name: IPT_A_PIP,
    contract: 'DSValue',
    args: [],
  },
  {
    addressFile: 'dssTlm.json',
    name: IPT_A_JOIN,
    contract: 'AuthGemJoin',
    args: [
      () => makerdao.getOrThrow(VAT)!,
      () => IPT_A_B32,
      () => dssTlm.getOrThrow(IPT_A)!,
    ],
  },
]
