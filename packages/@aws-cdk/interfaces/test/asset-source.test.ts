import { AssetSource } from '../lib';

test('AssetSource has expected properties', () => {
  const mySource: AssetSource = {
    path: 'path/to/source',
    pathToGenerateAssetHash: 'path/to/files/for/generating/asset/hash',
  };

  expect(mySource).toHaveProperty('path');
  expect(mySource).toHaveProperty('pathToGenerateAssetHash');
});