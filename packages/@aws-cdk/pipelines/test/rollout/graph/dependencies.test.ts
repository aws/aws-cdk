import { ExecutionGraph, ExecutionNode } from '../../../lib/rollout/graph';

class PlainNode extends ExecutionNode { }

describe('with nested graphs', () => {
  const graph = mkGraph('G', G => {
    let aa: ExecutionNode;

    const A = G.graph('A', [], GA => {
      aa = GA.node('aa');
    });

    // B -> A, (same-level dependency)
    G.graph('B', [A], B => {
      // bbb -> bb
      const bb = B.node('bb');
      B.node('bbb', [bb]);
    });

    // cc -> aa (cross-subgraph dependency)
    G.graph('C', [], C => {
      C.node('cc', [aa]);
    });

    // D -> aa (down-dependency)
    G.graph('D', [aa!], C => {
      C.node('dd', [aa]);
    });

    // ee -> A (up-dependency)
    G.graph('E', [], C => {
      C.node('ee', [A]);
    });
  });

  test('can get up-projected dependency list from graph', () => {
    const sorted = graph.sortedChildren();

    expect(nodeNames(sorted)).toEqual([
      ['A'],
      ['B', 'C', 'D', 'E'],
    ]);
  });

  test('can get down-projected dependency list from graph', () => {
    const sorted = graph.sortedLeaves();
    expect(nodeNames(sorted)).toEqual([
      ['aa'],
      ['bb', 'cc', 'dd', 'ee'],
      ['bbb'],
    ]);
  });
});

function mkGraph(name: string, block: (b: GraphBuilder) => void) {
  const graph = new ExecutionGraph(name);
  block({
    graph(name2, deps, block2) {
      const innerG = mkGraph(name2, block2);
      innerG.dependOn(...deps);
      graph.add(innerG);
      return innerG;
    },
    node(name2, deps) {
      const innerN = new PlainNode(name2);
      innerN.dependOn(...deps ?? []);
      graph.add(innerN);
      return innerN;
    },
  });
  return graph;
}


interface GraphBuilder {
  graph(name: string, deps: ExecutionNode[], block: (b: GraphBuilder) => void): ExecutionGraph;
  node(name: string, deps?: ExecutionNode[]): ExecutionNode;
}


function nodeNames(n: ExecutionNode): string;
function nodeNames(ns: ExecutionNode[]): string[];
function nodeNames(ns: ExecutionNode[][]): string[][];
function nodeNames(n: any): any {
  if (n instanceof ExecutionNode) { return n.name; }
  if (Array.isArray(n)) { return n.map(nodeNames); }
  throw new Error('oh no');
}