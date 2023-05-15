import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource, IBoundStackSynthesizer as IBoundAppStagingSynthesizer, IReusableStackSynthesizer, ISynthesisSession, Stack, StackSynthesizer } from 'aws-cdk-lib';
import { BootstrapRoles } from './bootstrap-roles';
import { DefaultStagingStackOptions } from './default-staging-stack';
import { IStagingResources, IStagingResourcesFactory } from './staging-stack';
/**
 * Options that apply to all AppStagingSynthesizer variants
 */
export interface AppStagingSynthesizerOptions {
    /**
     * What roles to use to deploy applications
     *
     * These are the roles that have permissions to interact with CloudFormation
     * on your behalf. By default these are the standard bootstrapped CDK roles,
     * but you can customize them or turn them off and use the CLI credentials
     * to deploy.
     *
     * @default - The standard bootstrapped CDK roles
     */
    readonly deploymentRoles?: BootstrapRoles;
    /**
     * Qualifier to disambiguate multiple bootstrapped environments in the same account
     *
     * This qualifier is only used to reference bootstrapped resources. It will not
     * be used in the creation of app-specific staging resources: `appId` is used for that
     * instead.
     *
     * @default - Value of context key '@aws-cdk/core:bootstrapQualifier' if set, otherwise `DEFAULT_QUALIFIER`
     */
    readonly bootstrapQualifier?: string;
}
/**
 * Properties for stackPerEnv static method
 */
export interface DefaultResourcesOptions extends AppStagingSynthesizerOptions, DefaultStagingStackOptions {
}
/**
 * Properties for customFactory static method
 */
export interface CustomFactoryOptions extends AppStagingSynthesizerOptions {
    /**
     * The factory that will be used to return staging resources for each stack
     */
    readonly factory: IStagingResourcesFactory;
    /**
     * Reuse the answer from the factory for stacks in the same environment
     *
     * @default true
     */
    readonly oncePerEnv?: boolean;
}
/**
 * Properties for customResources static method
 */
export interface CustomResourcesOptions extends AppStagingSynthesizerOptions {
    /**
     * Use these exact staging resources for every stack that this synthesizer is used for
     */
    readonly resources: IStagingResources;
}
/**
 * App Staging Synthesizer
 */
export declare class AppStagingSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer {
    private readonly props;
    /**
     * Default ARN qualifier
     */
    static readonly DEFAULT_QUALIFIER = "hnb659fds";
    /**
     * Default CloudFormation role ARN.
     */
    static readonly DEFAULT_CLOUDFORMATION_ROLE_ARN = "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-cfn-exec-role-${AWS::AccountId}-${AWS::Region}";
    /**
     * Default deploy role ARN.
     */
    static readonly DEFAULT_DEPLOY_ROLE_ARN = "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-deploy-role-${AWS::AccountId}-${AWS::Region}";
    /**
     * Default lookup role ARN for missing values.
     */
    static readonly DEFAULT_LOOKUP_ROLE_ARN = "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-lookup-role-${AWS::AccountId}-${AWS::Region}";
    /**
     * Use the Default Staging Resources, creating a single stack per environment this app is deployed in
     */
    static defaultResources(options: DefaultResourcesOptions): AppStagingSynthesizer;
    /**
     * Use these exact staging resources for every stack that this synthesizer is used for
     */
    static customResources(options: CustomResourcesOptions): AppStagingSynthesizer;
    /**
     * Supply your own stagingStackFactory method for creating an IStagingStack when
     * a stack is bound to the synthesizer.
     *
     * By default, `oncePerEnv = true`, which means that a new instance of the IStagingStack
     * will be created in new environments. Set `oncePerEnv = false` to turn off that behavior.
     */
    static customFactory(options: CustomFactoryOptions): AppStagingSynthesizer;
    private readonly roles;
    private constructor();
    /**
     * Returns a version of the synthesizer bound to a stack.
     */
    reusableBind(stack: Stack): IBoundAppStagingSynthesizer;
    /**
     * Implemented for legacy purposes; this will never be called.
     */
    bind(_stack: Stack): void;
    /**
     * Implemented for legacy purposes; this will never be called.
     */
    synthesize(_session: ISynthesisSession): void;
    /**
     * Implemented for legacy purposes; this will never be called.
     */
    addFileAsset(_asset: FileAssetSource): FileAssetLocation;
    /**
     * Implemented for legacy purposes; this will never be called.
     */
    addDockerImageAsset(_asset: DockerImageAssetSource): DockerImageAssetLocation;
    /**
     * Check that we're only being used for exclusively gnostic or agnostic stacks.
     *
     * We can think about whether to loosen this requirement later.
     */
    private checkEnvironmentGnosticism;
}
