"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterResourceHandler = void 0;
const common_1 = require("./common");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtCQUErQjs7O0FBTS9CLHFDQUFxRTtBQUVyRSxNQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQUVqQyxNQUFhLHNCQUF1QixTQUFRLHdCQUFlO0lBQ3pELElBQVcsV0FBVztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztTQUMvRTtRQUVELE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0tBQ2hDO0lBS0QsWUFBWSxHQUFjLEVBQUUsS0FBb0I7UUFDOUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsQixJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDL0Y7SUFFRCxTQUFTO0lBQ1QsU0FBUztJQUNULFNBQVM7SUFFQyxLQUFLLENBQUMsUUFBUTtRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQzFDO1FBRUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUks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Q0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ25FLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7S0FDckYsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxLQUFrQixFQUFFLE1BQW1CO0lBQ3hELE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBJc0NvbXBsZXRlUmVzcG9uc2UsIE9uRXZlbnRSZXNwb25zZSB9IGZyb20gJ0Bhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMvbGliL3Byb3ZpZGVyLWZyYW1ld29yay90eXBlcyc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyBhd3MgZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQgeyBFa3NDbGllbnQsIFJlc291cmNlRXZlbnQsIFJlc291cmNlSGFuZGxlciB9IGZyb20gJy4vY29tbW9uJztcblxuY29uc3QgTUFYX0NMVVNURVJfTkFNRV9MRU4gPSAxMDA7XG5cbmV4cG9ydCBjbGFzcyBDbHVzdGVyUmVzb3VyY2VIYW5kbGVyIGV4dGVuZHMgUmVzb3VyY2VIYW5kbGVyIHtcbiAgcHVibGljIGdldCBjbHVzdGVyTmFtZSgpIHtcbiAgICBpZiAoIXRoaXMucGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZXRlcm1pbmUgY2x1c3RlciBuYW1lIHdpdGhvdXQgcGh5c2ljYWwgcmVzb3VyY2UgSUQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5waHlzaWNhbFJlc291cmNlSWQ7XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IG5ld1Byb3BzOiBhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0O1xuICBwcml2YXRlIHJlYWRvbmx5IG9sZFByb3BzOiBQYXJ0aWFsPGF3cy5FS1MuQ3JlYXRlQ2x1c3RlclJlcXVlc3Q+O1xuXG4gIGNvbnN0cnVjdG9yKGVrczogRWtzQ2xpZW50LCBldmVudDogUmVzb3VyY2VFdmVudCkge1xuICAgIHN1cGVyKGVrcywgZXZlbnQpO1xuXG4gICAgdGhpcy5uZXdQcm9wcyA9IHBhcnNlUHJvcHModGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgIHRoaXMub2xkUHJvcHMgPSBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScgPyBwYXJzZVByb3BzKGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcykgOiB7fTtcbiAgfVxuXG4gIC8vIC0tLS0tLVxuICAvLyBDUkVBVEVcbiAgLy8gLS0tLS0tXG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uQ3JlYXRlKCk6IFByb21pc2U8T25FdmVudFJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5sb2coJ29uQ3JlYXRlOiBjcmVhdGluZyBjbHVzdGVyIHdpdGggb3B0aW9uczonLCBKU09OLnN0cmluZ2lmeSh0aGlzLm5ld1Byb3BzLCB1bmRlZmluZWQsIDIpKTtcbiAgICBpZiAoIXRoaXMubmV3UHJvcHMucm9sZUFybikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcInJvbGVBcm5cIiBpcyByZXF1aXJlZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGNsdXN0ZXJOYW1lID0gdGhpcy5uZXdQcm9wcy5uYW1lIHx8IHRoaXMuZ2VuZXJhdGVDbHVzdGVyTmFtZSgpO1xuXG4gICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuZWtzLmNyZWF0ZUNsdXN0ZXIoe1xuICAgICAgLi4udGhpcy5uZXdQcm9wcyxcbiAgICAgIG5hbWU6IGNsdXN0ZXJOYW1lLFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwLmNsdXN0ZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igd2hlbiB0cnlpbmcgdG8gY3JlYXRlIGNsdXN0ZXIgJHtjbHVzdGVyTmFtZX06IENyZWF0ZUNsdXN0ZXIgcmV0dXJuZWQgd2l0aG91dCBjbHVzdGVyIGluZm9ybWF0aW9uYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogcmVzcC5jbHVzdGVyLm5hbWUsXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc0NyZWF0ZUNvbXBsZXRlKCkge1xuICAgIHJldHVybiB0aGlzLmlzQWN0aXZlKCk7XG4gIH1cblxuICAvLyAtLS0tLS1cbiAgLy8gREVMRVRFXG4gIC8vIC0tLS0tLVxuXG4gIHByb3RlY3RlZCBhc3luYyBvbkRlbGV0ZSgpOiBQcm9taXNlPE9uRXZlbnRSZXNwb25zZT4ge1xuICAgIGNvbnNvbGUubG9nKGBvbkRlbGV0ZTogZGVsZXRpbmcgY2x1c3RlciAke3RoaXMuY2x1c3Rlck5hbWV9YCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZWtzLmRlbGV0ZUNsdXN0ZXIoeyBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lIH0pO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgaWYgKGUuY29kZSAhPT0gJ1Jlc291cmNlTm90Rm91bmRFeGNlcHRpb24nKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhgY2x1c3RlciAke3RoaXMuY2x1c3Rlck5hbWV9IG5vdCBmb3VuZCwgaWRlbXBvdGVudGx5IHN1Y2NlZWRlZGApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiB0aGlzLmNsdXN0ZXJOYW1lLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaXNEZWxldGVDb21wbGV0ZSgpOiBQcm9taXNlPElzQ29tcGxldGVSZXNwb25zZT4ge1xuICAgIGNvbnNvbGUubG9nKGBpc0RlbGV0ZUNvbXBsZXRlOiB3YWl0aW5nIGZvciBjbHVzdGVyICR7dGhpcy5jbHVzdGVyTmFtZX0gdG8gYmUgZGVsZXRlZGApO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCB0aGlzLmVrcy5kZXNjcmliZUNsdXN0ZXIoeyBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lIH0pO1xuICAgICAgY29uc29sZS5sb2coJ2Rlc2NyaWJlQ2x1c3RlciByZXR1cm5lZDonLCBKU09OLnN0cmluZ2lmeShyZXNwLCB1bmRlZmluZWQsIDIpKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIGlmIChlLmNvZGUgPT09ICdSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uJykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVjZWl2ZWQgUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbiwgdGhpcyBtZWFucyB0aGUgY2x1c3RlciBoYXMgYmVlbiBkZWxldGVkIChvciBuZXZlciBleGlzdGVkKScpO1xuICAgICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiB0cnVlIH07XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCdkZXNjcmliZUNsdXN0ZXIgZXJyb3I6JywgZSk7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBJc0NvbXBsZXRlOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgLy8gLS0tLS0tXG4gIC8vIFVQREFURVxuICAvLyAtLS0tLS1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25VcGRhdGUoKSB7XG4gICAgY29uc3QgdXBkYXRlcyA9IGFuYWx5emVVcGRhdGUodGhpcy5vbGRQcm9wcywgdGhpcy5uZXdQcm9wcyk7XG4gICAgY29uc29sZS5sb2coJ29uVXBkYXRlOicsIEpTT04uc3RyaW5naWZ5KHsgdXBkYXRlcyB9LCB1bmRlZmluZWQsIDIpKTtcblxuICAgIC8vIHVwZGF0ZXMgdG8gZW5jcnlwdGlvbiBjb25maWcgaXMgbm90IHN1cHBvcnRlZFxuICAgIGlmICh1cGRhdGVzLnVwZGF0ZUVuY3J5cHRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVwZGF0ZSBjbHVzdGVyIGVuY3J5cHRpb24gY29uZmlndXJhdGlvbicpO1xuICAgIH1cblxuICAgIC8vIGlmIHRoZXJlIGlzIGFuIHVwZGF0ZSB0aGF0IHJlcXVpcmVzIHJlcGxhY2VtZW50LCBnbyBhaGVhZCBhbmQganVzdCBjcmVhdGVcbiAgICAvLyBhIG5ldyBjbHVzdGVyIHdpdGggdGhlIG5ldyBjb25maWcuIFRoZSBvbGQgY2x1c3RlciB3aWxsIGF1dG9tYXRpY2FsbHkgYmVcbiAgICAvLyBkZWxldGVkIGJ5IGNsb3VkZm9ybWF0aW9uIHVwb24gc3VjY2Vzcy5cbiAgICBpZiAodXBkYXRlcy5yZXBsYWNlTmFtZSB8fCB1cGRhdGVzLnJlcGxhY2VSb2xlIHx8IHVwZGF0ZXMucmVwbGFjZVZwYykge1xuXG4gICAgICAvLyBpZiB3ZSBhcmUgcmVwbGFjaW5nIHRoaXMgY2x1c3RlciBhbmQgdGhlIGNsdXN0ZXIgaGFzIGFuIGV4cGxpY2l0XG4gICAgICAvLyBwaHlzaWNhbCBuYW1lLCB0aGUgY3JlYXRpb24gb2YgdGhlIG5ldyBjbHVzdGVyIHdpbGwgZmFpbCB3aXRoIFwidGhlcmUgaXNcbiAgICAgIC8vIGFscmVhZHkgYSBjbHVzdGVyIHdpdGggdGhhdCBuYW1lXCIuIHRoaXMgaXMgYSBjb21tb24gYmVoYXZpb3IgZm9yXG4gICAgICAvLyBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHNwZWNpZnlpbmcgYSBwaHlzaWNhbCBuYW1lLlxuICAgICAgaWYgKHRoaXMub2xkUHJvcHMubmFtZSA9PT0gdGhpcy5uZXdQcm9wcy5uYW1lICYmIHRoaXMub2xkUHJvcHMubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZXBsYWNlIGNsdXN0ZXIgXCIke3RoaXMub2xkUHJvcHMubmFtZX1cIiBzaW5jZSBpdCBoYXMgYW4gZXhwbGljaXQgcGh5c2ljYWwgbmFtZS4gRWl0aGVyIHJlbmFtZSB0aGUgY2x1c3RlciBvciByZW1vdmUgdGhlIFwibmFtZVwiIGNvbmZpZ3VyYXRpb25gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub25DcmVhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBpZiBhIHZlcnNpb24gdXBkYXRlIGlzIHJlcXVpcmVkLCBpc3N1ZSB0aGUgdmVyc2lvbiB1cGRhdGVcbiAgICBpZiAodXBkYXRlcy51cGRhdGVWZXJzaW9uKSB7XG4gICAgICBpZiAoIXRoaXMubmV3UHJvcHMudmVyc2lvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZW1vdmUgY2x1c3RlciB2ZXJzaW9uIGNvbmZpZ3VyYXRpb24uIEN1cnJlbnQgdmVyc2lvbiBpcyAke3RoaXMub2xkUHJvcHMudmVyc2lvbn1gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlQ2x1c3RlclZlcnNpb24odGhpcy5uZXdQcm9wcy52ZXJzaW9uKTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlcy51cGRhdGVMb2dnaW5nICYmIHVwZGF0ZXMudXBkYXRlQWNjZXNzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1cGRhdGUgbG9nZ2luZyBhbmQgYWNjZXNzIGF0IHRoZSBzYW1lIHRpbWUnKTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlcy51cGRhdGVMb2dnaW5nIHx8IHVwZGF0ZXMudXBkYXRlQWNjZXNzKSB7XG4gICAgICBjb25zdCBjb25maWc6IGF3cy5FS1MuVXBkYXRlQ2x1c3RlckNvbmZpZ1JlcXVlc3QgPSB7XG4gICAgICAgIG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsXG4gICAgICB9O1xuICAgICAgaWYgKHVwZGF0ZXMudXBkYXRlTG9nZ2luZykge1xuICAgICAgICBjb25maWcubG9nZ2luZyA9IHRoaXMubmV3UHJvcHMubG9nZ2luZztcbiAgICAgIH07XG4gICAgICBpZiAodXBkYXRlcy51cGRhdGVBY2Nlc3MpIHtcbiAgICAgICAgLy8gVXBkYXRpbmcgdGhlIGNsdXN0ZXIgd2l0aCBzZWN1cml0eUdyb3VwSWRzIGFuZCBzdWJuZXRJZHMgKGFzIHNwZWNpZmllZCBpbiB0aGUgd2FybmluZyBoZXJlOlxuICAgICAgICAvLyBodHRwczovL2F3c2NsaS5hbWF6b25hd3MuY29tL3YyL2RvY3VtZW50YXRpb24vYXBpL2xhdGVzdC9yZWZlcmVuY2UvZWtzL3VwZGF0ZS1jbHVzdGVyLWNvbmZpZy5odG1sKVxuICAgICAgICAvLyB3aWxsIGZhaWwsIHRoZXJlZm9yZSB3ZSB0YWtlIG9ubHkgdGhlIGFjY2VzcyBmaWVsZHMgZXhwbGljaXRseVxuICAgICAgICBjb25maWcucmVzb3VyY2VzVnBjQ29uZmlnID0ge1xuICAgICAgICAgIGVuZHBvaW50UHJpdmF0ZUFjY2VzczogdGhpcy5uZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQcml2YXRlQWNjZXNzLFxuICAgICAgICAgIGVuZHBvaW50UHVibGljQWNjZXNzOiB0aGlzLm5ld1Byb3BzLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFB1YmxpY0FjY2VzcyxcbiAgICAgICAgICBwdWJsaWNBY2Nlc3NDaWRyczogdGhpcy5uZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcucHVibGljQWNjZXNzQ2lkcnMsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBjb25zdCB1cGRhdGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLnVwZGF0ZUNsdXN0ZXJDb25maWcoY29uZmlnKTtcblxuICAgICAgcmV0dXJuIHsgRWtzVXBkYXRlSWQ6IHVwZGF0ZVJlc3BvbnNlLnVwZGF0ZT8uaWQgfTtcbiAgICB9XG5cbiAgICAvLyBubyB1cGRhdGVzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzVXBkYXRlQ29tcGxldGUoKSB7XG4gICAgY29uc29sZS5sb2coJ2lzVXBkYXRlQ29tcGxldGUnKTtcblxuICAgIC8vIGlmIHRoaXMgaXMgYW4gRUtTIHVwZGF0ZSwgd2Ugd2lsbCBtb25pdG9yIHRoZSB1cGRhdGUgZXZlbnQgaXRzZWxmXG4gICAgaWYgKHRoaXMuZXZlbnQuRWtzVXBkYXRlSWQpIHtcbiAgICAgIGNvbnN0IGNvbXBsZXRlID0gYXdhaXQgdGhpcy5pc0Vrc1VwZGF0ZUNvbXBsZXRlKHRoaXMuZXZlbnQuRWtzVXBkYXRlSWQpO1xuICAgICAgaWYgKCFjb21wbGV0ZSkge1xuICAgICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiBmYWxzZSB9O1xuICAgICAgfVxuXG4gICAgICAvLyBmYWxsIHRocm91Z2g6IGlmIHRoZSB1cGRhdGUgaXMgZG9uZSwgd2Ugc2ltcGx5IGRlbGVnYXRlIHRvIGlzQWN0aXZlKClcbiAgICAgIC8vIGluIG9yZGVyIHRvIGV4dHJhY3QgYXR0cmlidXRlcyBhbmQgc3RhdGUgZnJvbSB0aGUgY2x1c3RlciBpdHNlbGYsIHdoaWNoXG4gICAgICAvLyBpcyBzdXBwb3NlZCB0byBiZSBpbiBhbiBBQ1RJVkUgc3RhdGUgYWZ0ZXIgdGhlIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVDbHVzdGVyVmVyc2lvbihuZXdWZXJzaW9uOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhgdXBkYXRpbmcgY2x1c3RlciB2ZXJzaW9uIHRvICR7bmV3VmVyc2lvbn1gKTtcblxuICAgIC8vIHVwZGF0ZS1jbHVzdGVyLXZlcnNpb24gd2lsbCBmYWlsIGlmIHdlIHRyeSB0byB1cGRhdGUgdG8gdGhlIHNhbWUgdmVyc2lvbixcbiAgICAvLyBzbyBza2lwIGluIHRoaXMgY2FzZS5cbiAgICBjb25zdCBjbHVzdGVyID0gKGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSkpLmNsdXN0ZXI7XG4gICAgaWYgKGNsdXN0ZXI/LnZlcnNpb24gPT09IG5ld1ZlcnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKGBjbHVzdGVyIGFscmVhZHkgYXQgdmVyc2lvbiAke2NsdXN0ZXIudmVyc2lvbn0sIHNraXBwaW5nIHZlcnNpb24gdXBkYXRlYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy51cGRhdGVDbHVzdGVyVmVyc2lvbih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsIHZlcnNpb246IG5ld1ZlcnNpb24gfSk7XG4gICAgcmV0dXJuIHsgRWtzVXBkYXRlSWQ6IHVwZGF0ZVJlc3BvbnNlLnVwZGF0ZT8uaWQgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaXNBY3RpdmUoKTogUHJvbWlzZTxJc0NvbXBsZXRlUmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZygnd2FpdGluZyBmb3IgY2x1c3RlciB0byBiZWNvbWUgQUNUSVZFJyk7XG4gICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgY29uc29sZS5sb2coJ2Rlc2NyaWJlQ2x1c3RlciByZXN1bHQ6JywgSlNPTi5zdHJpbmdpZnkocmVzcCwgdW5kZWZpbmVkLCAyKSk7XG4gICAgY29uc3QgY2x1c3RlciA9IHJlc3AuY2x1c3RlcjtcblxuICAgIC8vIGlmIGNsdXN0ZXIgaXMgdW5kZWZpbmVkIChzaG91bGRudCBoYXBwZW4pIG9yIHN0YXR1cyBpcyBub3QgQUNUSVZFLCB3ZSBhcmVcbiAgICAvLyBub3QgY29tcGxldGUuIG5vdGUgdGhhdCB0aGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyIGZyYW1ld29yayBmb3JiaWRzXG4gICAgLy8gcmV0dXJuaW5nIGF0dHJpYnV0ZXMgKERhdGEpIGlmIGlzQ29tcGxldGUgaXMgZmFsc2UuXG4gICAgaWYgKGNsdXN0ZXI/LnN0YXR1cyA9PT0gJ0ZBSUxFRCcpIHtcbiAgICAgIC8vIG5vdCB2ZXJ5IGluZm9ybWF0aXZlLCB1bmZvcnR1bmF0ZWx5IHRoZSByZXNwb25zZSBkb2Vzbid0IGNvbnRhaW4gYW55IGVycm9yXG4gICAgICAvLyBpbmZvcm1hdGlvbiA6XFxcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2x1c3RlciBpcyBpbiBhIEZBSUxFRCBzdGF0dXMnKTtcbiAgICB9IGVsc2UgaWYgKGNsdXN0ZXI/LnN0YXR1cyAhPT0gJ0FDVElWRScpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIElzQ29tcGxldGU6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgSXNDb21wbGV0ZTogdHJ1ZSxcbiAgICAgICAgRGF0YToge1xuICAgICAgICAgIE5hbWU6IGNsdXN0ZXIubmFtZSxcbiAgICAgICAgICBFbmRwb2ludDogY2x1c3Rlci5lbmRwb2ludCxcbiAgICAgICAgICBBcm46IGNsdXN0ZXIuYXJuLFxuXG4gICAgICAgICAgLy8gSU1QT1JUQU5UOiBDRk4gZXhwZWN0cyB0aGF0IGF0dHJpYnV0ZXMgd2lsbCAqYWx3YXlzKiBoYXZlIHZhbHVlcyxcbiAgICAgICAgICAvLyBzbyByZXR1cm4gYW4gZW1wdHkgc3RyaW5nIGluIGNhc2UgdGhlIHZhbHVlIGlzIG5vdCBkZWZpbmVkLlxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgQ0ZOIHdpbGwgdGhyb3cgd2l0aCBgVmVuZG9yIHJlc3BvbnNlIGRvZXNuJ3QgY29udGFpblxuICAgICAgICAgIC8vIFhYWFgga2V5YC5cblxuICAgICAgICAgIENlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogY2x1c3Rlci5jZXJ0aWZpY2F0ZUF1dGhvcml0eT8uZGF0YSA/PyAnJyxcbiAgICAgICAgICBDbHVzdGVyU2VjdXJpdHlHcm91cElkOiBjbHVzdGVyLnJlc291cmNlc1ZwY0NvbmZpZz8uY2x1c3RlclNlY3VyaXR5R3JvdXBJZCA/PyAnJyxcbiAgICAgICAgICBPcGVuSWRDb25uZWN0SXNzdWVyVXJsOiBjbHVzdGVyLmlkZW50aXR5Py5vaWRjPy5pc3N1ZXIgPz8gJycsXG4gICAgICAgICAgT3BlbklkQ29ubmVjdElzc3VlcjogY2x1c3Rlci5pZGVudGl0eT8ub2lkYz8uaXNzdWVyPy5zdWJzdHJpbmcoOCkgPz8gJycsIC8vIFN0cmlwcyBvZmYgaHR0cHM6Ly8gZnJvbSB0aGUgaXNzdWVyIHVybFxuXG4gICAgICAgICAgLy8gV2UgY2FuIHNhZmVseSByZXR1cm4gdGhlIGZpcnN0IGl0ZW0gZnJvbSBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24gYXJyYXksIGJlY2F1c2UgaXQgaGFzIGEgbGltaXQgb2YgMSBpdGVtXG4gICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9DcmVhdGVDbHVzdGVyLmh0bWwjQW1hem9uRUtTLUNyZWF0ZUNsdXN0ZXItcmVxdWVzdC1lbmNyeXB0aW9uQ29uZmlnXG4gICAgICAgICAgRW5jcnlwdGlvbkNvbmZpZ0tleUFybjogY2x1c3Rlci5lbmNyeXB0aW9uQ29uZmlnPy5zaGlmdCgpPy5wcm92aWRlcj8ua2V5QXJuID8/ICcnLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGlzRWtzVXBkYXRlQ29tcGxldGUoZWtzVXBkYXRlSWQ6IHN0cmluZykge1xuICAgIHRoaXMubG9nKHsgaXNFa3NVcGRhdGVDb21wbGV0ZTogZWtzVXBkYXRlSWQgfSk7XG5cbiAgICBjb25zdCBkZXNjcmliZVVwZGF0ZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5la3MuZGVzY3JpYmVVcGRhdGUoe1xuICAgICAgbmFtZTogdGhpcy5jbHVzdGVyTmFtZSxcbiAgICAgIHVwZGF0ZUlkOiBla3NVcGRhdGVJZCxcbiAgICB9KTtcblxuICAgIHRoaXMubG9nKHsgZGVzY3JpYmVVcGRhdGVSZXNwb25zZSB9KTtcblxuICAgIGlmICghZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5hYmxlIHRvIGRlc2NyaWJlIHVwZGF0ZSB3aXRoIGlkIFwiJHtla3NVcGRhdGVJZH1cImApO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUuc3RhdHVzKSB7XG4gICAgICBjYXNlICdJblByb2dyZXNzJzpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSAnU3VjY2Vzc2Z1bCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnRmFpbGVkJzpcbiAgICAgIGNhc2UgJ0NhbmNlbGxlZCc6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgY2x1c3RlciB1cGRhdGUgaWQgXCIke2Vrc1VwZGF0ZUlkfVwiIGZhaWxlZCB3aXRoIGVycm9yczogJHtKU09OLnN0cmluZ2lmeShkZXNjcmliZVVwZGF0ZVJlc3BvbnNlLnVwZGF0ZS5lcnJvcnMpfWApO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmtub3duIHN0YXR1cyBcIiR7ZGVzY3JpYmVVcGRhdGVSZXNwb25zZS51cGRhdGUuc3RhdHVzfVwiIGZvciB1cGRhdGUgaWQgXCIke2Vrc1VwZGF0ZUlkfVwiYCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUNsdXN0ZXJOYW1lKCkge1xuICAgIGNvbnN0IHN1ZmZpeCA9IHRoaXMucmVxdWVzdElkLnJlcGxhY2UoLy0vZywgJycpOyAvLyAzMiBjaGFyc1xuICAgIGNvbnN0IG9mZnNldCA9IE1BWF9DTFVTVEVSX05BTUVfTEVOIC0gc3VmZml4Lmxlbmd0aCAtIDE7XG4gICAgY29uc3QgcHJlZml4ID0gdGhpcy5sb2dpY2FsUmVzb3VyY2VJZC5zbGljZSgwLCBvZmZzZXQgPiAwID8gb2Zmc2V0IDogMCk7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0tJHtzdWZmaXh9YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVByb3BzKHByb3BzOiBhbnkpOiBhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0IHtcblxuICBjb25zdCBwYXJzZWQgPSBwcm9wcz8uQ29uZmlnID8/IHt9O1xuXG4gIC8vIHRoaXMgaXMgd2VpcmQgYnV0IHRoZXNlIGJvb2xlYW4gcHJvcGVydGllcyBhcmUgcGFzc2VkIGJ5IENGTiBhcyBhIHN0cmluZywgYW5kIHdlIG5lZWQgdGhlbSB0byBiZSBib29sZWFuaWMgZm9yIHRoZSBTREsuXG4gIC8vIE90aGVyd2lzZSBpdCBmYWlscyB3aXRoICdVbmV4cGVjdGVkIFBhcmFtZXRlcjogcGFyYW1zLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgaXMgZXhwZWN0ZWQgdG8gYmUgYSBib29sZWFuJ1xuXG4gIGlmICh0eXBlb2YgKHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWc/LmVuZHBvaW50UHJpdmF0ZUFjY2VzcykgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgPSBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyA9PT0gJ3RydWUnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiAocGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZz8uZW5kcG9pbnRQdWJsaWNBY2Nlc3MpID09PSAnc3RyaW5nJykge1xuICAgIHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgPSBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHVibGljQWNjZXNzID09PSAndHJ1ZSc7XG4gIH1cblxuICBpZiAodHlwZW9mIChwYXJzZWQubG9nZ2luZz8uY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCkgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLmxvZ2dpbmcuY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCA9IHBhcnNlZC5sb2dnaW5nLmNsdXN0ZXJMb2dnaW5nWzBdLmVuYWJsZWQgPT09ICd0cnVlJztcbiAgfVxuXG4gIHJldHVybiBwYXJzZWQ7XG5cbn1cblxuaW50ZXJmYWNlIFVwZGF0ZU1hcCB7XG4gIHJlcGxhY2VOYW1lOiBib29sZWFuOyAvLyBuYW1lXG4gIHJlcGxhY2VWcGM6IGJvb2xlYW47IC8vIHJlc291cmNlc1ZwY0NvbmZpZy5zdWJuZXRJZHMgYW5kIHNlY3VyaXR5R3JvdXBJZHNcbiAgcmVwbGFjZVJvbGU6IGJvb2xlYW47IC8vIHJvbGVBcm5cblxuICB1cGRhdGVWZXJzaW9uOiBib29sZWFuOyAvLyB2ZXJzaW9uXG4gIHVwZGF0ZUxvZ2dpbmc6IGJvb2xlYW47IC8vIGxvZ2dpbmdcbiAgdXBkYXRlRW5jcnlwdGlvbjogYm9vbGVhbjsgLy8gZW5jcnlwdGlvbiAoY2Fubm90IGJlIHVwZGF0ZWQpXG4gIHVwZGF0ZUFjY2VzczogYm9vbGVhbjsgLy8gcmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyBhbmQgZW5kcG9pbnRQdWJsaWNBY2Nlc3Ncbn1cblxuZnVuY3Rpb24gYW5hbHl6ZVVwZGF0ZShvbGRQcm9wczogUGFydGlhbDxhd3MuRUtTLkNyZWF0ZUNsdXN0ZXJSZXF1ZXN0PiwgbmV3UHJvcHM6IGF3cy5FS1MuQ3JlYXRlQ2x1c3RlclJlcXVlc3QpOiBVcGRhdGVNYXAge1xuICBjb25zb2xlLmxvZygnb2xkIHByb3BzOiAnLCBKU09OLnN0cmluZ2lmeShvbGRQcm9wcykpO1xuICBjb25zb2xlLmxvZygnbmV3IHByb3BzOiAnLCBKU09OLnN0cmluZ2lmeShuZXdQcm9wcykpO1xuXG4gIGNvbnN0IG5ld1ZwY1Byb3BzID0gbmV3UHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnIHx8IHt9O1xuICBjb25zdCBvbGRWcGNQcm9wcyA9IG9sZFByb3BzLnJlc291cmNlc1ZwY0NvbmZpZyB8fCB7fTtcblxuICBjb25zdCBvbGRQdWJsaWNBY2Nlc3NDaWRycyA9IG5ldyBTZXQob2xkVnBjUHJvcHMucHVibGljQWNjZXNzQ2lkcnMgPz8gW10pO1xuICBjb25zdCBuZXdQdWJsaWNBY2Nlc3NDaWRycyA9IG5ldyBTZXQobmV3VnBjUHJvcHMucHVibGljQWNjZXNzQ2lkcnMgPz8gW10pO1xuICBjb25zdCBuZXdFbmMgPSBuZXdQcm9wcy5lbmNyeXB0aW9uQ29uZmlnIHx8IHt9O1xuICBjb25zdCBvbGRFbmMgPSBvbGRQcm9wcy5lbmNyeXB0aW9uQ29uZmlnIHx8IHt9O1xuXG4gIHJldHVybiB7XG4gICAgcmVwbGFjZU5hbWU6IG5ld1Byb3BzLm5hbWUgIT09IG9sZFByb3BzLm5hbWUsXG4gICAgcmVwbGFjZVZwYzpcbiAgICAgIEpTT04uc3RyaW5naWZ5KG5ld1ZwY1Byb3BzLnN1Ym5ldElkcz8uc29ydCgpKSAhPT0gSlNPTi5zdHJpbmdpZnkob2xkVnBjUHJvcHMuc3VibmV0SWRzPy5zb3J0KCkpIHx8XG4gICAgICBKU09OLnN0cmluZ2lmeShuZXdWcGNQcm9wcy5zZWN1cml0eUdyb3VwSWRzPy5zb3J0KCkpICE9PSBKU09OLnN0cmluZ2lmeShvbGRWcGNQcm9wcy5zZWN1cml0eUdyb3VwSWRzPy5zb3J0KCkpLFxuICAgIHVwZGF0ZUFjY2VzczpcbiAgICAgIG5ld1ZwY1Byb3BzLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyAhPT0gb2xkVnBjUHJvcHMuZW5kcG9pbnRQcml2YXRlQWNjZXNzIHx8XG4gICAgICBuZXdWcGNQcm9wcy5lbmRwb2ludFB1YmxpY0FjY2VzcyAhPT0gb2xkVnBjUHJvcHMuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgfHxcbiAgICAgICFzZXRzRXF1YWwobmV3UHVibGljQWNjZXNzQ2lkcnMsIG9sZFB1YmxpY0FjY2Vzc0NpZHJzKSxcbiAgICByZXBsYWNlUm9sZTogbmV3UHJvcHMucm9sZUFybiAhPT0gb2xkUHJvcHMucm9sZUFybixcbiAgICB1cGRhdGVWZXJzaW9uOiBuZXdQcm9wcy52ZXJzaW9uICE9PSBvbGRQcm9wcy52ZXJzaW9uLFxuICAgIHVwZGF0ZUVuY3J5cHRpb246IEpTT04uc3RyaW5naWZ5KG5ld0VuYykgIT09IEpTT04uc3RyaW5naWZ5KG9sZEVuYyksXG4gICAgdXBkYXRlTG9nZ2luZzogSlNPTi5zdHJpbmdpZnkobmV3UHJvcHMubG9nZ2luZykgIT09IEpTT04uc3RyaW5naWZ5KG9sZFByb3BzLmxvZ2dpbmcpLFxuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRzRXF1YWwoZmlyc3Q6IFNldDxzdHJpbmc+LCBzZWNvbmQ6IFNldDxzdHJpbmc+KSB7XG4gIHJldHVybiBmaXJzdC5zaXplID09PSBzZWNvbmQuc2l6ZSAmJiBbLi4uZmlyc3RdLmV2ZXJ5KChlOiBzdHJpbmcpID0+IHNlY29uZC5oYXMoZSkpO1xufVxuIl19