import { App } from 'aws-cdk-lib';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { testWithXRepos } from './util';
import { DefaultStagingStack } from '../lib';

describe('default staging stack', () => {
  test('can have at least 20 ECR Repositories', () => {
    // Decreasing this number is a breaking change! We have committed
    // to supporting 20 ECR repositories in the template. We can only
    // increase this commitment, not decrease it.
    expect(testWithXRepos(20)).toBeTruthy();
  });

  describe('appId fails', () => {
    test('when appId > 20 characters', () => {
      const app = new App();
      expect(() => new DefaultStagingStack(app, 'stack', {
        appId: 'a'.repeat(21),
        qualifier: 'qualifier',
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      })).toThrow(/appId expected no more than 20 characters but got 21 characters./);
    });

    test('when uppercase characters are used', () => {
      const app = new App();
      expect(() => new DefaultStagingStack(app, 'stack', {
        appId: 'ABCDEF',
        qualifier: 'qualifier',
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      })).toThrow(/appId only accepts lowercase characters./);
    });

    test('when symbols are used', () => {
      const app = new App();
      expect(() => new DefaultStagingStack(app, 'stack', {
        appId: 'ca$h',
        qualifier: 'qualifier',
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      })).toThrow(/appId expects only letters, numbers, and dashes \('-'\)/);
    });

    test('when multiple rules broken at once', () => {
      const app = new App();
      const appId = 'AB&C'.repeat(10);
      expect(() => new DefaultStagingStack(app, 'stack', {
        appId,
        qualifier: 'qualifier',
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      })).toThrow([
        `appId ${appId} has errors:`,
        'appId expected no more than 20 characters but got 40 characters.',
        'appId only accepts lowercase characters.',
        'appId expects only letters, numbers, and dashes (\'-\')',
      ].join('\n'));
    });
  });
});
