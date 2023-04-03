import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Construct, IConstruct } from 'constructs';
/**
 * A Jenkins provider.
 *
 * If you want to create a new Jenkins provider managed alongside your CDK code,
 * instantiate the `JenkinsProvider` class directly.
 *
 * If you want to reference an already registered provider,
 * use the `JenkinsProvider#fromJenkinsProviderAttributes` method.
 */
export interface IJenkinsProvider extends IConstruct {
    readonly providerName: string;
    readonly serverUrl: string;
    readonly version: string;
    /**
     * Registers a Jenkins Provider for the build category.
     * This method will be automatically called when creating
     * a `JenkinsAction`,
     * so you should never need to call it explicitly.
     *
     * @internal
     */
    _registerBuildProvider(): void;
    /**
     * Registers a Jenkins Provider for the test category.
     * This method will be automatically called when creating
     * a `JenkinsTestAction`,
     * so you should never need to call it explicitly.
     *
     * @internal
     */
    _registerTestProvider(): void;
}
/**
 * Properties for importing an existing Jenkins provider.
 */
export interface JenkinsProviderAttributes {
    /**
     * The name of the Jenkins provider that you set in the AWS CodePipeline plugin configuration of your Jenkins project.
     *
     * @example 'MyJenkinsProvider'
     */
    readonly providerName: string;
    /**
     * The base URL of your Jenkins server.
     *
     * @example 'http://myjenkins.com:8080'
     */
    readonly serverUrl: string;
    /**
     * The version of your provider.
     *
     * @default '1'
     */
    readonly version?: string;
}
export interface JenkinsProviderProps {
    /**
     * The name of the Jenkins provider that you set in the AWS CodePipeline plugin configuration of your Jenkins project.
     *
     * @example 'MyJenkinsProvider'
     */
    readonly providerName: string;
    /**
     * The base URL of your Jenkins server.
     *
     * @example 'http://myjenkins.com:8080'
     */
    readonly serverUrl: string;
    /**
     * The version of your provider.
     *
     * @default '1'
     */
    readonly version?: string;
    /**
     * Whether to immediately register a Jenkins Provider for the build category.
     * The Provider will always be registered if you create a `JenkinsAction`.
     *
     * @default false
     */
    readonly forBuild?: boolean;
    /**
     * Whether to immediately register a Jenkins Provider for the test category.
     * The Provider will always be registered if you create a `JenkinsTestAction`.
     *
     * @default false
     */
    readonly forTest?: boolean;
}
export declare abstract class BaseJenkinsProvider extends Construct implements IJenkinsProvider {
    abstract readonly providerName: string;
    abstract readonly serverUrl: string;
    readonly version: string;
    protected constructor(scope: Construct, id: string, version?: string);
    /**
     * @internal
     */
    abstract _registerBuildProvider(): void;
    /**
     * @internal
     */
    abstract _registerTestProvider(): void;
}
/**
 * A class representing Jenkins providers.
 *
 * @see #import
 */
export declare class JenkinsProvider extends BaseJenkinsProvider {
    /**
     * Import a Jenkins provider registered either outside the CDK,
     * or in a different CDK Stack.
     *
     * @param scope the parent Construct for the new provider
     * @param id the identifier of the new provider Construct
     * @param attrs the properties used to identify the existing provider
     * @returns a new Construct representing a reference to an existing Jenkins provider
     */
    static fromJenkinsProviderAttributes(scope: Construct, id: string, attrs: JenkinsProviderAttributes): IJenkinsProvider;
    readonly providerName: string;
    readonly serverUrl: string;
    private buildIncluded;
    private testIncluded;
    constructor(scope: Construct, id: string, props: JenkinsProviderProps);
    /**
     * @internal
     */
    _registerBuildProvider(): void;
    /**
     * @internal
     */
    _registerTestProvider(): void;
    private registerJenkinsCustomAction;
}
export declare const jenkinsArtifactsBounds: codepipeline.ActionArtifactBounds;
