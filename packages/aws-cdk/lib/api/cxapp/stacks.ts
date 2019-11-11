import cxapi = require('@aws-cdk/cx-api');
import { RegionInfo } from '@aws-cdk/region-info';
import colors = require('colors/safe');
import minimatch = require('minimatch');
import contextproviders = require('../../context-providers');
import { debug, error, print, warning } from '../../logging';
import { Configuration } from '../../settings';
import { flatMap } from '../../util/arrays';
import { ISDK } from '../util/sdk';

/**
 * @returns output directory
 */
type Synthesizer = (aws: ISDK, config: Configuration) => Promise<cxapi.CloudAssembly>;

export interface AppStacksProps {
  /**
   * Whether to be verbose
   *
   * @default false
   */
  verbose?: boolean;

  /**
   * Don't stop on error metadata
   *
   * @default false
   */
  ignoreErrors?: boolean;

  /**
   * Treat warnings in metadata as errors
   *
   * @default false
   */
  strict?: boolean;

  /**
   * Application configuration (settings and context)
   */
  configuration: Configuration;

  /**
   * AWS object (used by synthesizer and contextprovider)
   */
  aws: ISDK;

  /**
   * Callback invoked to synthesize the actual stacks
   */
  synthesizer: Synthesizer;
}

export interface SelectStacksOptions {
  /**
   * Extend the selection to upstread/downstream stacks
   * @default ExtendedStackSelection.None only select the specified stacks.
   */
  extend?: ExtendedStackSelection;

  /**
   * The behavior if if no selectors are privided.
   */
  defaultBehavior: DefaultSelection;
}

export enum DefaultSelection {
  /**
   * Returns an empty selection in case there are no selectors.
   */
  None = 'none',

  /**
   * If the app includes a single stack, returns it. Otherwise throws an exception.
   * This behavior is used by "deploy".
   */
  OnlySingle = 'single',

  /**
   * If no selectors are provided, returns all stacks in the app.
   */
  AllStacks = 'all',
}

/**
 * Routines to get stacks from an app
 *
 * In a class because it shares some global state
 */
export class AppStacks {

  /**
   * Since app execution basically always synthesizes all the stacks,
   * we can invoke it once and cache the response for subsequent calls.
   */
  public assembly?: cxapi.CloudAssembly;

  constructor(private readonly props: AppStacksProps) {}

  /**
   * List all stacks in the CX and return the selected ones
   *
   * It's an error if there are no stacks to select, or if one of the requested parameters
   * refers to a nonexistant stack.
   */
  public async selectStacks(selectors: string[], options: SelectStacksOptions): Promise<cxapi.CloudFormationStackArtifact[]> {
    selectors = selectors.filter(s => s != null); // filter null/undefined

    const stacks = await this.listStacks();
    if (stacks.length === 0) {
      throw new Error('This app contains no stacks');
    }

    if (selectors.length === 0) {
      switch (options.defaultBehavior) {
        case DefaultSelection.AllStacks:
          return stacks;
        case DefaultSelection.None:
          return [];
        case DefaultSelection.OnlySingle:
          if (stacks.length === 1) {
            return stacks;
          } else {
            throw new Error(`Since this app includes more than a single stack, specify which stacks to use (wildcards are supported)\n` +
              `Stacks: ${stacks.map(x => x.id).join(' ')}`);
          }
        default:
          throw new Error(`invalid default behavior: ${options.defaultBehavior}`);
      }
    }

    const allStacks = new Map<string, cxapi.CloudFormationStackArtifact>();
    for (const stack of stacks) {
      allStacks.set(stack.id, stack);
    }

    // For every selector argument, pick stacks from the list.
    const selectedStacks = new Map<string, cxapi.CloudFormationStackArtifact>();
    for (const pattern of selectors) {
      let found = false;

      for (const stack of stacks) {
        if (minimatch(stack.id, pattern) && !selectedStacks.has(stack.id)) {
          selectedStacks.set(stack.id, stack);
          found = true;
        }
      }

      if (!found) {
        throw new Error(`No stack found matching '${pattern}'. Use "list" to print manifest`);
      }
    }

    const extend = options.extend || ExtendedStackSelection.None;
    switch (extend) {
      case ExtendedStackSelection.Downstream:
        includeDownstreamStacks(selectedStacks, allStacks);
        break;
      case ExtendedStackSelection.Upstream:
        includeUpstreamStacks(selectedStacks, allStacks);
        break;
    }

    // Filter original array because it is in the right order
    const selectedList = stacks.filter(s => selectedStacks.has(s.id));

    return selectedList;
  }

  /**
   * Return all stacks in the CX
   *
   * If the stacks have dependencies between them, they will be returned in
   * topologically sorted order. If there are dependencies that are not in the
   * set, they will be ignored; it is the user's responsibility that the
   * non-selected stacks have already been deployed previously.
   */
  public async listStacks(): Promise<cxapi.CloudFormationStackArtifact[]> {
    const response = await this.synthesizeStacks();
    return response.stacks;
  }

  /**
   * Synthesize a single stack
   */
  public async synthesizeStack(stackId: string): Promise<cxapi.CloudFormationStackArtifact> {
    const resp = await this.synthesizeStacks();
    const stack = resp.getStackArtifact(stackId);
    return stack;
  }

  /**
   * Synthesize a set of stacks
   */
  public async synthesizeStacks(): Promise<cxapi.CloudAssembly> {
    if (this.assembly) {
      return this.assembly;
    }

    const trackVersions: boolean = this.props.configuration.settings.get(['versionReporting']);

    // We may need to run the cloud executable multiple times in order to satisfy all missing context
    let previouslyMissingKeys: Set<string> | undefined;
    while (true) {
      const assembly = await this.props.synthesizer(this.props.aws, this.props.configuration);

      if (assembly.manifest.missing) {
        const missingKeys = missingContextKeys(assembly.manifest.missing);

        let tryLookup = true;
        if (previouslyMissingKeys && setsEqual(missingKeys, previouslyMissingKeys)) {
          debug(`Not making progress trying to resolve environmental context. Giving up.`);
          tryLookup = false;
        }

        previouslyMissingKeys = missingKeys;

        if (tryLookup) {
          debug(`Some context information is missing. Fetching...`);

          await contextproviders.provideContextValues(assembly.manifest.missing, this.props.configuration.context, this.props.aws);

          // Cache the new context to disk
          await this.props.configuration.saveContext();

          // Execute again
          continue;
        }
      }

      if (trackVersions && assembly.runtime) {
        const modules = formatModules(assembly.runtime);
        for (const stack of assembly.stacks) {
          if (!stack.template.Resources) {
            stack.template.Resources = {};
          }
          const resourcePresent = stack.environment.region === cxapi.UNKNOWN_REGION
            || RegionInfo.get(stack.environment.region).cdkMetadataResourceAvailable;
          if (resourcePresent) {
            if (!stack.template.Resources.CDKMetadata) {
              stack.template.Resources.CDKMetadata = {
                Type: 'AWS::CDK::Metadata',
                Properties: {
                  Modules: modules
                }
              };
              if (stack.environment.region === cxapi.UNKNOWN_REGION) {
                stack.template.Conditions = stack.template.Conditions || {};
                const condName = 'CDKMetadataAvailable';
                if (!stack.template.Conditions[condName]) {
                  stack.template.Conditions[condName] = _makeCdkMetadataAvailableCondition();
                  stack.template.Resources.CDKMetadata.Condition = condName;
                } else {
                  warning(`The stack ${stack.id} already includes a ${condName} condition`);
                }
              }
            } else {
              warning(`The stack ${stack.id} already includes a CDKMetadata resource`);
            }
          }
        }
      }

      // All good, return
      this.assembly = assembly;
      return assembly;

      function formatModules(runtime: cxapi.RuntimeInfo): string {
        const modules = new Array<string>();

        // inject toolkit version to list of modules
        const toolkitVersion = require('../../../package.json').version;
        modules.push(`aws-cdk=${toolkitVersion}`);

        for (const key of Object.keys(runtime.libraries).sort()) {
          modules.push(`${key}=${runtime.libraries[key]}`);
        }
        return modules.join(',');
      }
    }
  }

  /**
   * @returns an array with the tags available in the stack metadata.
   */
  public getTagsFromStackMetadata(stack: cxapi.CloudFormationStackArtifact): Tag[] {
    return flatMap(stack.findMetadataByType(cxapi.STACK_TAGS_METADATA_KEY), x => x.data);
  }

  /**
   * Extracts 'aws:cdk:warning|info|error' metadata entries from the stack synthesis
   */
  public processMetadata(stacks: cxapi.CloudFormationStackArtifact[]) {
    let warnings = false;
    let errors = false;

    for (const stack of stacks) {
      for (const message of stack.messages) {
        switch (message.level) {
          case cxapi.SynthesisMessageLevel.WARNING:
            warnings = true;
            this.printMessage(warning, 'Warning', message.id, message.entry);
            break;
          case cxapi.SynthesisMessageLevel.ERROR:
            errors = true;
            this.printMessage(error, 'Error', message.id, message.entry);
            break;
          case cxapi.SynthesisMessageLevel.INFO:
            this.printMessage(print, 'Info', message.id, message.entry);
            break;
        }
      }
    }

    if (errors && !this.props.ignoreErrors) {
      throw new Error('Found errors');
    }

    if (this.props.strict && warnings) {
      throw new Error('Found warnings (--strict mode)');
    }
  }

  private printMessage(logFn: (s: string) => void, prefix: string, id: string, entry: cxapi.MetadataEntry) {
    logFn(`[${prefix} at ${id}] ${entry.data}`);

    if (this.props.verbose && entry.trace) {
      logFn(`  ${entry.trace.join('\n  ')}`);
    }
  }
}

/**
 * Combine the names of a set of stacks using a comma
 */
export function listStackIds(stacks: cxapi.CloudFormationStackArtifact[]): string {
  return stacks.map(s => s.id).join(', ');
}

/**
 * When selecting stacks, what other stacks to include because of dependencies
 */
export enum ExtendedStackSelection {
  /**
   * Don't select any extra stacks
   */
  None,

  /**
   * Include stacks that this stack depends on
   */
  Upstream,

  /**
   * Include stacks that depend on this stack
   */
  Downstream
}

/**
 * Include stacks that depend on the stacks already in the set
 *
 * Modifies `selectedStacks` in-place.
 */
function includeDownstreamStacks(
    selectedStacks: Map<string, cxapi.CloudFormationStackArtifact>,
    allStacks: Map<string, cxapi.CloudFormationStackArtifact>) {
  const added = new Array<string>();

  let madeProgress = true;
  while (madeProgress) {
    madeProgress = false;

    for (const [id, stack] of allStacks) {
      // Select this stack if it's not selected yet AND it depends on a stack that's in the selected set
      if (!selectedStacks.has(id) && (stack.dependencies || []).some(dep => selectedStacks.has(dep.id))) {
        selectedStacks.set(id, stack);
        added.push(id);
        madeProgress = true;
      }
    }
  }

  if (added.length > 0) {
    print('Including depending stacks: %s', colors.bold(added.join(', ')));
  }
}

/**
 * Include stacks that that stacks in the set depend on
 *
 * Modifies `selectedStacks` in-place.
 */
function includeUpstreamStacks(
    selectedStacks: Map<string, cxapi.CloudFormationStackArtifact>,
    allStacks: Map<string, cxapi.CloudFormationStackArtifact>) {
  const added = new Array<string>();
  let madeProgress = true;
  while (madeProgress) {
    madeProgress = false;

    for (const stack of selectedStacks.values()) {
      // Select an additional stack if it's not selected yet and a dependency of a selected stack (and exists, obviously)
      for (const dependencyId of stack.dependencies.map(x => x.id)) {
        if (!selectedStacks.has(dependencyId) && allStacks.has(dependencyId)) {
          added.push(dependencyId);
          selectedStacks.set(dependencyId, allStacks.get(dependencyId)!);
          madeProgress = true;
        }
      }
    }
  }

  if (added.length > 0) {
    print('Including dependency stacks: %s', colors.bold(added.join(', ')));
  }
}

export interface SelectedStack extends cxapi.CloudFormationStackArtifact {
  /**
   * The original name of the stack before renaming
   */
  originalName: string;
}

export interface Tag {
  readonly Key: string;
  readonly Value: string;
}

/**
 * Return all keys of misisng context items
 */
function missingContextKeys(missing?: cxapi.MissingContext[]): Set<string> {
  return new Set((missing || []).map(m => m.key));
}

function setsEqual<A>(a: Set<A>, b: Set<A>) {
  if (a.size !== b.size) { return false; }
  for (const x of a) {
    if (!b.has(x)) { return false; }
  }
  return true;
}

function _makeCdkMetadataAvailableCondition() {
  return _fnOr(RegionInfo.regions
    .filter(ri => ri.cdkMetadataResourceAvailable)
    .map(ri => ({ 'Fn::Equals': [{ Ref: 'AWS::Region' }, ri.name] })));
}

/**
 * This takes a bunch of operands and crafts an `Fn::Or` for those. Funny thing is `Fn::Or` requires
 * at least 2 operands and at most 10 operands, so we have to... do this.
 */
function _fnOr(operands: any[]): any {
  if (operands.length === 0) {
    throw new Error('Cannot build `Fn::Or` with zero operands!');
  }
  if (operands.length === 1) {
    return operands[0];
  }
  if (operands.length <= 10) {
    return { 'Fn::Or': operands };
  }
  return _fnOr(_inGroupsOf(operands, 10).map(group => _fnOr(group)));
}

function _inGroupsOf<T>(array: T[], maxGroup: number): T[][] {
  const result = new Array<T[]>();
  for (let i = 0; i < array.length; i += maxGroup) {
    result.push(array.slice(i, i + maxGroup));
  }
  return result;
}
