import * as path from 'path';
import { Construct } from 'constructs';
import { Duration, Stack } from 'aws-cdk-lib/core';
import { Code, Function, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ITable } from './table-base';

/**
 * Options used to initialize a PartitionIndexProvider
 */
interface PartitionIndexOptions {
  /**
   * The total timeout for the partition index operation.
   *
   * @default Duration.minutes(30)
   */
  readonly totalTimeout?: Duration;
}

/**
 * Properties used to initialize a PartitionIndexProvider.
 */
export interface PartitionIndexProviderProps extends PartitionIndexOptions {
  /**
   * The Glue table that the partition index operation will take place on.
   */
  readonly table: ITable;
}

/**
 * A class that represents a PartitionIndexProvider.
 */
export class PartitionIndexProvider extends Construct {
  /**
   * Creates a Stack singleton PartitionIndexProvider.
   */
  public static getOrCreate(scope: Construct, props: PartitionIndexProviderProps) {
    const stack = Stack.of(scope);
    const uuid = 'd247c53f-ce3e-4a07-ada9-bab1690fd3c4';
    const existing = stack.node.tryFindChild(uuid) as PartitionIndexProvider;
    return existing ?? new PartitionIndexProvider(stack, uuid, props);
  }

  /**
   * The underlying AWS CloudFormation custom resource provider.
   */
  public readonly provider: Provider;

  /**
   * The AWS Lambda function to invoke for all resource lifecycle operations (CREATE/UPDATE/DELETE).
   */
  public readonly onEventHandler: IFunction;

  /**
   * The AWS Lambda function to invoke in order to determine if the partition index operation is complete.
   */
  public readonly isCompleteHandler: IFunction;

  private constructor(scope: Construct, id: string, props: PartitionIndexProviderProps) {
    super(scope, id);

    this.onEventHandler = new Function(this, 'OnEventHandler', {
      handler: 'index.onEventHandler',
      code: Code.fromAsset(path.join(__dirname, '..', 'custom-resource-handlers', 'dist', 'aws-glue-alpha', 'partition-index-handler')),
      runtime: Runtime.NODEJS_18_X,
    });
    this.onEventHandler.addToRolePolicy(new PolicyStatement({
      actions: ['glue:UpdateTable'],
      resources: [props.table.tableArn],
    }));

    this.isCompleteHandler = new Function(this, 'IsCompleteHandler', {
      handler: 'index.isCompleteHandler',
      code: Code.fromAsset(path.join(__dirname, '..', 'custom-resource-handlers', 'dist', 'aws-glue-alpha', 'partition-index-handler')),
      runtime: Runtime.NODEJS_18_X,
    });
    this.isCompleteHandler.addToRolePolicy(new PolicyStatement({
      actions: ['glue:GetTable'],
      resources: [props.table.tableArn],
    }));

    this.provider = new Provider(this, 'Provider', {
      onEventHandler: this.onEventHandler,
      isCompleteHandler: this.isCompleteHandler,
      queryInterval: Duration.seconds(10),
      totalTimeout: props.totalTimeout,
    });
  }
}
