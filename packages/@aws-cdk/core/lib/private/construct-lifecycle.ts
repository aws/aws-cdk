/**
 * Construct lifecycle routines, moved over from `constructs`
 *
 * When we introduced Stages, we wanted to scope the lifecycle phases of constructs
 * to a subtree of the entire tree.
 *
 * None of the routines in `constructs` (such as
 * prepare/applyAspects/synthesize/etc) were prepared for this, liberally
 * employing `node.findAll()` to find the constructs to apply functions to.
 * Rather than rewriting the routines in `constructs` to make it possible to
 * control the scopes of these life cycles, we decided to bring the functionality
 * back into `aws-cdk` and stop relying on the versions found in `constructs`,
 * intuiting that the notions of:
 *
 * - prepare
 * - aspects
 * - validation(*)
 * - synthesis
 *
 * Are specific to the AWS CDK and not inherently useful in the `constructs`
 * programming model.
 *
 * (*) Validation should probably go in this category as well, but since we
 * have no problems with the upstream implementation we keep on using the
 * upstream one.
 */

import * as cxapi from '@aws-cdk/cx-api';
import * as constructs from 'constructs';
import { IAspect } from '../aspect';
import { ConstructNode, IConstruct } from '../construct-compat';
import { Stage } from '../stage';

/**
 * Run the full lifecycle on the given construct tree, synthesizing to a Cloud Assembly
 */
export function fullLifecycle(root: IConstruct, builder: cxapi.CloudAssemblyBuilder, validate: boolean, includeSelf: boolean) {
  // The three holy phases of synthesis: prepare, validate and synthesize
  preparePhase(root);

  if (validate) {
    validateAndThrow(root);
  }

  if (includeSelf) {
    synthesizeTo(root, builder);
  } else {
    synthesizeChildrenTo(root, builder);
  }
}

/**
 * Validate the node and if there are any errors, throw them
 */
function validateAndThrow(root: IConstruct) {
  const errors = ConstructNode.validate(root.node);
  if (errors.length > 0) {
    const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
    throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
  }
}

/**
 * Do the full prepare phase on construct (sub)tree
 *
 * This consists of invoking aspects and invoking onPrepare() on all constructs.
 */
export function preparePhase(root: IConstruct) {
  invokeAspects(root, []);
  prepareConstructs(root);
}

/**
 * Synthesize the children of a construct to a CloudAssembly
 *
 * For Stage, defers to the Stage's own synth() method so that it can
 * open an embedded cloud assembly.
 *
 * This is `synthesizeChildrenTo` and not `synthesizeConstructTo` because
 * otherwise we'd get into an infinite loop of:
 *
 * `synthesizeConstructTo()` -> `stage.synth()` -> `ConstructNode.synth()` -> `synthesizeConstructTo()`
 */
export function synthesizeChildrenTo(construct: IConstruct, builder: cxapi.CloudAssemblyBuilder) {
  for (const child of construct.node.children) {
    synthesizeTo(child, builder);
  }
}

export function synthesizeTo(construct: IConstruct, builder: cxapi.CloudAssemblyBuilder) {
  if (Stage.isStage(construct)) {
    construct.synth();
  } else {
    synthesizeChildrenTo(construct, builder);

    (construct as IProtectedConstructMethods).onSynthesize({
      outdir: builder.outdir,
      assembly: builder,
    });
  }
}

/**
 * Invoke aspects in the given construct tree, propagating aspects to children as necessary
 *
 * Aspects are not propagated across Stage boundaries. The same Aspect will not be invoked
 * twice for the same construct.
 */
function invokeAspects(construct: IConstruct, inheritedAspects: IAspect[]) {
  // Some of the state we want is private to the `constructs.Node` object.
  const nodeAspects: IAspect[] = (constructs.Node.of(construct) as any)._aspects;
  const nodeInvoked: IAspect[] = (constructs.Node.of(construct) as any).invokedAspects;

  const allAspectsHere = [...inheritedAspects ?? [], ...nodeAspects];

  for (const aspect of allAspectsHere) {
    if (nodeInvoked.includes(aspect)) { continue; }
    aspect.visit(construct);
    nodeInvoked.push(aspect);
  }

  for (const child of construct.node.children) {
    const propagateAspects = Stage.isStage(child) ? [] : allAspectsHere;
    invokeAspects(child, propagateAspects);
  }
}

/**
 * Invoke aspects in the given construct tree
 *
 * Constructs will not be prepared twice. Children are prepared before
 * parents.
 */
function prepareConstructs(construct: IConstruct) {
  for (const child of construct.node.children) {
    prepareConstructs(child);
  }

  (construct as IProtectedConstructMethods).onPrepare();
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