import { expect, haveResource, ResourcePart, SynthUtils } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import { FileAsset, ZipDirectoryAsset } from '../lib/asset';

const SAMPLE_ASSET_DIRECTORY = path.join(__dirname, 'sample-asset-directory');

export = {
  'simple use case'(test: Test)  {
    const stack = new cdk.Stack();

    new ZipDirectoryAsset(stack, 'MyAsset', {
      path: SAMPLE_ASSET_DIRECTORY
    });

    // verify that metadata contains an "aws:cdk:asset" entry with
    // the correct information
    const entry = stack.node.metadata.find(m => m.type === 'aws:cdk:asset');
    test.ok(entry, 'metadata entry not found');

    // console.error(JSON.stringify(stack.node.resolve(entry!.data)));

    test.deepEqual(stack.node.resolve(entry!.data), {
      path: SAMPLE_ASSET_DIRECTORY,
      id: 'asset.b55390fe84158c95af1195e7d42c27e0',
      packaging: 'zip',
      s3BucketParameter: 'assetb55390fe84158c95af1195e7d42c27e0S3Bucket',
      s3KeyParameter: 'assetb55390fe84158c95af1195e7d42c27e0S3Key',
    });

    // verify that now the template contains parameters for this asset
    const template = stack._toCloudFormation();
    test.equal(template.Parameters.assetb55390fe84158c95af1195e7d42c27e0S3Bucket.Type, 'String');
    test.equal(template.Parameters.assetb55390fe84158c95af1195e7d42c27e0S3Key.Type, 'String');
    // const template = SynthUtils.toCloudFormation(stack);
    // test.equal(template.Parameters.MyAssetS3Bucket68C9B344.Type, 'String');
    // test.equal(template.Parameters.MyAssetS3VersionKey68E1A45D.Type, 'String');

    test.done();
  },

  'verify that the app resolves tokens in metadata'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');

    new ZipDirectoryAsset(stack, 'MyAsset', {
      path: SAMPLE_ASSET_DIRECTORY
    });

    const synth = app.synthesizeStack(stack.name);

    test.deepEqual(synth.metadata['/my-stack'][0].data, {
      path: SAMPLE_ASSET_DIRECTORY,
      id: "asset.b55390fe84158c95af1195e7d42c27e0",
      packaging: "zip",
      s3BucketParameter: "assetb55390fe84158c95af1195e7d42c27e0S3Bucket",
      s3KeyParameter: "assetb55390fe84158c95af1195e7d42c27e0S3Key"
    });

    test.done();
  },

  '"file" assets'(test: Test) {
    const stack = new cdk.Stack();
    const filePath = path.join(__dirname, 'file-asset.txt');
    new FileAsset(stack, 'MyAsset', { path: filePath });

    const entry = stack.node.metadata.find(m => m.type === 'aws:cdk:asset');
    test.ok(entry, 'found metadata entry');
    test.deepEqual(stack.node.resolve(entry!.data), {
      path: filePath,
      packaging: 'file',
      id: 'asset.79b1fc4ccf3c001c3dc7aa7b45dd071f',
      s3BucketParameter: 'asset79b1fc4ccf3c001c3dc7aa7b45dd071fS3Bucket',
      s3KeyParameter: 'asset79b1fc4ccf3c001c3dc7aa7b45dd071fS3Key',
    });

    // verify that now the template contains parameters for this asset
<<<<<<< HEAD
    const template = stack.toCloudFormation();
    test.equal(template.Parameters.asset79b1fc4ccf3c001c3dc7aa7b45dd071fS3Bucket.Type, 'String');
    test.equal(template.Parameters.asset79b1fc4ccf3c001c3dc7aa7b45dd071fS3Key.Type, 'String');
=======
    const template = SynthUtils.toCloudFormation(stack);
    test.equal(template.Parameters.MyAssetS3Bucket68C9B344.Type, 'String');
    test.equal(template.Parameters.MyAssetS3VersionKey68E1A45D.Type, 'String');
>>>>>>> master

    test.done();
  },

  '"readers" or "grantRead" can be used to grant read permissions on the asset to a principal'(test: Test) {
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'MyUser');
    const group = new iam.Group(stack, 'MyGroup');

    const asset = new ZipDirectoryAsset(stack, 'MyAsset', {
      path: SAMPLE_ASSET_DIRECTORY,
      readers: [ user ]
    });

    asset.grantRead(group);

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ["s3:GetObject*", "s3:GetBucket*", "s3:List*"],
            Effect: 'Allow',
            Resource: [
              { "Fn::Join": ["", ["arn:", {Ref: "AWS::Partition"}, ":s3:::", {Ref: "assetb55390fe84158c95af1195e7d42c27e0S3Bucket"}]] },
              { "Fn::Join": ["",
                [
                  "arn:", {Ref: "AWS::Partition"}, ":s3:::", {Ref: "assetb55390fe84158c95af1195e7d42c27e0S3Bucket"},
                  "/",
                  { "Fn::Select": [0, { "Fn::Split": [ "||", { Ref: "assetb55390fe84158c95af1195e7d42c27e0S3Key" }] }] },
                  "*"
                ]
              ] }
            ]
          }
        ]
      }
    }));

    test.done();
  },

  'fails if directory not found'(test: Test) {
    const stack = new cdk.Stack();
    test.throws(() => new ZipDirectoryAsset(stack, 'MyDirectory', {
      path: '/path/not/found/' + Math.random() * 999999
    }));
    test.done();
  },

  'multiple assets under the same parent'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');

    // WHEN
    new ZipDirectoryAsset(stack, 'MyDirectory1', { path: SAMPLE_ASSET_DIRECTORY });
    new ZipDirectoryAsset(stack, 'MyDirectory2', { path: SAMPLE_ASSET_DIRECTORY });

    // THEN
    const output = app.run();
    const s = (output.manifest.artifacts || {}).stack;
    const assets = Object.values(s.metadata || {}).reduce((a, m) => [ ...a, ...m.filter((x: any) => x.type === cxapi.ASSET_METADATA) ], []);
    test.deepEqual(assets.length, 1); // we have a single asset because they point to the same directory
    test.done();
  },

  'isZipArchive indicates if the asset represents a .zip file (either explicitly or via ZipDirectory packaging)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const nonZipAsset = new FileAsset(stack, 'NonZipAsset', {
      path: path.join(SAMPLE_ASSET_DIRECTORY, 'sample-asset-file.txt')
    });

    const zipDirectoryAsset = new ZipDirectoryAsset(stack, 'ZipDirectoryAsset', {
      path: SAMPLE_ASSET_DIRECTORY
    });

    const zipFileAsset = new FileAsset(stack, 'ZipFileAsset', {
      path: path.join(SAMPLE_ASSET_DIRECTORY, 'sample-zip-asset.zip')
    });

    const jarFileAsset = new FileAsset(stack, 'JarFileAsset', {
      path: path.join(SAMPLE_ASSET_DIRECTORY, 'sample-jar-asset.jar')
    });

    // THEN
    test.equal(nonZipAsset.isZipArchive, false);
    test.equal(zipDirectoryAsset.isZipArchive, true);
    test.equal(zipFileAsset.isZipArchive, true);
    test.equal(jarFileAsset.isZipArchive, true);
    test.done();
  },

  'addResourceMetadata can be used to add CFN metadata to resources'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    stack.node.setContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT, true);

<<<<<<< HEAD
    const location = SAMPLE_ASSET_DIRECTORY;
    const resource = new cdk.Resource(stack, 'MyResource', { type: 'My::Resource::Type' });
=======
    const location = path.join(__dirname, 'sample-asset-directory');
    const resource = new cdk.CfnResource(stack, 'MyResource', { type: 'My::Resource::Type' });
>>>>>>> master
    const asset = new ZipDirectoryAsset(stack, 'MyAsset', { path: location });

    // WHEN
    asset.addResourceMetadata(resource, 'PropName');

    // THEN
    expect(stack).to(haveResource('My::Resource::Type', {
      Metadata: {
        "aws:asset:path": location,
        "aws:asset:property": "PropName"
      }
    }, ResourcePart.CompleteDefinition));
    test.done();
  },

  'asset metadata is only emitted if ASSET_RESOURCE_METADATA_ENABLED_CONTEXT is defined'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

<<<<<<< HEAD
    const location = SAMPLE_ASSET_DIRECTORY;
    const resource = new cdk.Resource(stack, 'MyResource', { type: 'My::Resource::Type' });
=======
    const location = path.join(__dirname, 'sample-asset-directory');
    const resource = new cdk.CfnResource(stack, 'MyResource', { type: 'My::Resource::Type' });
>>>>>>> master
    const asset = new ZipDirectoryAsset(stack, 'MyAsset', { path: location });

    // WHEN
    asset.addResourceMetadata(resource, 'PropName');

    // THEN
    expect(stack).notTo(haveResource('My::Resource::Type', {
      Metadata: {
        "aws:asset:path": location,
        "aws:asset:property": "PropName"
      }
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'if the asset directory looks like a temporary directory, copy the asset to CDK_OUTDIR so it will be available after the program ends'(test: Test) {
    const outdir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cdk.out')));

    const app = new cdk.App({ outdir });
    const stack = new cdk.Stack(app, 'mystack');

    const assetPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'asset')), 'asset.txt');
    fs.writeFileSync(assetPath, 'hello, my asset');

    new FileAsset(stack, 'ExternousAsset', {
      path: assetPath
    });

    const session = app.run();

    const assets = findAssets(session.manifest);

    test.deepEqual(assets.length, 1);
    test.deepEqual(assets[0].data.path, 'foo');

    test.done();
  },
};

function findAssets(manifest: cxapi.AssemblyManifest): cxapi.MetadataEntry[] {
  return Array.from(gen());

  function* gen() {
    for (const artifact of Object.values(manifest.artifacts || {})) {
      for (const cmd of Object.values(artifact.metadata || {})) {
        for (const md of cmd) {
          if (md.type === cxapi.ASSET_METADATA) {
            yield md;
          }
        }
      }
    }
  }
}
