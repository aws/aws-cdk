import * as cxapi from '@aws-cdk/cx-api';
import * as constructs from 'constructs';
import { Construct, IConstruct, SynthesisOptions, ValidationError } from '../construct-compat';
import { Stack } from '../stack';
import { Stage, StageSynthesisOptions } from '../stage';
import { prepareApp } from './prepare-app';
import { TreeMetadata } from './tree-metadata';

export function synthesize(root: IConstruct, options: SynthesisOptions = { }): cxapi.CloudAssembly {
  // we start by calling "synth" on all nested assemblies (which will take care of all their children)
  synthNestedAssemblies(root, options);

  invokeAspects(root);

  // This is mostly here for legacy purposes as the framework itself does not use prepare anymore.
  prepareTree(root);

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
  let nestedAspectWarning = false;
  recurse(root, []);

  function recurse(construct: IConstruct, inheritedAspects: constructs.IAspect[]) {
    // hackery to be able to access some private members with strong types (yack!)
    const node: NodeWithAspectPrivatesHangingOut = construct.node._actualNode as any;

    const allAspectsHere = [...inheritedAspects ?? [], ...node._aspects];
    const nodeAspectsCount = node._aspects.length;
    for (const aspect of allAspectsHere) {
      if (node.invokedAspects.includes(aspect)) { continue; }

      aspect.visit(construct);
      // if an aspect was added to the node while invoking another aspect it will not be invoked, emit a warning
      // the `nestedAspectWarning` flag is used to prevent the warning from being emitted for every child
      if (!nestedAspectWarning && nodeAspectsCount !== node._aspects.length) {
        construct.node.addWarning('We detected an Aspect was added via another Aspect, and will not be applied');
        nestedAspectWarning = true;
      }
      node.invokedAspects.push(aspect);
    }

    for (const child of construct.node.children) {
      if (!Stage.isStage(child)) {
        recurse(child, allAspectsHere);
      }
    }
  }
}

/**
 * Prepare all constructs in the given construct tree in post-order.
 *
 * Stop at Assembly boundaries.
 */
function prepareTree(root: IConstruct) {
  visit(root, 'post', construct => construct.onPrepare());
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
    }

    // this will soon be deprecated and removed in 2.x
    // see https://github.com/aws/aws-cdk-rfcs/issues/192
    construct.onSynthesize(session);
  });
}

/**
 * Validate all constructs in the given construct tree
 */
function validateTree(root: IConstruct) {
  const errors = new Array<ValidationError>();

  visit(root, 'pre', construct => {
    for (const message of construct.onValidate()) {
      errors.push({ message, source: construct as unknown as Construct });
    }
  });

  if (errors.length > 0) {
    const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
    throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
  }
}

/**
 * Visit the given construct tree in either pre or post order, stopping at Assemblies
 */
function visit(root: IConstruct, order: 'pre' | 'post', cb: (x: IProtectedConstructMethods) => void) {
  if (order === 'pre') {
    cb(root as IProtectedConstructMethods);
  }

  for (const child of root.node.children) {
    if (Stage.isStage(child)) { continue; }
    visit(child, order, cb);
  }

  if (order === 'post') {
    cb(root as IProtectedConstructMethods);
  }
}

/**
 * Interface which provides access to special methods of Construct
 *
 * @experimental
 */
interface IProtectedConstructMethods extends IConstruct {
  /**
   * Method that gets called when a construct should synthesize itself to an assembly
   */
  onSynthesize(session: constructs.ISynthesisSession): void;

  /**
   * Method that gets called to validate a construct
   */
  onValidate(): string[];

  /**
   * Method that gets called to prepare a construct
   */
  onPrepare(): void;
}

/**
 * The constructs Node type, but with some aspects-related fields public.
 *
 * Hackery!
 */
type NodeWithAspectPrivatesHangingOut = Omit<constructs.Node, 'invokedAspects' | '_aspects'> & {
  readonly invokedAspects: constructs.IAspect[];
  readonly _aspects: constructs.IAspect[];
};