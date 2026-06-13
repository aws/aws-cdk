"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbController = exports.AlbScheme = exports.AlbControllerVersion = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const constructs_1 = require("constructs");
const helm_chart_1 = require("./helm-chart");
const service_account_1 = require("./service-account");
// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
const core_1 = require("aws-cdk-lib/core");
/**
 * Controller version.
 *
 * Corresponds to the image tag of 'amazon/aws-load-balancer-controller' image.
 */
class AlbControllerVersion {
    version;
    helmChartVersion;
    custom;
    static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.AlbControllerVersion", version: "0.0.0" };
    /**
     * v2.0.0
     */
    static V2_0_0 = new AlbControllerVersion('v2.0.0', '1.4.1', false);
    /**
     * v2.0.1
     */
    static V2_0_1 = new AlbControllerVersion('v2.0.1', '1.4.1', false);
    /**
     * v2.1.0
     */
    static V2_1_0 = new AlbControllerVersion('v2.1.0', '1.4.1', false);
    /**
     * v2.1.1
     */
    static V2_1_1 = new AlbControllerVersion('v2.1.1', '1.4.1', false);
    /**
     * v2.1.2
     */
    static V2_1_2 = new AlbControllerVersion('v2.1.2', '1.4.1', false);
    /**
     * v2.1.3
     */
    static V2_1_3 = new AlbControllerVersion('v2.1.3', '1.4.1', false);
    /**
     * v2.0.0
     */
    static V2_2_0 = new AlbControllerVersion('v2.2.0', '1.4.1', false);
    /**
     * v2.2.1
     */
    static V2_2_1 = new AlbControllerVersion('v2.2.1', '1.4.1', false);
    /**
     * v2.2.2
     */
    static V2_2_2 = new AlbControllerVersion('v2.2.2', '1.4.1', false);
    /**
     * v2.2.3
     */
    static V2_2_3 = new AlbControllerVersion('v2.2.3', '1.4.1', false);
    /**
     * v2.2.4
     */
    static V2_2_4 = new AlbControllerVersion('v2.2.4', '1.4.1', false);
    /**
     * v2.3.0
     */
    static V2_3_0 = new AlbControllerVersion('v2.3.0', '1.4.1', false);
    /**
     * v2.3.1
     */
    static V2_3_1 = new AlbControllerVersion('v2.3.1', '1.4.1', false);
    /**
     * v2.4.1
     */
    static V2_4_1 = new AlbControllerVersion('v2.4.1', '1.4.1', false);
    /**
     * v2.4.2
     */
    static V2_4_2 = new AlbControllerVersion('v2.4.2', '1.4.3', false);
    /**
     * v2.4.3
     */
    static V2_4_3 = new AlbControllerVersion('v2.4.3', '1.4.4', false);
    /**
     * v2.4.4
     */
    static V2_4_4 = new AlbControllerVersion('v2.4.4', '1.4.5', false);
    /**
     * v2.4.5
     */
    static V2_4_5 = new AlbControllerVersion('v2.4.5', '1.4.6', false);
    /**
     * v2.4.6
     */
    static V2_4_6 = new AlbControllerVersion('v2.4.6', '1.4.7', false);
    /**
     * v2.4.7
     */
    static V2_4_7 = new AlbControllerVersion('v2.4.7', '1.4.8', false);
    /**
     * v2.5.0
     */
    static V2_5_0 = new AlbControllerVersion('v2.5.0', '1.5.0', false);
    /**
     * v2.5.1
     */
    static V2_5_1 = new AlbControllerVersion('v2.5.1', '1.5.2', false);
    /**
     * v2.5.2
     */
    static V2_5_2 = new AlbControllerVersion('v2.5.2', '1.5.3', false);
    /**
     * v2.5.3
     */
    static V2_5_3 = new AlbControllerVersion('v2.5.3', '1.5.4', false);
    /**
     * v2.5.4
     */
    static V2_5_4 = new AlbControllerVersion('v2.5.4', '1.5.5', false);
    /**
     * v2.6.0
     */
    static V2_6_0 = new AlbControllerVersion('v2.6.0', '1.6.0', false);
    /**
     * v2.6.1
     */
    static V2_6_1 = new AlbControllerVersion('v2.6.1', '1.6.1', false);
    /**
     * v2.6.2
     */
    static V2_6_2 = new AlbControllerVersion('v2.6.2', '1.6.2', false);
    /**
     * v2.7.0
     */
    static V2_7_0 = new AlbControllerVersion('v2.7.0', '1.7.0', false);
    /**
     * v2.7.1
     */
    static V2_7_1 = new AlbControllerVersion('v2.7.1', '1.7.1', false);
    /**
     * v2.7.2
     */
    static V2_7_2 = new AlbControllerVersion('v2.7.2', '1.7.2', false);
    /**
     * v2.8.0
     */
    static V2_8_0 = new AlbControllerVersion('v2.8.0', '1.8.0', false);
    /**
     * v2.8.1
     */
    static V2_8_1 = new AlbControllerVersion('v2.8.1', '1.8.1', false);
    /**
     * v2.8.2
     */
    static V2_8_2 = new AlbControllerVersion('v2.8.2', '1.8.2', false);
    /**
     * Specify a custom version and an associated helm chart version.
     * Use this if the version you need is not available in one of the predefined versions.
     * Note that in this case, you will also need to provide an IAM policy in the controller options.
     *
     * ALB controller version and helm chart version compatibility information can be found
     * here: https://github.com/aws/eks-charts/blob/v0.0.133/stable/aws-load-balancer-controller/Chart.yaml
     *
     * @param version The version number.
     * @param helmChartVersion The version of the helm chart. Version 1.4.1 is the default version to support legacy
     * users.
     */
    static of(version, helmChartVersion = '1.4.1') {
        return new AlbControllerVersion(version, helmChartVersion, true);
    }
    constructor(
    /**
     * The version string.
     */
    version, 
    /**
     * The version of the helm chart to use.
     */
    helmChartVersion, 
    /**
     * Whether or not its a custom version.
     */
    custom) {
        this.version = version;
        this.helmChartVersion = helmChartVersion;
        this.custom = custom;
    }
}
exports.AlbControllerVersion = AlbControllerVersion;
/**
 * ALB Scheme.
 *
 * @see https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.3/guide/ingress/annotations/#scheme
 */
var AlbScheme;
(function (AlbScheme) {
    /**
     * The nodes of an internal load balancer have only private IP addresses.
     * The DNS name of an internal load balancer is publicly resolvable to the private IP addresses of the nodes.
     * Therefore, internal load balancers can only route requests from clients with access to the VPC for the load balancer.
     */
    AlbScheme["INTERNAL"] = "internal";
    /**
     * An internet-facing load balancer has a publicly resolvable DNS name, so it can route requests from clients over the internet
     * to the EC2 instances that are registered with the load balancer.
     */
    AlbScheme["INTERNET_FACING"] = "internet-facing";
})(AlbScheme || (exports.AlbScheme = AlbScheme = {}));
/**
 * Construct for installing the AWS ALB Contoller on EKS clusters.
 *
 * Use the factory functions `get` and `getOrCreate` to obtain/create instances of this controller.
 *
 * @see https://kubernetes-sigs.github.io/aws-load-balancer-controller
 *
 */
class AlbController extends constructs_1.Construct {
    static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.AlbController", version: "0.0.0" };
    /**
     * Create the controller construct associated with this cluster and scope.
     *
     * Singleton per stack/cluster.
     */
    static create(scope, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_AlbControllerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.create);
            }
            throw error;
        }
        const stack = core_1.Stack.of(scope);
        const uid = AlbController.uid(props.cluster);
        return new AlbController(stack, uid, props);
    }
    static uid(cluster) {
        return `${core_1.Names.nodeUniqueId(cluster.node)}-AlbController`;
    }
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_AlbControllerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AlbController);
            }
            throw error;
        }
        const namespace = 'kube-system';
        const serviceAccount = new service_account_1.ServiceAccount(this, 'alb-sa', { namespace, name: 'aws-load-balancer-controller', cluster: props.cluster });
        if (props.version.custom && !props.policy) {
            throw new Error("'albControllerOptions.policy' is required when using a custom controller version");
        }
        // https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/deploy/installation/#iam-permissions
        const policy = props.policy ?? JSON.parse(fs.readFileSync(path.join(__dirname, 'addons', `alb-iam_policy-${props.version.version}.json`), 'utf8'));
        for (const statement of policy.Statement) {
            const rewrittenStatement = {
                ...statement,
                Resource: this.rewritePolicyResources(statement.Resource),
            };
            serviceAccount.addToPrincipalPolicy(iam.PolicyStatement.fromJson(rewrittenStatement));
        }
        // https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/deploy/installation/#add-controller-to-cluster
        const chart = new helm_chart_1.HelmChart(this, 'Resource', {
            cluster: props.cluster,
            chart: 'aws-load-balancer-controller',
            repository: 'https://aws.github.io/eks-charts',
            namespace,
            release: 'aws-load-balancer-controller',
            version: props.version.helmChartVersion,
            wait: true,
            timeout: core_1.Duration.minutes(15),
            values: {
                clusterName: props.cluster.clusterName,
                serviceAccount: {
                    create: false,
                    name: serviceAccount.serviceAccountName,
                },
                region: core_1.Stack.of(this).region,
                vpcId: props.cluster.vpc.vpcId,
                image: {
                    repository: props.repository ?? '602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon/aws-load-balancer-controller',
                    tag: props.version.version,
                },
            },
        });
        // the controller relies on permissions deployed using these resources.
        chart.node.addDependency(serviceAccount);
        chart.node.addDependency(props.cluster.openIdConnectProvider);
    }
    rewritePolicyResources(resources) {
        // This is safe to disable because we're actually replacing the literal partition with a reference to
        // the stack partition (which is hardcoded into the JSON files) to prevent issues such as
        // aws/aws-cdk#22520.
        // eslint-disable-next-line @cdklabs/no-literal-partition
        const rewriteResource = (s) => s.replace('arn:aws:', `arn:${core_1.Aws.PARTITION}:`);
        if (!resources) {
            return resources;
        }
        if (!Array.isArray(resources)) {
            return rewriteResource(resources);
        }
        return resources.map(rewriteResource);
    }
}
exports.AlbController = AlbController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxiLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbGItY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLDJDQUF1QztBQUV2Qyw2Q0FBeUM7QUFDekMsdURBQW1EO0FBRW5ELGdIQUFnSDtBQUNoSCwyQkFBMkI7QUFDM0IsMkNBQStEO0FBRS9EOzs7O0dBSUc7QUFDSCxNQUFhLG9CQUFvQjtJQStMYjtJQUlBO0lBSUE7O0lBdE1sQjs7T0FFRztJQUNJLE1BQU0sQ0FBVSxNQUFNLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRW5GOztPQUVHO0lBQ0ksTUFBTSxDQUFVLE1BQU0sR0FBRyxJQUFJLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFbkY7O09BRUc7SUFDSSxNQUFNLENBQVUsTUFBTSxHQUFHLElBQUksb0JBQW9CLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVuRjs7T0FFRztJQUNJLE1BQU0sQ0FBVSxNQUFNLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRW5GOztPQUVHO0lBQ0ksTUFBTSxDQUFVLE1BQU0sR0FBRyxJQUFJLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFbkY7O09BRUc7SUFDSSxNQUFNLENBQVUsTUFBTSxHQUFHLElBQUksb0JBQW9CLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVuRjs7T0FFRztJQUNJLE1BQU0sQ0FBVSxNQUFNLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxD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QUUsY0FBYyxDQUFDLGtCQUFrQjtpQkFDeEM7Z0JBQ0QsTUFBTSxFQUFFLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTTtnQkFDN0IsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7Z0JBQzlCLEtBQUssRUFBRTtvQkFDTCxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsSUFBSSxrRkFBa0Y7b0JBQ2xILEdBQUcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU87aUJBQzNCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCx1RUFBdUU7UUFDdkUsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDekMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0tBQy9EO0lBRU8sc0JBQXNCLENBQUMsU0FBd0M7UUFDckUscUdBQXFHO1FBQ3JHLHlGQUF5RjtRQUN6RixxQkFBcUI7UUFDckIseURBQXlEO1FBQ3pELE1BQU0sZUFBZSxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLFVBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRXRGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNmLE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQzlCLE9BQU8sZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDdkM7O0FBbEZILHNDQW1GQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENsdXN0ZXIgfSBmcm9tICcuL2NsdXN0ZXInO1xuaW1wb3J0IHsgSGVsbUNoYXJ0IH0gZnJvbSAnLi9oZWxtLWNoYXJ0JztcbmltcG9ydCB7IFNlcnZpY2VBY2NvdW50IH0gZnJvbSAnLi9zZXJ2aWNlLWFjY291bnQnO1xuXG4vLyB2MiAtIGtlZXAgdGhpcyBpbXBvcnQgYXMgYSBzZXBhcmF0ZSBzZWN0aW9uIHRvIHJlZHVjZSBtZXJnZSBjb25mbGljdCB3aGVuIGZvcndhcmQgbWVyZ2luZyB3aXRoIHRoZSB2MiBicmFuY2guXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmltcG9ydCB7IEF3cywgRHVyYXRpb24sIE5hbWVzLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuXG4vKipcbiAqIENvbnRyb2xsZXIgdmVyc2lvbi5cbiAqXG4gKiBDb3JyZXNwb25kcyB0byB0aGUgaW1hZ2UgdGFnIG9mICdhbWF6b24vYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlcicgaW1hZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbGJDb250cm9sbGVyVmVyc2lvbiB7XG4gIC8qKlxuICAgKiB2Mi4wLjBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfMF8wID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi4wLjAnLCAnMS40LjEnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjAuMVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl8wXzEgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjAuMScsICcxLjQuMScsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuMS4wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzFfMCA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuMS4wJywgJzEuNC4xJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi4xLjFcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfMV8xID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi4xLjEnLCAnMS40LjEnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjEuMlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl8xXzIgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjEuMicsICcxLjQuMScsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuMS4zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzFfMyA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuMS4zJywgJzEuNC4xJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi4wLjBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfMl8wID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi4yLjAnLCAnMS40LjEnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjIuMVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl8yXzEgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjIuMScsICcxLjQuMScsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuMi4yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzJfMiA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuMi4yJywgJzEuNC4xJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi4yLjNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfMl8zID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi4yLjMnLCAnMS40LjEnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjIuNFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl8yXzQgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjIuNCcsICcxLjQuMScsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuMy4wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzNfMCA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuMy4wJywgJzEuNC4xJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi4zLjFcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfM18xID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi4zLjEnLCAnMS40LjEnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjQuMVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl80XzEgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjQuMScsICcxLjQuMScsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuNC4yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzRfMiA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuNC4yJywgJzEuNC4zJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi40LjNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfNF8zID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi40LjMnLCAnMS40LjQnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjQuNFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl80XzQgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjQuNCcsICcxLjQuNScsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuNC41XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzRfNSA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuNC41JywgJzEuNC42JywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi40LjZcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfNF82ID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi40LjYnLCAnMS40LjcnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjQuN1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl80XzcgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjQuNycsICcxLjQuOCcsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuNS4wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzVfMCA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuNS4wJywgJzEuNS4wJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi41LjFcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfNV8xID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi41LjEnLCAnMS41LjInLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjUuMlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl81XzIgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjUuMicsICcxLjUuMycsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuNS4zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzVfMyA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuNS4zJywgJzEuNS40JywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi41LjRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfNV80ID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi41LjQnLCAnMS41LjUnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjYuMFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl82XzAgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjYuMCcsICcxLjYuMCcsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuNi4xXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzZfMSA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuNi4xJywgJzEuNi4xJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi42LjJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfNl8yID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi42LjInLCAnMS42LjInLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjcuMFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl83XzAgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjcuMCcsICcxLjcuMCcsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuNy4xXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzdfMSA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuNy4xJywgJzEuNy4xJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi43LjJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfN18yID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi43LjInLCAnMS43LjInLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjguMFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl84XzAgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjguMCcsICcxLjguMCcsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuOC4xXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzhfMSA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuOC4xJywgJzEuOC4xJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi44LjJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfOF8yID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi44LjInLCAnMS44LjInLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgYSBjdXN0b20gdmVyc2lvbiBhbmQgYW4gYXNzb2NpYXRlZCBoZWxtIGNoYXJ0IHZlcnNpb24uXG4gICAqIFVzZSB0aGlzIGlmIHRoZSB2ZXJzaW9uIHlvdSBuZWVkIGlzIG5vdCBhdmFpbGFibGUgaW4gb25lIG9mIHRoZSBwcmVkZWZpbmVkIHZlcnNpb25zLlxuICAgKiBOb3RlIHRoYXQgaW4gdGhpcyBjYXNlLCB5b3Ugd2lsbCBhbHNvIG5lZWQgdG8gcHJvdmlkZSBhbiBJQU0gcG9saWN5IGluIHRoZSBjb250cm9sbGVyIG9wdGlvbnMuXG4gICAqXG4gICAqIEFMQiBjb250cm9sbGVyIHZlcnNpb24gYW5kIGhlbG0gY2hhcnQgdmVyc2lvbiBjb21wYXRpYmlsaXR5IGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZFxuICAgKiBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2Vrcy1jaGFydHMvYmxvYi92MC4wLjEzMy9zdGFibGUvYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlci9DaGFydC55YW1sXG4gICAqXG4gICAqIEBwYXJhbSB2ZXJzaW9uIFRoZSB2ZXJzaW9uIG51bWJlci5cbiAgICogQHBhcmFtIGhlbG1DaGFydFZlcnNpb24gVGhlIHZlcnNpb24gb2YgdGhlIGhlbG0gY2hhcnQuIFZlcnNpb24gMS40LjEgaXMgdGhlIGRlZmF1bHQgdmVyc2lvbiB0byBzdXBwb3J0IGxlZ2FjeVxuICAgKiB1c2Vycy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2YodmVyc2lvbjogc3RyaW5nLCBoZWxtQ2hhcnRWZXJzaW9uOiBzdHJpbmcgPSAnMS40LjEnKSB7XG4gICAgcmV0dXJuIG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbih2ZXJzaW9uLCBoZWxtQ2hhcnRWZXJzaW9uLCB0cnVlKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgLyoqXG4gICAgICogVGhlIHZlcnNpb24gc3RyaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmcsXG4gICAgLyoqXG4gICAgICogVGhlIHZlcnNpb24gb2YgdGhlIGhlbG0gY2hhcnQgdG8gdXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBoZWxtQ2hhcnRWZXJzaW9uOiBzdHJpbmcsXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgaXRzIGEgY3VzdG9tIHZlcnNpb24uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGN1c3RvbTogYm9vbGVhbikgeyB9XG59XG5cbi8qKlxuICogQUxCIFNjaGVtZS5cbiAqXG4gKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy1zaWdzLmdpdGh1Yi5pby9hd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyL3YyLjMvZ3VpZGUvaW5ncmVzcy9hbm5vdGF0aW9ucy8jc2NoZW1lXG4gKi9cbmV4cG9ydCBlbnVtIEFsYlNjaGVtZSB7XG5cbiAgLyoqXG4gICAqIFRoZSBub2RlcyBvZiBhbiBpbnRlcm5hbCBsb2FkIGJhbGFuY2VyIGhhdmUgb25seSBwcml2YXRlIElQIGFkZHJlc3Nlcy5cbiAgICogVGhlIEROUyBuYW1lIG9mIGFuIGludGVybmFsIGxvYWQgYmFsYW5jZXIgaXMgcHVibGljbHkgcmVzb2x2YWJsZSB0byB0aGUgcHJpdmF0ZSBJUCBhZGRyZXNzZXMgb2YgdGhlIG5vZGVzLlxuICAgKiBUaGVyZWZvcmUsIGludGVybmFsIGxvYWQgYmFsYW5jZXJzIGNhbiBvbmx5IHJvdXRlIHJlcXVlc3RzIGZyb20gY2xpZW50cyB3aXRoIGFjY2VzcyB0byB0aGUgVlBDIGZvciB0aGUgbG9hZCBiYWxhbmNlci5cbiAgICovXG4gIElOVEVSTkFMID0gJ2ludGVybmFsJyxcblxuICAvKipcbiAgICogQW4gaW50ZXJuZXQtZmFjaW5nIGxvYWQgYmFsYW5jZXIgaGFzIGEgcHVibGljbHkgcmVzb2x2YWJsZSBETlMgbmFtZSwgc28gaXQgY2FuIHJvdXRlIHJlcXVlc3RzIGZyb20gY2xpZW50cyBvdmVyIHRoZSBpbnRlcm5ldFxuICAgKiB0byB0aGUgRUMyIGluc3RhbmNlcyB0aGF0IGFyZSByZWdpc3RlcmVkIHdpdGggdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqL1xuICBJTlRFUk5FVF9GQUNJTkcgPSAnaW50ZXJuZXQtZmFjaW5nJyxcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBgQWxiQ29udHJvbGxlcmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWxiQ29udHJvbGxlck9wdGlvbnMge1xuXG4gIC8qKlxuICAgKiBWZXJzaW9uIG9mIHRoZSBjb250cm9sbGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbjogQWxiQ29udHJvbGxlclZlcnNpb247XG5cbiAgLyoqXG4gICAqIFRoZSByZXBvc2l0b3J5IHRvIHB1bGwgdGhlIGNvbnRyb2xsZXIgaW1hZ2UgZnJvbS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBkZWZhdWx0IHJlcG9zaXRvcnkgd29ya3MgZm9yIG1vc3QgcmVnaW9ucywgYnV0IG5vdCBhbGwuXG4gICAqIElmIHRoZSByZXBvc2l0b3J5IGlzIG5vdCBhcHBsaWNhYmxlIHRvIHlvdXIgcmVnaW9uLCB1c2UgYSBjdXN0b20gcmVwb3NpdG9yeVxuICAgKiBhY2NvcmRpbmcgdG8gdGhlIGluZm9ybWF0aW9uIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9rdWJlcm5ldGVzLXNpZ3MvYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlci9yZWxlYXNlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgJzYwMjQwMTE0MzQ1Mi5ka3IuZWNyLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tL2FtYXpvbi9hd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyJ1xuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3NpdG9yeT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElBTSBwb2xpY3kgdG8gYXBwbHkgdG8gdGhlIHNlcnZpY2UgYWNjb3VudC5cbiAgICpcbiAgICogSWYgeW91J3JlIHVzaW5nIG9uZSBvZiB0aGUgYnVpbHQtaW4gdmVyc2lvbnMsIHRoaXMgaXMgbm90IHJlcXVpcmVkIHNpbmNlXG4gICAqIENESyBzaGlwcyB3aXRoIHRoZSBhcHByb3ByaWF0ZSBwb2xpY2llcyBmb3IgdGhvc2UgdmVyc2lvbnMuXG4gICAqXG4gICAqIEhvd2V2ZXIsIGlmIHlvdSBhcmUgdXNpbmcgYSBjdXN0b20gdmVyc2lvbiwgdGhpcyBpcyByZXF1aXJlZCAoYW5kIHZhbGlkYXRlZCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQ29ycmVzcG9uZHMgdG8gdGhlIHByZWRlZmluZWQgdmVyc2lvbi5cbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeT86IGFueTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBgQWxiQ29udHJvbGxlcmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWxiQ29udHJvbGxlclByb3BzIGV4dGVuZHMgQWxiQ29udHJvbGxlck9wdGlvbnMge1xuXG4gIC8qKlxuICAgKiBbZGlzYWJsZS1hd3NsaW50OnJlZi12aWEtaW50ZXJmYWNlXVxuICAgKiBDbHVzdGVyIHRvIGluc3RhbGwgdGhlIGNvbnRyb2xsZXIgb250by5cbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXI6IENsdXN0ZXI7XG59XG5cbi8qKlxuICogQ29uc3RydWN0IGZvciBpbnN0YWxsaW5nIHRoZSBBV1MgQUxCIENvbnRvbGxlciBvbiBFS1MgY2x1c3RlcnMuXG4gKlxuICogVXNlIHRoZSBmYWN0b3J5IGZ1bmN0aW9ucyBgZ2V0YCBhbmQgYGdldE9yQ3JlYXRlYCB0byBvYnRhaW4vY3JlYXRlIGluc3RhbmNlcyBvZiB0aGlzIGNvbnRyb2xsZXIuXG4gKlxuICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMtc2lncy5naXRodWIuaW8vYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlclxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIEFsYkNvbnRyb2xsZXIgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAvKipcbiAgICogQ3JlYXRlIHRoZSBjb250cm9sbGVyIGNvbnN0cnVjdCBhc3NvY2lhdGVkIHdpdGggdGhpcyBjbHVzdGVyIGFuZCBzY29wZS5cbiAgICpcbiAgICogU2luZ2xldG9uIHBlciBzdGFjay9jbHVzdGVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjcmVhdGUoc2NvcGU6IENvbnN0cnVjdCwgcHJvcHM6IEFsYkNvbnRyb2xsZXJQcm9wcykge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IHVpZCA9IEFsYkNvbnRyb2xsZXIudWlkKHByb3BzLmNsdXN0ZXIpO1xuICAgIHJldHVybiBuZXcgQWxiQ29udHJvbGxlcihzdGFjaywgdWlkLCBwcm9wcyk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyB1aWQoY2x1c3RlcjogQ2x1c3Rlcikge1xuICAgIHJldHVybiBgJHtOYW1lcy5ub2RlVW5pcXVlSWQoY2x1c3Rlci5ub2RlKX0tQWxiQ29udHJvbGxlcmA7XG4gIH1cblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFsYkNvbnRyb2xsZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSAna3ViZS1zeXN0ZW0nO1xuICAgIGNvbnN0IHNlcnZpY2VBY2NvdW50ID0gbmV3IFNlcnZpY2VBY2NvdW50KHRoaXMsICdhbGItc2EnLCB7IG5hbWVzcGFjZSwgbmFtZTogJ2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXInLCBjbHVzdGVyOiBwcm9wcy5jbHVzdGVyIH0pO1xuXG4gICAgaWYgKHByb3BzLnZlcnNpb24uY3VzdG9tICYmICFwcm9wcy5wb2xpY3kpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIidhbGJDb250cm9sbGVyT3B0aW9ucy5wb2xpY3knIGlzIHJlcXVpcmVkIHdoZW4gdXNpbmcgYSBjdXN0b20gY29udHJvbGxlciB2ZXJzaW9uXCIpO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8va3ViZXJuZXRlcy1zaWdzLmdpdGh1Yi5pby9hd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyL3YyLjIvZGVwbG95L2luc3RhbGxhdGlvbi8jaWFtLXBlcm1pc3Npb25zXG4gICAgY29uc3QgcG9saWN5OiBhbnkgPSBwcm9wcy5wb2xpY3kgPz8gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJ2FkZG9ucycsIGBhbGItaWFtX3BvbGljeS0ke3Byb3BzLnZlcnNpb24udmVyc2lvbn0uanNvbmApLCAndXRmOCcpKTtcblxuICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHBvbGljeS5TdGF0ZW1lbnQpIHtcbiAgICAgIGNvbnN0IHJld3JpdHRlblN0YXRlbWVudCA9IHtcbiAgICAgICAgLi4uc3RhdGVtZW50LFxuICAgICAgICBSZXNvdXJjZTogdGhpcy5yZXdyaXRlUG9saWN5UmVzb3VyY2VzKHN0YXRlbWVudC5SZXNvdXJjZSksXG4gICAgICB9O1xuICAgICAgc2VydmljZUFjY291bnQuYWRkVG9QcmluY2lwYWxQb2xpY3koaWFtLlBvbGljeVN0YXRlbWVudC5mcm9tSnNvbihyZXdyaXR0ZW5TdGF0ZW1lbnQpKTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2t1YmVybmV0ZXMtc2lncy5naXRodWIuaW8vYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlci92Mi4yL2RlcGxveS9pbnN0YWxsYXRpb24vI2FkZC1jb250cm9sbGVyLXRvLWNsdXN0ZXJcbiAgICBjb25zdCBjaGFydCA9IG5ldyBIZWxtQ2hhcnQodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgY2x1c3RlcjogcHJvcHMuY2x1c3RlcixcbiAgICAgIGNoYXJ0OiAnYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlcicsXG4gICAgICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9hd3MuZ2l0aHViLmlvL2Vrcy1jaGFydHMnLFxuICAgICAgbmFtZXNwYWNlLFxuICAgICAgcmVsZWFzZTogJ2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXInLFxuICAgICAgdmVyc2lvbjogcHJvcHMudmVyc2lvbi5oZWxtQ2hhcnRWZXJzaW9uLFxuXG4gICAgICB3YWl0OiB0cnVlLFxuICAgICAgdGltZW91dDogRHVyYXRpb24ubWludXRlcygxNSksXG4gICAgICB2YWx1ZXM6IHtcbiAgICAgICAgY2x1c3Rlck5hbWU6IHByb3BzLmNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICAgIHNlcnZpY2VBY2NvdW50OiB7XG4gICAgICAgICAgY3JlYXRlOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiBzZXJ2aWNlQWNjb3VudC5zZXJ2aWNlQWNjb3VudE5hbWUsXG4gICAgICAgIH0sXG4gICAgICAgIHJlZ2lvbjogU3RhY2sub2YodGhpcykucmVnaW9uLFxuICAgICAgICB2cGNJZDogcHJvcHMuY2x1c3Rlci52cGMudnBjSWQsXG4gICAgICAgIGltYWdlOiB7XG4gICAgICAgICAgcmVwb3NpdG9yeTogcHJvcHMucmVwb3NpdG9yeSA/PyAnNjAyNDAxMTQzNDUyLmRrci5lY3IudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vYW1hem9uL2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXInLFxuICAgICAgICAgIHRhZzogcHJvcHMudmVyc2lvbi52ZXJzaW9uLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIHRoZSBjb250cm9sbGVyIHJlbGllcyBvbiBwZXJtaXNzaW9ucyBkZXBsb3llZCB1c2luZyB0aGVzZSByZXNvdXJjZXMuXG4gICAgY2hhcnQubm9kZS5hZGREZXBlbmRlbmN5KHNlcnZpY2VBY2NvdW50KTtcbiAgICBjaGFydC5ub2RlLmFkZERlcGVuZGVuY3kocHJvcHMuY2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXdyaXRlUG9saWN5UmVzb3VyY2VzKHJlc291cmNlczogc3RyaW5nIHwgc3RyaW5nW10gfCB1bmRlZmluZWQpOiBzdHJpbmcgfCBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XG4gICAgLy8gVGhpcyBpcyBzYWZlIHRvIGRpc2FibGUgYmVjYXVzZSB3ZSdyZSBhY3R1YWxseSByZXBsYWNpbmcgdGhlIGxpdGVyYWwgcGFydGl0aW9uIHdpdGggYSByZWZlcmVuY2UgdG9cbiAgICAvLyB0aGUgc3RhY2sgcGFydGl0aW9uICh3aGljaCBpcyBoYXJkY29kZWQgaW50byB0aGUgSlNPTiBmaWxlcykgdG8gcHJldmVudCBpc3N1ZXMgc3VjaCBhc1xuICAgIC8vIGF3cy9hd3MtY2RrIzIyNTIwLlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAY2RrbGFicy9uby1saXRlcmFsLXBhcnRpdGlvblxuICAgIGNvbnN0IHJld3JpdGVSZXNvdXJjZSA9IChzOiBzdHJpbmcpID0+IHMucmVwbGFjZSgnYXJuOmF3czonLCBgYXJuOiR7QXdzLlBBUlRJVElPTn06YCk7XG5cbiAgICBpZiAoIXJlc291cmNlcykge1xuICAgICAgcmV0dXJuIHJlc291cmNlcztcbiAgICB9XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc291cmNlcykpIHtcbiAgICAgIHJldHVybiByZXdyaXRlUmVzb3VyY2UocmVzb3VyY2VzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc291cmNlcy5tYXAocmV3cml0ZVJlc291cmNlKTtcbiAgfVxufVxuIl19