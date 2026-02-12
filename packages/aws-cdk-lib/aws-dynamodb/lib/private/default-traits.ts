import type { IConstruct } from 'constructs';
import type {
  AddToResourcePolicyResult, GrantOnKeyResult,
  IEncryptedResource,
  IEncryptedResourceFactory, IGrantable,
  IResourcePolicyFactory,
  IResourceWithPolicyV2,
  PolicyStatement,
} from '../../../aws-iam';
import {
  DefaultEncryptedResourceFactories,
  DefaultPolicyFactories,
  PolicyDocument,
} from '../../../aws-iam';
import type { CfnKey } from '../../../aws-kms';
import { KeyGrants } from '../../../aws-kms';
import type { CfnResource, ResourceEnvironment } from '../../../core';
import { Token, ValidationError } from '../../../core';
import { findClosestRelatedResource, findL1FromRef } from '../../../core/lib/helpers-internal';
import { CfnTable } from '../dynamodb.generated';
import type { ITableRef } from '../dynamodb.generated';

/**
 * Factory for creating IResourceWithPolicyV2 instances from DynamoDB table constructs
 *
 * This factory is automatically registered with the DefaultPolicyFactories registry
 * for 'AWS::DynamoDB::Table' resources. It enables resource-based policies on DynamoDB
 * tables, allowing the IAM grant system to add policy statements directly to the table's
 * resource policy when appropriate.
 *
 * The factory converts `CfnTable` constructs into `IResourceWithPolicyV2` instances that
 * support resource policies. This enables grant methods to use resource-based policies
 * instead of only identity-based policies, which is useful for cross-account access
 * and service-to-service permissions.
 */
class TablePolicyFactory implements IResourcePolicyFactory {
  /**
   * Converts a DynamoDB table construct into an IResourceWithPolicyV2 that can be used
   * for adding resource-based policy statements.
   */
  public forResource(resource: CfnResource): IResourceWithPolicyV2 {
    if (!CfnTable.isCfnTable(resource)) {
      throw new ValidationError(`Construct ${resource.node.path} is not of type CfnTable`, resource);
    }

    return new CfnTableWithPolicy(resource);
  }
}

class CfnTableWithPolicy implements IResourceWithPolicyV2 {
  public readonly env: ResourceEnvironment;
  private policyDocument?: PolicyDocument;

  constructor(private readonly table: CfnTable) {
    this.env = table.env;
  }

  addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult {
    if (!this.policyDocument) {
      if (Token.isResolved(this.table.resourcePolicy)) {
        this.policyDocument = PolicyDocument.fromJson(this.table.resourcePolicy?.policyDocument ?? { Statement: [] });
      } else {
        // If the resource policy is not resolved, we cannot safely add statements to it
        return { statementAdded: false };
      }
    }

    this.policyDocument.addStatements(statement);
    this.table.resourcePolicy = {
      policyDocument: this.policyDocument.toJSON(),
    };

    return { statementAdded: true, policyDependable: this.table };
  }
}

/**
 * Factory for creating IEncryptedResource instances from DynamoDB table constructs
 *
 * This factory is automatically registered with the DefaultEncryptedResourceFactories
 * registry for 'AWS::DynamoDB::Table' resources. It enables the IAM grant system to
 * automatically discover and grant permissions on KMS keys associated with encrypted
 * DynamoDB tables.
 *
 * @remarks
 * The factory converts `CfnTable` constructs into `IEncryptedResource` instances that can
 * handle KMS key grants for table encryption. This is used internally by the CDK's
 * grant methods to automatically add necessary KMS permissions when granting DynamoDB
 * table access.
 */
class EncryptedTableFactory implements IEncryptedResourceFactory {
  public forResource(resource: CfnResource): IEncryptedResource {
    if (!CfnTable.isCfnTable(resource)) {
      throw new ValidationError(`Construct ${resource.node.path} is not of type CfnTable`, resource);
    }
    return new EncryptedCfnTable(resource);
  }
}

class EncryptedCfnTable implements IEncryptedResource {
  public readonly env: ResourceEnvironment;

  constructor(private readonly table: CfnTable) {
    this.env = table.env;
  }

  public grantOnKey(grantee: IGrantable, ...actions: string[]): GrantOnKeyResult {
    const key = tryFindKmsKeyForTable(this.table);
    return {
      grant: key ? KeyGrants.fromKey(key).actions(grantee, ...actions) : undefined,
    };
  }
}

function tryFindKmsKeyForTable(table: ITableRef): CfnKey | undefined {
  const cfnTable = tryFindTableConstruct(table);
  const kmsMasterKeyId = cfnTable?.sseSpecification &&
      (cfnTable.sseSpecification as CfnTable.SSESpecificationProperty).kmsMasterKeyId;
  if (!kmsMasterKeyId) {
    return undefined;
  }
  return findClosestRelatedResource<IConstruct, CfnKey>(
    table,
    'AWS::KMS::Key',
    (_, key) => key.ref === kmsMasterKeyId || key.attrKeyId === kmsMasterKeyId || key.attrArn === kmsMasterKeyId,
  );
}

function tryFindTableConstruct(table: ITableRef): CfnTable | undefined {
  return findL1FromRef<ITableRef, CfnTable>(
    table,
    'AWS::DynamoDB::Table',
    (cfn, ref) => ref.tableRef == cfn.tableRef,
  );
}

DefaultPolicyFactories.set('AWS::DynamoDB::Table', new TablePolicyFactory());
DefaultEncryptedResourceFactories.set('AWS::DynamoDB::Table', new EncryptedTableFactory());
