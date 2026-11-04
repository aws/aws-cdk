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
   * Resources that must be deployed before a StackSet that uses this template
   *
   * @internal
   */
  public _dependencies(): IDependable[] {
    return [];
  }
}

class StackSetStackTemplate extends StackSetTemplate {
  public readonly templateUrl: string;

  constructor(private readonly stack: StackSetStack) {
    super();
    this.templateUrl = stack._getTemplateUrl();
  }

  public _dependencies(): IDependable[] {
    return [this.stack._getAssetDeployments()];
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
   * Only deploy to accounts in an OU
   */
  NONE = 'NONE',
}

interface AccountFilterConfig {
  readonly accountFilterType: AccountFilterType;
  readonly accounts: string[];
}

/**
 * Refines which accounts to deploy stacks to by specifying how to use the accounts and organizational units together.
 *
 * `intersection()` deploys only to the listed accounts that are in the organizational units.
 * `difference()` deploys to every account in the organizational units except the listed ones.
 */
export abstract class StackSetAccountFilter {
  /**
   * Deploy only to the listed accounts that are in the organizational units
   *
   * With automatic deployments on, accounts that join the organizational units later also get
   * the stack, see `accountFilter`.
   *
   * @param accounts the AWS account IDs to deploy to
   */
  public static intersection(accounts: string[]): StackSetAccountFilter {
    return new AccountFilter('intersection', AccountFilterType.INTERSECTION, accounts);
  }

  /**
   * Deploy to every account in the organizational units except the listed ones
   *
   * @param accounts the AWS account IDs to skip
   */
  public static difference(accounts: string[]): StackSetAccountFilter {
    return new AccountFilter('difference', AccountFilterType.DIFFERENCE, accounts);
  }

  /**
   * Render the account filter
   *
   * @internal
   */
  public abstract _bind(): AccountFilterConfig;
}

class AccountFilter extends StackSetAccountFilter {
  constructor(factory: string, private readonly accountFilterType: AccountFilterType, private readonly accounts: string[]) {
    super();

    if (!Token.isUnresolved(accounts) && accounts.length === 0) {
      throw new UnscopedValidationError(lit`StackSetAccountFilterAccountsRequired`, `StackSetAccountFilter.${factory}() requires at least one account, omit 'accountFilter' to deploy to every account in the organizational units`);
    }
  }

  public _bind(): AccountFilterConfig {
    return { accountFilterType: this.accountFilterType, accounts: this.accounts };
  }
}

/**
 * Common options for deploying a StackSet to a target
 */
export interface StackSetTargetOptions {
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
export interface OrganizationsTargetOptions extends StackSetTargetOptions {
  /**
   * A list of organizational unit ids to deploy to. The StackSet will
   * deploy the provided Stack template to all accounts in the OU.
   * This can be further filtered by specifying `accountFilter`.
   *
   * If the service managed `deploymentType` has `autoDeployment` enabled (the default),
   * the StackSet will automatically deploy the Stack to new accounts as they
   * are added to the specified `organizationalUnits`
   */
  readonly organizationalUnits: string[];

  /**
   * Which accounts to deploy to, in combination with the organizational units
   *
   * Automatic deployments, on by default with `DeploymentType.serviceManaged()`, don't apply the
   * filter, so accounts that join the organizational units later get the stack even if the filter
   * leaves them out. Set `autoDeployEnabled: false` to deploy only to the accounts the filter selects.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html#stacksets-orgs-auto-deployment-considerations
   * @default - deploys to every account in the organizational units
   */
  readonly accountFilter?: StackSetAccountFilter;
}

/**
 * Options for deploying a StackSet to a list of AWS accounts
 */
export interface AccountsTargetOptions extends StackSetTargetOptions {
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
  readonly accountFilterType?: AccountFilterType;
  readonly regions: string[];
  readonly parameterOverrides?: Parameter[];
  readonly accounts?: string[];
  readonly organizationalUnits?: string[];
}

interface TargetBindOptions {}

/**
 * Which organizational units or accounts the stack set
 * should be deployed to.
 *
 * `fromAccounts` deploys the stack set to specific AWS accounts. Use it with a self managed StackSet.
 *
 * `fromOrganizationalUnits` deploys the stack set to specific organizational units. With an
 * `accountFilter` it can also filter the accounts in the
 * specified OUs. Use it with a service managed StackSet.
 */
export abstract class StackSetTarget {
  /**
   * Deploy the StackSet to a list of accounts
   *
   * Only a self managed StackSet (`DeploymentType.selfManaged()`) can use this target.
   *
   * @example
   * StackSetTarget.fromAccounts({
   *   accounts: ['111111111111', '222222222222'],
   *   regions: ['us-east-1', 'us-east-2'],
   * });
   */
  public static fromAccounts(options: AccountsTargetOptions): StackSetTarget {
    return new AccountsTarget(options);
  }

  /**
   * Deploy the StackSet to a list of AWS Organizations organizational units.
   *
   * You can optionally narrow the accounts with `accountFilter`.
   *
   * Only a service managed StackSet (`DeploymentType.serviceManaged()`) can use this target.
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
      accounts: this.options.accounts,
    };
  }
}

class OrganizationsTarget extends StackSetTarget {
  constructor(private readonly options: OrganizationsTargetOptions) {
    super();

    const organizationalUnits = this.options.organizationalUnits;
    if (organizationalUnits === undefined || (!Token.isUnresolved(organizationalUnits) && organizationalUnits.length === 0)) {
      throw new UnscopedValidationError(lit`StackSetOrganizationalUnitsRequired`, 'fromOrganizationalUnits requires at least one organizational unit');
    }
  }

  public _bind(_scope: Construct, _options: TargetBindOptions = {}): StackSetTargetConfig {
    const filter = this.options.accountFilter?._bind();
    return {
      regions: this.options.regions,
      parameterOverrides: this._renderParameters(this.options.parameterOverrides),
      accountFilterType: filter?.accountFilterType ?? AccountFilterType.NONE,
      organizationalUnits: this.options.organizationalUnits,
      accounts: filter?.accounts,
    };
  }
}

/**
 * Options for enabling automatic deployment of a service managed StackSet.
 */
export interface StackSetAutoDeploymentOptions {
  /**
   * Whether stacks are retained (not deleted) in AWS accounts that are removed
   * from a target organizational unit.
   *
   * Set this to `false` to delete the stack from an account when the account
   * is removed from the organizational unit.
   *
   * @default true
   */
  readonly retainStacksOnAccountRemoval?: boolean;
}

/**
 * Whether a service managed StackSet automatically deploys the Stack to AWS accounts
 * that are added to a target organizational unit.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-manage-auto-deployment.html
 */
export class StackSetAutoDeployment {
  /**
   * Automatically deploy the Stack to AWS accounts that are added to a target
   * organizational unit.
   *
   * By default the Stack is retained in accounts that are removed from the
   * organizational unit.
   */
  public static enabled(options: StackSetAutoDeploymentOptions = {}): StackSetAutoDeployment {
    return new StackSetAutoDeployment({
      enabled: true,
      retainStacksOnAccountRemoval: options.retainStacksOnAccountRemoval ?? true,
    });
  }

  /**
   * Do not deploy the Stack automatically to AWS accounts that are added to a
   * target organizational unit, or remove it from accounts that are removed.
   */
  public static disabled(): StackSetAutoDeployment {
    return new StackSetAutoDeployment({ enabled: false });
  }

  private constructor(private readonly config: CfnStackSet.AutoDeploymentProperty) { }

  /**
   * Render the CloudFormation auto-deployment configuration
   *
   * @internal
   */
  public _render(): CfnStackSet.AutoDeploymentProperty {
    return this.config;
  }
}

/**
 * The account a service managed StackSet is created and managed from.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-delegated-admin.html
 */
export class StackSetCallAs {
  /**
   * The StackSet is managed from a delegated administrator account.
   *
   * This is the default behavior.
   */
  public static readonly DELEGATED_ADMIN = new StackSetCallAs('DELEGATED_ADMIN');

  /**
   * The StackSet is managed from the AWS Organizations management account.
   */
  public static readonly SELF = new StackSetCallAs('SELF');

  /**
   * Use a custom call-as value
   *
   * @param value the custom value of the call-as option
   */
  public static of(value: string): StackSetCallAs {
    return new StackSetCallAs(value);
  }

  /**
   * @param value the value of the call-as option
   */
  private constructor(public readonly value: string) { }
}

/**
 * Options for StackSets that are managed by AWS Organizations.
 */
export interface ServiceManagedOptions {
  /**
   * Whether the StackSet automatically deploys the Stack to AWS accounts that are
   * added to a target organizational unit, and whether it retains the Stack in
   * accounts that are removed from it.
   *
   * This has no effect if {@link StackSetTarget.fromAccounts} is used
   *
   * @default - automatic deployment is enabled and stacks are retained in removed accounts
   */
  readonly autoDeployment?: StackSetAutoDeployment;

  /**
   * The account this StackSet is created and managed from.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-delegated-admin.html
   *
   * @default StackSetCallAs.DELEGATED_ADMIN
   */
  readonly callAs?: StackSetCallAs;
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
  readonly autoDeployment?: CfnStackSet.AutoDeploymentProperty;
  readonly callAs?: string;
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
   * Its targets must use `StackSetTarget.fromOrganizationalUnits()`.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html#stacksets-concepts-stackset-permission-models
   */
  public static serviceManaged(options: ServiceManagedOptions = {}): DeploymentType {
    return new ServiceManagedDeploymentType(options);
  }

  /**
   * StackSets deployed using the self managed model require you to create the necessary
   * IAM roles in the source and target AWS accounts and to setup the required IAM permissions.
   *
   * Using this model you can only deploy to AWS accounts that have the necessary IAM roles/permissions
   * pre-created.
   *
   * Its targets must use `StackSetTarget.fromAccounts()`.
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

class ServiceManagedDeploymentType extends DeploymentType {
  constructor(private readonly options?: ServiceManagedOptions) {
    super();
  }

  public _bind(_scope: Construct, _options: DeploymentTypeOptions = {}): DeploymentTypeConfig {
    return {
      permissionsModel: PermissionModel.SERVICE_MANAGED,
      autoDeployment: (this.options?.autoDeployment ?? StackSetAutoDeployment.enabled())._render(),
      callAs: (this.options?.callAs ?? StackSetCallAs.DELEGATED_ADMIN).value,
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
 * Preferences for how CloudFormation performs a StackSet operation across accounts and regions.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_StackSetOperationPreferences.html
 */
export interface OperationPreferences {
  /**
   * The number or percentage of accounts per Region this operation can fail in before
   * CloudFormation stops the operation in that Region.
   *
   * If the operation is stopped in a Region, CloudFormation doesn't attempt the operation in
   * any subsequent Regions.
   *
   * @default - the CloudFormation default failure tolerance
   */
  readonly failureTolerance?: StackSetFailureTolerance;
  /**
   * The maximum number or percentage of accounts in which to perform this operation at one time.
   *
   * This can depend on the value of `failureTolerance` depending on your `concurrencyMode`.
   * The maximum concurrent count is at most one more than the failure tolerance count if you're
   * using `StackSetConcurrencyMode.STRICT_FAILURE_TOLERANCE`.
   *
   * Note that this setting lets you specify the maximum for operations. For large deployments,
   * under certain circumstances the actual number of accounts acted upon concurrently may be
   * lower due to service throttling.
   *
   * @default - the CloudFormation default concurrency
   */
  readonly maxConcurrency?: StackSetMaxConcurrency;
  /**
   * Specifies how the concurrency level behaves during the operation execution.
   *
   * `StackSetConcurrencyMode.STRICT_FAILURE_TOLERANCE` dynamically lowers the concurrency level
   * to ensure the number of failed accounts never exceeds the failure tolerance count +1.
   * `StackSetConcurrencyMode.SOFT_FAILURE_TOLERANCE` decouples the failure tolerance from the
   * actual concurrency.
   *
   * @default - the CloudFormation default
   */
  readonly concurrencyMode?: StackSetConcurrencyMode;
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
 * The number or percentage of accounts per Region a StackSet operation can fail in before
 * CloudFormation stops the operation in that Region.
 */
export class StackSetFailureTolerance {
  /**
   * The number of accounts per Region this operation can fail in before CloudFormation stops
   * the operation in that Region.
   *
   * @param count the number of accounts, an integer greater than or equal to 0
   */
  public static count(count: number): StackSetFailureTolerance {
    if (!isIntegerInRange(count, 0)) {
      throw new UnscopedValidationError(lit`StackSetFailureToleranceCountInvalid`, `failure tolerance count must be an integer greater than or equal to 0, got ${JSON.stringify(count)}`);
    }
    return new StackSetFailureTolerance({ failureToleranceCount: count });
  }

  /**
   * The percentage of accounts per Region this stack operation can fail in before
   * CloudFormation stops the operation in that Region.
   *
   * @param percentage the percentage of accounts, an integer from 0 to 100
   */
  public static percentage(percentage: number): StackSetFailureTolerance {
    if (!isIntegerInRange(percentage, 0, 100)) {
      throw new UnscopedValidationError(lit`StackSetFailureTolerancePercentageInvalid`, `failure tolerance percentage must be an integer from 0 to 100, got ${JSON.stringify(percentage)}`);
    }
    return new StackSetFailureTolerance({ failureTolerancePercentage: percentage });
  }

  private constructor(
    private readonly properties: Pick<CfnStackSet.OperationPreferencesProperty, 'failureToleranceCount' | 'failureTolerancePercentage'>,
  ) {}

  /** @internal */
  public _render(): Pick<CfnStackSet.OperationPreferencesProperty, 'failureToleranceCount' | 'failureTolerancePercentage'> {
    return this.properties;
  }
}

/**
 * The maximum number or percentage of accounts in which to perform a StackSet operation at
 * one time.
 */
export class StackSetMaxConcurrency {
  /**
   * The maximum number of accounts in which to perform this operation at one time.
   *
   * @param count the number of accounts, an integer greater than or equal to 1
   */
  public static count(count: number): StackSetMaxConcurrency {
    if (!isIntegerInRange(count, 1)) {
      throw new UnscopedValidationError(lit`StackSetMaxConcurrencyCountInvalid`, `max concurrency count must be an integer greater than or equal to 1, got ${JSON.stringify(count)}`);
    }
    return new StackSetMaxConcurrency({ maxConcurrentCount: count });
  }

  /**
   * The maximum percentage of accounts in which to perform this operation at one time.
   *
   * @param percentage the percentage of accounts, an integer from 1 to 100
   */
  public static percentage(percentage: number): StackSetMaxConcurrency {
    if (!isIntegerInRange(percentage, 1, 100)) {
      throw new UnscopedValidationError(lit`StackSetMaxConcurrencyPercentageInvalid`, `max concurrency percentage must be an integer from 1 to 100, got ${JSON.stringify(percentage)}`);
    }
    return new StackSetMaxConcurrency({ maxConcurrentPercentage: percentage });
  }

  private constructor(
    private readonly properties: Pick<CfnStackSet.OperationPreferencesProperty, 'maxConcurrentCount' | 'maxConcurrentPercentage'>,
  ) {}

  /** @internal */
  public _render(): Pick<CfnStackSet.OperationPreferencesProperty, 'maxConcurrentCount' | 'maxConcurrentPercentage'> {
    return this.properties;
  }
}

/**
 * How the concurrency level behaves during the execution of a StackSet operation.
 */
export class StackSetConcurrencyMode {
  /**
   * Dynamically lowers the concurrency level to ensure the number of failed accounts never
   * exceeds the failure tolerance count +1.
   *
   * The initial actual concurrency is set to the lower of either the maximum concurrent count,
   * or the failure tolerance count +1. The actual concurrency is then reduced proportionally by
   * the number of failures. This is the default behavior.
   *
   * If failure tolerance or maximum concurrent accounts are set to percentages, the behavior is
   * similar.
   */
  public static readonly STRICT_FAILURE_TOLERANCE = new StackSetConcurrencyMode('STRICT_FAILURE_TOLERANCE');

  /**
   * Decouples the failure tolerance from the actual concurrency.
   *
   * This allows StackSet operations to run at the concurrency level set by the maximum
   * concurrency, regardless of the number of failures.
   */
  public static readonly SOFT_FAILURE_TOLERANCE = new StackSetConcurrencyMode('SOFT_FAILURE_TOLERANCE');

  /**
   * Use a custom concurrency mode
   *
   * @param value the CloudFormation value of the concurrency mode
   */
  public static of(value: string): StackSetConcurrencyMode {
    return new StackSetConcurrencyMode(value);
  }

  /**
   * @param value the CloudFormation value of the concurrency mode
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
}

class ImportedStackSet extends Resource implements IStackSet {
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
   * The imported StackSet has no `adminRole`.
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
   * The account and region of the imported StackSet are taken from the ARN. The imported StackSet has no `adminRole`.
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

  /**
   * The admin role that CloudFormation uses to perform StackSet operations.
   *
   * This is the `adminRole` passed to `DeploymentType.selfManaged()`, or the role the StackSet
   * creates when none is passed. It is `undefined` for a service managed StackSet.
   *
   * This role should only have permissions to be assumed by the CloudFormation service
   * and to assume the execution role in each individual account.
   *
   * When you create the execution role it must have an assume role policy statement which
   * allows `sts:AssumeRole` from this admin role.
   *
   * To grant specific users/groups access to use this role to deploy stacksets they must have
   * a policy that allows `iam:GetRole` & `iam:PassRole` on this role resource.
   */
  public readonly adminRole?: iam.IRole;

  private readonly stackInstances: CfnStackSet.StackInstancesProperty[] = [];

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

    const deploymentTypeConfig = (props.deploymentType ?? DeploymentType.selfManaged())._bind(this);
    if (deploymentTypeConfig.permissionsModel === PermissionModel.SELF_MANAGED) {
      this.adminRole = deploymentTypeConfig.adminRole ?? new iam.Role(this, 'AdminRole', {
        assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com', {
          conditions: this.adminRoleTrustConditions(),
        }),
      });

      this.adminRole.addToPrincipalPolicy(new iam.PolicyStatement({
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
      autoDeployment: deploymentTypeConfig.autoDeployment,
      executionRoleName: deploymentTypeConfig.executionRoleName,
      administrationRoleArn: this.adminRole?.roleArn,
      description: props.description,
      managedExecution: {
        Active: props.managedExecution ?? true,
      },
      operationPreferences: props.operationPreferences ? undefinedIfNoKeys({
        ...props.operationPreferences.failureTolerance?._render(),
        ...props.operationPreferences.maxConcurrency?._render(),
        concurrencyMode: props.operationPreferences.concurrencyMode?.value,
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

    if (this.adminRole) {
      stackSet.node.addDependency(this.adminRole);
    }

    // the file asset bucket deployment needs to complete before the stackset can deploy
    stackSet.node.addDependency(...props.template._dependencies());
  }

  public get stackSetRef(): StackSetReference {
    return this.resource.stackSetRef;
  }

  /**
   * Adds a target to the StackSet.
   *
   * @param target the target to add to the StackSet
   */
  @MethodMetadata()
  public addTarget(target: StackSetTarget) {
    const targetConfig = target._bind(this);

    if (this.permissionModel === PermissionModel.SELF_MANAGED && targetConfig.organizationalUnits !== undefined) {
      throw new ValidationError(lit`StackSetSelfManagedCannotHaveOrganizationalUnits`, `a self managed StackSet cannot deploy to organizational units ${JSON.stringify(targetConfig.organizationalUnits)}, set 'deploymentType: DeploymentType.serviceManaged' or use StackSetTarget.fromAccounts`, this);
    }
    if (this.permissionModel === PermissionModel.SERVICE_MANAGED && targetConfig.organizationalUnits === undefined) {
      throw new ValidationError(lit`StackSetServiceManagedRequiresOrganizationalUnits`, 'a service managed StackSet cannot deploy without organizational units, use StackSetTarget.fromOrganizationalUnits or set \'deploymentType: DeploymentType.selfManaged\'', this);
    }

    if (this.adminRole && iam.Role.isRole(this.adminRole)) {
      const disabledPrincipals: iam.IPrincipal[] = [];
      targetConfig.regions.forEach(region => {
        if (!Token.isUnresolved(region) && RegionInfo.get(region).isOptInRegion) {
          disabledPrincipals.push(new iam.ServicePrincipal(`cloudformation.${region}.amazonaws.com`));
        }
      });
      if (disabledPrincipals.length > 0) {
        this.adminRole.assumeRolePolicy?.addStatements(new iam.PolicyStatement({
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
        accountFilterType: targetConfig.accountFilterType,
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

/**
 * Whether a number is an integer within the given bounds, treating unresolved tokens as valid
 */
function isIntegerInRange(value: number, min: number, max?: number): boolean {
  if (Token.isUnresolved(value)) {
    return true;
  }
  return Number.isInteger(value) && value >= min && (max === undefined || value <= max);
}

function undefinedIfNoKeys<A extends Object>(obj: A): A | undefined {
  const allUndefined = Object.values(obj).every(val => val === undefined);
  return allUndefined ? undefined : obj;
}
