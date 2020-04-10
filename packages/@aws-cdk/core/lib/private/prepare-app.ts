import { ConstructOrder } from 'constructs';
import { Construct } from '../construct-compat';
import { Stack } from '../stack';
import { resolveReferences } from './refs';

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
export function prepareApp(root: Construct) {
  if (root.node.scope) {
    throw new Error('prepareApp must be called on the root node');
  }

  const nestedStacks = findAllNestedStacks(root);

  let more = true;
  while (more) {
    resolveReferences(root);
    more = defineNestedStackAssets(nestedStacks);
  }
}

/**
 * Prepares the assets for nested stacks in this app.
 * @returns `true` if assets were added to the parent of a nested stack, which
 * implies that another round of reference resolution is in order. If this
 * function returns `false`, we know we are done.
 */
function defineNestedStackAssets(nestedStacks: Stack[]): boolean {
  for (const stack of nestedStacks) {
    // this is needed temporarily until we move NestedStack to '@aws-cdk/core'.
    const nested: INestedStackPrivateApi = stack as any;

    // '_prepareTemplateAsset' returns `true` if an asset was added to the nested stack's parent
    if (nested._prepareTemplateAsset()) {
      return true;
    }
  }

  // we are done, no more cycles
  return false;
}

function findAllNestedStacks(root: Construct) {
  const result = new Array<Stack>();

  // create a list of all nested stacks in depth-first post order this means
  // that we first prepare the leaves and then work our way up.
  for (const stack of root.node.findAll(ConstructOrder.POSTORDER /* <== important */)) {
    if (Stack.isStack(stack) && stack.nested) {
      result.push(stack);
    }
  }

  return result;
}

interface INestedStackPrivateApi {
  _prepareTemplateAsset(): boolean;
}
