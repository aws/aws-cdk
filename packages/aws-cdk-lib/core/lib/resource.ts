import { Construct } from 'constructs';
import type { IConstruct, IMixin } from 'constructs';
import type { ArnComponents } from './arn';
import { Arn, ArnFormat } from './arn';
import { CfnResource } from './cfn-resource';
import { RESOURCE_SYMBOL } from './constants';
import { ValidationError } from './errors';
import { memoizedGetter } from './helpers-internal/memoize';
import type { IStringProducer } from './lazy';
import { Lazy } from './lazy';
import { generatePhysicalName, isGeneratedWhenNeededMarker } from './private/physical-name-generator';
import { Reference } from './reference';
import type { RemovalPolicy } from './removal-policy';
import type { IResolveContext } from './resolvable';
import { Stack } from './stack';
import { Token, Tokenization } from './token';
import type { IEnvironmentAware, ResourceEnvironment } from '../../interfaces/environment-aware';
import { withMixins } from './mixins/private/mixin-metadata';

/**
 * Interface for L2 Resource constructs.
 */
export interface IResource extends IConstruct, IEnvironmentAware {
  /**
   * The stack in which this resource is defined.
   */
  readonly stack: Stack;

  /**
   * Apply the given removal policy to this resource
   *
   * The Removal Policy controls what happens to this resource when it stops
   * being managed by CloudFormation, either because you've removed it from the
   * CDK application or because you've made a change that requires the resource
   * to be replaced.
   *
   * The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
   * account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).
   */
  applyRemovalPolicy(policy: RemovalPolicy): void;
}

/**
 * Construction properties for `Resource`.
 */
export interface ResourceProps {
  /**
   * The value passed in by users to the physical name prop of the resource.
   *
   * - `undefined` implies that a physical name will be allocated by
   *   CloudFormation during deployment.
   * - a concrete value implies a specific physical name
   * - `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
   *   by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.
   *
   * @default - The physical name will be allocated by CloudFormation at deployment time
   */
  readonly physicalName?: string;

  /**
   * The AWS account ID this resource belongs to.
   *
   * @default - the resource is in the same account as the stack it belongs to
   */
  readonly account?: string;

  /**
   * The AWS region this resource belongs to.
   *
   * @default - the resource is in the same region as the stack it belongs to
   */
  readonly region?: string;

  /**
   * ARN to deduce region and account from
   *
   * The ARN is parsed and the account and region are taken from the ARN.
   * This should be used for imported resources.
   *
   * Cannot be supplied together with either `account` or `region`.
   *
   * @default - take environment from `account`, `region` parameters, or use Stack environment.
   */
  readonly environmentFromArn?: string;
}

/**
 * An L2 construct which represents an AWS resource.
 */
export abstract class Resource extends Construct implements IResource {
  /**
   * Check whether the given construct is a Resource
   */
  public static isResource(construct: IConstruct): construct is Resource {
    return construct !== null && typeof(construct) === 'object' && RESOURCE_SYMBOL in construct;
  }

  /**
   * Returns true if the construct was created by CDK, and false otherwise
   */
  public static isOwnedResource(construct: IConstruct): boolean {
    return construct.node.defaultChild ? CfnResource.isCfnResource(construct.node.defaultChild) : false;
  }

  private readonly _allowCrossEnvironment: boolean;

  /** Account given in the constructor, if any. Will be same as Stack if not supplied. */
  private _customAccount: string | undefined;

  /** Account given in the constructor, if any. Will be same as Stack if not supplied.*/
  private _customRegion: string | undefined;

  /** What we are doing for the physical name */
  private _physicalNameMode: 'generate' | 'given-resolved' | 'deploy-time';
  /** The physicalName supplied into the constructor */
  private _givenPhysicalName: string | undefined;
  /** The generated physical name, in case of cross-env access */
  private _generatedPhysicalName: string | undefined;

  constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id);

    if ((props.account !== undefined || props.region !== undefined) && props.environmentFromArn !== undefined) {
      throw new ValidationError(`Supply at most one of 'account'/'region' (${props.account}/${props.region}) and 'environmentFromArn' (${props.environmentFromArn})`, this);
    }

    Object.defineProperty(this, RESOURCE_SYMBOL, { value: true });

    const parsedArn = props.environmentFromArn ?
      // Since we only want the region and account, NO_RESOURCE_NAME is good enough
      Arn.split(props.environmentFromArn, ArnFormat.NO_RESOURCE_NAME)
      : undefined;
    this._customAccount = props.account ?? parsedArn?.account;
    this._customRegion = props.region ?? parsedArn?.region;

    this._givenPhysicalName = props.physicalName;

    if (props.physicalName && isGeneratedWhenNeededMarker(props.physicalName)) {
      // Auto-generate the physical name if there is cross-environment usage of the token
      this._physicalNameMode = 'generate';
      this._allowCrossEnvironment = true;
    } else if (props.physicalName && !Token.isUnresolved(props.physicalName)) {
      // Concrete value specified by the user, this is the physical name
      this._physicalNameMode = 'given-resolved';
      this._allowCrossEnvironment = true;
    } else {
      // One of:
      //
      // - undefined (means: deploy-time generated by CloudFormation); or
      // - unresolved (means: some deploy-time value).
      //
      // In both cases we know the name and can return it, but we cannot use
      // this for cross-env because there's no way to predict it at synth time.
      this._physicalNameMode = 'deploy-time';
      this._allowCrossEnvironment = false;
    }
  }

  @memoizedGetter
  public get stack(): Stack {
    return Stack.of(this);
  }

  @memoizedGetter
  public get env(): ResourceEnvironment {
    return {
      account: this._customAccount ?? this.stack.account,
      region: this._customRegion ?? this.stack.region,
    };
  }

  public with(...mixins: IMixin[]): IConstruct {
    return withMixins(this, ...mixins);
  }

  /**
   * Returns a string-encoded token that resolves to the physical name that
   * should be passed to the CloudFormation resource.
   *
   * This value will resolve to one of the following:
   * - a concrete value (e.g. `"my-awesome-bucket"`)
   * - `undefined`, when a name should be generated by CloudFormation
   * - a concrete name generated automatically during synthesis, in
   *   cross-environment scenarios.
   */
  @memoizedGetter
  protected get physicalName(): string {
    switch (this._physicalNameMode) {
      case 'generate':
        return Lazy.string({ produce: () => this._generatedPhysicalName });
      case 'given-resolved':
        // Will definitely be set
        return this._givenPhysicalName!;
      case 'deploy-time':
        // May end up unset, in which case we escape `undefined` via a Token to satisfy TypeScript's typing.
        return this._givenPhysicalName ?? Token.asString(undefined);
    }
  }

  /**
   * Called when this resource is referenced across environments
   * (account/region) to order to request that a physical name will be generated
   * for this resource during synthesis, so the resource can be referenced
   * through its absolute name/arn.
   *
   * @internal
   */
  public _enableCrossEnvironment(): void {
    if (!this._allowCrossEnvironment) {
      // error out - a deploy-time name cannot be used across environments
      throw new ValidationError(`Cannot use resource '${this.node.path}' in a cross-environment fashion, ` +
        "the resource's physical name must be explicit set or use `PhysicalName.GENERATE_IF_NEEDED`", this);
    }

    if (this._physicalNameMode === 'generate' && !this._generatedPhysicalName) {
      this._generatedPhysicalName = this.generatePhysicalName();
    }
  }

  /**
   * Apply the given removal policy to this resource
   *
   * The Removal Policy controls what happens to this resource when it stops
   * being managed by CloudFormation, either because you've removed it from the
   * CDK application or because you've made a change that requires the resource
   * to be replaced.
   *
   * The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
   * account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).
   */
  public applyRemovalPolicy(policy: RemovalPolicy) {
    const child = this.node.defaultChild;
    if (!child || !CfnResource.isCfnResource(child)) {
      throw new ValidationError('Cannot apply RemovalPolicy: no child or not a CfnResource. Apply the removal policy on the CfnResource directly.', this);
    }
    child.applyRemovalPolicy(policy);
  }

  protected generatePhysicalName(): string {
    return generatePhysicalName(this);
  }

  /**
   * Returns an environment-sensitive token that should be used for the
   * resource's "name" attribute (e.g. `bucket.bucketName`).
   *
   * Normally, this token will resolve to `nameAttr`, but if the resource is
   * referenced across environments, it will be resolved to `this.physicalName`,
   * which will be a concrete name.
   *
   * @param nameAttr The CFN attribute which resolves to the resource's name.
   * Commonly this is the resource's `ref`.
   */
  protected getResourceNameAttribute(nameAttr: string) {
    return mimicReference(nameAttr, {
      produce: (context: IResolveContext) => {
        const consumingStack = Stack.of(context.scope);

        if (this.stack.account !== consumingStack.account ||
          (this.stack.region !== consumingStack.region &&
            !consumingStack._crossRegionReferences)) {
          this._enableCrossEnvironment();
          return this.physicalName;
        } else {
          return nameAttr;
        }
      },
    });
  }

  /**
   * Returns an environment-sensitive token that should be used for the
   * resource's "ARN" attribute (e.g. `bucket.bucketArn`).
   *
   * Normally, this token will resolve to `arnAttr`, but if the resource is
   * referenced across environments, `arnComponents` will be used to synthesize
   * a concrete ARN with the resource's physical name. Make sure to reference
   * `this.physicalName` in `arnComponents`.
   *
   * @param arnAttr The CFN attribute which resolves to the ARN of the resource.
   * Commonly it will be called "Arn" (e.g. `resource.attrArn`), but sometimes
   * it's the CFN resource's `ref`.
   * @param arnComponents The format of the ARN of this resource. You must
   * reference `this.physicalName` somewhere within the ARN in order for
   * cross-environment references to work.
   *
   */
  protected getResourceArnAttribute(arnAttr: string, arnComponents: ArnComponents) {
    return mimicReference(arnAttr, {
      produce: (context: IResolveContext) => {
        const consumingStack = Stack.of(context.scope);
        if (this.stack.account !== consumingStack.account ||
          (this.stack.region !== consumingStack.region &&
            !consumingStack._crossRegionReferences)) {
          this._enableCrossEnvironment();
          return this.stack.formatArn(arnComponents);
        } else {
          return arnAttr;
        }
      },
    });
  }
}

/**
 * Produce a Lazy that is also a Reference (if the base value is a Reference).
 *
 * If the given value is a Reference (or resolves to a Reference), return a new
 * Reference that mimics the same target and display name, but resolves using
 * the logic of the passed lazy.
 *
 * If the given value is NOT a Reference, just return a simple Lazy.
 */
function mimicReference(refSource: any, producer: IStringProducer): string {
  const reference = Tokenization.reverse(refSource, {
    // If this is an ARN concatenation, just fail to extract a reference.
    failConcat: false,
  });
  if (!Reference.isReference(reference)) {
    return Lazy.uncachedString(producer);
  }

  return Token.asString(new class extends Reference {
    public resolve(context: IResolveContext) {
      return producer.produce(context);
    }
  }(reference, reference.target, reference.displayName));
}
