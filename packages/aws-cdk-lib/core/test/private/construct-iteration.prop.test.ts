import { ConstructOrder } from 'constructs';
import * as fc from 'fast-check';
import { iterateDfsPostorder, iterateDfsPreorder } from '../../lib/private/construct-iteration';
import { arbCdkAppFactory, buildConstructTree, initializeFastCheck } from '../arbitraries/arbitrary-constructs';

initializeFastCheck();

//////////////////////////////////////////////////////////////////////
//  Tests

test('the output of iterateDfsPreorder is equivalent to construct.node.findall', () =>
  fc.assert(
    fc.property(arbAppTree(), (app) => {
      const constructsPaths = app.constructTree.node.findAll().map(c => c.node.path);
      const iteratorPaths = Array.from(iterateDfsPreorder(app.constructTree)).map(c => c.node.path);

      expect(constructsPaths).toEqual(iteratorPaths);
    }),
  ),
);

test('the output of iterateDfsPostorder is equivalent to construct.node.findall', () =>
  fc.assert(
    fc.property(arbAppTree(), (app) => {
      const constructsPaths = app.constructTree.node.findAll(ConstructOrder.POSTORDER).map(c => c.node.path);
      const iteratorPaths = Array.from(iterateDfsPostorder(app.constructTree)).map(c => c.node.path);

      expect(constructsPaths).toEqual(iteratorPaths);
    }),
  ),
);

//////////////////////////////////////////////////////////////////////
//  Helpers

function arbAppTree() {
  return arbCdkAppFactory().map(a => buildConstructTree(a));
}
