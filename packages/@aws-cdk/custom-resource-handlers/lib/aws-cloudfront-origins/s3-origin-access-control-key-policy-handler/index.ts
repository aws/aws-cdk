/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { KMS, KeyManagerType } from '@aws-sdk/client-kms';

const kms = new KMS({});

const KEY_ACTIONS: Record<string, string[]> = {
  READ: ['kms:Decrypt'],
  WRITE: ['kms:Encrypt', 'kms:GenerateDataKey*'],
};

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const props = event.ResourceProperties;
    const distributionId = props.DistributionId;
    const kmsKeyId = props.KmsKeyId;
    const accountId = props.AccountId;
    const partition = props.Partition;
    const region = process.env.AWS_REGION;
    const accessLevels = props.AccessLevels;

    const describeKeyCommandResponse = await kms.describeKey({
      KeyId: kmsKeyId,
    });

    if (describeKeyCommandResponse.KeyMetadata?.KeyManager === KeyManagerType.AWS) {
      // AWS managed key, cannot update key policy
      return;
    }

    // The PolicyName is specified as "default" below because that is the only valid name as
    // written in the documentation for @aws-sdk/client-kms.GetKeyPolicyCommandInput:
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-kms/Interface/GetKeyPolicyCommandInput/
    const getKeyPolicyCommandResponse = await kms.getKeyPolicy({
      KeyId: kmsKeyId,
      PolicyName: 'default',
    });

    if (!getKeyPolicyCommandResponse.Policy) {
      throw new Error('An error occurred while retrieving the key policy.');
    }

    // Define the updated key policy to allow CloudFront Distribution access
    const keyPolicy = JSON.parse(getKeyPolicyCommandResponse?.Policy);
    console.log('Retrieved key policy', JSON.stringify(keyPolicy, undefined, 2));

    const actions = getActions(accessLevels);

    const kmsKeyPolicyStatement = {
      Sid: 'AllowCloudFrontServicePrincipalSSE-KMS',
      Effect: 'Allow',
      Principal: {
        Service: [
          'cloudfront.amazonaws.com',
        ],
      },
      Action: actions,
      Resource: `arn:${partition}:kms:${region}:${accountId}:key/${kmsKeyId}`,
      Condition: {
        StringEquals: {
          'AWS:SourceArn': `arn:${partition}:cloudfront::${accountId}:distribution/${distributionId}`,
        },
      },
    };

    const updatedKeyPolicy = updatePolicy(keyPolicy, kmsKeyPolicyStatement);
    console.log('Updated key policy', JSON.stringify(updatedKeyPolicy, undefined, 2));
    await kms.putKeyPolicy({
      KeyId: kmsKeyId,
      Policy: JSON.stringify(updatedKeyPolicy),
      PolicyName: 'default',
    });

    return {
      IsComplete: true,
    };
  } else {
    return;
  }
}

function getActions(accessLevels: string[]): string[] {
  let actions: string[] = [];
  for (const accessLevel of accessLevels) {
    actions = actions.concat(KEY_ACTIONS[accessLevel]);
  }
  return actions;
}

/**
 * Updates a provided policy with a provided policy statement. First checks whether the provided policy statement
 * already exists. If an existing policy is found with a matching sid, the provided policy will overwrite the existing
 * policy. If no matching policy is found, the provided policy will be appended onto the array of policy statements.
 * @param currentPolicy - the JSON.parse'd result of the otherwise stringified policy.
 * @param policyStatementToAdd - the policy statement to be added to the policy.
 * @returns currentPolicy - the updated policy.
 */
function updatePolicy(currentPolicy: any, policyStatementToAdd: any) {
  // // Check to see if a duplicate key policy exists by matching on the sid. This is to prevent duplicate key policies
  // // from being added/updated in response to a stack being updated one or more times after initial creation.
  // const existingPolicyIndex = currentPolicy.Statement.findIndex((statement: any) => statement.Sid === policyStatementToAdd.Sid);
  // // If a match is found, overwrite the key policy statement...
  // // Otherwise, push the new key policy to the array of statements
  // if (existingPolicyIndex > -1) {
  //   currentPolicy.Statement[existingPolicyIndex] = policyStatementToAdd;
  // } else {
  //   currentPolicy.Statement.push(policyStatementToAdd);
  // }

  if (!isStatementInPolicy(currentPolicy, policyStatementToAdd)) {
    currentPolicy.Statement.push(policyStatementToAdd);
  }
  // Return the result
  return currentPolicy;
};

function isStatementInPolicy(policy: any, statement: any): boolean {
  return policy.Statement.some((existingStatement: any) => JSON.stringify(existingStatement) === JSON.stringify(statement));
}