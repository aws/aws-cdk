import { IConstruct } from 'constructs';
import { Annotations } from './annotations';
import { Aspects, IAspect, AspectPriority } from './aspect';
import { CfnResource } from './cfn-resource';
import { RemovalPolicy } from './removal-policy';

/**
 * Properties for applying a removal policy
 */
export interface RemovalPolicyProps {
  /**
   * Apply the removal policy only to specific resource types.
   * Can be a CloudFormation resource type string (e.g., 'AWS::S3::Bucket').
   * @default - apply to all resources
   */
  readonly applyToResourceTypes?: string[];

  /**
   * Exclude specific resource types from the removal policy.
   * Can be a CloudFormation resource type string (e.g., 'AWS::S3::Bucket').
   * @default - no exclusions
   */
  readonly excludeResourceTypes?: string[];

  /**
   * The priority to use when applying this policy.
   *
   * The priority affects only the order in which aspects are applied during synthesis.
   * For RemovalPolicies, the last applied policy will override previous ones.
   *
   * NOTE: Priority does NOT determine which policy "wins" when there are conflicts.
   * The order of application determines the final policy, with later policies
   * overriding earlier ones.
   *
   * @default - AspectPriority.MUTATING
   */
  readonly priority?: number;
}

/**
 * Base class for removal policy aspects
 */
abstract class BaseRemovalPolicyAspect implements IAspect {
  constructor(
    protected readonly policy: RemovalPolicy,
    protected readonly props: RemovalPolicyProps = {},
  ) {}

  /**
   * Checks if the given resource type matches any of the patterns
   */
  protected resourceTypeMatchesPatterns(resourceType: string, patterns?: string[]): boolean {
    if (!patterns || patterns.length === 0) {
      return false;
    }
    return patterns.includes(resourceType);
  }

  /**
   * Determines if the removal policy should be applied to the given resource
   */
  protected abstract shouldApplyPolicy(cfnResource: CfnResource): boolean;

  public visit(node: IConstruct): void {
    if (!CfnResource.isCfnResource(node)) {
      return;
    }

    const cfnResource = node as CfnResource;
    const resourceType = cfnResource.cfnResourceType;

    if (this.resourceTypeMatchesPatterns(resourceType, this.props.excludeResourceTypes)) {
      return;
    }

    if (
      this.props.applyToResourceTypes?.length &&
      !this.resourceTypeMatchesPatterns(resourceType, this.props.applyToResourceTypes)
    ) {
      return;
    }

    if (this.shouldApplyPolicy(cfnResource)) {
      // Apply the removal policy
      cfnResource.applyRemovalPolicy(this.policy);
    }
  }
}

/**
 * The RemovalPolicyAspect handles applying a removal policy to resources,
 * overriding any existing policies
 */
class RemovalPolicyAspect extends BaseRemovalPolicyAspect {
  protected shouldApplyPolicy(_cfnResource: CfnResource): boolean {
    // RemovalPolicyAspect always applies the policy, regardless of existing policies
    return true;
  }
}

/**
 * The MissingRemovalPolicyAspect handles applying a removal policy only to resources
 * that don't already have a policy set
 */
class MissingRemovalPolicyAspect extends BaseRemovalPolicyAspect {
  protected shouldApplyPolicy(cfnResource: CfnResource): boolean {
    // For MissingRemovalPolicies, we only apply the policy if one doesn't already exist
    const userAlreadySetPolicy =
      cfnResource.cfnOptions.deletionPolicy !== undefined ||
      cfnResource.cfnOptions.updateReplacePolicy !== undefined;

    return !userAlreadySetPolicy;
  }
}

/**
 * Manages removal policies for all resources within a construct scope,
 * overriding any existing policies by default
 */
export class RemovalPolicies {
  /**
   * Returns the removal policies API for the given scope
   * @param scope The scope
   */
  public static of(scope: IConstruct): RemovalPolicies {
    return new RemovalPolicies(scope);
  }

  private constructor(private readonly scope: IConstruct) {}

  /**
   * Apply a removal policy to all resources within this scope,
   * overriding any existing policies
   *
   * @param policy The removal policy to apply
   * @param props Configuration options
   */
  public apply(policy: RemovalPolicy, props: RemovalPolicyProps = {}) {
    Aspects.of(this.scope).add(new RemovalPolicyAspect(policy, props), {
      priority: props.priority ?? AspectPriority.MUTATING,
    });
  }

  /**
   * Apply DESTROY removal policy to all resources within this scope
   *
   * @param props Configuration options
   */
  public destroy(props: RemovalPolicyProps = {}) {
    this.apply(RemovalPolicy.DESTROY, props);
  }

  /**
   * Apply RETAIN removal policy to all resources within this scope
   *
   * @param props Configuration options
   */
  public retain(props: RemovalPolicyProps = {}) {
    this.apply(RemovalPolicy.RETAIN, props);
  }

  /**
   * Apply SNAPSHOT removal policy to all resources within this scope
   *
   * @param props Configuration options
   */
  public snapshot(props: RemovalPolicyProps = {}) {
    this.apply(RemovalPolicy.SNAPSHOT, props);
  }

  /**
   * Apply RETAIN_ON_UPDATE_OR_DELETE removal policy to all resources within this scope
   *
   * @param props Configuration options
   */
  public retainOnUpdateOrDelete(props: RemovalPolicyProps = {}) {
    this.apply(RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE, props);
  }
}

/**
 * Manages removal policies for resources without existing policies within a construct scope
 */
export class MissingRemovalPolicies {
  /**
   * Returns the missing removal policies API for the given scope
   * @param scope The scope
   */
  public static of(scope: IConstruct): MissingRemovalPolicies {
    return new MissingRemovalPolicies(scope);
  }

  private constructor(private readonly scope: IConstruct) {}

  /**
   * Apply a removal policy only to resources without existing policies within this scope
   *
   * @param policy The removal policy to apply
   * @param props Configuration options
   */
  public apply(policy: RemovalPolicy, props: RemovalPolicyProps = {}) {
    Aspects.of(this.scope).add(new MissingRemovalPolicyAspect(policy, props), {
      priority: props.priority ?? AspectPriority.MUTATING,
    });

    if (props.priority !== undefined) {
      Annotations.of(this.scope).addWarningV2(
        `Warning MissingRemovalPolicies with priority in ${this.scope.node.path}`,
        'Applying a MissingRemovalPolicy with `priority` can lead to unexpected behavior since it only applies to resources without existing policies. Please refer to the documentation for more details.',
      );
    }
  }

  /**
   * Apply DESTROY removal policy only to resources without existing policies within this scope
   *
   * @param props Configuration options
   */
  public destroy(props: RemovalPolicyProps = {}) {
    this.apply(RemovalPolicy.DESTROY, props);
  }

  /**
   * Apply RETAIN removal policy only to resources without existing policies within this scope
   *
   * @param props Configuration options
   */
  public retain(props: RemovalPolicyProps = {}) {
    this.apply(RemovalPolicy.RETAIN, props);
  }

  /**
   * Apply SNAPSHOT removal policy only to resources without existing policies within this scope
   *
   * @param props Configuration options
   */
  public snapshot(props: RemovalPolicyProps = {}) {
    this.apply(RemovalPolicy.SNAPSHOT, props);
  }

  /**
   * Apply RETAIN_ON_UPDATE_OR_DELETE removal policy only to resources without existing policies within this scope
   *
   * @param props Configuration options
   */
  public retainOnUpdateOrDelete(props: RemovalPolicyProps = {}) {
    this.apply(RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE, props);
  }
}
