import type { IConstruct } from 'constructs';
import { AssumptionError } from '../errors';

/**
 * Symbol for accessing jsii runtime information
 *
 * Introduced in jsii 1.19.0, cdk 1.90.0.
 */
const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');

/**
 * Source information on a construct (class fqn and version)
 */
export interface ConstructInfo {
  // !!! Important !!!
  // This is the public contract of what shows up in tree.json
  // We are very unlikely to extend this in future
  // I you need additional details, add them on top of this.

  /**
   * The FQN of the construct.
   */
  readonly fqn: string;
  /**
   * The version of the package the construct belongs to.
   */
  readonly version: string;
}

export function constructInfoFromConstruct(construct: IConstruct): ConstructInfo | undefined {
  const jsiiRuntimeInfo = Object.getPrototypeOf(construct).constructor[JSII_RUNTIME_SYMBOL];
  if (typeof jsiiRuntimeInfo === 'object'
    && jsiiRuntimeInfo !== null
    && typeof jsiiRuntimeInfo.fqn === 'string'
    && typeof jsiiRuntimeInfo.version === 'string') {
    return {
      fqn: jsiiRuntimeInfo.fqn,
      version: jsiiRuntimeInfo.version,
    };
  } else if (jsiiRuntimeInfo) {
    // There is something defined, but doesn't match our expectations. Fail fast and hard.
    throw new AssumptionError(`malformed jsii runtime info for construct: '${construct.node.path}'`);
  }
  return undefined;
}
