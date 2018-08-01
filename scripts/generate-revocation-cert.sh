#!/bin/bash
set -euo pipefail

if [[ "${KEY_AVAILABLE:-}" == "" ]]; then
    echo "Run this script using with-signing-key.sh" >&2
    exit 1
fi

if ! $KEY_AVAILABLE; then
    echo "No key in scope, cannot generate revocation cert." >&2
    exit 1
fi

echo $KEY_PASSPHRASE | gpg \
    ${GPG_PASSPHRASE_FROM_STDIN} \
    --gen-revoke $KEY_ID
