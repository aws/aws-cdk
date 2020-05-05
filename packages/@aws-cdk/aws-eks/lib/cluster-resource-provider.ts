import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration, NestedStack, Stack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as path from 'path';

const HANDLER_DIR = path.join(__dirname, 'cluster-resource-handler');
const HANDLER_RUNTIME = lambda.Runtime.NODEJS_12_X;

/**
 * A custom resource provider that handles cluster operations. It serves
 * multiple custom resources such as the cluster resource and the fargate
 * resource.
 *
 * @internal
 */
export class ClusterResourceProvider extends NestedStack {

  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-eks.ClusterResourceProvider';
    return stack.node.tryFindChild(uid) as ClusterResourceProvider || new ClusterResourceProvider(stack, uid);
  }

  /**
   * The custom resource provider to use for custom resources.
   */
  public readonly provider: cr.Provider;

  /**
   * The IAM roles used by the provider's lambda handlers.
   */
  public readonly roles: iam.IRole[];

  private constructor(scope: Construct, id: string) {
    super(scope, id);

    const onEvent = new lambda.Function(this, 'OnEventHandler', {
      code: lambda.Code.fromAsset(HANDLER_DIR),
      description: 'onEvent handler for EKS cluster resource provider',
      runtime: HANDLER_RUNTIME,
      handler: 'index.onEvent',
      timeout: Duration.minutes(1),
    });

    const isComplete = new lambda.Function(this, 'IsCompleteHandler', {
      code: lambda.Code.fromAsset(HANDLER_DIR),
      description: 'isComplete handler for EKS cluster resource provider',
      runtime: HANDLER_RUNTIME,
      handler: 'index.isComplete',
      timeout: Duration.minutes(1),
    });

    this.provider = new cr.Provider(this, 'Provider', {
      onEventHandler: onEvent,
      isCompleteHandler: isComplete,
      totalTimeout: Duration.hours(1),
      queryInterval: Duration.minutes(1),
    });

    this.roles = [ onEvent.role!, isComplete.role! ];
  }

  /**
   * The custom resource service token for this provider.
   */
  public get serviceToken() { return this.provider.serviceToken; }
}