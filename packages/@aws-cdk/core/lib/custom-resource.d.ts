import { Construct } from 'constructs';
import { RemovalPolicy } from './removal-policy';
import { Resource } from './resource';
/**
 * Properties to provide a Lambda-backed custom resource
 */
export interface CustomResourceProps {
    /**
     * The ARN of the provider which implements this custom resource type.
     *
     * You can implement a provider by listening to raw AWS CloudFormation events
     * and specify the ARN of an SNS topic (`topic.topicArn`) or the ARN of an AWS
     * Lambda function (`lambda.functionArn`) or use the CDK's custom [resource
     * provider framework] which makes it easier to implement robust providers.
     *
     * [resource provider framework]:
     * https://docs.aws.amazon.com/cdk/api/latest/docs/custom-resources-readme.html
     *
     * Provider framework:
     *
     * ```ts
     * // use the provider framework from aws-cdk/custom-resources:
     * const provider = new customresources.Provider(this, 'ResourceProvider', {
     *   onEventHandler,
     *   isCompleteHandler, // optional
     * });
     *
     * new CustomResource(this, 'MyResource', {
     *   serviceToken: provider.serviceToken,
     * });
     * ```
     *
     * AWS Lambda function (not recommended to use AWS Lambda Functions directly,
     * see the module README):
     *
     * ```ts
     * // invoke an AWS Lambda function when a lifecycle event occurs:
     * new CustomResource(this, 'MyResource', {
     *   serviceToken: myFunction.functionArn,
     * });
     * ```
     *
     * SNS topic (not recommended to use AWS Lambda Functions directly, see the
     * module README):
     *
     * ```ts
     * // publish lifecycle events to an SNS topic:
     * new CustomResource(this, 'MyResource', {
     *   serviceToken: myTopic.topicArn,
     * });
     * ```
     */
    readonly serviceToken: string;
    /**
     * Properties to pass to the Lambda
     *
     * @default - No properties.
     */
    readonly properties?: {
        [key: string]: any;
    };
    /**
     * For custom resources, you can specify AWS::CloudFormation::CustomResource
     * (the default) as the resource type, or you can specify your own resource
     * type name. For example, you can use "Custom::MyCustomResourceTypeName".
     *
     * Custom resource type names must begin with "Custom::" and can include
     * alphanumeric characters and the following characters: _@-. You can specify
     * a custom resource type name up to a maximum length of 60 characters. You
     * cannot change the type during an update.
     *
     * Using your own resource type names helps you quickly differentiate the
     * types of custom resources in your stack. For example, if you had two custom
     * resources that conduct two different ping tests, you could name their type
     * as Custom::PingTester to make them easily identifiable as ping testers
     * (instead of using AWS::CloudFormation::CustomResource).
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html#aws-cfn-resource-type-name
     *
     * @default - AWS::CloudFormation::CustomResource
     */
    readonly resourceType?: string;
    /**
     * The policy to apply when this resource is removed from the application.
     *
     * @default cdk.RemovalPolicy.Destroy
     */
    readonly removalPolicy?: RemovalPolicy;
    /**
     * Convert all property keys to pascal case.
     *
     * @default false
     */
    readonly pascalCaseProperties?: boolean;
}
/**
 * Instantiation of a custom resource, whose implementation is provided a Provider
 *
 * This class is intended to be used by construct library authors. Application
 * builder should not be able to tell whether or not a construct is backed by
 * a custom resource, and so the use of this class should be invisible.
 *
 * Instead, construct library authors declare a custom construct that hides the
 * choice of provider, and accepts a strongly-typed properties object with the
 * properties your provider accepts.
 *
 * Your custom resource provider (identified by the `serviceToken` property)
 * can be one of 4 constructs:
 *
 * - If you are authoring a construct library or application, we recommend you
 *   use the `Provider` class in the `custom-resources` module.
 * - If you are authoring a construct for the CDK's AWS Construct Library,
 *   you should use the `CustomResourceProvider` construct in this package.
 * - If you want full control over the provider, you can always directly use
 *   a Lambda Function or SNS Topic by passing the ARN into `serviceToken`.
 *
 * @resource AWS::CloudFormation::CustomResource
 */
export declare class CustomResource extends Resource {
    private readonly resource;
    constructor(scope: Construct, id: string, props: CustomResourceProps);
    /**
     * The physical name of this custom resource.
     */
    get ref(): string;
    /**
     * Returns the value of an attribute of the custom resource of an arbitrary
     * type. Attributes are returned from the custom resource provider through the
     * `Data` map where the key is the attribute name.
     *
     * @param attributeName the name of the attribute
     * @returns a token for `Fn::GetAtt`. Use `Token.asXxx` to encode the returned `Reference` as a specific type or
     * use the convenience `getAttString` for string attributes.
     */
    getAtt(attributeName: string): import("./reference").Reference;
    /**
     * Returns the value of an attribute of the custom resource of type string.
     * Attributes are returned from the custom resource provider through the
     * `Data` map where the key is the attribute name.
     *
     * @param attributeName the name of the attribute
     * @returns a token for `Fn::GetAtt` encoded as a string.
     */
    getAttString(attributeName: string): string;
}
