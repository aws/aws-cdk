/* eslint-disable import/order */

import {
  CloudFormationClient, GetTemplateCommand,
  GetTemplateSummaryCommand,
  ListStacksCommand,
  Stack,
} from '@aws-sdk/client-cloudformation';
import { GarbageCollector, ToolkitInfo } from '../../lib/api';
import { mockBootstrapStack, MockSdk, MockSdkProvider } from '../util/mock-sdk';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DeleteObjectTaggingCommand,
  DeleteObjectsCommand,
  GetObjectTaggingCommand,
  ListObjectsV2Command,
  PutObjectTaggingCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ActiveAssetCache, BackgroundStackRefresh, BackgroundStackRefreshProps } from '../../lib/api/garbage-collection/stack-refresh';

let garbageCollector: GarbageCollector;

let stderrMock: jest.SpyInstance;
let sdk: MockSdkProvider = new MockSdkProvider();

const ISOLATED_TAG = 'aws-cdk:isolated';
const DAY = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

function mockTheToolkitInfo(stackProps: Partial<Stack>) {
  (ToolkitInfo as any).lookup = jest.fn().mockResolvedValue(ToolkitInfo.fromStack(mockBootstrapStack(stackProps)));
}

function gc(props: {
  type: 's3' | 'ecr' | 'all';
  rollbackBufferDays?: number;
  createdAtBufferDays?: number;
  action: 'full' | 'print' | 'tag' | 'delete-tagged';
  maxWaitTime?: number;
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
    maxWaitTime: props.maxWaitTime,
    confirm: false,
  });
}

beforeEach(() => {
  // sdk = new MockSdkProvider({ realSdk: false });
  // By default, we'll return a non-found toolkit info
  (ToolkitInfo as any).lookup = jest.fn().mockResolvedValue(ToolkitInfo.bootstrapStackNotFoundInfo('GarbageStack'));
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => {
    return true;
  });
});

afterEach(() => {
  stderrMock.mockRestore();
});

describe('Garbage Collection', () => {
  test('rollbackBufferDays = 0 -- assets to be deleted', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    const s3Client = mockS3Client();
    const cfnClient = mockCfnClient();

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

    const s3Client = mockS3Client();
    const cfnClient = mockCfnClient();

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

  test('type = ecr -- throws error', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    expect(() => garbageCollector = gc({
      type: 'ecr',
      rollbackBufferDays: 3,
      action: 'full',
    })).toThrow(/ECR garbage collection is not yet supported/);
  });

  test('createdAtBufferDays > 0 -- assets to be tagged', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    const s3Client = mockS3Client();

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

    const s3Client = mockS3Client();
    const cfnClient = mockCfnClient();

    garbageCollector = garbageCollector = gc({
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

    const s3Client = mockS3Client();
    const cfnClient = mockCfnClient();

    garbageCollector = garbageCollector = gc({
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

    const s3Client = mockS3Client();
    const cfnClient = mockCfnClient();

    garbageCollector = garbageCollector = gc({
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

    const s3Client = mockS3Client();

    s3Client.on(ListObjectsV2Command).resolves({
      Contents: [
        { Key: 'asset1', LastModified: new Date(0) },
        { Key: 'asset2', LastModified: new Date(0) },
        { Key: 'asset3', LastModified: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) }, // future date ignored everywhere
      ],
      KeyCount: 3,
    });

    garbageCollector = garbageCollector = gc({
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

    const cfnClient = mockCfnClient();

    garbageCollector = garbageCollector = gc({
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

    const s3Client = mockS3Client();
    const cfnClient = mockCfnClient();

    cfnClient.on(GetTemplateSummaryCommand).resolves({
      Parameters: [{
        ParameterKey: 'AssetParametersasset1',
        DefaultValue: 'asset1',
      }],
    });

    garbageCollector = garbageCollector = gc({
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

  test('stackStatus in REVIEW_IN_PROGRESS means we wait until it changes', async () => {
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    const s3Client = mockS3Client();
    const cfnClient = mockCfnClient();

    // Mock the listStacks call
    cfnClient
      .on(ListStacksCommand)
      .resolvesOnce({
        StackSummaries: [
          { StackName: 'Stack1', StackStatus: 'REVIEW_IN_PROGRESS', CreationTime: new Date() },
          { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE', CreationTime: new Date() },
        ],
      })
      .resolvesOnce({
        StackSummaries: [
          { StackName: 'Stack1', StackStatus: 'UPDATE_COMPLETE', CreationTime: new Date() },
          { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE', CreationTime: new Date() },
        ],
      });

    garbageCollector = garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'full',
    });
    await garbageCollector.garbageCollect();

    // list are called as expected
    expect(cfnClient).toHaveReceivedCommandTimes(ListStacksCommand, 2);

    // everything else runs as expected:
    // assets tagged
    expect(s3Client).toHaveReceivedCommandTimes(GetObjectTaggingCommand, 3);
    expect(s3Client).toHaveReceivedCommandTimes(PutObjectTaggingCommand, 2); // one object already has the tag

    // no deleting
    expect(s3Client).toHaveReceivedCommandTimes(DeleteObjectsCommand, 0);
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

    const cfnClient = mockCfnClient();

    // Mock the listStacks call
    cfnClient.on(ListStacksCommand).resolves({
      StackSummaries: [
        { StackName: 'Stack1', StackStatus: 'REVIEW_IN_PROGRESS', CreationTime: new Date() },
        { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE', CreationTime: new Date() },
      ],
    });

    garbageCollector = garbageCollector = gc({
      type: 's3',
      rollbackBufferDays: 3,
      action: 'full',
      maxWaitTime: 600, // Wait only 600 ms in tests
    });

    await expect(garbageCollector.garbageCollect()).rejects.toThrow(/Stacks still in REVIEW_IN_PROGRESS state after waiting/);
  }, 60000);

  function mockCfnClient() {
    const cfnClient = mockClient(CloudFormationClient);
    cfnClient.on(ListStacksCommand).resolves({
      StackSummaries: [
        { StackName: 'Stack1', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date() },
        { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE', CreationTime: new Date() },
      ],
    });

    cfnClient.on(GetTemplateSummaryCommand).resolves({
      Parameters: [{
        ParameterKey: 'BootstrapVersion',
        DefaultValue: '/cdk-bootstrap/abcde/version',
      }],
    });

    cfnClient.on(GetTemplateCommand).resolves({
      TemplateBody: 'abcde',
    });

    return cfnClient;
  }

  function mockS3Client() {
    const s3Client = mockClient(S3Client);

    s3Client.on(ListObjectsV2Command).resolves({
      Contents: [
        { Key: 'asset1', LastModified: new Date(Date.now() - (2 * DAY)) },
        { Key: 'asset2', LastModified: new Date(Date.now() - (10 * DAY)) },
        { Key: 'asset3', LastModified: new Date(Date.now() - (100 * DAY)) },
      ],
      KeyCount: 3,
    });

    s3Client.on(GetObjectTaggingCommand).callsFake((params) => ({
      TagSet: params.Key === 'asset2' ? [{ Key: ISOLATED_TAG, Value: new Date().toISOString() }] : [],
    }));

    return s3Client;
  }
});

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

    const s3Client = mockS3Client();
    const cfnClient = mockCfnClient();

    garbageCollector = garbageCollector = gc({
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

    const s3Client = mockS3Client();
    const cfnClient = mockCfnClient();

    garbageCollector = garbageCollector = gc({
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

  function mockCfnClient() {
    const cfnClient = mockClient(CloudFormationClient);

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

    return cfnClient;
  }

  function mockS3Client() {
    const s3Client = mockClient(S3Client);

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
      TagSet: Number(params.Key[params.Key.length - 5]) % 2 === 0 ? [{ Key: ISOLATED_TAG, Value: new Date(2000, 1, 1).toISOString() }] : [],
    }));

    return s3Client;
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
      maxWaitTime: 60000, // 1 minute
    };

    backgroundRefresh = new BackgroundStackRefresh(refreshProps);
  });

  function mockCfnClient() {
    const cfnClient = mockClient(CloudFormationClient);

    cfnClient.on(ListStacksCommand).resolves({
      StackSummaries: [
        { StackName: 'Stack1', StackStatus: 'CREATE_COMPLETE', CreationTime: new Date() },
        { StackName: 'Stack2', StackStatus: 'UPDATE_COMPLETE', CreationTime: new Date() },
      ],
    });

    cfnClient.on(GetTemplateSummaryCommand).resolves({
      Parameters: [{
        ParameterKey: 'BootstrapVersion',
        DefaultValue: '/cdk-bootstrap/abcde/version',
      }],
    });

    cfnClient.on(GetTemplateCommand).resolves({
      TemplateBody: 'abcde',
    });

    return cfnClient;
  }

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
    const cfnClient = mockCfnClient();

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
