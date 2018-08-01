#!/bin/bash
# Backwards compatibility shim, functionality has been
# moved to 'with-signing-key.sh'
set -euo pipefail
chmod +x scripts/with-signing-key.sh
chmod +x scripts/sign-files.sh

scripts/with-signing-key.sh scripts/sign-files.sh "$@"
