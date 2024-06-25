import { S3Client, GetBucketPolicyCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { handler, updatePolicy, isStatementInPolicy, isOaiPrincipal, removeOacPolicyStatement, removeOaiPolicyStatements, isOacPolicyStatement } from '../../lib/aws-cloudfront-origins/s3-origin-access-control-bucket-policy-handler/index';

const s3Mock = mockClient(S3Client);

const eventCommon = {
  ServiceToken: 'token',
  ResponseURL: 'https://localhost',
  StackId: 'stackId',
  RequestId: 'requestId',
  LogicalResourceId: 'logicalResourceId',
  PhysicalResourceId: 'physicalId',
  ResourceType: 'Custom::S3OriginAccessControlBucketPolicyUpdater',
};

const bucketName = 'my-bucket';
const distributionId = 'EXAMPLE12345';
const partition = 'aws';
const accountId = '123456789012';

beforeEach(() => {
  s3Mock.reset();
});

describe('S3 OAC bucket policy handler', () => {
  it('should call getBucketPolicy and putBucketPolicy on Create or Update event', async () => {
    const event: Partial<AWSLambda.CloudFormationCustomResourceCreateEvent> = {
      ...eventCommon,
      RequestType: 'Create',
      ResourceProperties: {
        ServiceToken: 'token',
        DistributionId: distributionId,
        AccountId: accountId,
        Partition: partition,
        BucketName: bucketName,
        Actions: ['s3:GetObject'],
      },
    };

    await invokeHandler(event);

    expect(s3Mock).toHaveReceivedCommandTimes(GetBucketPolicyCommand, 1);
    expect(s3Mock).toHaveReceivedCommandTimes(PutBucketPolicyCommand, 1);
  })
});

describe('updatePolicy', () => {
  it('should add a new policy statement if it does not exist', () => {
    const currentPolicy = { Statement: [] };
    const policyStatementToAdd = { Sid: 'NewStatement', Effect: 'Allow', Action: 's3:GetObject', Resource: 'arn:aws:s3:::bucket/*' };

    const updatedPolicy = updatePolicy(currentPolicy, policyStatementToAdd);

    expect(updatedPolicy.Statement).toContainEqual(policyStatementToAdd);
  });

  it('should not add a duplicate policy statement', () => {
    const currentPolicy = { Statement: [{ Sid: 'ExistingStatement', Effect: 'Allow', Action: 's3:GetObject', Resource: 'arn:aws:s3:::bucket/*' }] };
    const policyStatementToAdd = { Sid: 'ExistingStatement', Effect: 'Allow', Action: 's3:GetObject', Resource: 'arn:aws:s3:::bucket/*' };

    const updatedPolicy = updatePolicy(currentPolicy, policyStatementToAdd);

    expect(updatedPolicy.Statement).toHaveLength(1);
  });
});

describe('isStatementInPolicy', () => {
  it('should return true if the statement exists in the policy', () => {
    const policy = { Statement: [{ Sid: 'ExistingStatement', Effect: 'Allow', Action: 's3:GetObject', Resource: 'arn:aws:s3:::bucket/*' }] };
    const statement = { Sid: 'ExistingStatement', Effect: 'Allow', Action: 's3:GetObject', Resource: 'arn:aws:s3:::bucket/*' };

    const result = isStatementInPolicy(policy, statement);

    expect(result).toBe(true);
  });

  it('should return false if the statement does not exist in the policy', () => {
    const policy = { Statement: [{ Sid: 'ExistingStatement', Effect: 'Allow', Action: 's3:GetObject', Resource: 'arn:aws:s3:::bucket/*' }] };
    const statement = { Sid: 'NewStatement', Effect: 'Allow', Action: 's3:GetObject', Resource: 'arn:aws:s3:::bucket/*' };

    const result = isStatementInPolicy(policy, statement);

    expect(result).toBe(false);
  });
});

describe('removeOaiPolicyStatements', () => {
  const bucketName = 'my-bucket';

  it('should remove OAI policy statements from the bucket policy', async () => {
    const bucketPolicy = {
      Version: "2012-10-17",
      Statement: [
        { Sid: 'Statement1', Principal: { AWS: 'cloudfront:user/CloudFront Origin Access Identity EXAMPLE12345' } },
        { Sid: 'Statement2', Principal: { AWS: 'arn:aws:iam::123456789012:root' } },
      ],
    };

    s3Mock.on(PutBucketPolicyCommand).resolves({});

    await removeOaiPolicyStatements(bucketPolicy, bucketName);

    expect(bucketPolicy.Statement).toHaveLength(1);
    expect(bucketPolicy.Statement[0].Sid).toBe('Statement2');
    expect(s3Mock).toHaveReceivedCommandTimes(PutBucketPolicyCommand, 1);
    expect(s3Mock).toHaveReceivedCommandWith(PutBucketPolicyCommand, {
      Bucket: bucketName,
      Policy: JSON.stringify({Version: "2012-10-17", Statement: [{ Sid: 'Statement2', Principal: { AWS: 'arn:aws:iam::123456789012:root' } }] }),
    });
  });

  it('should not update the bucket policy if no OAI policy statements are found', async () => {
    const bucketPolicy = {
      Statement: [
        { Sid: 'Statement1', Principal: { AWS: 'arn:aws:iam::123456789012:root' } },
        { Sid: 'Statement2', Principal: { AWS: 'arn:aws:iam::123456789012:user/SomeUser' } },
      ],
    };

    await removeOaiPolicyStatements(bucketPolicy, bucketName);

    expect(bucketPolicy.Statement).toHaveLength(2);
    expect(s3Mock).not.toHaveReceivedCommand(PutBucketPolicyCommand);
  });

  it('should handle an empty bucket policy', async () => {
    const bucketPolicy = { Statement: [] };

    await removeOaiPolicyStatements(bucketPolicy, bucketName);

    expect(bucketPolicy.Statement).toHaveLength(0);
    expect(s3Mock).not.toHaveReceivedCommand(PutBucketPolicyCommand);
  });
});

describe('isOaiPrincipal', () => {
  it('should return true if the statement has an OAI principal', () => {
    const statement = {
      Principal: {
        AWS: 'cloudfront:user/CloudFront Origin Access Identity EXAMPLE12345',
      },
    };

    const result = isOaiPrincipal(statement);

    expect(result).toBe(true);
  });

  it('should return false if the statement does not have an OAI principal', () => {
    const statement = {
      Principal: {
        AWS: 'arn:aws:iam::123456789012:root',
      },
    };

    const result = isOaiPrincipal(statement);

    expect(result).toBe(false);
  });
});

describe('removeOacPolicyStatement', () => {
  it('should remove the OAC policy statement from the bucket policy', async () => {
    const bucketPolicy = {
      Statement: [
        {
          Sid: 'GrantOACAccessToS3',
          Principal: { Service: ['cloudfront.amazonaws.com'] },
          Effect: 'Allow',
          Action: ['s3:GetObject'],
          Resource: [`arn:${partition}:s3:::${bucketName}/*`],
          Condition: {
            StringEquals: {
              'AWS:SourceArn': `arn:${partition}:cloudfront::${accountId}:distribution/${distributionId}`,
            },
          },
        },
        { Sid: 'Statement2', Principal: { AWS: 'arn:aws:iam::123456789012:root' } },
      ],
    };

    s3Mock.on(GetBucketPolicyCommand).resolves({ Policy: JSON.stringify(bucketPolicy) });
    s3Mock.on(PutBucketPolicyCommand).resolves({});

    await removeOacPolicyStatement(bucketName, distributionId, partition, accountId);

    expect(s3Mock).toHaveReceivedCommandTimes(GetBucketPolicyCommand, 1);
    expect(s3Mock).toHaveReceivedCommandTimes(PutBucketPolicyCommand, 1);
    expect(s3Mock).toHaveReceivedCommandWith(PutBucketPolicyCommand, {
      Bucket: bucketName,
      Policy: JSON.stringify({ Statement: [{ Sid: 'Statement2', Principal: { AWS: 'arn:aws:iam::123456789012:root' } }] }),
    });
  });
});

describe('isOacPolicyStatement', () => {
  it('should return true if the statement is an OAC policy statement', () => {
    const statement = {
      Sid: 'GrantOACAccessToS3',
      Principal: { Service: ['cloudfront.amazonaws.com'] },
      Effect: 'Allow',
      Action: ['s3:GetObject'],
      Resource: ['arn:aws:s3:::bucket/*'],
      Condition: {
        StringEquals: {
          'AWS:SourceArn': 'arn:aws:cloudfront::123456789012:distribution/EXAMPLE12345',
        },
      },
    };

    const result = isOacPolicyStatement(statement, distributionId, partition, accountId);

    expect(result).toBe(true);
  });

  it('should return false if the statement is not an OAC policy statement', () => {
    const statement = {
      Sid: 'Statement2',
      Principal: { AWS: 'arn:aws:iam::123456789012:root' },
    };

    const result = isOacPolicyStatement(statement, distributionId, partition, accountId);

    expect(result).toBe(false);
  });
});


// Helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}