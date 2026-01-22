import type { IConstruct } from 'constructs';
import { IMixin } from '../mixins';

const MIXIN_METADATA_KEY = 'aws:cdk:analytics:mixin';
const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');

export function addMetadata(construct: IConstruct, mixin: IMixin) {
  const fqn = Object.getPrototypeOf(mixin).constructor[JSII_RUNTIME_SYMBOL]?.fqn;
  if (fqn) {
    construct.node.addMetadata(MIXIN_METADATA_KEY, { mixin: fqn });
  }
}
