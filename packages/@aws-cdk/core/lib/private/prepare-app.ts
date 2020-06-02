import { ConstructOrder } from 'constructs';
import { CfnResource } from '../cfn-resource';
import { IConstruct } from '../construct-compat';
import { NestedStack } from '../nested-stack';
import { Stack } from '../stack';
import { resolveReferences } from './refs';
import { allConstructsInAssembler, AssemblerConstruct } from './scopes';

/**
 * Prepares the cloud assembly for synthesis.
 *
 * This function is called by the construct that is going to produce the Cloud
 * Assembly.
 *
 * (Normally this either the App or the Stage, but if a Stack is a root, it is
 * called by the stack), which means it's the last 'prepare' that executes.
 *
 * It takes care of reifying cross-references between stacks (or nested stacks),
 * and of creating assets for nested stack templates.
 *
 * @param root The root of the construct tree.
 */
export function stabilizeAutomaticReferences(root: AssemblerConstruct | Stack) {
  // Exception for rootless stacks (in unit tests)
  if (Stack.isStack(root) && root.node.scope) {
    throw new Error('When calling prepareApp on a Stack, the Stack must be unscoped');
  }

  // apply dependencies between resources in depending subtrees
  for (const dependency of root.node.dependencies) {
    const targetCfnResources = findCfnResources(dependency.target);
    const sourceCfnResources = findCfnResources(dependency.source);

    for (const target of targetCfnResources) {
      for (const source of sourceCfnResources) {
        source.addDependsOn(target);
      }
    }
  }

  // depth-first (children first) queue of nested stacks. We will pop a stack
  // from the head of this queue to prepare its template asset.
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

function findAllNestedStacks(root: AssemblerConstruct | Stack): Stack[] {
  const constructs = Stack.isStack(root)
    ? root.node.findAll(ConstructOrder.POSTORDER /* <== important */)
    : allConstructsInAssembler(root, ConstructOrder.POSTORDER /* <== important */);

  return constructs.filter(isNestedStack);

  function isNestedStack(c: IConstruct): c is NestedStack {
    return Stack.isStack(c) && c.nested;
  }
}

/**
 * Find all resources in a set of constructs
 */
function findCfnResources(root: IConstruct): CfnResource[] {
  return root.node.findAll().filter(CfnResource.isCfnResource);
}

interface INestedStackPrivateApi {
  _prepareTemplateAsset(): boolean;
}
