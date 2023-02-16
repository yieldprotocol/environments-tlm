// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.6.7;

import { DssTlm } from "../lib/dss-tlm/src/tlm.sol";
import { Vat } from "../lib/dss-tlm/lib/dss/src/vat.sol";
import { Spotter } from "../lib/dss-tlm/lib/dss/src/spot.sol";
import { DSValue } from "../lib/dss-tlm/lib/dss/lib/ds-value/src/value.sol";
import { AuthGemJoin } from "../lib/dss-tlm/lib/dss-gem-joins/src/join-auth.sol";
import { FYToken } from "../lib/vault-v2/packages/foundry/contracts/FYToken.sol";