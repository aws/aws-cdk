#!/bin/bash
set -euo pipefail

if [[ "${1:-}" == "" ]]; then
    echo "Usage: sign.sh FILE" >&2
    exit 1
fi


tmpdir=$(mktemp -d)
trap "shred $tmpdir/* && rm -rf $tmpdir" EXIT

SECRET=CDK/SigningKey

# Use secrets manager to obtain the key and passphrase into a JSON file
echo "Retrieving key..." >&2
aws --region us-east-1 secretsmanager get-secret-value --secret-id "$SECRET" --output text --query SecretString > $tmpdir/secret.txt
passphrase=$(python -c "import json; print(json.load(file('$tmpdir/secret.txt'))['Passphrase'])")

echo "Importing key..." >&2
gpg --homedir $tmpdir --import <(python -c "import json; print(json.load(file('$tmpdir/secret.txt'))['PrivateKey'])")

echo "Signing $1..." >&2
echo $passphrase | gpg \
    --homedir $tmpdir \
    --local-user aws-cdk@amazon.com \
    --batch --yes \
    --passphrase-fd 0 \
    --output $1.sig \
    --detach-sign $1

echo "Done!" >&2
