const mockGetSignedUrlResponse = jest.fn();
const listJobsRequest = jest.fn();
const startDeploymentRequest = jest.fn();
const getJobRequest = jest.fn();
const mockAmplify = {
  listJobs: listJobsRequest,
  startDeployment: startDeploymentRequest,
  getJob: getJobRequest,
};
const mockS3 = {};

jest.mock('@aws-sdk/client-s3', () => {
  return {
    GetObjectCommand: jest.fn((input) => input),
    S3: jest.fn(() => mockS3),
  };
});

jest.mock('@aws-sdk/client-amplify', () => {
  return {
    Amplify: jest.fn(() => mockAmplify),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: mockGetSignedUrlResponse,
  };
});

import {
  onEvent,
  isComplete,
} from '../../lib/aws-amplify-alpha/asset-deployment-handler/index';

describe('handler', () => {

  let oldConsoleLog: any;

  beforeAll(() => {
    oldConsoleLog = global.console.log;
    global.console.log = jest.fn();
  });

  afterAll(() => {
    global.console.log = oldConsoleLog;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('onEvent CREATE success', async () => {
    // GIVEN
    listJobsRequest.mockImplementation(() => {
      return {
        jobSummaries: [],
      };
    });
    mockGetSignedUrlResponse.mockImplementation(() => {
      return 'signedUrlValue';
    });
    startDeploymentRequest.mockImplementation(() => {
      return {
        jobSummary: { jobId: 'jobIdValue' },
      };
    });

    // WHEN
    const response = await onEvent({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Create',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
    });

    expect(response).toEqual({
      AmplifyJobId: 'jobIdValue',
    });

    expect(listJobsRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      maxResults: 1,
    });
    expect(listJobsRequest).toBeCalled();
    expect(mockGetSignedUrlResponse).toHaveBeenCalledWith(mockS3, {
      Bucket: 's3BucketNameValue',
      Key: 's3ObjectKeyValue',
    });
    expect(startDeploymentRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      sourceUrl: 'signedUrlValue',
    });
    expect(startDeploymentRequest).toBeCalled();
  });

  it('onEvent CREATE pending job', async () => {
    // GIVEN
    listJobsRequest.mockImplementation(() => {
      return {
        jobSummaries: [{ status: 'PENDING' }],
      };
    });

    // WHEN
    await expect(() => onEvent({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Create',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
    })).rejects.toMatch('Amplify job already running. Aborting deployment.');

    expect(listJobsRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      maxResults: 1,
    });
    expect(listJobsRequest).toBeCalled();
    expect(mockGetSignedUrlResponse).not.toHaveBeenCalled();
    expect(startDeploymentRequest).not.toHaveBeenCalled();
    expect(startDeploymentRequest).not.toHaveBeenCalled();
  });

  it('isComplete CREATE success', async () => {
    // GIVEN
    getJobRequest.mockImplementation(() => {
      return {
        job: { summary: { status: 'SUCCEED' } },
      };
    });

    // WHEN
    const response = await isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Create',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      AmplifyJobId: 'amplifyJobIdValue',
    });

    // THEN
    expect(response).toEqual({
      Data: {
        JobId: 'amplifyJobIdValue',
        Status: 'SUCCEED',
      },
      IsComplete: true,
    });

    expect(getJobRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      jobId: 'amplifyJobIdValue',
    });
    expect(getJobRequest).toBeCalled();
  });

  it('isComplete CREATE pending', async () => {
    // GIVEN
    getJobRequest.mockImplementation(() => {
      return {
        job: { summary: { status: 'PENDING' } },
      };
    });

    // WHEN
    const response = await isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Create',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      AmplifyJobId: 'amplifyJobIdValue',
    });

    // THEN
    expect(response).toEqual({
      IsComplete: false,
    });

    expect(getJobRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      jobId: 'amplifyJobIdValue',
    });
    expect(getJobRequest).toBeCalled();
  });

  it('isComplete CREATE failed', async () => {
    // GIVEN
    getJobRequest.mockImplementation(() => {
      return {
        job: { summary: { status: 'FAILED' } },
      };
    });

    // WHEN
    await expect(() => isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Create',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      AmplifyJobId: 'amplifyJobIdValue',
    })).rejects.toThrow('Amplify job failed with status: FAILED');
    // THEN
    expect(getJobRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      jobId: 'amplifyJobIdValue',
    });
    expect(getJobRequest).toBeCalled();
  });

  it('isComplete CREATE cancelled', async () => {
    // GIVEN
    getJobRequest.mockImplementation(() => {
      return {
        job: { summary: { status: 'CANCELLED' } },
      };
    });

    // WHEN
    await expect(() => isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Create',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      AmplifyJobId: 'amplifyJobIdValue',
    })).rejects.toThrow('Amplify job failed with status: CANCELLED');

    // THEN
    expect(getJobRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      jobId: 'amplifyJobIdValue',
    });
    expect(getJobRequest).toBeCalled();
  });

  it('isComplete CREATE no JobId', async () => {
    // GIVEN
    getJobRequest.mockImplementation(() => {
      return {
        job: { summary: { status: 'PENDING' } },
      };
    });

    // WHEN
    await expect(() => isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Create',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
    })).rejects.toThrow('Unable to determine Amplify job status without job id');

    // THEN
    expect(getJobRequest).not.toHaveBeenCalled();
    expect(getJobRequest).not.toHaveBeenCalled();
  });

  it('onEvent UPDATE success', async () => {
    // GIVEN
    listJobsRequest.mockImplementation(() => {
      return {
        jobSummaries: [],
      };
    });
    mockGetSignedUrlResponse.mockImplementation(() => {
      return 'signedUrlValue';
    });
    startDeploymentRequest.mockImplementation(() => {
      return {
        jobSummary: { jobId: 'jobIdValue' },
      };
    });

    // WHEN
    const response = await onEvent({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Update',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      OldResourceProperties: { ServiceToken: 'serviceTokenValue' },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    });

    // THEN
    expect(response).toEqual({
      AmplifyJobId: 'jobIdValue',
    });

    expect(listJobsRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      maxResults: 1,
    });
    expect(listJobsRequest).toBeCalled();
    expect(mockGetSignedUrlResponse).toHaveBeenCalledWith(mockS3, {
      Bucket: 's3BucketNameValue',
      Key: 's3ObjectKeyValue',
    });
    expect(startDeploymentRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      sourceUrl: 'signedUrlValue',
    });
    expect(startDeploymentRequest).toBeCalled();
  });

  it('onEvent UPDATE pending job', async () => {
    // GIVEN
    listJobsRequest.mockImplementation(() => {
      return {
        jobSummaries: [{ status: 'PENDING' }],
      };
    });

    // WHEN
    await expect(() => onEvent({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Update',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      OldResourceProperties: { ServiceToken: 'serviceTokenValue' },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    })).rejects.toMatch('Amplify job already running. Aborting deployment.');

    // THEN
    expect(listJobsRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      maxResults: 1,
    });
    expect(listJobsRequest).toBeCalled();
    expect(mockGetSignedUrlResponse).not.toHaveBeenCalled();
    expect(startDeploymentRequest).not.toHaveBeenCalled();
    expect(startDeploymentRequest).not.toHaveBeenCalled();
  });

  it('isComplete UPDATE success', async () => {
    // GIVEN
    getJobRequest.mockImplementation(() => {
      return {
        job: { summary: { status: 'SUCCEED' } },
      };
    });

    // WHEN
    const response = await isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Update',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      OldResourceProperties: {},
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      AmplifyJobId: 'amplifyJobIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    });

    // THEN
    expect(response).toEqual({
      Data: {
        JobId: 'amplifyJobIdValue',
        Status: 'SUCCEED',
      },
      IsComplete: true,
    });

    expect(getJobRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      jobId: 'amplifyJobIdValue',
    });
    expect(getJobRequest).toBeCalled();
  });

  it('isComplete UPDATE pending', async () => {
    // GIVEN
    getJobRequest.mockImplementation(() => {
      return {
        job: { summary: { status: 'PENDING' } },
      };
    });

    // WHEN
    const response = await isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Update',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      OldResourceProperties: {},
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      AmplifyJobId: 'amplifyJobIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    });

    // THEN
    expect(response).toEqual({
      IsComplete: false,
    });

    expect(getJobRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      jobId: 'amplifyJobIdValue',
    });
    expect(getJobRequest).toBeCalled();
  });

  it('isComplete UPDATE failed', async () => {
    // GIVEN
    getJobRequest.mockImplementation(() => {
      return {
        job: { summary: { status: 'FAILED' } },
      };
    });

    // WHEN
    await expect(() => isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Update',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      OldResourceProperties: {},
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      AmplifyJobId: 'amplifyJobIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    })).rejects.toThrow('Amplify job failed with status: FAILED');
    // THEN
    expect(getJobRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      jobId: 'amplifyJobIdValue',
    });
    expect(getJobRequest).toBeCalled();
  });

  it('isComplete UPDATE cancelled', async () => {
    // GIVEN
    getJobRequest.mockImplementation(() => {
      return {
        job: { summary: { status: 'CANCELLED' } },
      };
    });

    // WHEN
    await expect(() => isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Update',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      OldResourceProperties: {},
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      AmplifyJobId: 'amplifyJobIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    })).rejects.toThrow('Amplify job failed with status: CANCELLED');

    // THEN
    expect(getJobRequest).toHaveBeenCalledWith({
      appId: 'appIdValue',
      branchName: 'branchNameValue',
      jobId: 'amplifyJobIdValue',
    });
    expect(getJobRequest).toBeCalled();
  });

  it('isComplete UPDATE no JobId', async () => {
    // GIVEN
    getJobRequest.mockImplementation(() => {
      return {
        job: { summary: { status: 'PENDING' } },
      };
    });

    // WHEN
    await expect(() => isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Update',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      OldResourceProperties: {},
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    })).rejects.toThrow('Unable to determine Amplify job status without job id');

    // THEN
    expect(getJobRequest).not.toHaveBeenCalled();
    expect(getJobRequest).not.toHaveBeenCalled();
  });

  it('onEvent DELETE success', async () => {
    // GIVEN

    // WHEN
    expect(() => onEvent({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Delete',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    })).resolves;
  });

  it('isComplete DELETE success', async () => {
    // GIVEN

    // WHEN
    const response = await isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Delete',
      ResourceType: 'Custom::AmplifyAssetDeployment',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    });

    // THEN
    expect(response).toEqual({
      IsComplete: true,
    });
  });

  it('onEvent unsupported resource type', async () => {
    // GIVEN

    // WHEN
    await expect(() => onEvent({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Update',
      ResourceType: 'Custom::BadResourceType',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      OldResourceProperties: {},
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    })).rejects.toThrow('Unsupported resource type "Custom::BadResourceType"');

    // THEN
    expect(getJobRequest).not.toHaveBeenCalled();
    expect(getJobRequest).not.toHaveBeenCalled();
  });

  it('isComplete unsupported resource type', async () => {
    // GIVEN

    // WHEN
    await expect(() => isComplete({
      ServiceToken: 'serviceTokenValue',
      RequestType: 'Update',
      ResourceType: 'Custom::BadResourceType',
      ResourceProperties: {
        ServiceToken: 'serviceTokenValue',
        AppId: 'appIdValue',
        BranchName: 'branchNameValue',
        S3BucketName: 's3BucketNameValue',
        S3ObjectKey: 's3ObjectKeyValue',
      },
      OldResourceProperties: {},
      ResponseURL: 'responseUrlValue',
      StackId: 'stackIdValue',
      RequestId: 'requestIdValue',
      LogicalResourceId: 'logicalResourceIdValue',
      PhysicalResourceId: 'physicalResourceIdValue',
    })).rejects.toThrow('Unsupported resource type "Custom::BadResourceType"');

    // THEN
    expect(getJobRequest).not.toHaveBeenCalled();
    expect(getJobRequest).not.toHaveBeenCalled();
  });
});
