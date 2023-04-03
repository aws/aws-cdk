"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clusterArnComponents = exports.ClusterResource = void 0;
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const consts_1 = require("./cluster-resource-handler/consts");
const cluster_resource_provider_1 = require("./cluster-resource-provider");
/**
 * A low-level CFN resource Amazon EKS cluster implemented through a custom
 * resource.
 *
 * Implements EKS create/update/delete through a CloudFormation custom resource
 * in order to allow us to control the IAM role which creates the cluster. This
 * is required in order to be able to allow CloudFormation to interact with the
 * cluster via `kubectl` to enable Kubernetes management capabilities like apply
 * manifest and IAM role/user RBAC mapping.
 */
class ClusterResource extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        if (!props.roleArn) {
            throw new Error('"roleArn" is required');
        }
        this.adminRole = this.createAdminRole(props);
        const provider = cluster_resource_provider_1.ClusterResourceProvider.getOrCreate(this, {
            adminRole: this.adminRole,
            subnets: props.subnets,
            vpc: props.vpc,
            environment: props.environment,
            onEventLayer: props.onEventLayer,
            securityGroup: props.clusterHandlerSecurityGroup,
        });
        const resource = new core_1.CustomResource(this, 'Resource', {
            resourceType: consts_1.CLUSTER_RESOURCE_TYPE,
            serviceToken: provider.serviceToken,
            properties: {
                // the structure of config needs to be that of 'aws.EKS.CreateClusterRequest' since its passed as is
                // to the eks.createCluster sdk invocation.
                Config: {
                    name: props.name,
                    version: props.version,
                    roleArn: props.roleArn,
                    encryptionConfig: props.encryptionConfig,
                    kubernetesNetworkConfig: props.kubernetesNetworkConfig,
                    resourcesVpcConfig: {
                        subnetIds: props.resourcesVpcConfig.subnetIds,
                        securityGroupIds: props.resourcesVpcConfig.securityGroupIds,
                        endpointPublicAccess: props.endpointPublicAccess,
                        endpointPrivateAccess: props.endpointPrivateAccess,
                        publicAccessCidrs: props.publicAccessCidrs,
                    },
                    tags: props.tags,
                    logging: props.logging,
                },
                AssumeRoleArn: this.adminRole.roleArn,
                // IMPORTANT: increment this number when you add new attributes to the
                // resource. Otherwise, CloudFormation will error with "Vendor response
                // doesn't contain XXX key in object" (see #8276) by incrementing this
                // number, you will effectively cause a "no-op update" to the cluster
                // which will return the new set of attribute.
                AttributesRevision: 2,
            },
        });
        resource.node.addDependency(this.adminRole);
        this.ref = resource.ref;
        this.attrEndpoint = core_1.Token.asString(resource.getAtt('Endpoint'));
        this.attrArn = core_1.Token.asString(resource.getAtt('Arn'));
        this.attrCertificateAuthorityData = core_1.Token.asString(resource.getAtt('CertificateAuthorityData'));
        this.attrClusterSecurityGroupId = core_1.Token.asString(resource.getAtt('ClusterSecurityGroupId'));
        this.attrEncryptionConfigKeyArn = core_1.Token.asString(resource.getAtt('EncryptionConfigKeyArn'));
        this.attrOpenIdConnectIssuerUrl = core_1.Token.asString(resource.getAtt('OpenIdConnectIssuerUrl'));
        this.attrOpenIdConnectIssuer = core_1.Token.asString(resource.getAtt('OpenIdConnectIssuer'));
    }
    createAdminRole(props) {
        const stack = core_1.Stack.of(this);
        // the role used to create the cluster. this becomes the administrator role
        // of the cluster.
        const creationRole = new iam.Role(this, 'CreationRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        // the CreateCluster API will allow the cluster to assume this role, so we
        // need to allow the lambda execution role to pass it.
        creationRole.addToPolicy(new iam.PolicyStatement({
            actions: ['iam:PassRole'],
            resources: [props.roleArn],
        }));
        // if we know the cluster name, restrict the policy to only allow
        // interacting with this specific cluster otherwise, we will have to grant
        // this role to manage all clusters in the account. this must be lazy since
        // `props.name` may contain a lazy value that conditionally resolves to a
        // physical name.
        const resourceArns = core_1.Lazy.list({
            produce: () => {
                const arn = stack.formatArn(clusterArnComponents(stack.resolve(props.name)));
                return stack.resolve(props.name)
                    ? [arn, `${arn}/*`] // see https://github.com/aws/aws-cdk/issues/6060
                    : ['*'];
            },
        });
        const fargateProfileResourceArn = core_1.Lazy.string({
            produce: () => stack.resolve(props.name)
                ? stack.formatArn({ service: 'eks', resource: 'fargateprofile', resourceName: stack.resolve(props.name) + '/*' })
                : '*',
        });
        creationRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                'eks:CreateCluster',
                'eks:DescribeCluster',
                'eks:DescribeUpdate',
                'eks:DeleteCluster',
                'eks:UpdateClusterVersion',
                'eks:UpdateClusterConfig',
                'eks:CreateFargateProfile',
                'eks:TagResource',
                'eks:UntagResource',
            ],
            resources: resourceArns,
        }));
        creationRole.addToPolicy(new iam.PolicyStatement({
            actions: ['eks:DescribeFargateProfile', 'eks:DeleteFargateProfile'],
            resources: [fargateProfileResourceArn],
        }));
        creationRole.addToPolicy(new iam.PolicyStatement({
            actions: ['iam:GetRole', 'iam:listAttachedRolePolicies'],
            resources: ['*'],
        }));
        creationRole.addToPolicy(new iam.PolicyStatement({
            actions: ['iam:CreateServiceLinkedRole'],
            resources: ['*'],
        }));
        // see https://github.com/aws/aws-cdk/issues/9027
        // these actions are the combined 'ec2:Describe*' actions taken from the EKS SLR policies.
        // (AWSServiceRoleForAmazonEKS, AWSServiceRoleForAmazonEKSForFargate, AWSServiceRoleForAmazonEKSNodegroup)
        creationRole.addToPolicy(new iam.PolicyStatement({
            actions: [
                'ec2:DescribeInstances',
                'ec2:DescribeNetworkInterfaces',
                'ec2:DescribeSecurityGroups',
                'ec2:DescribeSubnets',
                'ec2:DescribeRouteTables',
                'ec2:DescribeDhcpOptions',
                'ec2:DescribeVpcs',
            ],
            resources: ['*'],
        }));
        // grant cluster creation role sufficient permission to access the specified key
        // see https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html
        if (props.secretsEncryptionKey) {
            creationRole.addToPolicy(new iam.PolicyStatement({
                actions: [
                    'kms:Encrypt',
                    'kms:Decrypt',
                    'kms:DescribeKey',
                    'kms:CreateGrant',
                ],
                resources: [props.secretsEncryptionKey.keyArn],
            }));
        }
        return creationRole;
    }
}
exports.ClusterResource = ClusterResource;
function clusterArnComponents(clusterName) {
    return {
        service: 'eks',
        resource: 'cluster',
        resourceName: clusterName,
    };
}
exports.clusterArnComponents = clusterArnComponents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci1yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXItcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0NBQXdDO0FBR3hDLHdDQUFrRjtBQUNsRiwyQ0FBdUM7QUFDdkMsOERBQTBFO0FBQzFFLDJFQUFzRTtBQXVCdEU7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLHNCQUFTO0lBWTVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7U0FDMUM7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFN0MsTUFBTSxRQUFRLEdBQUcsbURBQXVCLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRTtZQUN6RCxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsYUFBYSxFQUFFLEtBQUssQ0FBQywyQkFBMkI7U0FDakQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxxQkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEQsWUFBWSxFQUFFLDhCQUFxQjtZQUNuQyxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7WUFDbkMsVUFBVSxFQUFFO2dCQUNWLG9HQUFvRztnQkFDcEcsMkNBQTJDO2dCQUMzQyxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLEtBQUss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LE1BQU0sQ0FBQzthQUMvQyxDQUFDLENBQUMsQ0FBQztTQUNMO1FBRUQsT0FBTyxZQUFZLENBQUM7S0FDckI7Q0FDRjtBQTdLRCwwQ0E2S0M7QUFFRCxTQUFnQixvQkFBb0IsQ0FBQyxXQUFtQjtJQUN0RCxPQUFPO1FBQ0wsT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsV0FBVztLQUMxQixDQUFDO0FBQ0osQ0FBQztBQU5ELG9EQU1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQXJuQ29tcG9uZW50cywgQ3VzdG9tUmVzb3VyY2UsIFRva2VuLCBTdGFjaywgTGF6eSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDTFVTVEVSX1JFU09VUkNFX1RZUEUgfSBmcm9tICcuL2NsdXN0ZXItcmVzb3VyY2UtaGFuZGxlci9jb25zdHMnO1xuaW1wb3J0IHsgQ2x1c3RlclJlc291cmNlUHJvdmlkZXIgfSBmcm9tICcuL2NsdXN0ZXItcmVzb3VyY2UtcHJvdmlkZXInO1xuaW1wb3J0IHsgQ2ZuQ2x1c3RlciB9IGZyb20gJy4vZWtzLmdlbmVyYXRlZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlclJlc291cmNlUHJvcHMge1xuICByZWFkb25seSByZXNvdXJjZXNWcGNDb25maWc6IENmbkNsdXN0ZXIuUmVzb3VyY2VzVnBjQ29uZmlnUHJvcGVydHk7XG4gIHJlYWRvbmx5IHJvbGVBcm46IHN0cmluZztcbiAgcmVhZG9ubHkgZW5jcnlwdGlvbkNvbmZpZz86IEFycmF5PENmbkNsdXN0ZXIuRW5jcnlwdGlvbkNvbmZpZ1Byb3BlcnR5PjtcbiAgcmVhZG9ubHkga3ViZXJuZXRlc05ldHdvcmtDb25maWc/OiBDZm5DbHVzdGVyLkt1YmVybmV0ZXNOZXR3b3JrQ29uZmlnUHJvcGVydHk7XG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgdmVyc2lvbj86IHN0cmluZztcbiAgcmVhZG9ubHkgZW5kcG9pbnRQcml2YXRlQWNjZXNzOiBib29sZWFuO1xuICByZWFkb25seSBlbmRwb2ludFB1YmxpY0FjY2VzczogYm9vbGVhbjtcbiAgcmVhZG9ubHkgcHVibGljQWNjZXNzQ2lkcnM/OiBzdHJpbmdbXTtcbiAgcmVhZG9ubHkgdnBjOiBlYzIuSVZwYztcbiAgcmVhZG9ubHkgZW52aXJvbm1lbnQ/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuICByZWFkb25seSBzdWJuZXRzPzogZWMyLklTdWJuZXRbXTtcbiAgcmVhZG9ubHkgc2VjcmV0c0VuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcbiAgcmVhZG9ubHkgb25FdmVudExheWVyPzogbGFtYmRhLklMYXllclZlcnNpb247XG4gIHJlYWRvbmx5IGNsdXN0ZXJIYW5kbGVyU2VjdXJpdHlHcm91cD86IGVjMi5JU2VjdXJpdHlHcm91cDtcbiAgcmVhZG9ubHkgdGFncz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG4gIHJlYWRvbmx5IGxvZ2dpbmc/OiB7IFtrZXk6IHN0cmluZ106IFsgeyBba2V5OiBzdHJpbmddOiBhbnkgfSBdIH07XG59XG5cbi8qKlxuICogQSBsb3ctbGV2ZWwgQ0ZOIHJlc291cmNlIEFtYXpvbiBFS1MgY2x1c3RlciBpbXBsZW1lbnRlZCB0aHJvdWdoIGEgY3VzdG9tXG4gKiByZXNvdXJjZS5cbiAqXG4gKiBJbXBsZW1lbnRzIEVLUyBjcmVhdGUvdXBkYXRlL2RlbGV0ZSB0aHJvdWdoIGEgQ2xvdWRGb3JtYXRpb24gY3VzdG9tIHJlc291cmNlXG4gKiBpbiBvcmRlciB0byBhbGxvdyB1cyB0byBjb250cm9sIHRoZSBJQU0gcm9sZSB3aGljaCBjcmVhdGVzIHRoZSBjbHVzdGVyLiBUaGlzXG4gKiBpcyByZXF1aXJlZCBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGFsbG93IENsb3VkRm9ybWF0aW9uIHRvIGludGVyYWN0IHdpdGggdGhlXG4gKiBjbHVzdGVyIHZpYSBga3ViZWN0bGAgdG8gZW5hYmxlIEt1YmVybmV0ZXMgbWFuYWdlbWVudCBjYXBhYmlsaXRpZXMgbGlrZSBhcHBseVxuICogbWFuaWZlc3QgYW5kIElBTSByb2xlL3VzZXIgUkJBQyBtYXBwaW5nLlxuICovXG5leHBvcnQgY2xhc3MgQ2x1c3RlclJlc291cmNlIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IGF0dHJFbmRwb2ludDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYXR0ckFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYXR0ckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYXR0ckNsdXN0ZXJTZWN1cml0eUdyb3VwSWQ6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGF0dHJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBhdHRyT3BlbklkQ29ubmVjdElzc3VlclVybDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYXR0ck9wZW5JZENvbm5lY3RJc3N1ZXI6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHJlZjogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBhZG1pblJvbGU6IGlhbS5Sb2xlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDbHVzdGVyUmVzb3VyY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAoIXByb3BzLnJvbGVBcm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJyb2xlQXJuXCIgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmFkbWluUm9sZSA9IHRoaXMuY3JlYXRlQWRtaW5Sb2xlKHByb3BzKTtcblxuICAgIGNvbnN0IHByb3ZpZGVyID0gQ2x1c3RlclJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGUodGhpcywge1xuICAgICAgYWRtaW5Sb2xlOiB0aGlzLmFkbWluUm9sZSxcbiAgICAgIHN1Ym5ldHM6IHByb3BzLnN1Ym5ldHMsXG4gICAgICB2cGM6IHByb3BzLnZwYyxcbiAgICAgIGVudmlyb25tZW50OiBwcm9wcy5lbnZpcm9ubWVudCxcbiAgICAgIG9uRXZlbnRMYXllcjogcHJvcHMub25FdmVudExheWVyLFxuICAgICAgc2VjdXJpdHlHcm91cDogcHJvcHMuY2x1c3RlckhhbmRsZXJTZWN1cml0eUdyb3VwLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBDTFVTVEVSX1JFU09VUkNFX1RZUEUsXG4gICAgICBzZXJ2aWNlVG9rZW46IHByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gdGhlIHN0cnVjdHVyZSBvZiBjb25maWcgbmVlZHMgdG8gYmUgdGhhdCBvZiAnYXdzLkVLUy5DcmVhdGVDbHVzdGVyUmVxdWVzdCcgc2luY2UgaXRzIHBhc3NlZCBhcyBpc1xuICAgICAgICAvLyB0byB0aGUgZWtzLmNyZWF0ZUNsdXN0ZXIgc2RrIGludm9jYXRpb24uXG4gICAgICAgIENvbmZpZzoge1xuICAgICAgICAgIG5hbWU6IHByb3BzLm5hbWUsXG4gICAgICAgICAgdmVyc2lvbjogcHJvcHMudmVyc2lvbixcbiAgICAgICAgICByb2xlQXJuOiBwcm9wcy5yb2xlQXJuLFxuICAgICAgICAgIGVuY3J5cHRpb25Db25maWc6IHByb3BzLmVuY3J5cHRpb25Db25maWcsXG4gICAgICAgICAga3ViZXJuZXRlc05ldHdvcmtDb25maWc6IHByb3BzLmt1YmVybmV0ZXNOZXR3b3JrQ29uZmlnLFxuICAgICAgICAgIHJlc291cmNlc1ZwY0NvbmZpZzoge1xuICAgICAgICAgICAgc3VibmV0SWRzOiAocHJvcHMucmVzb3VyY2VzVnBjQ29uZmlnIGFzIENmbkNsdXN0ZXIuUmVzb3VyY2VzVnBjQ29uZmlnUHJvcGVydHkpLnN1Ym5ldElkcyxcbiAgICAgICAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IChwcm9wcy5yZXNvdXJjZXNWcGNDb25maWcgYXMgQ2ZuQ2x1c3Rlci5SZXNvdXJjZXNWcGNDb25maWdQcm9wZXJ0eSkuc2VjdXJpdHlHcm91cElkcyxcbiAgICAgICAgICAgIGVuZHBvaW50UHVibGljQWNjZXNzOiBwcm9wcy5lbmRwb2ludFB1YmxpY0FjY2VzcyxcbiAgICAgICAgICAgIGVuZHBvaW50UHJpdmF0ZUFjY2VzczogcHJvcHMuZW5kcG9pbnRQcml2YXRlQWNjZXNzLFxuICAgICAgICAgICAgcHVibGljQWNjZXNzQ2lkcnM6IHByb3BzLnB1YmxpY0FjY2Vzc0NpZHJzLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGFnczogcHJvcHMudGFncyxcbiAgICAgICAgICBsb2dnaW5nOiBwcm9wcy5sb2dnaW5nLFxuICAgICAgICB9LFxuICAgICAgICBBc3N1bWVSb2xlQXJuOiB0aGlzLmFkbWluUm9sZS5yb2xlQXJuLFxuXG4gICAgICAgIC8vIElNUE9SVEFOVDogaW5jcmVtZW50IHRoaXMgbnVtYmVyIHdoZW4geW91IGFkZCBuZXcgYXR0cmlidXRlcyB0byB0aGVcbiAgICAgICAgLy8gcmVzb3VyY2UuIE90aGVyd2lzZSwgQ2xvdWRGb3JtYXRpb24gd2lsbCBlcnJvciB3aXRoIFwiVmVuZG9yIHJlc3BvbnNlXG4gICAgICAgIC8vIGRvZXNuJ3QgY29udGFpbiBYWFgga2V5IGluIG9iamVjdFwiIChzZWUgIzgyNzYpIGJ5IGluY3JlbWVudGluZyB0aGlzXG4gICAgICAgIC8vIG51bWJlciwgeW91IHdpbGwgZWZmZWN0aXZlbHkgY2F1c2UgYSBcIm5vLW9wIHVwZGF0ZVwiIHRvIHRoZSBjbHVzdGVyXG4gICAgICAgIC8vIHdoaWNoIHdpbGwgcmV0dXJuIHRoZSBuZXcgc2V0IG9mIGF0dHJpYnV0ZS5cbiAgICAgICAgQXR0cmlidXRlc1JldmlzaW9uOiAyLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJlc291cmNlLm5vZGUuYWRkRGVwZW5kZW5jeSh0aGlzLmFkbWluUm9sZSk7XG5cbiAgICB0aGlzLnJlZiA9IHJlc291cmNlLnJlZjtcbiAgICB0aGlzLmF0dHJFbmRwb2ludCA9IFRva2VuLmFzU3RyaW5nKHJlc291cmNlLmdldEF0dCgnRW5kcG9pbnQnKSk7XG4gICAgdGhpcy5hdHRyQXJuID0gVG9rZW4uYXNTdHJpbmcocmVzb3VyY2UuZ2V0QXR0KCdBcm4nKSk7XG4gICAgdGhpcy5hdHRyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhID0gVG9rZW4uYXNTdHJpbmcocmVzb3VyY2UuZ2V0QXR0KCdDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEnKSk7XG4gICAgdGhpcy5hdHRyQ2x1c3RlclNlY3VyaXR5R3JvdXBJZCA9IFRva2VuLmFzU3RyaW5nKHJlc291cmNlLmdldEF0dCgnQ2x1c3RlclNlY3VyaXR5R3JvdXBJZCcpKTtcbiAgICB0aGlzLmF0dHJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuID0gVG9rZW4uYXNTdHJpbmcocmVzb3VyY2UuZ2V0QXR0KCdFbmNyeXB0aW9uQ29uZmlnS2V5QXJuJykpO1xuICAgIHRoaXMuYXR0ck9wZW5JZENvbm5lY3RJc3N1ZXJVcmwgPSBUb2tlbi5hc1N0cmluZyhyZXNvdXJjZS5nZXRBdHQoJ09wZW5JZENvbm5lY3RJc3N1ZXJVcmwnKSk7XG4gICAgdGhpcy5hdHRyT3BlbklkQ29ubmVjdElzc3VlciA9IFRva2VuLmFzU3RyaW5nKHJlc291cmNlLmdldEF0dCgnT3BlbklkQ29ubmVjdElzc3VlcicpKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQWRtaW5Sb2xlKHByb3BzOiBDbHVzdGVyUmVzb3VyY2VQcm9wcykge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG5cbiAgICAvLyB0aGUgcm9sZSB1c2VkIHRvIGNyZWF0ZSB0aGUgY2x1c3Rlci4gdGhpcyBiZWNvbWVzIHRoZSBhZG1pbmlzdHJhdG9yIHJvbGVcbiAgICAvLyBvZiB0aGUgY2x1c3Rlci5cbiAgICBjb25zdCBjcmVhdGlvblJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0NyZWF0aW9uUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgLy8gdGhlIENyZWF0ZUNsdXN0ZXIgQVBJIHdpbGwgYWxsb3cgdGhlIGNsdXN0ZXIgdG8gYXNzdW1lIHRoaXMgcm9sZSwgc28gd2VcbiAgICAvLyBuZWVkIHRvIGFsbG93IHRoZSBsYW1iZGEgZXhlY3V0aW9uIHJvbGUgdG8gcGFzcyBpdC5cbiAgICBjcmVhdGlvblJvbGUuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydpYW06UGFzc1JvbGUnXSxcbiAgICAgIHJlc291cmNlczogW3Byb3BzLnJvbGVBcm5dLFxuICAgIH0pKTtcblxuICAgIC8vIGlmIHdlIGtub3cgdGhlIGNsdXN0ZXIgbmFtZSwgcmVzdHJpY3QgdGhlIHBvbGljeSB0byBvbmx5IGFsbG93XG4gICAgLy8gaW50ZXJhY3Rpbmcgd2l0aCB0aGlzIHNwZWNpZmljIGNsdXN0ZXIgb3RoZXJ3aXNlLCB3ZSB3aWxsIGhhdmUgdG8gZ3JhbnRcbiAgICAvLyB0aGlzIHJvbGUgdG8gbWFuYWdlIGFsbCBjbHVzdGVycyBpbiB0aGUgYWNjb3VudC4gdGhpcyBtdXN0IGJlIGxhenkgc2luY2VcbiAgICAvLyBgcHJvcHMubmFtZWAgbWF5IGNvbnRhaW4gYSBsYXp5IHZhbHVlIHRoYXQgY29uZGl0aW9uYWxseSByZXNvbHZlcyB0byBhXG4gICAgLy8gcGh5c2ljYWwgbmFtZS5cbiAgICBjb25zdCByZXNvdXJjZUFybnMgPSBMYXp5Lmxpc3Qoe1xuICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICBjb25zdCBhcm4gPSBzdGFjay5mb3JtYXRBcm4oY2x1c3RlckFybkNvbXBvbmVudHMoc3RhY2sucmVzb2x2ZShwcm9wcy5uYW1lKSkpO1xuICAgICAgICByZXR1cm4gc3RhY2sucmVzb2x2ZShwcm9wcy5uYW1lKVxuICAgICAgICAgID8gW2FybiwgYCR7YXJufS8qYF0gLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvNjA2MFxuICAgICAgICAgIDogWycqJ107XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgZmFyZ2F0ZVByb2ZpbGVSZXNvdXJjZUFybiA9IExhenkuc3RyaW5nKHtcbiAgICAgIHByb2R1Y2U6ICgpID0+IHN0YWNrLnJlc29sdmUocHJvcHMubmFtZSlcbiAgICAgICAgPyBzdGFjay5mb3JtYXRBcm4oeyBzZXJ2aWNlOiAnZWtzJywgcmVzb3VyY2U6ICdmYXJnYXRlcHJvZmlsZScsIHJlc291cmNlTmFtZTogc3RhY2sucmVzb2x2ZShwcm9wcy5uYW1lKSArICcvKicgfSlcbiAgICAgICAgOiAnKicsXG4gICAgfSk7XG5cbiAgICBjcmVhdGlvblJvbGUuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnZWtzOkNyZWF0ZUNsdXN0ZXInLFxuICAgICAgICAnZWtzOkRlc2NyaWJlQ2x1c3RlcicsXG4gICAgICAgICdla3M6RGVzY3JpYmVVcGRhdGUnLFxuICAgICAgICAnZWtzOkRlbGV0ZUNsdXN0ZXInLFxuICAgICAgICAnZWtzOlVwZGF0ZUNsdXN0ZXJWZXJzaW9uJyxcbiAgICAgICAgJ2VrczpVcGRhdGVDbHVzdGVyQ29uZmlnJyxcbiAgICAgICAgJ2VrczpDcmVhdGVGYXJnYXRlUHJvZmlsZScsXG4gICAgICAgICdla3M6VGFnUmVzb3VyY2UnLFxuICAgICAgICAnZWtzOlVudGFnUmVzb3VyY2UnLFxuICAgICAgXSxcbiAgICAgIHJlc291cmNlczogcmVzb3VyY2VBcm5zLFxuICAgIH0pKTtcblxuICAgIGNyZWF0aW9uUm9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2VrczpEZXNjcmliZUZhcmdhdGVQcm9maWxlJywgJ2VrczpEZWxldGVGYXJnYXRlUHJvZmlsZSddLFxuICAgICAgcmVzb3VyY2VzOiBbZmFyZ2F0ZVByb2ZpbGVSZXNvdXJjZUFybl0sXG4gICAgfSkpO1xuXG4gICAgY3JlYXRpb25Sb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnaWFtOkdldFJvbGUnLCAnaWFtOmxpc3RBdHRhY2hlZFJvbGVQb2xpY2llcyddLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG5cbiAgICBjcmVhdGlvblJvbGUuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydpYW06Q3JlYXRlU2VydmljZUxpbmtlZFJvbGUnXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuXG4gICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvOTAyN1xuICAgIC8vIHRoZXNlIGFjdGlvbnMgYXJlIHRoZSBjb21iaW5lZCAnZWMyOkRlc2NyaWJlKicgYWN0aW9ucyB0YWtlbiBmcm9tIHRoZSBFS1MgU0xSIHBvbGljaWVzLlxuICAgIC8vIChBV1NTZXJ2aWNlUm9sZUZvckFtYXpvbkVLUywgQVdTU2VydmljZVJvbGVGb3JBbWF6b25FS1NGb3JGYXJnYXRlLCBBV1NTZXJ2aWNlUm9sZUZvckFtYXpvbkVLU05vZGVncm91cClcbiAgICBjcmVhdGlvblJvbGUuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnZWMyOkRlc2NyaWJlSW5zdGFuY2VzJyxcbiAgICAgICAgJ2VjMjpEZXNjcmliZU5ldHdvcmtJbnRlcmZhY2VzJyxcbiAgICAgICAgJ2VjMjpEZXNjcmliZVNlY3VyaXR5R3JvdXBzJyxcbiAgICAgICAgJ2VjMjpEZXNjcmliZVN1Ym5ldHMnLFxuICAgICAgICAnZWMyOkRlc2NyaWJlUm91dGVUYWJsZXMnLFxuICAgICAgICAnZWMyOkRlc2NyaWJlRGhjcE9wdGlvbnMnLFxuICAgICAgICAnZWMyOkRlc2NyaWJlVnBjcycsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG5cbiAgICAvLyBncmFudCBjbHVzdGVyIGNyZWF0aW9uIHJvbGUgc3VmZmljaWVudCBwZXJtaXNzaW9uIHRvIGFjY2VzcyB0aGUgc3BlY2lmaWVkIGtleVxuICAgIC8vIHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvY3JlYXRlLWNsdXN0ZXIuaHRtbFxuICAgIGlmIChwcm9wcy5zZWNyZXRzRW5jcnlwdGlvbktleSkge1xuICAgICAgY3JlYXRpb25Sb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICdrbXM6RW5jcnlwdCcsXG4gICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAna21zOkRlc2NyaWJlS2V5JyxcbiAgICAgICAgICAna21zOkNyZWF0ZUdyYW50JyxcbiAgICAgICAgXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbcHJvcHMuc2VjcmV0c0VuY3J5cHRpb25LZXkua2V5QXJuXSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRpb25Sb2xlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbHVzdGVyQXJuQ29tcG9uZW50cyhjbHVzdGVyTmFtZTogc3RyaW5nKTogQXJuQ29tcG9uZW50cyB7XG4gIHJldHVybiB7XG4gICAgc2VydmljZTogJ2VrcycsXG4gICAgcmVzb3VyY2U6ICdjbHVzdGVyJyxcbiAgICByZXNvdXJjZU5hbWU6IGNsdXN0ZXJOYW1lLFxuICB9O1xufVxuIl19