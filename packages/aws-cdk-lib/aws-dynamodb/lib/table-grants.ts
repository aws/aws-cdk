import type { ITableRef } from './dynamodb.generated';
import * as perms from './perms';
import * as iam from '../../aws-iam';
import { ArnFormat, Stack, ValidationError } from '../../core';

/**
 * Construction properties for TableGrants
 */
export interface TableGrantsProps {
  /**
   * The table to grant permissions on
   */
  readonly table: ITableRef;

  /**
   * Additional regions other than the main one that this table is replicated to
   *
   * @default - No regions
   */
  readonly regions?: string[];

  /**
   * Whether this table has indexes
   *
   * If so, permissions are granted on all table indexes as well.
   *
   * @default false
   */
  readonly hasIndex?: boolean;

  /**
   * The encrypted resource on which actions will be allowed
   *
   * @deprecated - Leave this field undefined. If the table is encrypted with a customer-managed KMS key, appropriate
   * grants to the key will be automatically added.
   *
   * @default - A best-effort attempt will be made to discover an associated KMS key and grant permissions to it.
   */
  readonly encryptedResource?: iam.IEncryptedResource;

  /**
   * The resource with policy on which actions will be allowed
   *
   * @deprecated - Leave this field undefined. A best-effort attempt will be made to discover a resource policy and add
   * permissions to it.
   *
   * @default - A best-effort attempt will be made to discover a resource policy and add permissions to it.
   */
  readonly policyResource?: iam.IResourceWithPolicyV2;
}

/**
 * A set of permissions to grant on a Table
 */
export class TableGrants {
  /**
   * Creates a TableGrants object for a given table.
   */
  public static fromTable(table: ITableRef, regions?: string[], hasIndex?: boolean): TableGrants {
    return new TableGrants({ table, regions, hasIndex });
  }

  private readonly table: ITableRef;
  private readonly arns: string[] = [];
  private readonly encryptedResource?: iam.IEncryptedResource;
  private readonly policyResource?: iam.IResourceWithPolicyV2;

  constructor(props: TableGrantsProps) {
    this.table = props.table;
    this.encryptedResource = props.encryptedResource ?? iam.EncryptedResources.of(this.table);
    this.policyResource = props.policyResource ?? iam.ResourceWithPolicies.of(this.table);

    const stack = Stack.of(this.table);

    this.arns = [
      this.table.tableRef.tableArn,
      ...(props.regions ?? []).map((region) => stack.formatArn({
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
    return this.policyResource ? iam.Grant.addToPrincipalOrResource({
      grantee,
      actions,
      resourceArns: this.arns,
      resource: this.policyResource,
      // Use wildcard for resource policy to avoid circular dependency when grantee is a resource principal
      // (e.g., AccountRootPrincipal). This follows the same pattern as KMS (aws-kms/lib/key.ts).
      // resourceArns is used for principal policies, resourceSelfArns is used for resource policies.
      resourceSelfArns: ['*'],
    }) : iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: this.arns,
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
    const actions = [...perms.RESOURCE_READ_DATA_ACTIONS, perms.DESCRIBE_TABLE];
    this.encryptedResource?.grantOnKey(grantee, ...perms.KEY_READ_ACTIONS);
    const result = this.actions(grantee, ...actions);

    return result.combine(iam.Grant.addToPrincipal({
      grantee,
      actions: perms.PRINCIPAL_ONLY_READ_DATA_ACTIONS,
      resourceArns: this.arns,
    }));
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
    const actions = [...perms.WRITE_DATA_ACTIONS, perms.DESCRIBE_TABLE];
    const result = this.actions(grantee, ...actions);
    this.encryptedResource?.grantOnKey(grantee, ...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS);
    return result;
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
    const actions = [...perms.RESOURCE_READ_DATA_ACTIONS, ...perms.WRITE_DATA_ACTIONS, perms.DESCRIBE_TABLE];
    const result = this.actions(grantee, ...actions);
    this.encryptedResource?.grantOnKey(grantee, ...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS);

    return result.combine(iam.Grant.addToPrincipal({
      grantee,
      actions: perms.PRINCIPAL_ONLY_READ_DATA_ACTIONS,
      resourceArns: this.arns,
    }));
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
    const actions = ['dynamodb:*'];
    const result = this.actions(grantee, ...actions);
    this.encryptedResource?.grantOnKey(grantee, ...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS);
    return result;
  }

  /**
   * Grants permissions for this table to act as a source for multi-account global table replication.
   *
   * @param destinationReplicaArn The ARN of the destination replica table in the other account
   */
  public multiAccountReplicationTo(destinationReplicaArn: string): void {
    if (!this.policyResource) {
      throw new ValidationError('Cannot grant multi-account replication permissions without a resource policy', this.table);
    }

    const stack = Stack.of(this.table);
    const arnComponents = stack.splitArn(destinationReplicaArn, ArnFormat.SLASH_RESOURCE_NAME);
    if (!arnComponents.account) {
      throw new ValidationError(`Invalid table ARN: ${destinationReplicaArn}. ARN must include account ID.`, this.table);
    }

    this.policyResource.addToResourcePolicy(new iam.PolicyStatement({
      sid: `AllowMultiAccountReplicaAssociation-${arnComponents.account}`,
      actions: ['dynamodb:AssociateTableReplica'],
      resources: ['*'],
      principals: [new iam.AccountPrincipal(arnComponents.account)],
    }));

    this.policyResource.addToResourcePolicy(new iam.PolicyStatement({
      sid: `AllowReplicationServiceReadWrite-${arnComponents.account}`,
      actions: perms.MULTI_ACCOUNT_REPLICATION_ACTIONS,
      resources: ['*'],
      principals: [new iam.ServicePrincipal('replication.dynamodb.amazonaws.com')],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': [stack.account, arnComponents.account],
        },
      },
    }));

    this.encryptedResource?.grantOnKey(
      new iam.ServicePrincipal('replication.dynamodb.amazonaws.com'),
      ...perms.KEY_READ_ACTIONS,
      ...perms.KEY_WRITE_ACTIONS,
    );
  }

  /**
   * Grants permissions for this table to act as a destination for multi-account global table replication.
   *
   * @param sourceReplicaArn The ARN of the source replica table in the other account
   */
  public multiAccountReplicationFrom(sourceReplicaArn: string): void {
    if (!this.policyResource) {
      throw new ValidationError('Cannot grant multi-account replication permissions without a resource policy', this.table);
    }

    const stack = Stack.of(this.table);
    const arnComponents = stack.splitArn(sourceReplicaArn, ArnFormat.SLASH_RESOURCE_NAME);
    if (!arnComponents.account) {
      throw new ValidationError(`Invalid table ARN: ${sourceReplicaArn}. ARN must include account ID.`, this.table);
    }

    this.policyResource.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AllowReplicationService',
      actions: perms.MULTI_ACCOUNT_REPLICATION_ACTIONS,
      resources: ['*'],
      principals: [new iam.ServicePrincipal('replication.dynamodb.amazonaws.com')],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': [stack.account, arnComponents.account],
        },
      },
    }));

    this.encryptedResource?.grantOnKey(
      new iam.ServicePrincipal('replication.dynamodb.amazonaws.com'),
      ...perms.KEY_READ_ACTIONS,
      ...perms.KEY_WRITE_ACTIONS,
    );
  }
}
