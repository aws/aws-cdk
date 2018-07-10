#!/bin/bash
set -euo pipefail

curl -L "https://d1uauaxba7bl26.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json" \
    | gunzip - > spec-input/000_CloudFormationResourceSpecification.json
