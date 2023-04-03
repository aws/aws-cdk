"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectNotificationEvents = exports.BuildEnvironmentVariableType = exports.WindowsBuildImage = exports.WindowsImageType = exports.LinuxBuildImage = exports.ImagePullPrincipalType = exports.ComputeType = exports.Project = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const notifications = require("@aws-cdk/aws-codestarnotifications");
const ec2 = require("@aws-cdk/aws-ec2");
const aws_ecr_assets_1 = require("@aws-cdk/aws-ecr-assets");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const build_spec_1 = require("./build-spec");
const cache_1 = require("./cache");
const codebuild_canned_metrics_generated_1 = require("./codebuild-canned-metrics.generated");
const codebuild_generated_1 = require("./codebuild.generated");
const codepipeline_artifacts_1 = require("./codepipeline-artifacts");
const no_artifacts_1 = require("./no-artifacts");
const no_source_1 = require("./no-source");
const run_script_linux_build_spec_1 = require("./private/run-script-linux-build-spec");
const report_group_utils_1 = require("./report-group-utils");
const source_types_1 = require("./source-types");
const VPC_POLICY_SYM = Symbol.for('@aws-cdk/aws-codebuild.roleVpcPolicy');
/**
 * Represents a reference to a CodeBuild Project.
 *
 * If you're managing the Project alongside the rest of your CDK resources,
 * use the `Project` class.
 *
 * If you want to reference an already existing Project
 * (or one defined in a different CDK Stack),
 * use the `import` method.
 */
class ProjectBase extends core_1.Resource {
    /**
     * Access the Connections object.
     * Will fail if this Project does not have a VPC set.
     */
    get connections() {
        if (!this._connections) {
            throw new Error('Only VPC-associated Projects have security groups to manage. Supply the "vpc" parameter when creating the Project');
        }
        return this._connections;
    }
    enableBatchBuilds() {
        return undefined;
    }
    /**
     * Add a permission only if there's a policy attached.
     * @param statement The permissions statement to add
     */
    addToRolePolicy(statement) {
        if (this.role) {
            this.role.addToPrincipalPolicy(statement);
        }
    }
    /**
     * Defines a CloudWatch event rule triggered when something happens with this project.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    onEvent(id, options = {}) {
        const rule = new events.Rule(this, id, options);
        rule.addTarget(options.target);
        rule.addEventPattern({
            source: ['aws.codebuild'],
            detail: {
                'project-name': [this.projectName],
            },
        });
        return rule;
    }
    /**
     * Defines a CloudWatch event rule triggered when the build project state
     * changes. You can filter specific build status events using an event
     * pattern filter on the `build-status` detail field:
     *
     *    const rule = project.onStateChange('OnBuildStarted', { target });
     *    rule.addEventPattern({
     *      detail: {
     *        'build-status': [
     *          "IN_PROGRESS",
     *          "SUCCEEDED",
     *          "FAILED",
     *          "STOPPED"
     *        ]
     *      }
     *    });
     *
     * You can also use the methods `onBuildFailed` and `onBuildSucceeded` to define rules for
     * these specific state changes.
     *
     * To access fields from the event in the event target input,
     * use the static fields on the `StateChangeEvent` class.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    onStateChange(id, options = {}) {
        const rule = this.onEvent(id, options);
        rule.addEventPattern({
            detailType: ['CodeBuild Build State Change'],
        });
        return rule;
    }
    /**
     * Defines a CloudWatch event rule that triggers upon phase change of this
     * build project.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html
     */
    onPhaseChange(id, options = {}) {
        const rule = this.onEvent(id, options);
        rule.addEventPattern({
            detailType: ['CodeBuild Build Phase Change'],
        });
        return rule;
    }
    /**
     * Defines an event rule which triggers when a build starts.
     *
     * To access fields from the event in the event target input,
     * use the static fields on the `StateChangeEvent` class.
     */
    onBuildStarted(id, options = {}) {
        const rule = this.onStateChange(id, options);
        rule.addEventPattern({
            detail: {
                'build-status': ['IN_PROGRESS'],
            },
        });
        return rule;
    }
    /**
     * Defines an event rule which triggers when a build fails.
     *
     * To access fields from the event in the event target input,
     * use the static fields on the `StateChangeEvent` class.
     */
    onBuildFailed(id, options = {}) {
        const rule = this.onStateChange(id, options);
        rule.addEventPattern({
            detail: {
                'build-status': ['FAILED'],
            },
        });
        return rule;
    }
    /**
     * Defines an event rule which triggers when a build completes successfully.
     *
     * To access fields from the event in the event target input,
     * use the static fields on the `StateChangeEvent` class.
     */
    onBuildSucceeded(id, options = {}) {
        const rule = this.onStateChange(id, options);
        rule.addEventPattern({
            detail: {
                'build-status': ['SUCCEEDED'],
            },
        });
        return rule;
    }
    /**
     * @returns a CloudWatch metric associated with this build project.
     * @param metricName The name of the metric
     * @param props Customization properties
     */
    metric(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/CodeBuild',
            metricName,
            dimensionsMap: { ProjectName: this.projectName },
            ...props,
        }).attachTo(this);
    }
    /**
     * Measures the number of builds triggered.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    metricBuilds(props) {
        return this.cannedMetric(codebuild_canned_metrics_generated_1.CodeBuildMetrics.buildsSum, props);
    }
    /**
     * Measures the duration of all builds over time.
     *
     * Units: Seconds
     *
     * Valid CloudWatch statistics: Average (recommended), Maximum, Minimum
     *
     * @default average over 5 minutes
     */
    metricDuration(props) {
        return this.cannedMetric(codebuild_canned_metrics_generated_1.CodeBuildMetrics.durationAverage, props);
    }
    /**
     * Measures the number of successful builds.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    metricSucceededBuilds(props) {
        return this.cannedMetric(codebuild_canned_metrics_generated_1.CodeBuildMetrics.succeededBuildsSum, props);
    }
    /**
     * Measures the number of builds that failed because of client error or
     * because of a timeout.
     *
     * Units: Count
     *
     * Valid CloudWatch statistics: Sum
     *
     * @default sum over 5 minutes
     */
    metricFailedBuilds(props) {
        return this.cannedMetric(codebuild_canned_metrics_generated_1.CodeBuildMetrics.failedBuildsSum, props);
    }
    notifyOn(id, target, options) {
        return new notifications.NotificationRule(this, id, {
            ...options,
            source: this,
            targets: [target],
        });
    }
    notifyOnBuildSucceeded(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [ProjectNotificationEvents.BUILD_SUCCEEDED],
        });
    }
    notifyOnBuildFailed(id, target, options) {
        return this.notifyOn(id, target, {
            ...options,
            events: [ProjectNotificationEvents.BUILD_FAILED],
        });
    }
    bindAsNotificationRuleSource(_scope) {
        return {
            sourceArn: this.projectArn,
        };
    }
    cannedMetric(fn, props) {
        return new cloudwatch.Metric({
            ...fn({ ProjectName: this.projectName }),
            ...props,
        }).attachTo(this);
    }
}
/**
 * A representation of a CodeBuild Project.
 */
class Project extends ProjectBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.projectName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_ProjectProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Project);
            }
            throw error;
        }
        this.role = props.role || new iam.Role(this, 'Role', {
            roleName: core_1.PhysicalName.GENERATE_IF_NEEDED,
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
        });
        this.grantPrincipal = this.role;
        this.buildImage = (props.environment && props.environment.buildImage) || LinuxBuildImage.STANDARD_1_0;
        // let source "bind" to the project. this usually involves granting permissions
        // for the code build role to interact with the source.
        this.source = props.source || new no_source_1.NoSource();
        const sourceConfig = this.source.bind(this, this);
        if (props.badge && !this.source.badgeSupported) {
            throw new Error(`Badge is not supported for source type ${this.source.type}`);
        }
        const artifacts = props.artifacts
            ? props.artifacts
            : (this.source.type === source_types_1.CODEPIPELINE_SOURCE_ARTIFACTS_TYPE
                ? new codepipeline_artifacts_1.CodePipelineArtifacts()
                : new no_artifacts_1.NoArtifacts());
        const artifactsConfig = artifacts.bind(this, this);
        const cache = props.cache || cache_1.Cache.none();
        // give the caching strategy the option to grant permissions to any required resources
        cache._bind(this);
        // Inject download commands for asset if requested
        const environmentVariables = props.environmentVariables || {};
        const buildSpec = props.buildSpec;
        if (this.source.type === source_types_1.NO_SOURCE_TYPE && (buildSpec === undefined || !buildSpec.isImmediate)) {
            throw new Error("If the Project's source is NoSource, you need to provide a concrete buildSpec");
        }
        this._secondarySources = [];
        this._secondarySourceVersions = [];
        this._fileSystemLocations = [];
        for (const secondarySource of props.secondarySources || []) {
            this.addSecondarySource(secondarySource);
        }
        this._secondaryArtifacts = [];
        for (const secondaryArtifact of props.secondaryArtifacts || []) {
            this.addSecondaryArtifact(secondaryArtifact);
        }
        this.validateCodePipelineSettings(artifacts);
        for (const fileSystemLocation of props.fileSystemLocations || []) {
            this.addFileSystemLocation(fileSystemLocation);
        }
        const resource = new codebuild_generated_1.CfnProject(this, 'Resource', {
            description: props.description,
            source: {
                ...sourceConfig.sourceProperty,
                buildSpec: buildSpec && buildSpec.toBuildSpec(this),
            },
            artifacts: artifactsConfig.artifactsProperty,
            serviceRole: this.role.roleArn,
            environment: this.renderEnvironment(props, environmentVariables),
            fileSystemLocations: core_1.Lazy.any({ produce: () => this.renderFileSystemLocations() }),
            // lazy, because we have a setter for it in setEncryptionKey
            // The 'alias/aws/s3' default is necessary because leaving the `encryptionKey` field
            // empty will not remove existing encryptionKeys during an update (ref. t/D17810523)
            encryptionKey: core_1.Lazy.string({ produce: () => this._encryptionKey ? this._encryptionKey.keyArn : 'alias/aws/s3' }),
            badgeEnabled: props.badge,
            cache: cache._toCloudFormation(),
            name: this.physicalName,
            timeoutInMinutes: props.timeout && props.timeout.toMinutes(),
            queuedTimeoutInMinutes: props.queuedTimeout && props.queuedTimeout.toMinutes(),
            concurrentBuildLimit: props.concurrentBuildLimit,
            secondarySources: core_1.Lazy.any({ produce: () => this.renderSecondarySources() }),
            secondarySourceVersions: core_1.Lazy.any({ produce: () => this.renderSecondarySourceVersions() }),
            secondaryArtifacts: core_1.Lazy.any({ produce: () => this.renderSecondaryArtifacts() }),
            triggers: sourceConfig.buildTriggers,
            sourceVersion: sourceConfig.sourceVersion,
            vpcConfig: this.configureVpc(props),
            logsConfig: this.renderLoggingConfiguration(props.logging),
            buildBatchConfig: core_1.Lazy.any({
                produce: () => {
                    const config = this._batchServiceRole ? {
                        serviceRole: this._batchServiceRole.roleArn,
                    } : undefined;
                    return config;
                },
            }),
        });
        this.addVpcRequiredPermissions(props, resource);
        this.projectArn = this.getResourceArnAttribute(resource.attrArn, {
            service: 'codebuild',
            resource: 'project',
            resourceName: this.physicalName,
        });
        this.projectName = this.getResourceNameAttribute(resource.ref);
        this.addToRolePolicy(this.createLoggingPermission());
        // add permissions to create and use test report groups
        // with names starting with the project's name,
        // unless the customer explicitly opts out of it
        if (props.grantReportGroupPermissions !== false) {
            this.addToRolePolicy(new iam.PolicyStatement({
                actions: [
                    'codebuild:CreateReportGroup',
                    'codebuild:CreateReport',
                    'codebuild:UpdateReport',
                    'codebuild:BatchPutTestCases',
                    'codebuild:BatchPutCodeCoverages',
                ],
                resources: [report_group_utils_1.renderReportGroupArn(this, `${this.projectName}-*`)],
            }));
        }
        // https://docs.aws.amazon.com/codebuild/latest/userguide/session-manager.html
        if (props.ssmSessionPermissions) {
            this.addToRolePolicy(new iam.PolicyStatement({
                actions: [
                    // For the SSM channel
                    'ssmmessages:CreateControlChannel',
                    'ssmmessages:CreateDataChannel',
                    'ssmmessages:OpenControlChannel',
                    'ssmmessages:OpenDataChannel',
                    // In case the SSM session is set up to log commands to CloudWatch
                    'logs:DescribeLogGroups',
                    'logs:CreateLogStream',
                    'logs:PutLogEvents',
                    // In case the SSM session is set up to log commands to S3.
                    's3:GetEncryptionConfiguration',
                    's3:PutObject',
                ],
                resources: ['*'],
            }));
        }
        if (props.encryptionKey) {
            this.encryptionKey = props.encryptionKey;
        }
        // bind
        if (isBindableBuildImage(this.buildImage)) {
            this.buildImage.bind(this, this, {});
        }
        this.node.addValidation({ validate: () => this.validateProject() });
    }
    static fromProjectArn(scope, id, projectArn) {
        const parsedArn = core_1.Stack.of(scope).splitArn(projectArn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        class Import extends ProjectBase {
            constructor(s, i) {
                super(s, i, {
                    account: parsedArn.account,
                    region: parsedArn.region,
                });
                this.projectArn = projectArn;
                this.projectName = parsedArn.resourceName;
                this.role = undefined;
                this.grantPrincipal = new iam.UnknownPrincipal({ resource: this });
            }
        }
        return new Import(scope, id);
    }
    /**
     * Import a Project defined either outside the CDK,
     * or in a different CDK Stack
     * (and exported using the `export` method).
     *
     * @note if you're importing a CodeBuild Project for use
     *   in a CodePipeline, make sure the existing Project
     *   has permissions to access the S3 Bucket of that Pipeline -
     *   otherwise, builds in that Pipeline will always fail.
     *
     * @param scope the parent Construct for this Construct
     * @param id the logical name of this Construct
     * @param projectName the name of the project to import
     * @returns a reference to the existing Project
     */
    static fromProjectName(scope, id, projectName) {
        class Import extends ProjectBase {
            constructor(s, i) {
                super(s, i);
                this.role = undefined;
                this.projectArn = core_1.Stack.of(this).formatArn({
                    service: 'codebuild',
                    resource: 'project',
                    resourceName: projectName,
                });
                this.grantPrincipal = new iam.UnknownPrincipal({ resource: this });
                this.projectName = projectName;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Convert the environment variables map of string to `BuildEnvironmentVariable`,
     * which is the customer-facing type, to a list of `CfnProject.EnvironmentVariableProperty`,
     * which is the representation of environment variables in CloudFormation.
     *
     * @param environmentVariables the map of string to environment variables
     * @param validateNoPlainTextSecrets whether to throw an exception
     *   if any of the plain text environment variables contain secrets, defaults to 'false'
     * @returns an array of `CfnProject.EnvironmentVariableProperty` instances
     */
    static serializeEnvVariables(environmentVariables, validateNoPlainTextSecrets = false, principal) {
        const ret = new Array();
        const ssmIamResources = new Array();
        const secretsManagerIamResources = new Set();
        const kmsIamResources = new Set();
        for (const [name, envVariable] of Object.entries(environmentVariables)) {
            const envVariableValue = envVariable.value?.toString();
            const cfnEnvVariable = {
                name,
                type: envVariable.type || BuildEnvironmentVariableType.PLAINTEXT,
                value: envVariableValue,
            };
            ret.push(cfnEnvVariable);
            // validate that the plain-text environment variables don't contain any secrets in them
            if (validateNoPlainTextSecrets && cfnEnvVariable.type === BuildEnvironmentVariableType.PLAINTEXT) {
                const fragments = core_1.Tokenization.reverseString(cfnEnvVariable.value);
                for (const token of fragments.tokens) {
                    if (token instanceof core_1.SecretValue) {
                        throw new Error(`Plaintext environment variable '${name}' contains a secret value! ` +
                            'This means the value of this variable will be visible in plain text in the AWS Console. ' +
                            "Please consider using CodeBuild's SecretsManager environment variables feature instead. " +
                            "If you'd like to continue with having this secret in the plaintext environment variables, " +
                            'please set the checkSecretsInPlainTextEnvVariables property to false');
                    }
                }
            }
            if (principal) {
                const stack = core_1.Stack.of(principal);
                // save the SSM env variables
                if (envVariable.type === BuildEnvironmentVariableType.PARAMETER_STORE) {
                    ssmIamResources.push(stack.formatArn({
                        service: 'ssm',
                        resource: 'parameter',
                        // If the parameter name starts with / the resource name is not separated with a double '/'
                        // arn:aws:ssm:region:1111111111:parameter/PARAM_NAME
                        resourceName: envVariableValue.startsWith('/')
                            ? envVariableValue.slice(1)
                            : envVariableValue,
                    }));
                }
                // save SecretsManager env variables
                if (envVariable.type === BuildEnvironmentVariableType.SECRETS_MANAGER) {
                    // We have 3 basic cases here of what envVariableValue can be:
                    // 1. A string that starts with 'arn:' (and might contain Token fragments).
                    // 2. A Token.
                    // 3. A simple value, like 'secret-id'.
                    if (envVariableValue.startsWith('arn:')) {
                        const parsedArn = stack.splitArn(envVariableValue, core_1.ArnFormat.COLON_RESOURCE_NAME);
                        if (!parsedArn.resourceName) {
                            throw new Error('SecretManager ARN is missing the name of the secret: ' + envVariableValue);
                        }
                        // the value of the property can be a complex string, separated by ':';
                        // see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec.env.secrets-manager
                        const secretName = parsedArn.resourceName.split(':')[0];
                        secretsManagerIamResources.add(stack.formatArn({
                            service: 'secretsmanager',
                            resource: 'secret',
                            // since we don't know whether the ARN was full, or partial
                            // (CodeBuild supports both),
                            // stick a "*" at the end, which makes it work for both
                            resourceName: `${secretName}*`,
                            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
                            partition: parsedArn.partition,
                            account: parsedArn.account,
                            region: parsedArn.region,
                        }));
                        // if secret comes from another account, SecretsManager will need to access
                        // KMS on the other account as well to be able to get the secret
                        if (parsedArn.account && core_1.Token.compareStrings(parsedArn.account, stack.account) === core_1.TokenComparison.DIFFERENT) {
                            kmsIamResources.add(stack.formatArn({
                                service: 'kms',
                                resource: 'key',
                                // We do not know the ID of the key, but since this is a cross-account access,
                                // the key policies have to allow this access, so a wildcard is safe here
                                resourceName: '*',
                                arnFormat: core_1.ArnFormat.SLASH_RESOURCE_NAME,
                                partition: parsedArn.partition,
                                account: parsedArn.account,
                                region: parsedArn.region,
                            }));
                        }
                    }
                    else if (core_1.Token.isUnresolved(envVariableValue)) {
                        // the value of the property can be a complex string, separated by ':';
                        // see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec.env.secrets-manager
                        let secretArn = envVariableValue.split(':')[0];
                        // parse the Token, and see if it represents a single resource
                        // (we will assume it's a Secret from SecretsManager)
                        const fragments = core_1.Tokenization.reverseString(envVariableValue);
                        if (fragments.tokens.length === 1) {
                            const resolvable = fragments.tokens[0];
                            if (core_1.Reference.isReference(resolvable)) {
                                // check the Stack the resource owning the reference belongs to
                                const resourceStack = core_1.Stack.of(resolvable.target);
                                if (core_1.Token.compareStrings(stack.account, resourceStack.account) === core_1.TokenComparison.DIFFERENT) {
                                    // since this is a cross-account access,
                                    // add the appropriate KMS permissions
                                    kmsIamResources.add(stack.formatArn({
                                        service: 'kms',
                                        resource: 'key',
                                        // We do not know the ID of the key, but since this is a cross-account access,
                                        // the key policies have to allow this access, so a wildcard is safe here
                                        resourceName: '*',
                                        arnFormat: core_1.ArnFormat.SLASH_RESOURCE_NAME,
                                        partition: resourceStack.partition,
                                        account: resourceStack.account,
                                        region: resourceStack.region,
                                    }));
                                    // Work around a bug in SecretsManager -
                                    // when the access is cross-environment,
                                    // Secret.secretArn returns a partial ARN!
                                    // So add a "*" at the end, so that the permissions work
                                    secretArn = `${secretArn}-??????`;
                                }
                            }
                        }
                        // if we are passed a Token, we should assume it's the ARN of the Secret
                        // (as the name would not work anyway, because it would be the full name, which CodeBuild does not support)
                        secretsManagerIamResources.add(secretArn);
                    }
                    else {
                        // the value of the property can be a complex string, separated by ':';
                        // see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec.env.secrets-manager
                        const secretName = envVariableValue.split(':')[0];
                        secretsManagerIamResources.add(stack.formatArn({
                            service: 'secretsmanager',
                            resource: 'secret',
                            resourceName: `${secretName}-??????`,
                            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
                        }));
                    }
                }
            }
        }
        if (ssmIamResources.length !== 0) {
            principal?.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
                actions: ['ssm:GetParameters'],
                resources: ssmIamResources,
            }));
        }
        if (secretsManagerIamResources.size !== 0) {
            principal?.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
                actions: ['secretsmanager:GetSecretValue'],
                resources: Array.from(secretsManagerIamResources),
            }));
        }
        if (kmsIamResources.size !== 0) {
            principal?.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
                actions: ['kms:Decrypt'],
                resources: Array.from(kmsIamResources),
            }));
        }
        return ret;
    }
    enableBatchBuilds() {
        if (!this._batchServiceRole) {
            this._batchServiceRole = new iam.Role(this, 'BatchServiceRole', {
                assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
            });
            this._batchServiceRole.addToPrincipalPolicy(new iam.PolicyStatement({
                resources: [core_1.Lazy.string({
                        produce: () => this.projectArn,
                    })],
                actions: [
                    'codebuild:StartBuild',
                    'codebuild:StopBuild',
                    'codebuild:RetryBuild',
                ],
            }));
        }
        return {
            role: this._batchServiceRole,
        };
    }
    /**
     * Adds a secondary source to the Project.
     *
     * @param secondarySource the source to add as a secondary source
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
     */
    addSecondarySource(secondarySource) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_ISource(secondarySource);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addSecondarySource);
            }
            throw error;
        }
        if (!secondarySource.identifier) {
            throw new Error('The identifier attribute is mandatory for secondary sources');
        }
        const secondarySourceConfig = secondarySource.bind(this, this);
        this._secondarySources.push(secondarySourceConfig.sourceProperty);
        if (secondarySourceConfig.sourceVersion) {
            this._secondarySourceVersions.push({
                sourceIdentifier: secondarySource.identifier,
                sourceVersion: secondarySourceConfig.sourceVersion,
            });
        }
    }
    /**
     * Adds a fileSystemLocation to the Project.
     *
     * @param fileSystemLocation the fileSystemLocation to add
     */
    addFileSystemLocation(fileSystemLocation) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_IFileSystemLocation(fileSystemLocation);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFileSystemLocation);
            }
            throw error;
        }
        const fileSystemConfig = fileSystemLocation.bind(this, this);
        this._fileSystemLocations.push(fileSystemConfig.location);
    }
    /**
     * Adds a secondary artifact to the Project.
     *
     * @param secondaryArtifact the artifact to add as a secondary artifact
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
     */
    addSecondaryArtifact(secondaryArtifact) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_IArtifacts(secondaryArtifact);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addSecondaryArtifact);
            }
            throw error;
        }
        if (!secondaryArtifact.identifier) {
            throw new Error('The identifier attribute is mandatory for secondary artifacts');
        }
        this._secondaryArtifacts.push(secondaryArtifact.bind(this, this).artifactsProperty);
    }
    /**
     * A callback invoked when the given project is added to a CodePipeline.
     *
     * @param _scope the construct the binding is taking place in
     * @param options additional options for the binding
     */
    bindToCodePipeline(_scope, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_BindToCodePipelineOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bindToCodePipeline);
            }
            throw error;
        }
        // work around a bug in CodeBuild: it ignores the KMS key set on the pipeline,
        // and always uses its own, project-level key
        if (options.artifactBucket.encryptionKey && !this._encryptionKey) {
            // we cannot safely do this assignment if the key is of type kms.Key,
            // and belongs to a stack in a different account or region than the project
            // (that would cause an illegal reference, as KMS keys don't have physical names)
            const keyStack = core_1.Stack.of(options.artifactBucket.encryptionKey);
            const projectStack = core_1.Stack.of(this);
            if (!(options.artifactBucket.encryptionKey instanceof kms.Key &&
                (keyStack.account !== projectStack.account || keyStack.region !== projectStack.region))) {
                this.encryptionKey = options.artifactBucket.encryptionKey;
            }
        }
    }
    validateProject() {
        const ret = new Array();
        if (this.source.type === source_types_1.CODEPIPELINE_SOURCE_ARTIFACTS_TYPE) {
            if (this._secondarySources.length > 0) {
                ret.push('A Project with a CodePipeline Source cannot have secondary sources. ' +
                    "Use the CodeBuild Pipeline Actions' `extraInputs` property instead");
            }
            if (this._secondaryArtifacts.length > 0) {
                ret.push('A Project with a CodePipeline Source cannot have secondary artifacts. ' +
                    "Use the CodeBuild Pipeline Actions' `outputs` property instead");
            }
        }
        return ret;
    }
    set encryptionKey(encryptionKey) {
        this._encryptionKey = encryptionKey;
        encryptionKey.grantEncryptDecrypt(this);
    }
    createLoggingPermission() {
        const logGroupArn = core_1.Stack.of(this).formatArn({
            service: 'logs',
            resource: 'log-group',
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
            resourceName: `/aws/codebuild/${this.projectName}`,
        });
        const logGroupStarArn = `${logGroupArn}:*`;
        return new iam.PolicyStatement({
            resources: [logGroupArn, logGroupStarArn],
            actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
        });
    }
    renderEnvironment(props, projectVars = {}) {
        const env = props.environment ?? {};
        const vars = {};
        const containerVars = env.environmentVariables || {};
        // first apply environment variables from the container definition
        for (const name of Object.keys(containerVars)) {
            vars[name] = containerVars[name];
        }
        // now apply project-level vars
        for (const name of Object.keys(projectVars)) {
            vars[name] = projectVars[name];
        }
        const hasEnvironmentVars = Object.keys(vars).length > 0;
        const errors = this.buildImage.validate(env);
        if (errors.length > 0) {
            throw new Error('Invalid CodeBuild environment: ' + errors.join('\n'));
        }
        const imagePullPrincipalType = this.buildImage.imagePullPrincipalType === ImagePullPrincipalType.CODEBUILD
            ? ImagePullPrincipalType.CODEBUILD
            : ImagePullPrincipalType.SERVICE_ROLE;
        if (this.buildImage.repository) {
            if (imagePullPrincipalType === ImagePullPrincipalType.SERVICE_ROLE) {
                this.buildImage.repository.grantPull(this);
            }
            else {
                const statement = new iam.PolicyStatement({
                    principals: [new iam.ServicePrincipal('codebuild.amazonaws.com')],
                    actions: ['ecr:GetDownloadUrlForLayer', 'ecr:BatchGetImage', 'ecr:BatchCheckLayerAvailability'],
                });
                statement.sid = 'CodeBuild';
                this.buildImage.repository.addToResourcePolicy(statement);
            }
        }
        if (imagePullPrincipalType === ImagePullPrincipalType.SERVICE_ROLE) {
            this.buildImage.secretsManagerCredentials?.grantRead(this);
        }
        const secret = this.buildImage.secretsManagerCredentials;
        return {
            type: this.buildImage.type,
            image: this.buildImage.imageId,
            imagePullCredentialsType: imagePullPrincipalType,
            registryCredential: secret
                ? {
                    credentialProvider: 'SECRETS_MANAGER',
                    // Secrets must be referenced by either the full ARN (with SecretsManager suffix), or by name.
                    // "Partial" ARNs (without the suffix) will fail a validation regex at deploy-time.
                    credential: secret.secretFullArn ?? secret.secretName,
                }
                : undefined,
            certificate: env.certificate?.bucket.arnForObjects(env.certificate.objectKey),
            privilegedMode: env.privileged || false,
            computeType: env.computeType || this.buildImage.defaultComputeType,
            environmentVariables: hasEnvironmentVars
                ? Project.serializeEnvVariables(vars, props.checkSecretsInPlainTextEnvVariables ?? true, this)
                : undefined,
        };
    }
    renderFileSystemLocations() {
        return this._fileSystemLocations.length === 0
            ? undefined
            : this._fileSystemLocations;
    }
    renderSecondarySources() {
        return this._secondarySources.length === 0
            ? undefined
            : this._secondarySources;
    }
    renderSecondarySourceVersions() {
        return this._secondarySourceVersions.length === 0
            ? undefined
            : this._secondarySourceVersions;
    }
    renderSecondaryArtifacts() {
        return this._secondaryArtifacts.length === 0
            ? undefined
            : this._secondaryArtifacts;
    }
    /**
     * If configured, set up the VPC-related properties
     *
     * Returns the VpcConfig that should be added to the
     * codebuild creation properties.
     */
    configureVpc(props) {
        if ((props.securityGroups || props.allowAllOutbound !== undefined) && !props.vpc) {
            throw new Error('Cannot configure \'securityGroup\' or \'allowAllOutbound\' without configuring a VPC');
        }
        if (!props.vpc) {
            return undefined;
        }
        if ((props.securityGroups && props.securityGroups.length > 0) && props.allowAllOutbound !== undefined) {
            throw new Error('Configure \'allowAllOutbound\' directly on the supplied SecurityGroup.');
        }
        let securityGroups;
        if (props.securityGroups && props.securityGroups.length > 0) {
            securityGroups = props.securityGroups;
        }
        else {
            const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
                vpc: props.vpc,
                description: 'Automatic generated security group for CodeBuild ' + core_1.Names.uniqueId(this),
                allowAllOutbound: props.allowAllOutbound,
            });
            securityGroups = [securityGroup];
        }
        this._connections = new ec2.Connections({ securityGroups });
        return {
            vpcId: props.vpc.vpcId,
            subnets: props.vpc.selectSubnets(props.subnetSelection).subnetIds,
            securityGroupIds: this.connections.securityGroups.map(s => s.securityGroupId),
        };
    }
    renderLoggingConfiguration(props) {
        if (props === undefined) {
            return undefined;
        }
        let s3Config = undefined;
        let cloudwatchConfig = undefined;
        if (props.s3) {
            const s3Logs = props.s3;
            s3Config = {
                status: (s3Logs.enabled ?? true) ? 'ENABLED' : 'DISABLED',
                location: `${s3Logs.bucket.bucketName}` + (s3Logs.prefix ? `/${s3Logs.prefix}` : ''),
                encryptionDisabled: s3Logs.encrypted,
            };
            s3Logs.bucket?.grantWrite(this);
        }
        if (props.cloudWatch) {
            const cloudWatchLogs = props.cloudWatch;
            const status = (cloudWatchLogs.enabled ?? true) ? 'ENABLED' : 'DISABLED';
            if (status === 'ENABLED' && !(cloudWatchLogs.logGroup)) {
                throw new Error('Specifying a LogGroup is required if CloudWatch logging for CodeBuild is enabled');
            }
            cloudWatchLogs.logGroup?.grantWrite(this);
            cloudwatchConfig = {
                status,
                groupName: cloudWatchLogs.logGroup?.logGroupName,
                streamName: cloudWatchLogs.prefix,
            };
        }
        return {
            s3Logs: s3Config,
            cloudWatchLogs: cloudwatchConfig,
        };
    }
    addVpcRequiredPermissions(props, project) {
        if (!props.vpc || !this.role) {
            return;
        }
        this.role.addToPrincipalPolicy(new iam.PolicyStatement({
            resources: [`arn:${core_1.Aws.PARTITION}:ec2:${core_1.Aws.REGION}:${core_1.Aws.ACCOUNT_ID}:network-interface/*`],
            actions: ['ec2:CreateNetworkInterfacePermission'],
            conditions: {
                StringEquals: {
                    'ec2:Subnet': props.vpc
                        .selectSubnets(props.subnetSelection).subnetIds
                        .map(si => `arn:${core_1.Aws.PARTITION}:ec2:${core_1.Aws.REGION}:${core_1.Aws.ACCOUNT_ID}:subnet/${si}`),
                    'ec2:AuthorizedService': 'codebuild.amazonaws.com',
                },
            },
        }));
        // If the same Role is used for multiple Projects, always creating a new `iam.Policy`
        // will attach the same policy multiple times, probably exceeding the maximum size of the
        // Role policy. Make sure we only do it once for the same role.
        //
        // This deduplication could be a feature of the Role itself, but that feels risky and
        // is hard to implement (what with Tokens and all). Safer to fix it locally for now.
        let policy = this.role[VPC_POLICY_SYM];
        if (!policy) {
            policy = new iam.Policy(this, 'PolicyDocument', {
                statements: [
                    new iam.PolicyStatement({
                        resources: ['*'],
                        actions: [
                            'ec2:CreateNetworkInterface',
                            'ec2:DescribeNetworkInterfaces',
                            'ec2:DeleteNetworkInterface',
                            'ec2:DescribeSubnets',
                            'ec2:DescribeSecurityGroups',
                            'ec2:DescribeDhcpOptions',
                            'ec2:DescribeVpcs',
                        ],
                    }),
                ],
            });
            this.role.attachInlinePolicy(policy);
            this.role[VPC_POLICY_SYM] = policy;
        }
        // add an explicit dependency between the EC2 Policy and this Project -
        // otherwise, creating the Project fails, as it requires these permissions
        // to be already attached to the Project's Role
        project.node.addDependency(policy);
    }
    validateCodePipelineSettings(artifacts) {
        const sourceType = this.source.type;
        const artifactsType = artifacts.type;
        if ((sourceType === source_types_1.CODEPIPELINE_SOURCE_ARTIFACTS_TYPE ||
            artifactsType === source_types_1.CODEPIPELINE_SOURCE_ARTIFACTS_TYPE) &&
            (sourceType !== artifactsType)) {
            throw new Error('Both source and artifacts must be set to CodePipeline');
        }
    }
}
exports.Project = Project;
_a = JSII_RTTI_SYMBOL_1;
Project[_a] = { fqn: "@aws-cdk/aws-codebuild.Project", version: "0.0.0" };
/**
 * Build machine compute type.
 */
var ComputeType;
(function (ComputeType) {
    ComputeType["SMALL"] = "BUILD_GENERAL1_SMALL";
    ComputeType["MEDIUM"] = "BUILD_GENERAL1_MEDIUM";
    ComputeType["LARGE"] = "BUILD_GENERAL1_LARGE";
    ComputeType["X2_LARGE"] = "BUILD_GENERAL1_2XLARGE";
})(ComputeType = exports.ComputeType || (exports.ComputeType = {}));
/**
 * The type of principal CodeBuild will use to pull your build Docker image.
 */
var ImagePullPrincipalType;
(function (ImagePullPrincipalType) {
    /**
     * CODEBUILD specifies that CodeBuild uses its own identity when pulling the image.
     * This means the resource policy of the ECR repository that hosts the image will be modified to trust
     * CodeBuild's service principal.
     * This is the required principal type when using CodeBuild's pre-defined images.
     */
    ImagePullPrincipalType["CODEBUILD"] = "CODEBUILD";
    /**
     * SERVICE_ROLE specifies that AWS CodeBuild uses the project's role when pulling the image.
     * The role will be granted pull permissions on the ECR repository hosting the image.
     */
    ImagePullPrincipalType["SERVICE_ROLE"] = "SERVICE_ROLE";
})(ImagePullPrincipalType = exports.ImagePullPrincipalType || (exports.ImagePullPrincipalType = {}));
// Keep around to resolve a circular dependency until removing deprecated ARM image constants from LinuxBuildImage
// eslint-disable-next-line no-duplicate-imports, import/order
const linux_arm_build_image_1 = require("./linux-arm-build-image");
/**
 * A CodeBuild image running x86-64 Linux.
 *
 * This class has a bunch of public constants that represent the most popular images.
 *
 * You can also specify a custom image using one of the static methods:
 *
 * - LinuxBuildImage.fromDockerRegistry(image[, { secretsManagerCredentials }])
 * - LinuxBuildImage.fromEcrRepository(repo[, tag])
 * - LinuxBuildImage.fromAsset(parent, id, props)
 *
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
class LinuxBuildImage {
    constructor(props) {
        this.type = 'LINUX_CONTAINER';
        this.defaultComputeType = ComputeType.SMALL;
        this.imageId = props.imageId;
        this.imagePullPrincipalType = props.imagePullPrincipalType;
        this.secretsManagerCredentials = props.secretsManagerCredentials;
        this.repository = props.repository;
    }
    /**
     * @returns a x86-64 Linux build image from a Docker Hub image.
     */
    static fromDockerRegistry(name, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_DockerImageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromDockerRegistry);
            }
            throw error;
        }
        return new LinuxBuildImage({
            ...options,
            imageId: name,
            imagePullPrincipalType: ImagePullPrincipalType.SERVICE_ROLE,
        });
    }
    /**
     * @returns A x86-64 Linux build image from an ECR repository.
     *
     * NOTE: if the repository is external (i.e. imported), then we won't be able to add
     * a resource policy statement for it so CodeBuild can pull the image.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-ecr.html
     *
     * @param repository The ECR repository
     * @param tagOrDigest Image tag or digest (default "latest", digests must start with `sha256:`)
     */
    static fromEcrRepository(repository, tagOrDigest = 'latest') {
        return new LinuxBuildImage({
            imageId: repository.repositoryUriForTagOrDigest(tagOrDigest),
            imagePullPrincipalType: ImagePullPrincipalType.SERVICE_ROLE,
            repository,
        });
    }
    /**
     * Uses an Docker image asset as a x86-64 Linux build image.
     */
    static fromAsset(scope, id, props) {
        const asset = new aws_ecr_assets_1.DockerImageAsset(scope, id, props);
        return new LinuxBuildImage({
            imageId: asset.imageUri,
            imagePullPrincipalType: ImagePullPrincipalType.SERVICE_ROLE,
            repository: asset.repository,
        });
    }
    /**
     * Uses a Docker image provided by CodeBuild.
     *
     * @returns A Docker image provided by CodeBuild.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
     *
     * @param id The image identifier
     * @example 'aws/codebuild/standard:4.0'
     */
    static fromCodeBuildImageId(id) {
        return LinuxBuildImage.codeBuildImage(id);
    }
    static codeBuildImage(name) {
        return new LinuxBuildImage({
            imageId: name,
            imagePullPrincipalType: ImagePullPrincipalType.CODEBUILD,
        });
    }
    validate(_) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_BuildEnvironment(_);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.validate);
            }
            throw error;
        }
        return [];
    }
    runScriptBuildspec(entrypoint) {
        return run_script_linux_build_spec_1.runScriptLinuxBuildSpec(entrypoint);
    }
}
exports.LinuxBuildImage = LinuxBuildImage;
_b = JSII_RTTI_SYMBOL_1;
LinuxBuildImage[_b] = { fqn: "@aws-cdk/aws-codebuild.LinuxBuildImage", version: "0.0.0" };
LinuxBuildImage.STANDARD_1_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/standard:1.0');
LinuxBuildImage.STANDARD_2_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/standard:2.0');
LinuxBuildImage.STANDARD_3_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/standard:3.0');
/** The `aws/codebuild/standard:4.0` build image. */
LinuxBuildImage.STANDARD_4_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/standard:4.0');
/** The `aws/codebuild/standard:5.0` build image. */
LinuxBuildImage.STANDARD_5_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/standard:5.0');
/** The `aws/codebuild/standard:6.0` build image. */
LinuxBuildImage.STANDARD_6_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/standard:6.0');
LinuxBuildImage.AMAZON_LINUX_2 = LinuxBuildImage.codeBuildImage('aws/codebuild/amazonlinux2-x86_64-standard:1.0');
LinuxBuildImage.AMAZON_LINUX_2_2 = LinuxBuildImage.codeBuildImage('aws/codebuild/amazonlinux2-x86_64-standard:2.0');
/** The Amazon Linux 2 x86_64 standard image, version `3.0`. */
LinuxBuildImage.AMAZON_LINUX_2_3 = LinuxBuildImage.codeBuildImage('aws/codebuild/amazonlinux2-x86_64-standard:3.0');
/** The Amazon Linux 2 x86_64 standard image, version `4.0`. */
LinuxBuildImage.AMAZON_LINUX_2_4 = LinuxBuildImage.codeBuildImage('aws/codebuild/amazonlinux2-x86_64-standard:4.0');
/** @deprecated Use LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0 instead. */
LinuxBuildImage.AMAZON_LINUX_2_ARM = linux_arm_build_image_1.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_1_0;
/**
 * Image "aws/codebuild/amazonlinux2-aarch64-standard:2.0".
 * @deprecated Use LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0 instead.
 * */
LinuxBuildImage.AMAZON_LINUX_2_ARM_2 = linux_arm_build_image_1.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0;
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_BASE = LinuxBuildImage.codeBuildImage('aws/codebuild/ubuntu-base:14.04');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_ANDROID_JAVA8_24_4_1 = LinuxBuildImage.codeBuildImage('aws/codebuild/android-java-8:24.4.1');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_ANDROID_JAVA8_26_1_1 = LinuxBuildImage.codeBuildImage('aws/codebuild/android-java-8:26.1.1');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_DOCKER_17_09_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/docker:17.09.0');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_DOCKER_18_09_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/docker:18.09.0');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_GOLANG_1_10 = LinuxBuildImage.codeBuildImage('aws/codebuild/golang:1.10');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_GOLANG_1_11 = LinuxBuildImage.codeBuildImage('aws/codebuild/golang:1.11');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_OPEN_JDK_8 = LinuxBuildImage.codeBuildImage('aws/codebuild/java:openjdk-8');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_OPEN_JDK_9 = LinuxBuildImage.codeBuildImage('aws/codebuild/java:openjdk-9');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_OPEN_JDK_11 = LinuxBuildImage.codeBuildImage('aws/codebuild/java:openjdk-11');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1 = LinuxBuildImage.codeBuildImage('aws/codebuild/nodejs:10.14.1');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/nodejs:10.1.0');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_NODEJS_8_11_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/nodejs:8.11.0');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_NODEJS_6_3_1 = LinuxBuildImage.codeBuildImage('aws/codebuild/nodejs:6.3.1');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_PHP_5_6 = LinuxBuildImage.codeBuildImage('aws/codebuild/php:5.6');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_PHP_7_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/php:7.0');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_PHP_7_1 = LinuxBuildImage.codeBuildImage('aws/codebuild/php:7.1');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_PYTHON_3_7_1 = LinuxBuildImage.codeBuildImage('aws/codebuild/python:3.7.1');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_PYTHON_3_6_5 = LinuxBuildImage.codeBuildImage('aws/codebuild/python:3.6.5');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_PYTHON_3_5_2 = LinuxBuildImage.codeBuildImage('aws/codebuild/python:3.5.2');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_PYTHON_3_4_5 = LinuxBuildImage.codeBuildImage('aws/codebuild/python:3.4.5');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_PYTHON_3_3_6 = LinuxBuildImage.codeBuildImage('aws/codebuild/python:3.3.6');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_PYTHON_2_7_12 = LinuxBuildImage.codeBuildImage('aws/codebuild/python:2.7.12');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_RUBY_2_5_3 = LinuxBuildImage.codeBuildImage('aws/codebuild/ruby:2.5.3');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_RUBY_2_5_1 = LinuxBuildImage.codeBuildImage('aws/codebuild/ruby:2.5.1');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_RUBY_2_3_1 = LinuxBuildImage.codeBuildImage('aws/codebuild/ruby:2.3.1');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_RUBY_2_2_5 = LinuxBuildImage.codeBuildImage('aws/codebuild/ruby:2.2.5');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_DOTNET_CORE_1_1 = LinuxBuildImage.codeBuildImage('aws/codebuild/dot-net:core-1');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_DOTNET_CORE_2_0 = LinuxBuildImage.codeBuildImage('aws/codebuild/dot-net:core-2.0');
/** @deprecated Use `STANDARD_2_0` and specify runtime in buildspec runtime-versions section */
LinuxBuildImage.UBUNTU_14_04_DOTNET_CORE_2_1 = LinuxBuildImage.codeBuildImage('aws/codebuild/dot-net:core-2.1');
/**
 * Environment type for Windows Docker images
 */
var WindowsImageType;
(function (WindowsImageType) {
    /**
     * The standard environment type, WINDOWS_CONTAINER
     */
    WindowsImageType["STANDARD"] = "WINDOWS_CONTAINER";
    /**
     * The WINDOWS_SERVER_2019_CONTAINER environment type
     */
    WindowsImageType["SERVER_2019"] = "WINDOWS_SERVER_2019_CONTAINER";
})(WindowsImageType = exports.WindowsImageType || (exports.WindowsImageType = {}));
/**
 * A CodeBuild image running Windows.
 *
 * This class has a bunch of public constants that represent the most popular images.
 *
 * You can also specify a custom image using one of the static methods:
 *
 * - WindowsBuildImage.fromDockerRegistry(image[, { secretsManagerCredentials }, imageType])
 * - WindowsBuildImage.fromEcrRepository(repo[, tag, imageType])
 * - WindowsBuildImage.fromAsset(parent, id, props, [, imageType])
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
class WindowsBuildImage {
    constructor(props) {
        this.defaultComputeType = ComputeType.MEDIUM;
        this.type = (props.imageType ?? WindowsImageType.STANDARD).toString();
        this.imageId = props.imageId;
        this.imagePullPrincipalType = props.imagePullPrincipalType;
        this.secretsManagerCredentials = props.secretsManagerCredentials;
        this.repository = props.repository;
    }
    /**
     * @returns a Windows build image from a Docker Hub image.
     */
    static fromDockerRegistry(name, options = {}, imageType = WindowsImageType.STANDARD) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_DockerImageOptions(options);
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_WindowsImageType(imageType);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromDockerRegistry);
            }
            throw error;
        }
        return new WindowsBuildImage({
            ...options,
            imageId: name,
            imagePullPrincipalType: ImagePullPrincipalType.SERVICE_ROLE,
            imageType,
        });
    }
    /**
     * @returns A Windows build image from an ECR repository.
     *
     * NOTE: if the repository is external (i.e. imported), then we won't be able to add
     * a resource policy statement for it so CodeBuild can pull the image.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-ecr.html
     *
     * @param repository The ECR repository
     * @param tagOrDigest Image tag or digest (default "latest", digests must start with `sha256:`)
     */
    static fromEcrRepository(repository, tagOrDigest = 'latest', imageType = WindowsImageType.STANDARD) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_WindowsImageType(imageType);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromEcrRepository);
            }
            throw error;
        }
        return new WindowsBuildImage({
            imageId: repository.repositoryUriForTagOrDigest(tagOrDigest),
            imagePullPrincipalType: ImagePullPrincipalType.SERVICE_ROLE,
            imageType,
            repository,
        });
    }
    /**
     * Uses an Docker image asset as a Windows build image.
     */
    static fromAsset(scope, id, props, imageType = WindowsImageType.STANDARD) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_WindowsImageType(imageType);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAsset);
            }
            throw error;
        }
        const asset = new aws_ecr_assets_1.DockerImageAsset(scope, id, props);
        return new WindowsBuildImage({
            imageId: asset.imageUri,
            imagePullPrincipalType: ImagePullPrincipalType.SERVICE_ROLE,
            imageType,
            repository: asset.repository,
        });
    }
    validate(buildEnvironment) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_BuildEnvironment(buildEnvironment);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.validate);
            }
            throw error;
        }
        const ret = [];
        if (buildEnvironment.computeType === ComputeType.SMALL) {
            ret.push('Windows images do not support the Small ComputeType');
        }
        return ret;
    }
    runScriptBuildspec(entrypoint) {
        return build_spec_1.BuildSpec.fromObject({
            version: '0.2',
            phases: {
                pre_build: {
                    // Would love to do downloading here and executing in the next step,
                    // but I don't know how to propagate the value of $TEMPDIR.
                    //
                    // Punting for someone who knows PowerShell well enough.
                    commands: [],
                },
                build: {
                    commands: [
                        'Set-Variable -Name TEMPDIR -Value (New-TemporaryFile).DirectoryName',
                        `aws s3 cp s3://$env:${run_script_linux_build_spec_1.S3_BUCKET_ENV}/$env:${run_script_linux_build_spec_1.S3_KEY_ENV} $TEMPDIR\\scripts.zip`,
                        'New-Item -ItemType Directory -Path $TEMPDIR\\scriptdir',
                        'Expand-Archive -Path $TEMPDIR/scripts.zip -DestinationPath $TEMPDIR\\scriptdir',
                        '$env:SCRIPT_DIR = "$TEMPDIR\\scriptdir"',
                        `& $TEMPDIR\\scriptdir\\${entrypoint}`,
                    ],
                },
            },
        });
    }
}
exports.WindowsBuildImage = WindowsBuildImage;
_c = JSII_RTTI_SYMBOL_1;
WindowsBuildImage[_c] = { fqn: "@aws-cdk/aws-codebuild.WindowsBuildImage", version: "0.0.0" };
/**
 * Corresponds to the standard CodeBuild image `aws/codebuild/windows-base:1.0`.
 *
 * @deprecated `WindowsBuildImage.WINDOWS_BASE_2_0` should be used instead.
 */
WindowsBuildImage.WIN_SERVER_CORE_2016_BASE = new WindowsBuildImage({
    imageId: 'aws/codebuild/windows-base:1.0',
    imagePullPrincipalType: ImagePullPrincipalType.CODEBUILD,
});
/**
 * The standard CodeBuild image `aws/codebuild/windows-base:2.0`, which is
 * based off Windows Server Core 2016.
 */
WindowsBuildImage.WINDOWS_BASE_2_0 = new WindowsBuildImage({
    imageId: 'aws/codebuild/windows-base:2.0',
    imagePullPrincipalType: ImagePullPrincipalType.CODEBUILD,
});
/**
 * The standard CodeBuild image `aws/codebuild/windows-base:2019-1.0`, which is
 * based off Windows Server Core 2019.
 */
WindowsBuildImage.WIN_SERVER_CORE_2019_BASE = new WindowsBuildImage({
    imageId: 'aws/codebuild/windows-base:2019-1.0',
    imagePullPrincipalType: ImagePullPrincipalType.CODEBUILD,
    imageType: WindowsImageType.SERVER_2019,
});
/**
 * The standard CodeBuild image `aws/codebuild/windows-base:2019-2.0`, which is
 * based off Windows Server Core 2019.
 */
WindowsBuildImage.WIN_SERVER_CORE_2019_BASE_2_0 = new WindowsBuildImage({
    imageId: 'aws/codebuild/windows-base:2019-2.0',
    imagePullPrincipalType: ImagePullPrincipalType.CODEBUILD,
    imageType: WindowsImageType.SERVER_2019,
});
var BuildEnvironmentVariableType;
(function (BuildEnvironmentVariableType) {
    /**
     * An environment variable in plaintext format.
     */
    BuildEnvironmentVariableType["PLAINTEXT"] = "PLAINTEXT";
    /**
     * An environment variable stored in Systems Manager Parameter Store.
     */
    BuildEnvironmentVariableType["PARAMETER_STORE"] = "PARAMETER_STORE";
    /**
     * An environment variable stored in AWS Secrets Manager.
     */
    BuildEnvironmentVariableType["SECRETS_MANAGER"] = "SECRETS_MANAGER";
})(BuildEnvironmentVariableType = exports.BuildEnvironmentVariableType || (exports.BuildEnvironmentVariableType = {}));
/**
 * The list of event types for AWS Codebuild
 * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-buildproject
 */
var ProjectNotificationEvents;
(function (ProjectNotificationEvents) {
    /**
     * Trigger notification when project build state failed
     */
    ProjectNotificationEvents["BUILD_FAILED"] = "codebuild-project-build-state-failed";
    /**
     * Trigger notification when project build state succeeded
     */
    ProjectNotificationEvents["BUILD_SUCCEEDED"] = "codebuild-project-build-state-succeeded";
    /**
     * Trigger notification when project build state in progress
     */
    ProjectNotificationEvents["BUILD_IN_PROGRESS"] = "codebuild-project-build-state-in-progress";
    /**
     * Trigger notification when project build state stopped
     */
    ProjectNotificationEvents["BUILD_STOPPED"] = "codebuild-project-build-state-stopped";
    /**
     * Trigger notification when project build phase failure
     */
    ProjectNotificationEvents["BUILD_PHASE_FAILED"] = "codebuild-project-build-phase-failure";
    /**
     * Trigger notification when project build phase success
     */
    ProjectNotificationEvents["BUILD_PHASE_SUCCEEDED"] = "codebuild-project-build-phase-success";
})(ProjectNotificationEvents = exports.ProjectNotificationEvents || (exports.ProjectNotificationEvents = {}));
function isBindableBuildImage(x) {
    return typeof x === 'object' && !!x && !!x.bind;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2plY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQXNEO0FBQ3RELG9FQUFvRTtBQUNwRSx3Q0FBd0M7QUFFeEMsNERBQWtGO0FBQ2xGLDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBR3hDLHdDQUE4SztBQUc5Syw2Q0FBeUM7QUFDekMsbUNBQWdDO0FBQ2hDLDZGQUF3RTtBQUN4RSwrREFBbUQ7QUFDbkQscUVBQWlFO0FBRWpFLGlEQUE2QztBQUM3QywyQ0FBdUM7QUFDdkMsdUZBQTJHO0FBRTNHLDZEQUE0RDtBQUU1RCxpREFBb0Y7QUFFcEYsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBZ04xRTs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFlLFdBQVksU0FBUSxlQUFRO0lBbUJ6Qzs7O09BR0c7SUFDSCxJQUFXLFdBQVc7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxtSEFBbUgsQ0FBQyxDQUFDO1NBQ3RJO1FBQ0QsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0tBQzFCO0lBRU0saUJBQWlCO1FBQ3RCLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQ7OztPQUdHO0lBQ0ksZUFBZSxDQUFDLFNBQThCO1FBQ25ELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDM0M7S0FDRjtJQUVEOzs7O09BSUc7SUFDSSxPQUFPLENBQUMsRUFBVSxFQUFFLFVBQWlDLEVBQUU7UUFDNUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFD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dURBQXVCLENBQUE7SUFFdkI7O09BRUc7SUFDSCxtRUFBbUMsQ0FBQTtJQUVuQzs7T0FFRztJQUNILG1FQUFtQyxDQUFBO0FBQ3JDLENBQUMsRUFmVyw0QkFBNEIsR0FBNUIsb0NBQTRCLEtBQTVCLG9DQUE0QixRQWV2QztBQUVEOzs7R0FHRztBQUNILElBQVkseUJBOEJYO0FBOUJELFdBQVkseUJBQXlCO0lBQ25DOztPQUVHO0lBQ0gsa0ZBQXFELENBQUE7SUFFckQ7O09BRUc7SUFDSCx3RkFBMkQsQ0FBQTtJQUUzRDs7T0FFRztJQUNILDRGQUErRCxDQUFBO0lBRS9EOztPQUVHO0lBQ0gsb0ZBQXVELENBQUE7SUFFdkQ7O09BRUc7SUFDSCx5RkFBNEQsQ0FBQTtJQUU1RDs7T0FFRztJQUNILDRGQUErRCxDQUFBO0FBQ2pFLENBQUMsRUE5QlcseUJBQXlCLEdBQXpCLGlDQUF5QixLQUF6QixpQ0FBeUIsUUE4QnBDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxDQUFVO0lBQ3RDLE9BQU8sT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFFLENBQVMsQ0FBQyxJQUFJLENBQUM7QUFDM0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgbm90aWZpY2F0aW9ucyBmcm9tICdAYXdzLWNkay9hd3MtY29kZXN0YXJub3RpZmljYXRpb25zJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjciBmcm9tICdAYXdzLWNkay9hd3MtZWNyJztcbmltcG9ydCB7IERvY2tlckltYWdlQXNzZXQsIERvY2tlckltYWdlQXNzZXRQcm9wcyB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3ItYXNzZXRzJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzZWNyZXRzbWFuYWdlciBmcm9tICdAYXdzLWNkay9hd3Mtc2VjcmV0c21hbmFnZXInO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBBd3MsIER1cmF0aW9uLCBJUmVzb3VyY2UsIExhenksIE5hbWVzLCBQaHlzaWNhbE5hbWUsIFJlZmVyZW5jZSwgUmVzb3VyY2UsIFNlY3JldFZhbHVlLCBTdGFjaywgVG9rZW4sIFRva2VuQ29tcGFyaXNvbiwgVG9rZW5pemF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElBcnRpZmFjdHMgfSBmcm9tICcuL2FydGlmYWN0cyc7XG5pbXBvcnQgeyBCdWlsZFNwZWMgfSBmcm9tICcuL2J1aWxkLXNwZWMnO1xuaW1wb3J0IHsgQ2FjaGUgfSBmcm9tICcuL2NhY2hlJztcbmltcG9ydCB7IENvZGVCdWlsZE1ldHJpY3MgfSBmcm9tICcuL2NvZGVidWlsZC1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQ2ZuUHJvamVjdCB9IGZyb20gJy4vY29kZWJ1aWxkLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBDb2RlUGlwZWxpbmVBcnRpZmFjdHMgfSBmcm9tICcuL2NvZGVwaXBlbGluZS1hcnRpZmFjdHMnO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW1Mb2NhdGlvbiB9IGZyb20gJy4vZmlsZS1sb2NhdGlvbic7XG5pbXBvcnQgeyBOb0FydGlmYWN0cyB9IGZyb20gJy4vbm8tYXJ0aWZhY3RzJztcbmltcG9ydCB7IE5vU291cmNlIH0gZnJvbSAnLi9uby1zb3VyY2UnO1xuaW1wb3J0IHsgcnVuU2NyaXB0TGludXhCdWlsZFNwZWMsIFMzX0JVQ0tFVF9FTlYsIFMzX0tFWV9FTlYgfSBmcm9tICcuL3ByaXZhdGUvcnVuLXNjcmlwdC1saW51eC1idWlsZC1zcGVjJztcbmltcG9ydCB7IExvZ2dpbmdPcHRpb25zIH0gZnJvbSAnLi9wcm9qZWN0LWxvZ3MnO1xuaW1wb3J0IHsgcmVuZGVyUmVwb3J0R3JvdXBBcm4gfSBmcm9tICcuL3JlcG9ydC1ncm91cC11dGlscyc7XG5pbXBvcnQgeyBJU291cmNlIH0gZnJvbSAnLi9zb3VyY2UnO1xuaW1wb3J0IHsgQ09ERVBJUEVMSU5FX1NPVVJDRV9BUlRJRkFDVFNfVFlQRSwgTk9fU09VUkNFX1RZUEUgfSBmcm9tICcuL3NvdXJjZS10eXBlcyc7XG5cbmNvbnN0IFZQQ19QT0xJQ1lfU1lNID0gU3ltYm9sLmZvcignQGF3cy1jZGsvYXdzLWNvZGVidWlsZC5yb2xlVnBjUG9saWN5Jyk7XG5cbi8qKlxuICogVGhlIHR5cGUgcmV0dXJuZWQgZnJvbSBgSVByb2plY3QjZW5hYmxlQmF0Y2hCdWlsZHNgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhdGNoQnVpbGRDb25maWcge1xuICAvKiogVGhlIElBTSBiYXRjaCBzZXJ2aWNlIFJvbGUgb2YgdGhpcyBQcm9qZWN0LiAqL1xuICByZWFkb25seSByb2xlOiBpYW0uSVJvbGU7XG59XG5cbi8qKlxuICogTG9jYXRpb24gb2YgYSBQRU0gY2VydGlmaWNhdGUgb24gUzNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCdWlsZEVudmlyb25tZW50Q2VydGlmaWNhdGUge1xuICAvKipcbiAgICogVGhlIGJ1Y2tldCB3aGVyZSB0aGUgY2VydGlmaWNhdGUgaXNcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldDogczMuSUJ1Y2tldDtcbiAgLyoqXG4gICAqIFRoZSBmdWxsIHBhdGggYW5kIG5hbWUgb2YgdGhlIGtleSBmaWxlXG4gICAqL1xuICByZWFkb25seSBvYmplY3RLZXk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBZGRpdGlvbmFsIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgbm90aWZpY2F0aW9uIHJ1bGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdE5vdGlmeU9uT3B0aW9ucyBleHRlbmRzIG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMge1xuICAvKipcbiAgICogQSBsaXN0IG9mIGV2ZW50IHR5cGVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIG5vdGlmaWNhdGlvbiBydWxlIGZvciBDb2RlQnVpbGQgUHJvamVjdC5cbiAgICogRm9yIGEgY29tcGxldGUgbGlzdCBvZiBldmVudCB0eXBlcyBhbmQgSURzLCBzZWUgTm90aWZpY2F0aW9uIGNvbmNlcHRzIGluIHRoZSBEZXZlbG9wZXIgVG9vbHMgQ29uc29sZSBVc2VyIEd1aWRlLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9kdGNvbnNvbGUvbGF0ZXN0L3VzZXJndWlkZS9jb25jZXB0cy5odG1sI2NvbmNlcHRzLWFwaVxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRzOiBQcm9qZWN0Tm90aWZpY2F0aW9uRXZlbnRzW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVByb2plY3QgZXh0ZW5kcyBJUmVzb3VyY2UsIGlhbS5JR3JhbnRhYmxlLCBlYzIuSUNvbm5lY3RhYmxlLCBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlU291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhpcyBQcm9qZWN0LlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBwcm9qZWN0QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBodW1hbi12aXNpYmxlIG5hbWUgb2YgdGhpcyBQcm9qZWN0LlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBwcm9qZWN0TmFtZTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgSUFNIHNlcnZpY2UgUm9sZSBvZiB0aGlzIFByb2plY3QuIFVuZGVmaW5lZCBmb3IgaW1wb3J0ZWQgUHJvamVjdHMuICovXG4gIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBiYXRjaCBidWlsZHMuXG4gICAqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IGNvbnRpbmluZyB0aGUgYmF0Y2ggc2VydmljZSByb2xlIGlmIGJhdGNoIGJ1aWxkc1xuICAgKiBjb3VsZCBiZSBlbmFibGVkLlxuICAgKi9cbiAgZW5hYmxlQmF0Y2hCdWlsZHMoKTogQmF0Y2hCdWlsZENvbmZpZyB8IHVuZGVmaW5lZDtcblxuICBhZGRUb1JvbGVQb2xpY3kocG9saWN5U3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KTogdm9pZDtcblxuICAvKipcbiAgICogRGVmaW5lcyBhIENsb3VkV2F0Y2ggZXZlbnQgcnVsZSB0cmlnZ2VyZWQgd2hlbiBzb21ldGhpbmcgaGFwcGVucyB3aXRoIHRoaXMgcHJvamVjdC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvc2FtcGxlLWJ1aWxkLW5vdGlmaWNhdGlvbnMuaHRtbFxuICAgKi9cbiAgb25FdmVudChpZDogc3RyaW5nLCBvcHRpb25zPzogZXZlbnRzLk9uRXZlbnRPcHRpb25zKTogZXZlbnRzLlJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDbG91ZFdhdGNoIGV2ZW50IHJ1bGUgdHJpZ2dlcmVkIHdoZW4gdGhlIGJ1aWxkIHByb2plY3Qgc3RhdGVcbiAgICogY2hhbmdlcy4gWW91IGNhbiBmaWx0ZXIgc3BlY2lmaWMgYnVpbGQgc3RhdHVzIGV2ZW50cyB1c2luZyBhbiBldmVudFxuICAgKiBwYXR0ZXJuIGZpbHRlciBvbiB0aGUgYGJ1aWxkLXN0YXR1c2AgZGV0YWlsIGZpZWxkOlxuICAgKlxuICAgKiAgICBjb25zdCBydWxlID0gcHJvamVjdC5vblN0YXRlQ2hhbmdlKCdPbkJ1aWxkU3RhcnRlZCcsIHsgdGFyZ2V0IH0pO1xuICAgKiAgICBydWxlLmFkZEV2ZW50UGF0dGVybih7XG4gICAqICAgICAgZGV0YWlsOiB7XG4gICAqICAgICAgICAnYnVpbGQtc3RhdHVzJzogW1xuICAgKiAgICAgICAgICBcIklOX1BST0dSRVNTXCIsXG4gICAqICAgICAgICAgIFwiU1VDQ0VFREVEXCIsXG4gICAqICAgICAgICAgIFwiRkFJTEVEXCIsXG4gICAqICAgICAgICAgIFwiU1RPUFBFRFwiXG4gICAqICAgICAgICBdXG4gICAqICAgICAgfVxuICAgKiAgICB9KTtcbiAgICpcbiAgICogWW91IGNhbiBhbHNvIHVzZSB0aGUgbWV0aG9kcyBgb25CdWlsZEZhaWxlZGAgYW5kIGBvbkJ1aWxkU3VjY2VlZGVkYCB0byBkZWZpbmUgcnVsZXMgZm9yXG4gICAqIHRoZXNlIHNwZWNpZmljIHN0YXRlIGNoYW5nZXMuXG4gICAqXG4gICAqIFRvIGFjY2VzcyBmaWVsZHMgZnJvbSB0aGUgZXZlbnQgaW4gdGhlIGV2ZW50IHRhcmdldCBpbnB1dCxcbiAgICogdXNlIHRoZSBzdGF0aWMgZmllbGRzIG9uIHRoZSBgU3RhdGVDaGFuZ2VFdmVudGAgY2xhc3MuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL3NhbXBsZS1idWlsZC1ub3RpZmljYXRpb25zLmh0bWxcbiAgICovXG4gIG9uU3RhdGVDaGFuZ2UoaWQ6IHN0cmluZywgb3B0aW9ucz86IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyk6IGV2ZW50cy5SdWxlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHRoYXQgdHJpZ2dlcnMgdXBvbiBwaGFzZSBjaGFuZ2Ugb2YgdGhpc1xuICAgKiBidWlsZCBwcm9qZWN0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9zYW1wbGUtYnVpbGQtbm90aWZpY2F0aW9ucy5odG1sXG4gICAqL1xuICBvblBoYXNlQ2hhbmdlKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBldmVudHMuT25FdmVudE9wdGlvbnMpOiBldmVudHMuUnVsZTtcblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYSBidWlsZCBzdGFydHMuXG4gICAqL1xuICBvbkJ1aWxkU3RhcnRlZChpZDogc3RyaW5nLCBvcHRpb25zPzogZXZlbnRzLk9uRXZlbnRPcHRpb25zKTogZXZlbnRzLlJ1bGU7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYW4gZXZlbnQgcnVsZSB3aGljaCB0cmlnZ2VycyB3aGVuIGEgYnVpbGQgZmFpbHMuXG4gICAqL1xuICBvbkJ1aWxkRmFpbGVkKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBldmVudHMuT25FdmVudE9wdGlvbnMpOiBldmVudHMuUnVsZTtcblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYSBidWlsZCBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LlxuICAgKi9cbiAgb25CdWlsZFN1Y2NlZWRlZChpZDogc3RyaW5nLCBvcHRpb25zPzogZXZlbnRzLk9uRXZlbnRPcHRpb25zKTogZXZlbnRzLlJ1bGU7XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIGEgQ2xvdWRXYXRjaCBtZXRyaWMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgYnVpbGQgcHJvamVjdC5cbiAgICogQHBhcmFtIG1ldHJpY05hbWUgVGhlIG5hbWUgb2YgdGhlIG1ldHJpY1xuICAgKiBAcGFyYW0gcHJvcHMgQ3VzdG9taXphdGlvbiBwcm9wZXJ0aWVzXG4gICAqL1xuICBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBNZWFzdXJlcyB0aGUgbnVtYmVyIG9mIGJ1aWxkcyB0cmlnZ2VyZWQuXG4gICAqXG4gICAqIFVuaXRzOiBDb3VudFxuICAgKlxuICAgKiBWYWxpZCBDbG91ZFdhdGNoIHN0YXRpc3RpY3M6IFN1bVxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG1ldHJpY0J1aWxkcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBNZWFzdXJlcyB0aGUgZHVyYXRpb24gb2YgYWxsIGJ1aWxkcyBvdmVyIHRpbWUuXG4gICAqXG4gICAqIFVuaXRzOiBTZWNvbmRzXG4gICAqXG4gICAqIFZhbGlkIENsb3VkV2F0Y2ggc3RhdGlzdGljczogQXZlcmFnZSAocmVjb21tZW5kZWQpLCBNYXhpbXVtLCBNaW5pbXVtXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG1ldHJpY0R1cmF0aW9uKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIE1lYXN1cmVzIHRoZSBudW1iZXIgb2Ygc3VjY2Vzc2Z1bCBidWlsZHMuXG4gICAqXG4gICAqIFVuaXRzOiBDb3VudFxuICAgKlxuICAgKiBWYWxpZCBDbG91ZFdhdGNoIHN0YXRpc3RpY3M6IFN1bVxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG1ldHJpY1N1Y2NlZWRlZEJ1aWxkcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBNZWFzdXJlcyB0aGUgbnVtYmVyIG9mIGJ1aWxkcyB0aGF0IGZhaWxlZCBiZWNhdXNlIG9mIGNsaWVudCBlcnJvciBvclxuICAgKiBiZWNhdXNlIG9mIGEgdGltZW91dC5cbiAgICpcbiAgICogVW5pdHM6IENvdW50XG4gICAqXG4gICAqIFZhbGlkIENsb3VkV2F0Y2ggc3RhdGlzdGljczogU3VtXG4gICAqXG4gICAqIEBkZWZhdWx0IHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgbWV0cmljRmFpbGVkQnVpbGRzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDb2RlU3RhciBOb3RpZmljYXRpb24gcnVsZSB0cmlnZ2VyZWQgd2hlbiB0aGUgcHJvamVjdFxuICAgKiBldmVudHMgZW1pdHRlZCBieSB5b3Ugc3BlY2lmaWVkLCBpdCB2ZXJ5IHNpbWlsYXIgdG8gYG9uRXZlbnRgIEFQSS5cbiAgICpcbiAgICogWW91IGNhbiBhbHNvIHVzZSB0aGUgbWV0aG9kcyBgbm90aWZ5T25CdWlsZFN1Y2NlZWRlZGAgYW5kXG4gICAqIGBub3RpZnlPbkJ1aWxkRmFpbGVkYCB0byBkZWZpbmUgcnVsZXMgZm9yIHRoZXNlIHNwZWNpZmljIGV2ZW50IGVtaXR0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBUaGUgbG9naWNhbCBpZGVudGlmaWVyIG9mIHRoZSBDb2RlU3RhciBOb3RpZmljYXRpb25zIHJ1bGUgdGhhdCB3aWxsIGJlIGNyZWF0ZWRcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHRvIHJlZ2lzdGVyIGZvciB0aGUgQ29kZVN0YXIgTm90aWZpY2F0aW9ucyBkZXN0aW5hdGlvbi5cbiAgICogQHBhcmFtIG9wdGlvbnMgQ3VzdG9taXphdGlvbiBvcHRpb25zIGZvciBDb2RlU3RhciBOb3RpZmljYXRpb25zIHJ1bGVcbiAgICogQHJldHVybnMgQ29kZVN0YXIgTm90aWZpY2F0aW9ucyBydWxlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGJ1aWxkIHByb2plY3QuXG4gICAqL1xuICBub3RpZnlPbihcbiAgICBpZDogc3RyaW5nLFxuICAgIHRhcmdldDogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZVRhcmdldCxcbiAgICBvcHRpb25zOiBQcm9qZWN0Tm90aWZ5T25PcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ29kZVN0YXIgbm90aWZpY2F0aW9uIHJ1bGUgd2hpY2ggdHJpZ2dlcnMgd2hlbiBhIGJ1aWxkIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gICAqL1xuICBub3RpZnlPbkJ1aWxkU3VjY2VlZGVkKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0LFxuICAgIG9wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ29kZVN0YXIgbm90aWZpY2F0aW9uIHJ1bGUgd2hpY2ggdHJpZ2dlcnMgd2hlbiBhIGJ1aWxkIGZhaWxzLlxuICAgKi9cbiAgbm90aWZ5T25CdWlsZEZhaWxlZChcbiAgICBpZDogc3RyaW5nLFxuICAgIHRhcmdldDogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZVRhcmdldCxcbiAgICBvcHRpb25zPzogbm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25SdWxlT3B0aW9ucyxcbiAgKTogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcmVmZXJlbmNlIHRvIGEgQ29kZUJ1aWxkIFByb2plY3QuXG4gKlxuICogSWYgeW91J3JlIG1hbmFnaW5nIHRoZSBQcm9qZWN0IGFsb25nc2lkZSB0aGUgcmVzdCBvZiB5b3VyIENESyByZXNvdXJjZXMsXG4gKiB1c2UgdGhlIGBQcm9qZWN0YCBjbGFzcy5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byByZWZlcmVuY2UgYW4gYWxyZWFkeSBleGlzdGluZyBQcm9qZWN0XG4gKiAob3Igb25lIGRlZmluZWQgaW4gYSBkaWZmZXJlbnQgQ0RLIFN0YWNrKSxcbiAqIHVzZSB0aGUgYGltcG9ydGAgbWV0aG9kLlxuICovXG5hYnN0cmFjdCBjbGFzcyBQcm9qZWN0QmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVByb2plY3Qge1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsO1xuXG4gIC8qKiBUaGUgQVJOIG9mIHRoaXMgUHJvamVjdC4gKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHByb2plY3RBcm46IHN0cmluZztcblxuICAvKiogVGhlIGh1bWFuLXZpc2libGUgbmFtZSBvZiB0aGlzIFByb2plY3QuICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBwcm9qZWN0TmFtZTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgSUFNIHNlcnZpY2UgUm9sZSBvZiB0aGlzIFByb2plY3QuICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBBY3R1YWwgY29ubmVjdGlvbnMgb2JqZWN0IGZvciB0aGlzIFByb2plY3QuXG4gICAqIE1heSBiZSB1bnNldCwgaW4gd2hpY2ggY2FzZSB0aGlzIFByb2plY3QgaXMgbm90IGNvbmZpZ3VyZWQgdG8gdXNlIGEgVlBDLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfY29ubmVjdGlvbnM6IGVjMi5Db25uZWN0aW9ucyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQWNjZXNzIHRoZSBDb25uZWN0aW9ucyBvYmplY3QuXG4gICAqIFdpbGwgZmFpbCBpZiB0aGlzIFByb2plY3QgZG9lcyBub3QgaGF2ZSBhIFZQQyBzZXQuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNvbm5lY3Rpb25zKCk6IGVjMi5Db25uZWN0aW9ucyB7XG4gICAgaWYgKCF0aGlzLl9jb25uZWN0aW9ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IFZQQy1hc3NvY2lhdGVkIFByb2plY3RzIGhhdmUgc2VjdXJpdHkgZ3JvdXBzIHRvIG1hbmFnZS4gU3VwcGx5IHRoZSBcInZwY1wiIHBhcmFtZXRlciB3aGVuIGNyZWF0aW5nIHRoZSBQcm9qZWN0Jyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBlbmFibGVCYXRjaEJ1aWxkcygpOiBCYXRjaEJ1aWxkQ29uZmlnIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHBlcm1pc3Npb24gb25seSBpZiB0aGVyZSdzIGEgcG9saWN5IGF0dGFjaGVkLlxuICAgKiBAcGFyYW0gc3RhdGVtZW50IFRoZSBwZXJtaXNzaW9ucyBzdGF0ZW1lbnQgdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkVG9Sb2xlUG9saWN5KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCkge1xuICAgIGlmICh0aGlzLnJvbGUpIHtcbiAgICAgIHRoaXMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHRyaWdnZXJlZCB3aGVuIHNvbWV0aGluZyBoYXBwZW5zIHdpdGggdGhpcyBwcm9qZWN0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9zYW1wbGUtYnVpbGQtbm90aWZpY2F0aW9ucy5odG1sXG4gICAqL1xuICBwdWJsaWMgb25FdmVudChpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSk6IGV2ZW50cy5SdWxlIHtcbiAgICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHRoaXMsIGlkLCBvcHRpb25zKTtcbiAgICBydWxlLmFkZFRhcmdldChvcHRpb25zLnRhcmdldCk7XG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oe1xuICAgICAgc291cmNlOiBbJ2F3cy5jb2RlYnVpbGQnXSxcbiAgICAgIGRldGFpbDoge1xuICAgICAgICAncHJvamVjdC1uYW1lJzogW3RoaXMucHJvamVjdE5hbWVdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgQ2xvdWRXYXRjaCBldmVudCBydWxlIHRyaWdnZXJlZCB3aGVuIHRoZSBidWlsZCBwcm9qZWN0IHN0YXRlXG4gICAqIGNoYW5nZXMuIFlvdSBjYW4gZmlsdGVyIHNwZWNpZmljIGJ1aWxkIHN0YXR1cyBldmVudHMgdXNpbmcgYW4gZXZlbnRcbiAgICogcGF0dGVybiBmaWx0ZXIgb24gdGhlIGBidWlsZC1zdGF0dXNgIGRldGFpbCBmaWVsZDpcbiAgICpcbiAgICogICAgY29uc3QgcnVsZSA9IHByb2plY3Qub25TdGF0ZUNoYW5nZSgnT25CdWlsZFN0YXJ0ZWQnLCB7IHRhcmdldCB9KTtcbiAgICogICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oe1xuICAgKiAgICAgIGRldGFpbDoge1xuICAgKiAgICAgICAgJ2J1aWxkLXN0YXR1cyc6IFtcbiAgICogICAgICAgICAgXCJJTl9QUk9HUkVTU1wiLFxuICAgKiAgICAgICAgICBcIlNVQ0NFRURFRFwiLFxuICAgKiAgICAgICAgICBcIkZBSUxFRFwiLFxuICAgKiAgICAgICAgICBcIlNUT1BQRURcIlxuICAgKiAgICAgICAgXVxuICAgKiAgICAgIH1cbiAgICogICAgfSk7XG4gICAqXG4gICAqIFlvdSBjYW4gYWxzbyB1c2UgdGhlIG1ldGhvZHMgYG9uQnVpbGRGYWlsZWRgIGFuZCBgb25CdWlsZFN1Y2NlZWRlZGAgdG8gZGVmaW5lIHJ1bGVzIGZvclxuICAgKiB0aGVzZSBzcGVjaWZpYyBzdGF0ZSBjaGFuZ2VzLlxuICAgKlxuICAgKiBUbyBhY2Nlc3MgZmllbGRzIGZyb20gdGhlIGV2ZW50IGluIHRoZSBldmVudCB0YXJnZXQgaW5wdXQsXG4gICAqIHVzZSB0aGUgc3RhdGljIGZpZWxkcyBvbiB0aGUgYFN0YXRlQ2hhbmdlRXZlbnRgIGNsYXNzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9zYW1wbGUtYnVpbGQtbm90aWZpY2F0aW9ucy5odG1sXG4gICAqL1xuICBwdWJsaWMgb25TdGF0ZUNoYW5nZShpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHJ1bGUgPSB0aGlzLm9uRXZlbnQoaWQsIG9wdGlvbnMpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIGRldGFpbFR5cGU6IFsnQ29kZUJ1aWxkIEJ1aWxkIFN0YXRlIENoYW5nZSddLFxuICAgIH0pO1xuICAgIHJldHVybiBydWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDbG91ZFdhdGNoIGV2ZW50IHJ1bGUgdGhhdCB0cmlnZ2VycyB1cG9uIHBoYXNlIGNoYW5nZSBvZiB0aGlzXG4gICAqIGJ1aWxkIHByb2plY3QuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL3NhbXBsZS1idWlsZC1ub3RpZmljYXRpb25zLmh0bWxcbiAgICovXG4gIHB1YmxpYyBvblBoYXNlQ2hhbmdlKGlkOiBzdHJpbmcsIG9wdGlvbnM6IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgcnVsZSA9IHRoaXMub25FdmVudChpZCwgb3B0aW9ucyk7XG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oe1xuICAgICAgZGV0YWlsVHlwZTogWydDb2RlQnVpbGQgQnVpbGQgUGhhc2UgQ2hhbmdlJ10sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYSBidWlsZCBzdGFydHMuXG4gICAqXG4gICAqIFRvIGFjY2VzcyBmaWVsZHMgZnJvbSB0aGUgZXZlbnQgaW4gdGhlIGV2ZW50IHRhcmdldCBpbnB1dCxcbiAgICogdXNlIHRoZSBzdGF0aWMgZmllbGRzIG9uIHRoZSBgU3RhdGVDaGFuZ2VFdmVudGAgY2xhc3MuXG4gICAqL1xuICBwdWJsaWMgb25CdWlsZFN0YXJ0ZWQoaWQ6IHN0cmluZywgb3B0aW9uczogZXZlbnRzLk9uRXZlbnRPcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBydWxlID0gdGhpcy5vblN0YXRlQ2hhbmdlKGlkLCBvcHRpb25zKTtcbiAgICBydWxlLmFkZEV2ZW50UGF0dGVybih7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgJ2J1aWxkLXN0YXR1cyc6IFsnSU5fUFJPR1JFU1MnXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhbiBldmVudCBydWxlIHdoaWNoIHRyaWdnZXJzIHdoZW4gYSBidWlsZCBmYWlscy5cbiAgICpcbiAgICogVG8gYWNjZXNzIGZpZWxkcyBmcm9tIHRoZSBldmVudCBpbiB0aGUgZXZlbnQgdGFyZ2V0IGlucHV0LFxuICAgKiB1c2UgdGhlIHN0YXRpYyBmaWVsZHMgb24gdGhlIGBTdGF0ZUNoYW5nZUV2ZW50YCBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBvbkJ1aWxkRmFpbGVkKGlkOiBzdHJpbmcsIG9wdGlvbnM6IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgcnVsZSA9IHRoaXMub25TdGF0ZUNoYW5nZShpZCwgb3B0aW9ucyk7XG4gICAgcnVsZS5hZGRFdmVudFBhdHRlcm4oe1xuICAgICAgZGV0YWlsOiB7XG4gICAgICAgICdidWlsZC1zdGF0dXMnOiBbJ0ZBSUxFRCddLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIGV2ZW50IHJ1bGUgd2hpY2ggdHJpZ2dlcnMgd2hlbiBhIGJ1aWxkIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gICAqXG4gICAqIFRvIGFjY2VzcyBmaWVsZHMgZnJvbSB0aGUgZXZlbnQgaW4gdGhlIGV2ZW50IHRhcmdldCBpbnB1dCxcbiAgICogdXNlIHRoZSBzdGF0aWMgZmllbGRzIG9uIHRoZSBgU3RhdGVDaGFuZ2VFdmVudGAgY2xhc3MuXG4gICAqL1xuICBwdWJsaWMgb25CdWlsZFN1Y2NlZWRlZChpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHJ1bGUgPSB0aGlzLm9uU3RhdGVDaGFuZ2UoaWQsIG9wdGlvbnMpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIGRldGFpbDoge1xuICAgICAgICAnYnVpbGQtc3RhdHVzJzogWydTVUNDRUVERUQnXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYSBDbG91ZFdhdGNoIG1ldHJpYyBhc3NvY2lhdGVkIHdpdGggdGhpcyBidWlsZCBwcm9qZWN0LlxuICAgKiBAcGFyYW0gbWV0cmljTmFtZSBUaGUgbmFtZSBvZiB0aGUgbWV0cmljXG4gICAqIEBwYXJhbSBwcm9wcyBDdXN0b21pemF0aW9uIHByb3BlcnRpZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0NvZGVCdWlsZCcsXG4gICAgICBtZXRyaWNOYW1lLFxuICAgICAgZGltZW5zaW9uc01hcDogeyBQcm9qZWN0TmFtZTogdGhpcy5wcm9qZWN0TmFtZSB9LFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogTWVhc3VyZXMgdGhlIG51bWJlciBvZiBidWlsZHMgdHJpZ2dlcmVkLlxuICAgKlxuICAgKiBVbml0czogQ291bnRcbiAgICpcbiAgICogVmFsaWQgQ2xvdWRXYXRjaCBzdGF0aXN0aWNzOiBTdW1cbiAgICpcbiAgICogQGRlZmF1bHQgc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljQnVpbGRzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhDb2RlQnVpbGRNZXRyaWNzLmJ1aWxkc1N1bSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lYXN1cmVzIHRoZSBkdXJhdGlvbiBvZiBhbGwgYnVpbGRzIG92ZXIgdGltZS5cbiAgICpcbiAgICogVW5pdHM6IFNlY29uZHNcbiAgICpcbiAgICogVmFsaWQgQ2xvdWRXYXRjaCBzdGF0aXN0aWNzOiBBdmVyYWdlIChyZWNvbW1lbmRlZCksIE1heGltdW0sIE1pbmltdW1cbiAgICpcbiAgICogQGRlZmF1bHQgYXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0R1cmF0aW9uKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhDb2RlQnVpbGRNZXRyaWNzLmR1cmF0aW9uQXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lYXN1cmVzIHRoZSBudW1iZXIgb2Ygc3VjY2Vzc2Z1bCBidWlsZHMuXG4gICAqXG4gICAqIFVuaXRzOiBDb3VudFxuICAgKlxuICAgKiBWYWxpZCBDbG91ZFdhdGNoIHN0YXRpc3RpY3M6IFN1bVxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNTdWNjZWVkZWRCdWlsZHMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKENvZGVCdWlsZE1ldHJpY3Muc3VjY2VlZGVkQnVpbGRzU3VtLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWVhc3VyZXMgdGhlIG51bWJlciBvZiBidWlsZHMgdGhhdCBmYWlsZWQgYmVjYXVzZSBvZiBjbGllbnQgZXJyb3Igb3JcbiAgICogYmVjYXVzZSBvZiBhIHRpbWVvdXQuXG4gICAqXG4gICAqIFVuaXRzOiBDb3VudFxuICAgKlxuICAgKiBWYWxpZCBDbG91ZFdhdGNoIHN0YXRpc3RpY3M6IFN1bVxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNGYWlsZWRCdWlsZHMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKENvZGVCdWlsZE1ldHJpY3MuZmFpbGVkQnVpbGRzU3VtLCBwcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5T24oXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9uczogUHJvamVjdE5vdGlmeU9uT3B0aW9ucyxcbiAgKTogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZSB7XG4gICAgcmV0dXJuIG5ldyBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUodGhpcywgaWQsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICB0YXJnZXRzOiBbdGFyZ2V0XSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBub3RpZnlPbkJ1aWxkU3VjY2VlZGVkKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0LFxuICAgIG9wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlIHtcbiAgICByZXR1cm4gdGhpcy5ub3RpZnlPbihpZCwgdGFyZ2V0LCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZXZlbnRzOiBbUHJvamVjdE5vdGlmaWNhdGlvbkV2ZW50cy5CVUlMRF9TVUNDRUVERURdLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5vdGlmeU9uQnVpbGRGYWlsZWQoXG4gICAgaWQ6IHN0cmluZyxcbiAgICB0YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGUge1xuICAgIHJldHVybiB0aGlzLm5vdGlmeU9uKGlkLCB0YXJnZXQsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBldmVudHM6IFtQcm9qZWN0Tm90aWZpY2F0aW9uRXZlbnRzLkJVSUxEX0ZBSUxFRF0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYmluZEFzTm90aWZpY2F0aW9uUnVsZVNvdXJjZShfc2NvcGU6IENvbnN0cnVjdCk6IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZVNvdXJjZUNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZUFybjogdGhpcy5wcm9qZWN0QXJuLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGNhbm5lZE1ldHJpYyhcbiAgICBmbjogKGRpbXM6IHsgUHJvamVjdE5hbWU6IHN0cmluZyB9KSA9PiBjbG91ZHdhdGNoLk1ldHJpY1Byb3BzLFxuICAgIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgLi4uZm4oeyBQcm9qZWN0TmFtZTogdGhpcy5wcm9qZWN0TmFtZSB9KSxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbW9uUHJvamVjdFByb3BzIHtcbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIHByb2plY3QuIFVzZSB0aGUgZGVzY3JpcHRpb24gdG8gaWRlbnRpZnkgdGhlIHB1cnBvc2VcbiAgICogb2YgdGhlIHByb2plY3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogRmlsZW5hbWUgb3IgY29udGVudHMgb2YgYnVpbGRzcGVjIGluIEpTT04gZm9ybWF0LlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1zcGVjLXJlZi5odG1sI2J1aWxkLXNwZWMtcmVmLWV4YW1wbGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFbXB0eSBidWlsZHNwZWMuXG4gICAqL1xuICByZWFkb25seSBidWlsZFNwZWM/OiBCdWlsZFNwZWM7XG5cbiAgLyoqXG4gICAqIFNlcnZpY2UgUm9sZSB0byBhc3N1bWUgd2hpbGUgcnVubmluZyB0aGUgYnVpbGQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSByb2xlIHdpbGwgYmUgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIEVuY3J5cHRpb24ga2V5IHRvIHVzZSB0byByZWFkIGFuZCB3cml0ZSBhcnRpZmFjdHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIEFXUy1tYW5hZ2VkIENNSyBmb3IgQW1hem9uIFNpbXBsZSBTdG9yYWdlIFNlcnZpY2UgKEFtYXpvbiBTMykgaXMgdXNlZC5cbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcblxuICAvKipcbiAgICogQ2FjaGluZyBzdHJhdGVneSB0byB1c2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IENhY2hlLm5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGNhY2hlPzogQ2FjaGU7XG5cbiAgLyoqXG4gICAqIEJ1aWxkIGVudmlyb25tZW50IHRvIHVzZSBmb3IgdGhlIGJ1aWxkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBCdWlsZEVudmlyb25tZW50LkxpbnV4QnVpbGRJbWFnZS5TVEFOREFSRF8xXzBcbiAgICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50PzogQnVpbGRFbnZpcm9ubWVudDtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgQVdTIENvZGVCdWlsZCBnZW5lcmF0ZXMgYSBwdWJsaWNseSBhY2Nlc3NpYmxlIFVSTCBmb3JcbiAgICogeW91ciBwcm9qZWN0J3MgYnVpbGQgYmFkZ2UuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgQnVpbGQgQmFkZ2VzIFNhbXBsZVxuICAgKiBpbiB0aGUgQVdTIENvZGVCdWlsZCBVc2VyIEd1aWRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYmFkZ2U/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIG1pbnV0ZXMgYWZ0ZXIgd2hpY2ggQVdTIENvZGVCdWlsZCBzdG9wcyB0aGUgYnVpbGQgaWYgaXQnc1xuICAgKiBub3QgY29tcGxldGUuIEZvciB2YWxpZCB2YWx1ZXMsIHNlZSB0aGUgdGltZW91dEluTWludXRlcyBmaWVsZCBpbiB0aGUgQVdTXG4gICAqIENvZGVCdWlsZCBVc2VyIEd1aWRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5ob3VycygxKVxuICAgKi9cbiAgcmVhZG9ubHkgdGltZW91dD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBhZGQgdG8gdGhlIGJ1aWxkIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGFkZGl0aW9uYWwgZW52aXJvbm1lbnQgdmFyaWFibGVzIGFyZSBzcGVjaWZpZWQuXG4gICAqL1xuICByZWFkb25seSBlbnZpcm9ubWVudFZhcmlhYmxlcz86IHsgW25hbWU6IHN0cmluZ106IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZSB9O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNoZWNrIGZvciB0aGUgcHJlc2VuY2Ugb2YgYW55IHNlY3JldHMgaW4gdGhlIGVudmlyb25tZW50IHZhcmlhYmxlcyBvZiB0aGUgZGVmYXVsdCB0eXBlLCBCdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlBMQUlOVEVYVC5cbiAgICogU2luY2UgdXNpbmcgYSBzZWNyZXQgZm9yIHRoZSB2YWx1ZSBvZiB0aGF0IGtpbmQgb2YgdmFyaWFibGUgd291bGQgcmVzdWx0IGluIGl0IGJlaW5nIGRpc3BsYXllZCBpbiBwbGFpbiB0ZXh0IGluIHRoZSBBV1MgQ29uc29sZSxcbiAgICogdGhlIGNvbnN0cnVjdCB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBpdCBkZXRlY3RzIGEgc2VjcmV0IHdhcyBwYXNzZWQgdGhlcmUuXG4gICAqIFBhc3MgdGhpcyBwcm9wZXJ0eSBhcyBmYWxzZSBpZiB5b3Ugd2FudCB0byBza2lwIHRoaXMgdmFsaWRhdGlvbixcbiAgICogYW5kIGtlZXAgdXNpbmcgYSBzZWNyZXQgaW4gYSBwbGFpbiB0ZXh0IGVudmlyb25tZW50IHZhcmlhYmxlLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBjaGVja1NlY3JldHNJblBsYWluVGV4dEVudlZhcmlhYmxlcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCwgaHVtYW4tcmVhZGFibGUgbmFtZSBvZiB0aGUgQ29kZUJ1aWxkIFByb2plY3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTmFtZSBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IHByb2plY3ROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBWUEMgbmV0d29yayB0byBwbGFjZSBjb2RlYnVpbGQgbmV0d29yayBpbnRlcmZhY2VzXG4gICAqXG4gICAqIFNwZWNpZnkgdGhpcyBpZiB0aGUgY29kZWJ1aWxkIHByb2plY3QgbmVlZHMgdG8gYWNjZXNzIHJlc291cmNlcyBpbiBhIFZQQy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBWUEMgaXMgc3BlY2lmaWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRvIHBsYWNlIHRoZSBuZXR3b3JrIGludGVyZmFjZXMgd2l0aGluIHRoZSBWUEMuXG4gICAqXG4gICAqIE9ubHkgdXNlZCBpZiAndnBjJyBpcyBzdXBwbGllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBbGwgcHJpdmF0ZSBzdWJuZXRzLlxuICAgKi9cbiAgcmVhZG9ubHkgc3VibmV0U2VsZWN0aW9uPzogZWMyLlN1Ym5ldFNlbGVjdGlvbjtcblxuICAvKipcbiAgICogV2hhdCBzZWN1cml0eSBncm91cCB0byBhc3NvY2lhdGUgd2l0aCB0aGUgY29kZWJ1aWxkIHByb2plY3QncyBuZXR3b3JrIGludGVyZmFjZXMuXG4gICAqIElmIG5vIHNlY3VyaXR5IGdyb3VwIGlzIGlkZW50aWZpZWQsIG9uZSB3aWxsIGJlIGNyZWF0ZWQgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogT25seSB1c2VkIGlmICd2cGMnIGlzIHN1cHBsaWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFNlY3VyaXR5IGdyb3VwIHdpbGwgYmUgYXV0b21hdGljYWxseSBjcmVhdGVkLlxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM/OiBlYzIuSVNlY3VyaXR5R3JvdXBbXTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBhbGxvdyB0aGUgQ29kZUJ1aWxkIHRvIHNlbmQgYWxsIG5ldHdvcmsgdHJhZmZpY1xuICAgKlxuICAgKiBJZiBzZXQgdG8gZmFsc2UsIHlvdSBtdXN0IGluZGl2aWR1YWxseSBhZGQgdHJhZmZpYyBydWxlcyB0byBhbGxvdyB0aGVcbiAgICogQ29kZUJ1aWxkIHByb2plY3QgdG8gY29ubmVjdCB0byBuZXR3b3JrIHRhcmdldHMuXG4gICAqXG4gICAqIE9ubHkgdXNlZCBpZiAndnBjJyBpcyBzdXBwbGllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dBbGxPdXRib3VuZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFuICBQcm9qZWN0RmlsZVN5c3RlbUxvY2F0aW9uIG9iamVjdHMgZm9yIGEgQ29kZUJ1aWxkIGJ1aWxkIHByb2plY3QuXG4gICAqXG4gICAqIEEgUHJvamVjdEZpbGVTeXN0ZW1Mb2NhdGlvbiBvYmplY3Qgc3BlY2lmaWVzIHRoZSBpZGVudGlmaWVyLCBsb2NhdGlvbiwgbW91bnRPcHRpb25zLCBtb3VudFBvaW50LFxuICAgKiBhbmQgdHlwZSBvZiBhIGZpbGUgc3lzdGVtIGNyZWF0ZWQgdXNpbmcgQW1hem9uIEVsYXN0aWMgRmlsZSBTeXN0ZW0uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZmlsZSBzeXN0ZW0gbG9jYXRpb25zXG4gICAqL1xuICByZWFkb25seSBmaWxlU3lzdGVtTG9jYXRpb25zPzogSUZpbGVTeXN0ZW1Mb2NhdGlvbltdO1xuXG4gIC8qKlxuICAgKiBBZGQgcGVybWlzc2lvbnMgdG8gdGhpcyBwcm9qZWN0J3Mgcm9sZSB0byBjcmVhdGUgYW5kIHVzZSB0ZXN0IHJlcG9ydCBncm91cHMgd2l0aCBuYW1lIHN0YXJ0aW5nIHdpdGggdGhlIG5hbWUgb2YgdGhpcyBwcm9qZWN0LlxuICAgKlxuICAgKiBUaGF0IGlzIHRoZSBzdGFuZGFyZCByZXBvcnQgZ3JvdXAgdGhhdCBnZXRzIGNyZWF0ZWQgd2hlbiBhIHNpbXBsZSBuYW1lXG4gICAqIChpbiBjb250cmFzdCB0byBhbiBBUk4pXG4gICAqIGlzIHVzZWQgaW4gdGhlICdyZXBvcnRzJyBzZWN0aW9uIG9mIHRoZSBidWlsZHNwZWMgb2YgdGhpcyBwcm9qZWN0LlxuICAgKiBUaGlzIGlzIHVzdWFsbHkgaGFybWxlc3MsIGJ1dCB5b3UgY2FuIHR1cm4gdGhlc2Ugb2ZmIGlmIHlvdSBkb24ndCBwbGFuIG9uIHVzaW5nIHRlc3RcbiAgICogcmVwb3J0cyBpbiB0aGlzIHByb2plY3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvdGVzdC1yZXBvcnQtZ3JvdXAtbmFtaW5nLmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IGdyYW50UmVwb3J0R3JvdXBQZXJtaXNzaW9ucz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IGxvZ3MgZm9yIHRoZSBidWlsZCBwcm9qZWN0LiBBIHByb2plY3QgY2FuIGNyZWF0ZSBsb2dzIGluIEFtYXpvbiBDbG91ZFdhdGNoIExvZ3MsIGFuIFMzIGJ1Y2tldCwgb3IgYm90aC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBsb2cgY29uZmlndXJhdGlvbiBpcyBzZXRcbiAgICovXG4gIHJlYWRvbmx5IGxvZ2dpbmc/OiBMb2dnaW5nT3B0aW9ucztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBtaW51dGVzIGFmdGVyIHdoaWNoIEFXUyBDb2RlQnVpbGQgc3RvcHMgdGhlIGJ1aWxkIGlmIGl0J3NcbiAgICogc3RpbGwgaW4gcXVldWUuIEZvciB2YWxpZCB2YWx1ZXMsIHNlZSB0aGUgdGltZW91dEluTWludXRlcyBmaWVsZCBpbiB0aGUgQVdTXG4gICAqIENvZGVCdWlsZCBVc2VyIEd1aWRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHF1ZXVlIHRpbWVvdXQgaXMgc2V0XG4gICAqL1xuICByZWFkb25seSBxdWV1ZWRUaW1lb3V0PzogRHVyYXRpb25cblxuICAvKipcbiAgICogTWF4aW11bSBudW1iZXIgb2YgY29uY3VycmVudCBidWlsZHMuIE1pbmltdW0gdmFsdWUgaXMgMSBhbmQgbWF4aW11bSBpcyBhY2NvdW50IGJ1aWxkIGxpbWl0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGV4cGxpY2l0IGxpbWl0IGlzIHNldFxuICAgKi9cbiAgcmVhZG9ubHkgY29uY3VycmVudEJ1aWxkTGltaXQ/OiBudW1iZXJcblxuICAvKipcbiAgICogQWRkIHRoZSBwZXJtaXNzaW9ucyBuZWNlc3NhcnkgZm9yIGRlYnVnZ2luZyBidWlsZHMgd2l0aCBTU00gU2Vzc2lvbiBNYW5hZ2VyXG4gICAqXG4gICAqIElmIHRoZSBmb2xsb3dpbmcgcHJlcmVxdWlzaXRlcyBoYXZlIGJlZW4gbWV0OlxuICAgKlxuICAgKiAtIFRoZSBuZWNlc3NhcnkgcGVybWlzc2lvbnMgaGF2ZSBiZWVuIGFkZGVkIGJ5IHNldHRpbmcgdGhpcyBmbGFnIHRvIHRydWUuXG4gICAqIC0gVGhlIGJ1aWxkIGltYWdlIGhhcyB0aGUgU1NNIGFnZW50IGluc3RhbGxlZCAodHJ1ZSBmb3IgZGVmYXVsdCBDb2RlQnVpbGQgaW1hZ2VzKS5cbiAgICogLSBUaGUgYnVpbGQgaXMgc3RhcnRlZCB3aXRoIFtkZWJ1Z1Nlc3Npb25FbmFibGVkXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX1N0YXJ0QnVpbGQuaHRtbCNDb2RlQnVpbGQtU3RhcnRCdWlsZC1yZXF1ZXN0LWRlYnVnU2Vzc2lvbkVuYWJsZWQpIHNldCB0byB0cnVlLlxuICAgKlxuICAgKiBUaGVuIHRoZSBidWlsZCBjb250YWluZXIgY2FuIGJlIHBhdXNlZCBhbmQgaW5zcGVjdGVkIHVzaW5nIFNlc3Npb24gTWFuYWdlclxuICAgKiBieSBpbnZva2luZyB0aGUgYGNvZGVidWlsZC1icmVha3BvaW50YCBjb21tYW5kIHNvbWV3aGVyZSBkdXJpbmcgdGhlIGJ1aWxkLlxuICAgKlxuICAgKiBgY29kZWJ1aWxkLWJyZWFrcG9pbnRgIGNvbW1hbmRzIHdpbGwgYmUgaWdub3JlZCBpZiB0aGUgYnVpbGQgaXMgbm90IHN0YXJ0ZWRcbiAgICogd2l0aCBgZGVidWdTZXNzaW9uRW5hYmxlZD10cnVlYC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvc2Vzc2lvbi1tYW5hZ2VyLmh0bWxcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHNzbVNlc3Npb25QZXJtaXNzaW9ucz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdFByb3BzIGV4dGVuZHMgQ29tbW9uUHJvamVjdFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBzb3VyY2Ugb2YgdGhlIGJ1aWxkLlxuICAgKiAqTm90ZSo6IGlmIGBOb1NvdXJjZWAgaXMgZ2l2ZW4gYXMgdGhlIHNvdXJjZSxcbiAgICogdGhlbiB5b3UgbmVlZCB0byBwcm92aWRlIGFuIGV4cGxpY2l0IGBidWlsZFNwZWNgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vU291cmNlXG4gICAqL1xuICByZWFkb25seSBzb3VyY2U/OiBJU291cmNlO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHdoZXJlIGJ1aWxkIGFydGlmYWN0cyB3aWxsIGJlIHN0b3JlZC5cbiAgICogQ291bGQgYmU6IFBpcGVsaW5lQnVpbGRBcnRpZmFjdHMsIE5vQXJ0aWZhY3RzIGFuZCBTM0FydGlmYWN0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgTm9BcnRpZmFjdHNcbiAgICovXG4gIHJlYWRvbmx5IGFydGlmYWN0cz86IElBcnRpZmFjdHM7XG5cbiAgLyoqXG4gICAqIFRoZSBzZWNvbmRhcnkgc291cmNlcyBmb3IgdGhlIFByb2plY3QuXG4gICAqIENhbiBiZSBhbHNvIGFkZGVkIGFmdGVyIHRoZSBQcm9qZWN0IGhhcyBiZWVuIGNyZWF0ZWQgYnkgdXNpbmcgdGhlIGBQcm9qZWN0I2FkZFNlY29uZGFyeVNvdXJjZWAgbWV0aG9kLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHNlY29uZGFyeSBzb3VyY2VzLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9zYW1wbGUtbXVsdGktaW4tb3V0Lmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IHNlY29uZGFyeVNvdXJjZXM/OiBJU291cmNlW107XG5cbiAgLyoqXG4gICAqIFRoZSBzZWNvbmRhcnkgYXJ0aWZhY3RzIGZvciB0aGUgUHJvamVjdC5cbiAgICogQ2FuIGFsc28gYmUgYWRkZWQgYWZ0ZXIgdGhlIFByb2plY3QgaGFzIGJlZW4gY3JlYXRlZCBieSB1c2luZyB0aGUgYFByb2plY3QjYWRkU2Vjb25kYXJ5QXJ0aWZhY3RgIG1ldGhvZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzZWNvbmRhcnkgYXJ0aWZhY3RzLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9zYW1wbGUtbXVsdGktaW4tb3V0Lmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IHNlY29uZGFyeUFydGlmYWN0cz86IElBcnRpZmFjdHNbXTtcbn1cblxuLyoqXG4gKiBUaGUgZXh0cmEgb3B0aW9ucyBwYXNzZWQgdG8gdGhlIGBJUHJvamVjdC5iaW5kVG9Db2RlUGlwZWxpbmVgIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCaW5kVG9Db2RlUGlwZWxpbmVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBhcnRpZmFjdCBidWNrZXQgdGhhdCB3aWxsIGJlIHVzZWQgYnkgdGhlIGFjdGlvbiB0aGF0IGludm9rZXMgdGhpcyBwcm9qZWN0LlxuICAgKi9cbiAgcmVhZG9ubHkgYXJ0aWZhY3RCdWNrZXQ6IHMzLklCdWNrZXQ7XG59XG5cbi8qKlxuICogQSByZXByZXNlbnRhdGlvbiBvZiBhIENvZGVCdWlsZCBQcm9qZWN0LlxuICovXG5leHBvcnQgY2xhc3MgUHJvamVjdCBleHRlbmRzIFByb2plY3RCYXNlIHtcblxuICBwdWJsaWMgc3RhdGljIGZyb21Qcm9qZWN0QXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb2plY3RBcm46IHN0cmluZyk6IElQcm9qZWN0IHtcbiAgICBjb25zdCBwYXJzZWRBcm4gPSBTdGFjay5vZihzY29wZSkuc3BsaXRBcm4ocHJvamVjdEFybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUHJvamVjdEJhc2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwcm9qZWN0QXJuID0gcHJvamVjdEFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwcm9qZWN0TmFtZSA9IHBhcnNlZEFybi5yZXNvdXJjZU5hbWUhO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJvbGU/OiBpYW0uUm9sZSA9IHVuZGVmaW5lZDtcblxuICAgICAgY29uc3RydWN0b3IoczogQ29uc3RydWN0LCBpOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIocywgaSwge1xuICAgICAgICAgIGFjY291bnQ6IHBhcnNlZEFybi5hY2NvdW50LFxuICAgICAgICAgIHJlZ2lvbjogcGFyc2VkQXJuLnJlZ2lvbixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZ3JhbnRQcmluY2lwYWwgPSBuZXcgaWFtLlVua25vd25QcmluY2lwYWwoeyByZXNvdXJjZTogdGhpcyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhIFByb2plY3QgZGVmaW5lZCBlaXRoZXIgb3V0c2lkZSB0aGUgQ0RLLFxuICAgKiBvciBpbiBhIGRpZmZlcmVudCBDREsgU3RhY2tcbiAgICogKGFuZCBleHBvcnRlZCB1c2luZyB0aGUgYGV4cG9ydGAgbWV0aG9kKS5cbiAgICpcbiAgICogQG5vdGUgaWYgeW91J3JlIGltcG9ydGluZyBhIENvZGVCdWlsZCBQcm9qZWN0IGZvciB1c2VcbiAgICogICBpbiBhIENvZGVQaXBlbGluZSwgbWFrZSBzdXJlIHRoZSBleGlzdGluZyBQcm9qZWN0XG4gICAqICAgaGFzIHBlcm1pc3Npb25zIHRvIGFjY2VzcyB0aGUgUzMgQnVja2V0IG9mIHRoYXQgUGlwZWxpbmUgLVxuICAgKiAgIG90aGVyd2lzZSwgYnVpbGRzIGluIHRoYXQgUGlwZWxpbmUgd2lsbCBhbHdheXMgZmFpbC5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIHRoZSBwYXJlbnQgQ29uc3RydWN0IGZvciB0aGlzIENvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgdGhlIGxvZ2ljYWwgbmFtZSBvZiB0aGlzIENvbnN0cnVjdFxuICAgKiBAcGFyYW0gcHJvamVjdE5hbWUgdGhlIG5hbWUgb2YgdGhlIHByb2plY3QgdG8gaW1wb3J0XG4gICAqIEByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBleGlzdGluZyBQcm9qZWN0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Qcm9qZWN0TmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9qZWN0TmFtZTogc3RyaW5nKTogSVByb2plY3Qge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFByb2plY3RCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogaWFtLklQcmluY2lwYWw7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcHJvamVjdEFybjogc3RyaW5nO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHByb2plY3ROYW1lOiBzdHJpbmc7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcm9sZT86IGlhbS5Sb2xlID0gdW5kZWZpbmVkO1xuXG4gICAgICBjb25zdHJ1Y3RvcihzOiBDb25zdHJ1Y3QsIGk6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzLCBpKTtcblxuICAgICAgICB0aGlzLnByb2plY3RBcm4gPSBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgICAgIHNlcnZpY2U6ICdjb2RlYnVpbGQnLFxuICAgICAgICAgIHJlc291cmNlOiAncHJvamVjdCcsXG4gICAgICAgICAgcmVzb3VyY2VOYW1lOiBwcm9qZWN0TmFtZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5ncmFudFByaW5jaXBhbCA9IG5ldyBpYW0uVW5rbm93blByaW5jaXBhbCh7IHJlc291cmNlOiB0aGlzIH0pO1xuICAgICAgICB0aGlzLnByb2plY3ROYW1lID0gcHJvamVjdE5hbWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgbWFwIG9mIHN0cmluZyB0byBgQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlYCxcbiAgICogd2hpY2ggaXMgdGhlIGN1c3RvbWVyLWZhY2luZyB0eXBlLCB0byBhIGxpc3Qgb2YgYENmblByb2plY3QuRW52aXJvbm1lbnRWYXJpYWJsZVByb3BlcnR5YCxcbiAgICogd2hpY2ggaXMgdGhlIHJlcHJlc2VudGF0aW9uIG9mIGVudmlyb25tZW50IHZhcmlhYmxlcyBpbiBDbG91ZEZvcm1hdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGVudmlyb25tZW50VmFyaWFibGVzIHRoZSBtYXAgb2Ygc3RyaW5nIHRvIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICAgKiBAcGFyYW0gdmFsaWRhdGVOb1BsYWluVGV4dFNlY3JldHMgd2hldGhlciB0byB0aHJvdyBhbiBleGNlcHRpb25cbiAgICogICBpZiBhbnkgb2YgdGhlIHBsYWluIHRleHQgZW52aXJvbm1lbnQgdmFyaWFibGVzIGNvbnRhaW4gc2VjcmV0cywgZGVmYXVsdHMgdG8gJ2ZhbHNlJ1xuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBgQ2ZuUHJvamVjdC5FbnZpcm9ubWVudFZhcmlhYmxlUHJvcGVydHlgIGluc3RhbmNlc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzZXJpYWxpemVFbnZWYXJpYWJsZXMoZW52aXJvbm1lbnRWYXJpYWJsZXM6IHsgW25hbWU6IHN0cmluZ106IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZSB9LFxuICAgIHZhbGlkYXRlTm9QbGFpblRleHRTZWNyZXRzOiBib29sZWFuID0gZmFsc2UsIHByaW5jaXBhbD86IGlhbS5JR3JhbnRhYmxlKTogQ2ZuUHJvamVjdC5FbnZpcm9ubWVudFZhcmlhYmxlUHJvcGVydHlbXSB7XG5cbiAgICBjb25zdCByZXQgPSBuZXcgQXJyYXk8Q2ZuUHJvamVjdC5FbnZpcm9ubWVudFZhcmlhYmxlUHJvcGVydHk+KCk7XG4gICAgY29uc3Qgc3NtSWFtUmVzb3VyY2VzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICBjb25zdCBzZWNyZXRzTWFuYWdlcklhbVJlc291cmNlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGttc0lhbVJlc291cmNlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gICAgZm9yIChjb25zdCBbbmFtZSwgZW52VmFyaWFibGVdIG9mIE9iamVjdC5lbnRyaWVzKGVudmlyb25tZW50VmFyaWFibGVzKSkge1xuICAgICAgY29uc3QgZW52VmFyaWFibGVWYWx1ZSA9IGVudlZhcmlhYmxlLnZhbHVlPy50b1N0cmluZygpO1xuICAgICAgY29uc3QgY2ZuRW52VmFyaWFibGU6IENmblByb2plY3QuRW52aXJvbm1lbnRWYXJpYWJsZVByb3BlcnR5ID0ge1xuICAgICAgICBuYW1lLFxuICAgICAgICB0eXBlOiBlbnZWYXJpYWJsZS50eXBlIHx8IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUExBSU5URVhULFxuICAgICAgICB2YWx1ZTogZW52VmFyaWFibGVWYWx1ZSxcbiAgICAgIH07XG4gICAgICByZXQucHVzaChjZm5FbnZWYXJpYWJsZSk7XG5cbiAgICAgIC8vIHZhbGlkYXRlIHRoYXQgdGhlIHBsYWluLXRleHQgZW52aXJvbm1lbnQgdmFyaWFibGVzIGRvbid0IGNvbnRhaW4gYW55IHNlY3JldHMgaW4gdGhlbVxuICAgICAgaWYgKHZhbGlkYXRlTm9QbGFpblRleHRTZWNyZXRzICYmIGNmbkVudlZhcmlhYmxlLnR5cGUgPT09IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUExBSU5URVhUKSB7XG4gICAgICAgIGNvbnN0IGZyYWdtZW50cyA9IFRva2VuaXphdGlvbi5yZXZlcnNlU3RyaW5nKGNmbkVudlZhcmlhYmxlLnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiBmcmFnbWVudHMudG9rZW5zKSB7XG4gICAgICAgICAgaWYgKHRva2VuIGluc3RhbmNlb2YgU2VjcmV0VmFsdWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUGxhaW50ZXh0IGVudmlyb25tZW50IHZhcmlhYmxlICcke25hbWV9JyBjb250YWlucyBhIHNlY3JldCB2YWx1ZSEgYCArXG4gICAgICAgICAgICAgICdUaGlzIG1lYW5zIHRoZSB2YWx1ZSBvZiB0aGlzIHZhcmlhYmxlIHdpbGwgYmUgdmlzaWJsZSBpbiBwbGFpbiB0ZXh0IGluIHRoZSBBV1MgQ29uc29sZS4gJyArXG4gICAgICAgICAgICAgIFwiUGxlYXNlIGNvbnNpZGVyIHVzaW5nIENvZGVCdWlsZCdzIFNlY3JldHNNYW5hZ2VyIGVudmlyb25tZW50IHZhcmlhYmxlcyBmZWF0dXJlIGluc3RlYWQuIFwiICtcbiAgICAgICAgICAgICAgXCJJZiB5b3UnZCBsaWtlIHRvIGNvbnRpbnVlIHdpdGggaGF2aW5nIHRoaXMgc2VjcmV0IGluIHRoZSBwbGFpbnRleHQgZW52aXJvbm1lbnQgdmFyaWFibGVzLCBcIiArXG4gICAgICAgICAgICAgICdwbGVhc2Ugc2V0IHRoZSBjaGVja1NlY3JldHNJblBsYWluVGV4dEVudlZhcmlhYmxlcyBwcm9wZXJ0eSB0byBmYWxzZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJpbmNpcGFsKSB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YocHJpbmNpcGFsIGFzIHVua25vd24gYXMgSUNvbnN0cnVjdCk7XG5cbiAgICAgICAgLy8gc2F2ZSB0aGUgU1NNIGVudiB2YXJpYWJsZXNcbiAgICAgICAgaWYgKGVudlZhcmlhYmxlLnR5cGUgPT09IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUEFSQU1FVEVSX1NUT1JFKSB7XG4gICAgICAgICAgc3NtSWFtUmVzb3VyY2VzLnB1c2goc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgICAgICAgIHNlcnZpY2U6ICdzc20nLFxuICAgICAgICAgICAgcmVzb3VyY2U6ICdwYXJhbWV0ZXInLFxuICAgICAgICAgICAgLy8gSWYgdGhlIHBhcmFtZXRlciBuYW1lIHN0YXJ0cyB3aXRoIC8gdGhlIHJlc291cmNlIG5hbWUgaXMgbm90IHNlcGFyYXRlZCB3aXRoIGEgZG91YmxlICcvJ1xuICAgICAgICAgICAgLy8gYXJuOmF3czpzc206cmVnaW9uOjExMTExMTExMTE6cGFyYW1ldGVyL1BBUkFNX05BTUVcbiAgICAgICAgICAgIHJlc291cmNlTmFtZTogZW52VmFyaWFibGVWYWx1ZS5zdGFydHNXaXRoKCcvJylcbiAgICAgICAgICAgICAgPyBlbnZWYXJpYWJsZVZhbHVlLnNsaWNlKDEpXG4gICAgICAgICAgICAgIDogZW52VmFyaWFibGVWYWx1ZSxcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzYXZlIFNlY3JldHNNYW5hZ2VyIGVudiB2YXJpYWJsZXNcbiAgICAgICAgaWYgKGVudlZhcmlhYmxlLnR5cGUgPT09IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuU0VDUkVUU19NQU5BR0VSKSB7XG4gICAgICAgICAgLy8gV2UgaGF2ZSAzIGJhc2ljIGNhc2VzIGhlcmUgb2Ygd2hhdCBlbnZWYXJpYWJsZVZhbHVlIGNhbiBiZTpcbiAgICAgICAgICAvLyAxLiBBIHN0cmluZyB0aGF0IHN0YXJ0cyB3aXRoICdhcm46JyAoYW5kIG1pZ2h0IGNvbnRhaW4gVG9rZW4gZnJhZ21lbnRzKS5cbiAgICAgICAgICAvLyAyLiBBIFRva2VuLlxuICAgICAgICAgIC8vIDMuIEEgc2ltcGxlIHZhbHVlLCBsaWtlICdzZWNyZXQtaWQnLlxuICAgICAgICAgIGlmIChlbnZWYXJpYWJsZVZhbHVlLnN0YXJ0c1dpdGgoJ2FybjonKSkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkQXJuID0gc3RhY2suc3BsaXRBcm4oZW52VmFyaWFibGVWYWx1ZSwgQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUpO1xuICAgICAgICAgICAgaWYgKCFwYXJzZWRBcm4ucmVzb3VyY2VOYW1lKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2VjcmV0TWFuYWdlciBBUk4gaXMgbWlzc2luZyB0aGUgbmFtZSBvZiB0aGUgc2VjcmV0OiAnICsgZW52VmFyaWFibGVWYWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkgY2FuIGJlIGEgY29tcGxleCBzdHJpbmcsIHNlcGFyYXRlZCBieSAnOic7XG4gICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL2J1aWxkLXNwZWMtcmVmLmh0bWwjYnVpbGQtc3BlYy5lbnYuc2VjcmV0cy1tYW5hZ2VyXG4gICAgICAgICAgICBjb25zdCBzZWNyZXROYW1lID0gcGFyc2VkQXJuLnJlc291cmNlTmFtZS5zcGxpdCgnOicpWzBdO1xuICAgICAgICAgICAgc2VjcmV0c01hbmFnZXJJYW1SZXNvdXJjZXMuYWRkKHN0YWNrLmZvcm1hdEFybih7XG4gICAgICAgICAgICAgIHNlcnZpY2U6ICdzZWNyZXRzbWFuYWdlcicsXG4gICAgICAgICAgICAgIHJlc291cmNlOiAnc2VjcmV0JyxcbiAgICAgICAgICAgICAgLy8gc2luY2Ugd2UgZG9uJ3Qga25vdyB3aGV0aGVyIHRoZSBBUk4gd2FzIGZ1bGwsIG9yIHBhcnRpYWxcbiAgICAgICAgICAgICAgLy8gKENvZGVCdWlsZCBzdXBwb3J0cyBib3RoKSxcbiAgICAgICAgICAgICAgLy8gc3RpY2sgYSBcIipcIiBhdCB0aGUgZW5kLCB3aGljaCBtYWtlcyBpdCB3b3JrIGZvciBib3RoXG4gICAgICAgICAgICAgIHJlc291cmNlTmFtZTogYCR7c2VjcmV0TmFtZX0qYCxcbiAgICAgICAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICAgICAgICAgICAgcGFydGl0aW9uOiBwYXJzZWRBcm4ucGFydGl0aW9uLFxuICAgICAgICAgICAgICBhY2NvdW50OiBwYXJzZWRBcm4uYWNjb3VudCxcbiAgICAgICAgICAgICAgcmVnaW9uOiBwYXJzZWRBcm4ucmVnaW9uLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgLy8gaWYgc2VjcmV0IGNvbWVzIGZyb20gYW5vdGhlciBhY2NvdW50LCBTZWNyZXRzTWFuYWdlciB3aWxsIG5lZWQgdG8gYWNjZXNzXG4gICAgICAgICAgICAvLyBLTVMgb24gdGhlIG90aGVyIGFjY291bnQgYXMgd2VsbCB0byBiZSBhYmxlIHRvIGdldCB0aGUgc2VjcmV0XG4gICAgICAgICAgICBpZiAocGFyc2VkQXJuLmFjY291bnQgJiYgVG9rZW4uY29tcGFyZVN0cmluZ3MocGFyc2VkQXJuLmFjY291bnQsIHN0YWNrLmFjY291bnQpID09PSBUb2tlbkNvbXBhcmlzb24uRElGRkVSRU5UKSB7XG4gICAgICAgICAgICAgIGttc0lhbVJlc291cmNlcy5hZGQoc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlOiAna21zJyxcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogJ2tleScsXG4gICAgICAgICAgICAgICAgLy8gV2UgZG8gbm90IGtub3cgdGhlIElEIG9mIHRoZSBrZXksIGJ1dCBzaW5jZSB0aGlzIGlzIGEgY3Jvc3MtYWNjb3VudCBhY2Nlc3MsXG4gICAgICAgICAgICAgICAgLy8gdGhlIGtleSBwb2xpY2llcyBoYXZlIHRvIGFsbG93IHRoaXMgYWNjZXNzLCBzbyBhIHdpbGRjYXJkIGlzIHNhZmUgaGVyZVxuICAgICAgICAgICAgICAgIHJlc291cmNlTmFtZTogJyonLFxuICAgICAgICAgICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUsXG4gICAgICAgICAgICAgICAgcGFydGl0aW9uOiBwYXJzZWRBcm4ucGFydGl0aW9uLFxuICAgICAgICAgICAgICAgIGFjY291bnQ6IHBhcnNlZEFybi5hY2NvdW50LFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogcGFyc2VkQXJuLnJlZ2lvbixcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGVudlZhcmlhYmxlVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyB0aGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5IGNhbiBiZSBhIGNvbXBsZXggc3RyaW5nLCBzZXBhcmF0ZWQgYnkgJzonO1xuICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1zcGVjLXJlZi5odG1sI2J1aWxkLXNwZWMuZW52LnNlY3JldHMtbWFuYWdlclxuICAgICAgICAgICAgbGV0IHNlY3JldEFybiA9IGVudlZhcmlhYmxlVmFsdWUuc3BsaXQoJzonKVswXTtcblxuICAgICAgICAgICAgLy8gcGFyc2UgdGhlIFRva2VuLCBhbmQgc2VlIGlmIGl0IHJlcHJlc2VudHMgYSBzaW5nbGUgcmVzb3VyY2VcbiAgICAgICAgICAgIC8vICh3ZSB3aWxsIGFzc3VtZSBpdCdzIGEgU2VjcmV0IGZyb20gU2VjcmV0c01hbmFnZXIpXG4gICAgICAgICAgICBjb25zdCBmcmFnbWVudHMgPSBUb2tlbml6YXRpb24ucmV2ZXJzZVN0cmluZyhlbnZWYXJpYWJsZVZhbHVlKTtcbiAgICAgICAgICAgIGlmIChmcmFnbWVudHMudG9rZW5zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICBjb25zdCByZXNvbHZhYmxlID0gZnJhZ21lbnRzLnRva2Vuc1swXTtcbiAgICAgICAgICAgICAgaWYgKFJlZmVyZW5jZS5pc1JlZmVyZW5jZShyZXNvbHZhYmxlKSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIHRoZSBTdGFjayB0aGUgcmVzb3VyY2Ugb3duaW5nIHRoZSByZWZlcmVuY2UgYmVsb25ncyB0b1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc291cmNlU3RhY2sgPSBTdGFjay5vZihyZXNvbHZhYmxlLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgaWYgKFRva2VuLmNvbXBhcmVTdHJpbmdzKHN0YWNrLmFjY291bnQsIHJlc291cmNlU3RhY2suYWNjb3VudCkgPT09IFRva2VuQ29tcGFyaXNvbi5ESUZGRVJFTlQpIHtcbiAgICAgICAgICAgICAgICAgIC8vIHNpbmNlIHRoaXMgaXMgYSBjcm9zcy1hY2NvdW50IGFjY2VzcyxcbiAgICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgYXBwcm9wcmlhdGUgS01TIHBlcm1pc3Npb25zXG4gICAgICAgICAgICAgICAgICBrbXNJYW1SZXNvdXJjZXMuYWRkKHN0YWNrLmZvcm1hdEFybih7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdrbXMnLFxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogJ2tleScsXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGRvIG5vdCBrbm93IHRoZSBJRCBvZiB0aGUga2V5LCBidXQgc2luY2UgdGhpcyBpcyBhIGNyb3NzLWFjY291bnQgYWNjZXNzLFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUga2V5IHBvbGljaWVzIGhhdmUgdG8gYWxsb3cgdGhpcyBhY2Nlc3MsIHNvIGEgd2lsZGNhcmQgaXMgc2FmZSBoZXJlXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlTmFtZTogJyonLFxuICAgICAgICAgICAgICAgICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FLFxuICAgICAgICAgICAgICAgICAgICBwYXJ0aXRpb246IHJlc291cmNlU3RhY2sucGFydGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50OiByZXNvdXJjZVN0YWNrLmFjY291bnQsXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lvbjogcmVzb3VyY2VTdGFjay5yZWdpb24sXG4gICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAgIC8vIFdvcmsgYXJvdW5kIGEgYnVnIGluIFNlY3JldHNNYW5hZ2VyIC1cbiAgICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGFjY2VzcyBpcyBjcm9zcy1lbnZpcm9ubWVudCxcbiAgICAgICAgICAgICAgICAgIC8vIFNlY3JldC5zZWNyZXRBcm4gcmV0dXJucyBhIHBhcnRpYWwgQVJOIVxuICAgICAgICAgICAgICAgICAgLy8gU28gYWRkIGEgXCIqXCIgYXQgdGhlIGVuZCwgc28gdGhhdCB0aGUgcGVybWlzc2lvbnMgd29ya1xuICAgICAgICAgICAgICAgICAgc2VjcmV0QXJuID0gYCR7c2VjcmV0QXJufS0/Pz8/Pz9gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB3ZSBhcmUgcGFzc2VkIGEgVG9rZW4sIHdlIHNob3VsZCBhc3N1bWUgaXQncyB0aGUgQVJOIG9mIHRoZSBTZWNyZXRcbiAgICAgICAgICAgIC8vIChhcyB0aGUgbmFtZSB3b3VsZCBub3Qgd29yayBhbnl3YXksIGJlY2F1c2UgaXQgd291bGQgYmUgdGhlIGZ1bGwgbmFtZSwgd2hpY2ggQ29kZUJ1aWxkIGRvZXMgbm90IHN1cHBvcnQpXG4gICAgICAgICAgICBzZWNyZXRzTWFuYWdlcklhbVJlc291cmNlcy5hZGQoc2VjcmV0QXJuKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eSBjYW4gYmUgYSBjb21wbGV4IHN0cmluZywgc2VwYXJhdGVkIGJ5ICc6JztcbiAgICAgICAgICAgIC8vIHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvYnVpbGQtc3BlYy1yZWYuaHRtbCNidWlsZC1zcGVjLmVudi5zZWNyZXRzLW1hbmFnZXJcbiAgICAgICAgICAgIGNvbnN0IHNlY3JldE5hbWUgPSBlbnZWYXJpYWJsZVZhbHVlLnNwbGl0KCc6JylbMF07XG4gICAgICAgICAgICBzZWNyZXRzTWFuYWdlcklhbVJlc291cmNlcy5hZGQoc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgICAgICAgICAgc2VydmljZTogJ3NlY3JldHNtYW5hZ2VyJyxcbiAgICAgICAgICAgICAgcmVzb3VyY2U6ICdzZWNyZXQnLFxuICAgICAgICAgICAgICByZXNvdXJjZU5hbWU6IGAke3NlY3JldE5hbWV9LT8/Pz8/P2AsXG4gICAgICAgICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNzbUlhbVJlc291cmNlcy5sZW5ndGggIT09IDApIHtcbiAgICAgIHByaW5jaXBhbD8uZ3JhbnRQcmluY2lwYWwuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ3NzbTpHZXRQYXJhbWV0ZXJzJ10sXG4gICAgICAgIHJlc291cmNlczogc3NtSWFtUmVzb3VyY2VzLFxuICAgICAgfSkpO1xuICAgIH1cbiAgICBpZiAoc2VjcmV0c01hbmFnZXJJYW1SZXNvdXJjZXMuc2l6ZSAhPT0gMCkge1xuICAgICAgcHJpbmNpcGFsPy5ncmFudFByaW5jaXBhbC5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBBcnJheS5mcm9tKHNlY3JldHNNYW5hZ2VySWFtUmVzb3VyY2VzKSxcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgaWYgKGttc0lhbVJlc291cmNlcy5zaXplICE9PSAwKSB7XG4gICAgICBwcmluY2lwYWw/LmdyYW50UHJpbmNpcGFsLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydrbXM6RGVjcnlwdCddLFxuICAgICAgICByZXNvdXJjZXM6IEFycmF5LmZyb20oa21zSWFtUmVzb3VyY2VzKSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbDtcblxuICAvKipcbiAgICogVGhlIElBTSByb2xlIGZvciB0aGlzIHByb2plY3QuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgcHJvamVjdC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwcm9qZWN0QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9qZWN0LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHByb2plY3ROYW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBzb3VyY2U6IElTb3VyY2U7XG4gIHByaXZhdGUgcmVhZG9ubHkgYnVpbGRJbWFnZTogSUJ1aWxkSW1hZ2U7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3NlY29uZGFyeVNvdXJjZXM6IENmblByb2plY3QuU291cmNlUHJvcGVydHlbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBfc2Vjb25kYXJ5U291cmNlVmVyc2lvbnM6IENmblByb2plY3QuUHJvamVjdFNvdXJjZVZlcnNpb25Qcm9wZXJ0eVtdO1xuICBwcml2YXRlIHJlYWRvbmx5IF9zZWNvbmRhcnlBcnRpZmFjdHM6IENmblByb2plY3QuQXJ0aWZhY3RzUHJvcGVydHlbXTtcbiAgcHJpdmF0ZSBfZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuICBwcml2YXRlIHJlYWRvbmx5IF9maWxlU3lzdGVtTG9jYXRpb25zOiBDZm5Qcm9qZWN0LlByb2plY3RGaWxlU3lzdGVtTG9jYXRpb25Qcm9wZXJ0eVtdO1xuICBwcml2YXRlIF9iYXRjaFNlcnZpY2VSb2xlPzogaWFtLlJvbGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFByb2plY3RQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5wcm9qZWN0TmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMucm9sZSA9IHByb3BzLnJvbGUgfHwgbmV3IGlhbS5Sb2xlKHRoaXMsICdSb2xlJywge1xuICAgICAgcm9sZU5hbWU6IFBoeXNpY2FsTmFtZS5HRU5FUkFURV9JRl9ORUVERUQsXG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY29kZWJ1aWxkLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcbiAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gdGhpcy5yb2xlO1xuXG4gICAgdGhpcy5idWlsZEltYWdlID0gKHByb3BzLmVudmlyb25tZW50ICYmIHByb3BzLmVudmlyb25tZW50LmJ1aWxkSW1hZ2UpIHx8IExpbnV4QnVpbGRJbWFnZS5TVEFOREFSRF8xXzA7XG5cbiAgICAvLyBsZXQgc291cmNlIFwiYmluZFwiIHRvIHRoZSBwcm9qZWN0LiB0aGlzIHVzdWFsbHkgaW52b2x2ZXMgZ3JhbnRpbmcgcGVybWlzc2lvbnNcbiAgICAvLyBmb3IgdGhlIGNvZGUgYnVpbGQgcm9sZSB0byBpbnRlcmFjdCB3aXRoIHRoZSBzb3VyY2UuXG4gICAgdGhpcy5zb3VyY2UgPSBwcm9wcy5zb3VyY2UgfHwgbmV3IE5vU291cmNlKCk7XG4gICAgY29uc3Qgc291cmNlQ29uZmlnID0gdGhpcy5zb3VyY2UuYmluZCh0aGlzLCB0aGlzKTtcbiAgICBpZiAocHJvcHMuYmFkZ2UgJiYgIXRoaXMuc291cmNlLmJhZGdlU3VwcG9ydGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEJhZGdlIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHNvdXJjZSB0eXBlICR7dGhpcy5zb3VyY2UudHlwZX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcnRpZmFjdHMgPSBwcm9wcy5hcnRpZmFjdHNcbiAgICAgID8gcHJvcHMuYXJ0aWZhY3RzXG4gICAgICA6ICh0aGlzLnNvdXJjZS50eXBlID09PSBDT0RFUElQRUxJTkVfU09VUkNFX0FSVElGQUNUU19UWVBFXG4gICAgICAgID8gbmV3IENvZGVQaXBlbGluZUFydGlmYWN0cygpXG4gICAgICAgIDogbmV3IE5vQXJ0aWZhY3RzKCkpO1xuICAgIGNvbnN0IGFydGlmYWN0c0NvbmZpZyA9IGFydGlmYWN0cy5iaW5kKHRoaXMsIHRoaXMpO1xuXG4gICAgY29uc3QgY2FjaGUgPSBwcm9wcy5jYWNoZSB8fCBDYWNoZS5ub25lKCk7XG5cbiAgICAvLyBnaXZlIHRoZSBjYWNoaW5nIHN0cmF0ZWd5IHRoZSBvcHRpb24gdG8gZ3JhbnQgcGVybWlzc2lvbnMgdG8gYW55IHJlcXVpcmVkIHJlc291cmNlc1xuICAgIGNhY2hlLl9iaW5kKHRoaXMpO1xuXG4gICAgLy8gSW5qZWN0IGRvd25sb2FkIGNvbW1hbmRzIGZvciBhc3NldCBpZiByZXF1ZXN0ZWRcbiAgICBjb25zdCBlbnZpcm9ubWVudFZhcmlhYmxlcyA9IHByb3BzLmVudmlyb25tZW50VmFyaWFibGVzIHx8IHt9O1xuICAgIGNvbnN0IGJ1aWxkU3BlYyA9IHByb3BzLmJ1aWxkU3BlYztcbiAgICBpZiAodGhpcy5zb3VyY2UudHlwZSA9PT0gTk9fU09VUkNFX1RZUEUgJiYgKGJ1aWxkU3BlYyA9PT0gdW5kZWZpbmVkIHx8ICFidWlsZFNwZWMuaXNJbW1lZGlhdGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJZiB0aGUgUHJvamVjdCdzIHNvdXJjZSBpcyBOb1NvdXJjZSwgeW91IG5lZWQgdG8gcHJvdmlkZSBhIGNvbmNyZXRlIGJ1aWxkU3BlY1wiKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZWNvbmRhcnlTb3VyY2VzID0gW107XG4gICAgdGhpcy5fc2Vjb25kYXJ5U291cmNlVmVyc2lvbnMgPSBbXTtcbiAgICB0aGlzLl9maWxlU3lzdGVtTG9jYXRpb25zID0gW107XG4gICAgZm9yIChjb25zdCBzZWNvbmRhcnlTb3VyY2Ugb2YgcHJvcHMuc2Vjb25kYXJ5U291cmNlcyB8fCBbXSkge1xuICAgICAgdGhpcy5hZGRTZWNvbmRhcnlTb3VyY2Uoc2Vjb25kYXJ5U291cmNlKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZWNvbmRhcnlBcnRpZmFjdHMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHNlY29uZGFyeUFydGlmYWN0IG9mIHByb3BzLnNlY29uZGFyeUFydGlmYWN0cyB8fCBbXSkge1xuICAgICAgdGhpcy5hZGRTZWNvbmRhcnlBcnRpZmFjdChzZWNvbmRhcnlBcnRpZmFjdCk7XG4gICAgfVxuXG4gICAgdGhpcy52YWxpZGF0ZUNvZGVQaXBlbGluZVNldHRpbmdzKGFydGlmYWN0cyk7XG5cbiAgICBmb3IgKGNvbnN0IGZpbGVTeXN0ZW1Mb2NhdGlvbiBvZiBwcm9wcy5maWxlU3lzdGVtTG9jYXRpb25zIHx8IFtdKSB7XG4gICAgICB0aGlzLmFkZEZpbGVTeXN0ZW1Mb2NhdGlvbihmaWxlU3lzdGVtTG9jYXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblByb2plY3QodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgc291cmNlOiB7XG4gICAgICAgIC4uLnNvdXJjZUNvbmZpZy5zb3VyY2VQcm9wZXJ0eSxcbiAgICAgICAgYnVpbGRTcGVjOiBidWlsZFNwZWMgJiYgYnVpbGRTcGVjLnRvQnVpbGRTcGVjKHRoaXMpLFxuICAgICAgfSxcbiAgICAgIGFydGlmYWN0czogYXJ0aWZhY3RzQ29uZmlnLmFydGlmYWN0c1Byb3BlcnR5LFxuICAgICAgc2VydmljZVJvbGU6IHRoaXMucm9sZS5yb2xlQXJuLFxuICAgICAgZW52aXJvbm1lbnQ6IHRoaXMucmVuZGVyRW52aXJvbm1lbnQocHJvcHMsIGVudmlyb25tZW50VmFyaWFibGVzKSxcbiAgICAgIGZpbGVTeXN0ZW1Mb2NhdGlvbnM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJGaWxlU3lzdGVtTG9jYXRpb25zKCkgfSksXG4gICAgICAvLyBsYXp5LCBiZWNhdXNlIHdlIGhhdmUgYSBzZXR0ZXIgZm9yIGl0IGluIHNldEVuY3J5cHRpb25LZXlcbiAgICAgIC8vIFRoZSAnYWxpYXMvYXdzL3MzJyBkZWZhdWx0IGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGxlYXZpbmcgdGhlIGBlbmNyeXB0aW9uS2V5YCBmaWVsZFxuICAgICAgLy8gZW1wdHkgd2lsbCBub3QgcmVtb3ZlIGV4aXN0aW5nIGVuY3J5cHRpb25LZXlzIGR1cmluZyBhbiB1cGRhdGUgKHJlZi4gdC9EMTc4MTA1MjMpXG4gICAgICBlbmNyeXB0aW9uS2V5OiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IHRoaXMuX2VuY3J5cHRpb25LZXkgPyB0aGlzLl9lbmNyeXB0aW9uS2V5LmtleUFybiA6ICdhbGlhcy9hd3MvczMnIH0pLFxuICAgICAgYmFkZ2VFbmFibGVkOiBwcm9wcy5iYWRnZSxcbiAgICAgIGNhY2hlOiBjYWNoZS5fdG9DbG91ZEZvcm1hdGlvbigpLFxuICAgICAgbmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICB0aW1lb3V0SW5NaW51dGVzOiBwcm9wcy50aW1lb3V0ICYmIHByb3BzLnRpbWVvdXQudG9NaW51dGVzKCksXG4gICAgICBxdWV1ZWRUaW1lb3V0SW5NaW51dGVzOiBwcm9wcy5xdWV1ZWRUaW1lb3V0ICYmIHByb3BzLnF1ZXVlZFRpbWVvdXQudG9NaW51dGVzKCksXG4gICAgICBjb25jdXJyZW50QnVpbGRMaW1pdDogcHJvcHMuY29uY3VycmVudEJ1aWxkTGltaXQsXG4gICAgICBzZWNvbmRhcnlTb3VyY2VzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyU2Vjb25kYXJ5U291cmNlcygpIH0pLFxuICAgICAgc2Vjb25kYXJ5U291cmNlVmVyc2lvbnM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJTZWNvbmRhcnlTb3VyY2VWZXJzaW9ucygpIH0pLFxuICAgICAgc2Vjb25kYXJ5QXJ0aWZhY3RzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyU2Vjb25kYXJ5QXJ0aWZhY3RzKCkgfSksXG4gICAgICB0cmlnZ2Vyczogc291cmNlQ29uZmlnLmJ1aWxkVHJpZ2dlcnMsXG4gICAgICBzb3VyY2VWZXJzaW9uOiBzb3VyY2VDb25maWcuc291cmNlVmVyc2lvbixcbiAgICAgIHZwY0NvbmZpZzogdGhpcy5jb25maWd1cmVWcGMocHJvcHMpLFxuICAgICAgbG9nc0NvbmZpZzogdGhpcy5yZW5kZXJMb2dnaW5nQ29uZmlndXJhdGlvbihwcm9wcy5sb2dnaW5nKSxcbiAgICAgIGJ1aWxkQmF0Y2hDb25maWc6IExhenkuYW55KHtcbiAgICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbmZpZzogQ2ZuUHJvamVjdC5Qcm9qZWN0QnVpbGRCYXRjaENvbmZpZ1Byb3BlcnR5IHwgdW5kZWZpbmVkID0gdGhpcy5fYmF0Y2hTZXJ2aWNlUm9sZSA/IHtcbiAgICAgICAgICAgIHNlcnZpY2VSb2xlOiB0aGlzLl9iYXRjaFNlcnZpY2VSb2xlLnJvbGVBcm4sXG4gICAgICAgICAgfSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZFZwY1JlcXVpcmVkUGVybWlzc2lvbnMocHJvcHMsIHJlc291cmNlKTtcblxuICAgIHRoaXMucHJvamVjdEFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUocmVzb3VyY2UuYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2NvZGVidWlsZCcsXG4gICAgICByZXNvdXJjZTogJ3Byb2plY3QnLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICB9KTtcbiAgICB0aGlzLnByb2plY3ROYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcblxuICAgIHRoaXMuYWRkVG9Sb2xlUG9saWN5KHRoaXMuY3JlYXRlTG9nZ2luZ1Blcm1pc3Npb24oKSk7XG4gICAgLy8gYWRkIHBlcm1pc3Npb25zIHRvIGNyZWF0ZSBhbmQgdXNlIHRlc3QgcmVwb3J0IGdyb3Vwc1xuICAgIC8vIHdpdGggbmFtZXMgc3RhcnRpbmcgd2l0aCB0aGUgcHJvamVjdCdzIG5hbWUsXG4gICAgLy8gdW5sZXNzIHRoZSBjdXN0b21lciBleHBsaWNpdGx5IG9wdHMgb3V0IG9mIGl0XG4gICAgaWYgKHByb3BzLmdyYW50UmVwb3J0R3JvdXBQZXJtaXNzaW9ucyAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICdjb2RlYnVpbGQ6Q3JlYXRlUmVwb3J0R3JvdXAnLFxuICAgICAgICAgICdjb2RlYnVpbGQ6Q3JlYXRlUmVwb3J0JyxcbiAgICAgICAgICAnY29kZWJ1aWxkOlVwZGF0ZVJlcG9ydCcsXG4gICAgICAgICAgJ2NvZGVidWlsZDpCYXRjaFB1dFRlc3RDYXNlcycsXG4gICAgICAgICAgJ2NvZGVidWlsZDpCYXRjaFB1dENvZGVDb3ZlcmFnZXMnLFxuICAgICAgICBdLFxuICAgICAgICByZXNvdXJjZXM6IFtyZW5kZXJSZXBvcnRHcm91cEFybih0aGlzLCBgJHt0aGlzLnByb2plY3ROYW1lfS0qYCldLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9zZXNzaW9uLW1hbmFnZXIuaHRtbFxuICAgIGlmIChwcm9wcy5zc21TZXNzaW9uUGVybWlzc2lvbnMpIHtcbiAgICAgIHRoaXMuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgIC8vIEZvciB0aGUgU1NNIGNoYW5uZWxcbiAgICAgICAgICAnc3NtbWVzc2FnZXM6Q3JlYXRlQ29udHJvbENoYW5uZWwnLFxuICAgICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVEYXRhQ2hhbm5lbCcsXG4gICAgICAgICAgJ3NzbW1lc3NhZ2VzOk9wZW5Db250cm9sQ2hhbm5lbCcsXG4gICAgICAgICAgJ3NzbW1lc3NhZ2VzOk9wZW5EYXRhQ2hhbm5lbCcsXG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgU1NNIHNlc3Npb24gaXMgc2V0IHVwIHRvIGxvZyBjb21tYW5kcyB0byBDbG91ZFdhdGNoXG4gICAgICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dHcm91cHMnLFxuICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgJ2xvZ3M6UHV0TG9nRXZlbnRzJyxcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSBTU00gc2Vzc2lvbiBpcyBzZXQgdXAgdG8gbG9nIGNvbW1hbmRzIHRvIFMzLlxuICAgICAgICAgICdzMzpHZXRFbmNyeXB0aW9uQ29uZmlndXJhdGlvbicsXG4gICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmVuY3J5cHRpb25LZXkpIHtcbiAgICAgIHRoaXMuZW5jcnlwdGlvbktleSA9IHByb3BzLmVuY3J5cHRpb25LZXk7XG4gICAgfVxuXG4gICAgLy8gYmluZFxuICAgIGlmIChpc0JpbmRhYmxlQnVpbGRJbWFnZSh0aGlzLmJ1aWxkSW1hZ2UpKSB7XG4gICAgICB0aGlzLmJ1aWxkSW1hZ2UuYmluZCh0aGlzLCB0aGlzLCB7fSk7XG4gICAgfVxuXG4gICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gdGhpcy52YWxpZGF0ZVByb2plY3QoKSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBlbmFibGVCYXRjaEJ1aWxkcygpOiBCYXRjaEJ1aWxkQ29uZmlnIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMuX2JhdGNoU2VydmljZVJvbGUpIHtcbiAgICAgIHRoaXMuX2JhdGNoU2VydmljZVJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0JhdGNoU2VydmljZVJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjb2RlYnVpbGQuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9iYXRjaFNlcnZpY2VSb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgcmVzb3VyY2VzOiBbTGF6eS5zdHJpbmcoe1xuICAgICAgICAgIHByb2R1Y2U6ICgpID0+IHRoaXMucHJvamVjdEFybixcbiAgICAgICAgfSldLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ2NvZGVidWlsZDpTdGFydEJ1aWxkJyxcbiAgICAgICAgICAnY29kZWJ1aWxkOlN0b3BCdWlsZCcsXG4gICAgICAgICAgJ2NvZGVidWlsZDpSZXRyeUJ1aWxkJyxcbiAgICAgICAgXSxcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvbGU6IHRoaXMuX2JhdGNoU2VydmljZVJvbGUsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgc2Vjb25kYXJ5IHNvdXJjZSB0byB0aGUgUHJvamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHNlY29uZGFyeVNvdXJjZSB0aGUgc291cmNlIHRvIGFkZCBhcyBhIHNlY29uZGFyeSBzb3VyY2VcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvc2FtcGxlLW11bHRpLWluLW91dC5odG1sXG4gICAqL1xuICBwdWJsaWMgYWRkU2Vjb25kYXJ5U291cmNlKHNlY29uZGFyeVNvdXJjZTogSVNvdXJjZSk6IHZvaWQge1xuICAgIGlmICghc2Vjb25kYXJ5U291cmNlLmlkZW50aWZpZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGlkZW50aWZpZXIgYXR0cmlidXRlIGlzIG1hbmRhdG9yeSBmb3Igc2Vjb25kYXJ5IHNvdXJjZXMnKTtcbiAgICB9XG4gICAgY29uc3Qgc2Vjb25kYXJ5U291cmNlQ29uZmlnID0gc2Vjb25kYXJ5U291cmNlLmJpbmQodGhpcywgdGhpcyk7XG4gICAgdGhpcy5fc2Vjb25kYXJ5U291cmNlcy5wdXNoKHNlY29uZGFyeVNvdXJjZUNvbmZpZy5zb3VyY2VQcm9wZXJ0eSk7XG4gICAgaWYgKHNlY29uZGFyeVNvdXJjZUNvbmZpZy5zb3VyY2VWZXJzaW9uKSB7XG4gICAgICB0aGlzLl9zZWNvbmRhcnlTb3VyY2VWZXJzaW9ucy5wdXNoKHtcbiAgICAgICAgc291cmNlSWRlbnRpZmllcjogc2Vjb25kYXJ5U291cmNlLmlkZW50aWZpZXIsXG4gICAgICAgIHNvdXJjZVZlcnNpb246IHNlY29uZGFyeVNvdXJjZUNvbmZpZy5zb3VyY2VWZXJzaW9uLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBmaWxlU3lzdGVtTG9jYXRpb24gdG8gdGhlIFByb2plY3QuXG4gICAqXG4gICAqIEBwYXJhbSBmaWxlU3lzdGVtTG9jYXRpb24gdGhlIGZpbGVTeXN0ZW1Mb2NhdGlvbiB0byBhZGRcbiAgICovXG4gIHB1YmxpYyBhZGRGaWxlU3lzdGVtTG9jYXRpb24oZmlsZVN5c3RlbUxvY2F0aW9uOiBJRmlsZVN5c3RlbUxvY2F0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgZmlsZVN5c3RlbUNvbmZpZyA9IGZpbGVTeXN0ZW1Mb2NhdGlvbi5iaW5kKHRoaXMsIHRoaXMpO1xuICAgIHRoaXMuX2ZpbGVTeXN0ZW1Mb2NhdGlvbnMucHVzaChmaWxlU3lzdGVtQ29uZmlnLmxvY2F0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgc2Vjb25kYXJ5IGFydGlmYWN0IHRvIHRoZSBQcm9qZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gc2Vjb25kYXJ5QXJ0aWZhY3QgdGhlIGFydGlmYWN0IHRvIGFkZCBhcyBhIHNlY29uZGFyeSBhcnRpZmFjdFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9zYW1wbGUtbXVsdGktaW4tb3V0Lmh0bWxcbiAgICovXG4gIHB1YmxpYyBhZGRTZWNvbmRhcnlBcnRpZmFjdChzZWNvbmRhcnlBcnRpZmFjdDogSUFydGlmYWN0cyk6IHZvaWQge1xuICAgIGlmICghc2Vjb25kYXJ5QXJ0aWZhY3QuaWRlbnRpZmllcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgaWRlbnRpZmllciBhdHRyaWJ1dGUgaXMgbWFuZGF0b3J5IGZvciBzZWNvbmRhcnkgYXJ0aWZhY3RzJyk7XG4gICAgfVxuICAgIHRoaXMuX3NlY29uZGFyeUFydGlmYWN0cy5wdXNoKHNlY29uZGFyeUFydGlmYWN0LmJpbmQodGhpcywgdGhpcykuYXJ0aWZhY3RzUHJvcGVydHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY2FsbGJhY2sgaW52b2tlZCB3aGVuIHRoZSBnaXZlbiBwcm9qZWN0IGlzIGFkZGVkIHRvIGEgQ29kZVBpcGVsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0gX3Njb3BlIHRoZSBjb25zdHJ1Y3QgdGhlIGJpbmRpbmcgaXMgdGFraW5nIHBsYWNlIGluXG4gICAqIEBwYXJhbSBvcHRpb25zIGFkZGl0aW9uYWwgb3B0aW9ucyBmb3IgdGhlIGJpbmRpbmdcbiAgICovXG4gIHB1YmxpYyBiaW5kVG9Db2RlUGlwZWxpbmUoX3Njb3BlOiBDb25zdHJ1Y3QsIG9wdGlvbnM6IEJpbmRUb0NvZGVQaXBlbGluZU9wdGlvbnMpOiB2b2lkIHtcbiAgICAvLyB3b3JrIGFyb3VuZCBhIGJ1ZyBpbiBDb2RlQnVpbGQ6IGl0IGlnbm9yZXMgdGhlIEtNUyBrZXkgc2V0IG9uIHRoZSBwaXBlbGluZSxcbiAgICAvLyBhbmQgYWx3YXlzIHVzZXMgaXRzIG93biwgcHJvamVjdC1sZXZlbCBrZXlcbiAgICBpZiAob3B0aW9ucy5hcnRpZmFjdEJ1Y2tldC5lbmNyeXB0aW9uS2V5ICYmICF0aGlzLl9lbmNyeXB0aW9uS2V5KSB7XG4gICAgICAvLyB3ZSBjYW5ub3Qgc2FmZWx5IGRvIHRoaXMgYXNzaWdubWVudCBpZiB0aGUga2V5IGlzIG9mIHR5cGUga21zLktleSxcbiAgICAgIC8vIGFuZCBiZWxvbmdzIHRvIGEgc3RhY2sgaW4gYSBkaWZmZXJlbnQgYWNjb3VudCBvciByZWdpb24gdGhhbiB0aGUgcHJvamVjdFxuICAgICAgLy8gKHRoYXQgd291bGQgY2F1c2UgYW4gaWxsZWdhbCByZWZlcmVuY2UsIGFzIEtNUyBrZXlzIGRvbid0IGhhdmUgcGh5c2ljYWwgbmFtZXMpXG4gICAgICBjb25zdCBrZXlTdGFjayA9IFN0YWNrLm9mKG9wdGlvbnMuYXJ0aWZhY3RCdWNrZXQuZW5jcnlwdGlvbktleSk7XG4gICAgICBjb25zdCBwcm9qZWN0U3RhY2sgPSBTdGFjay5vZih0aGlzKTtcbiAgICAgIGlmICghKG9wdGlvbnMuYXJ0aWZhY3RCdWNrZXQuZW5jcnlwdGlvbktleSBpbnN0YW5jZW9mIGttcy5LZXkgJiZcbiAgICAgICAgICAoa2V5U3RhY2suYWNjb3VudCAhPT0gcHJvamVjdFN0YWNrLmFjY291bnQgfHwga2V5U3RhY2sucmVnaW9uICE9PSBwcm9qZWN0U3RhY2sucmVnaW9uKSkpIHtcbiAgICAgICAgdGhpcy5lbmNyeXB0aW9uS2V5ID0gb3B0aW9ucy5hcnRpZmFjdEJ1Y2tldC5lbmNyeXB0aW9uS2V5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVQcm9qZWN0KCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCByZXQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICAgIGlmICh0aGlzLnNvdXJjZS50eXBlID09PSBDT0RFUElQRUxJTkVfU09VUkNFX0FSVElGQUNUU19UWVBFKSB7XG4gICAgICBpZiAodGhpcy5fc2Vjb25kYXJ5U291cmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldC5wdXNoKCdBIFByb2plY3Qgd2l0aCBhIENvZGVQaXBlbGluZSBTb3VyY2UgY2Fubm90IGhhdmUgc2Vjb25kYXJ5IHNvdXJjZXMuICcgK1xuICAgICAgICAgIFwiVXNlIHRoZSBDb2RlQnVpbGQgUGlwZWxpbmUgQWN0aW9ucycgYGV4dHJhSW5wdXRzYCBwcm9wZXJ0eSBpbnN0ZWFkXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX3NlY29uZGFyeUFydGlmYWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldC5wdXNoKCdBIFByb2plY3Qgd2l0aCBhIENvZGVQaXBlbGluZSBTb3VyY2UgY2Fubm90IGhhdmUgc2Vjb25kYXJ5IGFydGlmYWN0cy4gJyArXG4gICAgICAgICAgXCJVc2UgdGhlIENvZGVCdWlsZCBQaXBlbGluZSBBY3Rpb25zJyBgb3V0cHV0c2AgcHJvcGVydHkgaW5zdGVhZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIHByaXZhdGUgc2V0IGVuY3J5cHRpb25LZXkoZW5jcnlwdGlvbktleToga21zLklLZXkpIHtcbiAgICB0aGlzLl9lbmNyeXB0aW9uS2V5ID0gZW5jcnlwdGlvbktleTtcbiAgICBlbmNyeXB0aW9uS2V5LmdyYW50RW5jcnlwdERlY3J5cHQodGhpcyk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUxvZ2dpbmdQZXJtaXNzaW9uKCkge1xuICAgIGNvbnN0IGxvZ0dyb3VwQXJuID0gU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdsb2dzJyxcbiAgICAgIHJlc291cmNlOiAnbG9nLWdyb3VwJyxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgICByZXNvdXJjZU5hbWU6IGAvYXdzL2NvZGVidWlsZC8ke3RoaXMucHJvamVjdE5hbWV9YCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGxvZ0dyb3VwU3RhckFybiA9IGAke2xvZ0dyb3VwQXJufToqYDtcblxuICAgIHJldHVybiBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFtsb2dHcm91cEFybiwgbG9nR3JvdXBTdGFyQXJuXSxcbiAgICAgIGFjdGlvbnM6IFsnbG9nczpDcmVhdGVMb2dHcm91cCcsICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsICdsb2dzOlB1dExvZ0V2ZW50cyddLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJFbnZpcm9ubWVudChcbiAgICBwcm9wczogUHJvamVjdFByb3BzLFxuICAgIHByb2plY3RWYXJzOiB7IFtuYW1lOiBzdHJpbmddOiBCdWlsZEVudmlyb25tZW50VmFyaWFibGUgfSA9IHt9KTogQ2ZuUHJvamVjdC5FbnZpcm9ubWVudFByb3BlcnR5IHtcblxuICAgIGNvbnN0IGVudiA9IHByb3BzLmVudmlyb25tZW50ID8/IHt9O1xuICAgIGNvbnN0IHZhcnM6IHsgW25hbWU6IHN0cmluZ106IEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZSB9ID0ge307XG4gICAgY29uc3QgY29udGFpbmVyVmFycyA9IGVudi5lbnZpcm9ubWVudFZhcmlhYmxlcyB8fCB7fTtcblxuICAgIC8vIGZpcnN0IGFwcGx5IGVudmlyb25tZW50IHZhcmlhYmxlcyBmcm9tIHRoZSBjb250YWluZXIgZGVmaW5pdGlvblxuICAgIGZvciAoY29uc3QgbmFtZSBvZiBPYmplY3Qua2V5cyhjb250YWluZXJWYXJzKSkge1xuICAgICAgdmFyc1tuYW1lXSA9IGNvbnRhaW5lclZhcnNbbmFtZV07XG4gICAgfVxuXG4gICAgLy8gbm93IGFwcGx5IHByb2plY3QtbGV2ZWwgdmFyc1xuICAgIGZvciAoY29uc3QgbmFtZSBvZiBPYmplY3Qua2V5cyhwcm9qZWN0VmFycykpIHtcbiAgICAgIHZhcnNbbmFtZV0gPSBwcm9qZWN0VmFyc1tuYW1lXTtcbiAgICB9XG5cbiAgICBjb25zdCBoYXNFbnZpcm9ubWVudFZhcnMgPSBPYmplY3Qua2V5cyh2YXJzKS5sZW5ndGggPiAwO1xuXG4gICAgY29uc3QgZXJyb3JzID0gdGhpcy5idWlsZEltYWdlLnZhbGlkYXRlKGVudik7XG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgQ29kZUJ1aWxkIGVudmlyb25tZW50OiAnICsgZXJyb3JzLmpvaW4oJ1xcbicpKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbWFnZVB1bGxQcmluY2lwYWxUeXBlID0gdGhpcy5idWlsZEltYWdlLmltYWdlUHVsbFByaW5jaXBhbFR5cGUgPT09IEltYWdlUHVsbFByaW5jaXBhbFR5cGUuQ09ERUJVSUxEXG4gICAgICA/IEltYWdlUHVsbFByaW5jaXBhbFR5cGUuQ09ERUJVSUxEXG4gICAgICA6IEltYWdlUHVsbFByaW5jaXBhbFR5cGUuU0VSVklDRV9ST0xFO1xuICAgIGlmICh0aGlzLmJ1aWxkSW1hZ2UucmVwb3NpdG9yeSkge1xuICAgICAgaWYgKGltYWdlUHVsbFByaW5jaXBhbFR5cGUgPT09IEltYWdlUHVsbFByaW5jaXBhbFR5cGUuU0VSVklDRV9ST0xFKSB7XG4gICAgICAgIHRoaXMuYnVpbGRJbWFnZS5yZXBvc2l0b3J5LmdyYW50UHVsbCh0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjb2RlYnVpbGQuYW1hem9uYXdzLmNvbScpXSxcbiAgICAgICAgICBhY3Rpb25zOiBbJ2VjcjpHZXREb3dubG9hZFVybEZvckxheWVyJywgJ2VjcjpCYXRjaEdldEltYWdlJywgJ2VjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHknXSxcbiAgICAgICAgfSk7XG4gICAgICAgIHN0YXRlbWVudC5zaWQgPSAnQ29kZUJ1aWxkJztcbiAgICAgICAgdGhpcy5idWlsZEltYWdlLnJlcG9zaXRvcnkuYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaW1hZ2VQdWxsUHJpbmNpcGFsVHlwZSA9PT0gSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZS5TRVJWSUNFX1JPTEUpIHtcbiAgICAgIHRoaXMuYnVpbGRJbWFnZS5zZWNyZXRzTWFuYWdlckNyZWRlbnRpYWxzPy5ncmFudFJlYWQodGhpcyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VjcmV0ID0gdGhpcy5idWlsZEltYWdlLnNlY3JldHNNYW5hZ2VyQ3JlZGVudGlhbHM7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHRoaXMuYnVpbGRJbWFnZS50eXBlLFxuICAgICAgaW1hZ2U6IHRoaXMuYnVpbGRJbWFnZS5pbWFnZUlkLFxuICAgICAgaW1hZ2VQdWxsQ3JlZGVudGlhbHNUeXBlOiBpbWFnZVB1bGxQcmluY2lwYWxUeXBlLFxuICAgICAgcmVnaXN0cnlDcmVkZW50aWFsOiBzZWNyZXRcbiAgICAgICAgPyB7XG4gICAgICAgICAgY3JlZGVudGlhbFByb3ZpZGVyOiAnU0VDUkVUU19NQU5BR0VSJyxcbiAgICAgICAgICAvLyBTZWNyZXRzIG11c3QgYmUgcmVmZXJlbmNlZCBieSBlaXRoZXIgdGhlIGZ1bGwgQVJOICh3aXRoIFNlY3JldHNNYW5hZ2VyIHN1ZmZpeCksIG9yIGJ5IG5hbWUuXG4gICAgICAgICAgLy8gXCJQYXJ0aWFsXCIgQVJOcyAod2l0aG91dCB0aGUgc3VmZml4KSB3aWxsIGZhaWwgYSB2YWxpZGF0aW9uIHJlZ2V4IGF0IGRlcGxveS10aW1lLlxuICAgICAgICAgIGNyZWRlbnRpYWw6IHNlY3JldC5zZWNyZXRGdWxsQXJuID8/IHNlY3JldC5zZWNyZXROYW1lLFxuICAgICAgICB9XG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgY2VydGlmaWNhdGU6IGVudi5jZXJ0aWZpY2F0ZT8uYnVja2V0LmFybkZvck9iamVjdHMoZW52LmNlcnRpZmljYXRlLm9iamVjdEtleSksXG4gICAgICBwcml2aWxlZ2VkTW9kZTogZW52LnByaXZpbGVnZWQgfHwgZmFsc2UsXG4gICAgICBjb21wdXRlVHlwZTogZW52LmNvbXB1dGVUeXBlIHx8IHRoaXMuYnVpbGRJbWFnZS5kZWZhdWx0Q29tcHV0ZVR5cGUsXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczogaGFzRW52aXJvbm1lbnRWYXJzXG4gICAgICAgID8gUHJvamVjdC5zZXJpYWxpemVFbnZWYXJpYWJsZXModmFycywgcHJvcHMuY2hlY2tTZWNyZXRzSW5QbGFpblRleHRFbnZWYXJpYWJsZXMgPz8gdHJ1ZSwgdGhpcylcbiAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRmlsZVN5c3RlbUxvY2F0aW9ucygpOiBDZm5Qcm9qZWN0LlByb2plY3RGaWxlU3lzdGVtTG9jYXRpb25Qcm9wZXJ0eVtdIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fZmlsZVN5c3RlbUxvY2F0aW9ucy5sZW5ndGggPT09IDBcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IHRoaXMuX2ZpbGVTeXN0ZW1Mb2NhdGlvbnM7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclNlY29uZGFyeVNvdXJjZXMoKTogQ2ZuUHJvamVjdC5Tb3VyY2VQcm9wZXJ0eVtdIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fc2Vjb25kYXJ5U291cmNlcy5sZW5ndGggPT09IDBcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IHRoaXMuX3NlY29uZGFyeVNvdXJjZXM7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclNlY29uZGFyeVNvdXJjZVZlcnNpb25zKCk6IENmblByb2plY3QuUHJvamVjdFNvdXJjZVZlcnNpb25Qcm9wZXJ0eVtdIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fc2Vjb25kYXJ5U291cmNlVmVyc2lvbnMubGVuZ3RoID09PSAwXG4gICAgICA/IHVuZGVmaW5lZFxuICAgICAgOiB0aGlzLl9zZWNvbmRhcnlTb3VyY2VWZXJzaW9ucztcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyU2Vjb25kYXJ5QXJ0aWZhY3RzKCk6IENmblByb2plY3QuQXJ0aWZhY3RzUHJvcGVydHlbXSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX3NlY29uZGFyeUFydGlmYWN0cy5sZW5ndGggPT09IDBcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IHRoaXMuX3NlY29uZGFyeUFydGlmYWN0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBjb25maWd1cmVkLCBzZXQgdXAgdGhlIFZQQy1yZWxhdGVkIHByb3BlcnRpZXNcbiAgICpcbiAgICogUmV0dXJucyB0aGUgVnBjQ29uZmlnIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZVxuICAgKiBjb2RlYnVpbGQgY3JlYXRpb24gcHJvcGVydGllcy5cbiAgICovXG4gIHByaXZhdGUgY29uZmlndXJlVnBjKHByb3BzOiBQcm9qZWN0UHJvcHMpOiBDZm5Qcm9qZWN0LlZwY0NvbmZpZ1Byb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoKHByb3BzLnNlY3VyaXR5R3JvdXBzIHx8IHByb3BzLmFsbG93QWxsT3V0Ym91bmQgIT09IHVuZGVmaW5lZCkgJiYgIXByb3BzLnZwYykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY29uZmlndXJlIFxcJ3NlY3VyaXR5R3JvdXBcXCcgb3IgXFwnYWxsb3dBbGxPdXRib3VuZFxcJyB3aXRob3V0IGNvbmZpZ3VyaW5nIGEgVlBDJyk7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wcy52cGMpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgaWYgKChwcm9wcy5zZWN1cml0eUdyb3VwcyAmJiBwcm9wcy5zZWN1cml0eUdyb3Vwcy5sZW5ndGggPiAwKSAmJiBwcm9wcy5hbGxvd0FsbE91dGJvdW5kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ29uZmlndXJlIFxcJ2FsbG93QWxsT3V0Ym91bmRcXCcgZGlyZWN0bHkgb24gdGhlIHN1cHBsaWVkIFNlY3VyaXR5R3JvdXAuJyk7XG4gICAgfVxuXG4gICAgbGV0IHNlY3VyaXR5R3JvdXBzOiBlYzIuSVNlY3VyaXR5R3JvdXBbXTtcbiAgICBpZiAocHJvcHMuc2VjdXJpdHlHcm91cHMgJiYgcHJvcHMuc2VjdXJpdHlHcm91cHMubGVuZ3RoID4gMCkge1xuICAgICAgc2VjdXJpdHlHcm91cHMgPSBwcm9wcy5zZWN1cml0eUdyb3VwcztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnU2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQXV0b21hdGljIGdlbmVyYXRlZCBzZWN1cml0eSBncm91cCBmb3IgQ29kZUJ1aWxkICcgKyBOYW1lcy51bmlxdWVJZCh0aGlzKSxcbiAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogcHJvcHMuYWxsb3dBbGxPdXRib3VuZCxcbiAgICAgIH0pO1xuICAgICAgc2VjdXJpdHlHcm91cHMgPSBbc2VjdXJpdHlHcm91cF07XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucyh7IHNlY3VyaXR5R3JvdXBzIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHZwY0lkOiBwcm9wcy52cGMudnBjSWQsXG4gICAgICBzdWJuZXRzOiBwcm9wcy52cGMuc2VsZWN0U3VibmV0cyhwcm9wcy5zdWJuZXRTZWxlY3Rpb24pLnN1Ym5ldElkcyxcbiAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IHRoaXMuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHMubWFwKHMgPT4gcy5zZWN1cml0eUdyb3VwSWQpLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckxvZ2dpbmdDb25maWd1cmF0aW9uKHByb3BzOiBMb2dnaW5nT3B0aW9ucyB8IHVuZGVmaW5lZCk6IENmblByb2plY3QuTG9nc0NvbmZpZ1Byb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAocHJvcHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBsZXQgczNDb25maWc6IENmblByb2plY3QuUzNMb2dzQ29uZmlnUHJvcGVydHkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgbGV0IGNsb3Vkd2F0Y2hDb25maWc6IENmblByb2plY3QuQ2xvdWRXYXRjaExvZ3NDb25maWdQcm9wZXJ0eSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChwcm9wcy5zMykge1xuICAgICAgY29uc3QgczNMb2dzID0gcHJvcHMuczM7XG4gICAgICBzM0NvbmZpZyA9IHtcbiAgICAgICAgc3RhdHVzOiAoczNMb2dzLmVuYWJsZWQgPz8gdHJ1ZSkgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgICAgICBsb2NhdGlvbjogYCR7czNMb2dzLmJ1Y2tldC5idWNrZXROYW1lfWAgKyAoczNMb2dzLnByZWZpeCA/IGAvJHtzM0xvZ3MucHJlZml4fWAgOiAnJyksXG4gICAgICAgIGVuY3J5cHRpb25EaXNhYmxlZDogczNMb2dzLmVuY3J5cHRlZCxcbiAgICAgIH07XG4gICAgICBzM0xvZ3MuYnVja2V0Py5ncmFudFdyaXRlKHRoaXMpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5jbG91ZFdhdGNoKSB7XG4gICAgICBjb25zdCBjbG91ZFdhdGNoTG9ncyA9IHByb3BzLmNsb3VkV2F0Y2g7XG4gICAgICBjb25zdCBzdGF0dXMgPSAoY2xvdWRXYXRjaExvZ3MuZW5hYmxlZCA/PyB0cnVlKSA/ICdFTkFCTEVEJyA6ICdESVNBQkxFRCc7XG5cbiAgICAgIGlmIChzdGF0dXMgPT09ICdFTkFCTEVEJyAmJiAhKGNsb3VkV2F0Y2hMb2dzLmxvZ0dyb3VwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NwZWNpZnlpbmcgYSBMb2dHcm91cCBpcyByZXF1aXJlZCBpZiBDbG91ZFdhdGNoIGxvZ2dpbmcgZm9yIENvZGVCdWlsZCBpcyBlbmFibGVkJyk7XG4gICAgICB9XG4gICAgICBjbG91ZFdhdGNoTG9ncy5sb2dHcm91cD8uZ3JhbnRXcml0ZSh0aGlzKTtcblxuICAgICAgY2xvdWR3YXRjaENvbmZpZyA9IHtcbiAgICAgICAgc3RhdHVzLFxuICAgICAgICBncm91cE5hbWU6IGNsb3VkV2F0Y2hMb2dzLmxvZ0dyb3VwPy5sb2dHcm91cE5hbWUsXG4gICAgICAgIHN0cmVhbU5hbWU6IGNsb3VkV2F0Y2hMb2dzLnByZWZpeCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHMzTG9nczogczNDb25maWcsXG4gICAgICBjbG91ZFdhdGNoTG9nczogY2xvdWR3YXRjaENvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRWcGNSZXF1aXJlZFBlcm1pc3Npb25zKHByb3BzOiBQcm9qZWN0UHJvcHMsIHByb2plY3Q6IENmblByb2plY3QpOiB2b2lkIHtcbiAgICBpZiAoIXByb3BzLnZwYyB8fCAhdGhpcy5yb2xlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogW2Bhcm46JHtBd3MuUEFSVElUSU9OfTplYzI6JHtBd3MuUkVHSU9OfToke0F3cy5BQ0NPVU5UX0lEfTpuZXR3b3JrLWludGVyZmFjZS8qYF0sXG4gICAgICBhY3Rpb25zOiBbJ2VjMjpDcmVhdGVOZXR3b3JrSW50ZXJmYWNlUGVybWlzc2lvbiddLFxuICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAnZWMyOlN1Ym5ldCc6IHByb3BzLnZwY1xuICAgICAgICAgICAgLnNlbGVjdFN1Ym5ldHMocHJvcHMuc3VibmV0U2VsZWN0aW9uKS5zdWJuZXRJZHNcbiAgICAgICAgICAgIC5tYXAoc2kgPT4gYGFybjoke0F3cy5QQVJUSVRJT059OmVjMjoke0F3cy5SRUdJT059OiR7QXdzLkFDQ09VTlRfSUR9OnN1Ym5ldC8ke3NpfWApLFxuICAgICAgICAgICdlYzI6QXV0aG9yaXplZFNlcnZpY2UnOiAnY29kZWJ1aWxkLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICAvLyBJZiB0aGUgc2FtZSBSb2xlIGlzIHVzZWQgZm9yIG11bHRpcGxlIFByb2plY3RzLCBhbHdheXMgY3JlYXRpbmcgYSBuZXcgYGlhbS5Qb2xpY3lgXG4gICAgLy8gd2lsbCBhdHRhY2ggdGhlIHNhbWUgcG9saWN5IG11bHRpcGxlIHRpbWVzLCBwcm9iYWJseSBleGNlZWRpbmcgdGhlIG1heGltdW0gc2l6ZSBvZiB0aGVcbiAgICAvLyBSb2xlIHBvbGljeS4gTWFrZSBzdXJlIHdlIG9ubHkgZG8gaXQgb25jZSBmb3IgdGhlIHNhbWUgcm9sZS5cbiAgICAvL1xuICAgIC8vIFRoaXMgZGVkdXBsaWNhdGlvbiBjb3VsZCBiZSBhIGZlYXR1cmUgb2YgdGhlIFJvbGUgaXRzZWxmLCBidXQgdGhhdCBmZWVscyByaXNreSBhbmRcbiAgICAvLyBpcyBoYXJkIHRvIGltcGxlbWVudCAod2hhdCB3aXRoIFRva2VucyBhbmQgYWxsKS4gU2FmZXIgdG8gZml4IGl0IGxvY2FsbHkgZm9yIG5vdy5cbiAgICBsZXQgcG9saWN5OiBpYW0uUG9saWN5IHwgdW5kZWZpbmVkID0gKHRoaXMucm9sZSBhcyBhbnkpW1ZQQ19QT0xJQ1lfU1lNXTtcbiAgICBpZiAoIXBvbGljeSkge1xuICAgICAgcG9saWN5ID0gbmV3IGlhbS5Qb2xpY3kodGhpcywgJ1BvbGljeURvY3VtZW50Jywge1xuICAgICAgICBzdGF0ZW1lbnRzOiBbXG4gICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgJ2VjMjpDcmVhdGVOZXR3b3JrSW50ZXJmYWNlJyxcbiAgICAgICAgICAgICAgJ2VjMjpEZXNjcmliZU5ldHdvcmtJbnRlcmZhY2VzJyxcbiAgICAgICAgICAgICAgJ2VjMjpEZWxldGVOZXR3b3JrSW50ZXJmYWNlJyxcbiAgICAgICAgICAgICAgJ2VjMjpEZXNjcmliZVN1Ym5ldHMnLFxuICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlU2VjdXJpdHlHcm91cHMnLFxuICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlRGhjcE9wdGlvbnMnLFxuICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlVnBjcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHBvbGljeSk7XG4gICAgICAodGhpcy5yb2xlIGFzIGFueSlbVlBDX1BPTElDWV9TWU1dID0gcG9saWN5O1xuICAgIH1cblxuICAgIC8vIGFkZCBhbiBleHBsaWNpdCBkZXBlbmRlbmN5IGJldHdlZW4gdGhlIEVDMiBQb2xpY3kgYW5kIHRoaXMgUHJvamVjdCAtXG4gICAgLy8gb3RoZXJ3aXNlLCBjcmVhdGluZyB0aGUgUHJvamVjdCBmYWlscywgYXMgaXQgcmVxdWlyZXMgdGhlc2UgcGVybWlzc2lvbnNcbiAgICAvLyB0byBiZSBhbHJlYWR5IGF0dGFjaGVkIHRvIHRoZSBQcm9qZWN0J3MgUm9sZVxuICAgIHByb2plY3Qubm9kZS5hZGREZXBlbmRlbmN5KHBvbGljeSk7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlQ29kZVBpcGVsaW5lU2V0dGluZ3MoYXJ0aWZhY3RzOiBJQXJ0aWZhY3RzKSB7XG4gICAgY29uc3Qgc291cmNlVHlwZSA9IHRoaXMuc291cmNlLnR5cGU7XG4gICAgY29uc3QgYXJ0aWZhY3RzVHlwZSA9IGFydGlmYWN0cy50eXBlO1xuXG4gICAgaWYgKChzb3VyY2VUeXBlID09PSBDT0RFUElQRUxJTkVfU09VUkNFX0FSVElGQUNUU19UWVBFIHx8XG4gICAgICAgIGFydGlmYWN0c1R5cGUgPT09IENPREVQSVBFTElORV9TT1VSQ0VfQVJUSUZBQ1RTX1RZUEUpICYmXG4gICAgICAgIChzb3VyY2VUeXBlICE9PSBhcnRpZmFjdHNUeXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCb3RoIHNvdXJjZSBhbmQgYXJ0aWZhY3RzIG11c3QgYmUgc2V0IHRvIENvZGVQaXBlbGluZScpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEJ1aWxkIG1hY2hpbmUgY29tcHV0ZSB0eXBlLlxuICovXG5leHBvcnQgZW51bSBDb21wdXRlVHlwZSB7XG4gIFNNQUxMID0gJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyxcbiAgTUVESVVNID0gJ0JVSUxEX0dFTkVSQUwxX01FRElVTScsXG4gIExBUkdFID0gJ0JVSUxEX0dFTkVSQUwxX0xBUkdFJyxcbiAgWDJfTEFSR0UgPSAnQlVJTERfR0VORVJBTDFfMlhMQVJHRSdcbn1cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiBwcmluY2lwYWwgQ29kZUJ1aWxkIHdpbGwgdXNlIHRvIHB1bGwgeW91ciBidWlsZCBEb2NrZXIgaW1hZ2UuXG4gKi9cbmV4cG9ydCBlbnVtIEltYWdlUHVsbFByaW5jaXBhbFR5cGUge1xuICAvKipcbiAgICogQ09ERUJVSUxEIHNwZWNpZmllcyB0aGF0IENvZGVCdWlsZCB1c2VzIGl0cyBvd24gaWRlbnRpdHkgd2hlbiBwdWxsaW5nIHRoZSBpbWFnZS5cbiAgICogVGhpcyBtZWFucyB0aGUgcmVzb3VyY2UgcG9saWN5IG9mIHRoZSBFQ1IgcmVwb3NpdG9yeSB0aGF0IGhvc3RzIHRoZSBpbWFnZSB3aWxsIGJlIG1vZGlmaWVkIHRvIHRydXN0XG4gICAqIENvZGVCdWlsZCdzIHNlcnZpY2UgcHJpbmNpcGFsLlxuICAgKiBUaGlzIGlzIHRoZSByZXF1aXJlZCBwcmluY2lwYWwgdHlwZSB3aGVuIHVzaW5nIENvZGVCdWlsZCdzIHByZS1kZWZpbmVkIGltYWdlcy5cbiAgICovXG4gIENPREVCVUlMRCA9ICdDT0RFQlVJTEQnLFxuXG4gIC8qKlxuICAgKiBTRVJWSUNFX1JPTEUgc3BlY2lmaWVzIHRoYXQgQVdTIENvZGVCdWlsZCB1c2VzIHRoZSBwcm9qZWN0J3Mgcm9sZSB3aGVuIHB1bGxpbmcgdGhlIGltYWdlLlxuICAgKiBUaGUgcm9sZSB3aWxsIGJlIGdyYW50ZWQgcHVsbCBwZXJtaXNzaW9ucyBvbiB0aGUgRUNSIHJlcG9zaXRvcnkgaG9zdGluZyB0aGUgaW1hZ2UuXG4gICAqL1xuICBTRVJWSUNFX1JPTEUgPSAnU0VSVklDRV9ST0xFJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWxkRW52aXJvbm1lbnQge1xuICAvKipcbiAgICogVGhlIGltYWdlIHVzZWQgZm9yIHRoZSBidWlsZHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IExpbnV4QnVpbGRJbWFnZS5TVEFOREFSRF8xXzBcbiAgICovXG4gIHJlYWRvbmx5IGJ1aWxkSW1hZ2U/OiBJQnVpbGRJbWFnZTtcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgY29tcHV0ZSB0byB1c2UgZm9yIHRoaXMgYnVpbGQuXG4gICAqIFNlZSB0aGUgYENvbXB1dGVUeXBlYCBlbnVtIGZvciB0aGUgcG9zc2libGUgdmFsdWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0YWtlbiBmcm9tIGAjYnVpbGRJbWFnZSNkZWZhdWx0Q29tcHV0ZVR5cGVgXG4gICAqL1xuICByZWFkb25seSBjb21wdXRlVHlwZT86IENvbXB1dGVUeXBlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaG93IHRoZSBwcm9qZWN0IGJ1aWxkcyBEb2NrZXIgaW1hZ2VzLiBTcGVjaWZ5IHRydWUgdG8gZW5hYmxlXG4gICAqIHJ1bm5pbmcgdGhlIERvY2tlciBkYWVtb24gaW5zaWRlIGEgRG9ja2VyIGNvbnRhaW5lci4gVGhpcyB2YWx1ZSBtdXN0IGJlXG4gICAqIHNldCB0byB0cnVlIG9ubHkgaWYgdGhpcyBidWlsZCBwcm9qZWN0IHdpbGwgYmUgdXNlZCB0byBidWlsZCBEb2NrZXJcbiAgICogaW1hZ2VzLCBhbmQgdGhlIHNwZWNpZmllZCBidWlsZCBlbnZpcm9ubWVudCBpbWFnZSBpcyBub3Qgb25lIHByb3ZpZGVkIGJ5XG4gICAqIEFXUyBDb2RlQnVpbGQgd2l0aCBEb2NrZXIgc3VwcG9ydC4gT3RoZXJ3aXNlLCBhbGwgYXNzb2NpYXRlZCBidWlsZHMgdGhhdFxuICAgKiBhdHRlbXB0IHRvIGludGVyYWN0IHdpdGggdGhlIERvY2tlciBkYWVtb24gd2lsbCBmYWlsLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJpdmlsZWdlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBsb2NhdGlvbiBvZiB0aGUgUEVNLWVuY29kZWQgY2VydGlmaWNhdGUgZm9yIHRoZSBidWlsZCBwcm9qZWN0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZXh0ZXJuYWwgY2VydGlmaWNhdGUgaXMgYWRkZWQgdG8gdGhlIHByb2plY3RcbiAgICovXG4gIHJlYWRvbmx5IGNlcnRpZmljYXRlPzogQnVpbGRFbnZpcm9ubWVudENlcnRpZmljYXRlO1xuXG4gIC8qKlxuICAgKiBUaGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIHRoYXQgeW91ciBidWlsZHMgY2FuIHVzZS5cbiAgICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50VmFyaWFibGVzPzogeyBbbmFtZTogc3RyaW5nXTogQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlIH07XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIERvY2tlciBpbWFnZSB1c2VkIGZvciB0aGUgQ29kZUJ1aWxkIFByb2plY3QgYnVpbGRzLlxuICogVXNlIHRoZSBjb25jcmV0ZSBzdWJjbGFzc2VzLCBlaXRoZXI6XG4gKiBgTGludXhCdWlsZEltYWdlYCBvciBgV2luZG93c0J1aWxkSW1hZ2VgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElCdWlsZEltYWdlIHtcbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIGJ1aWxkIGVudmlyb25tZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgRG9ja2VyIGltYWdlIGlkZW50aWZpZXIgdGhhdCB0aGUgYnVpbGQgZW52aXJvbm1lbnQgdXNlcy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvYnVpbGQtZW52LXJlZi1hdmFpbGFibGUuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBgQ29tcHV0ZVR5cGVgIHRvIHVzZSB3aXRoIHRoaXMgaW1hZ2UsXG4gICAqIGlmIG9uZSB3YXMgbm90IHNwZWNpZmllZCBpbiBgQnVpbGRFbnZpcm9ubWVudCNjb21wdXRlVHlwZWAgZXhwbGljaXRseS5cbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRDb21wdXRlVHlwZTogQ29tcHV0ZVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHByaW5jaXBhbCB0aGF0IENvZGVCdWlsZCB3aWxsIHVzZSB0byBwdWxsIHRoaXMgYnVpbGQgRG9ja2VyIGltYWdlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBJbWFnZVB1bGxQcmluY2lwYWxUeXBlLlNFUlZJQ0VfUk9MRVxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VQdWxsUHJpbmNpcGFsVHlwZT86IEltYWdlUHVsbFByaW5jaXBhbFR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBzZWNyZXRzTWFuYWdlckNyZWRlbnRpYWxzIGZvciBhY2Nlc3MgdG8gYSBwcml2YXRlIHJlZ2lzdHJ5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBubyBjcmVkZW50aWFscyB3aWxsIGJlIHVzZWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3JldHNNYW5hZ2VyQ3JlZGVudGlhbHM/OiBzZWNyZXRzbWFuYWdlci5JU2VjcmV0O1xuXG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBFQ1IgcmVwb3NpdG9yeSB0aGF0IHRoZSBpbWFnZSBpcyBob3N0ZWQgaW4uXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vIHJlcG9zaXRvcnlcbiAgICovXG4gIHJlYWRvbmx5IHJlcG9zaXRvcnk/OiBlY3IuSVJlcG9zaXRvcnk7XG5cbiAgLyoqXG4gICAqIEFsbG93cyB0aGUgaW1hZ2UgYSBjaGFuY2UgdG8gdmFsaWRhdGUgd2hldGhlciB0aGUgcGFzc2VkIGNvbmZpZ3VyYXRpb24gaXMgY29ycmVjdC5cbiAgICpcbiAgICogQHBhcmFtIGJ1aWxkRW52aXJvbm1lbnQgdGhlIGN1cnJlbnQgYnVpbGQgZW52aXJvbm1lbnRcbiAgICovXG4gIHZhbGlkYXRlKGJ1aWxkRW52aXJvbm1lbnQ6IEJ1aWxkRW52aXJvbm1lbnQpOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogTWFrZSBhIGJ1aWxkc3BlYyB0byBydW4gdGhlIGluZGljYXRlZCBzY3JpcHRcbiAgICovXG4gIHJ1blNjcmlwdEJ1aWxkc3BlYyhlbnRyeXBvaW50OiBzdHJpbmcpOiBCdWlsZFNwZWM7XG59XG5cbi8qKiBPcHRpb25hbCBhcmd1bWVudHMgdG8gYElCdWlsZEltYWdlLmJpbmRlcmAgLSBjdXJyZW50bHkgZW1wdHkuICovXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWxkSW1hZ2VCaW5kT3B0aW9ucyB7IH1cblxuLyoqIFRoZSByZXR1cm4gdHlwZSBmcm9tIGBJQnVpbGRJbWFnZS5iaW5kZXJgIC0gY3VycmVudGx5IGVtcHR5LiAqL1xuZXhwb3J0IGludGVyZmFjZSBCdWlsZEltYWdlQ29uZmlnIHsgfVxuXG4vLyBAZGVwcmVjYXRlZChub3QgaW4gdHNkb2Mgb24gcHVycG9zZSk6IGFkZCBiaW5kKCkgdG8gSUJ1aWxkSW1hZ2Vcbi8vIGFuZCBnZXQgcmlkIG9mIElCaW5kYWJsZUJ1aWxkSW1hZ2VcblxuLyoqIEEgdmFyaWFudCBvZiBgSUJ1aWxkSW1hZ2VgIHRoYXQgYWxsb3dzIGJpbmRpbmcgdG8gdGhlIHByb2plY3QuICovXG5leHBvcnQgaW50ZXJmYWNlIElCaW5kYWJsZUJ1aWxkSW1hZ2UgZXh0ZW5kcyBJQnVpbGRJbWFnZSB7XG4gIC8qKiBGdW5jdGlvbiB0aGF0IGFsbG93cyB0aGUgYnVpbGQgaW1hZ2UgYWNjZXNzIHRvIHRoZSBjb25zdHJ1Y3QgdHJlZS4gKi9cbiAgYmluZChzY29wZTogQ29uc3RydWN0LCBwcm9qZWN0OiBJUHJvamVjdCwgb3B0aW9uczogQnVpbGRJbWFnZUJpbmRPcHRpb25zKTogQnVpbGRJbWFnZUNvbmZpZztcbn1cblxuLyoqXG4gKiBUaGUgb3B0aW9ucyB3aGVuIGNyZWF0aW5nIGEgQ29kZUJ1aWxkIERvY2tlciBidWlsZCBpbWFnZVxuICogdXNpbmcgYExpbnV4QnVpbGRJbWFnZS5mcm9tRG9ja2VyUmVnaXN0cnlgXG4gKiBvciBgV2luZG93c0J1aWxkSW1hZ2UuZnJvbURvY2tlclJlZ2lzdHJ5YC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEb2NrZXJJbWFnZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGNyZWRlbnRpYWxzLCBzdG9yZWQgaW4gU2VjcmV0cyBNYW5hZ2VyLFxuICAgKiB1c2VkIGZvciBhY2Nlc3NpbmcgdGhlIHJlcG9zaXRvcnkgaG9sZGluZyB0aGUgaW1hZ2UsXG4gICAqIGlmIHRoZSByZXBvc2l0b3J5IGlzIHByaXZhdGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vIGNyZWRlbnRpYWxzIHdpbGwgYmUgdXNlZCAod2UgYXNzdW1lIHRoZSByZXBvc2l0b3J5IGlzIHB1YmxpYylcbiAgICovXG4gIHJlYWRvbmx5IHNlY3JldHNNYW5hZ2VyQ3JlZGVudGlhbHM/OiBzZWNyZXRzbWFuYWdlci5JU2VjcmV0O1xufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIG9mIGBMaW51eEJ1aWxkSW1hZ2VgLlxuICogTW9kdWxlLXByaXZhdGUsIGFzIHRoZSBjb25zdHJ1Y3RvciBvZiBgTGludXhCdWlsZEltYWdlYCBpcyBwcml2YXRlLlxuICovXG5pbnRlcmZhY2UgTGludXhCdWlsZEltYWdlUHJvcHMge1xuICByZWFkb25seSBpbWFnZUlkOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGltYWdlUHVsbFByaW5jaXBhbFR5cGU/OiBJbWFnZVB1bGxQcmluY2lwYWxUeXBlO1xuICByZWFkb25seSBzZWNyZXRzTWFuYWdlckNyZWRlbnRpYWxzPzogc2VjcmV0c21hbmFnZXIuSVNlY3JldDtcbiAgcmVhZG9ubHkgcmVwb3NpdG9yeT86IGVjci5JUmVwb3NpdG9yeTtcbn1cblxuLy8gS2VlcCBhcm91bmQgdG8gcmVzb2x2ZSBhIGNpcmN1bGFyIGRlcGVuZGVuY3kgdW50aWwgcmVtb3ZpbmcgZGVwcmVjYXRlZCBBUk0gaW1hZ2UgY29uc3RhbnRzIGZyb20gTGludXhCdWlsZEltYWdlXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZHVwbGljYXRlLWltcG9ydHMsIGltcG9ydC9vcmRlclxuaW1wb3J0IHsgTGludXhBcm1CdWlsZEltYWdlIH0gZnJvbSAnLi9saW51eC1hcm0tYnVpbGQtaW1hZ2UnO1xuXG4vKipcbiAqIEEgQ29kZUJ1aWxkIGltYWdlIHJ1bm5pbmcgeDg2LTY0IExpbnV4LlxuICpcbiAqIFRoaXMgY2xhc3MgaGFzIGEgYnVuY2ggb2YgcHVibGljIGNvbnN0YW50cyB0aGF0IHJlcHJlc2VudCB0aGUgbW9zdCBwb3B1bGFyIGltYWdlcy5cbiAqXG4gKiBZb3UgY2FuIGFsc28gc3BlY2lmeSBhIGN1c3RvbSBpbWFnZSB1c2luZyBvbmUgb2YgdGhlIHN0YXRpYyBtZXRob2RzOlxuICpcbiAqIC0gTGludXhCdWlsZEltYWdlLmZyb21Eb2NrZXJSZWdpc3RyeShpbWFnZVssIHsgc2VjcmV0c01hbmFnZXJDcmVkZW50aWFscyB9XSlcbiAqIC0gTGludXhCdWlsZEltYWdlLmZyb21FY3JSZXBvc2l0b3J5KHJlcG9bLCB0YWddKVxuICogLSBMaW51eEJ1aWxkSW1hZ2UuZnJvbUFzc2V0KHBhcmVudCwgaWQsIHByb3BzKVxuICpcbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1lbnYtcmVmLWF2YWlsYWJsZS5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBMaW51eEJ1aWxkSW1hZ2UgaW1wbGVtZW50cyBJQnVpbGRJbWFnZSB7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU1RBTkRBUkRfMV8wID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL3N0YW5kYXJkOjEuMCcpO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNUQU5EQVJEXzJfMCA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9zdGFuZGFyZDoyLjAnKTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTVEFOREFSRF8zXzAgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvc3RhbmRhcmQ6My4wJyk7XG4gIC8qKiBUaGUgYGF3cy9jb2RlYnVpbGQvc3RhbmRhcmQ6NC4wYCBidWlsZCBpbWFnZS4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTVEFOREFSRF80XzAgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvc3RhbmRhcmQ6NC4wJyk7XG4gIC8qKiBUaGUgYGF3cy9jb2RlYnVpbGQvc3RhbmRhcmQ6NS4wYCBidWlsZCBpbWFnZS4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTVEFOREFSRF81XzAgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvc3RhbmRhcmQ6NS4wJyk7XG4gIC8qKiBUaGUgYGF3cy9jb2RlYnVpbGQvc3RhbmRhcmQ6Ni4wYCBidWlsZCBpbWFnZS4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTVEFOREFSRF82XzAgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvc3RhbmRhcmQ6Ni4wJyk7XG5cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTUFaT05fTElOVVhfMiA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9hbWF6b25saW51eDIteDg2XzY0LXN0YW5kYXJkOjEuMCcpO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFNQVpPTl9MSU5VWF8yXzIgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvYW1hem9ubGludXgyLXg4Nl82NC1zdGFuZGFyZDoyLjAnKTtcbiAgLyoqIFRoZSBBbWF6b24gTGludXggMiB4ODZfNjQgc3RhbmRhcmQgaW1hZ2UsIHZlcnNpb24gYDMuMGAuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQU1BWk9OX0xJTlVYXzJfMyA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9hbWF6b25saW51eDIteDg2XzY0LXN0YW5kYXJkOjMuMCcpO1xuICAvKiogVGhlIEFtYXpvbiBMaW51eCAyIHg4Nl82NCBzdGFuZGFyZCBpbWFnZSwgdmVyc2lvbiBgNC4wYC4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTUFaT05fTElOVVhfMl80ID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL2FtYXpvbmxpbnV4Mi14ODZfNjQtc3RhbmRhcmQ6NC4wJyk7XG5cbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBMaW51eEFybUJ1aWxkSW1hZ2UuQU1BWk9OX0xJTlVYXzJfU1RBTkRBUkRfMV8wIGluc3RlYWQuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQU1BWk9OX0xJTlVYXzJfQVJNID0gTGludXhBcm1CdWlsZEltYWdlLkFNQVpPTl9MSU5VWF8yX1NUQU5EQVJEXzFfMDtcbiAgLyoqXG4gICAqIEltYWdlIFwiYXdzL2NvZGVidWlsZC9hbWF6b25saW51eDItYWFyY2g2NC1zdGFuZGFyZDoyLjBcIi5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIExpbnV4QXJtQnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl9TVEFOREFSRF8yXzAgaW5zdGVhZC5cbiAgICogKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTUFaT05fTElOVVhfMl9BUk1fMiA9IExpbnV4QXJtQnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl9TVEFOREFSRF8yXzA7XG5cbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgU1RBTkRBUkRfMl8wYCBhbmQgc3BlY2lmeSBydW50aW1lIGluIGJ1aWxkc3BlYyBydW50aW1lLXZlcnNpb25zIHNlY3Rpb24gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVQlVOVFVfMTRfMDRfQkFTRSA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC91YnVudHUtYmFzZToxNC4wNCcpO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBTVEFOREFSRF8yXzBgIGFuZCBzcGVjaWZ5IHJ1bnRpbWUgaW4gYnVpbGRzcGVjIHJ1bnRpbWUtdmVyc2lvbnMgc2VjdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVCVU5UVV8xNF8wNF9BTkRST0lEX0pBVkE4XzI0XzRfMSA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9hbmRyb2lkLWphdmEtODoyNC40LjEnKTtcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgU1RBTkRBUkRfMl8wYCBhbmQgc3BlY2lmeSBydW50aW1lIGluIGJ1aWxkc3BlYyBydW50aW1lLXZlcnNpb25zIHNlY3Rpb24gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVQlVOVFVfMTRfMDRfQU5EUk9JRF9KQVZBOF8yNl8xXzEgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvYW5kcm9pZC1qYXZhLTg6MjYuMS4xJyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X0RPQ0tFUl8xN18wOV8wID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL2RvY2tlcjoxNy4wOS4wJyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X0RPQ0tFUl8xOF8wOV8wID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL2RvY2tlcjoxOC4wOS4wJyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X0dPTEFOR18xXzEwID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL2dvbGFuZzoxLjEwJyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X0dPTEFOR18xXzExID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL2dvbGFuZzoxLjExJyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X09QRU5fSkRLXzggPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvamF2YTpvcGVuamRrLTgnKTtcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgU1RBTkRBUkRfMl8wYCBhbmQgc3BlY2lmeSBydW50aW1lIGluIGJ1aWxkc3BlYyBydW50aW1lLXZlcnNpb25zIHNlY3Rpb24gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVQlVOVFVfMTRfMDRfT1BFTl9KREtfOSA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9qYXZhOm9wZW5qZGstOScpO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBTVEFOREFSRF8yXzBgIGFuZCBzcGVjaWZ5IHJ1bnRpbWUgaW4gYnVpbGRzcGVjIHJ1bnRpbWUtdmVyc2lvbnMgc2VjdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVCVU5UVV8xNF8wNF9PUEVOX0pES18xMSA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9qYXZhOm9wZW5qZGstMTEnKTtcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgU1RBTkRBUkRfMl8wYCBhbmQgc3BlY2lmeSBydW50aW1lIGluIGJ1aWxkc3BlYyBydW50aW1lLXZlcnNpb25zIHNlY3Rpb24gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVQlVOVFVfMTRfMDRfTk9ERUpTXzEwXzE0XzEgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvbm9kZWpzOjEwLjE0LjEnKTtcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgU1RBTkRBUkRfMl8wYCBhbmQgc3BlY2lmeSBydW50aW1lIGluIGJ1aWxkc3BlYyBydW50aW1lLXZlcnNpb25zIHNlY3Rpb24gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVQlVOVFVfMTRfMDRfTk9ERUpTXzEwXzFfMCA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9ub2RlanM6MTAuMS4wJyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X05PREVKU184XzExXzAgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvbm9kZWpzOjguMTEuMCcpO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBTVEFOREFSRF8yXzBgIGFuZCBzcGVjaWZ5IHJ1bnRpbWUgaW4gYnVpbGRzcGVjIHJ1bnRpbWUtdmVyc2lvbnMgc2VjdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVCVU5UVV8xNF8wNF9OT0RFSlNfNl8zXzEgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvbm9kZWpzOjYuMy4xJyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X1BIUF81XzYgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvcGhwOjUuNicpO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBTVEFOREFSRF8yXzBgIGFuZCBzcGVjaWZ5IHJ1bnRpbWUgaW4gYnVpbGRzcGVjIHJ1bnRpbWUtdmVyc2lvbnMgc2VjdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVCVU5UVV8xNF8wNF9QSFBfN18wID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL3BocDo3LjAnKTtcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgU1RBTkRBUkRfMl8wYCBhbmQgc3BlY2lmeSBydW50aW1lIGluIGJ1aWxkc3BlYyBydW50aW1lLXZlcnNpb25zIHNlY3Rpb24gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVQlVOVFVfMTRfMDRfUEhQXzdfMSA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9waHA6Ny4xJyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X1BZVEhPTl8zXzdfMSA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9weXRob246My43LjEnKTtcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgU1RBTkRBUkRfMl8wYCBhbmQgc3BlY2lmeSBydW50aW1lIGluIGJ1aWxkc3BlYyBydW50aW1lLXZlcnNpb25zIHNlY3Rpb24gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVQlVOVFVfMTRfMDRfUFlUSE9OXzNfNl81ID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL3B5dGhvbjozLjYuNScpO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBTVEFOREFSRF8yXzBgIGFuZCBzcGVjaWZ5IHJ1bnRpbWUgaW4gYnVpbGRzcGVjIHJ1bnRpbWUtdmVyc2lvbnMgc2VjdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVCVU5UVV8xNF8wNF9QWVRIT05fM181XzIgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvcHl0aG9uOjMuNS4yJyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X1BZVEhPTl8zXzRfNSA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9weXRob246My40LjUnKTtcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgU1RBTkRBUkRfMl8wYCBhbmQgc3BlY2lmeSBydW50aW1lIGluIGJ1aWxkc3BlYyBydW50aW1lLXZlcnNpb25zIHNlY3Rpb24gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVQlVOVFVfMTRfMDRfUFlUSE9OXzNfM182ID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL3B5dGhvbjozLjMuNicpO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBTVEFOREFSRF8yXzBgIGFuZCBzcGVjaWZ5IHJ1bnRpbWUgaW4gYnVpbGRzcGVjIHJ1bnRpbWUtdmVyc2lvbnMgc2VjdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVCVU5UVV8xNF8wNF9QWVRIT05fMl83XzEyID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL3B5dGhvbjoyLjcuMTInKTtcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgU1RBTkRBUkRfMl8wYCBhbmQgc3BlY2lmeSBydW50aW1lIGluIGJ1aWxkc3BlYyBydW50aW1lLXZlcnNpb25zIHNlY3Rpb24gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVQlVOVFVfMTRfMDRfUlVCWV8yXzVfMyA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9ydWJ5OjIuNS4zJyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X1JVQllfMl81XzEgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvcnVieToyLjUuMScpO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBTVEFOREFSRF8yXzBgIGFuZCBzcGVjaWZ5IHJ1bnRpbWUgaW4gYnVpbGRzcGVjIHJ1bnRpbWUtdmVyc2lvbnMgc2VjdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVCVU5UVV8xNF8wNF9SVUJZXzJfM18xID0gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKCdhd3MvY29kZWJ1aWxkL3J1Ynk6Mi4zLjEnKTtcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgU1RBTkRBUkRfMl8wYCBhbmQgc3BlY2lmeSBydW50aW1lIGluIGJ1aWxkc3BlYyBydW50aW1lLXZlcnNpb25zIHNlY3Rpb24gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBVQlVOVFVfMTRfMDRfUlVCWV8yXzJfNSA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9ydWJ5OjIuMi41Jyk7XG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYFNUQU5EQVJEXzJfMGAgYW5kIHNwZWNpZnkgcnVudGltZSBpbiBidWlsZHNwZWMgcnVudGltZS12ZXJzaW9ucyBzZWN0aW9uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVUJVTlRVXzE0XzA0X0RPVE5FVF9DT1JFXzFfMSA9IExpbnV4QnVpbGRJbWFnZS5jb2RlQnVpbGRJbWFnZSgnYXdzL2NvZGVidWlsZC9kb3QtbmV0OmNvcmUtMScpO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBTVEFOREFSRF8yXzBgIGFuZCBzcGVjaWZ5IHJ1bnRpbWUgaW4gYnVpbGRzcGVjIHJ1bnRpbWUtdmVyc2lvbnMgc2VjdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVCVU5UVV8xNF8wNF9ET1RORVRfQ09SRV8yXzAgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvZG90LW5ldDpjb3JlLTIuMCcpO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBTVEFOREFSRF8yXzBgIGFuZCBzcGVjaWZ5IHJ1bnRpbWUgaW4gYnVpbGRzcGVjIHJ1bnRpbWUtdmVyc2lvbnMgc2VjdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVCVU5UVV8xNF8wNF9ET1RORVRfQ09SRV8yXzEgPSBMaW51eEJ1aWxkSW1hZ2UuY29kZUJ1aWxkSW1hZ2UoJ2F3cy9jb2RlYnVpbGQvZG90LW5ldDpjb3JlLTIuMScpO1xuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBhIHg4Ni02NCBMaW51eCBidWlsZCBpbWFnZSBmcm9tIGEgRG9ja2VyIEh1YiBpbWFnZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbURvY2tlclJlZ2lzdHJ5KG5hbWU6IHN0cmluZywgb3B0aW9uczogRG9ja2VySW1hZ2VPcHRpb25zID0ge30pOiBJQnVpbGRJbWFnZSB7XG4gICAgcmV0dXJuIG5ldyBMaW51eEJ1aWxkSW1hZ2Uoe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGltYWdlSWQ6IG5hbWUsXG4gICAgICBpbWFnZVB1bGxQcmluY2lwYWxUeXBlOiBJbWFnZVB1bGxQcmluY2lwYWxUeXBlLlNFUlZJQ0VfUk9MRSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBBIHg4Ni02NCBMaW51eCBidWlsZCBpbWFnZSBmcm9tIGFuIEVDUiByZXBvc2l0b3J5LlxuICAgKlxuICAgKiBOT1RFOiBpZiB0aGUgcmVwb3NpdG9yeSBpcyBleHRlcm5hbCAoaS5lLiBpbXBvcnRlZCksIHRoZW4gd2Ugd29uJ3QgYmUgYWJsZSB0byBhZGRcbiAgICogYSByZXNvdXJjZSBwb2xpY3kgc3RhdGVtZW50IGZvciBpdCBzbyBDb2RlQnVpbGQgY2FuIHB1bGwgdGhlIGltYWdlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9zYW1wbGUtZWNyLmh0bWxcbiAgICpcbiAgICogQHBhcmFtIHJlcG9zaXRvcnkgVGhlIEVDUiByZXBvc2l0b3J5XG4gICAqIEBwYXJhbSB0YWdPckRpZ2VzdCBJbWFnZSB0YWcgb3IgZGlnZXN0IChkZWZhdWx0IFwibGF0ZXN0XCIsIGRpZ2VzdHMgbXVzdCBzdGFydCB3aXRoIGBzaGEyNTY6YClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUVjclJlcG9zaXRvcnkocmVwb3NpdG9yeTogZWNyLklSZXBvc2l0b3J5LCB0YWdPckRpZ2VzdDogc3RyaW5nID0gJ2xhdGVzdCcpOiBJQnVpbGRJbWFnZSB7XG4gICAgcmV0dXJuIG5ldyBMaW51eEJ1aWxkSW1hZ2Uoe1xuICAgICAgaW1hZ2VJZDogcmVwb3NpdG9yeS5yZXBvc2l0b3J5VXJpRm9yVGFnT3JEaWdlc3QodGFnT3JEaWdlc3QpLFxuICAgICAgaW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTogSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZS5TRVJWSUNFX1JPTEUsXG4gICAgICByZXBvc2l0b3J5LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZXMgYW4gRG9ja2VyIGltYWdlIGFzc2V0IGFzIGEgeDg2LTY0IExpbnV4IGJ1aWxkIGltYWdlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXNzZXQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IERvY2tlckltYWdlQXNzZXRQcm9wcyk6IElCdWlsZEltYWdlIHtcbiAgICBjb25zdCBhc3NldCA9IG5ldyBEb2NrZXJJbWFnZUFzc2V0KHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIHJldHVybiBuZXcgTGludXhCdWlsZEltYWdlKHtcbiAgICAgIGltYWdlSWQ6IGFzc2V0LmltYWdlVXJpLFxuICAgICAgaW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTogSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZS5TRVJWSUNFX1JPTEUsXG4gICAgICByZXBvc2l0b3J5OiBhc3NldC5yZXBvc2l0b3J5LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZXMgYSBEb2NrZXIgaW1hZ2UgcHJvdmlkZWQgYnkgQ29kZUJ1aWxkLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIERvY2tlciBpbWFnZSBwcm92aWRlZCBieSBDb2RlQnVpbGQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL2J1aWxkLWVudi1yZWYtYXZhaWxhYmxlLmh0bWxcbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBpbWFnZSBpZGVudGlmaWVyXG4gICAqIEBleGFtcGxlICdhd3MvY29kZWJ1aWxkL3N0YW5kYXJkOjQuMCdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNvZGVCdWlsZEltYWdlSWQoaWQ6IHN0cmluZyk6IElCdWlsZEltYWdlIHtcbiAgICByZXR1cm4gTGludXhCdWlsZEltYWdlLmNvZGVCdWlsZEltYWdlKGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGNvZGVCdWlsZEltYWdlKG5hbWU6IHN0cmluZyk6IElCdWlsZEltYWdlIHtcbiAgICByZXR1cm4gbmV3IExpbnV4QnVpbGRJbWFnZSh7XG4gICAgICBpbWFnZUlkOiBuYW1lLFxuICAgICAgaW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTogSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZS5DT0RFQlVJTEQsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgdHlwZSA9ICdMSU5VWF9DT05UQUlORVInO1xuICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdENvbXB1dGVUeXBlID0gQ29tcHV0ZVR5cGUuU01BTEw7XG4gIHB1YmxpYyByZWFkb25seSBpbWFnZUlkOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBpbWFnZVB1bGxQcmluY2lwYWxUeXBlPzogSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTtcbiAgcHVibGljIHJlYWRvbmx5IHNlY3JldHNNYW5hZ2VyQ3JlZGVudGlhbHM/OiBzZWNyZXRzbWFuYWdlci5JU2VjcmV0O1xuICBwdWJsaWMgcmVhZG9ubHkgcmVwb3NpdG9yeT86IGVjci5JUmVwb3NpdG9yeTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByb3BzOiBMaW51eEJ1aWxkSW1hZ2VQcm9wcykge1xuICAgIHRoaXMuaW1hZ2VJZCA9IHByb3BzLmltYWdlSWQ7XG4gICAgdGhpcy5pbWFnZVB1bGxQcmluY2lwYWxUeXBlID0gcHJvcHMuaW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTtcbiAgICB0aGlzLnNlY3JldHNNYW5hZ2VyQ3JlZGVudGlhbHMgPSBwcm9wcy5zZWNyZXRzTWFuYWdlckNyZWRlbnRpYWxzO1xuICAgIHRoaXMucmVwb3NpdG9yeSA9IHByb3BzLnJlcG9zaXRvcnk7XG4gIH1cblxuICBwdWJsaWMgdmFsaWRhdGUoXzogQnVpbGRFbnZpcm9ubWVudCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwdWJsaWMgcnVuU2NyaXB0QnVpbGRzcGVjKGVudHJ5cG9pbnQ6IHN0cmluZyk6IEJ1aWxkU3BlYyB7XG4gICAgcmV0dXJuIHJ1blNjcmlwdExpbnV4QnVpbGRTcGVjKGVudHJ5cG9pbnQpO1xuICB9XG59XG5cbi8qKlxuICogRW52aXJvbm1lbnQgdHlwZSBmb3IgV2luZG93cyBEb2NrZXIgaW1hZ2VzXG4gKi9cbmV4cG9ydCBlbnVtIFdpbmRvd3NJbWFnZVR5cGUge1xuICAvKipcbiAgICogVGhlIHN0YW5kYXJkIGVudmlyb25tZW50IHR5cGUsIFdJTkRPV1NfQ09OVEFJTkVSXG4gICAqL1xuICBTVEFOREFSRCA9ICdXSU5ET1dTX0NPTlRBSU5FUicsXG5cbiAgLyoqXG4gICAqIFRoZSBXSU5ET1dTX1NFUlZFUl8yMDE5X0NPTlRBSU5FUiBlbnZpcm9ubWVudCB0eXBlXG4gICAqL1xuICBTRVJWRVJfMjAxOSA9ICdXSU5ET1dTX1NFUlZFUl8yMDE5X0NPTlRBSU5FUidcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiBgV2luZG93c0J1aWxkSW1hZ2VgLlxuICogTW9kdWxlLXByaXZhdGUsIGFzIHRoZSBjb25zdHJ1Y3RvciBvZiBgV2luZG93c0J1aWxkSW1hZ2VgIGlzIHByaXZhdGUuXG4gKi9cbmludGVyZmFjZSBXaW5kb3dzQnVpbGRJbWFnZVByb3BzIHtcbiAgcmVhZG9ubHkgaW1hZ2VJZDogc3RyaW5nO1xuICByZWFkb25seSBpbWFnZVB1bGxQcmluY2lwYWxUeXBlPzogSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTtcbiAgcmVhZG9ubHkgc2VjcmV0c01hbmFnZXJDcmVkZW50aWFscz86IHNlY3JldHNtYW5hZ2VyLklTZWNyZXQ7XG4gIHJlYWRvbmx5IHJlcG9zaXRvcnk/OiBlY3IuSVJlcG9zaXRvcnk7XG4gIHJlYWRvbmx5IGltYWdlVHlwZT86IFdpbmRvd3NJbWFnZVR5cGU7XG59XG5cbi8qKlxuICogQSBDb2RlQnVpbGQgaW1hZ2UgcnVubmluZyBXaW5kb3dzLlxuICpcbiAqIFRoaXMgY2xhc3MgaGFzIGEgYnVuY2ggb2YgcHVibGljIGNvbnN0YW50cyB0aGF0IHJlcHJlc2VudCB0aGUgbW9zdCBwb3B1bGFyIGltYWdlcy5cbiAqXG4gKiBZb3UgY2FuIGFsc28gc3BlY2lmeSBhIGN1c3RvbSBpbWFnZSB1c2luZyBvbmUgb2YgdGhlIHN0YXRpYyBtZXRob2RzOlxuICpcbiAqIC0gV2luZG93c0J1aWxkSW1hZ2UuZnJvbURvY2tlclJlZ2lzdHJ5KGltYWdlWywgeyBzZWNyZXRzTWFuYWdlckNyZWRlbnRpYWxzIH0sIGltYWdlVHlwZV0pXG4gKiAtIFdpbmRvd3NCdWlsZEltYWdlLmZyb21FY3JSZXBvc2l0b3J5KHJlcG9bLCB0YWcsIGltYWdlVHlwZV0pXG4gKiAtIFdpbmRvd3NCdWlsZEltYWdlLmZyb21Bc3NldChwYXJlbnQsIGlkLCBwcm9wcywgWywgaW1hZ2VUeXBlXSlcbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1lbnYtcmVmLWF2YWlsYWJsZS5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBXaW5kb3dzQnVpbGRJbWFnZSBpbXBsZW1lbnRzIElCdWlsZEltYWdlIHtcbiAgLyoqXG4gICAqIENvcnJlc3BvbmRzIHRvIHRoZSBzdGFuZGFyZCBDb2RlQnVpbGQgaW1hZ2UgYGF3cy9jb2RlYnVpbGQvd2luZG93cy1iYXNlOjEuMGAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIGBXaW5kb3dzQnVpbGRJbWFnZS5XSU5ET1dTX0JBU0VfMl8wYCBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBXSU5fU0VSVkVSX0NPUkVfMjAxNl9CQVNFOiBJQnVpbGRJbWFnZSA9IG5ldyBXaW5kb3dzQnVpbGRJbWFnZSh7XG4gICAgaW1hZ2VJZDogJ2F3cy9jb2RlYnVpbGQvd2luZG93cy1iYXNlOjEuMCcsXG4gICAgaW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTogSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZS5DT0RFQlVJTEQsXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhbmRhcmQgQ29kZUJ1aWxkIGltYWdlIGBhd3MvY29kZWJ1aWxkL3dpbmRvd3MtYmFzZToyLjBgLCB3aGljaCBpc1xuICAgKiBiYXNlZCBvZmYgV2luZG93cyBTZXJ2ZXIgQ29yZSAyMDE2LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBXSU5ET1dTX0JBU0VfMl8wOiBJQnVpbGRJbWFnZSA9IG5ldyBXaW5kb3dzQnVpbGRJbWFnZSh7XG4gICAgaW1hZ2VJZDogJ2F3cy9jb2RlYnVpbGQvd2luZG93cy1iYXNlOjIuMCcsXG4gICAgaW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTogSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZS5DT0RFQlVJTEQsXG4gIH0pO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhbmRhcmQgQ29kZUJ1aWxkIGltYWdlIGBhd3MvY29kZWJ1aWxkL3dpbmRvd3MtYmFzZToyMDE5LTEuMGAsIHdoaWNoIGlzXG4gICAqIGJhc2VkIG9mZiBXaW5kb3dzIFNlcnZlciBDb3JlIDIwMTkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFdJTl9TRVJWRVJfQ09SRV8yMDE5X0JBU0U6IElCdWlsZEltYWdlID0gbmV3IFdpbmRvd3NCdWlsZEltYWdlKHtcbiAgICBpbWFnZUlkOiAnYXdzL2NvZGVidWlsZC93aW5kb3dzLWJhc2U6MjAxOS0xLjAnLFxuICAgIGltYWdlUHVsbFByaW5jaXBhbFR5cGU6IEltYWdlUHVsbFByaW5jaXBhbFR5cGUuQ09ERUJVSUxELFxuICAgIGltYWdlVHlwZTogV2luZG93c0ltYWdlVHlwZS5TRVJWRVJfMjAxOSxcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGFuZGFyZCBDb2RlQnVpbGQgaW1hZ2UgYGF3cy9jb2RlYnVpbGQvd2luZG93cy1iYXNlOjIwMTktMi4wYCwgd2hpY2ggaXNcbiAgICogYmFzZWQgb2ZmIFdpbmRvd3MgU2VydmVyIENvcmUgMjAxOS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgV0lOX1NFUlZFUl9DT1JFXzIwMTlfQkFTRV8yXzA6IElCdWlsZEltYWdlID0gbmV3IFdpbmRvd3NCdWlsZEltYWdlKHtcbiAgICBpbWFnZUlkOiAnYXdzL2NvZGVidWlsZC93aW5kb3dzLWJhc2U6MjAxOS0yLjAnLFxuICAgIGltYWdlUHVsbFByaW5jaXBhbFR5cGU6IEltYWdlUHVsbFByaW5jaXBhbFR5cGUuQ09ERUJVSUxELFxuICAgIGltYWdlVHlwZTogV2luZG93c0ltYWdlVHlwZS5TRVJWRVJfMjAxOSxcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIGEgV2luZG93cyBidWlsZCBpbWFnZSBmcm9tIGEgRG9ja2VyIEh1YiBpbWFnZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbURvY2tlclJlZ2lzdHJ5KFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBvcHRpb25zOiBEb2NrZXJJbWFnZU9wdGlvbnMgPSB7fSxcbiAgICBpbWFnZVR5cGU6IFdpbmRvd3NJbWFnZVR5cGUgPSBXaW5kb3dzSW1hZ2VUeXBlLlNUQU5EQVJEKTogSUJ1aWxkSW1hZ2Uge1xuXG4gICAgcmV0dXJuIG5ldyBXaW5kb3dzQnVpbGRJbWFnZSh7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgaW1hZ2VJZDogbmFtZSxcbiAgICAgIGltYWdlUHVsbFByaW5jaXBhbFR5cGU6IEltYWdlUHVsbFByaW5jaXBhbFR5cGUuU0VSVklDRV9ST0xFLFxuICAgICAgaW1hZ2VUeXBlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIEEgV2luZG93cyBidWlsZCBpbWFnZSBmcm9tIGFuIEVDUiByZXBvc2l0b3J5LlxuICAgKlxuICAgKiBOT1RFOiBpZiB0aGUgcmVwb3NpdG9yeSBpcyBleHRlcm5hbCAoaS5lLiBpbXBvcnRlZCksIHRoZW4gd2Ugd29uJ3QgYmUgYWJsZSB0byBhZGRcbiAgICogYSByZXNvdXJjZSBwb2xpY3kgc3RhdGVtZW50IGZvciBpdCBzbyBDb2RlQnVpbGQgY2FuIHB1bGwgdGhlIGltYWdlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9zYW1wbGUtZWNyLmh0bWxcbiAgICpcbiAgICogQHBhcmFtIHJlcG9zaXRvcnkgVGhlIEVDUiByZXBvc2l0b3J5XG4gICAqIEBwYXJhbSB0YWdPckRpZ2VzdCBJbWFnZSB0YWcgb3IgZGlnZXN0IChkZWZhdWx0IFwibGF0ZXN0XCIsIGRpZ2VzdHMgbXVzdCBzdGFydCB3aXRoIGBzaGEyNTY6YClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUVjclJlcG9zaXRvcnkoXG4gICAgcmVwb3NpdG9yeTogZWNyLklSZXBvc2l0b3J5LFxuICAgIHRhZ09yRGlnZXN0OiBzdHJpbmcgPSAnbGF0ZXN0JyxcbiAgICBpbWFnZVR5cGU6IFdpbmRvd3NJbWFnZVR5cGUgPSBXaW5kb3dzSW1hZ2VUeXBlLlNUQU5EQVJEKTogSUJ1aWxkSW1hZ2Uge1xuXG4gICAgcmV0dXJuIG5ldyBXaW5kb3dzQnVpbGRJbWFnZSh7XG4gICAgICBpbWFnZUlkOiByZXBvc2l0b3J5LnJlcG9zaXRvcnlVcmlGb3JUYWdPckRpZ2VzdCh0YWdPckRpZ2VzdCksXG4gICAgICBpbWFnZVB1bGxQcmluY2lwYWxUeXBlOiBJbWFnZVB1bGxQcmluY2lwYWxUeXBlLlNFUlZJQ0VfUk9MRSxcbiAgICAgIGltYWdlVHlwZSxcbiAgICAgIHJlcG9zaXRvcnksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlcyBhbiBEb2NrZXIgaW1hZ2UgYXNzZXQgYXMgYSBXaW5kb3dzIGJ1aWxkIGltYWdlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXNzZXQoXG4gICAgc2NvcGU6IENvbnN0cnVjdCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHByb3BzOiBEb2NrZXJJbWFnZUFzc2V0UHJvcHMsXG4gICAgaW1hZ2VUeXBlOiBXaW5kb3dzSW1hZ2VUeXBlID0gV2luZG93c0ltYWdlVHlwZS5TVEFOREFSRCk6IElCdWlsZEltYWdlIHtcblxuICAgIGNvbnN0IGFzc2V0ID0gbmV3IERvY2tlckltYWdlQXNzZXQoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgcmV0dXJuIG5ldyBXaW5kb3dzQnVpbGRJbWFnZSh7XG4gICAgICBpbWFnZUlkOiBhc3NldC5pbWFnZVVyaSxcbiAgICAgIGltYWdlUHVsbFByaW5jaXBhbFR5cGU6IEltYWdlUHVsbFByaW5jaXBhbFR5cGUuU0VSVklDRV9ST0xFLFxuICAgICAgaW1hZ2VUeXBlLFxuICAgICAgcmVwb3NpdG9yeTogYXNzZXQucmVwb3NpdG9yeSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q29tcHV0ZVR5cGUgPSBDb21wdXRlVHlwZS5NRURJVU07XG4gIHB1YmxpYyByZWFkb25seSBpbWFnZUlkOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBpbWFnZVB1bGxQcmluY2lwYWxUeXBlPzogSW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTtcbiAgcHVibGljIHJlYWRvbmx5IHNlY3JldHNNYW5hZ2VyQ3JlZGVudGlhbHM/OiBzZWNyZXRzbWFuYWdlci5JU2VjcmV0O1xuICBwdWJsaWMgcmVhZG9ubHkgcmVwb3NpdG9yeT86IGVjci5JUmVwb3NpdG9yeTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByb3BzOiBXaW5kb3dzQnVpbGRJbWFnZVByb3BzKSB7XG4gICAgdGhpcy50eXBlID0gKHByb3BzLmltYWdlVHlwZSA/PyBXaW5kb3dzSW1hZ2VUeXBlLlNUQU5EQVJEKS50b1N0cmluZygpO1xuICAgIHRoaXMuaW1hZ2VJZCA9IHByb3BzLmltYWdlSWQ7XG4gICAgdGhpcy5pbWFnZVB1bGxQcmluY2lwYWxUeXBlID0gcHJvcHMuaW1hZ2VQdWxsUHJpbmNpcGFsVHlwZTtcbiAgICB0aGlzLnNlY3JldHNNYW5hZ2VyQ3JlZGVudGlhbHMgPSBwcm9wcy5zZWNyZXRzTWFuYWdlckNyZWRlbnRpYWxzO1xuICAgIHRoaXMucmVwb3NpdG9yeSA9IHByb3BzLnJlcG9zaXRvcnk7XG4gIH1cblxuICBwdWJsaWMgdmFsaWRhdGUoYnVpbGRFbnZpcm9ubWVudDogQnVpbGRFbnZpcm9ubWVudCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCByZXQ6IHN0cmluZ1tdID0gW107XG4gICAgaWYgKGJ1aWxkRW52aXJvbm1lbnQuY29tcHV0ZVR5cGUgPT09IENvbXB1dGVUeXBlLlNNQUxMKSB7XG4gICAgICByZXQucHVzaCgnV2luZG93cyBpbWFnZXMgZG8gbm90IHN1cHBvcnQgdGhlIFNtYWxsIENvbXB1dGVUeXBlJyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBwdWJsaWMgcnVuU2NyaXB0QnVpbGRzcGVjKGVudHJ5cG9pbnQ6IHN0cmluZyk6IEJ1aWxkU3BlYyB7XG4gICAgcmV0dXJuIEJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgIHZlcnNpb246ICcwLjInLFxuICAgICAgcGhhc2VzOiB7XG4gICAgICAgIHByZV9idWlsZDoge1xuICAgICAgICAgIC8vIFdvdWxkIGxvdmUgdG8gZG8gZG93bmxvYWRpbmcgaGVyZSBhbmQgZXhlY3V0aW5nIGluIHRoZSBuZXh0IHN0ZXAsXG4gICAgICAgICAgLy8gYnV0IEkgZG9uJ3Qga25vdyBob3cgdG8gcHJvcGFnYXRlIHRoZSB2YWx1ZSBvZiAkVEVNUERJUi5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIFB1bnRpbmcgZm9yIHNvbWVvbmUgd2hvIGtub3dzIFBvd2VyU2hlbGwgd2VsbCBlbm91Z2guXG4gICAgICAgICAgY29tbWFuZHM6IFtdLFxuICAgICAgICB9LFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnU2V0LVZhcmlhYmxlIC1OYW1lIFRFTVBESVIgLVZhbHVlIChOZXctVGVtcG9yYXJ5RmlsZSkuRGlyZWN0b3J5TmFtZScsXG4gICAgICAgICAgICBgYXdzIHMzIGNwIHMzOi8vJGVudjoke1MzX0JVQ0tFVF9FTlZ9LyRlbnY6JHtTM19LRVlfRU5WfSAkVEVNUERJUlxcXFxzY3JpcHRzLnppcGAsXG4gICAgICAgICAgICAnTmV3LUl0ZW0gLUl0ZW1UeXBlIERpcmVjdG9yeSAtUGF0aCAkVEVNUERJUlxcXFxzY3JpcHRkaXInLFxuICAgICAgICAgICAgJ0V4cGFuZC1BcmNoaXZlIC1QYXRoICRURU1QRElSL3NjcmlwdHMuemlwIC1EZXN0aW5hdGlvblBhdGggJFRFTVBESVJcXFxcc2NyaXB0ZGlyJyxcbiAgICAgICAgICAgICckZW52OlNDUklQVF9ESVIgPSBcIiRURU1QRElSXFxcXHNjcmlwdGRpclwiJyxcbiAgICAgICAgICAgIGAmICRURU1QRElSXFxcXHNjcmlwdGRpclxcXFwke2VudHJ5cG9pbnR9YCxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZSB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBlbnZpcm9ubWVudCB2YXJpYWJsZS5cbiAgICogQGRlZmF1bHQgUGxhaW5UZXh0XG4gICAqL1xuICByZWFkb25seSB0eXBlPzogQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZTtcblxuICAvKipcbiAgICogVGhlIHZhbHVlIG9mIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZS5cbiAgICogRm9yIHBsYWluLXRleHQgdmFyaWFibGVzICh0aGUgZGVmYXVsdCksIHRoaXMgaXMgdGhlIGxpdGVyYWwgdmFsdWUgb2YgdmFyaWFibGUuXG4gICAqIEZvciBTU00gcGFyYW1ldGVyIHZhcmlhYmxlcywgcGFzcyB0aGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyIGhlcmUgKGBwYXJhbWV0ZXJOYW1lYCBwcm9wZXJ0eSBvZiBgSVBhcmFtZXRlcmApLlxuICAgKiBGb3IgU2VjcmV0c01hbmFnZXIgdmFyaWFibGVzIHNlY3JldHMsIHBhc3MgZWl0aGVyIHRoZSBzZWNyZXQgbmFtZSAoYHNlY3JldE5hbWVgIHByb3BlcnR5IG9mIGBJU2VjcmV0YClcbiAgICogb3IgdGhlIHNlY3JldCBBUk4gKGBzZWNyZXRBcm5gIHByb3BlcnR5IG9mIGBJU2VjcmV0YCkgaGVyZSxcbiAgICogYWxvbmcgd2l0aCBvcHRpb25hbCBTZWNyZXRzTWFuYWdlciBxdWFsaWZpZXJzIHNlcGFyYXRlZCBieSAnOicsIGxpa2UgdGhlIEpTT04ga2V5LCBvciB0aGUgdmVyc2lvbiBvciBzdGFnZVxuICAgKiAoc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1zcGVjLXJlZi5odG1sI2J1aWxkLXNwZWMuZW52LnNlY3JldHMtbWFuYWdlciBmb3IgZGV0YWlscykuXG4gICAqL1xuICByZWFkb25seSB2YWx1ZTogYW55O1xufVxuXG5leHBvcnQgZW51bSBCdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlIHtcbiAgLyoqXG4gICAqIEFuIGVudmlyb25tZW50IHZhcmlhYmxlIGluIHBsYWludGV4dCBmb3JtYXQuXG4gICAqL1xuICBQTEFJTlRFWFQgPSAnUExBSU5URVhUJyxcblxuICAvKipcbiAgICogQW4gZW52aXJvbm1lbnQgdmFyaWFibGUgc3RvcmVkIGluIFN5c3RlbXMgTWFuYWdlciBQYXJhbWV0ZXIgU3RvcmUuXG4gICAqL1xuICBQQVJBTUVURVJfU1RPUkUgPSAnUEFSQU1FVEVSX1NUT1JFJyxcblxuICAvKipcbiAgICogQW4gZW52aXJvbm1lbnQgdmFyaWFibGUgc3RvcmVkIGluIEFXUyBTZWNyZXRzIE1hbmFnZXIuXG4gICAqL1xuICBTRUNSRVRTX01BTkFHRVIgPSAnU0VDUkVUU19NQU5BR0VSJ1xufVxuXG4vKipcbiAqIFRoZSBsaXN0IG9mIGV2ZW50IHR5cGVzIGZvciBBV1MgQ29kZWJ1aWxkXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9kdGNvbnNvbGUvbGF0ZXN0L3VzZXJndWlkZS9jb25jZXB0cy5odG1sI2V2ZW50cy1yZWYtYnVpbGRwcm9qZWN0XG4gKi9cbmV4cG9ydCBlbnVtIFByb2plY3ROb3RpZmljYXRpb25FdmVudHMge1xuICAvKipcbiAgICogVHJpZ2dlciBub3RpZmljYXRpb24gd2hlbiBwcm9qZWN0IGJ1aWxkIHN0YXRlIGZhaWxlZFxuICAgKi9cbiAgQlVJTERfRkFJTEVEID0gJ2NvZGVidWlsZC1wcm9qZWN0LWJ1aWxkLXN0YXRlLWZhaWxlZCcsXG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgbm90aWZpY2F0aW9uIHdoZW4gcHJvamVjdCBidWlsZCBzdGF0ZSBzdWNjZWVkZWRcbiAgICovXG4gIEJVSUxEX1NVQ0NFRURFRCA9ICdjb2RlYnVpbGQtcHJvamVjdC1idWlsZC1zdGF0ZS1zdWNjZWVkZWQnLFxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIG5vdGlmaWNhdGlvbiB3aGVuIHByb2plY3QgYnVpbGQgc3RhdGUgaW4gcHJvZ3Jlc3NcbiAgICovXG4gIEJVSUxEX0lOX1BST0dSRVNTID0gJ2NvZGVidWlsZC1wcm9qZWN0LWJ1aWxkLXN0YXRlLWluLXByb2dyZXNzJyxcblxuICAvKipcbiAgICogVHJpZ2dlciBub3RpZmljYXRpb24gd2hlbiBwcm9qZWN0IGJ1aWxkIHN0YXRlIHN0b3BwZWRcbiAgICovXG4gIEJVSUxEX1NUT1BQRUQgPSAnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtc3RhdGUtc3RvcHBlZCcsXG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgbm90aWZpY2F0aW9uIHdoZW4gcHJvamVjdCBidWlsZCBwaGFzZSBmYWlsdXJlXG4gICAqL1xuICBCVUlMRF9QSEFTRV9GQUlMRUQgPSAnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtcGhhc2UtZmFpbHVyZScsXG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgbm90aWZpY2F0aW9uIHdoZW4gcHJvamVjdCBidWlsZCBwaGFzZSBzdWNjZXNzXG4gICAqL1xuICBCVUlMRF9QSEFTRV9TVUNDRUVERUQgPSAnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtcGhhc2Utc3VjY2VzcycsXG59XG5cbmZ1bmN0aW9uIGlzQmluZGFibGVCdWlsZEltYWdlKHg6IHVua25vd24pOiB4IGlzIElCaW5kYWJsZUJ1aWxkSW1hZ2Uge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnICYmICEheCAmJiAhISh4IGFzIGFueSkuYmluZDtcbn1cbiJdfQ==