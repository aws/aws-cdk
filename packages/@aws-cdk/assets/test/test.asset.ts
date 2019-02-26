import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import path = require('path');
import { FileAsset, ZipDirectoryAsset } from '../lib/asset';

const SAMPLE_ASSET_DIRECTORY = path.join(__dirname, 'sample-asset-directory');
const SAMPLE_FILE_ASSET = path.join(SAMPLE_ASSET_DIRECTORY, 'sample-asset-file.txt');
const SAMPLE_ZIP_ASSET = path.join(SAMPLE_ASSET_DIRECTORY, 'sample-zip-asset.zip');
const SAMPLE_JAR_ASSET = path.join(SAMPLE_ASSET_DIRECTORY, 'sample-jar-asset.jar');
const FILE_ASSET = path.join(__dirname, 'file-asset.txt');

export = {
  'simple use case'(test: Test)  {
    const stack = new cdk.Stack();
    const asset = new ZipDirectoryAsset(stack, 'MyAsset', {
      path: SAMPLE_ASSET_DIRECTORY
    });

    // verify that metadata contains an "aws:cdk:asset" entry with
    // the correct information
    const entry = asset.node.metadata.find(m => m.type === 'aws:cdk:asset');
    test.ok(entry, 'found metadata entry');

    // console.error(JSON.stringify(stack.node.resolve(entry!.data)));

    test.deepEqual(stack.node.resolve(entry!.data), {
      path: './MyAsset',
      id: 'MyAsset',
      packaging: 'zip',
      s3BucketParameter: 'MyAssetS3Bucket68C9B344',
      s3KeyParameter: 'MyAssetS3VersionKey68E1A45D',
    });

    // verify that now the template contains parameters for this asset
    const template = stack.toCloudFormation();
    test.equal(template.Parameters.MyAssetS3Bucket68C9B344.Type, 'String');
    test.equal(template.Parameters.MyAssetS3VersionKey68E1A45D.Type, 'String');

    test.done();
  },

  'verify that the app resolves tokens in metadata'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');

    new ZipDirectoryAsset(stack, 'MyAsset', {
      path: SAMPLE_ASSET_DIRECTORY
    });

    const synth = app.synthesizeStack(stack.name);

    test.deepEqual(synth.metadata['/my-stack/MyAsset'][0].data, {
      path: './mystackMyAssetD6B1B593',
      id: "mystackMyAssetD6B1B593",
      packaging: "zip",
      s3BucketParameter: "MyAssetS3Bucket68C9B344",
      s3KeyParameter: "MyAssetS3VersionKey68E1A45D"
    });

    test.done();
  },

  '"file" assets'(test: Test) {
    const stack = new cdk.Stack();
    const asset = new FileAsset(stack, 'MyAsset', { path: FILE_ASSET });
    const entry = asset.node.metadata.find(m => m.type === 'aws:cdk:asset');
    test.ok(entry, 'found metadata entry');
    test.deepEqual(stack.node.resolve(entry!.data), {
      path: './MyAsset/file-asset.txt',
      packaging: 'file',
      id: 'MyAsset',
      s3BucketParameter: 'MyAssetS3Bucket68C9B344',
      s3KeyParameter: 'MyAssetS3VersionKey68E1A45D',
    });

    // verify that now the template contains parameters for this asset
    const template = stack.toCloudFormation();
    test.equal(template.Parameters.MyAssetS3Bucket68C9B344.Type, 'String');
    test.equal(template.Parameters.MyAssetS3VersionKey68E1A45D.Type, 'String');

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
              { "Fn::Join": ["", ["arn:", {Ref: "AWS::Partition"}, ":s3:::", {Ref: "MyAssetS3Bucket68C9B344"}]] },
              { "Fn::Join": ["",
                [
                  "arn:", {Ref: "AWS::Partition"}, ":s3:::", {Ref: "MyAssetS3Bucket68C9B344"},
                  "/",
                  { "Fn::Select": [0, { "Fn::Split": [ "||", { Ref: "MyAssetS3VersionKey68E1A45D" }] }] },
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
    const stack = new cdk.Stack();

    // WHEN
    new ZipDirectoryAsset(stack, 'MyDirectory1', { path: '.' });
    new ZipDirectoryAsset(stack, 'MyDirectory2', { path: '.' });

    // THEN: no error

    test.done();
  },

  'isZipArchive indicates if the asset represents a .zip file (either explicitly or via ZipDirectory packaging)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const nonZipAsset = new FileAsset(stack, 'NonZipAsset', {
      path: SAMPLE_FILE_ASSET
    });

    const zipDirectoryAsset = new ZipDirectoryAsset(stack, 'ZipDirectoryAsset', {
      path: SAMPLE_ASSET_DIRECTORY
    });

    const zipFileAsset = new FileAsset(stack, 'ZipFileAsset', {
      path: SAMPLE_ZIP_ASSET
    });

    const jarFileAsset = new FileAsset(stack, 'JarFileAsset', {
      path: SAMPLE_JAR_ASSET
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

    const resource = new cdk.Resource(stack, 'MyResource', { type: 'My::Resource::Type' });
    const asset = new ZipDirectoryAsset(stack, 'MyAsset', { path: SAMPLE_ASSET_DIRECTORY });

    // WHEN
    asset.addResourceMetadata(resource, 'PropName');

    // THEN
    expect(stack).to(haveResource('My::Resource::Type', {
      Metadata: {
        "aws:asset:path": './MyAsset',
        "aws:asset:property": "PropName"
      }
    }, ResourcePart.CompleteDefinition));
    test.done();
  },

  'asset metadata is only emitted if ASSET_RESOURCE_METADATA_ENABLED_CONTEXT is defined'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const resource = new cdk.Resource(stack, 'MyResource', { type: 'My::Resource::Type' });
    const asset = new ZipDirectoryAsset(stack, 'MyAsset', { path: SAMPLE_ASSET_DIRECTORY });

    // WHEN
    asset.addResourceMetadata(resource, 'PropName');

    // THEN
    expect(stack).notTo(haveResource('My::Resource::Type', {
      Metadata: {
        "aws:asset:path": SAMPLE_ASSET_DIRECTORY,
        "aws:asset:property": "PropName"
      }
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'assets are emitted to session directory upon synthesis'(test: Test) {
    const app = new cdk.App();

    const stack = new cdk.Stack(app, 'MyStack');

    const dirAsset = new ZipDirectoryAsset(stack, 'MyZipDirectory', {
      path: SAMPLE_ASSET_DIRECTORY,
      copyOptions: {
        exclude: [ '*jar*' ]
      }
    });

    const fileAsset = new FileAsset(stack, 'MyFile', {
      path: FILE_ASSET
    });

    const session = app.run();

    test.ok(session.exists(dirAsset.artifactName));
    test.ok(session.exists(fileAsset.artifactName));

    test.deepEqual(session.readdir(dirAsset.artifactName), [
      'sample-asset-file.txt',
      'sample-zip-asset.zip'
    ]);

    test.deepEqual(session.readdir(fileAsset.artifactName), [
      'file-asset.txt'
    ]);

    const manifest: cxapi.SynthesizeResponse = JSON.parse(session.readFile(cxapi.OUTFILE_NAME));
    const metadata = manifest.stacks[0].metadata;
    test.deepEqual(metadata['/MyStack/MyZipDirectory'][0].data.path, './MyStackMyZipDirectory6091175A');
    test.deepEqual(metadata['/MyStack/MyFile'][0].data.path, './MyStackMyFile3667B666/file-asset.txt');

    test.done();
  }
};
