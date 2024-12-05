"use strict";
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
        if (updates.replaceName || updates.replaceRole || updates.updateBootstrapClusterCreatorAdminPermissions) {
            // if we are replacing this cluster and the cluster has an explicit
            // physical name, the creation of the new cluster will fail with "there is
            // already a cluster with that name". this is a common behavior for
            // CloudFormation resources that support specifying a physical name.
            if (this.oldProps.name === this.newProps.name && this.oldProps.name) {
                throw new Error(`Cannot replace cluster "${this.oldProps.name}" since it has an explicit physical name. Either rename the cluster or remove the "name" configuration`);
            }
            return this.onCreate();
        }
        // validate updates
        const updateTypes = Object.keys(updates);
        const enabledUpdateTypes = updateTypes.filter((type) => updates[type]);
        console.log(enabledUpdateTypes);
        if (enabledUpdateTypes.length > 1) {
            throw new Error('Only one type of update - VpcConfigUpdate, LoggingUpdate, EndpointAccessUpdate, or AuthModeUpdate can be allowed');
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
                            const tagConfig = {
                                resourceArn: cluster?.arn,
                                tags: tagsToAdd,
                            };
                            await this.eks.tagResource(tagConfig);
                        }
                        // Remove the tags that were removed in newProps
                        const tagsToRemove = getTagsToRemove(this.oldProps.tags, this.newProps.tags);
                        if (tagsToRemove.length > 0) {
                            const config = {
                                resourceArn: cluster?.arn,
                                tagKeys: tagsToRemove,
                            };
                            await this.eks.untagResource(config);
                        }
                    }
                    else {
                        // This means newProps.tags is empty hence remove all tags
                        const config = {
                            resourceArn: cluster?.arn,
                            tagKeys: Object.keys(this.oldProps.tags),
                        };
                        await this.eks.untagResource(config);
                    }
                }
                else {
                    // This means oldProps.tags was empty hence add all tags from newProps.tags
                    const config = {
                        resourceArn: cluster?.arn,
                        tags: this.newProps.tags,
                    };
                    await this.eks.tagResource(config);
                }
            }
            catch (e) {
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
            const config = {
                name: this.clusterName,
            };
            if (updates.updateLogging) {
                config.logging = this.newProps.logging;
            }
            ;
            if (updates.updateAccess) {
                config.resourcesVpcConfig = {
                    endpointPrivateAccess: this.newProps.resourcesVpcConfig?.endpointPrivateAccess,
                    endpointPublicAccess: this.newProps.resourcesVpcConfig?.endpointPublicAccess,
                    publicAccessCidrs: this.newProps.resourcesVpcConfig?.publicAccessCidrs,
                };
            }
            ;
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
                }
                catch (e) {
                    throw e;
                }
                config.accessConfig = this.newProps.accessConfig;
            }
            ;
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
                    OpenIdConnectIssuer: cluster.identity?.oidc?.issuer?.substring(8) ?? '', // Strips off https:// from the issuer url
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
    const newAccessConfig = newProps.accessConfig || {};
    const oldAccessConfig = oldProps.accessConfig || {};
    return {
        replaceName: newProps.name !== oldProps.name,
        updateVpc: JSON.stringify(newVpcProps.subnetIds?.sort()) !== JSON.stringify(oldVpcProps.subnetIds?.sort()) ||
            JSON.stringify(newVpcProps.securityGroupIds?.sort()) !== JSON.stringify(oldVpcProps.securityGroupIds?.sort()),
        updateAccess: newVpcProps.endpointPrivateAccess !== oldVpcProps.endpointPrivateAccess ||
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
function setsEqual(first, second) {
    return first.size === second.size && [...first].every((e) => second.has(e));
}
function getTagsToUpdate(oldTags, newTags) {
    const diff = {};
    // Get all tag keys that are newly added and keys whose value have changed
    for (const key in newTags) {
        if (newTags.hasOwnProperty(key)) {
            if (!oldTags.hasOwnProperty(key)) {
                diff[key] = newTags[key];
            }
            else if (oldTags[key] !== newTags[key]) {
                diff[key] = newTags[key];
            }
        }
    }
    return diff;
}
function getTagsToRemove(oldTags, newTags) {
    const missingKeys = [];
    //Get all tag keys to remove
    for (const key in oldTags) {
        if (oldTags.hasOwnProperty(key) && !newTags.hasOwnProperty(key)) {
            missingKeys.push(key);
        }
    }
    return missingKeys;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEscUNBQXFFO0FBQ3JFLHFEQUF1RDtBQUV2RCxNQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQUVqQyxNQUFhLHNCQUF1QixTQUFRLHdCQUFlO0lBQ3pELElBQVcsV0FBVztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztLQUNoQztJQUtELFlBQVksR0FBYyxFQUFFLEtBQW9CO1FBQzlDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzlGLDhGQUE4RjtRQUM5RixNQUFNLFFBQVEsR0FBMkMsSUFBQSxvQ0FBbUIsRUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0tBQzFDO0lBRUQsU0FBUztJQUNULFNBQVM7SUFDVCxTQUFTO0lBRUMsS0FBSyxDQUFDLFFBQVE7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLENB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QWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2hFLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgRUtTIGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1la3MnO1xuaW1wb3J0IHsgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVzcG9uc2UgfSBmcm9tICdhd3MtY2RrLWxpYi9jdXN0b20tcmVzb3VyY2VzL2xpYi9wcm92aWRlci1mcmFtZXdvcmsvdHlwZXMnO1xuaW1wb3J0IHsgRWtzQ2xpZW50LCBSZXNvdXJjZUV2ZW50LCBSZXNvdXJjZUhhbmRsZXIgfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgeyBjb21wYXJlTG9nZ2luZ1Byb3BzIH0gZnJvbSAnLi9jb21wYXJlTG9nZ2luZyc7XG5cbmNvbnN0IE1BWF9DTFVTVEVSX05BTUVfTEVOID0gMTAwO1xuXG5leHBvcnQgY2xhc3MgQ2x1c3RlclJlc291cmNlSGFuZGxlciBleHRlbmRzIFJlc291cmNlSGFuZGxlciB7XG4gIHB1YmxpYyBnZXQgY2x1c3Rlck5hbWUoKSB7XG4gICAgaWYgKCF0aGlzLnBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGV0ZXJtaW5lIGNsdXN0ZXIgbmFtZSB3aXRob3V0IHBoeXNpY2FsIHJlc291cmNlIElEJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGh5c2ljYWxSZXNvdXJjZUlkO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBuZXdQcm9wczogRUtTLkNyZWF0ZUNsdXN0ZXJDb21tYW5kSW5wdXQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgb2xkUHJvcHM6IFBhcnRpYWw8RUtTLkNyZWF0ZUNsdXN0ZXJDb21tYW5kSW5wdXQ+O1xuXG4gIGNvbnN0cnVjdG9yKGVrczogRWtzQ2xpZW50LCBldmVudDogUmVzb3VyY2VFdmVudCkge1xuICAgIHN1cGVyKGVrcywgZXZlbnQpO1xuXG4gICAgdGhpcy5uZXdQcm9wcyA9IHBhcnNlUHJvcHModGhpcy5ldmVudC5SZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgIHRoaXMub2xkUHJvcHMgPSBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScgPyBwYXJzZVByb3BzKGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcykgOiB7fTtcbiAgICAvLyBjb21wYXJlIG5ld1Byb3BzIGFuZCBvbGRQcm9wcyBhbmQgdXBkYXRlIHRoZSBuZXdQcm9wcyBieSBhcHBlbmRpbmcgZGlzYWJsZWQgTG9nU2V0dXAgaWYgYW55XG4gICAgY29uc3QgY29tcGFyZWQ6IFBhcnRpYWw8RUtTLkNyZWF0ZUNsdXN0ZXJDb21tYW5kSW5wdXQ+ID0gY29tcGFyZUxvZ2dpbmdQcm9wcyh0aGlzLm9sZFByb3BzLCB0aGlzLm5ld1Byb3BzKTtcbiAgICB0aGlzLm5ld1Byb3BzLmxvZ2dpbmcgPSBjb21wYXJlZC5sb2dnaW5nO1xuICB9XG5cbiAgLy8gLS0tLS0tXG4gIC8vIENSRUFURVxuICAvLyAtLS0tLS1cblxuICBwcm90ZWN0ZWQgYXN5bmMgb25DcmVhdGUoKTogUHJvbWlzZTxPbkV2ZW50UmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZygnb25DcmVhdGU6IGNyZWF0aW5nIGNsdXN0ZXIgd2l0aCBvcHRpb25zOicsIEpTT04uc3RyaW5naWZ5KHRoaXMubmV3UHJvcHMsIHVuZGVmaW5lZCwgMikpO1xuICAgIGlmICghdGhpcy5uZXdQcm9wcy5yb2xlQXJuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wicm9sZUFyblwiIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgY2x1c3Rlck5hbWUgPSB0aGlzLm5ld1Byb3BzLm5hbWUgfHwgdGhpcy5nZW5lcmF0ZUNsdXN0ZXJOYW1lKCk7XG5cbiAgICBjb25zdCByZXNwID0gYXdhaXQgdGhpcy5la3MuY3JlYXRlQ2x1c3Rlcih7XG4gICAgICAuLi50aGlzLm5ld1Byb3BzLFxuICAgICAgbmFtZTogY2x1c3Rlck5hbWUsXG4gICAgfSk7XG5cbiAgICBpZiAoIXJlc3AuY2x1c3Rlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciB3aGVuIHRyeWluZyB0byBjcmVhdGUgY2x1c3RlciAke2NsdXN0ZXJOYW1lfTogQ3JlYXRlQ2x1c3RlciByZXR1cm5lZCB3aXRob3V0IGNsdXN0ZXIgaW5mb3JtYXRpb25gKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiByZXNwLmNsdXN0ZXIubmFtZSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzQ3JlYXRlQ29tcGxldGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNBY3RpdmUoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLVxuICAvLyBERUxFVEVcbiAgLy8gLS0tLS0tXG5cbiAgcHJvdGVjdGVkIGFzeW5jIG9uRGVsZXRlKCk6IFByb21pc2U8T25FdmVudFJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5sb2coYG9uRGVsZXRlOiBkZWxldGluZyBjbHVzdGVyICR7dGhpcy5jbHVzdGVyTmFtZX1gKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5la3MuZGVsZXRlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoZS5uYW1lICE9PSAnUmVzb3VyY2VOb3RGb3VuZEV4Y2VwdGlvbicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBjbHVzdGVyICR7dGhpcy5jbHVzdGVyTmFtZX0gbm90IGZvdW5kLCBpZGVtcG90ZW50bHkgc3VjY2VlZGVkYCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHRoaXMuY2x1c3Rlck5hbWUsXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBpc0RlbGV0ZUNvbXBsZXRlKCk6IFByb21pc2U8SXNDb21wbGV0ZVJlc3BvbnNlPiB7XG4gICAgY29uc29sZS5sb2coYGlzRGVsZXRlQ29tcGxldGU6IHdhaXRpbmcgZm9yIGNsdXN0ZXIgJHt0aGlzLmNsdXN0ZXJOYW1lfSB0byBiZSBkZWxldGVkYCk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgICBjb25zb2xlLmxvZygnZGVzY3JpYmVDbHVzdGVyIHJldHVybmVkOicsIEpTT04uc3RyaW5naWZ5KHJlc3AsIHVuZGVmaW5lZCwgMikpO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgaWYgKGUubmFtZSA9PT0gJ1Jlc291cmNlTm90Rm91bmRFeGNlcHRpb24nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlZCBSZXNvdXJjZU5vdEZvdW5kRXhjZXB0aW9uLCB0aGlzIG1lYW5zIHRoZSBjbHVzdGVyIGhhcyBiZWVuIGRlbGV0ZWQgKG9yIG5ldmVyIGV4aXN0ZWQpJyk7XG4gICAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IHRydWUgfTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coJ2Rlc2NyaWJlQ2x1c3RlciBlcnJvcjonLCBlKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIElzQ29tcGxldGU6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICAvLyAtLS0tLS1cbiAgLy8gVVBEQVRFXG4gIC8vIC0tLS0tLVxuXG4gIHByb3RlY3RlZCBhc3luYyBvblVwZGF0ZSgpIHtcbiAgICBjb25zdCB1cGRhdGVzID0gYW5hbHl6ZVVwZGF0ZSh0aGlzLm9sZFByb3BzLCB0aGlzLm5ld1Byb3BzKTtcbiAgICBjb25zb2xlLmxvZygnb25VcGRhdGU6JywgSlNPTi5zdHJpbmdpZnkoeyB1cGRhdGVzIH0sIHVuZGVmaW5lZCwgMikpO1xuXG4gICAgLy8gdXBkYXRlcyB0byBlbmNyeXB0aW9uIGNvbmZpZyBpcyBub3Qgc3VwcG9ydGVkXG4gICAgaWYgKHVwZGF0ZXMudXBkYXRlRW5jcnlwdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXBkYXRlIGNsdXN0ZXIgZW5jcnlwdGlvbiBjb25maWd1cmF0aW9uJyk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlcmUgaXMgYW4gdXBkYXRlIHRoYXQgcmVxdWlyZXMgcmVwbGFjZW1lbnQsIGdvIGFoZWFkIGFuZCBqdXN0IGNyZWF0ZVxuICAgIC8vIGEgbmV3IGNsdXN0ZXIgd2l0aCB0aGUgbmV3IGNvbmZpZy4gVGhlIG9sZCBjbHVzdGVyIHdpbGwgYXV0b21hdGljYWxseSBiZVxuICAgIC8vIGRlbGV0ZWQgYnkgY2xvdWRmb3JtYXRpb24gdXBvbiBzdWNjZXNzLlxuICAgIGlmICh1cGRhdGVzLnJlcGxhY2VOYW1lIHx8IHVwZGF0ZXMucmVwbGFjZVJvbGUgfHwgdXBkYXRlcy51cGRhdGVCb290c3RyYXBDbHVzdGVyQ3JlYXRvckFkbWluUGVybWlzc2lvbnMgKSB7XG4gICAgICAvLyBpZiB3ZSBhcmUgcmVwbGFjaW5nIHRoaXMgY2x1c3RlciBhbmQgdGhlIGNsdXN0ZXIgaGFzIGFuIGV4cGxpY2l0XG4gICAgICAvLyBwaHlzaWNhbCBuYW1lLCB0aGUgY3JlYXRpb24gb2YgdGhlIG5ldyBjbHVzdGVyIHdpbGwgZmFpbCB3aXRoIFwidGhlcmUgaXNcbiAgICAgIC8vIGFscmVhZHkgYSBjbHVzdGVyIHdpdGggdGhhdCBuYW1lXCIuIHRoaXMgaXMgYSBjb21tb24gYmVoYXZpb3IgZm9yXG4gICAgICAvLyBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHNwZWNpZnlpbmcgYSBwaHlzaWNhbCBuYW1lLlxuICAgICAgaWYgKHRoaXMub2xkUHJvcHMubmFtZSA9PT0gdGhpcy5uZXdQcm9wcy5uYW1lICYmIHRoaXMub2xkUHJvcHMubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZXBsYWNlIGNsdXN0ZXIgXCIke3RoaXMub2xkUHJvcHMubmFtZX1cIiBzaW5jZSBpdCBoYXMgYW4gZXhwbGljaXQgcGh5c2ljYWwgbmFtZS4gRWl0aGVyIHJlbmFtZSB0aGUgY2x1c3RlciBvciByZW1vdmUgdGhlIFwibmFtZVwiIGNvbmZpZ3VyYXRpb25gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub25DcmVhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBXZSBjYW4gb25seSB1cGRhdGUgb25lIHR5cGUgb2YgdGhlIFVwZGF0ZVR5cGVzOlxuICAgIHR5cGUgVXBkYXRlVHlwZXMgPSB7XG4gICAgICB1cGRhdGVMb2dnaW5nOiBib29sZWFuO1xuICAgICAgdXBkYXRlQWNjZXNzOiBib29sZWFuO1xuICAgICAgdXBkYXRlVnBjOiBib29sZWFuO1xuICAgICAgdXBkYXRlQXV0aE1vZGU6IGJvb2xlYW47XG4gICAgfTtcbiAgICAvLyB2YWxpZGF0ZSB1cGRhdGVzXG4gICAgY29uc3QgdXBkYXRlVHlwZXMgPSBPYmplY3Qua2V5cyh1cGRhdGVzKSBhcyAoa2V5b2YgVXBkYXRlVHlwZXMpW107XG4gICAgY29uc3QgZW5hYmxlZFVwZGF0ZVR5cGVzID0gdXBkYXRlVHlwZXMuZmlsdGVyKCh0eXBlKSA9PiB1cGRhdGVzW3R5cGVdKTtcbiAgICBjb25zb2xlLmxvZyhlbmFibGVkVXBkYXRlVHlwZXMpO1xuXG4gICAgaWYgKGVuYWJsZWRVcGRhdGVUeXBlcy5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdPbmx5IG9uZSB0eXBlIG9mIHVwZGF0ZSAtIFZwY0NvbmZpZ1VwZGF0ZSwgTG9nZ2luZ1VwZGF0ZSwgRW5kcG9pbnRBY2Nlc3NVcGRhdGUsIG9yIEF1dGhNb2RlVXBkYXRlIGNhbiBiZSBhbGxvd2VkJyxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRhZ3NcbiAgICBpZiAodXBkYXRlcy51cGRhdGVUYWdzKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBEZXNjcmliZSB0aGUgY2x1c3RlciB0byBnZXQgdGhlIEFSTiBmb3IgdGFnZ2luZyBBUElzIGFuZCB0byBtYWtlIHN1cmUgQ2x1c3RlciBleGlzdHNcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IChhd2FpdCB0aGlzLmVrcy5kZXNjcmliZUNsdXN0ZXIoeyBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lIH0pKS5jbHVzdGVyO1xuICAgICAgICBpZiAodGhpcy5vbGRQcm9wcy50YWdzKSB7XG4gICAgICAgICAgaWYgKHRoaXMubmV3UHJvcHMudGFncykge1xuICAgICAgICAgICAgLy8gVGhpcyBtZWFucyB0aGVyZSBhcmUgb2xkIHRhZ3MgYXMgd2VsbCBhcyBuZXcgdGFncyBzbyBnZXQgdGhlIGRpZmZlcmVuY2VcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBleGlzdGluZyB0YWcga2V5cyBhbmQgYWRkIG5ld2x5IGFkZGVkIHRhZ3NcbiAgICAgICAgICAgIGNvbnN0IHRhZ3NUb0FkZCA9IGdldFRhZ3NUb1VwZGF0ZSh0aGlzLm9sZFByb3BzLnRhZ3MsIHRoaXMubmV3UHJvcHMudGFncyk7XG4gICAgICAgICAgICBpZiAodGFnc1RvQWRkKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRhZ0NvbmZpZzogRUtTLlRhZ1Jlc291cmNlQ29tbWFuZElucHV0ID0ge1xuICAgICAgICAgICAgICAgIHJlc291cmNlQXJuOiBjbHVzdGVyPy5hcm4sXG4gICAgICAgICAgICAgICAgdGFnczogdGFnc1RvQWRkLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVrcy50YWdSZXNvdXJjZSh0YWdDb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSB0YWdzIHRoYXQgd2VyZSByZW1vdmVkIGluIG5ld1Byb3BzXG4gICAgICAgICAgICBjb25zdCB0YWdzVG9SZW1vdmUgPSBnZXRUYWdzVG9SZW1vdmUodGhpcy5vbGRQcm9wcy50YWdzLCB0aGlzLm5ld1Byb3BzLnRhZ3MpO1xuICAgICAgICAgICAgaWYgKHRhZ3NUb1JlbW92ZS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICBjb25zdCBjb25maWc6IEVLUy5VbnRhZ1Jlc291cmNlQ29tbWFuZElucHV0ID0ge1xuICAgICAgICAgICAgICAgIHJlc291cmNlQXJuOiBjbHVzdGVyPy5hcm4sXG4gICAgICAgICAgICAgICAgdGFnS2V5czogdGFnc1RvUmVtb3ZlLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVrcy51bnRhZ1Jlc291cmNlKGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoaXMgbWVhbnMgbmV3UHJvcHMudGFncyBpcyBlbXB0eSBoZW5jZSByZW1vdmUgYWxsIHRhZ3NcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZzogRUtTLlVudGFnUmVzb3VyY2VDb21tYW5kSW5wdXQgPSB7XG4gICAgICAgICAgICAgIHJlc291cmNlQXJuOiBjbHVzdGVyPy5hcm4sXG4gICAgICAgICAgICAgIHRhZ0tleXM6IE9iamVjdC5rZXlzKHRoaXMub2xkUHJvcHMudGFncyksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5la3MudW50YWdSZXNvdXJjZShjb25maWcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUaGlzIG1lYW5zIG9sZFByb3BzLnRhZ3Mgd2FzIGVtcHR5IGhlbmNlIGFkZCBhbGwgdGFncyBmcm9tIG5ld1Byb3BzLnRhZ3NcbiAgICAgICAgICBjb25zdCBjb25maWc6IEVLUy5UYWdSZXNvdXJjZUNvbW1hbmRJbnB1dCA9IHtcbiAgICAgICAgICAgIHJlc291cmNlQXJuOiBjbHVzdGVyPy5hcm4sXG4gICAgICAgICAgICB0YWdzOiB0aGlzLm5ld1Byb3BzLnRhZ3MsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBhd2FpdCB0aGlzLmVrcy50YWdSZXNvdXJjZShjb25maWcpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiBhIHZlcnNpb24gdXBkYXRlIGlzIHJlcXVpcmVkLCBpc3N1ZSB0aGUgdmVyc2lvbiB1cGRhdGVcbiAgICBpZiAodXBkYXRlcy51cGRhdGVWZXJzaW9uKSB7XG4gICAgICBpZiAoIXRoaXMubmV3UHJvcHMudmVyc2lvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZW1vdmUgY2x1c3RlciB2ZXJzaW9uIGNvbmZpZ3VyYXRpb24uIEN1cnJlbnQgdmVyc2lvbiBpcyAke3RoaXMub2xkUHJvcHMudmVyc2lvbn1gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlQ2x1c3RlclZlcnNpb24odGhpcy5uZXdQcm9wcy52ZXJzaW9uKTtcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlcy51cGRhdGVMb2dnaW5nIHx8IHVwZGF0ZXMudXBkYXRlQWNjZXNzIHx8IHVwZGF0ZXMudXBkYXRlVnBjIHx8IHVwZGF0ZXMudXBkYXRlQXV0aE1vZGUpIHtcbiAgICAgIGNvbnN0IGNvbmZpZzogRUtTLlVwZGF0ZUNsdXN0ZXJDb25maWdDb21tYW5kSW5wdXQgPSB7XG4gICAgICAgIG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsXG4gICAgICB9O1xuICAgICAgaWYgKHVwZGF0ZXMudXBkYXRlTG9nZ2luZykge1xuICAgICAgICBjb25maWcubG9nZ2luZyA9IHRoaXMubmV3UHJvcHMubG9nZ2luZztcbiAgICAgIH07XG4gICAgICBpZiAodXBkYXRlcy51cGRhdGVBY2Nlc3MpIHtcbiAgICAgICAgY29uZmlnLnJlc291cmNlc1ZwY0NvbmZpZyA9IHtcbiAgICAgICAgICBlbmRwb2ludFByaXZhdGVBY2Nlc3M6IHRoaXMubmV3UHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnPy5lbmRwb2ludFByaXZhdGVBY2Nlc3MsXG4gICAgICAgICAgZW5kcG9pbnRQdWJsaWNBY2Nlc3M6IHRoaXMubmV3UHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnPy5lbmRwb2ludFB1YmxpY0FjY2VzcyxcbiAgICAgICAgICBwdWJsaWNBY2Nlc3NDaWRyczogdGhpcy5uZXdQcm9wcy5yZXNvdXJjZXNWcGNDb25maWc/LnB1YmxpY0FjY2Vzc0NpZHJzLFxuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgaWYgKHVwZGF0ZXMudXBkYXRlQXV0aE1vZGUpIHtcbiAgICAgICAgLy8gdGhlIHVwZGF0ZSBwYXRoIG11c3QgYmVcbiAgICAgICAgLy8gYHVuZGVmaW5lZCBvciBDT05GSUdfTUFQYCAtPiBgQVBJX0FORF9DT05GSUdfTUFQYCAtPiBgQVBJYFxuICAgICAgICAvLyBhbmQgaXQncyBvbmUgd2F5IHBhdGguXG4gICAgICAgIC8vIG9sZCB2YWx1ZSBpcyBBUEkgLSBjYW5ub3QgZmFsbGJhY2sgYmFja3dhcmRzXG4gICAgICAgIGlmICh0aGlzLm9sZFByb3BzLmFjY2Vzc0NvbmZpZz8uYXV0aGVudGljYXRpb25Nb2RlID09PSAnQVBJJyAmJlxuICAgICAgICAgIHRoaXMubmV3UHJvcHMuYWNjZXNzQ29uZmlnPy5hdXRoZW50aWNhdGlvbk1vZGUgIT09ICdBUEknKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmFsbGJhY2sgYXV0aGVudGljYXRpb25Nb2RlIGZyb20gQVBJIHRvICR7dGhpcy5uZXdQcm9wcy5hY2Nlc3NDb25maWc/LmF1dGhlbnRpY2F0aW9uTW9kZX1gKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBvbGQgdmFsdWUgaXMgQVBJX0FORF9DT05GSUdfTUFQIC0gY2Fubm90IGZhbGxiYWNrIHRvIENPTkZJR19NQVBcbiAgICAgICAgaWYgKHRoaXMub2xkUHJvcHMuYWNjZXNzQ29uZmlnPy5hdXRoZW50aWNhdGlvbk1vZGUgPT09ICdBUElfQU5EX0NPTkZJR19NQVAnICYmXG4gICAgICAgICAgdGhpcy5uZXdQcm9wcy5hY2Nlc3NDb25maWc/LmF1dGhlbnRpY2F0aW9uTW9kZSA9PT0gJ0NPTkZJR19NQVAnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmFsbGJhY2sgYXV0aGVudGljYXRpb25Nb2RlIGZyb20gQVBJX0FORF9DT05GSUdfTUFQIHRvICR7dGhpcy5uZXdQcm9wcy5hY2Nlc3NDb25maWc/LmF1dGhlbnRpY2F0aW9uTW9kZX1gKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjYW5ub3QgZmFsbGJhY2sgZnJvbSBkZWZpbmVkIHRvIHVuZGVmaW5lZFxuICAgICAgICBpZiAodGhpcy5vbGRQcm9wcy5hY2Nlc3NDb25maWc/LmF1dGhlbnRpY2F0aW9uTW9kZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgdGhpcy5uZXdQcm9wcy5hY2Nlc3NDb25maWc/LmF1dGhlbnRpY2F0aW9uTW9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZmFsbGJhY2sgYXV0aGVudGljYXRpb25Nb2RlIGZyb20gZGVmaW5lZCB0byB1bmRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjYW5ub3QgdXBkYXRlIGZyb20gdW5kZWZpbmVkIHRvIEFQSSBiZWNhdXNlIHVuZGVmaW5lZCBkZWZhdWx0cyBDT05GSUdfTUFQIHdoaWNoXG4gICAgICAgIC8vIGNhbiBvbmx5IGNoYW5nZSB0byBBUElfQU5EX0NPTkZJR19NQVBcbiAgICAgICAgaWYgKHRoaXMub2xkUHJvcHMuYWNjZXNzQ29uZmlnPy5hdXRoZW50aWNhdGlvbk1vZGUgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgIHRoaXMubmV3UHJvcHMuYWNjZXNzQ29uZmlnPy5hdXRoZW50aWNhdGlvbk1vZGUgPT09ICdBUEknKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXBkYXRlIGZyb20gdW5kZWZpbmVkKENPTkZJR19NQVApIHRvIEFQSScpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNhbm5vdCB1cGRhdGUgZnJvbSBDT05GSUdfTUFQIHRvIEFQSVxuICAgICAgICBpZiAodGhpcy5vbGRQcm9wcy5hY2Nlc3NDb25maWc/LmF1dGhlbnRpY2F0aW9uTW9kZSA9PT0gJ0NPTkZJR19NQVAnICYmXG4gICAgICAgICAgdGhpcy5uZXdQcm9wcy5hY2Nlc3NDb25maWc/LmF1dGhlbnRpY2F0aW9uTW9kZSA9PT0gJ0FQSScpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1cGRhdGUgZnJvbSBDT05GSUdfTUFQIHRvIEFQSScpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHVwZGF0ZS1hdXRobW9kZSB3aWxsIGZhaWwgaWYgd2UgdHJ5IHRvIHVwZGF0ZSB0byB0aGUgc2FtZSBtb2RlLFxuICAgICAgICAvLyBzbyBza2lwIGluIHRoaXMgY2FzZS5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBjbHVzdGVyID0gKGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSkpLmNsdXN0ZXI7XG4gICAgICAgICAgaWYgKGNsdXN0ZXI/LmFjY2Vzc0NvbmZpZz8uYXV0aGVudGljYXRpb25Nb2RlID09PSB0aGlzLm5ld1Byb3BzLmFjY2Vzc0NvbmZpZz8uYXV0aGVudGljYXRpb25Nb2RlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgY2x1c3RlciBhbHJlYWR5IGF0ICR7Y2x1c3Rlcj8uYWNjZXNzQ29uZmlnPy5hdXRoZW50aWNhdGlvbk1vZGV9LCBza2lwcGluZyBhdXRoTW9kZSB1cGRhdGVgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlnLmFjY2Vzc0NvbmZpZyA9IHRoaXMubmV3UHJvcHMuYWNjZXNzQ29uZmlnO1xuICAgICAgfTtcblxuICAgICAgaWYgKHVwZGF0ZXMudXBkYXRlVnBjKSB7XG4gICAgICAgIGNvbmZpZy5yZXNvdXJjZXNWcGNDb25maWcgPSB7XG4gICAgICAgICAgc3VibmV0SWRzOiB0aGlzLm5ld1Byb3BzLnJlc291cmNlc1ZwY0NvbmZpZz8uc3VibmV0SWRzLFxuICAgICAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IHRoaXMubmV3UHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnPy5zZWN1cml0eUdyb3VwSWRzLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCB1cGRhdGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuZWtzLnVwZGF0ZUNsdXN0ZXJDb25maWcoY29uZmlnKTtcblxuICAgICAgcmV0dXJuIHsgRWtzVXBkYXRlSWQ6IHVwZGF0ZVJlc3BvbnNlLnVwZGF0ZT8uaWQgfTtcbiAgICB9XG5cbiAgICAvLyBubyB1cGRhdGVzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGlzVXBkYXRlQ29tcGxldGUoKSB7XG4gICAgY29uc29sZS5sb2coJ2lzVXBkYXRlQ29tcGxldGUnKTtcblxuICAgIC8vIGlmIHRoaXMgaXMgYW4gRUtTIHVwZGF0ZSwgd2Ugd2lsbCBtb25pdG9yIHRoZSB1cGRhdGUgZXZlbnQgaXRzZWxmXG4gICAgaWYgKHRoaXMuZXZlbnQuRWtzVXBkYXRlSWQpIHtcbiAgICAgIGNvbnN0IGNvbXBsZXRlID0gYXdhaXQgdGhpcy5pc0Vrc1VwZGF0ZUNvbXBsZXRlKHRoaXMuZXZlbnQuRWtzVXBkYXRlSWQpO1xuICAgICAgaWYgKCFjb21wbGV0ZSkge1xuICAgICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiBmYWxzZSB9O1xuICAgICAgfVxuXG4gICAgICAvLyBmYWxsIHRocm91Z2g6IGlmIHRoZSB1cGRhdGUgaXMgZG9uZSwgd2Ugc2ltcGx5IGRlbGVnYXRlIHRvIGlzQWN0aXZlKClcbiAgICAgIC8vIGluIG9yZGVyIHRvIGV4dHJhY3QgYXR0cmlidXRlcyBhbmQgc3RhdGUgZnJvbSB0aGUgY2x1c3RlciBpdHNlbGYsIHdoaWNoXG4gICAgICAvLyBpcyBzdXBwb3NlZCB0byBiZSBpbiBhbiBBQ1RJVkUgc3RhdGUgYWZ0ZXIgdGhlIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVDbHVzdGVyVmVyc2lvbihuZXdWZXJzaW9uOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhgdXBkYXRpbmcgY2x1c3RlciB2ZXJzaW9uIHRvICR7bmV3VmVyc2lvbn1gKTtcblxuICAgIC8vIHVwZGF0ZS1jbHVzdGVyLXZlcnNpb24gd2lsbCBmYWlsIGlmIHdlIHRyeSB0byB1cGRhdGUgdG8gdGhlIHNhbWUgdmVyc2lvbixcbiAgICAvLyBzbyBza2lwIGluIHRoaXMgY2FzZS5cbiAgICBjb25zdCBjbHVzdGVyID0gKGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSkpLmNsdXN0ZXI7XG4gICAgaWYgKGNsdXN0ZXI/LnZlcnNpb24gPT09IG5ld1ZlcnNpb24pIHtcbiAgICAgIGNvbnNvbGUubG9nKGBjbHVzdGVyIGFscmVhZHkgYXQgdmVyc2lvbiAke2NsdXN0ZXIudmVyc2lvbn0sIHNraXBwaW5nIHZlcnNpb24gdXBkYXRlYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy51cGRhdGVDbHVzdGVyVmVyc2lvbih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUsIHZlcnNpb246IG5ld1ZlcnNpb24gfSk7XG4gICAgcmV0dXJuIHsgRWtzVXBkYXRlSWQ6IHVwZGF0ZVJlc3BvbnNlLnVwZGF0ZT8uaWQgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaXNBY3RpdmUoKTogUHJvbWlzZTxJc0NvbXBsZXRlUmVzcG9uc2U+IHtcbiAgICBjb25zb2xlLmxvZygnd2FpdGluZyBmb3IgY2x1c3RlciB0byBiZWNvbWUgQUNUSVZFJyk7XG4gICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuZWtzLmRlc2NyaWJlQ2x1c3Rlcih7IG5hbWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgY29uc29sZS5sb2coJ2Rlc2NyaWJlQ2x1c3RlciByZXN1bHQ6JywgSlNPTi5zdHJpbmdpZnkocmVzcCwgdW5kZWZpbmVkLCAyKSk7XG4gICAgY29uc3QgY2x1c3RlciA9IHJlc3AuY2x1c3RlcjtcblxuICAgIC8vIGlmIGNsdXN0ZXIgaXMgdW5kZWZpbmVkIChzaG91bGRudCBoYXBwZW4pIG9yIHN0YXR1cyBpcyBub3QgQUNUSVZFLCB3ZSBhcmVcbiAgICAvLyBub3QgY29tcGxldGUuIG5vdGUgdGhhdCB0aGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyIGZyYW1ld29yayBmb3JiaWRzXG4gICAgLy8gcmV0dXJuaW5nIGF0dHJpYnV0ZXMgKERhdGEpIGlmIGlzQ29tcGxldGUgaXMgZmFsc2UuXG4gICAgaWYgKGNsdXN0ZXI/LnN0YXR1cyA9PT0gJ0ZBSUxFRCcpIHtcbiAgICAgIC8vIG5vdCB2ZXJ5IGluZm9ybWF0aXZlLCB1bmZvcnR1bmF0ZWx5IHRoZSByZXNwb25zZSBkb2Vzbid0IGNvbnRhaW4gYW55IGVycm9yXG4gICAgICAvLyBpbmZvcm1hdGlvbiA6XFxcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2x1c3RlciBpcyBpbiBhIEZBSUxFRCBzdGF0dXMnKTtcbiAgICB9IGVsc2UgaWYgKGNsdXN0ZXI/LnN0YXR1cyAhPT0gJ0FDVElWRScpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIElzQ29tcGxldGU6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgSXNDb21wbGV0ZTogdHJ1ZSxcbiAgICAgICAgRGF0YToge1xuICAgICAgICAgIE5hbWU6IGNsdXN0ZXIubmFtZSxcbiAgICAgICAgICBFbmRwb2ludDogY2x1c3Rlci5lbmRwb2ludCxcbiAgICAgICAgICBBcm46IGNsdXN0ZXIuYXJuLFxuXG4gICAgICAgICAgLy8gSU1QT1JUQU5UOiBDRk4gZXhwZWN0cyB0aGF0IGF0dHJpYnV0ZXMgd2lsbCAqYWx3YXlzKiBoYXZlIHZhbHVlcyxcbiAgICAgICAgICAvLyBzbyByZXR1cm4gYW4gZW1wdHkgc3RyaW5nIGluIGNhc2UgdGhlIHZhbHVlIGlzIG5vdCBkZWZpbmVkLlxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgQ0ZOIHdpbGwgdGhyb3cgd2l0aCBgVmVuZG9yIHJlc3BvbnNlIGRvZXNuJ3QgY29udGFpblxuICAgICAgICAgIC8vIFhYWFgga2V5YC5cblxuICAgICAgICAgIENlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogY2x1c3Rlci5jZXJ0aWZpY2F0ZUF1dGhvcml0eT8uZGF0YSA/PyAnJyxcbiAgICAgICAgICBDbHVzdGVyU2VjdXJpdHlHcm91cElkOiBjbHVzdGVyLnJlc291cmNlc1ZwY0NvbmZpZz8uY2x1c3RlclNlY3VyaXR5R3JvdXBJZCA/PyAnJyxcbiAgICAgICAgICBPcGVuSWRDb25uZWN0SXNzdWVyVXJsOiBjbHVzdGVyLmlkZW50aXR5Py5vaWRjPy5pc3N1ZXIgPz8gJycsXG4gICAgICAgICAgT3BlbklkQ29ubmVjdElzc3VlcjogY2x1c3Rlci5pZGVudGl0eT8ub2lkYz8uaXNzdWVyPy5zdWJzdHJpbmcoOCkgPz8gJycsIC8vIFN0cmlwcyBvZmYgaHR0cHM6Ly8gZnJvbSB0aGUgaXNzdWVyIHVybFxuXG4gICAgICAgICAgLy8gV2UgY2FuIHNhZmVseSByZXR1cm4gdGhlIGZpcnN0IGl0ZW0gZnJvbSBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24gYXJyYXksIGJlY2F1c2UgaXQgaGFzIGEgbGltaXQgb2YgMSBpdGVtXG4gICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX0NyZWF0ZUNsdXN0ZXIuaHRtbCNBbWF6b25FS1MtQ3JlYXRlQ2x1c3Rlci1yZXF1ZXN0LWVuY3J5cHRpb25Db25maWdcbiAgICAgICAgICBFbmNyeXB0aW9uQ29uZmlnS2V5QXJuOiBjbHVzdGVyLmVuY3J5cHRpb25Db25maWc/LnNoaWZ0KCk/LnByb3ZpZGVyPy5rZXlBcm4gPz8gJycsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaXNFa3NVcGRhdGVDb21wbGV0ZShla3NVcGRhdGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5sb2coeyBpc0Vrc1VwZGF0ZUNvbXBsZXRlOiBla3NVcGRhdGVJZCB9KTtcblxuICAgIGNvbnN0IGRlc2NyaWJlVXBkYXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmVrcy5kZXNjcmliZVVwZGF0ZSh7XG4gICAgICBuYW1lOiB0aGlzLmNsdXN0ZXJOYW1lLFxuICAgICAgdXBkYXRlSWQ6IGVrc1VwZGF0ZUlkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5sb2coeyBkZXNjcmliZVVwZGF0ZVJlc3BvbnNlIH0pO1xuXG4gICAgaWYgKCFkZXNjcmliZVVwZGF0ZVJlc3BvbnNlLnVwZGF0ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmFibGUgdG8gZGVzY3JpYmUgdXBkYXRlIHdpdGggaWQgXCIke2Vrc1VwZGF0ZUlkfVwiYCk7XG4gICAgfVxuXG4gICAgc3dpdGNoIChkZXNjcmliZVVwZGF0ZVJlc3BvbnNlLnVwZGF0ZS5zdGF0dXMpIHtcbiAgICAgIGNhc2UgJ0luUHJvZ3Jlc3MnOlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlICdTdWNjZXNzZnVsJzpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlICdGYWlsZWQnOlxuICAgICAgY2FzZSAnQ2FuY2VsbGVkJzpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBjbHVzdGVyIHVwZGF0ZSBpZCBcIiR7ZWtzVXBkYXRlSWR9XCIgZmFpbGVkIHdpdGggZXJyb3JzOiAke0pTT04uc3RyaW5naWZ5KGRlc2NyaWJlVXBkYXRlUmVzcG9uc2UudXBkYXRlLmVycm9ycyl9YCk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVua25vd24gc3RhdHVzIFwiJHtkZXNjcmliZVVwZGF0ZVJlc3BvbnNlLnVwZGF0ZS5zdGF0dXN9XCIgZm9yIHVwZGF0ZSBpZCBcIiR7ZWtzVXBkYXRlSWR9XCJgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlQ2x1c3Rlck5hbWUoKSB7XG4gICAgY29uc3Qgc3VmZml4ID0gdGhpcy5yZXF1ZXN0SWQucmVwbGFjZSgvLS9nLCAnJyk7IC8vIDMyIGNoYXJzXG4gICAgY29uc3Qgb2Zmc2V0ID0gTUFYX0NMVVNURVJfTkFNRV9MRU4gLSBzdWZmaXgubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBwcmVmaXggPSB0aGlzLmxvZ2ljYWxSZXNvdXJjZUlkLnNsaWNlKDAsIG9mZnNldCA+IDAgPyBvZmZzZXQgOiAwKTtcbiAgICByZXR1cm4gYCR7cHJlZml4fS0ke3N1ZmZpeH1gO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlUHJvcHMocHJvcHM6IGFueSk6IEVLUy5DcmVhdGVDbHVzdGVyQ29tbWFuZElucHV0IHtcblxuICBjb25zdCBwYXJzZWQgPSBwcm9wcz8uQ29uZmlnID8/IHt9O1xuXG4gIC8vIHRoaXMgaXMgd2VpcmQgYnV0IHRoZXNlIGJvb2xlYW4gcHJvcGVydGllcyBhcmUgcGFzc2VkIGJ5IENGTiBhcyBhIHN0cmluZywgYW5kIHdlIG5lZWQgdGhlbSB0byBiZSBib29sZWFuaWMgZm9yIHRoZSBTREsuXG4gIC8vIE90aGVyd2lzZSBpdCBmYWlscyB3aXRoICdVbmV4cGVjdGVkIFBhcmFtZXRlcjogcGFyYW1zLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgaXMgZXhwZWN0ZWQgdG8gYmUgYSBib29sZWFuJ1xuXG4gIGlmICh0eXBlb2YgKHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWc/LmVuZHBvaW50UHJpdmF0ZUFjY2VzcykgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgPSBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyA9PT0gJ3RydWUnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiAocGFyc2VkLnJlc291cmNlc1ZwY0NvbmZpZz8uZW5kcG9pbnRQdWJsaWNBY2Nlc3MpID09PSAnc3RyaW5nJykge1xuICAgIHBhcnNlZC5yZXNvdXJjZXNWcGNDb25maWcuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgPSBwYXJzZWQucmVzb3VyY2VzVnBjQ29uZmlnLmVuZHBvaW50UHVibGljQWNjZXNzID09PSAndHJ1ZSc7XG4gIH1cblxuICBpZiAodHlwZW9mIChwYXJzZWQubG9nZ2luZz8uY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCkgPT09ICdzdHJpbmcnKSB7XG4gICAgcGFyc2VkLmxvZ2dpbmcuY2x1c3RlckxvZ2dpbmdbMF0uZW5hYmxlZCA9IHBhcnNlZC5sb2dnaW5nLmNsdXN0ZXJMb2dnaW5nWzBdLmVuYWJsZWQgPT09ICd0cnVlJztcbiAgfVxuXG4gIHJldHVybiBwYXJzZWQ7XG5cbn1cblxuaW50ZXJmYWNlIFVwZGF0ZU1hcCB7XG4gIHJlcGxhY2VOYW1lOiBib29sZWFuOyAvLyBuYW1lXG4gIHJlcGxhY2VSb2xlOiBib29sZWFuOyAvLyByb2xlQXJuXG5cbiAgdXBkYXRlVmVyc2lvbjogYm9vbGVhbjsgLy8gdmVyc2lvblxuICB1cGRhdGVMb2dnaW5nOiBib29sZWFuOyAvLyBsb2dnaW5nXG4gIHVwZGF0ZUVuY3J5cHRpb246IGJvb2xlYW47IC8vIGVuY3J5cHRpb24gKGNhbm5vdCBiZSB1cGRhdGVkKVxuICB1cGRhdGVBY2Nlc3M6IGJvb2xlYW47IC8vIHJlc291cmNlc1ZwY0NvbmZpZy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgYW5kIGVuZHBvaW50UHVibGljQWNjZXNzXG4gIHVwZGF0ZUF1dGhNb2RlOiBib29sZWFuOyAvLyBhY2Nlc3NDb25maWcuYXV0aGVudGljYXRpb25Nb2RlXG4gIHVwZGF0ZUJvb3RzdHJhcENsdXN0ZXJDcmVhdG9yQWRtaW5QZXJtaXNzaW9uczogYm9vbGVhbjsgLy8gYWNjZXNzQ29uZmlnLmJvb3RzdHJhcENsdXN0ZXJDcmVhdG9yQWRtaW5QZXJtaXNzaW9uc1xuICB1cGRhdGVWcGM6IGJvb2xlYW47IC8vIHJlc291cmNlc1ZwY0NvbmZpZy5zdWJuZXRJZHMgYW5kIHNlY3VyaXR5R3JvdXBJZHNcbiAgdXBkYXRlVGFnczogYm9vbGVhbjsgLy8gdGFnc1xufVxuXG5mdW5jdGlvbiBhbmFseXplVXBkYXRlKG9sZFByb3BzOiBQYXJ0aWFsPEVLUy5DcmVhdGVDbHVzdGVyQ29tbWFuZElucHV0PiwgbmV3UHJvcHM6IEVLUy5DcmVhdGVDbHVzdGVyQ29tbWFuZElucHV0KTogVXBkYXRlTWFwIHtcbiAgY29uc29sZS5sb2coJ29sZCBwcm9wczogJywgSlNPTi5zdHJpbmdpZnkob2xkUHJvcHMpKTtcbiAgY29uc29sZS5sb2coJ25ldyBwcm9wczogJywgSlNPTi5zdHJpbmdpZnkobmV3UHJvcHMpKTtcblxuICBjb25zdCBuZXdWcGNQcm9wcyA9IG5ld1Byb3BzLnJlc291cmNlc1ZwY0NvbmZpZyB8fCB7fTtcbiAgY29uc3Qgb2xkVnBjUHJvcHMgPSBvbGRQcm9wcy5yZXNvdXJjZXNWcGNDb25maWcgfHwge307XG5cbiAgY29uc3Qgb2xkUHVibGljQWNjZXNzQ2lkcnMgPSBuZXcgU2V0KG9sZFZwY1Byb3BzLnB1YmxpY0FjY2Vzc0NpZHJzID8/IFtdKTtcbiAgY29uc3QgbmV3UHVibGljQWNjZXNzQ2lkcnMgPSBuZXcgU2V0KG5ld1ZwY1Byb3BzLnB1YmxpY0FjY2Vzc0NpZHJzID8/IFtdKTtcbiAgY29uc3QgbmV3RW5jID0gbmV3UHJvcHMuZW5jcnlwdGlvbkNvbmZpZyB8fCB7fTtcbiAgY29uc3Qgb2xkRW5jID0gb2xkUHJvcHMuZW5jcnlwdGlvbkNvbmZpZyB8fCB7fTtcbiAgY29uc3QgbmV3QWNjZXNzQ29uZmlnID0gbmV3UHJvcHMuYWNjZXNzQ29uZmlnIHx8IHt9O1xuICBjb25zdCBvbGRBY2Nlc3NDb25maWcgPSBvbGRQcm9wcy5hY2Nlc3NDb25maWcgfHwge307XG5cbiAgcmV0dXJuIHtcbiAgICByZXBsYWNlTmFtZTogbmV3UHJvcHMubmFtZSAhPT0gb2xkUHJvcHMubmFtZSxcbiAgICB1cGRhdGVWcGM6XG4gICAgICBKU09OLnN0cmluZ2lmeShuZXdWcGNQcm9wcy5zdWJuZXRJZHM/LnNvcnQoKSkgIT09IEpTT04uc3RyaW5naWZ5KG9sZFZwY1Byb3BzLnN1Ym5ldElkcz8uc29ydCgpKSB8fFxuICAgICAgSlNPTi5zdHJpbmdpZnkobmV3VnBjUHJvcHMuc2VjdXJpdHlHcm91cElkcz8uc29ydCgpKSAhPT0gSlNPTi5zdHJpbmdpZnkob2xkVnBjUHJvcHMuc2VjdXJpdHlHcm91cElkcz8uc29ydCgpKSxcbiAgICB1cGRhdGVBY2Nlc3M6XG4gICAgICBuZXdWcGNQcm9wcy5lbmRwb2ludFByaXZhdGVBY2Nlc3MgIT09IG9sZFZwY1Byb3BzLmVuZHBvaW50UHJpdmF0ZUFjY2VzcyB8fFxuICAgICAgbmV3VnBjUHJvcHMuZW5kcG9pbnRQdWJsaWNBY2Nlc3MgIT09IG9sZFZwY1Byb3BzLmVuZHBvaW50UHVibGljQWNjZXNzIHx8XG4gICAgICAhc2V0c0VxdWFsKG5ld1B1YmxpY0FjY2Vzc0NpZHJzLCBvbGRQdWJsaWNBY2Nlc3NDaWRycyksXG4gICAgcmVwbGFjZVJvbGU6IG5ld1Byb3BzLnJvbGVBcm4gIT09IG9sZFByb3BzLnJvbGVBcm4sXG4gICAgdXBkYXRlVmVyc2lvbjogbmV3UHJvcHMudmVyc2lvbiAhPT0gb2xkUHJvcHMudmVyc2lvbixcbiAgICB1cGRhdGVFbmNyeXB0aW9uOiBKU09OLnN0cmluZ2lmeShuZXdFbmMpICE9PSBKU09OLnN0cmluZ2lmeShvbGRFbmMpLFxuICAgIHVwZGF0ZUxvZ2dpbmc6IEpTT04uc3RyaW5naWZ5KG5ld1Byb3BzLmxvZ2dpbmcpICE9PSBKU09OLnN0cmluZ2lmeShvbGRQcm9wcy5sb2dnaW5nKSxcbiAgICB1cGRhdGVBdXRoTW9kZTogSlNPTi5zdHJpbmdpZnkobmV3QWNjZXNzQ29uZmlnLmF1dGhlbnRpY2F0aW9uTW9kZSkgIT09IEpTT04uc3RyaW5naWZ5KG9sZEFjY2Vzc0NvbmZpZy5hdXRoZW50aWNhdGlvbk1vZGUpLFxuICAgIHVwZGF0ZUJvb3RzdHJhcENsdXN0ZXJDcmVhdG9yQWRtaW5QZXJtaXNzaW9uczogSlNPTi5zdHJpbmdpZnkobmV3QWNjZXNzQ29uZmlnLmJvb3RzdHJhcENsdXN0ZXJDcmVhdG9yQWRtaW5QZXJtaXNzaW9ucykgIT09XG4gICAgICBKU09OLnN0cmluZ2lmeShvbGRBY2Nlc3NDb25maWcuYm9vdHN0cmFwQ2x1c3RlckNyZWF0b3JBZG1pblBlcm1pc3Npb25zKSxcbiAgICB1cGRhdGVUYWdzOiBKU09OLnN0cmluZ2lmeShuZXdQcm9wcy50YWdzKSAhPT0gSlNPTi5zdHJpbmdpZnkob2xkUHJvcHMudGFncyksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldHNFcXVhbChmaXJzdDogU2V0PHN0cmluZz4sIHNlY29uZDogU2V0PHN0cmluZz4pIHtcbiAgcmV0dXJuIGZpcnN0LnNpemUgPT09IHNlY29uZC5zaXplICYmIFsuLi5maXJzdF0uZXZlcnkoKGU6IHN0cmluZykgPT4gc2Vjb25kLmhhcyhlKSk7XG59XG5cbmZ1bmN0aW9uIGdldFRhZ3NUb1VwZGF0ZTxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4ob2xkVGFnczogVCwgbmV3VGFnczogVCk6IFQge1xuICBjb25zdCBkaWZmOiBUID0ge30gYXMgVDtcbiAgLy8gR2V0IGFsbCB0YWcga2V5cyB0aGF0IGFyZSBuZXdseSBhZGRlZCBhbmQga2V5cyB3aG9zZSB2YWx1ZSBoYXZlIGNoYW5nZWRcbiAgZm9yIChjb25zdCBrZXkgaW4gbmV3VGFncykge1xuICAgIGlmIChuZXdUYWdzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGlmICghb2xkVGFncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGRpZmZba2V5XSA9IG5ld1RhZ3Nba2V5XTtcbiAgICAgIH0gZWxzZSBpZiAob2xkVGFnc1trZXldICE9PSBuZXdUYWdzW2tleV0pIHtcbiAgICAgICAgZGlmZltrZXldID0gbmV3VGFnc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkaWZmO1xufVxuXG5mdW5jdGlvbiBnZXRUYWdzVG9SZW1vdmU8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KG9sZFRhZ3M6IFQsIG5ld1RhZ3M6IFQpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IG1pc3NpbmdLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAvL0dldCBhbGwgdGFnIGtleXMgdG8gcmVtb3ZlXG4gIGZvciAoY29uc3Qga2V5IGluIG9sZFRhZ3MpIHtcbiAgICBpZiAob2xkVGFncy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFuZXdUYWdzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIG1pc3NpbmdLZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWlzc2luZ0tleXM7XG59XG4iXX0=