import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Collection of arbitrary properties
 *
 * @deprecated this type has been deprecated in favor of using a key-value type directly
 */
export type Properties = {[key: string]: any};

/**
 * Configuration options for custom resource providers.
 *
 * @deprecated used in `ICustomResourceProvider` which is now deprecated
 */
export interface CustomResourceProviderConfig {
  /**
   * The ARN of the SNS topic or the AWS Lambda function which implements this
   * provider.
   */
  readonly serviceToken: string;
}

/**
 * Represents a provider for an AWS CloudFormation custom resources.
 * @deprecated use `core.ICustomResourceProvider`
 */
export interface ICustomResourceProvider {
  /**
   * Called when this provider is used by a `CustomResource`.
   * @param scope The resource that uses this provider.
   * @returns provider configuration
   */
  bind(scope: Construct): CustomResourceProviderConfig;
}

/**
 * Represents a provider for an AWS CloudFormation custom resources.
 *
 * @deprecated use core.CustomResource instead
 */
export class CustomResourceProvider implements ICustomResourceProvider {
  /**
   * The Lambda provider that implements this custom resource.
   *
   * We recommend using a lambda.SingletonFunction for this.
   */
  public static fromLambda(handler: lambda.IFunction): CustomResourceProvider {
    return new CustomResourceProvider(handler.functionArn);
  }

  /**
   * The SNS Topic for the provider that implements this custom resource.
   */
  public static fromTopic(topic: sns.ITopic): CustomResourceProvider {
    return new CustomResourceProvider(topic.topicArn);
  }

  /**
   * Use AWS Lambda as a provider.
   * @deprecated use `fromLambda`
   */
  public static lambda(handler: lambda.IFunction) { return this.fromLambda(handler); }

  /**
   * Use an SNS topic as the provider.
   * @deprecated use `fromTopic`
   */
  public static topic(topic: sns.ITopic) { return this.fromTopic(topic); }

  /**
   * @param serviceToken the ServiceToken which contains the ARN for this provider.
   */
  private constructor(public readonly serviceToken: string) { }

  public bind(_: Construct): CustomResourceProviderConfig {
    return { serviceToken: this.serviceToken };
  }
}

/**
 * Properties to provide a Lambda-backed custom resource
 * @deprecated use `core.CustomResourceProps`
 */
export interface CustomResourceProps {
  /**
   * The provider which implements the custom resource.
   *
   * You can implement a provider by listening to raw AWS CloudFormation events
   * through an SNS topic or an AWS Lambda function or use the CDK's custom
   * [resource provider framework] which makes it easier to implement robust
   * providers.
   *
   * [resource provider framework]: https://docs.aws.amazon.com/cdk/api/latest/docs/custom-resources-readme.html
   *
   * ```ts
   * import * as custom_resources from '@aws-cdk/custom-resources';
   * import * as lambda from '@aws-cdk/aws-lambda';
   * import { Stack } from '@aws-cdk/core';
   * declare const myOnEventLambda: lambda.Function;
   * declare const myIsCompleteLambda: lambda.Function;
   * const stack = new Stack();
   *
   * const provider = new custom_resources.Provider(stack, 'myProvider', {
   *   onEventHandler: myOnEventLambda,
   *   isCompleteHandler: myIsCompleteLambda, // optional
   * });
   * ```
   *
   * ```ts
   * import * as cloudformation from '@aws-cdk/aws-cloudformation';
   * import * as lambda from '@aws-cdk/aws-lambda';
   * declare const myFunction: lambda.Function;
   *
   * // invoke an AWS Lambda function when a lifecycle event occurs:
   * const provider = cloudformation.CustomResourceProvider.fromLambda(myFunction);
   * ```
   *
   * ```ts
   * import * as cloudformation from '@aws-cdk/aws-cloudformation';
   * import * as sns from '@aws-cdk/aws-sns';
   * declare const myTopic: sns.Topic;
   *
   * // publish lifecycle events to an SNS topic:
   * const provider = cloudformation.CustomResourceProvider.fromTopic(myTopic);
   * ```
   */
  readonly provider: ICustomResourceProvider;

  /**
   * Properties to pass to the Lambda
   *
   * @default - No properties.
   */
  readonly properties?: Properties;

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
   * @see
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html#aws-cfn-resource-type-name
   *
   * @default - AWS::CloudFormation::CustomResource
   */
  readonly resourceType?: string;

  /**
   * The policy to apply when this resource is removed from the application.
   *
   * @default cdk.RemovalPolicy.Destroy
   */
  readonly removalPolicy?: core.RemovalPolicy;
}

/**
 * Deprecated.
 * @deprecated use `core.CustomResource`
 */
export class CustomResource extends core.CustomResource {
  constructor(scope: Construct, id: string, props: CustomResourceProps) {
    super(scope, id, {
      pascalCaseProperties: true,
      properties: props.properties,
      removalPolicy: props.removalPolicy,
      resourceType: props.resourceType,
      serviceToken: core.Lazy.string({ produce: () => props.provider.bind(this).serviceToken }),
    });
  }
}
