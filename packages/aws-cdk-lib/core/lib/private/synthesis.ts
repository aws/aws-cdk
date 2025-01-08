import * as fs from 'fs';
import * as path from 'path';
import { IConstruct } from 'constructs';
import { MetadataResource } from './metadata-resource';
import { prepareApp } from './prepare-app';
import { TreeMetadata } from './tree-metadata';
import { CloudAssembly } from '../../../cx-api';
import * as cxapi from '../../../cx-api';
import { Annotations } from '../annotations';
import { App } from '../app';
import { AspectApplication, AspectPriority, Aspects, IAspect } from '../aspect';
import { FileSystem } from '../fs';
import { Stack } from '../stack';
import { ISynthesisSession } from '../stack-synthesizers/types';
import { Stage, StageSynthesisOptions } from '../stage';
import { IPolicyValidationPluginBeta1 } from '../validation';
import { ConstructTree } from '../validation/private/construct-tree';
import { PolicyValidationReportFormatter, NamedValidationPluginReport } from '../validation/private/report';

const POLICY_VALIDATION_FILE_PATH = 'policy-validation-report.json';
const VALIDATION_REPORT_JSON_CONTEXT = '@aws-cdk/core:validationReportJson';

/**
 * Options for `synthesize()`
 */
export interface SynthesisOptions extends StageSynthesisOptions {
  /**
   * The output directory into which to synthesize the cloud assembly.
   * @default - creates a temporary directory
   */
  readonly outdir?: string;
}

export function synthesize(root: IConstruct, options: SynthesisOptions = { }): cxapi.CloudAssembly {
  // add the TreeMetadata resource to the App first
  injectTreeMetadata(root);
  // we start by calling "synth" on all nested assemblies (which will take care of all their children)
  synthNestedAssemblies(root, options);

  if (options.aspectStabilization == true) {
    invokeAspectsV2(root);
  } else {
    invokeAspects(root);
  }

  injectMetadataResources(root);

  // resolve references
  prepareApp(root);

  // give all children an opportunity to validate now that we've finished prepare
  if (!options.skipValidation) {
    validateTree(root);
  }

  // in unit tests, we support creating free-standing stacks, so we create the
  // assembly builder here.
  const builder = Stage.isStage(root)
    ? root._assemblyBuilder
    : new cxapi.CloudAssemblyBuilder(options.outdir);

  // next, we invoke "onSynthesize" on all of our children. this will allow
  // stacks to add themselves to the synthesized cloud assembly.
  synthesizeTree(root, builder, options.validateOnSynthesis);

  const assembly = builder.buildAssembly();

  invokeValidationPlugins(root, builder.outdir, assembly);

  return assembly;
}

/**
 * Find all the assemblies in the app, including all levels of nested assemblies
 * and return a map where the assemblyId is the key
 */
function getAssemblies(root: App, rootAssembly: CloudAssembly): Map<string, CloudAssembly> {
  const assemblies = new Map<string, CloudAssembly>();
  assemblies.set(root.artifactId, rootAssembly);
  visitAssemblies(root, 'pre', construct => {
    const stage = construct as Stage;
    if (stage.parentStage && assemblies.has(stage.parentStage.artifactId)) {
      assemblies.set(
        stage.artifactId,
        assemblies.get(stage.parentStage.artifactId)!.getNestedAssembly(stage.artifactId),
      );
    }
  });
  return assemblies;
}

/**
 * Invoke validation plugins for all stages in an App.
 */
function invokeValidationPlugins(root: IConstruct, outdir: string, assembly: CloudAssembly) {
  if (!App.isApp(root)) return;
  let hash: string | undefined;
  const assemblies = getAssemblies(root, assembly);
  const templatePathsByPlugin: Map<IPolicyValidationPluginBeta1, string[]> = new Map();
  visitAssemblies(root, 'post', construct => {
    if (Stage.isStage(construct)) {
      for (const plugin of construct.policyValidationBeta1) {
        if (!templatePathsByPlugin.has(plugin)) {
          templatePathsByPlugin.set(plugin, []);
        }
        let assemblyToUse = assemblies.get(construct.artifactId);
        if (!assemblyToUse) throw new Error(`Validation failed, cannot find cloud assembly for stage ${construct.stageName}`);
        templatePathsByPlugin.get(plugin)!.push(...assemblyToUse.stacksRecursively.map(stack => stack.templateFullPath));
      }
    }
  });

  const reports: NamedValidationPluginReport[] = [];
  if (templatePathsByPlugin.size > 0) {
    // eslint-disable-next-line no-console
    console.log('Performing Policy Validations\n');
  }

  if (templatePathsByPlugin.size > 0) {
    hash = FileSystem.fingerprint(outdir);
  }

  for (const [plugin, paths] of templatePathsByPlugin.entries()) {
    try {
      const report = plugin.validate({ templatePaths: paths });
      reports.push({ ...report, pluginName: plugin.name });
    } catch (e: any) {
      reports.push({
        success: false,
        pluginName: plugin.name,
        pluginVersion: plugin.version,
        violations: [],
        metadata: {
          error: `Validation plugin '${plugin.name}' failed: ${e.message}`,
        },
      });
    }
    if (FileSystem.fingerprint(outdir) !== hash) {
      throw new Error(`Illegal operation: validation plugin '${plugin.name}' modified the cloud assembly`);
    }
  }

  if (reports.length > 0) {
    const tree = new ConstructTree(root);
    const formatter = new PolicyValidationReportFormatter(tree);
    const formatJson = root.node.tryGetContext(VALIDATION_REPORT_JSON_CONTEXT) ?? false;
    const output = formatJson
      ? formatter.formatJson(reports)
      : formatter.formatPrettyPrinted(reports);

    const reportFile = path.join(assembly.directory, POLICY_VALIDATION_FILE_PATH);
    if (formatJson) {
      fs.writeFileSync(reportFile, JSON.stringify(output, undefined, 2));
    } else {
      // eslint-disable-next-line no-console
      console.error(output);
    }
    const failed = reports.some(r => !r.success);
    if (failed) {
      const message = formatJson
        ? `Validation failed. See the validation report in '${reportFile}' for details`
        : 'Validation failed. See the validation report above for details';

      // eslint-disable-next-line no-console
      console.log(message);
      process.exitCode = 1;
    } else {
      // eslint-disable-next-line no-console
      console.log('Policy Validation Successful!');
    }
  }
}

const CUSTOM_SYNTHESIS_SYM = Symbol.for('@aws-cdk/core:customSynthesis');

/**
 * Interface for constructs that want to do something custom during synthesis
 *
 * This feature is intended for use by official AWS CDK libraries only; 3rd party
 * library authors and CDK users should not use this function.
 */
export interface ICustomSynthesis {
  /**
   * Called when the construct is synthesized
   */
  onSynthesize(session: ISynthesisSession): void;
}

export function addCustomSynthesis(construct: IConstruct, synthesis: ICustomSynthesis): void {
  Object.defineProperty(construct, CUSTOM_SYNTHESIS_SYM, {
    value: synthesis,
    enumerable: false,
  });
}

function getCustomSynthesis(construct: IConstruct): ICustomSynthesis | undefined {
  return (construct as any)[CUSTOM_SYNTHESIS_SYM];
}

/**
 * Find Assemblies inside the construct and call 'synth' on them
 *
 * (They will in turn recurse again)
 */
function synthNestedAssemblies(root: IConstruct, options: StageSynthesisOptions) {
  for (const child of root.node.children) {
    if (Stage.isStage(child)) {
      child.synth(options);
    } else {
      synthNestedAssemblies(child, options);
    }
  }
}

/**
 * Invoke aspects on the given construct tree.
 *
 * Aspects are not propagated across Assembly boundaries. The same Aspect will not be invoked
 * twice for the same construct.
 */
function invokeAspects(root: IConstruct) {
  const invokedByPath: { [nodePath: string]: Set<AspectApplication> } = { };

  let nestedAspectWarning = false;
  recurse(root, []);

  function recurse(construct: IConstruct, inheritedAspects: AspectApplication[]) {
    let invoked = invokedByPath[construct.node.path];
    if (!invoked) {
      invoked = invokedByPath[construct.node.path] = new Set();
    }

    let lastInvokedAspect: AspectApplication | undefined;

    let allAspectsHere = sortAspectsByPriority(inheritedAspects, getAspectApplications(construct));

    // Legacy behavior: only initially applied aspects are inherited. Aspects V2
    // behavior will inherit these as well.
    const inheritableAspectApplications = [...allAspectsHere];

    const aspectsInitiallyHere = new Set(allAspectsHere.map(a => a.aspect));
    while (true) {
      const next = allAspectsHere.find((a) => !invoked.has(a));
      if (!next) {
        break;
      }
      // If an aspect was added to the node by another aspect (of lower or equal
      // priority) it will not be invoked: emit a warning instead. In
      // `invokeAspectsV2` this will be an arror.
      if (lastInvokedAspect && lastInvokedAspect.priority >= next.priority && !aspectsInitiallyHere.has(next.aspect)) {
        if (!nestedAspectWarning) {
          Annotations.of(construct).addWarningV2('@aws-cdk/core:ignoredAspect', 'We detected an Aspect was added via another Aspect, and will not be applied');
          nestedAspectWarning = true;
        }
        // Treat as invoked, but don't actually invoke (to stick with legacy behavior)
        invoked.add(next);
      } else {
        next.aspect.visit(construct);
        // mark as invoked for this node
        invoked.add(next);
        lastInvokedAspect = next;
      }

      // Refresh allAspectsHere, see above.
      allAspectsHere = sortAspectsByPriority(inheritedAspects, getAspectApplications(construct));
    }

    for (const child of construct.node.children) {
      if (!Stage.isStage(child)) {
        recurse(child, inheritableAspectApplications);
      }
    }
  }
}

/**
 * Invoke aspects V2 runs a stabilization loop and allows Aspects to invoke other Aspects.
 * Runs if the feature flag '@aws-cdk/core:aspectStabilization' is enabled.
 *
 * Unlike the original function, this function does not emit a warning for ignored aspects, since this
 * function invokes Aspects that are created by other Aspects.
 *
 * Throws an error if an Aspect adds an aspect with a lower priority than the
 * one that is currently executing (we detect this come visit time).
 */
function invokeAspectsV2(root: IConstruct) {
  const invokedByPath: { [nodePath: string]: Set<IAspect> } = { };
  const lastInvokedApplicationByPath: { [nodePath: string]: AspectApplication } = { };

  recurse(root, []);

  for (let i = 0; i <= 100; i++) {
    const didAnythingToTree = recurse(root, []);

    if (!didAnythingToTree) {
      return;
    }
  }

  throw new Error('We have detected a possible infinite loop while invoking Aspects. Please check your Aspects and verify there is no configuration that would cause infinite Aspect or Node creation.');

  function recurse(construct: IConstruct, inheritedAspects: AspectApplication[]): boolean {
    let didSomething = false;

    let invoked = invokedByPath[construct.node.path];
    if (!invoked) {
      invoked = invokedByPath[construct.node.path] = new Set();
    }

    const lastInvokedAspect: AspectApplication | undefined = lastInvokedApplicationByPath[construct.node.path];

    // If users are adding aspects with the same priority as the currently executing aspect, execute them anyway.
    // We do that by re-polling the aspect list after every execution, and skipping the ones that we already did.
    let allAspectsHere = sortAspectsByPriority(inheritedAspects, getAspectApplications(construct));
    while (true) {
      const next = allAspectsHere.find((a) => !invoked.has(a.aspect));
      if (!next) {
        break;
      }

      if (lastInvokedAspect !== undefined && next.priority < lastInvokedAspect.priority /* equal is still okay */) {
        throw new Error(
          `Cannot invoke Aspect ${next.aspect.constructor.name} with priority ${next.priority} on node ${construct.node.path}: an Aspect ${lastInvokedAspect.aspect.constructor.name} with a lower priority (${lastInvokedAspect.priority}) was already invoked on this node.`,
        );
      }

      next.aspect.visit(construct);

      didSomething = true;

      // mark as invoked for this node
      invoked.add(next.aspect);
      lastInvokedApplicationByPath[construct.node.path] = next;

      // Refresh allAspectsHere, see above.
      allAspectsHere = sortAspectsByPriority(inheritedAspects, getAspectApplications(construct));
    }

    for (const child of construct.node.children) {
      if (!Stage.isStage(child)) {
        const childDidSmoething = recurse(child, allAspectsHere);
        didSomething = didSomething || childDidSmoething;
      }
    }
    return didSomething;
  }
}

function invokeAspectsV3(root: IConstruct) {
  const visitedByApplication = new Map<AspectApplication, Set<IConstruct>>();
  const visitedByAspect = new Map<IAspect, Set<IConstruct>>();

  while (true) {
    const queue = orderAspectApplications(allAspectApplicationsInStage(root));
  }

  function findNextApplication(queue: AspectApplication[]): AspectApplication | undefined {
    while (queue.length > 0) {
      const next = queue.shift()!;
      if (!visitedByApplication.has(next)) {
        return next;
      }
    }
    return undefined;
  }
}

/**
 * Get all aspect applications in scope in this stage
 */
function allAspectApplicationsInStage(root: IConstruct): AspectApplication[] {
  const ret = new Array<AspectApplication>();
  recurse(root);
  return ret;

  function recurse(x: IConstruct) {
    ret.push(...getAspectApplications(x));
    for (const child of x.node.children) {
      if (!Stage.isStage(child)) {
        recurse(x);
      }
    }
  }
}

/**
 * Globally order all aspect applications, first by priority and then by depth.
 */
function orderAspectApplications(xs: AspectApplication[]): AspectApplication[] {
  xs.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.construct.node.path.localeCompare(b.construct.node.path);
  });
  return xs;
}

/**
 * Given two lists of AspectApplications (inherited and locally defined), this function returns a list of
 * AspectApplications ordered by priority. For Aspects of the same priority, inherited Aspects take precedence.
 */
function sortAspectsByPriority(inheritedAspects: AspectApplication[], localAspects: AspectApplication[]): AspectApplication[] {
  const allAspects = [...inheritedAspects, ...localAspects].sort((a, b) => {
    // Compare by priority first
    if (a.priority !== b.priority) {
      return a.priority - b.priority; // Ascending order by priority
    }
    // If priorities are equal, give preference to inheritedAspects
    const isAInherited = inheritedAspects.includes(a);
    const isBInherited = inheritedAspects.includes(b);
    if (isAInherited && !isBInherited) return -1; // a comes first
    if (!isAInherited && isBInherited) return 1; // b comes first
    return 0; // Otherwise, maintain original order
  });
  return allAspects;
}

/*
 * Helper function to get aspect applications.
 *
 * This code exists because for some reason, we are getting reports of people
 * having a version of the `Aspects` class with no `applied` member -- probably
 * due to local symlinking or duplicate `aws-cdk-lib` versions, but we haven't
 * been able to pinpoint it.
 *
 * If `Aspects.applied` is available, it is used; otherwise, create
 * AspectApplications from `Aspects.all`.
 */
function getAspectApplications(node: IConstruct): AspectApplication[] {
  const aspects = Aspects.of(node);
  if (aspects.applied !== undefined) {
    return aspects.applied;
  }

  // Fallback: Create AspectApplications from `aspects.all`

  // We need these aspects to have a stable identity (i.e., every fake AspectApplication
  // should be the same object every time we call `getAspectApplication`), so we keep them
  // in a WeakMap.
  const fakeCache = lazyGet(FAKE_ASPECT_APPLICATION_CACHE, node, () => new WeakMap());
  return aspects.all.map(aspect => {
    return lazyGet(fakeCache, aspect, () => new AspectApplication(node, aspect, AspectPriority.DEFAULT));
  });
}

const FAKE_ASPECT_APPLICATION_CACHE = new WeakMap<IConstruct, WeakMap<IAspect, AspectApplication>>();

/**
 * Find all stacks and add Metadata Resources to all of them
 *
 * There is no good generic place to do this. Can't do it in the constructor
 * (because adding a child construct makes it impossible to set context on the
 * node), and the generic prepare phase is deprecated.
 *
 * Only do this on [parent] stacks (not nested stacks), don't do this when
 * disabled by the user.
 *
 * Also, only when running via the CLI. If we do it unconditionally,
 * all unit tests everywhere are going to break massively. I've spent a day
 * fixing our own, but downstream users would be affected just as badly.
 *
 * Stop at Assembly boundaries.
 */
function injectMetadataResources(root: IConstruct) {
  visit(root, 'post', construct => {
    if (!Stack.isStack(construct) || !construct._versionReportingEnabled) { return; }

    // Because of https://github.com/aws/aws-cdk/blob/main/packages/assert-internal/lib/synth-utils.ts#L74
    // synthesize() may be called more than once on a stack in unit tests, and the below would break
    // if we execute it a second time. Guard against the constructs already existing.
    const CDKMetadata = 'CDKMetadata';
    if (construct.node.tryFindChild(CDKMetadata)) { return; }

    new MetadataResource(construct, CDKMetadata);
  });
}

/**
 * Find the root App and add the TreeMetadata resource (if enabled).
 *
 * There is no good generic place to do this. Can't do it in the constructor
 * (because adding a child construct makes it impossible to set context on the
 * node), and the generic prepare phase is deprecated.
 */
function injectTreeMetadata(root: IConstruct) {
  visit(root, 'post', construct => {
    if (!App.isApp(construct) || !construct._treeMetadata) return;
    const CDKTreeMetadata = 'Tree';
    if (construct.node.tryFindChild(CDKTreeMetadata)) return;
    new TreeMetadata(construct);
  });
}

/**
 * Synthesize children in post-order into the given builder
 *
 * Stop at Assembly boundaries.
 */
function synthesizeTree(root: IConstruct, builder: cxapi.CloudAssemblyBuilder, validateOnSynth: boolean = false) {
  visit(root, 'post', construct => {
    const session = {
      outdir: builder.outdir,
      assembly: builder,
      validateOnSynth,
    };

    if (Stack.isStack(construct)) {
      construct.synthesizer.synthesize(session);
    } else if (construct instanceof TreeMetadata) {
      construct._synthesizeTree(session);
    } else {
      const custom = getCustomSynthesis(construct);
      custom?.onSynthesize(session);
    }
  });
}

interface ValidationError {
  readonly message: string;
  readonly source: IConstruct;
}

/**
 * Validate all constructs in the given construct tree
 */
function validateTree(root: IConstruct) {
  const errors = new Array<ValidationError>();

  visit(root, 'pre', construct => {
    for (const message of construct.node.validate()) {
      errors.push({ message, source: construct });
    }
  });

  if (errors.length > 0) {
    const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
    throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
  }
}

/**
 * Visit the given construct tree in either pre or post order, only looking at Assemblies
 */
function visitAssemblies(root: IConstruct, order: 'pre' | 'post', cb: (x: IConstruct) => void) {
  if (order === 'pre') {
    cb(root);
  }

  for (const child of root.node.children) {
    if (!Stage.isStage(child)) { continue; }
    visitAssemblies(child, order, cb);
  }

  if (order === 'post') {
    cb(root);
  }
}

/**
 * Visit the given construct tree in either pre or post order, stopping at Assemblies
 */
function visit(root: IConstruct, order: 'pre' | 'post', cb: (x: IConstruct) => void) {
  if (order === 'pre') {
    cb(root);
  }

  for (const child of root.node.children) {
    if (Stage.isStage(child)) { continue; }
    visit(child, order, cb);
  }

  if (order === 'post') {
    cb(root);
  }
}

interface MapLike<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
}

/**
 * Get a value from a map or put it there using a callback if it doesn't exist yet
 */
function lazyGet<K, V>(map: MapLike<K, V>, key: K, defaultValue: () => V): V {
  let value = map.get(key);
  if (value === undefined) {
    map.set(key, value = defaultValue());
  }
  return value;
}
