import { IConstruct } from 'constructs';
import { Aspects, IAspect } from './aspect';
import { CfnResource } from './cfn-resource';
import { RemovalPolicy } from './removal-policy';

/**
 * Properties for applying a removal policy
 */
export interface RemovalPolicyProps {
  /**
   * Apply the removal policy only to specific resource types.
   * Specify the CloudFormation resource type (e.g., 'AWS::S3::Bucket').
   * @default - apply to all resources
   */
  readonly applyToResourceTypes?: string[];

  /**
   * Exclude specific resource types from the removal policy.
   * Specify the CloudFormation resource type (e.g., 'AWS::S3::Bucket').
   * @default - no exclusions
   */
  readonly excludeResourceTypes?: string[];
}

/**
 * The RemovalPolicyAspect handles applying a removal policy to resources
 */
class RemovalPolicyAspect implements IAspect {
  constructor(
    private readonly policy: RemovalPolicy,
    private readonly props: RemovalPolicyProps = {},
  ) {}

  private matchesResourceType(resourceType: string, patterns?: string[]): boolean {
    return patterns ? patterns.includes(resourceType) : false;
  }

  public visit(node: IConstruct): void {
    if (!CfnResource.isCfnResource(node)) {
      return;
    }

    const cfnResource = node as CfnResource;
    const resourceType = cfnResource.cfnResourceType;

    // Skip if resource type is excluded
    if (this.matchesResourceType(resourceType, this.props.excludeResourceTypes)) {
      return;
    }

    // Skip if specific resource types are specified and this one isn't included
    if (
      this.props.applyToResourceTypes?.length &&
      !this.matchesResourceType(resourceType, this.props.applyToResourceTypes)
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
export class RemovalPolicys {
  /**
   * Returns the removal policies API for the given scope
   * @param scope The scope
   */
  public static of(scope: IConstruct): RemovalPolicys {
    return new RemovalPolicys(scope);
  }

  private constructor(private readonly scope: IConstruct) {}

  /**
   * Apply a removal policy to all resources within this scope
   *
   * @param policy The removal policy to apply
   * @param props Configuration options
   */
  public apply(policy: RemovalPolicy, props: RemovalPolicyProps = {}) {
    Aspects.of(this.scope).add(new RemovalPolicyAspect(policy, props));
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
