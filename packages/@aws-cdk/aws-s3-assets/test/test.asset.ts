import { expect, haveResource, ResourcePart, SynthUtils } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import { Test } from 'nodeunit';
import * as os from 'os';
import * as path from 'path';
import { Asset } from '../lib/asset';

// tslint:disable:max-line-length

const SAMPLE_ASSET_DIR = path.join(__dirname, 'sample-asset-directory');

export = {
  'simple use case'(test: Test)  {
    const app = new cdk.App({
      context: {
        [cxapi.DISABLE_ASSET_STAGING_CONTEXT]: 'true'
      }
    });
    const stack = new cdk.Stack(app, 'MyStack');
    new Asset(stack, 'MyAsset', {
      path: SAMPLE_ASSET_DIR
    });

    // verify that metadata contains an "aws:cdk:asset" entry with
    // the correct information
    const entry = stack.node.metadata.find(m => m.type === 'aws:cdk:asset');
    test.ok(entry, 'found metadata entry');

    // verify that now the template contains parameters for this asset
    const session = app.synth();

    test.deepEqual(stack.resolve(entry!.data), {
      path: SAMPLE_ASSET_DIR,
      id: '6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2',
      packaging: 'zip',
      sourceHash: '6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2',
      s3BucketParameter: 'AssetParameters6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2S3Bucket50B5A10B',
      s3KeyParameter: 'AssetParameters6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2S3VersionKey1F7D75F9',
      artifactHashParameter: 'AssetParameters6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2ArtifactHash220DE9BD',
    });

    const template = JSON.parse(fs.readFileSync(path.join(session.directory, 'MyStack.template.json'), 'utf-8'));

    test.equal(template.Parameters.AssetParameters6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2S3Bucket50B5A10B.Type, 'String');
    test.equal(template.Parameters.AssetParameters6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2S3VersionKey1F7D75F9.Type, 'String');

    test.done();
  },

  'verify that the app resolves tokens in metadata'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');
    const dirPath = path.resolve(__dirname, 'sample-asset-directory');

    new Asset(stack, 'MyAsset', {
      path: dirPath
    });

    const synth = app.synth().getStackByName(stack.stackName);
    const meta = synth.manifest.metadata || {};
    test.ok(meta['/my-stack']);
    test.ok(meta['/my-stack'][0]);
    test.deepEqual(meta['/my-stack'][0].data, {
      path: 'asset.6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2',
      id: '6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2',
      packaging: 'zip',
      sourceHash: '6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2',
      s3BucketParameter: 'AssetParameters6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2S3Bucket50B5A10B',
      s3KeyParameter: 'AssetParameters6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2S3VersionKey1F7D75F9',
      artifactHashParameter: 'AssetParameters6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2ArtifactHash220DE9BD',
    });

    test.done();
  },

  '"file" assets'(test: Test) {
    const stack = new cdk.Stack();
    const filePath = path.join(__dirname, 'file-asset.txt');
    new Asset(stack, 'MyAsset', { path: filePath });
    const entry = stack.node.metadata.find(m => m.type === 'aws:cdk:asset');
    test.ok(entry, 'found metadata entry');

    // synthesize first so "prepare" is called
    const template = SynthUtils.synthesize(stack).template;

    test.deepEqual(stack.resolve(entry!.data), {
      path: 'asset.78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197.txt',
      packaging: 'file',
      id: '78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197',
      sourceHash: '78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197',
      s3BucketParameter: 'AssetParameters78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197S3Bucket2C60F94A',
      s3KeyParameter: 'AssetParameters78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197S3VersionKey9482DC35',
      artifactHashParameter: 'AssetParameters78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197ArtifactHash22BFFA67',
    });

    // verify that now the template contains parameters for this asset
    test.equal(template.Parameters.AssetParameters78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197S3Bucket2C60F94A.Type, 'String');
    test.equal(template.Parameters.AssetParameters78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197S3VersionKey9482DC35.Type, 'String');

    test.done();
  },

  '"readers" or "grantRead" can be used to grant read permissions on the asset to a principal'(test: Test) {
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'MyUser');
    const group = new iam.Group(stack, 'MyGroup');

    const asset = new Asset(stack, 'MyAsset', {
      path: path.join(__dirname, 'sample-asset-directory'),
      readers: [ user ]
    });

    asset.grantRead(group);

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
            Effect: 'Allow',
            Resource: [
              { 'Fn::Join': ['', ['arn:', {Ref: 'AWS::Partition'}, ':s3:::', {Ref: 'AssetParameters6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2S3Bucket50B5A10B'} ] ] },
              { 'Fn::Join': ['', [ 'arn:', {Ref: 'AWS::Partition'}, ':s3:::', {Ref: 'AssetParameters6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2S3Bucket50B5A10B'}, '/*' ] ] }
            ]
          }
        ]
      }
    }));

    test.done();
  },
  'fails if directory not found'(test: Test) {
    const stack = new cdk.Stack();
    test.throws(() => new Asset(stack, 'MyDirectory', {
      path: '/path/not/found/' + Math.random() * 999999
    }));
    test.done();
  },

  'multiple assets under the same parent'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new Asset(stack, 'MyDirectory1', { path: path.join(__dirname, 'sample-asset-directory') });
    new Asset(stack, 'MyDirectory2', { path: path.join(__dirname, 'sample-asset-directory') });

    // THEN: no error

    test.done();
  },

  'isZipArchive indicates if the asset represents a .zip file (either explicitly or via ZipDirectory packaging)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const nonZipAsset = new Asset(stack, 'NonZipAsset', {
      path: path.join(__dirname, 'sample-asset-directory', 'sample-asset-file.txt')
    });

    const zipDirectoryAsset = new Asset(stack, 'ZipDirectoryAsset', {
      path: path.join(__dirname, 'sample-asset-directory')
    });

    const zipFileAsset = new Asset(stack, 'ZipFileAsset', {
      path: path.join(__dirname, 'sample-asset-directory', 'sample-zip-asset.zip')
    });

    const jarFileAsset = new Asset(stack, 'JarFileAsset', {
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
    const asset = new Asset(stack, 'MyAsset', { path: location });

    // WHEN
    asset.addResourceMetadata(resource, 'PropName');

    // THEN
    expect(stack).to(haveResource('My::Resource::Type', {
      Metadata: {
        'aws:asset:path': 'asset.6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2',
        'aws:asset:property': 'PropName'
      }
    }, ResourcePart.CompleteDefinition));
    test.done();
  },

  'asset metadata is only emitted if ASSET_RESOURCE_METADATA_ENABLED_CONTEXT is defined'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const resource = new cdk.CfnResource(stack, 'MyResource', { type: 'My::Resource::Type' });
    const asset = new Asset(stack, 'MyAsset', { path: SAMPLE_ASSET_DIR });

    // WHEN
    asset.addResourceMetadata(resource, 'PropName');

    // THEN
    expect(stack).notTo(haveResource('My::Resource::Type', {
      Metadata: {
        'aws:asset:path': SAMPLE_ASSET_DIR,
        'aws:asset:property': 'PropName'
      }
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'staging': {

    'copy file assets under <outdir>/${fingerprint}.ext'(test: Test) {
      const tempdir = mkdtempSync();
      process.chdir(tempdir); // change current directory to somewhere in /tmp

      // GIVEN
      const app = new cdk.App({ outdir: tempdir });
      const stack = new cdk.Stack(app, 'stack');

      // WHEN
      new Asset(stack, 'ZipFile', {
        path: path.join(SAMPLE_ASSET_DIR, 'sample-zip-asset.zip')
      });

      new Asset(stack, 'TextFile', {
        path: path.join(SAMPLE_ASSET_DIR, 'sample-asset-file.txt')
      });

      // THEN
      app.synth();
      test.ok(fs.existsSync(tempdir));
      test.ok(fs.existsSync(path.join(tempdir, 'asset.a7a79cdf84b802ea8b198059ff899cffc095a1b9606e919f98e05bf80779756b.zip')));
      test.done();
    },

    'copy directory under .assets/fingerprint/**'(test: Test) {
      const tempdir = mkdtempSync();
      process.chdir(tempdir); // change current directory to somewhere in /tmp

      // GIVEN
      const app = new cdk.App({ outdir: tempdir });
      const stack = new cdk.Stack(app, 'stack');

      // WHEN
      new Asset(stack, 'ZipDirectory', {
        path: SAMPLE_ASSET_DIR
      });

      // THEN
      app.synth();
      test.ok(fs.existsSync(tempdir));
      const hash = 'asset.6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2';
      test.ok(fs.existsSync(path.join(tempdir, hash, 'sample-asset-file.txt')));
      test.ok(fs.existsSync(path.join(tempdir, hash, 'sample-jar-asset.jar')));
      fs.readdirSync(tempdir);
      test.done();
    },

    'staging path is relative if the dir is below the working directory'(test: Test) {
      // GIVEN
      const tempdir = mkdtempSync();
      process.chdir(tempdir); // change current directory to somewhere in /tmp

      const staging = '.my-awesome-staging-directory';
      const app = new cdk.App({
        outdir: staging,
        context: {
          [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: 'true',
        }
      });

      const stack = new cdk.Stack(app, 'stack');

      const resource = new cdk.CfnResource(stack, 'MyResource', { type: 'My::Resource::Type' });
      const asset = new Asset(stack, 'MyAsset', { path: SAMPLE_ASSET_DIR });

      // WHEN
      asset.addResourceMetadata(resource, 'PropName');

      const template = SynthUtils.synthesize(stack).template;
      test.deepEqual(template.Resources.MyResource.Metadata, {
        'aws:asset:path': 'asset.6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2',
        'aws:asset:property': 'PropName'
      });
      test.done();
    },

    'if staging is disabled, asset path is absolute'(test: Test) {
      // GIVEN
      const staging = path.resolve(mkdtempSync());
      const app = new cdk.App({
        outdir: staging,
        context: {
          [cxapi.DISABLE_ASSET_STAGING_CONTEXT]: 'true',
          [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: 'true',
        }
      });

      const stack = new cdk.Stack(app, 'stack');

      const resource = new cdk.CfnResource(stack, 'MyResource', { type: 'My::Resource::Type' });
      const asset = new Asset(stack, 'MyAsset', { path: SAMPLE_ASSET_DIR });

      // WHEN
      asset.addResourceMetadata(resource, 'PropName');

      const template = SynthUtils.synthesize(stack).template;
      test.deepEqual(template.Resources.MyResource.Metadata, {
        'aws:asset:path': SAMPLE_ASSET_DIR,
        'aws:asset:property': 'PropName'
      });
      test.done();
    },

    'cdk metadata points to staged asset'(test: Test) {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');
      new Asset(stack, 'MyAsset', { path: SAMPLE_ASSET_DIR });

      // WHEN
      const session = app.synth();
      const artifact = session.getStackByName(stack.stackName);
      const metadata = artifact.manifest.metadata || {};
      const md = Object.values(metadata)[0]![0]!.data;
      test.deepEqual(md.path, 'asset.6b84b87243a4a01c592d78e1fd3855c4bfef39328cd0a450cc97e81717fea2a2');
      test.done();
    }

  }
};

function mkdtempSync() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'test.assets'));
}
