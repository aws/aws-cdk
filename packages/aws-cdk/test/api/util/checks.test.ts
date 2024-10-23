import {
  DescribeStackResourcesCommand,
  DescribeStacksCommand,
  ResourceStatus,
  StackStatus,
} from '@aws-sdk/client-cloudformation';
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

    mockCloudFormationClient.on(DescribeStackResourcesCommand).resolves({ StackResources: [] });

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
        Outputs: [{ OutputKey: 'BootstrapVersion', OutputValue: '21' }],
      }],
    });

    mockCloudFormationClient.on(DescribeStackResourcesCommand).resolves({
      StackResources: [{
        LogicalResourceId: 'foo',
        Timestamp: new Date(),
        ResourceStatus: ResourceStatus.CREATE_COMPLETE,
        ResourceType: 'AWS::S3::Bucket',
        PhysicalResourceId: 'some-bucket',
      }],
    });

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
        Outputs: [{ OutputKey: 'BootstrapVersion', OutputValue: '20' }],
      }],
    });

    mockCloudFormationClient.on(DescribeStackResourcesCommand).resolves({
      StackResources: [{
        LogicalResourceId: 'foo',
        Timestamp: new Date(),
        ResourceStatus: ResourceStatus.CREATE_COMPLETE,
        ResourceType: 'AWS::S3::Bucket',
        PhysicalResourceId: 'some-bucket',
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
        Outputs: [{ OutputKey: 'BootstrapVersion', OutputValue: '21' }],
      }],
    });

    mockCloudFormationClient.on(DescribeStackResourcesCommand).resolves({
      StackResources: [{
        LogicalResourceId: 'foo',
        Timestamp: new Date(),
        ResourceStatus: ResourceStatus.CREATE_COMPLETE,
        ResourceType: 'AWS::S3::Bucket',
        PhysicalResourceId: 'some-bucket',
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