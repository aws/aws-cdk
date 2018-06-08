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

if [[ "${SIGNING_KEY_SCOPE:-}" == "" ]]; then
    echo "SIGNING_KEY_SCOPE not set; not signing artifacts." >&2
    exit 0
fi

tmpdir=$(mktemp -d)
trap "find $tmpdir -type f -exec shred {} \\; && rm -rf $tmpdir" EXIT

SECRET=$SIGNING_KEY_SCOPE/SigningKey

# Use secrets manager to obtain the key and passphrase into a JSON file
echo "Retrieving key $SECRET..." >&2
aws secretsmanager get-secret-value --secret-id "$SECRET" --output text --query SecretString > $tmpdir/secret.txt

value-from-secret() {
    node -e "console.log(JSON.parse(require('fs').readFileSync('$tmpdir/secret.txt', { encoding: 'utf-8' })).$1)"
}

passphrase=$(value-from-secret Passphrase)

# GnuPG will occasionally bail out with "gpg: <whatever> failed: Inappropriate ioctl for device", the following attempts to fix
export GPG_TTY=$(tty)

echo "Importing key..." >&2
gpg --homedir $tmpdir \
    --allow-secret-key-import \
    --batch --yes --no-tty \
    --import <(value-from-secret PrivateKey)

while [[ "${1:-}" != "" ]]; do
    echo "Signing $1..." >&2
    echo $passphrase | gpg \
        --homedir $tmpdir \
        --local-user aws-cdk@amazon.com \
        --batch --yes --no-tty \
        --pinentry-mode loopback \
        --passphrase-fd 0 \
        --output $1.sig \
        --detach-sign $1
    shift
done

echo "Done!" >&2
