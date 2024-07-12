"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationSource = exports.ConfigurationContent = exports.LambdaValidator = exports.JsonSchemaValidator = exports.ConfigurationSourceType = exports.ValidatorType = exports.ConfigurationType = exports.SourcedConfiguration = exports.HostedConfiguration = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_appconfig_1 = require("aws-cdk-lib/aws-appconfig");
const iam = require("aws-cdk-lib/aws-iam");
const constructs_1 = require("constructs");
const mimeTypes = require("mime-types");
const deployment_strategy_1 = require("./deployment-strategy");
const extension_1 = require("./extension");
const hash_1 = require("./private/hash");
class ConfigurationBase extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.name = props.name || aws_cdk_lib_1.Names.uniqueResourceName(this, {
            maxLength: 128,
            separator: '-',
        });
        this.application = props.application;
        this.applicationId = this.application.applicationId;
        this.type = props.type;
        this.validators = props.validators;
        this.description = props.description;
        this.deployTo = props.deployTo;
        this.deploymentKey = props.deploymentKey;
        this.deploymentStrategy = props.deploymentStrategy || new deployment_strategy_1.DeploymentStrategy(this, 'DeploymentStrategy', {
            rolloutStrategy: deployment_strategy_1.RolloutStrategy.CANARY_10_PERCENT_20_MINUTES,
        });
    }
    /**
     * Adds an extension defined by the action point and event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param actionPoint The action point which triggers the event
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    on(actionPoint, eventDestination, options) {
        this.extensible.on(actionPoint, eventDestination, options);
    }
    /**
     * Adds a PRE_CREATE_HOSTED_CONFIGURATION_VERSION extension with the
     * provided event destination and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preCreateHostedConfigurationVersion(eventDestination, options) {
        this.extensible.preCreateHostedConfigurationVersion(eventDestination, options);
    }
    /**
     * Adds a PRE_START_DEPLOYMENT extension with the provided event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preStartDeployment(eventDestination, options) {
        this.extensible.preStartDeployment(eventDestination, options);
    }
    /**
     * Adds an ON_DEPLOYMENT_START extension with the provided event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStart(eventDestination, options) {
        this.extensible.onDeploymentStart(eventDestination, options);
    }
    /**
     * Adds an ON_DEPLOYMENT_STEP extension with the provided event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStep(eventDestination, options) {
        this.extensible.onDeploymentStep(eventDestination, options);
    }
    /**
     * Adds an ON_DEPLOYMENT_BAKING extension with the provided event destination and
     * also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentBaking(eventDestination, options) {
        this.extensible.onDeploymentBaking(eventDestination, options);
    }
    /**
     * Adds an ON_DEPLOYMENT_COMPLETE extension with the provided event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentComplete(eventDestination, options) {
        this.extensible.onDeploymentComplete(eventDestination, options);
    }
    /**
     * Adds an ON_DEPLOYMENT_ROLLED_BACK extension with the provided event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentRolledBack(eventDestination, options) {
        this.extensible.onDeploymentRolledBack(eventDestination, options);
    }
    /**
     * Adds an extension association to the configuration profile.
     *
     * @param extension The extension to create an association for
     */
    addExtension(extension) {
        this.extensible.addExtension(extension);
    }
    /**
     * Deploys the configuration to the specified environment.
     *
     * @param environment The environment to deploy the configuration to
     * @deprecated Use `deployTo` as a property instead. We do not recommend
     * creating resources in multiple stacks. If you want to do this still,
     * please take a look into https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_appconfig.CfnDeployment.html.
     */
    deploy(environment) {
        new aws_appconfig_1.CfnDeployment(this, `Deployment${(0, hash_1.getHash)(environment.name)}`, {
            applicationId: this.application.applicationId,
            configurationProfileId: this.configurationProfileId,
            deploymentStrategyId: this.deploymentStrategy.deploymentStrategyId,
            environmentId: environment.environmentId,
            configurationVersion: this.versionNumber,
            description: this.description,
            kmsKeyIdentifier: this.deploymentKey?.keyArn,
        });
    }
    addExistingEnvironmentsToApplication() {
        this.deployTo?.forEach((environment) => {
            if (!this.application.environments.includes(environment)) {
                this.application.addExistingEnvironment(environment);
            }
        });
    }
    deployConfigToEnvironments() {
        if (!this.deployTo || !this.versionNumber) {
            return;
        }
        this.application.environments.forEach((environment) => {
            if ((this.deployTo && !this.deployTo.includes(environment))) {
                return;
            }
            this.deploy(environment);
        });
    }
}
/**
 * A hosted configuration represents configuration stored in the AWS AppConfig hosted configuration store.
 */
class HostedConfiguration extends ConfigurationBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.HostedConfiguration", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_HostedConfigurationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, HostedConfiguration);
            }
            throw error;
        }
        this._cfnConfigurationProfile = new aws_appconfig_1.CfnConfigurationProfile(this, 'ConfigurationProfile', {
            applicationId: this.applicationId,
            locationUri: 'hosted',
            name: this.name,
            description: this.description,
            type: this.type,
            validators: this.validators,
        });
        this.configurationProfileId = this._cfnConfigurationProfile.ref;
        this.configurationProfileArn = aws_cdk_lib_1.Stack.of(this).formatArn({
            service: 'appconfig',
            resource: 'application',
            resourceName: `${this.applicationId}/configurationprofile/${this.configurationProfileId}`,
        });
        this.extensible = new extension_1.ExtensibleBase(this, this.configurationProfileArn, this.name);
        this.content = props.content.content;
        this.contentType = props.content.contentType;
        this.latestVersionNumber = props.latestVersionNumber;
        this.versionLabel = props.versionLabel;
        this._cfnHostedConfigurationVersion = new aws_appconfig_1.CfnHostedConfigurationVersion(this, 'Resource', {
            applicationId: this.applicationId,
            configurationProfileId: this.configurationProfileId,
            content: this.content,
            contentType: this.contentType,
            description: this.description,
            latestVersionNumber: this.latestVersionNumber,
            versionLabel: this.versionLabel,
        });
        this._cfnHostedConfigurationVersion.applyRemovalPolicy(aws_cdk_lib_1.RemovalPolicy.RETAIN);
        this.versionNumber = this._cfnHostedConfigurationVersion.ref;
        this.hostedConfigurationVersionArn = aws_cdk_lib_1.Stack.of(this).formatArn({
            service: 'appconfig',
            resource: 'application',
            resourceName: `${this.applicationId}/configurationprofile/${this.configurationProfileId}/hostedconfigurationversion/${this.versionNumber}`,
        });
        this.addExistingEnvironmentsToApplication();
        this.deployConfigToEnvironments();
    }
}
exports.HostedConfiguration = HostedConfiguration;
_a = JSII_RTTI_SYMBOL_1;
HostedConfiguration[_a] = { fqn: "@aws-cdk/aws-appconfig-alpha.HostedConfiguration", version: "0.0.0" };
/**
 * A sourced configuration represents configuration stored in an Amazon S3 bucket, AWS Secrets Manager secret, Systems Manager
 * (SSM) Parameter Store parameter, SSM document, or AWS CodePipeline.
 */
class SourcedConfiguration extends ConfigurationBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.SourcedConfiguration", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_SourcedConfigurationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SourcedConfiguration);
            }
            throw error;
        }
        this.location = props.location;
        this.locationUri = this.location.locationUri;
        this.versionNumber = props.versionNumber;
        this.sourceKey = this.location.key;
        this.retrievalRole = props.retrievalRole || this.location.type != ConfigurationSourceType.CODE_PIPELINE
            ? new iam.Role(this, 'Role', {
                roleName: aws_cdk_lib_1.PhysicalName.GENERATE_IF_NEEDED,
                assumedBy: new iam.ServicePrincipal('appconfig.amazonaws.com'),
                inlinePolicies: {
                    ['AllowAppConfigReadFromSourcePolicy']: this.getPolicyForRole(),
                },
            })
            : undefined;
        this._cfnConfigurationProfile = new aws_appconfig_1.CfnConfigurationProfile(this, 'Resource', {
            applicationId: this.applicationId,
            locationUri: this.locationUri,
            name: this.name,
            description: this.description,
            retrievalRoleArn: this.retrievalRole?.roleArn,
            type: this.type,
            validators: this.validators,
        });
        this.configurationProfileId = this._cfnConfigurationProfile.ref;
        this.configurationProfileArn = aws_cdk_lib_1.Stack.of(this).formatArn({
            service: 'appconfig',
            resource: 'application',
            resourceName: `${this.applicationId}/configurationprofile/${this.configurationProfileId}`,
        });
        this.extensible = new extension_1.ExtensibleBase(this, this.configurationProfileArn, this.name);
        this.addExistingEnvironmentsToApplication();
        this.deployConfigToEnvironments();
    }
    getPolicyForRole() {
        const policy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
        });
        const document = new iam.PolicyDocument({
            statements: [policy],
        });
        if (this.location.type == ConfigurationSourceType.SSM_PARAMETER) {
            policy.addActions('ssm:GetParameter');
            policy.addResources(this.locationUri);
        }
        else if (this.location.type == ConfigurationSourceType.SSM_DOCUMENT) {
            policy.addActions('ssm:GetDocument');
            policy.addResources(aws_cdk_lib_1.Stack.of(this).formatArn({
                service: 'ssm',
                resource: 'document',
                resourceName: this.locationUri.split('://')[1],
            }));
        }
        else if (this.location.type == ConfigurationSourceType.S3) {
            const bucketAndObjectKey = this.locationUri.split('://')[1];
            const sep = bucketAndObjectKey.search('/');
            const bucketName = bucketAndObjectKey.substring(0, sep);
            const objectKey = bucketAndObjectKey.substring(sep + 1);
            policy.addActions('s3:GetObject', 's3:GetObjectMetadata', 's3:GetObjectVersion');
            policy.addResources(aws_cdk_lib_1.Stack.of(this).formatArn({
                region: '',
                account: '',
                service: 's3',
                arnFormat: aws_cdk_lib_1.ArnFormat.NO_RESOURCE_NAME,
                resource: `${bucketName}/${objectKey}`,
            }));
            const bucketPolicy = new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    's3:GetBucketLocation',
                    's3:GetBucketVersioning',
                    's3:ListBucket',
                    's3:ListBucketVersions',
                ],
                resources: [
                    aws_cdk_lib_1.Stack.of(this).formatArn({
                        region: '',
                        account: '',
                        service: 's3',
                        arnFormat: aws_cdk_lib_1.ArnFormat.NO_RESOURCE_NAME,
                        resource: bucketName,
                    }),
                ],
            });
            const listBucketsPolicy = new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['s3:ListAllMyBuckets'],
                resources: ['*'],
            });
            document.addStatements(bucketPolicy, listBucketsPolicy);
        }
        else {
            policy.addActions('secretsmanager:GetSecretValue');
            policy.addResources(this.locationUri);
        }
        if (this.sourceKey) {
            const keyPolicy = new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['kms:Decrypt'],
                resources: [this.sourceKey.keyArn],
            });
            document.addStatements(keyPolicy);
        }
        return document;
    }
}
exports.SourcedConfiguration = SourcedConfiguration;
_b = JSII_RTTI_SYMBOL_1;
SourcedConfiguration[_b] = { fqn: "@aws-cdk/aws-appconfig-alpha.SourcedConfiguration", version: "0.0.0" };
/**
 * The configuration type.
 */
var ConfigurationType;
(function (ConfigurationType) {
    /**
     * Freeform configuration profile. Allows you to store your data in the AWS AppConfig
     * hosted configuration store or another Systems Manager capability or AWS service that integrates
     * with AWS AppConfig.
     *
     * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-free-form-configurations-creating.html
     */
    ConfigurationType["FREEFORM"] = "AWS.Freeform";
    /**
     * Feature flag configuration profile. This configuration stores its data
     * in the AWS AppConfig hosted configuration store and the URI is simply hosted.
     */
    ConfigurationType["FEATURE_FLAGS"] = "AWS.AppConfig.FeatureFlags";
})(ConfigurationType || (exports.ConfigurationType = ConfigurationType = {}));
/**
 * The validator type.
 */
var ValidatorType;
(function (ValidatorType) {
    /**
     * JSON Scema validator.
     */
    ValidatorType["JSON_SCHEMA"] = "JSON_SCHEMA";
    /**
     * Validate using a Lambda function.
     */
    ValidatorType["LAMBDA"] = "LAMBDA";
})(ValidatorType || (exports.ValidatorType = ValidatorType = {}));
/**
 * The configuration source type.
 */
var ConfigurationSourceType;
(function (ConfigurationSourceType) {
    ConfigurationSourceType["S3"] = "S3";
    ConfigurationSourceType["SECRETS_MANAGER"] = "SECRETS_MANAGER";
    ConfigurationSourceType["SSM_PARAMETER"] = "SSM_PARAMETER";
    ConfigurationSourceType["SSM_DOCUMENT"] = "SSM_DOCUMENT";
    ConfigurationSourceType["CODE_PIPELINE"] = "CODE_PIPELINE";
})(ConfigurationSourceType || (exports.ConfigurationSourceType = ConfigurationSourceType = {}));
/**
 * Defines a JSON Schema validator.
 */
class JsonSchemaValidator {
    /**
     * Defines a JSON Schema validator from a file.
     *
     * @param inputPath The path to the file that defines the validator
     */
    static fromFile(inputPath) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.JsonSchemaValidator#fromFile", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromFile);
            }
            throw error;
        }
        return {
            content: fs.readFileSync(path.resolve(inputPath)).toString(),
            type: ValidatorType.JSON_SCHEMA,
        };
    }
    /**
     * Defines a JSON Schema validator from inline code.
     *
     * @param code The inline code that defines the validator
     */
    static fromInline(code) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.JsonSchemaValidator#fromInline", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromInline);
            }
            throw error;
        }
        return {
            content: code,
            type: ValidatorType.JSON_SCHEMA,
        };
    }
}
exports.JsonSchemaValidator = JsonSchemaValidator;
_c = JSII_RTTI_SYMBOL_1;
JsonSchemaValidator[_c] = { fqn: "@aws-cdk/aws-appconfig-alpha.JsonSchemaValidator", version: "0.0.0" };
/**
 * Defines an AWS Lambda validator.
 */
class LambdaValidator {
    /**
     *  Defines an AWS Lambda validator from a Lambda function. This will call
     * `addPermission` to your function to grant AWS AppConfig permissions.
     *
     * @param func The function that defines the validator
     */
    static fromFunction(func) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.LambdaValidator#fromFunction", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromFunction);
            }
            throw error;
        }
        if (!func.permissionsNode.tryFindChild('AppConfigPermission')) {
            func.addPermission('AppConfigPermission', {
                principal: new iam.ServicePrincipal('appconfig.amazonaws.com'),
            });
        }
        return {
            content: func.functionArn,
            type: ValidatorType.LAMBDA,
        };
    }
}
exports.LambdaValidator = LambdaValidator;
_d = JSII_RTTI_SYMBOL_1;
LambdaValidator[_d] = { fqn: "@aws-cdk/aws-appconfig-alpha.LambdaValidator", version: "0.0.0" };
/**
 * Defines the hosted configuration content.
 */
class ConfigurationContent {
    /**
     * Defines the hosted configuration content from a file.
     *
     * @param inputPath The path to the file that defines configuration content
     * @param contentType The content type of the configuration
     */
    static fromFile(inputPath, contentType) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ConfigurationContent#fromFile", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromFile);
            }
            throw error;
        }
        return {
            content: fs.readFileSync(path.resolve(inputPath)).toString(),
            contentType: contentType || mimeTypes.lookup(inputPath) || 'application/json',
        };
    }
    /**
     * Defines the hosted configuration content from inline code.
     *
     * @param content The inline code that defines the configuration content
     * @param contentType The content type of the configuration
     */
    static fromInline(content, contentType) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ConfigurationContent#fromInline", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromInline);
            }
            throw error;
        }
        return {
            content,
            contentType: contentType || 'application/octet-stream',
        };
    }
    /**
     * Defines the hosted configuration content as JSON from inline code.
     *
     * @param content The inline code that defines the configuration content
     * @param contentType The content type of the configuration
     */
    static fromInlineJson(content, contentType) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ConfigurationContent#fromInlineJson", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromInlineJson);
            }
            throw error;
        }
        return {
            content,
            contentType: contentType || 'application/json',
        };
    }
    /**
     * Defines the hosted configuration content as text from inline code.
     *
     * @param content The inline code that defines the configuration content
     */
    static fromInlineText(content) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ConfigurationContent#fromInlineText", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromInlineText);
            }
            throw error;
        }
        return {
            content,
            contentType: 'text/plain',
        };
    }
    /**
     * Defines the hosted configuration content as YAML from inline code.
     *
     * @param content The inline code that defines the configuration content
     */
    static fromInlineYaml(content) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ConfigurationContent#fromInlineYaml", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromInlineYaml);
            }
            throw error;
        }
        return {
            content,
            contentType: 'application/x-yaml',
        };
    }
}
exports.ConfigurationContent = ConfigurationContent;
_e = JSII_RTTI_SYMBOL_1;
ConfigurationContent[_e] = { fqn: "@aws-cdk/aws-appconfig-alpha.ConfigurationContent", version: "0.0.0" };
/**
 * Defines the integrated configuration sources.
 */
class ConfigurationSource {
    /**
     * Defines configuration content from an Amazon S3 bucket.
     *
     * @param bucket The S3 bucket where the configuration is stored
     * @param objectKey The path to the configuration
     * @param key The KMS Key that the bucket is encrypted with
     */
    static fromBucket(bucket, objectKey, key) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ConfigurationSource#fromBucket", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromBucket);
            }
            throw error;
        }
        return {
            locationUri: bucket.s3UrlForObject(objectKey),
            type: ConfigurationSourceType.S3,
            key,
        };
    }
    /**
     * Defines configuration content from an AWS Secrets Manager secret.
     *
     * @param secret The secret where the configuration is stored
     */
    static fromSecret(secret) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ConfigurationSource#fromSecret", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSecret);
            }
            throw error;
        }
        return {
            locationUri: secret.secretArn,
            type: ConfigurationSourceType.SECRETS_MANAGER,
            key: secret.encryptionKey,
        };
    }
    /**
     * Defines configuration content from a Systems Manager (SSM) Parameter Store parameter.
     *
     * @param parameter The parameter where the configuration is stored
     * @param key The KMS Key that the secure string is encrypted with
     */
    static fromParameter(parameter, key) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ConfigurationSource#fromParameter", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromParameter);
            }
            throw error;
        }
        return {
            locationUri: parameter.parameterArn,
            type: ConfigurationSourceType.SSM_PARAMETER,
            key,
        };
    }
    /**
     * Defines configuration content from a Systems Manager (SSM) document.
     *
     * @param document The SSM document where the configuration is stored
     */
    static fromCfnDocument(document) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ConfigurationSource#fromCfnDocument", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromCfnDocument);
            }
            throw error;
        }
        return {
            locationUri: `ssm-document://${document.ref}`,
            type: ConfigurationSourceType.SSM_DOCUMENT,
        };
    }
    /**
     * Defines configuration content from AWS CodePipeline.
     *
     * @param pipeline The pipeline where the configuration is stored
     * @returns
     */
    static fromPipeline(pipeline) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ConfigurationSource#fromPipeline", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromPipeline);
            }
            throw error;
        }
        return {
            locationUri: `codepipeline://${pipeline.pipelineName}`,
            type: ConfigurationSourceType.CODE_PIPELINE,
        };
    }
}
exports.ConfigurationSource = ConfigurationSource;
_f = JSII_RTTI_SYMBOL_1;
ConfigurationSource[_f] = { fqn: "@aws-cdk/aws-appconfig-alpha.ConfigurationSource", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3Qiw2Q0FBbUY7QUFDbkYsNkRBQWtIO0FBRWxILDJDQUEyQztBQU0zQywyQ0FBbUQ7QUFDbkQsd0NBQXdDO0FBRXhDLCtEQUFpRztBQUVqRywyQ0FBd0g7QUFDeEgseUNBQXlDO0FBMEh6QyxNQUFlLGlCQUFrQixTQUFRLHNCQUFTO0lBK0NoRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLG1CQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFO1lBQ3ZELFNBQVMsRUFBRSxHQUFHO1lBQ2QsU0FBUyxFQUFFLEdBQUc7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztRQUNwRCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsa0JBQWtCLElBQUksSUFBSSx3Q0FBa0IsQ0FBQyxJQUFJLEVBQUUsb0JB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RztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBa0I7Ozs7Ozs7Ozs7UUFDekMsT0FBTztZQUNMLFdBQVcsRUFBRSxNQUFNLENBQUMsU0FBUztZQUM3QixJQUFJLEVBQUUsdUJBQXVCLENBQUMsZUFBZTtZQUM3QyxHQUFHLEVBQUUsTUFBTSxDQUFDLGFBQWE7U0FDMUIsQ0FBQztLQUNIO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQXlCLEVBQUUsR0FBYzs7Ozs7Ozs7OztRQUNuRSxPQUFPO1lBQ0wsV0FBVyxFQUFFLFNBQVMsQ0FBQyxZQUFZO1lBQ25DLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxhQUFhO1lBQzNDLEdBQUc7U0FDSixDQUFDO0tBQ0g7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUF5Qjs7Ozs7Ozs7OztRQUNyRCxPQUFPO1lBQ0wsV0FBVyxFQUFFLGtCQUFrQixRQUFRLENBQUMsR0FBRyxFQUFFO1lBQzdDLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxZQUFZO1NBQzNDLENBQUM7S0FDSDtJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFzQjs7Ozs7Ozs7OztRQUMvQyxPQUFPO1lBQ0wsV0FBVyxFQUFFLGtCQUFrQixRQUFRLENBQUMsWUFBWSxFQUFFO1lBQ3RELElBQUksRUFBRSx1QkFBdUIsQ0FBQyxhQUFhO1NBQzVDLENBQUM7S0FDSDs7QUFsRUgsa0RBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFBoeXNpY2FsTmFtZSwgU3RhY2ssIEFybkZvcm1hdCwgTmFtZXMsIFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDZm5Db25maWd1cmF0aW9uUHJvZmlsZSwgQ2ZuRGVwbG95bWVudCwgQ2ZuSG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBwY29uZmlnJztcbmltcG9ydCAqIGFzIGNwIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNzbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIG1pbWVUeXBlcyBmcm9tICdtaW1lLXR5cGVzJztcbmltcG9ydCB7IElBcHBsaWNhdGlvbiB9IGZyb20gJy4vYXBwbGljYXRpb24nO1xuaW1wb3J0IHsgRGVwbG95bWVudFN0cmF0ZWd5LCBJRGVwbG95bWVudFN0cmF0ZWd5LCBSb2xsb3V0U3RyYXRlZ3kgfSBmcm9tICcuL2RlcGxveW1lbnQtc3RyYXRlZ3knO1xuaW1wb3J0IHsgSUVudmlyb25tZW50IH0gZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBBY3Rpb25Qb2ludCwgSUV2ZW50RGVzdGluYXRpb24sIEV4dGVuc2lvbk9wdGlvbnMsIElFeHRlbnNpb24sIElFeHRlbnNpYmxlLCBFeHRlbnNpYmxlQmFzZSB9IGZyb20gJy4vZXh0ZW5zaW9uJztcbmltcG9ydCB7IGdldEhhc2ggfSBmcm9tICcuL3ByaXZhdGUvaGFzaCc7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgdGhlIENvbmZpZ3VyYXRpb24gY29uc3RydWN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlndXJhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGRlcGxveW1lbnQgc3RyYXRlZ3kgZm9yIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgZGVwbG95bWVudCBzdHJhdGVneSB3aXRoIHRoZSByb2xsb3V0IHN0cmF0ZWd5IHNldCB0b1xuICAgKiBSb2xsb3V0U3RyYXRlZ3kuQ0FOQVJZXzEwX1BFUkNFTlRfMjBfTUlOVVRFU1xuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95bWVudFN0cmF0ZWd5PzogSURlcGxveW1lbnRTdHJhdGVneTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuYW1lIGlzIGdlbmVyYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2YWxpZGF0b3JzIGZvciB0aGUgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyB2YWxpZGF0b3JzLlxuICAgKi9cbiAgcmVhZG9ubHkgdmFsaWRhdG9ycz86IElWYWxpZGF0b3JbXTtcblxuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IENvbmZpZ3VyYXRpb25UeXBlLkZSRUVGT1JNXG4gICAqL1xuICByZWFkb25seSB0eXBlPzogQ29uZmlndXJhdGlvblR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGVudmlyb25tZW50cyB0byBkZXBsb3kgdGhlIGNvbmZpZ3VyYXRpb24gdG8uXG4gICAqXG4gICAqIElmIHRoaXMgcGFyYW1ldGVyIGlzIG5vdCBzcGVjaWZpZWQsIHRoZW4gdGhlcmUgd2lsbCBiZSBub1xuICAgKiBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBkZXBsb3lUbz86IElFbnZpcm9ubWVudFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVwbG95bWVudCBrZXkgb2YgdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IGRlcGxveW1lbnRLZXk/OiBrbXMuSUtleTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciB0aGUgQ29uZmlndXJhdGlvbiBjb25zdHJ1Y3QuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlndXJhdGlvblByb3BzIGV4dGVuZHMgQ29uZmlndXJhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGFwcGxpY2F0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGFwcGxpY2F0aW9uOiBJQXBwbGljYXRpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbmZpZ3VyYXRpb24gZXh0ZW5kcyBJQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIFRoZSBkZXBsb3ltZW50IHN0cmF0ZWd5IGZvciB0aGUgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlcGxveW1lbnRTdHJhdGVneT86IElEZXBsb3ltZW50U3RyYXRlZ3k7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIHZlcnNpb24gbnVtYmVyLlxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbk51bWJlcj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGFwcGxpY2F0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGFwcGxpY2F0aW9uOiBJQXBwbGljYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHZhbGlkYXRvcnMgZm9yIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgdmFsaWRhdG9ycz86IElWYWxpZGF0b3JbXTtcblxuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIHR5cGUuXG4gICAqL1xuICByZWFkb25seSB0eXBlPzogQ29uZmlndXJhdGlvblR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBlbnZpcm9ubWVudHMgdG8gZGVwbG95IHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95VG8/OiBJRW52aXJvbm1lbnRbXTtcblxuICAvKipcbiAgICogVGhlIGRlcGxveW1lbnQga2V5IGZvciB0aGUgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlcGxveW1lbnRLZXk/OiBrbXMuSUtleTtcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBjb25maWd1cmF0aW9uIHByb2ZpbGUuXG4gICAqL1xuICByZWFkb25seSBjb25maWd1cmF0aW9uUHJvZmlsZUlkOiBzdHJpbmc7XG59XG5cbmFic3RyYWN0IGNsYXNzIENvbmZpZ3VyYXRpb25CYXNlIGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSUNvbmZpZ3VyYXRpb24sIElFeHRlbnNpYmxlIHtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHZlcnNpb25OdW1iZXI/OiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBjb25maWd1cmF0aW9uUHJvZmlsZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBhcHBsaWNhdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXBwbGljYXRpb246IElBcHBsaWNhdGlvbjtcblxuICAvKipcbiAgICogVGhlIGVudmlyb25tZW50cyB0byBkZXBsb3kgdG8uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVwbG95VG8/OiBJRW52aXJvbm1lbnRbXTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHZhbGlkYXRvcnMgZm9yIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHZhbGlkYXRvcnM/OiBJVmFsaWRhdG9yW107XG5cbiAgLyoqXG4gICAqIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gdHlwZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0eXBlPzogQ29uZmlndXJhdGlvblR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXBsb3ltZW50IGtleSBmb3IgdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVwbG95bWVudEtleT86IGttcy5JS2V5O1xuXG4gIC8qKlxuICAgKiBUaGUgZGVwbG95bWVudCBzdHJhdGVneSBmb3IgdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICByZWFkb25seSBkZXBsb3ltZW50U3RyYXRlZ3k/OiBJRGVwbG95bWVudFN0cmF0ZWd5O1xuXG4gIHByb3RlY3RlZCBhcHBsaWNhdGlvbklkOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBleHRlbnNpYmxlITogRXh0ZW5zaWJsZUJhc2U7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENvbmZpZ3VyYXRpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lIHx8IE5hbWVzLnVuaXF1ZVJlc291cmNlTmFtZSh0aGlzLCB7XG4gICAgICBtYXhMZW5ndGg6IDEyOCxcbiAgICAgIHNlcGFyYXRvcjogJy0nLFxuICAgIH0pO1xuICAgIHRoaXMuYXBwbGljYXRpb24gPSBwcm9wcy5hcHBsaWNhdGlvbjtcbiAgICB0aGlzLmFwcGxpY2F0aW9uSWQgPSB0aGlzLmFwcGxpY2F0aW9uLmFwcGxpY2F0aW9uSWQ7XG4gICAgdGhpcy50eXBlID0gcHJvcHMudHlwZTtcbiAgICB0aGlzLnZhbGlkYXRvcnMgPSBwcm9wcy52YWxpZGF0b3JzO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBwcm9wcy5kZXNjcmlwdGlvbjtcbiAgICB0aGlzLmRlcGxveVRvID0gcHJvcHMuZGVwbG95VG87XG4gICAgdGhpcy5kZXBsb3ltZW50S2V5ID0gcHJvcHMuZGVwbG95bWVudEtleTtcbiAgICB0aGlzLmRlcGxveW1lbnRTdHJhdGVneSA9IHByb3BzLmRlcGxveW1lbnRTdHJhdGVneSB8fCBuZXcgRGVwbG95bWVudFN0cmF0ZWd5KHRoaXMsICdEZXBsb3ltZW50U3RyYXRlZ3knLCB7XG4gICAgICByb2xsb3V0U3RyYXRlZ3k6IFJvbGxvdXRTdHJhdGVneS5DQU5BUllfMTBfUEVSQ0VOVF8yMF9NSU5VVEVTLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXh0ZW5zaW9uIGRlZmluZWQgYnkgdGhlIGFjdGlvbiBwb2ludCBhbmQgZXZlbnQgZGVzdGluYXRpb25cbiAgICogYW5kIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gdGhlIGNvbmZpZ3VyYXRpb24gcHJvZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIGFjdGlvblBvaW50IFRoZSBhY3Rpb24gcG9pbnQgd2hpY2ggdHJpZ2dlcnMgdGhlIGV2ZW50XG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBwdWJsaWMgb24oYWN0aW9uUG9pbnQ6IEFjdGlvblBvaW50LCBldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpIHtcbiAgICB0aGlzLmV4dGVuc2libGUub24oYWN0aW9uUG9pbnQsIGV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBQUkVfQ1JFQVRFX0hPU1RFRF9DT05GSUdVUkFUSU9OX1ZFUlNJT04gZXh0ZW5zaW9uIHdpdGggdGhlXG4gICAqIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uIGFuZCBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBjb25maWd1cmF0aW9uIHByb2ZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBwdWJsaWMgcHJlQ3JlYXRlSG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24oZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLnByZUNyZWF0ZUhvc3RlZENvbmZpZ3VyYXRpb25WZXJzaW9uKGV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBQUkVfU1RBUlRfREVQTE9ZTUVOVCBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb25cbiAgICogYW5kIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gdGhlIGNvbmZpZ3VyYXRpb24gcHJvZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIHB1YmxpYyBwcmVTdGFydERlcGxveW1lbnQoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLnByZVN0YXJ0RGVwbG95bWVudChldmVudERlc3RpbmF0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfU1RBUlQgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uXG4gICAqIGFuZCBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBjb25maWd1cmF0aW9uIHByb2ZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBwdWJsaWMgb25EZXBsb3ltZW50U3RhcnQoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uRGVwbG95bWVudFN0YXJ0KGV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gT05fREVQTE9ZTUVOVF9TVEVQIGV4dGVuc2lvbiB3aXRoIHRoZSBwcm92aWRlZCBldmVudCBkZXN0aW5hdGlvblxuICAgKiBhbmQgYWxzbyBjcmVhdGVzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byB0aGUgY29uZmlndXJhdGlvbiBwcm9maWxlLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgcHVibGljIG9uRGVwbG95bWVudFN0ZXAoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uRGVwbG95bWVudFN0ZXAoZXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBPTl9ERVBMT1lNRU5UX0JBS0lORyBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb24gYW5kXG4gICAqIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gdGhlIGNvbmZpZ3VyYXRpb24gcHJvZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIHB1YmxpYyBvbkRlcGxveW1lbnRCYWtpbmcoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uRGVwbG95bWVudEJha2luZyhldmVudERlc3RpbmF0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfQ09NUExFVEUgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uXG4gICAqIGFuZCBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBjb25maWd1cmF0aW9uIHByb2ZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBwdWJsaWMgb25EZXBsb3ltZW50Q29tcGxldGUoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uRGVwbG95bWVudENvbXBsZXRlKGV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gT05fREVQTE9ZTUVOVF9ST0xMRURfQkFDSyBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb25cbiAgICogYW5kIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gdGhlIGNvbmZpZ3VyYXRpb24gcHJvZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIHB1YmxpYyBvbkRlcGxveW1lbnRSb2xsZWRCYWNrKGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucykge1xuICAgIHRoaXMuZXh0ZW5zaWJsZS5vbkRlcGxveW1lbnRSb2xsZWRCYWNrKGV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBjb25maWd1cmF0aW9uIHByb2ZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBleHRlbnNpb24gVGhlIGV4dGVuc2lvbiB0byBjcmVhdGUgYW4gYXNzb2NpYXRpb24gZm9yXG4gICAqL1xuICBwdWJsaWMgYWRkRXh0ZW5zaW9uKGV4dGVuc2lvbjogSUV4dGVuc2lvbikge1xuICAgIHRoaXMuZXh0ZW5zaWJsZS5hZGRFeHRlbnNpb24oZXh0ZW5zaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXBsb3lzIHRoZSBjb25maWd1cmF0aW9uIHRvIHRoZSBzcGVjaWZpZWQgZW52aXJvbm1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBlbnZpcm9ubWVudCBUaGUgZW52aXJvbm1lbnQgdG8gZGVwbG95IHRoZSBjb25maWd1cmF0aW9uIHRvXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZGVwbG95VG9gIGFzIGEgcHJvcGVydHkgaW5zdGVhZC4gV2UgZG8gbm90IHJlY29tbWVuZFxuICAgKiBjcmVhdGluZyByZXNvdXJjZXMgaW4gbXVsdGlwbGUgc3RhY2tzLiBJZiB5b3Ugd2FudCB0byBkbyB0aGlzIHN0aWxsLFxuICAgKiBwbGVhc2UgdGFrZSBhIGxvb2sgaW50byBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92Mi9kb2NzL2F3cy1jZGstbGliLmF3c19hcHBjb25maWcuQ2ZuRGVwbG95bWVudC5odG1sLlxuICAgKi9cbiAgcHVibGljIGRlcGxveShlbnZpcm9ubWVudDogSUVudmlyb25tZW50KSB7XG4gICAgbmV3IENmbkRlcGxveW1lbnQodGhpcywgYERlcGxveW1lbnQke2dldEhhc2goZW52aXJvbm1lbnQubmFtZSEpfWAsIHtcbiAgICAgIGFwcGxpY2F0aW9uSWQ6IHRoaXMuYXBwbGljYXRpb24uYXBwbGljYXRpb25JZCxcbiAgICAgIGNvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHRoaXMuY29uZmlndXJhdGlvblByb2ZpbGVJZCxcbiAgICAgIGRlcGxveW1lbnRTdHJhdGVneUlkOiB0aGlzLmRlcGxveW1lbnRTdHJhdGVneSEuZGVwbG95bWVudFN0cmF0ZWd5SWQsXG4gICAgICBlbnZpcm9ubWVudElkOiBlbnZpcm9ubWVudC5lbnZpcm9ubWVudElkLFxuICAgICAgY29uZmlndXJhdGlvblZlcnNpb246IHRoaXMudmVyc2lvbk51bWJlciEsXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIGttc0tleUlkZW50aWZpZXI6IHRoaXMuZGVwbG95bWVudEtleT8ua2V5QXJuLFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZEV4aXN0aW5nRW52aXJvbm1lbnRzVG9BcHBsaWNhdGlvbigpIHtcbiAgICB0aGlzLmRlcGxveVRvPy5mb3JFYWNoKChlbnZpcm9ubWVudCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmFwcGxpY2F0aW9uLmVudmlyb25tZW50cy5pbmNsdWRlcyhlbnZpcm9ubWVudCkpIHtcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbi5hZGRFeGlzdGluZ0Vudmlyb25tZW50KGVudmlyb25tZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBkZXBsb3lDb25maWdUb0Vudmlyb25tZW50cygpIHtcbiAgICBpZiAoIXRoaXMuZGVwbG95VG8gfHwgIXRoaXMudmVyc2lvbk51bWJlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYXBwbGljYXRpb24uZW52aXJvbm1lbnRzLmZvckVhY2goKGVudmlyb25tZW50KSA9PiB7XG4gICAgICBpZiAoKHRoaXMuZGVwbG95VG8gJiYgIXRoaXMuZGVwbG95VG8uaW5jbHVkZXMoZW52aXJvbm1lbnQpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmRlcGxveShlbnZpcm9ubWVudCk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBIb3N0ZWRDb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSG9zdGVkQ29uZmlndXJhdGlvbk9wdGlvbnMgZXh0ZW5kcyBDb25maWd1cmF0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgY29udGVudCBvZiB0aGUgaG9zdGVkIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICByZWFkb25seSBjb250ZW50OiBDb25maWd1cmF0aW9uQ29udGVudDtcblxuICAvKipcbiAgICogVGhlIGxhdGVzdCB2ZXJzaW9uIG51bWJlciBvZiB0aGUgaG9zdGVkIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IGxhdGVzdFZlcnNpb25OdW1iZXI/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIGxhYmVsIG9mIHRoZSBob3N0ZWQgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbkxhYmVsPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIEhvc3RlZENvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIb3N0ZWRDb25maWd1cmF0aW9uUHJvcHMgZXh0ZW5kcyBDb25maWd1cmF0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIGNvbnRlbnQgb2YgdGhlIGhvc3RlZCBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY29udGVudDogQ29uZmlndXJhdGlvbkNvbnRlbnQ7XG5cbiAgLyoqXG4gICAqIFRoZSBsYXRlc3QgdmVyc2lvbiBudW1iZXIgb2YgdGhlIGhvc3RlZCBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBsYXRlc3RWZXJzaW9uTnVtYmVyPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgdmVyc2lvbiBsYWJlbCBvZiB0aGUgaG9zdGVkIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25MYWJlbD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGhvc3RlZCBjb25maWd1cmF0aW9uIHJlcHJlc2VudHMgY29uZmlndXJhdGlvbiBzdG9yZWQgaW4gdGhlIEFXUyBBcHBDb25maWcgaG9zdGVkIGNvbmZpZ3VyYXRpb24gc3RvcmUuXG4gKi9cbmV4cG9ydCBjbGFzcyBIb3N0ZWRDb25maWd1cmF0aW9uIGV4dGVuZHMgQ29uZmlndXJhdGlvbkJhc2Uge1xuICAvKipcbiAgICogVGhlIGNvbnRlbnQgb2YgdGhlIGhvc3RlZCBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbnRlbnQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbnRlbnQgdHlwZSBvZiB0aGUgaG9zdGVkIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29udGVudFR5cGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBsYXRlc3QgdmVyc2lvbiBudW1iZXIgb2YgdGhlIGhvc3RlZCBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxhdGVzdFZlcnNpb25OdW1iZXI/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIGxhYmVsIG9mIHRoZSBob3N0ZWQgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2ZXJzaW9uTGFiZWw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG51bWJlciBvZiB0aGUgaG9zdGVkIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdmVyc2lvbk51bWJlcj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBob3N0ZWQgY29uZmlndXJhdGlvbiB2ZXJzaW9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGhvc3RlZENvbmZpZ3VyYXRpb25WZXJzaW9uQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgY29uZmlndXJhdGlvbiBwcm9maWxlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBjb25maWd1cmF0aW9uIHByb2ZpbGUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29uZmlndXJhdGlvblByb2ZpbGVBcm46IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IF9jZm5Db25maWd1cmF0aW9uUHJvZmlsZTogQ2ZuQ29uZmlndXJhdGlvblByb2ZpbGU7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Nmbkhvc3RlZENvbmZpZ3VyYXRpb25WZXJzaW9uOiBDZm5Ib3N0ZWRDb25maWd1cmF0aW9uVmVyc2lvbjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSG9zdGVkQ29uZmlndXJhdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLl9jZm5Db25maWd1cmF0aW9uUHJvZmlsZSA9IG5ldyBDZm5Db25maWd1cmF0aW9uUHJvZmlsZSh0aGlzLCAnQ29uZmlndXJhdGlvblByb2ZpbGUnLCB7XG4gICAgICBhcHBsaWNhdGlvbklkOiB0aGlzLmFwcGxpY2F0aW9uSWQsXG4gICAgICBsb2NhdGlvblVyaTogJ2hvc3RlZCcsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUhLFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICB2YWxpZGF0b3JzOiB0aGlzLnZhbGlkYXRvcnMsXG4gICAgfSk7XG4gICAgdGhpcy5jb25maWd1cmF0aW9uUHJvZmlsZUlkID0gdGhpcy5fY2ZuQ29uZmlndXJhdGlvblByb2ZpbGUucmVmO1xuICAgIHRoaXMuY29uZmlndXJhdGlvblByb2ZpbGVBcm4gPSBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2FwcGNvbmZpZycsXG4gICAgICByZXNvdXJjZTogJ2FwcGxpY2F0aW9uJyxcbiAgICAgIHJlc291cmNlTmFtZTogYCR7dGhpcy5hcHBsaWNhdGlvbklkfS9jb25maWd1cmF0aW9ucHJvZmlsZS8ke3RoaXMuY29uZmlndXJhdGlvblByb2ZpbGVJZH1gLFxuICAgIH0pO1xuICAgIHRoaXMuZXh0ZW5zaWJsZSA9IG5ldyBFeHRlbnNpYmxlQmFzZSh0aGlzLCB0aGlzLmNvbmZpZ3VyYXRpb25Qcm9maWxlQXJuLCB0aGlzLm5hbWUpO1xuXG4gICAgdGhpcy5jb250ZW50ID0gcHJvcHMuY29udGVudC5jb250ZW50O1xuICAgIHRoaXMuY29udGVudFR5cGUgPSBwcm9wcy5jb250ZW50LmNvbnRlbnRUeXBlO1xuICAgIHRoaXMubGF0ZXN0VmVyc2lvbk51bWJlciA9IHByb3BzLmxhdGVzdFZlcnNpb25OdW1iZXI7XG4gICAgdGhpcy52ZXJzaW9uTGFiZWwgPSBwcm9wcy52ZXJzaW9uTGFiZWw7XG4gICAgdGhpcy5fY2ZuSG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24gPSBuZXcgQ2ZuSG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24odGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgYXBwbGljYXRpb25JZDogdGhpcy5hcHBsaWNhdGlvbklkLFxuICAgICAgY29uZmlndXJhdGlvblByb2ZpbGVJZDogdGhpcy5jb25maWd1cmF0aW9uUHJvZmlsZUlkLFxuICAgICAgY29udGVudDogdGhpcy5jb250ZW50LFxuICAgICAgY29udGVudFR5cGU6IHRoaXMuY29udGVudFR5cGUsXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIGxhdGVzdFZlcnNpb25OdW1iZXI6IHRoaXMubGF0ZXN0VmVyc2lvbk51bWJlcixcbiAgICAgIHZlcnNpb25MYWJlbDogdGhpcy52ZXJzaW9uTGFiZWwsXG4gICAgfSk7XG4gICAgdGhpcy5fY2ZuSG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24uYXBwbHlSZW1vdmFsUG9saWN5KFJlbW92YWxQb2xpY3kuUkVUQUlOKTtcblxuICAgIHRoaXMudmVyc2lvbk51bWJlciA9IHRoaXMuX2Nmbkhvc3RlZENvbmZpZ3VyYXRpb25WZXJzaW9uLnJlZjtcbiAgICB0aGlzLmhvc3RlZENvbmZpZ3VyYXRpb25WZXJzaW9uQXJuID0gU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdhcHBjb25maWcnLFxuICAgICAgcmVzb3VyY2U6ICdhcHBsaWNhdGlvbicsXG4gICAgICByZXNvdXJjZU5hbWU6IGAke3RoaXMuYXBwbGljYXRpb25JZH0vY29uZmlndXJhdGlvbnByb2ZpbGUvJHt0aGlzLmNvbmZpZ3VyYXRpb25Qcm9maWxlSWR9L2hvc3RlZGNvbmZpZ3VyYXRpb252ZXJzaW9uLyR7dGhpcy52ZXJzaW9uTnVtYmVyfWAsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZEV4aXN0aW5nRW52aXJvbm1lbnRzVG9BcHBsaWNhdGlvbigpO1xuICAgIHRoaXMuZGVwbG95Q29uZmlnVG9FbnZpcm9ubWVudHMoKTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIFNvdXJjZWRDb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU291cmNlZENvbmZpZ3VyYXRpb25PcHRpb25zIGV4dGVuZHMgQ29uZmlndXJhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBjb25maWd1cmF0aW9uIGlzIHN0b3JlZC5cbiAgICovXG4gIHJlYWRvbmx5IGxvY2F0aW9uOiBDb25maWd1cmF0aW9uU291cmNlO1xuXG4gIC8qKlxuICAgKiBUaGUgdmVyc2lvbiBudW1iZXIgb2YgdGhlIHNvdXJjZWQgY29uZmlndXJhdGlvbiB0byBkZXBsb3kuIElmIHRoaXMgaXMgbm90IHNwZWNpZmllZCxcbiAgICogdGhlbiB0aGVyZSB3aWxsIGJlIG5vIGRlcGxveW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25OdW1iZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gcm9sZSB0byByZXRyaWV2ZSB0aGUgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIHJvbGUgaXMgZ2VuZXJhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgcmV0cmlldmFsUm9sZT86IGlhbS5JUm9sZTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBTb3VyY2VkQ29uZmlndXJhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VkQ29uZmlndXJhdGlvblByb3BzIGV4dGVuZHMgQ29uZmlndXJhdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgY29uZmlndXJhdGlvbiBpcyBzdG9yZWQuXG4gICAqL1xuICByZWFkb25seSBsb2NhdGlvbjogQ29uZmlndXJhdGlvblNvdXJjZTtcblxuICAvKipcbiAgICogVGhlIHZlcnNpb24gbnVtYmVyIG9mIHRoZSBzb3VyY2VkIGNvbmZpZ3VyYXRpb24gdG8gZGVwbG95LiBJZiB0aGlzIGlzIG5vdCBzcGVjaWZpZWQsXG4gICAqIHRoZW4gdGhlcmUgd2lsbCBiZSBubyBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uTnVtYmVyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIHJvbGUgdG8gcmV0cmlldmUgdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSByb2xlIGlzIGdlbmVyYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IHJldHJpZXZhbFJvbGU/OiBpYW0uSVJvbGU7XG59XG5cbi8qKlxuICogQSBzb3VyY2VkIGNvbmZpZ3VyYXRpb24gcmVwcmVzZW50cyBjb25maWd1cmF0aW9uIHN0b3JlZCBpbiBhbiBBbWF6b24gUzMgYnVja2V0LCBBV1MgU2VjcmV0cyBNYW5hZ2VyIHNlY3JldCwgU3lzdGVtcyBNYW5hZ2VyXG4gKiAoU1NNKSBQYXJhbWV0ZXIgU3RvcmUgcGFyYW1ldGVyLCBTU00gZG9jdW1lbnQsIG9yIEFXUyBDb2RlUGlwZWxpbmUuXG4gKi9cbmV4cG9ydCBjbGFzcyBTb3VyY2VkQ29uZmlndXJhdGlvbiBleHRlbmRzIENvbmZpZ3VyYXRpb25CYXNlIHtcbiAgLyoqXG4gICAqIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgY29uZmlndXJhdGlvbiBpcyBzdG9yZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbG9jYXRpb246IENvbmZpZ3VyYXRpb25Tb3VyY2U7XG5cbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG51bWJlciBvZiB0aGUgY29uZmlndXJhdGlvbiB0byBkZXBsb3kuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdmVyc2lvbk51bWJlcj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElBTSByb2xlIHRvIHJldHJpZXZlIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJldHJpZXZhbFJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSBrZXkgdG8gZGVjcnlwdCB0aGUgY29uZmlndXJhdGlvbiBpZiBhcHBsaWNhYmxlLiBUaGlzIGtleVxuICAgKiBjYW4gYmUgdXNlZCB3aGVuIHN0b3JpbmcgY29uZmlndXJhdGlvbiBpbiBBV1MgU2VjcmV0cyBNYW5hZ2VyLCBTeXN0ZW1zIE1hbmFnZXIgUGFyYW1ldGVyIFN0b3JlLFxuICAgKiBvciBBbWF6b24gUzMuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc291cmNlS2V5Pzoga21zLklLZXk7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgY29uZmlndXJhdGlvbiBwcm9maWxlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBjb25maWd1cmF0aW9uIHByb2ZpbGUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29uZmlndXJhdGlvblByb2ZpbGVBcm46IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IGxvY2F0aW9uVXJpOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NmbkNvbmZpZ3VyYXRpb25Qcm9maWxlOiBDZm5Db25maWd1cmF0aW9uUHJvZmlsZTtcblxuICBjb25zdHJ1Y3RvciAoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNvdXJjZWRDb25maWd1cmF0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHRoaXMubG9jYXRpb24gPSBwcm9wcy5sb2NhdGlvbjtcbiAgICB0aGlzLmxvY2F0aW9uVXJpID0gdGhpcy5sb2NhdGlvbi5sb2NhdGlvblVyaTtcbiAgICB0aGlzLnZlcnNpb25OdW1iZXIgPSBwcm9wcy52ZXJzaW9uTnVtYmVyO1xuICAgIHRoaXMuc291cmNlS2V5ID0gdGhpcy5sb2NhdGlvbi5rZXk7XG4gICAgdGhpcy5yZXRyaWV2YWxSb2xlID0gcHJvcHMucmV0cmlldmFsUm9sZSB8fCB0aGlzLmxvY2F0aW9uLnR5cGUgIT0gQ29uZmlndXJhdGlvblNvdXJjZVR5cGUuQ09ERV9QSVBFTElORVxuICAgICAgPyBuZXcgaWFtLlJvbGUodGhpcywgJ1JvbGUnLCB7XG4gICAgICAgIHJvbGVOYW1lOiBQaHlzaWNhbE5hbWUuR0VORVJBVEVfSUZfTkVFREVELFxuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYXBwY29uZmlnLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgaW5saW5lUG9saWNpZXM6IHtcbiAgICAgICAgICBbJ0FsbG93QXBwQ29uZmlnUmVhZEZyb21Tb3VyY2VQb2xpY3knXTogdGhpcy5nZXRQb2xpY3lGb3JSb2xlKCksXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLl9jZm5Db25maWd1cmF0aW9uUHJvZmlsZSA9IG5ldyBDZm5Db25maWd1cmF0aW9uUHJvZmlsZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBhcHBsaWNhdGlvbklkOiB0aGlzLmFwcGxpY2F0aW9uSWQsXG4gICAgICBsb2NhdGlvblVyaTogdGhpcy5sb2NhdGlvblVyaSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSEsXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIHJldHJpZXZhbFJvbGVBcm46IHRoaXMucmV0cmlldmFsUm9sZT8ucm9sZUFybixcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIHZhbGlkYXRvcnM6IHRoaXMudmFsaWRhdG9ycyxcbiAgICB9KTtcblxuICAgIHRoaXMuY29uZmlndXJhdGlvblByb2ZpbGVJZCA9IHRoaXMuX2NmbkNvbmZpZ3VyYXRpb25Qcm9maWxlLnJlZjtcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm9maWxlQXJuID0gU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdhcHBjb25maWcnLFxuICAgICAgcmVzb3VyY2U6ICdhcHBsaWNhdGlvbicsXG4gICAgICByZXNvdXJjZU5hbWU6IGAke3RoaXMuYXBwbGljYXRpb25JZH0vY29uZmlndXJhdGlvbnByb2ZpbGUvJHt0aGlzLmNvbmZpZ3VyYXRpb25Qcm9maWxlSWR9YCxcbiAgICB9KTtcbiAgICB0aGlzLmV4dGVuc2libGUgPSBuZXcgRXh0ZW5zaWJsZUJhc2UodGhpcywgdGhpcy5jb25maWd1cmF0aW9uUHJvZmlsZUFybiwgdGhpcy5uYW1lKTtcblxuICAgIHRoaXMuYWRkRXhpc3RpbmdFbnZpcm9ubWVudHNUb0FwcGxpY2F0aW9uKCk7XG4gICAgdGhpcy5kZXBsb3lDb25maWdUb0Vudmlyb25tZW50cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQb2xpY3lGb3JSb2xlKCk6IGlhbS5Qb2xpY3lEb2N1bWVudCB7XG4gICAgY29uc3QgcG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgIH0pO1xuICAgIGNvbnN0IGRvY3VtZW50ID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCh7XG4gICAgICBzdGF0ZW1lbnRzOiBbcG9saWN5XSxcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmxvY2F0aW9uLnR5cGUgPT0gQ29uZmlndXJhdGlvblNvdXJjZVR5cGUuU1NNX1BBUkFNRVRFUikge1xuICAgICAgcG9saWN5LmFkZEFjdGlvbnMoJ3NzbTpHZXRQYXJhbWV0ZXInKTtcbiAgICAgIHBvbGljeS5hZGRSZXNvdXJjZXModGhpcy5sb2NhdGlvblVyaSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmxvY2F0aW9uLnR5cGUgPT0gQ29uZmlndXJhdGlvblNvdXJjZVR5cGUuU1NNX0RPQ1VNRU5UKSB7XG4gICAgICBwb2xpY3kuYWRkQWN0aW9ucygnc3NtOkdldERvY3VtZW50Jyk7XG4gICAgICBwb2xpY3kuYWRkUmVzb3VyY2VzKFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICAgIHNlcnZpY2U6ICdzc20nLFxuICAgICAgICByZXNvdXJjZTogJ2RvY3VtZW50JyxcbiAgICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLmxvY2F0aW9uVXJpLnNwbGl0KCc6Ly8nKVsxXSxcbiAgICAgIH0pKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9jYXRpb24udHlwZSA9PSBDb25maWd1cmF0aW9uU291cmNlVHlwZS5TMykge1xuICAgICAgY29uc3QgYnVja2V0QW5kT2JqZWN0S2V5ID0gdGhpcy5sb2NhdGlvblVyaS5zcGxpdCgnOi8vJylbMV07XG4gICAgICBjb25zdCBzZXAgPSBidWNrZXRBbmRPYmplY3RLZXkuc2VhcmNoKCcvJyk7XG4gICAgICBjb25zdCBidWNrZXROYW1lID0gYnVja2V0QW5kT2JqZWN0S2V5LnN1YnN0cmluZygwLCBzZXApO1xuICAgICAgY29uc3Qgb2JqZWN0S2V5ID0gYnVja2V0QW5kT2JqZWN0S2V5LnN1YnN0cmluZyhzZXAgKyAxKTtcbiAgICAgIHBvbGljeS5hZGRBY3Rpb25zKFxuICAgICAgICAnczM6R2V0T2JqZWN0JyxcbiAgICAgICAgJ3MzOkdldE9iamVjdE1ldGFkYXRhJyxcbiAgICAgICAgJ3MzOkdldE9iamVjdFZlcnNpb24nLFxuICAgICAgKTtcbiAgICAgIHBvbGljeS5hZGRSZXNvdXJjZXMoU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgICAgcmVnaW9uOiAnJyxcbiAgICAgICAgYWNjb3VudDogJycsXG4gICAgICAgIHNlcnZpY2U6ICdzMycsXG4gICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0Lk5PX1JFU09VUkNFX05BTUUsXG4gICAgICAgIHJlc291cmNlOiBgJHtidWNrZXROYW1lfS8ke29iamVjdEtleX1gLFxuICAgICAgfSkpO1xuICAgICAgY29uc3QgYnVja2V0UG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAnczM6R2V0QnVja2V0TG9jYXRpb24nLFxuICAgICAgICAgICdzMzpHZXRCdWNrZXRWZXJzaW9uaW5nJyxcbiAgICAgICAgICAnczM6TGlzdEJ1Y2tldCcsXG4gICAgICAgICAgJ3MzOkxpc3RCdWNrZXRWZXJzaW9ucycsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgIFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICAgICAgICByZWdpb246ICcnLFxuICAgICAgICAgICAgYWNjb3VudDogJycsXG4gICAgICAgICAgICBzZXJ2aWNlOiAnczMnLFxuICAgICAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuTk9fUkVTT1VSQ0VfTkFNRSxcbiAgICAgICAgICAgIHJlc291cmNlOiBidWNrZXROYW1lLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBsaXN0QnVja2V0c1BvbGljeSA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RBbGxNeUJ1Y2tldHMnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIH0pO1xuICAgICAgZG9jdW1lbnQuYWRkU3RhdGVtZW50cyhidWNrZXRQb2xpY3ksIGxpc3RCdWNrZXRzUG9saWN5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9saWN5LmFkZEFjdGlvbnMoJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyk7XG4gICAgICBwb2xpY3kuYWRkUmVzb3VyY2VzKHRoaXMubG9jYXRpb25VcmkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNvdXJjZUtleSkge1xuICAgICAgY29uc3Qga2V5UG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFsna21zOkRlY3J5cHQnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbdGhpcy5zb3VyY2VLZXkua2V5QXJuXSxcbiAgICAgIH0pO1xuICAgICAgZG9jdW1lbnQuYWRkU3RhdGVtZW50cyhrZXlQb2xpY3kpO1xuICAgIH1cblxuICAgIHJldHVybiBkb2N1bWVudDtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBjb25maWd1cmF0aW9uIHR5cGUuXG4gKi9cbmV4cG9ydCBlbnVtIENvbmZpZ3VyYXRpb25UeXBlIHtcbiAgLyoqXG4gICAqIEZyZWVmb3JtIGNvbmZpZ3VyYXRpb24gcHJvZmlsZS4gQWxsb3dzIHlvdSB0byBzdG9yZSB5b3VyIGRhdGEgaW4gdGhlIEFXUyBBcHBDb25maWdcbiAgICogaG9zdGVkIGNvbmZpZ3VyYXRpb24gc3RvcmUgb3IgYW5vdGhlciBTeXN0ZW1zIE1hbmFnZXIgY2FwYWJpbGl0eSBvciBBV1Mgc2VydmljZSB0aGF0IGludGVncmF0ZXNcbiAgICogd2l0aCBBV1MgQXBwQ29uZmlnLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcHBjb25maWcvbGF0ZXN0L3VzZXJndWlkZS9hcHBjb25maWctZnJlZS1mb3JtLWNvbmZpZ3VyYXRpb25zLWNyZWF0aW5nLmh0bWxcbiAgICovXG4gIEZSRUVGT1JNID0gJ0FXUy5GcmVlZm9ybScsXG5cbiAgLyoqXG4gICAqIEZlYXR1cmUgZmxhZyBjb25maWd1cmF0aW9uIHByb2ZpbGUuIFRoaXMgY29uZmlndXJhdGlvbiBzdG9yZXMgaXRzIGRhdGFcbiAgICogaW4gdGhlIEFXUyBBcHBDb25maWcgaG9zdGVkIGNvbmZpZ3VyYXRpb24gc3RvcmUgYW5kIHRoZSBVUkkgaXMgc2ltcGx5IGhvc3RlZC5cbiAgICovXG4gIEZFQVRVUkVfRkxBR1MgPSAnQVdTLkFwcENvbmZpZy5GZWF0dXJlRmxhZ3MnLFxufVxuXG4vKipcbiAqIFRoZSB2YWxpZGF0b3IgdHlwZS5cbiAqL1xuZXhwb3J0IGVudW0gVmFsaWRhdG9yVHlwZSB7XG4gIC8qKlxuICAgKiBKU09OIFNjZW1hIHZhbGlkYXRvci5cbiAgICovXG4gIEpTT05fU0NIRU1BID0gJ0pTT05fU0NIRU1BJyxcblxuICAvKipcbiAgICogVmFsaWRhdGUgdXNpbmcgYSBMYW1iZGEgZnVuY3Rpb24uXG4gICAqL1xuICBMQU1CREEgPSAnTEFNQkRBJyxcbn1cblxuLyoqXG4gKiBUaGUgY29uZmlndXJhdGlvbiBzb3VyY2UgdHlwZS5cbiAqL1xuZXhwb3J0IGVudW0gQ29uZmlndXJhdGlvblNvdXJjZVR5cGUge1xuICBTMyA9ICdTMycsXG4gIFNFQ1JFVFNfTUFOQUdFUiA9ICdTRUNSRVRTX01BTkFHRVInLFxuICBTU01fUEFSQU1FVEVSID0gJ1NTTV9QQVJBTUVURVInLFxuICBTU01fRE9DVU1FTlQgPSAnU1NNX0RPQ1VNRU5UJyxcbiAgQ09ERV9QSVBFTElORSA9ICdDT0RFX1BJUEVMSU5FJyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdG9yIHtcbiAgLyoqXG4gICAqIFRoZSBjb250ZW50IG9mIHRoZSB2YWxpZGF0b3IuXG4gICAqL1xuICByZWFkb25seSBjb250ZW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHZhbGlkYXRvci5cbiAgICovXG4gIHJlYWRvbmx5IHR5cGU6IFZhbGlkYXRvclR5cGU7XG59XG5cbi8qKlxuICogRGVmaW5lcyBhIEpTT04gU2NoZW1hIHZhbGlkYXRvci5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEpzb25TY2hlbWFWYWxpZGF0b3IgaW1wbGVtZW50cyBJVmFsaWRhdG9yIHtcbiAgLyoqXG4gICAqIERlZmluZXMgYSBKU09OIFNjaGVtYSB2YWxpZGF0b3IgZnJvbSBhIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBpbnB1dFBhdGggVGhlIHBhdGggdG8gdGhlIGZpbGUgdGhhdCBkZWZpbmVzIHRoZSB2YWxpZGF0b3JcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUZpbGUoaW5wdXRQYXRoOiBzdHJpbmcpOiBKc29uU2NoZW1hVmFsaWRhdG9yIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudDogZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShpbnB1dFBhdGgpKS50b1N0cmluZygpLFxuICAgICAgdHlwZTogVmFsaWRhdG9yVHlwZS5KU09OX1NDSEVNQSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBKU09OIFNjaGVtYSB2YWxpZGF0b3IgZnJvbSBpbmxpbmUgY29kZS5cbiAgICpcbiAgICogQHBhcmFtIGNvZGUgVGhlIGlubGluZSBjb2RlIHRoYXQgZGVmaW5lcyB0aGUgdmFsaWRhdG9yXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21JbmxpbmUoY29kZTogc3RyaW5nKTogSnNvblNjaGVtYVZhbGlkYXRvciB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IGNvZGUsXG4gICAgICB0eXBlOiBWYWxpZGF0b3JUeXBlLkpTT05fU0NIRU1BLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY29udGVudDogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgdHlwZTogVmFsaWRhdG9yVHlwZTtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIGFuIEFXUyBMYW1iZGEgdmFsaWRhdG9yLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTGFtYmRhVmFsaWRhdG9yIGltcGxlbWVudHMgSVZhbGlkYXRvciB7XG4gIC8qKlxuICAgKiAgRGVmaW5lcyBhbiBBV1MgTGFtYmRhIHZhbGlkYXRvciBmcm9tIGEgTGFtYmRhIGZ1bmN0aW9uLiBUaGlzIHdpbGwgY2FsbFxuICAgKiBgYWRkUGVybWlzc2lvbmAgdG8geW91ciBmdW5jdGlvbiB0byBncmFudCBBV1MgQXBwQ29uZmlnIHBlcm1pc3Npb25zLlxuICAgKlxuICAgKiBAcGFyYW0gZnVuYyBUaGUgZnVuY3Rpb24gdGhhdCBkZWZpbmVzIHRoZSB2YWxpZGF0b3JcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUZ1bmN0aW9uKGZ1bmM6IGxhbWJkYS5GdW5jdGlvbik6IExhbWJkYVZhbGlkYXRvciB7XG4gICAgaWYgKCFmdW5jLnBlcm1pc3Npb25zTm9kZS50cnlGaW5kQ2hpbGQoJ0FwcENvbmZpZ1Blcm1pc3Npb24nKSkge1xuICAgICAgZnVuYy5hZGRQZXJtaXNzaW9uKCdBcHBDb25maWdQZXJtaXNzaW9uJywge1xuICAgICAgICBwcmluY2lwYWw6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYXBwY29uZmlnLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudDogZnVuYy5mdW5jdGlvbkFybixcbiAgICAgIHR5cGU6IFZhbGlkYXRvclR5cGUuTEFNQkRBLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY29udGVudDogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgdHlwZTogVmFsaWRhdG9yVHlwZTtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBob3N0ZWQgY29uZmlndXJhdGlvbiBjb250ZW50LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29uZmlndXJhdGlvbkNvbnRlbnQge1xuICAvKipcbiAgICogRGVmaW5lcyB0aGUgaG9zdGVkIGNvbmZpZ3VyYXRpb24gY29udGVudCBmcm9tIGEgZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIGlucHV0UGF0aCBUaGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGRlZmluZXMgY29uZmlndXJhdGlvbiBjb250ZW50XG4gICAqIEBwYXJhbSBjb250ZW50VHlwZSBUaGUgY29udGVudCB0eXBlIG9mIHRoZSBjb25maWd1cmF0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21GaWxlKGlucHV0UGF0aDogc3RyaW5nLCBjb250ZW50VHlwZT86IHN0cmluZyk6IENvbmZpZ3VyYXRpb25Db250ZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudDogZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShpbnB1dFBhdGgpKS50b1N0cmluZygpLFxuICAgICAgY29udGVudFR5cGU6IGNvbnRlbnRUeXBlIHx8IG1pbWVUeXBlcy5sb29rdXAoaW5wdXRQYXRoKSB8fCAnYXBwbGljYXRpb24vanNvbicsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBob3N0ZWQgY29uZmlndXJhdGlvbiBjb250ZW50IGZyb20gaW5saW5lIGNvZGUuXG4gICAqXG4gICAqIEBwYXJhbSBjb250ZW50IFRoZSBpbmxpbmUgY29kZSB0aGF0IGRlZmluZXMgdGhlIGNvbmZpZ3VyYXRpb24gY29udGVudFxuICAgKiBAcGFyYW0gY29udGVudFR5cGUgVGhlIGNvbnRlbnQgdHlwZSBvZiB0aGUgY29uZmlndXJhdGlvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tSW5saW5lKGNvbnRlbnQ6IHN0cmluZywgY29udGVudFR5cGU/OiBzdHJpbmcpOiBDb25maWd1cmF0aW9uQ29udGVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQsXG4gICAgICBjb250ZW50VHlwZTogY29udGVudFR5cGUgfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBob3N0ZWQgY29uZmlndXJhdGlvbiBjb250ZW50IGFzIEpTT04gZnJvbSBpbmxpbmUgY29kZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRlbnQgVGhlIGlubGluZSBjb2RlIHRoYXQgZGVmaW5lcyB0aGUgY29uZmlndXJhdGlvbiBjb250ZW50XG4gICAqIEBwYXJhbSBjb250ZW50VHlwZSBUaGUgY29udGVudCB0eXBlIG9mIHRoZSBjb25maWd1cmF0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21JbmxpbmVKc29uKGNvbnRlbnQ6IHN0cmluZywgY29udGVudFR5cGU/OiBzdHJpbmcpOiBDb25maWd1cmF0aW9uQ29udGVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQsXG4gICAgICBjb250ZW50VHlwZTogY29udGVudFR5cGUgfHwgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyB0aGUgaG9zdGVkIGNvbmZpZ3VyYXRpb24gY29udGVudCBhcyB0ZXh0IGZyb20gaW5saW5lIGNvZGUuXG4gICAqXG4gICAqIEBwYXJhbSBjb250ZW50IFRoZSBpbmxpbmUgY29kZSB0aGF0IGRlZmluZXMgdGhlIGNvbmZpZ3VyYXRpb24gY29udGVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tSW5saW5lVGV4dChjb250ZW50OiBzdHJpbmcpOiBDb25maWd1cmF0aW9uQ29udGVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQsXG4gICAgICBjb250ZW50VHlwZTogJ3RleHQvcGxhaW4nLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyB0aGUgaG9zdGVkIGNvbmZpZ3VyYXRpb24gY29udGVudCBhcyBZQU1MIGZyb20gaW5saW5lIGNvZGUuXG4gICAqXG4gICAqIEBwYXJhbSBjb250ZW50IFRoZSBpbmxpbmUgY29kZSB0aGF0IGRlZmluZXMgdGhlIGNvbmZpZ3VyYXRpb24gY29udGVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tSW5saW5lWWFtbChjb250ZW50OiBzdHJpbmcpOiBDb25maWd1cmF0aW9uQ29udGVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQsXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gteWFtbCcsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBjb250ZW50LlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNvbnRlbnQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gY29udGVudCB0eXBlLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNvbnRlbnRUeXBlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgaW50ZWdyYXRlZCBjb25maWd1cmF0aW9uIHNvdXJjZXMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb25maWd1cmF0aW9uU291cmNlIHtcbiAgLyoqXG4gICAqIERlZmluZXMgY29uZmlndXJhdGlvbiBjb250ZW50IGZyb20gYW4gQW1hem9uIFMzIGJ1Y2tldC5cbiAgICpcbiAgICogQHBhcmFtIGJ1Y2tldCBUaGUgUzMgYnVja2V0IHdoZXJlIHRoZSBjb25maWd1cmF0aW9uIGlzIHN0b3JlZFxuICAgKiBAcGFyYW0gb2JqZWN0S2V5IFRoZSBwYXRoIHRvIHRoZSBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSBrZXkgVGhlIEtNUyBLZXkgdGhhdCB0aGUgYnVja2V0IGlzIGVuY3J5cHRlZCB3aXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21CdWNrZXQoYnVja2V0OiBzMy5JQnVja2V0LCBvYmplY3RLZXk6IHN0cmluZywga2V5Pzoga21zLklLZXkpOiBDb25maWd1cmF0aW9uU291cmNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9jYXRpb25Vcmk6IGJ1Y2tldC5zM1VybEZvck9iamVjdChvYmplY3RLZXkpLFxuICAgICAgdHlwZTogQ29uZmlndXJhdGlvblNvdXJjZVR5cGUuUzMsXG4gICAgICBrZXksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGNvbmZpZ3VyYXRpb24gY29udGVudCBmcm9tIGFuIEFXUyBTZWNyZXRzIE1hbmFnZXIgc2VjcmV0LlxuICAgKlxuICAgKiBAcGFyYW0gc2VjcmV0IFRoZSBzZWNyZXQgd2hlcmUgdGhlIGNvbmZpZ3VyYXRpb24gaXMgc3RvcmVkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TZWNyZXQoc2VjcmV0OiBzbS5JU2VjcmV0KTogQ29uZmlndXJhdGlvblNvdXJjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvY2F0aW9uVXJpOiBzZWNyZXQuc2VjcmV0QXJuLFxuICAgICAgdHlwZTogQ29uZmlndXJhdGlvblNvdXJjZVR5cGUuU0VDUkVUU19NQU5BR0VSLFxuICAgICAga2V5OiBzZWNyZXQuZW5jcnlwdGlvbktleSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgY29uZmlndXJhdGlvbiBjb250ZW50IGZyb20gYSBTeXN0ZW1zIE1hbmFnZXIgKFNTTSkgUGFyYW1ldGVyIFN0b3JlIHBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIHBhcmFtZXRlciBUaGUgcGFyYW1ldGVyIHdoZXJlIHRoZSBjb25maWd1cmF0aW9uIGlzIHN0b3JlZFxuICAgKiBAcGFyYW0ga2V5IFRoZSBLTVMgS2V5IHRoYXQgdGhlIHNlY3VyZSBzdHJpbmcgaXMgZW5jcnlwdGVkIHdpdGhcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVBhcmFtZXRlcihwYXJhbWV0ZXI6IHNzbS5JUGFyYW1ldGVyLCBrZXk/OiBrbXMuSUtleSk6IENvbmZpZ3VyYXRpb25Tb3VyY2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsb2NhdGlvblVyaTogcGFyYW1ldGVyLnBhcmFtZXRlckFybixcbiAgICAgIHR5cGU6IENvbmZpZ3VyYXRpb25Tb3VyY2VUeXBlLlNTTV9QQVJBTUVURVIsXG4gICAgICBrZXksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGNvbmZpZ3VyYXRpb24gY29udGVudCBmcm9tIGEgU3lzdGVtcyBNYW5hZ2VyIChTU00pIGRvY3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZG9jdW1lbnQgVGhlIFNTTSBkb2N1bWVudCB3aGVyZSB0aGUgY29uZmlndXJhdGlvbiBpcyBzdG9yZWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNmbkRvY3VtZW50KGRvY3VtZW50OiBzc20uQ2ZuRG9jdW1lbnQpOiBDb25maWd1cmF0aW9uU291cmNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9jYXRpb25Vcmk6IGBzc20tZG9jdW1lbnQ6Ly8ke2RvY3VtZW50LnJlZn1gLFxuICAgICAgdHlwZTogQ29uZmlndXJhdGlvblNvdXJjZVR5cGUuU1NNX0RPQ1VNRU5ULFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBjb25maWd1cmF0aW9uIGNvbnRlbnQgZnJvbSBBV1MgQ29kZVBpcGVsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0gcGlwZWxpbmUgVGhlIHBpcGVsaW5lIHdoZXJlIHRoZSBjb25maWd1cmF0aW9uIGlzIHN0b3JlZFxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUGlwZWxpbmUocGlwZWxpbmU6IGNwLklQaXBlbGluZSk6IENvbmZpZ3VyYXRpb25Tb3VyY2Uge1xuICAgIHJldHVybiB7XG4gICAgICBsb2NhdGlvblVyaTogYGNvZGVwaXBlbGluZTovLyR7cGlwZWxpbmUucGlwZWxpbmVOYW1lfWAsXG4gICAgICB0eXBlOiBDb25maWd1cmF0aW9uU291cmNlVHlwZS5DT0RFX1BJUEVMSU5FLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhlIFVSSSBvZiB0aGUgY29uZmlndXJhdGlvbiBzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgbG9jYXRpb25Vcmk6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIGNvbmZpZ3VyYXRpb24gc291cmNlLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHR5cGU6IENvbmZpZ3VyYXRpb25Tb3VyY2VUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgS01TIEtleSB0aGF0IGVuY3J5cHRzIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGtleT86IGttcy5JS2V5O1xufVxuIl19