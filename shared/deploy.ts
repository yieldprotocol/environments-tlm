import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { FactoryOptions } from 'hardhat/types'

import { verify,readAddressMappingIfExists, writeAddressMap, getName } from './helpers'
import { ContractDeployment } from '../governance/proposals/confTypes'

const { contractDeployments } = require(process.env.CONF as string)

/**
 * @dev This script deploys contracts as defined in a proposal config file containing a contractDeployments:ContractDeployment[] export.
 */
;(async () => {
  let deployerAcc = (await ethers.getSigners())[0] // We never impersonate when deploying

  for (let params_ of contractDeployments) {
    const params: ContractDeployment = params_ // Only way I know to cast this

    const deployedAddress = readAddressMappingIfExists(params.addressFile).get(params.name)
    let deployed: Contract
    if (deployedAddress === undefined) {
      const factoryOptions: FactoryOptions = { libraries: params.libs }
      const contractFactory = await ethers.getContractFactory(params.contract, factoryOptions)

      const expandedArgs = params.args.map((f) => f())
      console.log(`Deploying ${getName(params.name)} ${params.contract} with ${expandedArgs}`)
      deployed = await contractFactory.deploy(...expandedArgs)

      await deployed.deployed()
      console.log(`${getName(params.name)} ${params.contract} deployed at ${deployed.address}`)

      const addressMap = readAddressMappingIfExists(params.addressFile)
      addressMap.set(params.name, deployed.address)
      writeAddressMap(params.addressFile, addressMap)

      const deployerAddressMap = readAddressMappingIfExists('deployers.json')
      deployerAddressMap.set(deployed.address, deployerAcc.address)
      writeAddressMap('deployers.json', deployerAddressMap)

      verify(params.name, deployed, expandedArgs, params.libs)
    } else {
      console.log(`Reusing ${getName(params.name)} ${params.contract} at: ${deployedAddress}`)
    }
  }
})()
