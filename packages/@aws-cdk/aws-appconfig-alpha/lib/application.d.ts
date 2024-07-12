import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import { HostedConfiguration, HostedConfigurationOptions, SourcedConfiguration, SourcedConfigurationOptions } from './configuration';
import { EnvironmentOptions, IEnvironment } from './environment';
import { ActionPoint, IEventDestination, ExtensionOptions, IExtension, IExtensible, ExtensibleBase } from './extension';
/**
 * Defines the platform for the AWS AppConfig Lambda extension.
 */
export declare enum Platform {
    X86_64 = "x86-64",
    ARM_64 = "ARM64"
}
export interface IApplication extends cdk.IResource {
    /**
     * The description of the application.
     */
    readonly description?: string;
    /**
     * The name of the application.
     */
    readonly name?: string;
    /**
     * The ID of the application.
     * @attribute
     */
    readonly applicationId: string;
    /**
     * The Amazon Resource Name (ARN) of the application.
     * @attribute
     */
    readonly applicationArn: string;
    /**
     * Adds an environment.
     *
     * @param id The name of the environment construct
     * @param options The options for the environment construct
     */
    addEnvironment(id: string, options?: EnvironmentOptions): IEnvironment;
    /**
     * Adds a hosted configuration.
     *
     * @param id The name of the hosted configuration construct
     * @param options The options for the hosted configuration construct
     */
    addHostedConfiguration(id: string, options: HostedConfigurationOptions): HostedConfiguration;
    /**
     * Adds a sourced configuration.
     *
     * @param id The name of the sourced configuration construct
     * @param options The options for the sourced configuration construct
     */
    addSourcedConfiguration(id: string, options: SourcedConfigurationOptions): SourcedConfiguration;
    /**
     * Adds an existing environment.
     *
     * @param environment The environment
     */
    addExistingEnvironment(environment: IEnvironment): void;
    /**
     * Returns the list of associated environments.
     */
    get environments(): IEnvironment[];
    /**
     * Adds an extension defined by the action point and event destination
     * and also creates an extension association to an application.
     *
     * @param actionPoint The action point which triggers the event
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds a PRE_CREATE_HOSTED_CONFIGURATION_VERSION extension with the
     * provided event destination and also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds a PRE_START_DEPLOYMENT extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_START extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_STEP extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_BAKING extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_COMPLETE extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_ROLLED_BACK extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentRolledBack(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an extension association to the application.
     *
     * @param extension The extension to create an association for
     */
    addExtension(extension: IExtension): void;
}
/**
 * Properties for the Application construct
 */
export interface ApplicationProps {
    /**
     * The name of the application.
     *
     * @default - A name is generated.
     */
    readonly applicationName?: string;
    /**
     * The description for the application.
     *
     * @default - No description.
     */
    readonly description?: string;
}
declare abstract class ApplicationBase extends cdk.Resource implements IApplication, IExtensible {
    abstract applicationId: string;
    abstract applicationArn: string;
    private _environments;
    protected abstract extensible: ExtensibleBase;
    addEnvironment(id: string, options?: EnvironmentOptions): IEnvironment;
    addHostedConfiguration(id: string, options: HostedConfigurationOptions): HostedConfiguration;
    addSourcedConfiguration(id: string, options: SourcedConfigurationOptions): SourcedConfiguration;
    addExistingEnvironment(environment: IEnvironment): void;
    get environments(): IEnvironment[];
    /**
     * Adds an extension defined by the action point and event destination
     * and also creates an extension association to an application.
     *
     * @param actionPoint The action point which triggers the event
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds a PRE_CREATE_HOSTED_CONFIGURATION_VERSION extension with the
     * provided event destination and also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds a PRE_START_DEPLOYMENT extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_START extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_STEP extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_BAKING extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_COMPLETE extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_ROLLED_BACK extension with the provided event destination and
     * also creates an extension association to an application.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentRolledBack(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an extension association to the application.
     *
     * @param extension The extension to create an association for
     */
    addExtension(extension: IExtension): void;
}
/**
 * An AWS AppConfig application.
 *
 * @resource AWS::AppConfig::Application
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-application.html
 */
export declare class Application extends ApplicationBase {
    /**
     * Imports an AWS AppConfig application into the CDK using its Amazon Resource Name (ARN).
     *
     * @param scope The parent construct
     * @param id The name of the application construct
     * @param applicationArn The Amazon Resource Name (ARN) of the application
     */
    static fromApplicationArn(scope: Construct, id: string, applicationArn: string): IApplication;
    /**
     * Imports an AWS AppConfig application into the CDK using its ID.
     *
     * @param scope The parent construct
     * @param id The name of the application construct
     * @param applicationId The ID of the application
     */
    static fromApplicationId(scope: Construct, id: string, applicationId: string): IApplication;
    /**
     * Retrieves the Lambda layer version Amazon Resource Name (ARN) for the AWS AppConfig Lambda extension.
     *
     * @param region The region for the Lambda layer (for example, 'us-east-1')
     * @param platform The platform for the Lambda layer (default is Platform.X86_64)
     * @returns Lambda layer version ARN
     */
    static getLambdaLayerVersionArn(region: string, platform?: Platform): string;
    /**
     * Adds the AWS AppConfig Agent as a container to the provided ECS task definition.
     *
     * @param taskDef The ECS task definition [disable-awslint:ref-via-interface]
     */
    static addAgentToEcs(taskDef: ecs.TaskDefinition): void;
    /**
     * The description of the application.
     */
    readonly description?: string;
    /**
     * The name of the application.
     */
    readonly name?: string;
    /**
     * The ID of the application.
     *
     * @attribute
     */
    readonly applicationId: string;
    /**
     * The Amazon Resource Name (ARN) of the application.
     *
     * @attribute
     */
    readonly applicationArn: string;
    private _application;
    protected extensible: ExtensibleBase;
    constructor(scope: Construct, id: string, props?: ApplicationProps);
}
export {};
