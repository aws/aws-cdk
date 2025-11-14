import type { IConstruct } from 'constructs';
import { ValidationError } from 'aws-cdk-lib/core';
import type { IMixin } from './mixins';
import { ConstructSelector } from './selectors';

/**
 * Applies mixins to constructs.
 */
export class MixinApplicator {
  private readonly scope: IConstruct;
  private readonly selector: ConstructSelector;

  constructor(
    scope: IConstruct,
    selector: ConstructSelector = ConstructSelector.all(),
  ) {
    this.scope = scope;
    this.selector = selector;
  }

  /**
   * Applies a mixin to selected constructs.
   */
  apply(mixin: IMixin): this {
    const constructs = this.selector.select(this.scope);
    for (const construct of constructs) {
      if (mixin.supports(construct)) {
        const errors = mixin.validate?.(construct) ?? [];
        if (errors.length > 0) {
          throw new ValidationError(`Mixin validation failed: ${errors.join(', ')}`, this.scope);
        }
        mixin.applyTo(construct);
      }
    }
    return this;
  }

  /**
   * Applies a mixin and requires that it be applied to at least one construct.
   */
  mustApply(mixin: IMixin): this {
    const constructs = this.selector.select(this.scope);
    let applied = false;
    for (const construct of constructs) {
      if (mixin.supports(construct)) {
        const errors = mixin.validate?.(construct) ?? [];
        if (errors.length > 0) {
          throw new ValidationError(`Mixin validation failed: ${errors.join(', ')}`, construct);
        }
        mixin.applyTo(construct);
        applied = true;
      }
    }
    if (!applied) {
      throw new ValidationError(`Mixin ${mixin.constructor.name} could not be applied to any constructs`, this.scope);
    }
    return this;
  }
}
