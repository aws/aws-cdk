import * as path from 'path';
import { Construct } from 'constructs';
import { Duration, Stack } from 'aws-cdk-lib/core';
import { Code, Function, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IDatabase } from './database';
import { ITable } from './table-base';

/**
 * Properties used to initialize a PartitionIndexProvider.
 */
export interface PartitionIndexProviderProps {
  readonly table: ITable;
  readonly database: IDatabase;
}

/**
 * A class that represents a PartitionIndexProvider.
 */
export class PartitionIndexProvider extends Construct {
  /**
   * Creates a Stack singleton partition index provider.
   */
  public static getOrCreate(scope: Construct, props: PartitionIndexProviderProps) {
    const stack = Stack.of(scope);
    const uuid = 'd247c53f-ce3e-4a07-ada9-bab1690fd3c4';
    const existing = stack.node.tryFindChild(uuid) as PartitionIndexProvider;
    return existing ?? new PartitionIndexProvider(stack, uuid, props);
  }

  /**
   * The underlying CloudFormation custom resource provider.
   */
  public readonly provider: Provider;

  public readonly onEventHandler: IFunction;

  public readonly isCompleteHandler: IFunction;

  private constructor(scope: Construct, id: string, props: PartitionIndexProviderProps) {
    super(scope, id);

    this.onEventHandler = new Function(this, 'OnEventHandler', {
      handler: 'index.onEventHandler',
      code: Code.fromAsset(path.join(__dirname, '..', 'custom-resource-handlers', 'dist', 'aws-glue-alpha', 'partition-index-handler')),
      runtime: Runtime.NODEJS_20_X,
    });
    this.onEventHandler.addToRolePolicy(new PolicyStatement({
      actions: ['glue:UpdateTable'],
      resources: [
        props.table.tableArn,
        props.database.databaseArn,
        props.database.catalogArn,
      ],
    }));

    this.isCompleteHandler = new Function(this, 'IsCompleteHandler', {
      handler: 'index.isCompleteHandler',
      code: Code.fromAsset(path.join(__dirname, '..', 'custom-resource-handlers', 'dist', 'aws-glue-alpha', 'partition-index-handler')),
      runtime: Runtime.NODEJS_20_X,
    });
    this.isCompleteHandler.addToRolePolicy(new PolicyStatement({
      actions: ['glue:GetTable'],
      resources: [
        props.table.tableArn,
        props.database.databaseArn,
        props.database.catalogArn,
      ],
    }));

    this.provider = new Provider(this, 'Provider', {
      onEventHandler: this.onEventHandler,
      isCompleteHandler: this.isCompleteHandler,
      queryInterval: Duration.seconds(10),
      totalTimeout: Duration.minutes(10),
    });
  }
}
