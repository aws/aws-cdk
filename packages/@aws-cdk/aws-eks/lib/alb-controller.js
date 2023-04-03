"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbController = exports.AlbScheme = exports.AlbControllerVersion = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const constructs_1 = require("constructs");
const helm_chart_1 = require("./helm-chart");
const service_account_1 = require("./service-account");
// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
const core_1 = require("@aws-cdk/core");
/**
 * Controller version.
 *
 * Corresponds to the image tag of 'amazon/aws-load-balancer-controller' image.
 */
class AlbControllerVersion {
    constructor(
    /**
     * The version string.
     */
    version, 
    /**
     * Whether or not its a custom version.
     */
    custom) {
        this.version = version;
        this.custom = custom;
    }
    /**
     * Specify a custom version.
     * Use this if the version you need is not available in one of the predefined versions.
     * Note that in this case, you will also need to provide an IAM policy in the controller options.
     *
     * @param version The version number.
     */
    static of(version) {
        return new AlbControllerVersion(version, true);
    }
}
exports.AlbControllerVersion = AlbControllerVersion;
_a = JSII_RTTI_SYMBOL_1;
AlbControllerVersion[_a] = { fqn: "@aws-cdk/aws-eks.AlbControllerVersion", version: "0.0.0" };
/**
 * v2.0.0
 */
AlbControllerVersion.V2_0_0 = new AlbControllerVersion('v2.0.0', false);
/**
 * v2.0.1
 */
AlbControllerVersion.V2_0_1 = new AlbControllerVersion('v2.0.1', false);
/**
 * v2.1.0
 */
AlbControllerVersion.V2_1_0 = new AlbControllerVersion('v2.1.0', false);
/**
 * v2.1.1
 */
AlbControllerVersion.V2_1_1 = new AlbControllerVersion('v2.1.1', false);
/**
 * v2.1.2
 */
AlbControllerVersion.V2_1_2 = new AlbControllerVersion('v2.1.2', false);
/**
 * v2.1.3
 */
AlbControllerVersion.V2_1_3 = new AlbControllerVersion('v2.1.3', false);
/**
 * v2.0.0
 */
AlbControllerVersion.V2_2_0 = new AlbControllerVersion('v2.2.0', false);
/**
 * v2.2.1
 */
AlbControllerVersion.V2_2_1 = new AlbControllerVersion('v2.2.1', false);
/**
 * v2.2.2
 */
AlbControllerVersion.V2_2_2 = new AlbControllerVersion('v2.2.2', false);
/**
 * v2.2.3
 */
AlbControllerVersion.V2_2_3 = new AlbControllerVersion('v2.2.3', false);
/**
 * v2.2.4
 */
AlbControllerVersion.V2_2_4 = new AlbControllerVersion('v2.2.4', false);
/**
 * v2.3.0
 */
AlbControllerVersion.V2_3_0 = new AlbControllerVersion('v2.3.0', false);
/**
 * v2.3.1
 */
AlbControllerVersion.V2_3_1 = new AlbControllerVersion('v2.3.1', false);
/**
 * v2.4.1
 */
AlbControllerVersion.V2_4_1 = new AlbControllerVersion('v2.4.1', false);
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
})(AlbScheme = exports.AlbScheme || (exports.AlbScheme = {}));
/**
 * Construct for installing the AWS ALB Contoller on EKS clusters.
 *
 * Use the factory functions `get` and `getOrCreate` to obtain/create instances of this controller.
 *
 * @see https://kubernetes-sigs.github.io/aws-load-balancer-controller
 *
 */
class AlbController extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_AlbControllerProps(props);
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
            serviceAccount.addToPrincipalPolicy(iam.PolicyStatement.fromJson(statement));
        }
        // https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/deploy/installation/#add-controller-to-cluster
        const chart = new helm_chart_1.HelmChart(this, 'Resource', {
            cluster: props.cluster,
            chart: 'aws-load-balancer-controller',
            repository: 'https://aws.github.io/eks-charts',
            namespace,
            release: 'aws-load-balancer-controller',
            // latest at the time of writing. We intentionally don't
            // want to expose this since helm here is just an implementation detail
            // for installing a specific version of the controller itself.
            // https://github.com/aws/eks-charts/blob/v0.0.65/stable/aws-load-balancer-controller/Chart.yaml
            version: '1.4.1',
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
        constructs_1.Node.of(chart).addDependency(serviceAccount);
        constructs_1.Node.of(chart).addDependency(props.cluster.openIdConnectProvider);
        constructs_1.Node.of(chart).addDependency(props.cluster.awsAuth);
    }
    /**
     * Create the controller construct associated with this cluster and scope.
     *
     * Singleton per stack/cluster.
     */
    static create(scope, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_AlbControllerProps(props);
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
}
exports.AlbController = AlbController;
_b = JSII_RTTI_SYMBOL_1;
AlbController[_b] = { fqn: "@aws-cdk/aws-eks.AlbController", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxiLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbGItY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4QywyQ0FBNkM7QUFFN0MsNkNBQXlDO0FBQ3pDLHVEQUFtRDtBQUVuRCxnSEFBZ0g7QUFDaEgsMkJBQTJCO0FBQzNCLHdDQUF1RDtBQUV2RDs7OztHQUlHO0FBQ0gsTUFBYSxvQkFBb0I7SUFtRi9CO0lBQ0U7O09BRUc7SUFDYSxPQUFlO0lBQy9COztPQUVHO0lBQ2EsTUFBZTtRQUpmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFJZixXQUFNLEdBQU4sTUFBTSxDQUFTO0tBQUs7SUFuQnRDOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBZTtRQUM5QixPQUFPLElBQUksb0JBQW9CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2hEOztBQWpGSCxvREE0RkM7OztBQTFGQzs7R0FFRztBQUNvQiwyQkFBTSxHQUFHLElBQUksb0JBQW9CLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBRTFFOztHQUVHO0FBQ29CLDJCQUFNLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFFMUU7O0dBRUc7QUFDb0IsMkJBQU0sR0FBRyxJQUFJLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUUxRTs7R0FFRztBQUNvQiwyQkFBTSxHQUFHLElBQUksb0JBQW9CLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBRTFFOztHQUVHO0FBQ29CLDJCQUFNLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFFMUU7O0dBRUc7QUFDb0IsMkJBQU0sR0FBRyxJQUFJLG9CQUFvQixDQUFDLFFBQVEsRUFB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SUFFTyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQWdCO1FBQ2pDLE9BQU8sR0FBRyxZQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7S0FDNUQ7O0FBZkgsc0NBc0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2x1c3RlciB9IGZyb20gJy4vY2x1c3Rlcic7XG5pbXBvcnQgeyBIZWxtQ2hhcnQgfSBmcm9tICcuL2hlbG0tY2hhcnQnO1xuaW1wb3J0IHsgU2VydmljZUFjY291bnQgfSBmcm9tICcuL3NlcnZpY2UtYWNjb3VudCc7XG5cbi8vIHYyIC0ga2VlcCB0aGlzIGltcG9ydCBhcyBhIHNlcGFyYXRlIHNlY3Rpb24gdG8gcmVkdWNlIG1lcmdlIGNvbmZsaWN0IHdoZW4gZm9yd2FyZCBtZXJnaW5nIHdpdGggdGhlIHYyIGJyYW5jaC5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuaW1wb3J0IHsgRHVyYXRpb24sIE5hbWVzLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG4vKipcbiAqIENvbnRyb2xsZXIgdmVyc2lvbi5cbiAqXG4gKiBDb3JyZXNwb25kcyB0byB0aGUgaW1hZ2UgdGFnIG9mICdhbWF6b24vYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlcicgaW1hZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbGJDb250cm9sbGVyVmVyc2lvbiB7XG5cbiAgLyoqXG4gICAqIHYyLjAuMFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl8wXzAgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjAuMCcsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuMC4xXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzBfMSA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuMC4xJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi4xLjBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfMV8wID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi4xLjAnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjEuMVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl8xXzEgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjEuMScsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuMS4yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzFfMiA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuMS4yJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi4xLjNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfMV8zID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi4xLjMnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjAuMFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl8yXzAgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjIuMCcsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuMi4xXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzJfMSA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuMi4xJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi4yLjJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfMl8yID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi4yLjInLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjIuM1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl8yXzMgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjIuMycsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuMi40XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzJfNCA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuMi40JywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiB2Mi4zLjBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfM18wID0gbmV3IEFsYkNvbnRyb2xsZXJWZXJzaW9uKCd2Mi4zLjAnLCBmYWxzZSk7XG5cbiAgLyoqXG4gICAqIHYyLjMuMVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl8zXzEgPSBuZXcgQWxiQ29udHJvbGxlclZlcnNpb24oJ3YyLjMuMScsIGZhbHNlKTtcblxuICAvKipcbiAgICogdjIuNC4xXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyXzRfMSA9IG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbigndjIuNC4xJywgZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IGEgY3VzdG9tIHZlcnNpb24uXG4gICAqIFVzZSB0aGlzIGlmIHRoZSB2ZXJzaW9uIHlvdSBuZWVkIGlzIG5vdCBhdmFpbGFibGUgaW4gb25lIG9mIHRoZSBwcmVkZWZpbmVkIHZlcnNpb25zLlxuICAgKiBOb3RlIHRoYXQgaW4gdGhpcyBjYXNlLCB5b3Ugd2lsbCBhbHNvIG5lZWQgdG8gcHJvdmlkZSBhbiBJQU0gcG9saWN5IGluIHRoZSBjb250cm9sbGVyIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB2ZXJzaW9uIFRoZSB2ZXJzaW9uIG51bWJlci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2YodmVyc2lvbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBBbGJDb250cm9sbGVyVmVyc2lvbih2ZXJzaW9uLCB0cnVlKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgLyoqXG4gICAgICogVGhlIHZlcnNpb24gc3RyaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmcsXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgaXRzIGEgY3VzdG9tIHZlcnNpb24uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGN1c3RvbTogYm9vbGVhbikgeyB9XG59XG5cbi8qKlxuICogQUxCIFNjaGVtZS5cbiAqXG4gKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy1zaWdzLmdpdGh1Yi5pby9hd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyL3YyLjMvZ3VpZGUvaW5ncmVzcy9hbm5vdGF0aW9ucy8jc2NoZW1lXG4gKi9cbmV4cG9ydCBlbnVtIEFsYlNjaGVtZSB7XG5cbiAgLyoqXG4gICAqIFRoZSBub2RlcyBvZiBhbiBpbnRlcm5hbCBsb2FkIGJhbGFuY2VyIGhhdmUgb25seSBwcml2YXRlIElQIGFkZHJlc3Nlcy5cbiAgICogVGhlIEROUyBuYW1lIG9mIGFuIGludGVybmFsIGxvYWQgYmFsYW5jZXIgaXMgcHVibGljbHkgcmVzb2x2YWJsZSB0byB0aGUgcHJpdmF0ZSBJUCBhZGRyZXNzZXMgb2YgdGhlIG5vZGVzLlxuICAgKiBUaGVyZWZvcmUsIGludGVybmFsIGxvYWQgYmFsYW5jZXJzIGNhbiBvbmx5IHJvdXRlIHJlcXVlc3RzIGZyb20gY2xpZW50cyB3aXRoIGFjY2VzcyB0byB0aGUgVlBDIGZvciB0aGUgbG9hZCBiYWxhbmNlci5cbiAgICovXG4gIElOVEVSTkFMID0gJ2ludGVybmFsJyxcblxuICAvKipcbiAgICogQW4gaW50ZXJuZXQtZmFjaW5nIGxvYWQgYmFsYW5jZXIgaGFzIGEgcHVibGljbHkgcmVzb2x2YWJsZSBETlMgbmFtZSwgc28gaXQgY2FuIHJvdXRlIHJlcXVlc3RzIGZyb20gY2xpZW50cyBvdmVyIHRoZSBpbnRlcm5ldFxuICAgKiB0byB0aGUgRUMyIGluc3RhbmNlcyB0aGF0IGFyZSByZWdpc3RlcmVkIHdpdGggdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqL1xuICBJTlRFUk5FVF9GQUNJTkcgPSAnaW50ZXJuZXQtZmFjaW5nJ1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGBBbGJDb250cm9sbGVyYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbGJDb250cm9sbGVyT3B0aW9ucyB7XG5cbiAgLyoqXG4gICAqIFZlcnNpb24gb2YgdGhlIGNvbnRyb2xsZXIuXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uOiBBbGJDb250cm9sbGVyVmVyc2lvbjtcblxuICAvKipcbiAgICogVGhlIHJlcG9zaXRvcnkgdG8gcHVsbCB0aGUgY29udHJvbGxlciBpbWFnZSBmcm9tLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIGRlZmF1bHQgcmVwb3NpdG9yeSB3b3JrcyBmb3IgbW9zdCByZWdpb25zLCBidXQgbm90IGFsbC5cbiAgICogSWYgdGhlIHJlcG9zaXRvcnkgaXMgbm90IGFwcGxpY2FibGUgdG8geW91ciByZWdpb24sIHVzZSBhIGN1c3RvbSByZXBvc2l0b3J5XG4gICAqIGFjY29yZGluZyB0byB0aGUgaW5mb3JtYXRpb24gaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2t1YmVybmV0ZXMtc2lncy9hd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyL3JlbGVhc2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAnNjAyNDAxMTQzNDUyLmRrci5lY3IudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vYW1hem9uL2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXInXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIHBvbGljeSB0byBhcHBseSB0byB0aGUgc2VydmljZSBhY2NvdW50LlxuICAgKlxuICAgKiBJZiB5b3UncmUgdXNpbmcgb25lIG9mIHRoZSBidWlsdC1pbiB2ZXJzaW9ucywgdGhpcyBpcyBub3QgcmVxdWlyZWQgc2luY2VcbiAgICogQ0RLIHNoaXBzIHdpdGggdGhlIGFwcHJvcHJpYXRlIHBvbGljaWVzIGZvciB0aG9zZSB2ZXJzaW9ucy5cbiAgICpcbiAgICogSG93ZXZlciwgaWYgeW91IGFyZSB1c2luZyBhIGN1c3RvbSB2ZXJzaW9uLCB0aGlzIGlzIHJlcXVpcmVkIChhbmQgdmFsaWRhdGVkKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBDb3JyZXNwb25kcyB0byB0aGUgcHJlZGVmaW5lZCB2ZXJzaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5PzogYW55O1xuXG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYEFsYkNvbnRyb2xsZXJgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFsYkNvbnRyb2xsZXJQcm9wcyBleHRlbmRzIEFsYkNvbnRyb2xsZXJPcHRpb25zIHtcblxuICAvKipcbiAgICogW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICogQ2x1c3RlciB0byBpbnN0YWxsIHRoZSBjb250cm9sbGVyIG9udG8uXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBDbHVzdGVyO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBmb3IgaW5zdGFsbGluZyB0aGUgQVdTIEFMQiBDb250b2xsZXIgb24gRUtTIGNsdXN0ZXJzLlxuICpcbiAqIFVzZSB0aGUgZmFjdG9yeSBmdW5jdGlvbnMgYGdldGAgYW5kIGBnZXRPckNyZWF0ZWAgdG8gb2J0YWluL2NyZWF0ZSBpbnN0YW5jZXMgb2YgdGhpcyBjb250cm9sbGVyLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLXNpZ3MuZ2l0aHViLmlvL2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXJcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBBbGJDb250cm9sbGVyIGV4dGVuZHMgQ29uc3RydWN0IHtcblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBjb250cm9sbGVyIGNvbnN0cnVjdCBhc3NvY2lhdGVkIHdpdGggdGhpcyBjbHVzdGVyIGFuZCBzY29wZS5cbiAgICpcbiAgICogU2luZ2xldG9uIHBlciBzdGFjay9jbHVzdGVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjcmVhdGUoc2NvcGU6IENvbnN0cnVjdCwgcHJvcHM6IEFsYkNvbnRyb2xsZXJQcm9wcykge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IHVpZCA9IEFsYkNvbnRyb2xsZXIudWlkKHByb3BzLmNsdXN0ZXIpO1xuICAgIHJldHVybiBuZXcgQWxiQ29udHJvbGxlcihzdGFjaywgdWlkLCBwcm9wcyk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyB1aWQoY2x1c3RlcjogQ2x1c3Rlcikge1xuICAgIHJldHVybiBgJHtOYW1lcy5ub2RlVW5pcXVlSWQoY2x1c3Rlci5ub2RlKX0tQWxiQ29udHJvbGxlcmA7XG4gIH1cblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFsYkNvbnRyb2xsZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBuYW1lc3BhY2UgPSAna3ViZS1zeXN0ZW0nO1xuICAgIGNvbnN0IHNlcnZpY2VBY2NvdW50ID0gbmV3IFNlcnZpY2VBY2NvdW50KHRoaXMsICdhbGItc2EnLCB7IG5hbWVzcGFjZSwgbmFtZTogJ2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXInLCBjbHVzdGVyOiBwcm9wcy5jbHVzdGVyIH0pO1xuXG4gICAgaWYgKHByb3BzLnZlcnNpb24uY3VzdG9tICYmICFwcm9wcy5wb2xpY3kpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIidhbGJDb250cm9sbGVyT3B0aW9ucy5wb2xpY3knIGlzIHJlcXVpcmVkIHdoZW4gdXNpbmcgYSBjdXN0b20gY29udHJvbGxlciB2ZXJzaW9uXCIpO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8va3ViZXJuZXRlcy1zaWdzLmdpdGh1Yi5pby9hd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyL3YyLjIvZGVwbG95L2luc3RhbGxhdGlvbi8jaWFtLXBlcm1pc3Npb25zXG4gICAgY29uc3QgcG9saWN5OiBhbnkgPSBwcm9wcy5wb2xpY3kgPz8gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJ2FkZG9ucycsIGBhbGItaWFtX3BvbGljeS0ke3Byb3BzLnZlcnNpb24udmVyc2lvbn0uanNvbmApLCAndXRmOCcpKTtcblxuICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHBvbGljeS5TdGF0ZW1lbnQpIHtcbiAgICAgIHNlcnZpY2VBY2NvdW50LmFkZFRvUHJpbmNpcGFsUG9saWN5KGlhbS5Qb2xpY3lTdGF0ZW1lbnQuZnJvbUpzb24oc3RhdGVtZW50KSk7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9rdWJlcm5ldGVzLXNpZ3MuZ2l0aHViLmlvL2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXIvdjIuMi9kZXBsb3kvaW5zdGFsbGF0aW9uLyNhZGQtY29udHJvbGxlci10by1jbHVzdGVyXG4gICAgY29uc3QgY2hhcnQgPSBuZXcgSGVsbUNoYXJ0KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGNsdXN0ZXI6IHByb3BzLmNsdXN0ZXIsXG4gICAgICBjaGFydDogJ2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXInLFxuICAgICAgcmVwb3NpdG9yeTogJ2h0dHBzOi8vYXdzLmdpdGh1Yi5pby9la3MtY2hhcnRzJyxcbiAgICAgIG5hbWVzcGFjZSxcbiAgICAgIHJlbGVhc2U6ICdhd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyJyxcblxuICAgICAgLy8gbGF0ZXN0IGF0IHRoZSB0aW1lIG9mIHdyaXRpbmcuIFdlIGludGVudGlvbmFsbHkgZG9uJ3RcbiAgICAgIC8vIHdhbnQgdG8gZXhwb3NlIHRoaXMgc2luY2UgaGVsbSBoZXJlIGlzIGp1c3QgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsXG4gICAgICAvLyBmb3IgaW5zdGFsbGluZyBhIHNwZWNpZmljIHZlcnNpb24gb2YgdGhlIGNvbnRyb2xsZXIgaXRzZWxmLlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9la3MtY2hhcnRzL2Jsb2IvdjAuMC42NS9zdGFibGUvYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlci9DaGFydC55YW1sXG4gICAgICB2ZXJzaW9uOiAnMS40LjEnLFxuXG4gICAgICB3YWl0OiB0cnVlLFxuICAgICAgdGltZW91dDogRHVyYXRpb24ubWludXRlcygxNSksXG4gICAgICB2YWx1ZXM6IHtcbiAgICAgICAgY2x1c3Rlck5hbWU6IHByb3BzLmNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICAgIHNlcnZpY2VBY2NvdW50OiB7XG4gICAgICAgICAgY3JlYXRlOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiBzZXJ2aWNlQWNjb3VudC5zZXJ2aWNlQWNjb3VudE5hbWUsXG4gICAgICAgIH0sXG4gICAgICAgIHJlZ2lvbjogU3RhY2sub2YodGhpcykucmVnaW9uLFxuICAgICAgICB2cGNJZDogcHJvcHMuY2x1c3Rlci52cGMudnBjSWQsXG4gICAgICAgIGltYWdlOiB7XG4gICAgICAgICAgcmVwb3NpdG9yeTogcHJvcHMucmVwb3NpdG9yeSA/PyAnNjAyNDAxMTQzNDUyLmRrci5lY3IudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vYW1hem9uL2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXInLFxuICAgICAgICAgIHRhZzogcHJvcHMudmVyc2lvbi52ZXJzaW9uLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIHRoZSBjb250cm9sbGVyIHJlbGllcyBvbiBwZXJtaXNzaW9ucyBkZXBsb3llZCB1c2luZyB0aGVzZSByZXNvdXJjZXMuXG4gICAgTm9kZS5vZihjaGFydCkuYWRkRGVwZW5kZW5jeShzZXJ2aWNlQWNjb3VudCk7XG4gICAgTm9kZS5vZihjaGFydCkuYWRkRGVwZW5kZW5jeShwcm9wcy5jbHVzdGVyLm9wZW5JZENvbm5lY3RQcm92aWRlcik7XG4gICAgTm9kZS5vZihjaGFydCkuYWRkRGVwZW5kZW5jeShwcm9wcy5jbHVzdGVyLmF3c0F1dGgpO1xuICB9XG59XG4iXX0=