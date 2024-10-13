/* eslint-disable import/order */

const mockGarbageCollect = jest.fn();

import { GarbageCollector, ToolkitInfo } from '../../lib/api';
import { mockBootstrapStack, MockSdk, MockSdkProvider } from '../util/mock-sdk';

let garbageCollector: GarbageCollector;
let mockListStacks: (params: AWS.CloudFormation.Types.ListStacksInput) => AWS.CloudFormation.Types.ListStacksOutput;
let mockDescribeStacks: (params: AWS.CloudFormation.Types.DescribeStacksInput) => AWS.CloudFormation.Types.DescribeStacksOutput;
let mockGetTemplateSummary: (params: AWS.CloudFormation.Types.GetTemplateSummaryInput) => AWS.CloudFormation.Types.GetTemplateSummaryOutput;
let mockGetTemplate: (params: AWS.CloudFormation.Types.GetTemplateInput) => AWS.CloudFormation.Types.GetTemplateOutput;
let mockListObjectsV2: (params: AWS.S3.Types.ListObjectsV2Request) => AWS.S3.Types.ListObjectsV2Output;
let mockGetObjectTagging: (params: AWS.S3.Types.GetObjectTaggingRequest) => AWS.S3.Types.GetObjectTaggingOutput;
let mockDeleteObjects: (params: AWS.S3.Types.DeleteObjectsRequest) => AWS.S3.Types.DeleteObjectsOutput;
let mockPutObjectTagging: (params: AWS.S3.Types.PutObjectTaggingRequest) => AWS.S3.Types.PutObjectTaggingOutput;

let stderrMock: jest.SpyInstance;
let sdk: MockSdkProvider;

function mockTheToolkitInfo(stackProps: Partial<AWS.CloudFormation.Stack>) {
  const mockSdk = new MockSdk();
  (ToolkitInfo as any).lookup = jest.fn().mockResolvedValue(ToolkitInfo.fromStack(mockBootstrapStack(mockSdk, stackProps)));
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

describe('Garbage Collection', () => {
  beforeEach(() => {
    mockListStacks = jest.fn().mockResolvedValue({
      StackSummaries: [
        { StackName: 'Stack1', StackStatus: 'CREATE_COMPLETE' },
        { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE' },
      ],
    });
    mockGetTemplateSummary = jest.fn().mockReturnValue({});
    mockGetTemplate = jest.fn().mockReturnValue({
      TemplateBody: 'abcde',
    });
    mockListObjectsV2 = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        Contents: [
          { Key: 'asset1' },
          { Key: 'asset2' },
          { Key: 'asset3' },
        ],
        KeyCount: 3,
      });
    });
    mockGetObjectTagging = jest.fn().mockImplementation((params) => {
      return Promise.resolve({
        TagSet: params.Key === 'asset2' ? [{ Key: 'ISOLATED_TAG', Value: new Date().toISOString() }] : [],
      });
    });
    mockPutObjectTagging = jest.fn();
    mockDeleteObjects = jest.fn();
    mockDescribeStacks = jest.fn();

    sdk.stubCloudFormation({
      listStacks: mockListStacks,
      getTemplateSummary: mockGetTemplateSummary,
      getTemplate: mockGetTemplate,
      describeStacks: mockDescribeStacks,
    });
    sdk.stubS3({
      listObjectsV2: mockListObjectsV2,
      getObjectTagging: mockGetObjectTagging,
      deleteObjects: mockDeleteObjects,
      putObjectTagging: mockPutObjectTagging,
    });
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

    garbageCollector = new GarbageCollector({
      sdkProvider: sdk,
      action: 'full',
      resolvedEnvironment: {
        account: '123456789012',
        region: 'us-east-1',
        name: 'mock',
      },
      bootstrapStackName: 'GarbageStack',
      rollbackBufferDays: 0,
      type: 's3',
    });
    await garbageCollector.garbageCollect();

    expect(mockListStacks).toHaveBeenCalledTimes(1);
    expect(mockListObjectsV2).toHaveBeenCalledTimes(2);
    // no tagging
    expect(mockGetObjectTagging).toHaveBeenCalledTimes(0);
    expect(mockPutObjectTagging).toHaveBeenCalledTimes(0);

    // assets are to be deleted
    expect(mockDeleteObjects).toHaveBeenCalledWith({
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

    garbageCollector = new GarbageCollector({
      sdkProvider: sdk,
      action: 'full',
      resolvedEnvironment: {
        account: '123456789012',
        region: 'us-east-1',
        name: 'mock',
      },
      bootstrapStackName: 'GarbageStack',
      rollbackBufferDays: 3,
      type: 's3',
    });
    await garbageCollector.garbageCollect();

    expect(mockListStacks).toHaveBeenCalledTimes(1);
    expect(mockListObjectsV2).toHaveBeenCalledTimes(2);

    // assets tagged
    expect(mockGetObjectTagging).toHaveBeenCalledTimes(3);
    expect(mockPutObjectTagging).toHaveBeenCalledTimes(3);

    // no deleting
    expect(mockDeleteObjects).toHaveBeenCalledTimes(0);
  });

  test('type = ecr -- throws error', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    expect(() => new GarbageCollector({
      sdkProvider: sdk,
      action: 'full',
      resolvedEnvironment: {
        account: '123456789012',
        region: 'us-east-1',
        name: 'mock',
      },
      bootstrapStackName: 'GarbageStack',
      rollbackBufferDays: 3,
      type: 'ecr',
    })).toThrow(/ECR garbage collection is not yet supported/);
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

    garbageCollector = new GarbageCollector({
      sdkProvider: sdk,
      action: 'print',
      resolvedEnvironment: {
        account: '123456789012',
        region: 'us-east-1',
        name: 'mock',
      },
      bootstrapStackName: 'GarbageStack',
      rollbackBufferDays: 3,
      type: 's3',
    });
    await garbageCollector.garbageCollect();

    expect(mockListStacks).toHaveBeenCalledTimes(1);
    expect(mockListObjectsV2).toHaveBeenCalledTimes(2);

    // get tags, but dont put tags
    expect(mockGetObjectTagging).toHaveBeenCalledTimes(3);
    expect(mockPutObjectTagging).toHaveBeenCalledTimes(0);

    // no deleting
    expect(mockDeleteObjects).toHaveBeenCalledTimes(0);
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

    garbageCollector = new GarbageCollector({
      sdkProvider: sdk,
      action: 'tag',
      resolvedEnvironment: {
        account: '123456789012',
        region: 'us-east-1',
        name: 'mock',
      },
      bootstrapStackName: 'GarbageStack',
      rollbackBufferDays: 3,
      type: 's3',
    });
    await garbageCollector.garbageCollect();

    expect(mockListStacks).toHaveBeenCalledTimes(1);
    expect(mockListObjectsV2).toHaveBeenCalledTimes(2);

    // tags objects
    expect(mockGetObjectTagging).toHaveBeenCalledTimes(3);
    expect(mockPutObjectTagging).toHaveBeenCalledTimes(3);

    // no deleting
    expect(mockDeleteObjects).toHaveBeenCalledTimes(0);
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

    garbageCollector = new GarbageCollector({
      sdkProvider: sdk,
      action: 'delete-tagged',
      resolvedEnvironment: {
        account: '123456789012',
        region: 'us-east-1',
        name: 'mock',
      },
      bootstrapStackName: 'GarbageStack',
      rollbackBufferDays: 3,
      type: 's3',
    });
    await garbageCollector.garbageCollect();

    expect(mockListStacks).toHaveBeenCalledTimes(1);
    expect(mockListObjectsV2).toHaveBeenCalledTimes(2);

    // get tags, but dont put tags
    expect(mockGetObjectTagging).toHaveBeenCalledTimes(3);
    expect(mockPutObjectTagging).toHaveBeenCalledTimes(0);
  });

  test('stackStatus in REVIEW_IN_PROGRESS means we wait until it changes', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    // Mock the listStacks call
    const mockListStacksStatus = jest.fn()
      .mockResolvedValueOnce({
        StackSummaries: [
          { StackName: 'Stack1', StackStatus: 'REVIEW_IN_PROGRESS' },
          { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE' },
        ],
      })
      .mockResolvedValueOnce({
        StackSummaries: [
          { StackName: 'Stack1', StackStatus: 'UPDATE_COMPLETE' },
          { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE' },
        ],
      });

    sdk.stubCloudFormation({
      listStacks: mockListStacksStatus,
      getTemplateSummary: mockGetTemplateSummary,
      getTemplate: mockGetTemplate,
    });

    garbageCollector = new GarbageCollector({
      sdkProvider: sdk,
      action: 'full',
      resolvedEnvironment: {
        account: '123456789012',
        region: 'us-east-1',
        name: 'mock',
      },
      bootstrapStackName: 'GarbageStack',
      rollbackBufferDays: 3,
      type: 's3',
    });

    await garbageCollector.garbageCollect();

    // list are called as expected
    expect(mockListStacksStatus).toHaveBeenCalledTimes(2);

    // everything else runs as expected:
    // assets tagged
    expect(mockGetObjectTagging).toHaveBeenCalledTimes(3);
    expect(mockPutObjectTagging).toHaveBeenCalledTimes(3);

    // no deleting
    expect(mockDeleteObjects).toHaveBeenCalledTimes(0);
  }, 60000);

  test('fails when stackStatus stuck in REVIEW_IN_PROGRESS', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    // Mock the listStacks call
    const mockListStacksStatus = jest.fn()
      .mockResolvedValue({
        StackSummaries: [
          { StackName: 'Stack1', StackStatus: 'REVIEW_IN_PROGRESS' },
          { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE' },
        ],
      });

    sdk.stubCloudFormation({
      listStacks: mockListStacksStatus,
      getTemplateSummary: mockGetTemplateSummary,
      getTemplate: mockGetTemplate,
    });

    garbageCollector = new GarbageCollector({
      sdkProvider: sdk,
      action: 'full',
      resolvedEnvironment: {
        account: '123456789012',
        region: 'us-east-1',
        name: 'mock',
      },
      bootstrapStackName: 'GarbageStack',
      rollbackBufferDays: 3,
      type: 's3',
      maxWaitTime: 600, // Wait for only 600ms in tests
    });

    await expect(garbageCollector.garbageCollect()).rejects.toThrow(/Stacks still in REVIEW_IN_PROGRESS state after waiting/);
  }, 60000);
});
