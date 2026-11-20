import * as crypto from 'crypto';
import * as fs from 'fs';
import { join } from 'path';
import type { Construct } from 'constructs';
import { Node } from 'constructs';
import { CfnStackSet } from './cloudformation.generated';
import { StackSetSynthesizer } from './private/stackset-synthesizer';
import * as iam from '../../aws-iam';
import type * as s3 from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import type { IResource, ISynthesisSession, RemovalPolicy, ResourceEnvironment } from '../../core';
import {
  Arn,
  ArnFormat,
  Aws,
  CfnCapabilities,
  CfnResource,
  FileAssetPackaging,
  Names,
  Resource,
  Stack,
  Token,
  UnscopedValidationError,
  ValidationError,
} from '../../core';
import type { IArrayBox, IBox, IMapBox } from '../../core/lib/helpers-internal';
import { Box, memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { noBoxStackTraces } from '../../core/lib/no-box-stack-traces';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import { undefinedIfAllValuesAreEmpty } from '../../core/lib/util';
import type { IStackSetRef, StackSetReference } from '../../interfaces/generated/aws-cloudformation-interfaces.generated';
import { RegionInfo } from '../../region-info';

/**
 * A StackSet template stored in S3 or local file
 */
export abstract class StackSetTemplate {
  /**
   * Uses a template that is already stored in Amazon S3
   *
   * @param url the S3 URL of the template
   * @returns StackSetTemplate
   */
  public static fromUrl(url: string): StackSetTemplate {
    return new StackSetUrlTemplate(url);
  }

  /**
   * Uses a local template file, uploaded as an asset of the StackSet's stack
   *
   * @param path the path to the template file
   * @param options options for the asset
   * @returns StackSetTemplate
   */
  public static fromAsset(path: string, options?: s3_assets.AssetOptions): StackSetTemplate {
    return new StackSetAssetTemplate(path, options);
  }

  /**
   * Binds the template to the StackSet that uses it
   *
   * @param scope the scope of the StackSet, in the stack that contains the StackSet
   * @param id the construct ID of the StackSet, prefixed to the IDs of constructs created in `scope`
   * @internal
   */
  public abstract _bind(scope: Construct, id: string): StackSetTemplateConfig;
}

/**
 * The result of binding a StackSetTemplate to a StackSet
 */
interface StackSetTemplateConfig {
  /**
   * The S3 URL of the template
   */
  readonly templateUrl: string;
}

class StackSetUrlTemplate extends StackSetTemplate {
  constructor(private readonly url: string) {
    super();
  }

  public _bind(_scope: Construct, _id: string): StackSetTemplateConfig {
    return { templateUrl: this.url };
  }
}

class StackSetAssetTemplate extends StackSetTemplate {
  constructor(private readonly path: string, private readonly options: s3_assets.AssetOptions = {}) {
    super();
  }

  public _bind(scope: Construct, id: string): StackSetTemplateConfig {
    const asset = new s3_assets.Asset(scope, `${id}.TemplateAsset`, {
      path: this.path,
      ...this.options,
    });
    return { templateUrl: asset.httpUrl };
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
    return new AccountFilter(AccountFilterType.INTERSECTION, accounts);
  }

  /**
   * Deploy to every account in the organizational units except the listed ones
   *
   * @param accounts the AWS account IDs to skip
   */
  public static difference(accounts: string[]): StackSetAccountFilter {
    return new AccountFilter(AccountFilterType.DIFFERENCE, accounts);
  }

  /**
   * Render the account filter
   *
   * @internal
   */
  public abstract _bind(): AccountFilterConfig;
}

class AccountFilter extends StackSetAccountFilter {
  constructor(private readonly accountFilterType: AccountFilterType, private readonly accounts: string[]) {
    super();

    if (!Token.isUnresolved(accounts) && accounts.length === 0) {
      throw new UnscopedValidationError(lit`StackSetAccountFilterAccountsRequired`, "StackSetAccountFilter requires at least one account, omit 'accountFilter' to deploy to every account in the organizational units");
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
   * At least one region is required.
   */
  readonly regions: string[];

  /**
   * Parameter overrides that should be applied to only this target
   *
   * @default - use the parameters specified in {@link StackSetProps.parameters}
   */
  readonly parameterOverrides?: { [key: string]: string };
}

/**
 * Options for deploying a StackSet to a set of Organizational Units (OUs)
 */
export interface OrganizationsTargetOptions extends StackSetTargetOptions {
  /**
   * The IDs of the organizational units (`ou-...`) or of the organization root (`r-...`) to
   * deploy to. The StackSet will deploy the provided Stack template to all accounts in the OU.
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
   * leaves them out. Set `autoDeployment: StackSetAutoDeployment.disabled()` to deploy only to the
   * accounts the filter selects.
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
   *   organizationalUnits: ['ou-a1b2-c3d4e5f6', 'ou-a1b2-f6e5d4c3'],
   * });
   */
  public static fromOrganizationalUnits(options: OrganizationsTargetOptions): StackSetTarget {
    return new OrganizationsTarget(options);
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

    if (isEmptyList(this.options.accounts)) {
      throw new UnscopedValidationError(lit`StackSetAccountsRequired`, 'fromAccounts requires at least one account, set `accounts` to the account IDs to deploy to');
    }
    if (isEmptyList(this.options.regions)) {
      throw new UnscopedValidationError(lit`StackSetRegionsRequired`, 'fromAccounts requires at least one region, set `regions` to the regions to deploy to');
    }
  }

  public _bind(_scope: Construct, _options: TargetBindOptions = {}): StackSetTargetConfig {
    return {
      regions: this.options.regions,
      parameterOverrides: renderParameters(this.options.parameterOverrides),
      accounts: this.options.accounts,
    };
  }
}

class OrganizationsTarget extends StackSetTarget {
  constructor(private readonly options: OrganizationsTargetOptions) {
    super();

    if (isEmptyList(this.options.organizationalUnits)) {
      throw new UnscopedValidationError(lit`StackSetOrganizationalUnitsRequired`, 'fromOrganizationalUnits requires at least one organizational unit, set `organizationalUnits` to the OUs to deploy to');
    }
    if (isEmptyList(this.options.regions)) {
      throw new UnscopedValidationError(lit`StackSetRegionsRequired`, 'fromOrganizationalUnits requires at least one region, set `regions` to the regions to deploy to');
    }
  }

  public _bind(_scope: Construct, _options: TargetBindOptions = {}): StackSetTargetConfig {
    const filter = this.options.accountFilter?._bind();
    return {
      regions: this.options.regions,
      parameterOverrides: renderParameters(this.options.parameterOverrides),
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
   * Applies only to service-managed organizational unit targets.
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
   * Each target becomes one group of stack instances. Use `addTarget()` to add more targets after
   * construction.
   *
   * @default - no targets
   */
  readonly targets?: StackSetTarget[];

  /**
   * If you already have an existing CloudFormation template that you would like to use, you can pass the template defined in S3 or a local file
   *
   * @default - the template will be generated from the resources added to this StackSet
   */
  readonly template?: StackSetTemplate;

  /**
   * The name of the stack set
   *
   * @default - a name generated from the construct path
   */
  readonly stackSetName?: string;

  /**
   * A description of the StackSet resource
   *
   * @default - none
   */
  readonly description?: string;

  /**
   * An array of Buckets can be passed to store assets, enabling StackSet Asset support
   *
   * One Bucket is required per target region. The name must be `${assetBucketPrefix}-<region>`, where
   * `<region>` is the region targeted by the StackSet.
   *
   * @default - No Buckets provided and Assets will not be supported.
   */
  readonly assetBuckets?: s3.IBucket[];

  /**
   * The common prefix for the asset bucket names used by this StackSet.
   *
   * Required if `assetBuckets` is provided.
   *
   * @default - No Buckets provided and Assets will not be supported.
   */
  readonly assetBucketPrefix?: string;

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
   * @default - the CloudFormation default
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

const STACK_SET_SYMBOL = Symbol.for('aws-cdk-lib.aws-cloudformation.StackSet');

/**
 * A CloudFormation StackSet, which deploys a template to multiple AWS accounts and regions
 *
 * A StackSet is a stack: the resources defined in it make up the template that is
 * deployed to the target accounts and regions. It is defined
 * within another stack (the host stack), which deploys the `AWS::CloudFormation::StackSet`
 * resource, its administration role, the template, and the file assets of the template.
 *
 * The template is always environment agnostic. `account` and `region` refer to the
 * accounts and regions the template is deployed to, while `env` and `stack` refer to the
 * StackSet resource in the host stack.
 *
 * Values from other stacks that the template references are passed to the template as
 * StackSet parameters. Other stacks can't reference the resources of the template.
 *
 * @resource AWS::CloudFormation::StackSet
 */
@propertyInjectable
@noBoxStackTraces
export class StackSet extends Stack implements IStackSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudformation.StackSet';

  /**
   * Checks if the provided object is of type `StackSet`.
   */
  public static isStackSet(x: any): x is StackSet {
    return x !== null && typeof x === 'object' && STACK_SET_SYMBOL in x;
  }

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

  /**
   * The file name of the synthesized template within the cloud assembly
   */
  public readonly templateFile: string;

  private readonly stackInstances: IArrayBox<CfnStackSet.StackInstancesProperty> = Box.fromArray();
  private readonly templateParameters: IMapBox<string, string> = Box.fromMap<string, string>();
  private readonly _templateUrl: IBox<string | undefined> = Box.fromValue<string | undefined>(undefined);
  private readonly hostStack: Stack;
  private readonly externalTemplate: boolean;
  private readonly userParameters: { [key: string]: string };
  private readonly permissionModel: PermissionModel;
  private readonly resource: CfnStackSet;

  /**
   * Creates a new StackSet.
   *
   * @param scope The scope in which to define this StackSet. Must be within a Stack.
   * @param id The ID of the StackSet.
   * @param props The properties of the StackSet.
   */
  constructor(scope: Construct, id: string, props: StackSetProps = {}) {
    const hostStack = findHostStack(scope);
    const synthesizer = new StackSetSynthesizer(props.assetBuckets, props.assetBucketPrefix);

    super(scope, id, {
      // The template is deployed to the accounts and regions targeted by the StackSet
      env: { account: Aws.ACCOUNT_ID, region: Aws.REGION },
      synthesizer,
      // With an external template, the StackSet's own template is never deployed, so it must
      // not get the AWS::CDK::Metadata resource that version reporting adds to every stack
      analyticsReporting: props.template ? false : undefined,
    });
    Object.defineProperty(this, STACK_SET_SYMBOL, { value: true });

    addConstructMetadata(this, props);

    this.hostStack = hostStack;
    this.externalTemplate = props.template !== undefined;
    this.userParameters = props.parameters ?? {};

    // this is the file name of the synthesized template file within the cloud assembly
    this.templateFile = `${Names.uniqueId(this)}.stackset.template.json`;

    // The host stack stages the file assets of the template, in the scope of this StackSet
    synthesizer.bindHost({ stack: hostStack, scope, id });

    const deploymentTypeConfig = (props.deploymentType ?? DeploymentType.selfManaged())._bind(this);

    if (props.capabilities?.includes(CfnCapabilities.AUTO_EXPAND) && deploymentTypeConfig.permissionsModel === PermissionModel.SERVICE_MANAGED) {
      throw new ValidationError(lit`StackSetAutoExpandNotSupported`, 'service managed stacksets do not currently support the "AUTO_EXPAND" capability', this);
    }

    if (deploymentTypeConfig.permissionsModel === PermissionModel.SELF_MANAGED) {
      this.adminRole = deploymentTypeConfig.adminRole ?? new iam.Role(scope, `${id}.AdminRole`, {
        assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com', {
          conditions: this.adminRoleTrustConditions(),
        }),
      });

      this.adminRole.addToPrincipalPolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sts:AssumeRole'],
        resources: [
          hostStack.formatArn({
            service: 'iam',
            region: '',
            account: '*',
            resource: 'role',
            resourceName: deploymentTypeConfig.executionRoleName ?? 'AWSCloudFormationStackSetExecutionRole',
          }),
        ],
      }));
    }

    this.permissionModel = deploymentTypeConfig.permissionsModel;

    for (const target of props.targets ?? []) {
      this.addTarget(target);
    }

    const stackSetName = props.stackSetName ?? Names.uniqueResourceName(this, { maxLength: 128 });
    const templateUrl = props.template
      ? props.template._bind(scope, id).templateUrl
      : this.templateUrl;

    const stackSet = new CfnStackSet(scope, `${id}.Resource`, {
      autoDeployment: deploymentTypeConfig.autoDeployment,
      executionRoleName: deploymentTypeConfig.executionRoleName,
      administrationRoleArn: this.adminRole?.roleArn,
      description: props.description,
      managedExecution: {
        Active: props.managedExecution ?? true,
      },
      operationPreferences: props.operationPreferences ? undefinedIfAllValuesAreEmpty({
        ...props.operationPreferences.failureTolerance?._render(),
        ...props.operationPreferences.maxConcurrency?._render(),
        concurrencyMode: props.operationPreferences.concurrencyMode?.value,
        regionConcurrencyType: props.operationPreferences.regionConcurrencyType?.value,
        regionOrder: props.operationPreferences.regionOrder,
      }) : undefined,
      stackSetName,
      capabilities: props.capabilities,
      permissionModel: deploymentTypeConfig.permissionsModel,
      callAs: deploymentTypeConfig.callAs,
      templateUrl,
      stackInstancesGroup: Token.asAny(this.stackInstances),
      parameters: Token.asAny(this.templateParameters.derive((templateParameters) => this.renderStackSetParameters(templateParameters))),
    });
    this.resource = stackSet;
    this.stackSetId = stackSet.attrStackSetId;
    this.node.defaultChild = stackSet;

    if (this.adminRole) {
      stackSet.node.addDependency(this.adminRole);
    }

    // the file asset bucket deployments need to complete before the stackset can deploy
    stackSet.node.addDependency(synthesizer.assetDeployments);

    if (this.externalTemplate) {
      this.node.addValidation({ validate: () => this.validateNoResources() });
    }
  }

  /**
   * The stack that contains this StackSet.
   */
  public get stack(): Stack {
    return this.hostStack;
  }

  /**
   * The URL of the template asset
   */
  @memoizedGetter
  private get templateUrl(): string {
    return Token.asString(this._templateUrl);
  }

  /**
   * The environment of the StackSet resource, i.e. of the stack that contains this StackSet.
   *
   * The template itself is environment agnostic, see `account` and `region`.
   */
  public get env(): ResourceEnvironment {
    return this.hostStack.env;
  }

  public get stackSetRef(): StackSetReference {
    return this.resource.stackSetRef;
  }

  /**
   * Applies the given removal policy to the StackSet resource.
   *
   * @param policy The removal policy
   */
  public applyRemovalPolicy(policy: RemovalPolicy): void {
    this.resource.applyRemovalPolicy(policy);
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
   * The StackSet resource deploys the template, so values from other stacks are passed as StackSet
   * parameters. Other stacks can't reference the resources of a StackSet, because its template is
   * deployed to many accounts and regions.
   *
   * @internal
   */
  public get _deployingResource(): CfnResource | undefined {
    return this.resource;
  }

  /**
   * @internal
   */
  public _setTemplateParameter(name: string, value: string): void {
    this.templateParameters.put(name, value);
  }

  /**
   * Not a true top-level stack: its annotations are reported by the host stack.
   *
   * @internal
   */
  public get _isTopLevelStack(): boolean {
    return false;
  }

  /**
   * Adds the template of this StackSet as an asset in the host stack and copies the tags of this StackSet
   *
   * @internal
   */
  public _prepareTemplateAsset(): CfnResource | undefined {
    // The tags of this StackSet are propagated by CloudFormation to the stack instances
    for (const [key, value] of Object.entries(this.tags.tagValues())) {
      this.resource.tags.setTag(key, value);
    }

    if (!this.externalTemplate && !this._templateUrl.get()) {
      const cfn = JSON.stringify(this._toCloudFormation());
      this._templateUrl.set(this.hostStack.synthesizer.addFileAsset({
        packaging: FileAssetPackaging.FILE,
        sourceHash: crypto.createHash('sha256').update(cfn).digest('hex'),
        fileName: this.templateFile,
        displayName: `${this.node.path} Template`,
      }).httpUrl);
    }

    return this.resource;
  }

  /**
   * Writes the template file
   *
   * @internal
   */
  public _synthesizeTemplate(session: ISynthesisSession): void {
    fs.writeFileSync(join(session.assembly.outdir, this.templateFile), JSON.stringify(this._toCloudFormation(), undefined, 2));
  }

  private renderStackSetParameters(templateParameters: ReadonlyMap<string, string>): CfnStackSet.ParameterProperty[] | undefined {
    const parameters: { [key: string]: string } = { ...this.userParameters };
    for (const [name, value] of templateParameters) {
      // the names of the parameters passed for references are logical IDs, which are tokens until resolved
      const parameterKey: string = this.resolve(name);
      if (parameterKey in this.userParameters) {
        throw new ValidationError(lit`StackSetParameterConflict`,
          `the parameter ${JSON.stringify(parameterKey)} is also passed for a reference of the template to another stack, rename the parameter`, this);
      }
      parameters[parameterKey] = value;
    }
    return Object.keys(parameters).length > 0 ? renderParameters(parameters) : undefined;
  }

  private validateNoResources(): string[] {
    const hasResources = this.node.findAll().some(c => c !== this && CfnResource.isCfnResource(c));
    return hasResources
      ? ['a StackSet with a \'template\' must not contain resources, define the resources in the StackSet or use the template, not both']
      : [];
  }

  /**
   * Confused deputy protection: CloudFormation may only assume the admin role on behalf of
   * StackSets in this account.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html
   */
  private adminRoleTrustConditions(): iam.Conditions {
    return {
      StringEquals: { 'aws:SourceAccount': this.hostStack.account },
      ArnLike: {
        'aws:SourceArn': this.hostStack.formatArn({
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

function renderParameters(parameters?: { [key: string]: string }): Parameter[] | undefined {
  if (!parameters) return undefined;
  const parameterList: Parameter[] = [];
  for (const [key, value] of Object.entries(parameters ?? {})) {
    parameterList.push({
      parameterKey: key,
      parameterValue: value,
    });
  }
  return parameterList;
}

/**
 * Whether a required list is missing or empty, treating an unresolved token list as not empty
 */
function isEmptyList(list: readonly any[] | undefined): boolean {
  return !list || (!Token.isUnresolved(list) && list.length === 0);
}

/**
 * Finds the stack that contains a StackSet
 */
function findHostStack(scope: Construct): Stack {
  const hostStack = Node.of(scope).scopes.reverse().find(s => Stack.isStack(s));
  if (!hostStack) {
    throw new ValidationError(lit`StackSetMustBeDefinedWithinStack`, 'a StackSet must be defined within the scope of a Stack', scope);
  }
  return hostStack as Stack;
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
