// eslint-disable-next-line import/no-extraneous-dependencies
import { IsCompleteResponse, OnEventResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';

export interface EksUpdateId {
  /**
   * If this field is included in an event passed to "IsComplete", it means we
   * initiated an EKS update that should be monitored using eks:DescribeUpdate
   * instead of just looking at the cluster status.
   */
  EksUpdateId?: string
}

export type ResourceEvent = AWSLambda.CloudFormationCustomResourceEvent & EksUpdateId;

export abstract class ResourceHandler {
  protected readonly requestId: string;
  protected readonly logicalResourceId: string;
  protected readonly requestType: 'Create' | 'Update' | 'Delete';
  protected readonly physicalResourceId?: string;
  protected readonly event: ResourceEvent;

  constructor(protected readonly eks: EksClient, event: ResourceEvent) {
    this.requestType = event.RequestType;
    this.requestId = event.RequestId;
    this.logicalResourceId = event.LogicalResourceId;
    this.physicalResourceId = (event as any).PhysicalResourceId;
    this.event = event;

    const roleToAssume = event.ResourceProperties.AssumeRoleArn;
    if (!roleToAssume) {
      throw new Error('AssumeRoleArn must be provided');
    }

    eks.configureAssumeRole({
      RoleArn: roleToAssume,
      RoleSessionName: `AWSCDK.EKSCluster.${this.requestType}.${this.requestId}`,
    });
  }

  public onEvent() {
    switch (this.requestType) {
      case 'Create': return this.onCreate();
      case 'Update': return this.onUpdate();
      case 'Delete': return this.onDelete();
    }

    throw new Error(`Invalid request type ${this.requestType}`);
  }

  public isComplete() {
    switch (this.requestType) {
      case 'Create': return this.isCreateComplete();
      case 'Update': return this.isUpdateComplete();
      case 'Delete': return this.isDeleteComplete();
    }

    throw new Error(`Invalid request type ${this.requestType}`);
  }

  protected log(x: any) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(x, undefined, 2));
  }

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
