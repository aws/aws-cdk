import * as sdk from 'aws-sdk';
import { EksClient } from '../lib/cluster-resource-handler/handler';

/**
 * Request objects will be assigned when a request of the relevant type will be
 * made.
 */
export let actualRequest: {
  configureAssumeRoleRequest?: sdk.STS.AssumeRoleRequest;
  createClusterRequest?: sdk.EKS.CreateClusterRequest;
  describeClusterRequest?: sdk.EKS.DescribeClusterRequest;
  deleteClusterRequest?: sdk.EKS.DeleteClusterRequest;
  updateClusterConfigRequest?: sdk.EKS.UpdateClusterConfigRequest;
  updateClusterVersionRequest?: sdk.EKS.UpdateClusterVersionRequest;
} = { };

/**
 * Responses can be simulated by assigning values here.
 */
export let simulateResponse: {
  describeClusterResponseMockStatus?: string;
  deleteClusterErrorCode?: string;
  describeClusterExceptionCode?: string;
} = { };

export function reset() {
  actualRequest = { };
  simulateResponse = { };
}

export const client: EksClient = {

  configureAssumeRole: req => {
    actualRequest.configureAssumeRoleRequest = req;
  },

  createCluster: async req => {
    actualRequest.createClusterRequest = req;
    return {
      cluster: {
        name: req.name,
        roleArn: req.roleArn,
        version: '1.0',
        arn: `arn:${req.name}`,
        certificateAuthority: { data: 'certificateAuthority-data' },
        status: 'CREATING'
      }
    };
  },

  deleteCluster: async req => {
    actualRequest.deleteClusterRequest = req;
    if (simulateResponse.deleteClusterErrorCode) {
      const e = new Error('mock error');
      (e as any).code = simulateResponse.deleteClusterErrorCode;
      throw e;
    }
    return {
      cluster: {
        name: req.name
      }
    };
  },

  describeCluster: async req => {
    actualRequest.describeClusterRequest = req;

    if (simulateResponse.describeClusterExceptionCode) {
      const e = new Error('mock exception');
      (e as any).code = simulateResponse.describeClusterExceptionCode;
      throw e;
    }

    return {
      cluster: {
        name: req.name,
        version: '1.0',
        roleArn: 'arn:role',
        arn: `arn:cluster-arn`,
        certificateAuthority: { data: 'certificateAuthority-data' },
        endpoint: 'http://endpoint',
        status: simulateResponse.describeClusterResponseMockStatus || 'ACTIVE'
      }
    };
  },

  updateClusterConfig: async req => {
    actualRequest.updateClusterConfigRequest = req;
    return { };
  },

  updateClusterVersion: async req => {
    actualRequest.updateClusterVersionRequest = req;
    return { };
  }

};

export const MOCK_PROPS = {
  roleArn: 'arn:of:role',
  resourcesVpcConfig: {
    subnetIds: [ 'subnet1', 'subnet2' ],
    securityGroupIds: [ 'sg1', 'sg2', 'sg3' ]
  }
};

export const MOCK_ASSUME_ROLE_ARN = 'assume:role:arn';

export function newRequest<T extends 'Create' | 'Update' | 'Delete'>(
    requestType: T,
    props?: Partial<sdk.EKS.CreateClusterRequest>,
    oldProps?: Partial<sdk.EKS.CreateClusterRequest>) {
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
      AssumeRoleArn: MOCK_ASSUME_ROLE_ARN
    },
    ResourceProperties: {
      ServiceToken: 'boom',
      Config: props,
      AssumeRoleArn: MOCK_ASSUME_ROLE_ARN
    }
  };
}
