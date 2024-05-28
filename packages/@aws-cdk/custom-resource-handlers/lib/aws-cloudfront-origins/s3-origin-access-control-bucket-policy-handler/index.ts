/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { S3 } from '@aws-sdk/client-s3';

const S3_POLICY_STUB = JSON.stringify({ Version: '2012-10-17', Statement: [] });

const s3 = new S3({});

interface updateBucketPolicyProps {
  bucketName: string;
  distributionId: string;
  partition: string;
  accountId: string;
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const props = event.ResourceProperties;
    const distributionId = props.DistributionId;
    const accountId = props.AccountId;
    const partition = props.Partition;
    const bucketName = props.BucketName;
    const isImportedBucket = props.IsImportedBucket;

    if (isImportedBucket) {
      await updateBucketPolicy({ bucketName, distributionId, partition, accountId });
    }

    return {
      IsComplete: true,
    };
  } else {
    return;
  }
}

async function updateBucketPolicy(props: updateBucketPolicyProps) {
  // make API calls to update bucket policy
  try {
    console.log('calling getBucketPolicy...');
    const prevPolicyJson = (await s3.getBucketPolicy({ Bucket: props.bucketName }))?.Policy ?? S3_POLICY_STUB;
    const policy = JSON.parse(prevPolicyJson);
    console.log('Previous bucket policy:', JSON.stringify(policy, undefined, 2));
    const oacBucketPolicyStatement = {
      Sid: 'AllowS3OACAccess',
      Principal: {
        Service: ['cloudfront.amazonaws.com'],
      },
      Effect: 'Allow',
      Action: ['s3:GetObject'],
      Resource: [`arn:${props.partition}:s3:::${props.bucketName}/*`],
      Condition: {
        StringEquals: {
          'AWS:SourceArn': `arn:${props.partition}:cloudfront::${props.accountId}:distribution/${props.distributionId}`,
        },
      },
    };
    // Give Origin Access Control permission to access the bucket
    let updatedBucketPolicy = updatePolicy(policy, oacBucketPolicyStatement);
    console.log('Updated bucket policy', JSON.stringify(updatedBucketPolicy, undefined, 2));

    await s3.putBucketPolicy({
      Bucket: props.bucketName,
      Policy: JSON.stringify(updatedBucketPolicy),
    });
    console.log('AFTER FIRST: Put bucket policy');

    // Check if policy has OAI principal and remove
    updatedBucketPolicy.Statement = updatedBucketPolicy.Statement.filter((statement: any) => !isOaiPrincipal(statement));
    console.log('Updated bucket policy AGAIN:', JSON.stringify(updatedBucketPolicy, undefined, 2));
    await s3.putBucketPolicy({
      Bucket: props.bucketName,
      Policy: JSON.stringify(updatedBucketPolicy),
    });

    console.log('success!');
  } catch (error: any) {
    console.log(error);
    if (error.name === 'NoSuchBucket') {
      throw error; // Rethrow for further logging/handling up the stack
    }

    console.log(`Could not set new origin access control policy on bucket '${props.bucketName}'.`);
  }
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
  // Check to see if a duplicate key policy exists by matching on the sid. This is to prevent duplicate key policies
  // from being added/updated in response to a stack being updated one or more times after initial creation.
  const existingPolicyIndex = currentPolicy.Statement.findIndex((statement: any) => statement.Sid === policyStatementToAdd.Sid);
  // If a match is found, overwrite the key policy statement...
  // Otherwise, push the new key policy to the array of statements
  if (existingPolicyIndex > -1) {
    currentPolicy.Statement[existingPolicyIndex] = policyStatementToAdd;
  } else {
    currentPolicy.Statement.push(policyStatementToAdd);
  }
  // Return the result
  return currentPolicy;
};

/**
 * Check if the policy contains an OAI principal
 */
function isOaiPrincipal(statement: any) {
  if (statement.Principal && statement.Principal.AWS) {
    const principal = statement.Principal.AWS;
    if (typeof principal === 'string' && principal.includes('cloudfront:user/CloudFront Origin Access Identity')) {
      return true;
    }
  }
  return false;
}