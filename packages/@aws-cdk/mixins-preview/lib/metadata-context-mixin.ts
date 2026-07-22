import type { ResourceContextProps } from 'aws-cdk-lib/core';
import { CfnResource, MetadataContext, Mixin } from 'aws-cdk-lib/core';
import type { IConstruct } from 'constructs';

/**
 * A Mixin that attaches a resource-level `Metadata.Context` block to a
 * CloudFormation resource.
 *
 * Use this form to attach context imperatively to exactly one resource via
 * `.with()`, or to many via `Mixins.of(scope).apply()`. Unlike
 * `MetadataContext.of(scope).add()` — which cascades to all primary
 * resources beneath a scope at synthesis time — a Mixin applies only to the
 * constructs it is given. Context applied by this Mixin takes precedence
 * over context cascaded from enclosing scopes (scalar fields win; list
 * fields are unioned).
 *
 * @example
 * declare const cfnResource: CfnResource;
 *
 * cfnResource.with(new MetadataContextMixin({
 *   why: 'buffer order events async; 14d retention = compliance window',
 * }));
 */
export class MetadataContextMixin extends Mixin {
  private readonly context: ResourceContextProps;

  constructor(context: ResourceContextProps) {
    super();
    this.context = context;
  }

  public supports(construct: IConstruct): construct is CfnResource {
    return CfnResource.isCfnResource(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) {
      return;
    }
    // Delegate to the MetadataContext facade: staging the entry directly on
    // the resource participates in the standard merge model (entries on the
    // resource itself override context cascaded from enclosing scopes;
    // list fields union). Validation is performed by add().
    MetadataContext.of(construct).add(this.context);
  }
}
