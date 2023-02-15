import { readAddressMappingIfExists } from '../../shared/helpers'

import { DAI } from '../../shared/constants'

export const changelog: Map<string, string> = readAddressMappingIfExists('changelog.json')
export const deployers: Map<string, string> = readAddressMappingIfExists('deployers.json')

export const developer = '0xC7aE076086623ecEA2450e364C838916a043F9a8'
export const whales: Map<string, string> = new Map([
  [DAI, '0x16b34ce9a6a6f7fc2dd25ba59bf7308e7b38e186'],
])
