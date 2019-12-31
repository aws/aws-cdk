// tslint:disable:no-console

import { IsCompleteResponse, OnEventResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';

const MAX_CLUSTER_NAME_LEN = 100;

export class ClusterResourceHandler {

  public get clusterName() {
    if (!this.physicalResourceId) {
      throw new Error(`Cannot determie cluster name without physical resource ID`);
    }

    return this.physicalResourceId;
  }

  private readonly requestType: string;
  private readonly requestId: string;
  private readonly logicalResourceId: string;
  private readonly physicalResourceId?: string;
  private readonly newProps: aws.EKS.CreateClusterRequest;
  private readonly oldProps: Partial<aws.EKS.CreateClusterRequest>;

  constructor(private readonly eks: EksClient, event: any) {
    this.requestId = event.RequestId;
    this.logicalResourceId = event.LogicalResourceId;
    this.newProps = parseProps(event.ResourceProperties);
    this.oldProps = event.RequestType === 'Update' ? parseProps(event.OldResourceProperties) : { };
    this.physicalResourceId = event.PhysicalResourceId;

    const roleToAssume = event.ResourceProperties.AssumeRoleArn;
    if (!roleToAssume) {
      throw new Error(`AssumeRoleArn must be provided`);
    }

    eks.configureAssumeRole({
      RoleArn: roleToAssume,
      RoleSessionName: `AWSCDK.EKSCluster.${event.RequestType}.${this.requestId}`
    });

    this.requestType = event.RequestType;
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

  // ------
  // CREATE
  // ------

  private async onCreate(): Promise<OnEventResponse> {
    console.log('onCreate: creating cluster with options:', JSON.stringify(this.newProps, undefined, 2));
    if (!this.newProps.roleArn) {
      throw new Error('"roleArn" is required');
    }

    const clusterName = this.newProps.name || this.generateClusterName();

    const resp = await this.eks.createCluster({
      ...this.newProps,
      name: clusterName,
    });

    if (!resp.cluster) {
      throw new Error(`Error when trying to create cluster ${clusterName}: CreateCluster returned without cluster information`);
    }

    return {
      PhysicalResourceId: resp.cluster.name
    };
  }

  private async isCreateComplete() {
    return this.isActive();
  }

  // ------
  // DELETE
  // ------

  private async onDelete(): Promise<OnEventResponse> {
    console.log(`onDelete: deleting cluster ${this.clusterName}`);
    try {
      await this.eks.deleteCluster({ name: this.clusterName });
    } catch (e) {
      if (e.code !== 'ResourceNotFoundException') {
        throw e;
      } else {
        console.log(`cluster ${this.clusterName} not found, idempotently succeeded`);
      }
    }
    return {
      PhysicalResourceId: this.clusterName
    };
  }

  private async isDeleteComplete(): Promise<IsCompleteResponse> {
    console.log(`isDeleteComplete: waiting for cluster ${this.clusterName} to be deleted`);

    try {
      const resp = await this.eks.describeCluster({ name: this.clusterName });
      console.log('describeCluster returned:', JSON.stringify(resp, undefined, 2));
    } catch (e) {
      if (e.code === 'ResourceNotFoundException') {
        console.log('received ResourceNotFoundException, this means the cluster has been deleted (or never existed)');
        return { IsComplete: true };
      }

      console.log('describeCluster error:', e);
      throw e;
    }

    return {
      IsComplete: false
    };
  }

  // ------
  // UPDATE
  // ------

  private async onUpdate() {
    const updates = analyzeUpdate(this.oldProps, this.newProps);
    console.log(`onUpdate:`, JSON.stringify({ updates }, undefined, 2));

    // if there is an update that requires replacement, go ahead and just create
    // a new cluster with the new config. The old cluster will automatically be
    // deleted by cloudformation upon success.
    if (updates.replaceName || updates.replaceRole || updates.replaceVpc) {

      // if we are replacing this cluster and the cluster has an explicit
      // physical name, the creation of the new cluster will fail with "there is
      // already a cluster with that name". this is a common behavior for
      // CloudFormation resources that support specifying a physical name.
      if (this.oldProps.name === this.newProps.name && this.oldProps.name) {
        throw new Error(`Cannot replace cluster "${this.oldProps.name}" since it has an explicit physical name. Either rename the cluster or remove the "name" configuration`);
      }

      return await this.onCreate();
    }

    // if a version update is required, issue the version update
    if (updates.updateVersion) {
      if (!this.newProps.version) {
        throw new Error(`Cannot remove cluster version configuration. Current version is ${this.oldProps.version}`);
      }

      await this.updateClusterVersion(this.newProps.version);
    }

    if (updates.updateLogging || updates.updateAccess) {
      return await this.eks.updateClusterConfig({
        name: this.clusterName,
        logging: this.newProps.logging,
        resourcesVpcConfig: this.newProps.resourcesVpcConfig
      });
    }

    // no updates
    return;
  }

  private async isUpdateComplete() {
    console.log(`isUpdateComplete`);
    return this.isActive();
  }

  private async updateClusterVersion(newVersion: string) {
    console.log(`updating cluster version to ${newVersion}`);

    // update-cluster-version will fail if we try to update to the same version,
    // so skip in this case.
    const cluster = (await this.eks.describeCluster({ name: this.clusterName })).cluster;
    if (cluster?.version === newVersion) {
      console.log(`cluster already at version ${cluster.version}, skipping version update`);
      return;
    }

    await this.eks.updateClusterVersion({ name: this.clusterName, version: newVersion });
  }

  private async isActive(): Promise<IsCompleteResponse> {
    console.log('waiting for cluster to become ACTIVE');
    const resp = await this.eks.describeCluster({ name: this.clusterName });
    console.log('describeCluster result:', JSON.stringify(resp, undefined, 2));
    const cluster = resp.cluster;

    // if cluster is undefined (shouldnt happen) or status is not ACTIVE, we are
    // not complete. note that the custom resource provider framework forbids
    // returning attributes (Data) if isComplete is false.
    if (cluster?.status !== 'ACTIVE') {
      return {
        IsComplete: false
      };
    } else {
      return {
        IsComplete: true,
        Data: {
          Name: cluster.name,
          Endpoint: cluster.endpoint,
          Arn: cluster.arn,
          CertificateAuthorityData: cluster.certificateAuthority?.data
        }
      };
    }
  }

  private generateClusterName() {
    const suffix = this.requestId.replace(/-/g, ''); // 32 chars
    const prefix = this.logicalResourceId.substr(0, MAX_CLUSTER_NAME_LEN - suffix.length - 1);
    return `${prefix}-${suffix}`;
  }
}

export interface EksClient {
  configureAssumeRole(request: aws.STS.AssumeRoleRequest): void;
  createCluster(request: aws.EKS.CreateClusterRequest): Promise<aws.EKS.CreateClusterResponse>;
  deleteCluster(request: aws.EKS.DeleteClusterRequest): Promise<aws.EKS.DeleteClusterResponse>;
  describeCluster(request: aws.EKS.DescribeClusterRequest): Promise<aws.EKS.DescribeClusterResponse>;
  updateClusterConfig(request: aws.EKS.UpdateClusterConfigRequest): Promise<aws.EKS.UpdateClusterConfigResponse>;
  updateClusterVersion(request: aws.EKS.UpdateClusterVersionRequest): Promise<aws.EKS.UpdateClusterVersionResponse>;
}

function parseProps(props: any): aws.EKS.CreateClusterRequest {
  return props?.Config ?? { };
}

interface UpdateMap {
  replaceName: boolean;     // name
  replaceVpc: boolean;      // resourcesVpcConfig.subnetIds and securityGroupIds
  replaceRole: boolean;     // roleArn
  updateVersion: boolean;   // version
  updateLogging: boolean;   // logging
  updateAccess: boolean;    // resourcesVpcConfig.endpointPrivateAccess and endpointPublicAccess
}

function analyzeUpdate(oldProps: Partial<aws.EKS.CreateClusterRequest>, newProps: aws.EKS.CreateClusterRequest): UpdateMap {
  console.log('old props: ', JSON.stringify(oldProps));
  console.log('new props: ', JSON.stringify(newProps));

  const newVpcProps = newProps.resourcesVpcConfig || { };
  const oldVpcProps = oldProps.resourcesVpcConfig || { };

  return {
    replaceName: newProps.name !== oldProps.name,
    replaceVpc:
      JSON.stringify(newVpcProps.subnetIds) !== JSON.stringify(oldVpcProps.subnetIds) ||
      JSON.stringify(newVpcProps.securityGroupIds) !== JSON.stringify(oldVpcProps.securityGroupIds),
    updateAccess:
      newVpcProps.endpointPrivateAccess !== oldVpcProps.endpointPrivateAccess ||
      newVpcProps.endpointPublicAccess !== oldVpcProps.endpointPublicAccess,
    replaceRole: newProps.roleArn !== oldProps.roleArn,
    updateVersion: newProps.version !== oldProps.version,
    updateLogging: JSON.stringify(newProps.logging) !== JSON.stringify(oldProps.logging),
  };
}
