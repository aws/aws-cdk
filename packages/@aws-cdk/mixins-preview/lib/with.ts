import type { IConstruct } from 'constructs';
import { Construct } from 'constructs';
import type { IMixin } from './core';
import { Mixins, ConstructSelector } from './core';

declare module 'constructs' {
  interface IConstruct {
    with(mixin: IMixin): this;
  }

  interface Construct {
    with(mixin: IMixin): this;
  }
}

// Hack the prototype to add .with() method
(Construct.prototype as any).with = function(this: IConstruct, mixin: IMixin): IConstruct {
  Mixins.of(this, ConstructSelector.cfnResource()).mustApply(mixin);
  return this;
};
