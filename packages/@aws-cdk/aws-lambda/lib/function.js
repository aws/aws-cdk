"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionVersionUpgrade = exports.verifyCodeConfig = exports.Function = exports.Tracing = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const aws_codeguruprofiler_1 = require("@aws-cdk/aws-codeguruprofiler");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const sqs = require("@aws-cdk/aws-sqs");
const core_1 = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const architecture_1 = require("./architecture");
const function_base_1 = require("./function-base");
const function_hash_1 = require("./function-hash");
const handler_1 = require("./handler");
const lambda_version_1 = require("./lambda-version");
const lambda_generated_1 = require("./lambda.generated");
const layers_1 = require("./layers");
const runtime_1 = require("./runtime");
const util_1 = require("./util");
/**
 * X-Ray Tracing Modes (https://docs.aws.amazon.com/lambda/latest/dg/API_TracingConfig.html)
 */
var Tracing;
(function (Tracing) {
    /**
     * Lambda will respect any tracing header it receives from an upstream service.
     * If no tracing header is received, Lambda will sample the request based on a fixed rate. Please see the [Using AWS Lambda with AWS X-Ray](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html) documentation for details on this sampling behavior.
     */
    Tracing["ACTIVE"] = "Active";
    /**
     * Lambda will only trace the request from an upstream service
     * if it contains a tracing header with "sampled=1"
     */
    Tracing["PASS_THROUGH"] = "PassThrough";
    /**
     * Lambda will not trace any request.
     */
    Tracing["DISABLED"] = "Disabled";
})(Tracing = exports.Tracing || (exports.Tracing = {}));
/**
 * Deploys a file from inside the construct library as a function.
 *
 * The supplied file is subject to the 4096 bytes limit of being embedded in a
 * CloudFormation template.
 *
 * The construct includes an associated role with the lambda.
 *
 * This construct does not yet reproduce all features from the underlying resource
 * library.
 */
class Function extends function_base_1.FunctionBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.functionName,
        });
        this.permissionsNode = this.node;
        this.canCreatePermissions = true;
        /** @internal */
        this._layers = [];
        /**
         * Environment variables for this function
         */
        this.environment = {};
        this.hashMixins = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_FunctionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Function);
            }
            throw error;
        }
        if (props.functionName && !core_1.Token.isUnresolved(props.functionName)) {
            if (props.functionName.length > 64) {
                throw new Error(`Function name can not be longer than 64 characters but has ${props.functionName.length} characters.`);
            }
            if (!/^[a-zA-Z0-9-_]+$/.test(props.functionName)) {
                throw new Error(`Function name ${props.functionName} can contain only letters, numbers, hyphens, or underscores with no spaces.`);
            }
        }
        if (props.description && !core_1.Token.isUnresolved(props.description)) {
            if (props.description.length > 256) {
                throw new Error(`Function description can not be longer than 256 characters but has ${props.description.length} characters.`);
            }
        }
        const managedPolicies = new Array();
        // the arn is in the form of - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
        if (props.vpc) {
            // Policy that will have ENI creation permissions
            managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));
        }
        this.role = props.role || new iam.Role(this, 'ServiceRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies,
        });
        this.grantPrincipal = this.role;
        // add additional managed policies when necessary
        if (props.filesystem) {
            const config = props.filesystem.config;
            if (config.policies) {
                config.policies.forEach(p => {
                    this.role?.addToPrincipalPolicy(p);
                });
            }
        }
        for (const statement of (props.initialPolicy || [])) {
            this.role.addToPrincipalPolicy(statement);
        }
        const code = props.code.bind(this);
        verifyCodeConfig(code, props);
        let profilingGroupEnvironmentVariables = {};
        if (props.profilingGroup && props.profiling !== false) {
            this.validateProfiling(props);
            props.profilingGroup.grantPublish(this.role);
            profilingGroupEnvironmentVariables = {
                AWS_CODEGURU_PROFILER_GROUP_ARN: core_1.Stack.of(scope).formatArn({
                    service: 'codeguru-profiler',
                    resource: 'profilingGroup',
                    resourceName: props.profilingGroup.profilingGroupName,
                }),
                AWS_CODEGURU_PROFILER_ENABLED: 'TRUE',
            };
        }
        else if (props.profiling) {
            this.validateProfiling(props);
            const profilingGroup = new aws_codeguruprofiler_1.ProfilingGroup(this, 'ProfilingGroup', {
                computePlatform: aws_codeguruprofiler_1.ComputePlatform.AWS_LAMBDA,
            });
            profilingGroup.grantPublish(this.role);
            profilingGroupEnvironmentVariables = {
                AWS_CODEGURU_PROFILER_GROUP_ARN: profilingGroup.profilingGroupArn,
                AWS_CODEGURU_PROFILER_ENABLED: 'TRUE',
            };
        }
        const env = { ...profilingGroupEnvironmentVariables, ...props.environment };
        for (const [key, value] of Object.entries(env)) {
            this.addEnvironment(key, value);
        }
        // DLQ can be either sns.ITopic or sqs.IQueue
        const dlqTopicOrQueue = this.buildDeadLetterQueue(props);
        if (dlqTopicOrQueue !== undefined) {
            if (this.isQueue(dlqTopicOrQueue)) {
                this.deadLetterQueue = dlqTopicOrQueue;
            }
            else {
                this.deadLetterTopic = dlqTopicOrQueue;
            }
        }
        let fileSystemConfigs = undefined;
        if (props.filesystem) {
            fileSystemConfigs = [{
                    arn: props.filesystem.config.arn,
                    localMountPath: props.filesystem.config.localMountPath,
                }];
        }
        if (props.architecture && props.architectures !== undefined) {
            throw new Error('Either architecture or architectures must be specified but not both.');
        }
        if (props.architectures && props.architectures.length > 1) {
            throw new Error('Only one architecture must be specified.');
        }
        this._architecture = props.architecture ?? (props.architectures && props.architectures[0]);
        if (props.ephemeralStorageSize && !props.ephemeralStorageSize.isUnresolved()
            && (props.ephemeralStorageSize.toMebibytes() < 512 || props.ephemeralStorageSize.toMebibytes() > 10240)) {
            throw new Error(`Ephemeral storage size must be between 512 and 10240 MB, received ${props.ephemeralStorageSize}.`);
        }
        const resource = new lambda_generated_1.CfnFunction(this, 'Resource', {
            functionName: this.physicalName,
            description: props.description,
            code: {
                s3Bucket: code.s3Location && code.s3Location.bucketName,
                s3Key: code.s3Location && code.s3Location.objectKey,
                s3ObjectVersion: code.s3Location && code.s3Location.objectVersion,
                zipFile: code.inlineCode,
                imageUri: code.image?.imageUri,
            },
            layers: core_1.Lazy.list({ produce: () => this.renderLayers() }),
            handler: props.handler === handler_1.Handler.FROM_IMAGE ? undefined : props.handler,
            timeout: props.timeout && props.timeout.toSeconds(),
            packageType: props.runtime === runtime_1.Runtime.FROM_IMAGE ? 'Image' : undefined,
            runtime: props.runtime === runtime_1.Runtime.FROM_IMAGE ? undefined : props.runtime.name,
            role: this.role.roleArn,
            // Uncached because calling '_checkEdgeCompatibility', which gets called in the resolve of another
            // Token, actually *modifies* the 'environment' map.
            environment: core_1.Lazy.uncachedAny({ produce: () => this.renderEnvironment() }),
            memorySize: props.memorySize,
            ephemeralStorage: props.ephemeralStorageSize ? {
                size: props.ephemeralStorageSize.toMebibytes(),
            } : undefined,
            vpcConfig: this.configureVpc(props),
            deadLetterConfig: this.buildDeadLetterConfig(dlqTopicOrQueue),
            reservedConcurrentExecutions: props.reservedConcurrentExecutions,
            imageConfig: undefinedIfNoKeys({
                command: code.image?.cmd,
                entryPoint: code.image?.entrypoint,
                workingDirectory: code.image?.workingDirectory,
            }),
            kmsKeyArn: props.environmentEncryption?.keyArn,
            fileSystemConfigs,
            codeSigningConfigArn: props.codeSigningConfig?.codeSigningConfigArn,
            architectures: this._architecture ? [this._architecture.name] : undefined,
            runtimeManagementConfig: props.runtimeManagementMode?.runtimeManagementConfig,
        });
        if ((props.tracing !== undefined) || (props.adotInstrumentation !== undefined)) {
            resource.tracingConfig = this.buildTracingConfig(props.tracing ?? Tracing.ACTIVE);
        }
        resource.node.addDependency(this.role);
        this.functionName = this.getResourceNameAttribute(resource.ref);
        this.functionArn = this.getResourceArnAttribute(resource.attrArn, {
            service: 'lambda',
            resource: 'function',
            resourceName: this.physicalName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        this.runtime = props.runtime;
        this.timeout = props.timeout;
        this.architecture = props.architecture ?? architecture_1.Architecture.X86_64;
        if (props.layers) {
            if (props.runtime === runtime_1.Runtime.FROM_IMAGE) {
                throw new Error('Layers are not supported for container image functions');
            }
            this.addLayers(...props.layers);
        }
        for (const event of props.events || []) {
            this.addEventSource(event);
        }
        // Log retention
        if (props.logRetention) {
            const logRetention = new logs.LogRetention(this, 'LogRetention', {
                logGroupName: `/aws/lambda/${this.functionName}`,
                retention: props.logRetention,
                role: props.logRetentionRole,
                logRetentionRetryOptions: props.logRetentionRetryOptions,
            });
            this._logGroup = logs.LogGroup.fromLogGroupArn(this, 'LogGroup', logRetention.logGroupArn);
        }
        props.code.bindToResource(resource);
        // Event Invoke Config
        if (props.onFailure || props.onSuccess || props.maxEventAge || props.retryAttempts !== undefined) {
            this.configureAsyncInvoke({
                onFailure: props.onFailure,
                onSuccess: props.onSuccess,
                maxEventAge: props.maxEventAge,
                retryAttempts: props.retryAttempts,
            });
        }
        this.currentVersionOptions = props.currentVersionOptions;
        if (props.filesystem) {
            if (!props.vpc) {
                throw new Error('Cannot configure \'filesystem\' without configuring a VPC.');
            }
            const config = props.filesystem.config;
            if (config.dependency) {
                this.node.addDependency(...config.dependency);
            }
            // There could be a race if the Lambda is used in a CustomResource. It is possible for the Lambda to
            // fail to attach to a given FileSystem if we do not have a dependency on the SecurityGroup ingress/egress
            // rules that were created between this Lambda's SG & the Filesystem SG.
            this.connections.securityGroups.forEach(sg => {
                sg.node.findAll().forEach(child => {
                    if (child instanceof core_1.CfnResource && child.cfnResourceType === 'AWS::EC2::SecurityGroupEgress') {
                        resource.node.addDependency(child);
                    }
                });
            });
            config.connections?.securityGroups.forEach(sg => {
                sg.node.findAll().forEach(child => {
                    if (child instanceof core_1.CfnResource && child.cfnResourceType === 'AWS::EC2::SecurityGroupIngress') {
                        resource.node.addDependency(child);
                    }
                });
            });
        }
        // Configure Lambda insights
        this.configureLambdaInsights(props);
        this.configureAdotInstrumentation(props);
    }
    /**
     * Returns a `lambda.Version` which represents the current version of this
     * Lambda function. A new version will be created every time the function's
     * configuration changes.
     *
     * You can specify options for this version using the `currentVersionOptions`
     * prop when initializing the `lambda.Function`.
     */
    get currentVersion() {
        if (this._currentVersion) {
            return this._currentVersion;
        }
        if (this._warnIfCurrentVersionCalled) {
            this.warnInvokeFunctionPermissions(this);
        }
        ;
        this._currentVersion = new lambda_version_1.Version(this, 'CurrentVersion', {
            lambda: this,
            ...this.currentVersionOptions,
        });
        // override the version's logical ID with a lazy string which includes the
        // hash of the function itself, so a new version resource is created when
        // the function configuration changes.
        const cfn = this._currentVersion.node.defaultChild;
        const originalLogicalId = this.stack.resolve(cfn.logicalId);
        cfn.overrideLogicalId(core_1.Lazy.uncachedString({
            produce: () => {
                const hash = function_hash_1.calculateFunctionHash(this, this.hashMixins.join(''));
                const logicalId = function_hash_1.trimFromStart(originalLogicalId, 255 - 32);
                return `${logicalId}${hash}`;
            },
        }));
        return this._currentVersion;
    }
    get resourceArnsForGrantInvoke() {
        return [this.functionArn, `${this.functionArn}:*`];
    }
    /**
     * Record whether specific properties in the `AWS::Lambda::Function` resource should
     * also be associated to the Version resource.
     * See 'currentVersion' section in the module README for more details.
     * @param propertyName The property to classify
     * @param locked whether the property should be associated to the version or not.
     */
    static classifyVersionProperty(propertyName, locked) {
        this._VER_PROPS[propertyName] = locked;
    }
    /**
     * Import a lambda function into the CDK using its name
     */
    static fromFunctionName(scope, id, functionName) {
        return Function.fromFunctionAttributes(scope, id, {
            functionArn: core_1.Stack.of(scope).formatArn({
                service: 'lambda',
                resource: 'function',
                resourceName: functionName,
                arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
            }),
        });
    }
    /**
     * Import a lambda function into the CDK using its ARN
     */
    static fromFunctionArn(scope, id, functionArn) {
        return Function.fromFunctionAttributes(scope, id, { functionArn });
    }
    /**
     * Creates a Lambda function object which represents a function not defined
     * within this stack.
     *
     * @param scope The parent construct
     * @param id The name of the lambda construct
     * @param attrs the attributes of the function to import
     */
    static fromFunctionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_FunctionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromFunctionAttributes);
            }
            throw error;
        }
        const functionArn = attrs.functionArn;
        const functionName = extractNameFromArn(attrs.functionArn);
        const role = attrs.role;
        class Import extends function_base_1.FunctionBase {
            constructor(s, i) {
                super(s, i, {
                    environmentFromArn: functionArn,
                });
                this.functionName = functionName;
                this.functionArn = functionArn;
                this.role = role;
                this.permissionsNode = this.node;
                this.architecture = attrs.architecture ?? architecture_1.Architecture.X86_64;
                this.resourceArnsForGrantInvoke = [this.functionArn, `${this.functionArn}:*`];
                this.canCreatePermissions = attrs.sameEnvironment ?? this._isStackAccount();
                this._skipPermissions = attrs.skipPermissions ?? false;
                this.grantPrincipal = role || new iam.UnknownPrincipal({ resource: this });
                if (attrs.securityGroup) {
                    this._connections = new ec2.Connections({
                        securityGroups: [attrs.securityGroup],
                    });
                }
                else if (attrs.securityGroupId) {
                    this._connections = new ec2.Connections({
                        securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(scope, 'SecurityGroup', attrs.securityGroupId)],
                    });
                }
            }
        }
        return new Import(scope, id);
    }
    /**
     * Return the given named metric for this Lambda
     */
    static metricAll(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/Lambda',
            metricName,
            ...props,
        });
    }
    /**
     * Metric for the number of Errors executing all Lambdas
     *
     * @default sum over 5 minutes
     */
    static metricAllErrors(props) {
        return this.metricAll('Errors', { statistic: 'sum', ...props });
    }
    /**
     * Metric for the Duration executing all Lambdas
     *
     * @default average over 5 minutes
     */
    static metricAllDuration(props) {
        return this.metricAll('Duration', props);
    }
    /**
     * Metric for the number of invocations of all Lambdas
     *
     * @default sum over 5 minutes
     */
    static metricAllInvocations(props) {
        return this.metricAll('Invocations', { statistic: 'sum', ...props });
    }
    /**
     * Metric for the number of throttled invocations of all Lambdas
     *
     * @default sum over 5 minutes
     */
    static metricAllThrottles(props) {
        return this.metricAll('Throttles', { statistic: 'sum', ...props });
    }
    /**
     * Metric for the number of concurrent executions across all Lambdas
     *
     * @default max over 5 minutes
     */
    static metricAllConcurrentExecutions(props) {
        // Mini-FAQ: why max? This metric is a gauge that is emitted every
        // minute, so either max or avg or a percentile make sense (but sum
        // doesn't). Max is more sensitive to spiky load changes which is
        // probably what you're interested in if you're looking at this metric
        // (Load spikes may lead to concurrent execution errors that would
        // otherwise not be visible in the avg)
        return this.metricAll('ConcurrentExecutions', { statistic: 'max', ...props });
    }
    /**
     * Metric for the number of unreserved concurrent executions across all Lambdas
     *
     * @default max over 5 minutes
     */
    static metricAllUnreservedConcurrentExecutions(props) {
        return this.metricAll('UnreservedConcurrentExecutions', { statistic: 'max', ...props });
    }
    /**
     * Adds an environment variable to this Lambda function.
     * If this is a ref to a Lambda function, this operation results in a no-op.
     * @param key The environment variable key.
     * @param value The environment variable's value.
     * @param options Environment variable options.
     */
    addEnvironment(key, value, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_EnvironmentOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addEnvironment);
            }
            throw error;
        }
        // Reserved environment variables will fail during cloudformation deploy if they're set.
        // This check is just to allow CDK to fail faster when these are specified.
        const reservedEnvironmentVariables = [
            '_HANDLER',
            '_X_AMZN_TRACE_ID',
            'AWS_REGION',
            'AWS_EXECUTION_ENV',
            'AWS_LAMBDA_FUNCTION_NAME',
            'AWS_LAMBDA_FUNCTION_MEMORY_SIZE',
            'AWS_LAMBDA_FUNCTION_VERSION',
            'AWS_LAMBDA_INITIALIZATION_TYPE',
            'AWS_LAMBDA_LOG_GROUP_NAME',
            'AWS_LAMBDA_LOG_STREAM_NAME',
            'AWS_ACCESS_KEY',
            'AWS_ACCESS_KEY_ID',
            'AWS_SECRET_ACCESS_KEY',
            'AWS_SESSION_TOKEN',
            'AWS_LAMBDA_RUNTIME_API',
            'LAMBDA_TASK_ROOT',
            'LAMBDA_RUNTIME_DIR',
        ];
        if (reservedEnvironmentVariables.includes(key)) {
            throw new Error(`${key} environment variable is reserved by the lambda runtime and can not be set manually. See https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html`);
        }
        this.environment[key] = { value, ...options };
        return this;
    }
    /**
     * Mix additional information into the hash of the Version object
     *
     * The Lambda Function construct does its best to automatically create a new
     * Version when anything about the Function changes (its code, its layers,
     * any of the other properties).
     *
     * However, you can sometimes source information from places that the CDK cannot
     * look into, like the deploy-time values of SSM parameters. In those cases,
     * the CDK would not force the creation of a new Version object when it actually
     * should.
     *
     * This method can be used to invalidate the current Version object. Pass in
     * any string into this method, and make sure the string changes when you know
     * a new Version needs to be created.
     *
     * This method may be called more than once.
     */
    invalidateVersionBasedOn(x) {
        if (core_1.Token.isUnresolved(x)) {
            throw new Error('invalidateVersionOn: input may not contain unresolved tokens');
        }
        this.hashMixins.push(x);
    }
    /**
     * Adds one or more Lambda Layers to this Lambda function.
     *
     * @param layers the layers to be added.
     *
     * @throws if there are already 5 layers on this function, or the layer is incompatible with this function's runtime.
     */
    addLayers(...layers) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_ILayerVersion(layers);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addLayers);
            }
            throw error;
        }
        for (const layer of layers) {
            if (this._layers.length === 5) {
                throw new Error('Unable to add layer: this lambda function already uses 5 layers.');
            }
            if (layer.compatibleRuntimes && !layer.compatibleRuntimes.find(runtime => runtime.runtimeEquals(this.runtime))) {
                const runtimes = layer.compatibleRuntimes.map(runtime => runtime.name).join(', ');
                throw new Error(`This lambda function uses a runtime that is incompatible with this layer (${this.runtime.name} is not in [${runtimes}])`);
            }
            // Currently no validations for compatible architectures since Lambda service
            // allows layers configured with one architecture to be used with a Lambda function
            // from another architecture.
            this._layers.push(layer);
        }
    }
    /**
     * Add a new version for this Lambda
     *
     * If you want to deploy through CloudFormation and use aliases, you need to
     * add a new version (with a new name) to your Lambda every time you want to
     * deploy an update. An alias can then refer to the newly created Version.
     *
     * All versions should have distinct names, and you should not delete versions
     * as long as your Alias needs to refer to them.
     *
     * @param name A unique name for this version.
     * @param codeSha256 The SHA-256 hash of the most recently deployed Lambda
     *  source code, or omit to skip validation.
     * @param description A description for this version.
     * @param provisionedExecutions A provisioned concurrency configuration for a
     * function's version.
     * @param asyncInvokeConfig configuration for this version when it is invoked
     * asynchronously.
     * @returns A new Version object.
     *
     * @deprecated This method will create an AWS::Lambda::Version resource which
     * snapshots the AWS Lambda function *at the time of its creation* and it
     * won't get updated when the function changes. Instead, use
     * `this.currentVersion` to obtain a reference to a version resource that gets
     * automatically recreated when the function configuration (or code) changes.
     */
    addVersion(name, codeSha256, description, provisionedExecutions, asyncInvokeConfig = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-lambda.Function#addVersion", "This method will create an AWS::Lambda::Version resource which\nsnapshots the AWS Lambda function *at the time of its creation* and it\nwon't get updated when the function changes. Instead, use\n`this.currentVersion` to obtain a reference to a version resource that gets\nautomatically recreated when the function configuration (or code) changes.");
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_EventInvokeConfigOptions(asyncInvokeConfig);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addVersion);
            }
            throw error;
        }
        return new lambda_version_1.Version(this, 'Version' + name, {
            lambda: this,
            codeSha256,
            description,
            provisionedConcurrentExecutions: provisionedExecutions,
            ...asyncInvokeConfig,
        });
    }
    /**
     * Defines an alias for this function.
     *
     * The alias will automatically be updated to point to the latest version of
     * the function as it is being updated during a deployment.
     *
     * ```ts
     * declare const fn: lambda.Function;
     *
     * fn.addAlias('Live');
     *
     * // Is equivalent to
     *
     * new lambda.Alias(this, 'AliasLive', {
     *   aliasName: 'Live',
     *   version: fn.currentVersion,
     * });
     * ```
     *
     * @param aliasName The name of the alias
     * @param options Alias options
     */
    addAlias(aliasName, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_AliasOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAlias);
            }
            throw error;
        }
        return util_1.addAlias(this, this.currentVersion, aliasName, options);
    }
    /**
     * The LogGroup where the Lambda function's logs are made available.
     *
     * If either `logRetention` is set or this property is called, a CloudFormation custom resource is added to the stack that
     * pre-creates the log group as part of the stack deployment, if it already doesn't exist, and sets the correct log retention
     * period (never expire, by default).
     *
     * Further, if the log group already exists and the `logRetention` is not set, the custom resource will reset the log retention
     * to never expire even if it was configured with a different value.
     */
    get logGroup() {
        if (!this._logGroup) {
            const logRetention = new logs.LogRetention(this, 'LogRetention', {
                logGroupName: `/aws/lambda/${this.functionName}`,
                retention: logs.RetentionDays.INFINITE,
            });
            this._logGroup = logs.LogGroup.fromLogGroupArn(this, `${this.node.id}-LogGroup`, logRetention.logGroupArn);
        }
        return this._logGroup;
    }
    /** @internal */
    _checkEdgeCompatibility() {
        // Check env vars
        const envEntries = Object.entries(this.environment);
        for (const [key, config] of envEntries) {
            if (config.removeInEdge) {
                delete this.environment[key];
                core_1.Annotations.of(this).addInfo(`Removed ${key} environment variable for Lambda@Edge compatibility`);
            }
        }
        const envKeys = Object.keys(this.environment);
        if (envKeys.length !== 0) {
            throw new Error(`The function ${this.node.path} contains environment variables [${envKeys}] and is not compatible with Lambda@Edge. \
Environment variables can be marked for removal when used in Lambda@Edge by setting the \'removeInEdge\' property in the \'addEnvironment()\' API.`);
        }
        return;
    }
    /**
     * Configured lambda insights on the function if specified. This is acheived by adding an imported layer which is added to the
     * list of lambda layers on synthesis.
     *
     * https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
     */
    configureLambdaInsights(props) {
        if (props.insightsVersion === undefined) {
            return;
        }
        if (props.runtime !== runtime_1.Runtime.FROM_IMAGE) {
            // Layers cannot be added to Lambda container images. The image should have the insights agent installed.
            // See https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-docker.html
            this.addLayers(layers_1.LayerVersion.fromLayerVersionArn(this, 'LambdaInsightsLayer', props.insightsVersion._bind(this, this).arn));
        }
        this.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy'));
    }
    /**
     * Add an AWS Distro for OpenTelemetry Lambda layer.
     *
     * @param props properties for the ADOT instrumentation
     */
    configureAdotInstrumentation(props) {
        if (props.adotInstrumentation === undefined) {
            return;
        }
        if (props.runtime === runtime_1.Runtime.FROM_IMAGE) {
            throw new Error("ADOT Lambda layer can't be configured with container image package type");
        }
        // This is not the complete list of incompatible runtimes and layer types. We are only
        // checking for common mistakes on a best-effort basis.
        if (this.runtime === runtime_1.Runtime.GO_1_X) {
            throw new Error('Runtime go1.x is not supported by the ADOT Lambda Go SDK');
        }
        this.addLayers(layers_1.LayerVersion.fromLayerVersionArn(this, 'AdotLayer', props.adotInstrumentation.layerVersion._bind(this).arn));
        this.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', props.adotInstrumentation.execWrapper);
    }
    renderLayers() {
        if (!this._layers || this._layers.length === 0) {
            return undefined;
        }
        if (core_1.FeatureFlags.of(this).isEnabled(cx_api_1.LAMBDA_RECOGNIZE_LAYER_VERSION)) {
            this._layers.sort();
        }
        return this._layers.map(layer => layer.layerVersionArn);
    }
    renderEnvironment() {
        if (!this.environment || Object.keys(this.environment).length === 0) {
            return undefined;
        }
        const variables = {};
        // Sort environment so the hash of the function used to create
        // `currentVersion` is not affected by key order (this is how lambda does
        // it). For backwards compatibility we do not sort environment variables in case
        // _currentVersion is not defined. Otherwise, this would have invalidated
        // the template, and for example, may cause unneeded updates for nested
        // stacks.
        const keys = this._currentVersion
            ? Object.keys(this.environment).sort()
            : Object.keys(this.environment);
        for (const key of keys) {
            variables[key] = this.environment[key].value;
        }
        return { variables };
    }
    /**
     * If configured, set up the VPC-related properties
     *
     * Returns the VpcConfig that should be added to the
     * Lambda creation properties.
     */
    configureVpc(props) {
        if ((props.securityGroup || props.allowAllOutbound !== undefined) && !props.vpc) {
            throw new Error('Cannot configure \'securityGroup\' or \'allowAllOutbound\' without configuring a VPC');
        }
        if (!props.vpc) {
            if (props.vpcSubnets) {
                throw new Error('Cannot configure \'vpcSubnets\' without configuring a VPC');
            }
            return undefined;
        }
        if (props.securityGroup && props.allowAllOutbound !== undefined) {
            throw new Error('Configure \'allowAllOutbound\' directly on the supplied SecurityGroup.');
        }
        let securityGroups;
        if (props.securityGroup && props.securityGroups) {
            throw new Error('Only one of the function props, securityGroup or securityGroups, is allowed');
        }
        if (props.securityGroups) {
            securityGroups = props.securityGroups;
        }
        else {
            const securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
                vpc: props.vpc,
                description: 'Automatic security group for Lambda Function ' + core_1.Names.uniqueId(this),
                allowAllOutbound: props.allowAllOutbound,
            });
            securityGroups = [securityGroup];
        }
        this._connections = new ec2.Connections({ securityGroups });
        if (props.filesystem) {
            if (props.filesystem.config.connections) {
                props.filesystem.config.connections.allowDefaultPortFrom(this);
            }
        }
        const allowPublicSubnet = props.allowPublicSubnet ?? false;
        const selectedSubnets = props.vpc.selectSubnets(props.vpcSubnets);
        const publicSubnetIds = new Set(props.vpc.publicSubnets.map(s => s.subnetId));
        for (const subnetId of selectedSubnets.subnetIds) {
            if (publicSubnetIds.has(subnetId) && !allowPublicSubnet) {
                throw new Error('Lambda Functions in a public subnet can NOT access the internet. ' +
                    'If you are aware of this limitation and would still like to place the function in a public subnet, set `allowPublicSubnet` to true');
            }
        }
        this.node.addDependency(selectedSubnets.internetConnectivityEstablished);
        // List can't be empty here, if we got this far you intended to put your Lambda
        // in subnets. We're going to guarantee that we get the nice error message by
        // making VpcNetwork do the selection again.
        return {
            subnetIds: selectedSubnets.subnetIds,
            securityGroupIds: securityGroups.map(sg => sg.securityGroupId),
        };
    }
    isQueue(deadLetterQueue) {
        return deadLetterQueue.queueArn !== undefined;
    }
    buildDeadLetterQueue(props) {
        if (!props.deadLetterQueue && !props.deadLetterQueueEnabled && !props.deadLetterTopic) {
            return undefined;
        }
        if (props.deadLetterQueue && props.deadLetterQueueEnabled === false) {
            throw Error('deadLetterQueue defined but deadLetterQueueEnabled explicitly set to false');
        }
        if (props.deadLetterTopic && (props.deadLetterQueue || props.deadLetterQueueEnabled !== undefined)) {
            throw new Error('deadLetterQueue and deadLetterTopic cannot be specified together at the same time');
        }
        let deadLetterQueue;
        if (props.deadLetterTopic) {
            deadLetterQueue = props.deadLetterTopic;
            this.addToRolePolicy(new iam.PolicyStatement({
                actions: ['sns:Publish'],
                resources: [deadLetterQueue.topicArn],
            }));
        }
        else {
            deadLetterQueue = props.deadLetterQueue || new sqs.Queue(this, 'DeadLetterQueue', {
                retentionPeriod: core_1.Duration.days(14),
            });
            this.addToRolePolicy(new iam.PolicyStatement({
                actions: ['sqs:SendMessage'],
                resources: [deadLetterQueue.queueArn],
            }));
        }
        return deadLetterQueue;
    }
    buildDeadLetterConfig(deadLetterQueue) {
        if (deadLetterQueue) {
            return {
                targetArn: this.isQueue(deadLetterQueue) ? deadLetterQueue.queueArn : deadLetterQueue.topicArn,
            };
        }
        else {
            return undefined;
        }
    }
    buildTracingConfig(tracing) {
        if (tracing === undefined || tracing === Tracing.DISABLED) {
            return undefined;
        }
        this.addToRolePolicy(new iam.PolicyStatement({
            actions: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
            resources: ['*'],
        }));
        return {
            mode: tracing,
        };
    }
    validateProfiling(props) {
        if (!props.runtime.supportsCodeGuruProfiling) {
            throw new Error(`CodeGuru profiling is not supported by runtime ${props.runtime.name}`);
        }
        if (props.environment && (props.environment.AWS_CODEGURU_PROFILER_GROUP_ARN || props.environment.AWS_CODEGURU_PROFILER_ENABLED)) {
            throw new Error('AWS_CODEGURU_PROFILER_GROUP_ARN and AWS_CODEGURU_PROFILER_ENABLED must not be set when profiling options enabled');
        }
    }
}
exports.Function = Function;
_a = JSII_RTTI_SYMBOL_1;
Function[_a] = { fqn: "@aws-cdk/aws-lambda.Function", version: "0.0.0" };
/** @internal */
Function._VER_PROPS = {};
/**
 * Given an opaque (token) ARN, returns a CloudFormation expression that extracts the function
 * name from the ARN.
 *
 * Function ARNs look like this:
 *
 *   arn:aws:lambda:region:account-id:function:function-name
 *
 * ..which means that in order to extract the `function-name` component from the ARN, we can
 * split the ARN using ":" and select the component in index 6.
 *
 * @returns `FnSelect(6, FnSplit(':', arn))`
 */
function extractNameFromArn(arn) {
    return core_1.Fn.select(6, core_1.Fn.split(':', arn));
}
function verifyCodeConfig(code, props) {
    // mutually exclusive
    const codeType = [code.inlineCode, code.s3Location, code.image];
    if (codeType.filter(x => !!x).length !== 1) {
        throw new Error('lambda.Code must specify exactly one of: "inlineCode", "s3Location", or "image"');
    }
    if (!!code.image === (props.handler !== handler_1.Handler.FROM_IMAGE)) {
        throw new Error('handler must be `Handler.FROM_IMAGE` when using image asset for Lambda function');
    }
    if (!!code.image === (props.runtime !== runtime_1.Runtime.FROM_IMAGE)) {
        throw new Error('runtime must be `Runtime.FROM_IMAGE` when using image asset for Lambda function');
    }
    // if this is inline code, check that the runtime supports
    if (code.inlineCode && !props.runtime.supportsInlineCode) {
        throw new Error(`Inline source not allowed for ${props.runtime.name}`);
    }
}
exports.verifyCodeConfig = verifyCodeConfig;
function undefinedIfNoKeys(struct) {
    const allUndefined = Object.values(struct).every(val => val === undefined);
    return allUndefined ? undefined : struct;
}
/**
 * Aspect for upgrading function versions when the feature flag
 * provided feature flag present. This can be necessary when the feature flag
 * changes the function hash, as such changes must be associated with a new
 * version. This aspect will change the function description in these cases,
 * which "validates" the new function hash.
 */
class FunctionVersionUpgrade {
    constructor(featureFlag, enabled = true) {
        this.featureFlag = featureFlag;
        this.enabled = enabled;
    }
    visit(node) {
        if (node instanceof Function &&
            this.enabled === core_1.FeatureFlags.of(node).isEnabled(this.featureFlag)) {
            const cfnFunction = node.node.defaultChild;
            const desc = cfnFunction.description ? `${cfnFunction.description} ` : '';
            cfnFunction.addPropertyOverride('Description', `${desc}version-hash:${function_hash_1.calculateFunctionHash(node)}`);
        }
    }
    ;
}
exports.FunctionVersionUpgrade = FunctionVersionUpgrade;
_b = JSII_RTTI_SYMBOL_1;
FunctionVersionUpgrade[_b] = { fqn: "@aws-cdk/aws-lambda.FunctionVersionUpgrade", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsd0VBQWlHO0FBQ2pHLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFFeEMsMENBQTBDO0FBRTFDLHdDQUF3QztBQUN4Qyx3Q0FBMEk7QUFDMUksNENBQWlFO0FBSWpFLGlEQUE4QztBQU05QyxtREFBOEU7QUFDOUUsbURBQXVFO0FBQ3ZFLHVDQUFvQztBQUVwQyxxREFBMkQ7QUFDM0QseURBQWlEO0FBQ2pELHFDQUF1RDtBQUV2RCx1Q0FBb0M7QUFFcEMsaUNBQWtDO0FBRWxDOztHQUVHO0FBQ0gsSUFBWSxPQWVYO0FBZkQsV0FBWSxPQUFPO0lBQ2pCOzs7T0FHRztJQUNILDRCQUFpQixDQUFBO0lBQ2pCOzs7T0FHRztJQUNILHVDQUE0QixDQUFBO0lBQzVCOztPQUVHO0lBQ0gsZ0NBQXFCLENBQUE7QUFDdkIsQ0FBQyxFQWZXLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQWVsQjtBQWlXRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsTUFBYSxRQUFTLFNBQVEsNEJBQVk7SUFzUXhDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7U0FDakMsQ0FBQyxDQUFDO1FBdkJXLG9CQUFlLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUV6Qix5QkFBb0IsR0FBRyxJQUFJLENBQUM7UUFFL0MsZ0JBQWdCO1FBQ0EsWUFBTyxHQUFvQixFQUFFLENBQUM7UUFJOUM7O1dBRUc7UUFDSyxnQkFBVyxHQUF5QyxFQUFFLENBQUM7UUFNdkQsZUFBVSxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7Ozs7OzsrQ0FwUTlCLFFBQVE7Ozs7UUEyUWpCLElBQUksS0FBSyxDQUFDLFlBQVksSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ2pFLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO2dCQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLDhEQUE4RCxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sY0FBYyxDQUFDLENBQUM7YUFDeEg7WUFDRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDaEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxDQUFDLFlBQVksNkVBQTZFLENBQUMsQ0FBQzthQUNuSTtTQUNGO1FBRUQsSUFBSSxLQUFLLENBQUMsV0FBVyxJQUFJLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDL0QsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7Z0JBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0VBQXNFLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxjQUFjLENBQUMsQ0FBQzthQUMvSDtTQUNGO1FBRUQsTUFBTSxlQUFlLEdBQUcsSUFBSSxLQUFLLEVBQXNCLENBQUM7UUFFeEQsK0ZBQStGO1FBQy9GLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUM7UUFFN0csSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ2IsaURBQWlEO1lBQ2pELGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDLENBQUM7U0FDbEg7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDMUQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDO1lBQzNELGVBQWU7U0FDaEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRWhDLGlEQUFpRDtRQUNqRCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDcEIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDdkMsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUNuQixNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDMUIsSUFBSSxDQUFDLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsQ0FBQyxDQUFDLENBQUM7YUFDSjtTQUNGO1FBRUQsS0FBSyxNQUFNLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDLEVBQUU7WUFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMzQztRQUVELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLGdCQUFnQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU5QixJQUFJLGtDQUFrQyxHQUE4QixFQUFFLENBQUM7UUFDdkUsSUFBSSxLQUFLLENBQUMsY0FBYyxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQ3JELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixLQUFLLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0Msa0NBQWtDLEdBQUc7Z0JBQ25DLCtCQUErQixFQUFFLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUN6RCxPQUFPLEVBQUUsbUJBQW1CO29CQUM1QixRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixZQUFZLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0I7aUJBQ3RELENBQUM7Z0JBQ0YsNkJBQTZCLEVBQUUsTUFBTTthQUN0QyxDQUFDO1NBQ0g7YUFBTSxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLE1BQU0sY0FBYyxHQUFHLElBQUkscUNBQWMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ2hFLGVBQWUsRUFBRSxzQ0FBZSxDQUFDLFVBQVU7YUFDNUMsQ0FBQyxDQUFDO1lBQ0gsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsa0NBQWtDLEdBQUc7Z0JBQ25DLCtCQUErQixFQUFFLGNBQWMsQ0FBQyxpQkFBaUI7Z0JBQ2pFLDZCQUE2QixFQUFFLE1BQU07YUFDdEMsQ0FBQztTQUNIO1FBRUQsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLGtDQUFrQyxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzVFLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzlDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsNkNBQTZDO1FBQzdDLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RCxJQUFJLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFDakMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFO2dCQUNqQyxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQzthQUN4QztpQkFBTTtnQkFDTCxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQzthQUN4QztTQUNGO1FBRUQsSUFBSSxpQkFBaUIsR0FBdUQsU0FBUyxDQUFDO1FBQ3RGLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUNwQixpQkFBaUIsR0FBRyxDQUFDO29CQUNuQixHQUFHLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRztvQkFDaEMsY0FBYyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQWM7aUJBQ3ZELENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxLQUFLLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxhQUFhLEtBQUssU0FBUyxFQUFFO1lBQzNELE1BQU0sSUFBSSxLQUFLLENBQUMsc0VBQXNFLENBQUMsQ0FBQztTQUN6RjtRQUNELElBQUksS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekQsTUFBTSxJQUFJLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1NBQzdEO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0YsSUFBSSxLQUFLLENBQUMsb0JBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsWUFBWSxFQUFFO2VBQ3ZFLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUU7WUFDekcsTUFBTSxJQUFJLEtBQUssQ0FBQyxxRUFBcUUsS0FBSyxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQztTQUNySDtRQUVELE1BQU0sUUFBUSxHQUFnQixJQUFJLDhCQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5RCxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVU7Z0JBQ3ZELEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUztnQkFDbkQsZUFBZSxFQUFFLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhO2dCQUNqRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQ3hCLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVE7YUFDL0I7WUFDRCxNQUFNLEVBQUUsV0FBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQztZQUN6RCxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sS0FBSyxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTztZQUN6RSxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNuRCxXQUFXLEVBQUUsS0FBSyxDQUFDLE9BQU8sS0FBSyxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ3ZFLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxLQUFLLGlCQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSTtZQUM5RSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO1lBQ3ZCLGtHQUFrRztZQUNsRyxvREFBb0Q7WUFDcEQsV0FBVyxFQUFFLFdBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQztZQUMxRSxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxFQUFFLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUU7YUFDL0MsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUNiLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztZQUNuQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDO1lBQzdELDRCQUE0QixFQUFFLEtBQUssQ0FBQyw0QkFBNEI7WUFDaEUsV0FBVyxFQUFFLGlCQUFpQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO2dCQUN4QixVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFVO2dCQUNsQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLGdCQUFnQjthQUMvQyxDQUFDO1lBQ0YsU0FBUyxFQUFFLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxNQUFNO1lBQzlDLGlCQUFpQjtZQUNqQixvQkFBb0IsRUFBRSxLQUFLLENBQUMsaUJBQWlCLEVBQUUsb0JBQW9CO1lBQ25FLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDekUsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLHFCQUFxQixFQUFFLHVCQUF1QjtTQUM5RSxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsS0FBSyxTQUFTLENBQUMsRUFBRTtZQUM5RSxRQUFRLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuRjtRQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUNoRSxPQUFPLEVBQUUsUUFBUTtZQUNqQixRQUFRLEVBQUUsVUFBVTtZQUNwQixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsU0FBUyxFQUFFLGdCQUFTLENBQUMsbUJBQW1CO1NBQ3pDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFFN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxJQUFJLDJCQUFZLENBQUMsTUFBTSxDQUFDO1FBRTlELElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNoQixJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssaUJBQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQzthQUMzRTtZQUVELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakM7UUFFRCxLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksRUFBRSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUI7UUFFRCxnQkFBZ0I7UUFDaEIsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFO1lBQ3RCLE1BQU0sWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO2dCQUMvRCxZQUFZLEVBQUUsZUFBZSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNoRCxTQUFTLEVBQUUsS0FBSyxDQUFDLFlBQVk7Z0JBQzdCLElBQUksRUFBRSxLQUFLLENBQUMsZ0JBQWdCO2dCQUM1Qix3QkFBd0IsRUFBRSxLQUFLLENBQUMsd0JBQXlEO2FBQzFGLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDNUY7UUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwQyxzQkFBc0I7UUFDdEIsSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVMsRUFBRTtZQUNoRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7Z0JBQ3hCLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztnQkFDMUIsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO2dCQUMxQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7Z0JBQzlCLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTthQUNuQyxDQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMscUJBQXFCLENBQUM7UUFFekQsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQzthQUMvRTtZQUNELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQ3ZDLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtnQkFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDL0M7WUFDRCxvR0FBb0c7WUFDcEcsMEdBQTBHO1lBQzFHLHdFQUF3RTtZQUN4RSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQzNDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNoQyxJQUFJLEtBQUssWUFBWSxrQkFBVyxJQUFJLEtBQUssQ0FBQyxlQUFlLEtBQUssK0JBQStCLEVBQUU7d0JBQzdGLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUNwQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUM5QyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDaEMsSUFBSSxLQUFLLFlBQVksa0JBQVcsSUFBSSxLQUFLLENBQUMsZUFBZSxLQUFLLGdDQUFnQyxFQUFFO3dCQUM5RixRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDcEM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVwQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDMUM7SUFsZkQ7Ozs7Ozs7T0FPRztJQUNILElBQVcsY0FBYztRQUN2QixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQzdCO1FBRUQsSUFBSSxJQUFJLENBQUMsMkJBQTJCLEVBQUU7WUFDcEMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFDO1FBQUEsQ0FBQztRQUVGLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSx3QkFBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN6RCxNQUFNLEVBQUUsSUFBSTtZQUNaLEdBQUcsSUFBSSxDQUFDLHFCQUFxQjtTQUM5QixDQUFDLENBQUM7UUFFSCwwRUFBMEU7UUFDMUUseUVBQXlFO1FBQ3pFLHNDQUFzQztRQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUEyQixDQUFDO1FBQ2xFLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBVyxDQUFDO1FBRXRFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFJLENBQUMsY0FBYyxDQUFDO1lBQ3hDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ1osTUFBTSxJQUFJLEdBQUcscUNBQXFCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25FLE1BQU0sU0FBUyxHQUFHLDZCQUFhLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RCxPQUFPLEdBQUcsU0FBUyxHQUFHLElBQUksRUFBRSxDQUFDO1lBQy9CLENBQUM7U0FDRixDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztLQUM3QjtJQUVELElBQVcsMEJBQTBCO1FBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7S0FDcEQ7SUFLRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsdUJBQXVCLENBQUMsWUFBb0IsRUFBRSxNQUFlO1FBQ3pFLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBTSxDQUFDO0tBQ3hDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsWUFBb0I7UUFDL0UsT0FBTyxRQUFRLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNoRCxXQUFXLEVBQUUsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ3JDLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixRQUFRLEVBQUUsVUFBVTtnQkFDcEIsWUFBWSxFQUFFLFlBQVk7Z0JBQzFCLFNBQVMsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQjthQUN6QyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsV0FBbUI7UUFDN0UsT0FBTyxRQUFRLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7S0FDcEU7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLHNCQUFzQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCOzs7Ozs7Ozs7O1FBQzFGLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDdEMsTUFBTSxZQUFZLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzNELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFFeEIsTUFBTSxNQUFPLFNBQVEsNEJBQVk7WUFZL0IsWUFBWSxDQUFZLEVBQUUsQ0FBUztnQkFDakMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ1Ysa0JBQWtCLEVBQUUsV0FBVztpQkFDaEMsQ0FBQyxDQUFDO2dCQWRXLGlCQUFZLEdBQUcsWUFBWSxDQUFDO2dCQUM1QixnQkFBVyxHQUFHLFdBQVcsQ0FBQztnQkFFMUIsU0FBSSxHQUFHLElBQUksQ0FBQztnQkFDWixvQkFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQzVCLGlCQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksSUFBSSwyQkFBWSxDQUFDLE1BQU0sQ0FBQztnQkFDekQsK0JBQTBCLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7Z0JBRXRFLHlCQUFvQixHQUFHLEtBQUssQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN2RSxxQkFBZ0IsR0FBRyxLQUFLLENBQUMsZUFBZSxJQUFJLEtBQUssQ0FBQztnQkFPbkUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFFM0UsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFO29CQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQzt3QkFDdEMsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQztxQkFDdEMsQ0FBQyxDQUFDO2lCQUNKO3FCQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsRUFBRTtvQkFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUM7d0JBQ3RDLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7cUJBQ3ZHLENBQUMsQ0FBQztpQkFDSjtZQUNILENBQUM7U0FDRjtRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQWtCLEVBQUUsS0FBZ0M7UUFDMUUsT0FBTyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDM0IsU0FBUyxFQUFFLFlBQVk7WUFDdkIsVUFBVTtZQUNWLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQztLQUNKO0lBQ0Q7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBZ0M7UUFDNUQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ2pFO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFnQztRQUM5RCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFnQztRQUNqRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDdEU7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDLEtBQWdDO1FBQy9ELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUNwRTtJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsNkJBQTZCLENBQUMsS0FBZ0M7UUFDMUUsa0VBQWtFO1FBQ2xFLG1FQUFtRTtRQUNuRSxpRUFBaUU7UUFDakUsc0VBQXNFO1FBQ3RFLGtFQUFrRTtRQUNsRSx1Q0FBdUM7UUFDdkMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDL0U7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLHVDQUF1QyxDQUFDLEtBQWdDO1FBQ3BGLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ3pGO0lBbVREOzs7Ozs7T0FNRztJQUNJLGNBQWMsQ0FBQyxHQUFXLEVBQUUsS0FBYSxFQUFFLE9BQTRCOzs7Ozs7Ozs7O1FBQzVFLHdGQUF3RjtRQUN4RiwyRUFBMkU7UUFDM0UsTUFBTSw0QkFBNEIsR0FBRztZQUNuQyxVQUFVO1lBQ1Ysa0JBQWtCO1lBQ2xCLFlBQVk7WUFDWixtQkFBbUI7WUFDbkIsMEJBQTBCO1lBQzFCLGlDQUFpQztZQUNqQyw2QkFBNkI7WUFDN0IsZ0NBQWdDO1lBQ2hDLDJCQUEyQjtZQUMzQiw0QkFBNEI7WUFDNUIsZ0JBQWdCO1lBQ2hCLG1CQUFtQjtZQUNuQix1QkFBdUI7WUFDdkIsbUJBQW1CO1lBQ25CLHdCQUF3QjtZQUN4QixrQkFBa0I7WUFDbEIsb0JBQW9CO1NBQ3JCLENBQUM7UUFDRixJQUFJLDRCQUE0QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM5QyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsR0FBRyxrS0FBa0ssQ0FBQyxDQUFDO1NBQzNMO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDO1FBQzlDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FpQkc7SUFDSSx3QkFBd0IsQ0FBQyxDQUFTO1FBQ3ZDLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7U0FDakY7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN6QjtJQUVEOzs7Ozs7T0FNRztJQUNJLFNBQVMsQ0FBQyxHQUFHLE1BQXVCOzs7Ozs7Ozs7O1FBQ3pDLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO1lBQzFCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7YUFDckY7WUFDRCxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFO2dCQUM5RyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEYsTUFBTSxJQUFJLEtBQUssQ0FBQyw2RUFBNkUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGVBQWUsUUFBUSxJQUFJLENBQUMsQ0FBQzthQUM1STtZQUVELDZFQUE2RTtZQUM3RSxtRkFBbUY7WUFDbkYsNkJBQTZCO1lBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCO0tBQ0Y7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXlCRztJQUNJLFVBQVUsQ0FDZixJQUFZLEVBQ1osVUFBbUIsRUFDbkIsV0FBb0IsRUFDcEIscUJBQThCLEVBQzlCLG9CQUE4QyxFQUFFOzs7Ozs7Ozs7OztRQUVoRCxPQUFPLElBQUksd0JBQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxHQUFHLElBQUksRUFBRTtZQUN6QyxNQUFNLEVBQUUsSUFBSTtZQUNaLFVBQVU7WUFDVixXQUFXO1lBQ1gsK0JBQStCLEVBQUUscUJBQXFCO1lBQ3RELEdBQUcsaUJBQWlCO1NBQ3JCLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXFCRztJQUNJLFFBQVEsQ0FBQyxTQUFpQixFQUFFLE9BQXNCOzs7Ozs7Ozs7O1FBQ3ZELE9BQU8sZUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNoRTtJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILElBQVcsUUFBUTtRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixNQUFNLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtnQkFDL0QsWUFBWSxFQUFFLGVBQWUsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDaEQsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUTthQUN2QyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzVHO1FBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0tBQ3ZCO0lBRUQsZ0JBQWdCO0lBQ1QsdUJBQXVCO1FBQzVCLGlCQUFpQjtRQUNqQixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwRCxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksVUFBVSxFQUFFO1lBQ3RDLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtnQkFDdkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixrQkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLHFEQUFxRCxDQUFDLENBQUM7YUFDbkc7U0FDRjtRQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLG9DQUFvQyxPQUFPO21KQUNvRCxDQUFDLENBQUM7U0FDaEo7UUFFRCxPQUFPO0tBQ1I7SUFFRDs7Ozs7T0FLRztJQUNLLHVCQUF1QixDQUFDLEtBQW9CO1FBQ2xELElBQUksS0FBSyxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFDdkMsT0FBTztTQUNSO1FBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLGlCQUFPLENBQUMsVUFBVSxFQUFFO1lBQ3hDLHlHQUF5RztZQUN6RyxpSEFBaUg7WUFDakgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBWSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUM1SDtRQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLENBQUM7S0FDeEg7SUFFRDs7OztPQUlHO0lBQ0ssNEJBQTRCLENBQUMsS0FBb0I7UUFFdkQsSUFBSSxLQUFLLENBQUMsbUJBQW1CLEtBQUssU0FBUyxFQUFFO1lBQzNDLE9BQU87U0FDUjtRQUVELElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxpQkFBTyxDQUFDLFVBQVUsRUFBRTtZQUN4QyxNQUFNLElBQUksS0FBSyxDQUFDLHlFQUF5RSxDQUFDLENBQUM7U0FDNUY7UUFFRCxzRkFBc0Y7UUFDdEYsdURBQXVEO1FBQ3ZELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxpQkFBTyxDQUFDLE1BQU0sRUFBRTtZQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7U0FDN0U7UUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFZLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVILElBQUksQ0FBQyxjQUFjLENBQUMseUJBQXlCLEVBQUUsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3ZGO0lBRU8sWUFBWTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDOUMsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxJQUFJLG1CQUFZLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyx1Q0FBOEIsQ0FBQyxFQUFFO1lBQ25FLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDckI7UUFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3pEO0lBRU8saUJBQWlCO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbkUsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxNQUFNLFNBQVMsR0FBOEIsRUFBRSxDQUFDO1FBQ2hELDhEQUE4RDtRQUM5RCx5RUFBeUU7UUFDekUsZ0ZBQWdGO1FBQ2hGLHlFQUF5RTtRQUN6RSx1RUFBdUU7UUFDdkUsVUFBVTtRQUNWLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlO1lBQy9CLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDdEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWxDLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ3RCLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUM5QztRQUVELE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQztLQUN0QjtJQUVEOzs7OztPQUtHO0lBQ0ssWUFBWSxDQUFDLEtBQW9CO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDL0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRkFBc0YsQ0FBQyxDQUFDO1NBQ3pHO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQzthQUM5RTtZQUNELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBR0QsSUFBSSxLQUFLLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLEVBQUU7WUFDL0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RUFBd0UsQ0FBQyxDQUFDO1NBQzNGO1FBRUQsSUFBSSxjQUFvQyxDQUFDO1FBRXpDLElBQUksS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFO1lBQy9DLE1BQU0sSUFBSSxLQUFLLENBQUMsNkVBQTZFLENBQUMsQ0FBQztTQUNoRztRQUVELElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtZQUN4QixjQUFjLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztTQUN2QzthQUFNO1lBQ0wsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtnQkFDeEYsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO2dCQUNkLFdBQVcsRUFBRSwrQ0FBK0MsR0FBRyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDbkYsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQjthQUN6QyxDQUFDLENBQUM7WUFDSCxjQUFjLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNsQztRQUVELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUU1RCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDcEIsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7Z0JBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoRTtTQUNGO1FBRUQsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsaUJBQWlCLElBQUksS0FBSyxDQUFDO1FBQzNELE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRSxNQUFNLGVBQWUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM5RSxLQUFLLE1BQU0sUUFBUSxJQUFJLGVBQWUsQ0FBQyxTQUFTLEVBQUU7WUFDaEQsSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ3ZELE1BQU0sSUFBSSxLQUFLLENBQUMsbUVBQW1FO29CQUNqRixvSUFBb0ksQ0FBQyxDQUFDO2FBQ3pJO1NBQ0Y7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUV6RSwrRUFBK0U7UUFDL0UsNkVBQTZFO1FBQzdFLDRDQUE0QztRQUU1QyxPQUFPO1lBQ0wsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTO1lBQ3BDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDO1NBQy9ELENBQUM7S0FDSDtJQUVPLE9BQU8sQ0FBQyxlQUF3QztRQUN0RCxPQUFvQixlQUFnQixDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUM7S0FDN0Q7SUFFTyxvQkFBb0IsQ0FBQyxLQUFvQjtRQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7WUFDckYsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxJQUFJLEtBQUssQ0FBQyxlQUFlLElBQUksS0FBSyxDQUFDLHNCQUFzQixLQUFLLEtBQUssRUFBRTtZQUNuRSxNQUFNLEtBQUssQ0FBQyw0RUFBNEUsQ0FBQyxDQUFDO1NBQzNGO1FBQ0QsSUFBSSxLQUFLLENBQUMsZUFBZSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsSUFBSSxLQUFLLENBQUMsc0JBQXNCLEtBQUssU0FBUyxDQUFDLEVBQUU7WUFDbEcsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO1NBQ3RHO1FBRUQsSUFBSSxlQUF3QyxDQUFDO1FBQzdDLElBQUksS0FBSyxDQUFDLGVBQWUsRUFBRTtZQUN6QixlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztnQkFDM0MsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDO2dCQUN4QixTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO2FBQ3RDLENBQUMsQ0FBQyxDQUFDO1NBQ0w7YUFBTTtZQUNMLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7Z0JBQ2hGLGVBQWUsRUFBRSxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzthQUNuQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztnQkFDM0MsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7Z0JBQzVCLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7YUFDdEMsQ0FBQyxDQUFDLENBQUM7U0FDTDtRQUVELE9BQU8sZUFBZSxDQUFDO0tBQ3hCO0lBRU8scUJBQXFCLENBQUMsZUFBeUM7UUFDckUsSUFBSSxlQUFlLEVBQUU7WUFDbkIsT0FBTztnQkFDTCxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFFBQVE7YUFDL0YsQ0FBQztTQUNIO2FBQU07WUFDTCxPQUFPLFNBQVMsQ0FBQztTQUNsQjtLQUNGO0lBRU8sa0JBQWtCLENBQUMsT0FBZ0I7UUFDekMsSUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sS0FBSyxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ3pELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDM0MsT0FBTyxFQUFFLENBQUMsdUJBQXVCLEVBQUUsMEJBQTBCLENBQUM7WUFDOUQsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTztZQUNMLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQztLQUNIO0lBRU8saUJBQWlCLENBQUMsS0FBb0I7UUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQXlCLEVBQUU7WUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ3pGO1FBQ0QsSUFBSSxLQUFLLENBQUMsV0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQywrQkFBK0IsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLDZCQUE2QixDQUFDLEVBQUU7WUFDL0gsTUFBTSxJQUFJLEtBQUssQ0FBQyxrSEFBa0gsQ0FBQyxDQUFDO1NBQ3JJO0tBQ0Y7O0FBNzRCSCw0QkE4NEJDOzs7QUFqMkJDLGdCQUFnQjtBQUNGLG1CQUFVLEdBQStCLEVBQUUsQ0FBQztBQXUzQjVEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILFNBQVMsa0JBQWtCLENBQUMsR0FBVztJQUNyQyxPQUFPLFNBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLElBQWdCLEVBQUUsS0FBb0I7SUFDckUscUJBQXFCO0lBQ3JCLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVoRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLGlGQUFpRixDQUFDLENBQUM7S0FDcEc7SUFFRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQzNELE1BQU0sSUFBSSxLQUFLLENBQUMsaUZBQWlGLENBQUMsQ0FBQztLQUNwRztJQUVELElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLGlCQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDM0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxpRkFBaUYsQ0FBQyxDQUFDO0tBQ3BHO0lBRUQsMERBQTBEO0lBQzFELElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7UUFDeEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsS0FBSyxDQUFDLE9BQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ3pFO0FBQ0gsQ0FBQztBQXBCRCw0Q0FvQkM7QUFFRCxTQUFTLGlCQUFpQixDQUFJLE1BQVM7SUFDckMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUM7SUFDM0UsT0FBTyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQzNDLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFhLHNCQUFzQjtJQUNqQyxZQUE2QixXQUFtQixFQUFtQixVQUFRLElBQUk7UUFBbEQsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFBbUIsWUFBTyxHQUFQLE9BQU8sQ0FBSztLQUFJO0lBRTVFLEtBQUssQ0FBQyxJQUFnQjtRQUMzQixJQUFJLElBQUksWUFBWSxRQUFRO1lBQzFCLElBQUksQ0FBQyxPQUFPLEtBQUssbUJBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNwRSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQTJCLENBQUM7WUFDMUQsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxRSxXQUFXLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLEdBQUcsSUFBSSxnQkFBZ0IscUNBQXFCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3RHO0tBQ0Y7SUFBQSxDQUFDOztBQVZKLHdEQVdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgeyBJUHJvZmlsaW5nR3JvdXAsIFByb2ZpbGluZ0dyb3VwLCBDb21wdXRlUGxhdGZvcm0gfSBmcm9tICdAYXdzLWNkay9hd3MtY29kZWd1cnVwcm9maWxlcic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCB7IEFubm90YXRpb25zLCBBcm5Gb3JtYXQsIENmblJlc291cmNlLCBEdXJhdGlvbiwgRmVhdHVyZUZsYWdzLCBGbiwgSUFzcGVjdCwgTGF6eSwgTmFtZXMsIFNpemUsIFN0YWNrLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgTEFNQkRBX1JFQ09HTklaRV9MQVlFUl9WRVJTSU9OIH0gZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCwgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWRvdEluc3RydW1lbnRhdGlvbkNvbmZpZyB9IGZyb20gJy4vYWRvdC1sYXllcnMnO1xuaW1wb3J0IHsgQWxpYXNPcHRpb25zLCBBbGlhcyB9IGZyb20gJy4vYWxpYXMnO1xuaW1wb3J0IHsgQXJjaGl0ZWN0dXJlIH0gZnJvbSAnLi9hcmNoaXRlY3R1cmUnO1xuaW1wb3J0IHsgQ29kZSwgQ29kZUNvbmZpZyB9IGZyb20gJy4vY29kZSc7XG5pbXBvcnQgeyBJQ29kZVNpZ25pbmdDb25maWcgfSBmcm9tICcuL2NvZGUtc2lnbmluZy1jb25maWcnO1xuaW1wb3J0IHsgRXZlbnRJbnZva2VDb25maWdPcHRpb25zIH0gZnJvbSAnLi9ldmVudC1pbnZva2UtY29uZmlnJztcbmltcG9ydCB7IElFdmVudFNvdXJjZSB9IGZyb20gJy4vZXZlbnQtc291cmNlJztcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tICcuL2ZpbGVzeXN0ZW0nO1xuaW1wb3J0IHsgRnVuY3Rpb25BdHRyaWJ1dGVzLCBGdW5jdGlvbkJhc2UsIElGdW5jdGlvbiB9IGZyb20gJy4vZnVuY3Rpb24tYmFzZSc7XG5pbXBvcnQgeyBjYWxjdWxhdGVGdW5jdGlvbkhhc2gsIHRyaW1Gcm9tU3RhcnQgfSBmcm9tICcuL2Z1bmN0aW9uLWhhc2gnO1xuaW1wb3J0IHsgSGFuZGxlciB9IGZyb20gJy4vaGFuZGxlcic7XG5pbXBvcnQgeyBMYW1iZGFJbnNpZ2h0c1ZlcnNpb24gfSBmcm9tICcuL2xhbWJkYS1pbnNpZ2h0cyc7XG5pbXBvcnQgeyBWZXJzaW9uLCBWZXJzaW9uT3B0aW9ucyB9IGZyb20gJy4vbGFtYmRhLXZlcnNpb24nO1xuaW1wb3J0IHsgQ2ZuRnVuY3Rpb24gfSBmcm9tICcuL2xhbWJkYS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgTGF5ZXJWZXJzaW9uLCBJTGF5ZXJWZXJzaW9uIH0gZnJvbSAnLi9sYXllcnMnO1xuaW1wb3J0IHsgTG9nUmV0ZW50aW9uUmV0cnlPcHRpb25zIH0gZnJvbSAnLi9sb2ctcmV0ZW50aW9uJztcbmltcG9ydCB7IFJ1bnRpbWUgfSBmcm9tICcuL3J1bnRpbWUnO1xuaW1wb3J0IHsgUnVudGltZU1hbmFnZW1lbnRNb2RlIH0gZnJvbSAnLi9ydW50aW1lLW1hbmFnZW1lbnQnO1xuaW1wb3J0IHsgYWRkQWxpYXMgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIFgtUmF5IFRyYWNpbmcgTW9kZXMgKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9sYW1iZGEvbGF0ZXN0L2RnL0FQSV9UcmFjaW5nQ29uZmlnLmh0bWwpXG4gKi9cbmV4cG9ydCBlbnVtIFRyYWNpbmcge1xuICAvKipcbiAgICogTGFtYmRhIHdpbGwgcmVzcGVjdCBhbnkgdHJhY2luZyBoZWFkZXIgaXQgcmVjZWl2ZXMgZnJvbSBhbiB1cHN0cmVhbSBzZXJ2aWNlLlxuICAgKiBJZiBubyB0cmFjaW5nIGhlYWRlciBpcyByZWNlaXZlZCwgTGFtYmRhIHdpbGwgc2FtcGxlIHRoZSByZXF1ZXN0IGJhc2VkIG9uIGEgZml4ZWQgcmF0ZS4gUGxlYXNlIHNlZSB0aGUgW1VzaW5nIEFXUyBMYW1iZGEgd2l0aCBBV1MgWC1SYXldKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9sYW1iZGEvbGF0ZXN0L2RnL3NlcnZpY2VzLXhyYXkuaHRtbCkgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscyBvbiB0aGlzIHNhbXBsaW5nIGJlaGF2aW9yLlxuICAgKi9cbiAgQUNUSVZFID0gJ0FjdGl2ZScsXG4gIC8qKlxuICAgKiBMYW1iZGEgd2lsbCBvbmx5IHRyYWNlIHRoZSByZXF1ZXN0IGZyb20gYW4gdXBzdHJlYW0gc2VydmljZVxuICAgKiBpZiBpdCBjb250YWlucyBhIHRyYWNpbmcgaGVhZGVyIHdpdGggXCJzYW1wbGVkPTFcIlxuICAgKi9cbiAgUEFTU19USFJPVUdIID0gJ1Bhc3NUaHJvdWdoJyxcbiAgLyoqXG4gICAqIExhbWJkYSB3aWxsIG5vdCB0cmFjZSBhbnkgcmVxdWVzdC5cbiAgICovXG4gIERJU0FCTEVEID0gJ0Rpc2FibGVkJ1xufVxuXG4vKipcbiAqIE5vbiBydW50aW1lIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGdW5jdGlvbk9wdGlvbnMgZXh0ZW5kcyBFdmVudEludm9rZUNvbmZpZ09wdGlvbnMge1xuICAvKipcbiAgICogQSBkZXNjcmlwdGlvbiBvZiB0aGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGZ1bmN0aW9uIGV4ZWN1dGlvbiB0aW1lIChpbiBzZWNvbmRzKSBhZnRlciB3aGljaCBMYW1iZGEgdGVybWluYXRlc1xuICAgKiB0aGUgZnVuY3Rpb24uIEJlY2F1c2UgdGhlIGV4ZWN1dGlvbiB0aW1lIGFmZmVjdHMgY29zdCwgc2V0IHRoaXMgdmFsdWVcbiAgICogYmFzZWQgb24gdGhlIGZ1bmN0aW9uJ3MgZXhwZWN0ZWQgZXhlY3V0aW9uIHRpbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLnNlY29uZHMoMylcbiAgICovXG4gIHJlYWRvbmx5IHRpbWVvdXQ/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogS2V5LXZhbHVlIHBhaXJzIHRoYXQgTGFtYmRhIGNhY2hlcyBhbmQgbWFrZXMgYXZhaWxhYmxlIGZvciB5b3VyIExhbWJkYVxuICAgKiBmdW5jdGlvbnMuIFVzZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgdG8gYXBwbHkgY29uZmlndXJhdGlvbiBjaGFuZ2VzLCBzdWNoXG4gICAqIGFzIHRlc3QgYW5kIHByb2R1Y3Rpb24gZW52aXJvbm1lbnQgY29uZmlndXJhdGlvbnMsIHdpdGhvdXQgY2hhbmdpbmcgeW91clxuICAgKiBMYW1iZGEgZnVuY3Rpb24gc291cmNlIGNvZGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgZW52aXJvbm1lbnQ/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBBIG5hbWUgZm9yIHRoZSBmdW5jdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBV1MgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVzIGEgdW5pcXVlIHBoeXNpY2FsIElEIGFuZCB1c2VzIHRoYXRcbiAgICogSUQgZm9yIHRoZSBmdW5jdGlvbidzIG5hbWUuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgTmFtZSBUeXBlLlxuICAgKi9cbiAgcmVhZG9ubHkgZnVuY3Rpb25OYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIG1lbW9yeSwgaW4gTUIsIHRoYXQgaXMgYWxsb2NhdGVkIHRvIHlvdXIgTGFtYmRhIGZ1bmN0aW9uLlxuICAgKiBMYW1iZGEgdXNlcyB0aGlzIHZhbHVlIHRvIHByb3BvcnRpb25hbGx5IGFsbG9jYXRlIHRoZSBhbW91bnQgb2YgQ1BVXG4gICAqIHBvd2VyLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFJlc291cmNlIE1vZGVsIGluIHRoZSBBV1MgTGFtYmRhXG4gICAqIERldmVsb3BlciBHdWlkZS5cbiAgICpcbiAgICogQGRlZmF1bHQgMTI4XG4gICAqL1xuICByZWFkb25seSBtZW1vcnlTaXplPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgc2l6ZSBvZiB0aGUgZnVuY3Rpb27igJlzIC90bXAgZGlyZWN0b3J5IGluIE1pQi5cbiAgICpcbiAgICogQGRlZmF1bHQgNTEyIE1pQlxuICAgKi9cbiAgcmVhZG9ubHkgZXBoZW1lcmFsU3RvcmFnZVNpemU/OiBTaXplO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsIHBvbGljeSBzdGF0ZW1lbnRzIHRvIGFkZCB0byB0aGUgY3JlYXRlZCBMYW1iZGEgUm9sZS5cbiAgICpcbiAgICogWW91IGNhbiBjYWxsIGBhZGRUb1JvbGVQb2xpY3lgIHRvIHRoZSBjcmVhdGVkIGxhbWJkYSB0byBhZGQgc3RhdGVtZW50cyBwb3N0IGNyZWF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHBvbGljeSBzdGF0ZW1lbnRzIGFyZSBhZGRlZCB0byB0aGUgY3JlYXRlZCBMYW1iZGEgcm9sZS5cbiAgICovXG4gIHJlYWRvbmx5IGluaXRpYWxQb2xpY3k/OiBpYW0uUG9saWN5U3RhdGVtZW50W107XG5cbiAgLyoqXG4gICAqIExhbWJkYSBleGVjdXRpb24gcm9sZS5cbiAgICpcbiAgICogVGhpcyBpcyB0aGUgcm9sZSB0aGF0IHdpbGwgYmUgYXNzdW1lZCBieSB0aGUgZnVuY3Rpb24gdXBvbiBleGVjdXRpb24uXG4gICAqIEl0IGNvbnRyb2xzIHRoZSBwZXJtaXNzaW9ucyB0aGF0IHRoZSBmdW5jdGlvbiB3aWxsIGhhdmUuIFRoZSBSb2xlIG11c3RcbiAgICogYmUgYXNzdW1hYmxlIGJ5IHRoZSAnbGFtYmRhLmFtYXpvbmF3cy5jb20nIHNlcnZpY2UgcHJpbmNpcGFsLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBSb2xlIGF1dG9tYXRpY2FsbHkgaGFzIHBlcm1pc3Npb25zIGdyYW50ZWQgZm9yIExhbWJkYSBleGVjdXRpb24uIElmIHlvdVxuICAgKiBwcm92aWRlIGEgUm9sZSwgeW91IG11c3QgYWRkIHRoZSByZWxldmFudCBBV1MgbWFuYWdlZCBwb2xpY2llcyB5b3Vyc2VsZi5cbiAgICpcbiAgICogVGhlIHJlbGV2YW50IG1hbmFnZWQgcG9saWNpZXMgYXJlIFwic2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZVwiIGFuZFxuICAgKiBcInNlcnZpY2Utcm9sZS9BV1NMYW1iZGFWUENBY2Nlc3NFeGVjdXRpb25Sb2xlXCIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSB1bmlxdWUgcm9sZSB3aWxsIGJlIGdlbmVyYXRlZCBmb3IgdGhpcyBsYW1iZGEgZnVuY3Rpb24uXG4gICAqIEJvdGggc3VwcGxpZWQgYW5kIGdlbmVyYXRlZCByb2xlcyBjYW4gYWx3YXlzIGJlIGNoYW5nZWQgYnkgY2FsbGluZyBgYWRkVG9Sb2xlUG9saWN5YC5cbiAgICovXG4gIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFZQQyBuZXR3b3JrIHRvIHBsYWNlIExhbWJkYSBuZXR3b3JrIGludGVyZmFjZXNcbiAgICpcbiAgICogU3BlY2lmeSB0aGlzIGlmIHRoZSBMYW1iZGEgZnVuY3Rpb24gbmVlZHMgdG8gYWNjZXNzIHJlc291cmNlcyBpbiBhIFZQQy5cbiAgICogVGhpcyBpcyByZXF1aXJlZCB3aGVuIGB2cGNTdWJuZXRzYCBpcyBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRnVuY3Rpb24gaXMgbm90IHBsYWNlZCB3aXRoaW4gYSBWUEMuXG4gICAqL1xuICByZWFkb25seSB2cGM/OiBlYzIuSVZwYztcblxuICAvKipcbiAgICogV2hlcmUgdG8gcGxhY2UgdGhlIG5ldHdvcmsgaW50ZXJmYWNlcyB3aXRoaW4gdGhlIFZQQy5cbiAgICpcbiAgICogVGhpcyByZXF1aXJlcyBgdnBjYCB0byBiZSBzcGVjaWZpZWQgaW4gb3JkZXIgZm9yIGludGVyZmFjZXMgdG8gYWN0dWFsbHkgYmVcbiAgICogcGxhY2VkIGluIHRoZSBzdWJuZXRzLiBJZiBgdnBjYCBpcyBub3Qgc3BlY2lmeSwgdGhpcyB3aWxsIHJhaXNlIGFuIGVycm9yLlxuICAgKlxuICAgKiBOb3RlOiBJbnRlcm5ldCBhY2Nlc3MgZm9yIExhbWJkYSBGdW5jdGlvbnMgcmVxdWlyZXMgYSBOQVQgR2F0ZXdheSwgc28gcGlja2luZ1xuICAgKiBwdWJsaWMgc3VibmV0cyBpcyBub3QgYWxsb3dlZCAodW5sZXNzIGBhbGxvd1B1YmxpY1N1Ym5ldGAgaXMgc2V0IHRvIGB0cnVlYCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIFZwYyBkZWZhdWx0IHN0cmF0ZWd5IGlmIG5vdCBzcGVjaWZpZWRcbiAgICovXG4gIHJlYWRvbmx5IHZwY1N1Ym5ldHM/OiBlYzIuU3VibmV0U2VsZWN0aW9uO1xuXG4gIC8qKlxuICAgKiBXaGF0IHNlY3VyaXR5IGdyb3VwIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBMYW1iZGEncyBuZXR3b3JrIGludGVyZmFjZXMuXG4gICAqIFRoaXMgcHJvcGVydHkgaXMgYmVpbmcgZGVwcmVjYXRlZCwgY29uc2lkZXIgdXNpbmcgc2VjdXJpdHlHcm91cHMgaW5zdGVhZC5cbiAgICpcbiAgICogT25seSB1c2VkIGlmICd2cGMnIGlzIHN1cHBsaWVkLlxuICAgKlxuICAgKiBVc2Ugc2VjdXJpdHlHcm91cHMgcHJvcGVydHkgaW5zdGVhZC5cbiAgICogRnVuY3Rpb24gY29uc3RydWN0b3Igd2lsbCB0aHJvdyBhbiBlcnJvciBpZiBib3RoIGFyZSBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSWYgdGhlIGZ1bmN0aW9uIGlzIHBsYWNlZCB3aXRoaW4gYSBWUEMgYW5kIGEgc2VjdXJpdHkgZ3JvdXAgaXNcbiAgICogbm90IHNwZWNpZmllZCwgZWl0aGVyIGJ5IHRoaXMgb3Igc2VjdXJpdHlHcm91cHMgcHJvcCwgYSBkZWRpY2F0ZWQgc2VjdXJpdHlcbiAgICogZ3JvdXAgd2lsbCBiZSBjcmVhdGVkIGZvciB0aGlzIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAtIFRoaXMgcHJvcGVydHkgaXMgZGVwcmVjYXRlZCwgdXNlIHNlY3VyaXR5R3JvdXBzIGluc3RlYWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIHNlY3VyaXR5IGdyb3VwcyB0byBhc3NvY2lhdGUgd2l0aCB0aGUgTGFtYmRhJ3MgbmV0d29yayBpbnRlcmZhY2VzLlxuICAgKlxuICAgKiBPbmx5IHVzZWQgaWYgJ3ZwYycgaXMgc3VwcGxpZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSWYgdGhlIGZ1bmN0aW9uIGlzIHBsYWNlZCB3aXRoaW4gYSBWUEMgYW5kIGEgc2VjdXJpdHkgZ3JvdXAgaXNcbiAgICogbm90IHNwZWNpZmllZCwgZWl0aGVyIGJ5IHRoaXMgb3Igc2VjdXJpdHlHcm91cCBwcm9wLCBhIGRlZGljYXRlZCBzZWN1cml0eVxuICAgKiBncm91cCB3aWxsIGJlIGNyZWF0ZWQgZm9yIHRoaXMgZnVuY3Rpb24uXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3Vwcz86IGVjMi5JU2VjdXJpdHlHcm91cFtdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGFsbG93IHRoZSBMYW1iZGEgdG8gc2VuZCBhbGwgbmV0d29yayB0cmFmZmljXG4gICAqXG4gICAqIElmIHNldCB0byBmYWxzZSwgeW91IG11c3QgaW5kaXZpZHVhbGx5IGFkZCB0cmFmZmljIHJ1bGVzIHRvIGFsbG93IHRoZVxuICAgKiBMYW1iZGEgdG8gY29ubmVjdCB0byBuZXR3b3JrIHRhcmdldHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93QWxsT3V0Ym91bmQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFbmFibGVkIERMUS4gSWYgYGRlYWRMZXR0ZXJRdWV1ZWAgaXMgdW5kZWZpbmVkLFxuICAgKiBhbiBTUVMgcXVldWUgd2l0aCBkZWZhdWx0IG9wdGlvbnMgd2lsbCBiZSBkZWZpbmVkIGZvciB5b3VyIEZ1bmN0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlIHVubGVzcyBgZGVhZExldHRlclF1ZXVlYCBpcyBzZXQsIHdoaWNoIGltcGxpZXMgRExRIGlzIGVuYWJsZWQuXG4gICAqL1xuICByZWFkb25seSBkZWFkTGV0dGVyUXVldWVFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIFNRUyBxdWV1ZSB0byB1c2UgaWYgRExRIGlzIGVuYWJsZWQuXG4gICAqIElmIFNOUyB0b3BpYyBpcyBkZXNpcmVkLCBzcGVjaWZ5IGBkZWFkTGV0dGVyVG9waWNgIHByb3BlcnR5IGluc3RlYWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gU1FTIHF1ZXVlIHdpdGggMTQgZGF5IHJldGVudGlvbiBwZXJpb2QgaWYgYGRlYWRMZXR0ZXJRdWV1ZUVuYWJsZWRgIGlzIGB0cnVlYFxuICAgKi9cbiAgcmVhZG9ubHkgZGVhZExldHRlclF1ZXVlPzogc3FzLklRdWV1ZTtcblxuICAvKipcbiAgICogVGhlIFNOUyB0b3BpYyB0byB1c2UgYXMgYSBETFEuXG4gICAqIE5vdGUgdGhhdCBpZiBgZGVhZExldHRlclF1ZXVlRW5hYmxlZGAgaXMgc2V0IHRvIGB0cnVlYCwgYW4gU1FTIHF1ZXVlIHdpbGwgYmUgY3JlYXRlZFxuICAgKiByYXRoZXIgdGhhbiBhbiBTTlMgdG9waWMuIFVzaW5nIGFuIFNOUyB0b3BpYyBhcyBhIERMUSByZXF1aXJlcyB0aGlzIHByb3BlcnR5IHRvIGJlIHNldCBleHBsaWNpdGx5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIFNOUyB0b3BpY1xuICAgKi9cbiAgcmVhZG9ubHkgZGVhZExldHRlclRvcGljPzogc25zLklUb3BpYztcblxuICAvKipcbiAgICogRW5hYmxlIEFXUyBYLVJheSBUcmFjaW5nIGZvciBMYW1iZGEgRnVuY3Rpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IFRyYWNpbmcuRGlzYWJsZWRcbiAgICovXG4gIHJlYWRvbmx5IHRyYWNpbmc/OiBUcmFjaW5nO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgcHJvZmlsaW5nLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlZ3VydS9sYXRlc3QvcHJvZmlsZXItdWcvc2V0dGluZy11cC1sYW1iZGEuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHByb2ZpbGluZy5cbiAgICovXG4gIHJlYWRvbmx5IHByb2ZpbGluZz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFByb2ZpbGluZyBHcm91cC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWd1cnUvbGF0ZXN0L3Byb2ZpbGVyLXVnL3NldHRpbmctdXAtbGFtYmRhLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5ldyBwcm9maWxpbmcgZ3JvdXAgd2lsbCBiZSBjcmVhdGVkIGlmIGBwcm9maWxpbmdgIGlzIHNldC5cbiAgICovXG4gIHJlYWRvbmx5IHByb2ZpbGluZ0dyb3VwPzogSVByb2ZpbGluZ0dyb3VwO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSB2ZXJzaW9uIG9mIENsb3VkV2F0Y2ggTGFtYmRhIGluc2lnaHRzIHRvIHVzZSBmb3IgbW9uaXRvcmluZ1xuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9tb25pdG9yaW5nL0xhbWJkYS1JbnNpZ2h0cy5odG1sXG4gICAqXG4gICAqIFdoZW4gdXNlZCB3aXRoIGBEb2NrZXJJbWFnZUZ1bmN0aW9uYCBvciBgRG9ja2VySW1hZ2VDb2RlYCwgdGhlIERvY2tlciBpbWFnZSBzaG91bGQgaGF2ZVxuICAgKiB0aGUgTGFtYmRhIGluc2lnaHRzIGFnZW50IGluc3RhbGxlZC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbW9uaXRvcmluZy9MYW1iZGEtSW5zaWdodHMtR2V0dGluZy1TdGFydGVkLWRvY2tlci5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gTGFtYmRhIEluc2lnaHRzXG4gICAqL1xuICByZWFkb25seSBpbnNpZ2h0c1ZlcnNpb24/OiBMYW1iZGFJbnNpZ2h0c1ZlcnNpb247XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIGNvbmZpZ3VyYXRpb24gb2YgQVdTIERpc3RybyBmb3IgT3BlblRlbGVtZXRyeSAoQURPVCkgaW5zdHJ1bWVudGF0aW9uXG4gICAqIEBzZWUgaHR0cHM6Ly9hd3Mtb3RlbC5naXRodWIuaW8vZG9jcy9nZXR0aW5nLXN0YXJ0ZWQvbGFtYmRhXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gQURPVCBpbnN0cnVtZW50YXRpb25cbiAgICovXG4gIHJlYWRvbmx5IGFkb3RJbnN0cnVtZW50YXRpb24/OiBBZG90SW5zdHJ1bWVudGF0aW9uQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgbGF5ZXJzIHRvIGFkZCB0byB0aGUgZnVuY3Rpb24ncyBleGVjdXRpb24gZW52aXJvbm1lbnQuIFlvdSBjYW4gY29uZmlndXJlIHlvdXIgTGFtYmRhIGZ1bmN0aW9uIHRvIHB1bGwgaW5cbiAgICogYWRkaXRpb25hbCBjb2RlIGR1cmluZyBpbml0aWFsaXphdGlvbiBpbiB0aGUgZm9ybSBvZiBsYXllcnMuIExheWVycyBhcmUgcGFja2FnZXMgb2YgbGlicmFyaWVzIG9yIG90aGVyIGRlcGVuZGVuY2llc1xuICAgKiB0aGF0IGNhbiBiZSB1c2VkIGJ5IG11bHRpcGxlIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBsYXllcnMuXG4gICAqL1xuICByZWFkb25seSBsYXllcnM/OiBJTGF5ZXJWZXJzaW9uW107XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIG9mIGNvbmN1cnJlbnQgZXhlY3V0aW9ucyB5b3Ugd2FudCB0byByZXNlcnZlIGZvciB0aGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc3BlY2lmaWMgbGltaXQgLSBhY2NvdW50IGxpbWl0LlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9sYW1iZGEvbGF0ZXN0L2RnL2NvbmN1cnJlbnQtZXhlY3V0aW9ucy5odG1sXG4gICAqL1xuICByZWFkb25seSByZXNlcnZlZENvbmN1cnJlbnRFeGVjdXRpb25zPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBFdmVudCBzb3VyY2VzIGZvciB0aGlzIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBZb3UgY2FuIGFsc28gYWRkIGV2ZW50IHNvdXJjZXMgdXNpbmcgYGFkZEV2ZW50U291cmNlYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBldmVudCBzb3VyY2VzLlxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRzPzogSUV2ZW50U291cmNlW107XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgZGF5cyBsb2cgZXZlbnRzIGFyZSBrZXB0IGluIENsb3VkV2F0Y2ggTG9ncy4gV2hlbiB1cGRhdGluZ1xuICAgKiB0aGlzIHByb3BlcnR5LCB1bnNldHRpbmcgaXQgZG9lc24ndCByZW1vdmUgdGhlIGxvZyByZXRlbnRpb24gcG9saWN5LiBUb1xuICAgKiByZW1vdmUgdGhlIHJldGVudGlvbiBwb2xpY3ksIHNldCB0aGUgdmFsdWUgdG8gYElORklOSVRFYC5cbiAgICpcbiAgICogQGRlZmF1bHQgbG9ncy5SZXRlbnRpb25EYXlzLklORklOSVRFXG4gICAqL1xuICByZWFkb25seSBsb2dSZXRlbnRpb24/OiBsb2dzLlJldGVudGlvbkRheXM7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gcm9sZSBmb3IgdGhlIExhbWJkYSBmdW5jdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGN1c3RvbSByZXNvdXJjZVxuICAgKiB0aGF0IHNldHMgdGhlIHJldGVudGlvbiBwb2xpY3kuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuZXcgcm9sZSBpcyBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9nUmV0ZW50aW9uUm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogV2hlbiBsb2cgcmV0ZW50aW9uIGlzIHNwZWNpZmllZCwgYSBjdXN0b20gcmVzb3VyY2UgYXR0ZW1wdHMgdG8gY3JlYXRlIHRoZSBDbG91ZFdhdGNoIGxvZyBncm91cC5cbiAgICogVGhlc2Ugb3B0aW9ucyBjb250cm9sIHRoZSByZXRyeSBwb2xpY3kgd2hlbiBpbnRlcmFjdGluZyB3aXRoIENsb3VkV2F0Y2ggQVBJcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZWZhdWx0IEFXUyBTREsgcmV0cnkgb3B0aW9ucy5cbiAgICovXG4gIHJlYWRvbmx5IGxvZ1JldGVudGlvblJldHJ5T3B0aW9ucz86IExvZ1JldGVudGlvblJldHJ5T3B0aW9ucztcblxuICAvKipcbiAgICogT3B0aW9ucyBmb3IgdGhlIGBsYW1iZGEuVmVyc2lvbmAgcmVzb3VyY2UgYXV0b21hdGljYWxseSBjcmVhdGVkIGJ5IHRoZVxuICAgKiBgZm4uY3VycmVudFZlcnNpb25gIG1ldGhvZC5cbiAgICogQGRlZmF1bHQgLSBkZWZhdWx0IG9wdGlvbnMgYXMgZGVzY3JpYmVkIGluIGBWZXJzaW9uT3B0aW9uc2BcbiAgICovXG4gIHJlYWRvbmx5IGN1cnJlbnRWZXJzaW9uT3B0aW9ucz86IFZlcnNpb25PcHRpb25zO1xuXG4gIC8qKlxuICAgKiBUaGUgZmlsZXN5c3RlbSBjb25maWd1cmF0aW9uIGZvciB0aGUgbGFtYmRhIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gd2lsbCBub3QgbW91bnQgYW55IGZpbGVzeXN0ZW1cbiAgICovXG4gIHJlYWRvbmx5IGZpbGVzeXN0ZW0/OiBGaWxlU3lzdGVtO1xuXG4gIC8qKlxuICAgKiBMYW1iZGEgRnVuY3Rpb25zIGluIGEgcHVibGljIHN1Ym5ldCBjYW4gTk9UIGFjY2VzcyB0aGUgaW50ZXJuZXQuXG4gICAqIFVzZSB0aGlzIHByb3BlcnR5IHRvIGFja25vd2xlZGdlIHRoaXMgbGltaXRhdGlvbiBhbmQgc3RpbGwgcGxhY2UgdGhlIGZ1bmN0aW9uIGluIGEgcHVibGljIHN1Ym5ldC5cbiAgICogQHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81Mjk5MjA4NS93aHktY2FudC1hbi1hd3MtbGFtYmRhLWZ1bmN0aW9uLWluc2lkZS1hLXB1YmxpYy1zdWJuZXQtaW4tYS12cGMtY29ubmVjdC10by10aGUvNTI5OTQ4NDEjNTI5OTQ4NDFcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93UHVibGljU3VibmV0PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIEFXUyBLTVMga2V5IHRoYXQncyB1c2VkIHRvIGVuY3J5cHQgeW91ciBmdW5jdGlvbidzIGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBV1MgTGFtYmRhIGNyZWF0ZXMgYW5kIHVzZXMgYW4gQVdTIG1hbmFnZWQgY3VzdG9tZXIgbWFzdGVyIGtleSAoQ01LKS5cbiAgICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50RW5jcnlwdGlvbj86IGttcy5JS2V5O1xuXG4gIC8qKlxuICAgKiBDb2RlIHNpZ25pbmcgY29uZmlnIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm90IFNpZ24gdGhlIENvZGVcbiAgICovXG4gIHJlYWRvbmx5IGNvZGVTaWduaW5nQ29uZmlnPzogSUNvZGVTaWduaW5nQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBERVBSRUNBVEVEXG4gICAqIEBkZWZhdWx0IFtBcmNoaXRlY3R1cmUuWDg2XzY0XVxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGFyY2hpdGVjdHVyZWBcbiAgICovXG4gIHJlYWRvbmx5IGFyY2hpdGVjdHVyZXM/OiBBcmNoaXRlY3R1cmVbXTtcblxuICAvKipcbiAgICogVGhlIHN5c3RlbSBhcmNoaXRlY3R1cmVzIGNvbXBhdGlibGUgd2l0aCB0aGlzIGxhbWJkYSBmdW5jdGlvbi5cbiAgICogQGRlZmF1bHQgQXJjaGl0ZWN0dXJlLlg4Nl82NFxuICAgKi9cbiAgcmVhZG9ubHkgYXJjaGl0ZWN0dXJlPzogQXJjaGl0ZWN0dXJlO1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBydW50aW1lIG1hbmFnZW1lbnQgY29uZmlndXJhdGlvbiBmb3IgYSBmdW5jdGlvbidzIHZlcnNpb24uXG4gICAqIEBkZWZhdWx0IEF1dG9cbiAgICovXG4gIHJlYWRvbmx5IHJ1bnRpbWVNYW5hZ2VtZW50TW9kZT86IFJ1bnRpbWVNYW5hZ2VtZW50TW9kZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGdW5jdGlvblByb3BzIGV4dGVuZHMgRnVuY3Rpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBydW50aW1lIGVudmlyb25tZW50IGZvciB0aGUgTGFtYmRhIGZ1bmN0aW9uIHRoYXQgeW91IGFyZSB1cGxvYWRpbmcuXG4gICAqIEZvciB2YWxpZCB2YWx1ZXMsIHNlZSB0aGUgUnVudGltZSBwcm9wZXJ0eSBpbiB0aGUgQVdTIExhbWJkYSBEZXZlbG9wZXJcbiAgICogR3VpZGUuXG4gICAqXG4gICAqIFVzZSBgUnVudGltZS5GUk9NX0lNQUdFYCB3aGVuIGRlZmluaW5nIGEgZnVuY3Rpb24gZnJvbSBhIERvY2tlciBpbWFnZS5cbiAgICovXG4gIHJlYWRvbmx5IHJ1bnRpbWU6IFJ1bnRpbWU7XG5cbiAgLyoqXG4gICAqIFRoZSBzb3VyY2UgY29kZSBvZiB5b3VyIExhbWJkYSBmdW5jdGlvbi4gWW91IGNhbiBwb2ludCB0byBhIGZpbGUgaW4gYW5cbiAgICogQW1hem9uIFNpbXBsZSBTdG9yYWdlIFNlcnZpY2UgKEFtYXpvbiBTMykgYnVja2V0IG9yIHNwZWNpZnkgeW91ciBzb3VyY2VcbiAgICogY29kZSBhcyBpbmxpbmUgdGV4dC5cbiAgICovXG4gIHJlYWRvbmx5IGNvZGU6IENvZGU7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBtZXRob2Qgd2l0aGluIHlvdXIgY29kZSB0aGF0IExhbWJkYSBjYWxscyB0byBleGVjdXRlXG4gICAqIHlvdXIgZnVuY3Rpb24uIFRoZSBmb3JtYXQgaW5jbHVkZXMgdGhlIGZpbGUgbmFtZS4gSXQgY2FuIGFsc28gaW5jbHVkZVxuICAgKiBuYW1lc3BhY2VzIGFuZCBvdGhlciBxdWFsaWZpZXJzLCBkZXBlbmRpbmcgb24gdGhlIHJ1bnRpbWUuXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2xhbWJkYS9sYXRlc3QvZGcvZm91bmRhdGlvbi1wcm9nbW9kZWwuaHRtbC5cbiAgICpcbiAgICogVXNlIGBIYW5kbGVyLkZST01fSU1BR0VgIHdoZW4gZGVmaW5pbmcgYSBmdW5jdGlvbiBmcm9tIGEgRG9ja2VyIGltYWdlLlxuICAgKlxuICAgKiBOT1RFOiBJZiB5b3Ugc3BlY2lmeSB5b3VyIHNvdXJjZSBjb2RlIGFzIGlubGluZSB0ZXh0IGJ5IHNwZWNpZnlpbmcgdGhlXG4gICAqIFppcEZpbGUgcHJvcGVydHkgd2l0aGluIHRoZSBDb2RlIHByb3BlcnR5LCBzcGVjaWZ5IGluZGV4LmZ1bmN0aW9uX25hbWUgYXNcbiAgICogdGhlIGhhbmRsZXIuXG4gICAqL1xuICByZWFkb25seSBoYW5kbGVyOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVwbG95cyBhIGZpbGUgZnJvbSBpbnNpZGUgdGhlIGNvbnN0cnVjdCBsaWJyYXJ5IGFzIGEgZnVuY3Rpb24uXG4gKlxuICogVGhlIHN1cHBsaWVkIGZpbGUgaXMgc3ViamVjdCB0byB0aGUgNDA5NiBieXRlcyBsaW1pdCBvZiBiZWluZyBlbWJlZGRlZCBpbiBhXG4gKiBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAqXG4gKiBUaGUgY29uc3RydWN0IGluY2x1ZGVzIGFuIGFzc29jaWF0ZWQgcm9sZSB3aXRoIHRoZSBsYW1iZGEuXG4gKlxuICogVGhpcyBjb25zdHJ1Y3QgZG9lcyBub3QgeWV0IHJlcHJvZHVjZSBhbGwgZmVhdHVyZXMgZnJvbSB0aGUgdW5kZXJseWluZyByZXNvdXJjZVxuICogbGlicmFyeS5cbiAqL1xuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uIGV4dGVuZHMgRnVuY3Rpb25CYXNlIHtcblxuICAvKipcbiAgICogUmV0dXJucyBhIGBsYW1iZGEuVmVyc2lvbmAgd2hpY2ggcmVwcmVzZW50cyB0aGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoaXNcbiAgICogTGFtYmRhIGZ1bmN0aW9uLiBBIG5ldyB2ZXJzaW9uIHdpbGwgYmUgY3JlYXRlZCBldmVyeSB0aW1lIHRoZSBmdW5jdGlvbidzXG4gICAqIGNvbmZpZ3VyYXRpb24gY2hhbmdlcy5cbiAgICpcbiAgICogWW91IGNhbiBzcGVjaWZ5IG9wdGlvbnMgZm9yIHRoaXMgdmVyc2lvbiB1c2luZyB0aGUgYGN1cnJlbnRWZXJzaW9uT3B0aW9uc2BcbiAgICogcHJvcCB3aGVuIGluaXRpYWxpemluZyB0aGUgYGxhbWJkYS5GdW5jdGlvbmAuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGN1cnJlbnRWZXJzaW9uKCk6IFZlcnNpb24ge1xuICAgIGlmICh0aGlzLl9jdXJyZW50VmVyc2lvbikge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRWZXJzaW9uO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl93YXJuSWZDdXJyZW50VmVyc2lvbkNhbGxlZCkge1xuICAgICAgdGhpcy53YXJuSW52b2tlRnVuY3Rpb25QZXJtaXNzaW9ucyh0aGlzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fY3VycmVudFZlcnNpb24gPSBuZXcgVmVyc2lvbih0aGlzLCAnQ3VycmVudFZlcnNpb24nLCB7XG4gICAgICBsYW1iZGE6IHRoaXMsXG4gICAgICAuLi50aGlzLmN1cnJlbnRWZXJzaW9uT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIC8vIG92ZXJyaWRlIHRoZSB2ZXJzaW9uJ3MgbG9naWNhbCBJRCB3aXRoIGEgbGF6eSBzdHJpbmcgd2hpY2ggaW5jbHVkZXMgdGhlXG4gICAgLy8gaGFzaCBvZiB0aGUgZnVuY3Rpb24gaXRzZWxmLCBzbyBhIG5ldyB2ZXJzaW9uIHJlc291cmNlIGlzIGNyZWF0ZWQgd2hlblxuICAgIC8vIHRoZSBmdW5jdGlvbiBjb25maWd1cmF0aW9uIGNoYW5nZXMuXG4gICAgY29uc3QgY2ZuID0gdGhpcy5fY3VycmVudFZlcnNpb24ubm9kZS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuUmVzb3VyY2U7XG4gICAgY29uc3Qgb3JpZ2luYWxMb2dpY2FsSWQgPSB0aGlzLnN0YWNrLnJlc29sdmUoY2ZuLmxvZ2ljYWxJZCkgYXMgc3RyaW5nO1xuXG4gICAgY2ZuLm92ZXJyaWRlTG9naWNhbElkKExhenkudW5jYWNoZWRTdHJpbmcoe1xuICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICBjb25zdCBoYXNoID0gY2FsY3VsYXRlRnVuY3Rpb25IYXNoKHRoaXMsIHRoaXMuaGFzaE1peGlucy5qb2luKCcnKSk7XG4gICAgICAgIGNvbnN0IGxvZ2ljYWxJZCA9IHRyaW1Gcm9tU3RhcnQob3JpZ2luYWxMb2dpY2FsSWQsIDI1NSAtIDMyKTtcbiAgICAgICAgcmV0dXJuIGAke2xvZ2ljYWxJZH0ke2hhc2h9YDtcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRWZXJzaW9uO1xuICB9XG5cbiAgcHVibGljIGdldCByZXNvdXJjZUFybnNGb3JHcmFudEludm9rZSgpIHtcbiAgICByZXR1cm4gW3RoaXMuZnVuY3Rpb25Bcm4sIGAke3RoaXMuZnVuY3Rpb25Bcm59OipgXTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIHN0YXRpYyBfVkVSX1BST1BTOiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9O1xuXG4gIC8qKlxuICAgKiBSZWNvcmQgd2hldGhlciBzcGVjaWZpYyBwcm9wZXJ0aWVzIGluIHRoZSBgQVdTOjpMYW1iZGE6OkZ1bmN0aW9uYCByZXNvdXJjZSBzaG91bGRcbiAgICogYWxzbyBiZSBhc3NvY2lhdGVkIHRvIHRoZSBWZXJzaW9uIHJlc291cmNlLlxuICAgKiBTZWUgJ2N1cnJlbnRWZXJzaW9uJyBzZWN0aW9uIGluIHRoZSBtb2R1bGUgUkVBRE1FIGZvciBtb3JlIGRldGFpbHMuXG4gICAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgVGhlIHByb3BlcnR5IHRvIGNsYXNzaWZ5XG4gICAqIEBwYXJhbSBsb2NrZWQgd2hldGhlciB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIGFzc29jaWF0ZWQgdG8gdGhlIHZlcnNpb24gb3Igbm90LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjbGFzc2lmeVZlcnNpb25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWU6IHN0cmluZywgbG9ja2VkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fVkVSX1BST1BTW3Byb3BlcnR5TmFtZV0gPSBsb2NrZWQ7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGEgbGFtYmRhIGZ1bmN0aW9uIGludG8gdGhlIENESyB1c2luZyBpdHMgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRnVuY3Rpb25OYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGZ1bmN0aW9uTmFtZTogc3RyaW5nKTogSUZ1bmN0aW9uIHtcbiAgICByZXR1cm4gRnVuY3Rpb24uZnJvbUZ1bmN0aW9uQXR0cmlidXRlcyhzY29wZSwgaWQsIHtcbiAgICAgIGZ1bmN0aW9uQXJuOiBTdGFjay5vZihzY29wZSkuZm9ybWF0QXJuKHtcbiAgICAgICAgc2VydmljZTogJ2xhbWJkYScsXG4gICAgICAgIHJlc291cmNlOiAnZnVuY3Rpb24nLFxuICAgICAgICByZXNvdXJjZU5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhIGxhbWJkYSBmdW5jdGlvbiBpbnRvIHRoZSBDREsgdXNpbmcgaXRzIEFSTlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRnVuY3Rpb25Bcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZnVuY3Rpb25Bcm46IHN0cmluZyk6IElGdW5jdGlvbiB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uLmZyb21GdW5jdGlvbkF0dHJpYnV0ZXMoc2NvcGUsIGlkLCB7IGZ1bmN0aW9uQXJuIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBMYW1iZGEgZnVuY3Rpb24gb2JqZWN0IHdoaWNoIHJlcHJlc2VudHMgYSBmdW5jdGlvbiBub3QgZGVmaW5lZFxuICAgKiB3aXRoaW4gdGhpcyBzdGFjay5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCBUaGUgbmFtZSBvZiB0aGUgbGFtYmRhIGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gYXR0cnMgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGZ1bmN0aW9uIHRvIGltcG9ydFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRnVuY3Rpb25BdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBGdW5jdGlvbkF0dHJpYnV0ZXMpOiBJRnVuY3Rpb24ge1xuICAgIGNvbnN0IGZ1bmN0aW9uQXJuID0gYXR0cnMuZnVuY3Rpb25Bcm47XG4gICAgY29uc3QgZnVuY3Rpb25OYW1lID0gZXh0cmFjdE5hbWVGcm9tQXJuKGF0dHJzLmZ1bmN0aW9uQXJuKTtcbiAgICBjb25zdCByb2xlID0gYXR0cnMucm9sZTtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIEZ1bmN0aW9uQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25OYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGZ1bmN0aW9uQXJuID0gZnVuY3Rpb25Bcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJvbGUgPSByb2xlO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHBlcm1pc3Npb25zTm9kZSA9IHRoaXMubm9kZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhcmNoaXRlY3R1cmUgPSBhdHRycy5hcmNoaXRlY3R1cmUgPz8gQXJjaGl0ZWN0dXJlLlg4Nl82NDtcbiAgICAgIHB1YmxpYyByZWFkb25seSByZXNvdXJjZUFybnNGb3JHcmFudEludm9rZSA9IFt0aGlzLmZ1bmN0aW9uQXJuLCBgJHt0aGlzLmZ1bmN0aW9uQXJufToqYF07XG5cbiAgICAgIHByb3RlY3RlZCByZWFkb25seSBjYW5DcmVhdGVQZXJtaXNzaW9ucyA9IGF0dHJzLnNhbWVFbnZpcm9ubWVudCA/PyB0aGlzLl9pc1N0YWNrQWNjb3VudCgpO1xuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IF9za2lwUGVybWlzc2lvbnMgPSBhdHRycy5za2lwUGVybWlzc2lvbnMgPz8gZmFsc2U7XG5cbiAgICAgIGNvbnN0cnVjdG9yKHM6IENvbnN0cnVjdCwgaTogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHMsIGksIHtcbiAgICAgICAgICBlbnZpcm9ubWVudEZyb21Bcm46IGZ1bmN0aW9uQXJuLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gcm9sZSB8fCBuZXcgaWFtLlVua25vd25QcmluY2lwYWwoeyByZXNvdXJjZTogdGhpcyB9KTtcblxuICAgICAgICBpZiAoYXR0cnMuc2VjdXJpdHlHcm91cCkge1xuICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucyh7XG4gICAgICAgICAgICBzZWN1cml0eUdyb3VwczogW2F0dHJzLnNlY3VyaXR5R3JvdXBdLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHJzLnNlY3VyaXR5R3JvdXBJZCkge1xuICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucyh7XG4gICAgICAgICAgICBzZWN1cml0eUdyb3VwczogW2VjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQoc2NvcGUsICdTZWN1cml0eUdyb3VwJywgYXR0cnMuc2VjdXJpdHlHcm91cElkKV0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZ2l2ZW4gbmFtZWQgbWV0cmljIGZvciB0aGlzIExhbWJkYVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtZXRyaWNBbGwobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9MYW1iZGEnLFxuICAgICAgbWV0cmljTmFtZSxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgRXJyb3JzIGV4ZWN1dGluZyBhbGwgTGFtYmRhc1xuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWV0cmljQWxsRXJyb3JzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY0FsbCgnRXJyb3JzJywgeyBzdGF0aXN0aWM6ICdzdW0nLCAuLi5wcm9wcyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBEdXJhdGlvbiBleGVjdXRpbmcgYWxsIExhbWJkYXNcbiAgICpcbiAgICogQGRlZmF1bHQgYXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtZXRyaWNBbGxEdXJhdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNBbGwoJ0R1cmF0aW9uJywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBpbnZvY2F0aW9ucyBvZiBhbGwgTGFtYmRhc1xuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWV0cmljQWxsSW52b2NhdGlvbnMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljQWxsKCdJbnZvY2F0aW9ucycsIHsgc3RhdGlzdGljOiAnc3VtJywgLi4ucHJvcHMgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHRocm90dGxlZCBpbnZvY2F0aW9ucyBvZiBhbGwgTGFtYmRhc1xuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWV0cmljQWxsVGhyb3R0bGVzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY0FsbCgnVGhyb3R0bGVzJywgeyBzdGF0aXN0aWM6ICdzdW0nLCAuLi5wcm9wcyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgY29uY3VycmVudCBleGVjdXRpb25zIGFjcm9zcyBhbGwgTGFtYmRhc1xuICAgKlxuICAgKiBAZGVmYXVsdCBtYXggb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWV0cmljQWxsQ29uY3VycmVudEV4ZWN1dGlvbnMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgLy8gTWluaS1GQVE6IHdoeSBtYXg/IFRoaXMgbWV0cmljIGlzIGEgZ2F1Z2UgdGhhdCBpcyBlbWl0dGVkIGV2ZXJ5XG4gICAgLy8gbWludXRlLCBzbyBlaXRoZXIgbWF4IG9yIGF2ZyBvciBhIHBlcmNlbnRpbGUgbWFrZSBzZW5zZSAoYnV0IHN1bVxuICAgIC8vIGRvZXNuJ3QpLiBNYXggaXMgbW9yZSBzZW5zaXRpdmUgdG8gc3Bpa3kgbG9hZCBjaGFuZ2VzIHdoaWNoIGlzXG4gICAgLy8gcHJvYmFibHkgd2hhdCB5b3UncmUgaW50ZXJlc3RlZCBpbiBpZiB5b3UncmUgbG9va2luZyBhdCB0aGlzIG1ldHJpY1xuICAgIC8vIChMb2FkIHNwaWtlcyBtYXkgbGVhZCB0byBjb25jdXJyZW50IGV4ZWN1dGlvbiBlcnJvcnMgdGhhdCB3b3VsZFxuICAgIC8vIG90aGVyd2lzZSBub3QgYmUgdmlzaWJsZSBpbiB0aGUgYXZnKVxuICAgIHJldHVybiB0aGlzLm1ldHJpY0FsbCgnQ29uY3VycmVudEV4ZWN1dGlvbnMnLCB7IHN0YXRpc3RpYzogJ21heCcsIC4uLnByb3BzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB1bnJlc2VydmVkIGNvbmN1cnJlbnQgZXhlY3V0aW9ucyBhY3Jvc3MgYWxsIExhbWJkYXNcbiAgICpcbiAgICogQGRlZmF1bHQgbWF4IG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1ldHJpY0FsbFVucmVzZXJ2ZWRDb25jdXJyZW50RXhlY3V0aW9ucyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNBbGwoJ1VucmVzZXJ2ZWRDb25jdXJyZW50RXhlY3V0aW9ucycsIHsgc3RhdGlzdGljOiAnbWF4JywgLi4ucHJvcHMgfSk7XG4gIH1cblxuICAvKipcbiAgICogTmFtZSBvZiB0aGlzIGZ1bmN0aW9uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFSTiBvZiB0aGlzIGZ1bmN0aW9uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25Bcm46IHN0cmluZztcblxuICAvKipcbiAgICogRXhlY3V0aW9uIHJvbGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZnVuY3Rpb25cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgcnVudGltZSBjb25maWd1cmVkIGZvciB0aGlzIGxhbWJkYS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBydW50aW1lOiBSdW50aW1lO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJpbmNpcGFsIHRoaXMgTGFtYmRhIEZ1bmN0aW9uIGlzIHJ1bm5pbmcgYXNcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogaWFtLklQcmluY2lwYWw7XG5cbiAgLyoqXG4gICAqIFRoZSBETFEgKGFzIHF1ZXVlKSBhc3NvY2lhdGVkIHdpdGggdGhpcyBMYW1iZGEgRnVuY3Rpb24gKHRoaXMgaXMgYW4gb3B0aW9uYWwgYXR0cmlidXRlKS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZWFkTGV0dGVyUXVldWU/OiBzcXMuSVF1ZXVlO1xuXG4gIC8qKlxuICAgKiBUaGUgRExRIChhcyB0b3BpYykgYXNzb2NpYXRlZCB3aXRoIHRoaXMgTGFtYmRhIEZ1bmN0aW9uICh0aGlzIGlzIGFuIG9wdGlvbmFsIGF0dHJpYnV0ZSkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVhZExldHRlclRvcGljPzogc25zLklUb3BpYztcblxuICAvKipcbiAgICogVGhlIGFyY2hpdGVjdHVyZSBvZiB0aGlzIExhbWJkYSBGdW5jdGlvbiAodGhpcyBpcyBhbiBvcHRpb25hbCBhdHRyaWJ1dGUgYW5kIGRlZmF1bHRzIHRvIFg4Nl82NCkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXJjaGl0ZWN0dXJlOiBBcmNoaXRlY3R1cmU7XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lb3V0IGNvbmZpZ3VyZWQgZm9yIHRoaXMgbGFtYmRhLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRpbWVvdXQ/OiBEdXJhdGlvbjtcblxuICBwdWJsaWMgcmVhZG9ubHkgcGVybWlzc2lvbnNOb2RlID0gdGhpcy5ub2RlO1xuXG4gIHByb3RlY3RlZCByZWFkb25seSBjYW5DcmVhdGVQZXJtaXNzaW9ucyA9IHRydWU7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgcmVhZG9ubHkgX2xheWVyczogSUxheWVyVmVyc2lvbltdID0gW107XG5cbiAgcHJpdmF0ZSBfbG9nR3JvdXA/OiBsb2dzLklMb2dHcm91cDtcblxuICAvKipcbiAgICogRW52aXJvbm1lbnQgdmFyaWFibGVzIGZvciB0aGlzIGZ1bmN0aW9uXG4gICAqL1xuICBwcml2YXRlIGVudmlyb25tZW50OiB7IFtrZXk6IHN0cmluZ106IEVudmlyb25tZW50Q29uZmlnIH0gPSB7fTtcblxuICBwcml2YXRlIHJlYWRvbmx5IGN1cnJlbnRWZXJzaW9uT3B0aW9ucz86IFZlcnNpb25PcHRpb25zO1xuICBwcml2YXRlIF9jdXJyZW50VmVyc2lvbj86IFZlcnNpb247XG5cbiAgcHJpdmF0ZSBfYXJjaGl0ZWN0dXJlPzogQXJjaGl0ZWN0dXJlO1xuICBwcml2YXRlIGhhc2hNaXhpbnMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBGdW5jdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmZ1bmN0aW9uTmFtZSxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5mdW5jdGlvbk5hbWUgJiYgIVRva2VuLmlzVW5yZXNvbHZlZChwcm9wcy5mdW5jdGlvbk5hbWUpKSB7XG4gICAgICBpZiAocHJvcHMuZnVuY3Rpb25OYW1lLmxlbmd0aCA+IDY0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRnVuY3Rpb24gbmFtZSBjYW4gbm90IGJlIGxvbmdlciB0aGFuIDY0IGNoYXJhY3RlcnMgYnV0IGhhcyAke3Byb3BzLmZ1bmN0aW9uTmFtZS5sZW5ndGh9IGNoYXJhY3RlcnMuYCk7XG4gICAgICB9XG4gICAgICBpZiAoIS9eW2EtekEtWjAtOS1fXSskLy50ZXN0KHByb3BzLmZ1bmN0aW9uTmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGdW5jdGlvbiBuYW1lICR7cHJvcHMuZnVuY3Rpb25OYW1lfSBjYW4gY29udGFpbiBvbmx5IGxldHRlcnMsIG51bWJlcnMsIGh5cGhlbnMsIG9yIHVuZGVyc2NvcmVzIHdpdGggbm8gc3BhY2VzLmApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5kZXNjcmlwdGlvbiAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLmRlc2NyaXB0aW9uKSkge1xuICAgICAgaWYgKHByb3BzLmRlc2NyaXB0aW9uLmxlbmd0aCA+IDI1Nikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZ1bmN0aW9uIGRlc2NyaXB0aW9uIGNhbiBub3QgYmUgbG9uZ2VyIHRoYW4gMjU2IGNoYXJhY3RlcnMgYnV0IGhhcyAke3Byb3BzLmRlc2NyaXB0aW9uLmxlbmd0aH0gY2hhcmFjdGVycy5gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtYW5hZ2VkUG9saWNpZXMgPSBuZXcgQXJyYXk8aWFtLklNYW5hZ2VkUG9saWN5PigpO1xuXG4gICAgLy8gdGhlIGFybiBpcyBpbiB0aGUgZm9ybSBvZiAtIGFybjphd3M6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGVcbiAgICBtYW5hZ2VkUG9saWNpZXMucHVzaChpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnKSk7XG5cbiAgICBpZiAocHJvcHMudnBjKSB7XG4gICAgICAvLyBQb2xpY3kgdGhhdCB3aWxsIGhhdmUgRU5JIGNyZWF0aW9uIHBlcm1pc3Npb25zXG4gICAgICBtYW5hZ2VkUG9saWNpZXMucHVzaChpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFWUENBY2Nlc3NFeGVjdXRpb25Sb2xlJykpO1xuICAgIH1cblxuICAgIHRoaXMucm9sZSA9IHByb3BzLnJvbGUgfHwgbmV3IGlhbS5Sb2xlKHRoaXMsICdTZXJ2aWNlUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgbWFuYWdlZFBvbGljaWVzLFxuICAgIH0pO1xuICAgIHRoaXMuZ3JhbnRQcmluY2lwYWwgPSB0aGlzLnJvbGU7XG5cbiAgICAvLyBhZGQgYWRkaXRpb25hbCBtYW5hZ2VkIHBvbGljaWVzIHdoZW4gbmVjZXNzYXJ5XG4gICAgaWYgKHByb3BzLmZpbGVzeXN0ZW0pIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHByb3BzLmZpbGVzeXN0ZW0uY29uZmlnO1xuICAgICAgaWYgKGNvbmZpZy5wb2xpY2llcykge1xuICAgICAgICBjb25maWcucG9saWNpZXMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICB0aGlzLnJvbGU/LmFkZFRvUHJpbmNpcGFsUG9saWN5KHApO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHN0YXRlbWVudCBvZiAocHJvcHMuaW5pdGlhbFBvbGljeSB8fCBbXSkpIHtcbiAgICAgIHRoaXMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvZGUgPSBwcm9wcy5jb2RlLmJpbmQodGhpcyk7XG4gICAgdmVyaWZ5Q29kZUNvbmZpZyhjb2RlLCBwcm9wcyk7XG5cbiAgICBsZXQgcHJvZmlsaW5nR3JvdXBFbnZpcm9ubWVudFZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgIGlmIChwcm9wcy5wcm9maWxpbmdHcm91cCAmJiBwcm9wcy5wcm9maWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLnZhbGlkYXRlUHJvZmlsaW5nKHByb3BzKTtcbiAgICAgIHByb3BzLnByb2ZpbGluZ0dyb3VwLmdyYW50UHVibGlzaCh0aGlzLnJvbGUpO1xuICAgICAgcHJvZmlsaW5nR3JvdXBFbnZpcm9ubWVudFZhcmlhYmxlcyA9IHtcbiAgICAgICAgQVdTX0NPREVHVVJVX1BST0ZJTEVSX0dST1VQX0FSTjogU3RhY2sub2Yoc2NvcGUpLmZvcm1hdEFybih7XG4gICAgICAgICAgc2VydmljZTogJ2NvZGVndXJ1LXByb2ZpbGVyJyxcbiAgICAgICAgICByZXNvdXJjZTogJ3Byb2ZpbGluZ0dyb3VwJyxcbiAgICAgICAgICByZXNvdXJjZU5hbWU6IHByb3BzLnByb2ZpbGluZ0dyb3VwLnByb2ZpbGluZ0dyb3VwTmFtZSxcbiAgICAgICAgfSksXG4gICAgICAgIEFXU19DT0RFR1VSVV9QUk9GSUxFUl9FTkFCTEVEOiAnVFJVRScsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAocHJvcHMucHJvZmlsaW5nKSB7XG4gICAgICB0aGlzLnZhbGlkYXRlUHJvZmlsaW5nKHByb3BzKTtcbiAgICAgIGNvbnN0IHByb2ZpbGluZ0dyb3VwID0gbmV3IFByb2ZpbGluZ0dyb3VwKHRoaXMsICdQcm9maWxpbmdHcm91cCcsIHtcbiAgICAgICAgY29tcHV0ZVBsYXRmb3JtOiBDb21wdXRlUGxhdGZvcm0uQVdTX0xBTUJEQSxcbiAgICAgIH0pO1xuICAgICAgcHJvZmlsaW5nR3JvdXAuZ3JhbnRQdWJsaXNoKHRoaXMucm9sZSk7XG4gICAgICBwcm9maWxpbmdHcm91cEVudmlyb25tZW50VmFyaWFibGVzID0ge1xuICAgICAgICBBV1NfQ09ERUdVUlVfUFJPRklMRVJfR1JPVVBfQVJOOiBwcm9maWxpbmdHcm91cC5wcm9maWxpbmdHcm91cEFybixcbiAgICAgICAgQVdTX0NPREVHVVJVX1BST0ZJTEVSX0VOQUJMRUQ6ICdUUlVFJyxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgZW52ID0geyAuLi5wcm9maWxpbmdHcm91cEVudmlyb25tZW50VmFyaWFibGVzLCAuLi5wcm9wcy5lbnZpcm9ubWVudCB9O1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGVudikpIHtcbiAgICAgIHRoaXMuYWRkRW52aXJvbm1lbnQoa2V5LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gRExRIGNhbiBiZSBlaXRoZXIgc25zLklUb3BpYyBvciBzcXMuSVF1ZXVlXG4gICAgY29uc3QgZGxxVG9waWNPclF1ZXVlID0gdGhpcy5idWlsZERlYWRMZXR0ZXJRdWV1ZShwcm9wcyk7XG4gICAgaWYgKGRscVRvcGljT3JRdWV1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodGhpcy5pc1F1ZXVlKGRscVRvcGljT3JRdWV1ZSkpIHtcbiAgICAgICAgdGhpcy5kZWFkTGV0dGVyUXVldWUgPSBkbHFUb3BpY09yUXVldWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlYWRMZXR0ZXJUb3BpYyA9IGRscVRvcGljT3JRdWV1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZmlsZVN5c3RlbUNvbmZpZ3M6IENmbkZ1bmN0aW9uLkZpbGVTeXN0ZW1Db25maWdQcm9wZXJ0eVtdIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGlmIChwcm9wcy5maWxlc3lzdGVtKSB7XG4gICAgICBmaWxlU3lzdGVtQ29uZmlncyA9IFt7XG4gICAgICAgIGFybjogcHJvcHMuZmlsZXN5c3RlbS5jb25maWcuYXJuLFxuICAgICAgICBsb2NhbE1vdW50UGF0aDogcHJvcHMuZmlsZXN5c3RlbS5jb25maWcubG9jYWxNb3VudFBhdGgsXG4gICAgICB9XTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuYXJjaGl0ZWN0dXJlICYmIHByb3BzLmFyY2hpdGVjdHVyZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFaXRoZXIgYXJjaGl0ZWN0dXJlIG9yIGFyY2hpdGVjdHVyZXMgbXVzdCBiZSBzcGVjaWZpZWQgYnV0IG5vdCBib3RoLicpO1xuICAgIH1cbiAgICBpZiAocHJvcHMuYXJjaGl0ZWN0dXJlcyAmJiBwcm9wcy5hcmNoaXRlY3R1cmVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBvbmUgYXJjaGl0ZWN0dXJlIG11c3QgYmUgc3BlY2lmaWVkLicpO1xuICAgIH1cbiAgICB0aGlzLl9hcmNoaXRlY3R1cmUgPSBwcm9wcy5hcmNoaXRlY3R1cmUgPz8gKHByb3BzLmFyY2hpdGVjdHVyZXMgJiYgcHJvcHMuYXJjaGl0ZWN0dXJlc1swXSk7XG5cbiAgICBpZiAocHJvcHMuZXBoZW1lcmFsU3RvcmFnZVNpemUgJiYgIXByb3BzLmVwaGVtZXJhbFN0b3JhZ2VTaXplLmlzVW5yZXNvbHZlZCgpXG4gICAgICAmJiAocHJvcHMuZXBoZW1lcmFsU3RvcmFnZVNpemUudG9NZWJpYnl0ZXMoKSA8IDUxMiB8fCBwcm9wcy5lcGhlbWVyYWxTdG9yYWdlU2l6ZS50b01lYmlieXRlcygpID4gMTAyNDApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVwaGVtZXJhbCBzdG9yYWdlIHNpemUgbXVzdCBiZSBiZXR3ZWVuIDUxMiBhbmQgMTAyNDAgTUIsIHJlY2VpdmVkICR7cHJvcHMuZXBoZW1lcmFsU3RvcmFnZVNpemV9LmApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlOiBDZm5GdW5jdGlvbiA9IG5ldyBDZm5GdW5jdGlvbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgY29kZToge1xuICAgICAgICBzM0J1Y2tldDogY29kZS5zM0xvY2F0aW9uICYmIGNvZGUuczNMb2NhdGlvbi5idWNrZXROYW1lLFxuICAgICAgICBzM0tleTogY29kZS5zM0xvY2F0aW9uICYmIGNvZGUuczNMb2NhdGlvbi5vYmplY3RLZXksXG4gICAgICAgIHMzT2JqZWN0VmVyc2lvbjogY29kZS5zM0xvY2F0aW9uICYmIGNvZGUuczNMb2NhdGlvbi5vYmplY3RWZXJzaW9uLFxuICAgICAgICB6aXBGaWxlOiBjb2RlLmlubGluZUNvZGUsXG4gICAgICAgIGltYWdlVXJpOiBjb2RlLmltYWdlPy5pbWFnZVVyaSxcbiAgICAgIH0sXG4gICAgICBsYXllcnM6IExhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyTGF5ZXJzKCkgfSksIC8vIEV2YWx1YXRlZCBvbiBzeW50aGVzaXNcbiAgICAgIGhhbmRsZXI6IHByb3BzLmhhbmRsZXIgPT09IEhhbmRsZXIuRlJPTV9JTUFHRSA/IHVuZGVmaW5lZCA6IHByb3BzLmhhbmRsZXIsXG4gICAgICB0aW1lb3V0OiBwcm9wcy50aW1lb3V0ICYmIHByb3BzLnRpbWVvdXQudG9TZWNvbmRzKCksXG4gICAgICBwYWNrYWdlVHlwZTogcHJvcHMucnVudGltZSA9PT0gUnVudGltZS5GUk9NX0lNQUdFID8gJ0ltYWdlJyA6IHVuZGVmaW5lZCxcbiAgICAgIHJ1bnRpbWU6IHByb3BzLnJ1bnRpbWUgPT09IFJ1bnRpbWUuRlJPTV9JTUFHRSA/IHVuZGVmaW5lZCA6IHByb3BzLnJ1bnRpbWUubmFtZSxcbiAgICAgIHJvbGU6IHRoaXMucm9sZS5yb2xlQXJuLFxuICAgICAgLy8gVW5jYWNoZWQgYmVjYXVzZSBjYWxsaW5nICdfY2hlY2tFZGdlQ29tcGF0aWJpbGl0eScsIHdoaWNoIGdldHMgY2FsbGVkIGluIHRoZSByZXNvbHZlIG9mIGFub3RoZXJcbiAgICAgIC8vIFRva2VuLCBhY3R1YWxseSAqbW9kaWZpZXMqIHRoZSAnZW52aXJvbm1lbnQnIG1hcC5cbiAgICAgIGVudmlyb25tZW50OiBMYXp5LnVuY2FjaGVkQW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJFbnZpcm9ubWVudCgpIH0pLFxuICAgICAgbWVtb3J5U2l6ZTogcHJvcHMubWVtb3J5U2l6ZSxcbiAgICAgIGVwaGVtZXJhbFN0b3JhZ2U6IHByb3BzLmVwaGVtZXJhbFN0b3JhZ2VTaXplID8ge1xuICAgICAgICBzaXplOiBwcm9wcy5lcGhlbWVyYWxTdG9yYWdlU2l6ZS50b01lYmlieXRlcygpLFxuICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgIHZwY0NvbmZpZzogdGhpcy5jb25maWd1cmVWcGMocHJvcHMpLFxuICAgICAgZGVhZExldHRlckNvbmZpZzogdGhpcy5idWlsZERlYWRMZXR0ZXJDb25maWcoZGxxVG9waWNPclF1ZXVlKSxcbiAgICAgIHJlc2VydmVkQ29uY3VycmVudEV4ZWN1dGlvbnM6IHByb3BzLnJlc2VydmVkQ29uY3VycmVudEV4ZWN1dGlvbnMsXG4gICAgICBpbWFnZUNvbmZpZzogdW5kZWZpbmVkSWZOb0tleXMoe1xuICAgICAgICBjb21tYW5kOiBjb2RlLmltYWdlPy5jbWQsXG4gICAgICAgIGVudHJ5UG9pbnQ6IGNvZGUuaW1hZ2U/LmVudHJ5cG9pbnQsXG4gICAgICAgIHdvcmtpbmdEaXJlY3Rvcnk6IGNvZGUuaW1hZ2U/LndvcmtpbmdEaXJlY3RvcnksXG4gICAgICB9KSxcbiAgICAgIGttc0tleUFybjogcHJvcHMuZW52aXJvbm1lbnRFbmNyeXB0aW9uPy5rZXlBcm4sXG4gICAgICBmaWxlU3lzdGVtQ29uZmlncyxcbiAgICAgIGNvZGVTaWduaW5nQ29uZmlnQXJuOiBwcm9wcy5jb2RlU2lnbmluZ0NvbmZpZz8uY29kZVNpZ25pbmdDb25maWdBcm4sXG4gICAgICBhcmNoaXRlY3R1cmVzOiB0aGlzLl9hcmNoaXRlY3R1cmUgPyBbdGhpcy5fYXJjaGl0ZWN0dXJlLm5hbWVdIDogdW5kZWZpbmVkLFxuICAgICAgcnVudGltZU1hbmFnZW1lbnRDb25maWc6IHByb3BzLnJ1bnRpbWVNYW5hZ2VtZW50TW9kZT8ucnVudGltZU1hbmFnZW1lbnRDb25maWcsXG4gICAgfSk7XG5cbiAgICBpZiAoKHByb3BzLnRyYWNpbmcgIT09IHVuZGVmaW5lZCkgfHwgKHByb3BzLmFkb3RJbnN0cnVtZW50YXRpb24gIT09IHVuZGVmaW5lZCkpIHtcbiAgICAgIHJlc291cmNlLnRyYWNpbmdDb25maWcgPSB0aGlzLmJ1aWxkVHJhY2luZ0NvbmZpZyhwcm9wcy50cmFjaW5nID8/IFRyYWNpbmcuQUNUSVZFKTtcbiAgICB9XG5cbiAgICByZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy5yb2xlKTtcblxuICAgIHRoaXMuZnVuY3Rpb25OYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgICB0aGlzLmZ1bmN0aW9uQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShyZXNvdXJjZS5hdHRyQXJuLCB7XG4gICAgICBzZXJ2aWNlOiAnbGFtYmRhJyxcbiAgICAgIHJlc291cmNlOiAnZnVuY3Rpb24nLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnJ1bnRpbWUgPSBwcm9wcy5ydW50aW1lO1xuICAgIHRoaXMudGltZW91dCA9IHByb3BzLnRpbWVvdXQ7XG5cbiAgICB0aGlzLmFyY2hpdGVjdHVyZSA9IHByb3BzLmFyY2hpdGVjdHVyZSA/PyBBcmNoaXRlY3R1cmUuWDg2XzY0O1xuXG4gICAgaWYgKHByb3BzLmxheWVycykge1xuICAgICAgaWYgKHByb3BzLnJ1bnRpbWUgPT09IFJ1bnRpbWUuRlJPTV9JTUFHRSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xheWVycyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgY29udGFpbmVyIGltYWdlIGZ1bmN0aW9ucycpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFkZExheWVycyguLi5wcm9wcy5sYXllcnMpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZXZlbnQgb2YgcHJvcHMuZXZlbnRzIHx8IFtdKSB7XG4gICAgICB0aGlzLmFkZEV2ZW50U291cmNlKGV2ZW50KTtcbiAgICB9XG5cbiAgICAvLyBMb2cgcmV0ZW50aW9uXG4gICAgaWYgKHByb3BzLmxvZ1JldGVudGlvbikge1xuICAgICAgY29uc3QgbG9nUmV0ZW50aW9uID0gbmV3IGxvZ3MuTG9nUmV0ZW50aW9uKHRoaXMsICdMb2dSZXRlbnRpb24nLCB7XG4gICAgICAgIGxvZ0dyb3VwTmFtZTogYC9hd3MvbGFtYmRhLyR7dGhpcy5mdW5jdGlvbk5hbWV9YCxcbiAgICAgICAgcmV0ZW50aW9uOiBwcm9wcy5sb2dSZXRlbnRpb24sXG4gICAgICAgIHJvbGU6IHByb3BzLmxvZ1JldGVudGlvblJvbGUsXG4gICAgICAgIGxvZ1JldGVudGlvblJldHJ5T3B0aW9uczogcHJvcHMubG9nUmV0ZW50aW9uUmV0cnlPcHRpb25zIGFzIGxvZ3MuTG9nUmV0ZW50aW9uUmV0cnlPcHRpb25zLFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9sb2dHcm91cCA9IGxvZ3MuTG9nR3JvdXAuZnJvbUxvZ0dyb3VwQXJuKHRoaXMsICdMb2dHcm91cCcsIGxvZ1JldGVudGlvbi5sb2dHcm91cEFybik7XG4gICAgfVxuXG4gICAgcHJvcHMuY29kZS5iaW5kVG9SZXNvdXJjZShyZXNvdXJjZSk7XG5cbiAgICAvLyBFdmVudCBJbnZva2UgQ29uZmlnXG4gICAgaWYgKHByb3BzLm9uRmFpbHVyZSB8fCBwcm9wcy5vblN1Y2Nlc3MgfHwgcHJvcHMubWF4RXZlbnRBZ2UgfHwgcHJvcHMucmV0cnlBdHRlbXB0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyZUFzeW5jSW52b2tlKHtcbiAgICAgICAgb25GYWlsdXJlOiBwcm9wcy5vbkZhaWx1cmUsXG4gICAgICAgIG9uU3VjY2VzczogcHJvcHMub25TdWNjZXNzLFxuICAgICAgICBtYXhFdmVudEFnZTogcHJvcHMubWF4RXZlbnRBZ2UsXG4gICAgICAgIHJldHJ5QXR0ZW1wdHM6IHByb3BzLnJldHJ5QXR0ZW1wdHMsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRWZXJzaW9uT3B0aW9ucyA9IHByb3BzLmN1cnJlbnRWZXJzaW9uT3B0aW9ucztcblxuICAgIGlmIChwcm9wcy5maWxlc3lzdGVtKSB7XG4gICAgICBpZiAoIXByb3BzLnZwYykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjb25maWd1cmUgXFwnZmlsZXN5c3RlbVxcJyB3aXRob3V0IGNvbmZpZ3VyaW5nIGEgVlBDLicpO1xuICAgICAgfVxuICAgICAgY29uc3QgY29uZmlnID0gcHJvcHMuZmlsZXN5c3RlbS5jb25maWc7XG4gICAgICBpZiAoY29uZmlnLmRlcGVuZGVuY3kpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFkZERlcGVuZGVuY3koLi4uY29uZmlnLmRlcGVuZGVuY3kpO1xuICAgICAgfVxuICAgICAgLy8gVGhlcmUgY291bGQgYmUgYSByYWNlIGlmIHRoZSBMYW1iZGEgaXMgdXNlZCBpbiBhIEN1c3RvbVJlc291cmNlLiBJdCBpcyBwb3NzaWJsZSBmb3IgdGhlIExhbWJkYSB0b1xuICAgICAgLy8gZmFpbCB0byBhdHRhY2ggdG8gYSBnaXZlbiBGaWxlU3lzdGVtIGlmIHdlIGRvIG5vdCBoYXZlIGEgZGVwZW5kZW5jeSBvbiB0aGUgU2VjdXJpdHlHcm91cCBpbmdyZXNzL2VncmVzc1xuICAgICAgLy8gcnVsZXMgdGhhdCB3ZXJlIGNyZWF0ZWQgYmV0d2VlbiB0aGlzIExhbWJkYSdzIFNHICYgdGhlIEZpbGVzeXN0ZW0gU0cuXG4gICAgICB0aGlzLmNvbm5lY3Rpb25zLnNlY3VyaXR5R3JvdXBzLmZvckVhY2goc2cgPT4ge1xuICAgICAgICBzZy5ub2RlLmZpbmRBbGwoKS5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBDZm5SZXNvdXJjZSAmJiBjaGlsZC5jZm5SZXNvdXJjZVR5cGUgPT09ICdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEVncmVzcycpIHtcbiAgICAgICAgICAgIHJlc291cmNlLm5vZGUuYWRkRGVwZW5kZW5jeShjaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgY29uZmlnLmNvbm5lY3Rpb25zPy5zZWN1cml0eUdyb3Vwcy5mb3JFYWNoKHNnID0+IHtcbiAgICAgICAgc2cubm9kZS5maW5kQWxsKCkuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgQ2ZuUmVzb3VyY2UgJiYgY2hpbGQuY2ZuUmVzb3VyY2VUeXBlID09PSAnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJykge1xuICAgICAgICAgICAgcmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KGNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQ29uZmlndXJlIExhbWJkYSBpbnNpZ2h0c1xuICAgIHRoaXMuY29uZmlndXJlTGFtYmRhSW5zaWdodHMocHJvcHMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVBZG90SW5zdHJ1bWVudGF0aW9uKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGVudmlyb25tZW50IHZhcmlhYmxlIHRvIHRoaXMgTGFtYmRhIGZ1bmN0aW9uLlxuICAgKiBJZiB0aGlzIGlzIGEgcmVmIHRvIGEgTGFtYmRhIGZ1bmN0aW9uLCB0aGlzIG9wZXJhdGlvbiByZXN1bHRzIGluIGEgbm8tb3AuXG4gICAqIEBwYXJhbSBrZXkgVGhlIGVudmlyb25tZW50IHZhcmlhYmxlIGtleS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZSdzIHZhbHVlLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBFbnZpcm9ubWVudCB2YXJpYWJsZSBvcHRpb25zLlxuICAgKi9cbiAgcHVibGljIGFkZEVudmlyb25tZW50KGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBvcHRpb25zPzogRW52aXJvbm1lbnRPcHRpb25zKTogdGhpcyB7XG4gICAgLy8gUmVzZXJ2ZWQgZW52aXJvbm1lbnQgdmFyaWFibGVzIHdpbGwgZmFpbCBkdXJpbmcgY2xvdWRmb3JtYXRpb24gZGVwbG95IGlmIHRoZXkncmUgc2V0LlxuICAgIC8vIFRoaXMgY2hlY2sgaXMganVzdCB0byBhbGxvdyBDREsgdG8gZmFpbCBmYXN0ZXIgd2hlbiB0aGVzZSBhcmUgc3BlY2lmaWVkLlxuICAgIGNvbnN0IHJlc2VydmVkRW52aXJvbm1lbnRWYXJpYWJsZXMgPSBbXG4gICAgICAnX0hBTkRMRVInLFxuICAgICAgJ19YX0FNWk5fVFJBQ0VfSUQnLFxuICAgICAgJ0FXU19SRUdJT04nLFxuICAgICAgJ0FXU19FWEVDVVRJT05fRU5WJyxcbiAgICAgICdBV1NfTEFNQkRBX0ZVTkNUSU9OX05BTUUnLFxuICAgICAgJ0FXU19MQU1CREFfRlVOQ1RJT05fTUVNT1JZX1NJWkUnLFxuICAgICAgJ0FXU19MQU1CREFfRlVOQ1RJT05fVkVSU0lPTicsXG4gICAgICAnQVdTX0xBTUJEQV9JTklUSUFMSVpBVElPTl9UWVBFJyxcbiAgICAgICdBV1NfTEFNQkRBX0xPR19HUk9VUF9OQU1FJyxcbiAgICAgICdBV1NfTEFNQkRBX0xPR19TVFJFQU1fTkFNRScsXG4gICAgICAnQVdTX0FDQ0VTU19LRVknLFxuICAgICAgJ0FXU19BQ0NFU1NfS0VZX0lEJyxcbiAgICAgICdBV1NfU0VDUkVUX0FDQ0VTU19LRVknLFxuICAgICAgJ0FXU19TRVNTSU9OX1RPS0VOJyxcbiAgICAgICdBV1NfTEFNQkRBX1JVTlRJTUVfQVBJJyxcbiAgICAgICdMQU1CREFfVEFTS19ST09UJyxcbiAgICAgICdMQU1CREFfUlVOVElNRV9ESVInLFxuICAgIF07XG4gICAgaWYgKHJlc2VydmVkRW52aXJvbm1lbnRWYXJpYWJsZXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2tleX0gZW52aXJvbm1lbnQgdmFyaWFibGUgaXMgcmVzZXJ2ZWQgYnkgdGhlIGxhbWJkYSBydW50aW1lIGFuZCBjYW4gbm90IGJlIHNldCBtYW51YWxseS4gU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9sYW1iZGEvbGF0ZXN0L2RnL2NvbmZpZ3VyYXRpb24tZW52dmFycy5odG1sYCk7XG4gICAgfVxuICAgIHRoaXMuZW52aXJvbm1lbnRba2V5XSA9IHsgdmFsdWUsIC4uLm9wdGlvbnMgfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNaXggYWRkaXRpb25hbCBpbmZvcm1hdGlvbiBpbnRvIHRoZSBoYXNoIG9mIHRoZSBWZXJzaW9uIG9iamVjdFxuICAgKlxuICAgKiBUaGUgTGFtYmRhIEZ1bmN0aW9uIGNvbnN0cnVjdCBkb2VzIGl0cyBiZXN0IHRvIGF1dG9tYXRpY2FsbHkgY3JlYXRlIGEgbmV3XG4gICAqIFZlcnNpb24gd2hlbiBhbnl0aGluZyBhYm91dCB0aGUgRnVuY3Rpb24gY2hhbmdlcyAoaXRzIGNvZGUsIGl0cyBsYXllcnMsXG4gICAqIGFueSBvZiB0aGUgb3RoZXIgcHJvcGVydGllcykuXG4gICAqXG4gICAqIEhvd2V2ZXIsIHlvdSBjYW4gc29tZXRpbWVzIHNvdXJjZSBpbmZvcm1hdGlvbiBmcm9tIHBsYWNlcyB0aGF0IHRoZSBDREsgY2Fubm90XG4gICAqIGxvb2sgaW50bywgbGlrZSB0aGUgZGVwbG95LXRpbWUgdmFsdWVzIG9mIFNTTSBwYXJhbWV0ZXJzLiBJbiB0aG9zZSBjYXNlcyxcbiAgICogdGhlIENESyB3b3VsZCBub3QgZm9yY2UgdGhlIGNyZWF0aW9uIG9mIGEgbmV3IFZlcnNpb24gb2JqZWN0IHdoZW4gaXQgYWN0dWFsbHlcbiAgICogc2hvdWxkLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCB0byBpbnZhbGlkYXRlIHRoZSBjdXJyZW50IFZlcnNpb24gb2JqZWN0LiBQYXNzIGluXG4gICAqIGFueSBzdHJpbmcgaW50byB0aGlzIG1ldGhvZCwgYW5kIG1ha2Ugc3VyZSB0aGUgc3RyaW5nIGNoYW5nZXMgd2hlbiB5b3Uga25vd1xuICAgKiBhIG5ldyBWZXJzaW9uIG5lZWRzIHRvIGJlIGNyZWF0ZWQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIG1heSBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2UuXG4gICAqL1xuICBwdWJsaWMgaW52YWxpZGF0ZVZlcnNpb25CYXNlZE9uKHg6IHN0cmluZykge1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoeCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZGF0ZVZlcnNpb25PbjogaW5wdXQgbWF5IG5vdCBjb250YWluIHVucmVzb2x2ZWQgdG9rZW5zJyk7XG4gICAgfVxuICAgIHRoaXMuaGFzaE1peGlucy5wdXNoKHgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgb25lIG9yIG1vcmUgTGFtYmRhIExheWVycyB0byB0aGlzIExhbWJkYSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGxheWVycyB0aGUgbGF5ZXJzIHRvIGJlIGFkZGVkLlxuICAgKlxuICAgKiBAdGhyb3dzIGlmIHRoZXJlIGFyZSBhbHJlYWR5IDUgbGF5ZXJzIG9uIHRoaXMgZnVuY3Rpb24sIG9yIHRoZSBsYXllciBpcyBpbmNvbXBhdGlibGUgd2l0aCB0aGlzIGZ1bmN0aW9uJ3MgcnVudGltZS5cbiAgICovXG4gIHB1YmxpYyBhZGRMYXllcnMoLi4ubGF5ZXJzOiBJTGF5ZXJWZXJzaW9uW10pOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGxheWVyIG9mIGxheWVycykge1xuICAgICAgaWYgKHRoaXMuX2xheWVycy5sZW5ndGggPT09IDUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gYWRkIGxheWVyOiB0aGlzIGxhbWJkYSBmdW5jdGlvbiBhbHJlYWR5IHVzZXMgNSBsYXllcnMuJyk7XG4gICAgICB9XG4gICAgICBpZiAobGF5ZXIuY29tcGF0aWJsZVJ1bnRpbWVzICYmICFsYXllci5jb21wYXRpYmxlUnVudGltZXMuZmluZChydW50aW1lID0+IHJ1bnRpbWUucnVudGltZUVxdWFscyh0aGlzLnJ1bnRpbWUpKSkge1xuICAgICAgICBjb25zdCBydW50aW1lcyA9IGxheWVyLmNvbXBhdGlibGVSdW50aW1lcy5tYXAocnVudGltZSA9PiBydW50aW1lLm5hbWUpLmpvaW4oJywgJyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhpcyBsYW1iZGEgZnVuY3Rpb24gdXNlcyBhIHJ1bnRpbWUgdGhhdCBpcyBpbmNvbXBhdGlibGUgd2l0aCB0aGlzIGxheWVyICgke3RoaXMucnVudGltZS5uYW1lfSBpcyBub3QgaW4gWyR7cnVudGltZXN9XSlgKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ3VycmVudGx5IG5vIHZhbGlkYXRpb25zIGZvciBjb21wYXRpYmxlIGFyY2hpdGVjdHVyZXMgc2luY2UgTGFtYmRhIHNlcnZpY2VcbiAgICAgIC8vIGFsbG93cyBsYXllcnMgY29uZmlndXJlZCB3aXRoIG9uZSBhcmNoaXRlY3R1cmUgdG8gYmUgdXNlZCB3aXRoIGEgTGFtYmRhIGZ1bmN0aW9uXG4gICAgICAvLyBmcm9tIGFub3RoZXIgYXJjaGl0ZWN0dXJlLlxuICAgICAgdGhpcy5fbGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgdmVyc2lvbiBmb3IgdGhpcyBMYW1iZGFcbiAgICpcbiAgICogSWYgeW91IHdhbnQgdG8gZGVwbG95IHRocm91Z2ggQ2xvdWRGb3JtYXRpb24gYW5kIHVzZSBhbGlhc2VzLCB5b3UgbmVlZCB0b1xuICAgKiBhZGQgYSBuZXcgdmVyc2lvbiAod2l0aCBhIG5ldyBuYW1lKSB0byB5b3VyIExhbWJkYSBldmVyeSB0aW1lIHlvdSB3YW50IHRvXG4gICAqIGRlcGxveSBhbiB1cGRhdGUuIEFuIGFsaWFzIGNhbiB0aGVuIHJlZmVyIHRvIHRoZSBuZXdseSBjcmVhdGVkIFZlcnNpb24uXG4gICAqXG4gICAqIEFsbCB2ZXJzaW9ucyBzaG91bGQgaGF2ZSBkaXN0aW5jdCBuYW1lcywgYW5kIHlvdSBzaG91bGQgbm90IGRlbGV0ZSB2ZXJzaW9uc1xuICAgKiBhcyBsb25nIGFzIHlvdXIgQWxpYXMgbmVlZHMgdG8gcmVmZXIgdG8gdGhlbS5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgQSB1bmlxdWUgbmFtZSBmb3IgdGhpcyB2ZXJzaW9uLlxuICAgKiBAcGFyYW0gY29kZVNoYTI1NiBUaGUgU0hBLTI1NiBoYXNoIG9mIHRoZSBtb3N0IHJlY2VudGx5IGRlcGxveWVkIExhbWJkYVxuICAgKiAgc291cmNlIGNvZGUsIG9yIG9taXQgdG8gc2tpcCB2YWxpZGF0aW9uLlxuICAgKiBAcGFyYW0gZGVzY3JpcHRpb24gQSBkZXNjcmlwdGlvbiBmb3IgdGhpcyB2ZXJzaW9uLlxuICAgKiBAcGFyYW0gcHJvdmlzaW9uZWRFeGVjdXRpb25zIEEgcHJvdmlzaW9uZWQgY29uY3VycmVuY3kgY29uZmlndXJhdGlvbiBmb3IgYVxuICAgKiBmdW5jdGlvbidzIHZlcnNpb24uXG4gICAqIEBwYXJhbSBhc3luY0ludm9rZUNvbmZpZyBjb25maWd1cmF0aW9uIGZvciB0aGlzIHZlcnNpb24gd2hlbiBpdCBpcyBpbnZva2VkXG4gICAqIGFzeW5jaHJvbm91c2x5LlxuICAgKiBAcmV0dXJucyBBIG5ldyBWZXJzaW9uIG9iamVjdC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2Qgd2lsbCBjcmVhdGUgYW4gQVdTOjpMYW1iZGE6OlZlcnNpb24gcmVzb3VyY2Ugd2hpY2hcbiAgICogc25hcHNob3RzIHRoZSBBV1MgTGFtYmRhIGZ1bmN0aW9uICphdCB0aGUgdGltZSBvZiBpdHMgY3JlYXRpb24qIGFuZCBpdFxuICAgKiB3b24ndCBnZXQgdXBkYXRlZCB3aGVuIHRoZSBmdW5jdGlvbiBjaGFuZ2VzLiBJbnN0ZWFkLCB1c2VcbiAgICogYHRoaXMuY3VycmVudFZlcnNpb25gIHRvIG9idGFpbiBhIHJlZmVyZW5jZSB0byBhIHZlcnNpb24gcmVzb3VyY2UgdGhhdCBnZXRzXG4gICAqIGF1dG9tYXRpY2FsbHkgcmVjcmVhdGVkIHdoZW4gdGhlIGZ1bmN0aW9uIGNvbmZpZ3VyYXRpb24gKG9yIGNvZGUpIGNoYW5nZXMuXG4gICAqL1xuICBwdWJsaWMgYWRkVmVyc2lvbihcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgY29kZVNoYTI1Nj86IHN0cmluZyxcbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZyxcbiAgICBwcm92aXNpb25lZEV4ZWN1dGlvbnM/OiBudW1iZXIsXG4gICAgYXN5bmNJbnZva2VDb25maWc6IEV2ZW50SW52b2tlQ29uZmlnT3B0aW9ucyA9IHt9KTogVmVyc2lvbiB7XG5cbiAgICByZXR1cm4gbmV3IFZlcnNpb24odGhpcywgJ1ZlcnNpb24nICsgbmFtZSwge1xuICAgICAgbGFtYmRhOiB0aGlzLFxuICAgICAgY29kZVNoYTI1NixcbiAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgcHJvdmlzaW9uZWRDb25jdXJyZW50RXhlY3V0aW9uczogcHJvdmlzaW9uZWRFeGVjdXRpb25zLFxuICAgICAgLi4uYXN5bmNJbnZva2VDb25maWcsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBhbGlhcyBmb3IgdGhpcyBmdW5jdGlvbi5cbiAgICpcbiAgICogVGhlIGFsaWFzIHdpbGwgYXV0b21hdGljYWxseSBiZSB1cGRhdGVkIHRvIHBvaW50IHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZlxuICAgKiB0aGUgZnVuY3Rpb24gYXMgaXQgaXMgYmVpbmcgdXBkYXRlZCBkdXJpbmcgYSBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBkZWNsYXJlIGNvbnN0IGZuOiBsYW1iZGEuRnVuY3Rpb247XG4gICAqXG4gICAqIGZuLmFkZEFsaWFzKCdMaXZlJyk7XG4gICAqXG4gICAqIC8vIElzIGVxdWl2YWxlbnQgdG9cbiAgICpcbiAgICogbmV3IGxhbWJkYS5BbGlhcyh0aGlzLCAnQWxpYXNMaXZlJywge1xuICAgKiAgIGFsaWFzTmFtZTogJ0xpdmUnLFxuICAgKiAgIHZlcnNpb246IGZuLmN1cnJlbnRWZXJzaW9uLFxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBhbGlhc05hbWUgVGhlIG5hbWUgb2YgdGhlIGFsaWFzXG4gICAqIEBwYXJhbSBvcHRpb25zIEFsaWFzIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBhZGRBbGlhcyhhbGlhc05hbWU6IHN0cmluZywgb3B0aW9ucz86IEFsaWFzT3B0aW9ucyk6IEFsaWFzIHtcbiAgICByZXR1cm4gYWRkQWxpYXModGhpcywgdGhpcy5jdXJyZW50VmVyc2lvbiwgYWxpYXNOYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgTG9nR3JvdXAgd2hlcmUgdGhlIExhbWJkYSBmdW5jdGlvbidzIGxvZ3MgYXJlIG1hZGUgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBJZiBlaXRoZXIgYGxvZ1JldGVudGlvbmAgaXMgc2V0IG9yIHRoaXMgcHJvcGVydHkgaXMgY2FsbGVkLCBhIENsb3VkRm9ybWF0aW9uIGN1c3RvbSByZXNvdXJjZSBpcyBhZGRlZCB0byB0aGUgc3RhY2sgdGhhdFxuICAgKiBwcmUtY3JlYXRlcyB0aGUgbG9nIGdyb3VwIGFzIHBhcnQgb2YgdGhlIHN0YWNrIGRlcGxveW1lbnQsIGlmIGl0IGFscmVhZHkgZG9lc24ndCBleGlzdCwgYW5kIHNldHMgdGhlIGNvcnJlY3QgbG9nIHJldGVudGlvblxuICAgKiBwZXJpb2QgKG5ldmVyIGV4cGlyZSwgYnkgZGVmYXVsdCkuXG4gICAqXG4gICAqIEZ1cnRoZXIsIGlmIHRoZSBsb2cgZ3JvdXAgYWxyZWFkeSBleGlzdHMgYW5kIHRoZSBgbG9nUmV0ZW50aW9uYCBpcyBub3Qgc2V0LCB0aGUgY3VzdG9tIHJlc291cmNlIHdpbGwgcmVzZXQgdGhlIGxvZyByZXRlbnRpb25cbiAgICogdG8gbmV2ZXIgZXhwaXJlIGV2ZW4gaWYgaXQgd2FzIGNvbmZpZ3VyZWQgd2l0aCBhIGRpZmZlcmVudCB2YWx1ZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgbG9nR3JvdXAoKTogbG9ncy5JTG9nR3JvdXAge1xuICAgIGlmICghdGhpcy5fbG9nR3JvdXApIHtcbiAgICAgIGNvbnN0IGxvZ1JldGVudGlvbiA9IG5ldyBsb2dzLkxvZ1JldGVudGlvbih0aGlzLCAnTG9nUmV0ZW50aW9uJywge1xuICAgICAgICBsb2dHcm91cE5hbWU6IGAvYXdzL2xhbWJkYS8ke3RoaXMuZnVuY3Rpb25OYW1lfWAsXG4gICAgICAgIHJldGVudGlvbjogbG9ncy5SZXRlbnRpb25EYXlzLklORklOSVRFLFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9sb2dHcm91cCA9IGxvZ3MuTG9nR3JvdXAuZnJvbUxvZ0dyb3VwQXJuKHRoaXMsIGAke3RoaXMubm9kZS5pZH0tTG9nR3JvdXBgLCBsb2dSZXRlbnRpb24ubG9nR3JvdXBBcm4pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbG9nR3JvdXA7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHB1YmxpYyBfY2hlY2tFZGdlQ29tcGF0aWJpbGl0eSgpOiB2b2lkIHtcbiAgICAvLyBDaGVjayBlbnYgdmFyc1xuICAgIGNvbnN0IGVudkVudHJpZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLmVudmlyb25tZW50KTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIGNvbmZpZ10gb2YgZW52RW50cmllcykge1xuICAgICAgaWYgKGNvbmZpZy5yZW1vdmVJbkVkZ2UpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuZW52aXJvbm1lbnRba2V5XTtcbiAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkSW5mbyhgUmVtb3ZlZCAke2tleX0gZW52aXJvbm1lbnQgdmFyaWFibGUgZm9yIExhbWJkYUBFZGdlIGNvbXBhdGliaWxpdHlgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgZW52S2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZW52aXJvbm1lbnQpO1xuICAgIGlmIChlbnZLZXlzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZnVuY3Rpb24gJHt0aGlzLm5vZGUucGF0aH0gY29udGFpbnMgZW52aXJvbm1lbnQgdmFyaWFibGVzIFske2VudktleXN9XSBhbmQgaXMgbm90IGNvbXBhdGlibGUgd2l0aCBMYW1iZGFARWRnZS4gXFxcbkVudmlyb25tZW50IHZhcmlhYmxlcyBjYW4gYmUgbWFya2VkIGZvciByZW1vdmFsIHdoZW4gdXNlZCBpbiBMYW1iZGFARWRnZSBieSBzZXR0aW5nIHRoZSBcXCdyZW1vdmVJbkVkZ2VcXCcgcHJvcGVydHkgaW4gdGhlIFxcJ2FkZEVudmlyb25tZW50KClcXCcgQVBJLmApO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVkIGxhbWJkYSBpbnNpZ2h0cyBvbiB0aGUgZnVuY3Rpb24gaWYgc3BlY2lmaWVkLiBUaGlzIGlzIGFjaGVpdmVkIGJ5IGFkZGluZyBhbiBpbXBvcnRlZCBsYXllciB3aGljaCBpcyBhZGRlZCB0byB0aGVcbiAgICogbGlzdCBvZiBsYW1iZGEgbGF5ZXJzIG9uIHN5bnRoZXNpcy5cbiAgICpcbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkV2F0Y2gvbGF0ZXN0L21vbml0b3JpbmcvTGFtYmRhLUluc2lnaHRzLWV4dGVuc2lvbi12ZXJzaW9ucy5odG1sXG4gICAqL1xuICBwcml2YXRlIGNvbmZpZ3VyZUxhbWJkYUluc2lnaHRzKHByb3BzOiBGdW5jdGlvblByb3BzKTogdm9pZCB7XG4gICAgaWYgKHByb3BzLmluc2lnaHRzVmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5ydW50aW1lICE9PSBSdW50aW1lLkZST01fSU1BR0UpIHtcbiAgICAgIC8vIExheWVycyBjYW5ub3QgYmUgYWRkZWQgdG8gTGFtYmRhIGNvbnRhaW5lciBpbWFnZXMuIFRoZSBpbWFnZSBzaG91bGQgaGF2ZSB0aGUgaW5zaWdodHMgYWdlbnQgaW5zdGFsbGVkLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9tb25pdG9yaW5nL0xhbWJkYS1JbnNpZ2h0cy1HZXR0aW5nLVN0YXJ0ZWQtZG9ja2VyLmh0bWxcbiAgICAgIHRoaXMuYWRkTGF5ZXJzKExheWVyVmVyc2lvbi5mcm9tTGF5ZXJWZXJzaW9uQXJuKHRoaXMsICdMYW1iZGFJbnNpZ2h0c0xheWVyJywgcHJvcHMuaW5zaWdodHNWZXJzaW9uLl9iaW5kKHRoaXMsIHRoaXMpLmFybikpO1xuICAgIH1cbiAgICB0aGlzLnJvbGU/LmFkZE1hbmFnZWRQb2xpY3koaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdDbG91ZFdhdGNoTGFtYmRhSW5zaWdodHNFeGVjdXRpb25Sb2xlUG9saWN5JykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBBV1MgRGlzdHJvIGZvciBPcGVuVGVsZW1ldHJ5IExhbWJkYSBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgZm9yIHRoZSBBRE9UIGluc3RydW1lbnRhdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBjb25maWd1cmVBZG90SW5zdHJ1bWVudGF0aW9uKHByb3BzOiBGdW5jdGlvblByb3BzKTogdm9pZCB7XG5cbiAgICBpZiAocHJvcHMuYWRvdEluc3RydW1lbnRhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnJ1bnRpbWUgPT09IFJ1bnRpbWUuRlJPTV9JTUFHRSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQURPVCBMYW1iZGEgbGF5ZXIgY2FuJ3QgYmUgY29uZmlndXJlZCB3aXRoIGNvbnRhaW5lciBpbWFnZSBwYWNrYWdlIHR5cGVcIik7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBpcyBub3QgdGhlIGNvbXBsZXRlIGxpc3Qgb2YgaW5jb21wYXRpYmxlIHJ1bnRpbWVzIGFuZCBsYXllciB0eXBlcy4gV2UgYXJlIG9ubHlcbiAgICAvLyBjaGVja2luZyBmb3IgY29tbW9uIG1pc3Rha2VzIG9uIGEgYmVzdC1lZmZvcnQgYmFzaXMuXG4gICAgaWYgKHRoaXMucnVudGltZSA9PT0gUnVudGltZS5HT18xX1gpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUnVudGltZSBnbzEueCBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBBRE9UIExhbWJkYSBHbyBTREsnKTtcbiAgICB9XG5cbiAgICB0aGlzLmFkZExheWVycyhMYXllclZlcnNpb24uZnJvbUxheWVyVmVyc2lvbkFybih0aGlzLCAnQWRvdExheWVyJywgcHJvcHMuYWRvdEluc3RydW1lbnRhdGlvbi5sYXllclZlcnNpb24uX2JpbmQodGhpcykuYXJuKSk7XG4gICAgdGhpcy5hZGRFbnZpcm9ubWVudCgnQVdTX0xBTUJEQV9FWEVDX1dSQVBQRVInLCBwcm9wcy5hZG90SW5zdHJ1bWVudGF0aW9uLmV4ZWNXcmFwcGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyTGF5ZXJzKCkge1xuICAgIGlmICghdGhpcy5fbGF5ZXJzIHx8IHRoaXMuX2xheWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKEZlYXR1cmVGbGFncy5vZih0aGlzKS5pc0VuYWJsZWQoTEFNQkRBX1JFQ09HTklaRV9MQVlFUl9WRVJTSU9OKSkge1xuICAgICAgdGhpcy5fbGF5ZXJzLnNvcnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbGF5ZXJzLm1hcChsYXllciA9PiBsYXllci5sYXllclZlcnNpb25Bcm4pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJFbnZpcm9ubWVudCgpIHtcbiAgICBpZiAoIXRoaXMuZW52aXJvbm1lbnQgfHwgT2JqZWN0LmtleXModGhpcy5lbnZpcm9ubWVudCkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgIC8vIFNvcnQgZW52aXJvbm1lbnQgc28gdGhlIGhhc2ggb2YgdGhlIGZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlXG4gICAgLy8gYGN1cnJlbnRWZXJzaW9uYCBpcyBub3QgYWZmZWN0ZWQgYnkga2V5IG9yZGVyICh0aGlzIGlzIGhvdyBsYW1iZGEgZG9lc1xuICAgIC8vIGl0KS4gRm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdlIGRvIG5vdCBzb3J0IGVudmlyb25tZW50IHZhcmlhYmxlcyBpbiBjYXNlXG4gICAgLy8gX2N1cnJlbnRWZXJzaW9uIGlzIG5vdCBkZWZpbmVkLiBPdGhlcndpc2UsIHRoaXMgd291bGQgaGF2ZSBpbnZhbGlkYXRlZFxuICAgIC8vIHRoZSB0ZW1wbGF0ZSwgYW5kIGZvciBleGFtcGxlLCBtYXkgY2F1c2UgdW5uZWVkZWQgdXBkYXRlcyBmb3IgbmVzdGVkXG4gICAgLy8gc3RhY2tzLlxuICAgIGNvbnN0IGtleXMgPSB0aGlzLl9jdXJyZW50VmVyc2lvblxuICAgICAgPyBPYmplY3Qua2V5cyh0aGlzLmVudmlyb25tZW50KS5zb3J0KClcbiAgICAgIDogT2JqZWN0LmtleXModGhpcy5lbnZpcm9ubWVudCk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICB2YXJpYWJsZXNba2V5XSA9IHRoaXMuZW52aXJvbm1lbnRba2V5XS52YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4geyB2YXJpYWJsZXMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBjb25maWd1cmVkLCBzZXQgdXAgdGhlIFZQQy1yZWxhdGVkIHByb3BlcnRpZXNcbiAgICpcbiAgICogUmV0dXJucyB0aGUgVnBjQ29uZmlnIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZVxuICAgKiBMYW1iZGEgY3JlYXRpb24gcHJvcGVydGllcy5cbiAgICovXG4gIHByaXZhdGUgY29uZmlndXJlVnBjKHByb3BzOiBGdW5jdGlvblByb3BzKTogQ2ZuRnVuY3Rpb24uVnBjQ29uZmlnUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICgocHJvcHMuc2VjdXJpdHlHcm91cCB8fCBwcm9wcy5hbGxvd0FsbE91dGJvdW5kICE9PSB1bmRlZmluZWQpICYmICFwcm9wcy52cGMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNvbmZpZ3VyZSBcXCdzZWN1cml0eUdyb3VwXFwnIG9yIFxcJ2FsbG93QWxsT3V0Ym91bmRcXCcgd2l0aG91dCBjb25maWd1cmluZyBhIFZQQycpO1xuICAgIH1cblxuICAgIGlmICghcHJvcHMudnBjKSB7XG4gICAgICBpZiAocHJvcHMudnBjU3VibmV0cykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjb25maWd1cmUgXFwndnBjU3VibmV0c1xcJyB3aXRob3V0IGNvbmZpZ3VyaW5nIGEgVlBDJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuXG4gICAgaWYgKHByb3BzLnNlY3VyaXR5R3JvdXAgJiYgcHJvcHMuYWxsb3dBbGxPdXRib3VuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbmZpZ3VyZSBcXCdhbGxvd0FsbE91dGJvdW5kXFwnIGRpcmVjdGx5IG9uIHRoZSBzdXBwbGllZCBTZWN1cml0eUdyb3VwLicpO1xuICAgIH1cblxuICAgIGxldCBzZWN1cml0eUdyb3VwczogZWMyLklTZWN1cml0eUdyb3VwW107XG5cbiAgICBpZiAocHJvcHMuc2VjdXJpdHlHcm91cCAmJiBwcm9wcy5zZWN1cml0eUdyb3Vwcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9uZSBvZiB0aGUgZnVuY3Rpb24gcHJvcHMsIHNlY3VyaXR5R3JvdXAgb3Igc2VjdXJpdHlHcm91cHMsIGlzIGFsbG93ZWQnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc2VjdXJpdHlHcm91cHMpIHtcbiAgICAgIHNlY3VyaXR5R3JvdXBzID0gcHJvcHMuc2VjdXJpdHlHcm91cHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBwcm9wcy5zZWN1cml0eUdyb3VwIHx8IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnU2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQXV0b21hdGljIHNlY3VyaXR5IGdyb3VwIGZvciBMYW1iZGEgRnVuY3Rpb24gJyArIE5hbWVzLnVuaXF1ZUlkKHRoaXMpLFxuICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiBwcm9wcy5hbGxvd0FsbE91dGJvdW5kLFxuICAgICAgfSk7XG4gICAgICBzZWN1cml0eUdyb3VwcyA9IFtzZWN1cml0eUdyb3VwXTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb25uZWN0aW9ucyA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoeyBzZWN1cml0eUdyb3VwcyB9KTtcblxuICAgIGlmIChwcm9wcy5maWxlc3lzdGVtKSB7XG4gICAgICBpZiAocHJvcHMuZmlsZXN5c3RlbS5jb25maWcuY29ubmVjdGlvbnMpIHtcbiAgICAgICAgcHJvcHMuZmlsZXN5c3RlbS5jb25maWcuY29ubmVjdGlvbnMuYWxsb3dEZWZhdWx0UG9ydEZyb20odGhpcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYWxsb3dQdWJsaWNTdWJuZXQgPSBwcm9wcy5hbGxvd1B1YmxpY1N1Ym5ldCA/PyBmYWxzZTtcbiAgICBjb25zdCBzZWxlY3RlZFN1Ym5ldHMgPSBwcm9wcy52cGMuc2VsZWN0U3VibmV0cyhwcm9wcy52cGNTdWJuZXRzKTtcbiAgICBjb25zdCBwdWJsaWNTdWJuZXRJZHMgPSBuZXcgU2V0KHByb3BzLnZwYy5wdWJsaWNTdWJuZXRzLm1hcChzID0+IHMuc3VibmV0SWQpKTtcbiAgICBmb3IgKGNvbnN0IHN1Ym5ldElkIG9mIHNlbGVjdGVkU3VibmV0cy5zdWJuZXRJZHMpIHtcbiAgICAgIGlmIChwdWJsaWNTdWJuZXRJZHMuaGFzKHN1Ym5ldElkKSAmJiAhYWxsb3dQdWJsaWNTdWJuZXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYW1iZGEgRnVuY3Rpb25zIGluIGEgcHVibGljIHN1Ym5ldCBjYW4gTk9UIGFjY2VzcyB0aGUgaW50ZXJuZXQuICcgK1xuICAgICAgICAgICdJZiB5b3UgYXJlIGF3YXJlIG9mIHRoaXMgbGltaXRhdGlvbiBhbmQgd291bGQgc3RpbGwgbGlrZSB0byBwbGFjZSB0aGUgZnVuY3Rpb24gaW4gYSBwdWJsaWMgc3VibmV0LCBzZXQgYGFsbG93UHVibGljU3VibmV0YCB0byB0cnVlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubm9kZS5hZGREZXBlbmRlbmN5KHNlbGVjdGVkU3VibmV0cy5pbnRlcm5ldENvbm5lY3Rpdml0eUVzdGFibGlzaGVkKTtcblxuICAgIC8vIExpc3QgY2FuJ3QgYmUgZW1wdHkgaGVyZSwgaWYgd2UgZ290IHRoaXMgZmFyIHlvdSBpbnRlbmRlZCB0byBwdXQgeW91ciBMYW1iZGFcbiAgICAvLyBpbiBzdWJuZXRzLiBXZSdyZSBnb2luZyB0byBndWFyYW50ZWUgdGhhdCB3ZSBnZXQgdGhlIG5pY2UgZXJyb3IgbWVzc2FnZSBieVxuICAgIC8vIG1ha2luZyBWcGNOZXR3b3JrIGRvIHRoZSBzZWxlY3Rpb24gYWdhaW4uXG5cbiAgICByZXR1cm4ge1xuICAgICAgc3VibmV0SWRzOiBzZWxlY3RlZFN1Ym5ldHMuc3VibmV0SWRzLFxuICAgICAgc2VjdXJpdHlHcm91cElkczogc2VjdXJpdHlHcm91cHMubWFwKHNnID0+IHNnLnNlY3VyaXR5R3JvdXBJZCksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgaXNRdWV1ZShkZWFkTGV0dGVyUXVldWU6IHNxcy5JUXVldWUgfCBzbnMuSVRvcGljKTogZGVhZExldHRlclF1ZXVlIGlzIHNxcy5JUXVldWUge1xuICAgIHJldHVybiAoPHNxcy5JUXVldWU+ZGVhZExldHRlclF1ZXVlKS5xdWV1ZUFybiAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZERlYWRMZXR0ZXJRdWV1ZShwcm9wczogRnVuY3Rpb25Qcm9wcyk6IHNxcy5JUXVldWUgfCBzbnMuSVRvcGljIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXByb3BzLmRlYWRMZXR0ZXJRdWV1ZSAmJiAhcHJvcHMuZGVhZExldHRlclF1ZXVlRW5hYmxlZCAmJiAhcHJvcHMuZGVhZExldHRlclRvcGljKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAocHJvcHMuZGVhZExldHRlclF1ZXVlICYmIHByb3BzLmRlYWRMZXR0ZXJRdWV1ZUVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBFcnJvcignZGVhZExldHRlclF1ZXVlIGRlZmluZWQgYnV0IGRlYWRMZXR0ZXJRdWV1ZUVuYWJsZWQgZXhwbGljaXRseSBzZXQgdG8gZmFsc2UnKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmRlYWRMZXR0ZXJUb3BpYyAmJiAocHJvcHMuZGVhZExldHRlclF1ZXVlIHx8IHByb3BzLmRlYWRMZXR0ZXJRdWV1ZUVuYWJsZWQgIT09IHVuZGVmaW5lZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZGVhZExldHRlclF1ZXVlIGFuZCBkZWFkTGV0dGVyVG9waWMgY2Fubm90IGJlIHNwZWNpZmllZCB0b2dldGhlciBhdCB0aGUgc2FtZSB0aW1lJyk7XG4gICAgfVxuXG4gICAgbGV0IGRlYWRMZXR0ZXJRdWV1ZTogc3FzLklRdWV1ZSB8IHNucy5JVG9waWM7XG4gICAgaWYgKHByb3BzLmRlYWRMZXR0ZXJUb3BpYykge1xuICAgICAgZGVhZExldHRlclF1ZXVlID0gcHJvcHMuZGVhZExldHRlclRvcGljO1xuICAgICAgdGhpcy5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ3NuczpQdWJsaXNoJ10sXG4gICAgICAgIHJlc291cmNlczogW2RlYWRMZXR0ZXJRdWV1ZS50b3BpY0Fybl0sXG4gICAgICB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYWRMZXR0ZXJRdWV1ZSA9IHByb3BzLmRlYWRMZXR0ZXJRdWV1ZSB8fCBuZXcgc3FzLlF1ZXVlKHRoaXMsICdEZWFkTGV0dGVyUXVldWUnLCB7XG4gICAgICAgIHJldGVudGlvblBlcmlvZDogRHVyYXRpb24uZGF5cygxNCksXG4gICAgICB9KTtcbiAgICAgIHRoaXMuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydzcXM6U2VuZE1lc3NhZ2UnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbZGVhZExldHRlclF1ZXVlLnF1ZXVlQXJuXSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVhZExldHRlclF1ZXVlO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZERlYWRMZXR0ZXJDb25maWcoZGVhZExldHRlclF1ZXVlPzogc3FzLklRdWV1ZSB8IHNucy5JVG9waWMpIHtcbiAgICBpZiAoZGVhZExldHRlclF1ZXVlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0YXJnZXRBcm46IHRoaXMuaXNRdWV1ZShkZWFkTGV0dGVyUXVldWUpID8gZGVhZExldHRlclF1ZXVlLnF1ZXVlQXJuIDogZGVhZExldHRlclF1ZXVlLnRvcGljQXJuLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkVHJhY2luZ0NvbmZpZyh0cmFjaW5nOiBUcmFjaW5nKSB7XG4gICAgaWYgKHRyYWNpbmcgPT09IHVuZGVmaW5lZCB8fCB0cmFjaW5nID09PSBUcmFjaW5nLkRJU0FCTEVEKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRoaXMuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsneHJheTpQdXRUcmFjZVNlZ21lbnRzJywgJ3hyYXk6UHV0VGVsZW1ldHJ5UmVjb3JkcyddLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogdHJhY2luZyxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZVByb2ZpbGluZyhwcm9wczogRnVuY3Rpb25Qcm9wcykge1xuICAgIGlmICghcHJvcHMucnVudGltZS5zdXBwb3J0c0NvZGVHdXJ1UHJvZmlsaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvZGVHdXJ1IHByb2ZpbGluZyBpcyBub3Qgc3VwcG9ydGVkIGJ5IHJ1bnRpbWUgJHtwcm9wcy5ydW50aW1lLm5hbWV9YCk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5lbnZpcm9ubWVudCAmJiAocHJvcHMuZW52aXJvbm1lbnQuQVdTX0NPREVHVVJVX1BST0ZJTEVSX0dST1VQX0FSTiB8fCBwcm9wcy5lbnZpcm9ubWVudC5BV1NfQ09ERUdVUlVfUFJPRklMRVJfRU5BQkxFRCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQVdTX0NPREVHVVJVX1BST0ZJTEVSX0dST1VQX0FSTiBhbmQgQVdTX0NPREVHVVJVX1BST0ZJTEVSX0VOQUJMRUQgbXVzdCBub3QgYmUgc2V0IHdoZW4gcHJvZmlsaW5nIG9wdGlvbnMgZW5hYmxlZCcpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEVudmlyb25tZW50IHZhcmlhYmxlcyBvcHRpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvbm1lbnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZW4gdXNlZCBpbiBMYW1iZGFARWRnZSB2aWEgZWRnZUFybigpIEFQSSwgdGhlc2UgZW52aXJvbm1lbnRcbiAgICogdmFyaWFibGVzIHdpbGwgYmUgcmVtb3ZlZC4gSWYgbm90IHNldCwgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkRnJvbnQvbGF0ZXN0L0RldmVsb3Blckd1aWRlL2xhbWJkYS1yZXF1aXJlbWVudHMtbGltaXRzLmh0bWwjbGFtYmRhLXJlcXVpcmVtZW50cy1sYW1iZGEtZnVuY3Rpb24tY29uZmlndXJhdGlvblxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZSAtIHVzaW5nIHRoZSBmdW5jdGlvbiBpbiBMYW1iZGFARWRnZSB3aWxsIHRocm93XG4gICAqL1xuICByZWFkb25seSByZW1vdmVJbkVkZ2U/OiBib29sZWFuXG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgYW4gZW52aXJvbm1lbnQgdmFyaWFibGVcbiAqL1xuaW50ZXJmYWNlIEVudmlyb25tZW50Q29uZmlnIGV4dGVuZHMgRW52aXJvbm1lbnRPcHRpb25zIHtcbiAgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBHaXZlbiBhbiBvcGFxdWUgKHRva2VuKSBBUk4sIHJldHVybnMgYSBDbG91ZEZvcm1hdGlvbiBleHByZXNzaW9uIHRoYXQgZXh0cmFjdHMgdGhlIGZ1bmN0aW9uXG4gKiBuYW1lIGZyb20gdGhlIEFSTi5cbiAqXG4gKiBGdW5jdGlvbiBBUk5zIGxvb2sgbGlrZSB0aGlzOlxuICpcbiAqICAgYXJuOmF3czpsYW1iZGE6cmVnaW9uOmFjY291bnQtaWQ6ZnVuY3Rpb246ZnVuY3Rpb24tbmFtZVxuICpcbiAqIC4ud2hpY2ggbWVhbnMgdGhhdCBpbiBvcmRlciB0byBleHRyYWN0IHRoZSBgZnVuY3Rpb24tbmFtZWAgY29tcG9uZW50IGZyb20gdGhlIEFSTiwgd2UgY2FuXG4gKiBzcGxpdCB0aGUgQVJOIHVzaW5nIFwiOlwiIGFuZCBzZWxlY3QgdGhlIGNvbXBvbmVudCBpbiBpbmRleCA2LlxuICpcbiAqIEByZXR1cm5zIGBGblNlbGVjdCg2LCBGblNwbGl0KCc6JywgYXJuKSlgXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3ROYW1lRnJvbUFybihhcm46IHN0cmluZykge1xuICByZXR1cm4gRm4uc2VsZWN0KDYsIEZuLnNwbGl0KCc6JywgYXJuKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlDb2RlQ29uZmlnKGNvZGU6IENvZGVDb25maWcsIHByb3BzOiBGdW5jdGlvblByb3BzKSB7XG4gIC8vIG11dHVhbGx5IGV4Y2x1c2l2ZVxuICBjb25zdCBjb2RlVHlwZSA9IFtjb2RlLmlubGluZUNvZGUsIGNvZGUuczNMb2NhdGlvbiwgY29kZS5pbWFnZV07XG5cbiAgaWYgKGNvZGVUeXBlLmZpbHRlcih4ID0+ICEheCkubGVuZ3RoICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdsYW1iZGEuQ29kZSBtdXN0IHNwZWNpZnkgZXhhY3RseSBvbmUgb2Y6IFwiaW5saW5lQ29kZVwiLCBcInMzTG9jYXRpb25cIiwgb3IgXCJpbWFnZVwiJyk7XG4gIH1cblxuICBpZiAoISFjb2RlLmltYWdlID09PSAocHJvcHMuaGFuZGxlciAhPT0gSGFuZGxlci5GUk9NX0lNQUdFKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaGFuZGxlciBtdXN0IGJlIGBIYW5kbGVyLkZST01fSU1BR0VgIHdoZW4gdXNpbmcgaW1hZ2UgYXNzZXQgZm9yIExhbWJkYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKCEhY29kZS5pbWFnZSA9PT0gKHByb3BzLnJ1bnRpbWUgIT09IFJ1bnRpbWUuRlJPTV9JTUFHRSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3J1bnRpbWUgbXVzdCBiZSBgUnVudGltZS5GUk9NX0lNQUdFYCB3aGVuIHVzaW5nIGltYWdlIGFzc2V0IGZvciBMYW1iZGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIC8vIGlmIHRoaXMgaXMgaW5saW5lIGNvZGUsIGNoZWNrIHRoYXQgdGhlIHJ1bnRpbWUgc3VwcG9ydHNcbiAgaWYgKGNvZGUuaW5saW5lQ29kZSAmJiAhcHJvcHMucnVudGltZS5zdXBwb3J0c0lubGluZUNvZGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYElubGluZSBzb3VyY2Ugbm90IGFsbG93ZWQgZm9yICR7cHJvcHMucnVudGltZSEubmFtZX1gKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bmRlZmluZWRJZk5vS2V5czxBPihzdHJ1Y3Q6IEEpOiBBIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgYWxsVW5kZWZpbmVkID0gT2JqZWN0LnZhbHVlcyhzdHJ1Y3QpLmV2ZXJ5KHZhbCA9PiB2YWwgPT09IHVuZGVmaW5lZCk7XG4gIHJldHVybiBhbGxVbmRlZmluZWQgPyB1bmRlZmluZWQgOiBzdHJ1Y3Q7XG59XG5cbi8qKlxuICogQXNwZWN0IGZvciB1cGdyYWRpbmcgZnVuY3Rpb24gdmVyc2lvbnMgd2hlbiB0aGUgZmVhdHVyZSBmbGFnXG4gKiBwcm92aWRlZCBmZWF0dXJlIGZsYWcgcHJlc2VudC4gVGhpcyBjYW4gYmUgbmVjZXNzYXJ5IHdoZW4gdGhlIGZlYXR1cmUgZmxhZ1xuICogY2hhbmdlcyB0aGUgZnVuY3Rpb24gaGFzaCwgYXMgc3VjaCBjaGFuZ2VzIG11c3QgYmUgYXNzb2NpYXRlZCB3aXRoIGEgbmV3XG4gKiB2ZXJzaW9uLiBUaGlzIGFzcGVjdCB3aWxsIGNoYW5nZSB0aGUgZnVuY3Rpb24gZGVzY3JpcHRpb24gaW4gdGhlc2UgY2FzZXMsXG4gKiB3aGljaCBcInZhbGlkYXRlc1wiIHRoZSBuZXcgZnVuY3Rpb24gaGFzaC5cbiAqL1xuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uVmVyc2lvblVwZ3JhZGUgaW1wbGVtZW50cyBJQXNwZWN0IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBmZWF0dXJlRmxhZzogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IGVuYWJsZWQ9dHJ1ZSkge31cblxuICBwdWJsaWMgdmlzaXQobm9kZTogSUNvbnN0cnVjdCk6IHZvaWQge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRnVuY3Rpb24gJiZcbiAgICAgIHRoaXMuZW5hYmxlZCA9PT0gRmVhdHVyZUZsYWdzLm9mKG5vZGUpLmlzRW5hYmxlZCh0aGlzLmZlYXR1cmVGbGFnKSkge1xuICAgICAgY29uc3QgY2ZuRnVuY3Rpb24gPSBub2RlLm5vZGUuZGVmYXVsdENoaWxkIGFzIENmbkZ1bmN0aW9uO1xuICAgICAgY29uc3QgZGVzYyA9IGNmbkZ1bmN0aW9uLmRlc2NyaXB0aW9uID8gYCR7Y2ZuRnVuY3Rpb24uZGVzY3JpcHRpb259IGAgOiAnJztcbiAgICAgIGNmbkZ1bmN0aW9uLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ0Rlc2NyaXB0aW9uJywgYCR7ZGVzY312ZXJzaW9uLWhhc2g6JHtjYWxjdWxhdGVGdW5jdGlvbkhhc2gobm9kZSl9YCk7XG4gICAgfVxuICB9O1xufVxuIl19