import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration, NestedStack, Stack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as path from 'path';

export class ReplicaProvider extends NestedStack {
  /**
   * Creates a stack-singleton resource provider nested stack.
   */
  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-dynamodb.ReplicaProvider';
    return stack.node.tryFindChild(uid) as ReplicaProvider || new ReplicaProvider(stack, uid);
  }

  /**
   * The custom resource provider.
   */
  public readonly provider: cr.Provider;

  /**
   * The onEvent handler
   */
  public readonly onEventHandler: lambda.Function;

  /**
   * The isComplete handler
   */
  public readonly isCompleteHandler: lambda.Function;

  private constructor(scope: Construct, id: string) {
    super(scope, id);

    // Issues UpdateTable API calls
    this.onEventHandler = new lambda.Function(this, 'OnEventHandler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'replica-handler')),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.onEventHandler',
      timeout: Duration.minutes(5),
    });

    // Checks if table is back to `ACTIVE` state
    this.isCompleteHandler = new lambda.Function(this, 'IsCompleteHandler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'replica-handler')),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.isCompleteHandler',
      timeout: Duration.seconds(30),
    });

    // Allows the creation of the `AWSServiceRoleForDynamoDBReplication` service linked role
    this.onEventHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['iam:CreateServiceLinkedRole'],
        resources: [Stack.of(this).formatArn({
          service: 'iam',
          region: '', // IAM is region-less
          resource: 'role',
          resourceName: 'aws-service-role/replication.dynamodb.amazonaws.com/AWSServiceRoleForDynamoDBReplication',
        })],
      }),
    );

    // Required for replica table creation
    this.onEventHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:DescribeLimits'],
        resources: ['*'],
      }),
    );

    this.provider = new cr.Provider(this, 'Provider', {
      onEventHandler: this.onEventHandler,
      isCompleteHandler: this.isCompleteHandler,
      queryInterval: Duration.seconds(10),
    });
  }
}
