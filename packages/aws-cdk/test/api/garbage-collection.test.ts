/* eslint-disable import/order */

import {
  GetTemplateCommand,
  GetTemplateSummaryCommand,
  ListStacksCommand,
  Stack,
} from '@aws-sdk/client-cloudformation';
import { ECR_ISOLATED_TAG, GarbageCollector, S3_ISOLATED_TAG, ToolkitInfo } from '../../lib/api';
import { mockBootstrapStack, mockCloudFormationClient, mockECRClient, mockS3Client, MockSdk, MockSdkProvider } from '../util/mock-sdk';
import {
  DeleteObjectsCommand,
  DeleteObjectTaggingCommand,
  GetObjectTaggingCommand,
  ListObjectsV2Command,
  PutObjectTaggingCommand,
} from '@aws-sdk/client-s3';
import {
  ActiveAssetCache,
  BackgroundStackRefresh,
  BackgroundStackRefreshProps,
} from '../../lib/api/garbage-collection/stack-refresh';
import {
  BatchDeleteImageCommand,
  BatchGetImageCommand,
  DescribeImagesCommand,
  ListImagesCommand,
  PutImageCommand,
} from '@aws-sdk/client-ecr';

let garbageCollector: GarbageCollector;

let stderrMock: jest.SpyInstance;
const cfnClient = mockCloudFormationClient;
const s3Client = mockS3Client;
const ecrClient = mockECRClient;

const DAY = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

beforeEach(() => {
  // By default, we'll return a non-found toolkit info
  jest.spyOn(ToolkitInfo, 'lookup').mockResolvedValue(ToolkitInfo.bootstrapStackNotFoundInfo('GarbageStack'));

  // Suppress stderr to not spam output during tests
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => {
    return true;
  });

  prepareDefaultCfnMock();
  prepareDefaultS3Mock();
  prepareDefaultEcrMock();
});

afterEach(() => {
  stderrMock.mockReset();
});

function mockTheToolkitInfo(stackProps: Partial<Stack>) {
  jest.spyOn(ToolkitInfo, 'lookup').mockResolvedValue(ToolkitInfo.fromStack(mockBootstrapStack(stackProps)));
}

function gc(props: {
  type: 's3' | 'ecr' | 'all';
  rollbackBufferDays?: number;
  createdAtBufferDays?: number;
  action: 'full' | 'print' | 'tag' | 'delete-tagged';
}): GarbageCollector {
  return new GarbageCollector({
    sdkProvider: new MockSdkProvider(),
    action: props.action,
    resolvedEnvironment: {
      account: '123456789012',
      region: 'us-east-1',
      name: 'mock',
    },
    bootstrapStackName: 'GarbageStack',
    rollbackBufferDays: props.rollbackBufferDays ?? 0,
    createdBufferDays: props.createdAtBufferDays ?? 0,
    type: props.type,
    confirm: false,
  });
}

describe('S3 Garbage Collection', () => {
  test('rollbackBufferDays = 0 -- assets to be deleted', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 0,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);
    expect(s3Client).toHaveReceivedCommandTimes(ListObjectsV2Command, 2);

    // no tagging
    expect(s3Client).toHaveReceivedCommandTimes(GetObjectTaggingCommand, 0);
    expect(s3Client).toHaveReceivedCommandTimes(PutObjectTaggingCommand, 0);

    // assets are to be deleted
    expect(s3Client).toHaveReceivedCommandWith(DeleteObjectsCommand, {
      Bucket: 'BUCKET_NAME',
      Delete: {
        Objects: [
          { Key: 'asset1' },
          { Key: 'asset2' },
          { Key: 'asset3' },
        ],
        Quiet: true,
      },
    });
  });

  test('rollbackBufferDays > 0 -- assets to be tagged', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);
    expect(s3Client).toHaveReceivedCommandTimes(ListObjectsV2Command, 2);

    // assets tagged
    expect(s3Client).toHaveReceivedCommandTimes(GetObjectTaggingCommand, 3);
    expect(s3Client).toHaveReceivedCommandTimes(PutObjectTaggingCommand, 2);

    // no deleting
    expect(s3Client).toHaveReceivedCommandTimes(DeleteObjectsCommand, 0);
  });

  test('createdAtBufferDays > 0', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 0,
      createdAtBufferDays: 5,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    expect(s3Client).toHaveReceivedCommandWith(DeleteObjectsCommand, {
      Bucket: 'BUCKET_NAME',
      Delete: {
        Objects: [
          // asset1 not deleted because it is too young
          { Key: 'asset2' },
          { Key: 'asset3' },
        ],
        Quiet: true,
      },
    });
  });

  test('action = print -- does not tag or delete', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'print',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);
    expect(s3Client).toHaveReceivedCommandTimes(ListObjectsV2Command, 2);

    // get tags, but dont put tags
    expect(s3Client).toHaveReceivedCommandTimes(GetObjectTaggingCommand, 3);
    expect(s3Client).toHaveReceivedCommandTimes(PutObjectTaggingCommand, 0);

    // no deleting
    expect(s3Client).toHaveReceivedCommandTimes(DeleteObjectsCommand, 0);
  });

  test('action = tag -- does not delete', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'tag',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);
    expect(s3Client).toHaveReceivedCommandTimes(ListObjectsV2Command, 2);

    // tags objects
    expect(s3Client).toHaveReceivedCommandTimes(GetObjectTaggingCommand, 3);
    expect(s3Client).toHaveReceivedCommandTimes(PutObjectTaggingCommand, 2); // one object already has the tag

    // no deleting
    expect(s3Client).toHaveReceivedCommandTimes(DeleteObjectsCommand, 0);
  });

  test('action = delete-tagged -- does not tag', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'delete-tagged',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);
    expect(s3Client).toHaveReceivedCommandTimes(ListObjectsV2Command, 2);

    // get tags, but dont put tags
    expect(s3Client).toHaveReceivedCommandTimes(GetObjectTaggingCommand, 3);
    expect(s3Client).toHaveReceivedCommandTimes(PutObjectTaggingCommand, 0);
  });

  test('ignore objects that are modified after gc start', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    s3Client.on(ListObjectsV2Command).resolves({
      Contents: [
        { Key: 'asset1', LastModified: new Date(0) },
        { Key: 'asset2', LastModified: new Date(0) },
        { Key: 'asset3', LastModified: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) }, // future date ignored everywhere
      ],
      KeyCount: 3,
    });

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 0,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    // assets are to be deleted
    expect(s3Client).toHaveReceivedCommandWith(DeleteObjectsCommand, {
      Bucket: 'BUCKET_NAME',
      Delete: {
        Objects: [
          { Key: 'asset1' },
          { Key: 'asset2' },
          // no asset3
        ],
        Quiet: true,
      },
    });
  });
});

describe('ECR Garbage Collection', () => {
  test('rollbackBufferDays = 0 -- assets to be deleted', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 0,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    expect(ecrClient).toHaveReceivedCommandTimes(DescribeImagesCommand, 1);
    expect(ecrClient).toHaveReceivedCommandTimes(ListImagesCommand, 2);

    // no tagging
    expect(ecrClient).toHaveReceivedCommandTimes(PutImageCommand, 0);

    // assets are to be deleted
    expect(ecrClient).toHaveReceivedCommandWith(BatchDeleteImageCommand, {
      repositoryName: 'REPO_NAME',
      imageIds: [
        { imageDigest: 'digest3' },
        { imageDigest: 'digest2' },
      ],
    });
  });

  test('rollbackBufferDays > 0 -- assets to be tagged', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 3,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    // assets tagged
    expect(ecrClient).toHaveReceivedCommandTimes(PutImageCommand, 2);

    // no deleting
    expect(ecrClient).toHaveReceivedCommandTimes(BatchDeleteImageCommand, 0);
  });

  test('createdAtBufferDays > 0', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 0,
      createdAtBufferDays: 5,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    expect(ecrClient).toHaveReceivedCommandWith(BatchDeleteImageCommand, {
      repositoryName: 'REPO_NAME',
      imageIds: [
        // digest3 is too young to be deleted
        { imageDigest: 'digest2' },
      ],
    });
  });

  test('action = print -- does not tag or delete', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 3,
      action: 'print',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);

    // dont put tags
    expect(ecrClient).toHaveReceivedCommandTimes(PutImageCommand, 0);

    // no deleting
    expect(ecrClient).toHaveReceivedCommandTimes(BatchDeleteImageCommand, 0);
  });

  test('action = tag -- does not delete', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 3,
      action: 'tag',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);

    // tags objects
    expect(ecrClient).toHaveReceivedCommandTimes(PutImageCommand, 2);

    // no deleting
    expect(ecrClient).toHaveReceivedCommandTimes(BatchDeleteImageCommand, 0);
  });

  test('action = delete-tagged -- does not tag', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 3,
      action: 'delete-tagged',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);

    // dont put tags
    expect(ecrClient).toHaveReceivedCommandTimes(PutImageCommand, 0);
  });

  test('ignore images that are modified after gc start', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    prepareDefaultEcrMock();
    ecrClient.on(DescribeImagesCommand).resolves({
      imageDetails: [
        {
          imageDigest: 'digest3',
          imageTags: ['klmno'],
          imagePushedAt: daysInThePast(2),
          imageSizeInBytes: 100,
        },
        {
          imageDigest: 'digest2',
          imageTags: ['fghij'],
          imagePushedAt: yearsInTheFuture(1),
          imageSizeInBytes: 300_000_000,
        },
        {
          imageDigest: 'digest1',
          imageTags: ['abcde'],
          imagePushedAt: daysInThePast(100),
          imageSizeInBytes: 1_000_000_000,
        },
      ],
    });
    prepareDefaultCfnMock();

    garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 0,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    // assets are to be deleted
    expect(ecrClient).toHaveReceivedCommandWith(BatchDeleteImageCommand, {
      repositoryName: 'REPO_NAME',
      imageIds: [
        { imageDigest: 'digest3' },
      ],
    });
  });

  test('succeeds when no images are present', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    prepareDefaultEcrMock();
    ecrClient.on(ListImagesCommand).resolves({
      imageIds: [],
    });

    garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 0,
      action: 'full',
    });

    // succeeds without hanging
    await garbageCollector.garbageCollect();
  });

  test('tags are unique', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 3,
      action: 'tag',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);

    // tags objects
    expect(ecrClient).toHaveReceivedCommandTimes(PutImageCommand, 2);
    expect(ecrClient).toHaveReceivedCommandWith(PutImageCommand, {
      repositoryName: 'REPO_NAME',
      imageDigest: 'digest3',
      imageManifest: expect.any(String),
      imageTag: expect.stringContaining(`0-${ECR_ISOLATED_TAG}`),
    });
    expect(ecrClient).toHaveReceivedCommandWith(PutImageCommand, {
      repositoryName: 'REPO_NAME',
      imageDigest: 'digest2',
      imageManifest: expect.any(String),
      imageTag: expect.stringContaining(`1-${ECR_ISOLATED_TAG}`),
    });
  });

  test('listImagesCommand returns nextToken', async () => {
    // This test is to ensure that the garbage collector can handle paginated responses from the ECR API
    // If not handled correctly, the garbage collector will continue to make requests to the ECR API
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    prepareDefaultEcrMock();
    ecrClient.on(ListImagesCommand).resolves({ // default response
      imageIds: [
        {
          imageDigest: 'digest1',
          imageTag: 'abcde',
        },
        {
          imageDigest: 'digest2',
          imageTag: 'fghij',
        },
      ],
      nextToken: 'nextToken',
    }).on(ListImagesCommand, { // response when nextToken is provided
      repositoryName: 'REPO_NAME',
      nextToken: 'nextToken',
    }).resolves({
      imageIds: [
        {
          imageDigest: 'digest3',
          imageTag: 'klmno',
        },
      ],
    });
    ecrClient.on(BatchGetImageCommand).resolvesOnce({
      images: [
        { imageId: { imageDigest: 'digest1' } },
        { imageId: { imageDigest: 'digest2' } },
      ],
    }).resolvesOnce({
      images: [
        { imageId: { imageDigest: 'digest3' } },
      ],
    });
    ecrClient.on(DescribeImagesCommand).resolvesOnce({
      imageDetails: [
        {
          imageDigest: 'digest1',
          imageTags: ['abcde'],
          imagePushedAt: daysInThePast(100),
          imageSizeInBytes: 1_000_000_000,
        },
        { imageDigest: 'digest2', imageTags: ['fghij'], imagePushedAt: daysInThePast(10), imageSizeInBytes: 300_000_000 },
      ],
    }).resolvesOnce({
      imageDetails: [
        { imageDigest: 'digest3', imageTags: ['klmno'], imagePushedAt: daysInThePast(2), imageSizeInBytes: 100 },
      ],
    });
    prepareDefaultCfnMock();

    garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 0,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    expect(ecrClient).toHaveReceivedCommandTimes(DescribeImagesCommand, 2);
    expect(ecrClient).toHaveReceivedCommandTimes(ListImagesCommand, 4);

    // no tagging
    expect(ecrClient).toHaveReceivedCommandTimes(PutImageCommand, 0);

    expect(ecrClient).toHaveReceivedCommandWith(BatchDeleteImageCommand, {
      repositoryName: 'REPO_NAME',
      imageIds: [
        { imageDigest: 'digest2' },
        { imageDigest: 'digest3' },
      ],
    });
  });
});

describe('CloudFormation API calls', () => {
  test('bootstrap filters out other bootstrap versions', async () => {
    mockTheToolkitInfo({
      Parameters: [{
        ParameterKey: 'Qualifier',
        ParameterValue: 'zzzzzz',
      }],
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(GetTemplateSummaryCommand, 2);
    expect(cfnClient).toHaveReceivedCommandTimes(GetTemplateCommand, 0);
  });

  test('parameter hashes are included', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    cfnClient.on(GetTemplateSummaryCommand).resolves({
      Parameters: [{
        ParameterKey: 'AssetParametersasset1',
        DefaultValue: 'asset1',
      }],
    });

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 0,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);
    expect(s3Client).toHaveReceivedCommandTimes(ListObjectsV2Command, 2);

    // no tagging
    expect(s3Client).toHaveReceivedCommandTimes(GetObjectTaggingCommand, 0);
    expect(s3Client).toHaveReceivedCommandTimes(PutObjectTaggingCommand, 0);

    // assets are to be deleted
    expect(s3Client).toHaveReceivedCommandWith(DeleteObjectsCommand, {
      Bucket: 'BUCKET_NAME',
      Delete: {
        Objects: [
          // no 'asset1'
          { Key: 'asset2' },
          { Key: 'asset3' },
        ],
        Quiet: true,
      },
    });
  });
});

function prepareDefaultCfnMock() {
  const client = cfnClient;
  client.reset();

  client.on(ListStacksCommand).resolves({
    StackSummaries: [
      { StackName: 'Stack1', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date() },
      { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE', CreationTime: new Date() },
    ],
  });

  client.on(GetTemplateSummaryCommand).resolves({
    Parameters: [{
      ParameterKey: 'BootstrapVersion',
      DefaultValue: '/cdk-bootstrap/abcde/version',
    }],
  });

  client.on(GetTemplateCommand).resolves({
    TemplateBody: 'abcde',
  });

  return client;
}

function prepareDefaultS3Mock() {
  const client = s3Client;
  client.reset();

  client.on(ListObjectsV2Command).resolves({
    Contents: [
      { Key: 'asset1', LastModified: new Date(Date.now() - (2 * DAY)) },
      { Key: 'asset2', LastModified: new Date(Date.now() - (10 * DAY)) },
      { Key: 'asset3', LastModified: new Date(Date.now() - (100 * DAY)) },
    ],
    KeyCount: 3,
  });

  client.on(GetObjectTaggingCommand).callsFake((params) => ({
    TagSet: params.Key === 'asset2' ? [{ Key: S3_ISOLATED_TAG, Value: new Date().toISOString() }] : [],
  }));

  return client;
}

function prepareDefaultEcrMock() {
  const client = ecrClient;
  client.reset();

  client.on(BatchGetImageCommand).resolves({
    images: [
      { imageId: { imageDigest: 'digest1' } },
      { imageId: { imageDigest: 'digest2' } },
      { imageId: { imageDigest: 'digest3' } },
    ],
  });

  client.on(DescribeImagesCommand).resolves({
    imageDetails: [
      { imageDigest: 'digest3', imageTags: ['klmno'], imagePushedAt: daysInThePast(2), imageSizeInBytes: 100 },
      { imageDigest: 'digest2', imageTags: ['fghij'], imagePushedAt: daysInThePast(10), imageSizeInBytes: 300_000_000 },
      {
        imageDigest: 'digest1',
        imageTags: ['abcde'],
        imagePushedAt: daysInThePast(100),
        imageSizeInBytes: 1_000_000_000,
      },
    ],
  });

  client.on(ListImagesCommand).resolves({
    imageIds: [
      { imageDigest: 'digest1', imageTag: 'abcde' }, // inuse
      { imageDigest: 'digest2', imageTag: 'fghij' },
      { imageDigest: 'digest3', imageTag: 'klmno' },
    ],
  });

  return client;
}

describe('Garbage Collection with large # of objects', () => {
  const keyCount = 10000;

  test('tag only', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    mockClientsForLargeObjects();

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 1,
      action: 'tag',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);
    expect(s3Client).toHaveReceivedCommandTimes(ListObjectsV2Command, 2);

    // tagging is performed
    expect(s3Client).toHaveReceivedCommandTimes(GetObjectTaggingCommand, keyCount);
    expect(s3Client).toHaveReceivedCommandTimes(DeleteObjectTaggingCommand, 1000); // 1000 in use assets are erroneously tagged
    expect(s3Client).toHaveReceivedCommandTimes(PutObjectTaggingCommand, 5000); // 8000-4000 assets need to be tagged, + 1000 (since untag also calls this)
  });

  test('delete-tagged only', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    mockClientsForLargeObjects();

    garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 1,
      action: 'delete-tagged',
    });
    await garbageCollector.garbageCollect();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);
    expect(s3Client).toHaveReceivedCommandTimes(ListObjectsV2Command, 2);

    // delete previously tagged objects
    expect(s3Client).toHaveReceivedCommandTimes(GetObjectTaggingCommand, keyCount);
    expect(s3Client).toHaveReceivedCommandTimes(DeleteObjectsCommand, 4); // 4000 isolated assets are already tagged, deleted in batches of 1000
  });

  function mockClientsForLargeObjects() {
    cfnClient.on(ListStacksCommand).resolves({
      StackSummaries: [
        { StackName: 'Stack1', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date() },
      ],
    });

    cfnClient.on(GetTemplateSummaryCommand).resolves({
      Parameters: [{
        ParameterKey: 'BootstrapVersion',
        DefaultValue: '/cdk-bootstrap/abcde/version',
      }],
    });

    // add every 5th asset hash to the mock template body: 8000 assets are isolated
    const mockTemplateBody = [];
    for (let i = 0; i < keyCount; i+=5) {
      mockTemplateBody.push(`asset${i}hash`);
    }
    cfnClient.on(GetTemplateCommand).resolves({
      TemplateBody: mockTemplateBody.join('-'),
    });

    const contents: { Key: string; LastModified: Date }[] = [];
    for (let i = 0; i < keyCount; i++) {
      contents.push({
        Key: `asset${i}hash`,
        LastModified: new Date(0),
      });
    }

    s3Client.on(ListObjectsV2Command).resolves({
      Contents: contents,
      KeyCount: keyCount,
    });

    // every other object has the isolated tag: of the 8000 isolated assets, 4000 already are tagged.
    // of the 2000 in use assets, 1000 are tagged.
    s3Client.on(GetObjectTaggingCommand).callsFake((params) => ({
      TagSet: Number(params.Key[params.Key.length - 5]) % 2 === 0
        ? [{ Key: S3_ISOLATED_TAG, Value: new Date(2000, 1, 1).toISOString() }]
        : [],
    }));
  }
});

describe('BackgroundStackRefresh', () => {
  let backgroundRefresh: BackgroundStackRefresh;
  let refreshProps: BackgroundStackRefreshProps;
  let setTimeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    const foo = new MockSdk();

    refreshProps = {
      cfn: foo.cloudFormation(),
      activeAssets: new ActiveAssetCache(),
    };

    backgroundRefresh = new BackgroundStackRefresh(refreshProps);
  });

  afterEach(() => {
    jest.clearAllTimers();
    setTimeoutSpy.mockRestore();
  });

  test('should start after a delay', () => {
    void backgroundRefresh.start();
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 300000);
  });

  test('should refresh stacks and schedule next refresh', async () => {
    void backgroundRefresh.start();

    // Run the first timer (which should trigger the first refresh)
    await jest.runOnlyPendingTimersAsync();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 1);

    expect(setTimeoutSpy).toHaveBeenCalledTimes(2); // Once for start, once for next refresh
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 300000);

    // Run the first timer (which triggers the first refresh)
    await jest.runOnlyPendingTimersAsync();

    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 2);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(3); // Two refreshes plus one more scheduled
  });

  test('should wait for the next refresh if called within time frame', async () => {
    void backgroundRefresh.start();

    // Run the first timer (which triggers the first refresh)
    await jest.runOnlyPendingTimersAsync();

    const waitPromise = backgroundRefresh.noOlderThan(180000); // 3 minutes
    jest.advanceTimersByTime(120000); // Advance time by 2 minutes

    await expect(waitPromise).resolves.toBeUndefined();
  });

  test('should wait for the next refresh if refresh lands before the timeout', async () => {
    void backgroundRefresh.start();

    // Run the first timer (which triggers the first refresh)
    await jest.runOnlyPendingTimersAsync();
    jest.advanceTimersByTime(24000); // Advance time by 4 minutes

    const waitPromise = backgroundRefresh.noOlderThan(300000); // 5 minutes
    jest.advanceTimersByTime(120000); // Advance time by 2 minutes, refresh should fire

    await expect(waitPromise).resolves.toBeUndefined();
  });

  test('should reject if the refresh takes too long', async () => {
    void backgroundRefresh.start();

    // Run the first timer (which triggers the first refresh)
    await jest.runOnlyPendingTimersAsync();
    jest.advanceTimersByTime(120000); // Advance time by 2 minutes

    const waitPromise = backgroundRefresh.noOlderThan(0); // 0 seconds
    jest.advanceTimersByTime(120000); // Advance time by 2 minutes

    await expect(waitPromise).rejects.toThrow('refreshStacks took too long; the background thread likely threw an error');
  });
});

function daysInThePast(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function yearsInTheFuture(years: number): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() + years);
  return d;
}
