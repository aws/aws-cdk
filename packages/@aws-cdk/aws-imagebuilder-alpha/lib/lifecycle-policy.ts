import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnLifecyclePolicy } from 'aws-cdk-lib/aws-imagebuilder';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import { IRecipeBase } from '../lib';

const LIFECYCLE_POLICY_SYMBOL = Symbol.for('@aws-cdk/aws-imagebuilder-alpha.LifecyclePolicy');

/**
 * An EC2 Image Builder Lifecycle Policy.
 */
export interface ILifecyclePolicy extends cdk.IResource {
  /**
   * The ARN of the lifecycle policy
   *
   * @attribute
   */
  readonly lifecyclePolicyArn: string;

  /**
   * The name of the lifecycle policy
   *
   * @attribute
   */
  readonly lifecyclePolicyName: string;

  /**
   * Grant custom actions to the given grantee for the lifecycle policy
   *
   * @param grantee - The principal
   * @param actions - The list of actions
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grants the default permissions for executing a lifecycle policy to the provided execution role.
   *
   * @param role - The execution role used for the lifecycle policy
   */
  grantDefaultExecutionRolePermissions(role: iam.IRole): void;

  /**
   * Grant read permissions to the given grantee for the lifecycle policy
   *
   * @param grantee - The principal
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;
}

/**
 * The action to perform on the resources which the policy applies to
 */
export enum LifecyclePolicyActionType {
  /**
   * Indicates that the rule should delete the resource when it is applied
   */
  DELETE = 'DELETE',
  /**
   * Indicates that the rule should deprecate the resource when it is applied
   */
  DEPRECATE = 'DEPRECATE',
  /**
   * Indicates that the rule should disable the resource when it is applied
   */
  DISABLE = 'DISABLE',
}

/**
 * The status of the lifecycle policy, indicating whether it will run
 */
export enum LifecyclePolicyStatus {
  /**
   * Indicates that the lifecycle policy should be enabled
   */
  ENABLED = 'ENABLED',

  /**
   * Indicates that the lifecycle policy should be disabled
   */
  DISABLED = 'DISABLED',
}

/**
 * The resource type which the lifecycle policy is applied to
 */
export enum LifecyclePolicyResourceType {
  /**
   * Indicates the policy applies to AMI-based images
   */
  AMI_IMAGE = 'AMI_IMAGE',

  /**
   * Indicates the policy applies to container images
   */
  CONTAINER_IMAGE = 'CONTAINER_IMAGE',
}

/**
 * The action to perform in the lifecycle policy rule
 */
export interface LifecyclePolicyAction {
  /**
   * The action to perform on the resources selected in the lifecycle policy rule
   */
  readonly type: LifecyclePolicyActionType;

  /**
   * Whether to include AMIs in the scope of the lifecycle rule
   *
   * @default true for AMI-based policies, false otherwise
   */
  readonly includeAmis?: boolean;

  /**
   * Whether to include containers in the scope of the lifecycle rule
   *
   * @default true for container-based policies, false otherwise
   */
  readonly includeContainers?: boolean;

  /**
   * Whether to include snapshots in the scope of the lifecycle rule
   *
   * @default true for AMI-based policies, false otherwise
   */
  readonly includeSnapshots?: boolean;
}

/**
 * The resource filter to apply in the lifecycle policy rule
 */
export interface LifecyclePolicyFilter {
  /**
   * For age-based filters, the minimum age of the resource. The provided duration will be rounded up to the nearest
   * day/week/month/year value.
   *
   * @default None if a count filter is provided. Otherwise, at least one age or count filter must be provided
   */
  readonly age?: cdk.Duration;

  /**
   * For count-based filters, the minimum number of resources to keep on hand
   *
   * @default None if an age filter is provided. Otherwise, at least one age or count filter must be provided
   */
  readonly count?: number;

  /**
   * For age-based filters, the number of EC2 Image Builder images to keep on hand once the rule is applied.
   *
   * @default 0
   */
  readonly retainAtLeast?: number;
}

/**
 * The rules to apply for excluding EC2 Image Builder images from the lifecycle policy rule
 */
export interface LifecyclePolicyImageExclusionRules {
  /**
   * Excludes EC2 Image Builder images with any of the provided tags from the lifecycle policy rule
   */
  readonly tags: { [key: string]: string };
}

/**
 * The rules to apply for excluding AMIs from the lifecycle policy rule
 */
export interface LifecyclePolicyAmiExclusionRules {
  /**
   * Excludes public AMIs from the lifecycle policy rule if true
   *
   * @default false
   */
  readonly isPublic?: boolean;

  /**
   * Excludes AMIs which were launched from within the provided duration
   *
   * @default None
   */
  readonly lastLaunched?: cdk.Duration;

  /**
   * Excludes AMIs which reside in any of the provided regions
   *
   * @default None
   */
  readonly regions?: string[];

  /**
   * Excludes AMIs which are shared with any of the provided shared accounts
   *
   * @default None
   */
  readonly sharedAccounts?: string[];

  /**
   * Excludes AMIs which have any of the provided tags applied to it
   *
   * @default None
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Configuration details for the lifecycle policy rules
 */
export interface LifecyclePolicyDetail {
  /**
   * The action to perform in the lifecycle policy rule
   */
  readonly action: LifecyclePolicyAction;

  /**
   * The resource filter to apply in the lifecycle policy rule
   */
  readonly filter: LifecyclePolicyFilter;

  /**
   * The rules to apply for excluding EC2 Image Builder images from the lifecycle policy rule
   *
   * @default No exclusion rules are applied on the image
   */
  readonly imageExclusionRules?: LifecyclePolicyImageExclusionRules;

  /**
   * The rules to apply for excluding AMIs from the lifecycle policy rule
   *
   * @default No exclusion rules are applied on the AMI
   */
  readonly amiExclusionRules?: LifecyclePolicyAmiExclusionRules;
}

/**
 * Selection criteria for the resources that the lifecycle policy applies to
 */
export interface LifecyclePolicyResourceSelection {
  /**
   * The list of image recipes or container recipes to apply the lifecycle policy to
   *
   * @default None if tag selections are provided. Otherwise, at least one recipe or tag selection must be provided
   */
  readonly recipes?: IRecipeBase[];

  /**
   * Selects EC2 Image Builder images containing any of the provided tags
   *
   * @default None if recipe selections are provided. Otherwise, at least one recipe or tag selection must be provided
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Properties for creating a Lifecycle Policy resource
 */
export interface LifecyclePolicyProps {
  /**
   * The type of Image Builder resource that the lifecycle policy applies to.
   */
  readonly resourceType: LifecyclePolicyResourceType;

  /**
   * Configuration details for the lifecycle policy rules.
   */
  readonly details: LifecyclePolicyDetail[];

  /**
   * Selection criteria for the resources that the lifecycle policy applies to.
   */
  readonly resourceSelection: LifecyclePolicyResourceSelection;

  /**
   * The name of the lifecycle policy.
   *
   * @default A name is generated
   */
  readonly lifecyclePolicyName?: string;

  /**
   * The description of the lifecycle policy.
   *
   * @default None
   */
  readonly description?: string;

  /**
   * The status of the lifecycle policy.
   *
   * @default LifecyclePolicyStatus.ENABLED
   */
  readonly status?: LifecyclePolicyStatus;

  /**
   * The execution role that grants Image Builder access to run lifecycle actions.
   *
   * By default, an execution role will be created with the minimal permissions needed to execute the lifecycle policy
   * actions.
   *
   * @default An execution role will be generated
   */
  readonly executionRole?: iam.IRole;

  /**
   * The tags to apply to the lifecycle policy
   *
   * @default None
   */
  readonly tags?: { [key: string]: string };
}

abstract class LifecyclePolicyBase extends cdk.Resource implements ILifecyclePolicy {
  abstract readonly lifecyclePolicyArn: string;
  abstract readonly lifecyclePolicyName: string;

  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.lifecyclePolicyArn],
      scope: this,
    });
  }

  public grantDefaultExecutionRolePermissions(role: iam.IRole): void {
    const lifecycleExecutionPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      'service-role/EC2ImageBuilderLifecycleExecutionPolicy',
    );
    role.addManagedPolicy(lifecycleExecutionPolicy);
  }

  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'imagebuilder:GetLifecyclePolicy');
  }
}

/**
 * Represents an EC2 Image Builder Infrastructure Configuration.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/manage-image-lifecycles.html
 */
@propertyInjectable
export class LifecyclePolicy extends LifecyclePolicyBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-imagebuilder-alpha.InfrastructureConfiguration';

  /**
   * Import an existing lifecycle policy given its ARN.
   */
  public static fromLifecyclePolicyArn(scope: Construct, id: string, lifecyclePolicyArn: string): ILifecyclePolicy {
    const lifecyclePolicyName = cdk.Stack.of(scope).splitArn(
      lifecyclePolicyArn,
      cdk.ArnFormat.SLASH_RESOURCE_NAME,
    ).resourceName!;

    class Import extends LifecyclePolicyBase {
      public readonly lifecyclePolicyArn = lifecyclePolicyArn;
      public readonly lifecyclePolicyName = lifecyclePolicyName;
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing lifecycle policy given its name. If the name is a token representing a dynamic CloudFormation
   * expression, you must ensure all alphabetic characters in the expression are already lowercased
   */
  public static fromLifecyclePolicyName(scope: Construct, id: string, lifecyclePolicyName: string): ILifecyclePolicy {
    return LifecyclePolicy.fromLifecyclePolicyArn(
      scope,
      id,
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        resource: 'lifecycle-policy',
        resourceName: lifecyclePolicyName,
      }),
    );
  }

  /**
   * Return whether the given object is a LifecyclePolicy.
   */
  public static isLifecyclePolicy(x: any): x is LifecyclePolicy {
    return x !== null && typeof x === 'object' && LIFECYCLE_POLICY_SYMBOL in x;
  }

  /**
   * The ARN of the lifecycle policy
   */
  public readonly lifecyclePolicyArn: string;

  /**
   * The name of the lifecycle policy
   */
  public readonly lifecyclePolicyName: string;

  /**
   * The execution role used for lifecycle policy executions
   */
  public readonly executionRole: iam.IRole;

  public constructor(scope: Construct, id: string, props: LifecyclePolicyProps) {
    super(scope, id, {
      physicalName:
        props.lifecyclePolicyName ??
        cdk.Lazy.string({
          produce: () =>
            cdk.Names.uniqueResourceName(this, {
              maxLength: 128,
              separator: '-',
              allowedSpecialCharacters: '-',
            }).toLowerCase(),
        }),
    });

    Object.defineProperty(this, LIFECYCLE_POLICY_SYMBOL, { value: true });

    this.validatePolicy(props);

    this.executionRole = (() => {
      if (props.executionRole !== undefined) {
        return props.executionRole;
      }

      const role = new iam.Role(this, 'ExecutionRole', {
        assumedBy: new iam.ServicePrincipal('imagebuilder.amazonaws.com'),
      });
      this.grantDefaultExecutionRolePermissions(role);

      return role;
    })();

    const recipes: CfnLifecyclePolicy.RecipeSelectionProperty[] | undefined = props.resourceSelection.recipes?.map(
      (recipe): CfnLifecyclePolicy.RecipeSelectionProperty => {
        if (recipe._isImageRecipe()) {
          if (props.resourceType === LifecyclePolicyResourceType.CONTAINER_IMAGE) {
            throw new cdk.ValidationError(
              `recipes in the resource selection must all be container recipes for policy type ${LifecyclePolicyResourceType.CONTAINER_IMAGE}`,
              this,
            );
          }

          return {
            name: recipe.imageRecipeName,
            semanticVersion: recipe.imageRecipeVersion,
          };
        }

        if (recipe._isContainerRecipe()) {
          if (props.resourceType === LifecyclePolicyResourceType.AMI_IMAGE) {
            throw new cdk.ValidationError(
              `recipes in the resource selection must all be image recipes for policy type ${LifecyclePolicyResourceType.CONTAINER_IMAGE}`,
              this,
            );
          }

          return {
            name: recipe.containerRecipeName,
            semanticVersion: recipe.containerRecipeVersion,
          };
        }

        throw new cdk.ValidationError(
          'recipes in the resource selection must either be an IImageRecipe or IContainerRecipe',
          this,
        );
      },
    );

    const lifecyclePolicy = new CfnLifecyclePolicy(this, 'Resource', {
      name: this.physicalName,
      description: props.description,
      resourceType: props.resourceType,
      executionRole: this.executionRole.roleArn,
      policyDetails: this.buildPolicyDetails(props),
      resourceSelection: {
        recipes: recipes,
        tagMap: props.resourceSelection.tags,
      },
      status: props.status,
      tags: props.tags,
    });

    this.lifecyclePolicyName = this.getResourceNameAttribute(lifecyclePolicy.ref);
    this.lifecyclePolicyArn = this.getResourceArnAttribute(lifecyclePolicy.attrArn, {
      service: 'imagebuilder',
      resource: 'lifecycle-policy',
      resourceName: this.physicalName,
    });
  }

  /**
   * Generates the policy details property into the `PolicyDetail` type in the CloudFormation L1 definition.
   *
   * @param props The props passed as input to the construct
   * @private
   */
  private buildPolicyDetails(props: LifecyclePolicyProps): CfnLifecyclePolicy.PolicyDetailProperty[] {
    return props.details.map((detail): CfnLifecyclePolicy.PolicyDetailProperty => {
      const action = this.buildAction(props, detail);
      const exclusionRules = this.buildExclusionRules(detail);

      this.validatePolicyDetailAction(props, detail.action, exclusionRules?.amis);
      this.validatePolicyDetailFilter(detail.filter);

      return {
        action: action,
        filter: {
          retainAtLeast: detail.filter.retainAtLeast,
          type: detail.filter.age !== undefined ? 'AGE' : 'COUNT',
          ...(detail.filter.age !== undefined
            ? this.convertDurationToTimeUnitValue(detail.filter.age)
            : { value: detail.filter.count! }),
        },
        ...(exclusionRules !== undefined && { exclusionRules }),
      };
    });
  }

  /**
   * Generates the exclusion rules property into the `ExclusionRules` type in the CloudFormation L1 definition.
   *
   * @param detail The lifecycle policy detail where the exclusion rules are
   * @private
   */
  private buildExclusionRules(detail: LifecyclePolicyDetail): CfnLifecyclePolicy.ExclusionRulesProperty | undefined {
    const amiExclusionRules: CfnLifecyclePolicy.AmiExclusionRulesProperty = {
      ...(detail.amiExclusionRules?.isPublic && { isPublic: detail.amiExclusionRules.isPublic }),
      ...(detail.amiExclusionRules?.lastLaunched !== undefined && {
        lastLaunched: this.convertDurationToTimeUnitValue(detail.amiExclusionRules.lastLaunched, 365),
      }),
      ...(detail.amiExclusionRules?.regions?.length && { regions: detail.amiExclusionRules.regions }),
      ...(detail.amiExclusionRules?.sharedAccounts?.length && {
        sharedAccounts: detail.amiExclusionRules.sharedAccounts,
      }),
      ...(Object.keys(detail.amiExclusionRules?.tags ?? {}).length && { tagMap: detail.amiExclusionRules!.tags }),
    };

    const exclusionRules: CfnLifecyclePolicy.ExclusionRulesProperty = {
      ...(Object.keys(amiExclusionRules).length && { amis: amiExclusionRules }),
      ...(detail.imageExclusionRules !== undefined && { tagMap: detail.imageExclusionRules.tags }),
    };

    return Object.keys(exclusionRules).length ? exclusionRules : undefined;
  }

  /**
   * Generates the action property into the `Action` type in the CloudFormation L1 definition.
   *
   * @param props The props passed as input to the construct
   * @param detail The lifecycle policy detail where the exclusion rules are
   * @private
   */
  private buildAction(props: LifecyclePolicyProps, detail: LifecyclePolicyDetail): CfnLifecyclePolicy.ActionProperty {
    const isContainerPolicy =
      !cdk.Token.isUnresolved(props.resourceType) && props.resourceType === LifecyclePolicyResourceType.CONTAINER_IMAGE;
    const isAmiPolicy =
      !cdk.Token.isUnresolved(props.resourceType) && props.resourceType === LifecyclePolicyResourceType.AMI_IMAGE;

    const includeResources: CfnLifecyclePolicy.IncludeResourcesProperty = {
      amis: detail.action.includeAmis ?? (isAmiPolicy ? true : undefined),
      snapshots: detail.action.includeSnapshots ?? (isAmiPolicy ? true : undefined),
      containers: detail.action.includeContainers ?? (isContainerPolicy ? true : undefined),
    };

    return {
      type: detail.action.type,
      ...(Object.entries(includeResources).some(([_, value]) => value !== undefined) && { includeResources }),
    };
  }

  /**
   * Validates the top-level properties of the policy
   *
   * @param props The props passed as input to the construct
   * @private
   */
  private validatePolicy(props: LifecyclePolicyProps): void {
    if (props.resourceSelection.recipes?.length && Object.keys(props.resourceSelection.tags || {}).length) {
      throw new cdk.ValidationError('resource selection cannot contain both recipes and tags', this);
    }

    if (!props.resourceSelection.recipes?.length && !Object.keys(props.resourceSelection.tags || {}).length) {
      throw new cdk.ValidationError('resource selection must contain either recipes or tags', this);
    }

    if (props.details.length === 0) {
      throw new cdk.ValidationError('a lifecycle policy must have at least 1 rule', this);
    }

    if (props.details.length > 3) {
      throw new cdk.ValidationError('a lifecycle policy can only have up to 3 rules', this);
    }

    const actions = props.details.map((detail) => detail.action.type);
    if (new Set(actions).size != actions.length) {
      throw new cdk.ValidationError('lifecycle policy rules may not have duplicate actions', this);
    }
  }

  /**
   * Validates a policy detail filter within a lifecycle policy rule
   *
   * @param props The props passed as input to the construct
   * @param action The action being taken in the lifecycle policy rule
   * @param amiExclusionRules The AMI exclusion rules in the lifecycle policy rule
   * @private
   */
  private validatePolicyDetailAction(
    props: LifecyclePolicyProps,
    action: LifecyclePolicyAction,
    amiExclusionRules: CfnLifecyclePolicy.AmiExclusionRulesProperty | cdk.IResolvable | undefined,
  ) {
    if (
      !cdk.Token.isUnresolved(props.resourceType) &&
      props.resourceType === LifecyclePolicyResourceType.CONTAINER_IMAGE
    ) {
      if (!cdk.Token.isUnresolved(action.type) && action.type !== LifecyclePolicyActionType.DELETE) {
        throw new cdk.ValidationError('you may only specify DELETE rules for container policies', this);
      }

      if (action.includeAmis) {
        throw new cdk.ValidationError('you cannot include AMIs in a container policy', this);
      }

      if (action.includeSnapshots) {
        throw new cdk.ValidationError('you cannot include snapshots in a container policy', this);
      }

      if (amiExclusionRules !== undefined) {
        throw new cdk.ValidationError('you cannot exclude AMIs in a container policy', this);
      }
    }

    if (
      !cdk.Token.isUnresolved(props.resourceType) &&
      props.resourceType === LifecyclePolicyResourceType.AMI_IMAGE &&
      action.includeContainers
    ) {
      throw new cdk.ValidationError('you cannot include containers in an AMI policy', this);
    }
  }

  /**
   * Validates a policy detail filter
   *
   * @param filter The lifecycle policy filter to validate
   * @private
   */
  private validatePolicyDetailFilter(filter: LifecyclePolicyFilter) {
    if (filter.age !== undefined && filter.count !== undefined) {
      throw new cdk.ValidationError('either age count can be specified in a policy filter, but not both', this);
    }

    if (filter.age === undefined && filter.count === undefined) {
      throw new cdk.ValidationError('you must provide an age or count filter in the policy', this);
    }

    if (filter.retainAtLeast !== undefined && filter.age === undefined) {
      throw new cdk.ValidationError('you can only specify a retainAtLeast filter when using an age filter', this);
    }
  }

  /**
   * Converts a `cdk.Duration` into the value and unit which is accepted as filter age and last launched age in the
   * lifecycle policy. The value is rounded up to the nearest whole number.
   *
   * @param duration The duration to convert
   * @param valueLimit The maximum value that can be specified
   * @private
   */
  private convertDurationToTimeUnitValue(
    duration: cdk.Duration,
    valueLimit: number = 1000,
  ): { value: number; unit: 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS' } {
    const valueInDays = Math.ceil(duration.toDays());
    if (valueInDays <= valueLimit) {
      return { value: valueInDays, unit: 'DAYS' };
    }

    const valueInWeeks = Math.ceil(valueInDays / 7);
    if (valueInWeeks <= valueLimit) {
      return { value: valueInWeeks, unit: 'WEEKS' };
    }

    const valueInMonths = Math.ceil(valueInDays / 30);
    if (valueInMonths <= valueLimit) {
      return { value: valueInMonths, unit: 'MONTHS' };
    }

    const valueInYears = Math.ceil(valueInDays / 365);
    if (valueInYears <= valueLimit) {
      return { value: valueInYears, unit: 'YEARS' };
    }

    throw new cdk.ValidationError(`the provided duration must be less than ${valueLimit} years`, this);
  }
}
