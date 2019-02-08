#!/bin/bash
set -euo pipefail
(cd gen && tsc && npm run gen)
