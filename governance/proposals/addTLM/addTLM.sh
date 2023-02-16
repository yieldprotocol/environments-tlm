
#!/bin/bash

set -eux
export HERE=$(dirname $0)
RUN="npx hardhat run --network tenderly"

export CONF=$PWD/$HERE/addTLM.config.ts
$RUN $HERE/../../../shared/deploy.ts
$RUN $HERE/addTLM.ts

export CONF=$PWD/$HERE/addIlk.config.ts
$RUN $HERE/../../../shared/deploy.ts
$RUN $HERE/addIlk.ts
$RUN $HERE/addIlk.test.ts