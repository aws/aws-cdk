/* eslint-disable no-console */
var { SecretsManagerClient, DescribeSecretCommand } = require('@aws-sdk/client-secrets-manager');

exports.handler = async function (event) {
  const props = event.ResourceProperties;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const client = new SecretsManagerClient();
    console.log(`Secrets to validate: ${props.Secrets}`);
    for (const secret of props.Secrets) {
      await validateSecretNameMatchesExpected(client, secret);
    }
  }
}

async function validateSecretNameMatchesExpected(client, secretInfo) {
  const secret = await client.send(new DescribeSecretCommand({ SecretId: secretInfo.secretArn }));
  if (secretInfo.secretName !== secret.Name) {
    throw new Error(`Actual secret name doesn't match expected. Actual: (${secret.Name}), Expected: (${secretInfo.secretName})`);
  }
}
