import type { IConstruct } from 'constructs';
import { ValidationError } from 'aws-cdk-lib/core';
import type { IMixin } from './mixins';
import { ConstructSelector, type IConstructSelector } from './selectors';
import { addMetadata } from './private/metadata';

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
  public apply(...mixins: IMixin[]): this {
    const constructs = this.selector.select(this.scope);
    for (const construct of constructs) {
      for (const mixin of mixins) {
        if (mixin.supports(construct)) {
          applyMixin(construct, mixin);
        }
      }
    }
    return this;
  }

  /**
   * Applies a mixin and requires that it be applied to all constructs.
   */
  public mustApply(...mixins: IMixin[]): this {
    const constructs = this.selector.select(this.scope);
    for (const construct of constructs) {
      for (const mixin of mixins) {
        if (!mixin.supports(construct)) {
          throw new ValidationError(`Mixin ${mixin.constructor.name} could not be applied to ${construct.constructor.name} but was requested to.`, this.scope);
        }
        applyMixin(construct, mixin);
      }
    }
    return this;
  }
}

function applyMixin(construct: IConstruct, mixin: IMixin) {
  addMetadata(construct, mixin);
  mixin.applyTo(construct);
}
