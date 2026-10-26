import type { Construct, IDependable } from 'constructs';
import { CfnStackSet } from './cloudformation.generated';
import type { StackSetStack } from './stackset-stack';
import * as iam from '../../aws-iam';
import type { IResource } from '../../core';
import {
  Arn,
  ArnFormat,
  CfnCapabilities,
  Lazy,
  Names,
  Resource,
  Stack,
  Token,
  UnscopedValidationError,
  ValidationError,
} from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IStackSetRef, StackSetReference } from '../../interfaces/generated/aws-cloudformation-interfaces.generated';
import { RegionInfo } from '../../region-info';

/**
 * Represents a StackSet CloudFormation template
 */
export abstract class StackSetTemplate {
  /**
   * Creates a StackSetTemplate from a StackSetStack
   *
   * @param stack the stack to use as the base for the stackset template
   * @returns StackSetTemplate
   */
  public static fromStackSetStack(stack: StackSetStack): StackSetTemplate {
    return new StackSetStackTemplate(stack);
  }

  /**
   * The S3 URL of the StackSet template
   */
  public abstract readonly templateUrl: string;

  /**
   * Bind the template to a StackSet that uses it
   *
   * @param _scope the StackSet
   * @returns the resources that must be deployed before the StackSet
   * @internal
   */
  public _bind(_scope: Construct): IDependable[] {
    return [];
  }
}

class StackSetStackTemplate extends StackSetTemplate {
  public readonly templateUrl: string;

  constructor(private readonly stack: StackSetStack) {
    super();
    this.templateUrl = stack._getTemplateUrl();
  }

  public _bind(scope: Construct): IDependable[] {
    return this.stack._bindStackSet(scope);
  }
}

/**
 * The type of StackSet account filter
 *
 * @internal
 */
enum AccountFilterType {
  /**
   * _Only_ deploys to specified accounts
   */
  INTERSECTION = 'INTERSECTION',

  /**
   * _Does not_ deploy to the specified accounts
   */
  DIFFERENCE = 'DIFFERENCE',

  /**
   * (default value) include both OUs and Accounts
   * Allows you to deploy to an OU _and_ specific accounts in a different OU
   */
  UNION = 'UNION',

  /**
   * Only deploy to accounts in an OU
   */
  NONE = 'NONE',
}

/**
 * Common options for deploying a StackSet to a target
 */
export interface TargetOptions {
  /**
   * A list of regions the Stack should be deployed to.
   *
   * If {@link StackSetProps.operationPreferences.regionOrder} is specified
   * then the StackSet will be deployed sequentially otherwise it will be
   * deployed to all regions in parallel.
   */
  readonly regions: string[];

  /**
   * Parameter overrides that should be applied to only this target
   *
   * @default - use parameter overrides specified in {@link StackSetProps.parameterOverrides}
   */
  readonly parameterOverrides?: { [key: string]: string };
}

/**
 * Options for deploying a StackSet to a set of Organizational Units (OUs)
 */
export interface OrganizationsTargetOptions extends TargetOptions {
  /**
   * A list of organizational unit ids to deploy to. The StackSet will
   * deploy the provided Stack template to all accounts in the OU.
   * This can be further filtered by specifying either `additionalAccounts`
   * or `excludeAccounts`.
   *
   * If the `deploymentType` is specified with `autoDeployEnabled` then
   * the StackSet will automatically deploy the Stack to new accounts as they
   * are added to the specified `organizationalUnits`
   */
  readonly organizationalUnits: string[];

  /**
   * A list of additional AWS accounts to deploy the StackSet to. This can be
   * used to deploy the StackSet to additional AWS accounts that exist in a
   * different OU than what has been provided in `organizationalUnits`
   *
   * @default - Stacks will only be deployed to accounts that exist in the
   * specified organizationalUnits
   */
  readonly additionalAccounts?: string[];

  /**
   * A list of AWS accounts to exclude from deploying the StackSet to. This can
   * be useful if there are accounts that exist in an OU that is provided in
   * `organizationalUnits`, but you do not want the StackSet to be deployed.
   *
   * @default - Stacks will be deployed to all accounts that exist in the OUs
   * specified in the organizationUnits property
   */
  readonly excludeAccounts?: string[];

  /**
   * A list of AWS accounts to intersect with the organizational units.
   * Only accounts that are BOTH in the specified OUs AND in this list
   * will have the StackSet deployed.
   *
   * @default - Stacks will be deployed to all accounts in the specified OUs
   */
  readonly intersectionAccounts?: string[];
}

/**
 * Options for deploying a StackSet to a list of AWS accounts
 */
export interface AccountsTargetOptions extends TargetOptions {
  /**
   * A list of AWS accounts to deploy the StackSet to
   */
  readonly accounts: string[];
}

interface Parameter {
  readonly parameterKey: string;
  readonly parameterValue: string;
}

interface StackSetTargetConfig {
  readonly accountFilterType: AccountFilterType;
  readonly regions: string[];
  readonly parameterOverrides?: Parameter[];
  readonly accounts?: string[];
  readonly organizationalUnits?: string[];
}

interface TargetBindOptions {}

/**
 * Which organizational units and/or accounts the stack set
 * should be deployed to.
 *
 * `fromAccounts` can be used to deploy the stack set to specific AWS accounts
 *
 * `fromOrganizationalUnits` can be used to deploy the stack set to specific organizational units
 * and optionally include additional accounts from other OUs, or exclude accounts from the specified
 * OUs
 *
 * @example
 * // deploy to specific accounts
 * StackSetTarget.fromAccounts({
 *   accounts: ['11111111111', '22222222222'],
 *   regions: ['us-east-1', 'us-east-2'],
 * });
 *
 * // deploy to OUs and 1 additional account
 * StackSetTarget.fromOrganizationalUnits({
 *   regions: ['us-east-1', 'us-east-2'],
 *   organizationalUnits: ['ou-1111111', 'ou-2222222'],
 *   additionalAccounts: ['33333333333'],
 * });
 *
 * // deploy to OUs but exclude 1 account
 * StackSetTarget.fromOrganizationalUnits({
 *   regions: ['us-east-1', 'us-east-2'],
 *   organizationalUnits: ['ou-1111111', 'ou-2222222'],
 *   excludeAccounts: ['11111111111'],
 * });
 */
export abstract class StackSetTarget {
  /**
   * Deploy the StackSet to a list of accounts
   *
   * @example
   * StackSetTarget.fromAccounts({
   *   accounts: ['11111111111', '22222222222'],
   *   regions: ['us-east-1', 'us-east-2'],
   * });
   */
  public static fromAccounts(options: AccountsTargetOptions): StackSetTarget {
    return new AccountsTarget(options);
  }

  /**
   * Deploy the StackSet to a list of AWS Organizations organizational units.
   *
   * You can optionally include/exclude individual AWS accounts.
   *
   * @example
   * StackSetTarget.fromOrganizationalUnits({
   *   regions: ['us-east-1', 'us-east-2'],
   *   organizationalUnits: ['ou-1111111', 'ou-2222222'],
   * });
   */
  public static fromOrganizationalUnits(options: OrganizationsTargetOptions): StackSetTarget {
    return new OrganizationsTarget(options);
  }

  /**
   * @internal
   */
  protected _renderParameters(parameters?: { [key: string]: string }): Parameter[] | undefined {
    if (!parameters) return undefined;
    const overrides: Parameter[] = [];
    for (const [key, value] of Object.entries(parameters ?? {})) {
      overrides.push({
        parameterKey: key,
        parameterValue: value,
      });
    }
    return overrides;
  }

  /**
   * Render the configuration for a StackSet target
   *
   * @internal
   */
  public abstract _bind(scope: Construct, options?: TargetBindOptions): StackSetTargetConfig;
}

class AccountsTarget extends StackSetTarget {
  constructor(private readonly options: AccountsTargetOptions) {
    super();

    if (!this.options.accounts || this.options.accounts.length === 0) {
      throw new UnscopedValidationError(lit`StackSetAccountsRequired`, 'fromAccounts requires at least one account');
    }
  }

  public _bind(_scope: Construct, _options: TargetBindOptions = {}): StackSetTargetConfig {
    return {
      regions: this.options.regions,
      parameterOverrides: this._renderParameters(this.options.parameterOverrides),
      accountFilterType: AccountFilterType.INTERSECTION,
      accounts: this.options.accounts,
    };
  }
}

class OrganizationsTarget extends StackSetTarget {
  private readonly additionalAccounts?: string[];
  private readonly excludeAccounts?: string[];
  private readonly intersectionAccounts?: string[];

  constructor(private readonly options: OrganizationsTargetOptions) {
    super();

    // Normalize empty arrays to undefined — empty arrays are truthy in JS
    // but CloudFormation requires at least one item for account lists.
    this.additionalAccounts = this.options.additionalAccounts?.length ? this.options.additionalAccounts : undefined;
    this.excludeAccounts = this.options.excludeAccounts?.length ? this.options.excludeAccounts : undefined;
    this.intersectionAccounts = this.options.intersectionAccounts?.length ? this.options.intersectionAccounts : undefined;

    const specified = [
      this.additionalAccounts,
      this.excludeAccounts,
      this.intersectionAccounts,
    ].filter(Boolean).length;
    if (specified > 1) {
      throw new UnscopedValidationError(lit`StackSetAccountFiltersMutuallyExclusive`, "specify at most one of 'additionalAccounts', 'excludeAccounts', or 'intersectionAccounts'");
    }
  }

  public _bind(_scope: Construct, _options: TargetBindOptions = {}): StackSetTargetConfig {
    const filterType = this.additionalAccounts ? AccountFilterType.UNION
      : this.excludeAccounts ? AccountFilterType.DIFFERENCE
        : this.intersectionAccounts ? AccountFilterType.INTERSECTION
          : AccountFilterType.NONE;
    return {
      regions: this.options.regions,
      parameterOverrides: this._renderParameters(this.options.parameterOverrides),
      accountFilterType: filterType,
      organizationalUnits: this.options.organizationalUnits,
      accounts: this.additionalAccounts ?? this.excludeAccounts ?? this.intersectionAccounts,
    };
  }
}

/**
 * Options for StackSets that are managed by AWS Organizations.
 */
export interface ServiceManagedOptions {
  /**
   * Whether or not the StackSet should automatically create/remove the Stack
   * from AWS accounts that are added/removed from an organizational unit.
   *
   * This has no effect if {@link StackSetTarget.fromAccounts} is used
   *
   * @default true
   */
  readonly autoDeployEnabled?: boolean;

  /**
   * Whether stacks should be removed from AWS accounts that are removed
   * from an organizational unit.
   *
   * By default the stack will be retained (not deleted)
   *
   * This has no effect if {@link StackSetTarget.fromAccounts} is used
   *
   * @default true
   */
  readonly autoDeployRetainStacks?: boolean;

  /**
   * Whether or not the account this StackSet is deployed from is the delegated admin account.
   *
   * Set this to `false` if you are using the AWS Organizations management account instead.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-delegated-admin.html
   *
   * @default true
   */
  readonly delegatedAdmin?: boolean;
}

/**
 * Options for StackSets that are not managed by AWS Organizations.
 */
export interface SelfManagedOptions {
  /**
   * The name of the stackset execution role that already exists in each target AWS account.
   * This role must be configured with a trust policy that allows `sts:AssumeRole` from the `adminRole`.
   *
   * In addition this role must have the necessary permissions to manage the resources created by the stackset.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html#stacksets-prereqs-accountsetup
   *
   * @default - AWSCloudFormationStackSetExecutionRole
   */
  readonly executionRoleName?: string;

  /**
   * The admin role that CloudFormation will use to perform stackset operations.
   * This role should only have permissions to be assumed by the CloudFormation service
   * and to assume the execution role in each individual account.
   *
   * When you create the execution role it must have an assume role policy statement which
   * allows `sts:AssumeRole` from this admin role.
   *
   * To grant specific users/groups access to use this role to deploy stacksets they must have
   * a policy that allows `iam:GetRole` & `iam:PassRole` on this role resource.
   *
   * @default - a default role will be created
   */
  readonly adminRole?: iam.IRole;
}

/**
 * The permission model for a StackSet
 *
 * @internal
 */
enum PermissionModel {
  SERVICE_MANAGED = 'SERVICE_MANAGED',
  SELF_MANAGED = 'SELF_MANAGED',
}

interface DeploymentTypeConfig {
  readonly permissionsModel: PermissionModel;
  readonly executionRoleName?: string;
  readonly adminRole?: iam.IRole;
  readonly autoDeployEnabled?: boolean;
  readonly autoDeployRetainStacks?: boolean;
  readonly callAs?: CallAs;
}

interface DeploymentTypeOptions {}

/**
 * The permission model a StackSet uses to deploy stack instances
 */
export abstract class DeploymentType {
  /**
   * StackSets deployed using service managed permissions allow you to deploy
   * StackSet instances to accounts within an AWS Organization. Using this module
   * AWS Organizations will handle creating the necessary IAM roles and setting up the
   * required permissions.
   *
   * This model also allows you to enable automated deployments which allows the StackSet
   * to be automatically deployed to new accounts that are added to your organization in the future.
   *
   * This model requires you to be operating in either the AWS Organizations management account
   * or the delegated administrator account
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html#stacksets-concepts-stackset-permission-models
   */
  public static serviceManaged(options: ServiceManagedOptions = {}): DeploymentType {
    return new ManagedDeploymentType(options);
  }

  /**
   * StackSets deployed using the self managed model require you to create the necessary
   * IAM roles in the source and target AWS accounts and to setup the required IAM permissions.
   *
   * Using this model you can only deploy to AWS accounts that have the necessary IAM roles/permissions
   * pre-created.
   */
  public static selfManaged(options: SelfManagedOptions = {}): DeploymentType {
    return new SelfDeploymentType(options);
  }

  /**
   * Render the deployment type config
   *
   * @internal
   */
  public abstract _bind(scope: Construct, options?: DeploymentTypeOptions): DeploymentTypeConfig;
}

class ManagedDeploymentType extends DeploymentType {
  constructor(private readonly options?: ServiceManagedOptions) {
    super();
  }

  public _bind(scope: Construct, _options: DeploymentTypeOptions = {}): DeploymentTypeConfig {
    const autoDeployEnabled = this.options?.autoDeployEnabled ?? true;
    if (!autoDeployEnabled && this.options?.autoDeployRetainStacks !== undefined) {
      throw new ValidationError(lit`StackSetAutoDeployRetainStacksRequiresAutoDeploy`, 'autoDeployRetainStacks only applies if autoDeploy is enabled', scope);
    }
    return {
      permissionsModel: PermissionModel.SERVICE_MANAGED,
      autoDeployEnabled,
      callAs: (this.options?.delegatedAdmin ?? true) ? CallAs.DELEGATED_ADMIN : CallAs.SELF,
      autoDeployRetainStacks: autoDeployEnabled ? (this.options?.autoDeployRetainStacks ?? true)
        : undefined,
    };
  }
}

class SelfDeploymentType extends DeploymentType {
  constructor(private readonly options?: SelfManagedOptions) {
    super();
  }

  public _bind(_scope: Construct, _options: DeploymentTypeOptions = {}): DeploymentTypeConfig {
    return {
      permissionsModel: PermissionModel.SELF_MANAGED,
      adminRole: this.options?.adminRole,
      executionRoleName: this.options?.executionRoleName,
    };
  }
}

/**
 * Properties for a StackSet
 */
export interface StackSetProps {
  /**
   * Which accounts/OUs and regions to deploy the StackSet to
   *
   * @default - no targets. You can use `addTarget()` after construction to add targets.
   */
  readonly target?: StackSetTarget;

  /**
   * The Stack that will be deployed to the target
   */
  readonly template: StackSetTemplate;

  /**
   * The name of the stack set
   *
   * @default - a name generated from the construct path
   */
  readonly stackSetName?: string;

  /**
   * An optional description to add to the StackSet
   *
   * @default - none
   */
  readonly description?: string;

  /**
   * The type of deployment for this StackSet. The deployment can either be managed by
   * AWS Organizations (i.e. DeploymentType.serviceManaged()) or by the AWS account that
   * the StackSet is deployed from.
   *
   * In order to use DeploymentType.serviceManaged() the account needs to either be the
   * organizations's management account or a delegated administrator account.
   *
   * @default DeploymentType.selfManaged()
   */
  readonly deploymentType?: DeploymentType;

  /**
   * If this is `true` then StackSets will perform non-conflicting operations concurrently
   * and queue any conflicting operations.
   *
   * This means that you can submit more than one operation per StackSet and they will be
   * executed concurrently. For example you can submit a single request that updates existing
   * stack instances *and* creates new stack instances. Any conflicting operations will be queued
   * for immediate processing once the conflict is resolved.
   *
   * @default true
   */
  readonly managedExecution?: boolean;

  /**
   * The operation preferences for the StackSet.
   *
   * This allows you to control how the StackSet is deployed
   * across the target accounts and regions.
   *
   * @default - the CloudFormation default operation preferences
   */
  readonly operationPreferences?: OperationPreferences;

  /**
   * The input parameters for the stack set template.
   *
   * @default - no parameters
   */
  readonly parameters?: { [key: string]: string };

  /**
   * Specify a list of capabilities required by your stackset.
   *
   * StackSets that contain certain functionality require an explicit acknowledgement
   * that the stack contains these capabilities.
   *
   * If you deploy a stack that requires certain capabilities and they are
   * not specified, the deployment will fail with a `InsufficientCapabilities` error.
   *
   * @default - no specific capabilities
   */
  readonly capabilities?: CfnCapabilities[];
}

/**
 * Indicates whether a service managed stackset is deployed from the
 * AWS Organizations management account or the delegated admin account
 *
 * @internal
 */
enum CallAs {
  /**
   * The StackSet is deployed from the Delegated Admin account
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-delegated-admin.html
   */
  DELEGATED_ADMIN = 'DELEGATED_ADMIN',

  /**
   * The StackSet is deployed from the Management account
   */
  SELF = 'SELF',
}

/**
 * Preferences for how CloudFormation performs a StackSet operation across accounts and regions.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_StackSetOperationPreferences.html
 */
export interface OperationPreferences {
  /**
   * The number of stack instances that can fail before the operation is considered failed.
   *
   * @default - the CloudFormation default failure tolerance
   */
  readonly failureToleranceCount?: number;
  /**
   * The percentage of stack instances that can fail before the operation is considered failed.
   *
   * @default - the CloudFormation default failure tolerance
   */
  readonly failureTolerancePercentage?: number;
  /**
   * The maximum number of stack instances that can be created or updated concurrently.
   *
   * @default - the CloudFormation default concurrency
   */
  readonly maxConcurrentCount?: number;
  /**
   * The maximum percentage of stack instances that can be created or updated concurrently.
   *
   * @default - the CloudFormation default concurrency
   */
  readonly maxConcurrentPercentage?: number;
  /**
   * Whether to deploy multiple regions sequentially or in parallel.
   *
   * @default RegionConcurrencyType.SEQUENTIAL
   */
  readonly regionConcurrencyType?: RegionConcurrencyType;
  /**
   * The order in which to deploy the stack instances to the regions.
   *
   * @default - CloudFormation chooses the region order
   */
  readonly regionOrder?: string[];
}

/**
 * The type of concurrency to use when deploying the StackSet to regions.
 */
export class RegionConcurrencyType {
  /**
   * Deploy the StackSet to regions sequentially in the order specified in
   * {@link OperationPreferences.regionOrder}.
   *
   * This is the default behavior.
   */
  public static readonly SEQUENTIAL = new RegionConcurrencyType('SEQUENTIAL');

  /**
   * Deploy the StackSet to all regions in parallel.
   */
  public static readonly PARALLEL = new RegionConcurrencyType('PARALLEL');

  /**
   * Use a custom region concurrency type
   *
   * @param value the CloudFormation value of the region concurrency type
   */
  public static of(value: string): RegionConcurrencyType {
    return new RegionConcurrencyType(value);
  }

  /**
   * @param value the CloudFormation value of the region concurrency type
   */
  private constructor(public readonly value: string) { }
}

/**
 * Represents a CloudFormation StackSet
 */
export interface IStackSet extends IResource, IStackSetRef {
  /**
   * The ID of the StackSet, in the form `<stack set name>:<unique ID>`.
   *
   * @attribute
   */
  readonly stackSetId: string;

  /**
   * Only available on self managed stacksets. `undefined` for service managed and imported StackSets.
   *
   * The admin role that CloudFormation will use to perform stackset operations.
   * This role should only have permissions to be assumed by the CloudFormation service
   * and to assume the execution role in each individual account.
   *
   * When you create the execution role it must have an assume role policy statement which
   * allows `sts:AssumeRole` from this admin role.
   *
   * To grant specific users/groups access to use this role to deploy stacksets they must have
   * a policy that allows `iam:GetRole` & `iam:PassRole` on this role resource.
   */
  readonly role?: iam.IRole;
}

class ImportedStackSet extends Resource implements IStackSet {
  public readonly role?: iam.IRole = undefined;

  constructor(scope: Construct, id: string, public readonly stackSetId: string, stackSetArn?: string) {
    super(scope, id, { environmentFromArn: stackSetArn });
  }

  public get stackSetRef(): StackSetReference {
    return { stackSetId: this.stackSetId };
  }
}

/**
 * A CloudFormation StackSet, which deploys a template to multiple AWS accounts and regions
 *
 * @resource AWS::CloudFormation::StackSet
 */
@propertyInjectable
export class StackSet extends Resource implements IStackSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudformation.StackSet';

  /**
   * Import an existing StackSet from its ID.
   *
   * The imported StackSet has no `role`.
   *
   * @param scope The parent creating construct
   * @param id The construct's name.
   * @param stackSetId The ID of the StackSet, in the form `<stack set name>:<unique ID>`.
   */
  public static fromStackSetId(scope: Construct, id: string, stackSetId: string): IStackSet {
    return new ImportedStackSet(scope, id, stackSetId);
  }

  /**
   * Import an existing StackSet from its ARN.
   *
   * The account and region of the imported StackSet are taken from the ARN. The imported StackSet has no `role`.
   *
   * @param scope The parent creating construct.
   * @param id The construct's name.
   * @param stackSetArn The ARN of the StackSet, in the form
   * `arn:<partition>:cloudformation:<region>:<account>:stackset/<stack set name>:<unique ID>`.
   */
  public static fromStackSetArn(scope: Construct, id: string, stackSetArn: string): IStackSet {
    return new ImportedStackSet(scope, id, Arn.extractResourceName(stackSetArn, 'stackset'), stackSetArn);
  }

  public readonly stackSetId: string;

  private readonly stackInstances: CfnStackSet.StackInstancesProperty[] = [];

  private readonly _role?: iam.IRole;
  private readonly permissionModel: PermissionModel;
  private readonly resource: CfnStackSet;

  /**
   * Creates a new StackSet.
   *
   * @param scope The scope in which to define this StackSet.
   * @param id The ID of the StackSet.
   * @param props The properties of the StackSet.
   */
  constructor(scope: Construct, id: string, props: StackSetProps) {
    super(scope, id, {
      physicalName: props.stackSetName ?? Lazy.string({ produce: () => Names.uniqueResourceName(this, {}) }),
    });

    addConstructMetadata(this, props);

    const templateDependencies = props.template._bind(this);
    const deploymentTypeConfig = (props.deploymentType ?? DeploymentType.selfManaged())._bind(this);
    if (deploymentTypeConfig.permissionsModel === PermissionModel.SELF_MANAGED) {
      this._role = deploymentTypeConfig.adminRole ?? new iam.Role(this, 'AdminRole', {
        assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com', {
          conditions: this.adminRoleTrustConditions(),
        }),
      });

      this._role.addToPrincipalPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sts:AssumeRole'],
        resources: [
          Stack.of(this).formatArn({
            service: 'iam',
            region: '',
            account: '*',
            resource: 'role',
            resourceName: deploymentTypeConfig.executionRoleName ?? 'AWSCloudFormationStackSetExecutionRole',
          }),
        ],
      }));
    }

    if (props.capabilities?.includes(CfnCapabilities.AUTO_EXPAND) && deploymentTypeConfig.permissionsModel === PermissionModel.SERVICE_MANAGED) {
      throw new ValidationError(lit`StackSetAutoExpandNotSupported`, 'service managed stacksets do not currently support the "AUTO_EXPAND" capability', this);
    }

    this.permissionModel = deploymentTypeConfig.permissionsModel;

    if (props.target) {
      this.addTarget(props.target);
    }
    const stackSet = new CfnStackSet(this, 'Resource', {
      autoDeployment: undefinedIfNoKeys({
        enabled: deploymentTypeConfig.autoDeployEnabled,
        retainStacksOnAccountRemoval: deploymentTypeConfig.autoDeployRetainStacks,
      }),
      executionRoleName: deploymentTypeConfig.executionRoleName,
      administrationRoleArn: this._role?.roleArn,
      description: props.description,
      managedExecution: {
        Active: props.managedExecution ?? true,
      },
      operationPreferences: props.operationPreferences ? undefinedIfNoKeys({
        failureToleranceCount: props.operationPreferences.failureToleranceCount,
        failureTolerancePercentage: props.operationPreferences.failureTolerancePercentage,
        maxConcurrentCount: props.operationPreferences.maxConcurrentCount,
        maxConcurrentPercentage: props.operationPreferences.maxConcurrentPercentage,
        regionConcurrencyType: props.operationPreferences.regionConcurrencyType?.value,
        regionOrder: props.operationPreferences.regionOrder,
      }) : undefined,
      stackSetName: this.physicalName,
      capabilities: props.capabilities,
      permissionModel: deploymentTypeConfig.permissionsModel,
      callAs: deploymentTypeConfig.callAs,
      templateUrl: props.template.templateUrl,
      stackInstancesGroup: Lazy.any({
        produce: () => {
          return this.stackInstances;
        },
      }),
      ...(props.parameters ? {
        parameters: Object.entries(props.parameters).map((entry) => {
          return {
            parameterKey: entry[0],
            parameterValue: entry[1],
          };
        }),
      } : {}),
    });
    this.resource = stackSet;
    this.stackSetId = stackSet.attrStackSetId;

    if (this._role) {
      stackSet.node.addDependency(this._role);
    }

    // the file asset bucket deployment needs to complete before the stackset can deploy
    stackSet.node.addDependency(...templateDependencies);
  }

  public get stackSetRef(): StackSetReference {
    return this.resource.stackSetRef;
  }

  public get role(): iam.IRole | undefined {
    return this._role;
  }

  /**
   * Adds a target to the StackSet.
   *
   * @param target the target to add to the StackSet
   */
  @MethodMetadata()
  public addTarget(target: StackSetTarget) {
    const targetConfig = target._bind(this);

    if (this._role && iam.Role.isRole(this._role)) {
      const disabledPrincipals: iam.IPrincipal[] = [];
      targetConfig.regions.forEach(region => {
        if (!Token.isUnresolved(region) && RegionInfo.get(region).isOptInRegion) {
          disabledPrincipals.push(new iam.ServicePrincipal(`cloudformation.${region}.amazonaws.com`));
        }
      });
      if (disabledPrincipals.length > 0) {
        this._role.assumeRolePolicy?.addStatements(new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['sts:AssumeRole'],
          principals: disabledPrincipals,
          conditions: this.adminRoleTrustConditions(),
        }));
      }
    }
    this.stackInstances.push({
      regions: targetConfig.regions,
      parameterOverrides: targetConfig.parameterOverrides,
      deploymentTargets: {
        accounts: targetConfig.accounts,
        accountFilterType: this.permissionModel === PermissionModel.SERVICE_MANAGED
          ? targetConfig.accountFilterType
          : undefined, // field not supported for self managed
        organizationalUnitIds: targetConfig.organizationalUnits,
      },
    });
  }

  /**
   * Confused deputy protection: CloudFormation may only assume the admin role on behalf of
   * StackSets in this account.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html
   */
  private adminRoleTrustConditions(): iam.Conditions {
    const stack = Stack.of(this);
    return {
      StringEquals: { 'aws:SourceAccount': stack.account },
      ArnLike: {
        'aws:SourceArn': stack.formatArn({
          service: 'cloudformation',
          region: '*',
          resource: 'stackset',
          resourceName: '*',
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
        }),
      },
    };
  }
}

function undefinedIfNoKeys<A extends Object>(obj: A): A | undefined {
  const allUndefined = Object.values(obj).every(val => val === undefined);
  return allUndefined ? undefined : obj;
}
