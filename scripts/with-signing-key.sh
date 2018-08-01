#!/bin/bash
# Run another script with the signing key for the current scope,
# if set. The environment variable KEY_PASSPHRASE will be set to
# the key's passphrase, to pass in like so:
#
#    echo $KEY_PASSPHRASE | gpg \
#        ${GPG_PASSPHRASE_FROM_STDIN} \
#        ...
#
# The environment variable $KEY_ID will be set to the ID of the
# key so you can refer to it from the script.
set -euo pipefail

if [[ "${1:-}" == "" ]]; then
    echo "Usage: with-signing-key.sh CMD [ARG...]" >&2
    echo "">&2
    echo "Run another command with a preloaded GPG keyring." >&2
    exit 1
fi

if [[ "${SIGNING_KEY_SCOPE:-}" == "" ]]; then
    echo "SIGNING_KEY_SCOPE not set; not signing artifacts." >&2
    exit 0
fi

tmpdir=$(mktemp -d)
trap "find $tmpdir -type f -exec rm {} \\; && rm -rf $tmpdir" EXIT

SECRET=$SIGNING_KEY_SCOPE/SigningKey

# Use secrets manager to obtain the key and passphrase into a JSON file
echo "Retrieving key $SECRET..." >&2
aws secretsmanager get-secret-value --secret-id "$SECRET" --output text --query SecretString > $tmpdir/secret.txt

value-from-secret() {
    node -e "console.log(JSON.parse(require('fs').readFileSync('$tmpdir/secret.txt', { encoding: 'utf-8' })).$1)"
}

export KEY_PASSPHRASE=$(value-from-secret Passphrase)

# GnuPG will occasionally bail out with "gpg: <whatever> failed: Inappropriate ioctl for device", the following attempts to fix
export GPG_TTY=$(tty)
export GNUPGHOME=$tmpdir

echo "Importing key..." >&2
gpg --allow-secret-key-import \
    --batch --yes --no-tty \
    --import <(value-from-secret PrivateKey)

export KEY_ID=$(gpg --list-keys --with-colons | grep pub | cut -d: -f5)

# Prepare environment variables with flags to GPG
#        --passphrase-fd 0 \
#        ${EXTRA_GPG_OPTS} \
GPG_PASSPHRASE_FROM_STDIN="--passphrase-fd 0"
if [[ "$(uname)" == "Darwin" ]]; then
    # On Mac, we must pass this to disable a prompt for
    # passphrase, but option is not recognized on Linux.
    GPG_PASSPHRASE_FROM_STDIN="${GPG_PASSPHRASE_FROM_STDIN} --pinentry-mode loopback"
fi
export GPG_PASSPHRASE_FROM_STDIN

# Execute remaining commands
echo "Running: $@" >&2
"$@"
