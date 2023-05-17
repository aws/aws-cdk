import { mkGraph, nodeNames } from './util';
import { GraphNode } from '../../../lib/helpers-internal';

describe('with nested graphs', () => {
  const graph = mkGraph('G', G => {
    let aa: GraphNode<any>;

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

test('duplicate dependencies are ignored', () => {
  mkGraph('G', G => {
    const A = G.graph('A', [], GA => {
      GA.node('aa');
    });

    // parent graph depnds on A also
    const B = G.graph('B', [A], GB => {
      // duplicate dependency on A
      GB.graph('BB', [A], GBB => {
        GBB.node('bbb');
      });
      GB.node('bb');
    });

    expect(nodeNames(B.tryGetChild('BB')!.allDeps)).toStrictEqual(['A']);
  });
});
