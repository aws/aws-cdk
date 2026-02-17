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
// Changed the loop order so that mixins are applied in order.
// The list of constructs is now captured at the start of the call,
// ensuring that constructs added by a mixin will not be visited by subsequent mixins.
//
// This code is a hard copy of code from this PR https://github.com/aws/constructs/pull/2843
// and is intended to be removed once the code is available in upstream.
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
