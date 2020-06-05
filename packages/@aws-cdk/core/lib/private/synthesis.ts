import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as constructs from 'constructs';
import { Assembly } from '../assembly';
import { Construct, IConstruct, SynthesisOptions, ValidationError } from '../construct-compat';
import { prepareApp } from './prepare-app';
import { collectRuntimeInformation } from './runtime-info';

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

  const builder = Assembly.isAssembly(root)
    ? root.assemblyBuilder
    : new cxapi.CloudAssemblyBuilder(options.outdir);

  // next, we invoke "onSynthesize" on all of our children. this will allow
  // stacks to add themselves to the synthesized cloud assembly.
  synthesizeChildren(root, builder);

  // Add this assembly to the parent assembly manifest (if we have one)
  if (Assembly.isAssembly(root)) {
    addToParentAssembly(root);
  }

  const runtimeInfo = root.node.tryGetContext(cxapi.DISABLE_VERSION_REPORTING) ? undefined : collectRuntimeInformation();
  return builder.buildAssembly({ runtimeInfo });
}

/**
 * Find Assemblies inside the construct and call 'synth' on them
 *
 * (They will in turn recurse again)
 */
function synthNestedAssemblies(root: IConstruct, options: SynthesisOptions) {
  for (const child of root.node.children) {
    if (Assembly.isAssembly(child)) {
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
  recurse(root, []);

  function recurse(construct: IConstruct, inheritedAspects: constructs.IAspect[]) {
    // hackery to be able to access some private members with strong types (yack!)
    const node: NodeWithPrivatesHangingOut = construct.node._actualNode as any;

    const allAspectsHere = [...inheritedAspects ?? [], ...node._aspects];

    for (const aspect of allAspectsHere) {
      if (node.invokedAspects.includes(aspect)) { continue; }
      aspect.visit(construct);
      node.invokedAspects.push(aspect);
    }

    for (const child of construct.node.children) {
      if (!Assembly.isAssembly(child)) {
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
  visit(root, 'post', construct => {
    (construct as IProtectedConstructMethods).onPrepare();
  });
}

/**
 * Synthesize children in post-order into the given builder
 *
 * Stop at Assembly boundaries.
 */
function synthesizeChildren(root: IConstruct, builder: cxapi.CloudAssemblyBuilder) {
  visit(root, 'post', construct => {
    (construct as IProtectedConstructMethods).onSynthesize({
      outdir: builder.outdir,
      assembly: builder,
    });
  });
}

/**
 * Validate all constructs in the given construct tree
 */
function validateTree(root: IConstruct) {
  const errors = new Array<ValidationError>();

  visit(root, 'pre', construct => {
    for (const message of (construct as IProtectedConstructMethods).onValidate()) {
      errors.push({ message, source: construct as Construct });
    }
  });

  if (errors.length > 0) {
    const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
    throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
  }
}

function addToParentAssembly(root: Assembly) {
  if (!root.parentAssembly) { return; }

  root.parentAssembly.assemblyBuilder.addArtifact(root.assemblyArtifactId, {
    type: cxschema.ArtifactType.EMBEDDED_CLOUD_ASSEMBLY,
    properties: {
      directoryName: root.assemblyArtifactId,
      displayName: root.node.path,
    } as cxschema.EmbeddedCloudAssemblyProperties,
  });
}

/**
 * Visit the given construct tree in either pre or post order, stopping at Assemblies
 */
function visit(root: IConstruct, order: 'pre' | 'post', cb: (x: IConstruct) => void) {
  if (order === 'pre') {
    cb(root);
  }

  for (const child of root.node.children) {
    if (Assembly.isAssembly(child)) { continue; }
    visit(child, order, cb);
  }

  if (order === 'post') {
    cb(root);
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
type NodeWithPrivatesHangingOut = Omit<constructs.Node, 'invokedAspects' | '_aspects'> & {
  readonly invokedAspects: constructs.IAspect[];
  readonly _aspects: constructs.IAspect[];
};