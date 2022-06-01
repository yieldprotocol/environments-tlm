#!/bin/bash

set -eux
HERE=$(dirname $0)
export CONF=$PWD/$HERE/addDecSeries.rinkeby.config
RUN="npx hardhat run --network rinkeby"

$RUN $HERE/addDecSeries-3.ts
$RUN $HERE/addDecSeries-3.ts
$RUN $HERE/addDecSeries-3.ts