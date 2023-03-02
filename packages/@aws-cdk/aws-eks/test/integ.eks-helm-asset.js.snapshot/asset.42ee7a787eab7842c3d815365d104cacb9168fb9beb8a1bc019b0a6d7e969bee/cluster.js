"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterResourceHandler = void 0;
const common_1 = require("./common");
const MAX_CLUSTER_NAME_LEN = 100;
class ClusterResourceHandler extends common_1.ResourceHandler {
    constructor(eks, event) {
        super(eks, event);
        this.newProps = parseProps(this.event.ResourceProperties);
        this.oldProps = event.RequestType === 'Update' ? parseProps(event.OldResourceProperties) : {};
    }
    get clusterName() {
        if (!this.physicalResourceId) {
            throw new Error('Cannot determine cluster name without physical resource ID');
        }
        return this.physicalResourceId;
    }
    // ------
    // CREATE
    // ------
    async onCreate() {
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
    async isCreateComplete() {
        return this.isActive();
    }
    // ------
    // DELETE
    // ------
    async onDelete() {
        console.log(`onDelete: deleting cluster ${this.clusterName}`);
        try {
            await this.eks.deleteCluster({ name: this.clusterName });
        }
        catch (e) {
            if (e.code !== 'ResourceNotFoundException') {
                throw e;
            }
            else {
                console.log(`cluster ${this.clusterName} not found, idempotently succeeded`);
            }
        }
        return {
            PhysicalResourceId: this.clusterName,
        };
    }
    async isDeleteComplete() {
        console.log(`isDeleteComplete: waiting for cluster ${this.clusterName} to be deleted`);
        try {
            const resp = await this.eks.describeCluster({ name: this.clusterName });
            console.log('describeCluster returned:', JSON.stringify(resp, undefined, 2));
        }
        catch (e) {
            if (e.code === 'ResourceNotFoundException') {
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
    async onUpdate() {
        const updates = analyzeUpdate(this.oldProps, this.newProps);
        console.log('onUpdate:', JSON.stringify({ updates }, undefined, 2));
        // updates to encryption config is not supported
        if (updates.updateEncryption) {
            throw new Error('Cannot update cluster encryption configuration');
        }
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
            return this.onCreate();
        }
        // if a version update is required, issue the version update
        if (updates.updateVersion) {
            if (!this.newProps.version) {
                throw new Error(`Cannot remove cluster version configuration. Current version is ${this.oldProps.version}`);
            }
            return this.updateClusterVersion(this.newProps.version);
        }
        if (updates.updateLogging && updates.updateAccess) {
            throw new Error('Cannot update logging and access at the same time');
        }
        if (updates.updateLogging || updates.updateAccess) {
            const config = {
                name: this.clusterName,
            };
            if (updates.updateLogging) {
                config.logging = this.newProps.logging;
            }
            ;
            if (updates.updateAccess) {
                // Updating the cluster with securityGroupIds and subnetIds (as specified in the warning here:
                // https://awscli.amazonaws.com/v2/documentation/api/latest/reference/eks/update-cluster-config.html)
                // will fail, therefore we take only the access fields explicitly
                config.resourcesVpcConfig = {
                    endpointPrivateAccess: this.newProps.resourcesVpcConfig.endpointPrivateAccess,
                    endpointPublicAccess: this.newProps.resourcesVpcConfig.endpointPublicAccess,
                    publicAccessCidrs: this.newProps.resourcesVpcConfig.publicAccessCidrs,
                };
            }
            const updateResponse = await this.eks.updateClusterConfig(config);
            return { EksUpdateId: updateResponse.update?.id };
        }
        // no updates
        return;
    }
    async isUpdateComplete() {
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
    async updateClusterVersion(newVersion) {
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
    async isActive() {
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
        }
        else if (cluster?.status !== 'ACTIVE') {
            return {
                IsComplete: false,
            };
        }
        else {
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
                    OpenIdConnectIssuer: cluster.identity?.oidc?.issuer?.substring(8) ?? '',
                    // We can safely return the first item from encryption configuration array, because it has a limit of 1 item
                    // https://docs.aws.amazon.com/eks/latest/APIReference/API_CreateCluster.html#AmazonEKS-CreateCluster-request-encryptionConfig
                    EncryptionConfigKeyArn: cluster.encryptionConfig?.shift()?.provider?.keyArn ?? '',
                },
            };
        }
    }
    async isEksUpdateComplete(eksUpdateId) {
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
    generateClusterName() {
        const suffix = this.requestId.replace(/-/g, ''); // 32 chars
        const offset = MAX_CLUSTER_NAME_LEN - suffix.length - 1;
        const prefix = this.logicalResourceId.slice(0, offset > 0 ? offset : 0);
        return `${prefix}-${suffix}`;
    }
}
exports.ClusterResourceHandler = ClusterResourceHandler;
function parseProps(props) {
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
function analyzeUpdate(oldProps, newProps) {
    console.log('old props: ', JSON.stringify(oldProps));
    console.log('new props: ', JSON.stringify(newProps));
    const newVpcProps = newProps.resourcesVpcConfig || {};
    const oldVpcProps = oldProps.resourcesVpcConfig || {};
    const oldPublicAccessCidrs = new Set(oldVpcProps.publicAccessCidrs ?? []);
    const newPublicAccessCidrs = new Set(newVpcProps.publicAccessCidrs ?? []);
    const newEnc = newProps.encryptionConfig || {};
    const oldEnc = oldProps.encryptionConfig || {};
    return {
        replaceName: newProps.name !== oldProps.name,
        replaceVpc: JSON.stringify(newVpcProps.subnetIds?.sort()) !== JSON.stringify(oldVpcProps.subnetIds?.sort()) ||
            JSON.stringify(newVpcProps.securityGroupIds?.sort()) !== JSON.stringify(oldVpcProps.securityGroupIds?.sort()),
        updateAccess: newVpcProps.endpointPrivateAccess !== oldVpcProps.endpointPrivateAccess ||
            newVpcProps.endpointPublicAccess !== oldVpcProps.endpointPublicAccess ||
            !setsEqual(newPublicAccessCidrs, oldPublicAccessCidrs),
        replaceRole: newProps.roleArn !== oldProps.roleArn,
        updateVersion: newProps.version !== oldProps.version,
        updateEncryption: JSON.stringify(newEnc) !== JSON.stringify(oldEnc),
        updateLogging: JSON.stringify(newProps.logging) !== JSON.stringify(oldProps.logging),
    };
}
function setsEqual(first, second) {
    return first.size === second.size && [...first].every((e) => second.has(e));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtCQUErQjs7O0FBTS9CLHFDQUFxRTtBQUVyRSxNQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQUVqQyxNQUFhLHNCQUF1QixTQUFRLHdCQUFlO0lBWXpELFlBQVksR0FBYyxFQUFFLEtBQW9CO1FBQzlDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQy9GO0lBaEJELElBQVcsV0FBVztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztTQUMvRTtRQUVELE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0tBQ2hDO0lBWUQsU0FBUztJQUNULFNBQVM7SUFDVCxTQUFTO0lBRUMsS0FBSyxDQUFDLFFBQVE7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUMxQztRQUVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRXJFLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7WUFDeEMsR0FBRyxJQUFJLENBQUMsUUFBUTtZQUNoQixJQUFJLEVBQUUsV0FBVztTQUNsQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxXQUFXLHNEQUFzRCxDQUFDLENBQUM7U0FDM0g7UUFFRCxPQUFPO1lBQ0wsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1NBQ3RDLENBQUM7S0FDSDtJQUVTLEtBQUssQ0FBQyxnQkFBZ0I7UUFDOUIsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDeEI7SUFFRCxTQUFTO0lBQ1QsU0FBUztJQUNULFNBQVM7SUFFQyxLQUFLLENBQUMsUUFBUTtRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUM5RCxJQUFJO1lBQ0YsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUMxRDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLDJCQUEyQixFQUFFO2dCQUMxQyxNQUFNLENBQUMsQ0FBQzthQUNUO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUFJLENBQUMsV0FBVyxvQ0FBb0MsQ0FBQyxDQUFDO2FBQzlFO1NBQ0Y7UUFDRCxPQUFPO1lBQ0wsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFdBQVc7U0FDckMsQ0FBQztLQUNIO0lBRVMsS0FBSyxDQUFDLGdCQUFnQjtRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxJQUFJLENBQUMsV0FBVyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXZGLElBQUk7WUFDRixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDOUU7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSywyQkFBMkIsRUFBRTtnQkFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnR0FBZ0csQ0FBQyxDQUFDO2dCQUM5RyxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQzdCO1lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsQ0FBQztTQUNUO1FBRUQsT0FBTztZQUNMLFVBQVUsRUFBRSxLQUFLO1NBQ2xCLENBQUM7S0FDSDtJQUVELFNBQVM7SUFDVCxTQUFTO0lBQ1QsU0FBUztJQUVDLEtBQUssQ0FBQyxRQUFRO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEUsZ0RBQWdEO1FBQ2hELElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztTQUNuRTtRQUVELDRFQUE0RTtRQUM1RSwyRUFBMkU7UUFDM0UsMENBQTBDO1FBQzFDLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFFcEUsbUVBQW1FO1lBQ25FLDBFQUEwRTtZQUMxRSxtRUFBbUU7WUFDbkUsb0VBQW9FO1lBQ3BFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25FLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSx3R0FBd0csQ0FBQyxDQUFDO2FBQ3hLO1lBRUQsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDeEI7UUFFRCw0REFBNEQ7UUFDNUQsSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRUFBbUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQzdHO1lBRUQsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksT0FBTyxDQUFDLGFBQWEsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ2pELE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUN0RTtRQUVELElBQUksT0FBTyxDQUFDLGFBQWEsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ2pELE1BQU0sTUFBTSxHQUF1QztnQkFDakQsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXO2FBQ3ZCLENBQUM7WUFDRixJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7Z0JBQ3pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFDeEM7WUFBQSxDQUFDO1lBQ0YsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO2dCQUN4Qiw4RkFBOEY7Z0JBQzlGLHFHQUFxRztnQkFDckcsaUVBQWlFO2dCQUNqRSxNQUFNLENBQUMsa0JBQWtCLEdBQUc7b0JBQzFCLHFCQUFxQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMscUJBQXFCO29CQUM3RSxvQkFBb0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQjtvQkFDM0UsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUI7aUJBQ3RFLENBQUM7YUFDSDtZQUNELE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVsRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUM7U0FDbkQ7UUFFRCxhQUFhO1FBQ2IsT0FBTztLQUNSO0lBRVMsS0FBSyxDQUFDLGdCQUFnQjtRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFaEMsb0VBQW9FO1FBQ3BFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDMUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNiLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUM7YUFDOUI7WUFFRCx3RUFBd0U7WUFDeEUsMEVBQTBFO1lBQzFFLHFFQUFxRTtTQUN0RTtRQUVELE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3hCO0lBRU8sS0FBSyxDQUFDLG9CQUFvQixDQUFDLFVBQWtCO1FBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFekQsNEVBQTRFO1FBQzVFLHdCQUF3QjtRQUN4QixNQUFNLE9BQU8sR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDckYsSUFBSSxPQUFPLEVBQUUsT0FBTyxLQUFLLFVBQVUsRUFBRTtZQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixPQUFPLENBQUMsT0FBTywyQkFBMkIsQ0FBQyxDQUFDO1lBQ3RGLE9BQU87U0FDUjtRQUVELE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQzVHLE9BQU8sRUFBRSxXQUFXLEVBQUUsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQztLQUNuRDtJQUVPLEtBQUssQ0FBQyxRQUFRO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNwRCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUU3Qiw0RUFBNEU7UUFDNUUseUVBQXlFO1FBQ3pFLHNEQUFzRDtRQUN0RCxJQUFJLE9BQU8sRUFBRSxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ2hDLDZFQUE2RTtZQUM3RSxpQkFBaUI7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1NBQ2xEO2FBQU0sSUFBSSxPQUFPLEVBQUUsTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUN2QyxPQUFPO2dCQUNMLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUM7U0FDSDthQUFNO1lBQ0wsT0FBTztnQkFDTCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtvQkFDbEIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO29CQUMxQixHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUc7b0JBRWhCLG9FQUFvRTtvQkFDcEUsOERBQThEO29CQUM5RCxrRUFBa0U7b0JBQ2xFLGFBQWE7b0JBRWIsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLG9CQUFvQixFQUFFLElBQUksSUFBSSxFQUFFO29CQUNsRSxzQkFBc0IsRUFBRSxPQUFPLENBQUMsa0JBQWtCLEVBQUUsc0JBQXNCLElBQUksRUFBRTtvQkFDaEYsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxJQUFJLEVBQUU7b0JBQzVELG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtvQkFFdkUsNEdBQTRHO29CQUM1Ryw4SEFBOEg7b0JBQzlILHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxJQUFJLEVBQUU7aUJBQ2xGO2FBQ0YsQ0FBQztTQUNIO0tBQ0Y7SUFFTyxLQUFLLENBQUMsbUJBQW1CLENBQUMsV0FBbUI7UUFDbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFFL0MsTUFBTSxzQkFBc0IsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO1lBQzNELElBQUksRUFBRSxJQUFJLENBQUMsV0FBVztZQUN0QixRQUFRLEVBQUUsV0FBVztTQUN0QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEVBQUU7WUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsV0FBVyxHQUFHLENBQUMsQ0FBQztTQUN2RTtRQUVELFFBQVEsc0JBQXNCLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUM1QyxLQUFLLFlBQVk7Z0JBQ2YsT0FBTyxLQUFLLENBQUM7WUFDZixLQUFLLFlBQVk7Z0JBQ2YsT0FBTyxJQUFJLENBQUM7WUFDZCxLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssV0FBVztnQkFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixXQUFXLHlCQUF5QixJQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEk7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsc0JBQXNCLENBQUMsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLFdBQVcsR0FBRyxDQUFDLENBQUM7U0FDOUc7S0FDRjtJQUVPLG1CQUFtQjtRQUN6QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXO1FBQzVELE1BQU0sTUFBTSxHQUFHLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsT0FBTyxHQUFHLE1BQU0sSUFBSSxNQUFNLEVBQUUsQ0FBQztLQUM5QjtDQUNGO0FBM1FELHdEQTJRQztBQUVELFNBQVMsVUFBVSxDQUFDLEtBQVU7SUFFNUIsTUFBTSxNQUFNLEdBQUcsS0FBSyxFQUFFLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFFbkMsMEhBQTBIO0lBQzFILDhIQUE4SDtJQUU5SCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUscUJBQXFCLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDMUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsS0FBSyxNQUFNLENBQUM7S0FDOUc7SUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsb0JBQW9CLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDekUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxNQUFNLENBQUM7S0FDNUc7SUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDbkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUM7S0FDaEc7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUVoQixDQUFDO0FBYUQsU0FBUyxhQUFhLENBQUMsUUFBK0MsRUFBRSxRQUFzQztJQUM1RyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRXJELE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxrQkFBa0IsSUFBSSxFQUFFLENBQUM7SUFDdEQsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztJQUV0RCxNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMxRSxNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMxRSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsZ0JBQWdCLElBQUksRUFBRSxDQUFDO0lBQy9DLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUM7SUFFL0MsT0FBTztRQUNMLFdBQVcsRUFBRSxRQUFRLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxJQUFJO1FBQzVDLFVBQVUsRUFDUixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDL0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUMvRyxZQUFZLEVBQ1YsV0FBVyxDQUFDLHFCQUFxQixLQUFLLFdBQVcsQ0FBQyxxQkFBcUI7WUFDdkUsV0FBVyxDQUFDLG9CQUFvQixLQUFLLFdBQVcsQ0FBQyxvQkFBb0I7WUFDckUsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEVBQUUsb0JBQW9CLENBQUM7UUFDeEQsV0FBVyxFQUFFLFFBQVEsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLE9BQU87UUFDbEQsYUFBYSxFQUFFLFFBQVEsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLE9BQU87UUFDcEQsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNuRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0tBQ3JGLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsS0FBa0IsRUFBRSxNQUFtQjtJQUN4RCxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVzcG9uc2UgfSBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzL2xpYi9wcm92aWRlci1mcmFtZXdvcmsvdHlwZXMnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgYXdzIGZyb20gJ2F3cy1zZGsnO1xuaW1wb3J0IHsgRWtzQ2xpZW50LCBSZXNvdXJjZUV2ZW50LCBSZXNvdXJjZUhhbmRsZXIgfSBmcm9tICcuL2NvbW1vbic7XG5cbmNvbnN0IE1BWF9DTFVTVEVSX05BTUVfTEVOID0gMTAwO1xuXG5leHBvcnQgY2xhc3MgQ2x1c3RlclJlc291cmNlSGFuZGxlciBleHRlbmRzIFJlc291cmNlSGFuZGxlciB7XG4gIHB1YmxpYyBnZXQgY2x1c3Rlck5hbWUoKSB7XG4gICAgaWYgKCF0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGV0ZXJtaW5lIGNsdXN0ZXIgbmFtZSB3aXRob3V0IHBoeXNpY2FsIHJlc291cmNlIElEJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGh5c2ljYWxSZXNvdXJjZUlkO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBuZXdQcm9wczogYXdzLkVLUy5DcmVhdGVDbHVzdGVyUmVxdWVzdDtcbiAgcHJpdmF0ZSByZWFkb25seSBvbGRQcm9wczogUGFydGlhbDxhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0PjtcblxuICBjb25zdHJ1Y3Rvcihla3M6IEVrc0NsaWVudCwgZXZlbnQ6IFJlc291cmNlRXZlbnQpIHtcbiAgICBzdXBlcihla3MsIGV2ZW50KTtcblxuICAgIHRoaXMubmV3UHJvcHMgPSBwYXJzZVByb3BzKHRoaXMuZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICB0aGlzLm9sZFByb3BzID0gZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdVcGRhdGUnID8gcGFyc2VQcm9wcyhldmVudC5PbGRSZXNvdXJjZVByb3BlcnRpZXMpIDoge307XG4gIH1cblxuICAvLyAtLS0tLS1cbiAgLy8gQ1JFQVRFXG4gIC8vIC0tLS0tLVxuXG4gIHByb3RlY3RlZCBhc3luYyBvbkNyZWF0ZSgpOiBQcm9taXNlPE9uRXZlbnRSZXNwb25zZT4ge1xuICAgIGNvbnNvbGUubG9nKCdvbkNyZWF0ZTogY3JlYXRpbmcgY2x1c3RlciB3aXRoIG9wdGlvbnM6JywgSlNPTi5zdHJpbmdpZnkodGhpcy5uZXdQcm9wcywgdW5kZWZpbmVkLCAyKSk7XG4gICAgaWYgKCF0aGlzLm5ld1Byb3BzLnJvbGVBcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJyb2xlQXJuXCIgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjbHVzdGVyTmFtZSA9IHRoaXMubmV3UHJvcHMubmFtZSB8fCB0aGlzLmdlbmVyYXRlQ2x1c3Rlck5hbWUoKTtcblxuICAgIGNvbnN0IHJlc3AgPSBhd2FpdCB0aGlzLmVrcy5jcmVhdGVDbHVzdGVyKHtcbiAgICAgIC4uLnRoaXMubmV3UHJvcHMsXG4gICAgICBuYW1lOiBjbHVzdGVyTmFtZSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcC5jbHVzdGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHdoZW4gdHJ5aW5nIHRvIGNyZWF0ZSBjbHVzdGVyICR7Y2x1c3Rlck5hbWV9OiBDcmVhdGVDbHVzdGVyIHJldHVybmVkIHdpdGhvdXQgY2x1c3RlciBpbmZvcm1hdGlvbmApO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHJlc3AuY2x1c3Rlci5uYW1lLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNDcmVhdGVDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSgpO1xuICB9XG5cbiAgLy8gLS0tLS0tXG4gIC8vIERFTEVURVxuICAvLyAtLS0tLS1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25EZWxldGUoKTogUHJvbWlzZTxPbkV2ZW50UmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZyhgb25EZWxldGU6IGRlbGV0aW5nIGNsdXN0ZXIgJHt0aGlzLmNsdXN0ZXJOYW1lfWApO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmVrcy5kZWxldGVDbHVzdGVyKHsgbmFtZTogdGhpcy5jbHVzdGVyTmFtZSB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5jb2RlICE9PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBjbHVzdGVyICR7dGhpcy5jbHVzdGVyTmFtZX0gbm90IGZvdW5kLCBpZGVtcG90ZW50bHkgc3VjY2VlZGVkYCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHRoaXMuY2x1c3Rlck5hbWUsXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc0RlbGV0ZUNvbXBsZXRlKCk6IFByb21pc2U8SXNDb21wbGV0ZVJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5sb2coYGlzRGVsZXRlQ29tcGxldGU6IHdhaXRpbmcgZm9yIGNsdXN0ZXIgJHt0aGlzLmNsdXN0ZXJOYW1lfSB0byBiZSBkZWxldGVkYCk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgICBjb25zb2xlLmxvZygnZGVzY3JpYmVDbHVzdGVyIHJldHVybmVkOicsIEpTT04uc3RyaW5naWZ5KHJlc3AsIHVuZGVmaW5lZCwgMikpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLmNvZGUgPT09ICdSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uJykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVjZWl2ZWQgUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbiwgdGhpcyBtZWFucyB0aGUgY2x1c3RlciBoYXMgYmVlbiBkZWxldGVkIChvciBuZXZlciBleGlzdGVkKScpO1xuICAgICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiB0cnVlIH07XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCdkZXNjcmliZUNsdXN0ZXIgZXJyb3I6JywgZSk7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBJc0NvbXBsZXRlOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgLy8gLS0tLS0tXG4gIC8vIFVQREFURVxuICAvLyAtLS0tLS1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25VcGRhdGUoKSB7XG4gICAgY29uc3QgdXBkYXRlcyA9IGFuYWx5emVVcGRhdGUodGhpcy5vbGRQcm9wcywgdGhpcy5uZXdQcm9wcyk7XG4gICAgY29uc29sZS5sb2coJ29uVXBkYXRlOicsIEpTT04uc3RyaW5naWZ5KHsgdXBkYXRlcyB9LCB1bmRlZmluZWQsIDIpKTtcblxuICAgIC8vIHVwZGF0ZXMgdG8gZW5jcnlwdGlvbiBjb25maWcgaXMgbm90IHN1cHBvcnRlZFxuICAgIGlmICh1cGRhdGVzLnVwZGF0ZUVuY3J5cHRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVwZGF0ZSBjbHVzdGVyIGVuY3J5cHRpb24gY29uZmlndXJhdGlvbicpO1xuICAgIH1cblxuICAgIC8vIGlmIHRoZXJlIGlzIGFuIHVwZGF0ZSB0aGF0IHJlcXVpcmVzIHJlcGxhY2VtZW50LCBnbyBhaGVhZCBhbmQganVzdCBjcmVhdGVcbiAgICAvLyBhIG5ldyBjbHVzdGVyIHdpdGggdGhlIG5ldyBjb25maWcuIFRoZSBvbGQgY2x1c3RlciB3aWxsIGF1dG9tYXRpY2FsbHkgYmVcbiAgICAvLyBkZWxldGVkIGJ5IGNsb3VkZm9ybWF0aW9uIHVwb24gc3VjY2Vzcy5cbiAgICBpZiAodXBkYXRlcy5yZXBsYWNlTmFtZSB8fCB1cGRhdGVzLnJlcGxhY2VSb2xlIHx8IHVwZGF0ZXMucmVwbGFjZVZwYykge1xuXG4gICAgICAvLyBpZiB3ZSBhcmUgcmVwbGFjaW5nIHRoaXMgY2x1c3RlciBhbmQgdGhlIGNsdXN0ZXIgaGFzIGFuIGV4cGxpY2l0XG4gICAgICAvLyBwaHlzaWNhbCBuYW1lLCB0aGUgY3JlYXRpb24gb2YgdGhlIG5ldyBjbHVzdGVyIHdpbGwgZmFpbCB3aXRoIFwidGhlcmUgaXNcbiAgICAgIC8vIGFscmVhZHkgYSBjbHVzdGVyIHdpdGggdGhhdCBuYW1lXCIuIHRoaXMgaXMgYSBjb21tb24gYmVoYXZpb3IgZm9yXG4gICAgICAvLyBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHNwZWNpZnlpbmcgYSBwaHlzaWNhbCBuYW1lLlxuICAgICAgaWYgKHRoaXMub2xkUHJvcHMubmFtZSA9PT0gdGhpcy5uZXdQcm9wcy5uYW1lICYmIHRoaXMub2xkUHJvcHMubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZXBsYWNlIGNsdXN0ZXIgXCIke3RoaXMub2xkUHJvcHMubmFtZX1cIiBzaW5jZSBpdCBoYXMgYW4gZXhwbGljaXQgcGh5c2ljYWwgbmFtZS4gRWl0aGVyIHJlbmFtZSB0aGUgY2x1c3RlciBvciByZW1vdmUgdGhlIFwibmFtZVwiIGNvbmZpZ3VyYXRpb25gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub25DcmVhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBpZiBhIHZlcnNpb24gdXBkYXRlIGlzIHJlcXVpcmVkLCBpc3N1ZSB0aGUgdmVyc2lvbiB1cGRhdGVcbiAgICBpZiAodXBkYXRlcy51cGRhdGVWZXJzaW9uKSB7XG4gICAgICBpZiAoIXRoaXMubmV3UHJvcHMudmVyc2lvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZW1vdmUgY2x1c3RlciB2ZXJzaW9uIGNvbmZpZ3VyYXRpb24uIEN1cnJlbnQgdmVyc2lvbiBpcyAke3RoaXMub2xkUHJvcHMudmVyc2lvbn1gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlQ2x1c3RlclZlcnNpb24odGhpcy5uZXdQcm9wcy52ZXJzaW9uKTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlcy51cGRhdGVMb2dnaW5nICYmIHVwZGF0ZXMudXBkYXRlQWNjZXNzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1cGRhdGUgbG9nZ2luZyBhbmQgYWNjZXNzIGF0IHRoZSBzYW1lIHRpbWUnKTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlcy51cGRhdGVMb2dnaW5nIHx8IHVwZGF0ZXMudXBkYXRlQWNjZXNzKSB7XG4gICAgICBjb25zdCBjb25maWc6IGF3cy5FS1MuVXBkYXRlQ2x1c3RlckNvbmZpZ1JlcXVlc3QgPSB7XG4gICAgICAgIG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsXG4gICAgICB9O1xuICAgICAgaWYgKHVwZGF0ZXMudXBkYXRlTG9nZ2luZykge1xuICAgICAgICBjb25maWcubG9nZ2luZyA9IHRoaXMubmV3UHJvcHMubG9nZ2luZztcbiAgICAgIH07XG4gICAgICBpZiAodXBkYXRlcy51cGRhdGVBY2Nlc3MpIHtcbiAgICAgICAgLy8gVXBkYXRpbmcgdGhlIGNsdXN0ZXIgd2l0aCBzZWN1cml0eUdyb3VwSWRzIGFuZCBzdWJuZXRJZHMgKGFzIHNwZWNpZmllZCBpbiB0aGUgd2FybmluZyBoZXJlOlxuICAgICAgICAvLyBodHRwczovL2F3c2NsaS5hbWF6b25hd3MuY29tL3YyL2RvY3VtZW50YXRpb24vYXBpL2xhdGVzdC9yZWZlcmVuY2UvZWtzL3VwZGF0ZS1jbHVzdGVyLWNvbmZpZy5odG1sKVxuICAgICAgICAvLyB3aWxsIGZhaWwsIHRoZXJlZm9yZSB3ZSB0YWtlIG9ubHkgdGhlIGFjY2VzcyBmaWVsZHMgZXhwbGljaXRseVxuICAgICAgICBjb25maWcucmVzb3VyY2VzVnBjQ29uZmlnID0ge1xuICAgICAgICAgIGVuZHBvaW50UHJpdmF0ZUFjY2VzczogdGhpcy5uZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQcml2YXRlQWNjZXNzLFxuICAgICAgICAgIGVuZHBvaW50UHVibGljQWNjZXNzOiB0aGlzLm5ld1Byb3BzLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFB1YmxpY0FjY2VzcyxcbiAgICAgICAgICBwdWJsaWNBY2Nlc3NDaWRyczogdGhpcy5uZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcucHVibGljQWNjZXNzQ2lkcnMsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBjb25zdCB1cGRhdGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLnVwZGF0ZUNsdXN0ZXJDb25maWcoY29uZmlnKTtcblxuICAgICAgcmV0dXJuIHsgRWtzVXBkYXRlSWQ6IHVwZGF0ZVJlc3BvbnNlLnVwZGF0ZT8uaWQgfTtcbiAgICB9XG5cbiAgICAvLyBubyB1cGRhdGVzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzVXBkYXRlQ29tcGxldGUoKSB7XG4gICAgY29uc29sZS5sb2coJ2lzVXBkYXRlQ29tcGxldGUnKTtcblxuICAgIC8vIGlmIHRoaXMgaXMgYW4gRUtTIHVwZGF0ZSwgd2Ugd2lsbCBtb25pdG9yIHRoZSB1cGRhdGUgZXZlbnQgaXRzZWxmXG4gICAgaWYgKHRoaXMuZXZlbnQuRWtzVXBkYXRlSWQpIHtcbiAgICAgIGNvbnN0IGNvbXBsZXRlID0gYXdhaXQgdGhpcy5pc0Vrc1VwZGF0ZUNvbXBsZXRlKHRoaXMuZXZlbnQuRWtzVXBkYXRlSWQpO1xuICAgICAgaWYgKCFjb21wbGV0ZSkge1xuICAgICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiBmYWxzZSB9O1xuICAgICAgfVxuXG4gICAgICAvLyBmYWxsIHRocm91Z2g6IGlmIHRoZSB1cGRhdGUgaXMgZG9uZSwgd2Ugc2ltcGx5IGRlbGVnYXRlIHRvIGlzQWN0aXZlKClcbiAgICAgIC8vIGluIG9yZGVyIHRvIGV4dHJhY3QgYXR0cmlidXRlcyBhbmQgc3RhdGUgZnJvbSB0aGUgY2x1c3RlciBpdHNlbGYsIHdoaWNoXG4gICAgICAvLyBpcyBzdXBwb3NlZCB0byBiZSBpbiBhbiBBQ1RJVkUgc3RhdGUgYWZ0ZXIgdGhlIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVDbHVzdGVyVmVyc2lvbihuZXdWZXJzaW9uOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhgdXBkYXRpbmcgY2x1c3RlciB2ZXJzaW9uIHRvICR7bmV3VmVyc2lvbn1gKTtcblxuICAgIC8vIHVwZGF0ZS1jbHVzdGVyLXZlcnNpb24gd2lsbCBmYWlsIGlmIHdlIHRyeSB0byB1cGRhdGUgdG8gdGhlIHNhbWUgdmVyc2lvbixcbiAgICAvLyBzbyBza2lwIGluIHRoaXMgY2FzZS5cbiAgICBjb25zdCBjbHVzdGVyID0gKGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSkpLmNsdXN0ZXI7XG4gICAgaWYgKGNsdXN0ZXI/LnZlcnNpb24gPT09IG5ld1ZlcnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKGBjbHVzdGVyIGFscmVhZHkgYXQgdmVyc2lvbiAke2NsdXN0ZXIudmVyc2lvbn0sIHNraXBwaW5nIHZlcnNpb24gdXBkYXRlYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy51cGRhdGVDbHVzdGVyVmVyc2lvbih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsIHZlcnNpb246IG5ld1ZlcnNpb24gfSk7XG4gICAgcmV0dXJuIHsgRWtzVXBkYXRlSWQ6IHVwZGF0ZVJlc3BvbnNlLnVwZGF0ZT8uaWQgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaXNBY3RpdmUoKTogUHJvbWlzZTxJc0NvbXBsZXRlUmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZygnd2FpdGluZyBmb3IgY2x1c3RlciB0byBiZWNvbWUgQUNUSVZFJyk7XG4gICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgY29uc29sZS5sb2coJ2Rlc2NyaWJlQ2x1c3RlciByZXN1bHQ6JywgSlNPTi5zdHJpbmdpZnkocmVzcCwgdW5kZWZpbmVkLCAyKSk7XG4gICAgY29uc3QgY2x1c3RlciA9IHJlc3AuY2x1c3RlcjtcblxuICAgIC8vIGlmIGNsdXN0ZXIgaXMgdW5kZWZpbmVkIChzaG91bGRudCBoYXBwZW4pIG9yIHN0YXR1cyBpcyBub3QgQUNUSVZFLCB3ZSBhcmVcbiAgICAvLyBub3QgY29tcGxldGUuIG5vdGUgdGhhdCB0aGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyIGZyYW1ld29yayBmb3JiaWRzXG4gICAgLy8gcmV0dXJuaW5nIGF0dHJpYnV0ZXMgKERhdGEpIGlmIGlzQ29tcGxldGUgaXMgZmFsc2UuXG4gICAgaWYgKGNsdXN0ZXI/LnN0YXR1cyA9PT0gJ0ZBSUxFRCcpIHtcbiAgICAgIC8vIG5vdCB2ZXJ5IGluZm9ybWF0aXZlLCB1bmZvcnR1bmF0ZWx5IHRoZSByZXNwb25zZSBkb2Vzbid0IGNvbnRhaW4gYW55IGVycm9yXG4gICAgICAvLyBpbmZvcm1hdGlvbiA6XFxcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2x1c3RlciBpcyBpbiBhIEZBSUxFRCBzdGF0dXMnKTtcbiAgICB9IGVsc2UgaWYgKGNsdXN0ZXI/LnN0YXR1cyAhPT0gJ0FDVElWRScpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIElzQ29tcGxldGU6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgSXNDb21wbGV0ZTogdHJ1ZSxcbiAgICAgICAgRGF0YToge1xuICAgICAgICAgIE5hbWU6IGNsdXN0ZXIubmFtZSxcbiAgICAgICAgICBFbmRwb2ludDogY2x1c3Rlci5lbmRwb2ludCxcbiAgICAgICAgICBBcm46IGNsdXN0ZXIuYXJuLFxuXG4gICAgICAgICAgLy8gSU1QT1JUQU5UOiBDRk4gZXhwZWN0cyB0aGF0IGF0dHJpYnV0ZXMgd2lsbCAqYWx3YXlzKiBoYXZlIHZhbHVlcyxcbiAgICAgICAgICAvLyBzbyByZXR1cm4gYW4gZW1wdHkgc3RyaW5nIGluIGNhc2UgdGhlIHZhbHVlIGlzIG5vdCBkZWZpbmVkLlxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgQ0ZOIHdpbGwgdGhyb3cgd2l0aCBgVmVuZG9yIHJlc3BvbnNlIGRvZXNuJ3QgY29udGFpblxuICAgICAgICAgIC8vIFhYWFgga2V5YC5cblxuICAgICAgICAgIENlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogY2x1c3Rlci5jZXJ0aWZpY2F0ZUF1dGhvcml0eT8uZGF0YSA/PyAnJyxcbiAgICAgICAgICBDbHVzdGVyU2VjdXJpdHlHcm91cElkOiBjbHVzdGVyLnJlc291cmNlc1ZwY0NvbmZpZz8uY2x1c3RlclNlY3VyaXR5R3JvdXBJZCA/PyAnJyxcbiAgICAgICAgICBPcGVuSWRDb25uZWN0SXNzdWVyVXJsOiBjbHVzdGVyLmlkZW50aXR5Py5vaWRjPy5pc3N1ZXIgPz8gJycsXG4gICAgICAgICAgT3BlbklkQ29ubmVjdElzc3VlcjogY2x1c3Rlci5pZGVudGl0eT8ub2lkYz8uaXNzdWVyPy5zdWJzdHJpbmcoOCkgPz8gJycsIC8vIFN0cmlwcyBvZmYgaHR0cHM6Ly8gZnJvbSB0aGUgaXNzdWVyIHVybFxuXG4gICAgICAgICAgLy8gV2UgY2FuIHNhZmVseSByZXR1cm4gdGhlIGZpcnN0IGl0ZW0gZnJvbSBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24gYXJyYXksIGJlY2F1c2UgaXQgaGFzIGEgbGltaXQgb2YgMSBpdGVtXG4gICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9DcmVhdGVDbHVzdGVyLmh0bWwjQW1hem9uRUtTLUNyZWF0ZUNsdXN0ZXItcmVxdWVzdC1lbmNyeXB0aW9uQ29uZmlnXG4gICAgICAgICAgRW5jcnlwdGlvbkNvbmZpZ0tleUFybjogY2x1c3Rlci5lbmNyeXB0aW9uQ29uZmlnPy5zaGlmdCgpPy5wcm92aWRlcj8ua2V5QXJuID8/ICcnLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGlzRWtzVXBkYXRlQ29tcGxldGUoZWtzVXBkYXRlSWQ6IHN0cmluZykge1xuICAgIHRoaXMubG9nKHsgaXNFa3NVcGRhdGVDb21wbGV0ZTogZWtzVXBkYXRlSWQgfSk7XG5cbiAgICBjb25zdCBkZXNjcmliZVVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MuZGVzY3JpYmVVcGRhdGUoe1xuICAgICAgbmFtZTogdGhpcy5jbHVzdGVyTmFtZSxcbiAgICAgIHVwZGF0ZUlkOiBla3NVcGRhdGVJZCxcbiAgICB9KTtcblxuICAgIHRoaXMubG9nKHsgZGVzY3JpYmVVcGRhdGVSZXNwb25zZSB9KTtcblxuICAgIGlmICghZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5hYmxlIHRvIGRlc2NyaWJlIHVwZGF0ZSB3aXRoIGlkIFwiJHtla3NVcGRhdGVJZH1cImApO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUuc3RhdHVzKSB7XG4gICAgICBjYXNlICdJblByb2dyZXNzJzpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSAnU3VjY2Vzc2Z1bCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnRmFpbGVkJzpcbiAgICAgIGNhc2UgJ0NhbmNlbGxlZCc6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgY2x1c3RlciB1cGRhdGUgaWQgXCIke2Vrc1VwZGF0ZUlkfVwiIGZhaWxlZCB3aXRoIGVycm9yczogJHtKU09OLnN0cmluZ2lmeShkZXNjcmliZVVwZGF0ZVJlc3BvbnNlLnVwZGF0ZS5lcnJvcnMpfWApO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtub3duIHN0YXR1cyBcIiR7ZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUuc3RhdHVzfVwiIGZvciB1cGRhdGUgaWQgXCIke2Vrc1VwZGF0ZUlkfVwiYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUNsdXN0ZXJOYW1lKCkge1xuICAgIGNvbnN0IHN1ZmZpeCA9IHRoaXMucmVxdWVzdElkLnJlcGxhY2UoLy0vZywgJycpOyAvLyAzMiBjaGFyc1xuICAgIGNvbnN0IG9mZnNldCA9IE1BWF9DTFVTVEVSX05BTUVfTEVOIC0gc3VmZml4Lmxlbmd0aCAtIDE7XG4gICAgY29uc3QgcHJlZml4ID0gdGhpcy5sb2dpY2FsUmVzb3VyY2VJZC5zbGljZSgwLCBvZmZzZXQgPiAwID8gb2Zmc2V0IDogMCk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtzdWZmaXh9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVByb3BzKHByb3BzOiBhbnkpOiBhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0IHtcblxuICBjb25zdCBwYXJzZWQgPSBwcm9wcz8uQ29uZmlnID8/IHt9O1xuXG4gIC8vIHRoaXMgaXMgd2VpcmQgYnV0IHRoZXNlIGJvb2xlYW4gcHJvcGVydGllcyBhcmUgcGFzc2VkIGJ5IENGTiBhcyBhIHN0cmluZywgYW5kIHdlIG5lZWQgdGhlbSB0byBiZSBib29sZWFuaWMgZm9yIHRoZSBTREsuXG4gIC8vIE90aGVyd2lzZSBpdCBmYWlscyB3aXRoICdVbmV4cGVjdGVkIFBhcmFtZXRlcjogcGFyYW1zLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgaXMgZXhwZWN0ZWQgdG8gYmUgYSBib29sZWFuJ1xuXG4gIGlmICh0eXBlb2YgKHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWc/LmVuZHBvaW50UHJpdmF0ZUFjY2VzcykgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgPSBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyA9PT0gJ3RydWUnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiAocGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZz8uZW5kcG9pbnRQdWJsaWNBY2Nlc3MpID09PSAnc3RyaW5nJykge1xuICAgIHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgPSBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHVibGljQWNjZXNzID09PSAndHJ1ZSc7XG4gIH1cblxuICBpZiAodHlwZW9mIChwYXJzZWQubG9nZ2luZz8uY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCkgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLmxvZ2dpbmcuY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCA9IHBhcnNlZC5sb2dnaW5nLmNsdXN0ZXJMb2dnaW5nWzBdLmVuYWJsZWQgPT09ICd0cnVlJztcbiAgfVxuXG4gIHJldHVybiBwYXJzZWQ7XG5cbn1cblxuaW50ZXJmYWNlIFVwZGF0ZU1hcCB7XG4gIHJlcGxhY2VOYW1lOiBib29sZWFuOyAvLyBuYW1lXG4gIHJlcGxhY2VWcGM6IGJvb2xlYW47IC8vIHJlc291cmNlc1ZwY0NvbmZpZy5zdWJuZXRJZHMgYW5kIHNlY3VyaXR5R3JvdXBJZHNcbiAgcmVwbGFjZVJvbGU6IGJvb2xlYW47IC8vIHJvbGVBcm5cblxuICB1cGRhdGVWZXJzaW9uOiBib29sZWFuOyAvLyB2ZXJzaW9uXG4gIHVwZGF0ZUxvZ2dpbmc6IGJvb2xlYW47IC8vIGxvZ2dpbmdcbiAgdXBkYXRlRW5jcnlwdGlvbjogYm9vbGVhbjsgLy8gZW5jcnlwdGlvbiAoY2Fubm90IGJlIHVwZGF0ZWQpXG4gIHVwZGF0ZUFjY2VzczogYm9vbGVhbjsgLy8gcmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyBhbmQgZW5kcG9pbnRQdWJsaWNBY2Nlc3Ncbn1cblxuZnVuY3Rpb24gYW5hbHl6ZVVwZGF0ZShvbGRQcm9wczogUGFydGlhbDxhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0PiwgbmV3UHJvcHM6IGF3cy5FS1MuQ3JlYXRlQ2x1c3RlclJlcXVlc3QpOiBVcGRhdGVNYXAge1xuICBjb25zb2xlLmxvZygnb2xkIHByb3BzOiAnLCBKU09OLnN0cmluZ2lmeShvbGRQcm9wcykpO1xuICBjb25zb2xlLmxvZygnbmV3IHByb3BzOiAnLCBKU09OLnN0cmluZ2lmeShuZXdQcm9wcykpO1xuXG4gIGNvbnN0IG5ld1ZwY1Byb3BzID0gbmV3UHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnIHx8IHt9O1xuICBjb25zdCBvbGRWcGNQcm9wcyA9IG9sZFByb3BzLnJlc291cmNlc1ZwY0NvbmZpZyB8fCB7fTtcblxuICBjb25zdCBvbGRQdWJsaWNBY2Nlc3NDaWRycyA9IG5ldyBTZXQob2xkVnBjUHJvcHMucHVibGljQWNjZXNzQ2lkcnMgPz8gW10pO1xuICBjb25zdCBuZXdQdWJsaWNBY2Nlc3NDaWRycyA9IG5ldyBTZXQobmV3VnBjUHJvcHMucHVibGljQWNjZXNzQ2lkcnMgPz8gW10pO1xuICBjb25zdCBuZXdFbmMgPSBuZXdQcm9wcy5lbmNyeXB0aW9uQ29uZmlnIHx8IHt9O1xuICBjb25zdCBvbGRFbmMgPSBvbGRQcm9wcy5lbmNyeXB0aW9uQ29uZmlnIHx8IHt9O1xuXG4gIHJldHVybiB7XG4gICAgcmVwbGFjZU5hbWU6IG5ld1Byb3BzLm5hbWUgIT09IG9sZFByb3BzLm5hbWUsXG4gICAgcmVwbGFjZVZwYzpcbiAgICAgIEpTT04uc3RyaW5naWZ5KG5ld1ZwY1Byb3BzLnN1Ym5ldElkcz8uc29ydCgpKSAhPT0gSlNPTi5zdHJpbmdpZnkob2xkVnBjUHJvcHMuc3VibmV0SWRzPy5zb3J0KCkpIHx8XG4gICAgICBKU09OLnN0cmluZ2lmeShuZXdWcGNQcm9wcy5zZWN1cml0eUdyb3VwSWRzPy5zb3J0KCkpICE9PSBKU09OLnN0cmluZ2lmeShvbGRWcGNQcm9wcy5zZWN1cml0eUdyb3VwSWRzPy5zb3J0KCkpLFxuICAgIHVwZGF0ZUFjY2VzczpcbiAgICAgIG5ld1ZwY1Byb3BzLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyAhPT0gb2xkVnBjUHJvcHMuZW5kcG9pbnRQcml2YXRlQWNjZXNzIHx8XG4gICAgICBuZXdWcGNQcm9wcy5lbmRwb2ludFB1YmxpY0FjY2VzcyAhPT0gb2xkVnBjUHJvcHMuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgfHxcbiAgICAgICFzZXRzRXF1YWwobmV3UHVibGljQWNjZXNzQ2lkcnMsIG9sZFB1YmxpY0FjY2Vzc0NpZHJzKSxcbiAgICByZXBsYWNlUm9sZTogbmV3UHJvcHMucm9sZUFybiAhPT0gb2xkUHJvcHMucm9sZUFybixcbiAgICB1cGRhdGVWZXJzaW9uOiBuZXdQcm9wcy52ZXJzaW9uICE9PSBvbGRQcm9wcy52ZXJzaW9uLFxuICAgIHVwZGF0ZUVuY3J5cHRpb246IEpTT04uc3RyaW5naWZ5KG5ld0VuYykgIT09IEpTT04uc3RyaW5naWZ5KG9sZEVuYyksXG4gICAgdXBkYXRlTG9nZ2luZzogSlNPTi5zdHJpbmdpZnkobmV3UHJvcHMubG9nZ2luZykgIT09IEpTT04uc3RyaW5naWZ5KG9sZFByb3BzLmxvZ2dpbmcpLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRzRXF1YWwoZmlyc3Q6IFNldDxzdHJpbmc+LCBzZWNvbmQ6IFNldDxzdHJpbmc+KSB7XG4gIHJldHVybiBmaXJzdC5zaXplID09PSBzZWNvbmQuc2l6ZSAmJiBbLi4uZmlyc3RdLmV2ZXJ5KChlOiBzdHJpbmcpID0+IHNlY29uZC5oYXMoZSkpO1xufVxuIl19