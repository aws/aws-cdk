import type { IConstruct, IMixin } from 'constructs';
import { ValidationError } from '../errors';
import { applyMixin } from './private/mixin-metadata';
import { ConstructSelector, type IConstructSelector } from './selectors';
import { memoizedGetter } from '../helpers-internal';

/**
 * Represents a successful mixin application.
 */
export interface MixinApplication {
  /**
   * The construct the mixin was applied to.
   */
  readonly construct: IConstruct;
  /**
   * The mixin that was applied.
   */
  readonly mixin: IMixin;
}

/**
 * Applies mixins to constructs.
 */
export class MixinApplicator {
  private readonly scope: IConstruct;
  private readonly selector: IConstructSelector;
  private readonly applications: MixinApplication[] = [];

  private expectAll = false;
  private expectAny = false;

  /**
   * The constructs that match the selector in the given scope.
   */
  @memoizedGetter
  public get selectedConstructs(): IConstruct[] {
    return this.selector.select(this.scope);
  }

  /**
   * Returns the successful mixin applications.
   */
  public get report(): MixinApplication[] {
    return this.applications;
  }

  constructor(
    scope: IConstruct,
    selector: IConstructSelector = ConstructSelector.all(),
  ) {
    this.scope = scope;
    this.selector = selector;
  }

  /**
   * Applies a mixin to selected constructs.
   */
  public apply(...mixins: IMixin[]): this {
    const applications: MixinApplication[] = [];

    const allConstructs = Array.from(this.selectedConstructs);
    for (const mixin of mixins) {
      for (const construct of allConstructs) {
        if (mixin.supports(construct)) {
          applyMixin(construct, mixin);
          applications.push({ construct, mixin });
        } else if (this.expectAll) {
          throw new ValidationError(`Mixin ${mixin.constructor.name} could not be applied to ${construct.constructor.name} but was required to.`, this.scope);
        }
      }
    }

    if (this.expectAny && applications.length <= 0) {
      throw new ValidationError('At least one mixin application was required, but none of the provided mixins could be applied to any selected construct.', this.scope);
    }

    // record all applications
    this.applications.push(...applications);

    return this;
  }

  /**
   * Requires all selected constructs to support the applied mixins.
   *
   * Will only check for future call of `apply()`.
   * Set this before calling `apply()` to take effect.
   *
   * @example
   * Mixins.of(scope)
   *   .requireAll()
   *   .apply(new MyMixin());
   */
  public requireAll(): this {
    this.expectAll = true;
    return this;
  }

  /**
   * Requires at least one mixin to be successfully applied.
   *
   * Will only check for future call of `apply()`.
   * Set this before calling `apply()` to take effect.
   *
   * @example
   * Mixins.of(scope)
   *   .requireAny()
   *   .apply(new MyMixin());
   */
  public requireAny(): this {
    this.expectAny = true;
    return this;
  }
}
