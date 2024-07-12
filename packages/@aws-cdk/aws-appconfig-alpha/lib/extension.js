"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensibleBase = exports.Extension = exports.Parameter = exports.Action = exports.EventBridgeDestination = exports.SnsDestination = exports.SqsDestination = exports.LambdaDestination = exports.SourceType = exports.ActionPoint = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_appconfig_1 = require("aws-cdk-lib/aws-appconfig");
const iam = require("aws-cdk-lib/aws-iam");
const hash_1 = require("./private/hash");
/**
 * Defines Extension action points.
 *
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/working-with-appconfig-extensions-about.html#working-with-appconfig-extensions-how-it-works-step-2
 */
var ActionPoint;
(function (ActionPoint) {
    ActionPoint["PRE_CREATE_HOSTED_CONFIGURATION_VERSION"] = "PRE_CREATE_HOSTED_CONFIGURATION_VERSION";
    ActionPoint["PRE_START_DEPLOYMENT"] = "PRE_START_DEPLOYMENT";
    ActionPoint["ON_DEPLOYMENT_START"] = "ON_DEPLOYMENT_START";
    ActionPoint["ON_DEPLOYMENT_STEP"] = "ON_DEPLOYMENT_STEP";
    ActionPoint["ON_DEPLOYMENT_BAKING"] = "ON_DEPLOYMENT_BAKING";
    ActionPoint["ON_DEPLOYMENT_COMPLETE"] = "ON_DEPLOYMENT_COMPLETE";
    ActionPoint["ON_DEPLOYMENT_ROLLED_BACK"] = "ON_DEPLOYMENT_ROLLED_BACK";
})(ActionPoint || (exports.ActionPoint = ActionPoint = {}));
/**
 * Defines the source type for event destinations.
 */
var SourceType;
(function (SourceType) {
    SourceType["LAMBDA"] = "lambda";
    SourceType["SQS"] = "sqs";
    SourceType["SNS"] = "sns";
    SourceType["EVENTS"] = "events";
})(SourceType || (exports.SourceType = SourceType = {}));
/**
 * Use an AWS Lambda function as an event destination.
 */
class LambdaDestination {
    constructor(func) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.LambdaDestination", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LambdaDestination);
            }
            throw error;
        }
        this.extensionUri = func.functionArn;
        this.type = SourceType.LAMBDA;
        const policy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: [this.extensionUri],
            actions: [
                'lambda:InvokeFunction',
                'lambda:InvokeAsync',
            ],
        });
        this.policyDocument = new iam.PolicyDocument({
            statements: [policy],
        });
        if (!func.permissionsNode.tryFindChild('AppConfigPermission')) {
            func.addPermission('AppConfigPermission', {
                principal: new iam.ServicePrincipal('appconfig.amazonaws.com'),
            });
        }
    }
}
exports.LambdaDestination = LambdaDestination;
_a = JSII_RTTI_SYMBOL_1;
LambdaDestination[_a] = { fqn: "@aws-cdk/aws-appconfig-alpha.LambdaDestination", version: "0.0.0" };
/**
 * Use an Amazon SQS queue as an event destination.
 */
class SqsDestination {
    constructor(queue) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.SqsDestination", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SqsDestination);
            }
            throw error;
        }
        this.extensionUri = queue.queueArn;
        this.type = SourceType.SQS;
        const policy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: [this.extensionUri],
            actions: ['sqs:SendMessage'],
        });
        this.policyDocument = new iam.PolicyDocument({
            statements: [policy],
        });
    }
}
exports.SqsDestination = SqsDestination;
_b = JSII_RTTI_SYMBOL_1;
SqsDestination[_b] = { fqn: "@aws-cdk/aws-appconfig-alpha.SqsDestination", version: "0.0.0" };
/**
 * Use an Amazon SNS topic as an event destination.
 */
class SnsDestination {
    constructor(topic) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.SnsDestination", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SnsDestination);
            }
            throw error;
        }
        this.extensionUri = topic.topicArn;
        this.type = SourceType.SNS;
        const policy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: [this.extensionUri],
            actions: ['sns:Publish'],
        });
        this.policyDocument = new iam.PolicyDocument({
            statements: [policy],
        });
    }
}
exports.SnsDestination = SnsDestination;
_c = JSII_RTTI_SYMBOL_1;
SnsDestination[_c] = { fqn: "@aws-cdk/aws-appconfig-alpha.SnsDestination", version: "0.0.0" };
/**
 * Use an Amazon EventBridge event bus as an event destination.
 */
class EventBridgeDestination {
    constructor(bus) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.EventBridgeDestination", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EventBridgeDestination);
            }
            throw error;
        }
        this.extensionUri = bus.eventBusArn;
        this.type = SourceType.EVENTS;
    }
}
exports.EventBridgeDestination = EventBridgeDestination;
_d = JSII_RTTI_SYMBOL_1;
EventBridgeDestination[_d] = { fqn: "@aws-cdk/aws-appconfig-alpha.EventBridgeDestination", version: "0.0.0" };
/**
 * Defines an action for an extension.
 */
class Action {
    constructor(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Action", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Action);
            }
            throw error;
        }
        this.actionPoints = props.actionPoints;
        this.eventDestination = props.eventDestination;
        this.name = props.name;
        this.executionRole = props.executionRole;
        this.description = props.description;
        this.invokeWithoutExecutionRole = props.invokeWithoutExecutionRole || false;
    }
}
exports.Action = Action;
_e = JSII_RTTI_SYMBOL_1;
Action[_e] = { fqn: "@aws-cdk/aws-appconfig-alpha.Action", version: "0.0.0" };
/**
 * Defines a parameter for an extension.
 */
class Parameter {
    /**
     * A required parameter for an extension.
     *
     * @param name The name of the parameter
     * @param value The value of the parameter
     * @param description A description for the parameter
     */
    static required(name, value, description) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Parameter#required", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.required);
            }
            throw error;
        }
        return new Parameter(name, true, value, description);
    }
    /**
     * An optional parameter for an extension.
     *
     * @param name The name of the parameter
     * @param value The value of the parameter
     * @param description A description for the parameter
     */
    static notRequired(name, value, description) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Parameter#notRequired", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.notRequired);
            }
            throw error;
        }
        return new Parameter(name, false, value, description);
    }
    constructor(name, isRequired, value, description) {
        this.name = name;
        this.isRequired = isRequired;
        this.value = value;
        this.description = description;
    }
}
exports.Parameter = Parameter;
_f = JSII_RTTI_SYMBOL_1;
Parameter[_f] = { fqn: "@aws-cdk/aws-appconfig-alpha.Parameter", version: "0.0.0" };
/**
 * An AWS AppConfig extension.
 *
 * @resource AWS::AppConfig::Extension
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/working-with-appconfig-extensions.html
 */
class Extension extends aws_cdk_lib_1.Resource {
    /**
     * Imports an extension into the CDK using its Amazon Resource Name (ARN).
     *
     * @param scope The parent construct
     * @param id The name of the extension construct
     * @param extensionArn The Amazon Resource Name (ARN) of the extension
     */
    static fromExtensionArn(scope, id, extensionArn) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Extension#fromExtensionArn", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromExtensionArn);
            }
            throw error;
        }
        const parsedArn = aws_cdk_lib_1.Stack.of(scope).splitArn(extensionArn, aws_cdk_lib_1.ArnFormat.SLASH_RESOURCE_NAME);
        if (!parsedArn.resourceName) {
            throw new Error(`Missing required /$/{extensionId}//$/{extensionVersionNumber} from configuration profile ARN: ${parsedArn.resourceName}`);
        }
        const resourceName = parsedArn.resourceName.split('/');
        if (resourceName.length != 2 || !resourceName[0] || !resourceName[1]) {
            throw new Error('Missing required parameters for extension ARN: format should be /$/{extensionId}//$/{extensionVersionNumber}');
        }
        const extensionId = resourceName[0];
        const extensionVersionNumber = resourceName[1];
        class Import extends aws_cdk_lib_1.Resource {
            constructor() {
                super(...arguments);
                this.extensionId = extensionId;
                this.extensionVersionNumber = parseInt(extensionVersionNumber);
                this.extensionArn = extensionArn;
            }
        }
        return new Import(scope, id, {
            environmentFromArn: extensionArn,
        });
    }
    /**
     * Imports an extension into the CDK using its attributes.
     *
     * @param scope The parent construct
     * @param id The name of the extension construct
     * @param attrs The attributes of the extension
     */
    static fromExtensionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Extension#fromExtensionAttributes", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ExtensionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromExtensionAttributes);
            }
            throw error;
        }
        const stack = aws_cdk_lib_1.Stack.of(scope);
        const extensionArn = attrs.extensionArn || stack.formatArn({
            service: 'appconfig',
            resource: 'extension',
            resourceName: `${attrs.extensionId}/${attrs.extensionVersionNumber}`,
        });
        class Import extends aws_cdk_lib_1.Resource {
            constructor() {
                super(...arguments);
                this.extensionId = attrs.extensionId;
                this.extensionVersionNumber = attrs.extensionVersionNumber;
                this.extensionArn = extensionArn;
                this.name = attrs.name;
                this.actions = attrs.actions;
                this.description = attrs.description;
            }
        }
        return new Import(scope, id, {
            environmentFromArn: extensionArn,
        });
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.extensionName,
        });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Extension", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ExtensionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Extension);
            }
            throw error;
        }
        this.actions = props.actions;
        this.name = props.extensionName || aws_cdk_lib_1.Names.uniqueResourceName(this, {
            maxLength: 64,
            separator: '-',
        });
        this.description = props.description;
        this.latestVersionNumber = props.latestVersionNumber;
        this.parameters = props.parameters;
        const resource = new aws_appconfig_1.CfnExtension(this, 'Resource', {
            actions: this.actions.reduce((acc, cur, index) => {
                const extensionUri = cur.eventDestination.extensionUri;
                const sourceType = cur.eventDestination.type;
                this.executionRole = cur.executionRole;
                const name = cur.name ?? `${this.name}-${index}`;
                cur.actionPoints.forEach((actionPoint) => {
                    acc[actionPoint] = [
                        {
                            Name: name,
                            Uri: extensionUri,
                            ...(sourceType === SourceType.EVENTS || cur.invokeWithoutExecutionRole
                                ? {}
                                : { RoleArn: this.executionRole?.roleArn || this.getExecutionRole(cur.eventDestination, name).roleArn }),
                            ...(cur.description ? { Description: cur.description } : {}),
                        },
                    ];
                });
                return acc;
            }, {}),
            name: this.name,
            description: this.description,
            latestVersionNumber: this.latestVersionNumber,
            parameters: this.parameters?.reduce((acc, cur) => {
                acc[cur.name] = {
                    required: cur.isRequired,
                    description: cur.description,
                };
                return acc;
            }, {}),
        });
        this._cfnExtension = resource;
        this.extensionId = this._cfnExtension.attrId;
        this.extensionVersionNumber = this._cfnExtension.attrVersionNumber;
        this.extensionArn = this.getResourceArnAttribute(this._cfnExtension.attrArn, {
            service: 'appconfig',
            resource: 'extension',
            resourceName: `${this.extensionId}/${this.extensionVersionNumber}`,
        });
    }
    getExecutionRole(eventDestination, actionName) {
        const versionNumber = this.latestVersionNumber ? this.latestVersionNumber + 1 : 1;
        const combinedObjects = (0, hash_1.stringifyObjects)(this.name, versionNumber, actionName);
        this.executionRole = new iam.Role(this, `Role${(0, hash_1.getHash)(combinedObjects)}`, {
            roleName: aws_cdk_lib_1.PhysicalName.GENERATE_IF_NEEDED,
            assumedBy: new iam.ServicePrincipal('appconfig.amazonaws.com'),
            inlinePolicies: {
                ['AllowAppConfigInvokeExtensionEventSourcePolicy']: eventDestination.policyDocument,
            },
        });
        return this.executionRole;
    }
}
exports.Extension = Extension;
_g = JSII_RTTI_SYMBOL_1;
Extension[_g] = { fqn: "@aws-cdk/aws-appconfig-alpha.Extension", version: "0.0.0" };
/**
 * This class is meant to be used by AWS AppConfig resources (application,
 * configuration profile, environment) directly. There is currently no use
 * for this class outside of the AWS AppConfig construct implementation. It is
 * intended to be used with the resources since there is currently no way to
 * inherit from two classes (at least within JSII constraints).
 */
class ExtensibleBase {
    constructor(scope, resourceArn, resourceName) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ExtensibleBase", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ExtensibleBase);
            }
            throw error;
        }
        this.resourceArn = resourceArn;
        this.resourceName = resourceName;
        this.scope = scope;
    }
    on(actionPoint, eventDestination, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ExtensibleBase#on", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ActionPoint(actionPoint);
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_IEventDestination(eventDestination);
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ExtensionOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.on);
            }
            throw error;
        }
        this.getExtensionForActionPoint(eventDestination, actionPoint, options);
    }
    preCreateHostedConfigurationVersion(eventDestination, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ExtensibleBase#preCreateHostedConfigurationVersion", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_IEventDestination(eventDestination);
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ExtensionOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.preCreateHostedConfigurationVersion);
            }
            throw error;
        }
        this.getExtensionForActionPoint(eventDestination, ActionPoint.PRE_CREATE_HOSTED_CONFIGURATION_VERSION, options);
    }
    preStartDeployment(eventDestination, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ExtensibleBase#preStartDeployment", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_IEventDestination(eventDestination);
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ExtensionOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.preStartDeployment);
            }
            throw error;
        }
        this.getExtensionForActionPoint(eventDestination, ActionPoint.PRE_START_DEPLOYMENT, options);
    }
    onDeploymentStart(eventDestination, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ExtensibleBase#onDeploymentStart", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_IEventDestination(eventDestination);
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ExtensionOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onDeploymentStart);
            }
            throw error;
        }
        this.getExtensionForActionPoint(eventDestination, ActionPoint.ON_DEPLOYMENT_START, options);
    }
    onDeploymentStep(eventDestination, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ExtensibleBase#onDeploymentStep", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_IEventDestination(eventDestination);
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ExtensionOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onDeploymentStep);
            }
            throw error;
        }
        this.getExtensionForActionPoint(eventDestination, ActionPoint.ON_DEPLOYMENT_STEP, options);
    }
    onDeploymentBaking(eventDestination, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ExtensibleBase#onDeploymentBaking", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_IEventDestination(eventDestination);
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ExtensionOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onDeploymentBaking);
            }
            throw error;
        }
        this.getExtensionForActionPoint(eventDestination, ActionPoint.ON_DEPLOYMENT_BAKING, options);
    }
    onDeploymentComplete(eventDestination, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ExtensibleBase#onDeploymentComplete", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_IEventDestination(eventDestination);
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ExtensionOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onDeploymentComplete);
            }
            throw error;
        }
        this.getExtensionForActionPoint(eventDestination, ActionPoint.ON_DEPLOYMENT_COMPLETE, options);
    }
    onDeploymentRolledBack(eventDestination, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ExtensibleBase#onDeploymentRolledBack", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_IEventDestination(eventDestination);
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ExtensionOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onDeploymentRolledBack);
            }
            throw error;
        }
        this.getExtensionForActionPoint(eventDestination, ActionPoint.ON_DEPLOYMENT_ROLLED_BACK, options);
    }
    addExtension(extension) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.ExtensibleBase#addExtension", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_IExtension(extension);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addExtension);
            }
            throw error;
        }
        this.addExtensionAssociation(extension);
    }
    getExtensionForActionPoint(eventDestination, actionPoint, options) {
        const name = options?.extensionName || this.getExtensionDefaultName();
        const versionNumber = options?.latestVersionNumber ? options?.latestVersionNumber + 1 : 1;
        const extension = new Extension(this.scope, `Extension${this.getExtensionHash(name, versionNumber)}`, {
            actions: [
                new Action({
                    eventDestination,
                    actionPoints: [
                        actionPoint,
                    ],
                }),
            ],
            extensionName: name,
            ...(options?.description ? { description: options.description } : {}),
            ...(options?.latestVersionNumber ? { latestVersionNumber: options.latestVersionNumber } : {}),
            ...(options?.parameters ? { parameters: options.parameters } : {}),
        });
        this.addExtensionAssociation(extension);
    }
    addExtensionAssociation(extension) {
        const versionNumber = extension?.latestVersionNumber ? extension?.latestVersionNumber + 1 : 1;
        const name = extension.name ?? this.getExtensionDefaultName();
        new aws_appconfig_1.CfnExtensionAssociation(this.scope, `AssociationResource${this.getExtensionAssociationHash(name, versionNumber)}`, {
            extensionIdentifier: extension.extensionId,
            resourceIdentifier: this.resourceArn,
            extensionVersionNumber: extension.extensionVersionNumber,
            parameters: extension.parameters?.reduce((acc, cur) => {
                if (cur.value) {
                    acc[cur.name] = cur.value;
                }
                return acc;
            }, {}),
        });
    }
    getExtensionHash(name, versionNumber) {
        const combinedString = (0, hash_1.stringifyObjects)(name, versionNumber);
        return (0, hash_1.getHash)(combinedString);
    }
    getExtensionAssociationHash(name, versionNumber) {
        const resourceIdentifier = this.resourceName ?? this.resourceArn;
        const combinedString = (0, hash_1.stringifyObjects)(resourceIdentifier, name, versionNumber);
        return (0, hash_1.getHash)(combinedString);
    }
    getExtensionDefaultName() {
        return aws_cdk_lib_1.Names.uniqueResourceName(this.scope, {
            maxLength: 54,
            separator: '-',
        }) + '-Extension';
    }
}
exports.ExtensibleBase = ExtensibleBase;
_h = JSII_RTTI_SYMBOL_1;
ExtensibleBase[_h] = { fqn: "@aws-cdk/aws-appconfig-alpha.ExtensibleBase", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXh0ZW5zaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDZDQUF5RjtBQUN6Riw2REFBa0Y7QUFFbEYsMkNBQTJDO0FBSzNDLHlDQUEyRDtBQUUzRDs7OztHQUlHO0FBQ0gsSUFBWSxXQVFYO0FBUkQsV0FBWSxXQUFXO0lBQ3JCLGtHQUFtRixDQUFBO0lBQ25GLDREQUE2QyxDQUFBO0lBQzdDLDBEQUEyQyxDQUFBO0lBQzNDLHdEQUF5QyxDQUFBO0lBQ3pDLDREQUE2QyxDQUFBO0lBQzdDLGdFQUFpRCxDQUFBO0lBQ2pELHNFQUF1RCxDQUFBO0FBQ3pELENBQUMsRUFSVyxXQUFXLDJCQUFYLFdBQVcsUUFRdEI7QUFFRDs7R0FFRztBQUNILElBQVksVUFLWDtBQUxELFdBQVksVUFBVTtJQUNwQiwrQkFBaUIsQ0FBQTtJQUNqQix5QkFBVyxDQUFBO0lBQ1gseUJBQVcsQ0FBQTtJQUNYLCtCQUFpQixDQUFBO0FBQ25CLENBQUMsRUFMVyxVQUFVLDBCQUFWLFVBQVUsUUFLckI7QUFzQkQ7O0dBRUc7QUFDSCxNQUFhLGlCQUFpQjtJQUs1QixZQUFZLElBQXNCOzs7Ozs7K0NBTHZCLGlCQUFpQjs7OztRQU0xQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQzlCLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNyQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDOUIsT0FBTyxFQUFFO2dCQUNQLHVCQUF1QjtnQkFDdkIsb0JBQW9CO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLEdBQUcs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QUUsSUFBSSxDQUFDLFdBQVc7WUFDcEMsc0JBQXNCLEVBQUUsU0FBUyxDQUFDLHNCQUFzQjtZQUN4RCxVQUFVLEVBQUUsU0FBUyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUE0QixFQUFFLEdBQWMsRUFBRSxFQUFFO2dCQUN4RixJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDZCxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBQzVCLENBQUM7Z0JBQ0QsT0FBTyxHQUFHLENBQUM7WUFDYixDQUFDLEVBQUUsRUFBRSxDQUFDO1NBQ1AsQ0FBQyxDQUFDO0tBQ0o7SUFFTyxnQkFBZ0IsQ0FBQyxJQUFZLEVBQUUsYUFBcUI7UUFDMUQsTUFBTSxjQUFjLEdBQUcsSUFBQSx1QkFBZ0IsRUFBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDN0QsT0FBTyxJQUFBLGNBQU8sRUFBQyxjQUFjLENBQUMsQ0FBQztLQUNoQztJQUVPLDJCQUEyQixDQUFDLElBQVksRUFBRSxhQUFxQjtRQUNyRSxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNqRSxNQUFNLGNBQWMsR0FBRyxJQUFBLHVCQUFnQixFQUFDLGtCQUFrQixFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNqRixPQUFPLElBQUEsY0FBTyxFQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQ2hDO0lBRU8sdUJBQXVCO1FBQzdCLE9BQU8sbUJBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzFDLFNBQVMsRUFBRSxFQUFFO1lBQ2IsU0FBUyxFQUFFLEdBQUc7U0FDZixDQUFDLEdBQUcsWUFBWSxDQUFDO0tBQ25COztBQW5HSCx3Q0FvR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcm5Gb3JtYXQsIElSZXNvdXJjZSwgTmFtZXMsIFBoeXNpY2FsTmFtZSwgUmVzb3VyY2UsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ2ZuRXh0ZW5zaW9uLCBDZm5FeHRlbnNpb25Bc3NvY2lhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcHBjb25maWcnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zcXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBnZXRIYXNoLCBzdHJpbmdpZnlPYmplY3RzIH0gZnJvbSAnLi9wcml2YXRlL2hhc2gnO1xuXG4vKipcbiAqIERlZmluZXMgRXh0ZW5zaW9uIGFjdGlvbiBwb2ludHMuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXBwY29uZmlnL2xhdGVzdC91c2VyZ3VpZGUvd29ya2luZy13aXRoLWFwcGNvbmZpZy1leHRlbnNpb25zLWFib3V0Lmh0bWwjd29ya2luZy13aXRoLWFwcGNvbmZpZy1leHRlbnNpb25zLWhvdy1pdC13b3Jrcy1zdGVwLTJcbiAqL1xuZXhwb3J0IGVudW0gQWN0aW9uUG9pbnQge1xuICBQUkVfQ1JFQVRFX0hPU1RFRF9DT05GSUdVUkFUSU9OX1ZFUlNJT04gPSAnUFJFX0NSRUFURV9IT1NURURfQ09ORklHVVJBVElPTl9WRVJTSU9OJyxcbiAgUFJFX1NUQVJUX0RFUExPWU1FTlQgPSAnUFJFX1NUQVJUX0RFUExPWU1FTlQnLFxuICBPTl9ERVBMT1lNRU5UX1NUQVJUID0gJ09OX0RFUExPWU1FTlRfU1RBUlQnLFxuICBPTl9ERVBMT1lNRU5UX1NURVAgPSAnT05fREVQTE9ZTUVOVF9TVEVQJyxcbiAgT05fREVQTE9ZTUVOVF9CQUtJTkcgPSAnT05fREVQTE9ZTUVOVF9CQUtJTkcnLFxuICBPTl9ERVBMT1lNRU5UX0NPTVBMRVRFID0gJ09OX0RFUExPWU1FTlRfQ09NUExFVEUnLFxuICBPTl9ERVBMT1lNRU5UX1JPTExFRF9CQUNLID0gJ09OX0RFUExPWU1FTlRfUk9MTEVEX0JBQ0snLFxufVxuXG4vKipcbiAqIERlZmluZXMgdGhlIHNvdXJjZSB0eXBlIGZvciBldmVudCBkZXN0aW5hdGlvbnMuXG4gKi9cbmV4cG9ydCBlbnVtIFNvdXJjZVR5cGUge1xuICBMQU1CREEgPSAnbGFtYmRhJyxcbiAgU1FTID0gJ3NxcycsXG4gIFNOUyA9ICdzbnMnLFxuICBFVkVOVFMgPSAnZXZlbnRzJyxcbn1cblxuLyoqXG4gKiBJbXBsZW1lbnRlZCBieSBhbGxvd2VkIGV4dGVuc2lvbiBldmVudCBkZXN0aW5hdGlvbnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUV2ZW50RGVzdGluYXRpb24ge1xuICAvKipcbiAgICogVGhlIFVSSSBvZiB0aGUgZXh0ZW5zaW9uIGV2ZW50IGRlc3RpbmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZXh0ZW5zaW9uVXJpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSBleHRlbnNpb24gZXZlbnQgZGVzdGluYXRpb24uXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBTb3VyY2VUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIHBvbGljeSBkb2N1bWVudCB0byBpbnZva2UgdGhlIGV2ZW50IGRlc3RpbmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5RG9jdW1lbnQ/OiBpYW0uUG9saWN5RG9jdW1lbnQ7XG59XG5cbi8qKlxuICogVXNlIGFuIEFXUyBMYW1iZGEgZnVuY3Rpb24gYXMgYW4gZXZlbnQgZGVzdGluYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBMYW1iZGFEZXN0aW5hdGlvbiBpbXBsZW1lbnRzIElFdmVudERlc3RpbmF0aW9uIHtcbiAgcHVibGljIHJlYWRvbmx5IGV4dGVuc2lvblVyaTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogU291cmNlVHlwZTtcbiAgcHVibGljIHJlYWRvbmx5IHBvbGljeURvY3VtZW50PzogaWFtLlBvbGljeURvY3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGZ1bmM6IGxhbWJkYS5JRnVuY3Rpb24pIHtcbiAgICB0aGlzLmV4dGVuc2lvblVyaSA9IGZ1bmMuZnVuY3Rpb25Bcm47XG4gICAgdGhpcy50eXBlID0gU291cmNlVHlwZS5MQU1CREE7XG4gICAgY29uc3QgcG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgcmVzb3VyY2VzOiBbdGhpcy5leHRlbnNpb25VcmldLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgJ2xhbWJkYTpJbnZva2VBc3luYycsXG4gICAgICBdLFxuICAgIH0pO1xuICAgIHRoaXMucG9saWN5RG9jdW1lbnQgPSBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcbiAgICAgIHN0YXRlbWVudHM6IFtwb2xpY3ldLFxuICAgIH0pO1xuXG4gICAgaWYgKCFmdW5jLnBlcm1pc3Npb25zTm9kZS50cnlGaW5kQ2hpbGQoJ0FwcENvbmZpZ1Blcm1pc3Npb24nKSkge1xuICAgICAgZnVuYy5hZGRQZXJtaXNzaW9uKCdBcHBDb25maWdQZXJtaXNzaW9uJywge1xuICAgICAgICBwcmluY2lwYWw6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYXBwY29uZmlnLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFVzZSBhbiBBbWF6b24gU1FTIHF1ZXVlIGFzIGFuIGV2ZW50IGRlc3RpbmF0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgU3FzRGVzdGluYXRpb24gaW1wbGVtZW50cyBJRXZlbnREZXN0aW5hdGlvbiB7XG4gIHB1YmxpYyByZWFkb25seSBleHRlbnNpb25Vcmk6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6IFNvdXJjZVR5cGU7XG4gIHB1YmxpYyByZWFkb25seSBwb2xpY3lEb2N1bWVudD86IGlhbS5Qb2xpY3lEb2N1bWVudDtcblxuICBjb25zdHJ1Y3RvcihxdWV1ZTogc3FzLklRdWV1ZSkge1xuICAgIHRoaXMuZXh0ZW5zaW9uVXJpID0gcXVldWUucXVldWVBcm47XG4gICAgdGhpcy50eXBlID0gU291cmNlVHlwZS5TUVM7XG4gICAgY29uc3QgcG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgcmVzb3VyY2VzOiBbdGhpcy5leHRlbnNpb25VcmldLFxuICAgICAgYWN0aW9uczogWydzcXM6U2VuZE1lc3NhZ2UnXSxcbiAgICB9KTtcbiAgICB0aGlzLnBvbGljeURvY3VtZW50ID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCh7XG4gICAgICBzdGF0ZW1lbnRzOiBbcG9saWN5XSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFVzZSBhbiBBbWF6b24gU05TIHRvcGljIGFzIGFuIGV2ZW50IGRlc3RpbmF0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgU25zRGVzdGluYXRpb24gaW1wbGVtZW50cyBJRXZlbnREZXN0aW5hdGlvbiB7XG4gIHB1YmxpYyByZWFkb25seSBleHRlbnNpb25Vcmk6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6IFNvdXJjZVR5cGU7XG4gIHB1YmxpYyByZWFkb25seSBwb2xpY3lEb2N1bWVudD86IGlhbS5Qb2xpY3lEb2N1bWVudDtcblxuICBjb25zdHJ1Y3Rvcih0b3BpYzogc25zLklUb3BpYykge1xuICAgIHRoaXMuZXh0ZW5zaW9uVXJpID0gdG9waWMudG9waWNBcm47XG4gICAgdGhpcy50eXBlID0gU291cmNlVHlwZS5TTlM7XG4gICAgY29uc3QgcG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgcmVzb3VyY2VzOiBbdGhpcy5leHRlbnNpb25VcmldLFxuICAgICAgYWN0aW9uczogWydzbnM6UHVibGlzaCddLFxuICAgIH0pO1xuICAgIHRoaXMucG9saWN5RG9jdW1lbnQgPSBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcbiAgICAgIHN0YXRlbWVudHM6IFtwb2xpY3ldLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVXNlIGFuIEFtYXpvbiBFdmVudEJyaWRnZSBldmVudCBidXMgYXMgYW4gZXZlbnQgZGVzdGluYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudEJyaWRnZURlc3RpbmF0aW9uIGltcGxlbWVudHMgSUV2ZW50RGVzdGluYXRpb24ge1xuICBwdWJsaWMgcmVhZG9ubHkgZXh0ZW5zaW9uVXJpOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBTb3VyY2VUeXBlO1xuXG4gIGNvbnN0cnVjdG9yKGJ1czogZXZlbnRzLklFdmVudEJ1cykge1xuICAgIHRoaXMuZXh0ZW5zaW9uVXJpID0gYnVzLmV2ZW50QnVzQXJuO1xuICAgIHRoaXMudHlwZSA9IFNvdXJjZVR5cGUuRVZFTlRTO1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgdGhlIEFjdGlvbiBjb25zdHJ1Y3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgYWN0aW9uIHBvaW50cyB0aGF0IHdpbGwgdHJpZ2dlciB0aGUgZXh0ZW5zaW9uIGFjdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGFjdGlvblBvaW50czogQWN0aW9uUG9pbnRbXTtcblxuICAvKipcbiAgICogVGhlIGV2ZW50IGRlc3RpbmF0aW9uIGZvciB0aGUgYWN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIGZvciB0aGUgYWN0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbmFtZSBpcyBnZW5lcmF0ZWQuXG4gICAqL1xuICByZWFkb25seSBuYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZXhlY3V0aW9uIHJvbGUgZm9yIHRoZSBhY3Rpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSByb2xlIGlzIGdlbmVyYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGV4ZWN1dGlvblJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXNjcmlwdGlvbiBmb3IgdGhlIGFjdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZmxhZyB0aGF0IHNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0byBjcmVhdGUgdGhlIGV4ZWN1dGlvbiByb2xlLlxuICAgKlxuICAgKiBJZiBzZXQgdG8gdHJ1ZSwgdGhlbiB0aGUgcm9sZSB3aWxsIG5vdCBiZSBhdXRvLWdlbmVyYXRlZCB1bmRlciB0aGUgYXNzdW1wdGlvblxuICAgKiB0aGVyZSBpcyBhbHJlYWR5IHRoZSBjb3JyZXNwb25kaW5nIHJlc291cmNlLWJhc2VkIHBvbGljeSBhdHRhY2hlZCB0byB0aGUgZXZlbnRcbiAgICogZGVzdGluYXRpb24uIElmIGZhbHNlLCB0aGUgZXhlY3V0aW9uIHJvbGUgd2lsbCBiZSBnZW5lcmF0ZWQgaWYgbm90IHByb3ZpZGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW52b2tlV2l0aG91dEV4ZWN1dGlvblJvbGU/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIERlZmluZXMgYW4gYWN0aW9uIGZvciBhbiBleHRlbnNpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBBY3Rpb24ge1xuICAvKipcbiAgICogVGhlIGFjdGlvbiBwb2ludHMgdGhhdCB3aWxsIHRyaWdnZXIgdGhlIGV4dGVuc2lvbiBhY3Rpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWN0aW9uUG9pbnRzOiBBY3Rpb25Qb2ludFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgZXZlbnQgZGVzdGluYXRpb24gZm9yIHRoZSBhY3Rpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIGZvciB0aGUgYWN0aW9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBleGVjdXRpb24gcm9sZSBmb3IgdGhlIGFjdGlvbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBleGVjdXRpb25Sb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gZm9yIHRoZSBhY3Rpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBmbGFnIHRoYXQgc3BlY2lmaWVzIHdoZXRoZXIgdG8gY3JlYXRlIHRoZSBleGVjdXRpb24gcm9sZS5cbiAgICovXG4gIHJlYWRvbmx5IGludm9rZVdpdGhvdXRFeGVjdXRpb25Sb2xlPzogYm9vbGVhbjtcblxuICBwdWJsaWMgY29uc3RydWN0b3IocHJvcHM6IEFjdGlvblByb3BzKSB7XG4gICAgdGhpcy5hY3Rpb25Qb2ludHMgPSBwcm9wcy5hY3Rpb25Qb2ludHM7XG4gICAgdGhpcy5ldmVudERlc3RpbmF0aW9uID0gcHJvcHMuZXZlbnREZXN0aW5hdGlvbjtcbiAgICB0aGlzLm5hbWUgPSBwcm9wcy5uYW1lO1xuICAgIHRoaXMuZXhlY3V0aW9uUm9sZSA9IHByb3BzLmV4ZWN1dGlvblJvbGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IHByb3BzLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMuaW52b2tlV2l0aG91dEV4ZWN1dGlvblJvbGUgPSBwcm9wcy5pbnZva2VXaXRob3V0RXhlY3V0aW9uUm9sZSB8fCBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIERlZmluZXMgYSBwYXJhbWV0ZXIgZm9yIGFuIGV4dGVuc2lvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhcmFtZXRlciB7XG4gIC8qKlxuICAgKiBBIHJlcXVpcmVkIHBhcmFtZXRlciBmb3IgYW4gZXh0ZW5zaW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIHBhcmFtZXRlclxuICAgKiBAcGFyYW0gZGVzY3JpcHRpb24gQSBkZXNjcmlwdGlvbiBmb3IgdGhlIHBhcmFtZXRlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZXF1aXJlZChuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGRlc2NyaXB0aW9uPzogc3RyaW5nKTogUGFyYW1ldGVyIHtcbiAgICByZXR1cm4gbmV3IFBhcmFtZXRlcihuYW1lLCB0cnVlLCB2YWx1ZSwgZGVzY3JpcHRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIHBhcmFtZXRlciBmb3IgYW4gZXh0ZW5zaW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcGFyYW1ldGVyXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIHBhcmFtZXRlclxuICAgKiBAcGFyYW0gZGVzY3JpcHRpb24gQSBkZXNjcmlwdGlvbiBmb3IgdGhlIHBhcmFtZXRlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub3RSZXF1aXJlZChuYW1lOiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nLCBkZXNjcmlwdGlvbj86IHN0cmluZyk6IFBhcmFtZXRlciB7XG4gICAgcmV0dXJuIG5ldyBQYXJhbWV0ZXIobmFtZSwgZmFsc2UsIHZhbHVlLCBkZXNjcmlwdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiB0aGUgcGFyYW1ldGVyIGlzIHJlcXVpcmVkIG9yIG9wdGlvbmFsLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGlzUmVxdWlyZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHZhbHVlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgaXNSZXF1aXJlZDogYm9vbGVhbiwgdmFsdWU/OiBzdHJpbmcsIGRlc2NyaXB0aW9uPzogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmlzUmVxdWlyZWQgPSBpc1JlcXVpcmVkO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gIH1cbn1cblxuLyoqXG4gKiBBdHRyaWJ1dGVzIG9mIGFuIGV4aXN0aW5nIEFXUyBBcHBDb25maWcgZXh0ZW5zaW9uIHRvIGltcG9ydC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFeHRlbnNpb25BdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgZXh0ZW5zaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZXh0ZW5zaW9uSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHZlcnNpb24gbnVtYmVyIG9mIHRoZSBleHRlbnNpb24uXG4gICAqL1xuICByZWFkb25seSBleHRlbnNpb25WZXJzaW9uTnVtYmVyOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgZXh0ZW5zaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBleHRlbnNpb24gQVJOIGlzIGdlbmVyYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGV4dGVuc2lvbkFybj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGFjdGlvbnMgb2YgdGhlIGV4dGVuc2lvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aW9ucz86IEFjdGlvbltdO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZXh0ZW5zaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBuYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGV4dGVuc2lvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgdGhlIEV4dGVuc2lvbiBjb25zdHJ1Y3QuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXh0ZW5zaW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZXh0ZW5zaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbmFtZSBpcyBnZW5lcmF0ZWQuXG4gICAqL1xuICByZWFkb25seSBleHRlbnNpb25OYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGRlc2NyaXB0aW9uIG9mIHRoZSBleHRlbnNpb25cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbGF0ZXN0IHZlcnNpb24gbnVtYmVyIG9mIHRoZSBleHRlbnNpb24uIFdoZW4geW91IGNyZWF0ZSBhIG5ldyB2ZXJzaW9uLFxuICAgKiBzcGVjaWZ5IHRoZSBtb3N0IHJlY2VudCBjdXJyZW50IHZlcnNpb24gbnVtYmVyLiBGb3IgZXhhbXBsZSwgeW91IGNyZWF0ZSB2ZXJzaW9uIDMsXG4gICAqIGVudGVyIDIgZm9yIHRoaXMgZmllbGQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IGxhdGVzdFZlcnNpb25OdW1iZXI/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJhbWV0ZXJzIGFjY2VwdGVkIGZvciB0aGUgZXh0ZW5zaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJzPzogUGFyYW1ldGVyW107XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgdGhlIEV4dGVuc2lvbiBjb25zdHJ1Y3QuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXh0ZW5zaW9uUHJvcHMgZXh0ZW5kcyBFeHRlbnNpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBhY3Rpb25zIGZvciB0aGUgZXh0ZW5zaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aW9uczogQWN0aW9uW107XG59XG5cbi8qKlxuICogQW4gQVdTIEFwcENvbmZpZyBleHRlbnNpb24uXG4gKlxuICogQHJlc291cmNlIEFXUzo6QXBwQ29uZmlnOjpFeHRlbnNpb25cbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwcGNvbmZpZy9sYXRlc3QvdXNlcmd1aWRlL3dvcmtpbmctd2l0aC1hcHBjb25maWctZXh0ZW5zaW9ucy5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBFeHRlbnNpb24gZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElFeHRlbnNpb24ge1xuICAvKipcbiAgICogSW1wb3J0cyBhbiBleHRlbnNpb24gaW50byB0aGUgQ0RLIHVzaW5nIGl0cyBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKS5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCBUaGUgbmFtZSBvZiB0aGUgZXh0ZW5zaW9uIGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gZXh0ZW5zaW9uQXJuIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FeHRlbnNpb25Bcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZXh0ZW5zaW9uQXJuOiBzdHJpbmcpOiBJRXh0ZW5zaW9uIHtcbiAgICBjb25zdCBwYXJzZWRBcm4gPSBTdGFjay5vZihzY29wZSkuc3BsaXRBcm4oZXh0ZW5zaW9uQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSk7XG4gICAgaWYgKCFwYXJzZWRBcm4ucmVzb3VyY2VOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgcmVxdWlyZWQgLyQve2V4dGVuc2lvbklkfS8vJC97ZXh0ZW5zaW9uVmVyc2lvbk51bWJlcn0gZnJvbSBjb25maWd1cmF0aW9uIHByb2ZpbGUgQVJOOiAke3BhcnNlZEFybi5yZXNvdXJjZU5hbWV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb3VyY2VOYW1lID0gcGFyc2VkQXJuLnJlc291cmNlTmFtZS5zcGxpdCgnLycpO1xuICAgIGlmIChyZXNvdXJjZU5hbWUubGVuZ3RoICE9IDIgfHwgIXJlc291cmNlTmFtZVswXSB8fCAhcmVzb3VyY2VOYW1lWzFdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgcmVxdWlyZWQgcGFyYW1ldGVycyBmb3IgZXh0ZW5zaW9uIEFSTjogZm9ybWF0IHNob3VsZCBiZSAvJC97ZXh0ZW5zaW9uSWR9Ly8kL3tleHRlbnNpb25WZXJzaW9uTnVtYmVyfScpO1xuICAgIH1cblxuICAgIGNvbnN0IGV4dGVuc2lvbklkID0gcmVzb3VyY2VOYW1lWzBdO1xuICAgIGNvbnN0IGV4dGVuc2lvblZlcnNpb25OdW1iZXIgPSByZXNvdXJjZU5hbWVbMV07XG5cbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElFeHRlbnNpb24ge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGV4dGVuc2lvbklkID0gZXh0ZW5zaW9uSWQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZXh0ZW5zaW9uVmVyc2lvbk51bWJlciA9IHBhcnNlSW50KGV4dGVuc2lvblZlcnNpb25OdW1iZXIpO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGV4dGVuc2lvbkFybiA9IGV4dGVuc2lvbkFybjtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQsIHtcbiAgICAgIGVudmlyb25tZW50RnJvbUFybjogZXh0ZW5zaW9uQXJuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgYW4gZXh0ZW5zaW9uIGludG8gdGhlIENESyB1c2luZyBpdHMgYXR0cmlidXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCBUaGUgbmFtZSBvZiB0aGUgZXh0ZW5zaW9uIGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gYXR0cnMgVGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRXh0ZW5zaW9uQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogRXh0ZW5zaW9uQXR0cmlidXRlcyk6IElFeHRlbnNpb24ge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGV4dGVuc2lvbkFybiA9IGF0dHJzLmV4dGVuc2lvbkFybiB8fCBzdGFjay5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2FwcGNvbmZpZycsXG4gICAgICByZXNvdXJjZTogJ2V4dGVuc2lvbicsXG4gICAgICByZXNvdXJjZU5hbWU6IGAke2F0dHJzLmV4dGVuc2lvbklkfS8ke2F0dHJzLmV4dGVuc2lvblZlcnNpb25OdW1iZXJ9YCxcbiAgICB9KTtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUV4dGVuc2lvbiB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZXh0ZW5zaW9uSWQgPSBhdHRycy5leHRlbnNpb25JZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBleHRlbnNpb25WZXJzaW9uTnVtYmVyID0gYXR0cnMuZXh0ZW5zaW9uVmVyc2lvbk51bWJlcjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBleHRlbnNpb25Bcm4gPSBleHRlbnNpb25Bcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9IGF0dHJzLm5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYWN0aW9ucyA9IGF0dHJzLmFjdGlvbnM7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZGVzY3JpcHRpb24gPSBhdHRycy5kZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQsIHtcbiAgICAgIGVudmlyb25tZW50RnJvbUFybjogZXh0ZW5zaW9uQXJuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhY3Rpb25zIGZvciB0aGUgZXh0ZW5zaW9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFjdGlvbnM/OiBBY3Rpb25bXTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGV4dGVuc2lvbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGV4dGVuc2lvbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxhdGVzdCB2ZXJzaW9uIG51bWJlciBvZiB0aGUgZXh0ZW5zaW9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxhdGVzdFZlcnNpb25OdW1iZXI/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJhbWV0ZXJzIG9mIHRoZSBleHRlbnNpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVycz86IFBhcmFtZXRlcltdO1xuXG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIGV4dGVuc2lvbi5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGV4dGVuc2lvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIGV4dGVuc2lvbi5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGV4dGVuc2lvbklkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG51bWJlciBvZiB0aGUgZXh0ZW5zaW9uLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZXh0ZW5zaW9uVmVyc2lvbk51bWJlcjogbnVtYmVyO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2NmbkV4dGVuc2lvbjogQ2ZuRXh0ZW5zaW9uO1xuICBwcml2YXRlIGV4ZWN1dGlvblJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEV4dGVuc2lvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmV4dGVuc2lvbk5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFjdGlvbnMgPSBwcm9wcy5hY3Rpb25zO1xuICAgIHRoaXMubmFtZSA9IHByb3BzLmV4dGVuc2lvbk5hbWUgfHwgTmFtZXMudW5pcXVlUmVzb3VyY2VOYW1lKHRoaXMsIHtcbiAgICAgIG1heExlbmd0aDogNjQsXG4gICAgICBzZXBhcmF0b3I6ICctJyxcbiAgICB9KTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gcHJvcHMuZGVzY3JpcHRpb247XG4gICAgdGhpcy5sYXRlc3RWZXJzaW9uTnVtYmVyID0gcHJvcHMubGF0ZXN0VmVyc2lvbk51bWJlcjtcbiAgICB0aGlzLnBhcmFtZXRlcnMgPSBwcm9wcy5wYXJhbWV0ZXJzO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuRXh0ZW5zaW9uKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGFjdGlvbnM6IHRoaXMuYWN0aW9ucy5yZWR1Y2UoKGFjYzoge1trZXk6IHN0cmluZ106IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9W119LCBjdXI6IEFjdGlvbiwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBleHRlbnNpb25VcmkgPSBjdXIuZXZlbnREZXN0aW5hdGlvbi5leHRlbnNpb25Vcmk7XG4gICAgICAgIGNvbnN0IHNvdXJjZVR5cGUgPSBjdXIuZXZlbnREZXN0aW5hdGlvbi50eXBlO1xuICAgICAgICB0aGlzLmV4ZWN1dGlvblJvbGUgPSBjdXIuZXhlY3V0aW9uUm9sZTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGN1ci5uYW1lID8/IGAke3RoaXMubmFtZX0tJHtpbmRleH1gO1xuICAgICAgICBjdXIuYWN0aW9uUG9pbnRzLmZvckVhY2goKGFjdGlvblBvaW50KSA9PiB7XG4gICAgICAgICAgYWNjW2FjdGlvblBvaW50XSA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgVXJpOiBleHRlbnNpb25VcmksXG4gICAgICAgICAgICAgIC4uLihzb3VyY2VUeXBlID09PSBTb3VyY2VUeXBlLkVWRU5UUyB8fCBjdXIuaW52b2tlV2l0aG91dEV4ZWN1dGlvblJvbGVcbiAgICAgICAgICAgICAgICA/IHt9XG4gICAgICAgICAgICAgICAgOiB7IFJvbGVBcm46IHRoaXMuZXhlY3V0aW9uUm9sZT8ucm9sZUFybiB8fCB0aGlzLmdldEV4ZWN1dGlvblJvbGUoY3VyLmV2ZW50RGVzdGluYXRpb24sIG5hbWUpLnJvbGVBcm4gfSksXG4gICAgICAgICAgICAgIC4uLihjdXIuZGVzY3JpcHRpb24gPyB7IERlc2NyaXB0aW9uOiBjdXIuZGVzY3JpcHRpb24gfSA6IHt9KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSksXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIGxhdGVzdFZlcnNpb25OdW1iZXI6IHRoaXMubGF0ZXN0VmVyc2lvbk51bWJlcixcbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucGFyYW1ldGVycz8ucmVkdWNlKChhY2M6IHtba2V5OiBzdHJpbmddOiBDZm5FeHRlbnNpb24uUGFyYW1ldGVyUHJvcGVydHl9LCBjdXI6IFBhcmFtZXRlcikgPT4ge1xuICAgICAgICBhY2NbY3VyLm5hbWVdID0ge1xuICAgICAgICAgIHJlcXVpcmVkOiBjdXIuaXNSZXF1aXJlZCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogY3VyLmRlc2NyaXB0aW9uLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pLFxuICAgIH0pO1xuICAgIHRoaXMuX2NmbkV4dGVuc2lvbiA9IHJlc291cmNlO1xuXG4gICAgdGhpcy5leHRlbnNpb25JZCA9IHRoaXMuX2NmbkV4dGVuc2lvbi5hdHRySWQ7XG4gICAgdGhpcy5leHRlbnNpb25WZXJzaW9uTnVtYmVyID0gdGhpcy5fY2ZuRXh0ZW5zaW9uLmF0dHJWZXJzaW9uTnVtYmVyO1xuICAgIHRoaXMuZXh0ZW5zaW9uQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZSh0aGlzLl9jZm5FeHRlbnNpb24uYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2FwcGNvbmZpZycsXG4gICAgICByZXNvdXJjZTogJ2V4dGVuc2lvbicsXG4gICAgICByZXNvdXJjZU5hbWU6IGAke3RoaXMuZXh0ZW5zaW9uSWR9LyR7dGhpcy5leHRlbnNpb25WZXJzaW9uTnVtYmVyfWAsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldEV4ZWN1dGlvblJvbGUoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIGFjdGlvbk5hbWU6IHN0cmluZyk6IGlhbS5JUm9sZSB7XG4gICAgY29uc3QgdmVyc2lvbk51bWJlciA9IHRoaXMubGF0ZXN0VmVyc2lvbk51bWJlciA/IHRoaXMubGF0ZXN0VmVyc2lvbk51bWJlciArIDEgOiAxO1xuICAgIGNvbnN0IGNvbWJpbmVkT2JqZWN0cyA9IHN0cmluZ2lmeU9iamVjdHModGhpcy5uYW1lLCB2ZXJzaW9uTnVtYmVyLCBhY3Rpb25OYW1lKTtcbiAgICB0aGlzLmV4ZWN1dGlvblJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgYFJvbGUke2dldEhhc2goY29tYmluZWRPYmplY3RzKX1gLCB7XG4gICAgICByb2xlTmFtZTogUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCxcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdhcHBjb25maWcuYW1hem9uYXdzLmNvbScpLFxuICAgICAgaW5saW5lUG9saWNpZXM6IHtcbiAgICAgICAgWydBbGxvd0FwcENvbmZpZ0ludm9rZUV4dGVuc2lvbkV2ZW50U291cmNlUG9saWN5J106IGV2ZW50RGVzdGluYXRpb24ucG9saWN5RG9jdW1lbnQhLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmV4ZWN1dGlvblJvbGU7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJRXh0ZW5zaW9uIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBhY3Rpb25zIGZvciB0aGUgZXh0ZW5zaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aW9ucz86IEFjdGlvbltdO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZXh0ZW5zaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBleHRlbnNpb24uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxhdGVzdCB2ZXJzaW9uIG51bWJlciBvZiB0aGUgZXh0ZW5zaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgbGF0ZXN0VmVyc2lvbk51bWJlcj86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHBhcmFtZXRlcnMgb2YgdGhlIGV4dGVuc2lvbi5cbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlcnM/OiBQYXJhbWV0ZXJbXTtcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBleHRlbnNpb24uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGV4dGVuc2lvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIGV4dGVuc2lvbi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZXh0ZW5zaW9uSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHZlcnNpb24gbnVtYmVyIG9mIHRoZSBleHRlbnNpb24uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGV4dGVuc2lvblZlcnNpb25OdW1iZXI6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBUaGlzIGNsYXNzIGlzIG1lYW50IHRvIGJlIHVzZWQgYnkgQVdTIEFwcENvbmZpZyByZXNvdXJjZXMgKGFwcGxpY2F0aW9uLFxuICogY29uZmlndXJhdGlvbiBwcm9maWxlLCBlbnZpcm9ubWVudCkgZGlyZWN0bHkuIFRoZXJlIGlzIGN1cnJlbnRseSBubyB1c2VcbiAqIGZvciB0aGlzIGNsYXNzIG91dHNpZGUgb2YgdGhlIEFXUyBBcHBDb25maWcgY29uc3RydWN0IGltcGxlbWVudGF0aW9uLiBJdCBpc1xuICogaW50ZW5kZWQgdG8gYmUgdXNlZCB3aXRoIHRoZSByZXNvdXJjZXMgc2luY2UgdGhlcmUgaXMgY3VycmVudGx5IG5vIHdheSB0b1xuICogaW5oZXJpdCBmcm9tIHR3byBjbGFzc2VzIChhdCBsZWFzdCB3aXRoaW4gSlNJSSBjb25zdHJhaW50cykuXG4gKi9cbmV4cG9ydCBjbGFzcyBFeHRlbnNpYmxlQmFzZSBpbXBsZW1lbnRzIElFeHRlbnNpYmxlIHtcbiAgcHJpdmF0ZSByZXNvdXJjZUFybjogc3RyaW5nO1xuICBwcml2YXRlIHJlc291cmNlTmFtZT86IHN0cmluZztcbiAgcHJpdmF0ZSBzY29wZTogQ29uc3RydWN0O1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCByZXNvdXJjZUFybjogc3RyaW5nLCByZXNvdXJjZU5hbWU/OiBzdHJpbmcpIHtcbiAgICB0aGlzLnJlc291cmNlQXJuID0gcmVzb3VyY2VBcm47XG4gICAgdGhpcy5yZXNvdXJjZU5hbWUgPSByZXNvdXJjZU5hbWU7XG4gICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICB9XG5cbiAgcHVibGljIG9uKGFjdGlvblBvaW50OiBBY3Rpb25Qb2ludCwgZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5nZXRFeHRlbnNpb25Gb3JBY3Rpb25Qb2ludChldmVudERlc3RpbmF0aW9uLCBhY3Rpb25Qb2ludCwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgcHJlQ3JlYXRlSG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24oZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5nZXRFeHRlbnNpb25Gb3JBY3Rpb25Qb2ludChldmVudERlc3RpbmF0aW9uLCBBY3Rpb25Qb2ludC5QUkVfQ1JFQVRFX0hPU1RFRF9DT05GSUdVUkFUSU9OX1ZFUlNJT04sIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIHByZVN0YXJ0RGVwbG95bWVudChldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpIHtcbiAgICB0aGlzLmdldEV4dGVuc2lvbkZvckFjdGlvblBvaW50KGV2ZW50RGVzdGluYXRpb24sIEFjdGlvblBvaW50LlBSRV9TVEFSVF9ERVBMT1lNRU5ULCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkRlcGxveW1lbnRTdGFydChldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpIHtcbiAgICB0aGlzLmdldEV4dGVuc2lvbkZvckFjdGlvblBvaW50KGV2ZW50RGVzdGluYXRpb24sIEFjdGlvblBvaW50Lk9OX0RFUExPWU1FTlRfU1RBUlQsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIG9uRGVwbG95bWVudFN0ZXAoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5nZXRFeHRlbnNpb25Gb3JBY3Rpb25Qb2ludChldmVudERlc3RpbmF0aW9uLCBBY3Rpb25Qb2ludC5PTl9ERVBMT1lNRU5UX1NURVAsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIG9uRGVwbG95bWVudEJha2luZyhldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpIHtcbiAgICB0aGlzLmdldEV4dGVuc2lvbkZvckFjdGlvblBvaW50KGV2ZW50RGVzdGluYXRpb24sIEFjdGlvblBvaW50Lk9OX0RFUExPWU1FTlRfQkFLSU5HLCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkRlcGxveW1lbnRDb21wbGV0ZShldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpIHtcbiAgICB0aGlzLmdldEV4dGVuc2lvbkZvckFjdGlvblBvaW50KGV2ZW50RGVzdGluYXRpb24sIEFjdGlvblBvaW50Lk9OX0RFUExPWU1FTlRfQ09NUExFVEUsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIG9uRGVwbG95bWVudFJvbGxlZEJhY2soZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5nZXRFeHRlbnNpb25Gb3JBY3Rpb25Qb2ludChldmVudERlc3RpbmF0aW9uLCBBY3Rpb25Qb2ludC5PTl9ERVBMT1lNRU5UX1JPTExFRF9CQUNLLCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRFeHRlbnNpb24oZXh0ZW5zaW9uOiBJRXh0ZW5zaW9uKSB7XG4gICAgdGhpcy5hZGRFeHRlbnNpb25Bc3NvY2lhdGlvbihleHRlbnNpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFeHRlbnNpb25Gb3JBY3Rpb25Qb2ludChldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgYWN0aW9uUG9pbnQ6IEFjdGlvblBvaW50LCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucykge1xuICAgIGNvbnN0IG5hbWUgPSBvcHRpb25zPy5leHRlbnNpb25OYW1lIHx8IHRoaXMuZ2V0RXh0ZW5zaW9uRGVmYXVsdE5hbWUoKTtcbiAgICBjb25zdCB2ZXJzaW9uTnVtYmVyID0gb3B0aW9ucz8ubGF0ZXN0VmVyc2lvbk51bWJlciA/IG9wdGlvbnM/LmxhdGVzdFZlcnNpb25OdW1iZXIgKyAxIDogMTtcbiAgICBjb25zdCBleHRlbnNpb24gPSBuZXcgRXh0ZW5zaW9uKHRoaXMuc2NvcGUsIGBFeHRlbnNpb24ke3RoaXMuZ2V0RXh0ZW5zaW9uSGFzaChuYW1lLCB2ZXJzaW9uTnVtYmVyKX1gLCB7XG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBBY3Rpb24oe1xuICAgICAgICAgIGV2ZW50RGVzdGluYXRpb24sXG4gICAgICAgICAgYWN0aW9uUG9pbnRzOiBbXG4gICAgICAgICAgICBhY3Rpb25Qb2ludCxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgICBleHRlbnNpb25OYW1lOiBuYW1lLFxuICAgICAgLi4uKG9wdGlvbnM/LmRlc2NyaXB0aW9uID8geyBkZXNjcmlwdGlvbjogb3B0aW9ucy5kZXNjcmlwdGlvbiB9IDoge30pLFxuICAgICAgLi4uKG9wdGlvbnM/LmxhdGVzdFZlcnNpb25OdW1iZXIgPyB7IGxhdGVzdFZlcnNpb25OdW1iZXI6IG9wdGlvbnMubGF0ZXN0VmVyc2lvbk51bWJlciB9IDoge30pLFxuICAgICAgLi4uKG9wdGlvbnM/LnBhcmFtZXRlcnMgPyB7IHBhcmFtZXRlcnM6IG9wdGlvbnMucGFyYW1ldGVycyB9IDoge30pLFxuICAgIH0pO1xuICAgIHRoaXMuYWRkRXh0ZW5zaW9uQXNzb2NpYXRpb24oZXh0ZW5zaW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkRXh0ZW5zaW9uQXNzb2NpYXRpb24oZXh0ZW5zaW9uOiBJRXh0ZW5zaW9uKSB7XG4gICAgY29uc3QgdmVyc2lvbk51bWJlciA9IGV4dGVuc2lvbj8ubGF0ZXN0VmVyc2lvbk51bWJlciA/IGV4dGVuc2lvbj8ubGF0ZXN0VmVyc2lvbk51bWJlciArIDEgOiAxO1xuICAgIGNvbnN0IG5hbWUgPSBleHRlbnNpb24ubmFtZSA/PyB0aGlzLmdldEV4dGVuc2lvbkRlZmF1bHROYW1lKCk7XG4gICAgbmV3IENmbkV4dGVuc2lvbkFzc29jaWF0aW9uKHRoaXMuc2NvcGUsIGBBc3NvY2lhdGlvblJlc291cmNlJHt0aGlzLmdldEV4dGVuc2lvbkFzc29jaWF0aW9uSGFzaChuYW1lLCB2ZXJzaW9uTnVtYmVyKX1gLCB7XG4gICAgICBleHRlbnNpb25JZGVudGlmaWVyOiBleHRlbnNpb24uZXh0ZW5zaW9uSWQsXG4gICAgICByZXNvdXJjZUlkZW50aWZpZXI6IHRoaXMucmVzb3VyY2VBcm4sXG4gICAgICBleHRlbnNpb25WZXJzaW9uTnVtYmVyOiBleHRlbnNpb24uZXh0ZW5zaW9uVmVyc2lvbk51bWJlcixcbiAgICAgIHBhcmFtZXRlcnM6IGV4dGVuc2lvbi5wYXJhbWV0ZXJzPy5yZWR1Y2UoKGFjYzoge1trZXk6IHN0cmluZ106IHN0cmluZ30sIGN1cjogUGFyYW1ldGVyKSA9PiB7XG4gICAgICAgIGlmIChjdXIudmFsdWUpIHtcbiAgICAgICAgICBhY2NbY3VyLm5hbWVdID0gY3VyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldEV4dGVuc2lvbkhhc2gobmFtZTogc3RyaW5nLCB2ZXJzaW9uTnVtYmVyOiBudW1iZXIpIHtcbiAgICBjb25zdCBjb21iaW5lZFN0cmluZyA9IHN0cmluZ2lmeU9iamVjdHMobmFtZSwgdmVyc2lvbk51bWJlcik7XG4gICAgcmV0dXJuIGdldEhhc2goY29tYmluZWRTdHJpbmcpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRFeHRlbnNpb25Bc3NvY2lhdGlvbkhhc2gobmFtZTogc3RyaW5nLCB2ZXJzaW9uTnVtYmVyOiBudW1iZXIpIHtcbiAgICBjb25zdCByZXNvdXJjZUlkZW50aWZpZXIgPSB0aGlzLnJlc291cmNlTmFtZSA/PyB0aGlzLnJlc291cmNlQXJuO1xuICAgIGNvbnN0IGNvbWJpbmVkU3RyaW5nID0gc3RyaW5naWZ5T2JqZWN0cyhyZXNvdXJjZUlkZW50aWZpZXIsIG5hbWUsIHZlcnNpb25OdW1iZXIpO1xuICAgIHJldHVybiBnZXRIYXNoKGNvbWJpbmVkU3RyaW5nKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXh0ZW5zaW9uRGVmYXVsdE5hbWUoKSB7XG4gICAgcmV0dXJuIE5hbWVzLnVuaXF1ZVJlc291cmNlTmFtZSh0aGlzLnNjb3BlLCB7XG4gICAgICBtYXhMZW5ndGg6IDU0LFxuICAgICAgc2VwYXJhdG9yOiAnLScsXG4gICAgfSkgKyAnLUV4dGVuc2lvbic7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBleHRlbnNpYmxlIGJhc2UgaW1wbGVtZW50YXRpb24gZm9yIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiByZXNvdXJjZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUV4dGVuc2libGUge1xuICAvKipcbiAgICogQWRkcyBhbiBleHRlbnNpb24gZGVmaW5lZCBieSB0aGUgYWN0aW9uIHBvaW50IGFuZCBldmVudCBkZXN0aW5hdGlvbiBhbmRcbiAgICogYWxzbyBjcmVhdGVzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byB0aGUgZGVyaXZlZCByZXNvdXJjZS5cbiAgICpcbiAgICogQHBhcmFtIGFjdGlvblBvaW50IFRoZSBhY3Rpb24gcG9pbnQgd2hpY2ggdHJpZ2dlcnMgdGhlIGV2ZW50XG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBvbihhY3Rpb25Qb2ludDogQWN0aW9uUG9pbnQsIGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBQUkVfQ1JFQVRFX0hPU1RFRF9DT05GSUdVUkFUSU9OX1ZFUlNJT04gZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50XG4gICAqIGRlc3RpbmF0aW9uIGFuZCBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBkZXJpdmVkIHJlc291cmNlLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgcHJlQ3JlYXRlSG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24oZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkcyBhIFBSRV9TVEFSVF9ERVBMT1lNRU5UIGV4dGVuc2lvbiB3aXRoIHRoZSBwcm92aWRlZCBldmVudCBkZXN0aW5hdGlvbiBhbmRcbiAgICogYWxzbyBjcmVhdGVzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byB0aGUgZGVyaXZlZCByZXNvdXJjZS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIHByZVN0YXJ0RGVwbG95bWVudChldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfU1RBUlQgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uIGFuZFxuICAgKiBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBkZXJpdmVkIHJlc291cmNlLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgb25EZXBsb3ltZW50U3RhcnQoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkcyBhbiBPTl9ERVBMT1lNRU5UX1NURVAgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uIGFuZFxuICAgKiBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBkZXJpdmVkIHJlc291cmNlLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgb25EZXBsb3ltZW50U3RlcChldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfQkFLSU5HIGV4dGVuc2lvbiB3aXRoIHRoZSBwcm92aWRlZCBldmVudCBkZXN0aW5hdGlvbiBhbmRcbiAgICogYWxzbyBjcmVhdGVzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byB0aGUgZGVyaXZlZCByZXNvdXJjZS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIG9uRGVwbG95bWVudEJha2luZyhldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfQ09NUExFVEUgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uIGFuZFxuICAgKiBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBkZXJpdmVkIHJlc291cmNlLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgb25EZXBsb3ltZW50Q29tcGxldGUoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkcyBhbiBPTl9ERVBMT1lNRU5UX1JPTExFRF9CQUNLIGV4dGVuc2lvbiB3aXRoIHRoZSBwcm92aWRlZCBldmVudCBkZXN0aW5hdGlvbiBhbmRcbiAgICogYWxzbyBjcmVhdGVzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byB0aGUgZGVyaXZlZCByZXNvdXJjZS5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIG9uRGVwbG95bWVudFJvbGxlZEJhY2soZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gdGhlIGRlcml2ZWQgcmVzb3VyY2UuXG4gICAqXG4gICAqIEBwYXJhbSBleHRlbnNpb24gVGhlIGV4dGVuc2lvbiB0byBjcmVhdGUgYW4gYXNzb2NpYXRpb24gZm9yXG4gICAqL1xuICBhZGRFeHRlbnNpb24oZXh0ZW5zaW9uOiBJRXh0ZW5zaW9uKTogdm9pZDtcbn1cbiJdfQ==