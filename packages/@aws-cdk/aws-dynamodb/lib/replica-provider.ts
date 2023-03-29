import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, NestedStack, Stack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';

/**
 * Properties for a ReplicaProvider
 */
export interface ReplicaProviderProps {
  /**
   * The table name
   *
   */
  readonly tableName: string;
  /**
   * Regions where replica tables will be created
   *
   */
  readonly regions: string[];
  /**
   * The timeout for the replication operation.
   *
   * @default Duration.minutes(30)
   */
  readonly timeout?: Duration;
}

export class ReplicaProvider extends NestedStack {
  /**
   * Creates a stack-singleton resource provider nested stack.
   */
  public static getOrCreate(scope: Construct, props: ReplicaProviderProps) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-dynamodb.ReplicaProvider';
    return stack.node.tryFindChild(uid) as ReplicaProvider ?? new ReplicaProvider(stack, uid, props);
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

  private constructor(scope: Construct, id: string, props: ReplicaProviderProps) {
    super(scope, id);

    const code = lambda.Code.fromAsset(path.join(__dirname, 'replica-handler'));

    // Issues UpdateTable API calls
    this.onEventHandler = new lambda.Function(this, 'OnEventHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.onEventHandler',
      timeout: Duration.minutes(5),
    });

    // Checks if table is back to `ACTIVE` state
    this.isCompleteHandler = new lambda.Function(this, 'IsCompleteHandler', {
      code,
      runtime: lambda.Runtime.NODEJS_14_X,
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

    // Required for replica table deletion
    let resources: string[] = [];
    props.regions.forEach((region) => {
      resources.push(`arn:aws:dynamodb:${region}:${this.account}:table/${props.tableName}`);
    });

    this.onEventHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:DeleteTable', 'dynamodb:DeleteTableReplica'],
        resources: resources,
      }),
    );

    this.provider = new cr.Provider(this, 'Provider', {
      onEventHandler: this.onEventHandler,
      isCompleteHandler: this.isCompleteHandler,
      queryInterval: Duration.seconds(10),
      totalTimeout: props.timeout,
    });
  }
}
