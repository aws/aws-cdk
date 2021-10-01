#!/bin/bash
# Bundle `node_modules/yaml` into the auto-delete-object handler
tgt=lib/auto-delete-objects-handler/node_modules/yaml
if [[ ! -d $tgt ]]; then
  mkdir -p $tgt
  cp -R node_modules/yaml/ $tgt/
fi