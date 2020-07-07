import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct, ValidationError } from 'constructs';
import { Aspects, IAspect } from '../aspect';
import { Stack } from '../stack';
import { Stage, StageSynthesisOptions } from '../stage';
import { SynthesisOptions } from '../synthesis';
import { prepareApp } from './prepare-app';
import { TreeMetadata } from './tree-metadata';

export function synthesize(root: IConstruct, options: SynthesisOptions = { }): cxapi.CloudAssembly {
  // we start by calling "synth" on all nested assemblies (which will take care of all their children)
  synthNestedAssemblies(root, options);

  invokeAspects(root);

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
  synthesizeTree(root, builder);

  return builder.buildAssembly({
    runtimeInfo: options.runtimeInfo,
  });
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
  const invokedByPath: { [nodePath: string]: IAspect[] } = { };

  recurse(root, []);

  function recurse(construct: IConstruct, inheritedAspects: IAspect[]) {
    const node = construct.node;

    const allAspectsHere = [...inheritedAspects ?? [], ...Aspects.of(construct).aspects];

    for (const aspect of allAspectsHere) {

      let invoked = invokedByPath[node.path];
      if (!invoked) {
        invoked = invokedByPath[node.path] = [];
      }

      if (invoked.includes(aspect)) { continue; }
      aspect.visit(construct);
      invoked.push(aspect);
    }

    for (const child of construct.node.children) {
      if (!Stage.isStage(child)) {
        recurse(child, allAspectsHere);
      }
    }
  }
}

/**
 * Synthesize children in post-order into the given builder
 *
 * Stop at Assembly boundaries.
 */
function synthesizeTree(root: IConstruct, builder: cxapi.CloudAssemblyBuilder) {
  visit(root, 'post', construct => {
    const session = {
      outdir: builder.outdir,
      assembly: builder,
    };

    if (construct instanceof Stack) {
      construct._synthesizeTemplate(session);
    } else if (construct instanceof TreeMetadata) {
      construct._synthesizeTree(session);
    } else {
      if (typeof((construct as any).synthesize) === 'function') {
        throw new Error(`"synthesize" is no longer supported: ${construct.node.path}`);
      }
    }
  });
}

/**
 * Validate all constructs in the given construct tree
 * (Exported for unit tests)
 */
export function validateTree(root: IConstruct) {
  const errors = new Array<ValidationError>();

  visit(root, 'pre', construct => errors.push(...construct.node.validate()));

  if (errors.length > 0) {
    const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
    throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
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
