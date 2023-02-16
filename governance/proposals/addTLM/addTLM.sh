
#!/bin/bash

set -eux
export HERE=$(dirname $0)
RUN="npx hardhat run --network tenderly"

export CONF=$PWD/$HERE/addTLM.deployment.ts
$RUN $HERE/../../../shared/deploy.ts
$RUN $HERE/addTLM.ts

export CONF=$PWD/$HERE/addIlk.deployment.ts
$RUN $HERE/../../../shared/deploy.ts
$RUN $HERE/addIlk.ts