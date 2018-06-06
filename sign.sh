#!/bin/bash
set -euo pipefail

if [[ "${2:-}" == "" ]]; then
    echo "Usage: sign.sh ARTIFACTTYPE FILE [FILE...]" >&2
    echo "">&2
    echo "Creates detached signature as FILE.sig." >&2
    exit 1
fi

if [[ "${SIGNING_KEY_SCOPE:-}" == "" ]]; then
    echo "SIGNING_KEY_SCOPE not set; not signing artifacts." >&2
    exit 0
fi

tmpdir=$(mktemp -d)
trap "shred $tmpdir/* && rm -rf $tmpdir" EXIT

SECRET=$SIGNING_KEY_SCOPE/$1/SigningKey

# Use secrets manager to obtain the key and passphrase into a JSON file
echo "Retrieving key $SECRET..." >&2
aws secretsmanager get-secret-value --secret-id "$SECRET" --output text --query SecretString > $tmpdir/secret.txt

value-from-secret() {
    node -e "console.log(JSON.parse(require('fs').readFileSync('$tmpdir/secret.txt', { encoding: 'utf-8' })).$1)"
}

passphrase=$(value-from-secret Passphrase)

echo "Importing key..." >&2
gpg --homedir $tmpdir --import <(value-from-secret PrivateKey)

while [[ "${2:-}" != "" ]]; do
    echo "Signing $2..." >&2
    echo $passphrase | gpg \
        --homedir $tmpdir \
        --local-user aws-cdk@amazon.com \
        --batch --yes \
        --passphrase-fd 0 \
        --output $2.sig \
        --detach-sign $2
    shift
done

echo "Done!" >&2
