import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import { CfnResource, Construct, RemovalPolicy, Resource } from '@aws-cdk/core';
import { CfnCustomResource } from './cloudformation.generated';

/**
 * Collection of arbitrary properties
 */
export type Properties = {[key: string]: any};

export class CustomResourceProvider {
  /**
   * The Lambda provider that implements this custom resource.
   *
   * We recommend using a lambda.SingletonFunction for this.
   */
  public static lambda(handler: lambda.IFunction) { return new CustomResourceProvider(handler.functionArn); }

  /**
   * The SNS Topic for the provider that implements this custom resource.
   */
  public static topic(topic: sns.ITopic) { return new CustomResourceProvider(topic.topicArn); }

  private constructor(public readonly serviceToken: string) {}
}

/**
 * Properties to provide a Lambda-backed custom resource
 */
export interface CustomResourceProps {
  /**
   * The provider which implements the custom resource
   *
   * @example CustomResourceProvider.lambda(myFunction)
   * @example CustomResourceProvider.topic(myTopic)
   */
  readonly provider: CustomResourceProvider;

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
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Custom resource that is implemented using a Lambda
 *
 * As a custom resource author, you should be publishing a subclass of this class
 * that hides the choice of provider, and accepts a strongly-typed properties
 * object with the properties your provider accepts.
 */
export class CustomResource extends Resource {
  private readonly resource: CfnResource;

  constructor(scope: Construct, id: string, props: CustomResourceProps) {
    super(scope, id);

    const type = renderResourceType(props.resourceType);

    this.resource = new CfnResource(this, 'Default', {
      type,
      properties: {
        ServiceToken: props.provider.serviceToken,
        ...uppercaseProperties(props.properties || {})
      }
    });

    this.resource.applyRemovalPolicy(props.removalPolicy, { default: RemovalPolicy.DESTROY });
  }

  /**
   * The physical name of this custom resource.
   */
  public get ref() {
    return this.resource.ref;
  }

  /**
   * An attribute of this custom resource
   * @param attributeName the attribute name
   */
  public getAtt(attributeName: string) {
    return this.resource.getAtt(attributeName);
  }
}

/**
 * Uppercase the first letter of every property name
 *
 * It's customary for CloudFormation properties to start with capitals, and our
 * properties to start with lowercase, so this function translates from one
 * to the other
 */
function uppercaseProperties(props: Properties): Properties {
  const ret: Properties = {};
  Object.keys(props).forEach(key => {
    const upper = key.substr(0, 1).toUpperCase() + key.substr(1);
    ret[upper] = props[key];
  });
  return ret;
}

function renderResourceType(resourceType?: string) {
  if (!resourceType) {
    return CfnCustomResource.CFN_RESOURCE_TYPE_NAME;
  }

  if (!resourceType.startsWith('Custom::')) {
    throw new Error(`Custom resource type must begin with "Custom::" (${resourceType})`);
  }

  const typeName = resourceType.substr(resourceType.indexOf('::') + 2);
  if (typeName.length > 60) {
    throw new Error(`Custom resource type length > 60 (${resourceType})`);
  }

  if (!/^[a-z0-9_@-]+$/i.test(typeName)) {
    throw new Error(`Custom resource type name can only include alphanumeric characters and _@- (${typeName})`);
  }

  return resourceType;
}
