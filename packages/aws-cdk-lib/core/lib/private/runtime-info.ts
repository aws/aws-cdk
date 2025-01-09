import { IConstruct, MetadataEntry } from 'constructs';
import { App } from '../app';
import { MetadataType } from '../metadata-resource';
import { Resource } from '../resource';
import { Stack } from '../stack';
import { Stage } from '../stage';
import { IPolicyValidationPluginBeta1 } from '../validation';

const ALLOWED_FQN_PREFIXES = [
  // SCOPES
  '@aws-cdk/', '@aws-cdk-containers/', '@aws-solutions-konstruk/', '@aws-solutions-constructs/', '@amzn/', '@cdklabs/',
  // PACKAGES
  'aws-rfdk.', 'aws-cdk-lib.', 'cdk8s.',
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
  readonly metadata?: Record<string, any>[];
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
      metadata: isResource(construct) ? redactTelemetryData(construct.node.metadata) : undefined,
    };
  } else if (jsiiRuntimeInfo) {
    // There is something defined, but doesn't match our expectations. Fail fast and hard.
    throw new Error(`malformed jsii runtime info for construct: '${construct.node.path}'`);
  }
  return undefined;
}

/**
 * Filter for Construct, Method, and Feature flag metadata. Redact values from it.
 *
 * @param metadata a list of metadata entries
 */
export function redactTelemetryData(metadata: MetadataEntry[]): Record<string, any>[] {
  const validTypes = new Set([
    MetadataType.CONSTRUCT,
    MetadataType.METHOD,
    MetadataType.FEATURE_FLAGS,
  ]);

  return metadata
    .filter((entry) => validTypes.has(entry.type as MetadataType))
    .map((entry) => ({
      type: entry.type,
      data: redactTelemetryDataHelper(entry.data),
    }));
}

/**
 * Redact values from dictionary values other than Boolean and ENUM-type values.
 * @TODO complete the ENUM-type values redaction in a follow-up change.
 */
function redactTelemetryDataHelper(data: any): any {
  if (typeof data === 'boolean') {
    return data; // Return booleans as-is
  }

  if (Array.isArray(data)) {
    // Handle arrays by recursively redacting each element
    return data.map((item) => redactTelemetryDataHelper(item));
  }

  if (data && typeof data === 'object') {
    // Handle objects by iterating over their key-value pairs
    if (isResource(data)) {
      return '*';
    }

    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = redactTelemetryDataHelper(value);
    }
    return result;
  }

  return '*';
}

/**
 * Add analytics data for any validation plugins that are used.
 * Since validation plugins are not constructs we have to handle them
 * as a special case
 */
function addValidationPluginInfo(stack: Stack, allConstructInfos: ConstructInfo[]): void {
  let stage = Stage.of(stack);
  let done = false;
  do {
    if (App.isApp(stage)) {
      done = true;
    }
    if (stage) {
      allConstructInfos.push(...stage.policyValidationBeta1.map(
        plugin => {
          return {
            fqn: pluginFqn(plugin),
            version: plugin.version ?? '0.0.0',
          };
        },
      ));
      stage = Stage.of(stage);
    }
  } while (!done && stage);
}

/**
 * Returns the fully-qualified name for a validation plugin, in the form:
 *
 *     policyValidation.<plugin-name>[.<rule-ids>]
 *
 * where <rule-ids> is a pipe-separated list of rule IDs.
 */
function pluginFqn(plugin: IPolicyValidationPluginBeta1): string {
  let components = [
    'policyValidation',
    plugin.name,
    plugin.ruleIds?.join('|'),
  ];

  return components
    .filter(x => x != null)
    .join('.');
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

  addValidationPluginInfo(stack, allConstructInfos);

  // Filter out duplicate values and append the metadata information to the array
  const uniqueMap = new Map<string, ConstructInfo>();
  allConstructInfos.forEach(info => {
    const key = `${info.fqn}@${info.version}`;
    if (uniqueMap.has(key)) {
      const existingInfo = uniqueMap.get(key);
      if (existingInfo && existingInfo.metadata && info.metadata) {
        existingInfo.metadata.push(...info.metadata);
      }
    } else {
      uniqueMap.set(key, info);
    }
  });

  return Array.from(uniqueMap.values());
}

function isResource(construct: IConstruct): construct is Resource {
  const RESOURCE_SYMBOL = Symbol.for('@aws-cdk/core.Resource');
  return construct !== null && typeof(construct) === 'object' && RESOURCE_SYMBOL in construct;
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
