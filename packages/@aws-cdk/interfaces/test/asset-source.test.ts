import { AssetSource } from '../lib';

test('AssetSource has expected properties', () => {
  const mySource: AssetSource = {
    path: 'path/to/source',
    assetHash: 'custom-asset-hash',
  };

  expect(mySource).toHaveProperty('path');
  expect(mySource).toHaveProperty('assetHash');
});