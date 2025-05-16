import { IConstruct } from 'constructs';
import { LinkedQueue } from './linked-queue';

/**
 * Breadth-first iterator over the construct tree
 *
 * Replaces `node.findAll()` which both uses recursive function
 * calls and accumulates into an array, both of which are much slower
 * than this solution.
 */
export function* iterateDfsPreorder(root: IConstruct) {
  // Use a specialized queue data structure. Using `Array.shift()`
  // has a huge performance penalty (difference on the order of
  // ~50ms vs ~1s to iterate a large construct tree)
  const queue: IConstruct[] = [root];

  let next = queue.pop();
  while (next) {
    // Get at the construct internals to get at the children faster
    // const children: Record<string, IConstruct> = (next.construct.node as any)._children;
    for (const child of next.node.children) {
      queue.push(child);
    }
    yield next;

    next = queue.pop();
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
