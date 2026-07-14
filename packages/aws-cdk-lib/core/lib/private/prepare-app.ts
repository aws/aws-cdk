import type { IConstruct } from 'constructs';
import { resolveReferences } from './refs';
import { CfnResource } from '../cfn-resource';
import { debugModeEnabled } from '../debug';
import { Stack } from '../stack';
import { Stage } from '../stage';
import { iterateDfsPostorder, iterateDfsPreorder } from './construct-iteration';
import { writePropertyAssignmentMetadataForConstruct } from './resolve';
import { reifyConstructDependencies } from './synthesis-dependencies';

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

  // depth-first (children first) queue of nested stacks. We will pop a stack
  // from the head of this queue to prepare its template asset.
  //
  // Depth-first since the a nested stack's template hash will be reflected in
  // its parent's template, which then changes the parent's hash, etc.
  const queue = findAllNestedStacks(root);

  if (queue.length > 0) {
    while (queue.length > 0) {
      const nested = queue.shift()!;
      defineNestedStackAsset(nested);
    }

    // ▷[ Given the legacy synthesizer and a 3-or-deeper nesting of nested stacks ]
    //
    // Adding nested stack assets may have added CfnParameters to the top-level
    // stack which are referenced in a deeper-level stack. The values of these
    // parameters need to be carried through to the right location via Nested
    // Stack parameters, which `resolveReferences()` will do.
    //
    // Yes, this may add `Parameter` elements to a template whose hash has
    // already been calculated, but the invariant that if the functional part
    // of the template changes its hash will change is still upheld.
    resolveReferences(root);
  }
}

/**
 * Prepares the assets for nested stacks in this app.
 * @returns `true` if assets were added to the parent of a nested stack, which
 * implies that another round of reference resolution is in order. If this
 * function returns `false`, we know we are done.
 */
function defineNestedStackAsset(nestedStack: Stack) {
  // this is needed temporarily until we move NestedStack to '@aws-cdk/core'.
  const nested: INestedStackPrivateApi = nestedStack as any;
  nested._prepareTemplateAsset();
}

function findAllNestedStacks(root: IConstruct) {
  const result = new Array<Stack>();

  const includeStack = (stack: IConstruct): stack is Stack => {
    if (!Stack.isStack(stack)) { return false; }
    if (!stack.nested) { return false; }

    // test: if we are not within a stage, then include it.
    if (!Stage.of(stack)) { return true; }

    return Stage.of(stack) === root;
  };

  // create a list of all nested stacks in depth-first post order this means
  // that we first prepare the leaves and then work our way up.
  for (const node of iterateDfsPostorder(root)) { /* <== important to use postorder */
    if (includeStack(node)) {
      result.push(node);
    }
  }

  return result;
}

interface INestedStackPrivateApi {
  _prepareTemplateAsset(): boolean;
}
