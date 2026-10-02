"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubectlProvider = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const lambda = require("aws-cdk-lib/aws-lambda");
const core_1 = require("aws-cdk-lib/core");
const cr = require("aws-cdk-lib/custom-resources");
const lambda_layer_awscli_1 = require("aws-cdk-lib/lambda-layer-awscli");
const constructs_1 = require("constructs");
const cluster_1 = require("./cluster");
/**
 * Implementation of Kubectl Lambda
 */
class KubectlProvider extends constructs_1.Construct {
    static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.KubectlProvider", version: "0.0.0" };
    /**
     * Take existing provider on cluster
     *
     * @param scope Construct
     * @param cluster k8s cluster
     */
    static getKubectlProvider(scope, cluster) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_ICluster(cluster);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getKubectlProvider);
            }
            throw error;
        }
        // if this is an "owned" cluster, we need to wait for the kubectl barrier
        // before applying any resources.
        if (cluster instanceof cluster_1.Cluster) {
            cluster._dependOnKubectlBarrier(scope);
        }
        return cluster.kubectlProvider;
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
            jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_KubectlProviderAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromKubectlProviderAttributes);
            }
            throw error;
        }
        class Import extends constructs_1.Construct {
            serviceToken = attrs.serviceToken;
            role = attrs.role;
        }
        return new Import(scope, id);
    }
    /**
     * The custom resource provider's service token.
     */
    serviceToken;
    /**
     * The IAM execution role of the handler.
     */
    role;
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_KubectlProviderProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KubectlProvider);
            }
            throw error;
        }
        const vpc = props.privateSubnets ? props.cluster.vpc : undefined;
        let securityGroups;
        if (props.privateSubnets && props.cluster.clusterSecurityGroup) {
            securityGroups = [props.cluster.clusterSecurityGroup];
        }
        const privateSubnets = props.privateSubnets ? { subnets: props.privateSubnets } : undefined;
        const handler = new lambda.Function(this, 'Handler', {
            timeout: core_1.Duration.minutes(15),
            description: 'onEvent handler for EKS kubectl resource provider',
            memorySize: props.memory?.toMebibytes() ?? 1024,
            environment: {
                // required and recommended for boto3
                AWS_STS_REGIONAL_ENDPOINTS: 'regional',
                ...props.environment,
            },
            role: props.role,
            code: lambda.Code.fromAsset(path.join(__dirname, 'kubectl-handler')),
            handler: 'index.handler',
            runtime: lambda.Runtime.determineLatestPythonRuntime(this),
            // defined only when using private access
            vpc,
            securityGroups,
            vpcSubnets: privateSubnets,
        });
        // allow user to customize the layers with the tools we need
        handler.addLayers(props.awscliLayer ?? new lambda_layer_awscli_1.AwsCliLayer(this, 'AwsCliLayer'));
        handler.addLayers(props.kubectlLayer);
        const handlerRole = handler.role;
        handlerRole.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['eks:DescribeCluster'],
            resources: [props.cluster.clusterArn],
        }));
        // taken from the lambda default role logic.
        // makes it easier for roles to be passed in.
        if (handler.isBoundToVpc) {
            handlerRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));
        }
        // For OCI helm chart authorization.
        handlerRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));
        /**
         * For OCI helm chart public ECR authorization. As ECR public is only available in `aws` partition,
         * we conditionally attach this policy when the AWS partition is `aws`.
         */
        const hasEcrPublicCondition = new core_1.CfnCondition(handlerRole.node.scope, 'HasEcrPublic', {
            expression: core_1.Fn.conditionEquals(core_1.Aws.PARTITION, 'aws'),
        });
        const conditionalPolicy = iam.ManagedPolicy.fromManagedPolicyArn(this, 'ConditionalPolicyArn', core_1.Fn.conditionIf(hasEcrPublicCondition.logicalId, iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonElasticContainerRegistryPublicReadOnly').managedPolicyArn, core_1.Aws.NO_VALUE).toString());
        handlerRole.addManagedPolicy(iam.ManagedPolicy.fromManagedPolicyArn(this, 'conditionalPolicy', conditionalPolicy.managedPolicyArn));
        const provider = new cr.Provider(this, 'Provider', {
            onEventHandler: handler,
            vpc: props.cluster.vpc,
            vpcSubnets: privateSubnets,
            securityGroups,
        });
        this.serviceToken = provider.serviceToken;
        this.role = handlerRole;
    }
}
exports.KubectlProvider = KubectlProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ViZWN0bC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImt1YmVjdGwtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2QkFBNkI7QUFFN0IsMkNBQTJDO0FBQzNDLGlEQUFpRDtBQUNqRCwyQ0FBeUU7QUFDekUsbURBQW1EO0FBQ25ELHlFQUE4RDtBQUM5RCwyQ0FBbUQ7QUFDbkQsdUNBQThDO0FBZ0c5Qzs7R0FFRztBQUNILE1BQWEsZUFBZ0IsU0FBUSxzQkFBUzs7SUFDNUM7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsS0FBZ0IsRUFBRSxPQUFpQjs7Ozs7Ozs7OztRQUNsRSx5RUFBeUU7UUFDekUsaUNBQWlDO1FBQ2pDLElBQUksT0FBTyxZQUFZLGlCQUFPLEVBQUUsQ0FBQztZQUMvQixPQUFPLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELE9BQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQztLQUNoQztJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFnQzs7Ozs7Ozs7OztRQUN4RyxNQUFNLE1BQU8sU0FBUSxzQkFBUztZQUNaLFlBQVksR0FBVyxLQUFLLENBQUMsWUFBWSxDQUFDO1lBQzFDLElBQUksR0FBZSxLQUFLLENBQUMsSUFBSSxDQUFDO1NBQy9DO1FBQ0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUFFRDs7T0FFRztJQUNhLFlBQVksQ0FBUztJQUVyQzs7T0FFRztJQUNhLElBQUksQ0FBYTtJQUVqQyxZQUFtQixLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEyQjtRQUMxRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBM0NSLGVBQWU7Ozs7UUE2Q3hCLE1BQU0sR0FBRyxHQUFHLEtB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LGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDLGdCQUFnQixFQUMzRyxVQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQzNCLENBQUM7UUFFRixXQUFXLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBRXBJLE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pELGNBQWMsRUFBRSxPQUFPO1lBQ3ZCLEdBQUcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUc7WUFDdEIsVUFBVSxFQUFFLGNBQWM7WUFDMUIsY0FBYztTQUNmLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUMxQyxJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztLQUN6Qjs7QUF0SEgsMENBdUhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IER1cmF0aW9uLCBDZm5Db25kaXRpb24sIEZuLCBBd3MsIFNpemUgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCAqIGFzIGNyIGZyb20gJ2F3cy1jZGstbGliL2N1c3RvbS1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQXdzQ2xpTGF5ZXIgfSBmcm9tICdhd3MtY2RrLWxpYi9sYW1iZGEtbGF5ZXItYXdzY2xpJztcbmltcG9ydCB7IENvbnN0cnVjdCwgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2x1c3RlciwgSUNsdXN0ZXIgfSBmcm9tICcuL2NsdXN0ZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIEt1YmVjdGxQcm92aWRlck9wdGlvbnMge1xuICAvKipcbiAgICogQW4gSUFNIHJvbGUgdGhhdCBjYW4gcGVyZm9ybSBrdWJlY3RsIG9wZXJhdGlvbnMgYWdhaW5zdCB0aGlzIGNsdXN0ZXIuXG4gICAqXG4gICAqIFRoZSByb2xlIHNob3VsZCBiZSBtYXBwZWQgdG8gdGhlIGBzeXN0ZW06bWFzdGVyc2AgS3ViZXJuZXRlcyBSQkFDIHJvbGUuXG4gICAqXG4gICAqIFRoaXMgcm9sZSBpcyBkaXJlY3RseSBwYXNzZWQgdG8gdGhlIGxhbWJkYSBoYW5kbGVyIHRoYXQgc2VuZHMgS3ViZSBDdGwgY29tbWFuZHMgdG8gdGhlIGNsdXN0ZXIuXG4gICAqIEBkZWZhdWx0IC0gaWYgbm90IHNwZWNpZmllZCwgdGhlIGRlZmF1bHQgcm9sZSBjcmVhdGVkIGJ5IGEgbGFtYmRhIGZ1bmN0aW9uIHdpbGxcbiAgICogYmUgdXNlZC5cbiAgICovXG4gIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIEFuIEFXUyBMYW1iZGEgbGF5ZXIgdGhhdCBjb250YWlucyB0aGUgYGF3c2AgQ0xJLlxuICAgKlxuICAgKiBJZiBub3QgZGVmaW5lZCwgYSBkZWZhdWx0IGxheWVyIHdpbGwgYmUgdXNlZCBjb250YWluaW5nIHRoZSBBV1MgQ0xJIDIueC5cbiAgICovXG4gIHJlYWRvbmx5IGF3c2NsaUxheWVyPzogbGFtYmRhLklMYXllclZlcnNpb247XG5cbiAgLyoqXG4gICAqXG4gICAqIEN1c3RvbSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgd2hlbiBydW5uaW5nIGBrdWJlY3RsYCBhZ2FpbnN0IHRoaXMgY2x1c3Rlci5cbiAgICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50PzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogQSBzZWN1cml0eSBncm91cCB0byB1c2UgZm9yIGBrdWJlY3RsYCBleGVjdXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSWYgbm90IHNwZWNpZmllZCwgdGhlIGs4cyBlbmRwb2ludCBpcyBleHBlY3RlZCB0byBiZSBhY2Nlc3NpYmxlXG4gICAqIHB1YmxpY2x5LlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cD86IGVjMi5JU2VjdXJpdHlHcm91cDtcblxuICAvKipcbiAgICogVGhlIGFtb3VudCBvZiBtZW1vcnkgYWxsb2NhdGVkIHRvIHRoZSBrdWJlY3RsIHByb3ZpZGVyJ3MgbGFtYmRhIGZ1bmN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgbWVtb3J5PzogU2l6ZTtcblxuICAvKipcbiAgICogQW4gQVdTIExhbWJkYSBsYXllciB0aGF0IGluY2x1ZGVzIGBrdWJlY3RsYCBhbmQgYGhlbG1gXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsTGF5ZXI6IGxhbWJkYS5JTGF5ZXJWZXJzaW9uO1xuXG4gIC8qKlxuICAgKiBTdWJuZXRzIHRvIGhvc3QgdGhlIGBrdWJlY3RsYCBjb21wdXRlIHJlc291cmNlcy4gSWYgbm90IHNwZWNpZmllZCwgdGhlIGs4c1xuICAgKiBlbmRwb2ludCBpcyBleHBlY3RlZCB0byBiZSBhY2Nlc3NpYmxlIHB1YmxpY2x5LlxuICAgKi9cbiAgcmVhZG9ubHkgcHJpdmF0ZVN1Ym5ldHM/OiBlYzIuSVN1Ym5ldFtdO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgS3ViZWN0bFByb3ZpZGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgS3ViZWN0bFByb3ZpZGVyUHJvcHMgZXh0ZW5kcyBLdWJlY3RsUHJvdmlkZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBjbHVzdGVyIHRvIGNvbnRyb2wuXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3Rlcjtcbn1cblxuLyoqXG4gKiBLdWJlY3RsIFByb3ZpZGVyIEF0dHJpYnV0ZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBLdWJlY3RsUHJvdmlkZXJBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBrdWJlY3RsIHByb3ZpZGVyIGxhbWJkYSBhcm5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VUb2tlbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSBvZiB0aGUgcHJvdmlkZXIgbGFtYmRhIGZ1bmN0aW9uLlxuICAgKiBPbmx5IHJlcXVpcmVkIGlmIHlvdSBkZXBsb3kgaGVsbSBjaGFydHMgdXNpbmcgdGhpcyBpbXBvcnRlZCBwcm92aWRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyByb2xlLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcbn1cblxuLyoqXG4gKiBJbXBvcnRlZCBLdWJlY3RsUHJvdmlkZXIgdGhhdCBjYW4gYmUgdXNlZCBpbiBwbGFjZSBvZiB0aGUgZGVmYXVsdCBvbmUgY3JlYXRlZCBieSBDREtcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJS3ViZWN0bFByb3ZpZGVyIGV4dGVuZHMgSUNvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBUaGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyJ3Mgc2VydmljZSB0b2tlbi5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VUb2tlbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSBvZiB0aGUgcHJvdmlkZXIgbGFtYmRhIGZ1bmN0aW9uLiBJZiB1bmRlZmluZWQsXG4gICAqIHlvdSBjYW5ub3QgdXNlIHRoaXMgcHJvdmlkZXIgdG8gZGVwbG95IGhlbG0gY2hhcnRzLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcbn1cblxuLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiBLdWJlY3RsIExhbWJkYVxuICovXG5leHBvcnQgY2xhc3MgS3ViZWN0bFByb3ZpZGVyIGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSUt1YmVjdGxQcm92aWRlciB7XG4gIC8qKlxuICAgKiBUYWtlIGV4aXN0aW5nIHByb3ZpZGVyIG9uIGNsdXN0ZXJcbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIENvbnN0cnVjdFxuICAgKiBAcGFyYW0gY2x1c3RlciBrOHMgY2x1c3RlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXRLdWJlY3RsUHJvdmlkZXIoc2NvcGU6IENvbnN0cnVjdCwgY2x1c3RlcjogSUNsdXN0ZXIpIHtcbiAgICAvLyBpZiB0aGlzIGlzIGFuIFwib3duZWRcIiBjbHVzdGVyLCB3ZSBuZWVkIHRvIHdhaXQgZm9yIHRoZSBrdWJlY3RsIGJhcnJpZXJcbiAgICAvLyBiZWZvcmUgYXBwbHlpbmcgYW55IHJlc291cmNlcy5cbiAgICBpZiAoY2x1c3RlciBpbnN0YW5jZW9mIENsdXN0ZXIpIHtcbiAgICAgIGNsdXN0ZXIuX2RlcGVuZE9uS3ViZWN0bEJhcnJpZXIoc2NvcGUpO1xuICAgIH1cblxuICAgIHJldHVybiBjbHVzdGVyLmt1YmVjdGxQcm92aWRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgcHJvdmlkZXJcbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIENvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgYW4gaWQgb2YgcmVzb3VyY2VcbiAgICogQHBhcmFtIGF0dHJzIGF0dHJpYnV0ZXMgZm9yIHRoZSBwcm92aWRlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tS3ViZWN0bFByb3ZpZGVyQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogS3ViZWN0bFByb3ZpZGVyQXR0cmlidXRlcyk6IElLdWJlY3RsUHJvdmlkZXIge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIENvbnN0cnVjdCBpbXBsZW1lbnRzIElLdWJlY3RsUHJvdmlkZXIge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2VUb2tlbjogc3RyaW5nID0gYXR0cnMuc2VydmljZVRva2VuO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGUgPSBhdHRycy5yb2xlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjdXN0b20gcmVzb3VyY2UgcHJvdmlkZXIncyBzZXJ2aWNlIHRva2VuLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2VUb2tlbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIGV4ZWN1dGlvbiByb2xlIG9mIHRoZSBoYW5kbGVyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBLdWJlY3RsUHJvdmlkZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCB2cGMgPSBwcm9wcy5wcml2YXRlU3VibmV0cyA/IHByb3BzLmNsdXN0ZXIudnBjIDogdW5kZWZpbmVkO1xuICAgIGxldCBzZWN1cml0eUdyb3VwcztcbiAgICBpZiAocHJvcHMucHJpdmF0ZVN1Ym5ldHMgJiYgcHJvcHMuY2x1c3Rlci5jbHVzdGVyU2VjdXJpdHlHcm91cCkge1xuICAgICAgc2VjdXJpdHlHcm91cHMgPSBbcHJvcHMuY2x1c3Rlci5jbHVzdGVyU2VjdXJpdHlHcm91cF07XG4gICAgfVxuICAgIGNvbnN0IHByaXZhdGVTdWJuZXRzID0gcHJvcHMucHJpdmF0ZVN1Ym5ldHMgPyB7IHN1Ym5ldHM6IHByb3BzLnByaXZhdGVTdWJuZXRzIH0gOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnSGFuZGxlcicsIHtcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoMTUpLFxuICAgICAgZGVzY3JpcHRpb246ICdvbkV2ZW50IGhhbmRsZXIgZm9yIEVLUyBrdWJlY3RsIHJlc291cmNlIHByb3ZpZGVyJyxcbiAgICAgIG1lbW9yeVNpemU6IHByb3BzLm1lbW9yeT8udG9NZWJpYnl0ZXMoKSA/PyAxMDI0LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgLy8gcmVxdWlyZWQgYW5kIHJlY29tbWVuZGVkIGZvciBib3RvM1xuICAgICAgICBBV1NfU1RTX1JFR0lPTkFMX0VORFBPSU5UUzogJ3JlZ2lvbmFsJyxcbiAgICAgICAgLi4ucHJvcHMuZW52aXJvbm1lbnQsXG4gICAgICB9LFxuICAgICAgcm9sZTogcHJvcHMucm9sZSxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAna3ViZWN0bC1oYW5kbGVyJykpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuZGV0ZXJtaW5lTGF0ZXN0UHl0aG9uUnVudGltZSh0aGlzKSxcbiAgICAgIC8vIGRlZmluZWQgb25seSB3aGVuIHVzaW5nIHByaXZhdGUgYWNjZXNzXG4gICAgICB2cGMsXG4gICAgICBzZWN1cml0eUdyb3VwcyxcbiAgICAgIHZwY1N1Ym5ldHM6IHByaXZhdGVTdWJuZXRzLFxuICAgIH0pO1xuXG4gICAgLy8gYWxsb3cgdXNlciB0byBjdXN0b21pemUgdGhlIGxheWVycyB3aXRoIHRoZSB0b29scyB3ZSBuZWVkXG4gICAgaGFuZGxlci5hZGRMYXllcnMocHJvcHMuYXdzY2xpTGF5ZXIgPz8gbmV3IEF3c0NsaUxheWVyKHRoaXMsICdBd3NDbGlMYXllcicpKTtcbiAgICBoYW5kbGVyLmFkZExheWVycyhwcm9wcy5rdWJlY3RsTGF5ZXIpO1xuXG4gICAgY29uc3QgaGFuZGxlclJvbGUgPSBoYW5kbGVyLnJvbGUhO1xuXG4gICAgaGFuZGxlclJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydla3M6RGVzY3JpYmVDbHVzdGVyJ10sXG4gICAgICByZXNvdXJjZXM6IFtwcm9wcy5jbHVzdGVyLmNsdXN0ZXJBcm5dLFxuICAgIH0pKTtcblxuICAgIC8vIHRha2VuIGZyb20gdGhlIGxhbWJkYSBkZWZhdWx0IHJvbGUgbG9naWMuXG4gICAgLy8gbWFrZXMgaXQgZWFzaWVyIGZvciByb2xlcyB0byBiZSBwYXNzZWQgaW4uXG4gICAgaWYgKGhhbmRsZXIuaXNCb3VuZFRvVnBjKSB7XG4gICAgICBoYW5kbGVyUm9sZS5hZGRNYW5hZ2VkUG9saWN5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL0FXU0xhbWJkYVZQQ0FjY2Vzc0V4ZWN1dGlvblJvbGUnKSk7XG4gICAgfVxuXG4gICAgLy8gRm9yIE9DSSBoZWxtIGNoYXJ0IGF1dGhvcml6YXRpb24uXG4gICAgaGFuZGxlclJvbGUuYWRkTWFuYWdlZFBvbGljeShcbiAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uRUMyQ29udGFpbmVyUmVnaXN0cnlSZWFkT25seScpLFxuICAgICk7XG5cbiAgICAvKipcbiAgICAgKiBGb3IgT0NJIGhlbG0gY2hhcnQgcHVibGljIEVDUiBhdXRob3JpemF0aW9uLiBBcyBFQ1IgcHVibGljIGlzIG9ubHkgYXZhaWxhYmxlIGluIGBhd3NgIHBhcnRpdGlvbixcbiAgICAgKiB3ZSBjb25kaXRpb25hbGx5IGF0dGFjaCB0aGlzIHBvbGljeSB3aGVuIHRoZSBBV1MgcGFydGl0aW9uIGlzIGBhd3NgLlxuICAgICAqL1xuICAgIGNvbnN0IGhhc0VjclB1YmxpY0NvbmRpdGlvbiA9IG5ldyBDZm5Db25kaXRpb24oaGFuZGxlclJvbGUubm9kZS5zY29wZSEsICdIYXNFY3JQdWJsaWMnLCB7XG4gICAgICBleHByZXNzaW9uOiBGbi5jb25kaXRpb25FcXVhbHMoQXdzLlBBUlRJVElPTiwgJ2F3cycpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY29uZGl0aW9uYWxQb2xpY3kgPSBpYW0uTWFuYWdlZFBvbGljeS5mcm9tTWFuYWdlZFBvbGljeUFybih0aGlzLCAnQ29uZGl0aW9uYWxQb2xpY3lBcm4nLFxuICAgICAgRm4uY29uZGl0aW9uSWYoaGFzRWNyUHVibGljQ29uZGl0aW9uLmxvZ2ljYWxJZCxcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FbGFzdGljQ29udGFpbmVyUmVnaXN0cnlQdWJsaWNSZWFkT25seScpLm1hbmFnZWRQb2xpY3lBcm4sXG4gICAgICAgIEF3cy5OT19WQUxVRSkudG9TdHJpbmcoKSxcbiAgICApO1xuXG4gICAgaGFuZGxlclJvbGUuYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tTWFuYWdlZFBvbGljeUFybih0aGlzLCAnY29uZGl0aW9uYWxQb2xpY3knLCBjb25kaXRpb25hbFBvbGljeS5tYW5hZ2VkUG9saWN5QXJuKSk7XG5cbiAgICBjb25zdCBwcm92aWRlciA9IG5ldyBjci5Qcm92aWRlcih0aGlzLCAnUHJvdmlkZXInLCB7XG4gICAgICBvbkV2ZW50SGFuZGxlcjogaGFuZGxlcixcbiAgICAgIHZwYzogcHJvcHMuY2x1c3Rlci52cGMsXG4gICAgICB2cGNTdWJuZXRzOiBwcml2YXRlU3VibmV0cyxcbiAgICAgIHNlY3VyaXR5R3JvdXBzLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXJ2aWNlVG9rZW4gPSBwcm92aWRlci5zZXJ2aWNlVG9rZW47XG4gICAgdGhpcy5yb2xlID0gaGFuZGxlclJvbGU7XG4gIH1cbn1cbiJdfQ==