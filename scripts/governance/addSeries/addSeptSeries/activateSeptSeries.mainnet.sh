#!/bin/bash

set -eux
RUN="npx hardhat run --network mainnet"
HERE=$(dirname $0)

$RUN $HERE/addSeptSeries-3.ts
$RUN $HERE/addSeptSeries-3.ts
$RUN $HERE/addSeptSeries-3.ts