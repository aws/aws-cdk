/* eslint-disable import/order */

const mockGarbageCollect = jest.fn();

import { GarbageCollector, ToolkitInfo, ECR_ISOLATED_TAG, S3_ISOLATED_TAG } from '../../lib/api';
import { ActiveAssetCache, BackgroundStackRefresh, BackgroundStackRefreshProps } from '../../lib/api/garbage-collection/stack-refresh';
import { mockBootstrapStack, MockSdk, MockSdkProvider } from '../util/mock-sdk';

let garbageCollector: GarbageCollector;
let mockListStacks: (params: AWS.CloudFormation.Types.ListStacksInput) => AWS.CloudFormation.Types.ListStacksOutput;
let mockDescribeStacks: (params: AWS.CloudFormation.Types.DescribeStacksInput) => AWS.CloudFormation.Types.DescribeStacksOutput;
let mockGetTemplateSummary: (params: AWS.CloudFormation.Types.GetTemplateSummaryInput) => AWS.CloudFormation.Types.GetTemplateSummaryOutput;
let mockGetTemplate: (params: AWS.CloudFormation.Types.GetTemplateInput) => AWS.CloudFormation.Types.GetTemplateOutput;
let mockListObjectsV2: (params: AWS.S3.Types.ListObjectsV2Request) => AWS.S3.Types.ListObjectsV2Output;
let mockGetObjectTagging: (params: AWS.S3.Types.GetObjectTaggingRequest) => AWS.S3.Types.GetObjectTaggingOutput;
let mockDeleteObjects: (params: AWS.S3.Types.DeleteObjectsRequest) => AWS.S3.Types.DeleteObjectsOutput;
let mockDeleteObjectTagging: (params: AWS.S3.Types.DeleteObjectTaggingRequest) => AWS.S3.Types.DeleteObjectTaggingOutput;
let mockPutObjectTagging: (params: AWS.S3.Types.PutObjectTaggingRequest) => AWS.S3.Types.PutObjectTaggingOutput;
let mockBatchDeleteImage: (params: AWS.ECR.Types.BatchDeleteImageRequest) => AWS.ECR.Types.BatchDeleteImageResponse;
let mockBatchGetImage: (params: AWS.ECR.Types.BatchGetImageRequest) => AWS.ECR.Types.BatchGetImageResponse;
let mockPutImage: (params: AWS.ECR.Types.PutImageRequest) => AWS.ECR.Types.PutImageResponse;
let mockListImages: (params: AWS.ECR.Types.ListImagesRequest) => AWS.ECR.Types.ListImagesResponse;
let mockDescribeImages: (params: AWS.ECR.Types.DescribeImagesRequest) => AWS.ECR.Types.DescribeImagesResponse;

let stderrMock: jest.SpyInstance;
let sdk: MockSdkProvider;

const DAY = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

function mockTheToolkitInfo(stackProps: Partial<AWS.CloudFormation.Stack>) {
  const mockSdk = new MockSdk();
  (ToolkitInfo as any).lookup = jest.fn().mockResolvedValue(ToolkitInfo.fromStack(mockBootstrapStack(mockSdk, stackProps)));
}

function gc(props: {
  type: 's3' | 'ecr' | 'all';
  rollbackBufferDays?: number;
  createdAtBufferDays?: number;
  action: 'full' | 'print' | 'tag' | 'delete-tagged';
}): GarbageCollector {
  return new GarbageCollector({
    sdkProvider: sdk,
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

function setupCFNGarbageCollectionMocks(mockSdk: MockSdkProvider) {
  mockListStacks = jest.fn().mockResolvedValue({
    StackSummaries: [
      { StackName: 'Stack1', StackStatus: 'CREATE_COMPLETE' },
      { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE' },
    ],
  });
  mockGetTemplateSummary = jest.fn().mockReturnValue({
    Parameters: [{
      ParameterKey: 'BootstrapVersion',
      DefaultValue: '/cdk-bootstrap/abcde/version',
    }],
  });
  mockGetTemplate = jest.fn().mockReturnValue({
    TemplateBody: 'abcde',
  });
  mockDescribeStacks = jest.fn();

  mockSdk.stubCloudFormation({
    listStacks: mockListStacks,
    getTemplateSummary: mockGetTemplateSummary,
    getTemplate: mockGetTemplate,
    describeStacks: mockDescribeStacks,
  });

  return {
    mockListStacks,
    mockGetTemplateSummary,
    mockGetTemplate,
    mockDescribeStacks,
  };
}

function setupS3GarbageCollectionMocks(mockSdk: MockSdkProvider) {
  const mocks = setupCFNGarbageCollectionMocks(mockSdk);

  mockListObjectsV2 = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      Contents: [
        { Key: 'asset1', LastModified: new Date(Date.now() - (2 * DAY)) },
        { Key: 'asset2', LastModified: new Date(Date.now() - (10 * DAY)) },
        { Key: 'asset3', LastModified: new Date(Date.now() - (100 * DAY)) },
      ],
      KeyCount: 3,
    });
  });
  mockGetObjectTagging = jest.fn().mockImplementation((params) => {
    return Promise.resolve({
      TagSet: params.Key === 'asset2' ? [{ Key: S3_ISOLATED_TAG, Value: new Date().toISOString() }] : [],
    });
  });
  mockPutObjectTagging = jest.fn();
  mockDeleteObjects = jest.fn();
  mockDeleteObjectTagging = jest.fn();

  mockSdk.stubS3({
    listObjectsV2: mockListObjectsV2,
    getObjectTagging: mockGetObjectTagging,
    deleteObjects: mockDeleteObjects,
    deleteObjectTagging: mockDeleteObjectTagging,
    putObjectTagging: mockPutObjectTagging,
  });

  return {
    ...mocks,
    mockListObjectsV2,
    mockGetObjectTagging,
    mockDeleteObjects,
    mockDeleteObjectTagging,
    mockPutObjectTagging,
  };
}

function setupEcrGarbageCollectionMocks(mockSdk: MockSdkProvider) {
  const mocks = setupCFNGarbageCollectionMocks(mockSdk);
  mockBatchGetImage = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      images: [
        { imageId: { imageDigest: 'digest1' }, imageManifest: {} },
        { imageId: { imageDigest: 'digest2' }, imageManifest: {} },
        { imageId: { imageDigest: 'digest3' }, imageManifest: {} },
      ],
    });
  });
  mockDescribeImages = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      imageDetails: [
        { imageDigest: 'digest3', imageTags: ['klmno'], imagePushedAt: Date.now() - (2 * DAY), imageSizeInBytes: 100 },
        { imageDigest: 'digest2', imageTags: ['fghij'], imagePushedAt: Date.now() - (10 * DAY), imageSizeInBytes: 300_000_000 },
        { imageDigest: 'digest1', imageTags: ['abcde'], imagePushedAt: Date.now() - (100 * DAY), imageSizeInBytes: 1_000_000_000 },
      ],
    });
  });
  mockBatchDeleteImage = jest.fn();
  mockPutImage = jest.fn();
  mockListImages = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      imageIds: [
        { imageDigest: 'digest1', imageTag: 'abcde' }, // inuse
        { imageDigest: 'digest2', imageTag: 'fghij' },
        { imageDigest: 'digest3', imageTag: 'klmno' },
      ],
    });
  });

  mockSdk.stubEcr({
    batchGetImage: mockBatchGetImage,
    describeImages: mockDescribeImages,
    batchDeleteImage: mockBatchDeleteImage,
    putImage: mockPutImage,
    listImages: mockListImages,
  });

  return {
    ...mocks,
    mockDescribeImages,
    mockBatchDeleteImage,
    mockPutImage,
    mockListImages,
  };
}

beforeEach(() => {
  sdk = new MockSdkProvider({ realSdk: false });
  // By default, we'll return a non-found toolkit info
  (ToolkitInfo as any).lookup = jest.fn().mockResolvedValue(ToolkitInfo.bootstrapStackNotFoundInfo('GarbageStack'));
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
});

afterEach(() => {
  stderrMock.mockRestore();
});

describe('S3 Garbage Collection', () => {
  let mocks: any;
  beforeEach(() => {
    mocks = setupS3GarbageCollectionMocks(sdk);
  });

  afterEach(() => {
    mockGarbageCollect.mockClear();
  });

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

    expect(mocks.mockListStacks).toHaveBeenCalledTimes(1);
    expect(mocks.mockListObjectsV2).toHaveBeenCalledTimes(2);
    // no tagging
    expect(mocks.mockGetObjectTagging).toHaveBeenCalledTimes(0);
    expect(mocks.mockPutObjectTagging).toHaveBeenCalledTimes(0);

    // assets are to be deleted
    expect(mocks.mockDeleteObjects).toHaveBeenCalledWith({
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

    expect(mocks.mockListStacks).toHaveBeenCalledTimes(1);
    expect(mocks.mockListObjectsV2).toHaveBeenCalledTimes(2);

    // assets tagged
    expect(mocks.mockGetObjectTagging).toHaveBeenCalledTimes(3);
    expect(mocks.mockPutObjectTagging).toHaveBeenCalledTimes(2); // one asset already has the tag

    // no deleting
    expect(mocks.mockDeleteObjects).toHaveBeenCalledTimes(0);
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

    expect(mocks.mockDeleteObjects).toHaveBeenCalledWith({
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

    garbageCollector = garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'print',
    });
    await garbageCollector.garbageCollect();

    expect(mocks.mockListStacks).toHaveBeenCalledTimes(1);
    expect(mocks.mockListObjectsV2).toHaveBeenCalledTimes(2);

    // get tags, but dont put tags
    expect(mocks.mockGetObjectTagging).toHaveBeenCalledTimes(3);
    expect(mocks.mockPutObjectTagging).toHaveBeenCalledTimes(0);

    // no deleting
    expect(mocks.mockDeleteObjects).toHaveBeenCalledTimes(0);
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

    garbageCollector = garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'tag',
    });
    await garbageCollector.garbageCollect();

    expect(mocks.mockListStacks).toHaveBeenCalledTimes(1);
    expect(mocks.mockListObjectsV2).toHaveBeenCalledTimes(2);

    // tags objects
    expect(mocks.mockGetObjectTagging).toHaveBeenCalledTimes(3);
    expect(mocks.mockPutObjectTagging).toHaveBeenCalledTimes(2); // one object already has the tag

    // no deleting
    expect(mocks.mockDeleteObjects).toHaveBeenCalledTimes(0);
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

    garbageCollector = garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'delete-tagged',
    });
    await garbageCollector.garbageCollect();

    expect(mocks.mockListStacks).toHaveBeenCalledTimes(1);
    expect(mocks.mockListObjectsV2).toHaveBeenCalledTimes(2);

    // get tags, but dont put tags
    expect(mocks.mockGetObjectTagging).toHaveBeenCalledTimes(3);
    expect(mocks.mockPutObjectTagging).toHaveBeenCalledTimes(0);
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

    const mockListObjectsV2Future = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        Contents: [
          { Key: 'asset1', LastModified: new Date(0) },
          { Key: 'asset2', LastModified: new Date(0) },
          { Key: 'asset3', LastModified: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) }, // future date ignored everywhere
        ],
        KeyCount: 3,
      });
    });

    sdk.stubS3({
      listObjectsV2: mockListObjectsV2Future,
      getObjectTagging: mockGetObjectTagging,
      deleteObjects: mockDeleteObjects,
      putObjectTagging: mockPutObjectTagging,
    });

    garbageCollector = garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 0,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    // assets are to be deleted
    expect(mocks.mockDeleteObjects).toHaveBeenCalledWith({
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
  let mocks: any;
  beforeEach(() => {
    mocks = setupEcrGarbageCollectionMocks(sdk);
  });

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

    expect(mocks.mockDescribeImages).toHaveBeenCalledTimes(1);
    expect(mocks.mockListImages).toHaveBeenCalledTimes(2);

    // no tagging
    expect(mocks.mockPutImage).toHaveBeenCalledTimes(0);

    // assets are to be deleted
    expect(mocks.mockBatchDeleteImage).toHaveBeenCalledWith({
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
    expect(mocks.mockPutImage).toHaveBeenCalledTimes(2);

    // no deleting
    expect(mocks.mockBatchDeleteImage).toHaveBeenCalledTimes(0);
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

    expect(mocks.mockBatchDeleteImage).toHaveBeenCalledWith({
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

    garbageCollector = garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 3,
      action: 'print',
    });
    await garbageCollector.garbageCollect();

    expect(mocks.mockListStacks).toHaveBeenCalledTimes(1);

    // dont put tags
    expect(mocks.mockPutImage).toHaveBeenCalledTimes(0);

    // no deleting
    expect(mocks.mockBatchDeleteImage).toHaveBeenCalledTimes(0);
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

    garbageCollector = garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 3,
      action: 'tag',
    });
    await garbageCollector.garbageCollect();

    expect(mocks.mockListStacks).toHaveBeenCalledTimes(1);

    // tags objects
    expect(mocks.mockPutImage).toHaveBeenCalledTimes(2);

    // no deleting
    expect(mocks.mockBatchDeleteImage).toHaveBeenCalledTimes(0);
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

    garbageCollector = garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 3,
      action: 'delete-tagged',
    });
    await garbageCollector.garbageCollect();

    expect(mocks.mockListStacks).toHaveBeenCalledTimes(1);

    // dont put tags
    expect(mocks.mockPutImage).toHaveBeenCalledTimes(0);
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

    const mockDescribeImagesFuture = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        imageDetails: [
          { imageDigest: 'digest3', imageTags: ['klmno'], imagePushedAt: Date.now() - (2 * DAY), imageSizeInBytes: 100 },
          { imageDigest: 'digest2', imageTags: ['fghij'], imagePushedAt: Number(new Date().setFullYear(new Date().getFullYear() + 1).toString()), imageSizeInBytes: 300_000_000 },
          { imageDigest: 'digest1', imageTags: ['abcde'], imagePushedAt: Date.now() - (100 * DAY), imageSizeInBytes: 1_000_000_000 },
        ],
      });
    });

    sdk.stubEcr({
      batchGetImage: mockBatchGetImage,
      describeImages: mockDescribeImagesFuture,
      batchDeleteImage: mockBatchDeleteImage,
      putImage: mockPutImage,
      listImages: mockListImages,
    });

    garbageCollector = garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 0,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    // assets are to be deleted
    expect(mocks.mockBatchDeleteImage).toHaveBeenCalledWith({
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

    const mockListImagesNone = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        images: [],
      });
    });

    sdk.stubEcr({
      batchGetImage: mockBatchGetImage,
      describeImages: mockDescribeImages,
      batchDeleteImage: mockBatchDeleteImage,
      putImage: mockPutImage,
      listImages: mockListImagesNone,
    });

    garbageCollector = garbageCollector = gc({
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

    garbageCollector = garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 3,
      action: 'tag',
    });
    await garbageCollector.garbageCollect();

    expect(mocks.mockListStacks).toHaveBeenCalledTimes(1);

    // tags objects
    expect(mocks.mockPutImage).toHaveBeenCalledTimes(2);
    expect(mocks.mockPutImage).toHaveBeenCalledWith({
      repositoryName: 'REPO_NAME',
      imageDigest: 'digest3',
      imageManifest: expect.any(Object),
      imageTag: expect.stringContaining(`0-${ECR_ISOLATED_TAG}`),
    });
    expect(mocks.mockPutImage).toHaveBeenCalledWith({
      repositoryName: 'REPO_NAME',
      imageDigest: 'digest2',
      imageManifest: expect.any(Object),
      imageTag: expect.stringContaining(`1-${ECR_ISOLATED_TAG}`),
    });
  });
});

describe('CloudFormation API calls', () => {
  let mocks: any;
  beforeEach(() => {
    mocks = setupS3GarbageCollectionMocks(sdk);
  });

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

    garbageCollector = garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    expect(mocks.mockGetTemplateSummary).toHaveBeenCalledTimes(2);
    expect(mocks.mockGetTemplate).toHaveBeenCalledTimes(0);
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

    const mockGetTemplateSummaryAssets = jest.fn().mockReturnValue({
      Parameters: [{
        ParameterKey: 'AssetParametersasset1',
        DefaultValue: 'asset1',
      }],
    });

    sdk.stubCloudFormation({
      listStacks: mockListStacks,
      getTemplateSummary: mockGetTemplateSummaryAssets,
      getTemplate: mockGetTemplate,
    });

    garbageCollector = garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 0,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    expect(mocks.mockListStacks).toHaveBeenCalledTimes(1);
    expect(mockListObjectsV2).toHaveBeenCalledTimes(2);
    // no tagging
    expect(mockGetObjectTagging).toHaveBeenCalledTimes(0);
    expect(mockPutObjectTagging).toHaveBeenCalledTimes(0);

    // assets are to be deleted
    expect(mockDeleteObjects).toHaveBeenCalledWith({
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

let mockListObjectsV2Large: (params: AWS.S3.Types.ListObjectsV2Request) => AWS.S3.Types.ListObjectsV2Output;
let mockGetObjectTaggingLarge: (params: AWS.S3.Types.GetObjectTaggingRequest) => AWS.S3.Types.GetObjectTaggingOutput;
describe('Garbage Collection with large # of objects', () => {
  const keyCount = 10000;

  beforeEach(() => {
    mockListStacks = jest.fn().mockResolvedValue({
      StackSummaries: [
        { StackName: 'Stack1', StackStatus: 'CREATE_COMPLETE' },
      ],
    });
    mockGetTemplateSummary = jest.fn().mockReturnValue({
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
    mockGetTemplate = jest.fn().mockReturnValue({
      TemplateBody: mockTemplateBody.join('-'),
    });

    const contents: { Key: string; LastModified: Date }[] = [];
    for (let i = 0; i < keyCount; i++) {
      contents.push({
        Key: `asset${i}hash`,
        LastModified: new Date(0),
      });
    }
    mockListObjectsV2Large = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        Contents: contents,
        KeyCount: keyCount,
      });
    });

    // every other object has the isolated tag: of the 8000 isolated assets, 4000 already are tagged.
    // of the 2000 in use assets, 1000 are tagged.
    mockGetObjectTaggingLarge = jest.fn().mockImplementation((params) => {
      return Promise.resolve({
        TagSet: Number(params.Key[params.Key.length - 5]) % 2 === 0 ? [{ Key: S3_ISOLATED_TAG, Value: new Date(2000, 1, 1).toISOString() }] : [],
      });
    });
    mockPutObjectTagging = jest.fn();
    mockDeleteObjects = jest.fn();
    mockDeleteObjectTagging = jest.fn();
    mockDescribeStacks = jest.fn();

    sdk.stubCloudFormation({
      listStacks: mockListStacks,
      getTemplateSummary: mockGetTemplateSummary,
      getTemplate: mockGetTemplate,
      describeStacks: mockDescribeStacks,
    });
    sdk.stubS3({
      listObjectsV2: mockListObjectsV2Large,
      getObjectTagging: mockGetObjectTaggingLarge,
      deleteObjects: mockDeleteObjects,
      deleteObjectTagging: mockDeleteObjectTagging,
      putObjectTagging: mockPutObjectTagging,
    });
  });

  afterEach(() => {
    mockGarbageCollect.mockClear();
  });

  test('tag only', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    garbageCollector = garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 1,
      action: 'tag',
    });
    await garbageCollector.garbageCollect();

    expect(mockListStacks).toHaveBeenCalledTimes(1);
    expect(mockListObjectsV2Large).toHaveBeenCalledTimes(2);

    // tagging is performed
    expect(mockGetObjectTaggingLarge).toHaveBeenCalledTimes(keyCount);
    expect(mockDeleteObjectTagging).toHaveBeenCalledTimes(1000); // 1000 in use assets are erroneously tagged
    expect(mockPutObjectTagging).toHaveBeenCalledTimes(5000); // 8000-4000 assets need to be tagged, + 1000 (since untag also calls this)
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

    garbageCollector = garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 1,
      action: 'delete-tagged',
    });
    await garbageCollector.garbageCollect();

    expect(mockListStacks).toHaveBeenCalledTimes(1);
    expect(mockListObjectsV2Large).toHaveBeenCalledTimes(2);

    // delete previously tagged objects
    expect(mockGetObjectTaggingLarge).toHaveBeenCalledTimes(keyCount);
    expect(mockDeleteObjects).toHaveBeenCalledTimes(4); // 4000 isolated assets are already tagged, deleted in batches of 1000
  });
});

describe('BackgroundStackRefresh', () => {
  let backgroundRefresh: BackgroundStackRefresh;
  let refreshProps: BackgroundStackRefreshProps;
  let setTimeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    mockListStacks = jest.fn().mockResolvedValue({
      StackSummaries: [
        { StackName: 'Stack1', StackStatus: 'CREATE_COMPLETE' },
        { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE' },
      ],
    });
    mockGetTemplateSummary = jest.fn().mockReturnValue({
      Parameters: [{
        ParameterKey: 'BootstrapVersion',
        DefaultValue: '/cdk-bootstrap/abcde/version',
      }],
    });
    mockGetTemplate = jest.fn().mockReturnValue({
      TemplateBody: 'abcde',
    });

    sdk.stubCloudFormation({
      listStacks: mockListStacks,
      getTemplateSummary: mockGetTemplateSummary,
      getTemplate: mockGetTemplate,
      describeStacks: jest.fn(),
    });

    refreshProps = {
      cfn: sdk.mockSdk.cloudFormation(),
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

    expect(mockListStacks).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(2); // Once for start, once for next refresh
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 300000);

    // Run the first timer (which triggers the first refresh)
    await jest.runOnlyPendingTimersAsync();

    expect(mockListStacks).toHaveBeenCalledTimes(2);
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
