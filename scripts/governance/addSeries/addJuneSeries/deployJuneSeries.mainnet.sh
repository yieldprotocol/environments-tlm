#!/bin/bash

set -eux
RUN="npx hardhat run --network mainnet"
HERE=$(dirname $0)

$RUN $HERE/addJuneSeries-1.ts
$RUN $HERE/addJuneSeries-2.ts
$RUN $HERE/addJuneSeries-2.ts
$RUN $HERE/addJuneSeries-2.ts