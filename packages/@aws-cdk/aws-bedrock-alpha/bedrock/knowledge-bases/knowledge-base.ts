import type { IResource } from 'aws-cdk-lib';
import { ArnFormat, Names, Resource, Stack } from 'aws-cdk-lib';
import type { IKnowledgeBaseRef, KnowledgeBaseReference } from 'aws-cdk-lib/aws-bedrock';
import { CfnKnowledgeBase } from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import { KnowledgeBaseReflection } from './knowledge-base-reflection';
import type { KnowledgeBaseType } from './knowledge-base-type';
import { GrantableRoles } from './private/grantable-roles';
import {
  createKnowledgeBaseServiceRole,
  knowledgeBaseArnFromId,
  validateKnowledgeBaseProps,
} from './private/knowledge-base-helpers';
import { KnowledgeBaseGrants } from '../../lib/bedrock-grants.generated';

const KNOWLEDGE_BASE_SYMBOL = Symbol.for('@aws-cdk/aws-bedrock-alpha.KnowledgeBase');

/**
 * Represents an Amazon Bedrock knowledge base of any type, either created
 * with the CDK or imported
 */
export interface IKnowledgeBase extends IResource, IKnowledgeBaseRef, iam.IGrantable {
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
   * Resolves the underlying `CfnKnowledgeBase` from the construct tree
   */
  readonly reflections: KnowledgeBaseReflection;

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
 * Properties for a knowledge base.
 */
export interface KnowledgeBaseProps {
  /**
   * The type of the knowledge base and its type-specific configuration.
   */
  readonly type: KnowledgeBaseType;

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
  public abstract readonly role?: iam.IRoleRef;
  public abstract readonly grantPrincipal: iam.IPrincipal;

  public get knowledgeBaseRef(): KnowledgeBaseReference {
    return {
      knowledgeBaseId: this.knowledgeBaseId,
      knowledgeBaseArn: this.knowledgeBaseArn,
    };
  }

  public get grants(): KnowledgeBaseGrants {
    return KnowledgeBaseGrants.fromKnowledgeBase(this);
  }

  public get reflections(): KnowledgeBaseReflection {
    return KnowledgeBaseReflection.of(this);
  }

  public addToRolePolicy(statement: iam.PolicyStatement): void {
    this.grantPrincipal.addToPrincipalPolicy(statement);
  }
}

/**
 * An Amazon Bedrock knowledge base.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html
 * @resource AWS::Bedrock::KnowledgeBase
 */
@propertyInjectable
export class KnowledgeBase extends KnowledgeBaseBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-alpha.KnowledgeBase';

  /**
   * Return whether the given object is a `KnowledgeBase`.
   */
  public static isKnowledgeBase(x: any): x is KnowledgeBase {
    return x !== null && typeof x === 'object' && KNOWLEDGE_BASE_SYMBOL in x;
  }

  /**
   * Reference an existing knowledge base by ARN.
   */
  public static fromKnowledgeBaseArn(scope: Construct, id: string, knowledgeBaseArn: string): IKnowledgeBase {
    return KnowledgeBase.fromKnowledgeBaseAttributes(scope, id, { knowledgeBaseArn });
  }

  /**
   * Reference an existing knowledge base by ID.
   *
   * The knowledge base is assumed to be in the same account and region as the scope.
   */
  public static fromKnowledgeBaseId(scope: Construct, id: string, knowledgeBaseId: string): IKnowledgeBase {
    return KnowledgeBase.fromKnowledgeBaseAttributes(scope, id, {
      knowledgeBaseArn: knowledgeBaseArnFromId(scope, knowledgeBaseId),
    });
  }

  /**
   * Reference an existing knowledge base by its attributes.
   */
  public static fromKnowledgeBaseAttributes(scope: Construct, id: string, attrs: KnowledgeBaseAttributes): IKnowledgeBase {
    class Import extends KnowledgeBaseBase {
      public readonly knowledgeBaseArn = attrs.knowledgeBaseArn;
      public readonly knowledgeBaseId = Stack.of(scope).splitArn(attrs.knowledgeBaseArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly role = attrs.role;
      public readonly grantPrincipal: iam.IPrincipal = attrs.role?.grantPrincipal ?? new iam.UnknownPrincipal({ resource: this });
    }

    return new Import(scope, id, { environmentFromArn: attrs.knowledgeBaseArn });
  }

  private readonly resource: CfnKnowledgeBase;

  /**
   * The service role that Amazon Bedrock assumes to operate the knowledge base.
   *
   * Always defined for knowledge bases created with this construct.
   */
  public readonly role?: iam.IRoleRef;
  public readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: KnowledgeBaseProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    Object.defineProperty(this, KNOWLEDGE_BASE_SYMBOL, { value: true });

    validateKnowledgeBaseProps(this, props);

    const role: iam.IRoleRef & iam.IGrantable = props.role ?? createKnowledgeBaseServiceRole(this);
    this.role = role;
    this.grantPrincipal = role.grantPrincipal;

    this.resource = new CfnKnowledgeBase(this, 'Resource', {
      name: props.knowledgeBaseName ?? Names.uniqueResourceName(this, { maxLength: 100 }),
      description: props.description,
      roleArn: role.roleRef.roleArn,
      knowledgeBaseConfiguration: { type: props.type._typeName },
      tags: props.tags,
    });
    // The type's mixins resolve the role from `roleArn` when applied, so it must be recorded first
    GrantableRoles.recordRoleRef(this.resource, role);

    for (const mixin of props.type._mixins) {
      this.with(mixin);
    }
  }

  @memoizedGetter
  public get knowledgeBaseArn(): string {
    return this.resource.attrKnowledgeBaseArn;
  }

  @memoizedGetter
  public get knowledgeBaseId(): string {
    return this.resource.ref;
  }
}
