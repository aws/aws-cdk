import type { IConstruct } from 'constructs';
import { Stack } from '../stack';
import type { ConstructInfo } from './runtime-info';
import { constructInfoFromConstruct } from './runtime-info';
import { App } from '../app';
import { RESOURCE_SYMBOL } from '../constants';
import { MetadataType } from '../metadata-type';
import type { Resource } from '../resource';
import { Stage } from '../stage';
import type { IPolicyValidationPluginBeta1 } from '../validation';
import { ALLOWED_FQN_PREFIXES } from './constants';

// These metadata types are always included
const ALLOWED_METADATA_TYPES: ReadonlySet<MetadataType> = new Set([
  MetadataType.MIXIN,
]);

// These metadata types are included based on a Feature Flag
const ADDITIONAL_TELEMETRY_METADATA_TYPES: ReadonlySet<MetadataType> = new Set([
  MetadataType.CONSTRUCT,
  MetadataType.METHOD,
  MetadataType.FEATURE_FLAG,
]);

/**
 * The analytics metadata for a construct
 */
export interface ConstructAnalytics extends ConstructInfo {
  /**
   * Metadata that is always collected.
   */
  metadata?: unknown[];
  /**
   * Additional telemetry that is conditionally collected based on a feature flag.
   */
  additionalTelemetry?: Record<string, any>[];
}

/**
 * For a given construct scope, walks the tree and finds the runtime info for all constructs within the tree.
 * Returns the unique list of construct analytics present in the stack,
 * as long as the construct fully-qualified names match the defined allow list.
 */
export function constructAnalyticsFromScope(scope: IConstruct): ConstructAnalytics[] {
  const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

  const allConstructInfos = constructsInScope(scope)
    .map(construct => ([construct, constructInfoFromConstruct(construct)] as [IConstruct, ConstructInfo | undefined]))
    .filter((c): c is [IConstruct, ConstructInfo] => {
      const [_, info] = c;
      return isDefined(info) && ALLOWED_FQN_PREFIXES.find(prefix => info.fqn.startsWith(prefix)) != null;
    })
    .map(([construct, info]) => injectAnalytics(construct, info));

  // Adds the jsii runtime as a pseudo construct for reporting purposes.
  allConstructInfos.push({
    fqn: 'jsii-runtime.Runtime',
    version: getJsiiAgentVersion(),
  });

  addValidationPluginInfo(scope, allConstructInfos);

  // Filter out duplicate values and append the metadata information to the array
  const uniqueMap = new Map<string, ConstructAnalytics>();
  allConstructInfos.forEach(info => {
    const key = `${info.fqn}@${info.version}`;
    if (uniqueMap.has(key)) {
      const existingInfo = uniqueMap.get(key);
      if (existingInfo && existingInfo.additionalTelemetry && info.additionalTelemetry) {
        existingInfo.additionalTelemetry.push(...info.additionalTelemetry);
      }
      if (existingInfo && existingInfo.metadata && info.metadata) {
        existingInfo.metadata.push(...info.metadata);
      }
    } else {
      uniqueMap.set(key, info);
    }
  });

  return Array.from(uniqueMap.values());
}

/**
 * Get the analytics metadata for a given construct.
 * Filters the metadata for Construct, Method, and Feature flag metadata.
 */
function injectAnalytics(construct: IConstruct, info: ConstructInfo): ConstructAnalytics {
  const metadata = new Array<unknown>();
  const additionalTelemetry = new Array<Record<string, any>>();

  for (const entry of construct.node.metadata) {
    if (isResource(construct) && ADDITIONAL_TELEMETRY_METADATA_TYPES.has(entry.type as MetadataType)) {
      additionalTelemetry.push(entry.data);
    } else if (ALLOWED_METADATA_TYPES.has(entry.type as MetadataType)) {
      metadata.push(entry.data);
    }
  }

  return {
    ...info,
    metadata: metadata.length ? metadata : undefined,
    additionalTelemetry: additionalTelemetry.length ? additionalTelemetry : undefined,
  };
}

/**
 * Returns all constructs under the parent construct (including the parent),
 * stopping when it reaches a boundary of another stack (e.g., Stack, Stage, NestedStack).
 */
function constructsInScope(construct: IConstruct): IConstruct[] {
  const constructs = [construct];
  construct.node.children
    .filter(child => !Stage.isStage(child) && !Stack.isStack(child))
    .forEach(child => constructs.push(...constructsInScope(child)));
  return constructs;
}

/**
 * Detect the version of the jsii agent
 */
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

/**
 * Add analytics data for any validation plugins that are used.
 * Since validation plugins are not constructs we have to handle them
 * as a special case
 */
function addValidationPluginInfo(scope: IConstruct, allConstructInfos: ConstructInfo[]): void {
  let stage = Stage.of(scope);
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
 * Check whether the given construct is a Resource. Note that this is
 * duplicated function from 'core/lib/resource.ts' to avoid circular
 * dependencies in imports.
 */
function isResource(construct: IConstruct): construct is Resource {
  return construct !== null && typeof(construct) === 'object' && RESOURCE_SYMBOL in construct;
}
