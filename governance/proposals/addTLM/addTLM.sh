
#!/bin/bash

set -eux
export HERE=$(dirname $0)
export CONF=$PWD/$HERE/addTLM.config.ts
RUN="npx hardhat run --network localhost"

# $RUN $HERE/../../../shared/deploy.ts
$RUN $HERE/addTLM.ts
# $RUN $HERE/../../../shared/approve.ts