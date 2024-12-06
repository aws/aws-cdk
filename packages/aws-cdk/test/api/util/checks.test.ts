import { DescribeStacksCommand, StackStatus } from '@aws-sdk/client-cloudformation';
import { determineAllowCrossAccountAssetPublishing, getBootstrapStackInfo } from '../../../lib/api/util/checks';
import { mockCloudFormationClient, MockSdk } from '../../util/mock-sdk';

describe('determineAllowCrossAccountAssetPublishing', () => {
  it('should return true when hasStagingBucket is false', async () => {
    const mockSDK = new MockSdk();
    mockCloudFormationClient.on(DescribeStacksCommand).resolves({
      Stacks: [{
        StackName: 'foo',
        CreationTime: new Date(),
        StackStatus: StackStatus.CREATE_COMPLETE,
        Outputs: [{ OutputKey: 'BootstrapVersion', OutputValue: '1' }],
      }],
    });

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(true);
  });

  it.each(['', '-', '*', '---'])('should return true when the bucket output does not look like a real bucket', async (notABucketName) => {
    const mockSDK = new MockSdk();
    mockCloudFormationClient.on(DescribeStacksCommand).resolves({
      Stacks: [{
        StackName: 'foo',
        CreationTime: new Date(),
        StackStatus: StackStatus.CREATE_COMPLETE,
        Outputs: [
          { OutputKey: 'BootstrapVersion', OutputValue: '1' },
          { OutputKey: 'BucketName', OutputValue: notABucketName },
        ],
      }],
    });

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(true);
  });

  it('should return true when bootstrap version is >= 21', async () => {
    const mockSDK = new MockSdk();

    mockCloudFormationClient.on(DescribeStacksCommand).resolves({
      Stacks: [{
        StackName: 'foo',
        CreationTime: new Date(),
        StackStatus: StackStatus.CREATE_COMPLETE,
        Outputs: [
          { OutputKey: 'BootstrapVersion', OutputValue: '21' },
          { OutputKey: 'BucketName', OutputValue: 'some-bucket' },
        ],
      }],
    });

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(true);
  });

  it('should return true if looking up the bootstrap stack fails', async () => {
    const mockSDK = new MockSdk();
    mockCloudFormationClient.on(DescribeStacksCommand).rejects(new Error('Could not read bootstrap stack'));

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(true);
  });

  it('should return true if looking up the bootstrap stack fails', async () => {
    const mockSDK = new MockSdk();
    mockCloudFormationClient.on(DescribeStacksCommand).rejects(new Error('Could not read bootstrap stack'));

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(true);
  });

  it('should return false for other scenarios', async () => {
    const mockSDK = new MockSdk();
    mockCloudFormationClient.on(DescribeStacksCommand).resolves({
      Stacks: [{
        StackName: 'foo',
        CreationTime: new Date(),
        StackStatus: StackStatus.CREATE_COMPLETE,
        Outputs: [
          { OutputKey: 'BootstrapVersion', OutputValue: '20' },
          { OutputKey: 'BucketName', OutputValue: 'some-bucket' },
        ],
      }],
    });

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(false);
  });
});

describe('getBootstrapStackInfo', () => {
  it('should return correct BootstrapStackInfo', async () => {
    const mockSDK = new MockSdk();

    mockCloudFormationClient.on(DescribeStacksCommand).resolves({
      Stacks: [{
        StackName: 'foo',
        CreationTime: new Date(),
        StackStatus: StackStatus.CREATE_COMPLETE,
        Outputs: [
          { OutputKey: 'BootstrapVersion', OutputValue: '21' },
          { OutputKey: 'BucketName', OutputValue: 'some-bucket' },
        ],
      }],
    });

    const result = await getBootstrapStackInfo(mockSDK, 'CDKToolkit');
    expect(result).toEqual({
      hasStagingBucket: true,
      bootstrapVersion: 21,
    });
  });

  it('should throw error when stack is not found', async () => {
    const mockSDK = new MockSdk();

    mockCloudFormationClient.on(DescribeStacksCommand).resolves({
      Stacks: [],
    });

    await expect(getBootstrapStackInfo(mockSDK, 'CDKToolkit')).rejects.toThrow('Toolkit stack CDKToolkit not found');
  });

  it('should throw error when BootstrapVersion output is missing', async () => {
    const mockSDK = new MockSdk();

    mockCloudFormationClient.on(DescribeStacksCommand).resolves({
      Stacks: [{
        StackName: 'foo',
        CreationTime: new Date(),
        StackStatus: StackStatus.CREATE_COMPLETE,
        Outputs: [],
      }],
    });

    await expect(getBootstrapStackInfo(mockSDK, 'CDKToolkit')).rejects.toThrow('Unable to find BootstrapVersion output in the toolkit stack CDKToolkit');
  });
});
