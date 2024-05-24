import * as path from 'path';
import { Construct } from 'constructs';
import { Duration, Stack } from 'aws-cdk-lib/core';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Provider } from 'aws-cdk-lib/custom-resources';

/**
 *
 */
export interface PartitionIndexProviderProps {}

/**
 *
 */
export class PartitionIndexProvider extends Construct {
  /**
   * Creates a Stack singleton partition index provider.
   */
  public static getOrCreate(scope: Construct, props: PartitionIndexProviderProps = {}) {
    const uuid = 'd247c53f-ce3e-4a07-ada9-bab1690fd3c4';
    return Stack.of(scope).node.tryFindChild(uuid) as PartitionIndexProvider
      ?? new PartitionIndexProvider(scope, uuid);
  }

  private constructor(scope: Construct, id: string) {
    super(scope, id);

    const onEventHandler = new Function(this, 'OnEventHandler', {
      handler: 'index.onEventHandler',
      code: Code.fromAsset(path.join(__dirname)),
      runtime: Runtime.NODEJS_20_X,
    });

    const isCompleteHandler = new Function(this, 'IsCompleteHandler', {
      handler: 'index.isCompleteHandler',
      code: Code.fromAsset(path.join(__dirname)),
      runtime: Runtime.NODEJS_20_X,
    });

    new Provider(this, 'Provider', {
      onEventHandler,
      isCompleteHandler,
      queryInterval: Duration.seconds(10),
      totalTimeout: Duration.minutes(10),
    });
  }
}
