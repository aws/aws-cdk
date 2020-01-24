import { IsCompleteResponse, OnEventResponse } from "@aws-cdk/custom-resources/lib/provider-framework/types";

// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';

export abstract class ResourceHandler {
  protected readonly requestId: string;
  protected readonly logicalResourceId: string;
  protected readonly requestType: 'Create' | 'Update' | 'Delete';
  protected readonly physicalResourceId?: string;
  protected readonly event: AWSLambda.CloudFormationCustomResourceEvent;

  constructor(protected readonly eks: EksClient, event: AWSLambda.CloudFormationCustomResourceEvent) {
    this.requestType = event.RequestType;
    this.requestId = event.RequestId;
    this.logicalResourceId = event.LogicalResourceId;
    this.physicalResourceId = (event as any).PhysicalResourceId;
    this.event = event;

    const roleToAssume = event.ResourceProperties.AssumeRoleArn;
    if (!roleToAssume) {
      throw new Error(`AssumeRoleArn must be provided`);
    }

    eks.configureAssumeRole({
      RoleArn: roleToAssume,
      RoleSessionName: `AWSCDK.EKSCluster.${this.requestType}.${this.requestId}`
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
    // tslint:disable-next-line: no-console
    console.log(JSON.stringify(x, undefined, 2));
  }

  protected abstract async onCreate(): Promise<OnEventResponse>;
  protected abstract async onDelete(): Promise<OnEventResponse | void>;
  protected abstract async onUpdate(): Promise<OnEventResponse | void>;
  protected abstract async isCreateComplete(): Promise<IsCompleteResponse>;
  protected abstract async isDeleteComplete(): Promise<IsCompleteResponse>;
  protected abstract async isUpdateComplete(): Promise<IsCompleteResponse>;
}

export interface EksClient {
  configureAssumeRole(request: aws.STS.AssumeRoleRequest): void;
  createCluster(request: aws.EKS.CreateClusterRequest): Promise<aws.EKS.CreateClusterResponse>;
  deleteCluster(request: aws.EKS.DeleteClusterRequest): Promise<aws.EKS.DeleteClusterResponse>;
  describeCluster(request: aws.EKS.DescribeClusterRequest): Promise<aws.EKS.DescribeClusterResponse>;
  updateClusterConfig(request: aws.EKS.UpdateClusterConfigRequest): Promise<aws.EKS.UpdateClusterConfigResponse>;
  updateClusterVersion(request: aws.EKS.UpdateClusterVersionRequest): Promise<aws.EKS.UpdateClusterVersionResponse>;
  createFargateProfile(request: aws.EKS.CreateFargateProfileRequest): Promise<aws.EKS.CreateFargateProfileResponse>;
  describeFargateProfile(request: aws.EKS.DescribeFargateProfileRequest): Promise<aws.EKS.DescribeFargateProfileResponse>;
  deleteFargateProfile(request: aws.EKS.DeleteFargateProfileRequest): Promise<aws.EKS.DeleteFargateProfileResponse>;
}
