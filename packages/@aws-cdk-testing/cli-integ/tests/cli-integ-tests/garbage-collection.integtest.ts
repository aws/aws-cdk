import { BatchGetImageCommand, ListImagesCommand, PutImageCommand } from '@aws-sdk/client-ecr';
import { GetObjectTaggingCommand, ListObjectsV2Command, PutObjectTaggingCommand } from '@aws-sdk/client-s3';
import { integTest, randomString, withoutBootstrap } from '../../lib';

const S3_ISOLATED_TAG = 'aws-cdk:isolated';
const ECR_ISOLATED_TAG = 'aws-cdk.isolated';

jest.setTimeout(2 * 60 * 60_000); // Includes the time to acquire locks, worst-case single-threaded runtime

integTest(
  'Garbage Collection deletes unused s3 objects',
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
  'Garbage Collection deletes unused ecr images',
  withoutBootstrap(async (fixture) => {
    const toolkitStackName = fixture.bootstrapStackName;

    await fixture.cdkBootstrapModern({
      toolkitStackName,
    });

    const repoName = await fixture.bootstrapRepoName();

    await fixture.cdkDeploy('docker-in-use', {
      options: [
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
    fixture.log('Setup complete!');

    await fixture.cdkDestroy('docker-in-use', {
      options: [
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });

    await fixture.cdkGarbageCollect({
      rollbackBufferDays: 0,
      type: 'ecr',
      bootstrapStackName: toolkitStackName,
    });
    fixture.log('Garbage collection complete!');

    // assert that the bootstrap repository is empty
    await fixture.aws.ecr.send(new ListImagesCommand({ repositoryName: repoName }))
      .then((result) => {
        expect(result.imageIds).toEqual([]);
      });
  }),
);

integTest(
  'Garbage Collection keeps in use s3 objects',
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
  'Garbage Collection keeps in use ecr images',
  withoutBootstrap(async (fixture) => {
    const toolkitStackName = fixture.bootstrapStackName;

    await fixture.cdkBootstrapModern({
      toolkitStackName,
    });

    const repoName = await fixture.bootstrapRepoName();

    await fixture.cdkDeploy('docker-in-use', {
      options: [
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
    fixture.log('Setup complete!');

    await fixture.cdkGarbageCollect({
      rollbackBufferDays: 0,
      type: 'ecr',
      bootstrapStackName: toolkitStackName,
    });
    fixture.log('Garbage collection complete!');

    // assert that the bootstrap repository is empty
    await fixture.aws.ecr.send(new ListImagesCommand({ repositoryName: repoName }))
      .then((result) => {
        expect(result.imageIds).toHaveLength(1);
      });

    await fixture.cdkDestroy('docker-in-use', {
      options: [
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
  }),
);

integTest(
  'Garbage Collection tags unused s3 objects',
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

    await fixture.cdkDestroy('lambda', {
      options: [
        '--context', `bootstrapBucket=${bootstrapBucketName}`,
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
  }),
);

integTest(
  'Garbage Collection tags unused ecr images',
  withoutBootstrap(async (fixture) => {
    const toolkitStackName = fixture.bootstrapStackName;

    await fixture.cdkBootstrapModern({
      toolkitStackName,
    });

    const repoName = await fixture.bootstrapRepoName();

    await fixture.cdkDeploy('docker-in-use', {
      options: [
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
    fixture.log('Setup complete!');

    await fixture.cdkDestroy('docker-in-use', {
      options: [
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });

    await fixture.cdkGarbageCollect({
      rollbackBufferDays: 100, // this will ensure that we do not delete assets immediately (and just tag them)
      type: 'ecr',
      bootstrapStackName: toolkitStackName,
    });
    fixture.log('Garbage collection complete!');

    await fixture.aws.ecr.send(new ListImagesCommand({ repositoryName: repoName }))
      .then((result) => {
        expect(result.imageIds).toHaveLength(2); // the second tag comes in as a second 'id'
      });
  }),
);

integTest(
  'Garbage Collection untags in-use s3 objects',
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
          Key: S3_ISOLATED_TAG,
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

integTest(
  'Garbage Collection untags in-use ecr images',
  withoutBootstrap(async (fixture) => {
    const toolkitStackName = fixture.bootstrapStackName;

    await fixture.cdkBootstrapModern({
      toolkitStackName,
    });

    const repoName = await fixture.bootstrapRepoName();

    await fixture.cdkDeploy('docker-in-use', {
      options: [
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
    fixture.log('Setup complete!');

    // Artificially add tagging to the asset in the bootstrap bucket
    const imageIds = await fixture.aws.ecr.send(new ListImagesCommand({ repositoryName: repoName }));
    const digest = imageIds.imageIds![0].imageDigest;
    const imageManifests = await fixture.aws.ecr.send(new BatchGetImageCommand({ repositoryName: repoName, imageIds: [{ imageDigest: digest }] }));
    const manifest = imageManifests.images![0].imageManifest;
    await fixture.aws.ecr.send(new PutImageCommand({ repositoryName: repoName, imageManifest: manifest, imageDigest: digest, imageTag: `0-${ECR_ISOLATED_TAG}-12345` }));

    await fixture.cdkGarbageCollect({
      rollbackBufferDays: 100, // this will ensure that we do not delete assets immediately (and just tag them)
      type: 'ecr',
      bootstrapStackName: toolkitStackName,
    });
    fixture.log('Garbage collection complete!');

    await fixture.aws.ecr.send(new ListImagesCommand({ repositoryName: repoName }))
      .then((result) => {
        expect(result.imageIds).toHaveLength(1); // the second tag has been removed
      });

    await fixture.cdkDestroy('docker-in-use', {
      options: [
        '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
        '--toolkit-stack-name', toolkitStackName,
        '--force',
      ],
    });
  }),
);
