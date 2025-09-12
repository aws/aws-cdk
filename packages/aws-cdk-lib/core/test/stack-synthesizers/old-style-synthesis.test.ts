import { FileAssetPackaging, Stack, FileAssetSource, LegacyStackSynthesizer } from '../../lib';

// Remove this file in v2
test('overridden method on stack gets called', () => {
  let called = false;

  class MyStack extends Stack {
    public addFileAsset(asset: FileAssetSource) {
      called = true;
      return super.addFileAsset(asset);
    }
  }

  const stack = new MyStack(undefined, 'Stack', {
    synthesizer: new LegacyStackSynthesizer(),
  });
  stack.synthesizer.addFileAsset({
    fileName: __filename,
    packaging: FileAssetPackaging.FILE,
    sourceHash: 'file-asset-hash',
  });

  expect(called).toEqual(true);
});
