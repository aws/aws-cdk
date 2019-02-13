#!/bin/bash
set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage:"
  echo "  $ scripts/foreach.sh COMMAND... > a.sh"
  echo "  $ chmod +x ./a.sh"
  echo "  $ ./a.sh"
  echo
  echo "foreach.sh emits a bash script to stdout which executes COMMAND for each module in the repo, in topological order"
  echo "this can be useful if you are performing large scale refactors and wish to continue from where you left off"
  echo "yes, there are better ways to do this, but this is A WAY..."
  echo
  echo "for example, to emit a script to run all tests:"
  echo "  $ scripts/foreach.sh npm test"
  echo
  exit 1
fi

echo "#!/bin/bash"
echo "set -euo pipefail"

lerna ls --toposort | xargs -n1 -I{} echo "lerna exec --stream --scope {} \"$@\""
