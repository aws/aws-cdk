import { IConstruct } from 'constructs';
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
   * If true, overwrite any user-specified removal policy that has been previously set.
   * This means even if the user has already called `applyRemovalPolicy()` on the resource,
   * it will be overwritten with the new policy.
   * @default false - do not overwrite user-specified policies
   */
  readonly overwrite?: boolean;

  /**
   * The priority to use when applying this aspect.
   * If multiple aspects apply conflicting settings, the one with the higher priority wins.
   *
   * @default - AspectPriority.MUTATING
   */
  readonly priority?: number;
}

/**
 * The RemovalPolicyAspect handles applying a removal policy to resources
 */
class RemovalPolicyAspect implements IAspect {
  constructor(
    private readonly policy: RemovalPolicy,
    private readonly props: RemovalPolicyProps = {},
  ) {}

  /**
   * Checks if the given resource type matches any of the patterns
   */
  private resourceTypeMatchesPatterns(resourceType: string, patterns?: string[]): boolean {
    if (!patterns || patterns.length === 0) {
      return false;
    }
    return patterns.includes(resourceType);
  }

  public visit(node: IConstruct): void {
    if (!CfnResource.isCfnResource(node)) {
      return;
    }

    const cfnResource = node as CfnResource;
    const resourceType = cfnResource.cfnResourceType;

    const userAlreadySetPolicy =
      cfnResource.cfnOptions.deletionPolicy !== undefined ||
      cfnResource.cfnOptions.updateReplacePolicy !== undefined;

    if (!this.props.overwrite && userAlreadySetPolicy) {
      return;
    }

    if (this.resourceTypeMatchesPatterns(resourceType, this.props.excludeResourceTypes)) {
      return;
    }

    if (
      this.props.applyToResourceTypes?.length &&
      !this.resourceTypeMatchesPatterns(resourceType, this.props.applyToResourceTypes)
    ) {
      return;
    }

    // Apply the removal policy
    cfnResource.applyRemovalPolicy(this.policy);
  }
}

/**
 * Manages removal policies for all resources within a construct scope
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
   * Apply a removal policy to all resources within this scope
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
