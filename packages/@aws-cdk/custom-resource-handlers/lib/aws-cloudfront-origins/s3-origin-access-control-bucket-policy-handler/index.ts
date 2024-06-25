/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { S3 } from '@aws-sdk/client-s3';

const S3_POLICY_STUB = JSON.stringify({ Version: '2012-10-17', Statement: [] });
const S3_OAC_POLICY_SID = 'GrantOACAccessToS3';
const s3 = new S3({});

interface updateBucketPolicyProps {
  bucketName: string;
  distributionId: string;
  partition: string;
  accountId: string;
  actions: string[];
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const props = event.ResourceProperties;
  const distributionId = props.DistributionId;
  const accountId = props.AccountId;
  const partition = props.Partition;
  const bucketName = props.BucketName;
  const actions = props.Actions;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    await updateBucketPolicy({ bucketName, distributionId, partition, accountId, actions });

    return {
      IsComplete: true,
    };
  } else if (event.RequestType === 'Delete') {
    await removeOacPolicyStatement(
      bucketName,
      distributionId,
      partition,
      accountId
    )
    return {
      IsComplete: true,
    };
  } else {
    return;
  }
}

export async function updateBucketPolicy(props: updateBucketPolicyProps) {
  // make API calls to update bucket policy
  try {
    console.log('calling getBucketPolicy...');
    const prevPolicyJson = (await s3.getBucketPolicy({ Bucket: props.bucketName }))?.Policy ?? S3_POLICY_STUB;
    const policy = JSON.parse(prevPolicyJson);
    console.log('Previous bucket policy:', JSON.stringify(policy, undefined, 2));

    const oacBucketPolicyStatement = {
      Sid: S3_OAC_POLICY_SID,
      Principal: {
        Service: ['cloudfront.amazonaws.com'],
      },
      Effect: 'Allow',
      Action: props.actions,
      Resource: [`arn:${props.partition}:s3:::${props.bucketName}/*`],
      Condition: {
        StringEquals: {
          'AWS:SourceArn': `arn:${props.partition}:cloudfront::${props.accountId}:distribution/${props.distributionId}`,
        },
      },
    };
    // Give Origin Access Control permission to access the bucket
    let updatedBucketPolicy = appendStatementToPolicy(policy, oacBucketPolicyStatement);
    console.log('Updated bucket policy', JSON.stringify(updatedBucketPolicy, undefined, 2));

    await s3.putBucketPolicy({
      Bucket: props.bucketName,
      Policy: JSON.stringify(updatedBucketPolicy),
    });

    // Check if policy has OAI principal and remove
    await removeOaiPolicyStatements(updatedBucketPolicy, props.bucketName);

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
 * already exists. If an existing policy is found, there will be no operation. If no matching policy
 * is found, the provided policy will be appended onto the array of policy statements.
 * @param currentPolicy - the JSON.parse'd result of the otherwise stringified policy.
 * @param policyStatementToAdd - the policy statement to be added to the policy.
 * @returns currentPolicy - the updated policy.
 */
export function appendStatementToPolicy(currentPolicy: any, policyStatementToAdd: any) {
  if (!isStatementInPolicy(currentPolicy, policyStatementToAdd)) {
    currentPolicy.Statement.push(policyStatementToAdd);
  }

  // Return the result
  return currentPolicy;
};

export function isStatementInPolicy(policy: any, statement: any): boolean {
  return policy.Statement.some((existingStatement: any) => JSON.stringify(existingStatement) === JSON.stringify(statement));
}

/**
 * Check if the policy contains an OAI principal
 */
export function isOaiPrincipal(statement: any) {
  if (statement.Principal && statement.Principal.AWS) {
    const principal = statement.Principal.AWS;
    if (typeof principal === 'string' && principal.includes('cloudfront:user/CloudFront Origin Access Identity')) {
      return true;
    }
  }
  return false;
}

export async function removeOaiPolicyStatements(bucketPolicy: any, bucketName: string) {
  const currentPolicyStatementLength = bucketPolicy.Statement.length;
  const filteredPolicyStatement = bucketPolicy.Statement.filter((statement: any) => !isOaiPrincipal(statement));

  if (currentPolicyStatementLength !== filteredPolicyStatement.length) {
    bucketPolicy.Statement = filteredPolicyStatement;
    await s3.putBucketPolicy({
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy),
    });
  }
  console.log('Updated bucket policy to remove OAI principal policy statement:', JSON.stringify(bucketPolicy, undefined, 2));
}

export async function removeOacPolicyStatement(bucketName: string, distributionId: string, partition: string, accountId: string) {
  try {
    console.log('calling getBucketPolicy...');
    const prevPolicyJson = (await s3.getBucketPolicy({ Bucket: bucketName }))?.Policy;

    // Return if bucket does not have a policy
    if (!prevPolicyJson) {
      return;
    }

    const policy = JSON.parse(prevPolicyJson);
    console.log('Previous bucket policy:', JSON.stringify(policy, undefined, 2));

    const updatedBucketPolicy = {
      ...policy,
      Statement: policy.Statement.filter((statement: any) => !isOacPolicyStatement(
        statement,
        distributionId,
        partition,
        accountId
      )),
    };

    console.log('Updated bucket policy', JSON.stringify(updatedBucketPolicy, undefined, 2));

    await s3.putBucketPolicy({
      Bucket: bucketName,
      Policy: JSON.stringify(updatedBucketPolicy),
    });
  } catch (error: any) {
    console.log(error);
    if (error.name === 'NoSuchBucket') {
      throw error; // Rethrow for further logging/handling up the stack
    }

    console.log(`Could not remove origin access control policy from bucket '${bucketName}'.`);
  }
}

export function isOacPolicyStatement(statement: any, distributionId: string, partition: string, accountId: string): boolean {
  return (
    statement.Sid === S3_OAC_POLICY_SID &&
    statement.Principal &&
    statement.Principal.Service &&
    statement.Principal.Service.includes('cloudfront.amazonaws.com') &&
    statement.Condition &&
    statement.Condition.StringEquals &&
    statement.Condition.StringEquals['AWS:SourceArn'] === `arn:${partition}:cloudfront::${accountId}:distribution/${distributionId}`
  );
}
