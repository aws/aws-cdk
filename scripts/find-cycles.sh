#!/bin/bash
set -euo pipefail
scriptdir="$(cd $(dirname $0) && pwd)"
python ${scriptdir}/find-cycles.py  $(find . -name package.json | grep -v node_modules)
