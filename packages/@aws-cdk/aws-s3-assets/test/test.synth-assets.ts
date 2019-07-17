import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AssetPackaging, SynthesizedAsset } from '../lib';

export = {
  'basic use case'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'test-stack');

    // WHEN
    new SynthesizedAsset(stack, 'synthesized-asset', {
      assemblyPath: 'output.txt',
      packaging: AssetPackaging.FILE,
      sourceHash: 'boom',
    });

    // THEN
    const assembly = app.synth();

    // asset metadata is attached to the stck and points to our output file
    test.deepEqual(assembly.stacks[0].assets, [ {
      path: 'output.txt',
      id: 'teststacksynthesizedassetA31B153D',
      packaging: 'file',
      sourceHash: 'boom',
      s3BucketParameter: 'synthesizedassetS3Bucket896BF9A1',
      s3KeyParameter: 'synthesizedassetS3VersionKeyA181F731',
      artifactHashParameter: 'synthesizedassetArtifactHash81613B77' }
    ]);

    // parameters are synthesized into the stack
    test.deepEqual(assembly.stacks[0].template, { Parameters:
      { synthesizedassetS3Bucket896BF9A1: { Type: 'String', Description: 'S3 bucket for asset "test-stack/synthesized-asset"' },
        synthesizedassetS3VersionKeyA181F731: { Type: 'String', Description: 'S3 key for asset version "test-stack/synthesized-asset"' },
        synthesizedassetArtifactHash81613B77: { Type: 'String', Description: 'Artifact hash for asset "test-stack/synthesized-asset"' } } });
    test.done();
  }
};
