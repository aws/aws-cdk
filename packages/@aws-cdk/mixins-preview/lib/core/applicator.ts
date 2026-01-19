import type { IConstruct } from 'constructs';
import { ValidationError } from 'aws-cdk-lib/core';
import type { IMixin } from './mixins';
import { ConstructSelector, type IConstructSelector } from './selectors';

/**
 * Applies mixins to constructs.
 */
export class MixinApplicator {
  private readonly scope: IConstruct;
  private readonly selector: IConstructSelector;

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
  apply(...mixins: IMixin[]): this {
    const constructs = this.selector.select(this.scope);
    for (const construct of constructs) {
      for (const mixin of mixins) {
        if (mixin.supports(construct)) {
          mixin.applyTo(construct);
        }
      }
    }
    return this;
  }

  /**
   * Applies a mixin and requires that it be applied to all constructs.
   */
  mustApply(...mixins: IMixin[]): this {
    const constructs = this.selector.select(this.scope);
    for (const construct of constructs) {
      for (const mixin of mixins) {
        if (!mixin.supports(construct)) {
          throw new ValidationError(`Mixin ${mixin.constructor.name} could not be applied to ${construct.constructor.name} but was requested to.`, this.scope);
        }
        mixin.applyTo(construct);
      }
    }
    return this;
  }
}
