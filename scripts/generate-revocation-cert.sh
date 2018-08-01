#!/bin/bash
set -euo pipefail

if [[ "${KEY_PASSPHRASE:-}" == "" ]]; then
    echo "Run this script using with-signing-key.sh" >&2
    exit 1
fi

echo $KEY_PASSPHRASE | gpg \
    ${GPG_PASSPHRASE_FROM_STDIN} \
    --gen-revoke $KEY_ID
