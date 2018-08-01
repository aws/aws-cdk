#!/bin/bash
set -euo pipefail

if [[ "${1:-}" == "" ]]; then
    echo "Usage: sign.sh FILE [FILE...]" >&2
    echo "">&2
    echo "Creates detached signature as FILE.sig." >&2
    exit 1
else
    if [ ! -f ${1} ]; then
        echo "Asked to sign ${1}, but no such file exists."
        exit 1
    fi
fi

if [[ "${KEY_PASSPHRASE:-}" == "" ]]; then
    echo "Run this script using with-signing-key.sh" >&2
    exit 1
fi

while [[ "${1:-}" != "" ]]; do
    echo "Signing $1..." >&2
    echo $KEY_PASSPHRASE | gpg \
        ${GPG_PASSPHRASE_FROM_STDIN} \
        --local-user $KEY_ID \
        --batch --yes --no-tty \
        --output $1.sig \
        --detach-sign $1
    shift
done

echo "Done!" >&2
