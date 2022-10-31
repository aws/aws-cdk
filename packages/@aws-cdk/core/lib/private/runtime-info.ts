import { IConstruct } from 'constructs';
import { Stack } from '../stack';
import { Stage } from '../stage';

const ALLOWED_FQN_PREFIXES = [
  // SCOPES
  '@aws-cdk/', '@aws-cdk-containers/', '@aws-solutions-konstruk/', '@aws-solutions-constructs/', '@amzn/', '@cdklabs/',
  // PACKAGES
  'aws-rfdk.', 'aws-cdk-lib.', 'monocdk.',
];

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
  readonly fqn: string;
  readonly version: string;
}

export function constructInfoFromConstruct(construct: IConstruct): ConstructInfo | undefined {
  const jsiiRuntimeInfo = Object.getPrototypeOf(construct).constructor[JSII_RUNTIME_SYMBOL];
  if (typeof jsiiRuntimeInfo === 'object'
    && jsiiRuntimeInfo !== null
    && typeof jsiiRuntimeInfo.fqn === 'string'
    && typeof jsiiRuntimeInfo.version === 'string') {
    return { fqn: jsiiRuntimeInfo.fqn, version: jsiiRuntimeInfo.version };
  } else if (jsiiRuntimeInfo) {
    // There is something defined, but doesn't match our expectations. Fail fast and hard.
    throw new Error(`malformed jsii runtime info for construct: '${construct.node.path}'`);
  }
  return undefined;
}

/**
 * For a given stack, walks the tree and finds the runtime info for all constructs within the tree.
 * Returns the unique list of construct info present in the stack,
 * as long as the construct fully-qualified names match the defined allow list.
 */
export function constructInfoFromStack(stack: Stack): ConstructInfo[] {
  const isDefined = (value: ConstructInfo | undefined): value is ConstructInfo => value !== undefined;

  const allConstructInfos = constructsInStack(stack)
    .map(construct => constructInfoFromConstruct(construct))
    .filter(isDefined)
    .filter(info => ALLOWED_FQN_PREFIXES.find(prefix => info.fqn.startsWith(prefix)));

  // Adds the jsii runtime as a psuedo construct for reporting purposes.
  allConstructInfos.push({
    fqn: 'jsii-runtime.Runtime',
    version: getJsiiAgentVersion(),
  });

  // Filter out duplicate values
  const uniqKeys = new Set();
  return allConstructInfos.filter(construct => {
    const constructKey = `${construct.fqn}@${construct.version}`;
    const isDuplicate = uniqKeys.has(constructKey);
    uniqKeys.add(constructKey);
    return !isDuplicate;
  });
}

/**
 * Returns all constructs under the parent construct (including the parent),
 * stopping when it reaches a boundary of another stack (e.g., Stack, Stage, NestedStack).
 */
function constructsInStack(construct: IConstruct): IConstruct[] {
  const constructs = [construct];
  construct.node.children
    .filter(child => !Stage.isStage(child) && !Stack.isStack(child))
    .forEach(child => constructs.push(...constructsInStack(child)));
  return constructs;
}

function getJsiiAgentVersion() {
  let jsiiAgent = process.env.JSII_AGENT;

  // if JSII_AGENT is not specified, we will assume this is a node.js runtime
  // and plug in our node.js version
  if (!jsiiAgent) {
    jsiiAgent = `node.js/${process.version}`;
  }

  // Sanitize the agent to remove characters which might mess with the downstream
  // prefix encoding & decoding. In particular the .NET jsii agent takes a form like:
  // DotNet/5.0.3/.NETCoreApp,Version=v3.1/1.0.0.0
  // The `,` in the above messes with the prefix decoding when reporting the analytics.
  jsiiAgent = jsiiAgent.replace(/[^a-z0-9.-/=_]/gi, '-');

  return jsiiAgent;
}
