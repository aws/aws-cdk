import * as aws from 'aws-sdk';
import { IsCompleteResponse, OnEventResponse } from '../../../custom-resources/lib/provider-framework/types';
export interface EksUpdateId {
    /**
     * If this field is included in an event passed to "IsComplete", it means we
     * initiated an EKS update that should be monitored using eks:DescribeUpdate
     * instead of just looking at the cluster status.
     */
    EksUpdateId?: string;
}
export type ResourceEvent = AWSLambda.CloudFormationCustomResourceEvent & EksUpdateId;
export declare abstract class ResourceHandler {
    protected readonly eks: EksClient;
    protected readonly requestId: string;
    protected readonly logicalResourceId: string;
    protected readonly requestType: 'Create' | 'Update' | 'Delete';
    protected readonly physicalResourceId?: string;
    protected readonly event: ResourceEvent;
    constructor(eks: EksClient, event: ResourceEvent);
    onEvent(): Promise<void | OnEventResponse>;
    isComplete(): Promise<IsCompleteResponse>;
    protected log(x: any): void;
    protected abstract onCreate(): Promise<OnEventResponse>;
    protected abstract onDelete(): Promise<OnEventResponse | void>;
    protected abstract onUpdate(): Promise<(OnEventResponse & EksUpdateId) | void>;
    protected abstract isCreateComplete(): Promise<IsCompleteResponse>;
    protected abstract isDeleteComplete(): Promise<IsCompleteResponse>;
    protected abstract isUpdateComplete(): Promise<IsCompleteResponse>;
}
export interface EksClient {
    configureAssumeRole(request: aws.STS.AssumeRoleRequest): void;
    createCluster(request: aws.EKS.CreateClusterRequest): Promise<aws.EKS.CreateClusterResponse>;
    deleteCluster(request: aws.EKS.DeleteClusterRequest): Promise<aws.EKS.DeleteClusterResponse>;
    describeCluster(request: aws.EKS.DescribeClusterRequest): Promise<aws.EKS.DescribeClusterResponse>;
    updateClusterConfig(request: aws.EKS.UpdateClusterConfigRequest): Promise<aws.EKS.UpdateClusterConfigResponse>;
    updateClusterVersion(request: aws.EKS.UpdateClusterVersionRequest): Promise<aws.EKS.UpdateClusterVersionResponse>;
    describeUpdate(req: aws.EKS.DescribeUpdateRequest): Promise<aws.EKS.DescribeUpdateResponse>;
    createFargateProfile(request: aws.EKS.CreateFargateProfileRequest): Promise<aws.EKS.CreateFargateProfileResponse>;
    describeFargateProfile(request: aws.EKS.DescribeFargateProfileRequest): Promise<aws.EKS.DescribeFargateProfileResponse>;
    deleteFargateProfile(request: aws.EKS.DeleteFargateProfileRequest): Promise<aws.EKS.DeleteFargateProfileResponse>;
}
