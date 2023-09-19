"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterResourceHandler = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const EKS = require("@aws-sdk/client-eks");
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
            if (!(e instanceof EKS.ResourceNotFoundException)) {
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
            // see https://aws.amazon.com/blogs/developer/service-error-handling-modular-aws-sdk-js/
            if (e instanceof EKS.ResourceNotFoundException) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtCQUErQjs7O0FBRS9CLDZEQUE2RDtBQUM3RCwyQ0FBMkM7QUFDM0MscUNBQXFFO0FBQ3JFLHFEQUF1RDtBQUd2RCxNQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQUVqQyxNQUFhLHNCQUF1QixTQUFRLHdCQUFlO0lBQ3pELElBQVcsV0FBVztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztTQUMvRTtRQUVELE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0tBQ2hDO0lBS0QsWUFBWSxHQUFjLEVBQUUsS0FBb0I7UUFDOUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsQixJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDOUYsOEZBQThGO1FBQzlGLE1BQU0sUUFBUSxHQUEyQyxJQUFBLG9DQUFtQixFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7S0FDMUM7SUFFRCxTQUFTO0lBQ1QsU0FBUztJQUNULFNBQVM7SUFFQyxLQUFLLENBQUMsUUFBUTtRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFB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LG9CQUFvQixLQUFLLFdBQVcsQ0FBQyxvQkFBb0I7WUFDckUsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEVBQUUsb0JBQW9CLENBQUM7UUFDeEQsV0FBVyxFQUFFLFFBQVEsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLE9BQU87UUFDbEQsYUFBYSxFQUFFLFFBQVEsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLE9BQU87UUFDcEQsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNuRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0tBQ3JGLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsS0FBa0IsRUFBRSxNQUFtQjtJQUN4RCxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgRUtTIGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1la3MnO1xuaW1wb3J0IHsgRWtzQ2xpZW50LCBSZXNvdXJjZUV2ZW50LCBSZXNvdXJjZUhhbmRsZXIgfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgeyBjb21wYXJlTG9nZ2luZ1Byb3BzIH0gZnJvbSAnLi9jb21wYXJlTG9nZ2luZyc7XG5pbXBvcnQgeyBJc0NvbXBsZXRlUmVzcG9uc2UsIE9uRXZlbnRSZXNwb25zZSB9IGZyb20gJy4uLy4uLy4uL2N1c3RvbS1yZXNvdXJjZXMvbGliL3Byb3ZpZGVyLWZyYW1ld29yay90eXBlcyc7XG5cbmNvbnN0IE1BWF9DTFVTVEVSX05BTUVfTEVOID0gMTAwO1xuXG5leHBvcnQgY2xhc3MgQ2x1c3RlclJlc291cmNlSGFuZGxlciBleHRlbmRzIFJlc291cmNlSGFuZGxlciB7XG4gIHB1YmxpYyBnZXQgY2x1c3Rlck5hbWUoKSB7XG4gICAgaWYgKCF0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGV0ZXJtaW5lIGNsdXN0ZXIgbmFtZSB3aXRob3V0IHBoeXNpY2FsIHJlc291cmNlIElEJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGh5c2ljYWxSZXNvdXJjZUlkO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBuZXdQcm9wczogRUtTLkNyZWF0ZUNsdXN0ZXJDb21tYW5kSW5wdXQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgb2xkUHJvcHM6IFBhcnRpYWw8RUtTLkNyZWF0ZUNsdXN0ZXJDb21tYW5kSW5wdXQ+O1xuXG4gIGNvbnN0cnVjdG9yKGVrczogRWtzQ2xpZW50LCBldmVudDogUmVzb3VyY2VFdmVudCkge1xuICAgIHN1cGVyKGVrcywgZXZlbnQpO1xuXG4gICAgdGhpcy5uZXdQcm9wcyA9IHBhcnNlUHJvcHModGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgIHRoaXMub2xkUHJvcHMgPSBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScgPyBwYXJzZVByb3BzKGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcykgOiB7fTtcbiAgICAvLyBjb21wYXJlIG5ld1Byb3BzIGFuZCBvbGRQcm9wcyBhbmQgdXBkYXRlIHRoZSBuZXdQcm9wcyBieSBhcHBlbmRpbmcgZGlzYWJsZWQgTG9nU2V0dXAgaWYgYW55XG4gICAgY29uc3QgY29tcGFyZWQ6IFBhcnRpYWw8RUtTLkNyZWF0ZUNsdXN0ZXJDb21tYW5kSW5wdXQ+ID0gY29tcGFyZUxvZ2dpbmdQcm9wcyh0aGlzLm9sZFByb3BzLCB0aGlzLm5ld1Byb3BzKTtcbiAgICB0aGlzLm5ld1Byb3BzLmxvZ2dpbmcgPSBjb21wYXJlZC5sb2dnaW5nO1xuICB9XG5cbiAgLy8gLS0tLS0tXG4gIC8vIENSRUFURVxuICAvLyAtLS0tLS1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25DcmVhdGUoKTogUHJvbWlzZTxPbkV2ZW50UmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZygnb25DcmVhdGU6IGNyZWF0aW5nIGNsdXN0ZXIgd2l0aCBvcHRpb25zOicsIEpTT04uc3RyaW5naWZ5KHRoaXMubmV3UHJvcHMsIHVuZGVmaW5lZCwgMikpO1xuICAgIGlmICghdGhpcy5uZXdQcm9wcy5yb2xlQXJuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wicm9sZUFyblwiIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgY2x1c3Rlck5hbWUgPSB0aGlzLm5ld1Byb3BzLm5hbWUgfHwgdGhpcy5nZW5lcmF0ZUNsdXN0ZXJOYW1lKCk7XG5cbiAgICBjb25zdCByZXNwID0gYXdhaXQgdGhpcy5la3MuY3JlYXRlQ2x1c3Rlcih7XG4gICAgICAuLi50aGlzLm5ld1Byb3BzLFxuICAgICAgbmFtZTogY2x1c3Rlck5hbWUsXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3AuY2x1c3Rlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciB3aGVuIHRyeWluZyB0byBjcmVhdGUgY2x1c3RlciAke2NsdXN0ZXJOYW1lfTogQ3JlYXRlQ2x1c3RlciByZXR1cm5lZCB3aXRob3V0IGNsdXN0ZXIgaW5mb3JtYXRpb25gKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiByZXNwLmNsdXN0ZXIubmFtZSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzQ3JlYXRlQ29tcGxldGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBY3RpdmUoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLVxuICAvLyBERUxFVEVcbiAgLy8gLS0tLS0tXG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uRGVsZXRlKCk6IFByb21pc2U8T25FdmVudFJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5sb2coYG9uRGVsZXRlOiBkZWxldGluZyBjbHVzdGVyICR7dGhpcy5jbHVzdGVyTmFtZX1gKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5la3MuZGVsZXRlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoIShlIGluc3RhbmNlb2YgRUtTLlJlc291cmNlTm90Rm91bmRFeGNlcHRpb24pKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhgY2x1c3RlciAke3RoaXMuY2x1c3Rlck5hbWV9IG5vdCBmb3VuZCwgaWRlbXBvdGVudGx5IHN1Y2NlZWRlZGApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiB0aGlzLmNsdXN0ZXJOYW1lLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNEZWxldGVDb21wbGV0ZSgpOiBQcm9taXNlPElzQ29tcGxldGVSZXNwb25zZT4ge1xuICAgIGNvbnNvbGUubG9nKGBpc0RlbGV0ZUNvbXBsZXRlOiB3YWl0aW5nIGZvciBjbHVzdGVyICR7dGhpcy5jbHVzdGVyTmFtZX0gdG8gYmUgZGVsZXRlZGApO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCB0aGlzLmVrcy5kZXNjcmliZUNsdXN0ZXIoeyBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lIH0pO1xuICAgICAgY29uc29sZS5sb2coJ2Rlc2NyaWJlQ2x1c3RlciByZXR1cm5lZDonLCBKU09OLnN0cmluZ2lmeShyZXNwLCB1bmRlZmluZWQsIDIpKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIC8vIHNlZSBodHRwczovL2F3cy5hbWF6b24uY29tL2Jsb2dzL2RldmVsb3Blci9zZXJ2aWNlLWVycm9yLWhhbmRsaW5nLW1vZHVsYXItYXdzLXNkay1qcy9cbiAgICAgIGlmIChlIGluc3RhbmNlb2YgRUtTLlJlc291cmNlTm90Rm91bmRFeGNlcHRpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JlY2VpdmVkIFJlc291cmNlTm90Rm91bmRFeGNlcHRpb24sIHRoaXMgbWVhbnMgdGhlIGNsdXN0ZXIgaGFzIGJlZW4gZGVsZXRlZCAob3IgbmV2ZXIgZXhpc3RlZCknKTtcbiAgICAgICAgcmV0dXJuIHsgSXNDb21wbGV0ZTogdHJ1ZSB9O1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygnZGVzY3JpYmVDbHVzdGVyIGVycm9yOicsIGUpO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSXNDb21wbGV0ZTogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIC8vIC0tLS0tLVxuICAvLyBVUERBVEVcbiAgLy8gLS0tLS0tXG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uVXBkYXRlKCkge1xuICAgIGNvbnN0IHVwZGF0ZXMgPSBhbmFseXplVXBkYXRlKHRoaXMub2xkUHJvcHMsIHRoaXMubmV3UHJvcHMpO1xuICAgIGNvbnNvbGUubG9nKCdvblVwZGF0ZTonLCBKU09OLnN0cmluZ2lmeSh7IHVwZGF0ZXMgfSwgdW5kZWZpbmVkLCAyKSk7XG5cbiAgICAvLyB1cGRhdGVzIHRvIGVuY3J5cHRpb24gY29uZmlnIGlzIG5vdCBzdXBwb3J0ZWRcbiAgICBpZiAodXBkYXRlcy51cGRhdGVFbmNyeXB0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1cGRhdGUgY2x1c3RlciBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24nKTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGVyZSBpcyBhbiB1cGRhdGUgdGhhdCByZXF1aXJlcyByZXBsYWNlbWVudCwgZ28gYWhlYWQgYW5kIGp1c3QgY3JlYXRlXG4gICAgLy8gYSBuZXcgY2x1c3RlciB3aXRoIHRoZSBuZXcgY29uZmlnLiBUaGUgb2xkIGNsdXN0ZXIgd2lsbCBhdXRvbWF0aWNhbGx5IGJlXG4gICAgLy8gZGVsZXRlZCBieSBjbG91ZGZvcm1hdGlvbiB1cG9uIHN1Y2Nlc3MuXG4gICAgaWYgKHVwZGF0ZXMucmVwbGFjZU5hbWUgfHwgdXBkYXRlcy5yZXBsYWNlUm9sZSB8fCB1cGRhdGVzLnJlcGxhY2VWcGMpIHtcblxuICAgICAgLy8gaWYgd2UgYXJlIHJlcGxhY2luZyB0aGlzIGNsdXN0ZXIgYW5kIHRoZSBjbHVzdGVyIGhhcyBhbiBleHBsaWNpdFxuICAgICAgLy8gcGh5c2ljYWwgbmFtZSwgdGhlIGNyZWF0aW9uIG9mIHRoZSBuZXcgY2x1c3RlciB3aWxsIGZhaWwgd2l0aCBcInRoZXJlIGlzXG4gICAgICAvLyBhbHJlYWR5IGEgY2x1c3RlciB3aXRoIHRoYXQgbmFtZVwiLiB0aGlzIGlzIGEgY29tbW9uIGJlaGF2aW9yIGZvclxuICAgICAgLy8gQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2VzIHRoYXQgc3VwcG9ydCBzcGVjaWZ5aW5nIGEgcGh5c2ljYWwgbmFtZS5cbiAgICAgIGlmICh0aGlzLm9sZFByb3BzLm5hbWUgPT09IHRoaXMubmV3UHJvcHMubmFtZSAmJiB0aGlzLm9sZFByb3BzLm5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmVwbGFjZSBjbHVzdGVyIFwiJHt0aGlzLm9sZFByb3BzLm5hbWV9XCIgc2luY2UgaXQgaGFzIGFuIGV4cGxpY2l0IHBoeXNpY2FsIG5hbWUuIEVpdGhlciByZW5hbWUgdGhlIGNsdXN0ZXIgb3IgcmVtb3ZlIHRoZSBcIm5hbWVcIiBjb25maWd1cmF0aW9uYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm9uQ3JlYXRlKCk7XG4gICAgfVxuXG4gICAgLy8gaWYgYSB2ZXJzaW9uIHVwZGF0ZSBpcyByZXF1aXJlZCwgaXNzdWUgdGhlIHZlcnNpb24gdXBkYXRlXG4gICAgaWYgKHVwZGF0ZXMudXBkYXRlVmVyc2lvbikge1xuICAgICAgaWYgKCF0aGlzLm5ld1Byb3BzLnZlcnNpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmVtb3ZlIGNsdXN0ZXIgdmVyc2lvbiBjb25maWd1cmF0aW9uLiBDdXJyZW50IHZlcnNpb24gaXMgJHt0aGlzLm9sZFByb3BzLnZlcnNpb259YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUNsdXN0ZXJWZXJzaW9uKHRoaXMubmV3UHJvcHMudmVyc2lvbik7XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZXMudXBkYXRlTG9nZ2luZyAmJiB1cGRhdGVzLnVwZGF0ZUFjY2Vzcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXBkYXRlIGxvZ2dpbmcgYW5kIGFjY2VzcyBhdCB0aGUgc2FtZSB0aW1lJyk7XG4gICAgfVxuXG4gICAgaWYgKHVwZGF0ZXMudXBkYXRlTG9nZ2luZyB8fCB1cGRhdGVzLnVwZGF0ZUFjY2Vzcykge1xuICAgICAgY29uc3QgY29uZmlnOiBFS1MuVXBkYXRlQ2x1c3RlckNvbmZpZ0NvbW1hbmRJbnB1dCA9IHtcbiAgICAgICAgbmFtZTogdGhpcy5jbHVzdGVyTmFtZSxcbiAgICAgIH07XG4gICAgICBpZiAodXBkYXRlcy51cGRhdGVMb2dnaW5nKSB7XG4gICAgICAgIGNvbmZpZy5sb2dnaW5nID0gdGhpcy5uZXdQcm9wcy5sb2dnaW5nO1xuICAgICAgfTtcbiAgICAgIGlmICh1cGRhdGVzLnVwZGF0ZUFjY2Vzcykge1xuICAgICAgICAvLyBVcGRhdGluZyB0aGUgY2x1c3RlciB3aXRoIHNlY3VyaXR5R3JvdXBJZHMgYW5kIHN1Ym5ldElkcyAoYXMgc3BlY2lmaWVkIGluIHRoZSB3YXJuaW5nIGhlcmU6XG4gICAgICAgIC8vIGh0dHBzOi8vYXdzY2xpLmFtYXpvbmF3cy5jb20vdjIvZG9jdW1lbnRhdGlvbi9hcGkvbGF0ZXN0L3JlZmVyZW5jZS9la3MvdXBkYXRlLWNsdXN0ZXItY29uZmlnLmh0bWwpXG4gICAgICAgIC8vIHdpbGwgZmFpbCwgdGhlcmVmb3JlIHdlIHRha2Ugb25seSB0aGUgYWNjZXNzIGZpZWxkcyBleHBsaWNpdGx5XG4gICAgICAgIGNvbmZpZy5yZXNvdXJjZXNWcGNDb25maWcgPSB7XG4gICAgICAgICAgZW5kcG9pbnRQcml2YXRlQWNjZXNzOiB0aGlzLm5ld1Byb3BzLnJlc291cmNlc1ZwY0NvbmZpZz8uZW5kcG9pbnRQcml2YXRlQWNjZXNzLFxuICAgICAgICAgIGVuZHBvaW50UHVibGljQWNjZXNzOiB0aGlzLm5ld1Byb3BzLnJlc291cmNlc1ZwY0NvbmZpZz8uZW5kcG9pbnRQdWJsaWNBY2Nlc3MsXG4gICAgICAgICAgcHVibGljQWNjZXNzQ2lkcnM6IHRoaXMubmV3UHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnPy5wdWJsaWNBY2Nlc3NDaWRycyxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MudXBkYXRlQ2x1c3RlckNvbmZpZyhjb25maWcpO1xuXG4gICAgICByZXR1cm4geyBFa3NVcGRhdGVJZDogdXBkYXRlUmVzcG9uc2UudXBkYXRlPy5pZCB9O1xuICAgIH1cblxuICAgIC8vIG5vIHVwZGF0ZXNcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNVcGRhdGVDb21wbGV0ZSgpIHtcbiAgICBjb25zb2xlLmxvZygnaXNVcGRhdGVDb21wbGV0ZScpO1xuXG4gICAgLy8gaWYgdGhpcyBpcyBhbiBFS1MgdXBkYXRlLCB3ZSB3aWxsIG1vbml0b3IgdGhlIHVwZGF0ZSBldmVudCBpdHNlbGZcbiAgICBpZiAodGhpcy5ldmVudC5Fa3NVcGRhdGVJZCkge1xuICAgICAgY29uc3QgY29tcGxldGUgPSBhd2FpdCB0aGlzLmlzRWtzVXBkYXRlQ29tcGxldGUodGhpcy5ldmVudC5Fa3NVcGRhdGVJZCk7XG4gICAgICBpZiAoIWNvbXBsZXRlKSB7XG4gICAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IGZhbHNlIH07XG4gICAgICB9XG5cbiAgICAgIC8vIGZhbGwgdGhyb3VnaDogaWYgdGhlIHVwZGF0ZSBpcyBkb25lLCB3ZSBzaW1wbHkgZGVsZWdhdGUgdG8gaXNBY3RpdmUoKVxuICAgICAgLy8gaW4gb3JkZXIgdG8gZXh0cmFjdCBhdHRyaWJ1dGVzIGFuZCBzdGF0ZSBmcm9tIHRoZSBjbHVzdGVyIGl0c2VsZiwgd2hpY2hcbiAgICAgIC8vIGlzIHN1cHBvc2VkIHRvIGJlIGluIGFuIEFDVElWRSBzdGF0ZSBhZnRlciB0aGUgdXBkYXRlIGlzIGNvbXBsZXRlLlxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmlzQWN0aXZlKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZUNsdXN0ZXJWZXJzaW9uKG5ld1ZlcnNpb246IHN0cmluZykge1xuICAgIGNvbnNvbGUubG9nKGB1cGRhdGluZyBjbHVzdGVyIHZlcnNpb24gdG8gJHtuZXdWZXJzaW9ufWApO1xuXG4gICAgLy8gdXBkYXRlLWNsdXN0ZXItdmVyc2lvbiB3aWxsIGZhaWwgaWYgd2UgdHJ5IHRvIHVwZGF0ZSB0byB0aGUgc2FtZSB2ZXJzaW9uLFxuICAgIC8vIHNvIHNraXAgaW4gdGhpcyBjYXNlLlxuICAgIGNvbnN0IGNsdXN0ZXIgPSAoYXdhaXQgdGhpcy5la3MuZGVzY3JpYmVDbHVzdGVyKHsgbmFtZTogdGhpcy5jbHVzdGVyTmFtZSB9KSkuY2x1c3RlcjtcbiAgICBpZiAoY2x1c3Rlcj8udmVyc2lvbiA9PT0gbmV3VmVyc2lvbikge1xuICAgICAgY29uc29sZS5sb2coYGNsdXN0ZXIgYWxyZWFkeSBhdCB2ZXJzaW9uICR7Y2x1c3Rlci52ZXJzaW9ufSwgc2tpcHBpbmcgdmVyc2lvbiB1cGRhdGVgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLnVwZGF0ZUNsdXN0ZXJWZXJzaW9uKHsgbmFtZTogdGhpcy5jbHVzdGVyTmFtZSwgdmVyc2lvbjogbmV3VmVyc2lvbiB9KTtcbiAgICByZXR1cm4geyBFa3NVcGRhdGVJZDogdXBkYXRlUmVzcG9uc2UudXBkYXRlPy5pZCB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpc0FjdGl2ZSgpOiBQcm9taXNlPElzQ29tcGxldGVSZXNwb25zZT4ge1xuICAgIGNvbnNvbGUubG9nKCd3YWl0aW5nIGZvciBjbHVzdGVyIHRvIGJlY29tZSBBQ1RJVkUnKTtcbiAgICBjb25zdCByZXNwID0gYXdhaXQgdGhpcy5la3MuZGVzY3JpYmVDbHVzdGVyKHsgbmFtZTogdGhpcy5jbHVzdGVyTmFtZSB9KTtcbiAgICBjb25zb2xlLmxvZygnZGVzY3JpYmVDbHVzdGVyIHJlc3VsdDonLCBKU09OLnN0cmluZ2lmeShyZXNwLCB1bmRlZmluZWQsIDIpKTtcbiAgICBjb25zdCBjbHVzdGVyID0gcmVzcC5jbHVzdGVyO1xuXG4gICAgLy8gaWYgY2x1c3RlciBpcyB1bmRlZmluZWQgKHNob3VsZG50IGhhcHBlbikgb3Igc3RhdHVzIGlzIG5vdCBBQ1RJVkUsIHdlIGFyZVxuICAgIC8vIG5vdCBjb21wbGV0ZS4gbm90ZSB0aGF0IHRoZSBjdXN0b20gcmVzb3VyY2UgcHJvdmlkZXIgZnJhbWV3b3JrIGZvcmJpZHNcbiAgICAvLyByZXR1cm5pbmcgYXR0cmlidXRlcyAoRGF0YSkgaWYgaXNDb21wbGV0ZSBpcyBmYWxzZS5cbiAgICBpZiAoY2x1c3Rlcj8uc3RhdHVzID09PSAnRkFJTEVEJykge1xuICAgICAgLy8gbm90IHZlcnkgaW5mb3JtYXRpdmUsIHVuZm9ydHVuYXRlbHkgdGhlIHJlc3BvbnNlIGRvZXNuJ3QgY29udGFpbiBhbnkgZXJyb3JcbiAgICAgIC8vIGluZm9ybWF0aW9uIDpcXFxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDbHVzdGVyIGlzIGluIGEgRkFJTEVEIHN0YXR1cycpO1xuICAgIH0gZWxzZSBpZiAoY2x1c3Rlcj8uc3RhdHVzICE9PSAnQUNUSVZFJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgSXNDb21wbGV0ZTogZmFsc2UsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBJc0NvbXBsZXRlOiB0cnVlLFxuICAgICAgICBEYXRhOiB7XG4gICAgICAgICAgTmFtZTogY2x1c3Rlci5uYW1lLFxuICAgICAgICAgIEVuZHBvaW50OiBjbHVzdGVyLmVuZHBvaW50LFxuICAgICAgICAgIEFybjogY2x1c3Rlci5hcm4sXG5cbiAgICAgICAgICAvLyBJTVBPUlRBTlQ6IENGTiBleHBlY3RzIHRoYXQgYXR0cmlidXRlcyB3aWxsICphbHdheXMqIGhhdmUgdmFsdWVzLFxuICAgICAgICAgIC8vIHNvIHJldHVybiBhbiBlbXB0eSBzdHJpbmcgaW4gY2FzZSB0aGUgdmFsdWUgaXMgbm90IGRlZmluZWQuXG4gICAgICAgICAgLy8gT3RoZXJ3aXNlLCBDRk4gd2lsbCB0aHJvdyB3aXRoIGBWZW5kb3IgcmVzcG9uc2UgZG9lc24ndCBjb250YWluXG4gICAgICAgICAgLy8gWFhYWCBrZXlgLlxuXG4gICAgICAgICAgQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhOiBjbHVzdGVyLmNlcnRpZmljYXRlQXV0aG9yaXR5Py5kYXRhID8/ICcnLFxuICAgICAgICAgIENsdXN0ZXJTZWN1cml0eUdyb3VwSWQ6IGNsdXN0ZXIucmVzb3VyY2VzVnBjQ29uZmlnPy5jbHVzdGVyU2VjdXJpdHlHcm91cElkID8/ICcnLFxuICAgICAgICAgIE9wZW5JZENvbm5lY3RJc3N1ZXJVcmw6IGNsdXN0ZXIuaWRlbnRpdHk/Lm9pZGM/Lmlzc3VlciA/PyAnJyxcbiAgICAgICAgICBPcGVuSWRDb25uZWN0SXNzdWVyOiBjbHVzdGVyLmlkZW50aXR5Py5vaWRjPy5pc3N1ZXI/LnN1YnN0cmluZyg4KSA/PyAnJywgLy8gU3RyaXBzIG9mZiBodHRwczovLyBmcm9tIHRoZSBpc3N1ZXIgdXJsXG5cbiAgICAgICAgICAvLyBXZSBjYW4gc2FmZWx5IHJldHVybiB0aGUgZmlyc3QgaXRlbSBmcm9tIGVuY3J5cHRpb24gY29uZmlndXJhdGlvbiBhcnJheSwgYmVjYXVzZSBpdCBoYXMgYSBsaW1pdCBvZiAxIGl0ZW1cbiAgICAgICAgICAvLyBodHRwczovL2RvY3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfQ3JlYXRlQ2x1c3Rlci5odG1sI0FtYXpvbkVLUy1DcmVhdGVDbHVzdGVyLXJlcXVlc3QtZW5jcnlwdGlvbkNvbmZpZ1xuICAgICAgICAgIEVuY3J5cHRpb25Db25maWdLZXlBcm46IGNsdXN0ZXIuZW5jcnlwdGlvbkNvbmZpZz8uc2hpZnQoKT8ucHJvdmlkZXI/LmtleUFybiA/PyAnJyxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpc0Vrc1VwZGF0ZUNvbXBsZXRlKGVrc1VwZGF0ZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLmxvZyh7IGlzRWtzVXBkYXRlQ29tcGxldGU6IGVrc1VwZGF0ZUlkIH0pO1xuXG4gICAgY29uc3QgZGVzY3JpYmVVcGRhdGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlVXBkYXRlKHtcbiAgICAgIG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsXG4gICAgICB1cGRhdGVJZDogZWtzVXBkYXRlSWQsXG4gICAgfSk7XG5cbiAgICB0aGlzLmxvZyh7IGRlc2NyaWJlVXBkYXRlUmVzcG9uc2UgfSk7XG5cbiAgICBpZiAoIWRlc2NyaWJlVXBkYXRlUmVzcG9uc2UudXBkYXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuYWJsZSB0byBkZXNjcmliZSB1cGRhdGUgd2l0aCBpZCBcIiR7ZWtzVXBkYXRlSWR9XCJgKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGRlc2NyaWJlVXBkYXRlUmVzcG9uc2UudXBkYXRlLnN0YXR1cykge1xuICAgICAgY2FzZSAnSW5Qcm9ncmVzcyc6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJ1N1Y2Nlc3NmdWwnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ0ZhaWxlZCc6XG4gICAgICBjYXNlICdDYW5jZWxsZWQnOlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGNsdXN0ZXIgdXBkYXRlIGlkIFwiJHtla3NVcGRhdGVJZH1cIiBmYWlsZWQgd2l0aCBlcnJvcnM6ICR7SlNPTi5zdHJpbmdpZnkoZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUuZXJyb3JzKX1gKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdW5rbm93biBzdGF0dXMgXCIke2Rlc2NyaWJlVXBkYXRlUmVzcG9uc2UudXBkYXRlLnN0YXR1c31cIiBmb3IgdXBkYXRlIGlkIFwiJHtla3NVcGRhdGVJZH1cImApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVDbHVzdGVyTmFtZSgpIHtcbiAgICBjb25zdCBzdWZmaXggPSB0aGlzLnJlcXVlc3RJZC5yZXBsYWNlKC8tL2csICcnKTsgLy8gMzIgY2hhcnNcbiAgICBjb25zdCBvZmZzZXQgPSBNQVhfQ0xVU1RFUl9OQU1FX0xFTiAtIHN1ZmZpeC5sZW5ndGggLSAxO1xuICAgIGNvbnN0IHByZWZpeCA9IHRoaXMubG9naWNhbFJlc291cmNlSWQuc2xpY2UoMCwgb2Zmc2V0ID4gMCA/IG9mZnNldCA6IDApO1xuICAgIHJldHVybiBgJHtwcmVmaXh9LSR7c3VmZml4fWA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VQcm9wcyhwcm9wczogYW55KTogRUtTLkNyZWF0ZUNsdXN0ZXJDb21tYW5kSW5wdXQge1xuXG4gIGNvbnN0IHBhcnNlZCA9IHByb3BzPy5Db25maWcgPz8ge307XG5cbiAgLy8gdGhpcyBpcyB3ZWlyZCBidXQgdGhlc2UgYm9vbGVhbiBwcm9wZXJ0aWVzIGFyZSBwYXNzZWQgYnkgQ0ZOIGFzIGEgc3RyaW5nLCBhbmQgd2UgbmVlZCB0aGVtIHRvIGJlIGJvb2xlYW5pYyBmb3IgdGhlIFNESy5cbiAgLy8gT3RoZXJ3aXNlIGl0IGZhaWxzIHdpdGggJ1VuZXhwZWN0ZWQgUGFyYW1ldGVyOiBwYXJhbXMucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyBpcyBleHBlY3RlZCB0byBiZSBhIGJvb2xlYW4nXG5cbiAgaWYgKHR5cGVvZiAocGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZz8uZW5kcG9pbnRQcml2YXRlQWNjZXNzKSA9PT0gJ3N0cmluZycpIHtcbiAgICBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyA9IHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQcml2YXRlQWNjZXNzID09PSAndHJ1ZSc7XG4gIH1cblxuICBpZiAodHlwZW9mIChwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnPy5lbmRwb2ludFB1YmxpY0FjY2VzcykgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFB1YmxpY0FjY2VzcyA9IHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgPT09ICd0cnVlJztcbiAgfVxuXG4gIGlmICh0eXBlb2YgKHBhcnNlZC5sb2dnaW5nPy5jbHVzdGVyTG9nZ2luZ1swXS5lbmFibGVkKSA9PT0gJ3N0cmluZycpIHtcbiAgICBwYXJzZWQubG9nZ2luZy5jbHVzdGVyTG9nZ2luZ1swXS5lbmFibGVkID0gcGFyc2VkLmxvZ2dpbmcuY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCA9PT0gJ3RydWUnO1xuICB9XG5cbiAgcmV0dXJuIHBhcnNlZDtcblxufVxuXG5pbnRlcmZhY2UgVXBkYXRlTWFwIHtcbiAgcmVwbGFjZU5hbWU6IGJvb2xlYW47IC8vIG5hbWVcbiAgcmVwbGFjZVZwYzogYm9vbGVhbjsgLy8gcmVzb3VyY2VzVnBjQ29uZmlnLnN1Ym5ldElkcyBhbmQgc2VjdXJpdHlHcm91cElkc1xuICByZXBsYWNlUm9sZTogYm9vbGVhbjsgLy8gcm9sZUFyblxuXG4gIHVwZGF0ZVZlcnNpb246IGJvb2xlYW47IC8vIHZlcnNpb25cbiAgdXBkYXRlTG9nZ2luZzogYm9vbGVhbjsgLy8gbG9nZ2luZ1xuICB1cGRhdGVFbmNyeXB0aW9uOiBib29sZWFuOyAvLyBlbmNyeXB0aW9uIChjYW5ub3QgYmUgdXBkYXRlZClcbiAgdXBkYXRlQWNjZXNzOiBib29sZWFuOyAvLyByZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQcml2YXRlQWNjZXNzIGFuZCBlbmRwb2ludFB1YmxpY0FjY2Vzc1xufVxuXG5mdW5jdGlvbiBhbmFseXplVXBkYXRlKG9sZFByb3BzOiBQYXJ0aWFsPEVLUy5DcmVhdGVDbHVzdGVyQ29tbWFuZElucHV0PiwgbmV3UHJvcHM6IEVLUy5DcmVhdGVDbHVzdGVyQ29tbWFuZElucHV0KTogVXBkYXRlTWFwIHtcbiAgY29uc29sZS5sb2coJ29sZCBwcm9wczogJywgSlNPTi5zdHJpbmdpZnkob2xkUHJvcHMpKTtcbiAgY29uc29sZS5sb2coJ25ldyBwcm9wczogJywgSlNPTi5zdHJpbmdpZnkobmV3UHJvcHMpKTtcblxuICBjb25zdCBuZXdWcGNQcm9wcyA9IG5ld1Byb3BzLnJlc291cmNlc1ZwY0NvbmZpZyB8fCB7fTtcbiAgY29uc3Qgb2xkVnBjUHJvcHMgPSBvbGRQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcgfHwge307XG5cbiAgY29uc3Qgb2xkUHVibGljQWNjZXNzQ2lkcnMgPSBuZXcgU2V0KG9sZFZwY1Byb3BzLnB1YmxpY0FjY2Vzc0NpZHJzID8/IFtdKTtcbiAgY29uc3QgbmV3UHVibGljQWNjZXNzQ2lkcnMgPSBuZXcgU2V0KG5ld1ZwY1Byb3BzLnB1YmxpY0FjY2Vzc0NpZHJzID8/IFtdKTtcbiAgY29uc3QgbmV3RW5jID0gbmV3UHJvcHMuZW5jcnlwdGlvbkNvbmZpZyB8fCB7fTtcbiAgY29uc3Qgb2xkRW5jID0gb2xkUHJvcHMuZW5jcnlwdGlvbkNvbmZpZyB8fCB7fTtcblxuICByZXR1cm4ge1xuICAgIHJlcGxhY2VOYW1lOiBuZXdQcm9wcy5uYW1lICE9PSBvbGRQcm9wcy5uYW1lLFxuICAgIHJlcGxhY2VWcGM6XG4gICAgICBKU09OLnN0cmluZ2lmeShuZXdWcGNQcm9wcy5zdWJuZXRJZHM/LnNvcnQoKSkgIT09IEpTT04uc3RyaW5naWZ5KG9sZFZwY1Byb3BzLnN1Ym5ldElkcz8uc29ydCgpKSB8fFxuICAgICAgSlNPTi5zdHJpbmdpZnkobmV3VnBjUHJvcHMuc2VjdXJpdHlHcm91cElkcz8uc29ydCgpKSAhPT0gSlNPTi5zdHJpbmdpZnkob2xkVnBjUHJvcHMuc2VjdXJpdHlHcm91cElkcz8uc29ydCgpKSxcbiAgICB1cGRhdGVBY2Nlc3M6XG4gICAgICBuZXdWcGNQcm9wcy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgIT09IG9sZFZwY1Byb3BzLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyB8fFxuICAgICAgbmV3VnBjUHJvcHMuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgIT09IG9sZFZwY1Byb3BzLmVuZHBvaW50UHVibGljQWNjZXNzIHx8XG4gICAgICAhc2V0c0VxdWFsKG5ld1B1YmxpY0FjY2Vzc0NpZHJzLCBvbGRQdWJsaWNBY2Nlc3NDaWRycyksXG4gICAgcmVwbGFjZVJvbGU6IG5ld1Byb3BzLnJvbGVBcm4gIT09IG9sZFByb3BzLnJvbGVBcm4sXG4gICAgdXBkYXRlVmVyc2lvbjogbmV3UHJvcHMudmVyc2lvbiAhPT0gb2xkUHJvcHMudmVyc2lvbixcbiAgICB1cGRhdGVFbmNyeXB0aW9uOiBKU09OLnN0cmluZ2lmeShuZXdFbmMpICE9PSBKU09OLnN0cmluZ2lmeShvbGRFbmMpLFxuICAgIHVwZGF0ZUxvZ2dpbmc6IEpTT04uc3RyaW5naWZ5KG5ld1Byb3BzLmxvZ2dpbmcpICE9PSBKU09OLnN0cmluZ2lmeShvbGRQcm9wcy5sb2dnaW5nKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2V0c0VxdWFsKGZpcnN0OiBTZXQ8c3RyaW5nPiwgc2Vjb25kOiBTZXQ8c3RyaW5nPikge1xuICByZXR1cm4gZmlyc3Quc2l6ZSA9PT0gc2Vjb25kLnNpemUgJiYgWy4uLmZpcnN0XS5ldmVyeSgoZTogc3RyaW5nKSA9PiBzZWNvbmQuaGFzKGUpKTtcbn1cbiJdfQ==