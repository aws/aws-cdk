import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib/core';

export class PartitionIndexProvider extends Construct {
  /**
   * Creates a Stack singleton partition index provider.
   */
  public static getOrCreate(scope: Construct) {
    const uuid = 'd247c53f-ce3e-4a07-ada9-bab1690fd3c4';
    return Stack.of(scope).node.tryFindChild(uuid) as PartitionIndexProvider
      ?? new PartitionIndexProvider(scope, uuid);
  }

  private constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}