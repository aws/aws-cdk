import type { IConstruct } from 'constructs';
import type { ITableRef } from './dynamodb.generated';
import { CfnTable } from './dynamodb.generated';
import * as perms from './perms';
import type { IResourceWithPolicyV2, IResourcePolicyFactory } from '../../aws-iam';
import * as iam from '../../aws-iam';
import { DefaultPolicyFactories } from '../../aws-iam';
import { KeyGrants } from '../../aws-kms';
import type { ResourceEnvironment } from '../../core';
import { Stack, Token, ValidationError } from '../../core';
import { tryFindKmsKeyForTable } from '../../core/lib/helpers-internal/reflections';

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
   * @default - No permission is added to the KMS key, even if it exists
   */
  readonly encryptedResource?: iam.IEncryptedResource;

  /**
   * The resource with policy on which actions will be allowed
   *
   * @default - No resource policy is created
   */
  readonly policyResource?: iam.IResourceWithPolicyV2;
}

/**
 * A set of permissions to grant on a Table
 */
export class TableGrants {
  public static fromTable(table: ITableRef, regions?: string[], hasIndex?: boolean): TableGrants {
    return new TableGrants({
      table,
      encryptedResource: iam.EncryptedResources.of(table),
      policyResource: iam.ResourceWithPolicies.of(table),
      regions,
      hasIndex,
    });
  }

  private readonly table: ITableRef;
  private readonly arns: string[] = [];
  private readonly encryptedResource?: iam.IEncryptedResource;
  private readonly policyResource?: iam.IResourceWithPolicyV2;

  constructor(props: TableGrantsProps) {
    this.table = props.table;
    this.encryptedResource = props.encryptedResource;
    this.policyResource = props.policyResource;

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
}

export class TablePolicyFactory implements IResourcePolicyFactory {
  static {
    DefaultPolicyFactories.set('AWS::DynamoDB::Table', new TablePolicyFactory());
  }

  public fromConstruct(resource: IConstruct): IResourceWithPolicyV2 {
    if (!CfnTable.isCfnTable(resource)) {
      throw new ValidationError(`Construct ${resource.node.path} is not of type CfnTable`, resource);
    }

    return new CfnTableWithPolicy(resource);
  }
}

class CfnTableWithPolicy implements iam.IResourceWithPolicyV2 {
  public readonly env: ResourceEnvironment;

  constructor(private readonly table: CfnTable) {
    this.env = table.env;
  }

  addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    if (Token.isResolved(this.table.resourcePolicy)) {
      const current = this.table.resourcePolicy?.policyDocument ?? { Statement: [] };
      const policyDocument = iam.PolicyDocument.fromJson(current);
      policyDocument.addStatements(statement);
      this.table.resourcePolicy = {
        policyDocument: policyDocument.toJSON(),
      };

      return { statementAdded: true, policyDependable: this.table };
    }
    return { statementAdded: false };
  }
}

export class EncryptedTableFactory implements iam.IEncryptedResourceFactory {
  static {
    iam.DefaultEncryptedResourceFactories.set('AWS::DynamoDB::Table', new EncryptedTableFactory());
  }

  public fromConstruct(resource: IConstruct): iam.IEncryptedResource {
    if (!CfnTable.isCfnTable(resource)) {
      throw new ValidationError(`Construct ${resource.node.path} is not of type CfnTable`, resource);
    }
    return new EncryptedCfnTable(resource);
  }
}

class EncryptedCfnTable implements iam.IEncryptedResource {
  public readonly env: ResourceEnvironment;

  constructor(private readonly table: CfnTable) {
    this.env = table.env;
  }

  public grantOnKey(grantee: iam.IGrantable, ...actions: string[]): iam.GrantOnKeyResult {
    const key = tryFindKmsKeyForTable(this.table);
    return {
      grant: key ? KeyGrants.fromKey(key).actions(grantee, ...actions) : undefined,
    };
  }
}

