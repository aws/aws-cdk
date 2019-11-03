import cfn = require('@aws-cdk/aws-cloudformation');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { Construct, Duration, RemovalPolicy } from '@aws-cdk/core';
import { ProviderStack } from './provider-stack';

export interface AsyncCustomResourceProps {
  /**
   * A unique identifier for the provider. This ensures that only a single provider is created
   * for this type of async custom resource.
   */
  readonly uuid: string;

  /**
   * Properties to pass to the provider handler. Properties will be available
   * under `ResourceProperties` (and `OldResourceProperties`) in the calls to
   * `onEvent` and `isComplete`.
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
  readonly code: lambda.Code;

  /**
   * The AWS Lambda runtime to use. Currently, only NodeJS runtimes are supported.
   */
  readonly runtime: lambda.Runtime;

  /**
   * The function to invoke for all resource lifecycle operations
   * (CREATE/UPDATE/DELETE).
   *
   * This function is responsible to begin the requested resource operation
   * (CREATE/UPDATE/DELETE) and return any additional properties to add to the
   * event, which will later be passed to `isComplete`. The `PhysicalResourceId`
   * property must be included in the response.
   */
  readonly onEventHandler: string;

  /**
   * The function to invoke in order to determine if the operation is
   * complete.
   *
   * This function will be called immediately after `onEvent` and then
   * periodically based on the configured query interval as long as it returns
   * `false`. If the function still returns `false` and the alloted timeout has
   * passed, the operation will fail.
   */
  readonly isCompleteHandler: string;

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
}

export class AsyncCustomResource extends cfn.CustomResource {

  /**
   * A principal that represents the roles used when executing the user-defined
   * custom resource handlers (`onEvent` and `isComplete`). You can grant permissions
   * to this principal.
   *
   * Bear in mind that we maintain a single instance of the provider in each stack. This means
   * that if multiple
   */
  public readonly userExecutionPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: AsyncCustomResourceProps) {
    const providerStack = ProviderStack.getOrCreate(scope, props);

    super(scope, id, {
      provider: cfn.CustomResourceProvider.lambda(providerStack.entrypoint),
      resourceType: props.resourceType,
      properties: props.properties,
      removalPolicy: props.removalPolicy
    });

    this.userExecutionPrincipal = new MultiRole([
      providerStack.userOnEventFunction.role!,
      providerStack.userIsCompleteFunction.role!
    ]);
  }
}

/**
 * An IAM principal that represents multiple roles with the same policy.
 *
 * `assumeRoleAction` or `policyFragment` are not supported.
 */
class MultiRole implements iam.IPrincipal {
  public readonly grantPrincipal = this;

  constructor(private readonly roles: iam.IRole[]) { }

  public get assumeRoleAction(): string { throw new Error('not supported'); }
  public get policyFragment(): iam.PrincipalPolicyFragment { throw new Error('not supported'); }

  public addToPolicy(statement: iam.PolicyStatement): boolean {
    for (const role of this.roles) {
      role.addToPolicy(statement);
    }

    return true;
  }
}
