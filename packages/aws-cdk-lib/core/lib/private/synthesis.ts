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
import { AspectApplication, Aspects, IAspect } from '../aspect';
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

  invokeAspects(root);

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
  const aspectsSet = getAllAspectApplications(root);

  const aspectsPQ = new PriorityQueue<AspectApplication>();
  for (const aspectApplication of aspectsSet) {
    aspectsPQ.enqueue(aspectApplication, aspectApplication.priority);
  }

  let nestedAspectWarning = { value: false };;

  while (!aspectsPQ.isEmpty()) {
    // eslint-disable-next-line no-console
    console.log(`PQ size: ${aspectsPQ.size()}`);
    const aspectApplication = aspectsPQ.dequeue()!;
    invokeAspect(aspectApplication.construct, aspectApplication.aspect, nestedAspectWarning, aspectsPQ);

    const updatedAspectApplications = getAllAspectApplications(root);
    for (const app of updatedAspectApplications) {
      // if (aspectsSet.has(aspectApplication)) continue;
      if (!aspectsSet.has(app) && app != aspectApplication) {
        aspectsPQ.enqueue(app, aspectApplication.priority);
      }
    }
  }
}

/**
 * Invokes an individual Aspect on a construct and all of its children in the construct tree.
 *
 * nestedAspectWarning argument is used to prevent the nested Aspect warning from being emitted for every child
 */
function invokeAspect(construct: IConstruct, aspect: IAspect, nestedAspectWarning: {value: boolean}, pq: PriorityQueue<AspectApplication>) {
  const aspectsCount = Aspects.of(construct).all.length;
  aspect.visit(construct);
  const aspectsCount2 = Aspects.of(construct).all.length;

  // if an aspect was added to the node while invoking another aspect it will not be invoked, emit a warning
  if ((aspectsCount != aspectsCount2) && !nestedAspectWarning.value) {
    Annotations.of(construct).addWarningV2('@aws-cdk/core:ignoredAspect', 'We detected an Aspect was added via another Aspect, and will not be applied');
    nestedAspectWarning.value = true;
  }
  for (const child of construct.node.children) {
    // Do not cross the Stage boundary
    if (!Stage.isStage(child)) {
      invokeAspect(child, aspect, nestedAspectWarning, pq);
    }
  }
}

/**
 * Gets all AspectApplications.
 *
 * Returns a Set<AspectApplication> of all Aspect Applications from a node and all its children.
 */
function getAllAspectApplications(root: IConstruct): Set<AspectApplication> {
  let aspectsSet = new Set<AspectApplication>();

  recurse(root);

  return aspectsSet;

  // Helper function recurses tree to collect Aspects from every node.
  function recurse(node: IConstruct) {
    for (const aspectApplication of Aspects.of(node).list) {
      aspectsSet.add(aspectApplication);
    }

    for (const child of node.node.children) {
      // Do not cross the stage boundary
      if (!Stage.isStage(child)) {
        recurse(child);
      }
    }
  }
}

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

/**
 * Ordered Priority Queue to be used in Aspect invocation algorithm.
 *
 * Counter keeps track of insertion order so that Aspects of the same priority are applied
 * in the order in which they were added.
 */
class PriorityQueue<T> {
  private heap: { value: T; priority: number; order: number }[] = [];
  private set: Set<T> = new Set();
  private counter = 0; // Tracks insertion order

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  private bubbleUp(index: number): void {
    const parentIndex = this.getParentIndex(index);

    if (
      parentIndex >= 0 &&
      (
        this.heap[parentIndex].priority > this.heap[index].priority ||
        (
          this.heap[parentIndex].priority === this.heap[index].priority &&
          this.heap[parentIndex].order > this.heap[index].order
        )
      )
    ) {
      this.swap(parentIndex, index);
      this.bubbleUp(parentIndex);
    }
  }

  private bubbleDown(index: number): void {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let smallest = index;

    if (
      leftChildIndex < this.heap.length &&
      (
        this.heap[leftChildIndex].priority < this.heap[smallest].priority ||
        (
          this.heap[leftChildIndex].priority === this.heap[smallest].priority &&
          this.heap[leftChildIndex].order < this.heap[smallest].order
        )
      )
    ) {
      smallest = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      (
        this.heap[rightChildIndex].priority < this.heap[smallest].priority ||
        (
          this.heap[rightChildIndex].priority === this.heap[smallest].priority &&
          this.heap[rightChildIndex].order < this.heap[smallest].order
        )
      )
    ) {
      smallest = rightChildIndex;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.bubbleDown(smallest);
    }
  }

  enqueue(value: T, priority: number): void {
    // Prevent duplicate entries
    if (this.set.has(value)) return;
    this.set.add(value);

    // Add the new element with priority and order
    this.heap.push({ value, priority, order: this.counter++ });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop()?.value;

    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);

    // this.set.delete(root.value);
    return root.value;
  }

  peek(): T | undefined {
    return this.heap[0]?.value;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  size(): number {
    return this.set.size;
  }
}