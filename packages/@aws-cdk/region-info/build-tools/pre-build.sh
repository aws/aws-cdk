#!/bin/bash
set -euo pipefail

echo "⏳ Compiling static data generator..."
tsc                                     \
  --alwaysStrict                        \
  --lib ES2017                          \
  --module CommonJS                     \
  --noFallthroughCasesInSwitch          \
  --noImplicitAny                       \
  --noImplicitReturns                   \
  --noImplicitThis                      \
  --noUnusedLocals                      \
  --noUnusedParameters                  \
  --resolveJsonModule                   \
  --strict                              \
  --strictNullChecks                    \
  --target ES2018                       \
  build-tools/*.ts

echo "⌛️ Generating the static data..."
node build-tools/generate-static-data.js

echo "⏳ Generating JSON schema for RegionInfo..."
typescript-json-schema                  \
  lib/user-data.ts                      \
  'IUserSuppliedRegionInfo'             \
  --out schema/region-info.schema.json  \
  --refs              true              \
  --required          true              \
  --strictNullChecks  true              \
  --topRef            true

echo "🍻 Pre-Build Complete!"
