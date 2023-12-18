import { Construct } from 'constructs';
import { CfnGlobalTable } from './dynamodb.generated';
import { TableEncryption } from './shared';
import { IKey } from '../../aws-kms';
import { Stack, Token } from '../../core';

/**
 * Represents server-side encryption for a DynamoDB table.
 */
export abstract class TableEncryptionV2 {
  /**
   * Configure server-side encryption using a DynamoDB owned key.
   */
  public static dynamoOwnedKey(): TableEncryptionV2 {
    return new (class extends TableEncryptionV2 {
      public _renderSseSpecification() {
        return {
          sseEnabled: false,
        } satisfies CfnGlobalTable.SSESpecificationProperty;
      }

      public _renderReplicaSseSpecification(_scope: Construct, _region: string) {
        return undefined;
      }
    }) (TableEncryption.DEFAULT);
  }

  /**
   * Configure server-side encryption using a DynamoDB owned key.
   */
  public static awsManagedKey(): TableEncryptionV2 {
    return new (class extends TableEncryptionV2 {
      public _renderSseSpecification() {
        return {
          sseEnabled: true,
          sseType: 'KMS',
        } satisfies CfnGlobalTable.SSESpecificationProperty;
      }

      public _renderReplicaSseSpecification(_scope: Construct, _region: string) {
        return undefined;
      }
    }) (TableEncryption.AWS_MANAGED);
  }

  /**
   * Configure server-side encryption using customer managed keys.
   *
   * @param tableKey the KMS key for the primary table.
   * @param replicaKeyArns an object containing the ARN of the KMS key to use for each replica table.
   */
  public static customerManagedKey(tableKey: IKey, replicaKeyArns: { [region: string]: string } = {}): TableEncryptionV2 {
    return new (class extends TableEncryptionV2 {
      public _renderSseSpecification() {
        return {
          sseEnabled: true,
          sseType: 'KMS',
        } satisfies CfnGlobalTable.SSESpecificationProperty;
      }

      public _renderReplicaSseSpecification(scope: Construct, replicaRegion: string) {
        const stackRegion = Stack.of(scope).region;
        if (Token.isUnresolved(stackRegion)) {
          throw new Error('Replica SSE specification cannot be rendered in a region agnostic stack');
        }

        if (replicaKeyArns.hasOwnProperty(stackRegion)) {
          throw new Error(`KMS key for deployment region ${stackRegion} cannot be defined in 'replicaKeyArns'`);
        }

        if (replicaRegion === stackRegion) {
          return {
            kmsMasterKeyId: tableKey.keyArn,
          } satisfies CfnGlobalTable.ReplicaSSESpecificationProperty;
        }

        const regionInReplicaKeyArns = replicaKeyArns.hasOwnProperty(replicaRegion);
        if (!regionInReplicaKeyArns) {
          throw new Error(`KMS key for ${replicaRegion} was not found in 'replicaKeyArns'`);
        }

        return {
          kmsMasterKeyId: replicaKeyArns[replicaRegion],
        } satisfies CfnGlobalTable.ReplicaSSESpecificationProperty;
      }
    }) (TableEncryption.CUSTOMER_MANAGED, tableKey, replicaKeyArns);
  }

  private constructor (
    public readonly type: TableEncryption,
    public readonly tableKey?: IKey,
    public readonly replicaKeyArns?: { [region: string]: string }) {}

  /**
   * @internal
   */
  public abstract _renderSseSpecification(): any;

  /**
   * @internal
   */
  public abstract _renderReplicaSseSpecification(scope: Construct, region: string): any;
}
