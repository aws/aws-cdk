import type { IConstruct } from 'constructs';
import { isCfnResource, NESTED_STACK_TYPE, STACK_TYPE, STAGE_TYPE } from './core-construct-finders';
import { LinkedQueue } from './linked-queue';
import type { CfnResource } from '../cfn-resource';
import type { Stage } from '../stage';

/**
 * Depth-first iterator over the construct tree
 *
 * Replaces `node.findAll()` which both uses recursive function
 * calls and accumulates into an array, both of which are much slower
 * than this solution.
 */
export function* iterateDfsPreorder(root: IConstruct) {
  const stack: IConstruct[] = [root];

  let next = stack.pop();
  while (next) {
    // Reverse the children so that they get popped in original array order,
    // consistent with the behavior of `node.findAll()`.
    stack.push(...next.node.children.reverse());
    yield next;

    next = stack.pop();
  }
}

/**
 * Depth-first iterator over the cloud assemblies at or below the given Stage, parents first
 *
 * Yields the given Stage itself, plus every Stage nested inside it. Parents come
 * before their children, so a parent assembly can be processed before the
 * assemblies nested inside it.
 *
 * A Stage does not have to be a direct child of its parent assembly: it can be
 * nested underneath any number of regular constructs, so this walks the entire
 * tree, the same way `synthNestedAssemblies` does when it synthesizes them.
 */
export function* iterateAssembliesPreorder(root: Stage): IterableIterator<Stage> {
  for (const construct of iterateDfsPreorder(root)) {
    if (STAGE_TYPE.isMarked(construct)) {
      yield construct;
    }
  }
}

/**
 * Depth-first iterator over the cloud assemblies at or below the given Stage, children first
 *
 * See `iterateAssembliesPreorder`.
 */
export function* iterateAssembliesPostorder(root: Stage): IterableIterator<Stage> {
  for (const construct of iterateDfsPostorder(root)) {
    if (STAGE_TYPE.isMarked(construct)) {
      yield construct;
    }
  }
}

/**
 * Depth-first iterator over CFN resources under the given construct, including the construct itself
 *
 * Will break at stack boundaries that logically form a different deployment unit: nested Stacks,
 * NestedStacks and Stages.
 *
 * Replaces `node.findAll()` which both uses recursive function
 * calls and accumulates into an array, both of which are much slower
 * than this solution.
 */
export function* iterateTemplateCfnResources(root: IConstruct): IterableIterator<CfnResource> {
  const stack: IConstruct[] = [root];

  let next = stack.pop();
  while (next) {
    if (NESTED_STACK_TYPE.isMarked(next)) {
      // Only the nested stack resource but nothing else
      if (next.nestedStackResource) {
        yield next.nestedStackResource;
      }
    } else if (STACK_TYPE.isMarked(next) || STAGE_TYPE.isMarked(next)) {
      // New deployment unit, do not recurse
    } else {
      if (isCfnResource(next)) {
        yield next;
      }
      // Reverse the children so that they get popped in original array order,
      // consistent with the behavior of `node.findAll()`.
      stack.push(...next.node.children.reverse());
    }

    next = stack.pop();
  }
}

/**
 * Depth-first iterator over the construct tree (post-order version)
 *
 * Replaces `node.findAll()` which both uses recursive function
 * calls and accumulates into an array, both of which are much slower
 * than this solution.
 */
export function* iterateDfsPostorder(root: IConstruct) {
  type Instruction = { yield: IConstruct } | { visit: IConstruct };
  const stack: Instruction[] = [{ visit: root }];

  let next = stack.pop();
  while (next) {
    if ('yield' in next) {
      yield next.yield;
    } else {
      stack.push({ yield: next.visit });
      stack.push(...next.visit.node.children.reverse().map((visit) => ({ visit })));
    }
    next = stack.pop();
  }
}

/**
 * Breadth-first iterator over the construct tree
 */
export function* iterateBfs(root: IConstruct) {
  // Use a specialized queue data structure. Using `Array.shift()`
  // has a huge performance penalty (difference on the order of
  // ~50ms vs ~1s to iterate a large construct tree)
  const queue = new LinkedQueue<{ construct: IConstruct; parent: IConstruct | undefined }>([{ construct: root, parent: undefined }]);

  let next = queue.shift();
  while (next) {
    for (const child of next.construct.node.children) {
      queue.push({ construct: child, parent: next.construct });
    }
    yield next;

    next = queue.shift();
  }
}

/**
 * Depth-first iterator over the construct tree, stopping at Stage boundaries
 *
 * A Stage is a separate deployment unit that synthesizes into its own cloud
 * assembly, and has already been synthesized by the time we get to the
 * enclosing Stage's synthesis. Passes that operate on a single deployment unit
 * must not revisit its contents.
 */
export function* iterateDfsPreorderStopAtStage(root: IConstruct) {
  const stack: IConstruct[] = [root];

  let next = stack.pop();
  while (next) {
    if (next !== root && STAGE_TYPE.isMarked(next)) {
      next = stack.pop();
      continue;
    }
    stack.push(...next.node.children.reverse());
    yield next;

    next = stack.pop();
  }
}

/**
 * Post-order depth-first iterator over the construct tree, stopping at Stage boundaries
 *
 * See `iterateDfsPreorderStopAtStage`.
 */
export function* iterateDfsPostorderStopAtStage(root: IConstruct) {
  type Instruction = { yield: IConstruct } | { visit: IConstruct };
  const stack: Instruction[] = [{ visit: root }];

  let next = stack.pop();
  while (next) {
    if ('yield' in next) {
      yield next.yield;
    } else if (next.visit === root || !STAGE_TYPE.isMarked(next.visit)) {
      stack.push({ yield: next.visit });
      stack.push(...next.visit.node.children.reverse().map((visit) => ({ visit })));
    }
    next = stack.pop();
  }
}
