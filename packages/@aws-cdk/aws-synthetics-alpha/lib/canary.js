"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canary = exports.Cleanup = exports.Test = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const crypto = require("crypto");
const aws_cloudwatch_1 = require("aws-cdk-lib/aws-cloudwatch");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib/core");
const runtime_1 = require("./runtime");
const synthetics_canned_metrics_generated_1 = require("aws-cdk-lib/aws-synthetics/lib/synthetics-canned-metrics.generated");
const aws_synthetics_1 = require("aws-cdk-lib/aws-synthetics");
const core_1 = require("aws-cdk-lib/core");
const path = require("path");
const AUTO_DELETE_UNDERLYING_RESOURCES_RESOURCE_TYPE = 'Custom::SyntheticsAutoDeleteUnderlyingResources';
const AUTO_DELETE_UNDERLYING_RESOURCES_TAG = 'aws-cdk:auto-delete-underlying-resources';
/**
 * Specify a test that the canary should run
 */
class Test {
    /**
     * Specify a custom test with your own code
     *
     * @returns `Test` associated with the specified Code object
     * @param options The configuration options
     */
    static custom(options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Test#custom", "");
            jsiiDeprecationWarnings._aws_cdk_aws_synthetics_alpha_CustomTestOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.custom);
            }
            throw error;
        }
        return new Test(options.code, options.handler);
    }
    /**
     * Construct a Test property
     *
     * @param code The code that the canary should run
     * @param handler The handler of the canary
     */
    constructor(code, handler) {
        this.code = code;
        this.handler = handler;
    }
}
exports.Test = Test;
_a = JSII_RTTI_SYMBOL_1;
Test[_a] = { fqn: "@aws-cdk/aws-synthetics-alpha.Test", version: "0.0.0" };
/**
 * Different ways to clean up underlying Canary resources
 * when the Canary is deleted.
 */
var Cleanup;
(function (Cleanup) {
    /**
     * Clean up nothing. The user is responsible for cleaning up
     * all resources left behind by the Canary.
     */
    Cleanup["NOTHING"] = "nothing";
    /**
     * Clean up the underlying Lambda function only. The user is
     * responsible for cleaning up all other resources left behind
     * by the Canary.
     */
    Cleanup["LAMBDA"] = "lambda";
})(Cleanup || (exports.Cleanup = Cleanup = {}));
/**
 * Define a new Canary
 */
class Canary extends cdk.Resource {
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Canary", "");
            jsiiDeprecationWarnings._aws_cdk_aws_synthetics_alpha_CanaryProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Canary);
            }
            throw error;
        }
        if (props.canaryName && !cdk.Token.isUnresolved(props.canaryName)) {
            validateName(props.canaryName);
        }
        super(scope, id, {
            physicalName: props.canaryName || cdk.Lazy.string({
                produce: () => this.generateUniqueName(),
            }),
        });
        this.artifactsBucket = props.artifactsBucketLocation?.bucket ?? new s3.Bucket(this, 'ArtifactsBucket', {
            encryption: s3.BucketEncryption.KMS_MANAGED,
            enforceSSL: true,
            lifecycleRules: props.artifactsBucketLifecycleRules,
        });
        this.role = props.role ?? this.createDefaultRole(props);
        if (props.vpc) {
            // Security Groups are created and/or appended in `createVpcConfig`.
            this._connections = new ec2.Connections({});
        }
        const resource = new aws_synthetics_1.CfnCanary(this, 'Resource', {
            artifactS3Location: this.artifactsBucket.s3UrlForObject(props.artifactsBucketLocation?.prefix),
            executionRoleArn: this.role.roleArn,
            startCanaryAfterCreation: props.startAfterCreation ?? true,
            runtimeVersion: props.runtime.name,
            name: this.physicalName,
            schedule: this.createSchedule(props),
            failureRetentionPeriod: props.failureRetentionPeriod?.toDays(),
            successRetentionPeriod: props.successRetentionPeriod?.toDays(),
            code: this.createCode(props),
            runConfig: this.createRunConfig(props),
            vpcConfig: this.createVpcConfig(props),
        });
        this._resource = resource;
        this.canaryId = resource.attrId;
        this.canaryState = resource.attrState;
        this.canaryName = this.getResourceNameAttribute(resource.ref);
        if (props.cleanup === Cleanup.LAMBDA ?? props.enableAutoDeleteLambdas) {
            this.cleanupUnderlyingResources();
        }
    }
    cleanupUnderlyingResources() {
        const provider = core_1.CustomResourceProvider.getOrCreateProvider(this, AUTO_DELETE_UNDERLYING_RESOURCES_RESOURCE_TYPE, {
            codeDirectory: path.join(__dirname, '..', 'custom-resource-handlers', 'dist', 'aws-synthetics-alpha', 'auto-delete-underlying-resources-handler'),
            useCfnResponseWrapper: false,
            runtime: core_1.CustomResourceProviderRuntime.NODEJS_18_X,
            description: `Lambda function for auto-deleting underlying resources created by ${this.canaryName}.`,
            policyStatements: [{
                    Effect: 'Allow',
                    Action: ['lambda:DeleteFunction'],
                    Resource: this.lambdaArn(),
                }, {
                    Effect: 'Allow',
                    Action: ['synthetics:GetCanary'],
                    Resource: '*',
                }],
        });
        new core_1.CustomResource(this, 'AutoDeleteUnderlyingResourcesCustomResource', {
            resourceType: AUTO_DELETE_UNDERLYING_RESOURCES_RESOURCE_TYPE,
            serviceToken: provider.serviceToken,
            properties: {
                CanaryName: this.canaryName,
            },
        });
        // We also tag the canary to record the fact that we want it autodeleted.
        // The custom resource will check this tag before actually doing the delete.
        // Because tagging and untagging will ALWAYS happen before the CR is deleted,
        // we can set `autoDeleteLambda: false` without the removal of the CR emptying
        // the lambda as a side effect.
        cdk.Tags.of(this._resource).add(AUTO_DELETE_UNDERLYING_RESOURCES_TAG, 'true');
    }
    /**
     * Access the Connections object
     *
     * Will fail if not a VPC-enabled Canary
     */
    get connections() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Canary#connections", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "connections").get);
            }
            throw error;
        }
        if (!this._connections) {
            // eslint-disable-next-line max-len
            throw new Error('Only VPC-associated Canaries have security groups to manage. Supply the "vpc" parameter when creating the Canary.');
        }
        return this._connections;
    }
    /**
     * Measure the Duration of a single canary run, in seconds.
     *
     * @param options - configuration options for the metric
     *
     * @default avg over 5 minutes
     */
    metricDuration(options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Canary#metricDuration", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricDuration);
            }
            throw error;
        }
        return new aws_cloudwatch_1.Metric({
            ...synthetics_canned_metrics_generated_1.CloudWatchSyntheticsMetrics.durationMaximum({ CanaryName: this.canaryName }),
            ...{ statistic: 'Average' },
            ...options,
        }).attachTo(this);
    }
    /**
     * Measure the percentage of successful canary runs.
     *
     * @param options - configuration options for the metric
     *
     * @default avg over 5 minutes
     */
    metricSuccessPercent(options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Canary#metricSuccessPercent", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricSuccessPercent);
            }
            throw error;
        }
        return this.cannedMetric(synthetics_canned_metrics_generated_1.CloudWatchSyntheticsMetrics.successPercentAverage, options);
    }
    /**
     * Measure the number of failed canary runs over a given time period.
     *
     * Default: sum over 5 minutes
     *
     * @param options - configuration options for the metric
     */
    metricFailed(options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-synthetics-alpha.Canary#metricFailed", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricFailed);
            }
            throw error;
        }
        return this.cannedMetric(synthetics_canned_metrics_generated_1.CloudWatchSyntheticsMetrics.failedSum, options);
    }
    /**
     * Returns a default role for the canary
     */
    createDefaultRole(props) {
        const prefix = props.artifactsBucketLocation?.prefix;
        // Created role will need these policies to run the Canary.
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-executionrolearn
        const policy = new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    resources: ['*'],
                    actions: ['s3:ListAllMyBuckets'],
                }),
                new iam.PolicyStatement({
                    resources: [this.artifactsBucket.bucketArn],
                    actions: ['s3:GetBucketLocation'],
                }),
                new iam.PolicyStatement({
                    resources: [this.artifactsBucket.arnForObjects(`${prefix ? prefix + '/*' : '*'}`)],
                    actions: ['s3:PutObject'],
                }),
                new iam.PolicyStatement({
                    resources: ['*'],
                    actions: ['cloudwatch:PutMetricData'],
                    conditions: { StringEquals: { 'cloudwatch:namespace': 'CloudWatchSynthetics' } },
                }),
                new iam.PolicyStatement({
                    resources: [this.logGroupArn()],
                    actions: ['logs:CreateLogStream', 'logs:CreateLogGroup', 'logs:PutLogEvents'],
                }),
            ],
        });
        const managedPolicies = [];
        if (props.vpc) {
            // Policy that will have ENI creation permissions
            managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));
        }
        return new iam.Role(this, 'ServiceRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            inlinePolicies: {
                canaryPolicy: policy,
            },
            managedPolicies,
        });
    }
    logGroupArn() {
        return cdk.Stack.of(this).formatArn({
            service: 'logs',
            resource: 'log-group',
            arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
            resourceName: '/aws/lambda/cwsyn-*',
        });
    }
    lambdaArn() {
        return cdk.Stack.of(this).formatArn({
            service: 'lambda',
            resource: 'function',
            arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
            resourceName: 'cwsyn-*',
        });
    }
    /**
     * Returns the code object taken in by the canary resource.
     */
    createCode(props) {
        this.validateHandler(props.test.handler, props.runtime);
        const codeConfig = {
            handler: props.test.handler,
            ...props.test.code.bind(this, props.test.handler, props.runtime.family),
        };
        return {
            handler: codeConfig.handler,
            script: codeConfig.inlineCode,
            s3Bucket: codeConfig.s3Location?.bucketName,
            s3Key: codeConfig.s3Location?.objectKey,
            s3ObjectVersion: codeConfig.s3Location?.objectVersion,
        };
    }
    /**
     * Verifies that the handler name matches the conventions given a certain runtime.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-code.html#cfn-synthetics-canary-code-handler
     * @param handler - the name of the handler
     * @param runtime - the runtime version
     */
    validateHandler(handler, runtime) {
        const oldRuntimes = [
            runtime_1.Runtime.SYNTHETICS_PYTHON_SELENIUM_1_0,
            runtime_1.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_0,
            runtime_1.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_1,
            runtime_1.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_2,
            runtime_1.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_3,
        ];
        if (oldRuntimes.includes(runtime)) {
            if (!handler.match(/^[0-9A-Za-z_\\-]+\.handler*$/)) {
                throw new Error(`Canary Handler must be specified as \'fileName.handler\' for legacy runtimes, received ${handler}`);
            }
        }
        else {
            if (!handler.match(/^([0-9a-zA-Z_-]+\/)*[0-9A-Za-z_\\-]+\.[A-Za-z_][A-Za-z0-9_]*$/)) {
                throw new Error(`Canary Handler must be specified either as \'fileName.handler\', \'fileName.functionName\', or \'folder/fileName.functionName\', received ${handler}`);
            }
        }
        if (handler.length < 1 || handler.length > 128) {
            throw new Error(`Canary Handler length must be between 1 and 128, received ${handler.length}`);
        }
    }
    createRunConfig(props) {
        if (!props.environmentVariables) {
            return undefined;
        }
        return {
            environmentVariables: props.environmentVariables,
        };
    }
    /**
     * Returns a canary schedule object
     */
    createSchedule(props) {
        return {
            durationInSeconds: String(`${props.timeToLive?.toSeconds() ?? 0}`),
            expression: props.schedule?.expressionString ?? 'rate(5 minutes)',
        };
    }
    createVpcConfig(props) {
        if (!props.vpc) {
            if (props.vpcSubnets != null || props.securityGroups != null) {
                throw new Error("You must provide the 'vpc' prop when using VPC-related properties.");
            }
            return undefined;
        }
        const { subnetIds } = props.vpc.selectSubnets(props.vpcSubnets);
        if (subnetIds.length < 1) {
            throw new Error('No matching subnets found in the VPC.');
        }
        let securityGroups;
        if (props.securityGroups && props.securityGroups.length > 0) {
            securityGroups = props.securityGroups;
        }
        else {
            const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
                vpc: props.vpc,
                description: 'Automatic security group for Canary ' + cdk.Names.uniqueId(this),
            });
            securityGroups = [securityGroup];
        }
        this._connections.addSecurityGroup(...securityGroups);
        return {
            vpcId: props.vpc.vpcId,
            subnetIds,
            securityGroupIds: cdk.Lazy.list({ produce: () => this.connections.securityGroups.map(sg => sg.securityGroupId) }),
        };
    }
    /**
     * Creates a unique name for the canary. The generated name is the physical ID of the canary.
     */
    generateUniqueName() {
        const name = cdk.Names.uniqueId(this).toLowerCase().replace(' ', '-');
        if (name.length <= 21) {
            return name;
        }
        else {
            return name.substring(0, 15) + nameHash(name);
        }
    }
    cannedMetric(fn, props) {
        return new aws_cloudwatch_1.Metric({
            ...fn({ CanaryName: this.canaryName }),
            ...props,
        }).attachTo(this);
    }
}
exports.Canary = Canary;
_b = JSII_RTTI_SYMBOL_1;
Canary[_b] = { fqn: "@aws-cdk/aws-synthetics-alpha.Canary", version: "0.0.0" };
/**
 * Take a hash of the given name.
 *
 * @param name the name to be hashed
 */
function nameHash(name) {
    const md5 = crypto.createHash('sha256').update(name).digest('hex');
    return md5.slice(0, 6);
}
const nameRegex = /^[0-9a-z_\-]+$/;
/**
 * Verifies that the name fits the regex expression: ^[0-9a-z_\-]+$.
 *
 * @param name - the given name of the canary
 */
function validateName(name) {
    if (name.length > 21) {
        throw new Error(`Canary name is too large, must be between 1 and 21 characters, but is ${name.length} (got "${name}")`);
    }
    if (!nameRegex.test(name)) {
        throw new Error(`Canary name must be lowercase, numbers, hyphens, or underscores (got "${name}")`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuYXJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FuYXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlDQUFpQztBQUNqQywrREFBZ0Y7QUFDaEYsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyx5Q0FBeUM7QUFDekMsd0NBQXdDO0FBR3hDLHVDQUFvQztBQUVwQyw0SEFBaUg7QUFDakgsK0RBQXVEO0FBQ3ZELDJDQUF5RztBQUN6Ryw2QkFBNkI7QUFFN0IsTUFBTSw4Q0FBOEMsR0FBRyxpREFBaUQsQ0FBQztBQUN6RyxNQUFNLG9DQUFvQyxHQUFHLDBDQUEwQyxDQUFDO0FBRXhGOztHQUVHO0FBQ0gsTUFBYSxJQUFJO0lBQ2Y7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQTBCOzs7Ozs7Ozs7OztRQUM3QyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2hEO0lBRUQ7Ozs7O09BS0c7SUFDSCxZQUFvQyxJQUFVLEVBQWtCLE9BQWU7UUFBM0MsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFrQixZQUFPLEdBQVAsT0FBTyxDQUFRO0tBQzlFOztBQWxCSCxvQkFtQkM7OztBQWlCRDs7O0dBR0c7QUFDSCxJQUFZLE9BYVg7QUFiRCxXQUFZLE9BQU87SUFDakI7OztPQUdHO0lBQ0gsOEJBQW1CLENBQUE7SUFFbkI7Ozs7T0FJRztJQUNILDRCQUFpQixDQUFBO0FBQ25CLENBQUMsRUFiVyxPQUFPLHVCQUFQLE9BQU8sUUFhbEI7QUEwS0Q7O0dBRUc7QUFDSCxNQUFhLE1BQU8sU0FBUSxHQUFHLENBQUMsUUFBUTtJQXNDdEMsWUFBbUIsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7Ozs7Ozs7K0NBdEN4RCxNQUFNOzs7O1FBdUNmLElBQUksS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxD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SUFDaEMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtRQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLHlFQUF5RSxJQUFJLENBQUMsTUFBTSxVQUFVLElBQUksSUFBSSxDQUFDLENBQUM7S0FDekg7SUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHlFQUF5RSxJQUFJLElBQUksQ0FBQyxDQUFDO0tBQ3BHO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHsgTWV0cmljLCBNZXRyaWNPcHRpb25zLCBNZXRyaWNQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvZGUgfSBmcm9tICcuL2NvZGUnO1xuaW1wb3J0IHsgUnVudGltZSB9IGZyb20gJy4vcnVudGltZSc7XG5pbXBvcnQgeyBTY2hlZHVsZSB9IGZyb20gJy4vc2NoZWR1bGUnO1xuaW1wb3J0IHsgQ2xvdWRXYXRjaFN5bnRoZXRpY3NNZXRyaWNzIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXN5bnRoZXRpY3MvbGliL3N5bnRoZXRpY3MtY2FubmVkLW1ldHJpY3MuZ2VuZXJhdGVkJztcbmltcG9ydCB7IENmbkNhbmFyeSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zeW50aGV0aWNzJztcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgQVVUT19ERUxFVEVfVU5ERVJMWUlOR19SRVNPVVJDRVNfUkVTT1VSQ0VfVFlQRSA9ICdDdXN0b206OlN5bnRoZXRpY3NBdXRvRGVsZXRlVW5kZXJseWluZ1Jlc291cmNlcyc7XG5jb25zdCBBVVRPX0RFTEVURV9VTkRFUkxZSU5HX1JFU09VUkNFU19UQUcgPSAnYXdzLWNkazphdXRvLWRlbGV0ZS11bmRlcmx5aW5nLXJlc291cmNlcyc7XG5cbi8qKlxuICogU3BlY2lmeSBhIHRlc3QgdGhhdCB0aGUgY2FuYXJ5IHNob3VsZCBydW5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlc3Qge1xuICAvKipcbiAgICogU3BlY2lmeSBhIGN1c3RvbSB0ZXN0IHdpdGggeW91ciBvd24gY29kZVxuICAgKlxuICAgKiBAcmV0dXJucyBgVGVzdGAgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQgQ29kZSBvYmplY3RcbiAgICogQHBhcmFtIG9wdGlvbnMgVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjdXN0b20ob3B0aW9uczogQ3VzdG9tVGVzdE9wdGlvbnMpOiBUZXN0IHtcbiAgICByZXR1cm4gbmV3IFRlc3Qob3B0aW9ucy5jb2RlLCBvcHRpb25zLmhhbmRsZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIFRlc3QgcHJvcGVydHlcbiAgICpcbiAgICogQHBhcmFtIGNvZGUgVGhlIGNvZGUgdGhhdCB0aGUgY2FuYXJ5IHNob3VsZCBydW5cbiAgICogQHBhcmFtIGhhbmRsZXIgVGhlIGhhbmRsZXIgb2YgdGhlIGNhbmFyeVxuICAgKi9cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgY29kZTogQ29kZSwgcHVibGljIHJlYWRvbmx5IGhhbmRsZXI6IHN0cmluZykge1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3Igc3BlY2lmeWluZyBhIHRlc3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21UZXN0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgY29kZSBvZiB0aGUgY2FuYXJ5IHNjcmlwdFxuICAgKi9cbiAgcmVhZG9ubHkgY29kZTogQ29kZSxcblxuICAvKipcbiAgICogVGhlIGhhbmRsZXIgZm9yIHRoZSBjb2RlLiBNdXN0IGVuZCB3aXRoIGAuaGFuZGxlcmAuXG4gICAqL1xuICByZWFkb25seSBoYW5kbGVyOiBzdHJpbmcsXG59XG5cbi8qKlxuICogRGlmZmVyZW50IHdheXMgdG8gY2xlYW4gdXAgdW5kZXJseWluZyBDYW5hcnkgcmVzb3VyY2VzXG4gKiB3aGVuIHRoZSBDYW5hcnkgaXMgZGVsZXRlZC5cbiAqL1xuZXhwb3J0IGVudW0gQ2xlYW51cCB7XG4gIC8qKlxuICAgKiBDbGVhbiB1cCBub3RoaW5nLiBUaGUgdXNlciBpcyByZXNwb25zaWJsZSBmb3IgY2xlYW5pbmcgdXBcbiAgICogYWxsIHJlc291cmNlcyBsZWZ0IGJlaGluZCBieSB0aGUgQ2FuYXJ5LlxuICAgKi9cbiAgTk9USElORyA9ICdub3RoaW5nJyxcblxuICAvKipcbiAgICogQ2xlYW4gdXAgdGhlIHVuZGVybHlpbmcgTGFtYmRhIGZ1bmN0aW9uIG9ubHkuIFRoZSB1c2VyIGlzXG4gICAqIHJlc3BvbnNpYmxlIGZvciBjbGVhbmluZyB1cCBhbGwgb3RoZXIgcmVzb3VyY2VzIGxlZnQgYmVoaW5kXG4gICAqIGJ5IHRoZSBDYW5hcnkuXG4gICAqL1xuICBMQU1CREEgPSAnbGFtYmRhJyxcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBzcGVjaWZ5aW5nIHRoZSBzMyBsb2NhdGlvbiB0aGF0IHN0b3JlcyB0aGUgZGF0YSBvZiBlYWNoIGNhbmFyeSBydW4uIFRoZSBhcnRpZmFjdHMgYnVja2V0IGxvY2F0aW9uICoqY2Fubm90KipcbiAqIGJlIHVwZGF0ZWQgb25jZSB0aGUgY2FuYXJ5IGlzIGNyZWF0ZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXJ0aWZhY3RzQnVja2V0TG9jYXRpb24ge1xuICAvKipcbiAgICogVGhlIHMzIGxvY2F0aW9uIHRoYXQgc3RvcmVzIHRoZSBkYXRhIG9mIGVhY2ggcnVuLlxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0OiBzMy5JQnVja2V0O1xuXG4gIC8qKlxuICAgKiBUaGUgUzMgYnVja2V0IHByZWZpeC4gU3BlY2lmeSB0aGlzIGlmIHlvdSB3YW50IGEgbW9yZSBzcGVjaWZpYyBwYXRoIHdpdGhpbiB0aGUgYXJ0aWZhY3RzIGJ1Y2tldC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBwcmVmaXhcbiAgICovXG4gIHJlYWRvbmx5IHByZWZpeD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIGNhbmFyeVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENhbmFyeVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBzMyBsb2NhdGlvbiB0aGF0IHN0b3JlcyB0aGUgZGF0YSBvZiB0aGUgY2FuYXJ5IHJ1bnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuZXcgczMgYnVja2V0IHdpbGwgYmUgY3JlYXRlZCB3aXRob3V0IGEgcHJlZml4LlxuICAgKi9cbiAgcmVhZG9ubHkgYXJ0aWZhY3RzQnVja2V0TG9jYXRpb24/OiBBcnRpZmFjdHNCdWNrZXRMb2NhdGlvbjtcblxuICAvKipcbiAgICogQ2FuYXJ5IGV4ZWN1dGlvbiByb2xlLlxuICAgKlxuICAgKiBUaGlzIGlzIHRoZSByb2xlIHRoYXQgd2lsbCBiZSBhc3N1bWVkIGJ5IHRoZSBjYW5hcnkgdXBvbiBleGVjdXRpb24uXG4gICAqIEl0IGNvbnRyb2xzIHRoZSBwZXJtaXNzaW9ucyB0aGF0IHRoZSBjYW5hcnkgd2lsbCBoYXZlLiBUaGUgcm9sZSBtdXN0XG4gICAqIGJlIGFzc3VtYWJsZSBieSB0aGUgQVdTIExhbWJkYSBzZXJ2aWNlIHByaW5jaXBhbC5cbiAgICpcbiAgICogSWYgbm90IHN1cHBsaWVkLCBhIHJvbGUgd2lsbCBiZSBjcmVhdGVkIHdpdGggYWxsIHRoZSByZXF1aXJlZCBwZXJtaXNzaW9ucy5cbiAgICogSWYgeW91IHByb3ZpZGUgYSBSb2xlLCB5b3UgbXVzdCBhZGQgdGhlIHJlcXVpcmVkIHBlcm1pc3Npb25zLlxuICAgKlxuICAgKiBAc2VlIHJlcXVpcmVkIHBlcm1pc3Npb25zOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3ludGhldGljcy1jYW5hcnkuaHRtbCNjZm4tc3ludGhldGljcy1jYW5hcnktZXhlY3V0aW9ucm9sZWFyblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgdW5pcXVlIHJvbGUgd2lsbCBiZSBnZW5lcmF0ZWQgZm9yIHRoaXMgY2FuYXJ5LlxuICAgKiBZb3UgY2FuIGFkZCBwZXJtaXNzaW9ucyB0byByb2xlcyBieSBjYWxsaW5nICdhZGRUb1JvbGVQb2xpY3knLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogSG93IGxvbmcgdGhlIGNhbmFyeSB3aWxsIGJlIGluIGEgJ1JVTk5JTkcnIHN0YXRlLiBGb3IgZXhhbXBsZSwgaWYgeW91IHNldCBgdGltZVRvTGl2ZWAgdG8gYmUgMSBob3VyIGFuZCBgc2NoZWR1bGVgIHRvIGJlIGByYXRlKDEwIG1pbnV0ZXMpYCxcbiAgICogeW91ciBjYW5hcnkgd2lsbCBydW4gYXQgMTAgbWludXRlIGludGVydmFscyBmb3IgYW4gaG91ciwgZm9yIGEgdG90YWwgb2YgNiB0aW1lcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBsaW1pdFxuICAgKi9cbiAgcmVhZG9ubHkgdGltZVRvTGl2ZT86IGNkay5EdXJhdGlvbjtcblxuICAvKipcbiAgICogU3BlY2lmeSB0aGUgc2NoZWR1bGUgZm9yIGhvdyBvZnRlbiB0aGUgY2FuYXJ5IHJ1bnMuIEZvciBleGFtcGxlLCBpZiB5b3Ugc2V0IGBzY2hlZHVsZWAgdG8gYHJhdGUoMTAgbWludXRlcylgLCB0aGVuIHRoZSBjYW5hcnkgd2lsbCBydW4gZXZlcnkgMTAgbWludXRlcy5cbiAgICogWW91IGNhbiBzZXQgdGhlIHNjaGVkdWxlIHdpdGggYFNjaGVkdWxlLnJhdGUoRHVyYXRpb24pYCAocmVjb21tZW5kZWQpIG9yIHlvdSBjYW4gc3BlY2lmeSBhbiBleHByZXNzaW9uIHVzaW5nIGBTY2hlZHVsZS5leHByZXNzaW9uKClgLlxuICAgKiBAZGVmYXVsdCAncmF0ZSg1IG1pbnV0ZXMpJ1xuICAgKi9cbiAgcmVhZG9ubHkgc2NoZWR1bGU/OiBTY2hlZHVsZTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIGNhbmFyeSBzaG91bGQgc3RhcnQgYWZ0ZXIgY3JlYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHN0YXJ0QWZ0ZXJDcmVhdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEhvdyBtYW55IGRheXMgc2hvdWxkIHN1Y2Nlc3NmdWwgcnVucyBiZSByZXRhaW5lZC5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24uZGF5cygzMSlcbiAgICovXG4gIHJlYWRvbmx5IHN1Y2Nlc3NSZXRlbnRpb25QZXJpb2Q/OiBjZGsuRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIEhvdyBtYW55IGRheXMgc2hvdWxkIGZhaWxlZCBydW5zIGJlIHJldGFpbmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5kYXlzKDMxKVxuICAgKi9cbiAgcmVhZG9ubHkgZmFpbHVyZVJldGVudGlvblBlcmlvZD86IGNkay5EdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNhbmFyeS4gQmUgc3VyZSB0byBnaXZlIGl0IGEgZGVzY3JpcHRpdmUgbmFtZSB0aGF0IGRpc3Rpbmd1aXNoZXMgaXQgZnJvbVxuICAgKiBvdGhlciBjYW5hcmllcyBpbiB5b3VyIGFjY291bnQuXG4gICAqXG4gICAqIERvIG5vdCBpbmNsdWRlIHNlY3JldHMgb3IgcHJvcHJpZXRhcnkgaW5mb3JtYXRpb24gaW4geW91ciBjYW5hcnkgbmFtZS4gVGhlIGNhbmFyeSBuYW1lXG4gICAqIG1ha2VzIHVwIHBhcnQgb2YgdGhlIGNhbmFyeSBBUk4sIHdoaWNoIGlzIGluY2x1ZGVkIGluIG91dGJvdW5kIGNhbGxzIG92ZXIgdGhlIGludGVybmV0LlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9tb25pdG9yaW5nL3NlcnZpY2VsZW5zX2NhbmFyaWVzX3NlY3VyaXR5Lmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIHVuaXF1ZSBuYW1lIHdpbGwgYmUgZ2VuZXJhdGVkIGZyb20gdGhlIGNvbnN0cnVjdCBJRFxuICAgKi9cbiAgcmVhZG9ubHkgY2FuYXJ5TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogU3BlY2lmeSB0aGUgcnVudGltZSB2ZXJzaW9uIHRvIHVzZSBmb3IgdGhlIGNhbmFyeS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbW9uaXRvcmluZy9DbG91ZFdhdGNoX1N5bnRoZXRpY3NfQ2FuYXJpZXNfTGlicmFyeS5odG1sXG4gICAqL1xuICByZWFkb25seSBydW50aW1lOiBSdW50aW1lO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0ZXN0IHRoYXQgeW91IHdhbnQgeW91ciBjYW5hcnkgdG8gcnVuLiBVc2UgYFRlc3QuY3VzdG9tKClgIHRvIHNwZWNpZnkgdGhlIHRlc3QgdG8gcnVuLlxuICAgKi9cbiAgcmVhZG9ubHkgdGVzdDogVGVzdDtcblxuICAvKipcbiAgICogS2V5LXZhbHVlIHBhaXJzIHRoYXQgdGhlIFN5bnRoZXRpY3MgY2FjaGVzIGFuZCBtYWtlcyBhdmFpbGFibGUgZm9yIHlvdXIgY2FuYXJ5IHNjcmlwdHMuIFVzZSBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgICogdG8gYXBwbHkgY29uZmlndXJhdGlvbiBjaGFuZ2VzLCBzdWNoIGFzIHRlc3QgYW5kIHByb2R1Y3Rpb24gZW52aXJvbm1lbnQgY29uZmlndXJhdGlvbnMsIHdpdGhvdXQgY2hhbmdpbmcgeW91clxuICAgKiBDYW5hcnkgc2NyaXB0IHNvdXJjZSBjb2RlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAgICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50VmFyaWFibGVzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogVGhlIFZQQyB3aGVyZSB0aGlzIGNhbmFyeSBpcyBydW4uXG4gICAqXG4gICAqIFNwZWNpZnkgdGhpcyBpZiB0aGUgY2FuYXJ5IG5lZWRzIHRvIGFjY2VzcyByZXNvdXJjZXMgaW4gYSBWUEMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm90IGluIFZQQ1xuICAgKi9cbiAgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRvIHBsYWNlIHRoZSBuZXR3b3JrIGludGVyZmFjZXMgd2l0aGluIHRoZSBWUEMuIFlvdSBtdXN0IHByb3ZpZGUgYHZwY2Agd2hlbiB1c2luZyB0aGlzIHByb3AuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIFZwYyBkZWZhdWx0IHN0cmF0ZWd5IGlmIG5vdCBzcGVjaWZpZWRcbiAgICovXG4gIHJlYWRvbmx5IHZwY1N1Ym5ldHM/OiBlYzIuU3VibmV0U2VsZWN0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBzZWN1cml0eSBncm91cHMgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGNhbmFyeSdzIG5ldHdvcmsgaW50ZXJmYWNlcy4gWW91IG11c3QgcHJvdmlkZSBgdnBjYCB3aGVuIHVzaW5nIHRoaXMgcHJvcC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBJZiB0aGUgY2FuYXJ5IGlzIHBsYWNlZCB3aXRoaW4gYSBWUEMgYW5kIGEgc2VjdXJpdHkgZ3JvdXAgaXNcbiAgICogbm90IHNwZWNpZmllZCBhIGRlZGljYXRlZCBzZWN1cml0eSBncm91cCB3aWxsIGJlIGNyZWF0ZWQgZm9yIHRoaXMgY2FuYXJ5LlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM/OiBlYzIuSVNlY3VyaXR5R3JvdXBbXTtcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdG8gZGVsZXRlIHRoZSBsYW1iZGEgcmVzb3VyY2VzIHdoZW4gdGhlIGNhbmFyeSBpcyBkZWxldGVkXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN5bnRoZXRpY3MtY2FuYXJ5Lmh0bWwjY2ZuLXN5bnRoZXRpY3MtY2FuYXJ5LWRlbGV0ZWxhbWJkYXJlc291cmNlc29uY2FuYXJ5ZGVsZXRpb25cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICogQGRlcHJlY2F0ZWQgdGhpcyBmZWF0dXJlIGhhcyBiZWVuIGRlcHJlY2F0ZWQgYnkgdGhlIHNlcnZpY2UgdGVhbSwgdXNlIGBjbGVhbnVwOiBDbGVhbnVwLkxBTUJEQWAgaW5zdGVhZCB3aGljaCB3aWxsIHVzZSBhIEN1c3RvbSBSZXNvdXJjZSB0byBhY2hpZXZlIHRoZSBzYW1lIGVmZmVjdC5cbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZUF1dG9EZWxldGVMYW1iZGFzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmeSB0aGUgdW5kZXJseWluZyByZXNvdXJjZXMgdG8gYmUgY2xlYW5lZCB1cCB3aGVuIHRoZSBjYW5hcnkgaXMgZGVsZXRlZC5cbiAgICogVXNpbmcgYENsZWFudXAuTEFNQkRBYCB3aWxsIGNyZWF0ZSBhIEN1c3RvbSBSZXNvdXJjZSB0byBhY2hpZXZlIHRoaXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IENsZWFudXAuTk9USElOR1xuICAgKi9cbiAgcmVhZG9ubHkgY2xlYW51cD86IENsZWFudXA7XG5cbiAgLyoqXG4gICAqIExpZmVjeWNsZSBydWxlcyBmb3IgdGhlIGdlbmVyYXRlZCBjYW5hcnkgYXJ0aWZhY3QgYnVja2V0LiBIYXMgbm8gZWZmZWN0XG4gICAqIGlmIGEgYnVja2V0IGlzIHBhc3NlZCB0byBgYXJ0aWZhY3RzQnVja2V0TG9jYXRpb25gLiBJZiB5b3UgcGFzcyBhIGJ1Y2tldFxuICAgKiB0byBgYXJ0aWZhY3RzQnVja2V0TG9jYXRpb25gLCB5b3UgY2FuIGFkZCBsaWZlY3ljbGUgcnVsZXMgdG8gdGhlIGJ1Y2tldFxuICAgKiBpdHNlbGYuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gcnVsZXMgYXBwbGllZCB0byB0aGUgZ2VuZXJhdGVkIGJ1Y2tldC5cbiAgICovXG4gIHJlYWRvbmx5IGFydGlmYWN0c0J1Y2tldExpZmVjeWNsZVJ1bGVzPzogQXJyYXk8czMuTGlmZWN5Y2xlUnVsZT47XG59XG5cbi8qKlxuICogRGVmaW5lIGEgbmV3IENhbmFyeVxuICovXG5leHBvcnQgY2xhc3MgQ2FuYXJ5IGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgZWMyLklDb25uZWN0YWJsZSB7XG4gIC8qKlxuICAgKiBFeGVjdXRpb24gcm9sZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBDYW5hcnkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZTogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgY2FuYXJ5IElEXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjYW5hcnlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhdGUgb2YgdGhlIGNhbmFyeS4gRm9yIGV4YW1wbGUsICdSVU5OSU5HJywgJ1NUT1BQRUQnLCAnTk9UIFNUQVJURUQnLCBvciAnRVJST1InLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2FuYXJ5U3RhdGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNhbmFyeSBOYW1lXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjYW5hcnlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEJ1Y2tldCB3aGVyZSBkYXRhIGZyb20gZWFjaCBjYW5hcnkgcnVuIGlzIHN0b3JlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhcnRpZmFjdHNCdWNrZXQ6IHMzLklCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIEFjdHVhbCBjb25uZWN0aW9ucyBvYmplY3QgZm9yIHRoZSB1bmRlcmx5aW5nIExhbWJkYVxuICAgKlxuICAgKiBNYXkgYmUgdW5zZXQsIGluIHdoaWNoIGNhc2UgdGhlIGNhbmFyeSBMYW1iZGEgaXMgbm90IGNvbmZpZ3VyZWQgZm9yIHVzZSBpbiBhIFZQQy5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9jb25uZWN0aW9ucz86IGVjMi5Db25uZWN0aW9ucztcbiAgcHJpdmF0ZSByZWFkb25seSBfcmVzb3VyY2U6IENmbkNhbmFyeTtcblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENhbmFyeVByb3BzKSB7XG4gICAgaWYgKHByb3BzLmNhbmFyeU5hbWUgJiYgIWNkay5Ub2tlbi5pc1VucmVzb2x2ZWQocHJvcHMuY2FuYXJ5TmFtZSkpIHtcbiAgICAgIHZhbGlkYXRlTmFtZShwcm9wcy5jYW5hcnlOYW1lKTtcbiAgICB9XG5cbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuY2FuYXJ5TmFtZSB8fCBjZGsuTGF6eS5zdHJpbmcoe1xuICAgICAgICBwcm9kdWNlOiAoKSA9PiB0aGlzLmdlbmVyYXRlVW5pcXVlTmFtZSgpLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFydGlmYWN0c0J1Y2tldCA9IHByb3BzLmFydGlmYWN0c0J1Y2tldExvY2F0aW9uPy5idWNrZXQgPz8gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnQXJ0aWZhY3RzQnVja2V0Jywge1xuICAgICAgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVNfTUFOQUdFRCxcbiAgICAgIGVuZm9yY2VTU0w6IHRydWUsXG4gICAgICBsaWZlY3ljbGVSdWxlczogcHJvcHMuYXJ0aWZhY3RzQnVja2V0TGlmZWN5Y2xlUnVsZXMsXG4gICAgfSk7XG5cbiAgICB0aGlzLnJvbGUgPSBwcm9wcy5yb2xlID8/IHRoaXMuY3JlYXRlRGVmYXVsdFJvbGUocHJvcHMpO1xuXG4gICAgaWYgKHByb3BzLnZwYykge1xuICAgICAgLy8gU2VjdXJpdHkgR3JvdXBzIGFyZSBjcmVhdGVkIGFuZC9vciBhcHBlbmRlZCBpbiBgY3JlYXRlVnBjQ29uZmlnYC5cbiAgICAgIHRoaXMuX2Nvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucyh7fSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb3VyY2U6IENmbkNhbmFyeSA9IG5ldyBDZm5DYW5hcnkodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgYXJ0aWZhY3RTM0xvY2F0aW9uOiB0aGlzLmFydGlmYWN0c0J1Y2tldC5zM1VybEZvck9iamVjdChwcm9wcy5hcnRpZmFjdHNCdWNrZXRMb2NhdGlvbj8ucHJlZml4KSxcbiAgICAgIGV4ZWN1dGlvblJvbGVBcm46IHRoaXMucm9sZS5yb2xlQXJuLFxuICAgICAgc3RhcnRDYW5hcnlBZnRlckNyZWF0aW9uOiBwcm9wcy5zdGFydEFmdGVyQ3JlYXRpb24gPz8gdHJ1ZSxcbiAgICAgIHJ1bnRpbWVWZXJzaW9uOiBwcm9wcy5ydW50aW1lLm5hbWUsXG4gICAgICBuYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHNjaGVkdWxlOiB0aGlzLmNyZWF0ZVNjaGVkdWxlKHByb3BzKSxcbiAgICAgIGZhaWx1cmVSZXRlbnRpb25QZXJpb2Q6IHByb3BzLmZhaWx1cmVSZXRlbnRpb25QZXJpb2Q/LnRvRGF5cygpLFxuICAgICAgc3VjY2Vzc1JldGVudGlvblBlcmlvZDogcHJvcHMuc3VjY2Vzc1JldGVudGlvblBlcmlvZD8udG9EYXlzKCksXG4gICAgICBjb2RlOiB0aGlzLmNyZWF0ZUNvZGUocHJvcHMpLFxuICAgICAgcnVuQ29uZmlnOiB0aGlzLmNyZWF0ZVJ1bkNvbmZpZyhwcm9wcyksXG4gICAgICB2cGNDb25maWc6IHRoaXMuY3JlYXRlVnBjQ29uZmlnKHByb3BzKSxcbiAgICB9KTtcbiAgICB0aGlzLl9yZXNvdXJjZSA9IHJlc291cmNlO1xuXG4gICAgdGhpcy5jYW5hcnlJZCA9IHJlc291cmNlLmF0dHJJZDtcbiAgICB0aGlzLmNhbmFyeVN0YXRlID0gcmVzb3VyY2UuYXR0clN0YXRlO1xuICAgIHRoaXMuY2FuYXJ5TmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLnJlZik7XG5cbiAgICBpZiAocHJvcHMuY2xlYW51cCA9PT0gQ2xlYW51cC5MQU1CREEgPz8gcHJvcHMuZW5hYmxlQXV0b0RlbGV0ZUxhbWJkYXMpIHtcbiAgICAgIHRoaXMuY2xlYW51cFVuZGVybHlpbmdSZXNvdXJjZXMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsZWFudXBVbmRlcmx5aW5nUmVzb3VyY2VzKCkge1xuICAgIGNvbnN0IHByb3ZpZGVyID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZVByb3ZpZGVyKHRoaXMsIEFVVE9fREVMRVRFX1VOREVSTFlJTkdfUkVTT1VSQ0VTX1JFU09VUkNFX1RZUEUsIHtcbiAgICAgIGNvZGVEaXJlY3Rvcnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdjdXN0b20tcmVzb3VyY2UtaGFuZGxlcnMnLCAnZGlzdCcsICdhd3Mtc3ludGhldGljcy1hbHBoYScsICdhdXRvLWRlbGV0ZS11bmRlcmx5aW5nLXJlc291cmNlcy1oYW5kbGVyJyksXG4gICAgICB1c2VDZm5SZXNwb25zZVdyYXBwZXI6IGZhbHNlLFxuICAgICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgICBkZXNjcmlwdGlvbjogYExhbWJkYSBmdW5jdGlvbiBmb3IgYXV0by1kZWxldGluZyB1bmRlcmx5aW5nIHJlc291cmNlcyBjcmVhdGVkIGJ5ICR7dGhpcy5jYW5hcnlOYW1lfS5gLFxuICAgICAgcG9saWN5U3RhdGVtZW50czogW3tcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBBY3Rpb246IFsnbGFtYmRhOkRlbGV0ZUZ1bmN0aW9uJ10sXG4gICAgICAgIFJlc291cmNlOiB0aGlzLmxhbWJkYUFybigpLFxuICAgICAgfSwge1xuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIEFjdGlvbjogWydzeW50aGV0aWNzOkdldENhbmFyeSddLFxuICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ0F1dG9EZWxldGVVbmRlcmx5aW5nUmVzb3VyY2VzQ3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICByZXNvdXJjZVR5cGU6IEFVVE9fREVMRVRFX1VOREVSTFlJTkdfUkVTT1VSQ0VTX1JFU09VUkNFX1RZUEUsXG4gICAgICBzZXJ2aWNlVG9rZW46IHByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgQ2FuYXJ5TmFtZTogdGhpcy5jYW5hcnlOYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdlIGFsc28gdGFnIHRoZSBjYW5hcnkgdG8gcmVjb3JkIHRoZSBmYWN0IHRoYXQgd2Ugd2FudCBpdCBhdXRvZGVsZXRlZC5cbiAgICAvLyBUaGUgY3VzdG9tIHJlc291cmNlIHdpbGwgY2hlY2sgdGhpcyB0YWcgYmVmb3JlIGFjdHVhbGx5IGRvaW5nIHRoZSBkZWxldGUuXG4gICAgLy8gQmVjYXVzZSB0YWdnaW5nIGFuZCB1bnRhZ2dpbmcgd2lsbCBBTFdBWVMgaGFwcGVuIGJlZm9yZSB0aGUgQ1IgaXMgZGVsZXRlZCxcbiAgICAvLyB3ZSBjYW4gc2V0IGBhdXRvRGVsZXRlTGFtYmRhOiBmYWxzZWAgd2l0aG91dCB0aGUgcmVtb3ZhbCBvZiB0aGUgQ1IgZW1wdHlpbmdcbiAgICAvLyB0aGUgbGFtYmRhIGFzIGEgc2lkZSBlZmZlY3QuXG4gICAgY2RrLlRhZ3Mub2YodGhpcy5fcmVzb3VyY2UpLmFkZChBVVRPX0RFTEVURV9VTkRFUkxZSU5HX1JFU09VUkNFU19UQUcsICd0cnVlJyk7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXNzIHRoZSBDb25uZWN0aW9ucyBvYmplY3RcbiAgICpcbiAgICogV2lsbCBmYWlsIGlmIG5vdCBhIFZQQy1lbmFibGVkIENhbmFyeVxuICAgKi9cbiAgcHVibGljIGdldCBjb25uZWN0aW9ucygpOiBlYzIuQ29ubmVjdGlvbnMge1xuICAgIGlmICghdGhpcy5fY29ubmVjdGlvbnMpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgVlBDLWFzc29jaWF0ZWQgQ2FuYXJpZXMgaGF2ZSBzZWN1cml0eSBncm91cHMgdG8gbWFuYWdlLiBTdXBwbHkgdGhlIFwidnBjXCIgcGFyYW1ldGVyIHdoZW4gY3JlYXRpbmcgdGhlIENhbmFyeS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lYXN1cmUgdGhlIER1cmF0aW9uIG9mIGEgc2luZ2xlIGNhbmFyeSBydW4sIGluIHNlY29uZHMuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgbWV0cmljXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZyBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0R1cmF0aW9uKG9wdGlvbnM/OiBNZXRyaWNPcHRpb25zKTogTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IE1ldHJpYyh7XG4gICAgICAuLi5DbG91ZFdhdGNoU3ludGhldGljc01ldHJpY3MuZHVyYXRpb25NYXhpbXVtKHsgQ2FuYXJ5TmFtZTogdGhpcy5jYW5hcnlOYW1lIH0pLFxuICAgICAgLi4ueyBzdGF0aXN0aWM6ICdBdmVyYWdlJyB9LFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZWFzdXJlIHRoZSBwZXJjZW50YWdlIG9mIHN1Y2Nlc3NmdWwgY2FuYXJ5IHJ1bnMuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgbWV0cmljXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZyBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1N1Y2Nlc3NQZXJjZW50KG9wdGlvbnM/OiBNZXRyaWNPcHRpb25zKTogTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQ2xvdWRXYXRjaFN5bnRoZXRpY3NNZXRyaWNzLnN1Y2Nlc3NQZXJjZW50QXZlcmFnZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogTWVhc3VyZSB0aGUgbnVtYmVyIG9mIGZhaWxlZCBjYW5hcnkgcnVucyBvdmVyIGEgZ2l2ZW4gdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIERlZmF1bHQ6IHN1bSBvdmVyIDUgbWludXRlc1xuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0ZhaWxlZChvcHRpb25zPzogTWV0cmljT3B0aW9ucyk6IE1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKENsb3VkV2F0Y2hTeW50aGV0aWNzTWV0cmljcy5mYWlsZWRTdW0sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBkZWZhdWx0IHJvbGUgZm9yIHRoZSBjYW5hcnlcbiAgICovXG4gIHByaXZhdGUgY3JlYXRlRGVmYXVsdFJvbGUocHJvcHM6IENhbmFyeVByb3BzKTogaWFtLklSb2xlIHtcbiAgICBjb25zdCBwcmVmaXggPSBwcm9wcy5hcnRpZmFjdHNCdWNrZXRMb2NhdGlvbj8ucHJlZml4O1xuXG4gICAgLy8gQ3JlYXRlZCByb2xlIHdpbGwgbmVlZCB0aGVzZSBwb2xpY2llcyB0byBydW4gdGhlIENhbmFyeS5cbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3ludGhldGljcy1jYW5hcnkuaHRtbCNjZm4tc3ludGhldGljcy1jYW5hcnktZXhlY3V0aW9ucm9sZWFyblxuICAgIGNvbnN0IHBvbGljeSA9IG5ldyBpYW0uUG9saWN5RG9jdW1lbnQoe1xuICAgICAgc3RhdGVtZW50czogW1xuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RBbGxNeUJ1Y2tldHMnXSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICByZXNvdXJjZXM6IFt0aGlzLmFydGlmYWN0c0J1Y2tldC5idWNrZXRBcm5dLFxuICAgICAgICAgIGFjdGlvbnM6IFsnczM6R2V0QnVja2V0TG9jYXRpb24nXSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICByZXNvdXJjZXM6IFt0aGlzLmFydGlmYWN0c0J1Y2tldC5hcm5Gb3JPYmplY3RzKGAke3ByZWZpeCA/IHByZWZpeCsnLyonIDogJyonfWApXSxcbiAgICAgICAgICBhY3Rpb25zOiBbJ3MzOlB1dE9iamVjdCddLFxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgICAgYWN0aW9uczogWydjbG91ZHdhdGNoOlB1dE1ldHJpY0RhdGEnXSxcbiAgICAgICAgICBjb25kaXRpb25zOiB7IFN0cmluZ0VxdWFsczogeyAnY2xvdWR3YXRjaDpuYW1lc3BhY2UnOiAnQ2xvdWRXYXRjaFN5bnRoZXRpY3MnIH0gfSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICByZXNvdXJjZXM6IFt0aGlzLmxvZ0dyb3VwQXJuKCldLFxuICAgICAgICAgIGFjdGlvbnM6IFsnbG9nczpDcmVhdGVMb2dTdHJlYW0nLCAnbG9nczpDcmVhdGVMb2dHcm91cCcsICdsb2dzOlB1dExvZ0V2ZW50cyddLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBtYW5hZ2VkUG9saWNpZXM6IGlhbS5JTWFuYWdlZFBvbGljeVtdID0gW107XG5cbiAgICBpZiAocHJvcHMudnBjKSB7XG4gICAgICAvLyBQb2xpY3kgdGhhdCB3aWxsIGhhdmUgRU5JIGNyZWF0aW9uIHBlcm1pc3Npb25zXG4gICAgICBtYW5hZ2VkUG9saWNpZXMucHVzaChpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFWUENBY2Nlc3NFeGVjdXRpb25Sb2xlJykpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgaWFtLlJvbGUodGhpcywgJ1NlcnZpY2VSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICBpbmxpbmVQb2xpY2llczoge1xuICAgICAgICBjYW5hcnlQb2xpY3k6IHBvbGljeSxcbiAgICAgIH0sXG4gICAgICBtYW5hZ2VkUG9saWNpZXMsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGxvZ0dyb3VwQXJuKCkge1xuICAgIHJldHVybiBjZGsuU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdsb2dzJyxcbiAgICAgIHJlc291cmNlOiAnbG9nLWdyb3VwJyxcbiAgICAgIGFybkZvcm1hdDogY2RrLkFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgICAgcmVzb3VyY2VOYW1lOiAnL2F3cy9sYW1iZGEvY3dzeW4tKicsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGxhbWJkYUFybigpIHtcbiAgICByZXR1cm4gY2RrLlN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnbGFtYmRhJyxcbiAgICAgIHJlc291cmNlOiAnZnVuY3Rpb24nLFxuICAgICAgYXJuRm9ybWF0OiBjZGsuQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgICByZXNvdXJjZU5hbWU6ICdjd3N5bi0qJyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjb2RlIG9iamVjdCB0YWtlbiBpbiBieSB0aGUgY2FuYXJ5IHJlc291cmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVDb2RlKHByb3BzOiBDYW5hcnlQcm9wcyk6IENmbkNhbmFyeS5Db2RlUHJvcGVydHkge1xuICAgIHRoaXMudmFsaWRhdGVIYW5kbGVyKHByb3BzLnRlc3QuaGFuZGxlciwgcHJvcHMucnVudGltZSk7XG4gICAgY29uc3QgY29kZUNvbmZpZyA9IHtcbiAgICAgIGhhbmRsZXI6IHByb3BzLnRlc3QuaGFuZGxlcixcbiAgICAgIC4uLnByb3BzLnRlc3QuY29kZS5iaW5kKHRoaXMsIHByb3BzLnRlc3QuaGFuZGxlciwgcHJvcHMucnVudGltZS5mYW1pbHkpLFxuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgIGhhbmRsZXI6IGNvZGVDb25maWcuaGFuZGxlcixcbiAgICAgIHNjcmlwdDogY29kZUNvbmZpZy5pbmxpbmVDb2RlLFxuICAgICAgczNCdWNrZXQ6IGNvZGVDb25maWcuczNMb2NhdGlvbj8uYnVja2V0TmFtZSxcbiAgICAgIHMzS2V5OiBjb2RlQ29uZmlnLnMzTG9jYXRpb24/Lm9iamVjdEtleSxcbiAgICAgIHMzT2JqZWN0VmVyc2lvbjogY29kZUNvbmZpZy5zM0xvY2F0aW9uPy5vYmplY3RWZXJzaW9uLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVmVyaWZpZXMgdGhhdCB0aGUgaGFuZGxlciBuYW1lIG1hdGNoZXMgdGhlIGNvbnZlbnRpb25zIGdpdmVuIGEgY2VydGFpbiBydW50aW1lLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXN5bnRoZXRpY3MtY2FuYXJ5LWNvZGUuaHRtbCNjZm4tc3ludGhldGljcy1jYW5hcnktY29kZS1oYW5kbGVyXG4gICAqIEBwYXJhbSBoYW5kbGVyIC0gdGhlIG5hbWUgb2YgdGhlIGhhbmRsZXJcbiAgICogQHBhcmFtIHJ1bnRpbWUgLSB0aGUgcnVudGltZSB2ZXJzaW9uXG4gICAqL1xuICBwcml2YXRlIHZhbGlkYXRlSGFuZGxlcihoYW5kbGVyOiBzdHJpbmcsIHJ1bnRpbWU6IFJ1bnRpbWUpIHtcbiAgICBjb25zdCBvbGRSdW50aW1lcyA9IFtcbiAgICAgIFJ1bnRpbWUuU1lOVEhFVElDU19QWVRIT05fU0VMRU5JVU1fMV8wLFxuICAgICAgUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM18wLFxuICAgICAgUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM18xLFxuICAgICAgUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM18yLFxuICAgICAgUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM18zLFxuICAgIF07XG4gICAgaWYgKG9sZFJ1bnRpbWVzLmluY2x1ZGVzKHJ1bnRpbWUpKSB7XG4gICAgICBpZiAoIWhhbmRsZXIubWF0Y2goL15bMC05QS1aYS16X1xcXFwtXStcXC5oYW5kbGVyKiQvKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbmFyeSBIYW5kbGVyIG11c3QgYmUgc3BlY2lmaWVkIGFzIFxcJ2ZpbGVOYW1lLmhhbmRsZXJcXCcgZm9yIGxlZ2FjeSBydW50aW1lcywgcmVjZWl2ZWQgJHtoYW5kbGVyfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWhhbmRsZXIubWF0Y2goL14oWzAtOWEtekEtWl8tXStcXC8pKlswLTlBLVphLXpfXFxcXC1dK1xcLltBLVphLXpfXVtBLVphLXowLTlfXSokLykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5hcnkgSGFuZGxlciBtdXN0IGJlIHNwZWNpZmllZCBlaXRoZXIgYXMgXFwnZmlsZU5hbWUuaGFuZGxlclxcJywgXFwnZmlsZU5hbWUuZnVuY3Rpb25OYW1lXFwnLCBvciBcXCdmb2xkZXIvZmlsZU5hbWUuZnVuY3Rpb25OYW1lXFwnLCByZWNlaXZlZCAke2hhbmRsZXJ9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChoYW5kbGVyLmxlbmd0aCA8IDEgfHwgaGFuZGxlci5sZW5ndGggPiAxMjgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2FuYXJ5IEhhbmRsZXIgbGVuZ3RoIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAxMjgsIHJlY2VpdmVkICR7aGFuZGxlci5sZW5ndGh9YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVSdW5Db25maWcocHJvcHM6IENhbmFyeVByb3BzKTogQ2ZuQ2FuYXJ5LlJ1bkNvbmZpZ1Byb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXByb3BzLmVudmlyb25tZW50VmFyaWFibGVzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHByb3BzLmVudmlyb25tZW50VmFyaWFibGVzLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNhbmFyeSBzY2hlZHVsZSBvYmplY3RcbiAgICovXG4gIHByaXZhdGUgY3JlYXRlU2NoZWR1bGUocHJvcHM6IENhbmFyeVByb3BzKTogQ2ZuQ2FuYXJ5LlNjaGVkdWxlUHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICBkdXJhdGlvbkluU2Vjb25kczogU3RyaW5nKGAke3Byb3BzLnRpbWVUb0xpdmU/LnRvU2Vjb25kcygpID8/IDB9YCksXG4gICAgICBleHByZXNzaW9uOiBwcm9wcy5zY2hlZHVsZT8uZXhwcmVzc2lvblN0cmluZyA/PyAncmF0ZSg1IG1pbnV0ZXMpJyxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVWcGNDb25maWcocHJvcHM6IENhbmFyeVByb3BzKTogQ2ZuQ2FuYXJ5LlZQQ0NvbmZpZ1Byb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXByb3BzLnZwYykge1xuICAgICAgaWYgKHByb3BzLnZwY1N1Ym5ldHMgIT0gbnVsbCB8fCBwcm9wcy5zZWN1cml0eUdyb3VwcyAhPSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IHByb3ZpZGUgdGhlICd2cGMnIHByb3Agd2hlbiB1c2luZyBWUEMtcmVsYXRlZCBwcm9wZXJ0aWVzLlwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCB7IHN1Ym5ldElkcyB9ID0gcHJvcHMudnBjLnNlbGVjdFN1Ym5ldHMocHJvcHMudnBjU3VibmV0cyk7XG4gICAgaWYgKHN1Ym5ldElkcy5sZW5ndGggPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG1hdGNoaW5nIHN1Ym5ldHMgZm91bmQgaW4gdGhlIFZQQy4nKTtcbiAgICB9XG5cbiAgICBsZXQgc2VjdXJpdHlHcm91cHM6IGVjMi5JU2VjdXJpdHlHcm91cFtdO1xuICAgIGlmIChwcm9wcy5zZWN1cml0eUdyb3VwcyAmJiBwcm9wcy5zZWN1cml0eUdyb3Vwcy5sZW5ndGggPiAwKSB7XG4gICAgICBzZWN1cml0eUdyb3VwcyA9IHByb3BzLnNlY3VyaXR5R3JvdXBzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdTZWN1cml0eUdyb3VwJywge1xuICAgICAgICB2cGM6IHByb3BzLnZwYyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWMgc2VjdXJpdHkgZ3JvdXAgZm9yIENhbmFyeSAnICsgY2RrLk5hbWVzLnVuaXF1ZUlkKHRoaXMpLFxuICAgICAgfSk7XG4gICAgICBzZWN1cml0eUdyb3VwcyA9IFtzZWN1cml0eUdyb3VwXTtcbiAgICB9XG4gICAgdGhpcy5fY29ubmVjdGlvbnMhLmFkZFNlY3VyaXR5R3JvdXAoLi4uc2VjdXJpdHlHcm91cHMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZwY0lkOiBwcm9wcy52cGMudnBjSWQsXG4gICAgICBzdWJuZXRJZHMsXG4gICAgICBzZWN1cml0eUdyb3VwSWRzOiBjZGsuTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5jb25uZWN0aW9ucy5zZWN1cml0eUdyb3Vwcy5tYXAoc2cgPT4gc2cuc2VjdXJpdHlHcm91cElkKSB9KSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB1bmlxdWUgbmFtZSBmb3IgdGhlIGNhbmFyeS4gVGhlIGdlbmVyYXRlZCBuYW1lIGlzIHRoZSBwaHlzaWNhbCBJRCBvZiB0aGUgY2FuYXJ5LlxuICAgKi9cbiAgcHJpdmF0ZSBnZW5lcmF0ZVVuaXF1ZU5hbWUoKTogc3RyaW5nIHtcbiAgICBjb25zdCBuYW1lID0gY2RrLk5hbWVzLnVuaXF1ZUlkKHRoaXMpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnICcsICctJyk7XG4gICAgaWYgKG5hbWUubGVuZ3RoIDw9IDIxKSB7XG4gICAgICByZXR1cm4gbmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyaW5nKDAsIDE1KSArIG5hbWVIYXNoKG5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2FubmVkTWV0cmljKFxuICAgIGZuOiAoZGltczogeyBDYW5hcnlOYW1lOiBzdHJpbmcgfSkgPT4gTWV0cmljUHJvcHMsXG4gICAgcHJvcHM/OiBNZXRyaWNPcHRpb25zKTogTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IE1ldHJpYyh7XG4gICAgICAuLi5mbih7IENhbmFyeU5hbWU6IHRoaXMuY2FuYXJ5TmFtZSB9KSxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG59XG5cbi8qKlxuICogVGFrZSBhIGhhc2ggb2YgdGhlIGdpdmVuIG5hbWUuXG4gKlxuICogQHBhcmFtIG5hbWUgdGhlIG5hbWUgdG8gYmUgaGFzaGVkXG4gKi9cbmZ1bmN0aW9uIG5hbWVIYXNoKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IG1kNSA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUobmFtZSkuZGlnZXN0KCdoZXgnKTtcbiAgcmV0dXJuIG1kNS5zbGljZSgwLCA2KTtcbn1cblxuY29uc3QgbmFtZVJlZ2V4OiBSZWdFeHAgPSAvXlswLTlhLXpfXFwtXSskLztcblxuLyoqXG4gKiBWZXJpZmllcyB0aGF0IHRoZSBuYW1lIGZpdHMgdGhlIHJlZ2V4IGV4cHJlc3Npb246IF5bMC05YS16X1xcLV0rJC5cbiAqXG4gKiBAcGFyYW0gbmFtZSAtIHRoZSBnaXZlbiBuYW1lIG9mIHRoZSBjYW5hcnlcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVOYW1lKG5hbWU6IHN0cmluZykge1xuICBpZiAobmFtZS5sZW5ndGggPiAyMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2FuYXJ5IG5hbWUgaXMgdG9vIGxhcmdlLCBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMjEgY2hhcmFjdGVycywgYnV0IGlzICR7bmFtZS5sZW5ndGh9IChnb3QgXCIke25hbWV9XCIpYCk7XG4gIH1cbiAgaWYgKCFuYW1lUmVnZXgudGVzdChuYW1lKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2FuYXJ5IG5hbWUgbXVzdCBiZSBsb3dlcmNhc2UsIG51bWJlcnMsIGh5cGhlbnMsIG9yIHVuZGVyc2NvcmVzIChnb3QgXCIke25hbWV9XCIpYCk7XG4gIH1cbn1cbiJdfQ==