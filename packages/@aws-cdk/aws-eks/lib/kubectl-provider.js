"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubectlProvider = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const cr = require("@aws-cdk/custom-resources");
const lambda_layer_awscli_1 = require("@aws-cdk/lambda-layer-awscli");
const lambda_layer_kubectl_1 = require("@aws-cdk/lambda-layer-kubectl");
const constructs_1 = require("constructs");
const cluster_1 = require("./cluster");
/**
 * Implementation of Kubectl Lambda
 */
class KubectlProvider extends core_1.NestedStack {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_KubectlProviderProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KubectlProvider);
            }
            throw error;
        }
        const cluster = props.cluster;
        if (!cluster.kubectlRole) {
            throw new Error('"kubectlRole" is not defined, cannot issue kubectl commands against this cluster');
        }
        if (cluster.kubectlPrivateSubnets && !cluster.kubectlSecurityGroup) {
            throw new Error('"kubectlSecurityGroup" is required if "kubectlSubnets" is specified');
        }
        const memorySize = cluster.kubectlMemory ? cluster.kubectlMemory.toMebibytes() : 1024;
        const handler = new lambda.Function(this, 'Handler', {
            code: lambda.Code.fromAsset(path.join(__dirname, 'kubectl-handler')),
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'index.handler',
            timeout: core_1.Duration.minutes(15),
            description: 'onEvent handler for EKS kubectl resource provider',
            memorySize,
            environment: cluster.kubectlEnvironment,
            role: cluster.kubectlLambdaRole ? cluster.kubectlLambdaRole : undefined,
            // defined only when using private access
            vpc: cluster.kubectlPrivateSubnets ? cluster.vpc : undefined,
            securityGroups: cluster.kubectlSecurityGroup ? [cluster.kubectlSecurityGroup] : undefined,
            vpcSubnets: cluster.kubectlPrivateSubnets ? { subnets: cluster.kubectlPrivateSubnets } : undefined,
        });
        // allow user to customize the layers with the tools we need
        handler.addLayers(props.cluster.awscliLayer ?? new lambda_layer_awscli_1.AwsCliLayer(this, 'AwsCliLayer'));
        handler.addLayers(props.cluster.kubectlLayer ?? new lambda_layer_kubectl_1.KubectlLayer(this, 'KubectlLayer'));
        this.handlerRole = handler.role;
        this.handlerRole.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['eks:DescribeCluster'],
            resources: [cluster.clusterArn],
        }));
        // For OCI helm chart authorization.
        this.handlerRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));
        // For OCI helm chart public ECR authorization.
        this.handlerRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonElasticContainerRegistryPublicReadOnly'));
        // allow this handler to assume the kubectl role
        cluster.kubectlRole.grant(this.handlerRole, 'sts:AssumeRole');
        const provider = new cr.Provider(this, 'Provider', {
            onEventHandler: handler,
            vpc: cluster.kubectlPrivateSubnets ? cluster.vpc : undefined,
            vpcSubnets: cluster.kubectlPrivateSubnets ? { subnets: cluster.kubectlPrivateSubnets } : undefined,
            securityGroups: cluster.kubectlSecurityGroup ? [cluster.kubectlSecurityGroup] : undefined,
        });
        this.serviceToken = provider.serviceToken;
        this.roleArn = cluster.kubectlRole.roleArn;
    }
    /**
     * Take existing provider or create new based on cluster
     *
     * @param scope Construct
     * @param cluster k8s cluster
     */
    static getOrCreate(scope, cluster) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_ICluster(cluster);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getOrCreate);
            }
            throw error;
        }
        // if this is an "owned" cluster, it has a provider associated with it
        if (cluster instanceof cluster_1.Cluster) {
            return cluster._attachKubectlResourceScope(scope);
        }
        // if this is an imported cluster, it maybe has a predefined kubectl provider?
        if (cluster.kubectlProvider) {
            return cluster.kubectlProvider;
        }
        // if this is an imported cluster and there is no kubectl provider defined, we need to provision a custom resource provider in this stack
        // we will define one per stack for each cluster based on the cluster uniqueid
        const uid = `${core_1.Names.nodeUniqueId(cluster.node)}-KubectlProvider`;
        const stack = core_1.Stack.of(scope);
        let provider = stack.node.tryFindChild(uid);
        if (!provider) {
            provider = new KubectlProvider(stack, uid, { cluster });
        }
        return provider;
    }
    /**
     * Import an existing provider
     *
     * @param scope Construct
     * @param id an id of resource
     * @param attrs attributes for the provider
     */
    static fromKubectlProviderAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_KubectlProviderAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromKubectlProviderAttributes);
            }
            throw error;
        }
        return new ImportedKubectlProvider(scope, id, attrs);
    }
}
exports.KubectlProvider = KubectlProvider;
_a = JSII_RTTI_SYMBOL_1;
KubectlProvider[_a] = { fqn: "@aws-cdk/aws-eks.KubectlProvider", version: "0.0.0" };
class ImportedKubectlProvider extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.serviceToken = props.functionArn;
        this.roleArn = props.kubectlRoleArn;
        this.handlerRole = props.handlerRole;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ViZWN0bC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImt1YmVjdGwtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsd0NBQW9FO0FBQ3BFLGdEQUFnRDtBQUNoRCxzRUFBMkQ7QUFDM0Qsd0VBQTZEO0FBQzdELDJDQUFtRDtBQUNuRCx1Q0FBOEM7QUFvRDlDOztHQUVHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLGtCQUFXO0lBeUQ5QyxZQUFtQixLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEyQjtRQUMxRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBMURSLGVBQWU7Ozs7UUE0RHhCLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFFOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRkFBa0YsQ0FBQyxDQUFDO1NBQ3JHO1FBRUQsSUFBSSxPQUFPLENBQUMscUJBQXFCLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUU7WUFDbEUsTUFBTSxJQUFJLEtBQUssQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO1NBQ3hGO1FBRUQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRXRGLE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ25ELElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3BFLE9BQU8sRUFBRSxNQUFNLENB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R0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztLQUN0QztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7IER1cmF0aW9uLCBTdGFjaywgTmVzdGVkU3RhY2ssIE5hbWVzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjciBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzJztcbmltcG9ydCB7IEF3c0NsaUxheWVyIH0gZnJvbSAnQGF3cy1jZGsvbGFtYmRhLWxheWVyLWF3c2NsaSc7XG5pbXBvcnQgeyBLdWJlY3RsTGF5ZXIgfSBmcm9tICdAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElDbHVzdGVyLCBDbHVzdGVyIH0gZnJvbSAnLi9jbHVzdGVyJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIEt1YmVjdGxQcm92aWRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEt1YmVjdGxQcm92aWRlclByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBjbHVzdGVyIHRvIGNvbnRyb2wuXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3Rlcjtcbn1cblxuLyoqXG4gKiBLdWJlY3RsIFByb3ZpZGVyIEF0dHJpYnV0ZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBLdWJlY3RsUHJvdmlkZXJBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBrdWJlY3RsIHByb3ZpZGVyIGxhbWJkYSBhcm5cbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gcm9sZSB0byBhc3N1bWUgaW4gb3JkZXIgdG8gcGVyZm9ybSBrdWJlY3RsIG9wZXJhdGlvbnMgYWdhaW5zdCB0aGlzIGNsdXN0ZXIuXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsUm9sZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIGV4ZWN1dGlvbiByb2xlIG9mIHRoZSBoYW5kbGVyLiBUaGlzIHJvbGUgbXVzdCBiZSBhYmxlIHRvIGFzc3VtZSBrdWJlY3RsUm9sZUFyblxuICAgKi9cbiAgcmVhZG9ubHkgaGFuZGxlclJvbGU6IGlhbS5JUm9sZTtcbn1cblxuLyoqXG4gKiBJbXBvcnRlZCBLdWJlY3RsUHJvdmlkZXIgdGhhdCBjYW4gYmUgdXNlZCBpbiBwbGFjZSBvZiB0aGUgZGVmYXVsdCBvbmUgY3JlYXRlZCBieSBDREtcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJS3ViZWN0bFByb3ZpZGVyIGV4dGVuZHMgSUNvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBUaGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyJ3Mgc2VydmljZSB0b2tlbi5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VUb2tlbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIHJvbGUgdG8gYXNzdW1lIGluIG9yZGVyIHRvIHBlcmZvcm0ga3ViZWN0bCBvcGVyYXRpb25zIGFnYWluc3QgdGhpcyBjbHVzdGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIGV4ZWN1dGlvbiByb2xlIG9mIHRoZSBoYW5kbGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgaGFuZGxlclJvbGU6IGlhbS5JUm9sZTtcbn1cblxuLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiBLdWJlY3RsIExhbWJkYVxuICovXG5leHBvcnQgY2xhc3MgS3ViZWN0bFByb3ZpZGVyIGV4dGVuZHMgTmVzdGVkU3RhY2sgaW1wbGVtZW50cyBJS3ViZWN0bFByb3ZpZGVyIHtcblxuICAvKipcbiAgICogVGFrZSBleGlzdGluZyBwcm92aWRlciBvciBjcmVhdGUgbmV3IGJhc2VkIG9uIGNsdXN0ZXJcbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIENvbnN0cnVjdFxuICAgKiBAcGFyYW0gY2x1c3RlciBrOHMgY2x1c3RlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXRPckNyZWF0ZShzY29wZTogQ29uc3RydWN0LCBjbHVzdGVyOiBJQ2x1c3Rlcikge1xuICAgIC8vIGlmIHRoaXMgaXMgYW4gXCJvd25lZFwiIGNsdXN0ZXIsIGl0IGhhcyBhIHByb3ZpZGVyIGFzc29jaWF0ZWQgd2l0aCBpdFxuICAgIGlmIChjbHVzdGVyIGluc3RhbmNlb2YgQ2x1c3Rlcikge1xuICAgICAgcmV0dXJuIGNsdXN0ZXIuX2F0dGFjaEt1YmVjdGxSZXNvdXJjZVNjb3BlKHNjb3BlKTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGlzIGlzIGFuIGltcG9ydGVkIGNsdXN0ZXIsIGl0IG1heWJlIGhhcyBhIHByZWRlZmluZWQga3ViZWN0bCBwcm92aWRlcj9cbiAgICBpZiAoY2x1c3Rlci5rdWJlY3RsUHJvdmlkZXIpIHtcbiAgICAgIHJldHVybiBjbHVzdGVyLmt1YmVjdGxQcm92aWRlcjtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGlzIGlzIGFuIGltcG9ydGVkIGNsdXN0ZXIgYW5kIHRoZXJlIGlzIG5vIGt1YmVjdGwgcHJvdmlkZXIgZGVmaW5lZCwgd2UgbmVlZCB0byBwcm92aXNpb24gYSBjdXN0b20gcmVzb3VyY2UgcHJvdmlkZXIgaW4gdGhpcyBzdGFja1xuICAgIC8vIHdlIHdpbGwgZGVmaW5lIG9uZSBwZXIgc3RhY2sgZm9yIGVhY2ggY2x1c3RlciBiYXNlZCBvbiB0aGUgY2x1c3RlciB1bmlxdWVpZFxuICAgIGNvbnN0IHVpZCA9IGAke05hbWVzLm5vZGVVbmlxdWVJZChjbHVzdGVyLm5vZGUpfS1LdWJlY3RsUHJvdmlkZXJgO1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGxldCBwcm92aWRlciA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKHVpZCkgYXMgS3ViZWN0bFByb3ZpZGVyO1xuICAgIGlmICghcHJvdmlkZXIpIHtcbiAgICAgIHByb3ZpZGVyID0gbmV3IEt1YmVjdGxQcm92aWRlcihzdGFjaywgdWlkLCB7IGNsdXN0ZXIgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3ZpZGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBwcm92aWRlclxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgQ29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCBhbiBpZCBvZiByZXNvdXJjZVxuICAgKiBAcGFyYW0gYXR0cnMgYXR0cmlidXRlcyBmb3IgdGhlIHByb3ZpZGVyXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21LdWJlY3RsUHJvdmlkZXJBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBLdWJlY3RsUHJvdmlkZXJBdHRyaWJ1dGVzKTogSUt1YmVjdGxQcm92aWRlciB7XG4gICAgcmV0dXJuIG5ldyBJbXBvcnRlZEt1YmVjdGxQcm92aWRlcihzY29wZSwgaWQsIGF0dHJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyJ3Mgc2VydmljZSB0b2tlbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlVG9rZW46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElBTSByb2xlIHRvIGFzc3VtZSBpbiBvcmRlciB0byBwZXJmb3JtIGt1YmVjdGwgb3BlcmF0aW9ucyBhZ2FpbnN0IHRoaXMgY2x1c3Rlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByb2xlQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gZXhlY3V0aW9uIHJvbGUgb2YgdGhlIGhhbmRsZXIuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaGFuZGxlclJvbGU6IGlhbS5JUm9sZTtcblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEt1YmVjdGxQcm92aWRlclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBwcm9wcy5jbHVzdGVyO1xuXG4gICAgaWYgKCFjbHVzdGVyLmt1YmVjdGxSb2xlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wia3ViZWN0bFJvbGVcIiBpcyBub3QgZGVmaW5lZCwgY2Fubm90IGlzc3VlIGt1YmVjdGwgY29tbWFuZHMgYWdhaW5zdCB0aGlzIGNsdXN0ZXInKTtcbiAgICB9XG5cbiAgICBpZiAoY2x1c3Rlci5rdWJlY3RsUHJpdmF0ZVN1Ym5ldHMgJiYgIWNsdXN0ZXIua3ViZWN0bFNlY3VyaXR5R3JvdXApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJrdWJlY3RsU2VjdXJpdHlHcm91cFwiIGlzIHJlcXVpcmVkIGlmIFwia3ViZWN0bFN1Ym5ldHNcIiBpcyBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZW1vcnlTaXplID0gY2x1c3Rlci5rdWJlY3RsTWVtb3J5ID8gY2x1c3Rlci5rdWJlY3RsTWVtb3J5LnRvTWViaWJ5dGVzKCkgOiAxMDI0O1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0hhbmRsZXInLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2t1YmVjdGwtaGFuZGxlcicpKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzcsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDE1KSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnb25FdmVudCBoYW5kbGVyIGZvciBFS1Mga3ViZWN0bCByZXNvdXJjZSBwcm92aWRlcicsXG4gICAgICBtZW1vcnlTaXplLFxuICAgICAgZW52aXJvbm1lbnQ6IGNsdXN0ZXIua3ViZWN0bEVudmlyb25tZW50LFxuICAgICAgcm9sZTogY2x1c3Rlci5rdWJlY3RsTGFtYmRhUm9sZSA/IGNsdXN0ZXIua3ViZWN0bExhbWJkYVJvbGUgOiB1bmRlZmluZWQsXG5cbiAgICAgIC8vIGRlZmluZWQgb25seSB3aGVuIHVzaW5nIHByaXZhdGUgYWNjZXNzXG4gICAgICB2cGM6IGNsdXN0ZXIua3ViZWN0bFByaXZhdGVTdWJuZXRzID8gY2x1c3Rlci52cGMgOiB1bmRlZmluZWQsXG4gICAgICBzZWN1cml0eUdyb3VwczogY2x1c3Rlci5rdWJlY3RsU2VjdXJpdHlHcm91cCA/IFtjbHVzdGVyLmt1YmVjdGxTZWN1cml0eUdyb3VwXSA6IHVuZGVmaW5lZCxcbiAgICAgIHZwY1N1Ym5ldHM6IGNsdXN0ZXIua3ViZWN0bFByaXZhdGVTdWJuZXRzID8geyBzdWJuZXRzOiBjbHVzdGVyLmt1YmVjdGxQcml2YXRlU3VibmV0cyB9IDogdW5kZWZpbmVkLFxuICAgIH0pO1xuXG4gICAgLy8gYWxsb3cgdXNlciB0byBjdXN0b21pemUgdGhlIGxheWVycyB3aXRoIHRoZSB0b29scyB3ZSBuZWVkXG4gICAgaGFuZGxlci5hZGRMYXllcnMocHJvcHMuY2x1c3Rlci5hd3NjbGlMYXllciA/PyBuZXcgQXdzQ2xpTGF5ZXIodGhpcywgJ0F3c0NsaUxheWVyJykpO1xuICAgIGhhbmRsZXIuYWRkTGF5ZXJzKHByb3BzLmNsdXN0ZXIua3ViZWN0bExheWVyID8/IG5ldyBLdWJlY3RsTGF5ZXIodGhpcywgJ0t1YmVjdGxMYXllcicpKTtcblxuICAgIHRoaXMuaGFuZGxlclJvbGUgPSBoYW5kbGVyLnJvbGUhO1xuXG4gICAgdGhpcy5oYW5kbGVyUm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2VrczpEZXNjcmliZUNsdXN0ZXInXSxcbiAgICAgIHJlc291cmNlczogW2NsdXN0ZXIuY2x1c3RlckFybl0sXG4gICAgfSkpO1xuXG4gICAgLy8gRm9yIE9DSSBoZWxtIGNoYXJ0IGF1dGhvcml6YXRpb24uXG4gICAgdGhpcy5oYW5kbGVyUm9sZS5hZGRNYW5hZ2VkUG9saWN5KFxuICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FQzJDb250YWluZXJSZWdpc3RyeVJlYWRPbmx5JyksXG4gICAgKTtcblxuICAgIC8vIEZvciBPQ0kgaGVsbSBjaGFydCBwdWJsaWMgRUNSIGF1dGhvcml6YXRpb24uXG4gICAgdGhpcy5oYW5kbGVyUm9sZS5hZGRNYW5hZ2VkUG9saWN5KFxuICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FbGFzdGljQ29udGFpbmVyUmVnaXN0cnlQdWJsaWNSZWFkT25seScpLFxuICAgICk7XG5cbiAgICAvLyBhbGxvdyB0aGlzIGhhbmRsZXIgdG8gYXNzdW1lIHRoZSBrdWJlY3RsIHJvbGVcbiAgICBjbHVzdGVyLmt1YmVjdGxSb2xlLmdyYW50KHRoaXMuaGFuZGxlclJvbGUsICdzdHM6QXNzdW1lUm9sZScpO1xuXG4gICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgY3IuUHJvdmlkZXIodGhpcywgJ1Byb3ZpZGVyJywge1xuICAgICAgb25FdmVudEhhbmRsZXI6IGhhbmRsZXIsXG4gICAgICB2cGM6IGNsdXN0ZXIua3ViZWN0bFByaXZhdGVTdWJuZXRzID8gY2x1c3Rlci52cGMgOiB1bmRlZmluZWQsXG4gICAgICB2cGNTdWJuZXRzOiBjbHVzdGVyLmt1YmVjdGxQcml2YXRlU3VibmV0cyA/IHsgc3VibmV0czogY2x1c3Rlci5rdWJlY3RsUHJpdmF0ZVN1Ym5ldHMgfSA6IHVuZGVmaW5lZCxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBjbHVzdGVyLmt1YmVjdGxTZWN1cml0eUdyb3VwID8gW2NsdXN0ZXIua3ViZWN0bFNlY3VyaXR5R3JvdXBdIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXJ2aWNlVG9rZW4gPSBwcm92aWRlci5zZXJ2aWNlVG9rZW47XG4gICAgdGhpcy5yb2xlQXJuID0gY2x1c3Rlci5rdWJlY3RsUm9sZS5yb2xlQXJuO1xuICB9XG5cbn1cblxuY2xhc3MgSW1wb3J0ZWRLdWJlY3RsUHJvdmlkZXIgZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBJS3ViZWN0bFByb3ZpZGVyIHtcblxuICAvKipcbiAgICogVGhlIGN1c3RvbSByZXNvdXJjZSBwcm92aWRlcidzIHNlcnZpY2UgdG9rZW4uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VydmljZVRva2VuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gcm9sZSB0byBhc3N1bWUgaW4gb3JkZXIgdG8gcGVyZm9ybSBrdWJlY3RsIG9wZXJhdGlvbnMgYWdhaW5zdCB0aGlzIGNsdXN0ZXIuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIGV4ZWN1dGlvbiByb2xlIG9mIHRoZSBoYW5kbGVyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGhhbmRsZXJSb2xlOiBpYW0uSVJvbGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEt1YmVjdGxQcm92aWRlckF0dHJpYnV0ZXMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5zZXJ2aWNlVG9rZW4gPSBwcm9wcy5mdW5jdGlvbkFybjtcbiAgICB0aGlzLnJvbGVBcm4gPSBwcm9wcy5rdWJlY3RsUm9sZUFybjtcbiAgICB0aGlzLmhhbmRsZXJSb2xlID0gcHJvcHMuaGFuZGxlclJvbGU7XG4gIH1cbn1cbiJdfQ==