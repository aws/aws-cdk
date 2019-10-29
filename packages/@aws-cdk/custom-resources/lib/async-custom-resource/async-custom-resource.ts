import cfn = require('@aws-cdk/aws-cloudformation');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { Construct, Duration, RemovalPolicy } from '@aws-cdk/core';
import { ProviderStack } from './provider-stack';
import consts = require('./runtime/consts');

export interface AsyncCustomResourceProps {
  /**
   * A unique identifier for the provider. This ensures that only a single provider is created
   * for this type of async custom resource.
   */
  readonly uuid: string;

  /**
   * Properties to pass to the Lambda
   *
   * @default - No properties.
   */
  readonly properties?: { [name: string]: any };

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
   * @default "AWS::CloudFormation::CustomResource"
   */
  readonly resourceType?: string;

  /**
   * The policy to apply when this resource is removed from the application.
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * The handler JavaScript code for the custom resource (Node.js 10.x).
   *
   * Must contain the handler files with the approriate exports as defined by `onEventHandler`
   * and `isCompleteHandler`. The defaults are `index.onEvent` and `index.isComplete`.
   */
  readonly handlerCode: lambda.Code;

  /**
   * The AWS Lambda runtime to use. Currently, only NodeJS runtimes are supported.
   */
  readonly runtime: lambda.Runtime;

  /**
   * The JavaScript function to invoke for all resource lifecycle
   * operations (CREATE/UPDATE/DELETE).
   *
   * The syntax is `<file>.<function>` (similar to the AWS Lambda API for
   * JavaScript).
   *
   * This function is responsible to begin the requested resource operation
   * (CREATE/UPDATE/DELETE) and return any additional properties to add to the
   * event, which will later be passed to `isComplete`. The `PhysicalResourceId`
   * property must be included in the response.
   *
   * @default "index.onEvent"
   */
  readonly onEventHandler?: string;

  /**
   * The JavaScript function to invoke in order to determine if the operation is
   * complete.
   *
   * The syntax is `<file>.<function>` (similar to the AWS Lambda API for
   * JavaScript).
   *
   * This function will be called immediately after `onEvent` and then
   * periodically based on the configured query interval as long as it returns
   * `false`. If the function still returns `false` and the alloted timeout has
   * passed, the operation will fail.
   *
   * @default "index.isComplete"
   */
  readonly isCompleteHandler?: string;

  /**
   * Time between calls to the `isComplete` handler which determines if the
   * resource has been stabilized.
   *
   * The first `isComplete` will be called immediately after `handler` and then
   * every `queryInterval` seconds, and until `timeout` has been reached or until
   * `isComplete` returns `true`.
   *
   * @default Duration.seconds(5)
   */
  readonly queryInterval?: Duration;

  /**
   * Total timeout for the entire operation.
   *
   * The maximum timeout is 2 hours (yes, it can exceed the AWS Lambda 15 minutes)
   *
   * @default Duration.minutes(30)
   */
  readonly totalTimeout?: Duration;

  /**
   * An IAM role to use when executing the custom resource handler logic.
   *
   * @default - automatically created, you can use `addToRolePolicy` to update.
   */
  readonly role?: iam.IRole;
}

export class AsyncCustomResource extends cfn.CustomResource implements iam.IGrantable {

  public readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: AsyncCustomResourceProps) {
    const handlerStack = ProviderStack.getOrCreate(scope, props);

    const role = props.role || new iam.Role(scope, `${id}:ExecutionRole`, {
      assumedBy: new iam.ArnPrincipal(handlerStack.roles[0].roleArn)
    });

    if (role instanceof iam.Role && role.assumeRolePolicy) {
      for (const functionRole of handlerStack.roles.slice(1)) {
        role.assumeRolePolicy.addStatements(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [ 'sts:AssumeRole' ],
          principals: [ new iam.ArnPrincipal(functionRole.roleArn) ],
        }));
      }
    }

    super(scope, id, {
      provider: cfn.CustomResourceProvider.lambda(handlerStack.onEventFunction),
      resourceType: props.resourceType,
      properties: {
        [consts.PROP_EXECUTION_ROLE_ARN]: role.roleArn,
        ...props.properties
      },
      removalPolicy: props.removalPolicy
    });

    this.grantPrincipal = role;
  }

}
