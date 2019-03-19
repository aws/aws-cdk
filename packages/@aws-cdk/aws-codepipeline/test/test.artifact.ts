import assets = require('@aws-cdk/assets');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');

export = {
  'CodePipeline Artifacts': {
    'can override Assets'(test: Test) {
      // given
      const stack = new cdk.Stack();
      const asset = new assets.ZipDirectoryAsset(stack, 'MyAsset', {
        path: __dirname
      });

      const artifact = new codepipeline.Artifact('MyArtifact');

      // when
      const overrides = stack.node.resolve(artifact.overrideAsset(asset));

      // then
      test.deepEqual(overrides.MyAssetS3Bucket68C9B344, {
        'Fn::GetArtifactAtt': ['MyArtifact', 'BucketName']
      });

      test.deepEqual(overrides.MyAssetS3VersionKey68E1A45D, {
        'Fn::GetArtifactAtt': ['MyArtifact', 'ObjectKey']
      });

      test.done();
    },
  },
};
