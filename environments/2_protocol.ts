import { ethers } from 'hardhat'
import *  as fs from 'fs'
import { ETH } from '../shared/constants'

import { Protocol } from '../fixtures/protocol'
import { mapToJson, jsonToMap } from '../shared/helpers'

/**
 * This script deploys a minimal instance of the yield v2 protocol, with no oracle sources, assets, joins, series or pools
 * 
 * run:
 * npx hardhat run ./environments/protocol.ts --network localhost
 *
 */

const json = fs.readFileSync('./output/assets.json', 'utf8')
const assets = jsonToMap(json) as Map<string, string>;

console.time("Protocol deployed in");

(async () => {
    const [ ownerAcc ] = await ethers.getSigners();
    const wethAddress = assets.get(ETH) as string
    const protocol = await Protocol.setup(ownerAcc, wethAddress)
        
    fs.writeFileSync('./output/protocol.json', mapToJson(protocol.asMap()), 'utf8')
    console.timeEnd("Protocol deployed in")

    /* test file output reading */
    // const _jsonFromFile =  fs.readFileSync('./output/protocol.json', 'utf8');
    // const _protocol = JSON.parse(_jsonFromFile);
    // console.log(_protocol)

})()