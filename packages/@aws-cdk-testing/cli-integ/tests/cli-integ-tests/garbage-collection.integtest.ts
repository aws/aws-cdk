import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { integTest, randomString, withoutBootstrap } from '../../lib';

jest.setTimeout(2 * 60 * 60_000); // Includes the time to acquire locks, worst-case single-threaded runtime

// this is to ensure that asset bundling for apps under a stage does not break
integTest(
  'Basic Garbage Collection',
  withoutBootstrap(async (fixture) => {
    const toolkitStackName = fixture.bootstrapStackName;
    const bootstrapBucketName = `aws-cdk-garbage-collect-integ-test-bckt-${randomString()}`;
    fixture.rememberToDeleteBucket(bootstrapBucketName); // just in case

    await fixture.cdkBootstrapModern({
      toolkitStackName,
      bootstrapBucketName,
    });

    await fixture.cdkDeploy('lambda');
    fixture.log('Setup complete!');
    await fixture.cdkDestroy('lambda');
    fixture.log('Teardown complete!');
    await fixture.cdkGarbageCollect({
      days: 0,
      type: 's3',
    });
    fixture.log('Garbage collection complete!');

    // assert that the bootstrap bucket is empty
    await fixture.aws.s3.send(new ListObjectsV2Command({ Bucket: bootstrapBucketName }))
      .then((result) => {
        expect(result.Contents).toHaveLength(0);
      });
  }),
);
