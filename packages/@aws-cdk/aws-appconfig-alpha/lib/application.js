"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.Platform = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/* eslint-disable @aws-cdk/no-literal-partition */
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_appconfig_1 = require("aws-cdk-lib/aws-appconfig");
const ecs = require("aws-cdk-lib/aws-ecs");
const configuration_1 = require("./configuration");
const environment_1 = require("./environment");
const extension_1 = require("./extension");
/**
 * Defines the platform for the AWS AppConfig Lambda extension.
 */
var Platform;
(function (Platform) {
    Platform["X86_64"] = "x86-64";
    Platform["ARM_64"] = "ARM64";
})(Platform || (exports.Platform = Platform = {}));
class ApplicationBase extends cdk.Resource {
    constructor() {
        super(...arguments);
        this._environments = [];
    }
    addEnvironment(id, options = {}) {
        return new environment_1.Environment(this, id, {
            application: this,
            ...options,
        });
    }
    addHostedConfiguration(id, options) {
        return new configuration_1.HostedConfiguration(this, id, {
            application: this,
            ...options,
        });
    }
    addSourcedConfiguration(id, options) {
        return new configuration_1.SourcedConfiguration(this, id, {
            application: this,
            ...options,
        });
    }
    addExistingEnvironment(environment) {
        this._environments.push(environment);
    }
    get environments() {
        return this._environments;
    }
    /**
     * Adds an extension defined by the action point and event destination
     * and also creates an extension association to an application.
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
     * provided event destination and also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preCreateHostedConfigurationVersion(eventDestination, options) {
        this.extensible.preCreateHostedConfigurationVersion(eventDestination, options);
    }
    /**
     * Adds a PRE_START_DEPLOYMENT extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preStartDeployment(eventDestination, options) {
        this.extensible.preStartDeployment(eventDestination, options);
    }
    /**
     * Adds an ON_DEPLOYMENT_START extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStart(eventDestination, options) {
        this.extensible.onDeploymentStart(eventDestination, options);
    }
    /**
     * Adds an ON_DEPLOYMENT_STEP extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStep(eventDestination, options) {
        this.extensible.onDeploymentStep(eventDestination, options);
    }
    /**
     * Adds an ON_DEPLOYMENT_BAKING extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentBaking(eventDestination, options) {
        this.extensible.onDeploymentBaking(eventDestination, options);
    }
    /**
     * Adds an ON_DEPLOYMENT_COMPLETE extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentComplete(eventDestination, options) {
        this.extensible.onDeploymentComplete(eventDestination, options);
    }
    /**
     * Adds an ON_DEPLOYMENT_ROLLED_BACK extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentRolledBack(eventDestination, options) {
        this.extensible.onDeploymentRolledBack(eventDestination, options);
    }
    /**
     * Adds an extension association to the application.
     *
     * @param extension The extension to create an association for
     */
    addExtension(extension) {
        this.extensible.addExtension(extension);
    }
}
/**
 * An AWS AppConfig application.
 *
 * @resource AWS::AppConfig::Application
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-application.html
 */
class Application extends ApplicationBase {
    /**
     * Imports an AWS AppConfig application into the CDK using its Amazon Resource Name (ARN).
     *
     * @param scope The parent construct
     * @param id The name of the application construct
     * @param applicationArn The Amazon Resource Name (ARN) of the application
     */
    static fromApplicationArn(scope, id, applicationArn) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Application#fromApplicationArn", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromApplicationArn);
            }
            throw error;
        }
        const parsedArn = cdk.Stack.of(scope).splitArn(applicationArn, cdk.ArnFormat.SLASH_RESOURCE_NAME);
        const applicationId = parsedArn.resourceName;
        if (!applicationId) {
            throw new Error('Missing required application id from application ARN');
        }
        class Import extends ApplicationBase {
            constructor() {
                super(...arguments);
                this.applicationId = applicationId;
                this.applicationArn = applicationArn;
                this.extensible = new extension_1.ExtensibleBase(scope, this.applicationArn);
            }
        }
        return new Import(scope, id);
    }
    /**
     * Imports an AWS AppConfig application into the CDK using its ID.
     *
     * @param scope The parent construct
     * @param id The name of the application construct
     * @param applicationId The ID of the application
     */
    static fromApplicationId(scope, id, applicationId) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Application#fromApplicationId", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromApplicationId);
            }
            throw error;
        }
        const stack = cdk.Stack.of(scope);
        const applicationArn = stack.formatArn({
            service: 'appconfig',
            resource: 'application',
            resourceName: applicationId,
        });
        class Import extends ApplicationBase {
            constructor() {
                super(...arguments);
                this.applicationId = applicationId;
                this.applicationArn = applicationArn;
                this.extensible = new extension_1.ExtensibleBase(scope, this.applicationArn);
            }
        }
        return new Import(scope, id);
    }
    /**
     * Retrieves the Lambda layer version Amazon Resource Name (ARN) for the AWS AppConfig Lambda extension.
     *
     * @param region The region for the Lambda layer (for example, 'us-east-1')
     * @param platform The platform for the Lambda layer (default is Platform.X86_64)
     * @returns Lambda layer version ARN
     */
    static getLambdaLayerVersionArn(region, platform) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Application#getLambdaLayerVersionArn", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_Platform(platform);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getLambdaLayerVersionArn);
            }
            throw error;
        }
        return lambdaLayerVersions[platform || Platform.X86_64][region];
    }
    /**
     * Adds the AWS AppConfig Agent as a container to the provided ECS task definition.
     *
     * @param taskDef The ECS task definition [disable-awslint:ref-via-interface]
     */
    static addAgentToEcs(taskDef) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Application#addAgentToEcs", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAgentToEcs);
            }
            throw error;
        }
        taskDef.addContainer('AppConfigAgentContainer', {
            image: ecs.ContainerImage.fromRegistry('public.ecr.aws/aws-appconfig/aws-appconfig-agent:latest'),
            containerName: 'AppConfigAgentContainer',
        });
    }
    constructor(scope, id, props = {}) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Application", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_ApplicationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Application);
            }
            throw error;
        }
        this.description = props.description;
        this.name = props.applicationName || aws_cdk_lib_1.Names.uniqueResourceName(this, {
            maxLength: 64,
            separator: '-',
        });
        this._application = new aws_appconfig_1.CfnApplication(this, 'Resource', {
            name: this.name,
            description: this.description,
        });
        this.applicationId = this._application.ref;
        this.applicationArn = cdk.Stack.of(this).formatArn({
            service: 'appconfig',
            resource: 'application',
            resourceName: this.applicationId,
        });
        this.extensible = new extension_1.ExtensibleBase(this, this.applicationArn, this.name);
    }
}
exports.Application = Application;
_a = JSII_RTTI_SYMBOL_1;
Application[_a] = { fqn: "@aws-cdk/aws-appconfig-alpha.Application", version: "0.0.0" };
const lambdaLayerVersions = {
    [Platform.X86_64]: {
        'us-east-1': 'arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension:128',
        'us-east-2': 'arn:aws:lambda:us-east-2:728743619870:layer:AWS-AppConfig-Extension:93',
        'us-west-1': 'arn:aws:lambda:us-west-1:958113053741:layer:AWS-AppConfig-Extension:141',
        'us-west-2': 'arn:aws:lambda:us-west-2:359756378197:layer:AWS-AppConfig-Extension:161',
        'ca-central-1': 'arn:aws:lambda:ca-central-1:039592058896:layer:AWS-AppConfig-Extension:93',
        'eu-central-1': 'arn:aws:lambda:eu-central-1:066940009817:layer:AWS-AppConfig-Extension:106',
        'eu-central-2': 'arn:aws:lambda:eu-central-2:758369105281:layer:AWS-AppConfig-Extension:47',
        'eu-west-1': 'arn:aws:lambda:eu-west-1:434848589818:layer:AWS-AppConfig-Extension:125',
        'eu-west-2': 'arn:aws:lambda:eu-west-2:282860088358:layer:AWS-AppConfig-Extension:93',
        'eu-west-3': 'arn:aws:lambda:eu-west-3:493207061005:layer:AWS-AppConfig-Extension:98',
        'eu-north-1': 'arn:aws:lambda:eu-north-1:646970417810:layer:AWS-AppConfig-Extension:159',
        'eu-south-1': 'arn:aws:lambda:eu-south-1:203683718741:layer:AWS-AppConfig-Extension:83',
        'eu-south-2': 'arn:aws:lambda:eu-south-2:586093569114:layer:AWS-AppConfig-Extension:44',
        'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:615057806174:layer:AWS-AppConfig-Extension:76',
        'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:615084187847:layer:AWS-AppConfig-Extension:76',
        'ap-east-1': 'arn:aws:lambda:ap-east-1:630222743974:layer:AWS-AppConfig-Extension:83',
        'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:980059726660:layer:AWS-AppConfig-Extension:98',
        'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:826293736237:layer:AWS-AppConfig-Extension:108',
        'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:706869817123:layer:AWS-AppConfig-Extension:101',
        'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:421114256042:layer:AWS-AppConfig-Extension:106',
        'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:080788657173:layer:AWS-AppConfig-Extension:106',
        'ap-southeast-3': 'arn:aws:lambda:ap-southeast-3:418787028745:layer:AWS-AppConfig-Extension:79',
        'ap-southeast-4': 'arn:aws:lambda:ap-southeast-4:307021474294:layer:AWS-AppConfig-Extension:20',
        'ap-south-1': 'arn:aws:lambda:ap-south-1:554480029851:layer:AWS-AppConfig-Extension:107',
        'ap-south-2': 'arn:aws:lambda:ap-south-2:489524808438:layer:AWS-AppConfig-Extension:47',
        'sa-east-1': 'arn:aws:lambda:sa-east-1:000010852771:layer:AWS-AppConfig-Extension:128',
        'af-south-1': 'arn:aws:lambda:af-south-1:574348263942:layer:AWS-AppConfig-Extension:83',
        'il-central-1': 'arn:aws:lambda:il-central-1:895787185223:layer:AWS-AppConfig-Extension:22',
        'me-central-1': 'arn:aws:lambda:me-central-1:662846165436:layer:AWS-AppConfig-Extension:49',
        'me-south-1': 'arn:aws:lambda:me-south-1:559955524753:layer:AWS-AppConfig-Extension:85',
        'us-gov-east-1': 'arn:aws-us-gov:lambda:us-gov-east-1:946561847325:layer:AWS-AppConfig-Extension:54',
        'us-gov-west-1': 'arn:aws-us-gov:lambda:us-gov-west-1:946746059096:layer:AWS-AppConfig-Extension:54',
    },
    [Platform.ARM_64]: {
        'us-east-1': 'arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension-Arm64:61',
        'us-east-2': 'arn:aws:lambda:us-east-2:728743619870:layer:AWS-AppConfig-Extension-Arm64:45',
        'us-west-1': 'arn:aws:lambda:us-west-1:958113053741:layer:AWS-AppConfig-Extension-Arm64:18',
        'us-west-2': 'arn:aws:lambda:us-west-2:359756378197:layer:AWS-AppConfig-Extension-Arm64:63',
        'ca-central-1': 'arn:aws:lambda:ca-central-1:039592058896:layer:AWS-AppConfig-Extension-Arm64:13',
        'eu-central-1': 'arn:aws:lambda:eu-central-1:066940009817:layer:AWS-AppConfig-Extension-Arm64:49',
        'eu-central-2': 'arn:aws:lambda:eu-central-2:758369105281:layer:AWS-AppConfig-Extension-Arm64:5',
        'eu-west-1': 'arn:aws:lambda:eu-west-1:434848589818:layer:AWS-AppConfig-Extension-Arm64:63',
        'eu-west-2': 'arn:aws:lambda:eu-west-2:282860088358:layer:AWS-AppConfig-Extension-Arm64:45',
        'eu-west-3': 'arn:aws:lambda:eu-west-3:493207061005:layer:AWS-AppConfig-Extension-Arm64:17',
        'eu-north-1': 'arn:aws:lambda:eu-north-1:646970417810:layer:AWS-AppConfig-Extension-Arm64:18',
        'eu-south-1': 'arn:aws:lambda:eu-south-1:203683718741:layer:AWS-AppConfig-Extension-Arm64:11',
        'eu-south-2': 'arn:aws:lambda:eu-south-2:586093569114:layer:AWS-AppConfig-Extension-Arm64:5',
        'ap-east-1': 'arn:aws:lambda:ap-east-1:630222743974:layer:AWS-AppConfig-Extension-Arm64:11',
        'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:980059726660:layer:AWS-AppConfig-Extension-Arm64:51',
        'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:826293736237:layer:AWS-AppConfig-Extension-Arm64:16',
        'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:706869817123:layer:AWS-AppConfig-Extension-Arm64:16',
        'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:421114256042:layer:AWS-AppConfig-Extension-Arm64:58',
        'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:080788657173:layer:AWS-AppConfig-Extension-Arm64:49',
        'ap-southeast-3': 'arn:aws:lambda:ap-southeast-3:418787028745:layer:AWS-AppConfig-Extension-Arm64:16',
        'ap-southeast-4': 'arn:aws:lambda:ap-southeast-4:307021474294:layer:AWS-AppConfig-Extension-Arm64:5',
        'ap-south-1': 'arn:aws:lambda:ap-south-1:554480029851:layer:AWS-AppConfig-Extension-Arm64:49',
        'ap-south-2': 'arn:aws:lambda:ap-south-2:489524808438:layer:AWS-AppConfig-Extension-Arm64:5',
        'sa-east-1': 'arn:aws:lambda:sa-east-1:000010852771:layer:AWS-AppConfig-Extension-Arm64:16',
        'af-south-1': 'arn:aws:lambda:af-south-1:574348263942:layer:AWS-AppConfig-Extension-Arm64:11',
        'me-central-1': 'arn:aws:lambda:me-central-1:662846165436:layer:AWS-AppConfig-Extension-Arm64:5',
        'me-south-1': 'arn:aws:lambda:me-south-1:559955524753:layer:AWS-AppConfig-Extension-Arm64:13',
        'il-central-1': 'arn:aws:lambda:il-central-1:895787185223:layer:AWS-AppConfig-Extension-Arm64:5',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBa0Q7QUFDbEQsbUNBQW1DO0FBQ25DLDZDQUFvQztBQUNwQyw2REFBMkQ7QUFDM0QsMkNBQTJDO0FBRTNDLG1EQUFxSTtBQUNySSwrQ0FBOEU7QUFDOUUsMkNBQXdIO0FBRXhIOztHQUVHO0FBQ0gsSUFBWSxRQUdYO0FBSEQsV0FBWSxRQUFRO0lBQ2xCLDZCQUFpQixDQUFBO0lBQ2pCLDRCQUFnQixDQUFBO0FBQ2xCLENBQUMsRUFIVyxRQUFRLHdCQUFSLFFBQVEsUUFHbkI7QUFnS0QsTUFBZSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxRQUFRO0lBQW5EOztRQUdVLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztJQWlJN0MsQ0FBQztJQTlIUSxjQUFjLENBQUMsRUFBVSxFQUFFLFVBQThCLEVBQUU7UUFDaEUsT0FBTyxJQUFJLHlCQUFXLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMvQixXQUFXLEVBQUUsSUFBSTtZQUNqQixHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7S0FDSjtJQUVNLHNCQUFzQixDQUFDLEVBQVUsRUFBRSxPQUFtQztRQUMzRSxPQUFPLElBQUksbUNBQW1CLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUN2QyxXQUFXLEVBQUUsSUFBSTtZQUNqQixHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7S0FDSjtJQUVNLHVCQUF1QixDQUFDLEVBQVUsRUFBRSxPQUFvQztRQUM3RSxPQUFPLElBQUksb0NBQW9CLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUN4QyxXQUFXLEVBQUUsSUFBSTtZQUNqQixHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7S0FDSjtJQUVNLHNCQUFzQixDQUFDLFdBQXlCO1FBQ3JELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxD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RUFBRSw4RUFBOEU7UUFDM0YsZ0JBQWdCLEVBQUUsbUZBQW1GO1FBQ3JHLGdCQUFnQixFQUFFLG1GQUFtRjtRQUNyRyxnQkFBZ0IsRUFBRSxtRkFBbUY7UUFDckcsZ0JBQWdCLEVBQUUsbUZBQW1GO1FBQ3JHLGdCQUFnQixFQUFFLG1GQUFtRjtRQUNyRyxnQkFBZ0IsRUFBRSxtRkFBbUY7UUFDckcsZ0JBQWdCLEVBQUUsa0ZBQWtGO1FBQ3BHLFlBQVksRUFBRSwrRUFBK0U7UUFDN0YsWUFBWSxFQUFFLDhFQUE4RTtRQUM1RixXQUFXLEVBQUUsOEVBQThFO1FBQzNGLFlBQVksRUFBRSwrRUFBK0U7UUFDN0YsY0FBYyxFQUFFLGdGQUFnRjtRQUNoRyxZQUFZLEVBQUUsK0VBQStFO1FBQzdGLGNBQWMsRUFBRSxnRkFBZ0Y7S0FDakc7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQGF3cy1jZGsvbm8tbGl0ZXJhbC1wYXJ0aXRpb24gKi9cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBOYW1lcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENmbkFwcGxpY2F0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwcGNvbmZpZyc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEhvc3RlZENvbmZpZ3VyYXRpb24sIEhvc3RlZENvbmZpZ3VyYXRpb25PcHRpb25zLCBTb3VyY2VkQ29uZmlndXJhdGlvbiwgU291cmNlZENvbmZpZ3VyYXRpb25PcHRpb25zIH0gZnJvbSAnLi9jb25maWd1cmF0aW9uJztcbmltcG9ydCB7IEVudmlyb25tZW50LCBFbnZpcm9ubWVudE9wdGlvbnMsIElFbnZpcm9ubWVudCB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgQWN0aW9uUG9pbnQsIElFdmVudERlc3RpbmF0aW9uLCBFeHRlbnNpb25PcHRpb25zLCBJRXh0ZW5zaW9uLCBJRXh0ZW5zaWJsZSwgRXh0ZW5zaWJsZUJhc2UgfSBmcm9tICcuL2V4dGVuc2lvbic7XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgcGxhdGZvcm0gZm9yIHRoZSBBV1MgQXBwQ29uZmlnIExhbWJkYSBleHRlbnNpb24uXG4gKi9cbmV4cG9ydCBlbnVtIFBsYXRmb3JtIHtcbiAgWDg2XzY0ID0gJ3g4Ni02NCcsXG4gIEFSTV82NCA9ICdBUk02NCcsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFwcGxpY2F0aW9uIGV4dGVuZHMgY2RrLklSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGFwcGxpY2F0aW9uSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYXBwbGljYXRpb25Bcm46IHN0cmluZztcblxuICAvKipcbiAgICogQWRkcyBhbiBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBuYW1lIG9mIHRoZSBlbnZpcm9ubWVudCBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHRoZSBlbnZpcm9ubWVudCBjb25zdHJ1Y3RcbiAgICovXG4gIGFkZEVudmlyb25tZW50KGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBFbnZpcm9ubWVudE9wdGlvbnMpOiBJRW52aXJvbm1lbnQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBob3N0ZWQgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGlkIFRoZSBuYW1lIG9mIHRoZSBob3N0ZWQgY29uZmlndXJhdGlvbiBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHRoZSBob3N0ZWQgY29uZmlndXJhdGlvbiBjb25zdHJ1Y3RcbiAgICovXG4gIGFkZEhvc3RlZENvbmZpZ3VyYXRpb24oaWQ6IHN0cmluZywgb3B0aW9uczogSG9zdGVkQ29uZmlndXJhdGlvbk9wdGlvbnMpOiBIb3N0ZWRDb25maWd1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgc291cmNlZCBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgVGhlIG5hbWUgb2YgdGhlIHNvdXJjZWQgY29uZmlndXJhdGlvbiBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHRoZSBzb3VyY2VkIGNvbmZpZ3VyYXRpb24gY29uc3RydWN0XG4gICAqL1xuICBhZGRTb3VyY2VkQ29uZmlndXJhdGlvbihpZDogc3RyaW5nLCBvcHRpb25zOiBTb3VyY2VkQ29uZmlndXJhdGlvbk9wdGlvbnMpOiBTb3VyY2VkQ29uZmlndXJhdGlvbjtcblxuICAvKipcbiAgICogQWRkcyBhbiBleGlzdGluZyBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQHBhcmFtIGVudmlyb25tZW50IFRoZSBlbnZpcm9ubWVudFxuICAgKi9cbiAgYWRkRXhpc3RpbmdFbnZpcm9ubWVudChlbnZpcm9ubWVudDogSUVudmlyb25tZW50KTogdm9pZDtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGlzdCBvZiBhc3NvY2lhdGVkIGVudmlyb25tZW50cy5cbiAgICovXG4gIGdldCBlbnZpcm9ubWVudHMoKTogSUVudmlyb25tZW50W107XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXh0ZW5zaW9uIGRlZmluZWQgYnkgdGhlIGFjdGlvbiBwb2ludCBhbmQgZXZlbnQgZGVzdGluYXRpb25cbiAgICogYW5kIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gYW4gYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBhY3Rpb25Qb2ludCBUaGUgYWN0aW9uIHBvaW50IHdoaWNoIHRyaWdnZXJzIHRoZSBldmVudFxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgb24oYWN0aW9uUG9pbnQ6IEFjdGlvblBvaW50LCBldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgUFJFX0NSRUFURV9IT1NURURfQ09ORklHVVJBVElPTl9WRVJTSU9OIGV4dGVuc2lvbiB3aXRoIHRoZVxuICAgKiBwcm92aWRlZCBldmVudCBkZXN0aW5hdGlvbiBhbmQgYWxzbyBjcmVhdGVzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byBhbiBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIHByZUNyZWF0ZUhvc3RlZENvbmZpZ3VyYXRpb25WZXJzaW9uKGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBQUkVfU1RBUlRfREVQTE9ZTUVOVCBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb24gYW5kXG4gICAqIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gYW4gYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBwcmVTdGFydERlcGxveW1lbnQoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKTogdm9pZDtcbiAgLyoqXG4gICAqIEFkZHMgYW4gT05fREVQTE9ZTUVOVF9TVEFSVCBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb24gYW5kXG4gICAqIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gYW4gYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBvbkRlcGxveW1lbnRTdGFydChldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfU1RFUCBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb24gYW5kXG4gICAqIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gYW4gYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBvbkRlcGxveW1lbnRTdGVwKGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gT05fREVQTE9ZTUVOVF9CQUtJTkcgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uIGFuZFxuICAgKiBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIGFuIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgb25EZXBsb3ltZW50QmFraW5nKGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gT05fREVQTE9ZTUVOVF9DT01QTEVURSBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb24gYW5kXG4gICAqIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gYW4gYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBvbkRlcGxveW1lbnRDb21wbGV0ZShldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfUk9MTEVEX0JBQ0sgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uIGFuZFxuICAgKiBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIGFuIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgb25EZXBsb3ltZW50Um9sbGVkQmFjayhldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byB0aGUgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBleHRlbnNpb24gVGhlIGV4dGVuc2lvbiB0byBjcmVhdGUgYW4gYXNzb2NpYXRpb24gZm9yXG4gICAqL1xuICBhZGRFeHRlbnNpb24oZXh0ZW5zaW9uOiBJRXh0ZW5zaW9uKTogdm9pZDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciB0aGUgQXBwbGljYXRpb24gY29uc3RydWN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXBwbGljYXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuYW1lIGlzIGdlbmVyYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGFwcGxpY2F0aW9uTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIGZvciB0aGUgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcbn1cblxuYWJzdHJhY3QgY2xhc3MgQXBwbGljYXRpb25CYXNlIGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgSUFwcGxpY2F0aW9uLCBJRXh0ZW5zaWJsZSB7XG4gIHB1YmxpYyBhYnN0cmFjdCBhcHBsaWNhdGlvbklkOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCBhcHBsaWNhdGlvbkFybjogc3RyaW5nO1xuICBwcml2YXRlIF9lbnZpcm9ubWVudHM6IElFbnZpcm9ubWVudFtdID0gW107XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBleHRlbnNpYmxlOiBFeHRlbnNpYmxlQmFzZTtcblxuICBwdWJsaWMgYWRkRW52aXJvbm1lbnQoaWQ6IHN0cmluZywgb3B0aW9uczogRW52aXJvbm1lbnRPcHRpb25zID0ge30pOiBJRW52aXJvbm1lbnQge1xuICAgIHJldHVybiBuZXcgRW52aXJvbm1lbnQodGhpcywgaWQsIHtcbiAgICAgIGFwcGxpY2F0aW9uOiB0aGlzLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRIb3N0ZWRDb25maWd1cmF0aW9uKGlkOiBzdHJpbmcsIG9wdGlvbnM6IEhvc3RlZENvbmZpZ3VyYXRpb25PcHRpb25zKTogSG9zdGVkQ29uZmlndXJhdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBIb3N0ZWRDb25maWd1cmF0aW9uKHRoaXMsIGlkLCB7XG4gICAgICBhcHBsaWNhdGlvbjogdGhpcyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkU291cmNlZENvbmZpZ3VyYXRpb24oaWQ6IHN0cmluZywgb3B0aW9uczogU291cmNlZENvbmZpZ3VyYXRpb25PcHRpb25zKTogU291cmNlZENvbmZpZ3VyYXRpb24ge1xuICAgIHJldHVybiBuZXcgU291cmNlZENvbmZpZ3VyYXRpb24odGhpcywgaWQsIHtcbiAgICAgIGFwcGxpY2F0aW9uOiB0aGlzLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRFeGlzdGluZ0Vudmlyb25tZW50KGVudmlyb25tZW50OiBJRW52aXJvbm1lbnQpIHtcbiAgICB0aGlzLl9lbnZpcm9ubWVudHMucHVzaChlbnZpcm9ubWVudCk7XG4gIH1cblxuICBnZXQgZW52aXJvbm1lbnRzKCk6IElFbnZpcm9ubWVudFtdIHtcbiAgICByZXR1cm4gdGhpcy5fZW52aXJvbm1lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXh0ZW5zaW9uIGRlZmluZWQgYnkgdGhlIGFjdGlvbiBwb2ludCBhbmQgZXZlbnQgZGVzdGluYXRpb25cbiAgICogYW5kIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gYW4gYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBhY3Rpb25Qb2ludCBUaGUgYWN0aW9uIHBvaW50IHdoaWNoIHRyaWdnZXJzIHRoZSBldmVudFxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgcHVibGljIG9uKGFjdGlvblBvaW50OiBBY3Rpb25Qb2ludCwgZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uKGFjdGlvblBvaW50LCBldmVudERlc3RpbmF0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgUFJFX0NSRUFURV9IT1NURURfQ09ORklHVVJBVElPTl9WRVJTSU9OIGV4dGVuc2lvbiB3aXRoIHRoZVxuICAgKiBwcm92aWRlZCBldmVudCBkZXN0aW5hdGlvbiBhbmQgYWxzbyBjcmVhdGVzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byBhbiBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIHB1YmxpYyBwcmVDcmVhdGVIb3N0ZWRDb25maWd1cmF0aW9uVmVyc2lvbihldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpIHtcbiAgICB0aGlzLmV4dGVuc2libGUucHJlQ3JlYXRlSG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24oZXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIFBSRV9TVEFSVF9ERVBMT1lNRU5UIGV4dGVuc2lvbiB3aXRoIHRoZSBwcm92aWRlZCBldmVudCBkZXN0aW5hdGlvbiBhbmRcbiAgICogYWxzbyBjcmVhdGVzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byBhbiBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIHB1YmxpYyBwcmVTdGFydERlcGxveW1lbnQoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLnByZVN0YXJ0RGVwbG95bWVudChldmVudERlc3RpbmF0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfU1RBUlQgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uIGFuZFxuICAgKiBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIGFuIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgcHVibGljIG9uRGVwbG95bWVudFN0YXJ0KGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucykge1xuICAgIHRoaXMuZXh0ZW5zaWJsZS5vbkRlcGxveW1lbnRTdGFydChldmVudERlc3RpbmF0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfU1RFUCBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb24gYW5kXG4gICAqIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gYW4gYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBwdWJsaWMgb25EZXBsb3ltZW50U3RlcChldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpIHtcbiAgICB0aGlzLmV4dGVuc2libGUub25EZXBsb3ltZW50U3RlcChldmVudERlc3RpbmF0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfQkFLSU5HIGV4dGVuc2lvbiB3aXRoIHRoZSBwcm92aWRlZCBldmVudCBkZXN0aW5hdGlvbiBhbmRcbiAgICogYWxzbyBjcmVhdGVzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byBhbiBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIHB1YmxpYyBvbkRlcGxveW1lbnRCYWtpbmcoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uRGVwbG95bWVudEJha2luZyhldmVudERlc3RpbmF0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfQ09NUExFVEUgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uIGFuZFxuICAgKiBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIGFuIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgcHVibGljIG9uRGVwbG95bWVudENvbXBsZXRlKGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucykge1xuICAgIHRoaXMuZXh0ZW5zaWJsZS5vbkRlcGxveW1lbnRDb21wbGV0ZShldmVudERlc3RpbmF0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIE9OX0RFUExPWU1FTlRfUk9MTEVEX0JBQ0sgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uIGFuZFxuICAgKiBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIGFuIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgcHVibGljIG9uRGVwbG95bWVudFJvbGxlZEJhY2soZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uRGVwbG95bWVudFJvbGxlZEJhY2soZXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gdGhlIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZXh0ZW5zaW9uIFRoZSBleHRlbnNpb24gdG8gY3JlYXRlIGFuIGFzc29jaWF0aW9uIGZvclxuICAgKi9cbiAgcHVibGljIGFkZEV4dGVuc2lvbihleHRlbnNpb246IElFeHRlbnNpb24pIHtcbiAgICB0aGlzLmV4dGVuc2libGUuYWRkRXh0ZW5zaW9uKGV4dGVuc2lvbik7XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBBV1MgQXBwQ29uZmlnIGFwcGxpY2F0aW9uLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkFwcENvbmZpZzo6QXBwbGljYXRpb25cbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwcGNvbmZpZy9sYXRlc3QvdXNlcmd1aWRlL2FwcGNvbmZpZy1jcmVhdGluZy1hcHBsaWNhdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiBleHRlbmRzIEFwcGxpY2F0aW9uQmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnRzIGFuIEFXUyBBcHBDb25maWcgYXBwbGljYXRpb24gaW50byB0aGUgQ0RLIHVzaW5nIGl0cyBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKS5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCBUaGUgbmFtZSBvZiB0aGUgYXBwbGljYXRpb24gY29uc3RydWN0XG4gICAqIEBwYXJhbSBhcHBsaWNhdGlvbkFybiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIGFwcGxpY2F0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21BcHBsaWNhdGlvbkFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhcHBsaWNhdGlvbkFybjogc3RyaW5nKTogSUFwcGxpY2F0aW9uIHtcbiAgICBjb25zdCBwYXJzZWRBcm4gPSBjZGsuU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKGFwcGxpY2F0aW9uQXJuLCBjZGsuQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpO1xuICAgIGNvbnN0IGFwcGxpY2F0aW9uSWQgPSBwYXJzZWRBcm4ucmVzb3VyY2VOYW1lO1xuICAgIGlmICghYXBwbGljYXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIGFwcGxpY2F0aW9uIGlkIGZyb20gYXBwbGljYXRpb24gQVJOJyk7XG4gICAgfVxuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgQXBwbGljYXRpb25CYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhcHBsaWNhdGlvbklkID0gYXBwbGljYXRpb25JZCE7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYXBwbGljYXRpb25Bcm4gPSBhcHBsaWNhdGlvbkFybjtcbiAgICAgIHByb3RlY3RlZCByZWFkb25seSBleHRlbnNpYmxlID0gbmV3IEV4dGVuc2libGVCYXNlKHNjb3BlLCB0aGlzLmFwcGxpY2F0aW9uQXJuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgYW4gQVdTIEFwcENvbmZpZyBhcHBsaWNhdGlvbiBpbnRvIHRoZSBDREsgdXNpbmcgaXRzIElELlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGlkIFRoZSBuYW1lIG9mIHRoZSBhcHBsaWNhdGlvbiBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGFwcGxpY2F0aW9uSWQgVGhlIElEIG9mIHRoZSBhcHBsaWNhdGlvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXBwbGljYXRpb25JZChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhcHBsaWNhdGlvbklkOiBzdHJpbmcpOiBJQXBwbGljYXRpb24ge1xuICAgIGNvbnN0IHN0YWNrID0gY2RrLlN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBhcHBsaWNhdGlvbkFybiA9IHN0YWNrLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnYXBwY29uZmlnJyxcbiAgICAgIHJlc291cmNlOiAnYXBwbGljYXRpb24nLFxuICAgICAgcmVzb3VyY2VOYW1lOiBhcHBsaWNhdGlvbklkLFxuICAgIH0pO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgQXBwbGljYXRpb25CYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhcHBsaWNhdGlvbklkID0gYXBwbGljYXRpb25JZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhcHBsaWNhdGlvbkFybiA9IGFwcGxpY2F0aW9uQXJuO1xuICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGV4dGVuc2libGUgPSBuZXcgRXh0ZW5zaWJsZUJhc2Uoc2NvcGUsIHRoaXMuYXBwbGljYXRpb25Bcm4pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBMYW1iZGEgbGF5ZXIgdmVyc2lvbiBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBmb3IgdGhlIEFXUyBBcHBDb25maWcgTGFtYmRhIGV4dGVuc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIHJlZ2lvbiBUaGUgcmVnaW9uIGZvciB0aGUgTGFtYmRhIGxheWVyIChmb3IgZXhhbXBsZSwgJ3VzLWVhc3QtMScpXG4gICAqIEBwYXJhbSBwbGF0Zm9ybSBUaGUgcGxhdGZvcm0gZm9yIHRoZSBMYW1iZGEgbGF5ZXIgKGRlZmF1bHQgaXMgUGxhdGZvcm0uWDg2XzY0KVxuICAgKiBAcmV0dXJucyBMYW1iZGEgbGF5ZXIgdmVyc2lvbiBBUk5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0TGFtYmRhTGF5ZXJWZXJzaW9uQXJuKHJlZ2lvbjogc3RyaW5nLCBwbGF0Zm9ybT86IFBsYXRmb3JtKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbGFtYmRhTGF5ZXJWZXJzaW9uc1twbGF0Zm9ybSB8fCBQbGF0Zm9ybS5YODZfNjRdW3JlZ2lvbl07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgQVdTIEFwcENvbmZpZyBBZ2VudCBhcyBhIGNvbnRhaW5lciB0byB0aGUgcHJvdmlkZWQgRUNTIHRhc2sgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHRhc2tEZWYgVGhlIEVDUyB0YXNrIGRlZmluaXRpb24gW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYWRkQWdlbnRUb0Vjcyh0YXNrRGVmOiBlY3MuVGFza0RlZmluaXRpb24pIHtcbiAgICB0YXNrRGVmLmFkZENvbnRhaW5lcignQXBwQ29uZmlnQWdlbnRDb250YWluZXInLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgncHVibGljLmVjci5hd3MvYXdzLWFwcGNvbmZpZy9hd3MtYXBwY29uZmlnLWFnZW50OmxhdGVzdCcpLFxuICAgICAgY29udGFpbmVyTmFtZTogJ0FwcENvbmZpZ0FnZW50Q29udGFpbmVyJyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFwcGxpY2F0aW9uSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFwcGxpY2F0aW9uQXJuOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfYXBwbGljYXRpb246IENmbkFwcGxpY2F0aW9uO1xuICBwcm90ZWN0ZWQgZXh0ZW5zaWJsZTogRXh0ZW5zaWJsZUJhc2U7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFwcGxpY2F0aW9uUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gcHJvcHMuZGVzY3JpcHRpb247XG4gICAgdGhpcy5uYW1lID0gcHJvcHMuYXBwbGljYXRpb25OYW1lIHx8IE5hbWVzLnVuaXF1ZVJlc291cmNlTmFtZSh0aGlzLCB7XG4gICAgICBtYXhMZW5ndGg6IDY0LFxuICAgICAgc2VwYXJhdG9yOiAnLScsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9hcHBsaWNhdGlvbiA9IG5ldyBDZm5BcHBsaWNhdGlvbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICB9KTtcbiAgICB0aGlzLmFwcGxpY2F0aW9uSWQgPSB0aGlzLl9hcHBsaWNhdGlvbi5yZWY7XG4gICAgdGhpcy5hcHBsaWNhdGlvbkFybiA9IGNkay5TdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2FwcGNvbmZpZycsXG4gICAgICByZXNvdXJjZTogJ2FwcGxpY2F0aW9uJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5hcHBsaWNhdGlvbklkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5leHRlbnNpYmxlID0gbmV3IEV4dGVuc2libGVCYXNlKHRoaXMsIHRoaXMuYXBwbGljYXRpb25Bcm4sIHRoaXMubmFtZSk7XG4gIH1cbn1cblxuY29uc3QgbGFtYmRhTGF5ZXJWZXJzaW9uczoge1trZXk6IHN0cmluZ106IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9fSA9IHtcbiAgW1BsYXRmb3JtLlg4Nl82NF06IHtcbiAgICAndXMtZWFzdC0xJzogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMTowMjcyNTUzODM1NDI6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246MTI4JyxcbiAgICAndXMtZWFzdC0yJzogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMjo3Mjg3NDM2MTk4NzA6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246OTMnLFxuICAgICd1cy13ZXN0LTEnOiAnYXJuOmF3czpsYW1iZGE6dXMtd2VzdC0xOjk1ODExMzA1Mzc0MTpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbjoxNDEnLFxuICAgICd1cy13ZXN0LTInOiAnYXJuOmF3czpsYW1iZGE6dXMtd2VzdC0yOjM1OTc1NjM3ODE5NzpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbjoxNjEnLFxuICAgICdjYS1jZW50cmFsLTEnOiAnYXJuOmF3czpsYW1iZGE6Y2EtY2VudHJhbC0xOjAzOTU5MjA1ODg5NjpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbjo5MycsXG4gICAgJ2V1LWNlbnRyYWwtMSc6ICdhcm46YXdzOmxhbWJkYTpldS1jZW50cmFsLTE6MDY2OTQwMDA5ODE3OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjEwNicsXG4gICAgJ2V1LWNlbnRyYWwtMic6ICdhcm46YXdzOmxhbWJkYTpldS1jZW50cmFsLTI6NzU4MzY5MTA1MjgxOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjQ3JyxcbiAgICAnZXUtd2VzdC0xJzogJ2Fybjphd3M6bGFtYmRhOmV1LXdlc3QtMTo0MzQ4NDg1ODk4MTg6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246MTI1JyxcbiAgICAnZXUtd2VzdC0yJzogJ2Fybjphd3M6bGFtYmRhOmV1LXdlc3QtMjoyODI4NjAwODgzNTg6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246OTMnLFxuICAgICdldS13ZXN0LTMnOiAnYXJuOmF3czpsYW1iZGE6ZXUtd2VzdC0zOjQ5MzIwNzA2MTAwNTpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbjo5OCcsXG4gICAgJ2V1LW5vcnRoLTEnOiAnYXJuOmF3czpsYW1iZGE6ZXUtbm9ydGgtMTo2NDY5NzA0MTc4MTA6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246MTU5JyxcbiAgICAnZXUtc291dGgtMSc6ICdhcm46YXdzOmxhbWJkYTpldS1zb3V0aC0xOjIwMzY4MzcxODc0MTpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbjo4MycsXG4gICAgJ2V1LXNvdXRoLTInOiAnYXJuOmF3czpsYW1iZGE6ZXUtc291dGgtMjo1ODYwOTM1NjkxMTQ6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246NDQnLFxuICAgICdjbi1ub3J0aC0xJzogJ2Fybjphd3MtY246bGFtYmRhOmNuLW5vcnRoLTE6NjE1MDU3ODA2MTc0OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjc2JyxcbiAgICAnY24tbm9ydGh3ZXN0LTEnOiAnYXJuOmF3cy1jbjpsYW1iZGE6Y24tbm9ydGh3ZXN0LTE6NjE1MDg0MTg3ODQ3OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjc2JyxcbiAgICAnYXAtZWFzdC0xJzogJ2Fybjphd3M6bGFtYmRhOmFwLWVhc3QtMTo2MzAyMjI3NDM5NzQ6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246ODMnLFxuICAgICdhcC1ub3J0aGVhc3QtMSc6ICdhcm46YXdzOmxhbWJkYTphcC1ub3J0aGVhc3QtMTo5ODAwNTk3MjY2NjA6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246OTgnLFxuICAgICdhcC1ub3J0aGVhc3QtMic6ICdhcm46YXdzOmxhbWJkYTphcC1ub3J0aGVhc3QtMjo4MjYyOTM3MzYyMzc6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246MTA4JyxcbiAgICAnYXAtbm9ydGhlYXN0LTMnOiAnYXJuOmF3czpsYW1iZGE6YXAtbm9ydGhlYXN0LTM6NzA2ODY5ODE3MTIzOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjEwMScsXG4gICAgJ2FwLXNvdXRoZWFzdC0xJzogJ2Fybjphd3M6bGFtYmRhOmFwLXNvdXRoZWFzdC0xOjQyMTExNDI1NjA0MjpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbjoxMDYnLFxuICAgICdhcC1zb3V0aGVhc3QtMic6ICdhcm46YXdzOmxhbWJkYTphcC1zb3V0aGVhc3QtMjowODA3ODg2NTcxNzM6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246MTA2JyxcbiAgICAnYXAtc291dGhlYXN0LTMnOiAnYXJuOmF3czpsYW1iZGE6YXAtc291dGhlYXN0LTM6NDE4Nzg3MDI4NzQ1OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjc5JyxcbiAgICAnYXAtc291dGhlYXN0LTQnOiAnYXJuOmF3czpsYW1iZGE6YXAtc291dGhlYXN0LTQ6MzA3MDIxNDc0Mjk0OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjIwJyxcbiAgICAnYXAtc291dGgtMSc6ICdhcm46YXdzOmxhbWJkYTphcC1zb3V0aC0xOjU1NDQ4MDAyOTg1MTpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbjoxMDcnLFxuICAgICdhcC1zb3V0aC0yJzogJ2Fybjphd3M6bGFtYmRhOmFwLXNvdXRoLTI6NDg5NTI0ODA4NDM4OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjQ3JyxcbiAgICAnc2EtZWFzdC0xJzogJ2Fybjphd3M6bGFtYmRhOnNhLWVhc3QtMTowMDAwMTA4NTI3NzE6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246MTI4JyxcbiAgICAnYWYtc291dGgtMSc6ICdhcm46YXdzOmxhbWJkYTphZi1zb3V0aC0xOjU3NDM0ODI2Mzk0MjpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbjo4MycsXG4gICAgJ2lsLWNlbnRyYWwtMSc6ICdhcm46YXdzOmxhbWJkYTppbC1jZW50cmFsLTE6ODk1Nzg3MTg1MjIzOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjIyJyxcbiAgICAnbWUtY2VudHJhbC0xJzogJ2Fybjphd3M6bGFtYmRhOm1lLWNlbnRyYWwtMTo2NjI4NDYxNjU0MzY6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246NDknLFxuICAgICdtZS1zb3V0aC0xJzogJ2Fybjphd3M6bGFtYmRhOm1lLXNvdXRoLTE6NTU5OTU1NTI0NzUzOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uOjg1JyxcbiAgICAndXMtZ292LWVhc3QtMSc6ICdhcm46YXdzLXVzLWdvdjpsYW1iZGE6dXMtZ292LWVhc3QtMTo5NDY1NjE4NDczMjU6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb246NTQnLFxuICAgICd1cy1nb3Ytd2VzdC0xJzogJ2Fybjphd3MtdXMtZ292OmxhbWJkYTp1cy1nb3Ytd2VzdC0xOjk0Njc0NjA1OTA5NjpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbjo1NCcsXG4gIH0sXG4gIFtQbGF0Zm9ybS5BUk1fNjRdOiB7XG4gICAgJ3VzLWVhc3QtMSc6ICdhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6MDI3MjU1MzgzNTQyOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjYxJyxcbiAgICAndXMtZWFzdC0yJzogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMjo3Mjg3NDM2MTk4NzA6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb24tQXJtNjQ6NDUnLFxuICAgICd1cy13ZXN0LTEnOiAnYXJuOmF3czpsYW1iZGE6dXMtd2VzdC0xOjk1ODExMzA1Mzc0MTpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbi1Bcm02NDoxOCcsXG4gICAgJ3VzLXdlc3QtMic6ICdhcm46YXdzOmxhbWJkYTp1cy13ZXN0LTI6MzU5NzU2Mzc4MTk3OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjYzJyxcbiAgICAnY2EtY2VudHJhbC0xJzogJ2Fybjphd3M6bGFtYmRhOmNhLWNlbnRyYWwtMTowMzk1OTIwNTg4OTY6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb24tQXJtNjQ6MTMnLFxuICAgICdldS1jZW50cmFsLTEnOiAnYXJuOmF3czpsYW1iZGE6ZXUtY2VudHJhbC0xOjA2Njk0MDAwOTgxNzpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbi1Bcm02NDo0OScsXG4gICAgJ2V1LWNlbnRyYWwtMic6ICdhcm46YXdzOmxhbWJkYTpldS1jZW50cmFsLTI6NzU4MzY5MTA1MjgxOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjUnLFxuICAgICdldS13ZXN0LTEnOiAnYXJuOmF3czpsYW1iZGE6ZXUtd2VzdC0xOjQzNDg0ODU4OTgxODpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbi1Bcm02NDo2MycsXG4gICAgJ2V1LXdlc3QtMic6ICdhcm46YXdzOmxhbWJkYTpldS13ZXN0LTI6MjgyODYwMDg4MzU4OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjQ1JyxcbiAgICAnZXUtd2VzdC0zJzogJ2Fybjphd3M6bGFtYmRhOmV1LXdlc3QtMzo0OTMyMDcwNjEwMDU6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb24tQXJtNjQ6MTcnLFxuICAgICdldS1ub3J0aC0xJzogJ2Fybjphd3M6bGFtYmRhOmV1LW5vcnRoLTE6NjQ2OTcwNDE3ODEwOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjE4JyxcbiAgICAnZXUtc291dGgtMSc6ICdhcm46YXdzOmxhbWJkYTpldS1zb3V0aC0xOjIwMzY4MzcxODc0MTpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbi1Bcm02NDoxMScsXG4gICAgJ2V1LXNvdXRoLTInOiAnYXJuOmF3czpsYW1iZGE6ZXUtc291dGgtMjo1ODYwOTM1NjkxMTQ6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb24tQXJtNjQ6NScsXG4gICAgJ2FwLWVhc3QtMSc6ICdhcm46YXdzOmxhbWJkYTphcC1lYXN0LTE6NjMwMjIyNzQzOTc0OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjExJyxcbiAgICAnYXAtbm9ydGhlYXN0LTEnOiAnYXJuOmF3czpsYW1iZGE6YXAtbm9ydGhlYXN0LTE6OTgwMDU5NzI2NjYwOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjUxJyxcbiAgICAnYXAtbm9ydGhlYXN0LTInOiAnYXJuOmF3czpsYW1iZGE6YXAtbm9ydGhlYXN0LTI6ODI2MjkzNzM2MjM3OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjE2JyxcbiAgICAnYXAtbm9ydGhlYXN0LTMnOiAnYXJuOmF3czpsYW1iZGE6YXAtbm9ydGhlYXN0LTM6NzA2ODY5ODE3MTIzOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjE2JyxcbiAgICAnYXAtc291dGhlYXN0LTEnOiAnYXJuOmF3czpsYW1iZGE6YXAtc291dGhlYXN0LTE6NDIxMTE0MjU2MDQyOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjU4JyxcbiAgICAnYXAtc291dGhlYXN0LTInOiAnYXJuOmF3czpsYW1iZGE6YXAtc291dGhlYXN0LTI6MDgwNzg4NjU3MTczOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjQ5JyxcbiAgICAnYXAtc291dGhlYXN0LTMnOiAnYXJuOmF3czpsYW1iZGE6YXAtc291dGhlYXN0LTM6NDE4Nzg3MDI4NzQ1OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjE2JyxcbiAgICAnYXAtc291dGhlYXN0LTQnOiAnYXJuOmF3czpsYW1iZGE6YXAtc291dGhlYXN0LTQ6MzA3MDIxNDc0Mjk0OmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjUnLFxuICAgICdhcC1zb3V0aC0xJzogJ2Fybjphd3M6bGFtYmRhOmFwLXNvdXRoLTE6NTU0NDgwMDI5ODUxOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjQ5JyxcbiAgICAnYXAtc291dGgtMic6ICdhcm46YXdzOmxhbWJkYTphcC1zb3V0aC0yOjQ4OTUyNDgwODQzODpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbi1Bcm02NDo1JyxcbiAgICAnc2EtZWFzdC0xJzogJ2Fybjphd3M6bGFtYmRhOnNhLWVhc3QtMTowMDAwMTA4NTI3NzE6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb24tQXJtNjQ6MTYnLFxuICAgICdhZi1zb3V0aC0xJzogJ2Fybjphd3M6bGFtYmRhOmFmLXNvdXRoLTE6NTc0MzQ4MjYzOTQyOmxheWVyOkFXUy1BcHBDb25maWctRXh0ZW5zaW9uLUFybTY0OjExJyxcbiAgICAnbWUtY2VudHJhbC0xJzogJ2Fybjphd3M6bGFtYmRhOm1lLWNlbnRyYWwtMTo2NjI4NDYxNjU0MzY6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb24tQXJtNjQ6NScsXG4gICAgJ21lLXNvdXRoLTEnOiAnYXJuOmF3czpsYW1iZGE6bWUtc291dGgtMTo1NTk5NTU1MjQ3NTM6bGF5ZXI6QVdTLUFwcENvbmZpZy1FeHRlbnNpb24tQXJtNjQ6MTMnLFxuICAgICdpbC1jZW50cmFsLTEnOiAnYXJuOmF3czpsYW1iZGE6aWwtY2VudHJhbC0xOjg5NTc4NzE4NTIyMzpsYXllcjpBV1MtQXBwQ29uZmlnLUV4dGVuc2lvbi1Bcm02NDo1JyxcbiAgfSxcbn07Il19