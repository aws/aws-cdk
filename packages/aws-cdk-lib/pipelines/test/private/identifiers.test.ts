import { Graph } from '../../lib/helpers-internal';
import { actionName } from '../../lib/private/identifiers';
import { mkGraph } from '../blueprint/helpers-internal/util';

test('actionName trims subcomponents the same way', () => {
  const long1 = 'ExtremelyLong'.repeat(10);
  const long2 = 'AlsoLong'.repeat(10);

  const g = mkGraph('MyGraph', G => {
    G.graph(long1, [], G1 => {
      G1.graph(long2, [], G2 => {
        G2.node('Prepare');
        G2.node('Deploy');
      });
    });
  });

  const G2 = ((g.tryGetChild(long1) as Graph<any>)?.tryGetChild(long2) as Graph<any>);
  expect(G2).toBeDefined();

  const prep = G2.tryGetChild('Prepare');
  const deploy = G2.tryGetChild('Deploy');

  expect(prep).toBeDefined();
  expect(deploy).toBeDefined();

  // ActionNames have the same prefix
  const prepParts = actionName(prep!, g).split('.');
  const deployParts = actionName(deploy!, g).split('.');

  // Final parts are unchanged
  expect(prepParts.pop()).toEqual('Prepare');
  expect(deployParts.pop()).toEqual('Deploy');
  // Prefixes are the same
  expect(prepParts).toEqual(deployParts);
});
