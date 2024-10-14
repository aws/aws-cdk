import { GetObjectTaggingCommand, ListObjectsV2Command, PutObjectTaggingCommand } from '@aws-sdk/client-s3';
import { integTest, randomString, withoutBootstrap } from '../../lib';

jest.setTimeout(2 * 60 * 60_000); // Includes the time to acquire locks, worst-case single-threaded runtime

integTest(
  'Garbage Collection deletes unused assets',
  withoutBootstrap(async (fixture) => {
    const toolkitStackName = fixture.bootstrapStackName;
    const bootstrapBucketName = `aws-cdk-garbage-collect-integ-test-bckt-${randomString()}`;
    fixture.rememberToDeleteBucket(bootstrapBucketName); // just in case

    await fixture.cdkBootstrapModern({
      toolkitStackName,
      bootstrapBucketName,
    });

    await fixture.cdkDeploy('lambda', {
      options: [
        '--context', `bootstrapBucket=${bootstrapBucketName}`,
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
    fixture.log('Setup complete!');

    await fixture.cdkDestroy('lambda', {
      options: [
        '--context', `bootstrapBucket=${bootstrapBucketName}`,
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });

    await fixture.cdkGarbageCollect({
      rollbackBufferDays: 0,
      type: 's3',
      bootstrapStackName: toolkitStackName,
    });
    fixture.log('Garbage collection complete!');

    // assert that the bootstrap bucket is empty
    await fixture.aws.s3.send(new ListObjectsV2Command({ Bucket: bootstrapBucketName }))
      .then((result) => {
        expect(result.Contents).toBeUndefined();
      });
  }),
);

integTest(
  'Garbage Collection keeps in use assets',
  withoutBootstrap(async (fixture) => {
    const toolkitStackName = fixture.bootstrapStackName;
    const bootstrapBucketName = `aws-cdk-garbage-collect-integ-test-bckt-${randomString()}`;
    fixture.rememberToDeleteBucket(bootstrapBucketName); // just in case

    await fixture.cdkBootstrapModern({
      toolkitStackName,
      bootstrapBucketName,
    });

    await fixture.cdkDeploy('lambda', {
      options: [
        '--context', `bootstrapBucket=${bootstrapBucketName}`,
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
    fixture.log('Setup complete!');

    await fixture.cdkGarbageCollect({
      rollbackBufferDays: 0,
      type: 's3',
      bootstrapStackName: toolkitStackName,
    });
    fixture.log('Garbage collection complete!');

    // assert that the bootstrap bucket has the object
    await fixture.aws.s3.send(new ListObjectsV2Command({ Bucket: bootstrapBucketName }))
      .then((result) => {
        expect(result.Contents).toHaveLength(1);
      });

    await fixture.cdkDestroy('lambda', {
      options: [
        '--context', `bootstrapBucket=${bootstrapBucketName}`,
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
    fixture.log('Teardown complete!');
  }),
);

integTest(
  'Garbage Collection tags unused assets',
  withoutBootstrap(async (fixture) => {
    const toolkitStackName = fixture.bootstrapStackName;
    const bootstrapBucketName = `aws-cdk-garbage-collect-integ-test-bckt-${randomString()}`;
    fixture.rememberToDeleteBucket(bootstrapBucketName); // just in case

    await fixture.cdkBootstrapModern({
      toolkitStackName,
      bootstrapBucketName,
    });

    await fixture.cdkDeploy('lambda', {
      options: [
        '--context', `bootstrapBucket=${bootstrapBucketName}`,
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
    fixture.log('Setup complete!');

    await fixture.cdkDestroy('lambda', {
      options: [
        '--context', `bootstrapBucket=${bootstrapBucketName}`,
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });

    await fixture.cdkGarbageCollect({
      rollbackBufferDays: 100, // this will ensure that we do not delete assets immediately (and just tag them)
      type: 's3',
      bootstrapStackName: toolkitStackName,
    });
    fixture.log('Garbage collection complete!');

    // assert that the bootstrap bucket has the object and is tagged
    await fixture.aws.s3.send(new ListObjectsV2Command({ Bucket: bootstrapBucketName }))
      .then(async (result) => {
        expect(result.Contents).toHaveLength(2); // also the CFN template
        const key = result.Contents![0].Key;
        const tags = await fixture.aws.s3.send(new GetObjectTaggingCommand({ Bucket: bootstrapBucketName, Key: key }));
        expect(tags.TagSet).toHaveLength(1);
      });
  }),
);

integTest(
  'Garbage Collection untags in-use assets',
  withoutBootstrap(async (fixture) => {
    const toolkitStackName = fixture.bootstrapStackName;
    const bootstrapBucketName = `aws-cdk-garbage-collect-integ-test-bckt-${randomString()}`;
    fixture.rememberToDeleteBucket(bootstrapBucketName); // just in case

    await fixture.cdkBootstrapModern({
      toolkitStackName,
      bootstrapBucketName,
    });

    await fixture.cdkDeploy('lambda', {
      options: [
        '--context', `bootstrapBucket=${bootstrapBucketName}`,
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
    fixture.log('Setup complete!');

    // Artificially add tagging to the asset in the bootstrap bucket
    const result = await fixture.aws.s3.send(new ListObjectsV2Command({ Bucket: bootstrapBucketName }));
    const key = result.Contents!.filter((c) => c.Key?.split('.')[1] == 'zip')[0].Key; // fancy footwork to make sure we have the asset key
    await fixture.aws.s3.send(new PutObjectTaggingCommand({
      Bucket: bootstrapBucketName,
      Key: key,
      Tagging: {
        TagSet: [{
          Key: 'aws-cdk:isolated',
          Value: '12345',
        }, {
          Key: 'bogus',
          Value: 'val',
        }],
      },
    }));

    await fixture.cdkGarbageCollect({
      rollbackBufferDays: 100, // this will ensure that we do not delete assets immediately (and just tag them)
      type: 's3',
      bootstrapStackName: toolkitStackName,
    });
    fixture.log('Garbage collection complete!');

    // assert that the isolated object tag is removed while the other tag remains
    const newTags = await fixture.aws.s3.send(new GetObjectTaggingCommand({ Bucket: bootstrapBucketName, Key: key }));

    expect(newTags.TagSet).toEqual([{
      Key: 'bogus',
      Value: 'val',
    }]);
  }),
);
