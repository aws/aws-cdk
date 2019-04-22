import cxapi = require('@aws-cdk/cx-api');
import regionInfo = require('@aws-cdk/region-info');
import colors = require('colors/safe');
import minimatch = require('minimatch');
import contextproviders = require('../../context-providers');
import { debug, error, print, warning } from '../../logging';
import { Renames } from '../../renames';
import { Configuration } from '../../settings';
import cdkUtil = require('../../util');
import { SDK } from '../util/sdk';
import { topologicalSort } from '../util/toposort';

type Synthesizer = (aws: SDK, config: Configuration) => Promise<cxapi.SynthesizeResponse>;

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
  aws: SDK;

  /**
   * Renames to apply
   */
  renames?: Renames;

  /**
   * Callback invoked to synthesize the actual stacks
   */
  synthesizer: Synthesizer;
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
  private cachedResponse?: cxapi.SynthesizeResponse;
  private readonly renames: Renames;

  constructor(private readonly props: AppStacksProps) {
    this.renames = props.renames || new Renames({});
  }

  /**
   * List all stacks in the CX and return the selected ones
   *
   * It's an error if there are no stacks to select, or if one of the requested parameters
   * refers to a nonexistant stack.
   */
  public async selectStacks(selectors: string[], extendedSelection: ExtendedStackSelection): Promise<SelectedStack[]> {
    selectors = selectors.filter(s => s != null); // filter null/undefined

    const stacks: cxapi.SynthesizedStack[] = await this.listStacks();
    if (stacks.length === 0) {
      throw new Error('This app contains no stacks');
    }

    if (selectors.length === 0) {
      // remove non-auto deployed Stacks
      const autoDeployedStacks = stacks.filter(s => s.autoDeploy !== false);
      debug('Stack name not specified, so defaulting to all available stacks: ' + listStackNames(autoDeployedStacks));
      return this.applyRenames(autoDeployedStacks);
    }

    const allStacks = new Map<string, cxapi.SynthesizedStack>();
    for (const stack of stacks) {
      allStacks.set(stack.name, stack);
    }

    // For every selector argument, pick stacks from the list.
    const selectedStacks = new Map<string, cxapi.SynthesizedStack>();
    for (const pattern of selectors) {
      let found = false;

      for (const stack of stacks) {
        if (minimatch(stack.name, pattern) && !selectedStacks.has(stack.name)) {
          selectedStacks.set(stack.name, stack);
          found = true;
        }
      }

      if (!found) {
        throw new Error(`No stack found matching '${pattern}'. Use "list" to print manifest`);
      }
    }

    switch (extendedSelection) {
      case ExtendedStackSelection.Downstream:
        includeDownstreamStacks(selectedStacks, allStacks);
        break;
      case ExtendedStackSelection.Upstream:
        includeUpstreamStacks(selectedStacks, allStacks);
        break;
    }

    // Filter original array because it is in the right order
    const selectedList = stacks.filter(s => selectedStacks.has(s.name));

    // Only check selected stacks for errors
    this.processMessages(selectedList);
    return this.applyRenames(selectedList);
  }

  /**
   * Return all stacks in the CX
   *
   * If the stacks have dependencies between them, they will be returned in
   * topologically sorted order. If there are dependencies that are not in the
   * set, they will be ignored; it is the user's responsibility that the
   * non-selected stacks have already been deployed previously.
   *
   * Renames are *NOT* applied in list mode.
   */
  public async listStacks(): Promise<cxapi.SynthesizedStack[]> {
    const response = await this.synthesizeStacks();
    return topologicalSort(response.stacks, s => s.name, s => s.dependsOn || []);
  }

  /**
   * Synthesize a single stack
   */
  public async synthesizeStack(stackName: string): Promise<SelectedStack> {
    const resp = await this.synthesizeStacks();
    const stack = resp.stacks.find(s => s.name === stackName);
    if (!stack) {
      throw new Error(`Stack ${stackName} not found`);
    }
    return this.applyRenames([stack])[0];
  }

  /**
   * Synthesize a set of stacks
   */
  public async synthesizeStacks(): Promise<cxapi.SynthesizeResponse> {
    if (this.cachedResponse) {
      return this.cachedResponse;
    }

    const trackVersions: boolean = this.props.configuration.settings.get(['versionReporting']);

    // We may need to run the cloud executable multiple times in order to satisfy all missing context
    while (true) {
      const response: cxapi.SynthesizeResponse = await this.props.synthesizer(this.props.aws, this.props.configuration);
      const allMissing = cdkUtil.deepMerge(...response.stacks.map(s => s.missing));

      if (!cdkUtil.isEmpty(allMissing)) {
        debug(`Some context information is missing. Fetching...`);

        await contextproviders.provideContextValues(allMissing, this.props.configuration.context, this.props.aws);

        // Cache the new context to disk
        await this.props.configuration.saveContext();

        continue;
      }

      if (trackVersions && response.runtime) {
        const modules = formatModules(response.runtime);
        for (const stack of response.stacks) {
          if (!stack.template.Resources) {
            stack.template.Resources = {};
          }
          const resourcePresent = stack.environment.region === 'default-region'
            || regionInfo.Fact.find(stack.environment.region, regionInfo.FactName.cdkMetadataResourceAvailable) === 'YES';
          if (resourcePresent) {
            if (!stack.template.Resources.CDKMetadata) {
              stack.template.Resources.CDKMetadata = {
                Type: 'AWS::CDK::Metadata',
                Properties: {
                  Modules: modules
                }
              };
            } else {
              warning(`The stack ${stack.name} already includes a CDKMetadata resource`);
            }
          }
        }
      }

      // All good, return
      this.cachedResponse = response;
      return response;

      function formatModules(runtime: cxapi.AppRuntime): string {
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

  public getTagsFromStackMetadata(stack: SelectedStack): Tag[] {
    const tags = [];
    for (const id of Object.keys(stack.metadata)) {
      const metadata = stack.metadata[id];
      for (const entry of metadata) {
        if (entry.type === cxapi.TAGS_METADATA_KEY) {
          for (const tag of entry.data) {
            tags.push(tag);
          }
        }
      }
    }
    return tags;
  }

  /**
   * Extracts 'aws:cdk:warning|info|error' metadata entries from the stack synthesis
   */
  private processMessages(stacks: cxapi.SynthesizedStack[]) {
    let warnings = false;
    let errors = false;
    for (const stack of stacks) {
      for (const id of Object.keys(stack.metadata)) {
        const metadata = stack.metadata[id];
        for (const entry of metadata) {
          switch (entry.type) {
            case cxapi.WARNING_METADATA_KEY:
              warnings = true;
              this.printMessage(warning, 'Warning', id, entry);
              break;
            case cxapi.ERROR_METADATA_KEY:
              errors = true;
              this.printMessage(error, 'Error', id, entry);
              break;
            case cxapi.INFO_METADATA_KEY:
              this.printMessage(print, 'Info', id, entry);
              break;
          }
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

    if (this.props.verbose) {
      logFn(`  ${entry.trace.join('\n  ')}`);
    }
  }

  private applyRenames(stacks: cxapi.SynthesizedStack[]): SelectedStack[] {
    this.renames.validateSelectedStacks(stacks);

    const ret = [];
    for (const stack of stacks) {
      ret.push({
        ...stack,
        originalName: stack.name,
        name: this.renames.finalName(stack.name),
      });
    }

    return ret;
  }
}

/**
 * Combine the names of a set of stacks using a comma
 */
export function listStackNames(stacks: cxapi.SynthesizedStack[]): string {
  return stacks.map(s => s.name).join(', ');
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
function includeDownstreamStacks(selectedStacks: Map<string, cxapi.SynthesizedStack>, allStacks: Map<string, cxapi.SynthesizedStack>) {
  const added = new Array<string>();

  let madeProgress = true;
  while (madeProgress) {
    madeProgress = false;

    for (const [name, stack] of allStacks) {
      // Select this stack if it's not selected yet AND it depends on a stack that's in the selected set
      if (!selectedStacks.has(name) && (stack.dependsOn || []).some(dependencyName => selectedStacks.has(dependencyName))) {
        selectedStacks.set(name, stack);
        added.push(name);
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
function includeUpstreamStacks(selectedStacks: Map<string, cxapi.SynthesizedStack>, allStacks: Map<string, cxapi.SynthesizedStack>) {
  const added = new Array<string>();
  let madeProgress = true;
  while (madeProgress) {
    madeProgress = false;

    for (const stack of selectedStacks.values()) {
      // Select an additional stack if it's not selected yet and a dependency of a selected stack (and exists, obviously)
      for (const dependencyName of (stack.dependsOn || [])) {
        if (!selectedStacks.has(dependencyName) && allStacks.has(dependencyName)) {
          added.push(dependencyName);
          selectedStacks.set(dependencyName, allStacks.get(dependencyName)!);
          madeProgress = true;
        }
      }
    }
  }

  if (added.length > 0) {
    print('Including dependency stacks: %s', colors.bold(added.join(', ')));
  }
}

export interface SelectedStack extends cxapi.SynthesizedStack {
  /**
   * The original name of the stack before renaming
   */
  originalName: string;
}

export interface Tag {
  readonly Key: string;
  readonly Value: string;
}
