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
(Construct.prototype as any).with = function(this: IConstruct, ...mixin: IMixin[]): IConstruct {
  for (const c of this.node.findAll()) {
    for (const m of mixin) {
      if (m.supports(c)) {
        applyMixin(c, m);
      }
    }
  }
  return this;
};
