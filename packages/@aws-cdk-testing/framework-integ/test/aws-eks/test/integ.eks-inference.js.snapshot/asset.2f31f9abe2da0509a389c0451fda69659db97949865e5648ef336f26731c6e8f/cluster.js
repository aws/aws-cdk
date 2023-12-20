"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterResourceHandler = void 0;
const common_1 = require("./common");
const compareLogging_1 = require("./compareLogging");
const MAX_CLUSTER_NAME_LEN = 100;
class ClusterResourceHandler extends common_1.ResourceHandler {
    get clusterName() {
        if (!this.physicalResourceId) {
            throw new Error('Cannot determine cluster name without physical resource ID');
        }
        return this.physicalResourceId;
    }
    constructor(eks, event) {
        super(eks, event);
        this.newProps = parseProps(this.event.ResourceProperties);
        this.oldProps = event.RequestType === 'Update' ? parseProps(event.OldResourceProperties) : {};
        // compare newProps and oldProps and update the newProps by appending disabled LogSetup if any
        const compared = (0, compareLogging_1.compareLoggingProps)(this.oldProps, this.newProps);
        this.newProps.logging = compared.logging;
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
            if (e.name !== 'ResourceNotFoundException') {
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
                    endpointPrivateAccess: this.newProps.resourcesVpcConfig?.endpointPrivateAccess,
                    endpointPublicAccess: this.newProps.resourcesVpcConfig?.endpointPublicAccess,
                    publicAccessCidrs: this.newProps.resourcesVpcConfig?.publicAccessCidrs,
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
                    // https://docs.amazon.com/eks/latest/APIReference/API_CreateCluster.html#AmazonEKS-CreateCluster-request-encryptionConfig
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtCQUErQjs7O0FBSS9CLHFDQUFxRTtBQUNyRSxxREFBdUQ7QUFHdkQsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLENBQUM7QUFFakMsTUFBYSxzQkFBdUIsU0FBUSx3QkFBZTtJQUN6RCxJQUFXLFdBQVc7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUM7U0FDL0U7UUFFRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztJQUNqQyxDQUFDO0lBS0QsWUFBWSxHQUFjLEVBQUUsS0FBb0I7UUFDOUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsQixJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDOUYsOEZBQThGO1FBQzlGLE1BQU0sUUFBUSxHQUEyQyxJQUFBLG9DQUFtQixFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFDM0MsQ0FBQztJQUVELFNBQVM7SUFDVCxTQUFTO0lBQ1QsU0FBUztJQUVDLEtBQUssQ0FBQyxRQUFRO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7U0FDMUM7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUVyRSxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO1lBQ3hDLEdBQUcsSUFBSSxDQUFDLFFBQVE7WUFDaEIsSUFBSSxFQUFFLFdBQVc7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsV0FBVyxzREFBc0QsQ0FBQyxDQUFDO1NBQzNIO1FBRUQsT0FBTztZQUNMLGtCQUFrQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSTtTQUN0QyxDQUFDO0lBQ0osQ0FBQztJQUVTLEtBQUssQ0FBQyxnQkFBZ0I7UUFDOUIsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELFNBQVM7SUFDVCxTQUFTO0lBQ1QsU0FBUztJQUVDLEtBQUssQ0FBQyxRQUFRO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQzlELElBQUk7WUFDRixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1NBQzFEO1FBQUMsT0FBTyxDQUFNLEVBQUU7WUFDZixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssMkJBQTJCLEVBQUU7Z0JBQzFDLE1BQU0sQ0FBQyxDQUFDO2FBQ1Q7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksQ0FBQyxXQUFXLG9DQUFvQyxDQUFDLENBQUM7YUFDOUU7U0FDRjtRQUNELE9BQU87WUFDTCxrQkFBa0IsRUFBRSxJQUFJLENBQUMsV0FBVztTQUNyQyxDQUFDO0lBQ0osQ0FBQztJQUVTLEtBQUssQ0FBQyxnQkFBZ0I7UUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsSUFBSSxDQUFDLFdBQVcsZ0JBQWdCLENBQUMsQ0FBQztRQUV2RixJQUFJO1lBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUN4RSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlFO1FBQUMsT0FBTyxDQUFNLEVBQUU7WUFDZixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssMkJBQTJCLEVBQUU7Z0JBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0dBQWdHLENBQUMsQ0FBQztnQkFDOUcsT0FBTyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUM3QjtZQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLENBQUM7U0FDVDtRQUVELE9BQU87WUFDTCxVQUFVLEVBQUUsS0FBSztTQUNsQixDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVM7SUFDVCxTQUFTO0lBQ1QsU0FBUztJQUVDLEtBQUssQ0FBQyxRQUFRO1FBQ3RCLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEUsZ0RBQWdEO1FBQ2hELElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztTQUNuRTtRQUVELDRFQUE0RTtRQUM1RSwyRUFBMkU7UUFDM0UsMENBQTBDO1FBQzFDLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFFcEUsbUVBQW1FO1lBQ25FLDBFQUEwRTtZQUMxRSxtRUFBbUU7WUFDbkUsb0VBQW9FO1lBQ3BFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7Z0JBQ25FLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSx3R0FBd0csQ0FBQyxDQUFDO2FBQ3hLO1lBRUQsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDeEI7UUFFRCw0REFBNEQ7UUFDNUQsSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRUFBbUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQzdHO1lBRUQsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksT0FBTyxDQUFDLGFBQWEsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ2pELE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUN0RTtRQUVELElBQUksT0FBTyxDQUFDLGFBQWEsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ2pELE1BQU0sTUFBTSxHQUF3QztnQkFDbEQsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXO2FBQ3ZCLENBQUM7WUFDRixJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7Z0JBQ3pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFDeEM7WUFBQSxDQUFDO1lBQ0YsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO2dCQUN4Qiw4RkFBOEY7Z0JBQzlGLHFHQUFxRztnQkFDckcsaUVBQWlFO2dCQUNqRSxNQUFNLENBQUMsa0JBQWtCLEdBQUc7b0JBQzFCLHFCQUFxQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUscUJBQXFCO29CQUM5RSxvQkFBb0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLG9CQUFvQjtvQkFDNUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxpQkFBaUI7aUJBQ3ZFLENBQUM7YUFDSDtZQUNELE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVsRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUM7U0FDbkQ7UUFFRCxhQUFhO1FBQ2IsT0FBTztJQUNULENBQUM7SUFFUyxLQUFLLENBQUMsZ0JBQWdCO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUVoQyxvRUFBb0U7UUFDcEUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUMxQixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2IsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQzthQUM5QjtZQUVELHdFQUF3RTtZQUN4RSwwRUFBMEU7WUFDMUUscUVBQXFFO1NBQ3RFO1FBRUQsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVPLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxVQUFrQjtRQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRXpELDRFQUE0RTtRQUM1RSx3QkFBd0I7UUFDeEIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3JGLElBQUksT0FBTyxFQUFFLE9BQU8sS0FBSyxVQUFVLEVBQUU7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsT0FBTyxDQUFDLE9BQU8sMkJBQTJCLENBQUMsQ0FBQztZQUN0RixPQUFPO1NBQ1I7UUFFRCxNQUFNLGNBQWMsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUM1RyxPQUFPLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUVPLEtBQUssQ0FBQyxRQUFRO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNwRCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUU3Qiw0RUFBNEU7UUFDNUUseUVBQXlFO1FBQ3pFLHNEQUFzRDtRQUN0RCxJQUFJLE9BQU8sRUFBRSxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ2hDLDZFQUE2RTtZQUM3RSxpQkFBaUI7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1NBQ2xEO2FBQU0sSUFBSSxPQUFPLEVBQUUsTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUN2QyxPQUFPO2dCQUNMLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUM7U0FDSDthQUFNO1lBQ0wsT0FBTztnQkFDTCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtvQkFDbEIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO29CQUMxQixHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUc7b0JBRWhCLG9FQUFvRTtvQkFDcEUsOERBQThEO29CQUM5RCxrRUFBa0U7b0JBQ2xFLGFBQWE7b0JBRWIsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLG9CQUFvQixFQUFFLElBQUksSUFBSSxFQUFFO29CQUNsRSxzQkFBc0IsRUFBRSxPQUFPLENBQUMsa0JBQWtCLEVBQUUsc0JBQXNCLElBQUksRUFBRTtvQkFDaEYsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxJQUFJLEVBQUU7b0JBQzVELG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtvQkFFdkUsNEdBQTRHO29CQUM1RywwSEFBMEg7b0JBQzFILHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxJQUFJLEVBQUU7aUJBQ2xGO2FBQ0YsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVPLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxXQUFtQjtRQUNuRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUUvQyxNQUFNLHNCQUFzQixHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7WUFDM0QsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQ3RCLFFBQVEsRUFBRSxXQUFXO1NBQ3RCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxzQkFBc0IsRUFBRSxDQUFDLENBQUM7UUFFckMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBRTtZQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZFO1FBRUQsUUFBUSxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQzVDLEtBQUssWUFBWTtnQkFDZixPQUFPLEtBQUssQ0FBQztZQUNmLEtBQUssWUFBWTtnQkFDZixPQUFPLElBQUksQ0FBQztZQUNkLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxXQUFXO2dCQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLFdBQVcseUJBQXlCLElBQUksQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwSTtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixzQkFBc0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxvQkFBb0IsV0FBVyxHQUFHLENBQUMsQ0FBQztTQUM5RztJQUNILENBQUM7SUFFTyxtQkFBbUI7UUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVztRQUM1RCxNQUFNLE1BQU0sR0FBRyxvQkFBb0IsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN4RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLE9BQU8sR0FBRyxNQUFNLElBQUksTUFBTSxFQUFFLENBQUM7SUFDL0IsQ0FBQztDQUNGO0FBOVFELHdEQThRQztBQUVELFNBQVMsVUFBVSxDQUFDLEtBQVU7SUFFNUIsTUFBTSxNQUFNLEdBQUcsS0FBSyxFQUFFLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFFbkMsMEhBQTBIO0lBQzFILDhIQUE4SDtJQUU5SCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUscUJBQXFCLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDMUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsS0FBSyxNQUFNLENBQUM7S0FDOUc7SUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsb0JBQW9CLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDekUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxNQUFNLENBQUM7S0FDNUc7SUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDbkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUM7S0FDaEc7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUVoQixDQUFDO0FBYUQsU0FBUyxhQUFhLENBQUMsUUFBZ0QsRUFBRSxRQUF1QztJQUM5RyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRXJELE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxrQkFBa0IsSUFBSSxFQUFFLENBQUM7SUFDdEQsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztJQUV0RCxNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMxRSxNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMxRSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsZ0JBQWdCLElBQUksRUFBRSxDQUFDO0lBQy9DLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUM7SUFFL0MsT0FBTztRQUNMLFdBQVcsRUFBRSxRQUFRLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxJQUFJO1FBQzVDLFVBQVUsRUFDUixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDL0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUMvRyxZQUFZLEVBQ1YsV0FBVyxDQUFDLHFCQUFxQixLQUFLLFdBQVcsQ0FBQyxxQkFBcUI7WUFDdkUsV0FBVyxDQUFDLG9CQUFvQixLQUFLLFdBQVcsQ0FBQyxvQkFBb0I7WUFDckUsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEVBQUUsb0JBQW9CLENBQUM7UUFDeEQsV0FBVyxFQUFFLFFBQVEsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLE9BQU87UUFDbEQsYUFBYSxFQUFFLFFBQVEsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLE9BQU87UUFDcEQsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNuRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0tBQ3JGLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsS0FBa0IsRUFBRSxNQUFtQjtJQUN4RCxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgRUtTIGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1la3MnO1xuaW1wb3J0IHsgRWtzQ2xpZW50LCBSZXNvdXJjZUV2ZW50LCBSZXNvdXJjZUhhbmRsZXIgfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgeyBjb21wYXJlTG9nZ2luZ1Byb3BzIH0gZnJvbSAnLi9jb21wYXJlTG9nZ2luZyc7XG5pbXBvcnQgeyBJc0NvbXBsZXRlUmVzcG9uc2UsIE9uRXZlbnRSZXNwb25zZSB9IGZyb20gJy4uLy4uLy4uL2N1c3RvbS1yZXNvdXJjZXMvbGliL3Byb3ZpZGVyLWZyYW1ld29yay90eXBlcyc7XG5cbmNvbnN0IE1BWF9DTFVTVEVSX05BTUVfTEVOID0gMTAwO1xuXG5leHBvcnQgY2xhc3MgQ2x1c3RlclJlc291cmNlSGFuZGxlciBleHRlbmRzIFJlc291cmNlSGFuZGxlciB7XG4gIHB1YmxpYyBnZXQgY2x1c3Rlck5hbWUoKSB7XG4gICAgaWYgKCF0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGV0ZXJtaW5lIGNsdXN0ZXIgbmFtZSB3aXRob3V0IHBoeXNpY2FsIHJlc291cmNlIElEJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGh5c2ljYWxSZXNvdXJjZUlkO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBuZXdQcm9wczogRUtTLkNyZWF0ZUNsdXN0ZXJDb21tYW5kSW5wdXQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgb2xkUHJvcHM6IFBhcnRpYWw8RUtTLkNyZWF0ZUNsdXN0ZXJDb21tYW5kSW5wdXQ+O1xuXG4gIGNvbnN0cnVjdG9yKGVrczogRWtzQ2xpZW50LCBldmVudDogUmVzb3VyY2VFdmVudCkge1xuICAgIHN1cGVyKGVrcywgZXZlbnQpO1xuXG4gICAgdGhpcy5uZXdQcm9wcyA9IHBhcnNlUHJvcHModGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgIHRoaXMub2xkUHJvcHMgPSBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScgPyBwYXJzZVByb3BzKGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcykgOiB7fTtcbiAgICAvLyBjb21wYXJlIG5ld1Byb3BzIGFuZCBvbGRQcm9wcyBhbmQgdXBkYXRlIHRoZSBuZXdQcm9wcyBieSBhcHBlbmRpbmcgZGlzYWJsZWQgTG9nU2V0dXAgaWYgYW55XG4gICAgY29uc3QgY29tcGFyZWQ6IFBhcnRpYWw8RUtTLkNyZWF0ZUNsdXN0ZXJDb21tYW5kSW5wdXQ+ID0gY29tcGFyZUxvZ2dpbmdQcm9wcyh0aGlzLm9sZFByb3BzLCB0aGlzLm5ld1Byb3BzKTtcbiAgICB0aGlzLm5ld1Byb3BzLmxvZ2dpbmcgPSBjb21wYXJlZC5sb2dnaW5nO1xuICB9XG5cbiAgLy8gLS0tLS0tXG4gIC8vIENSRUFURVxuICAvLyAtLS0tLS1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25DcmVhdGUoKTogUHJvbWlzZTxPbkV2ZW50UmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZygnb25DcmVhdGU6IGNyZWF0aW5nIGNsdXN0ZXIgd2l0aCBvcHRpb25zOicsIEpTT04uc3RyaW5naWZ5KHRoaXMubmV3UHJvcHMsIHVuZGVmaW5lZCwgMikpO1xuICAgIGlmICghdGhpcy5uZXdQcm9wcy5yb2xlQXJuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wicm9sZUFyblwiIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgY2x1c3Rlck5hbWUgPSB0aGlzLm5ld1Byb3BzLm5hbWUgfHwgdGhpcy5nZW5lcmF0ZUNsdXN0ZXJOYW1lKCk7XG5cbiAgICBjb25zdCByZXNwID0gYXdhaXQgdGhpcy5la3MuY3JlYXRlQ2x1c3Rlcih7XG4gICAgICAuLi50aGlzLm5ld1Byb3BzLFxuICAgICAgbmFtZTogY2x1c3Rlck5hbWUsXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3AuY2x1c3Rlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciB3aGVuIHRyeWluZyB0byBjcmVhdGUgY2x1c3RlciAke2NsdXN0ZXJOYW1lfTogQ3JlYXRlQ2x1c3RlciByZXR1cm5lZCB3aXRob3V0IGNsdXN0ZXIgaW5mb3JtYXRpb25gKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiByZXNwLmNsdXN0ZXIubmFtZSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzQ3JlYXRlQ29tcGxldGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBY3RpdmUoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLVxuICAvLyBERUxFVEVcbiAgLy8gLS0tLS0tXG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uRGVsZXRlKCk6IFByb21pc2U8T25FdmVudFJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5sb2coYG9uRGVsZXRlOiBkZWxldGluZyBjbHVzdGVyICR7dGhpcy5jbHVzdGVyTmFtZX1gKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5la3MuZGVsZXRlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoZS5uYW1lICE9PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBjbHVzdGVyICR7dGhpcy5jbHVzdGVyTmFtZX0gbm90IGZvdW5kLCBpZGVtcG90ZW50bHkgc3VjY2VlZGVkYCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHRoaXMuY2x1c3Rlck5hbWUsXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc0RlbGV0ZUNvbXBsZXRlKCk6IFByb21pc2U8SXNDb21wbGV0ZVJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5sb2coYGlzRGVsZXRlQ29tcGxldGU6IHdhaXRpbmcgZm9yIGNsdXN0ZXIgJHt0aGlzLmNsdXN0ZXJOYW1lfSB0byBiZSBkZWxldGVkYCk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgICBjb25zb2xlLmxvZygnZGVzY3JpYmVDbHVzdGVyIHJldHVybmVkOicsIEpTT04uc3RyaW5naWZ5KHJlc3AsIHVuZGVmaW5lZCwgMikpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgaWYgKGUubmFtZSA9PT0gJ1Jlc291cmNlTm90Rm91bmRFeGNlcHRpb24nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlZCBSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uLCB0aGlzIG1lYW5zIHRoZSBjbHVzdGVyIGhhcyBiZWVuIGRlbGV0ZWQgKG9yIG5ldmVyIGV4aXN0ZWQpJyk7XG4gICAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IHRydWUgfTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coJ2Rlc2NyaWJlQ2x1c3RlciBlcnJvcjonLCBlKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIElzQ29tcGxldGU6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICAvLyAtLS0tLS1cbiAgLy8gVVBEQVRFXG4gIC8vIC0tLS0tLVxuXG4gIHByb3RlY3RlZCBhc3luYyBvblVwZGF0ZSgpIHtcbiAgICBjb25zdCB1cGRhdGVzID0gYW5hbHl6ZVVwZGF0ZSh0aGlzLm9sZFByb3BzLCB0aGlzLm5ld1Byb3BzKTtcbiAgICBjb25zb2xlLmxvZygnb25VcGRhdGU6JywgSlNPTi5zdHJpbmdpZnkoeyB1cGRhdGVzIH0sIHVuZGVmaW5lZCwgMikpO1xuXG4gICAgLy8gdXBkYXRlcyB0byBlbmNyeXB0aW9uIGNvbmZpZyBpcyBub3Qgc3VwcG9ydGVkXG4gICAgaWYgKHVwZGF0ZXMudXBkYXRlRW5jcnlwdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXBkYXRlIGNsdXN0ZXIgZW5jcnlwdGlvbiBjb25maWd1cmF0aW9uJyk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlcmUgaXMgYW4gdXBkYXRlIHRoYXQgcmVxdWlyZXMgcmVwbGFjZW1lbnQsIGdvIGFoZWFkIGFuZCBqdXN0IGNyZWF0ZVxuICAgIC8vIGEgbmV3IGNsdXN0ZXIgd2l0aCB0aGUgbmV3IGNvbmZpZy4gVGhlIG9sZCBjbHVzdGVyIHdpbGwgYXV0b21hdGljYWxseSBiZVxuICAgIC8vIGRlbGV0ZWQgYnkgY2xvdWRmb3JtYXRpb24gdXBvbiBzdWNjZXNzLlxuICAgIGlmICh1cGRhdGVzLnJlcGxhY2VOYW1lIHx8IHVwZGF0ZXMucmVwbGFjZVJvbGUgfHwgdXBkYXRlcy5yZXBsYWNlVnBjKSB7XG5cbiAgICAgIC8vIGlmIHdlIGFyZSByZXBsYWNpbmcgdGhpcyBjbHVzdGVyIGFuZCB0aGUgY2x1c3RlciBoYXMgYW4gZXhwbGljaXRcbiAgICAgIC8vIHBoeXNpY2FsIG5hbWUsIHRoZSBjcmVhdGlvbiBvZiB0aGUgbmV3IGNsdXN0ZXIgd2lsbCBmYWlsIHdpdGggXCJ0aGVyZSBpc1xuICAgICAgLy8gYWxyZWFkeSBhIGNsdXN0ZXIgd2l0aCB0aGF0IG5hbWVcIi4gdGhpcyBpcyBhIGNvbW1vbiBiZWhhdmlvciBmb3JcbiAgICAgIC8vIENsb3VkRm9ybWF0aW9uIHJlc291cmNlcyB0aGF0IHN1cHBvcnQgc3BlY2lmeWluZyBhIHBoeXNpY2FsIG5hbWUuXG4gICAgICBpZiAodGhpcy5vbGRQcm9wcy5uYW1lID09PSB0aGlzLm5ld1Byb3BzLm5hbWUgJiYgdGhpcy5vbGRQcm9wcy5uYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHJlcGxhY2UgY2x1c3RlciBcIiR7dGhpcy5vbGRQcm9wcy5uYW1lfVwiIHNpbmNlIGl0IGhhcyBhbiBleHBsaWNpdCBwaHlzaWNhbCBuYW1lLiBFaXRoZXIgcmVuYW1lIHRoZSBjbHVzdGVyIG9yIHJlbW92ZSB0aGUgXCJuYW1lXCIgY29uZmlndXJhdGlvbmApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5vbkNyZWF0ZSgpO1xuICAgIH1cblxuICAgIC8vIGlmIGEgdmVyc2lvbiB1cGRhdGUgaXMgcmVxdWlyZWQsIGlzc3VlIHRoZSB2ZXJzaW9uIHVwZGF0ZVxuICAgIGlmICh1cGRhdGVzLnVwZGF0ZVZlcnNpb24pIHtcbiAgICAgIGlmICghdGhpcy5uZXdQcm9wcy52ZXJzaW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHJlbW92ZSBjbHVzdGVyIHZlcnNpb24gY29uZmlndXJhdGlvbi4gQ3VycmVudCB2ZXJzaW9uIGlzICR7dGhpcy5vbGRQcm9wcy52ZXJzaW9ufWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVDbHVzdGVyVmVyc2lvbih0aGlzLm5ld1Byb3BzLnZlcnNpb24pO1xuICAgIH1cblxuICAgIGlmICh1cGRhdGVzLnVwZGF0ZUxvZ2dpbmcgJiYgdXBkYXRlcy51cGRhdGVBY2Nlc3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVwZGF0ZSBsb2dnaW5nIGFuZCBhY2Nlc3MgYXQgdGhlIHNhbWUgdGltZScpO1xuICAgIH1cblxuICAgIGlmICh1cGRhdGVzLnVwZGF0ZUxvZ2dpbmcgfHwgdXBkYXRlcy51cGRhdGVBY2Nlc3MpIHtcbiAgICAgIGNvbnN0IGNvbmZpZzogRUtTLlVwZGF0ZUNsdXN0ZXJDb25maWdDb21tYW5kSW5wdXQgPSB7XG4gICAgICAgIG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsXG4gICAgICB9O1xuICAgICAgaWYgKHVwZGF0ZXMudXBkYXRlTG9nZ2luZykge1xuICAgICAgICBjb25maWcubG9nZ2luZyA9IHRoaXMubmV3UHJvcHMubG9nZ2luZztcbiAgICAgIH07XG4gICAgICBpZiAodXBkYXRlcy51cGRhdGVBY2Nlc3MpIHtcbiAgICAgICAgLy8gVXBkYXRpbmcgdGhlIGNsdXN0ZXIgd2l0aCBzZWN1cml0eUdyb3VwSWRzIGFuZCBzdWJuZXRJZHMgKGFzIHNwZWNpZmllZCBpbiB0aGUgd2FybmluZyBoZXJlOlxuICAgICAgICAvLyBodHRwczovL2F3c2NsaS5hbWF6b25hd3MuY29tL3YyL2RvY3VtZW50YXRpb24vYXBpL2xhdGVzdC9yZWZlcmVuY2UvZWtzL3VwZGF0ZS1jbHVzdGVyLWNvbmZpZy5odG1sKVxuICAgICAgICAvLyB3aWxsIGZhaWwsIHRoZXJlZm9yZSB3ZSB0YWtlIG9ubHkgdGhlIGFjY2VzcyBmaWVsZHMgZXhwbGljaXRseVxuICAgICAgICBjb25maWcucmVzb3VyY2VzVnBjQ29uZmlnID0ge1xuICAgICAgICAgIGVuZHBvaW50UHJpdmF0ZUFjY2VzczogdGhpcy5uZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWc/LmVuZHBvaW50UHJpdmF0ZUFjY2VzcyxcbiAgICAgICAgICBlbmRwb2ludFB1YmxpY0FjY2VzczogdGhpcy5uZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWc/LmVuZHBvaW50UHVibGljQWNjZXNzLFxuICAgICAgICAgIHB1YmxpY0FjY2Vzc0NpZHJzOiB0aGlzLm5ld1Byb3BzLnJlc291cmNlc1ZwY0NvbmZpZz8ucHVibGljQWNjZXNzQ2lkcnMsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBjb25zdCB1cGRhdGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLnVwZGF0ZUNsdXN0ZXJDb25maWcoY29uZmlnKTtcblxuICAgICAgcmV0dXJuIHsgRWtzVXBkYXRlSWQ6IHVwZGF0ZVJlc3BvbnNlLnVwZGF0ZT8uaWQgfTtcbiAgICB9XG5cbiAgICAvLyBubyB1cGRhdGVzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzVXBkYXRlQ29tcGxldGUoKSB7XG4gICAgY29uc29sZS5sb2coJ2lzVXBkYXRlQ29tcGxldGUnKTtcblxuICAgIC8vIGlmIHRoaXMgaXMgYW4gRUtTIHVwZGF0ZSwgd2Ugd2lsbCBtb25pdG9yIHRoZSB1cGRhdGUgZXZlbnQgaXRzZWxmXG4gICAgaWYgKHRoaXMuZXZlbnQuRWtzVXBkYXRlSWQpIHtcbiAgICAgIGNvbnN0IGNvbXBsZXRlID0gYXdhaXQgdGhpcy5pc0Vrc1VwZGF0ZUNvbXBsZXRlKHRoaXMuZXZlbnQuRWtzVXBkYXRlSWQpO1xuICAgICAgaWYgKCFjb21wbGV0ZSkge1xuICAgICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiBmYWxzZSB9O1xuICAgICAgfVxuXG4gICAgICAvLyBmYWxsIHRocm91Z2g6IGlmIHRoZSB1cGRhdGUgaXMgZG9uZSwgd2Ugc2ltcGx5IGRlbGVnYXRlIHRvIGlzQWN0aXZlKClcbiAgICAgIC8vIGluIG9yZGVyIHRvIGV4dHJhY3QgYXR0cmlidXRlcyBhbmQgc3RhdGUgZnJvbSB0aGUgY2x1c3RlciBpdHNlbGYsIHdoaWNoXG4gICAgICAvLyBpcyBzdXBwb3NlZCB0byBiZSBpbiBhbiBBQ1RJVkUgc3RhdGUgYWZ0ZXIgdGhlIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVDbHVzdGVyVmVyc2lvbihuZXdWZXJzaW9uOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhgdXBkYXRpbmcgY2x1c3RlciB2ZXJzaW9uIHRvICR7bmV3VmVyc2lvbn1gKTtcblxuICAgIC8vIHVwZGF0ZS1jbHVzdGVyLXZlcnNpb24gd2lsbCBmYWlsIGlmIHdlIHRyeSB0byB1cGRhdGUgdG8gdGhlIHNhbWUgdmVyc2lvbixcbiAgICAvLyBzbyBza2lwIGluIHRoaXMgY2FzZS5cbiAgICBjb25zdCBjbHVzdGVyID0gKGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSkpLmNsdXN0ZXI7XG4gICAgaWYgKGNsdXN0ZXI/LnZlcnNpb24gPT09IG5ld1ZlcnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKGBjbHVzdGVyIGFscmVhZHkgYXQgdmVyc2lvbiAke2NsdXN0ZXIudmVyc2lvbn0sIHNraXBwaW5nIHZlcnNpb24gdXBkYXRlYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy51cGRhdGVDbHVzdGVyVmVyc2lvbih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsIHZlcnNpb246IG5ld1ZlcnNpb24gfSk7XG4gICAgcmV0dXJuIHsgRWtzVXBkYXRlSWQ6IHVwZGF0ZVJlc3BvbnNlLnVwZGF0ZT8uaWQgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaXNBY3RpdmUoKTogUHJvbWlzZTxJc0NvbXBsZXRlUmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZygnd2FpdGluZyBmb3IgY2x1c3RlciB0byBiZWNvbWUgQUNUSVZFJyk7XG4gICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgY29uc29sZS5sb2coJ2Rlc2NyaWJlQ2x1c3RlciByZXN1bHQ6JywgSlNPTi5zdHJpbmdpZnkocmVzcCwgdW5kZWZpbmVkLCAyKSk7XG4gICAgY29uc3QgY2x1c3RlciA9IHJlc3AuY2x1c3RlcjtcblxuICAgIC8vIGlmIGNsdXN0ZXIgaXMgdW5kZWZpbmVkIChzaG91bGRudCBoYXBwZW4pIG9yIHN0YXR1cyBpcyBub3QgQUNUSVZFLCB3ZSBhcmVcbiAgICAvLyBub3QgY29tcGxldGUuIG5vdGUgdGhhdCB0aGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyIGZyYW1ld29yayBmb3JiaWRzXG4gICAgLy8gcmV0dXJuaW5nIGF0dHJpYnV0ZXMgKERhdGEpIGlmIGlzQ29tcGxldGUgaXMgZmFsc2UuXG4gICAgaWYgKGNsdXN0ZXI/LnN0YXR1cyA9PT0gJ0ZBSUxFRCcpIHtcbiAgICAgIC8vIG5vdCB2ZXJ5IGluZm9ybWF0aXZlLCB1bmZvcnR1bmF0ZWx5IHRoZSByZXNwb25zZSBkb2Vzbid0IGNvbnRhaW4gYW55IGVycm9yXG4gICAgICAvLyBpbmZvcm1hdGlvbiA6XFxcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2x1c3RlciBpcyBpbiBhIEZBSUxFRCBzdGF0dXMnKTtcbiAgICB9IGVsc2UgaWYgKGNsdXN0ZXI/LnN0YXR1cyAhPT0gJ0FDVElWRScpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIElzQ29tcGxldGU6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgSXNDb21wbGV0ZTogdHJ1ZSxcbiAgICAgICAgRGF0YToge1xuICAgICAgICAgIE5hbWU6IGNsdXN0ZXIubmFtZSxcbiAgICAgICAgICBFbmRwb2ludDogY2x1c3Rlci5lbmRwb2ludCxcbiAgICAgICAgICBBcm46IGNsdXN0ZXIuYXJuLFxuXG4gICAgICAgICAgLy8gSU1QT1JUQU5UOiBDRk4gZXhwZWN0cyB0aGF0IGF0dHJpYnV0ZXMgd2lsbCAqYWx3YXlzKiBoYXZlIHZhbHVlcyxcbiAgICAgICAgICAvLyBzbyByZXR1cm4gYW4gZW1wdHkgc3RyaW5nIGluIGNhc2UgdGhlIHZhbHVlIGlzIG5vdCBkZWZpbmVkLlxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgQ0ZOIHdpbGwgdGhyb3cgd2l0aCBgVmVuZG9yIHJlc3BvbnNlIGRvZXNuJ3QgY29udGFpblxuICAgICAgICAgIC8vIFhYWFgga2V5YC5cblxuICAgICAgICAgIENlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogY2x1c3Rlci5jZXJ0aWZpY2F0ZUF1dGhvcml0eT8uZGF0YSA/PyAnJyxcbiAgICAgICAgICBDbHVzdGVyU2VjdXJpdHlHcm91cElkOiBjbHVzdGVyLnJlc291cmNlc1ZwY0NvbmZpZz8uY2x1c3RlclNlY3VyaXR5R3JvdXBJZCA/PyAnJyxcbiAgICAgICAgICBPcGVuSWRDb25uZWN0SXNzdWVyVXJsOiBjbHVzdGVyLmlkZW50aXR5Py5vaWRjPy5pc3N1ZXIgPz8gJycsXG4gICAgICAgICAgT3BlbklkQ29ubmVjdElzc3VlcjogY2x1c3Rlci5pZGVudGl0eT8ub2lkYz8uaXNzdWVyPy5zdWJzdHJpbmcoOCkgPz8gJycsIC8vIFN0cmlwcyBvZmYgaHR0cHM6Ly8gZnJvbSB0aGUgaXNzdWVyIHVybFxuXG4gICAgICAgICAgLy8gV2UgY2FuIHNhZmVseSByZXR1cm4gdGhlIGZpcnN0IGl0ZW0gZnJvbSBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24gYXJyYXksIGJlY2F1c2UgaXQgaGFzIGEgbGltaXQgb2YgMSBpdGVtXG4gICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX0NyZWF0ZUNsdXN0ZXIuaHRtbCNBbWF6b25FS1MtQ3JlYXRlQ2x1c3Rlci1yZXF1ZXN0LWVuY3J5cHRpb25Db25maWdcbiAgICAgICAgICBFbmNyeXB0aW9uQ29uZmlnS2V5QXJuOiBjbHVzdGVyLmVuY3J5cHRpb25Db25maWc/LnNoaWZ0KCk/LnByb3ZpZGVyPy5rZXlBcm4gPz8gJycsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaXNFa3NVcGRhdGVDb21wbGV0ZShla3NVcGRhdGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5sb2coeyBpc0Vrc1VwZGF0ZUNvbXBsZXRlOiBla3NVcGRhdGVJZCB9KTtcblxuICAgIGNvbnN0IGRlc2NyaWJlVXBkYXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy5kZXNjcmliZVVwZGF0ZSh7XG4gICAgICBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lLFxuICAgICAgdXBkYXRlSWQ6IGVrc1VwZGF0ZUlkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5sb2coeyBkZXNjcmliZVVwZGF0ZVJlc3BvbnNlIH0pO1xuXG4gICAgaWYgKCFkZXNjcmliZVVwZGF0ZVJlc3BvbnNlLnVwZGF0ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmFibGUgdG8gZGVzY3JpYmUgdXBkYXRlIHdpdGggaWQgXCIke2Vrc1VwZGF0ZUlkfVwiYCk7XG4gICAgfVxuXG4gICAgc3dpdGNoIChkZXNjcmliZVVwZGF0ZVJlc3BvbnNlLnVwZGF0ZS5zdGF0dXMpIHtcbiAgICAgIGNhc2UgJ0luUHJvZ3Jlc3MnOlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdTdWNjZXNzZnVsJzpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlICdGYWlsZWQnOlxuICAgICAgY2FzZSAnQ2FuY2VsbGVkJzpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBjbHVzdGVyIHVwZGF0ZSBpZCBcIiR7ZWtzVXBkYXRlSWR9XCIgZmFpbGVkIHdpdGggZXJyb3JzOiAke0pTT04uc3RyaW5naWZ5KGRlc2NyaWJlVXBkYXRlUmVzcG9uc2UudXBkYXRlLmVycm9ycyl9YCk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVua25vd24gc3RhdHVzIFwiJHtkZXNjcmliZVVwZGF0ZVJlc3BvbnNlLnVwZGF0ZS5zdGF0dXN9XCIgZm9yIHVwZGF0ZSBpZCBcIiR7ZWtzVXBkYXRlSWR9XCJgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlQ2x1c3Rlck5hbWUoKSB7XG4gICAgY29uc3Qgc3VmZml4ID0gdGhpcy5yZXF1ZXN0SWQucmVwbGFjZSgvLS9nLCAnJyk7IC8vIDMyIGNoYXJzXG4gICAgY29uc3Qgb2Zmc2V0ID0gTUFYX0NMVVNURVJfTkFNRV9MRU4gLSBzdWZmaXgubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBwcmVmaXggPSB0aGlzLmxvZ2ljYWxSZXNvdXJjZUlkLnNsaWNlKDAsIG9mZnNldCA+IDAgPyBvZmZzZXQgOiAwKTtcbiAgICByZXR1cm4gYCR7cHJlZml4fS0ke3N1ZmZpeH1gO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlUHJvcHMocHJvcHM6IGFueSk6IEVLUy5DcmVhdGVDbHVzdGVyQ29tbWFuZElucHV0IHtcblxuICBjb25zdCBwYXJzZWQgPSBwcm9wcz8uQ29uZmlnID8/IHt9O1xuXG4gIC8vIHRoaXMgaXMgd2VpcmQgYnV0IHRoZXNlIGJvb2xlYW4gcHJvcGVydGllcyBhcmUgcGFzc2VkIGJ5IENGTiBhcyBhIHN0cmluZywgYW5kIHdlIG5lZWQgdGhlbSB0byBiZSBib29sZWFuaWMgZm9yIHRoZSBTREsuXG4gIC8vIE90aGVyd2lzZSBpdCBmYWlscyB3aXRoICdVbmV4cGVjdGVkIFBhcmFtZXRlcjogcGFyYW1zLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgaXMgZXhwZWN0ZWQgdG8gYmUgYSBib29sZWFuJ1xuXG4gIGlmICh0eXBlb2YgKHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWc/LmVuZHBvaW50UHJpdmF0ZUFjY2VzcykgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgPSBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyA9PT0gJ3RydWUnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiAocGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZz8uZW5kcG9pbnRQdWJsaWNBY2Nlc3MpID09PSAnc3RyaW5nJykge1xuICAgIHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgPSBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHVibGljQWNjZXNzID09PSAndHJ1ZSc7XG4gIH1cblxuICBpZiAodHlwZW9mIChwYXJzZWQubG9nZ2luZz8uY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCkgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLmxvZ2dpbmcuY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCA9IHBhcnNlZC5sb2dnaW5nLmNsdXN0ZXJMb2dnaW5nWzBdLmVuYWJsZWQgPT09ICd0cnVlJztcbiAgfVxuXG4gIHJldHVybiBwYXJzZWQ7XG5cbn1cblxuaW50ZXJmYWNlIFVwZGF0ZU1hcCB7XG4gIHJlcGxhY2VOYW1lOiBib29sZWFuOyAvLyBuYW1lXG4gIHJlcGxhY2VWcGM6IGJvb2xlYW47IC8vIHJlc291cmNlc1ZwY0NvbmZpZy5zdWJuZXRJZHMgYW5kIHNlY3VyaXR5R3JvdXBJZHNcbiAgcmVwbGFjZVJvbGU6IGJvb2xlYW47IC8vIHJvbGVBcm5cblxuICB1cGRhdGVWZXJzaW9uOiBib29sZWFuOyAvLyB2ZXJzaW9uXG4gIHVwZGF0ZUxvZ2dpbmc6IGJvb2xlYW47IC8vIGxvZ2dpbmdcbiAgdXBkYXRlRW5jcnlwdGlvbjogYm9vbGVhbjsgLy8gZW5jcnlwdGlvbiAoY2Fubm90IGJlIHVwZGF0ZWQpXG4gIHVwZGF0ZUFjY2VzczogYm9vbGVhbjsgLy8gcmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyBhbmQgZW5kcG9pbnRQdWJsaWNBY2Nlc3Ncbn1cblxuZnVuY3Rpb24gYW5hbHl6ZVVwZGF0ZShvbGRQcm9wczogUGFydGlhbDxFS1MuQ3JlYXRlQ2x1c3RlckNvbW1hbmRJbnB1dD4sIG5ld1Byb3BzOiBFS1MuQ3JlYXRlQ2x1c3RlckNvbW1hbmRJbnB1dCk6IFVwZGF0ZU1hcCB7XG4gIGNvbnNvbGUubG9nKCdvbGQgcHJvcHM6ICcsIEpTT04uc3RyaW5naWZ5KG9sZFByb3BzKSk7XG4gIGNvbnNvbGUubG9nKCduZXcgcHJvcHM6ICcsIEpTT04uc3RyaW5naWZ5KG5ld1Byb3BzKSk7XG5cbiAgY29uc3QgbmV3VnBjUHJvcHMgPSBuZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcgfHwge307XG4gIGNvbnN0IG9sZFZwY1Byb3BzID0gb2xkUHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnIHx8IHt9O1xuXG4gIGNvbnN0IG9sZFB1YmxpY0FjY2Vzc0NpZHJzID0gbmV3IFNldChvbGRWcGNQcm9wcy5wdWJsaWNBY2Nlc3NDaWRycyA/PyBbXSk7XG4gIGNvbnN0IG5ld1B1YmxpY0FjY2Vzc0NpZHJzID0gbmV3IFNldChuZXdWcGNQcm9wcy5wdWJsaWNBY2Nlc3NDaWRycyA/PyBbXSk7XG4gIGNvbnN0IG5ld0VuYyA9IG5ld1Byb3BzLmVuY3J5cHRpb25Db25maWcgfHwge307XG4gIGNvbnN0IG9sZEVuYyA9IG9sZFByb3BzLmVuY3J5cHRpb25Db25maWcgfHwge307XG5cbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlTmFtZTogbmV3UHJvcHMubmFtZSAhPT0gb2xkUHJvcHMubmFtZSxcbiAgICByZXBsYWNlVnBjOlxuICAgICAgSlNPTi5zdHJpbmdpZnkobmV3VnBjUHJvcHMuc3VibmV0SWRzPy5zb3J0KCkpICE9PSBKU09OLnN0cmluZ2lmeShvbGRWcGNQcm9wcy5zdWJuZXRJZHM/LnNvcnQoKSkgfHxcbiAgICAgIEpTT04uc3RyaW5naWZ5KG5ld1ZwY1Byb3BzLnNlY3VyaXR5R3JvdXBJZHM/LnNvcnQoKSkgIT09IEpTT04uc3RyaW5naWZ5KG9sZFZwY1Byb3BzLnNlY3VyaXR5R3JvdXBJZHM/LnNvcnQoKSksXG4gICAgdXBkYXRlQWNjZXNzOlxuICAgICAgbmV3VnBjUHJvcHMuZW5kcG9pbnRQcml2YXRlQWNjZXNzICE9PSBvbGRWcGNQcm9wcy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgfHxcbiAgICAgIG5ld1ZwY1Byb3BzLmVuZHBvaW50UHVibGljQWNjZXNzICE9PSBvbGRWcGNQcm9wcy5lbmRwb2ludFB1YmxpY0FjY2VzcyB8fFxuICAgICAgIXNldHNFcXVhbChuZXdQdWJsaWNBY2Nlc3NDaWRycywgb2xkUHVibGljQWNjZXNzQ2lkcnMpLFxuICAgIHJlcGxhY2VSb2xlOiBuZXdQcm9wcy5yb2xlQXJuICE9PSBvbGRQcm9wcy5yb2xlQXJuLFxuICAgIHVwZGF0ZVZlcnNpb246IG5ld1Byb3BzLnZlcnNpb24gIT09IG9sZFByb3BzLnZlcnNpb24sXG4gICAgdXBkYXRlRW5jcnlwdGlvbjogSlNPTi5zdHJpbmdpZnkobmV3RW5jKSAhPT0gSlNPTi5zdHJpbmdpZnkob2xkRW5jKSxcbiAgICB1cGRhdGVMb2dnaW5nOiBKU09OLnN0cmluZ2lmeShuZXdQcm9wcy5sb2dnaW5nKSAhPT0gSlNPTi5zdHJpbmdpZnkob2xkUHJvcHMubG9nZ2luZyksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldHNFcXVhbChmaXJzdDogU2V0PHN0cmluZz4sIHNlY29uZDogU2V0PHN0cmluZz4pIHtcbiAgcmV0dXJuIGZpcnN0LnNpemUgPT09IHNlY29uZC5zaXplICYmIFsuLi5maXJzdF0uZXZlcnkoKGU6IHN0cmluZykgPT4gc2Vjb25kLmhhcyhlKSk7XG59XG4iXX0=