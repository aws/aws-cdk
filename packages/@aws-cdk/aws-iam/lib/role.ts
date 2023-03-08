import { ArnFormat, Duration, Resource, Stack, Token, TokenComparison, Aspects, Annotations } from '@aws-cdk/core';
import { getCustomizeRolesConfig, getPrecreatedRoleConfig, CUSTOMIZE_ROLES_CONTEXT_KEY, CustomizeRoleConfig } from '@aws-cdk/core/lib/helpers-internal';
import { Construct, IConstruct, DependencyGroup, Node } from 'constructs';
import { Grant } from './grant';
import { CfnRole } from './iam.generated';
import { IIdentity } from './identity-base';
import { IManagedPolicy, ManagedPolicy } from './managed-policy';
import { Policy } from './policy';
import { PolicyDocument } from './policy-document';
import { PolicyStatement } from './policy-statement';
import { AddToPrincipalPolicyResult, ArnPrincipal, IPrincipal, PrincipalPolicyFragment } from './principals';
import { defaultAddPrincipalToAssumeRole } from './private/assume-role-policy';
import { ImmutableRole } from './private/immutable-role';
import { ImportedRole } from './private/imported-role';
import { MutatingPolicyDocumentAdapter } from './private/policydoc-adapter';
import { PrecreatedRole } from './private/precreated-role';
import { AttachedPolicies, UniqueStringSet } from './private/util';

const MAX_INLINE_SIZE = 10000;
const MAX_MANAGEDPOL_SIZE = 6000;
const IAM_ROLE_SYMBOL = Symbol.for('@aws-cdk/packages/aws-iam/lib/role.Role');

/**
 * Properties for defining an IAM Role
 */
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
   * @deprecated see `externalIds`
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
   * for the role name.
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

  /**
   * A description of the role. It can be up to 1000 characters long.
   *
   * @default - No description.
   */
  readonly description?: string;
}

/**
 * Options allowing customizing the behavior of `Role.fromRoleArn`.
 */
export interface FromRoleArnOptions {
  /**
   * Whether the imported role can be modified by attaching policy resources to it.
   *
   * @default true
   */
  readonly mutable?: boolean;

  /**
   * For immutable roles: add grants to resources instead of dropping them
   *
   * If this is `false` or not specified, grant permissions added to this role are ignored.
   * It is your own responsibility to make sure the role has the required permissions.
   *
   * If this is `true`, any grant permissions will be added to the resource instead.
   *
   * @default false
   */
  readonly addGrantsToResources?: boolean;

  /**
   * Any policies created by this role will use this value as their ID, if specified.
   * Specify this if importing the same role in multiple stacks, and granting it
   * different permissions in at least two stacks. If this is not specified
   * (or if the same name is specified in more than one stack),
   * a CloudFormation issue will result in the policy created in whichever stack
   * is deployed last overwriting the policies created by the others.
   *
   * @default 'Policy'
   */
  readonly defaultPolicyName?: string;
}

/**
 * Options for customizing IAM role creation
 */
export interface CustomizeRolesOptions {
  /**
   * Whether or not to synthesize the resource into the CFN template.
   *
   * Set this to `false` if you still want to create the resources _and_
   * you also want to create the policy report.
   *
   * @default true
   */
  readonly preventSynthesis?: boolean;

  /**
   * A list of precreated IAM roles to substitute for roles
   * that CDK is creating.
   *
   * The constructPath can be either a relative or absolute path
   * from the scope that `customizeRoles` is used on to the role being created.
   *
   * For example, if you were creating a role
   *
   * @example
   * const stack = new Stack(app, 'MyStack');
   * new Role(stack, 'MyRole');
   *
   * Role.customizeRoles(stack, {
   *   usePrecreatedRoles: {
   *      // absolute path
   *     'MyStack/MyRole': 'my-precreated-role-name',
   *     // or relative path from `stack`
   *     'MyRole': 'my-precreated-role',
   *   },
   * });
   *
   * @default - there are no precreated roles. Synthesis will fail if `preventSynthesis=true`
   */
  readonly usePrecreatedRoles?: { [constructPath: string]: string };
}

/**
 * Options allowing customizing the behavior of `Role.fromRoleName`.
 */
export interface FromRoleNameOptions extends FromRoleArnOptions { }

/**
 * IAM Role
 *
 * Defines an IAM role. The role is created with an assume policy document associated with
 * the specified AWS service principal defined in `serviceAssumeRole`.
 */
export class Role extends Resource implements IRole {
  /**
   * Import an external role by ARN.
   *
   * If the imported Role ARN is a Token (such as a
   * `CfnParameter.valueAsString` or a `Fn.importValue()`) *and* the referenced
   * role has a `path` (like `arn:...:role/AdminRoles/Alice`), the
   * `roleName` property will not resolve to the correct value. Instead it
   * will resolve to the first path component. We unfortunately cannot express
   * the correct calculation of the full path name as a CloudFormation
   * expression. In this scenario the Role ARN should be supplied without the
   * `path` in order to resolve the correct role resource.
   *
   * @param scope construct scope
   * @param id construct id
   * @param roleArn the ARN of the role to import
   * @param options allow customizing the behavior of the returned role
   */
  public static fromRoleArn(scope: Construct, id: string, roleArn: string, options: FromRoleArnOptions = {}): IRole {
    const scopeStack = Stack.of(scope);
    const parsedArn = scopeStack.splitArn(roleArn, ArnFormat.SLASH_RESOURCE_NAME);
    const resourceName = parsedArn.resourceName!;
    const roleAccount = parsedArn.account;
    // service roles have an ARN like 'arn:aws:iam::<account>:role/service-role/<roleName>'
    // or 'arn:aws:iam::<account>:role/service-role/servicename.amazonaws.com/service-role/<roleName>'
    // we want to support these as well, so we just use the element after the last slash as role name
    const roleName = resourceName.split('/').pop()!;

    if (getCustomizeRolesConfig(scope).enabled) {
      return new PrecreatedRole(scope, id, {
        rolePath: `${scope.node.path}/${id}`,
        role: new ImportedRole(scope, `Import${id}`, {
          account: roleAccount,
          roleArn,
          roleName,
          ...options,
        }),
      });
    }

    if (options.addGrantsToResources !== undefined && options.mutable !== false) {
      throw new Error('\'addGrantsToResources\' can only be passed if \'mutable: false\'');
    }

    const roleArnAndScopeStackAccountComparison = Token.compareStrings(roleAccount ?? '', scopeStack.account);
    const equalOrAnyUnresolved = roleArnAndScopeStackAccountComparison === TokenComparison.SAME ||
      roleArnAndScopeStackAccountComparison === TokenComparison.BOTH_UNRESOLVED ||
      roleArnAndScopeStackAccountComparison === TokenComparison.ONE_UNRESOLVED;

    // if we are returning an immutable role then the 'importedRole' is just a throwaway construct
    // so give it a different id
    const mutableRoleId = (options.mutable !== false && equalOrAnyUnresolved) ? id : `MutableRole${id}`;
    const importedRole = new ImportedRole(scope, mutableRoleId, {
      roleArn,
      roleName,
      account: roleAccount,
      ...options,
    });


    // we only return an immutable Role if both accounts were explicitly provided, and different
    return options.mutable !== false && equalOrAnyUnresolved
      ? importedRole
      : new ImmutableRole(scope, id, importedRole, options.addGrantsToResources ?? false);
  }

  /**
    * Return whether the given object is a Role
   */
  public static isRole(x: any) : x is Role {
    return x !== null && typeof(x) === 'object' && IAM_ROLE_SYMBOL in x;
  }


  /**
   * Import an external role by name.
   *
   * The imported role is assumed to exist in the same account as the account
   * the scope's containing Stack is being deployed to.

   * @param scope construct scope
   * @param id construct id
   * @param roleName the name of the role to import
   * @param options allow customizing the behavior of the returned role
   */
  public static fromRoleName(scope: Construct, id: string, roleName: string, options: FromRoleNameOptions = {}) {
    return Role.fromRoleArn(scope, id, Stack.of(scope).formatArn({
      region: '',
      service: 'iam',
      resource: 'role',
      resourceName: roleName,
    }), options);
  }

  /**
   * Customize the creation of IAM roles within the given scope
   *
   * It is recommended that you **do not** use this method and instead allow
   * CDK to manage role creation. This should only be used
   * in environments where CDK applications are not allowed to created IAM roles.
   *
   * This can be used to prevent the CDK application from creating roles
   * within the given scope and instead replace the references to the roles with
   * precreated role names. A report will be synthesized in the cloud assembly (i.e. cdk.out)
   * that will contain the list of IAM roles that would have been created along with the
   * IAM policy statements that the role should contain. This report can then be used
   * to create the IAM roles outside of CDK and then the created role names can be provided
   * in `usePrecreatedRoles`.
   *
   * @example
   * declare const app: App;
   * Role.customizeRoles(app, {
   *   usePrecreatedRoles: {
   *     'ConstructPath/To/Role': 'my-precreated-role-name',
   *   },
   * });
   *
   * @param scope construct scope to customize role creation
   * @param options options for configuring role creation
   */
  public static customizeRoles(scope: Construct, options?: CustomizeRolesOptions): void {
    const preventSynthesis = options?.preventSynthesis ?? true;
    const useRoles: { [constructPath: string]: string } = {};
    for (const [constructPath, roleName] of Object.entries(options?.usePrecreatedRoles ?? {})) {
      const absPath = constructPath.startsWith(scope.node.path)
        ? constructPath
        : `${scope.node.path}/${constructPath}`;
      useRoles[absPath] = roleName;
    }
    scope.node.setContext(CUSTOMIZE_ROLES_CONTEXT_KEY, {
      preventSynthesis,
      usePrecreatedRoles: useRoles,
    });
  }

  public readonly grantPrincipal: IPrincipal = this;
  public readonly principalAccount: string | undefined = this.env.account;

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
  private readonly inlinePolicies: { [name: string]: PolicyDocument };
  private readonly dependables = new Map<PolicyStatement, DependencyGroup>();
  private immutableRole?: IRole;
  private _didSplit = false;
  private readonly _roleId?: string;

  private readonly _precreatedRole?: IRole;

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
    this.inlinePolicies = props.inlinePolicies || {};
    this.permissionsBoundary = props.permissionsBoundary;
    const maxSessionDuration = props.maxSessionDuration && props.maxSessionDuration.toSeconds();
    validateMaxSessionDuration(maxSessionDuration);
    const description = (props.description && props.description?.length > 0) ? props.description : undefined;

    if (description && description.length > 1000) {
      throw new Error('Role description must be no longer than 1000 characters.');
    }

    validateRolePath(props.path);

    const config = this.getPrecreatedRoleConfig();
    const roleArn = Stack.of(scope).formatArn({
      region: '',
      service: 'iam',
      resource: 'role',
      resourceName: config.precreatedRoleName,
    });
    const importedRole = new ImportedRole(this, 'Import'+id, {
      roleArn,
      roleName: config.precreatedRoleName ?? id,
      account: Stack.of(this).account,
    });
    this.roleName = importedRole.roleName;
    this.roleArn = importedRole.roleArn;
    if (config.enabled) {
      const role = new PrecreatedRole(this, 'PrecreatedRole'+id, {
        rolePath: this.node.path,
        role: importedRole,
        missing: !config.precreatedRoleName,
        assumeRolePolicy: this.assumeRolePolicy,
      });
      this.managedPolicies.forEach(policy => role.addManagedPolicy(policy));
      Object.entries(this.inlinePolicies).forEach(([name, policy]) => {
        role.attachInlinePolicy(new Policy(this, name, { document: policy }));
      });

      this._precreatedRole = role;
    }

    // synthesize the resource if preventSynthesis=false
    if (!config.preventSynthesis) {
      const role = new CfnRole(this, 'Resource', {
        assumeRolePolicyDocument: this.assumeRolePolicy as any,
        managedPolicyArns: UniqueStringSet.from(() => this.managedPolicies.map(p => p.managedPolicyArn)),
        policies: _flatten(this.inlinePolicies),
        path: props.path,
        permissionsBoundary: this.permissionsBoundary ? this.permissionsBoundary.managedPolicyArn : undefined,
        roleName: this.physicalName,
        maxSessionDuration,
        description,
      });

      this._roleId = role.attrRoleId;
      this.roleArn = this.getResourceArnAttribute(role.attrArn, {
        region: '', // IAM is global in each partition
        service: 'iam',
        resource: 'role',
        // Removes leading slash from path
        resourceName: `${props.path ? props.path.substr(props.path.charAt(0) === '/' ? 1 : 0) : ''}${this.physicalName}`,
      });
      this.roleName = this.getResourceNameAttribute(role.ref);
      Aspects.of(this).add({
        visit: (c) => {
          if (c === this) {
            this.splitLargePolicy();
          }
        },
      });
    }

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

    this.node.addValidation({ validate: () => this.validateRole() });
  }

  /**
   * Adds a permission to the role's default policy document.
   * If there is no default policy attached to this role, it will be created.
   * @param statement The permission statement to add to the policy document
   */
  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    if (this._precreatedRole) {
      return this._precreatedRole.addToPrincipalPolicy(statement);
    } else {
      if (!this.defaultPolicy) {
        this.defaultPolicy = new Policy(this, 'DefaultPolicy');
        this.attachInlinePolicy(this.defaultPolicy);
      }
      this.defaultPolicy.addStatements(statement);

      // We might split this statement off into a different policy, so we'll need to
      // late-bind the dependable.
      const policyDependable = new DependencyGroup();
      this.dependables.set(statement, policyDependable);

      return { statementAdded: true, policyDependable };
    }
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    if (this._precreatedRole) {
      return this._precreatedRole.addToPolicy(statement);
    } else {
      return this.addToPrincipalPolicy(statement).statementAdded;
    }
  }

  /**
   * Attaches a managed policy to this role.
   * @param policy The the managed policy to attach.
   */
  public addManagedPolicy(policy: IManagedPolicy) {
    if (this._precreatedRole) {
      return this._precreatedRole.addManagedPolicy(policy);
    } else {
      if (this.managedPolicies.find(mp => mp === policy)) { return; }
      this.managedPolicies.push(policy);
    }
  }

  /**
   * Attaches a policy to this role.
   * @param policy The policy to attach
   */
  public attachInlinePolicy(policy: Policy) {
    if (this._precreatedRole) {
      this._precreatedRole.attachInlinePolicy(policy);
    } else {
      this.attachedPolicies.attach(policy);
      policy.attachToRole(this);
    }
  }

  /**
   * Grant the actions defined in actions to the identity Principal on this resource.
   */
  public grant(grantee: IPrincipal, ...actions: string[]) {
    return Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.roleArn],
      scope: this,
    });
  }

  /**
   * Grant permissions to the given principal to pass this role.
   */
  public grantPassRole(identity: IPrincipal) {
    return this.grant(identity, 'iam:PassRole');
  }

  /**
   * Grant permissions to the given principal to assume this role.
   */
  public grantAssumeRole(identity: IPrincipal) {
    return this.grant(identity, 'sts:AssumeRole');
  }

  /**
   * Returns the stable and unique string identifying the role. For example,
   * AIDAJQABLZS4A3QDU576Q.
   *
   * @attribute
   */
  public get roleId(): string {
    if (!this._roleId) {
      throw new Error('"roleId" is not available on precreated roles');
    }
    return this._roleId;
  }

  /**
   * Return a copy of this Role object whose Policies will not be updated
   *
   * Use the object returned by this method if you want this Role to be used by
   * a construct without it automatically updating the Role's Policies.
   *
   * If you do, you are responsible for adding the correct statements to the
   * Role's policies yourself.
   */
  public withoutPolicyUpdates(options: WithoutPolicyUpdatesOptions = {}): IRole {
    if (!this.immutableRole) {
      this.immutableRole = new ImmutableRole(Node.of(this).scope as Construct, `ImmutableRole${this.node.id}`, this, options.addGrantsToResources ?? false);
    }

    return this.immutableRole;
  }

  private validateRole(): string[] {
    const errors = new Array<string>();
    errors.push(...this.assumeRolePolicy?.validateForResourcePolicy() ?? []);
    for (const policy of Object.values(this.inlinePolicies)) {
      errors.push(...policy.validateForIdentityPolicy());
    }

    return errors;
  }

  /**
   * Split large inline policies into managed policies
   *
   * This gets around the 10k bytes limit on role policies.
   */
  private splitLargePolicy() {
    if (!this.defaultPolicy || this._didSplit) {
      return;
    }
    this._didSplit = true;

    const self = this;
    const originalDoc = this.defaultPolicy.document;

    const splitOffDocs = originalDoc._splitDocument(this, MAX_INLINE_SIZE, MAX_MANAGEDPOL_SIZE);
    // Includes the "current" document

    const mpCount = this.managedPolicies.length + (splitOffDocs.size - 1);
    if (mpCount > 20) {
      Annotations.of(this).addWarning(`Policy too large: ${mpCount} exceeds the maximum of 20 managed policies attached to a Role`);
    } else if (mpCount > 10) {
      Annotations.of(this).addWarning(`Policy large: ${mpCount} exceeds 10 managed policies attached to a Role, this requires a quota increase`);
    }

    // Create the managed policies and fix up the dependencies
    markDeclaringConstruct(originalDoc, this.defaultPolicy);

    let i = 1;
    for (const newDoc of splitOffDocs.keys()) {
      if (newDoc === originalDoc) { continue; }

      const mp = new ManagedPolicy(this, `OverflowPolicy${i++}`, {
        description: `Part of the policies for ${this.node.path}`,
        document: newDoc,
        roles: [this],
      });
      markDeclaringConstruct(newDoc, mp);
    }

    /**
     * Update the Dependables for the statements in the given PolicyDocument to point to the actual declaring construct
     */
    function markDeclaringConstruct(doc: PolicyDocument, declaringConstruct: IConstruct) {
      for (const original of splitOffDocs.get(doc) ?? []) {
        self.dependables.get(original)?.add(declaringConstruct);
      }
    }
  }

  /**
   * Return configuration for precreated roles
   */
  private getPrecreatedRoleConfig(): CustomizeRoleConfig {
    return getPrecreatedRoleConfig(this);
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

  /**
   * Grant permissions to the given principal to assume this role.
   */
  grantAssumeRole(grantee: IPrincipal): Grant;
}

function createAssumeRolePolicy(principal: IPrincipal, externalIds: string[]) {
  const actualDoc = new PolicyDocument();

  // If requested, add externalIds to every statement added to this doc
  const addDoc = externalIds.length === 0
    ? actualDoc
    : new MutatingPolicyDocumentAdapter(actualDoc, (statement) => {
      statement.addCondition('StringEquals', {
        'sts:ExternalId': externalIds.length === 1 ? externalIds[0] : externalIds,
      });
      return statement;
    });

  defaultAddPrincipalToAssumeRole(principal, addDoc);

  return actualDoc;
}

function validateRolePath(path?: string) {
  if (path === undefined || Token.isUnresolved(path)) {
    return;
  }

  const validRolePath = /^(\/|\/[\u0021-\u007F]+\/)$/;

  if (path.length == 0 || path.length > 512) {
    throw new Error(`Role path must be between 1 and 512 characters. The provided role path is ${path.length} characters.`);
  } else if (!validRolePath.test(path)) {
    throw new Error(
      'Role path must be either a slash or valid characters (alphanumerics and symbols) surrounded by slashes. '
      + `Valid characters are unicode characters in [\\u0021-\\u007F]. However, ${path} is provided.`);
  }
}

function validateMaxSessionDuration(duration?: number) {
  if (duration === undefined) {
    return;
  }

  if (duration < 3600 || duration > 43200) {
    throw new Error(`maxSessionDuration is set to ${duration}, but must be >= 3600sec (1hr) and <= 43200sec (12hrs)`);
  }
}

/**
 * Options for the `withoutPolicyUpdates()` modifier of a Role
 */
export interface WithoutPolicyUpdatesOptions {
  /**
   * Add grants to resources instead of dropping them
   *
   * If this is `false` or not specified, grant permissions added to this role are ignored.
   * It is your own responsibility to make sure the role has the required permissions.
   *
   * If this is `true`, any grant permissions will be added to the resource instead.
   *
   * @default false
   */
  readonly addGrantsToResources?: boolean;
}

Object.defineProperty(Role.prototype, IAM_ROLE_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});