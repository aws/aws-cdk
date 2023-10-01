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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuYXJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FuYXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlDQUFpQztBQUNqQywrREFBZ0Y7QUFDaEYsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyx5Q0FBeUM7QUFDekMsd0NBQXdDO0FBR3hDLHVDQUFvQztBQUVwQyw0SEFBaUg7QUFDakgsK0RBQXVEO0FBQ3ZELDJDQUF5RztBQUN6Ryw2QkFBNkI7QUFFN0IsTUFBTSw4Q0FBOEMsR0FBRyxpREFBaUQsQ0FBQztBQUN6RyxNQUFNLG9DQUFvQyxHQUFHLDBDQUEwQyxDQUFDO0FBRXhGOztHQUVHO0FBQ0gsTUFBYSxJQUFJO0lBQ2Y7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQTBCOzs7Ozs7Ozs7O1FBQzdDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDaEQ7SUFFRDs7Ozs7T0FLRztJQUNILFlBQW9DLElBQVUsRUFBa0IsT0FBZTtRQUEzQyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQWtCLFlBQU8sR0FBUCxPQUFPLENBQVE7S0FDOUU7O0FBbEJILG9CQW1CQzs7O0FBaUJEOzs7R0FHRztBQUNILElBQVksT0FhWDtBQWJELFdBQVksT0FBTztJQUNqQjs7O09BR0c7SUFDSCw4QkFBbUIsQ0FBQTtJQUVuQjs7OztPQUlHO0lBQ0gsNEJBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQWJXLE9BQU8sdUJBQVAsT0FBTyxRQWFsQjtBQTBLRDs7R0FFRztBQUNILE1BQWEsTUFBTyxTQUFRLEdBQUcsQ0FBQyxRQUFRO0lBc0N0QyxZQUFtQixLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjs7Ozs7OytDQXRDeEQsTUFBTTs7OztRQXVDZixJQUFJLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FB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QUU7UUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RUFBeUUsSUFBSSxDQUFDLE1BQU0sVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDO0tBQ3pIO0lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RUFBeUUsSUFBSSxJQUFJLENBQUMsQ0FBQztLQUNwRztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7IE1ldHJpYywgTWV0cmljT3B0aW9ucywgTWV0cmljUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDb2RlIH0gZnJvbSAnLi9jb2RlJztcbmltcG9ydCB7IFJ1bnRpbWUgfSBmcm9tICcuL3J1bnRpbWUnO1xuaW1wb3J0IHsgU2NoZWR1bGUgfSBmcm9tICcuL3NjaGVkdWxlJztcbmltcG9ydCB7IENsb3VkV2F0Y2hTeW50aGV0aWNzTWV0cmljcyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zeW50aGV0aWNzL2xpYi9zeW50aGV0aWNzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBDZm5DYW5hcnkgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3ludGhldGljcyc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciwgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IEFVVE9fREVMRVRFX1VOREVSTFlJTkdfUkVTT1VSQ0VTX1JFU09VUkNFX1RZUEUgPSAnQ3VzdG9tOjpTeW50aGV0aWNzQXV0b0RlbGV0ZVVuZGVybHlpbmdSZXNvdXJjZXMnO1xuY29uc3QgQVVUT19ERUxFVEVfVU5ERVJMWUlOR19SRVNPVVJDRVNfVEFHID0gJ2F3cy1jZGs6YXV0by1kZWxldGUtdW5kZXJseWluZy1yZXNvdXJjZXMnO1xuXG4vKipcbiAqIFNwZWNpZnkgYSB0ZXN0IHRoYXQgdGhlIGNhbmFyeSBzaG91bGQgcnVuXG4gKi9cbmV4cG9ydCBjbGFzcyBUZXN0IHtcbiAgLyoqXG4gICAqIFNwZWNpZnkgYSBjdXN0b20gdGVzdCB3aXRoIHlvdXIgb3duIGNvZGVcbiAgICpcbiAgICogQHJldHVybnMgYFRlc3RgIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIENvZGUgb2JqZWN0XG4gICAqIEBwYXJhbSBvcHRpb25zIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY3VzdG9tKG9wdGlvbnM6IEN1c3RvbVRlc3RPcHRpb25zKTogVGVzdCB7XG4gICAgcmV0dXJuIG5ldyBUZXN0KG9wdGlvbnMuY29kZSwgb3B0aW9ucy5oYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBUZXN0IHByb3BlcnR5XG4gICAqXG4gICAqIEBwYXJhbSBjb2RlIFRoZSBjb2RlIHRoYXQgdGhlIGNhbmFyeSBzaG91bGQgcnVuXG4gICAqIEBwYXJhbSBoYW5kbGVyIFRoZSBoYW5kbGVyIG9mIHRoZSBjYW5hcnlcbiAgICovXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGNvZGU6IENvZGUsIHB1YmxpYyByZWFkb25seSBoYW5kbGVyOiBzdHJpbmcpIHtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIHNwZWNpZnlpbmcgYSB0ZXN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tVGVzdE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGNvZGUgb2YgdGhlIGNhbmFyeSBzY3JpcHRcbiAgICovXG4gIHJlYWRvbmx5IGNvZGU6IENvZGUsXG5cbiAgLyoqXG4gICAqIFRoZSBoYW5kbGVyIGZvciB0aGUgY29kZS4gTXVzdCBlbmQgd2l0aCBgLmhhbmRsZXJgLlxuICAgKi9cbiAgcmVhZG9ubHkgaGFuZGxlcjogc3RyaW5nLFxufVxuXG4vKipcbiAqIERpZmZlcmVudCB3YXlzIHRvIGNsZWFuIHVwIHVuZGVybHlpbmcgQ2FuYXJ5IHJlc291cmNlc1xuICogd2hlbiB0aGUgQ2FuYXJ5IGlzIGRlbGV0ZWQuXG4gKi9cbmV4cG9ydCBlbnVtIENsZWFudXAge1xuICAvKipcbiAgICogQ2xlYW4gdXAgbm90aGluZy4gVGhlIHVzZXIgaXMgcmVzcG9uc2libGUgZm9yIGNsZWFuaW5nIHVwXG4gICAqIGFsbCByZXNvdXJjZXMgbGVmdCBiZWhpbmQgYnkgdGhlIENhbmFyeS5cbiAgICovXG4gIE5PVEhJTkcgPSAnbm90aGluZycsXG5cbiAgLyoqXG4gICAqIENsZWFuIHVwIHRoZSB1bmRlcmx5aW5nIExhbWJkYSBmdW5jdGlvbiBvbmx5LiBUaGUgdXNlciBpc1xuICAgKiByZXNwb25zaWJsZSBmb3IgY2xlYW5pbmcgdXAgYWxsIG90aGVyIHJlc291cmNlcyBsZWZ0IGJlaGluZFxuICAgKiBieSB0aGUgQ2FuYXJ5LlxuICAgKi9cbiAgTEFNQkRBID0gJ2xhbWJkYScsXG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3Igc3BlY2lmeWluZyB0aGUgczMgbG9jYXRpb24gdGhhdCBzdG9yZXMgdGhlIGRhdGEgb2YgZWFjaCBjYW5hcnkgcnVuLiBUaGUgYXJ0aWZhY3RzIGJ1Y2tldCBsb2NhdGlvbiAqKmNhbm5vdCoqXG4gKiBiZSB1cGRhdGVkIG9uY2UgdGhlIGNhbmFyeSBpcyBjcmVhdGVkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFydGlmYWN0c0J1Y2tldExvY2F0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBzMyBsb2NhdGlvbiB0aGF0IHN0b3JlcyB0aGUgZGF0YSBvZiBlYWNoIHJ1bi5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldDogczMuSUJ1Y2tldDtcblxuICAvKipcbiAgICogVGhlIFMzIGJ1Y2tldCBwcmVmaXguIFNwZWNpZnkgdGhpcyBpZiB5b3Ugd2FudCBhIG1vcmUgc3BlY2lmaWMgcGF0aCB3aXRoaW4gdGhlIGFydGlmYWN0cyBidWNrZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gcHJlZml4XG4gICAqL1xuICByZWFkb25seSBwcmVmaXg/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBjYW5hcnlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDYW5hcnlQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgczMgbG9jYXRpb24gdGhhdCBzdG9yZXMgdGhlIGRhdGEgb2YgdGhlIGNhbmFyeSBydW5zLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbmV3IHMzIGJ1Y2tldCB3aWxsIGJlIGNyZWF0ZWQgd2l0aG91dCBhIHByZWZpeC5cbiAgICovXG4gIHJlYWRvbmx5IGFydGlmYWN0c0J1Y2tldExvY2F0aW9uPzogQXJ0aWZhY3RzQnVja2V0TG9jYXRpb247XG5cbiAgLyoqXG4gICAqIENhbmFyeSBleGVjdXRpb24gcm9sZS5cbiAgICpcbiAgICogVGhpcyBpcyB0aGUgcm9sZSB0aGF0IHdpbGwgYmUgYXNzdW1lZCBieSB0aGUgY2FuYXJ5IHVwb24gZXhlY3V0aW9uLlxuICAgKiBJdCBjb250cm9scyB0aGUgcGVybWlzc2lvbnMgdGhhdCB0aGUgY2FuYXJ5IHdpbGwgaGF2ZS4gVGhlIHJvbGUgbXVzdFxuICAgKiBiZSBhc3N1bWFibGUgYnkgdGhlIEFXUyBMYW1iZGEgc2VydmljZSBwcmluY2lwYWwuXG4gICAqXG4gICAqIElmIG5vdCBzdXBwbGllZCwgYSByb2xlIHdpbGwgYmUgY3JlYXRlZCB3aXRoIGFsbCB0aGUgcmVxdWlyZWQgcGVybWlzc2lvbnMuXG4gICAqIElmIHlvdSBwcm92aWRlIGEgUm9sZSwgeW91IG11c3QgYWRkIHRoZSByZXF1aXJlZCBwZXJtaXNzaW9ucy5cbiAgICpcbiAgICogQHNlZSByZXF1aXJlZCBwZXJtaXNzaW9uczogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN5bnRoZXRpY3MtY2FuYXJ5Lmh0bWwjY2ZuLXN5bnRoZXRpY3MtY2FuYXJ5LWV4ZWN1dGlvbnJvbGVhcm5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIHVuaXF1ZSByb2xlIHdpbGwgYmUgZ2VuZXJhdGVkIGZvciB0aGlzIGNhbmFyeS5cbiAgICogWW91IGNhbiBhZGQgcGVybWlzc2lvbnMgdG8gcm9sZXMgYnkgY2FsbGluZyAnYWRkVG9Sb2xlUG9saWN5Jy5cbiAgICovXG4gIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIEhvdyBsb25nIHRoZSBjYW5hcnkgd2lsbCBiZSBpbiBhICdSVU5OSU5HJyBzdGF0ZS4gRm9yIGV4YW1wbGUsIGlmIHlvdSBzZXQgYHRpbWVUb0xpdmVgIHRvIGJlIDEgaG91ciBhbmQgYHNjaGVkdWxlYCB0byBiZSBgcmF0ZSgxMCBtaW51dGVzKWAsXG4gICAqIHlvdXIgY2FuYXJ5IHdpbGwgcnVuIGF0IDEwIG1pbnV0ZSBpbnRlcnZhbHMgZm9yIGFuIGhvdXIsIGZvciBhIHRvdGFsIG9mIDYgdGltZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gbGltaXRcbiAgICovXG4gIHJlYWRvbmx5IHRpbWVUb0xpdmU/OiBjZGsuRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIHNjaGVkdWxlIGZvciBob3cgb2Z0ZW4gdGhlIGNhbmFyeSBydW5zLiBGb3IgZXhhbXBsZSwgaWYgeW91IHNldCBgc2NoZWR1bGVgIHRvIGByYXRlKDEwIG1pbnV0ZXMpYCwgdGhlbiB0aGUgY2FuYXJ5IHdpbGwgcnVuIGV2ZXJ5IDEwIG1pbnV0ZXMuXG4gICAqIFlvdSBjYW4gc2V0IHRoZSBzY2hlZHVsZSB3aXRoIGBTY2hlZHVsZS5yYXRlKER1cmF0aW9uKWAgKHJlY29tbWVuZGVkKSBvciB5b3UgY2FuIHNwZWNpZnkgYW4gZXhwcmVzc2lvbiB1c2luZyBgU2NoZWR1bGUuZXhwcmVzc2lvbigpYC5cbiAgICogQGRlZmF1bHQgJ3JhdGUoNSBtaW51dGVzKSdcbiAgICovXG4gIHJlYWRvbmx5IHNjaGVkdWxlPzogU2NoZWR1bGU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBjYW5hcnkgc2hvdWxkIHN0YXJ0IGFmdGVyIGNyZWF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBzdGFydEFmdGVyQ3JlYXRpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBIb3cgbWFueSBkYXlzIHNob3VsZCBzdWNjZXNzZnVsIHJ1bnMgYmUgcmV0YWluZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLmRheXMoMzEpXG4gICAqL1xuICByZWFkb25seSBzdWNjZXNzUmV0ZW50aW9uUGVyaW9kPzogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBIb3cgbWFueSBkYXlzIHNob3VsZCBmYWlsZWQgcnVucyBiZSByZXRhaW5lZC5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24uZGF5cygzMSlcbiAgICovXG4gIHJlYWRvbmx5IGZhaWx1cmVSZXRlbnRpb25QZXJpb2Q/OiBjZGsuRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBjYW5hcnkuIEJlIHN1cmUgdG8gZ2l2ZSBpdCBhIGRlc2NyaXB0aXZlIG5hbWUgdGhhdCBkaXN0aW5ndWlzaGVzIGl0IGZyb21cbiAgICogb3RoZXIgY2FuYXJpZXMgaW4geW91ciBhY2NvdW50LlxuICAgKlxuICAgKiBEbyBub3QgaW5jbHVkZSBzZWNyZXRzIG9yIHByb3ByaWV0YXJ5IGluZm9ybWF0aW9uIGluIHlvdXIgY2FuYXJ5IG5hbWUuIFRoZSBjYW5hcnkgbmFtZVxuICAgKiBtYWtlcyB1cCBwYXJ0IG9mIHRoZSBjYW5hcnkgQVJOLCB3aGljaCBpcyBpbmNsdWRlZCBpbiBvdXRib3VuZCBjYWxscyBvdmVyIHRoZSBpbnRlcm5ldC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbW9uaXRvcmluZy9zZXJ2aWNlbGVuc19jYW5hcmllc19zZWN1cml0eS5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSB1bmlxdWUgbmFtZSB3aWxsIGJlIGdlbmVyYXRlZCBmcm9tIHRoZSBjb25zdHJ1Y3QgSURcbiAgICovXG4gIHJlYWRvbmx5IGNhbmFyeU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIHJ1bnRpbWUgdmVyc2lvbiB0byB1c2UgZm9yIHRoZSBjYW5hcnkuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvQ2xvdWRXYXRjaF9TeW50aGV0aWNzX0NhbmFyaWVzX0xpYnJhcnkuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgcnVudGltZTogUnVudGltZTtcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGVzdCB0aGF0IHlvdSB3YW50IHlvdXIgY2FuYXJ5IHRvIHJ1bi4gVXNlIGBUZXN0LmN1c3RvbSgpYCB0byBzcGVjaWZ5IHRoZSB0ZXN0IHRvIHJ1bi5cbiAgICovXG4gIHJlYWRvbmx5IHRlc3Q6IFRlc3Q7XG5cbiAgLyoqXG4gICAqIEtleS12YWx1ZSBwYWlycyB0aGF0IHRoZSBTeW50aGV0aWNzIGNhY2hlcyBhbmQgbWFrZXMgYXZhaWxhYmxlIGZvciB5b3VyIGNhbmFyeSBzY3JpcHRzLiBVc2UgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAqIHRvIGFwcGx5IGNvbmZpZ3VyYXRpb24gY2hhbmdlcywgc3VjaCBhcyB0ZXN0IGFuZCBwcm9kdWN0aW9uIGVudmlyb25tZW50IGNvbmZpZ3VyYXRpb25zLCB3aXRob3V0IGNoYW5naW5nIHlvdXJcbiAgICogQ2FuYXJ5IHNjcmlwdCBzb3VyY2UgY29kZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gICAqL1xuICByZWFkb25seSBlbnZpcm9ubWVudFZhcmlhYmxlcz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgd2hlcmUgdGhpcyBjYW5hcnkgaXMgcnVuLlxuICAgKlxuICAgKiBTcGVjaWZ5IHRoaXMgaWYgdGhlIGNhbmFyeSBuZWVkcyB0byBhY2Nlc3MgcmVzb3VyY2VzIGluIGEgVlBDLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vdCBpbiBWUENcbiAgICovXG4gIHJlYWRvbmx5IHZwYz86IGVjMi5JVnBjO1xuXG4gIC8qKlxuICAgKiBXaGVyZSB0byBwbGFjZSB0aGUgbmV0d29yayBpbnRlcmZhY2VzIHdpdGhpbiB0aGUgVlBDLiBZb3UgbXVzdCBwcm92aWRlIGB2cGNgIHdoZW4gdXNpbmcgdGhpcyBwcm9wLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBWcGMgZGVmYXVsdCBzdHJhdGVneSBpZiBub3Qgc3BlY2lmaWVkXG4gICAqL1xuICByZWFkb25seSB2cGNTdWJuZXRzPzogZWMyLlN1Ym5ldFNlbGVjdGlvbjtcblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2Ygc2VjdXJpdHkgZ3JvdXBzIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBjYW5hcnkncyBuZXR3b3JrIGludGVyZmFjZXMuIFlvdSBtdXN0IHByb3ZpZGUgYHZwY2Agd2hlbiB1c2luZyB0aGlzIHByb3AuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSWYgdGhlIGNhbmFyeSBpcyBwbGFjZWQgd2l0aGluIGEgVlBDIGFuZCBhIHNlY3VyaXR5IGdyb3VwIGlzXG4gICAqIG5vdCBzcGVjaWZpZWQgYSBkZWRpY2F0ZWQgc2VjdXJpdHkgZ3JvdXAgd2lsbCBiZSBjcmVhdGVkIGZvciB0aGlzIGNhbmFyeS5cbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBzPzogZWMyLklTZWN1cml0eUdyb3VwW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRvIGRlbGV0ZSB0aGUgbGFtYmRhIHJlc291cmNlcyB3aGVuIHRoZSBjYW5hcnkgaXMgZGVsZXRlZFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zeW50aGV0aWNzLWNhbmFyeS5odG1sI2Nmbi1zeW50aGV0aWNzLWNhbmFyeS1kZWxldGVsYW1iZGFyZXNvdXJjZXNvbmNhbmFyeWRlbGV0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEBkZXByZWNhdGVkIHRoaXMgZmVhdHVyZSBoYXMgYmVlbiBkZXByZWNhdGVkIGJ5IHRoZSBzZXJ2aWNlIHRlYW0sIHVzZSBgY2xlYW51cDogQ2xlYW51cC5MQU1CREFgIGluc3RlYWQgd2hpY2ggd2lsbCB1c2UgYSBDdXN0b20gUmVzb3VyY2UgdG8gYWNoaWV2ZSB0aGUgc2FtZSBlZmZlY3QuXG4gICAqL1xuICByZWFkb25seSBlbmFibGVBdXRvRGVsZXRlTGFtYmRhcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIHVuZGVybHlpbmcgcmVzb3VyY2VzIHRvIGJlIGNsZWFuZWQgdXAgd2hlbiB0aGUgY2FuYXJ5IGlzIGRlbGV0ZWQuXG4gICAqIFVzaW5nIGBDbGVhbnVwLkxBTUJEQWAgd2lsbCBjcmVhdGUgYSBDdXN0b20gUmVzb3VyY2UgdG8gYWNoaWV2ZSB0aGlzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBDbGVhbnVwLk5PVEhJTkdcbiAgICovXG4gIHJlYWRvbmx5IGNsZWFudXA/OiBDbGVhbnVwO1xuXG4gIC8qKlxuICAgKiBMaWZlY3ljbGUgcnVsZXMgZm9yIHRoZSBnZW5lcmF0ZWQgY2FuYXJ5IGFydGlmYWN0IGJ1Y2tldC4gSGFzIG5vIGVmZmVjdFxuICAgKiBpZiBhIGJ1Y2tldCBpcyBwYXNzZWQgdG8gYGFydGlmYWN0c0J1Y2tldExvY2F0aW9uYC4gSWYgeW91IHBhc3MgYSBidWNrZXRcbiAgICogdG8gYGFydGlmYWN0c0J1Y2tldExvY2F0aW9uYCwgeW91IGNhbiBhZGQgbGlmZWN5Y2xlIHJ1bGVzIHRvIHRoZSBidWNrZXRcbiAgICogaXRzZWxmLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHJ1bGVzIGFwcGxpZWQgdG8gdGhlIGdlbmVyYXRlZCBidWNrZXQuXG4gICAqL1xuICByZWFkb25seSBhcnRpZmFjdHNCdWNrZXRMaWZlY3ljbGVSdWxlcz86IEFycmF5PHMzLkxpZmVjeWNsZVJ1bGU+O1xufVxuXG4vKipcbiAqIERlZmluZSBhIG5ldyBDYW5hcnlcbiAqL1xuZXhwb3J0IGNsYXNzIENhbmFyeSBleHRlbmRzIGNkay5SZXNvdXJjZSBpbXBsZW1lbnRzIGVjMi5JQ29ubmVjdGFibGUge1xuICAvKipcbiAgICogRXhlY3V0aW9uIHJvbGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgQ2FuYXJ5LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGU6IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogVGhlIGNhbmFyeSBJRFxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2FuYXJ5SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHN0YXRlIG9mIHRoZSBjYW5hcnkuIEZvciBleGFtcGxlLCAnUlVOTklORycsICdTVE9QUEVEJywgJ05PVCBTVEFSVEVEJywgb3IgJ0VSUk9SJy5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNhbmFyeVN0YXRlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjYW5hcnkgTmFtZVxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2FuYXJ5TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBCdWNrZXQgd2hlcmUgZGF0YSBmcm9tIGVhY2ggY2FuYXJ5IHJ1biBpcyBzdG9yZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXJ0aWZhY3RzQnVja2V0OiBzMy5JQnVja2V0O1xuXG4gIC8qKlxuICAgKiBBY3R1YWwgY29ubmVjdGlvbnMgb2JqZWN0IGZvciB0aGUgdW5kZXJseWluZyBMYW1iZGFcbiAgICpcbiAgICogTWF5IGJlIHVuc2V0LCBpbiB3aGljaCBjYXNlIHRoZSBjYW5hcnkgTGFtYmRhIGlzIG5vdCBjb25maWd1cmVkIGZvciB1c2UgaW4gYSBWUEMuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfY29ubmVjdGlvbnM/OiBlYzIuQ29ubmVjdGlvbnM7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3Jlc291cmNlOiBDZm5DYW5hcnk7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDYW5hcnlQcm9wcykge1xuICAgIGlmIChwcm9wcy5jYW5hcnlOYW1lICYmICFjZGsuVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLmNhbmFyeU5hbWUpKSB7XG4gICAgICB2YWxpZGF0ZU5hbWUocHJvcHMuY2FuYXJ5TmFtZSk7XG4gICAgfVxuXG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmNhbmFyeU5hbWUgfHwgY2RrLkxhenkuc3RyaW5nKHtcbiAgICAgICAgcHJvZHVjZTogKCkgPT4gdGhpcy5nZW5lcmF0ZVVuaXF1ZU5hbWUoKSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hcnRpZmFjdHNCdWNrZXQgPSBwcm9wcy5hcnRpZmFjdHNCdWNrZXRMb2NhdGlvbj8uYnVja2V0ID8/IG5ldyBzMy5CdWNrZXQodGhpcywgJ0FydGlmYWN0c0J1Y2tldCcsIHtcbiAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TX01BTkFHRUQsXG4gICAgICBlbmZvcmNlU1NMOiB0cnVlLFxuICAgICAgbGlmZWN5Y2xlUnVsZXM6IHByb3BzLmFydGlmYWN0c0J1Y2tldExpZmVjeWNsZVJ1bGVzLFxuICAgIH0pO1xuXG4gICAgdGhpcy5yb2xlID0gcHJvcHMucm9sZSA/PyB0aGlzLmNyZWF0ZURlZmF1bHRSb2xlKHByb3BzKTtcblxuICAgIGlmIChwcm9wcy52cGMpIHtcbiAgICAgIC8vIFNlY3VyaXR5IEdyb3VwcyBhcmUgY3JlYXRlZCBhbmQvb3IgYXBwZW5kZWQgaW4gYGNyZWF0ZVZwY0NvbmZpZ2AuXG4gICAgICB0aGlzLl9jb25uZWN0aW9ucyA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoe30pO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlOiBDZm5DYW5hcnkgPSBuZXcgQ2ZuQ2FuYXJ5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGFydGlmYWN0UzNMb2NhdGlvbjogdGhpcy5hcnRpZmFjdHNCdWNrZXQuczNVcmxGb3JPYmplY3QocHJvcHMuYXJ0aWZhY3RzQnVja2V0TG9jYXRpb24/LnByZWZpeCksXG4gICAgICBleGVjdXRpb25Sb2xlQXJuOiB0aGlzLnJvbGUucm9sZUFybixcbiAgICAgIHN0YXJ0Q2FuYXJ5QWZ0ZXJDcmVhdGlvbjogcHJvcHMuc3RhcnRBZnRlckNyZWF0aW9uID8/IHRydWUsXG4gICAgICBydW50aW1lVmVyc2lvbjogcHJvcHMucnVudGltZS5uYW1lLFxuICAgICAgbmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBzY2hlZHVsZTogdGhpcy5jcmVhdGVTY2hlZHVsZShwcm9wcyksXG4gICAgICBmYWlsdXJlUmV0ZW50aW9uUGVyaW9kOiBwcm9wcy5mYWlsdXJlUmV0ZW50aW9uUGVyaW9kPy50b0RheXMoKSxcbiAgICAgIHN1Y2Nlc3NSZXRlbnRpb25QZXJpb2Q6IHByb3BzLnN1Y2Nlc3NSZXRlbnRpb25QZXJpb2Q/LnRvRGF5cygpLFxuICAgICAgY29kZTogdGhpcy5jcmVhdGVDb2RlKHByb3BzKSxcbiAgICAgIHJ1bkNvbmZpZzogdGhpcy5jcmVhdGVSdW5Db25maWcocHJvcHMpLFxuICAgICAgdnBjQ29uZmlnOiB0aGlzLmNyZWF0ZVZwY0NvbmZpZyhwcm9wcyksXG4gICAgfSk7XG4gICAgdGhpcy5fcmVzb3VyY2UgPSByZXNvdXJjZTtcblxuICAgIHRoaXMuY2FuYXJ5SWQgPSByZXNvdXJjZS5hdHRySWQ7XG4gICAgdGhpcy5jYW5hcnlTdGF0ZSA9IHJlc291cmNlLmF0dHJTdGF0ZTtcbiAgICB0aGlzLmNhbmFyeU5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuXG4gICAgaWYgKHByb3BzLmNsZWFudXAgPT09IENsZWFudXAuTEFNQkRBID8/IHByb3BzLmVuYWJsZUF1dG9EZWxldGVMYW1iZGFzKSB7XG4gICAgICB0aGlzLmNsZWFudXBVbmRlcmx5aW5nUmVzb3VyY2VzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbGVhbnVwVW5kZXJseWluZ1Jlc291cmNlcygpIHtcbiAgICBjb25zdCBwcm92aWRlciA9IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGVQcm92aWRlcih0aGlzLCBBVVRPX0RFTEVURV9VTkRFUkxZSU5HX1JFU09VUkNFU19SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBjb2RlRGlyZWN0b3J5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnY3VzdG9tLXJlc291cmNlLWhhbmRsZXJzJywgJ2Rpc3QnLCAnYXdzLXN5bnRoZXRpY3MtYWxwaGEnLCAnYXV0by1kZWxldGUtdW5kZXJseWluZy1yZXNvdXJjZXMtaGFuZGxlcicpLFxuICAgICAgdXNlQ2ZuUmVzcG9uc2VXcmFwcGVyOiBmYWxzZSxcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xOF9YLFxuICAgICAgZGVzY3JpcHRpb246IGBMYW1iZGEgZnVuY3Rpb24gZm9yIGF1dG8tZGVsZXRpbmcgdW5kZXJseWluZyByZXNvdXJjZXMgY3JlYXRlZCBieSAke3RoaXMuY2FuYXJ5TmFtZX0uYCxcbiAgICAgIHBvbGljeVN0YXRlbWVudHM6IFt7XG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgQWN0aW9uOiBbJ2xhbWJkYTpEZWxldGVGdW5jdGlvbiddLFxuICAgICAgICBSZXNvdXJjZTogdGhpcy5sYW1iZGFBcm4oKSxcbiAgICAgIH0sIHtcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBBY3Rpb246IFsnc3ludGhldGljczpHZXRDYW5hcnknXSxcbiAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdBdXRvRGVsZXRlVW5kZXJseWluZ1Jlc291cmNlc0N1c3RvbVJlc291cmNlJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBBVVRPX0RFTEVURV9VTkRFUkxZSU5HX1JFU09VUkNFU19SRVNPVVJDRV9UWVBFLFxuICAgICAgc2VydmljZVRva2VuOiBwcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIENhbmFyeU5hbWU6IHRoaXMuY2FuYXJ5TmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXZSBhbHNvIHRhZyB0aGUgY2FuYXJ5IHRvIHJlY29yZCB0aGUgZmFjdCB0aGF0IHdlIHdhbnQgaXQgYXV0b2RlbGV0ZWQuXG4gICAgLy8gVGhlIGN1c3RvbSByZXNvdXJjZSB3aWxsIGNoZWNrIHRoaXMgdGFnIGJlZm9yZSBhY3R1YWxseSBkb2luZyB0aGUgZGVsZXRlLlxuICAgIC8vIEJlY2F1c2UgdGFnZ2luZyBhbmQgdW50YWdnaW5nIHdpbGwgQUxXQVlTIGhhcHBlbiBiZWZvcmUgdGhlIENSIGlzIGRlbGV0ZWQsXG4gICAgLy8gd2UgY2FuIHNldCBgYXV0b0RlbGV0ZUxhbWJkYTogZmFsc2VgIHdpdGhvdXQgdGhlIHJlbW92YWwgb2YgdGhlIENSIGVtcHR5aW5nXG4gICAgLy8gdGhlIGxhbWJkYSBhcyBhIHNpZGUgZWZmZWN0LlxuICAgIGNkay5UYWdzLm9mKHRoaXMuX3Jlc291cmNlKS5hZGQoQVVUT19ERUxFVEVfVU5ERVJMWUlOR19SRVNPVVJDRVNfVEFHLCAndHJ1ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VzcyB0aGUgQ29ubmVjdGlvbnMgb2JqZWN0XG4gICAqXG4gICAqIFdpbGwgZmFpbCBpZiBub3QgYSBWUEMtZW5hYmxlZCBDYW5hcnlcbiAgICovXG4gIHB1YmxpYyBnZXQgY29ubmVjdGlvbnMoKTogZWMyLkNvbm5lY3Rpb25zIHtcbiAgICBpZiAoIXRoaXMuX2Nvbm5lY3Rpb25zKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IFZQQy1hc3NvY2lhdGVkIENhbmFyaWVzIGhhdmUgc2VjdXJpdHkgZ3JvdXBzIHRvIG1hbmFnZS4gU3VwcGx5IHRoZSBcInZwY1wiIHBhcmFtZXRlciB3aGVuIGNyZWF0aW5nIHRoZSBDYW5hcnkuJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBNZWFzdXJlIHRoZSBEdXJhdGlvbiBvZiBhIHNpbmdsZSBjYW5hcnkgcnVuLCBpbiBzZWNvbmRzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIG1ldHJpY1xuICAgKlxuICAgKiBAZGVmYXVsdCBhdmcgb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNEdXJhdGlvbihvcHRpb25zPzogTWV0cmljT3B0aW9ucyk6IE1ldHJpYyB7XG4gICAgcmV0dXJuIG5ldyBNZXRyaWMoe1xuICAgICAgLi4uQ2xvdWRXYXRjaFN5bnRoZXRpY3NNZXRyaWNzLmR1cmF0aW9uTWF4aW11bSh7IENhbmFyeU5hbWU6IHRoaXMuY2FuYXJ5TmFtZSB9KSxcbiAgICAgIC4uLnsgc3RhdGlzdGljOiAnQXZlcmFnZScgfSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogTWVhc3VyZSB0aGUgcGVyY2VudGFnZSBvZiBzdWNjZXNzZnVsIGNhbmFyeSBydW5zLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIG1ldHJpY1xuICAgKlxuICAgKiBAZGVmYXVsdCBhdmcgb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNTdWNjZXNzUGVyY2VudChvcHRpb25zPzogTWV0cmljT3B0aW9ucyk6IE1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKENsb3VkV2F0Y2hTeW50aGV0aWNzTWV0cmljcy5zdWNjZXNzUGVyY2VudEF2ZXJhZ2UsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lYXN1cmUgdGhlIG51bWJlciBvZiBmYWlsZWQgY2FuYXJ5IHJ1bnMgb3ZlciBhIGdpdmVuIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBEZWZhdWx0OiBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgLSBjb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIHRoZSBtZXRyaWNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNGYWlsZWQob3B0aW9ucz86IE1ldHJpY09wdGlvbnMpOiBNZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhDbG91ZFdhdGNoU3ludGhldGljc01ldHJpY3MuZmFpbGVkU3VtLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgZGVmYXVsdCByb2xlIGZvciB0aGUgY2FuYXJ5XG4gICAqL1xuICBwcml2YXRlIGNyZWF0ZURlZmF1bHRSb2xlKHByb3BzOiBDYW5hcnlQcm9wcyk6IGlhbS5JUm9sZSB7XG4gICAgY29uc3QgcHJlZml4ID0gcHJvcHMuYXJ0aWZhY3RzQnVja2V0TG9jYXRpb24/LnByZWZpeDtcblxuICAgIC8vIENyZWF0ZWQgcm9sZSB3aWxsIG5lZWQgdGhlc2UgcG9saWNpZXMgdG8gcnVuIHRoZSBDYW5hcnkuXG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN5bnRoZXRpY3MtY2FuYXJ5Lmh0bWwjY2ZuLXN5bnRoZXRpY3MtY2FuYXJ5LWV4ZWN1dGlvbnJvbGVhcm5cbiAgICBjb25zdCBwb2xpY3kgPSBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcbiAgICAgIHN0YXRlbWVudHM6IFtcbiAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgICAgYWN0aW9uczogWydzMzpMaXN0QWxsTXlCdWNrZXRzJ10sXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgcmVzb3VyY2VzOiBbdGhpcy5hcnRpZmFjdHNCdWNrZXQuYnVja2V0QXJuXSxcbiAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkdldEJ1Y2tldExvY2F0aW9uJ10sXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgcmVzb3VyY2VzOiBbdGhpcy5hcnRpZmFjdHNCdWNrZXQuYXJuRm9yT2JqZWN0cyhgJHtwcmVmaXggPyBwcmVmaXgrJy8qJyA6ICcqJ31gKV0sXG4gICAgICAgICAgYWN0aW9uczogWydzMzpQdXRPYmplY3QnXSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICAgIGFjdGlvbnM6IFsnY2xvdWR3YXRjaDpQdXRNZXRyaWNEYXRhJ10sXG4gICAgICAgICAgY29uZGl0aW9uczogeyBTdHJpbmdFcXVhbHM6IHsgJ2Nsb3Vkd2F0Y2g6bmFtZXNwYWNlJzogJ0Nsb3VkV2F0Y2hTeW50aGV0aWNzJyB9IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgcmVzb3VyY2VzOiBbdGhpcy5sb2dHcm91cEFybigpXSxcbiAgICAgICAgICBhY3Rpb25zOiBbJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJywgJ2xvZ3M6Q3JlYXRlTG9nR3JvdXAnLCAnbG9nczpQdXRMb2dFdmVudHMnXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWFuYWdlZFBvbGljaWVzOiBpYW0uSU1hbmFnZWRQb2xpY3lbXSA9IFtdO1xuXG4gICAgaWYgKHByb3BzLnZwYykge1xuICAgICAgLy8gUG9saWN5IHRoYXQgd2lsbCBoYXZlIEVOSSBjcmVhdGlvbiBwZXJtaXNzaW9uc1xuICAgICAgbWFuYWdlZFBvbGljaWVzLnB1c2goaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhVlBDQWNjZXNzRXhlY3V0aW9uUm9sZScpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IGlhbS5Sb2xlKHRoaXMsICdTZXJ2aWNlUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgaW5saW5lUG9saWNpZXM6IHtcbiAgICAgICAgY2FuYXJ5UG9saWN5OiBwb2xpY3ksXG4gICAgICB9LFxuICAgICAgbWFuYWdlZFBvbGljaWVzLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2dHcm91cEFybigpIHtcbiAgICByZXR1cm4gY2RrLlN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnbG9ncycsXG4gICAgICByZXNvdXJjZTogJ2xvZy1ncm91cCcsXG4gICAgICBhcm5Gb3JtYXQ6IGNkay5Bcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICAgIHJlc291cmNlTmFtZTogJy9hd3MvbGFtYmRhL2N3c3luLSonLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsYW1iZGFBcm4oKSB7XG4gICAgcmV0dXJuIGNkay5TdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2xhbWJkYScsXG4gICAgICByZXNvdXJjZTogJ2Z1bmN0aW9uJyxcbiAgICAgIGFybkZvcm1hdDogY2RrLkFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgICAgcmVzb3VyY2VOYW1lOiAnY3dzeW4tKicsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY29kZSBvYmplY3QgdGFrZW4gaW4gYnkgdGhlIGNhbmFyeSByZXNvdXJjZS5cbiAgICovXG4gIHByaXZhdGUgY3JlYXRlQ29kZShwcm9wczogQ2FuYXJ5UHJvcHMpOiBDZm5DYW5hcnkuQ29kZVByb3BlcnR5IHtcbiAgICB0aGlzLnZhbGlkYXRlSGFuZGxlcihwcm9wcy50ZXN0LmhhbmRsZXIsIHByb3BzLnJ1bnRpbWUpO1xuICAgIGNvbnN0IGNvZGVDb25maWcgPSB7XG4gICAgICBoYW5kbGVyOiBwcm9wcy50ZXN0LmhhbmRsZXIsXG4gICAgICAuLi5wcm9wcy50ZXN0LmNvZGUuYmluZCh0aGlzLCBwcm9wcy50ZXN0LmhhbmRsZXIsIHByb3BzLnJ1bnRpbWUuZmFtaWx5KSxcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICBoYW5kbGVyOiBjb2RlQ29uZmlnLmhhbmRsZXIsXG4gICAgICBzY3JpcHQ6IGNvZGVDb25maWcuaW5saW5lQ29kZSxcbiAgICAgIHMzQnVja2V0OiBjb2RlQ29uZmlnLnMzTG9jYXRpb24/LmJ1Y2tldE5hbWUsXG4gICAgICBzM0tleTogY29kZUNvbmZpZy5zM0xvY2F0aW9uPy5vYmplY3RLZXksXG4gICAgICBzM09iamVjdFZlcnNpb246IGNvZGVDb25maWcuczNMb2NhdGlvbj8ub2JqZWN0VmVyc2lvbixcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZlcmlmaWVzIHRoYXQgdGhlIGhhbmRsZXIgbmFtZSBtYXRjaGVzIHRoZSBjb252ZW50aW9ucyBnaXZlbiBhIGNlcnRhaW4gcnVudGltZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1zeW50aGV0aWNzLWNhbmFyeS1jb2RlLmh0bWwjY2ZuLXN5bnRoZXRpY3MtY2FuYXJ5LWNvZGUtaGFuZGxlclxuICAgKiBAcGFyYW0gaGFuZGxlciAtIHRoZSBuYW1lIG9mIHRoZSBoYW5kbGVyXG4gICAqIEBwYXJhbSBydW50aW1lIC0gdGhlIHJ1bnRpbWUgdmVyc2lvblxuICAgKi9cbiAgcHJpdmF0ZSB2YWxpZGF0ZUhhbmRsZXIoaGFuZGxlcjogc3RyaW5nLCBydW50aW1lOiBSdW50aW1lKSB7XG4gICAgY29uc3Qgb2xkUnVudGltZXMgPSBbXG4gICAgICBSdW50aW1lLlNZTlRIRVRJQ1NfUFlUSE9OX1NFTEVOSVVNXzFfMCxcbiAgICAgIFJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfMCxcbiAgICAgIFJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfMSxcbiAgICAgIFJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfMixcbiAgICAgIFJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfMyxcbiAgICBdO1xuICAgIGlmIChvbGRSdW50aW1lcy5pbmNsdWRlcyhydW50aW1lKSkge1xuICAgICAgaWYgKCFoYW5kbGVyLm1hdGNoKC9eWzAtOUEtWmEtel9cXFxcLV0rXFwuaGFuZGxlciokLykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5hcnkgSGFuZGxlciBtdXN0IGJlIHNwZWNpZmllZCBhcyBcXCdmaWxlTmFtZS5oYW5kbGVyXFwnIGZvciBsZWdhY3kgcnVudGltZXMsIHJlY2VpdmVkICR7aGFuZGxlcn1gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFoYW5kbGVyLm1hdGNoKC9eKFswLTlhLXpBLVpfLV0rXFwvKSpbMC05QS1aYS16X1xcXFwtXStcXC5bQS1aYS16X11bQS1aYS16MC05X10qJC8pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2FuYXJ5IEhhbmRsZXIgbXVzdCBiZSBzcGVjaWZpZWQgZWl0aGVyIGFzIFxcJ2ZpbGVOYW1lLmhhbmRsZXJcXCcsIFxcJ2ZpbGVOYW1lLmZ1bmN0aW9uTmFtZVxcJywgb3IgXFwnZm9sZGVyL2ZpbGVOYW1lLmZ1bmN0aW9uTmFtZVxcJywgcmVjZWl2ZWQgJHtoYW5kbGVyfWApO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaGFuZGxlci5sZW5ndGggPCAxIHx8IGhhbmRsZXIubGVuZ3RoID4gMTI4KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbmFyeSBIYW5kbGVyIGxlbmd0aCBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMTI4LCByZWNlaXZlZCAke2hhbmRsZXIubGVuZ3RofWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlUnVuQ29uZmlnKHByb3BzOiBDYW5hcnlQcm9wcyk6IENmbkNhbmFyeS5SdW5Db25maWdQcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFwcm9wcy5lbnZpcm9ubWVudFZhcmlhYmxlcykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiBwcm9wcy5lbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjYW5hcnkgc2NoZWR1bGUgb2JqZWN0XG4gICAqL1xuICBwcml2YXRlIGNyZWF0ZVNjaGVkdWxlKHByb3BzOiBDYW5hcnlQcm9wcyk6IENmbkNhbmFyeS5TY2hlZHVsZVByb3BlcnR5IHtcbiAgICByZXR1cm4ge1xuICAgICAgZHVyYXRpb25JblNlY29uZHM6IFN0cmluZyhgJHtwcm9wcy50aW1lVG9MaXZlPy50b1NlY29uZHMoKSA/PyAwfWApLFxuICAgICAgZXhwcmVzc2lvbjogcHJvcHMuc2NoZWR1bGU/LmV4cHJlc3Npb25TdHJpbmcgPz8gJ3JhdGUoNSBtaW51dGVzKScsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVnBjQ29uZmlnKHByb3BzOiBDYW5hcnlQcm9wcyk6IENmbkNhbmFyeS5WUENDb25maWdQcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFwcm9wcy52cGMpIHtcbiAgICAgIGlmIChwcm9wcy52cGNTdWJuZXRzICE9IG51bGwgfHwgcHJvcHMuc2VjdXJpdHlHcm91cHMgIT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgbXVzdCBwcm92aWRlIHRoZSAndnBjJyBwcm9wIHdoZW4gdXNpbmcgVlBDLXJlbGF0ZWQgcHJvcGVydGllcy5cIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzdWJuZXRJZHMgfSA9IHByb3BzLnZwYy5zZWxlY3RTdWJuZXRzKHByb3BzLnZwY1N1Ym5ldHMpO1xuICAgIGlmIChzdWJuZXRJZHMubGVuZ3RoIDwgMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBtYXRjaGluZyBzdWJuZXRzIGZvdW5kIGluIHRoZSBWUEMuJyk7XG4gICAgfVxuXG4gICAgbGV0IHNlY3VyaXR5R3JvdXBzOiBlYzIuSVNlY3VyaXR5R3JvdXBbXTtcbiAgICBpZiAocHJvcHMuc2VjdXJpdHlHcm91cHMgJiYgcHJvcHMuc2VjdXJpdHlHcm91cHMubGVuZ3RoID4gMCkge1xuICAgICAgc2VjdXJpdHlHcm91cHMgPSBwcm9wcy5zZWN1cml0eUdyb3VwcztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnU2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQXV0b21hdGljIHNlY3VyaXR5IGdyb3VwIGZvciBDYW5hcnkgJyArIGNkay5OYW1lcy51bmlxdWVJZCh0aGlzKSxcbiAgICAgIH0pO1xuICAgICAgc2VjdXJpdHlHcm91cHMgPSBbc2VjdXJpdHlHcm91cF07XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb25zIS5hZGRTZWN1cml0eUdyb3VwKC4uLnNlY3VyaXR5R3JvdXBzKTtcblxuICAgIHJldHVybiB7XG4gICAgICB2cGNJZDogcHJvcHMudnBjLnZwY0lkLFxuICAgICAgc3VibmV0SWRzLFxuICAgICAgc2VjdXJpdHlHcm91cElkczogY2RrLkxhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHMubWFwKHNnID0+IHNnLnNlY3VyaXR5R3JvdXBJZCkgfSksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgdW5pcXVlIG5hbWUgZm9yIHRoZSBjYW5hcnkuIFRoZSBnZW5lcmF0ZWQgbmFtZSBpcyB0aGUgcGh5c2ljYWwgSUQgb2YgdGhlIGNhbmFyeS5cbiAgICovXG4gIHByaXZhdGUgZ2VuZXJhdGVVbmlxdWVOYW1lKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbmFtZSA9IGNkay5OYW1lcy51bmlxdWVJZCh0aGlzKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyAnLCAnLScpO1xuICAgIGlmIChuYW1lLmxlbmd0aCA8PSAyMSkge1xuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuYW1lLnN1YnN0cmluZygwLCAxNSkgKyBuYW1lSGFzaChuYW1lKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNhbm5lZE1ldHJpYyhcbiAgICBmbjogKGRpbXM6IHsgQ2FuYXJ5TmFtZTogc3RyaW5nIH0pID0+IE1ldHJpY1Byb3BzLFxuICAgIHByb3BzPzogTWV0cmljT3B0aW9ucyk6IE1ldHJpYyB7XG4gICAgcmV0dXJuIG5ldyBNZXRyaWMoe1xuICAgICAgLi4uZm4oeyBDYW5hcnlOYW1lOiB0aGlzLmNhbmFyeU5hbWUgfSksXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzKTtcbiAgfVxufVxuXG4vKipcbiAqIFRha2UgYSBoYXNoIG9mIHRoZSBnaXZlbiBuYW1lLlxuICpcbiAqIEBwYXJhbSBuYW1lIHRoZSBuYW1lIHRvIGJlIGhhc2hlZFxuICovXG5mdW5jdGlvbiBuYW1lSGFzaChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBtZDUgPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKG5hbWUpLmRpZ2VzdCgnaGV4Jyk7XG4gIHJldHVybiBtZDUuc2xpY2UoMCwgNik7XG59XG5cbmNvbnN0IG5hbWVSZWdleDogUmVnRXhwID0gL15bMC05YS16X1xcLV0rJC87XG5cbi8qKlxuICogVmVyaWZpZXMgdGhhdCB0aGUgbmFtZSBmaXRzIHRoZSByZWdleCBleHByZXNzaW9uOiBeWzAtOWEtel9cXC1dKyQuXG4gKlxuICogQHBhcmFtIG5hbWUgLSB0aGUgZ2l2ZW4gbmFtZSBvZiB0aGUgY2FuYXJ5XG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlTmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgaWYgKG5hbWUubGVuZ3RoID4gMjEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbmFyeSBuYW1lIGlzIHRvbyBsYXJnZSwgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDIxIGNoYXJhY3RlcnMsIGJ1dCBpcyAke25hbWUubGVuZ3RofSAoZ290IFwiJHtuYW1lfVwiKWApO1xuICB9XG4gIGlmICghbmFtZVJlZ2V4LnRlc3QobmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbmFyeSBuYW1lIG11c3QgYmUgbG93ZXJjYXNlLCBudW1iZXJzLCBoeXBoZW5zLCBvciB1bmRlcnNjb3JlcyAoZ290IFwiJHtuYW1lfVwiKWApO1xuICB9XG59XG4iXX0=