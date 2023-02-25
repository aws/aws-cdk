import { ConstructOrder, Dependable, IConstruct } from 'constructs';
import { resolveReferences } from './refs';
import { CfnResource } from '../cfn-resource';
import { Stack } from '../stack';
import { Stage } from '../stage';

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
  // apply dependencies between resources in depending subtrees
  for (const dependency of findTransitiveDeps(root)) {
    const targetCfnResources = findCfnResources(dependency.target);
    const sourceCfnResources = findCfnResources(dependency.source);

    for (const target of targetCfnResources) {
      for (const source of sourceCfnResources) {
        source.addDependency(target);
      }
    }
  }

  resolveReferences(root);

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
    // Adding nested stack assets may haved added CfnParameters to the top-level
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
  for (const stack of root.node.findAll(ConstructOrder.POSTORDER /* <== important */)) {
    if (includeStack(stack)) {
      result.push(stack);
    }
  }

  return result;
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

/**
 * Return all dependencies registered on this node or any of its children
 */
function findTransitiveDeps(root: IConstruct): Dependency[] {
  const found = new Map<IConstruct, Set<IConstruct>>(); // Deduplication map
  const ret = new Array<Dependency>();

  for (const source of root.node.findAll()) {
    for (const dependable of source.node.dependencies) {
      for (const target of Dependable.of(dependable).dependencyRoots) {
        let foundTargets = found.get(source);
        if (!foundTargets) { found.set(source, foundTargets = new Set()); }

        if (!foundTargets.has(target)) {
          ret.push({ source, target });
          foundTargets.add(target);
        }
      }
    }
  }

  return ret;
}


interface Dependency {
  readonly source: IConstruct;
  readonly target: IConstruct;
}
