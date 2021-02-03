import { Construct } from 'constructs';
import { CfnResource } from './cfn-resource';
import { RemovalPolicy } from './removal-policy';
import { Resource } from './resource';
import { Token } from './token';

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
   * AWS Lambda function:
   *
   * ```ts
   * // invoke an AWS Lambda function when a lifecycle event occurs:
   * new CustomResource(this, 'MyResource', {
   *   serviceToken: myFunction.functionArn,
   * });
   * ```
   *
   * SNS topic:
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
  readonly properties?: { [key: string]: any };

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
 * Custom resource that is implemented using a Lambda
 *
 * As a custom resource author, you should be publishing a subclass of this class
 * that hides the choice of provider, and accepts a strongly-typed properties
 * object with the properties your provider accepts.
 *
 * @resource AWS::CloudFormation::CustomResource
 */
export class CustomResource extends Resource {
  private readonly resource: CfnResource;

  constructor(scope: Construct, id: string, props: CustomResourceProps) {
    super(scope, id);

    const type = renderResourceType(props.resourceType);
    const pascalCaseProperties = props.pascalCaseProperties ?? false;
    const properties = pascalCaseProperties ? uppercaseProperties(props.properties || {}) : (props.properties || {});

    this.resource = new CfnResource(this, 'Default', {
      type,
      properties: {
        ServiceToken: props.serviceToken,
        ...properties,
      },
    });

    this.resource.applyRemovalPolicy(props.removalPolicy, {
      default: RemovalPolicy.DESTROY,
    });
  }

  /**
   * The physical name of this custom resource.
   */
  public get ref() {
    return this.resource.ref;
  }

  /**
   * Returns the value of an attribute of the custom resource of an arbitrary
   * type. Attributes are returned from the custom resource provider through the
   * `Data` map where the key is the attribute name.
   *
   * @param attributeName the name of the attribute
   * @returns a token for `Fn::GetAtt`. Use `Token.asXxx` to encode the returned `Reference` as a specific type or
   * use the convenience `getAttString` for string attributes.
   */
  public getAtt(attributeName: string) {
    return this.resource.getAtt(attributeName);
  }

  /**
   * Returns the value of an attribute of the custom resource of type string.
   * Attributes are returned from the custom resource provider through the
   * `Data` map where the key is the attribute name.
   *
   * @param attributeName the name of the attribute
   * @returns a token for `Fn::GetAtt` encoded as a string.
   */
  public getAttString(attributeName: string): string {
    return Token.asString(this.getAtt(attributeName));
  }
}

/**
 * Uppercase the first letter of every property name
 *
 * It's customary for CloudFormation properties to start with capitals, and our
 * properties to start with lowercase, so this function translates from one
 * to the other
 */
function uppercaseProperties(props: { [key: string]: any }) {
  const ret: { [key: string]: any } = {};
  Object.keys(props).forEach(key => {
    const upper = key.substr(0, 1).toUpperCase() + key.substr(1);
    ret[upper] = props[key];
  });
  return ret;
}

function renderResourceType(resourceType?: string) {
  if (!resourceType) {
    return 'AWS::CloudFormation::CustomResource';
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
