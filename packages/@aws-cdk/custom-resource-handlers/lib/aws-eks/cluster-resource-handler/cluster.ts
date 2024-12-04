/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as EKS from '@aws-sdk/client-eks';
import { IsCompleteResponse, OnEventResponse } from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';
import { EksClient, ResourceEvent, ResourceHandler } from './common';
import { compareLoggingProps } from './compareLogging';

const MAX_CLUSTER_NAME_LEN = 100;

export class ClusterResourceHandler extends ResourceHandler {
  public get clusterName() {
    if (!this.physicalResourceId) {
      throw new Error('Cannot determine cluster name without physical resource ID');
    }

    return this.physicalResourceId;
  }

  private readonly newProps: EKS.CreateClusterCommandInput;
  private readonly oldProps: Partial<EKS.CreateClusterCommandInput>;

  constructor(eks: EksClient, event: ResourceEvent) {
    super(eks, event);

    this.newProps = parseProps(this.event.ResourceProperties);
    this.oldProps = event.RequestType === 'Update' ? parseProps(event.OldResourceProperties) : {};
    // compare newProps and oldProps and update the newProps by appending disabled LogSetup if any
    const compared: Partial<EKS.CreateClusterCommandInput> = compareLoggingProps(this.oldProps, this.newProps);
    this.newProps.logging = compared.logging;
  }

  // ------
  // CREATE
  // ------

  protected async onCreate(): Promise<OnEventResponse> {
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
      PhysicalResourceId: resp.cluster.name,
    };
  }

  protected async isCreateComplete() {
    return this.isActive();
  }

  // ------
  // DELETE
  // ------

  protected async onDelete(): Promise<OnEventResponse> {
    console.log(`onDelete: deleting cluster ${this.clusterName}`);
    try {
      await this.eks.deleteCluster({ name: this.clusterName });
    } catch (e: any) {
      if (e.name !== 'ResourceNotFoundException') {
        throw e;
      } else {
        console.log(`cluster ${this.clusterName} not found, idempotently succeeded`);
      }
    }
    return {
      PhysicalResourceId: this.clusterName,
    };
  }

  protected async isDeleteComplete(): Promise<IsCompleteResponse> {
    console.log(`isDeleteComplete: waiting for cluster ${this.clusterName} to be deleted`);

    try {
      const resp = await this.eks.describeCluster({ name: this.clusterName });
      console.log('describeCluster returned:', JSON.stringify(resp, undefined, 2));
    } catch (e: any) {
      if (e.name === 'ResourceNotFoundException') {
        console.log('received ResourceNotFoundException, this means the cluster has been deleted (or never existed)');
        return { IsComplete: true };
      }

      console.log('describeCluster error:', e);
      throw e;
    }

    return {
      IsComplete: false,
    };
  }

  // ------
  // UPDATE
  // ------

  protected async onUpdate() {
    const updates = analyzeUpdate(this.oldProps, this.newProps);
    console.log('onUpdate:', JSON.stringify({ updates }, undefined, 2));

    // updates to encryption config is not supported
    if (updates.updateEncryption) {
      throw new Error('Cannot update cluster encryption configuration');
    }

    // if there is an update that requires replacement, go ahead and just create
    // a new cluster with the new config. The old cluster will automatically be
    // deleted by cloudformation upon success.
    if (updates.replaceName || updates.replaceRole || updates.updateBootstrapClusterCreatorAdminPermissions ) {
      // if we are replacing this cluster and the cluster has an explicit
      // physical name, the creation of the new cluster will fail with "there is
      // already a cluster with that name". this is a common behavior for
      // CloudFormation resources that support specifying a physical name.
      if (this.oldProps.name === this.newProps.name && this.oldProps.name) {
        throw new Error(`Cannot replace cluster "${this.oldProps.name}" since it has an explicit physical name. Either rename the cluster or remove the "name" configuration`);
      }

      return this.onCreate();
    }

    // We can only update one type of the UpdateTypes:
    type UpdateTypes = {
      updateLogging: boolean;
      updateAccess: boolean;
      updateVpc: boolean;
      updateAuthMode: boolean;
    };
    // validate updates
    const updateTypes = Object.keys(updates) as (keyof UpdateTypes)[];
    const enabledUpdateTypes = updateTypes.filter((type) => updates[type]);
    console.log(enabledUpdateTypes);

    if (enabledUpdateTypes.length > 1) {
      throw new Error(
        'Only one type of update - VpcConfigUpdate, LoggingUpdate, EndpointAccessUpdate, or AuthModeUpdate can be allowed',
      );
    }

    // Update tags
    if (updates.updateTags) {
      try {
        // Describe the cluster to get the ARN for tagging APIs and to make sure Cluster exists
        const cluster = (await this.eks.describeCluster({ name: this.clusterName })).cluster;
        if (this.oldProps.tags) {
          if (this.newProps.tags) {
            // This means there are old tags as well as new tags so get the difference
            // Update existing tag keys and add newly added tags
            const tagsToAdd = getTagsToUpdate(this.oldProps.tags, this.newProps.tags);
            if (tagsToAdd) {
              const tagConfig: EKS.TagResourceCommandInput = {
                resourceArn: cluster?.arn,
                tags: tagsToAdd,
              };
              await this.eks.tagResource(tagConfig);
            }
            // Remove the tags that were removed in newProps
            const tagsToRemove = getTagsToRemove(this.oldProps.tags, this.newProps.tags);
            if (tagsToRemove.length > 0 ) {
              const config: EKS.UntagResourceCommandInput = {
                resourceArn: cluster?.arn,
                tagKeys: tagsToRemove,
              };
              await this.eks.untagResource(config);
            }
          } else {
            // This means newProps.tags is empty hence remove all tags
            const config: EKS.UntagResourceCommandInput = {
              resourceArn: cluster?.arn,
              tagKeys: Object.keys(this.oldProps.tags),
            };
            await this.eks.untagResource(config);
          }
        } else {
          // This means oldProps.tags was empty hence add all tags from newProps.tags
          const config: EKS.TagResourceCommandInput = {
            resourceArn: cluster?.arn,
            tags: this.newProps.tags,
          };
          await this.eks.tagResource(config);
        }
      } catch (e: any) {
        throw e;
      }
    }

    // if a version update is required, issue the version update
    if (updates.updateVersion) {
      if (!this.newProps.version) {
        throw new Error(`Cannot remove cluster version configuration. Current version is ${this.oldProps.version}`);
      }

      return this.updateClusterVersion(this.newProps.version);
    }

    if (updates.updateLogging || updates.updateAccess || updates.updateVpc || updates.updateAuthMode) {
      const config: EKS.UpdateClusterConfigCommandInput = {
        name: this.clusterName,
      };
      if (updates.updateLogging) {
        config.logging = this.newProps.logging;
      };
      if (updates.updateAccess) {
        config.resourcesVpcConfig = {
          endpointPrivateAccess: this.newProps.resourcesVpcConfig?.endpointPrivateAccess,
          endpointPublicAccess: this.newProps.resourcesVpcConfig?.endpointPublicAccess,
          publicAccessCidrs: this.newProps.resourcesVpcConfig?.publicAccessCidrs,
        };
      };

      if (updates.updateAuthMode) {
        // the update path must be
        // `undefined or CONFIG_MAP` -> `API_AND_CONFIG_MAP` -> `API`
        // and it's one way path.
        // old value is API - cannot fallback backwards
        if (this.oldProps.accessConfig?.authenticationMode === 'API' &&
          this.newProps.accessConfig?.authenticationMode !== 'API') {
          throw new Error(`Cannot fallback authenticationMode from API to ${this.newProps.accessConfig?.authenticationMode}`);
        }
        // old value is API_AND_CONFIG_MAP - cannot fallback to CONFIG_MAP
        if (this.oldProps.accessConfig?.authenticationMode === 'API_AND_CONFIG_MAP' &&
          this.newProps.accessConfig?.authenticationMode === 'CONFIG_MAP') {
          throw new Error(`Cannot fallback authenticationMode from API_AND_CONFIG_MAP to ${this.newProps.accessConfig?.authenticationMode}`);
        }
        // cannot fallback from defined to undefined
        if (this.oldProps.accessConfig?.authenticationMode !== undefined &&
          this.newProps.accessConfig?.authenticationMode === undefined) {
          throw new Error('Cannot fallback authenticationMode from defined to undefined');
        }
        // cannot update from undefined to API because undefined defaults CONFIG_MAP which
        // can only change to API_AND_CONFIG_MAP
        if (this.oldProps.accessConfig?.authenticationMode === undefined &&
          this.newProps.accessConfig?.authenticationMode === 'API') {
          throw new Error('Cannot update from undefined(CONFIG_MAP) to API');
        }
        // cannot update from CONFIG_MAP to API
        if (this.oldProps.accessConfig?.authenticationMode === 'CONFIG_MAP' &&
          this.newProps.accessConfig?.authenticationMode === 'API') {
          throw new Error('Cannot update from CONFIG_MAP to API');
        }
        // update-authmode will fail if we try to update to the same mode,
        // so skip in this case.
        try {
          const cluster = (await this.eks.describeCluster({ name: this.clusterName })).cluster;
          if (cluster?.accessConfig?.authenticationMode === this.newProps.accessConfig?.authenticationMode) {
            console.log(`cluster already at ${cluster?.accessConfig?.authenticationMode}, skipping authMode update`);
            return;
          }
        } catch (e: any) {
          throw e;
        }
        config.accessConfig = this.newProps.accessConfig;
      };

      if (updates.updateVpc) {
        config.resourcesVpcConfig = {
          subnetIds: this.newProps.resourcesVpcConfig?.subnetIds,
          securityGroupIds: this.newProps.resourcesVpcConfig?.securityGroupIds,
        };
      }

      const updateResponse = await this.eks.updateClusterConfig(config);

      return { EksUpdateId: updateResponse.update?.id };
    }

    // no updates
    return;
  }

  protected async isUpdateComplete() {
    console.log('isUpdateComplete');

    // if this is an EKS update, we will monitor the update event itself
    if (this.event.EksUpdateId) {
      const complete = await this.isEksUpdateComplete(this.event.EksUpdateId);
      if (!complete) {
        return { IsComplete: false };
      }

      // fall through: if the update is done, we simply delegate to isActive()
      // in order to extract attributes and state from the cluster itself, which
      // is supposed to be in an ACTIVE state after the update is complete.
    }

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

    const updateResponse = await this.eks.updateClusterVersion({ name: this.clusterName, version: newVersion });
    return { EksUpdateId: updateResponse.update?.id };
  }

  private async isActive(): Promise<IsCompleteResponse> {
    console.log('waiting for cluster to become ACTIVE');
    const resp = await this.eks.describeCluster({ name: this.clusterName });
    console.log('describeCluster result:', JSON.stringify(resp, undefined, 2));
    const cluster = resp.cluster;

    // if cluster is undefined (shouldnt happen) or status is not ACTIVE, we are
    // not complete. note that the custom resource provider framework forbids
    // returning attributes (Data) if isComplete is false.
    if (cluster?.status === 'FAILED') {
      // not very informative, unfortunately the response doesn't contain any error
      // information :\
      throw new Error('Cluster is in a FAILED status');
    } else if (cluster?.status !== 'ACTIVE') {
      return {
        IsComplete: false,
      };
    } else {
      return {
        IsComplete: true,
        Data: {
          Name: cluster.name,
          Endpoint: cluster.endpoint,
          Arn: cluster.arn,

          // IMPORTANT: CFN expects that attributes will *always* have values,
          // so return an empty string in case the value is not defined.
          // Otherwise, CFN will throw with `Vendor response doesn't contain
          // XXXX key`.

          CertificateAuthorityData: cluster.certificateAuthority?.data ?? '',
          ClusterSecurityGroupId: cluster.resourcesVpcConfig?.clusterSecurityGroupId ?? '',
          OpenIdConnectIssuerUrl: cluster.identity?.oidc?.issuer ?? '',
          OpenIdConnectIssuer: cluster.identity?.oidc?.issuer?.substring(8) ?? '', // Strips off https:// from the issuer url

          // We can safely return the first item from encryption configuration array, because it has a limit of 1 item
          // https://docs.amazon.com/eks/latest/APIReference/API_CreateCluster.html#AmazonEKS-CreateCluster-request-encryptionConfig
          EncryptionConfigKeyArn: cluster.encryptionConfig?.shift()?.provider?.keyArn ?? '',
        },
      };
    }
  }

  private async isEksUpdateComplete(eksUpdateId: string) {
    this.log({ isEksUpdateComplete: eksUpdateId });

    const describeUpdateResponse = await this.eks.describeUpdate({
      name: this.clusterName,
      updateId: eksUpdateId,
    });

    this.log({ describeUpdateResponse });

    if (!describeUpdateResponse.update) {
      throw new Error(`unable to describe update with id "${eksUpdateId}"`);
    }

    switch (describeUpdateResponse.update.status) {
      case 'InProgress':
        return false;
      case 'Successful':
        return true;
      case 'Failed':
      case 'Cancelled':
        throw new Error(`cluster update id "${eksUpdateId}" failed with errors: ${JSON.stringify(describeUpdateResponse.update.errors)}`);
      default:
        throw new Error(`unknown status "${describeUpdateResponse.update.status}" for update id "${eksUpdateId}"`);
    }
  }

  private generateClusterName() {
    const suffix = this.requestId.replace(/-/g, ''); // 32 chars
    const offset = MAX_CLUSTER_NAME_LEN - suffix.length - 1;
    const prefix = this.logicalResourceId.slice(0, offset > 0 ? offset : 0);
    return `${prefix}-${suffix}`;
  }
}

function parseProps(props: any): EKS.CreateClusterCommandInput {

  const parsed = props?.Config ?? {};

  // this is weird but these boolean properties are passed by CFN as a string, and we need them to be booleanic for the SDK.
  // Otherwise it fails with 'Unexpected Parameter: params.resourcesVpcConfig.endpointPrivateAccess is expected to be a boolean'

  if (typeof (parsed.resourcesVpcConfig?.endpointPrivateAccess) === 'string') {
    parsed.resourcesVpcConfig.endpointPrivateAccess = parsed.resourcesVpcConfig.endpointPrivateAccess === 'true';
  }

  if (typeof (parsed.resourcesVpcConfig?.endpointPublicAccess) === 'string') {
    parsed.resourcesVpcConfig.endpointPublicAccess = parsed.resourcesVpcConfig.endpointPublicAccess === 'true';
  }

  if (typeof (parsed.logging?.clusterLogging[0].enabled) === 'string') {
    parsed.logging.clusterLogging[0].enabled = parsed.logging.clusterLogging[0].enabled === 'true';
  }

  return parsed;

}

interface UpdateMap {
  replaceName: boolean; // name
  replaceRole: boolean; // roleArn

  updateVersion: boolean; // version
  updateLogging: boolean; // logging
  updateEncryption: boolean; // encryption (cannot be updated)
  updateAccess: boolean; // resourcesVpcConfig.endpointPrivateAccess and endpointPublicAccess
  updateAuthMode: boolean; // accessConfig.authenticationMode
  updateBootstrapClusterCreatorAdminPermissions: boolean; // accessConfig.bootstrapClusterCreatorAdminPermissions
  updateVpc: boolean; // resourcesVpcConfig.subnetIds and securityGroupIds
  updateTags: boolean; // tags
}

function analyzeUpdate(oldProps: Partial<EKS.CreateClusterCommandInput>, newProps: EKS.CreateClusterCommandInput): UpdateMap {
  console.log('old props: ', JSON.stringify(oldProps));
  console.log('new props: ', JSON.stringify(newProps));

  const newVpcProps = newProps.resourcesVpcConfig || {};
  const oldVpcProps = oldProps.resourcesVpcConfig || {};

  const oldPublicAccessCidrs = new Set(oldVpcProps.publicAccessCidrs ?? []);
  const newPublicAccessCidrs = new Set(newVpcProps.publicAccessCidrs ?? []);
  const newEnc = newProps.encryptionConfig || {};
  const oldEnc = oldProps.encryptionConfig || {};
  const newAccessConfig = newProps.accessConfig || {};
  const oldAccessConfig = oldProps.accessConfig || {};

  return {
    replaceName: newProps.name !== oldProps.name,
    updateVpc:
      JSON.stringify(newVpcProps.subnetIds?.sort()) !== JSON.stringify(oldVpcProps.subnetIds?.sort()) ||
      JSON.stringify(newVpcProps.securityGroupIds?.sort()) !== JSON.stringify(oldVpcProps.securityGroupIds?.sort()),
    updateAccess:
      newVpcProps.endpointPrivateAccess !== oldVpcProps.endpointPrivateAccess ||
      newVpcProps.endpointPublicAccess !== oldVpcProps.endpointPublicAccess ||
      !setsEqual(newPublicAccessCidrs, oldPublicAccessCidrs),
    replaceRole: newProps.roleArn !== oldProps.roleArn,
    updateVersion: newProps.version !== oldProps.version,
    updateEncryption: JSON.stringify(newEnc) !== JSON.stringify(oldEnc),
    updateLogging: JSON.stringify(newProps.logging) !== JSON.stringify(oldProps.logging),
    updateAuthMode: JSON.stringify(newAccessConfig.authenticationMode) !== JSON.stringify(oldAccessConfig.authenticationMode),
    updateBootstrapClusterCreatorAdminPermissions: JSON.stringify(newAccessConfig.bootstrapClusterCreatorAdminPermissions) !==
      JSON.stringify(oldAccessConfig.bootstrapClusterCreatorAdminPermissions),
    updateTags: JSON.stringify(newProps.tags) !== JSON.stringify(oldProps.tags),
  };
}

function setsEqual(first: Set<string>, second: Set<string>) {
  return first.size === second.size && [...first].every((e: string) => second.has(e));
}

function getTagsToUpdate<T extends Record<string, string>>(oldTags: T, newTags: T): T {
  const diff: T = {} as T;
  // Get all tag keys that are newly added and keys whose value have changed
  for (const key in newTags) {
    if (newTags.hasOwnProperty(key)) {
      if (!oldTags.hasOwnProperty(key)) {
        diff[key] = newTags[key];
      } else if (oldTags[key] !== newTags[key]) {
        diff[key] = newTags[key];
      }
    }
  }

  return diff;
}

function getTagsToRemove<T extends Record<string, string>>(oldTags: T, newTags: T): string[] {
  const missingKeys: string[] = [];
  //Get all tag keys to remove
  for (const key in oldTags) {
    if (oldTags.hasOwnProperty(key) && !newTags.hasOwnProperty(key)) {
      missingKeys.push(key);
    }
  }

  return missingKeys;
}
