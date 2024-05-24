jest.mock('@aws-sdk/client-ecr');
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/client-secrets-manager');

import { ECR as ecr } from '@aws-sdk/client-ecr';
import { S3 as s3 } from '@aws-sdk/client-s3';
import { SecretsManager as SM } from '@aws-sdk/client-secrets-manager';
import { ECR, S3, SecretsManager } from '../lib/aws';

export function mockAws() {
  const mockEcr = new ecr() as ECR;
  const mockS3 = new s3() as S3;
  const mockSecretsManager = new SM() as SecretsManager;

  // Sane defaults which can be overridden
  mockS3.getBucketLocation = mockedApiResult({});
  mockS3.getBucketEncryption = mockedApiResult({});
  mockS3.upload = mockS3Upload();
  mockEcr.describeRepositories = mockedApiResult({
    repositories: [
      {
        repositoryUri: '12345.amazonaws.com/repo',
      },
    ],
  });
  mockSecretsManager.getSecretValue = mockedApiFailure('NotImplemented', 'You need to supply an implementation for getSecretValue');

  return {
    mockEcr,
    mockS3,
    mockSecretsManager,
    discoverPartition: jest.fn(() => Promise.resolve('swa')),
    discoverCurrentAccount: jest.fn(() => Promise.resolve({ accountId: 'current_account', partition: 'swa' })),
    discoverDefaultRegion: jest.fn(() => Promise.resolve('current_region')),
    discoverTargetAccount: jest.fn(() => Promise.resolve({ accountId: 'target_account', partition: 'swa' })),
    ecrClient: jest.fn(() => Promise.resolve(mockEcr)),
    s3Client: jest.fn(() => Promise.resolve(mockS3)),
    secretsManagerClient: jest.fn(() => Promise.resolve(mockSecretsManager)),
  };
}

export function errorWithCode(code: string, message: string) {
  const ret = new Error(message);
  (ret as any).code = code;
  return ret;
}

export function mockedApiResult(returnValue: any) {
  return jest.fn().mockResolvedValue(returnValue);
}

export function mockedApiFailure(code: string, message: string) {
  return jest.fn().mockRejectedValue(errorWithCode(code, message));
}

/**
 * Mock upload, draining the stream that we get before returning
 * so no race conditions happen with the restore() function in mock-fs.
 */
export function mockS3Upload(expectedContent?: string) {
  return jest.fn().mockImplementation(request => {
    return new Promise<void>((resolve, reject) => {
      const completedReading = new Array<string>();

      const stream: NodeJS.ReadableStream = request.Body;
      stream.on('data', (chonk) => {
        completedReading.push(chonk.toString());
      });
      stream.on('error', reject);
      stream.on('close', () => {
        const receivedContent = completedReading.join('');
        if (expectedContent !== undefined && expectedContent !== receivedContent) {
          throw new Error(`Expected to read '${expectedContent}' but read: '${receivedContent}'`);
        }
        resolve();
      });
    });
  });
}
