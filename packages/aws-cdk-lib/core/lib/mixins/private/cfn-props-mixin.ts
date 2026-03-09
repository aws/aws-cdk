import type { IConstruct, IMixin } from 'constructs';
import { CfnResource } from '../../cfn-resource';
import type { IMergeStrategy } from '../property-merge-strategy';
import { PropertyMergeStrategy } from '../property-merge-strategy';

/**
 * Options for CfnPropsMixin
 * @internal
 */
export interface CfnPropsMixinOptions {
  /**
   * Strategy for merging properties
   *
   * @default - PropertyMergeStrategy.combine()
   */
  readonly strategy?: IMergeStrategy;
}

/**
 * Recursively makes all properties optional.
 */
type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

/**
 * Extract writable, non-function own properties from a CfnResource subclass.
 * Excludes inherited CfnResource/CfnElement/CfnRefElement members and readonly attributes.
 */
type CfnWritableProps<T extends CfnResource> = {
  [K in keyof T as
  K extends keyof CfnResource ? never :
    T[K] extends Function ? never :
      K extends `attr${string}` ? never :
        K extends 'cdkTagManager' ? never :
          K]: T[K];
};

/**
 * A generic, type-safe mixin for applying L1 CloudFormation properties.
 *
 * Usage:
 * ```ts
 * new s3.Bucket(this, 'Bucket')
 *   .with(new CfnPropsMixin(s3.CfnBucket, {
 *     versioningConfiguration: { status: 'Enabled' },
 *   }));
 * ```
 * @internal
 */
export class CfnPropsMixin<T extends CfnResource> implements IMixin {
  private readonly cfnResourceType: string;
  private readonly props: DeepPartial<CfnWritableProps<T>>;
  private readonly propertyKeys: string[];
  private readonly strategy: IMergeStrategy;

  public constructor(
    resourceClass: (abstract new (...args: any[]) => T) & { readonly CFN_RESOURCE_TYPE_NAME: string },
    props: DeepPartial<CfnWritableProps<T>>,
    options: CfnPropsMixinOptions = {},
  ) {
    this.cfnResourceType = resourceClass.CFN_RESOURCE_TYPE_NAME;
    this.props = props;
    this.propertyKeys = Object.keys(props);
    this.strategy = options.strategy ?? PropertyMergeStrategy.combine();
  }

  public supports(construct: IConstruct): boolean {
    return CfnResource.isCfnResource(construct) && construct.cfnResourceType === this.cfnResourceType;
  }

  public applyTo(construct: IConstruct): void {
    if (this.supports(construct)) {
      this.strategy.apply(construct, this.props, this.propertyKeys);
    }
  }
}
