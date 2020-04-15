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

  // depth-first (children first) queue of nested stacks. We will pop a stack
  // from the head of this queue to prepare it's template asset.
  const queue = findAllNestedStacks(root);

  while (true) {
    resolveReferences(root);

    const nested = queue.shift();
    if (!nested) {
      break;
    }

    defineNestedStackAsset(nested);
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
