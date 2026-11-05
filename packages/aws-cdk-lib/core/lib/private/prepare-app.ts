import type { IConstruct } from 'constructs';
import { resolveReferences, resolveReferencesInElements } from './refs';
import { CfnResource } from '../cfn-resource';
import { debugModeEnabled } from '../debug';
import type { Stack } from '../stack';
import { iterateDfsPostorder, iterateDfsPreorder } from './construct-iteration';
import { STACK_TYPE, stageOf } from './core-construct-finders';
import { reifyConstructDependencies } from './deps';
import { writePropertyAssignmentMetadataForConstruct } from './resolve';

function writePropertyAssignmentMetadata(root: IConstruct) {
  if (!debugModeEnabled()) return;

  const lookupTableFor = (c: CfnResource) => ({
    cfnPropertyName: (cdkPropertyName: string) => c.cfnPropertyName(cdkPropertyName),
  });

  for (const consumer of iterateDfsPreorder(root)) {
    if (CfnResource.isCfnResource(consumer)) {
      writePropertyAssignmentMetadataForConstruct(consumer, () => consumer._toCloudFormation(), lookupTableFor(consumer));
    }
  }
}

/**
 * Prepares the app for synthesis. This function is called by the root `prepare`
 * (normally this the App, but if a Stack is a root, it is called by the stack),
 * which means it's the last 'prepare' that executes.
 *
 * It takes care of reifying cross-references between stacks (or nested stacks),
 * and of creating assets for nested stack templates.
 *
 * @param root The root of the construct tree.
 */
export function prepareApp(root: IConstruct) {
  reifyConstructDependencies(root);

  resolveReferences(root);
  writePropertyAssignmentMetadata(root);

  // Depth-first (children first) list of stacks, since the template hash of a
  // stack deployed by another stack (e.g. a nested stack) will be reflected in
  // its parent's template, which then changes the parent's hash, etc.
  const templateAssetConsumers = new Array<CfnResource>();
  for (const stack of findAllStacks(root)) {
    const consumer = stack._prepareTemplateAsset();
    if (consumer) {
      templateAssetConsumers.push(consumer);
    }
  }

  if (templateAssetConsumers.length > 0) {
    // ▷[ Given the legacy synthesizer and a 3-or-deeper nesting of nested stacks ]
    //
    // Adding nested stack assets may have added CfnParameters to the top-level
    // stack which are referenced in a deeper-level stack. The values of these
    // parameters need to be carried through to the right location via Nested
    // Stack parameters, which reference resolution will do.
    //
    // Everything a template asset introduces (the template URL, the stack
    // parameters and the copied tags) is consumed by the resource that deploys
    // the template (e.g. a nested stack's `AWS::CloudFormation::Stack` resource),
    // so only those resources need to be revisited.
    //
    // Yes, this may add `Parameter` elements to a template whose hash has
    // already been calculated, but the invariant that if the functional part
    // of the template changes its hash will change is still upheld.
    resolveReferencesInElements(templateAssetConsumers);
  }
}

function findAllStacks(root: IConstruct) {
  const result = new Array<Stack>();

  const includeStack = (stack: IConstruct): stack is Stack => {
    if (!STACK_TYPE.isMarked(stack)) { return false; }

    // test: if we are not within a stage, then include it.
    if (!stageOf(stack)) { return true; }

    return stageOf(stack) === root;
  };

  // create a list of all stacks in depth-first post order this means
  // that we first prepare the leaves and then work our way up.
  for (const node of iterateDfsPostorder(root)) { /* <== important to use postorder */
    if (includeStack(node)) {
      result.push(node);
    }
  }

  return result;
}
