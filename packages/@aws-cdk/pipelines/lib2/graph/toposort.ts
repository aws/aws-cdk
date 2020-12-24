import { ExecutionNode } from './index';

export function topoSort(nodes: Set<ExecutionNode>, dependencies: Map<ExecutionNode, Set<ExecutionNode>>): ExecutionNode[][] {
  const remaining = new Set<ExecutionNode>(nodes);

  const ret: ExecutionNode[][] = [];
  while (remaining.size > 0) {
    // All elements with no more deps in the set can be ordered
    const selectable = Array.from(remaining.values()).filter(e => dependencies.get(e)!.size === 0);
    selectable.sort((a, b) => a.name < b.name ? -1 : b.name < a.name ? 1 : 0);

    // If we didn't make any progress, we got stuck
    if (selectable.length === 0) {
      const cycle = findCycle(dependencies);
      throw new Error(`Dependency cycle in graph: ${cycle.map(n => n.name).join(' => ')}`);
    }

    ret.push(selectable);

    for (const selected of selectable) {
      remaining.delete(selected);
      for (const depSet of dependencies.values()) {
        depSet.delete(selected);
      }
    }
  }

  return ret;
}

/**
 * Find cycles in a graph
 *
 * Not the fastest, but effective and should be rare
 */
function findCycle(deps: Map<ExecutionNode, Set<ExecutionNode>>): ExecutionNode[] {
  for (const node of deps.keys()) {
    const cycle = recurse(node, []);
    if (cycle) { return cycle; }
  }
  throw new Error('No cycle found. Assertion failure!');

  function recurse(node: ExecutionNode, path: ExecutionNode[]): ExecutionNode[] | undefined {
    path = [...path, node];

    const index = path.indexOf(node);
    if (index > -1) {
      return path;
    }

    for (const dep of deps.get(node) ?? []) {
      const cycle = recurse(dep, path);
      if (cycle) { return cycle; }
    }

    return undefined;
  }
}