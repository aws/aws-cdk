import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as constructs from 'constructs';
import { Assembly } from '../assembly';
import { Construct, ConstructOrder, IConstruct, SynthesisOptions, ValidationError } from '../construct-compat';
import { prepareApp } from './prepare-app';
import { collectRuntimeInformation } from './runtime-info';

export function synthesize(root: IConstruct, options: SynthesisOptions = { }): cxapi.CloudAssembly {
  const builder = Assembly.isAssembly(root)
    ? root.assemblyBuilder
    : new cxapi.CloudAssemblyBuilder(options.outdir);

  // okay, now we start by calling "synth" on all nested assemblies (which will take care of all their children)
  for (const child of root.node.findAll(ConstructOrder.POSTORDER)) {
    if (child === root) { continue; }
    if (!Assembly.isAssembly(child)) { continue; }
    if (Assembly.of(child) !== root) { continue; }
    child.synth(options);
  }

  const inAssembly = (c: IConstruct) => {
    // if the root is not an assembly (i.e. it's a stack in unit tests), then consider
    // everything to be in an assembly
    if (!Assembly.isAssembly(root)) {
      return true;
    }

    // always include self
    if (c === root) {
      return true;
    }

    // if the child is an assembly, omit it
    if (Assembly.isAssembly(c)) {
      return false;
    }

    return Assembly.of(c) === root;
  };

  // find all child constructs within this assembly (sorted depth-first), and
  // include direct nested assemblies, but do not include any constructs from
  // nested assemblies as they will be covered by their assembly's synth()
  // method.
  const findChildren = () => root.node
    .findAll(ConstructOrder.POSTORDER)
    .filter(inAssembly);

  const children = findChildren();

  for (const child of children) {

    // hackery to be able to access some private members with strong types (yack!)
    const node = child.node._actualNode as unknown as Omit<constructs.Node, 'invokedAspects' | '_aspects'> & {
      invokedAspects: constructs.IAspect[];
      _aspects: constructs.IAspect[];
    };

    for (const aspect of node._aspects) {
      if (node.invokedAspects.includes(aspect)) {
        continue;
      }

      child.node.findAll(ConstructOrder.PREORDER)
        .filter(c => inAssembly(c))
        .forEach(c => aspect.visit(c));

      node.invokedAspects.push(aspect);
    }
  }

  // invoke "prepare" on all of the children in this assembly. this is mostly here for legacy purposes
  // the framework itself does not use prepare anymore.
  for (const child of findChildren()) {
    (child as IProtectedConstructMethods).onPrepare();
  }

  // resolve references
  prepareApp(root);

  // give all children an opportunity to validate now that we've finished prepare
  if (!options.skipValidation) {
    const errors = new Array<ValidationError>();
    for (const source of children) {
      const messages = (source as IProtectedConstructMethods).onValidate();
      for (const message of messages) {
        errors.push({ message, source: source as Construct });
      }
    }

    if (errors.length > 0) {
      const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
      throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
    }
  }

  // next, we invoke "onSynthesize" on all of our children. this will allow
  // stacks to add themselves to the synthesized cloud assembly.
  for (const child of children) {
    (child as IProtectedConstructMethods).onSynthesize({
      outdir: builder.outdir,
      assembly: builder,
    });
  }

  // Add this assembly to the parent assembly manifest (if we have one)
  if (Assembly.isAssembly(root) && root.parentAssembly) {
    root.parentAssembly.assemblyBuilder.addArtifact(root.assemblyArtifactId, {
      type: cxschema.ArtifactType.EMBEDDED_CLOUD_ASSEMBLY,
      properties: {
        directoryName: root.assemblyArtifactId,
        displayName: root.node.path,
      } as cxschema.EmbeddedCloudAssemblyProperties,
    });

  }

  const runtimeInfo = root.node.tryGetContext(cxapi.DISABLE_VERSION_REPORTING) ? undefined : collectRuntimeInformation();
  return builder.buildAssembly({ runtimeInfo });
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
