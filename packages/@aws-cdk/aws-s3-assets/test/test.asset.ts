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
      id: '29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52',
      packaging: 'zip',
      sourceHash: '29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52',
      s3BucketParameter: 'AssetParameters29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52S3BucketC972D718',
      s3KeyParameter: 'AssetParameters29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52S3VersionKeyCEE36F6D',
      artifactHashParameter: 'AssetParameters29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52ArtifactHash21E1D9D2',
    });

    const template = JSON.parse(fs.readFileSync(path.join(session.directory, 'MyStack.template.json'), 'utf-8'));

    test.equal(template.Parameters.AssetParameters29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52S3BucketC972D718.Type, 'String');
    test.equal(template.Parameters.AssetParameters29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52S3VersionKeyCEE36F6D.Type, 'String');

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
      path: 'asset.29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52',
      id: "29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52",
      packaging: "zip",
      sourceHash: '29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52',
      s3BucketParameter: "AssetParameters29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52S3BucketC972D718",
      s3KeyParameter: "AssetParameters29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52S3VersionKeyCEE36F6D",
      artifactHashParameter: 'AssetParameters29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52ArtifactHash21E1D9D2',
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
      path: 'asset.9a16305bcae498e96e650ce18b97bc8b84bd236fbb1bd95e0589ea386c12a187.txt',
      packaging: 'file',
      id: '9a16305bcae498e96e650ce18b97bc8b84bd236fbb1bd95e0589ea386c12a187',
      sourceHash: '9a16305bcae498e96e650ce18b97bc8b84bd236fbb1bd95e0589ea386c12a187',
      s3BucketParameter: 'AssetParameters9a16305bcae498e96e650ce18b97bc8b84bd236fbb1bd95e0589ea386c12a187S3Bucket571780D6',
      s3KeyParameter: 'AssetParameters9a16305bcae498e96e650ce18b97bc8b84bd236fbb1bd95e0589ea386c12a187S3VersionKey5BC8CFA3',
      artifactHashParameter: 'AssetParameters9a16305bcae498e96e650ce18b97bc8b84bd236fbb1bd95e0589ea386c12a187ArtifactHashAC78E97C',
    });

    // verify that now the template contains parameters for this asset
    test.equal(template.Parameters.AssetParameters9a16305bcae498e96e650ce18b97bc8b84bd236fbb1bd95e0589ea386c12a187S3Bucket571780D6.Type, 'String');
    test.equal(template.Parameters.AssetParameters9a16305bcae498e96e650ce18b97bc8b84bd236fbb1bd95e0589ea386c12a187S3VersionKey5BC8CFA3.Type, 'String');

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
            Action: ["s3:GetObject*", "s3:GetBucket*", "s3:List*"],
            Effect: 'Allow',
            Resource: [
              { "Fn::Join": ["", ["arn:", {Ref: "AWS::Partition"}, ":s3:::", {Ref: "AssetParameters29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52S3BucketC972D718"} ] ] },
              { "Fn::Join": ["", [ "arn:", {Ref: "AWS::Partition"}, ":s3:::", {Ref: "AssetParameters29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52S3BucketC972D718"}, "/*" ] ] }
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
        "aws:asset:path": 'asset.29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52',
        "aws:asset:property": "PropName"
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
        "aws:asset:path": SAMPLE_ASSET_DIR,
        "aws:asset:property": "PropName"
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
      test.ok(fs.existsSync(path.join(tempdir, 'asset.1a2c2e3c558cb7a64c1d0e24e31f718163b2dbc2825b0c8c3ea4361c1508c28a.zip')));
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
      const hash = 'asset.29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52';
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
        "aws:asset:path": `asset.29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52`,
        "aws:asset:property": "PropName"
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
        "aws:asset:path": SAMPLE_ASSET_DIR,
        "aws:asset:property": "PropName"
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
      test.deepEqual(md.path, 'asset.29b2a596a6e4efb88c13158906b9a44a8bced412dba7eadd4741e471cad01f52');
      test.done();
    }

  }
};

function mkdtempSync() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'test.assets'));
}
