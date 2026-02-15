import type { IConstruct } from 'constructs';
import { LinkedQueue } from './linked-queue';

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
    for (const child of next.node.children) {
      stack.push(child);
    }
    yield next;

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
