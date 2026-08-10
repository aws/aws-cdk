import type { IConstruct } from 'constructs';
import { Dependable } from 'constructs';
import { resolveReferences } from './refs';
import { CfnResource } from '../cfn-resource';
import { Stack } from '../stack';
import { iterateDfsPostorder, iterateDfsPreorder } from './construct-iteration';
import { writePropertyAssignmentMetadataForConstruct } from './resolve';
import { debugModeEnabled } from '../debug';
import { STACK_TYPE, stageOf } from './core-construct-finders';
import { addDependency } from '../deps';

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
  // apply dependencies between resources in depending subtrees
  for (const dependency of findTransitiveDeps(root)) {
    const sourceTopLevelStack = topLevelStackOf(dependency.source);
    const targetTopLevelStack = topLevelStackOf(dependency.target);

    // Optimization: if source and target are under different top-level stacks,
    // every resource pair in the Cartesian product will resolve to the same
    // single assembly-level (stack-to-stack) dependency. Avoid the O(n*m)
    // expansion and apply the dependency once using representative elements.
    if (sourceTopLevelStack && targetTopLevelStack && sourceTopLevelStack !== targetTopLevelStack) {
      const sourceRep = findFirstCfnResource(dependency.source);
      const targetRep = findFirstCfnResource(dependency.target);
      if (sourceRep && targetRep) {
        addDependency(sourceRep, targetRep, `{${dependency.source.node.path}}.addDependency({${dependency.target.node.path}})`);
      }
      continue;
    }

    // Same top-level stack (or no stack found): expand to the Cartesian product
    // of resources. addResourceDependency handles nested stack boundaries
    // correctly via deps.ts (resourceInCommonStackFor).
    const targetCfnResources = findCfnResources(dependency.target);

    // Gets iterated multiple times so make the iterator concrete
    const sourceCfnResources = Array.from(findCfnResources(dependency.source));

    for (const target of targetCfnResources) {
      for (const source of sourceCfnResources) {
        source.addResourceDependency(target);
      }
    }
  }

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
    if (!STACK_TYPE.isMarked(stack)) { return false; }
    if (!stack.nested) { return false; }

    // test: if we are not within a stage, then include it.
    if (!stageOf(stack)) { return true; }

    return stageOf(stack) === root;
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

/**
 * Find all resources in a set of constructs
 */
function* findCfnResources(root: IConstruct): IterableIterator<CfnResource> {
  for (const node of iterateDfsPreorder(root)) {
    if (CfnResource.isCfnResource(node)) {
      yield node;
    }
  }
}

/**
 * Find the first CfnResource under a construct (used as a representative
 * for cross-stack dependency resolution where all resources resolve to the
 * same stack dependency).
 */
function findFirstCfnResource(root: IConstruct): CfnResource | undefined {
  for (const node of iterateDfsPreorder(root)) {
    if (CfnResource.isCfnResource(node)) {
      return node;
    }
  }
  return undefined;
}

/**
 * Return the top-level (non-nested) stack containing the given construct,
 * or undefined if the construct is not in a stack.
 */
function topLevelStackOf(construct: IConstruct): Stack | undefined {
  try {
    let stack = Stack.of(construct);
    while (stack.nestedStackParent) {
      stack = stack.nestedStackParent;
    }
    return stack;
  } catch {
    return undefined;
  }
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

  for (const source of iterateDfsPreorder(root)) {
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
