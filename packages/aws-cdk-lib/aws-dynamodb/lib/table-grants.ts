import { ITableRef } from './dynamodb.generated';
import * as perms from './perms';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import { Stack } from '../../core';

/**
 * Construction properties for TableGrants
 */
export interface TableGrantsProps {
  /**
   * The table to grant permissions on
   */
  readonly table: ITableRef & iam.IResourceWithPolicy;

  /**
   * Additional regions other than the main one that this table is replicated to
   *
   * @default - No regions
   */
  readonly additionalRegions?: string[];

  /**
   * Whether this table has indexes
   *
   * If so, permissions are granted on all table indexes as well.
   *
   * @default false
   */
  readonly hasIndex?: boolean;

  /**
   * The encryption key for this table
   *
   * Required permissions will be added to the key as well.
   *
   * @default - No key
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * A set of permissions to grant on a Table
 */
export class TableGrants {
  private readonly table: ITableRef & iam.IResourceWithPolicy;
  private readonly arns: string[] = [];
  private readonly encryptionKey?: kms.IKey;

  constructor(props: TableGrantsProps) {
    this.table = props.table;

    const stack = Stack.of(this.table);

    this.encryptionKey = props.encryptionKey;

    this.arns = [
      this.table.tableRef.tableArn,
      ...(props.additionalRegions ?? []).map((region) => stack.formatArn({
        region,
        service: 'dynamodb',
        resource: 'table',
        resourceName: this.table.tableRef.tableName,
      })),
    ];

    if (props.hasIndex) {
      this.arns.push(...this.arns.map((arn) => `${arn}/index/*`));
    }
  }

  /**
   * Adds an IAM policy statement associated with this table to an IAM
   * principal's policy.
   *
   * If `encryptionKey` is present, appropriate grants to the key needs to be added
   * separately using the `table.encryptionKey.grant*` methods.
   *
   * @param grantee The principal (no-op if undefined)
   * @param actions The set of actions to allow (i.e. "dynamodb:PutItem", "dynamodb:GetItem", ...)
   */
  public actions(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions,
      resourceArns: this.arns,
      resource: this.table,
    });
  }

  /**
   * Permits an IAM principal all data read operations from this table:
   * BatchGetItem, GetRecords, GetShardIterator, Query, GetItem, Scan, DescribeTable.
   *
   * Appropriate grants will also be added to the customer-managed KMS key
   * if one was configured.
   *
   * @param grantee The principal to grant access to
   */
  public readData(grantee: iam.IGrantable): iam.Grant {
    this.encryptionKey?.grant(grantee, ...perms.KEY_READ_ACTIONS);
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions: [...perms.READ_DATA_ACTIONS, perms.DESCRIBE_TABLE],
      resourceArns: this.arns,
      resource: this.table,
      // Use wildcard for resource policy to avoid circular dependency when grantee is a resource principal
      // (e.g., AccountRootPrincipal). This follows the same pattern as KMS (aws-kms/lib/key.ts).      // resourceArns is used for principal policies, resourceSelfArns is used for resource policies.
      resourceSelfArns: ['*'],
    });
  }

  /**
   * Permits an IAM principal all data write operations to this table:
   * BatchWriteItem, PutItem, UpdateItem, DeleteItem, DescribeTable.
   *
   * Appropriate grants will also be added to the customer-managed KMS key
   * if one was configured.
   *
   * @param grantee The principal to grant access to
   */
  public writeData(grantee: iam.IGrantable): iam.Grant {
    this.encryptionKey?.grant(grantee, ...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS);
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions: [...perms.WRITE_DATA_ACTIONS, perms.DESCRIBE_TABLE],
      resourceArns: this.arns,
      resource: this.table,
      // Use wildcard for resource policy to avoid circular dependency when grantee is a resource principal
      // (e.g., AccountRootPrincipal). This follows the same pattern as KMS (aws-kms/lib/key.ts).      // resourceArns is used for principal policies, resourceSelfArns is used for resource policies.
      resourceSelfArns: ['*'],
    });
  }

  /**
   * Permits an IAM principal to all data read/write operations to this table.
   * BatchGetItem, GetRecords, GetShardIterator, Query, GetItem, Scan,
   * BatchWriteItem, PutItem, UpdateItem, DeleteItem, DescribeTable
   *
   * Appropriate grants will also be added to the customer-managed KMS key
   * if one was configured.
   *
   * @param grantee The principal to grant access to
   */
  public readWriteData(grantee: iam.IGrantable): iam.Grant {
    this.encryptionKey?.grant(grantee, ...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS);
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions: [...perms.READ_DATA_ACTIONS, ...perms.WRITE_DATA_ACTIONS, perms.DESCRIBE_TABLE],
      resourceArns: this.arns,
      resource: this.table,
      // Use wildcard for resource policy to avoid circular dependency when grantee is a resource principal
      // (e.g., AccountRootPrincipal). This follows the same pattern as KMS (aws-kms/lib/key.ts).      // resourceArns is used for principal policies, resourceSelfArns is used for resource policies.
      resourceSelfArns: ['*'],
    });
  }

  /**
   * Permits all DynamoDB operations ("dynamodb:*") to an IAM principal.
   *
   * Appropriate grants will also be added to the customer-managed KMS key
   * if one was configured.
   *
   * @param grantee The principal to grant access to
   */
  public fullAccess(grantee: iam.IGrantable) {
    this.encryptionKey?.grant(grantee, ...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS);
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions: ['dynamodb:*'],
      resourceArns: this.arns,
      resource: this.table,
      // Use wildcard for resource policy to avoid circular dependency when grantee is a resource principal
      // (e.g., AccountRootPrincipal). This follows the same pattern as KMS (aws-kms/lib/key.ts).      // resourceArns is used for principal policies, resourceSelfArns is used for resource policies.
      resourceSelfArns: ['*'],
    });
  }
}
