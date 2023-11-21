import * as _eks from '@aws-sdk/client-eks';
import * as sts from '@aws-sdk/client-sts';
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
    configureAssumeRole(request: sts.AssumeRoleCommandInput): void;
    createCluster(request: _eks.CreateClusterCommandInput): Promise<_eks.CreateClusterCommandOutput>;
    deleteCluster(request: _eks.DeleteClusterCommandInput): Promise<_eks.DeleteClusterCommandOutput>;
    describeCluster(request: _eks.DescribeClusterCommandInput): Promise<_eks.DescribeClusterCommandOutput>;
    updateClusterConfig(request: _eks.UpdateClusterConfigCommandInput): Promise<_eks.UpdateClusterConfigCommandOutput>;
    updateClusterVersion(request: _eks.UpdateClusterVersionCommandInput): Promise<_eks.UpdateClusterVersionCommandOutput>;
    describeUpdate(req: _eks.DescribeUpdateCommandInput): Promise<_eks.DescribeUpdateCommandOutput>;
    createFargateProfile(request: _eks.CreateFargateProfileCommandInput): Promise<_eks.CreateFargateProfileCommandOutput>;
    describeFargateProfile(request: _eks.DescribeFargateProfileCommandInput): Promise<_eks.DescribeFargateProfileCommandOutput>;
    deleteFargateProfile(request: _eks.DeleteFargateProfileCommandInput): Promise<_eks.DeleteFargateProfileCommandOutput>;
}
