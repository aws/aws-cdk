"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterResourceHandler = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const client_eks_1 = require("@aws-sdk/client-eks");
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
            if (!(e instanceof client_eks_1.ResourceNotFoundException)) {
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
            if (e instanceof client_eks_1.ResourceNotFoundException) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtCQUErQjs7O0FBRS9CLDZEQUE2RDtBQUM3RCxvREFBZ0U7QUFHaEUscUNBQXFFO0FBQ3JFLHFEQUF1RDtBQUd2RCxNQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQUVqQyxNQUFhLHNCQUF1QixTQUFRLHdCQUFlO0lBQ3pELElBQVcsV0FBVztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztTQUMvRTtRQUVELE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0tBQ2hDO0lBS0QsWUFBWSxHQUFjLEVBQUUsS0FBb0I7UUFDOUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsQixJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDOUYsOEZBQThGO1FBQzlGLE1BQU0sUUFBUSxHQUEwQyxJQUFBLG9DQUFtQixFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7S0FDMUM7SUFFRCxTQUFTO0lBQ1QsU0FBUztJQUNULFNBQVM7SUFFQyxLQUFLLENBQUMsUUFBUTtRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFB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QUMsb0JBQW9CO1lBQ3JFLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUFFLG9CQUFvQixDQUFDO1FBQ3hELFdBQVcsRUFBRSxRQUFRLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxPQUFPO1FBQ2xELGFBQWEsRUFBRSxRQUFRLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxPQUFPO1FBQ3BELGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDbkUsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztLQUNyRixDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLEtBQWtCLEVBQUUsTUFBbUI7SUFDeEQsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IFJlc291cmNlTm90Rm91bmRFeGNlcHRpb24gfSBmcm9tICdAYXdzLXNkay9jbGllbnQtZWtzJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIGF3cyBmcm9tICdhd3Mtc2RrJztcbmltcG9ydCB7IEVrc0NsaWVudCwgUmVzb3VyY2VFdmVudCwgUmVzb3VyY2VIYW5kbGVyIH0gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IHsgY29tcGFyZUxvZ2dpbmdQcm9wcyB9IGZyb20gJy4vY29tcGFyZUxvZ2dpbmcnO1xuaW1wb3J0IHsgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVzcG9uc2UgfSBmcm9tICcuLi8uLi8uLi9jdXN0b20tcmVzb3VyY2VzL2xpYi9wcm92aWRlci1mcmFtZXdvcmsvdHlwZXMnO1xuXG5jb25zdCBNQVhfQ0xVU1RFUl9OQU1FX0xFTiA9IDEwMDtcblxuZXhwb3J0IGNsYXNzIENsdXN0ZXJSZXNvdXJjZUhhbmRsZXIgZXh0ZW5kcyBSZXNvdXJjZUhhbmRsZXIge1xuICBwdWJsaWMgZ2V0IGNsdXN0ZXJOYW1lKCkge1xuICAgIGlmICghdGhpcy5waHlzaWNhbFJlc291cmNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGRldGVybWluZSBjbHVzdGVyIG5hbWUgd2l0aG91dCBwaHlzaWNhbCByZXNvdXJjZSBJRCcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZDtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgbmV3UHJvcHM6IGF3cy5FS1MuQ3JlYXRlQ2x1c3RlclJlcXVlc3Q7XG4gIHByaXZhdGUgcmVhZG9ubHkgb2xkUHJvcHM6IFBhcnRpYWw8YXdzLkVLUy5DcmVhdGVDbHVzdGVyUmVxdWVzdD47XG5cbiAgY29uc3RydWN0b3IoZWtzOiBFa3NDbGllbnQsIGV2ZW50OiBSZXNvdXJjZUV2ZW50KSB7XG4gICAgc3VwZXIoZWtzLCBldmVudCk7XG5cbiAgICB0aGlzLm5ld1Byb3BzID0gcGFyc2VQcm9wcyh0aGlzLmV2ZW50LlJlc291cmNlUHJvcGVydGllcyk7XG4gICAgdGhpcy5vbGRQcm9wcyA9IGV2ZW50LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJyA/IHBhcnNlUHJvcHMoZXZlbnQuT2xkUmVzb3VyY2VQcm9wZXJ0aWVzKSA6IHt9O1xuICAgIC8vIGNvbXBhcmUgbmV3UHJvcHMgYW5kIG9sZFByb3BzIGFuZCB1cGRhdGUgdGhlIG5ld1Byb3BzIGJ5IGFwcGVuZGluZyBkaXNhYmxlZCBMb2dTZXR1cCBpZiBhbnlcbiAgICBjb25zdCBjb21wYXJlZDogUGFydGlhbDxhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0PiA9IGNvbXBhcmVMb2dnaW5nUHJvcHModGhpcy5vbGRQcm9wcywgdGhpcy5uZXdQcm9wcyk7XG4gICAgdGhpcy5uZXdQcm9wcy5sb2dnaW5nID0gY29tcGFyZWQubG9nZ2luZztcbiAgfVxuXG4gIC8vIC0tLS0tLVxuICAvLyBDUkVBVEVcbiAgLy8gLS0tLS0tXG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uQ3JlYXRlKCk6IFByb21pc2U8T25FdmVudFJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5sb2coJ29uQ3JlYXRlOiBjcmVhdGluZyBjbHVzdGVyIHdpdGggb3B0aW9uczonLCBKU09OLnN0cmluZ2lmeSh0aGlzLm5ld1Byb3BzLCB1bmRlZmluZWQsIDIpKTtcbiAgICBpZiAoIXRoaXMubmV3UHJvcHMucm9sZUFybikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcInJvbGVBcm5cIiBpcyByZXF1aXJlZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGNsdXN0ZXJOYW1lID0gdGhpcy5uZXdQcm9wcy5uYW1lIHx8IHRoaXMuZ2VuZXJhdGVDbHVzdGVyTmFtZSgpO1xuXG4gICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuZWtzLmNyZWF0ZUNsdXN0ZXIoe1xuICAgICAgLi4udGhpcy5uZXdQcm9wcyxcbiAgICAgIG5hbWU6IGNsdXN0ZXJOYW1lLFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwLmNsdXN0ZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igd2hlbiB0cnlpbmcgdG8gY3JlYXRlIGNsdXN0ZXIgJHtjbHVzdGVyTmFtZX06IENyZWF0ZUNsdXN0ZXIgcmV0dXJuZWQgd2l0aG91dCBjbHVzdGVyIGluZm9ybWF0aW9uYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogcmVzcC5jbHVzdGVyLm5hbWUsXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc0NyZWF0ZUNvbXBsZXRlKCkge1xuICAgIHJldHVybiB0aGlzLmlzQWN0aXZlKCk7XG4gIH1cblxuICAvLyAtLS0tLS1cbiAgLy8gREVMRVRFXG4gIC8vIC0tLS0tLVxuXG4gIHByb3RlY3RlZCBhc3luYyBvbkRlbGV0ZSgpOiBQcm9taXNlPE9uRXZlbnRSZXNwb25zZT4ge1xuICAgIGNvbnNvbGUubG9nKGBvbkRlbGV0ZTogZGVsZXRpbmcgY2x1c3RlciAke3RoaXMuY2x1c3Rlck5hbWV9YCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZWtzLmRlbGV0ZUNsdXN0ZXIoeyBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lIH0pO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIFJlc291cmNlTm90Rm91bmRFeGNlcHRpb24pKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhgY2x1c3RlciAke3RoaXMuY2x1c3Rlck5hbWV9IG5vdCBmb3VuZCwgaWRlbXBvdGVudGx5IHN1Y2NlZWRlZGApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiB0aGlzLmNsdXN0ZXJOYW1lLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNEZWxldGVDb21wbGV0ZSgpOiBQcm9taXNlPElzQ29tcGxldGVSZXNwb25zZT4ge1xuICAgIGNvbnNvbGUubG9nKGBpc0RlbGV0ZUNvbXBsZXRlOiB3YWl0aW5nIGZvciBjbHVzdGVyICR7dGhpcy5jbHVzdGVyTmFtZX0gdG8gYmUgZGVsZXRlZGApO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCB0aGlzLmVrcy5kZXNjcmliZUNsdXN0ZXIoeyBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lIH0pO1xuICAgICAgY29uc29sZS5sb2coJ2Rlc2NyaWJlQ2x1c3RlciByZXR1cm5lZDonLCBKU09OLnN0cmluZ2lmeShyZXNwLCB1bmRlZmluZWQsIDIpKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIC8vIHNlZSBodHRwczovL2F3cy5hbWF6b24uY29tL2Jsb2dzL2RldmVsb3Blci9zZXJ2aWNlLWVycm9yLWhhbmRsaW5nLW1vZHVsYXItYXdzLXNkay1qcy9cbiAgICAgIGlmIChlIGluc3RhbmNlb2YgUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbikge1xuICAgICAgICBjb25zb2xlLmxvZygncmVjZWl2ZWQgUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbiwgdGhpcyBtZWFucyB0aGUgY2x1c3RlciBoYXMgYmVlbiBkZWxldGVkIChvciBuZXZlciBleGlzdGVkKScpO1xuICAgICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiB0cnVlIH07XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCdkZXNjcmliZUNsdXN0ZXIgZXJyb3I6JywgZSk7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBJc0NvbXBsZXRlOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgLy8gLS0tLS0tXG4gIC8vIFVQREFURVxuICAvLyAtLS0tLS1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25VcGRhdGUoKSB7XG4gICAgY29uc3QgdXBkYXRlcyA9IGFuYWx5emVVcGRhdGUodGhpcy5vbGRQcm9wcywgdGhpcy5uZXdQcm9wcyk7XG4gICAgY29uc29sZS5sb2coJ29uVXBkYXRlOicsIEpTT04uc3RyaW5naWZ5KHsgdXBkYXRlcyB9LCB1bmRlZmluZWQsIDIpKTtcblxuICAgIC8vIHVwZGF0ZXMgdG8gZW5jcnlwdGlvbiBjb25maWcgaXMgbm90IHN1cHBvcnRlZFxuICAgIGlmICh1cGRhdGVzLnVwZGF0ZUVuY3J5cHRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVwZGF0ZSBjbHVzdGVyIGVuY3J5cHRpb24gY29uZmlndXJhdGlvbicpO1xuICAgIH1cblxuICAgIC8vIGlmIHRoZXJlIGlzIGFuIHVwZGF0ZSB0aGF0IHJlcXVpcmVzIHJlcGxhY2VtZW50LCBnbyBhaGVhZCBhbmQganVzdCBjcmVhdGVcbiAgICAvLyBhIG5ldyBjbHVzdGVyIHdpdGggdGhlIG5ldyBjb25maWcuIFRoZSBvbGQgY2x1c3RlciB3aWxsIGF1dG9tYXRpY2FsbHkgYmVcbiAgICAvLyBkZWxldGVkIGJ5IGNsb3VkZm9ybWF0aW9uIHVwb24gc3VjY2Vzcy5cbiAgICBpZiAodXBkYXRlcy5yZXBsYWNlTmFtZSB8fCB1cGRhdGVzLnJlcGxhY2VSb2xlIHx8IHVwZGF0ZXMucmVwbGFjZVZwYykge1xuXG4gICAgICAvLyBpZiB3ZSBhcmUgcmVwbGFjaW5nIHRoaXMgY2x1c3RlciBhbmQgdGhlIGNsdXN0ZXIgaGFzIGFuIGV4cGxpY2l0XG4gICAgICAvLyBwaHlzaWNhbCBuYW1lLCB0aGUgY3JlYXRpb24gb2YgdGhlIG5ldyBjbHVzdGVyIHdpbGwgZmFpbCB3aXRoIFwidGhlcmUgaXNcbiAgICAgIC8vIGFscmVhZHkgYSBjbHVzdGVyIHdpdGggdGhhdCBuYW1lXCIuIHRoaXMgaXMgYSBjb21tb24gYmVoYXZpb3IgZm9yXG4gICAgICAvLyBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHNwZWNpZnlpbmcgYSBwaHlzaWNhbCBuYW1lLlxuICAgICAgaWYgKHRoaXMub2xkUHJvcHMubmFtZSA9PT0gdGhpcy5uZXdQcm9wcy5uYW1lICYmIHRoaXMub2xkUHJvcHMubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZXBsYWNlIGNsdXN0ZXIgXCIke3RoaXMub2xkUHJvcHMubmFtZX1cIiBzaW5jZSBpdCBoYXMgYW4gZXhwbGljaXQgcGh5c2ljYWwgbmFtZS4gRWl0aGVyIHJlbmFtZSB0aGUgY2x1c3RlciBvciByZW1vdmUgdGhlIFwibmFtZVwiIGNvbmZpZ3VyYXRpb25gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub25DcmVhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBpZiBhIHZlcnNpb24gdXBkYXRlIGlzIHJlcXVpcmVkLCBpc3N1ZSB0aGUgdmVyc2lvbiB1cGRhdGVcbiAgICBpZiAodXBkYXRlcy51cGRhdGVWZXJzaW9uKSB7XG4gICAgICBpZiAoIXRoaXMubmV3UHJvcHMudmVyc2lvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZW1vdmUgY2x1c3RlciB2ZXJzaW9uIGNvbmZpZ3VyYXRpb24uIEN1cnJlbnQgdmVyc2lvbiBpcyAke3RoaXMub2xkUHJvcHMudmVyc2lvbn1gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlQ2x1c3RlclZlcnNpb24odGhpcy5uZXdQcm9wcy52ZXJzaW9uKTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlcy51cGRhdGVMb2dnaW5nICYmIHVwZGF0ZXMudXBkYXRlQWNjZXNzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1cGRhdGUgbG9nZ2luZyBhbmQgYWNjZXNzIGF0IHRoZSBzYW1lIHRpbWUnKTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlcy51cGRhdGVMb2dnaW5nIHx8IHVwZGF0ZXMudXBkYXRlQWNjZXNzKSB7XG4gICAgICBjb25zdCBjb25maWc6IGF3cy5FS1MuVXBkYXRlQ2x1c3RlckNvbmZpZ1JlcXVlc3QgPSB7XG4gICAgICAgIG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsXG4gICAgICB9O1xuICAgICAgaWYgKHVwZGF0ZXMudXBkYXRlTG9nZ2luZykge1xuICAgICAgICBjb25maWcubG9nZ2luZyA9IHRoaXMubmV3UHJvcHMubG9nZ2luZztcbiAgICAgIH07XG4gICAgICBpZiAodXBkYXRlcy51cGRhdGVBY2Nlc3MpIHtcbiAgICAgICAgLy8gVXBkYXRpbmcgdGhlIGNsdXN0ZXIgd2l0aCBzZWN1cml0eUdyb3VwSWRzIGFuZCBzdWJuZXRJZHMgKGFzIHNwZWNpZmllZCBpbiB0aGUgd2FybmluZyBoZXJlOlxuICAgICAgICAvLyBodHRwczovL2F3c2NsaS5hbWF6b25hd3MuY29tL3YyL2RvY3VtZW50YXRpb24vYXBpL2xhdGVzdC9yZWZlcmVuY2UvZWtzL3VwZGF0ZS1jbHVzdGVyLWNvbmZpZy5odG1sKVxuICAgICAgICAvLyB3aWxsIGZhaWwsIHRoZXJlZm9yZSB3ZSB0YWtlIG9ubHkgdGhlIGFjY2VzcyBmaWVsZHMgZXhwbGljaXRseVxuICAgICAgICBjb25maWcucmVzb3VyY2VzVnBjQ29uZmlnID0ge1xuICAgICAgICAgIGVuZHBvaW50UHJpdmF0ZUFjY2VzczogdGhpcy5uZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQcml2YXRlQWNjZXNzLFxuICAgICAgICAgIGVuZHBvaW50UHVibGljQWNjZXNzOiB0aGlzLm5ld1Byb3BzLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFB1YmxpY0FjY2VzcyxcbiAgICAgICAgICBwdWJsaWNBY2Nlc3NDaWRyczogdGhpcy5uZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcucHVibGljQWNjZXNzQ2lkcnMsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBjb25zdCB1cGRhdGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLnVwZGF0ZUNsdXN0ZXJDb25maWcoY29uZmlnKTtcblxuICAgICAgcmV0dXJuIHsgRWtzVXBkYXRlSWQ6IHVwZGF0ZVJlc3BvbnNlLnVwZGF0ZT8uaWQgfTtcbiAgICB9XG5cbiAgICAvLyBubyB1cGRhdGVzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzVXBkYXRlQ29tcGxldGUoKSB7XG4gICAgY29uc29sZS5sb2coJ2lzVXBkYXRlQ29tcGxldGUnKTtcblxuICAgIC8vIGlmIHRoaXMgaXMgYW4gRUtTIHVwZGF0ZSwgd2Ugd2lsbCBtb25pdG9yIHRoZSB1cGRhdGUgZXZlbnQgaXRzZWxmXG4gICAgaWYgKHRoaXMuZXZlbnQuRWtzVXBkYXRlSWQpIHtcbiAgICAgIGNvbnN0IGNvbXBsZXRlID0gYXdhaXQgdGhpcy5pc0Vrc1VwZGF0ZUNvbXBsZXRlKHRoaXMuZXZlbnQuRWtzVXBkYXRlSWQpO1xuICAgICAgaWYgKCFjb21wbGV0ZSkge1xuICAgICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiBmYWxzZSB9O1xuICAgICAgfVxuXG4gICAgICAvLyBmYWxsIHRocm91Z2g6IGlmIHRoZSB1cGRhdGUgaXMgZG9uZSwgd2Ugc2ltcGx5IGRlbGVnYXRlIHRvIGlzQWN0aXZlKClcbiAgICAgIC8vIGluIG9yZGVyIHRvIGV4dHJhY3QgYXR0cmlidXRlcyBhbmQgc3RhdGUgZnJvbSB0aGUgY2x1c3RlciBpdHNlbGYsIHdoaWNoXG4gICAgICAvLyBpcyBzdXBwb3NlZCB0byBiZSBpbiBhbiBBQ1RJVkUgc3RhdGUgYWZ0ZXIgdGhlIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVDbHVzdGVyVmVyc2lvbihuZXdWZXJzaW9uOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhgdXBkYXRpbmcgY2x1c3RlciB2ZXJzaW9uIHRvICR7bmV3VmVyc2lvbn1gKTtcblxuICAgIC8vIHVwZGF0ZS1jbHVzdGVyLXZlcnNpb24gd2lsbCBmYWlsIGlmIHdlIHRyeSB0byB1cGRhdGUgdG8gdGhlIHNhbWUgdmVyc2lvbixcbiAgICAvLyBzbyBza2lwIGluIHRoaXMgY2FzZS5cbiAgICBjb25zdCBjbHVzdGVyID0gKGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSkpLmNsdXN0ZXI7XG4gICAgaWYgKGNsdXN0ZXI/LnZlcnNpb24gPT09IG5ld1ZlcnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKGBjbHVzdGVyIGFscmVhZHkgYXQgdmVyc2lvbiAke2NsdXN0ZXIudmVyc2lvbn0sIHNraXBwaW5nIHZlcnNpb24gdXBkYXRlYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy51cGRhdGVDbHVzdGVyVmVyc2lvbih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsIHZlcnNpb246IG5ld1ZlcnNpb24gfSk7XG4gICAgcmV0dXJuIHsgRWtzVXBkYXRlSWQ6IHVwZGF0ZVJlc3BvbnNlLnVwZGF0ZT8uaWQgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaXNBY3RpdmUoKTogUHJvbWlzZTxJc0NvbXBsZXRlUmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZygnd2FpdGluZyBmb3IgY2x1c3RlciB0byBiZWNvbWUgQUNUSVZFJyk7XG4gICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgY29uc29sZS5sb2coJ2Rlc2NyaWJlQ2x1c3RlciByZXN1bHQ6JywgSlNPTi5zdHJpbmdpZnkocmVzcCwgdW5kZWZpbmVkLCAyKSk7XG4gICAgY29uc3QgY2x1c3RlciA9IHJlc3AuY2x1c3RlcjtcblxuICAgIC8vIGlmIGNsdXN0ZXIgaXMgdW5kZWZpbmVkIChzaG91bGRudCBoYXBwZW4pIG9yIHN0YXR1cyBpcyBub3QgQUNUSVZFLCB3ZSBhcmVcbiAgICAvLyBub3QgY29tcGxldGUuIG5vdGUgdGhhdCB0aGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyIGZyYW1ld29yayBmb3JiaWRzXG4gICAgLy8gcmV0dXJuaW5nIGF0dHJpYnV0ZXMgKERhdGEpIGlmIGlzQ29tcGxldGUgaXMgZmFsc2UuXG4gICAgaWYgKGNsdXN0ZXI/LnN0YXR1cyA9PT0gJ0ZBSUxFRCcpIHtcbiAgICAgIC8vIG5vdCB2ZXJ5IGluZm9ybWF0aXZlLCB1bmZvcnR1bmF0ZWx5IHRoZSByZXNwb25zZSBkb2Vzbid0IGNvbnRhaW4gYW55IGVycm9yXG4gICAgICAvLyBpbmZvcm1hdGlvbiA6XFxcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2x1c3RlciBpcyBpbiBhIEZBSUxFRCBzdGF0dXMnKTtcbiAgICB9IGVsc2UgaWYgKGNsdXN0ZXI/LnN0YXR1cyAhPT0gJ0FDVElWRScpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIElzQ29tcGxldGU6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgSXNDb21wbGV0ZTogdHJ1ZSxcbiAgICAgICAgRGF0YToge1xuICAgICAgICAgIE5hbWU6IGNsdXN0ZXIubmFtZSxcbiAgICAgICAgICBFbmRwb2ludDogY2x1c3Rlci5lbmRwb2ludCxcbiAgICAgICAgICBBcm46IGNsdXN0ZXIuYXJuLFxuXG4gICAgICAgICAgLy8gSU1QT1JUQU5UOiBDRk4gZXhwZWN0cyB0aGF0IGF0dHJpYnV0ZXMgd2lsbCAqYWx3YXlzKiBoYXZlIHZhbHVlcyxcbiAgICAgICAgICAvLyBzbyByZXR1cm4gYW4gZW1wdHkgc3RyaW5nIGluIGNhc2UgdGhlIHZhbHVlIGlzIG5vdCBkZWZpbmVkLlxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgQ0ZOIHdpbGwgdGhyb3cgd2l0aCBgVmVuZG9yIHJlc3BvbnNlIGRvZXNuJ3QgY29udGFpblxuICAgICAgICAgIC8vIFhYWFgga2V5YC5cblxuICAgICAgICAgIENlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogY2x1c3Rlci5jZXJ0aWZpY2F0ZUF1dGhvcml0eT8uZGF0YSA/PyAnJyxcbiAgICAgICAgICBDbHVzdGVyU2VjdXJpdHlHcm91cElkOiBjbHVzdGVyLnJlc291cmNlc1ZwY0NvbmZpZz8uY2x1c3RlclNlY3VyaXR5R3JvdXBJZCA/PyAnJyxcbiAgICAgICAgICBPcGVuSWRDb25uZWN0SXNzdWVyVXJsOiBjbHVzdGVyLmlkZW50aXR5Py5vaWRjPy5pc3N1ZXIgPz8gJycsXG4gICAgICAgICAgT3BlbklkQ29ubmVjdElzc3VlcjogY2x1c3Rlci5pZGVudGl0eT8ub2lkYz8uaXNzdWVyPy5zdWJzdHJpbmcoOCkgPz8gJycsIC8vIFN0cmlwcyBvZmYgaHR0cHM6Ly8gZnJvbSB0aGUgaXNzdWVyIHVybFxuXG4gICAgICAgICAgLy8gV2UgY2FuIHNhZmVseSByZXR1cm4gdGhlIGZpcnN0IGl0ZW0gZnJvbSBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24gYXJyYXksIGJlY2F1c2UgaXQgaGFzIGEgbGltaXQgb2YgMSBpdGVtXG4gICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9DcmVhdGVDbHVzdGVyLmh0bWwjQW1hem9uRUtTLUNyZWF0ZUNsdXN0ZXItcmVxdWVzdC1lbmNyeXB0aW9uQ29uZmlnXG4gICAgICAgICAgRW5jcnlwdGlvbkNvbmZpZ0tleUFybjogY2x1c3Rlci5lbmNyeXB0aW9uQ29uZmlnPy5zaGlmdCgpPy5wcm92aWRlcj8ua2V5QXJuID8/ICcnLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGlzRWtzVXBkYXRlQ29tcGxldGUoZWtzVXBkYXRlSWQ6IHN0cmluZykge1xuICAgIHRoaXMubG9nKHsgaXNFa3NVcGRhdGVDb21wbGV0ZTogZWtzVXBkYXRlSWQgfSk7XG5cbiAgICBjb25zdCBkZXNjcmliZVVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MuZGVzY3JpYmVVcGRhdGUoe1xuICAgICAgbmFtZTogdGhpcy5jbHVzdGVyTmFtZSxcbiAgICAgIHVwZGF0ZUlkOiBla3NVcGRhdGVJZCxcbiAgICB9KTtcblxuICAgIHRoaXMubG9nKHsgZGVzY3JpYmVVcGRhdGVSZXNwb25zZSB9KTtcblxuICAgIGlmICghZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5hYmxlIHRvIGRlc2NyaWJlIHVwZGF0ZSB3aXRoIGlkIFwiJHtla3NVcGRhdGVJZH1cImApO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUuc3RhdHVzKSB7XG4gICAgICBjYXNlICdJblByb2dyZXNzJzpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSAnU3VjY2Vzc2Z1bCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnRmFpbGVkJzpcbiAgICAgIGNhc2UgJ0NhbmNlbGxlZCc6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgY2x1c3RlciB1cGRhdGUgaWQgXCIke2Vrc1VwZGF0ZUlkfVwiIGZhaWxlZCB3aXRoIGVycm9yczogJHtKU09OLnN0cmluZ2lmeShkZXNjcmliZVVwZGF0ZVJlc3BvbnNlLnVwZGF0ZS5lcnJvcnMpfWApO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtub3duIHN0YXR1cyBcIiR7ZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUuc3RhdHVzfVwiIGZvciB1cGRhdGUgaWQgXCIke2Vrc1VwZGF0ZUlkfVwiYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUNsdXN0ZXJOYW1lKCkge1xuICAgIGNvbnN0IHN1ZmZpeCA9IHRoaXMucmVxdWVzdElkLnJlcGxhY2UoLy0vZywgJycpOyAvLyAzMiBjaGFyc1xuICAgIGNvbnN0IG9mZnNldCA9IE1BWF9DTFVTVEVSX05BTUVfTEVOIC0gc3VmZml4Lmxlbmd0aCAtIDE7XG4gICAgY29uc3QgcHJlZml4ID0gdGhpcy5sb2dpY2FsUmVzb3VyY2VJZC5zbGljZSgwLCBvZmZzZXQgPiAwID8gb2Zmc2V0IDogMCk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtzdWZmaXh9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVByb3BzKHByb3BzOiBhbnkpOiBhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0IHtcblxuICBjb25zdCBwYXJzZWQgPSBwcm9wcz8uQ29uZmlnID8/IHt9O1xuXG4gIC8vIHRoaXMgaXMgd2VpcmQgYnV0IHRoZXNlIGJvb2xlYW4gcHJvcGVydGllcyBhcmUgcGFzc2VkIGJ5IENGTiBhcyBhIHN0cmluZywgYW5kIHdlIG5lZWQgdGhlbSB0byBiZSBib29sZWFuaWMgZm9yIHRoZSBTREsuXG4gIC8vIE90aGVyd2lzZSBpdCBmYWlscyB3aXRoICdVbmV4cGVjdGVkIFBhcmFtZXRlcjogcGFyYW1zLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgaXMgZXhwZWN0ZWQgdG8gYmUgYSBib29sZWFuJ1xuXG4gIGlmICh0eXBlb2YgKHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWc/LmVuZHBvaW50UHJpdmF0ZUFjY2VzcykgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgPSBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyA9PT0gJ3RydWUnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiAocGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZz8uZW5kcG9pbnRQdWJsaWNBY2Nlc3MpID09PSAnc3RyaW5nJykge1xuICAgIHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgPSBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHVibGljQWNjZXNzID09PSAndHJ1ZSc7XG4gIH1cblxuICBpZiAodHlwZW9mIChwYXJzZWQubG9nZ2luZz8uY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCkgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLmxvZ2dpbmcuY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCA9IHBhcnNlZC5sb2dnaW5nLmNsdXN0ZXJMb2dnaW5nWzBdLmVuYWJsZWQgPT09ICd0cnVlJztcbiAgfVxuXG4gIHJldHVybiBwYXJzZWQ7XG5cbn1cblxuaW50ZXJmYWNlIFVwZGF0ZU1hcCB7XG4gIHJlcGxhY2VOYW1lOiBib29sZWFuOyAvLyBuYW1lXG4gIHJlcGxhY2VWcGM6IGJvb2xlYW47IC8vIHJlc291cmNlc1ZwY0NvbmZpZy5zdWJuZXRJZHMgYW5kIHNlY3VyaXR5R3JvdXBJZHNcbiAgcmVwbGFjZVJvbGU6IGJvb2xlYW47IC8vIHJvbGVBcm5cblxuICB1cGRhdGVWZXJzaW9uOiBib29sZWFuOyAvLyB2ZXJzaW9uXG4gIHVwZGF0ZUxvZ2dpbmc6IGJvb2xlYW47IC8vIGxvZ2dpbmdcbiAgdXBkYXRlRW5jcnlwdGlvbjogYm9vbGVhbjsgLy8gZW5jcnlwdGlvbiAoY2Fubm90IGJlIHVwZGF0ZWQpXG4gIHVwZGF0ZUFjY2VzczogYm9vbGVhbjsgLy8gcmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyBhbmQgZW5kcG9pbnRQdWJsaWNBY2Nlc3Ncbn1cblxuZnVuY3Rpb24gYW5hbHl6ZVVwZGF0ZShvbGRQcm9wczogUGFydGlhbDxhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0PiwgbmV3UHJvcHM6IGF3cy5FS1MuQ3JlYXRlQ2x1c3RlclJlcXVlc3QpOiBVcGRhdGVNYXAge1xuICBjb25zb2xlLmxvZygnb2xkIHByb3BzOiAnLCBKU09OLnN0cmluZ2lmeShvbGRQcm9wcykpO1xuICBjb25zb2xlLmxvZygnbmV3IHByb3BzOiAnLCBKU09OLnN0cmluZ2lmeShuZXdQcm9wcykpO1xuXG4gIGNvbnN0IG5ld1ZwY1Byb3BzID0gbmV3UHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnIHx8IHt9O1xuICBjb25zdCBvbGRWcGNQcm9wcyA9IG9sZFByb3BzLnJlc291cmNlc1ZwY0NvbmZpZyB8fCB7fTtcblxuICBjb25zdCBvbGRQdWJsaWNBY2Nlc3NDaWRycyA9IG5ldyBTZXQob2xkVnBjUHJvcHMucHVibGljQWNjZXNzQ2lkcnMgPz8gW10pO1xuICBjb25zdCBuZXdQdWJsaWNBY2Nlc3NDaWRycyA9IG5ldyBTZXQobmV3VnBjUHJvcHMucHVibGljQWNjZXNzQ2lkcnMgPz8gW10pO1xuICBjb25zdCBuZXdFbmMgPSBuZXdQcm9wcy5lbmNyeXB0aW9uQ29uZmlnIHx8IHt9O1xuICBjb25zdCBvbGRFbmMgPSBvbGRQcm9wcy5lbmNyeXB0aW9uQ29uZmlnIHx8IHt9O1xuXG4gIHJldHVybiB7XG4gICAgcmVwbGFjZU5hbWU6IG5ld1Byb3BzLm5hbWUgIT09IG9sZFByb3BzLm5hbWUsXG4gICAgcmVwbGFjZVZwYzpcbiAgICAgIEpTT04uc3RyaW5naWZ5KG5ld1ZwY1Byb3BzLnN1Ym5ldElkcz8uc29ydCgpKSAhPT0gSlNPTi5zdHJpbmdpZnkob2xkVnBjUHJvcHMuc3VibmV0SWRzPy5zb3J0KCkpIHx8XG4gICAgICBKU09OLnN0cmluZ2lmeShuZXdWcGNQcm9wcy5zZWN1cml0eUdyb3VwSWRzPy5zb3J0KCkpICE9PSBKU09OLnN0cmluZ2lmeShvbGRWcGNQcm9wcy5zZWN1cml0eUdyb3VwSWRzPy5zb3J0KCkpLFxuICAgIHVwZGF0ZUFjY2VzczpcbiAgICAgIG5ld1ZwY1Byb3BzLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyAhPT0gb2xkVnBjUHJvcHMuZW5kcG9pbnRQcml2YXRlQWNjZXNzIHx8XG4gICAgICBuZXdWcGNQcm9wcy5lbmRwb2ludFB1YmxpY0FjY2VzcyAhPT0gb2xkVnBjUHJvcHMuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgfHxcbiAgICAgICFzZXRzRXF1YWwobmV3UHVibGljQWNjZXNzQ2lkcnMsIG9sZFB1YmxpY0FjY2Vzc0NpZHJzKSxcbiAgICByZXBsYWNlUm9sZTogbmV3UHJvcHMucm9sZUFybiAhPT0gb2xkUHJvcHMucm9sZUFybixcbiAgICB1cGRhdGVWZXJzaW9uOiBuZXdQcm9wcy52ZXJzaW9uICE9PSBvbGRQcm9wcy52ZXJzaW9uLFxuICAgIHVwZGF0ZUVuY3J5cHRpb246IEpTT04uc3RyaW5naWZ5KG5ld0VuYykgIT09IEpTT04uc3RyaW5naWZ5KG9sZEVuYyksXG4gICAgdXBkYXRlTG9nZ2luZzogSlNPTi5zdHJpbmdpZnkobmV3UHJvcHMubG9nZ2luZykgIT09IEpTT04uc3RyaW5naWZ5KG9sZFByb3BzLmxvZ2dpbmcpLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRzRXF1YWwoZmlyc3Q6IFNldDxzdHJpbmc+LCBzZWNvbmQ6IFNldDxzdHJpbmc+KSB7XG4gIHJldHVybiBmaXJzdC5zaXplID09PSBzZWNvbmQuc2l6ZSAmJiBbLi4uZmlyc3RdLmV2ZXJ5KChlOiBzdHJpbmcpID0+IHNlY29uZC5oYXMoZSkpO1xufVxuIl19