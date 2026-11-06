// THIS FILE CANNOT HAVE IMPORTS EXCEPT TYPES AND CONSTANTS
// OTHERWISE WE WILL GET CIRCULAR DEPENDENCY ISSUES
import type { IConstruct, IMixin } from 'constructs';
import { JSII_RUNTIME_SYMBOL } from '../../constants';
import { ALLOWED_FQN_PREFIXES } from '../../private/constants';

const MIXIN_METADATA_KEY = 'aws:cdk:analytics:mixin';

function addMetadata(construct: IConstruct, mixin: IMixin) {
  let reportedValue = '*';
  const fqn = Object.getPrototypeOf(mixin).constructor[JSII_RUNTIME_SYMBOL]?.fqn;
  if (fqn && ALLOWED_FQN_PREFIXES.find(prefix => fqn.startsWith(prefix))) {
    reportedValue = fqn;
  }
  construct.node.addMetadata(MIXIN_METADATA_KEY, { mixin: reportedValue });
}

/**
 * Apply a mixin with metadata
 */
export function applyMixin(construct: IConstruct, mixin: IMixin) {
  addMetadata(construct, mixin);
  mixin.applyTo(construct);
}

/**
 * Canonical internal implementation of `.with()` that also emits metadata
 * Must be separate from MixinApplicator to prevent circular dependency issues
 */
export function withMixins(target: IConstruct, ...mixins: IMixin[]) {
  const allConstructs = target.node.findAll();
  for (const mixin of mixins) {
    for (const construct of allConstructs) {
      if (mixin.supports(construct)) {
        applyMixin(construct, mixin);
      }
    }
  }
  return target;
}
