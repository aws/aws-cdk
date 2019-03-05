import cdk = require('@aws-cdk/cdk');
// import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import path = require('path');
import { AssetPackaging } from '../lib';
import { AssetArtifact } from '../lib/artifact';

export = {
  'assets are deduplicated based on their fingerprint'(test: Test) {
    const app = new cdk.App();

    const assetPath = path.join(__dirname, 'sample-asset-directory');

    // note that stacks are also mapped to different environments
    const stack1 = new cdk.Stack(app, 'stack1', { env: { account: '11111', region: 'us-east-1' } });
    const stack2 = new cdk.Stack(app, 'stack2', { env: { account: '22222', region: 'xx-auaa-3' } });

    const construct1 = new cdk.Construct(stack1, 'SubConstruct');

    // define an asset within the scope of construct1 which is under stack1
    const artifact1 = AssetArtifact.forAsset(construct1, {
      path: assetPath,
      packaging: AssetPackaging.ZipDirectory
    });

    // another "artifact" within the scope of stack2, but with the same path/packaging
    const artifact2 = AssetArtifact.forAsset(stack2, {
      path: assetPath,
      packaging: AssetPackaging.ZipDirectory
    });

    // we expect them to be the same object
    test.same(artifact1, artifact2);

    // this effectively adds CFN parameters to both stacks that are mapped to the same asset
    // which is defined at the app level
    artifact1.wireToStack(stack1);
    artifact1.wireToStack(stack2);

    // synthesize!
    app.run();

    // // now let's see, each stack should have a single metadata entry for the asset
    // const md1 = findAssetMetadata(session.manifest, 'stack1');
    // const md2 = findAssetMetadata(session.manifest, 'stack2');

    // test.equal(md1.length, 1);
    // test.equal(md2.length, 1);

    // // id and path should be the same
    // test.deepEqual(md2[0].data.path, assetPath);
    // test.deepEqual(md1[0].data.id, md2[0].data.id);
    // test.deepEqual(md2[0].data.path, md2[0].data.path);

    // // templates should be the same because parameters are based on the fingerprint
    // const stack1Template = session.store.readJson('stack1.template.json');
    // const stack2Template = session.store.readJson('stack2.template.json');
    // test.deepEqual(stack1Template, {
    //   Parameters: {
    //     assetb55390fe84158c95af1195e7d42c27e0S3Bucket: {
    //       Type: 'String',
    //       Description: `S3 bucket for asset b55390fe84158c95af1195e7d42c27e0 from ${assetPath}`
    //     },
    //     assetb55390fe84158c95af1195e7d42c27e0S3Key: {
    //       Type: 'String',
    //       Description: `S3 key for asset b55390fe84158c95af1195e7d42c27e0 from ${assetPath}`
    //     }
    //   }
    // });
    // test.deepEqual(stack1Template, stack2Template);

    // // // s3bucket and s3key param IDs should be different (different stacks)
    // test.deepEqual(md1[0].data.s3BucketParameter, 'assetb55390fe84158c95af1195e7d42c27e0S3Bucket');
    // test.deepEqual(md2[0].data.s3KeyParameter, 'assetb55390fe84158c95af1195e7d42c27e0S3Key');

    test.done();
  }
};

// function findAssetMetadata(manifest: cxapi.AssemblyManifest, artifactId: string) {
//   return Array.from(findMetadata()).filter(m => m.type === cxapi.ASSET_METADATA);

//   function* findMetadata() {
//     const artifact: cxapi.Artifact = (manifest.artifacts || {})[artifactId] || {};
//     for (const entries of Object.values(artifact.metadata || {})) {
//       for (const md of entries) {
//         yield md;
//       }
//     }
//   }
// }