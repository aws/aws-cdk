import { Construct } from 'constructs';
import { Duration } from '../duration';
import { Size } from '../size';
/**
 * Initialization properties for `CustomResourceProvider`.
 *
 */
export interface CustomResourceProviderProps {
    /**
     * A local file system directory with the provider's code. The code will be
     * bundled into a zip asset and wired to the provider's AWS Lambda function.
     */
    readonly codeDirectory: string;
    /**
     * The AWS Lambda runtime and version to use for the provider.
     */
    readonly runtime: CustomResourceProviderRuntime;
    /**
     * A set of IAM policy statements to include in the inline policy of the
     * provider's lambda function.
     *
     * **Please note**: these are direct IAM JSON policy blobs, *not* `iam.PolicyStatement`
     * objects like you will see in the rest of the CDK.
     *
     * @default - no additional inline policy
     *
     * @example
     * const provider = CustomResourceProvider.getOrCreateProvider(this, 'Custom::MyCustomResourceType', {
     *   codeDirectory: `${__dirname}/my-handler`,
     *   runtime: CustomResourceProviderRuntime.NODEJS_14_X,
     *   policyStatements: [
     *     {
     *       Effect: 'Allow',
     *       Action: 's3:PutObject*',
     *       Resource: '*',
     *     }
     *   ],
     * });
     */
    readonly policyStatements?: any[];
    /**
     * AWS Lambda timeout for the provider.
     *
     * @default Duration.minutes(15)
     */
    readonly timeout?: Duration;
    /**
     * The amount of memory that your function has access to. Increasing the
     * function's memory also increases its CPU allocation.
     *
     * @default Size.mebibytes(128)
     */
    readonly memorySize?: Size;
    /**
     * Key-value pairs that are passed to Lambda as Environment
     *
     * @default - No environment variables.
     */
    readonly environment?: {
        [key: string]: string;
    };
    /**
     * A description of the function.
     *
     * @default - No description.
     */
    readonly description?: string;
}
/**
 * The lambda runtime to use for the resource provider. This also indicates
 * which language is used for the handler.
 */
export declare enum CustomResourceProviderRuntime {
    /**
     * Node.js 12.x
     */
    NODEJS_12_X = "nodejs12.x",
    /**
     * Node.js 12.x
     *
     * @deprecated Use `NODEJS_14_X`
     */
    NODEJS_12 = "deprecated_nodejs12.x",
    /**
     * Node.js 14.x
     */
    NODEJS_14_X = "nodejs14.x",
    /**
     * Node.js 16.x
     */
    NODEJS_16_X = "nodejs16.x"
}
/**
 * An AWS-Lambda backed custom resource provider, for CDK Construct Library constructs
 *
 * This is a provider for `CustomResource` constructs, backed by an AWS Lambda
 * Function. It only supports NodeJS runtimes.
 *
 * > **Application builders do not need to use this provider type**. This is not
 * > a generic custom resource provider class. It is specifically
 * > intended to be used only by constructs in the AWS CDK Construct Library, and
 * > only exists here because of reverse dependency issues (for example, it cannot
 * > use `iam.PolicyStatement` objects, since the `iam` library already depends on
 * > the CDK `core` library and we cannot have cyclic dependencies).
 *
 * If you are not writing constructs for the AWS Construct Library, you should
 * use the `Provider` class in the `custom-resources` module instead, which has
 * a better API and supports all Lambda runtimes, not just Node.
 *
 * N.B.: When you are writing Custom Resource Providers, there are a number of
 * lifecycle events you have to pay attention to. These are documented in the
 * README of the `custom-resources` module. Be sure to give the documentation
 * in that module a read, regardless of whether you end up using the Provider
 * class in there or this one.
 */
export declare class CustomResourceProvider extends Construct {
    /**
     * Returns a stack-level singleton ARN (service token) for the custom resource
     * provider.
     *
     * @param scope Construct scope
     * @param uniqueid A globally unique id that will be used for the stack-level
     * construct.
     * @param props Provider properties which will only be applied when the
     * provider is first created.
     * @returns the service token of the custom resource provider, which should be
     * used when defining a `CustomResource`.
     */
    static getOrCreate(scope: Construct, uniqueid: string, props: CustomResourceProviderProps): string;
    /**
     * Returns a stack-level singleton for the custom resource provider.
     *
     * @param scope Construct scope
     * @param uniqueid A globally unique id that will be used for the stack-level
     * construct.
     * @param props Provider properties which will only be applied when the
     * provider is first created.
     * @returns the service token of the custom resource provider, which should be
     * used when defining a `CustomResource`.
     */
    static getOrCreateProvider(scope: Construct, uniqueid: string, props: CustomResourceProviderProps): CustomResourceProvider;
    /**
     * The ARN of the provider's AWS Lambda function which should be used as the
     * `serviceToken` when defining a custom resource.
     *
     * @example
     * declare const myProvider: CustomResourceProvider;
     *
     * new CustomResource(this, 'MyCustomResource', {
     *   serviceToken: myProvider.serviceToken,
     *   properties: {
     *     myPropertyOne: 'one',
     *     myPropertyTwo: 'two',
     *   },
     * });
     */
    readonly serviceToken: string;
    /**
     * The ARN of the provider's AWS Lambda function role.
     */
    readonly roleArn: string;
    /**
     * The hash of the lambda code backing this provider. Can be used to trigger updates
     * on code changes, even when the properties of a custom resource remain unchanged.
     */
    readonly codeHash: string;
    private policyStatements?;
    private _role?;
    protected constructor(scope: Construct, id: string, props: CustomResourceProviderProps);
    /**
     * Add an IAM policy statement to the inline policy of the
     * provider's lambda function's role.
     *
     * **Please note**: this is a direct IAM JSON policy blob, *not* a `iam.PolicyStatement`
     * object like you will see in the rest of the CDK.
     *
     *
     * @example
     * declare const myProvider: CustomResourceProvider;
     *
     * myProvider.addToRolePolicy({
     *   Effect: 'Allow',
     *   Action: 's3:GetObject',
     *   Resource: '*',
     * });
     */
    addToRolePolicy(statement: any): void;
    private renderPolicies;
    private renderEnvironmentVariables;
}
