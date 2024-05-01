/* eslint-disable import/no-extraneous-dependencies */
import * as eks from '@aws-sdk/client-eks';
import * as sts from '@aws-sdk/client-sts';
import { EksClient } from '../../lib/aws-eks/cluster-resource-handler/common';

/**
 * Request objects will be assigned when a request of the relevant type will be
 * made.
 */
export let actualRequest: {
  configureAssumeRoleRequest?: sts.AssumeRoleRequest;
  createClusterRequest?: eks.CreateClusterCommandInput;
  describeClusterRequest?: eks.DescribeClusterCommandInput;
  describeUpdateRequest?: eks.DescribeUpdateCommandInput;
  deleteClusterRequest?: eks.DeleteClusterCommandInput;
  updateClusterConfigRequest?: eks.UpdateClusterConfigCommandInput;
  updateClusterVersionRequest?: eks.UpdateClusterVersionCommandInput;
  createFargateProfile?: eks.CreateFargateProfileCommandInput;
  describeFargateProfile?: eks.DescribeFargateProfileCommandInput;
  deleteFargateProfile?: eks.DeleteFargateProfileCommandInput;
} = { };

/**
 * Responses can be simulated by assigning values here.
 */
export let simulateResponse: {
  describeClusterResponseMockStatus?: string;
  describeUpdateResponseMockStatus?: string;
  describeUpdateResponseMockErrors?: eks.ErrorDetail[];
  deleteClusterError?: Error;
  describeClusterException?: Error;
} = { };

export function reset() {
  actualRequest = { };
  simulateResponse = { };
}

export const MOCK_UPDATE_STATUS_ID = 'MockEksUpdateStatusId';

export const client: EksClient = {

  configureAssumeRole: req => {
    actualRequest.configureAssumeRoleRequest = req;
  },

  createCluster: async req => {
    actualRequest.createClusterRequest = req;
    return {
      $metadata: {},
      cluster: {
        name: req.name,
        roleArn: req.roleArn,
        version: '1.0',
        arn: `arn:${req.name}`,
        certificateAuthority: { data: 'certificateAuthority-data' },
        status: 'CREATING',
      },
    };
  },

  deleteCluster: async req => {
    actualRequest.deleteClusterRequest = req;
    if (simulateResponse.deleteClusterError) {
      throw simulateResponse.deleteClusterError;
    }
    return {
      $metadata: {},
      cluster: {
        name: req.name,
      },
    };
  },

  describeCluster: async req => {
    actualRequest.describeClusterRequest = req;

    if (simulateResponse.describeClusterException) {
      throw simulateResponse.describeClusterException;
    }

    return {
      $metadata: {},
      cluster: {
        name: req.name,
        version: '1.0',
        roleArn: 'arn:role',
        arn: 'arn:cluster-arn',
        certificateAuthority: { data: 'certificateAuthority-data' },
        endpoint: 'http://endpoint',
        status: simulateResponse.describeClusterResponseMockStatus || 'ACTIVE',
      },
    };
  },

  describeUpdate: async req => {
    actualRequest.describeUpdateRequest = req;

    return {
      $metadata: {},
      update: {
        id: req.updateId,
        errors: simulateResponse.describeUpdateResponseMockErrors,
        status: simulateResponse.describeUpdateResponseMockStatus,
      },
    };
  },

  updateClusterConfig: async req => {
    actualRequest.updateClusterConfigRequest = req;
    return {
      $metadata: {},
      update: {
        id: MOCK_UPDATE_STATUS_ID,
      },
    };
  },

  updateClusterVersion: async req => {
    actualRequest.updateClusterVersionRequest = req;
    return {
      $metadata: {},
      update: {
        id: MOCK_UPDATE_STATUS_ID,
      },
    };
  },

  createFargateProfile: async req => {
    actualRequest.createFargateProfile = req;
    return { $metadata: {} };
  },

  describeFargateProfile: async req => {
    actualRequest.describeFargateProfile = req;
    return { $metadata: {} };
  },

  deleteFargateProfile: async req => {
    actualRequest.deleteFargateProfile = req;
    return { $metadata: {} };
  },
};

export const MOCK_PROPS = {
  roleArn: 'arn:of:role',
  resourcesVpcConfig: {
    subnetIds: ['subnet1', 'subnet2'],
    securityGroupIds: ['sg1', 'sg2', 'sg3'],
  },
};

export const MOCK_ASSUME_ROLE_ARN = 'assume:role:arn';

export function newRequest<T extends 'Create' | 'Update' | 'Delete'>(
  requestType: T,
  props?: Partial<eks.CreateClusterCommandInput>,
  oldProps?: Partial<eks.CreateClusterCommandInput>) {
  return {
    StackId: 'fake-stack-id',
    RequestId: 'fake-request-id',
    ResourceType: 'Custom::EKSCluster',
    ServiceToken: 'boom',
    LogicalResourceId: 'MyResourceId',
    PhysicalResourceId: 'physical-resource-id',
    ResponseURL: 'http://response-url',
    RequestType: requestType,
    OldResourceProperties: {
      Config: oldProps,
      AssumeRoleArn: MOCK_ASSUME_ROLE_ARN,
    },
    ResourceProperties: {
      ServiceToken: 'boom',
      Config: props,
      AssumeRoleArn: MOCK_ASSUME_ROLE_ARN,
    },
  };
}
