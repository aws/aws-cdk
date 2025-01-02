import 'aws-sdk-client-mock-jest';
import { Environment } from '@aws-cdk/cx-api';
import { AppSyncClient } from '@aws-sdk/client-appsync';
import { CloudFormationClient, Stack, StackStatus } from '@aws-sdk/client-cloudformation';
import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { CodeBuildClient } from '@aws-sdk/client-codebuild';
import { EC2Client } from '@aws-sdk/client-ec2';
import { ECRClient } from '@aws-sdk/client-ecr';
import { ECSClient } from '@aws-sdk/client-ecs';
import { ElasticLoadBalancingV2Client } from '@aws-sdk/client-elastic-load-balancing-v2';
import { IAMClient } from '@aws-sdk/client-iam';
import { KMSClient } from '@aws-sdk/client-kms';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { Route53Client } from '@aws-sdk/client-route-53';
import { S3Client } from '@aws-sdk/client-s3';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { SFNClient } from '@aws-sdk/client-sfn';
import { SSMClient } from '@aws-sdk/client-ssm';
import { AssumeRoleCommand, GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { createCredentialChain } from '@aws-sdk/credential-providers';
import { AwsCredentialIdentity } from '@smithy/types';
import { mockClient } from 'aws-sdk-client-mock';
import { Account } from 'cdk-assets';
import { SDK, SdkProvider } from '../../lib';
import { CloudFormationStack } from '../../lib/api/util/cloudformation';

export const FAKE_CREDENTIALS: AwsCredentialIdentity = {
  accessKeyId: 'ACCESS',
  secretAccessKey: 'SECRET',
  sessionToken: 'TOKEN ',
};

export const FAKE_CREDENTIAL_CHAIN = createCredentialChain(() => Promise.resolve(FAKE_CREDENTIALS));

// Default implementations
export const mockAppSyncClient = mockClient(AppSyncClient);
export const mockCloudFormationClient = mockClient(CloudFormationClient);
export const mockCloudWatchClient = mockClient(CloudWatchLogsClient);
export const mockCodeBuildClient = mockClient(CodeBuildClient);
export const mockEC2Client = mockClient(EC2Client);
export const mockECRClient = mockClient(ECRClient);
export const mockECSClient = mockClient(ECSClient);
export const mockElasticLoadBalancingV2Client = mockClient(ElasticLoadBalancingV2Client);
export const mockIAMClient = mockClient(IAMClient);
export const mockKMSClient = mockClient(KMSClient);
export const mockLambdaClient = mockClient(LambdaClient);
export const mockRoute53Client = mockClient(Route53Client);
export const mockS3Client = mockClient(S3Client);
export const mockSecretsManagerClient = mockClient(SecretsManagerClient);
export const mockSSMClient = mockClient(SSMClient);
export const mockStepFunctionsClient = mockClient(SFNClient);
export const mockSTSClient = mockClient(STSClient);

/**
 * Resets clients back to defaults and resets the history
 * of usage of the mock.
 */
export const restoreSdkMocksToDefault = () => {
  mockAppSyncClient.reset();
  mockAppSyncClient.onAnyCommand().resolves({});
  mockCloudFormationClient.reset();
  mockCloudFormationClient.onAnyCommand().resolves({});
  mockCloudWatchClient.reset();
  mockCloudWatchClient.onAnyCommand().resolves({});
  mockCodeBuildClient.reset();
  mockCodeBuildClient.onAnyCommand().resolves({});
  mockEC2Client.reset();
  mockEC2Client.onAnyCommand().resolves({});
  mockECRClient.reset();
  mockECRClient.onAnyCommand().resolves({});
  mockECSClient.reset();
  mockECSClient.onAnyCommand().resolves({});
  mockElasticLoadBalancingV2Client.reset();
  mockElasticLoadBalancingV2Client.onAnyCommand().resolves({});
  mockIAMClient.reset();
  mockIAMClient.onAnyCommand().resolves({});
  mockKMSClient.reset();
  mockKMSClient.onAnyCommand().resolves({});
  mockLambdaClient.reset();
  mockLambdaClient.onAnyCommand().resolves({});
  mockRoute53Client.reset();
  mockRoute53Client.onAnyCommand().resolves({});
  mockS3Client.reset();
  mockS3Client.onAnyCommand().resolves({});
  mockSecretsManagerClient.reset();
  mockSecretsManagerClient.onAnyCommand().resolves({});
  mockSSMClient.reset();
  mockSSMClient.onAnyCommand().resolves({});
  mockStepFunctionsClient.reset();
  mockSSMClient.onAnyCommand().resolves({});
  mockSTSClient.reset();
};

export const setDefaultSTSMocks = () => {
  mockSTSClient.on(GetCallerIdentityCommand).resolves({
    Account: '123456789012',
    Arn: 'aws:swa:123456789012:some-other-stuff',
  });
  mockSTSClient.on(AssumeRoleCommand).resolves({
    Credentials: {
      AccessKeyId: FAKE_CREDENTIALS.accessKeyId,
      SecretAccessKey: FAKE_CREDENTIALS.secretAccessKey,
      SessionToken: FAKE_CREDENTIALS.sessionToken,
      Expiration: new Date(Date.now() + 3600 * 1000),
    },
  });
};

/**
 * MockSdkProvider that is mostly SdkProvider but
 * with fake credentials and account information.
 *
 * For mocking the actual clients, the above mocking
 * clients may be used.
 */
export class MockSdkProvider extends SdkProvider {
  constructor() {
    super(FAKE_CREDENTIAL_CHAIN, 'bermuda-triangle-1337');
  }

  public defaultAccount(): Promise<Account | undefined> {
    return Promise.resolve({ accountId: '123456789012', partition: 'aws' });
  }
}

/**
 * MockSdk that is mostly just the SDK but with fake
 * credentials and a full set of default client mocks.
 * These individual functions within those clients can be
 * customized in the test file that uses it.
 */
export class MockSdk extends SDK {
  constructor() {
    super(FAKE_CREDENTIAL_CHAIN, 'bermuda-triangle-1337', {});
  }
}

export function mockBootstrapStack(stack?: Partial<Stack>) {
  return CloudFormationStack.fromStaticInformation(new MockSdk().cloudFormation(), 'CDKToolkit', {
    CreationTime: new Date(),
    StackName: 'CDKToolkit',
    StackStatus: StackStatus.CREATE_COMPLETE,
    ...stack,
    Outputs: [
      { OutputKey: 'BucketName', OutputValue: 'BUCKET_NAME' },
      { OutputKey: 'BucketDomainName', OutputValue: 'BUCKET_ENDPOINT' },
      { OutputKey: 'ImageRepositoryName', OutputValue: 'REPO_NAME' },
      { OutputKey: 'BootstrapVersion', OutputValue: '1' },
      ...(stack?.Outputs ?? []),
    ],
  });
}

export function mockResolvedEnvironment(): Environment {
  return {
    account: '123456789',
    region: 'bermuda-triangle-1337',
    name: 'aws://123456789/bermuda-triangle-1337',
  };
}
