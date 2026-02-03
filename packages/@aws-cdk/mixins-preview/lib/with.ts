import type { IConstruct } from 'constructs';
import { Construct } from 'constructs';
import type { IMixin } from './core';
import { applyMixin } from './core/private/metadata';

declare module 'constructs' {
  interface IConstruct {
    with(...mixin: IMixin[]): this;
  }

  interface Construct {
    with(...mixin: IMixin[]): this;
  }
}

// Hack the prototype to add .with() method
(Construct.prototype as any).with = function(this: IConstruct, ...mixins: IMixin[]): IConstruct {
  const allConstructs = this.node.findAll();
  for (const mixin of mixins) {
    for (const construct of allConstructs) {
      if (mixin.supports(construct)) {
        applyMixin(construct, mixin);
      }
    }
  }
  return this;
};
