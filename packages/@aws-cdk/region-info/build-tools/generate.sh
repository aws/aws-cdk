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

echo "🍻 Pre-Build Complete!"
