#!/bin/bash
# After packing, quickly change the "name" in `package.json` back
change_name_to="@aws-cdk/assert2"
node -e "const pj = JSON.parse(fs.readFileSync('package.json')); pj.name = '${change_name_to}'; fs.writeFileSync('package.json', JSON.stringify(pj, undefined, 2), { encoding: 'utf-8' });"


