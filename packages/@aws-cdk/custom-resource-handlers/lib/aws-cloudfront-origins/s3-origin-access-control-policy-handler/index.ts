/* eslint-disable import/no-extraneous-dependencies */
import { KMS, KeyManagerType } from '@aws-sdk/client-kms';

const kmsClient = new KMS({});

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const props = event.ResourceProperties;
    const distributionId = props.DistributionId;
    const kmsKeyId = props.KmsKeyId;
    const accountId = props.AccountId;
    const partition = props.Partition;
    const region = process.env.AWS_REGION;

    const describeKeyCommandResponse = await kmsClient.describeKey({
      KeyId: kmsKeyId,
    });

    if (describeKeyCommandResponse.KeyMetadata?.KeyManager === KeyManagerType.AWS) {
      // AWS managed key, cannot update key policy
      return;
    }

    // The PolicyName is specified as "default" below because that is the only valid name as
    // written in the documentation for @aws-sdk/client-kms.GetKeyPolicyCommandInput:
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-kms/Interface/GetKeyPolicyCommandInput/
    const getKeyPolicyCommandResponse = await kmsClient.getKeyPolicy({
      KeyId: kmsKeyId,
      PolicyName: 'default',
    });

    if (!getKeyPolicyCommandResponse.Policy) {
      throw new Error('An error occurred while retrieving the key policy.');
    }

    // Define the updated key policy to allow CloudFront Distribution access
    const keyPolicy = JSON.parse(getKeyPolicyCommandResponse?.Policy);
    const kmsKeyPolicyStatement = {
      Sid: 'AllowCloudFrontServicePrincipalSSE-KMS',
      Effect: 'Allow',
      Principal: {
        Service: [
          'cloudfront.amazonaws.com',
        ],
      },
      Action: [
        'kms:Decrypt',
        'kms:Encrypt',
        'kms:GenerateDataKey*',
      ],
      Resource: `arn:${partition}:kms:${region}:${accountId}:key/${kmsKeyId}`,
      Condition: {
        StringEquals: {
          'AWS:SourceArn': `arn:${partition}:cloudfront::${accountId}:distribution/${distributionId}`,
        },
      },
    };
    const updatedKeyPolicy = updateKeyPolicy(keyPolicy, kmsKeyPolicyStatement);
    await kmsClient.putKeyPolicy({
      KeyId: kmsKeyId,
      Policy: JSON.stringify(updatedKeyPolicy),
      PolicyName: 'default',
    });

    return {
      IsComplete: true,
    };
  } else if (event.RequestType === 'Delete') {
    return;
  }
}

/**
 * Updates a provided key policy with a provided key policy statement. First checks whether the provided key policy statement
 * already exists. If an existing key policy is found with a matching sid, the provided key policy will overwrite the existing
 * key policy. If no matching key policy is found, the provided key policy will be appended onto the array of policy statements.
 * @param keyPolicy - the JSON.parse'd result of the otherwise stringified key policy.
 * @param keyPolicyStatement - the key policy statement to be added to the key policy.
 * @returns keyPolicy - the updated key policy.
 */
export const updateKeyPolicy = (keyPolicy: any, keyPolicyStatement: any) => {
  // Check to see if a duplicate key policy exists by matching on the sid. This is to prevent duplicate key policies
  // from being added/updated in response to a stack being updated one or more times after initial creation.
  const existingKeyPolicyIndex = keyPolicy.Statement.findIndex((statement: any) => statement.Sid === keyPolicyStatement.Sid);
  // If a match is found, overwrite the key policy statement...
  // Otherwise, push the new key policy to the array of statements
  if (existingKeyPolicyIndex > -1) {
    keyPolicy.Statement[existingKeyPolicyIndex] = keyPolicyStatement;
  } else {
    keyPolicy.Statement.push(keyPolicyStatement);
  }
  // Return the result
  return keyPolicy;
};