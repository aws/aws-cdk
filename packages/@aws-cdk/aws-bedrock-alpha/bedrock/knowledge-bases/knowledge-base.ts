import type { IResource } from 'aws-cdk-lib';
import { Resource } from 'aws-cdk-lib';
import type * as bedrock from 'aws-cdk-lib/aws-bedrock';
import type * as iam from 'aws-cdk-lib/aws-iam';
import { KnowledgeBaseGrants } from '../../lib/bedrock-grants.generated';

/**
 * The type of a knowledge base, which determines how its data is stored and queried.
 */
export enum KnowledgeBaseType {
  /**
   * Vector embeddings stored in a vector store.
   */
  VECTOR = 'VECTOR',

  /**
   * An Amazon Kendra GenAI index.
   */
  KENDRA = 'KENDRA',

  /**
   * A structured data store queried with SQL.
   */
  SQL = 'SQL',
}

/**
 * Represents an Amazon Bedrock knowledge base of any type, either created
 * with the CDK or imported
 */
export interface IKnowledgeBase extends IResource, bedrock.IKnowledgeBaseRef, iam.IGrantable {
  /**
   * The ARN of the knowledge base.
   *
   * @attribute
   */
  readonly knowledgeBaseArn: string;

  /**
   * The unique identifier of the knowledge base.
   *
   * @attribute
   */
  readonly knowledgeBaseId: string;

  /**
   * The status of the knowledge base.
   *
   * @attribute
   */
  readonly knowledgeBaseStatus?: string;

  /**
   * The reasons the last operation on the knowledge base failed, if any.
   *
   * @attribute
   */
  readonly knowledgeBaseFailureReasons?: string[];

  /**
   * The time the knowledge base was created.
   *
   * @attribute
   */
  readonly knowledgeBaseCreatedAt?: string;

  /**
   * The time the knowledge base was last updated.
   *
   * @attribute
   */
  readonly knowledgeBaseUpdatedAt?: string;

  /**
   * The type of the knowledge base.
   */
  readonly type: KnowledgeBaseType;

  /**
   * The service role that Amazon Bedrock assumes to operate the knowledge base.
   *
   * To add permissions to the role, use `addToRolePolicy()` or grant to the
   * knowledge base itself, which is an `IGrantable`.
   *
   * Undefined for imported knowledge bases whose role was not provided.
   */
  readonly role?: iam.IRoleRef;

  /**
   * Grant permissions on this knowledge base to IAM principals.
   */
  readonly grants: KnowledgeBaseGrants;

  /**
   * Adds a statement to the IAM policy of the knowledge base service role.
   *
   * For a referenced knowledge base whose role was not provided, the statement
   * cannot be applied; a warning is emitted with the statement to add to the
   * role manually.
   */
  addToRolePolicy(statement: iam.PolicyStatement): void;
}

/**
 * Properties common to knowledge bases of any type.
 */
export interface CommonKnowledgeBaseProps {
  /**
   * The name of the knowledge base.
   *
   * Must be 1-100 characters of letters, digits, hyphens and underscores, and
   * must not contain consecutive hyphens or underscores.
   *
   * @default - a unique name is generated
   */
  readonly knowledgeBaseName?: string;

  /**
   * A description of the knowledge base.
   *
   * Must be 1-200 characters.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The service role that Amazon Bedrock assumes to operate the knowledge base.
   *
   * The permissions the knowledge base needs to reach its data store and
   * models are granted to this role.
   *
   * @default - a new role is created, trusted by `bedrock.amazonaws.com` and
   * scoped to knowledge bases in this account
   */
  readonly role?: iam.IRoleRef & iam.IGrantable;

  /**
   * Tags to apply to the knowledge base.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Attributes for referencing an existing knowledge base.
 */
export interface KnowledgeBaseAttributes {
  /**
   * The ARN of the knowledge base.
   */
  readonly knowledgeBaseArn: string;

  /**
   * The service role of the knowledge base.
   *
   * @default - the role is unknown
   */
  readonly role?: iam.IRoleRef & iam.IGrantable;
}

/**
 * Base class for knowledge bases of any type, created or referenced.
 */
export abstract class KnowledgeBaseBase extends Resource implements IKnowledgeBase {
  public abstract readonly knowledgeBaseArn: string;
  public abstract readonly knowledgeBaseId: string;
  public abstract readonly knowledgeBaseStatus?: string;
  public abstract readonly knowledgeBaseFailureReasons?: string[];
  public abstract readonly knowledgeBaseCreatedAt?: string;
  public abstract readonly knowledgeBaseUpdatedAt?: string;
  public abstract readonly type: KnowledgeBaseType;
  public abstract readonly role?: iam.IRoleRef;
  public abstract readonly grantPrincipal: iam.IPrincipal;

  public get knowledgeBaseRef(): bedrock.KnowledgeBaseReference {
    return {
      knowledgeBaseId: this.knowledgeBaseId,
      knowledgeBaseArn: this.knowledgeBaseArn,
    };
  }

  public get grants(): KnowledgeBaseGrants {
    return KnowledgeBaseGrants.fromKnowledgeBase(this);
  }

  public addToRolePolicy(statement: iam.PolicyStatement): void {
    this.grantPrincipal.addToPrincipalPolicy(statement);
  }
}
