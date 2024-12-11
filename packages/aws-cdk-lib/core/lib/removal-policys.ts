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
   * You can specify either the CloudFormation resource type (e.g., 'AWS::S3::Bucket')
   * or the CDK resource class (e.g., CfnBucket).
   * @default - apply to all resources
   */
  readonly applyToResourceTypes?: Array<string | { new (...args: any[]): CfnResource }>;

  /**
   * Exclude specific resource types from the removal policy.
   * You can specify either the CloudFormation resource type (e.g., 'AWS::S3::Bucket')
   * or the CDK resource class (e.g., CfnBucket).
   * @default - no exclusions
   */
  readonly excludeResourceTypes?: Array<string | { new (...args: any[]): CfnResource }>;
}

/**
 * The RemovalPolicyAspect handles applying a removal policy to resources
 */
class RemovalPolicyAspect implements IAspect {
  constructor(
    private readonly policy: RemovalPolicy,
    private readonly props: RemovalPolicyProps = {},
  ) {}

  private getResourceTypeFromClass(resourceClass: { new (...args: any[]): CfnResource }): string {
    // Create a prototype instance to get the type without instantiating
    const prototype = resourceClass.prototype;
    if ('cfnResourceType' in prototype) {
      return prototype.cfnResourceType;
    }
    // Fallback to checking constructor properties
    const instance = Object.create(prototype);
    return instance.constructor.CFN_RESOURCE_TYPE_NAME ?? '';
  }

  private matchesResourceType(resourceType: string, pattern: string | { new (...args: any[]): CfnResource }): boolean {
    if (typeof pattern === 'string') {
      return resourceType === pattern;
    }
    return resourceType === this.getResourceTypeFromClass(pattern);
  }

  public visit(node: IConstruct): void {
    if (!CfnResource.isCfnResource(node)) {
      return;
    }

    const cfnResource = node as CfnResource;
    const resourceType = cfnResource.cfnResourceType;

    // Skip if resource type is excluded
    if (this.props.excludeResourceTypes?.some(pattern => this.matchesResourceType(resourceType, pattern))) {
      return;
    }

    // Skip if specific resource types are specified and this one isn't included
    if (this.props.applyToResourceTypes?.length &&
        !this.props.applyToResourceTypes.some(pattern => this.matchesResourceType(resourceType, pattern))) {
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
