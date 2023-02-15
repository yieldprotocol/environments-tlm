export interface ContractDeployment {
  addressFile: string // The json file to store the address in (e.g 'protocol.json')
  name: string // The unique name to the contract (e.g 'witch')
  contract: string // The contract name to deploy (e.g '@yield-protocol/vault-v2/contracts/Witch.sol/Witch')
  args: (() => any)[] // The parameters to the constructor (e.g [cauldron.address, ladle.address])
  libs?: { [libraryName: string]: string } // The external libraries to the contract (e.g { YieldMath: yieldMath.address })
}

