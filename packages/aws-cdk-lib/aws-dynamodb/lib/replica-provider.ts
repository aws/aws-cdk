import { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import { Aws, Duration, NestedStack, Stack } from '../../core';
import { ReplicaOnEventFunction, ReplicaIsCompleteFunction } from '../../custom-resource-handlers/dist/aws-dynamodb/replica-provider.generated';
import * as cr from '../../custom-resources';

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

    // Issues UpdateTable API calls
    this.onEventHandler = new ReplicaOnEventFunction(this, 'OnEventHandler', {
      timeout: Duration.minutes(5),
    });

    // Checks if table is back to `ACTIVE` state
    this.isCompleteHandler = new ReplicaIsCompleteFunction(this, 'IsCompleteHandler', {
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
      resources.push(`arn:${Aws.PARTITION}:dynamodb:${region}:${this.account}:table/${props.tableName}`);
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
