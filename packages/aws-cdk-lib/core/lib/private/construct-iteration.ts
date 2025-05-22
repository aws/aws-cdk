import { IConstruct } from 'constructs';
import { LinkedQueue } from './linked-queue';

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
