import { App, Stack } from 'aws-cdk-lib';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { APP_ID } from './util';
import { AppStagingSynthesizer } from '../lib';

describe('per environment cache', () => {
  test('same app, same env', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    });
    new Stack(app, 'Stack1', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });
    new Stack(app, 'Stack2', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });

    // THEN
    // stacks share the same staging resources
    const asm = app.synth();
    expect(asm.stacks.length).toEqual(3);
    const stagingResources = asm.stacks.filter((s) => s.displayName.startsWith('StagingStack'));
    expect(stagingResources.length).toEqual(1);
  });

  test('same app, different envs', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    });
    new Stack(app, 'Stack1', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });
    new Stack(app, 'Stack2', {
      env: {
        account: '000000000000',
        region: 'us-west-2',
      },
    });

    // THEN
    // separate stacks for staging resources
    const asm = app.synth();
    expect(asm.stacks.length).toEqual(4);
    const stagingResources = asm.stacks.filter((s) => s.displayName.startsWith('StagingStack'));
    expect(stagingResources.length).toEqual(2);
  });

  test('apps must be gnostic', () => {
    // GIVEN
    const app = new App({
      defaultStackSynthesizer: AppStagingSynthesizer.defaultResources({
        appId: APP_ID,
        stagingBucketEncryption: BucketEncryption.S3_MANAGED,
      }),
    });
    new Stack(app, 'Stack1', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });

    // THEN
    expect(() => new Stack(app, 'Stack2')).toThrow(/It is not safe to use AppStagingSynthesizer for both environment-agnostic and environment-aware stacks at the same time./);
  });
});
