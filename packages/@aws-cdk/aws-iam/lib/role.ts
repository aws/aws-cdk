import { Construct, Duration, Lazy, Resource, Stack, Token } from '@aws-cdk/core';
import { Grant } from './grant';
import { CfnRole } from './iam.generated';
import { IIdentity } from './identity-base';
import { IManagedPolicy } from './managed-policy';
import { Policy, PolicyProps } from './policy';
import { PolicyDocument } from './policy-document';
import { PolicyStatement } from './policy-statement';
import { ArnPrincipal, IPrincipal, PrincipalPolicyFragment } from './principals';
import { AttachedPolicies } from './util';

export interface RoleProps {
  /**
   * The IAM principal (i.e. `new ServicePrincipal('sns.amazonaws.com')`)
   * which can assume this role.
   *
   * You can later modify the assume role policy document by accessing it via
   * the `assumeRolePolicy` property.
   */
  readonly assumedBy: IPrincipal;

  /**
   * ID that the role assumer needs to provide when assuming this role
   *
   * If the configured and provided external IDs do not match, the
   * AssumeRole operation will fail.
   *
   * @deprecated see {@link externalIds}
   *
   * @default No external ID required
   */
  readonly externalId?: string;

  /**
   * List of IDs that the role assumer needs to provide one of when assuming this role
   *
   * If the configured and provided external IDs do not match, the
   * AssumeRole operation will fail.
   *
   * @default No external ID required
   */
  readonly externalIds?: string[];

  /**
   * A list of managed policies associated with this role.
   *
   * You can add managed policies later using
   * `addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName(policyName))`.
   *
   * @default - No managed policies.
   */
  readonly managedPolicies?: IManagedPolicy[];

  /**
   * A list of named policies to inline into this role. These policies will be
   * created with the role, whereas those added by ``addToPolicy`` are added
   * using a separate CloudFormation resource (allowing a way around circular
   * dependencies that could otherwise be introduced).
   *
   * @default - No policy is inlined in the Role resource.
   */
  readonly inlinePolicies?: { [name: string]: PolicyDocument };

  /**
   * The path associated with this role. For information about IAM paths, see
   * Friendly Names and Paths in IAM User Guide.
   *
   * @default /
   */
  readonly path?: string;

  /**
   * AWS supports permissions boundaries for IAM entities (users or roles).
   * A permissions boundary is an advanced feature for using a managed policy
   * to set the maximum permissions that an identity-based policy can grant to
   * an IAM entity. An entity's permissions boundary allows it to perform only
   * the actions that are allowed by both its identity-based policies and its
   * permissions boundaries.
   *
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#cfn-iam-role-permissionsboundary
   * @link https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html
   *
   * @default - No permissions boundary.
   */
  readonly permissionsBoundary?: IManagedPolicy;

  /**
   * A name for the IAM role. For valid values, see the RoleName parameter for
   * the CreateRole action in the IAM API Reference.
   *
   * IMPORTANT: If you specify a name, you cannot perform updates that require
   * replacement of this resource. You can perform updates that require no or
   * some interruption. If you must replace the resource, specify a new name.
   *
   * If you specify a name, you must specify the CAPABILITY_NAMED_IAM value to
   * acknowledge your template's capabilities. For more information, see
   * Acknowledging IAM Resources in AWS CloudFormation Templates.
   *
   * @default - AWS CloudFormation generates a unique physical ID and uses that ID
   * for the group name.
   */
  readonly roleName?: string;

  /**
   * The maximum session duration that you want to set for the specified role.
   * This setting can have a value from 1 hour (3600sec) to 12 (43200sec) hours.
   *
   * Anyone who assumes the role from the AWS CLI or API can use the
   * DurationSeconds API parameter or the duration-seconds CLI parameter to
   * request a longer session. The MaxSessionDuration setting determines the
   * maximum duration that can be requested using the DurationSeconds
   * parameter.
   *
   * If users don't specify a value for the DurationSeconds parameter, their
   * security credentials are valid for one hour by default. This applies when
   * you use the AssumeRole* API operations or the assume-role* CLI operations
   * but does not apply when you use those operations to create a console URL.
   *
   * @link https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html
   *
   * @default Duration.hours(1)
   */
  readonly maxSessionDuration?: Duration;
}

/**
 * Options allowing customizing the behavior of {@link Role.fromRoleArn}.
 */
export interface FromRoleArnOptions {
  /**
   * Whether the imported role can be modified by attaching policy resources to it.
   *
   * @default true
   *
   * @experimental
   */
  readonly mutable?: boolean;
}

/**
 * IAM Role
 *
 * Defines an IAM role. The role is created with an assume policy document associated with
 * the specified AWS service principal defined in `serviceAssumeRole`.
 */
export class Role extends Resource implements IRole {
  /**
   * Imports an external role by ARN.
   *
   * @param scope construct scope
   * @param id construct id
   * @param roleArn the ARN of the role to import
   * @param options allow customizing the behavior of the returned role
   */
  public static fromRoleArn(scope: Construct, id: string, roleArn: string, options: FromRoleArnOptions = {}): IRole {
    const scopeStack = Stack.of(scope);
    const parsedArn = scopeStack.parseArn(roleArn);
    const roleName = parsedArn.resourceName!;

    abstract class Import extends Resource implements IRole {
      public readonly grantPrincipal: IPrincipal = this;
      public readonly assumeRoleAction: string = 'sts:AssumeRole';
      public readonly policyFragment = new ArnPrincipal(roleArn).policyFragment;
      public readonly roleArn = roleArn;
      public readonly roleName = roleName;

      public abstract addToPolicy(statement: PolicyStatement): boolean;

      public abstract attachInlinePolicy(policy: Policy): void;

      public abstract addPolicy(id: string, props?: PolicyProps): Policy | undefined;

      public addManagedPolicy(_policy: IManagedPolicy): void {
        // FIXME: Add warning that we're ignoring this
      }

      /**
       * Grant permissions to the given principal to pass this role.
       */
      public grantPassRole(identity: IPrincipal): Grant {
        return this.grant(identity, 'iam:PassRole');
      }

      /**
       * Grant the actions defined in actions to the identity Principal on this resource.
       */
      public grant(grantee: IPrincipal, ...actions: string[]): Grant {
        return Grant.addToPrincipal({
          grantee,
          actions,
          resourceArns: [this.roleArn],
          scope: this,
        });
      }
    }

    const roleAccount = parsedArn.account;

    class MutableImport extends Import {
      private readonly attachedPolicies = new AttachedPolicies();
      private defaultPolicy?: Policy;

      public addToPolicy(statement: PolicyStatement): boolean {
        if (!this.defaultPolicy) {
          this.defaultPolicy = new Policy(this, 'Policy');
          this.attachInlinePolicy(this.defaultPolicy);
        }
        this.defaultPolicy.addStatements(statement);
        return true;
      }

      public addPolicy(identifier: string, props?: PolicyProps): Policy | undefined {
        const policy = new Policy(this, identifier, props);
        this.attachInlinePolicy(policy);
        return policy;
      }

      public attachInlinePolicy(policy: Policy): void {
        const policyAccount = Stack.of(policy).account;

        if (accountsAreEqualOrOneIsUnresolved(policyAccount, roleAccount)) {
          this.attachedPolicies.attach(policy);
          policy.attachToRole(this);
        }
      }
    }

    class ImmutableImport extends Import {
      public addToPolicy(_statement: PolicyStatement): boolean {
        return false;
      }

      public addPolicy(_id: string, _props?: PolicyProps): Policy | undefined {
        return undefined;
      }

      public attachInlinePolicy(_policy: Policy): void {
        // do nothing
      }
    }

    const scopeAccount = scopeStack.account;

    return options.mutable !== false && accountsAreEqualOrOneIsUnresolved(scopeAccount, roleAccount)
      ? new MutableImport(scope, id)
      : new ImmutableImport(scope, id);

    function accountsAreEqualOrOneIsUnresolved(account1: string | undefined,
                                               account2: string | undefined): boolean {
      return Token.isUnresolved(account1) || Token.isUnresolved(account2) ||
        account1 === account2;
    }
  }

  public readonly grantPrincipal: IPrincipal = this;

  public readonly assumeRoleAction: string = 'sts:AssumeRole';

  /**
   * The assume role policy document associated with this role.
   */
  public readonly assumeRolePolicy?: PolicyDocument;

  /**
   * Returns the ARN of this role.
   */
  public readonly roleArn: string;

  /**
   * Returns the stable and unique string identifying the role. For example,
   * AIDAJQABLZS4A3QDU576Q.
   *
   * @attribute
   */
  public readonly roleId: string;

  /**
   * Returns the name of the role.
   */
  public readonly roleName: string;

  /**
   * Returns the role.
   */
  public readonly policyFragment: PrincipalPolicyFragment;

  /**
   * Returns the permissions boundary attached to this role
   */
  public readonly permissionsBoundary?: IManagedPolicy;

  private defaultPolicy?: Policy;
  private readonly managedPolicies: IManagedPolicy[] = [];
  private readonly attachedPolicies = new AttachedPolicies();

  constructor(scope: Construct, id: string, props: RoleProps) {
    super(scope, id, {
      physicalName: props.roleName,
    });

    const externalIds = props.externalIds || [];
    if (props.externalId) {
      externalIds.push(props.externalId);
    }

    this.assumeRolePolicy = createAssumeRolePolicy(props.assumedBy, externalIds);
    this.managedPolicies.push(...props.managedPolicies || []);
    this.permissionsBoundary = props.permissionsBoundary;
    const maxSessionDuration = props.maxSessionDuration && props.maxSessionDuration.toSeconds();
    validateMaxSessionDuration(maxSessionDuration);

    const role = new CfnRole(this, 'Resource', {
      assumeRolePolicyDocument: this.assumeRolePolicy as any,
      managedPolicyArns: Lazy.listValue({ produce: () => this.managedPolicies.map(p => p.managedPolicyArn) }, { omitEmpty: true }),
      policies: _flatten(props.inlinePolicies),
      path: props.path,
      permissionsBoundary: this.permissionsBoundary ? this.permissionsBoundary.managedPolicyArn : undefined,
      roleName: this.physicalName,
      maxSessionDuration,
    });

    this.roleId = role.attrRoleId;
    this.roleArn = this.getResourceArnAttribute(role.attrArn, {
      region: '', // IAM is global in each partition
      service: 'iam',
      resource: 'role',
      resourceName: this.physicalName,
    });
    this.roleName = this.getResourceNameAttribute(role.ref);
    this.policyFragment = new ArnPrincipal(this.roleArn).policyFragment;

    function _flatten(policies?: { [name: string]: PolicyDocument }) {
      if (policies == null || Object.keys(policies).length === 0) {
        return undefined;
      }
      const result = new Array<CfnRole.PolicyProperty>();
      for (const policyName of Object.keys(policies)) {
        const policyDocument = policies[policyName];
        result.push({ policyName, policyDocument });
      }
      return result;
    }
  }

  /**
   * Adds a permission to the role's default policy document.
   * If there is no default policy attached to this role, it will be created.
   * @param statement The permission statement to add to the policy document
   */
  public addToPolicy(statement: PolicyStatement): boolean {
    if (!this.defaultPolicy) {
      this.defaultPolicy = new Policy(this, 'DefaultPolicy');
      this.attachInlinePolicy(this.defaultPolicy);
    }
    this.defaultPolicy.addStatements(statement);
    return true;
  }

  /**
   * Attaches a managed policy to this role.
   * @param policy The the managed policy to attach.
   */
  public addManagedPolicy(policy: IManagedPolicy) {
    if (this.managedPolicies.find(mp => mp === policy)) { return; }
    this.managedPolicies.push(policy);
  }

  public addPolicy(id: string, props?: PolicyProps): Policy | undefined {
    const policy = new Policy(this, id, props);
    this.attachInlinePolicy(policy);
    return policy;
  }

  /**
   * Attaches a policy to this role.
   * @param policy The policy to attach
   */
  public attachInlinePolicy(policy: Policy) {
    this.attachedPolicies.attach(policy);
    policy.attachToRole(this);
  }

  /**
   * Grant the actions defined in actions to the identity Principal on this resource.
   */
  public grant(grantee: IPrincipal, ...actions: string[]) {
    return Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.roleArn],
      scope: this
    });
  }

  /**
   * Grant permissions to the given principal to pass this role.
   */
  public grantPassRole(identity: IPrincipal) {
    return this.grant(identity, 'iam:PassRole');
  }
}

/**
 * A Role object
 */
export interface IRole extends IIdentity {
  /**
   * Returns the ARN of this role.
   *
   * @attribute
   */
  readonly roleArn: string;

  /**
   * Returns the name of this role.
   *
   * @attribute
   */
  readonly roleName: string;

  /**
   * Grant the actions defined in actions to the identity Principal on this resource.
   */
  grant(grantee: IPrincipal, ...actions: string[]): Grant;

  /**
   * Grant permissions to the given principal to pass this role.
   */
  grantPassRole(grantee: IPrincipal): Grant;
}

function createAssumeRolePolicy(principal: IPrincipal, externalIds: string[]) {
  const statement = new PolicyStatement();
  statement.addPrincipals(principal);
  statement.addActions(principal.assumeRoleAction);

  if (externalIds.length) {
    statement.addCondition('StringEquals', { 'sts:ExternalId': externalIds.length === 1 ? externalIds[0] : externalIds });
  }

  const doc = new PolicyDocument();
  doc.addStatements(statement);
  return doc;
}

function validateMaxSessionDuration(duration?: number) {
  if (duration === undefined) {
    return;
  }

  if (duration < 3600 || duration > 43200) {
    throw new Error(`maxSessionDuration is set to ${duration}, but must be >= 3600sec (1hr) and <= 43200sec (12hrs)`);
  }
}
