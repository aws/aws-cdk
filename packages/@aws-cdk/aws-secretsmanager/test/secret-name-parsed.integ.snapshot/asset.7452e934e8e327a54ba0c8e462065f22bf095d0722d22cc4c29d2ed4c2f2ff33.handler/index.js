/* eslint-disable no-console */
var AWS = require('aws-sdk');

exports.handler = async function (event) {
  const props = event.ResourceProperties;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const secretsmanager = new AWS.SecretsManager();
    console.log(`Secrets to validate: ${props.Secrets}`);
    for (const secret of props.Secrets) {
      await validateSecretNameMatchesExpected(secretsmanager, secret);
    }
  }
}

async function validateSecretNameMatchesExpected(secretsmanager, secretInfo) {
  const secret = await secretsmanager.describeSecret({ SecretId: secretInfo.secretArn }).promise();
  if (secretInfo.secretName !== secret.Name) {
    throw new Error(`Actual secret name doesn't match expected. Actual: (${secret.Name}), Expected: (${secretInfo.secretName})`);
  }
}
