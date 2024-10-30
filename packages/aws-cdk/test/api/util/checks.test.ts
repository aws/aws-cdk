import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import { ISDK } from '../../../lib/api/aws-auth';
import { determineAllowCrossAccountAssetPublishing, getBootstrapStackInfo } from '../../../lib/api/util/checks';

describe('determineAllowCrossAccountAssetPublishing', () => {
  let mockSDK: ISDK;

  beforeEach(() => {
    mockSDK = {
      cloudFormation: () => new AWS.CloudFormation(),
    } as ISDK;
  });

  afterEach(() => {
    AWSMock.restore();
  });

  it('should return true when hasStagingBucket is false', async () => {
    AWSMock.mock('CloudFormation', 'describeStacks', (_params: any, callback: Function) => {
      callback(null, {
        Stacks: [{
          Outputs: [{ OutputKey: 'BootstrapVersion', OutputValue: '1' }],
        }],
      });
    });

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(true);
  });

  it.each(['', '-', '*', '---'])('should return true when the bucket output does not look like a real bucket', async (notABucketName) => {
    AWSMock.mock('CloudFormation', 'describeStacks', (_params: any, callback: Function) => {
      callback(null, {
        Stacks: [{
          Outputs: [
            { OutputKey: 'BootstrapVersion', OutputValue: '1' },
            { OutputKey: 'BucketName', OutputValue: notABucketName },
          ],
        }],
      });
    });

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(true);
  });

  it('should return true when bootstrap version is >= 21', async () => {
    AWSMock.mock('CloudFormation', 'describeStacks', (_params: any, callback: Function) => {
      callback(null, {
        Stacks: [{
          Outputs: [
            { OutputKey: 'BootstrapVersion', OutputValue: '21' },
            { OutputKey: 'BucketName', OutputValue: 'some-bucket' },
          ],
        }],
      });
    });

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(true);
  });

  it('should return true if looking up the bootstrap stack fails', async () => {
    AWSMock.mock('CloudFormation', 'describeStacks', (_params: any, callback: Function) => {
      callback(new Error('Could not read bootstrap stack'));
    });

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(true);
  });

  it('should return true if looking up the bootstrap stack fails', async () => {
    AWSMock.mock('CloudFormation', 'describeStacks', (_params: any, callback: Function) => {
      callback(new Error('Could not read bootstrap stack'));
    });

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(true);
  });

  it('should return false for other scenarios', async () => {
    AWSMock.mock('CloudFormation', 'describeStacks', (_params: any, callback: Function) => {
      callback(null, {
        Stacks: [{
          Outputs: [
            { OutputKey: 'BootstrapVersion', OutputValue: '20' },
            { OutputKey: 'BucketName', OutputValue: 'some-bucket' },
          ],
        }],
      });
    });

    const result = await determineAllowCrossAccountAssetPublishing(mockSDK);
    expect(result).toBe(false);
  });
});

describe('getBootstrapStackInfo', () => {
  let mockSDK: ISDK;

  beforeEach(() => {
    mockSDK = {
      cloudFormation: () => new AWS.CloudFormation(),
    } as ISDK;
  });

  afterEach(() => {
    AWSMock.restore();
  });

  it('should return correct BootstrapStackInfo', async () => {
    AWSMock.mock('CloudFormation', 'describeStacks', (_params: any, callback: Function) => {
      callback(null, {
        Stacks: [{
          Outputs: [
            { OutputKey: 'BootstrapVersion', OutputValue: '21' },
            { OutputKey: 'BucketName', OutputValue: 'some-bucket' },
          ],
        }],
      });
    });

    const result = await getBootstrapStackInfo(mockSDK, 'CDKToolkit');
    expect(result).toEqual({
      hasStagingBucket: true,
      bootstrapVersion: 21,
    });
  });

  it('should throw error when stack is not found', async () => {
    AWSMock.mock('CloudFormation', 'describeStacks', (_params: any, callback: Function) => {
      callback(null, { Stacks: [] });
    });

    await expect(getBootstrapStackInfo(mockSDK, 'CDKToolkit')).rejects.toThrow('Toolkit stack CDKToolkit not found');
  });

  it('should throw error when BootstrapVersion output is missing', async () => {
    AWSMock.mock('CloudFormation', 'describeStacks', (_params: any, callback: Function) => {
      callback(null, {
        Stacks: [{
          Outputs: [],
        }],
      });
    });

    await expect(getBootstrapStackInfo(mockSDK, 'CDKToolkit')).rejects.toThrow('Unable to find BootstrapVersion output in the toolkit stack CDKToolkit');
  });
});