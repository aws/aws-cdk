import { KMS, KeyManagerType, DescribeKeyCommand, PutKeyPolicyCommand, GetKeyPolicyCommand } from '@aws-sdk/client-kms';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { handler, appendStatementToPolicy, getActions, isStatementInPolicy } from '../../lib/aws-cloudfront-origins/s3-origin-access-control-key-policy-handler/index';

const kmsMock = mockClient(KMS);

beforeEach(() => {
  kmsMock.reset();
});

const keyId = '1a2b3c4de-123a-4bcd-ef5g-ab123abc12bcd23'
const distributionId = 'EXAMPLE12345';
const partition = 'aws';
const accountId = '123456789012';

describe('S3 OAC key policy handler', () => {
  it('should skip updating the key policy for AWS managed keys', async () => {
    const event = {
      RequestType: 'Create',
      ResourceProperties: {
        DistributionId: distributionId,
        KmsKeyId: keyId,
        AccountId: accountId,
        Partition: partition,
        AccessLevels: ['READ'],
      },
    };

    kmsMock.on(DescribeKeyCommand).resolves({
      KeyMetadata: {
        KeyId: keyId,
        KeyManager: KeyManagerType.AWS,
      },
    });

    const response = await handler(event as any);
    expect(response).toBeUndefined();
    expect(kmsMock).not.toHaveReceivedCommand(GetKeyPolicyCommand);
    expect(kmsMock).not.toHaveReceivedCommand(PutKeyPolicyCommand);
  });

  it('should update the key policy for customer managed keys on Create/Update', async () => {
    const event = {
      RequestType: 'Create',
      ResourceProperties: {
        DistributionId: distributionId,
        KmsKeyId: keyId,
        AccountId: accountId,
        Partition: partition,
        AccessLevels: ['READ', 'WRITE'],
      },
    };

    const keyPolicy = {
      Statement: [],
    };

    kmsMock.on(DescribeKeyCommand).resolves({
      KeyMetadata: {
        KeyId: keyId,
        KeyManager: KeyManagerType.CUSTOMER,
      },
    });
    kmsMock.on(GetKeyPolicyCommand).resolves({ Policy: JSON.stringify(keyPolicy) });
    kmsMock.on(PutKeyPolicyCommand).resolves({});

    const response = await handler(event as any);
    expect(response).toEqual({ IsComplete: true });
    expect(kmsMock).toHaveReceivedCommandTimes(GetKeyPolicyCommand, 1);
    expect(kmsMock).toHaveReceivedCommandTimes(PutKeyPolicyCommand, 1);
  });

  it('should remove the OAC policy statement on Delete', async () => {
    const event = {
      RequestType: 'Delete',
      ResourceProperties: {
        DistributionId: distributionId,
        KmsKeyId: keyId,
        AccountId: accountId,
        Partition: partition,
      },
    };

    const keyPolicy = {
      Statement: [
        {
          Sid: 'GrantOACAccessToKMS',
          Effect: 'Allow',
          Principal: {
            Service: ['cloudfront.amazonaws.com'],
          },
          Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:GenerateDataKey*'],
          Resource: 'arn:aws:kms:us-east-1:123456789012:key/my-key',
          Condition: {
            StringEquals: {
              'AWS:SourceArn': 'arn:aws:cloudfront::123456789012:distribution/EXAMPLE12345',
            },
          },
        },
        {
          Sid: 'AnotherStatement',
          Effect: 'Allow',
          Principal: {
            AWS: 'arn:aws:iam::123456789012:root',
          },
          Action: ['kms:*'],
          Resource: '*',
        },
      ],
    };

    kmsMock.on(GetKeyPolicyCommand).resolves({ Policy: JSON.stringify(keyPolicy) });
    kmsMock.on(PutKeyPolicyCommand).resolves({});

    const response = await handler(event as any);
    expect(response).toEqual({ IsComplete: true });
    expect(kmsMock).toHaveReceivedCommandTimes(GetKeyPolicyCommand, 1);
    expect(kmsMock).toHaveReceivedCommandTimes(PutKeyPolicyCommand, 1);
    expect(kmsMock).toHaveReceivedCommandWith(PutKeyPolicyCommand, {
      KeyId: keyId,
      Policy: JSON.stringify({
        Statement: [
          {
            Sid: 'AnotherStatement',
            Effect: 'Allow',
            Principal: {
              AWS: 'arn:aws:iam::123456789012:root',
            },
            Action: ['kms:*'],
            Resource: '*',
          },
        ],
      }),
      PolicyName: 'default',
    });
  });
});

describe('getActions', () => {
  it('should return the correct actions for the given access levels', () => {
    expect(getActions(['READ'])).toEqual(['kms:Decrypt']);
    expect(getActions(['WRITE'])).toEqual(['kms:Encrypt', 'kms:GenerateDataKey*']);
    expect(getActions(['READ', 'WRITE'])).toEqual(['kms:Decrypt', 'kms:Encrypt', 'kms:GenerateDataKey*']);
  });

  it('should return an empty array for an empty access levels array', () => {
    expect(getActions([])).toEqual([]);
  });
});

describe('updatePolicy', () => {
  it('should add a new policy statement if it does not exist', () => {
    const currentPolicy = { Statement: [] };
    const policyStatementToAdd = { Sid: 'NewStatement', Effect: 'Allow', Action: ['kms:Decrypt'], Resource: '*' };
    const updatedPolicy = appendStatementToPolicy(currentPolicy, policyStatementToAdd);
    expect(updatedPolicy.Statement).toHaveLength(1);
    expect(updatedPolicy.Statement[0]).toEqual(policyStatementToAdd);
  });

  it('should not add a duplicate policy statement', () => {
    const currentPolicy = {
      Statement: [
        { Sid: 'ExistingStatement', Effect: 'Allow', Action: ['kms:Decrypt'], Resource: '*' },
      ],
    };
    const policyStatementToAdd = { Sid: 'ExistingStatement', Effect: 'Allow', Action: ['kms:Decrypt'], Resource: '*' };
    const updatedPolicy = appendStatementToPolicy(currentPolicy, policyStatementToAdd);
    expect(updatedPolicy.Statement).toHaveLength(1);
    expect(updatedPolicy.Statement[0]).toEqual(policyStatementToAdd);
  });
});

describe('isStatementInPolicy', () => {
  it('should return true if the statement exists in the policy', () => {
    const policy = {
      Statement: [
        { Sid: 'Statement1', Effect: 'Allow', Action: ['kms:Decrypt'], Resource: '*' },
        { Sid: 'Statement2', Effect: 'Deny', Action: ['kms:Encrypt'], Resource: '*' },
      ],
    };
    const statement = { Sid: 'Statement1', Effect: 'Allow', Action: ['kms:Decrypt'], Resource: '*' };
    expect(isStatementInPolicy(policy, statement)).toBe(true);
  });

  it('should return false if the statement does not exist in the policy', () => {
    const policy = {
      Statement: [
        { Sid: 'Statement1', Effect: 'Allow', Action: ['kms:Decrypt'], Resource: '*' },
        { Sid: 'Statement2', Effect: 'Deny', Action: ['kms:Encrypt'], Resource: '*' },
      ],
    };
    const statement = { Sid: 'Statement3', Effect: 'Allow', Action: ['kms:GenerateDataKey'], Resource: '*' };
    expect(isStatementInPolicy(policy, statement)).toBe(false);
  });
});