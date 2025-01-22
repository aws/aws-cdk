#!/bin/bash

set -euo pipefail
regions="us-east-1 us-east-2"

for region in $regions; do
  aws ec2 describe-instance-types | \
    jq '.InstanceTypes | { InstanceTypes: map({key: .InstanceType, value: del(.InstanceType)}) | sort_by(.key) | from_entries } | .InstanceTypes' > \
    instance-properties-$region.json
done

jq -s 'reduce .[] as $item ({}; . * $item)' instance-properties-*.json > instance-properties.json
rm instance-properties-*.json