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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtCQUErQjs7O0FBTS9CLHFDQUFxRTtBQUNyRSxxREFBdUQ7QUFHdkQsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLENBQUM7QUFFakMsTUFBYSxzQkFBdUIsU0FBUSx3QkFBZTtJQUN6RCxJQUFXLFdBQVc7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUM7U0FDL0U7UUFFRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztLQUNoQztJQUtELFlBQVksR0FBYyxFQUFFLEtBQW9CO1FBQzlDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzlGLDhGQUE4RjtRQUM5RixNQUFNLFFBQVEsR0FBMEMsSUFBQSxvQ0FBbUIsRUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0tBQzFDO0lBRUQsU0FBUztJQUNULFNBQVM7SUFDVCxTQUFTO0lBRUMsS0FBSyxDQUFDLFFBQVE7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFF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QW9CLEVBQUUsb0JBQW9CLENBQUM7UUFDeEQsV0FBVyxFQUFFLFFBQVEsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLE9BQU87UUFDbEQsYUFBYSxFQUFFLFFBQVEsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLE9BQU87UUFDcEQsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNuRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0tBQ3JGLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsS0FBa0IsRUFBRSxNQUFtQjtJQUN4RCxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVzcG9uc2UgfSBmcm9tICcuLi8uLi8uLi9jdXN0b20tcmVzb3VyY2VzL2xpYi9wcm92aWRlci1mcmFtZXdvcmsvdHlwZXMnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgYXdzIGZyb20gJ2F3cy1zZGsnO1xuaW1wb3J0IHsgRWtzQ2xpZW50LCBSZXNvdXJjZUV2ZW50LCBSZXNvdXJjZUhhbmRsZXIgfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgeyBjb21wYXJlTG9nZ2luZ1Byb3BzIH0gZnJvbSAnLi9jb21wYXJlTG9nZ2luZyc7XG5cblxuY29uc3QgTUFYX0NMVVNURVJfTkFNRV9MRU4gPSAxMDA7XG5cbmV4cG9ydCBjbGFzcyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyIGV4dGVuZHMgUmVzb3VyY2VIYW5kbGVyIHtcbiAgcHVibGljIGdldCBjbHVzdGVyTmFtZSgpIHtcbiAgICBpZiAoIXRoaXMucGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZXRlcm1pbmUgY2x1c3RlciBuYW1lIHdpdGhvdXQgcGh5c2ljYWwgcmVzb3VyY2UgSUQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5waHlzaWNhbFJlc291cmNlSWQ7XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IG5ld1Byb3BzOiBhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0O1xuICBwcml2YXRlIHJlYWRvbmx5IG9sZFByb3BzOiBQYXJ0aWFsPGF3cy5FS1MuQ3JlYXRlQ2x1c3RlclJlcXVlc3Q+O1xuXG4gIGNvbnN0cnVjdG9yKGVrczogRWtzQ2xpZW50LCBldmVudDogUmVzb3VyY2VFdmVudCkge1xuICAgIHN1cGVyKGVrcywgZXZlbnQpO1xuXG4gICAgdGhpcy5uZXdQcm9wcyA9IHBhcnNlUHJvcHModGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgIHRoaXMub2xkUHJvcHMgPSBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScgPyBwYXJzZVByb3BzKGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcykgOiB7fTtcbiAgICAvLyBjb21wYXJlIG5ld1Byb3BzIGFuZCBvbGRQcm9wcyBhbmQgdXBkYXRlIHRoZSBuZXdQcm9wcyBieSBhcHBlbmRpbmcgZGlzYWJsZWQgTG9nU2V0dXAgaWYgYW55XG4gICAgY29uc3QgY29tcGFyZWQ6IFBhcnRpYWw8YXdzLkVLUy5DcmVhdGVDbHVzdGVyUmVxdWVzdD4gPSBjb21wYXJlTG9nZ2luZ1Byb3BzKHRoaXMub2xkUHJvcHMsIHRoaXMubmV3UHJvcHMpO1xuICAgIHRoaXMubmV3UHJvcHMubG9nZ2luZyA9IGNvbXBhcmVkLmxvZ2dpbmc7XG4gIH1cblxuICAvLyAtLS0tLS1cbiAgLy8gQ1JFQVRFXG4gIC8vIC0tLS0tLVxuXG4gIHByb3RlY3RlZCBhc3luYyBvbkNyZWF0ZSgpOiBQcm9taXNlPE9uRXZlbnRSZXNwb25zZT4ge1xuICAgIGNvbnNvbGUubG9nKCdvbkNyZWF0ZTogY3JlYXRpbmcgY2x1c3RlciB3aXRoIG9wdGlvbnM6JywgSlNPTi5zdHJpbmdpZnkodGhpcy5uZXdQcm9wcywgdW5kZWZpbmVkLCAyKSk7XG4gICAgaWYgKCF0aGlzLm5ld1Byb3BzLnJvbGVBcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJyb2xlQXJuXCIgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjbHVzdGVyTmFtZSA9IHRoaXMubmV3UHJvcHMubmFtZSB8fCB0aGlzLmdlbmVyYXRlQ2x1c3Rlck5hbWUoKTtcblxuICAgIGNvbnN0IHJlc3AgPSBhd2FpdCB0aGlzLmVrcy5jcmVhdGVDbHVzdGVyKHtcbiAgICAgIC4uLnRoaXMubmV3UHJvcHMsXG4gICAgICBuYW1lOiBjbHVzdGVyTmFtZSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcC5jbHVzdGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHdoZW4gdHJ5aW5nIHRvIGNyZWF0ZSBjbHVzdGVyICR7Y2x1c3Rlck5hbWV9OiBDcmVhdGVDbHVzdGVyIHJldHVybmVkIHdpdGhvdXQgY2x1c3RlciBpbmZvcm1hdGlvbmApO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHJlc3AuY2x1c3Rlci5uYW1lLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNDcmVhdGVDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSgpO1xuICB9XG5cbiAgLy8gLS0tLS0tXG4gIC8vIERFTEVURVxuICAvLyAtLS0tLS1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25EZWxldGUoKTogUHJvbWlzZTxPbkV2ZW50UmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZyhgb25EZWxldGU6IGRlbGV0aW5nIGNsdXN0ZXIgJHt0aGlzLmNsdXN0ZXJOYW1lfWApO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmVrcy5kZWxldGVDbHVzdGVyKHsgbmFtZTogdGhpcy5jbHVzdGVyTmFtZSB9KTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIGlmIChlLmNvZGUgIT09ICdSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uJykge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coYGNsdXN0ZXIgJHt0aGlzLmNsdXN0ZXJOYW1lfSBub3QgZm91bmQsIGlkZW1wb3RlbnRseSBzdWNjZWVkZWRgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogdGhpcy5jbHVzdGVyTmFtZSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzRGVsZXRlQ29tcGxldGUoKTogUHJvbWlzZTxJc0NvbXBsZXRlUmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZyhgaXNEZWxldGVDb21wbGV0ZTogd2FpdGluZyBmb3IgY2x1c3RlciAke3RoaXMuY2x1c3Rlck5hbWV9IHRvIGJlIGRlbGV0ZWRgKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwID0gYXdhaXQgdGhpcy5la3MuZGVzY3JpYmVDbHVzdGVyKHsgbmFtZTogdGhpcy5jbHVzdGVyTmFtZSB9KTtcbiAgICAgIGNvbnNvbGUubG9nKCdkZXNjcmliZUNsdXN0ZXIgcmV0dXJuZWQ6JywgSlNPTi5zdHJpbmdpZnkocmVzcCwgdW5kZWZpbmVkLCAyKSk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoZS5jb2RlID09PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JlY2VpdmVkIFJlc291cmNlTm90Rm91bmRFeGNlcHRpb24sIHRoaXMgbWVhbnMgdGhlIGNsdXN0ZXIgaGFzIGJlZW4gZGVsZXRlZCAob3IgbmV2ZXIgZXhpc3RlZCknKTtcbiAgICAgICAgcmV0dXJuIHsgSXNDb21wbGV0ZTogdHJ1ZSB9O1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygnZGVzY3JpYmVDbHVzdGVyIGVycm9yOicsIGUpO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSXNDb21wbGV0ZTogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIC8vIC0tLS0tLVxuICAvLyBVUERBVEVcbiAgLy8gLS0tLS0tXG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uVXBkYXRlKCkge1xuICAgIGNvbnN0IHVwZGF0ZXMgPSBhbmFseXplVXBkYXRlKHRoaXMub2xkUHJvcHMsIHRoaXMubmV3UHJvcHMpO1xuICAgIGNvbnNvbGUubG9nKCdvblVwZGF0ZTonLCBKU09OLnN0cmluZ2lmeSh7IHVwZGF0ZXMgfSwgdW5kZWZpbmVkLCAyKSk7XG5cbiAgICAvLyB1cGRhdGVzIHRvIGVuY3J5cHRpb24gY29uZmlnIGlzIG5vdCBzdXBwb3J0ZWRcbiAgICBpZiAodXBkYXRlcy51cGRhdGVFbmNyeXB0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1cGRhdGUgY2x1c3RlciBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24nKTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGVyZSBpcyBhbiB1cGRhdGUgdGhhdCByZXF1aXJlcyByZXBsYWNlbWVudCwgZ28gYWhlYWQgYW5kIGp1c3QgY3JlYXRlXG4gICAgLy8gYSBuZXcgY2x1c3RlciB3aXRoIHRoZSBuZXcgY29uZmlnLiBUaGUgb2xkIGNsdXN0ZXIgd2lsbCBhdXRvbWF0aWNhbGx5IGJlXG4gICAgLy8gZGVsZXRlZCBieSBjbG91ZGZvcm1hdGlvbiB1cG9uIHN1Y2Nlc3MuXG4gICAgaWYgKHVwZGF0ZXMucmVwbGFjZU5hbWUgfHwgdXBkYXRlcy5yZXBsYWNlUm9sZSB8fCB1cGRhdGVzLnJlcGxhY2VWcGMpIHtcblxuICAgICAgLy8gaWYgd2UgYXJlIHJlcGxhY2luZyB0aGlzIGNsdXN0ZXIgYW5kIHRoZSBjbHVzdGVyIGhhcyBhbiBleHBsaWNpdFxuICAgICAgLy8gcGh5c2ljYWwgbmFtZSwgdGhlIGNyZWF0aW9uIG9mIHRoZSBuZXcgY2x1c3RlciB3aWxsIGZhaWwgd2l0aCBcInRoZXJlIGlzXG4gICAgICAvLyBhbHJlYWR5IGEgY2x1c3RlciB3aXRoIHRoYXQgbmFtZVwiLiB0aGlzIGlzIGEgY29tbW9uIGJlaGF2aW9yIGZvclxuICAgICAgLy8gQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2VzIHRoYXQgc3VwcG9ydCBzcGVjaWZ5aW5nIGEgcGh5c2ljYWwgbmFtZS5cbiAgICAgIGlmICh0aGlzLm9sZFByb3BzLm5hbWUgPT09IHRoaXMubmV3UHJvcHMubmFtZSAmJiB0aGlzLm9sZFByb3BzLm5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmVwbGFjZSBjbHVzdGVyIFwiJHt0aGlzLm9sZFByb3BzLm5hbWV9XCIgc2luY2UgaXQgaGFzIGFuIGV4cGxpY2l0IHBoeXNpY2FsIG5hbWUuIEVpdGhlciByZW5hbWUgdGhlIGNsdXN0ZXIgb3IgcmVtb3ZlIHRoZSBcIm5hbWVcIiBjb25maWd1cmF0aW9uYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm9uQ3JlYXRlKCk7XG4gICAgfVxuXG4gICAgLy8gaWYgYSB2ZXJzaW9uIHVwZGF0ZSBpcyByZXF1aXJlZCwgaXNzdWUgdGhlIHZlcnNpb24gdXBkYXRlXG4gICAgaWYgKHVwZGF0ZXMudXBkYXRlVmVyc2lvbikge1xuICAgICAgaWYgKCF0aGlzLm5ld1Byb3BzLnZlcnNpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmVtb3ZlIGNsdXN0ZXIgdmVyc2lvbiBjb25maWd1cmF0aW9uLiBDdXJyZW50IHZlcnNpb24gaXMgJHt0aGlzLm9sZFByb3BzLnZlcnNpb259YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUNsdXN0ZXJWZXJzaW9uKHRoaXMubmV3UHJvcHMudmVyc2lvbik7XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZXMudXBkYXRlTG9nZ2luZyAmJiB1cGRhdGVzLnVwZGF0ZUFjY2Vzcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXBkYXRlIGxvZ2dpbmcgYW5kIGFjY2VzcyBhdCB0aGUgc2FtZSB0aW1lJyk7XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZXMudXBkYXRlTG9nZ2luZyB8fCB1cGRhdGVzLnVwZGF0ZUFjY2Vzcykge1xuICAgICAgY29uc3QgY29uZmlnOiBhd3MuRUtTLlVwZGF0ZUNsdXN0ZXJDb25maWdSZXF1ZXN0ID0ge1xuICAgICAgICBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lLFxuICAgICAgfTtcbiAgICAgIGlmICh1cGRhdGVzLnVwZGF0ZUxvZ2dpbmcpIHtcbiAgICAgICAgY29uZmlnLmxvZ2dpbmcgPSB0aGlzLm5ld1Byb3BzLmxvZ2dpbmc7XG4gICAgICB9O1xuICAgICAgaWYgKHVwZGF0ZXMudXBkYXRlQWNjZXNzKSB7XG4gICAgICAgIC8vIFVwZGF0aW5nIHRoZSBjbHVzdGVyIHdpdGggc2VjdXJpdHlHcm91cElkcyBhbmQgc3VibmV0SWRzIChhcyBzcGVjaWZpZWQgaW4gdGhlIHdhcm5pbmcgaGVyZTpcbiAgICAgICAgLy8gaHR0cHM6Ly9hd3NjbGkuYW1hem9uYXdzLmNvbS92Mi9kb2N1bWVudGF0aW9uL2FwaS9sYXRlc3QvcmVmZXJlbmNlL2Vrcy91cGRhdGUtY2x1c3Rlci1jb25maWcuaHRtbClcbiAgICAgICAgLy8gd2lsbCBmYWlsLCB0aGVyZWZvcmUgd2UgdGFrZSBvbmx5IHRoZSBhY2Nlc3MgZmllbGRzIGV4cGxpY2l0bHlcbiAgICAgICAgY29uZmlnLnJlc291cmNlc1ZwY0NvbmZpZyA9IHtcbiAgICAgICAgICBlbmRwb2ludFByaXZhdGVBY2Nlc3M6IHRoaXMubmV3UHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyxcbiAgICAgICAgICBlbmRwb2ludFB1YmxpY0FjY2VzczogdGhpcy5uZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQdWJsaWNBY2Nlc3MsXG4gICAgICAgICAgcHVibGljQWNjZXNzQ2lkcnM6IHRoaXMubmV3UHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnLnB1YmxpY0FjY2Vzc0NpZHJzLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgY29uc3QgdXBkYXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy51cGRhdGVDbHVzdGVyQ29uZmlnKGNvbmZpZyk7XG5cbiAgICAgIHJldHVybiB7IEVrc1VwZGF0ZUlkOiB1cGRhdGVSZXNwb25zZS51cGRhdGU/LmlkIH07XG4gICAgfVxuXG4gICAgLy8gbm8gdXBkYXRlc1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc1VwZGF0ZUNvbXBsZXRlKCkge1xuICAgIGNvbnNvbGUubG9nKCdpc1VwZGF0ZUNvbXBsZXRlJyk7XG5cbiAgICAvLyBpZiB0aGlzIGlzIGFuIEVLUyB1cGRhdGUsIHdlIHdpbGwgbW9uaXRvciB0aGUgdXBkYXRlIGV2ZW50IGl0c2VsZlxuICAgIGlmICh0aGlzLmV2ZW50LkVrc1VwZGF0ZUlkKSB7XG4gICAgICBjb25zdCBjb21wbGV0ZSA9IGF3YWl0IHRoaXMuaXNFa3NVcGRhdGVDb21wbGV0ZSh0aGlzLmV2ZW50LkVrc1VwZGF0ZUlkKTtcbiAgICAgIGlmICghY29tcGxldGUpIHtcbiAgICAgICAgcmV0dXJuIHsgSXNDb21wbGV0ZTogZmFsc2UgfTtcbiAgICAgIH1cblxuICAgICAgLy8gZmFsbCB0aHJvdWdoOiBpZiB0aGUgdXBkYXRlIGlzIGRvbmUsIHdlIHNpbXBseSBkZWxlZ2F0ZSB0byBpc0FjdGl2ZSgpXG4gICAgICAvLyBpbiBvcmRlciB0byBleHRyYWN0IGF0dHJpYnV0ZXMgYW5kIHN0YXRlIGZyb20gdGhlIGNsdXN0ZXIgaXRzZWxmLCB3aGljaFxuICAgICAgLy8gaXMgc3VwcG9zZWQgdG8gYmUgaW4gYW4gQUNUSVZFIHN0YXRlIGFmdGVyIHRoZSB1cGRhdGUgaXMgY29tcGxldGUuXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXNBY3RpdmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdXBkYXRlQ2x1c3RlclZlcnNpb24obmV3VmVyc2lvbjogc3RyaW5nKSB7XG4gICAgY29uc29sZS5sb2coYHVwZGF0aW5nIGNsdXN0ZXIgdmVyc2lvbiB0byAke25ld1ZlcnNpb259YCk7XG5cbiAgICAvLyB1cGRhdGUtY2x1c3Rlci12ZXJzaW9uIHdpbGwgZmFpbCBpZiB3ZSB0cnkgdG8gdXBkYXRlIHRvIHRoZSBzYW1lIHZlcnNpb24sXG4gICAgLy8gc28gc2tpcCBpbiB0aGlzIGNhc2UuXG4gICAgY29uc3QgY2x1c3RlciA9IChhd2FpdCB0aGlzLmVrcy5kZXNjcmliZUNsdXN0ZXIoeyBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lIH0pKS5jbHVzdGVyO1xuICAgIGlmIChjbHVzdGVyPy52ZXJzaW9uID09PSBuZXdWZXJzaW9uKSB7XG4gICAgICBjb25zb2xlLmxvZyhgY2x1c3RlciBhbHJlYWR5IGF0IHZlcnNpb24gJHtjbHVzdGVyLnZlcnNpb259LCBza2lwcGluZyB2ZXJzaW9uIHVwZGF0ZWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MudXBkYXRlQ2x1c3RlclZlcnNpb24oeyBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lLCB2ZXJzaW9uOiBuZXdWZXJzaW9uIH0pO1xuICAgIHJldHVybiB7IEVrc1VwZGF0ZUlkOiB1cGRhdGVSZXNwb25zZS51cGRhdGU/LmlkIH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGlzQWN0aXZlKCk6IFByb21pc2U8SXNDb21wbGV0ZVJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5sb2coJ3dhaXRpbmcgZm9yIGNsdXN0ZXIgdG8gYmVjb21lIEFDVElWRScpO1xuICAgIGNvbnN0IHJlc3AgPSBhd2FpdCB0aGlzLmVrcy5kZXNjcmliZUNsdXN0ZXIoeyBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lIH0pO1xuICAgIGNvbnNvbGUubG9nKCdkZXNjcmliZUNsdXN0ZXIgcmVzdWx0OicsIEpTT04uc3RyaW5naWZ5KHJlc3AsIHVuZGVmaW5lZCwgMikpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSByZXNwLmNsdXN0ZXI7XG5cbiAgICAvLyBpZiBjbHVzdGVyIGlzIHVuZGVmaW5lZCAoc2hvdWxkbnQgaGFwcGVuKSBvciBzdGF0dXMgaXMgbm90IEFDVElWRSwgd2UgYXJlXG4gICAgLy8gbm90IGNvbXBsZXRlLiBub3RlIHRoYXQgdGhlIGN1c3RvbSByZXNvdXJjZSBwcm92aWRlciBmcmFtZXdvcmsgZm9yYmlkc1xuICAgIC8vIHJldHVybmluZyBhdHRyaWJ1dGVzIChEYXRhKSBpZiBpc0NvbXBsZXRlIGlzIGZhbHNlLlxuICAgIGlmIChjbHVzdGVyPy5zdGF0dXMgPT09ICdGQUlMRUQnKSB7XG4gICAgICAvLyBub3QgdmVyeSBpbmZvcm1hdGl2ZSwgdW5mb3J0dW5hdGVseSB0aGUgcmVzcG9uc2UgZG9lc24ndCBjb250YWluIGFueSBlcnJvclxuICAgICAgLy8gaW5mb3JtYXRpb24gOlxcXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NsdXN0ZXIgaXMgaW4gYSBGQUlMRUQgc3RhdHVzJyk7XG4gICAgfSBlbHNlIGlmIChjbHVzdGVyPy5zdGF0dXMgIT09ICdBQ1RJVkUnKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBJc0NvbXBsZXRlOiBmYWxzZSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIElzQ29tcGxldGU6IHRydWUsXG4gICAgICAgIERhdGE6IHtcbiAgICAgICAgICBOYW1lOiBjbHVzdGVyLm5hbWUsXG4gICAgICAgICAgRW5kcG9pbnQ6IGNsdXN0ZXIuZW5kcG9pbnQsXG4gICAgICAgICAgQXJuOiBjbHVzdGVyLmFybixcblxuICAgICAgICAgIC8vIElNUE9SVEFOVDogQ0ZOIGV4cGVjdHMgdGhhdCBhdHRyaWJ1dGVzIHdpbGwgKmFsd2F5cyogaGF2ZSB2YWx1ZXMsXG4gICAgICAgICAgLy8gc28gcmV0dXJuIGFuIGVtcHR5IHN0cmluZyBpbiBjYXNlIHRoZSB2YWx1ZSBpcyBub3QgZGVmaW5lZC5cbiAgICAgICAgICAvLyBPdGhlcndpc2UsIENGTiB3aWxsIHRocm93IHdpdGggYFZlbmRvciByZXNwb25zZSBkb2Vzbid0IGNvbnRhaW5cbiAgICAgICAgICAvLyBYWFhYIGtleWAuXG5cbiAgICAgICAgICBDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE6IGNsdXN0ZXIuY2VydGlmaWNhdGVBdXRob3JpdHk/LmRhdGEgPz8gJycsXG4gICAgICAgICAgQ2x1c3RlclNlY3VyaXR5R3JvdXBJZDogY2x1c3Rlci5yZXNvdXJjZXNWcGNDb25maWc/LmNsdXN0ZXJTZWN1cml0eUdyb3VwSWQgPz8gJycsXG4gICAgICAgICAgT3BlbklkQ29ubmVjdElzc3VlclVybDogY2x1c3Rlci5pZGVudGl0eT8ub2lkYz8uaXNzdWVyID8/ICcnLFxuICAgICAgICAgIE9wZW5JZENvbm5lY3RJc3N1ZXI6IGNsdXN0ZXIuaWRlbnRpdHk/Lm9pZGM/Lmlzc3Vlcj8uc3Vic3RyaW5nKDgpID8/ICcnLCAvLyBTdHJpcHMgb2ZmIGh0dHBzOi8vIGZyb20gdGhlIGlzc3VlciB1cmxcblxuICAgICAgICAgIC8vIFdlIGNhbiBzYWZlbHkgcmV0dXJuIHRoZSBmaXJzdCBpdGVtIGZyb20gZW5jcnlwdGlvbiBjb25maWd1cmF0aW9uIGFycmF5LCBiZWNhdXNlIGl0IGhhcyBhIGxpbWl0IG9mIDEgaXRlbVxuICAgICAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfQ3JlYXRlQ2x1c3Rlci5odG1sI0FtYXpvbkVLUy1DcmVhdGVDbHVzdGVyLXJlcXVlc3QtZW5jcnlwdGlvbkNvbmZpZ1xuICAgICAgICAgIEVuY3J5cHRpb25Db25maWdLZXlBcm46IGNsdXN0ZXIuZW5jcnlwdGlvbkNvbmZpZz8uc2hpZnQoKT8ucHJvdmlkZXI/LmtleUFybiA/PyAnJyxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpc0Vrc1VwZGF0ZUNvbXBsZXRlKGVrc1VwZGF0ZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLmxvZyh7IGlzRWtzVXBkYXRlQ29tcGxldGU6IGVrc1VwZGF0ZUlkIH0pO1xuXG4gICAgY29uc3QgZGVzY3JpYmVVcGRhdGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlVXBkYXRlKHtcbiAgICAgIG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsXG4gICAgICB1cGRhdGVJZDogZWtzVXBkYXRlSWQsXG4gICAgfSk7XG5cbiAgICB0aGlzLmxvZyh7IGRlc2NyaWJlVXBkYXRlUmVzcG9uc2UgfSk7XG5cbiAgICBpZiAoIWRlc2NyaWJlVXBkYXRlUmVzcG9uc2UudXBkYXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuYWJsZSB0byBkZXNjcmliZSB1cGRhdGUgd2l0aCBpZCBcIiR7ZWtzVXBkYXRlSWR9XCJgKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGRlc2NyaWJlVXBkYXRlUmVzcG9uc2UudXBkYXRlLnN0YXR1cykge1xuICAgICAgY2FzZSAnSW5Qcm9ncmVzcyc6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ1N1Y2Nlc3NmdWwnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ0ZhaWxlZCc6XG4gICAgICBjYXNlICdDYW5jZWxsZWQnOlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGNsdXN0ZXIgdXBkYXRlIGlkIFwiJHtla3NVcGRhdGVJZH1cIiBmYWlsZWQgd2l0aCBlcnJvcnM6ICR7SlNPTi5zdHJpbmdpZnkoZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUuZXJyb3JzKX1gKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdW5rbm93biBzdGF0dXMgXCIke2Rlc2NyaWJlVXBkYXRlUmVzcG9uc2UudXBkYXRlLnN0YXR1c31cIiBmb3IgdXBkYXRlIGlkIFwiJHtla3NVcGRhdGVJZH1cImApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVDbHVzdGVyTmFtZSgpIHtcbiAgICBjb25zdCBzdWZmaXggPSB0aGlzLnJlcXVlc3RJZC5yZXBsYWNlKC8tL2csICcnKTsgLy8gMzIgY2hhcnNcbiAgICBjb25zdCBvZmZzZXQgPSBNQVhfQ0xVU1RFUl9OQU1FX0xFTiAtIHN1ZmZpeC5sZW5ndGggLSAxO1xuICAgIGNvbnN0IHByZWZpeCA9IHRoaXMubG9naWNhbFJlc291cmNlSWQuc2xpY2UoMCwgb2Zmc2V0ID4gMCA/IG9mZnNldCA6IDApO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7c3VmZml4fWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VQcm9wcyhwcm9wczogYW55KTogYXdzLkVLUy5DcmVhdGVDbHVzdGVyUmVxdWVzdCB7XG5cbiAgY29uc3QgcGFyc2VkID0gcHJvcHM/LkNvbmZpZyA/PyB7fTtcblxuICAvLyB0aGlzIGlzIHdlaXJkIGJ1dCB0aGVzZSBib29sZWFuIHByb3BlcnRpZXMgYXJlIHBhc3NlZCBieSBDRk4gYXMgYSBzdHJpbmcsIGFuZCB3ZSBuZWVkIHRoZW0gdG8gYmUgYm9vbGVhbmljIGZvciB0aGUgU0RLLlxuICAvLyBPdGhlcndpc2UgaXQgZmFpbHMgd2l0aCAnVW5leHBlY3RlZCBQYXJhbWV0ZXI6IHBhcmFtcy5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQcml2YXRlQWNjZXNzIGlzIGV4cGVjdGVkIHRvIGJlIGEgYm9vbGVhbidcblxuICBpZiAodHlwZW9mIChwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnPy5lbmRwb2ludFByaXZhdGVBY2Nlc3MpID09PSAnc3RyaW5nJykge1xuICAgIHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQcml2YXRlQWNjZXNzID0gcGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgPT09ICd0cnVlJztcbiAgfVxuXG4gIGlmICh0eXBlb2YgKHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWc/LmVuZHBvaW50UHVibGljQWNjZXNzKSA9PT0gJ3N0cmluZycpIHtcbiAgICBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHVibGljQWNjZXNzID0gcGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFB1YmxpY0FjY2VzcyA9PT0gJ3RydWUnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiAocGFyc2VkLmxvZ2dpbmc/LmNsdXN0ZXJMb2dnaW5nWzBdLmVuYWJsZWQpID09PSAnc3RyaW5nJykge1xuICAgIHBhcnNlZC5sb2dnaW5nLmNsdXN0ZXJMb2dnaW5nWzBdLmVuYWJsZWQgPSBwYXJzZWQubG9nZ2luZy5jbHVzdGVyTG9nZ2luZ1swXS5lbmFibGVkID09PSAndHJ1ZSc7XG4gIH1cblxuICByZXR1cm4gcGFyc2VkO1xuXG59XG5cbmludGVyZmFjZSBVcGRhdGVNYXAge1xuICByZXBsYWNlTmFtZTogYm9vbGVhbjsgLy8gbmFtZVxuICByZXBsYWNlVnBjOiBib29sZWFuOyAvLyByZXNvdXJjZXNWcGNDb25maWcuc3VibmV0SWRzIGFuZCBzZWN1cml0eUdyb3VwSWRzXG4gIHJlcGxhY2VSb2xlOiBib29sZWFuOyAvLyByb2xlQXJuXG5cbiAgdXBkYXRlVmVyc2lvbjogYm9vbGVhbjsgLy8gdmVyc2lvblxuICB1cGRhdGVMb2dnaW5nOiBib29sZWFuOyAvLyBsb2dnaW5nXG4gIHVwZGF0ZUVuY3J5cHRpb246IGJvb2xlYW47IC8vIGVuY3J5cHRpb24gKGNhbm5vdCBiZSB1cGRhdGVkKVxuICB1cGRhdGVBY2Nlc3M6IGJvb2xlYW47IC8vIHJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgYW5kIGVuZHBvaW50UHVibGljQWNjZXNzXG59XG5cbmZ1bmN0aW9uIGFuYWx5emVVcGRhdGUob2xkUHJvcHM6IFBhcnRpYWw8YXdzLkVLUy5DcmVhdGVDbHVzdGVyUmVxdWVzdD4sIG5ld1Byb3BzOiBhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0KTogVXBkYXRlTWFwIHtcbiAgY29uc29sZS5sb2coJ29sZCBwcm9wczogJywgSlNPTi5zdHJpbmdpZnkob2xkUHJvcHMpKTtcbiAgY29uc29sZS5sb2coJ25ldyBwcm9wczogJywgSlNPTi5zdHJpbmdpZnkobmV3UHJvcHMpKTtcblxuICBjb25zdCBuZXdWcGNQcm9wcyA9IG5ld1Byb3BzLnJlc291cmNlc1ZwY0NvbmZpZyB8fCB7fTtcbiAgY29uc3Qgb2xkVnBjUHJvcHMgPSBvbGRQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcgfHwge307XG5cbiAgY29uc3Qgb2xkUHVibGljQWNjZXNzQ2lkcnMgPSBuZXcgU2V0KG9sZFZwY1Byb3BzLnB1YmxpY0FjY2Vzc0NpZHJzID8/IFtdKTtcbiAgY29uc3QgbmV3UHVibGljQWNjZXNzQ2lkcnMgPSBuZXcgU2V0KG5ld1ZwY1Byb3BzLnB1YmxpY0FjY2Vzc0NpZHJzID8/IFtdKTtcbiAgY29uc3QgbmV3RW5jID0gbmV3UHJvcHMuZW5jcnlwdGlvbkNvbmZpZyB8fCB7fTtcbiAgY29uc3Qgb2xkRW5jID0gb2xkUHJvcHMuZW5jcnlwdGlvbkNvbmZpZyB8fCB7fTtcblxuICByZXR1cm4ge1xuICAgIHJlcGxhY2VOYW1lOiBuZXdQcm9wcy5uYW1lICE9PSBvbGRQcm9wcy5uYW1lLFxuICAgIHJlcGxhY2VWcGM6XG4gICAgICBKU09OLnN0cmluZ2lmeShuZXdWcGNQcm9wcy5zdWJuZXRJZHM/LnNvcnQoKSkgIT09IEpTT04uc3RyaW5naWZ5KG9sZFZwY1Byb3BzLnN1Ym5ldElkcz8uc29ydCgpKSB8fFxuICAgICAgSlNPTi5zdHJpbmdpZnkobmV3VnBjUHJvcHMuc2VjdXJpdHlHcm91cElkcz8uc29ydCgpKSAhPT0gSlNPTi5zdHJpbmdpZnkob2xkVnBjUHJvcHMuc2VjdXJpdHlHcm91cElkcz8uc29ydCgpKSxcbiAgICB1cGRhdGVBY2Nlc3M6XG4gICAgICBuZXdWcGNQcm9wcy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgIT09IG9sZFZwY1Byb3BzLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyB8fFxuICAgICAgbmV3VnBjUHJvcHMuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgIT09IG9sZFZwY1Byb3BzLmVuZHBvaW50UHVibGljQWNjZXNzIHx8XG4gICAgICAhc2V0c0VxdWFsKG5ld1B1YmxpY0FjY2Vzc0NpZHJzLCBvbGRQdWJsaWNBY2Nlc3NDaWRycyksXG4gICAgcmVwbGFjZVJvbGU6IG5ld1Byb3BzLnJvbGVBcm4gIT09IG9sZFByb3BzLnJvbGVBcm4sXG4gICAgdXBkYXRlVmVyc2lvbjogbmV3UHJvcHMudmVyc2lvbiAhPT0gb2xkUHJvcHMudmVyc2lvbixcbiAgICB1cGRhdGVFbmNyeXB0aW9uOiBKU09OLnN0cmluZ2lmeShuZXdFbmMpICE9PSBKU09OLnN0cmluZ2lmeShvbGRFbmMpLFxuICAgIHVwZGF0ZUxvZ2dpbmc6IEpTT04uc3RyaW5naWZ5KG5ld1Byb3BzLmxvZ2dpbmcpICE9PSBKU09OLnN0cmluZ2lmeShvbGRQcm9wcy5sb2dnaW5nKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2V0c0VxdWFsKGZpcnN0OiBTZXQ8c3RyaW5nPiwgc2Vjb25kOiBTZXQ8c3RyaW5nPikge1xuICByZXR1cm4gZmlyc3Quc2l6ZSA9PT0gc2Vjb25kLnNpemUgJiYgWy4uLmZpcnN0XS5ldmVyeSgoZTogc3RyaW5nKSA9PiBzZWNvbmQuaGFzKGUpKTtcbn1cbiJdfQ==