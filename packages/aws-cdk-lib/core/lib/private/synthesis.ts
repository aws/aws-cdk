import * as private_cxapi from '@aws-cdk/cloud-assembly-api';
import type { IConstruct } from 'constructs';
import { generateFeatureFlagReport } from './feature-flag-report';
import { lit } from './literal-string';
import { MetadataResource } from './metadata-resource';
import { prepareApp } from './prepare-app';
import { TreeMetadata } from './tree-metadata';
import { _convertCloudAssemblyBuilder } from '../../../cx-api/lib/legacy-moved';
import { Annotations } from '../annotations';
import { App } from '../app';
import { _aspectTreeRevisionReader, AspectApplication, AspectPriority, Aspects } from '../aspect';
import { UnscopedValidationError } from '../errors';
import { Stack } from '../stack';
import type { ISynthesisSession } from '../stack-synthesizers/types';
import type { StageSynthesisOptions } from '../stage';
import { Stage } from '../stage';
import { validateTemplates } from './synthesis-validation';

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

export function synthesize(root: IConstruct, options: SynthesisOptions = { }): private_cxapi.CloudAssembly {
  // add the TreeMetadata resource to the App first
  injectTreeMetadata(root);
  // we start by calling "synth" on all nested assemblies (which will take care of all their children)
  synthNestedAssemblies(root, options);

  if (options.aspectStabilization) {
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
    ? _convertCloudAssemblyBuilder(root._assemblyBuilder)
    : new private_cxapi.CloudAssemblyBuilder(options.outdir);

  // next, we invoke "onSynthesize" on all of our children. this will allow
  // stacks to add themselves to the synthesized cloud assembly.
  synthesizeTree(root, builder, options.validateOnSynthesis);

  generateFeatureFlagReport(builder, root);

  const assembly = builder.buildAssembly();

  validateTemplates(root, builder.outdir, assembly);

  return assembly;
}

const CUSTOM_SYNTHESIS_SYM = Symbol.for('@aws-cdk/core:customSynthesis');

/**
 * Interface for constructs that want to do something custom during synthesis
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
  const invokedByPath: { [nodePath: string]: AspectApplication[] } = { };

  let nestedAspectWarning = false;
  recurse(root, []);

  function recurse(construct: IConstruct, inheritedAspects: AspectApplication[]) {
    const node = construct.node;
    const aspects = Aspects.of(construct);

    let localAspects = getAspectApplications(construct);
    const allAspectsHere = sortAspectsByPriority(inheritedAspects, localAspects);

    const nodeAspectsCount = aspects.all.length;
    for (const aspectApplication of allAspectsHere) {
      let invoked = invokedByPath[node.path];
      if (!invoked) {
        invoked = invokedByPath[node.path] = [];
      }

      if (invoked.some(invokedApp => invokedApp.aspect === aspectApplication.aspect)) {
        continue;
      }

      aspectApplication.aspect.visit(construct);

      // if an aspect was added to the node while invoking another aspect it will not be invoked, emit a warning
      // the `nestedAspectWarning` flag is used to prevent the warning from being emitted for every child
      if (!nestedAspectWarning && nodeAspectsCount !== aspects.all.length) {
        Annotations.of(construct).addWarningV2('@aws-cdk/core:ignoredAspect', 'We detected an Aspect was added via another Aspect, and will not be applied');
        nestedAspectWarning = true;
      }

      // mark as invoked for this node
      invoked.push(aspectApplication);
    }

    for (const child of construct.node.children) {
      if (!Stage.isStage(child)) {
        recurse(child, allAspectsHere);
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
 * Throws an error if the function attempts to invoke an Aspect on a node that has a lower priority value
 * than the most recently invoked Aspect on that node.
 */
function invokeAspectsV2(root: IConstruct) {
  const invokedByPath = new Map<string, AspectApplication[]>();

  recurse(root, []);

  for (let i = 0; i <= 100; i++) {
    const didAnythingToTree = recurse(root, []);

    // Keep on invoking until nothing gets invoked anymore
    if (didAnythingToTree === 'nothing') {
      return;
    }
  }

  throw new UnscopedValidationError(lit`PossibleInfiniteLoopDetected`, 'We have detected a possible infinite loop while invoking Aspects. Please check your Aspects and verify there is no configuration that would cause infinite Aspect or Node creation.');

  function recurse(construct: IConstruct, inheritedAspects: AspectApplication[]): 'invoked' | 'abort-recursion' | 'nothing' {
    const node = construct.node;

    let ret: ReturnType<typeof recurse> = 'nothing';
    const currentAspectTreeRevision = _aspectTreeRevisionReader(construct);
    const versionAtStart = currentAspectTreeRevision();

    const allAspectsHere = sortAspectsByPriority(inheritedAspects, getAspectApplications(construct));
    for (const aspectApplication of allAspectsHere) {
      let invoked = invokedByPath.get(node.path);
      if (!invoked) {
        invokedByPath.set(node.path, invoked = []);
      }

      if (invoked.some(invokedApp => invokedApp.aspect === aspectApplication.aspect)) {
        continue;
      }

      // If the last invoked Aspect has a higher priority than the current one, throw an error:
      const lastInvokedAspect = invoked[invoked.length - 1];
      if (lastInvokedAspect && lastInvokedAspect.priority > aspectApplication.priority) {
        throw new UnscopedValidationError(lit`CannotInvokeAspectWithLowerPriority`,
          `Cannot invoke Aspect ${aspectApplication.aspect.constructor.name} with priority ${aspectApplication.priority} on node ${node.path}: an Aspect ${lastInvokedAspect.aspect.constructor.name} with a lower priority (added at ${lastInvokedAspect.construct.node.path} with priority ${lastInvokedAspect.priority}) was already invoked on this node.`,
        );
      }

      aspectApplication.aspect.visit(construct);

      ret = 'invoked';

      // mark as invoked for this node
      invoked.push(aspectApplication);

      // If this aspect added another aspect, we need to reconsider everything;
      // it might have added an aspect above us and we need to restart the
      // entire tree. This could probably be made more efficient, but restarting
      // the tree from the top currently does it as well.
      if (currentAspectTreeRevision() !== versionAtStart) {
        return 'abort-recursion';
      }
    }

    for (const child of construct.node.children) {
      if (!Stage.isStage(child)) {
        const childDidSomething = recurse(child, allAspectsHere);
        ret = childDidSomething !== 'nothing' ? childDidSomething : ret;

        if (ret === 'abort-recursion') {
          break;
        }
      }
    }

    return ret;
  }
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

/**
 * Helper function to get aspect applications.
 * If `Aspects.applied` is available, it is used; otherwise, create AspectApplications from `Aspects.all`.
 */
function getAspectApplications(node: IConstruct): AspectApplication[] {
  const aspects = Aspects.of(node);
  if (aspects.applied !== undefined) {
    return aspects.applied;
  }

  // Fallback: Create AspectApplications from `aspects.all`
  const typedAspects = aspects as Aspects;
  return typedAspects.all.map(aspect => new AspectApplication(node, aspect, AspectPriority.DEFAULT));
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
function synthesizeTree(root: IConstruct, builder: private_cxapi.CloudAssemblyBuilder, validateOnSynth: boolean = false) {
  visit(root, 'post', construct => {
    const session = {
      outdir: builder.outdir,
      assembly: _convertCloudAssemblyBuilder(builder),
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
    throw new UnscopedValidationError(lit`ValidationFailedWithErrors`, `Validation failed with the following errors:\n  ${errorList}`);
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
