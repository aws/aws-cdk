import type * as cxapi from '@aws-cdk/cx-api';
import { SynthesisMessageLevel } from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import { minimatch } from 'minimatch';
import * as semver from 'semver';
import { info } from '../../logging';
import { AssemblyError, ToolkitError } from '../../toolkit/error';
import { flatten } from '../../util';

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
   * Returns all stacks in the main (top level) assembly only.
   */
  MainAssembly = 'main',

  /**
   * If no selectors are provided, returns all stacks in the app,
   * including stacks inside nested assemblies.
   */
  AllStacks = 'all',
}

export interface SelectStacksOptions {
  /**
   * Extend the selection to upstread/downstream stacks
   * @default ExtendedStackSelection.None only select the specified stacks.
   */
  extend?: ExtendedStackSelection;

  /**
   * The behavior if no selectors are provided.
   */
  defaultBehavior: DefaultSelection;

  /**
   * Whether to deploy if the app contains no stacks.
   *
   * @default false
   */
  ignoreNoStacks?: boolean;
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
  Downstream,
}

/**
 * A specification of which stacks should be selected
 */
export interface StackSelector {
  /**
   * Whether all stacks at the top level assembly should
   * be selected and nothing else
   */
  allTopLevel?: boolean;

  /**
   * A list of patterns to match the stack hierarchical ids
   */
  patterns: string[];
}

/**
 * A single Cloud Assembly and the operations we do on it to deploy the artifacts inside
 */
export class CloudAssembly {
  /**
   * The directory this CloudAssembly was read from
   */
  public readonly directory: string;

  constructor(public readonly assembly: cxapi.CloudAssembly) {
    this.directory = assembly.directory;
  }

  public async selectStacks(selector: StackSelector, options: SelectStacksOptions): Promise<StackCollection> {
    const asm = this.assembly;
    const topLevelStacks = asm.stacks;
    const stacks = semver.major(asm.version) < 10 ? asm.stacks : asm.stacksRecursively;
    const allTopLevel = selector.allTopLevel ?? false;
    const patterns = sanitizePatterns(selector.patterns);

    if (stacks.length === 0) {
      if (options.ignoreNoStacks) {
        return new StackCollection(this, []);
      }
      throw new ToolkitError('This app contains no stacks');
    }

    if (allTopLevel) {
      return this.selectTopLevelStacks(stacks, topLevelStacks, options.extend);
    } else if (patterns.length > 0) {
      return this.selectMatchingStacks(stacks, patterns, options.extend);
    } else {
      return this.selectDefaultStacks(stacks, topLevelStacks, options.defaultBehavior);
    }
  }

  private selectTopLevelStacks(
    stacks: cxapi.CloudFormationStackArtifact[],
    topLevelStacks: cxapi.CloudFormationStackArtifact[],
    extend: ExtendedStackSelection = ExtendedStackSelection.None,
  ): StackCollection {
    if (topLevelStacks.length > 0) {
      return this.extendStacks(topLevelStacks, stacks, extend);
    } else {
      throw new ToolkitError('No stack found in the main cloud assembly. Use "list" to print manifest');
    }
  }

  protected selectMatchingStacks(
    stacks: cxapi.CloudFormationStackArtifact[],
    patterns: string[],
    extend: ExtendedStackSelection = ExtendedStackSelection.None,
  ): StackCollection {

    const matchingPattern = (pattern: string) => (stack: cxapi.CloudFormationStackArtifact) => minimatch(stack.hierarchicalId, pattern);
    const matchedStacks = flatten(patterns.map(pattern => stacks.filter(matchingPattern(pattern))));

    return this.extendStacks(matchedStacks, stacks, extend);
  }

  private selectDefaultStacks(
    stacks: cxapi.CloudFormationStackArtifact[],
    topLevelStacks: cxapi.CloudFormationStackArtifact[],
    defaultSelection: DefaultSelection,
  ) {
    switch (defaultSelection) {
      case DefaultSelection.MainAssembly:
        return new StackCollection(this, topLevelStacks);
      case DefaultSelection.AllStacks:
        return new StackCollection(this, stacks);
      case DefaultSelection.None:
        return new StackCollection(this, []);
      case DefaultSelection.OnlySingle:
        if (topLevelStacks.length === 1) {
          return new StackCollection(this, topLevelStacks);
        } else {
          throw new ToolkitError('Since this app includes more than a single stack, specify which stacks to use (wildcards are supported) or specify `--all`\n' +
          `Stacks: ${stacks.map(x => x.hierarchicalId).join(' · ')}`);
        }
      default:
        throw new ToolkitError(`invalid default behavior: ${defaultSelection}`);
    }
  }

  protected extendStacks(
    matched: cxapi.CloudFormationStackArtifact[],
    all: cxapi.CloudFormationStackArtifact[],
    extend: ExtendedStackSelection = ExtendedStackSelection.None,
  ) {
    const allStacks = new Map<string, cxapi.CloudFormationStackArtifact>();
    for (const stack of all) {
      allStacks.set(stack.hierarchicalId, stack);
    }

    const index = indexByHierarchicalId(matched);

    switch (extend) {
      case ExtendedStackSelection.Downstream:
        includeDownstreamStacks(index, allStacks);
        break;
      case ExtendedStackSelection.Upstream:
        includeUpstreamStacks(index, allStacks);
        break;
    }

    // Filter original array because it is in the right order
    const selectedList = all.filter(s => index.has(s.hierarchicalId));

    return new StackCollection(this, selectedList);
  }

  /**
   * Select a single stack by its ID
   */
  public stackById(stackId: string) {
    return new StackCollection(this, [this.assembly.getStackArtifact(stackId)]);
  }
}

/**
 * The dependencies of a stack.
 */
export type StackDependency = {
  id: string;
  dependencies: StackDependency[];
};

/**
 * Details of a stack.
 */
export type StackDetails = {
  id: string;
  name: string;
  environment: cxapi.Environment;
  dependencies: StackDependency[];
};

/**
 * A collection of stacks and related artifacts
 *
 * In practice, not all artifacts in the CloudAssembly are created equal;
 * stacks can be selected independently, but other artifacts such as asset
 * bundles cannot.
 */
export class StackCollection {
  constructor(public readonly assembly: CloudAssembly, public readonly stackArtifacts: cxapi.CloudFormationStackArtifact[]) {
  }

  public get stackCount() {
    return this.stackArtifacts.length;
  }

  public get firstStack() {
    if (this.stackCount < 1) {
      throw new ToolkitError('StackCollection contains no stack artifacts (trying to access the first one)');
    }
    return this.stackArtifacts[0];
  }

  public get stackIds(): string[] {
    return this.stackArtifacts.map(s => s.id);
  }

  public get hierarchicalIds(): string[] {
    return this.stackArtifacts.map(s => s.hierarchicalId);
  }

  public withDependencies(): StackDetails[] {
    const allData: StackDetails[] = [];

    for (const stack of this.stackArtifacts) {
      const data: StackDetails = {
        id: stack.displayName ?? stack.id,
        name: stack.stackName,
        environment: stack.environment,
        dependencies: [],
      };

      for (const dependencyId of stack.dependencies.map(x => x.id)) {
        if (dependencyId.includes('.assets')) {
          continue;
        }

        const depStack = this.assembly.stackById(dependencyId);

        if (depStack.firstStack.dependencies.filter((dep) => !(dep.id).includes('.assets')).length > 0) {
          for (const stackDetail of depStack.withDependencies()) {
            data.dependencies.push({
              id: stackDetail.id,
              dependencies: stackDetail.dependencies,
            });
          }
        } else {
          data.dependencies.push({
            id: depStack.firstStack.displayName ?? depStack.firstStack.id,
            dependencies: [],
          });
        }
      }

      allData.push(data);
    }

    return allData;
  }

  public reversed() {
    const arts = [...this.stackArtifacts];
    arts.reverse();
    return new StackCollection(this.assembly, arts);
  }

  public filter(predicate: (art: cxapi.CloudFormationStackArtifact) => boolean): StackCollection {
    return new StackCollection(this.assembly, this.stackArtifacts.filter(predicate));
  }

  public concat(...others: StackCollection[]): StackCollection {
    return new StackCollection(this.assembly, this.stackArtifacts.concat(...others.map(o => o.stackArtifacts)));
  }

  /**
   * Extracts 'aws:cdk:warning|info|error' metadata entries from the stack synthesis
   */
  public async validateMetadata(
    failAt: 'warn' | 'error' | 'none' = 'error',
    logger: (level: 'info' | 'error' | 'warn', msg: cxapi.SynthesisMessage) => Promise<void> = async () => {},
  ) {
    let warnings = false;
    let errors = false;

    for (const stack of this.stackArtifacts) {
      for (const message of stack.messages) {
        switch (message.level) {
          case SynthesisMessageLevel.WARNING:
            warnings = true;
            await logger('warn', message);
            break;
          case SynthesisMessageLevel.ERROR:
            errors = true;
            await logger('error', message);
            break;
          case SynthesisMessageLevel.INFO:
            await logger('info', message);
            break;
        }
      }
    }

    if (errors && failAt != 'none') {
      throw new AssemblyError('Found errors');
    }

    if (warnings && failAt === 'warn') {
      throw new AssemblyError('Found warnings (--strict mode)');
    }
  }
}

export interface MetadataMessageOptions {
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
}

function indexByHierarchicalId(stacks: cxapi.CloudFormationStackArtifact[]): Map<string, cxapi.CloudFormationStackArtifact> {
  const result = new Map<string, cxapi.CloudFormationStackArtifact>();

  for (const stack of stacks) {
    result.set(stack.hierarchicalId, stack);
  }

  return result;
}

/**
 * Calculate the transitive closure of stack dependents.
 *
 * Modifies `selectedStacks` in-place.
 */
function includeDownstreamStacks(
  selectedStacks: Map<string, cxapi.CloudFormationStackArtifact>,
  allStacks: Map<string, cxapi.CloudFormationStackArtifact>) {
  const added = new Array<string>();

  let madeProgress;
  do {
    madeProgress = false;

    for (const [id, stack] of allStacks) {
      // Select this stack if it's not selected yet AND it depends on a stack that's in the selected set
      if (!selectedStacks.has(id) && (stack.dependencies || []).some(dep => selectedStacks.has(dep.id))) {
        selectedStacks.set(id, stack);
        added.push(id);
        madeProgress = true;
      }
    }
  } while (madeProgress);

  if (added.length > 0) {
    info('Including depending stacks: %s', chalk.bold(added.join(', ')));
  }
}

/**
 * Calculate the transitive closure of stack dependencies.
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
      for (const dependencyId of stack.dependencies.map(x => x.manifest.displayName ?? x.id)) {
        if (!selectedStacks.has(dependencyId) && allStacks.has(dependencyId)) {
          added.push(dependencyId);
          selectedStacks.set(dependencyId, allStacks.get(dependencyId)!);
          madeProgress = true;
        }
      }
    }
  }

  if (added.length > 0) {
    info('Including dependency stacks: %s', chalk.bold(added.join(', ')));
  }
}

export function sanitizePatterns(patterns: string[]): string[] {
  let sanitized = patterns.filter(s => s != null); // filter null/undefined
  sanitized = [...new Set(sanitized)]; // make them unique
  return sanitized;
}
