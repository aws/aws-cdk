import { expect, haveResource, ResourcePart, SynthUtils } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { App, Stack } from '@aws-cdk/cdk';
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import { FileAsset, ZipDirectoryAsset } from '../lib/asset';

const SAMPLE_ASSET_DIR = path.join(__dirname, 'sample-asset-directory');

export = {
  'simple use case'(test: Test)  {
    const stack = new cdk.Stack();
    const asset = new ZipDirectoryAsset(stack, 'MyAsset', {
      path: SAMPLE_ASSET_DIR
    });

    // verify that metadata contains an "aws:cdk:asset" entry with
    // the correct information
    const entry = asset.node.metadata.find(m => m.type === 'aws:cdk:asset');
    test.ok(entry, 'found metadata entry');

    // verify that now the template contains parameters for this asset
    const template = SynthUtils.toCloudFormation(stack);

    test.deepEqual(stack.node.resolve(entry!.data), {
      path: SAMPLE_ASSET_DIR,
      id: 'MyAsset',
      packaging: 'zip',
      s3BucketParameter: 'MyAssetS3Bucket68C9B344',
      s3KeyParameter: 'MyAssetS3VersionKey68E1A45D',
    });

    test.equal(template.Parameters.MyAssetS3Bucket68C9B344.Type, 'String');
    test.equal(template.Parameters.MyAssetS3VersionKey68E1A45D.Type, 'String');

    test.done();
  },

  'verify that the app resolves tokens in metadata'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const dirPath = path.resolve(__dirname, 'sample-asset-directory');

    new ZipDirectoryAsset(stack, 'MyAsset', {
      path: dirPath
    });

    const synth = app.synthesizeStack(stack.name);

    test.deepEqual(synth.metadata['/my-stack/MyAsset'][0].data, {
      path: dirPath,
      id: "mystackMyAssetD6B1B593",
      packaging: "zip",
      s3BucketParameter: "MyAssetS3Bucket68C9B344",
      s3KeyParameter: "MyAssetS3VersionKey68E1A45D"
    });

    test.done();
  },

  '"file" assets'(test: Test) {
    const stack = new cdk.Stack();
    const filePath = path.join(__dirname, 'file-asset.txt');
    const asset = new FileAsset(stack, 'MyAsset', { path: filePath });
    const entry = asset.node.metadata.find(m => m.type === 'aws:cdk:asset');
    test.ok(entry, 'found metadata entry');

    // synthesize first so "prepare" is called
    const template = SynthUtils.toCloudFormation(stack);

    test.deepEqual(stack.node.resolve(entry!.data), {
      path: filePath,
      packaging: 'file',
      id: 'MyAsset',
      s3BucketParameter: 'MyAssetS3Bucket68C9B344',
      s3KeyParameter: 'MyAssetS3VersionKey68E1A45D',
    });

    // verify that now the template contains parameters for this asset
    test.equal(template.Parameters.MyAssetS3Bucket68C9B344.Type, 'String');
    test.equal(template.Parameters.MyAssetS3VersionKey68E1A45D.Type, 'String');

    test.done();
  },

  '"readers" or "grantRead" can be used to grant read permissions on the asset to a principal'(test: Test) {
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'MyUser');
    const group = new iam.Group(stack, 'MyGroup');

    const asset = new ZipDirectoryAsset(stack, 'MyAsset', {
      path: path.join(__dirname, 'sample-asset-directory'),
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
      path: path.join(__dirname, 'sample-asset-directory', 'sample-asset-file.txt')
    });

    const zipDirectoryAsset = new ZipDirectoryAsset(stack, 'ZipDirectoryAsset', {
      path: path.join(__dirname, 'sample-asset-directory')
    });

    const zipFileAsset = new FileAsset(stack, 'ZipFileAsset', {
      path: path.join(__dirname, 'sample-asset-directory', 'sample-zip-asset.zip')
    });

    const jarFileAsset = new FileAsset(stack, 'JarFileAsset', {
      path: path.join(__dirname, 'sample-asset-directory', 'sample-jar-asset.jar')
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

    const location = path.join(__dirname, 'sample-asset-directory');
    const resource = new cdk.CfnResource(stack, 'MyResource', { type: 'My::Resource::Type' });
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

    const resource = new cdk.CfnResource(stack, 'MyResource', { type: 'My::Resource::Type' });
    const asset = new ZipDirectoryAsset(stack, 'MyAsset', { path: SAMPLE_ASSET_DIR });

    // WHEN
    asset.addResourceMetadata(resource, 'PropName');

    // THEN
    expect(stack).notTo(haveResource('My::Resource::Type', {
      Metadata: {
        "aws:asset:path": SAMPLE_ASSET_DIR,
        "aws:asset:property": "PropName"
      }
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'staging': {

    'copy file assets under .assets/fingerprint.ext'(test: Test) {
      const tempdir = fs.mkdtempSync(os.tmpdir());
      process.chdir(tempdir); // change current directory to somewhere in /tmp

      // GIVEN
      const app = new App({
        context: { [cxapi.ASSET_STAGING_DIR_CONTEXT]: '.assets' }
      });
      const stack = new Stack(app, 'stack');

      // WHEN
      new FileAsset(stack, 'ZipFile', {
        path: path.join(SAMPLE_ASSET_DIR, 'sample-zip-asset.zip')
      });

      new FileAsset(stack, 'TextFile', {
        path: path.join(SAMPLE_ASSET_DIR, 'sample-asset-file.txt')
      });

      // THEN
      app.run();
      test.ok(fs.existsSync(path.join(tempdir, '.assets')));
      test.ok(fs.existsSync(path.join(tempdir, '.assets', 'fdb4701ff6c99e676018ee2c24a3119b.zip')));
      fs.readdirSync(path.join(tempdir, '.assets'));
      test.done();
    },

    'copy directory under .assets/fingerprint/**'(test: Test) {
      const tempdir = fs.mkdtempSync(os.tmpdir());
      process.chdir(tempdir); // change current directory to somewhere in /tmp

      // GIVEN
      const app = new App({
        context: { [cxapi.ASSET_STAGING_DIR_CONTEXT]: '.assets' }
      });
      const stack = new Stack(app, 'stack');

      // WHEN
      new ZipDirectoryAsset(stack, 'ZipDirectory', {
        path: SAMPLE_ASSET_DIR
      });

      // THEN
      app.run();
      test.ok(fs.existsSync(path.join(tempdir, '.assets')));
      test.ok(fs.existsSync(path.join(tempdir, '.assets', 'b550524e103eb4cf257c594fba5b9fe8', 'sample-asset-file.txt')));
      test.ok(fs.existsSync(path.join(tempdir, '.assets', 'b550524e103eb4cf257c594fba5b9fe8', 'sample-jar-asset.jar')));
      fs.readdirSync(path.join(tempdir, '.assets'));
      test.done();
    },

    'staging path is relative if the dir is below the working directory'(test: Test) {
      // GIVEN
      const tempdir = fs.mkdtempSync(os.tmpdir());
      process.chdir(tempdir); // change current directory to somewhere in /tmp

      const staging = '.my-awesome-staging-directory';
      const app = new App({
        context: {
          [cxapi.ASSET_STAGING_DIR_CONTEXT]: staging,
          [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: 'true',
        }
      });

      const stack = new Stack(app, 'stack');

      const resource = new cdk.CfnResource(stack, 'MyResource', { type: 'My::Resource::Type' });
      const asset = new ZipDirectoryAsset(stack, 'MyAsset', { path: SAMPLE_ASSET_DIR });

      // WHEN
      asset.addResourceMetadata(resource, 'PropName');

      const session = app.run();
      const template = SynthUtils.templateForStackName(session, stack.name);

      test.deepEqual(template.Resources.MyResource.Metadata, {
        "aws:asset:path": `.my-awesome-staging-directory/b550524e103eb4cf257c594fba5b9fe8`,
        "aws:asset:property": "PropName"
      });
      test.done();
    },

    'if staging directory is absolute, asset path is absolute'(test: Test) {
      // GIVEN
      const staging = path.resolve(fs.mkdtempSync(os.tmpdir()));
      const app = new App({
        context: {
          [cxapi.ASSET_STAGING_DIR_CONTEXT]: staging,
          [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: 'true',
        }
      });

      const stack = new Stack(app, 'stack');

      const resource = new cdk.CfnResource(stack, 'MyResource', { type: 'My::Resource::Type' });
      const asset = new ZipDirectoryAsset(stack, 'MyAsset', { path: SAMPLE_ASSET_DIR });

      // WHEN
      asset.addResourceMetadata(resource, 'PropName');

      const session = app.run();
      const template = SynthUtils.templateForStackName(session, stack.name);

      test.deepEqual(template.Resources.MyResource.Metadata, {
        "aws:asset:path": `${staging}/b550524e103eb4cf257c594fba5b9fe8`,
        "aws:asset:property": "PropName"
      });
      test.done();
    },

    'cdk metadata points to staged asset'(test: Test) {
      // GIVEN
      const tempdir = fs.mkdtempSync(os.tmpdir());
      process.chdir(tempdir); // change current directory to somewhere in /tmp

      const staging = '.stageme';

      const app = new App({
        context: {
          [cxapi.ASSET_STAGING_DIR_CONTEXT]: staging,
        }
      });

      const stack = new Stack(app, 'stack');

      new ZipDirectoryAsset(stack, 'MyAsset', { path: SAMPLE_ASSET_DIR });

      // WHEN
      const session = app.run();
      const artifact = session.getArtifact(stack.name);

      const md = Object.values(artifact.metadata || {})[0][0].data;
      test.deepEqual(md.path, '.stageme/b550524e103eb4cf257c594fba5b9fe8');
      test.done();
    }

  }

};
