import * as sdk from 'aws-sdk';
import { EksClient } from '../lib/cluster-resource-handler/common';
/**
 * Request objects will be assigned when a request of the relevant type will be
 * made.
 */
export declare let actualRequest: {
    configureAssumeRoleRequest?: sdk.STS.AssumeRoleRequest;
    createClusterRequest?: sdk.EKS.CreateClusterRequest;
    describeClusterRequest?: sdk.EKS.DescribeClusterRequest;
    describeUpdateRequest?: sdk.EKS.DescribeUpdateRequest;
    deleteClusterRequest?: sdk.EKS.DeleteClusterRequest;
    updateClusterConfigRequest?: sdk.EKS.UpdateClusterConfigRequest;
    updateClusterVersionRequest?: sdk.EKS.UpdateClusterVersionRequest;
    createFargateProfile?: sdk.EKS.CreateFargateProfileRequest;
    describeFargateProfile?: sdk.EKS.DescribeFargateProfileRequest;
    deleteFargateProfile?: sdk.EKS.DeleteFargateProfileRequest;
};
/**
 * Responses can be simulated by assigning values here.
 */
export declare let simulateResponse: {
    describeClusterResponseMockStatus?: string;
    describeUpdateResponseMockStatus?: string;
    describeUpdateResponseMockErrors?: sdk.EKS.ErrorDetails;
    deleteClusterErrorCode?: string;
    describeClusterExceptionCode?: string;
};
export declare function reset(): void;
export declare const MOCK_UPDATE_STATUS_ID = "MockEksUpdateStatusId";
export declare const client: EksClient;
export declare const MOCK_PROPS: {
    roleArn: string;
    resourcesVpcConfig: {
        subnetIds: string[];
        securityGroupIds: string[];
    };
};
export declare const MOCK_ASSUME_ROLE_ARN = "assume:role:arn";
export declare function newRequest<T extends 'Create' | 'Update' | 'Delete'>(requestType: T, props?: Partial<sdk.EKS.CreateClusterRequest>, oldProps?: Partial<sdk.EKS.CreateClusterRequest>): {
    StackId: string;
    RequestId: string;
    ResourceType: string;
    ServiceToken: string;
    LogicalResourceId: string;
    PhysicalResourceId: string;
    ResponseURL: string;
    RequestType: T;
    OldResourceProperties: {
        Config: Partial<sdk.EKS.CreateClusterRequest> | undefined;
        AssumeRoleArn: string;
    };
    ResourceProperties: {
        ServiceToken: string;
        Config: Partial<sdk.EKS.CreateClusterRequest> | undefined;
        AssumeRoleArn: string;
    };
};
