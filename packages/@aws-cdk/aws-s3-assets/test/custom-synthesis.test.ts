/**
 * This file asserts that it is possible to write a custom stacksynthesizer that will synthesize
 * ONE thing to the asset manifest, while returning another thing (including tokens) to the
 * CloudFormation template -- without reaching into the library internals
 */

import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import { StackSynthesizer, FileAssetSource, FileAssetLocation, DockerImageAssetSource, DockerImageAssetLocation, ISynthesisSession, App, Stack, AssetManifestBuilder, CfnParameter, CfnResource } from '@aws-cdk/core';
import { AssetManifestArtifact } from '@aws-cdk/cx-api';
import { Asset } from '../lib';

test('use custom synthesizer', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    synthesizer: new CustomSynthesizer(),
  });

  // WHEN
  const asset = new Asset(stack, 'MyAsset', {
    path: path.join(__dirname, 'file-asset.txt'),
  });
  new CfnResource(stack, 'TestResource', {
    type: 'CDK::TestResource',
    properties: {
      Bucket: asset.s3BucketName,
      ObjectKey: asset.s3ObjectKey,
      S3Url: asset.s3ObjectUrl,
      HttpUrl: asset.httpUrl,
    },
  });

  // THEN
  const assembly = app.synth();
  const stackArtifact = assembly.getStackArtifact(stack.artifactId);
  const assetArtifact = stackArtifact.dependencies[0] as AssetManifestArtifact;

  const stackTemplate = Template.fromJSON(stackArtifact.template);
  stackTemplate.hasResourceProperties('CDK::TestResource', {
    Bucket: { 'Fn::Sub': '${BucketName}' },
    ObjectKey: '78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197.txt',
    S3Url: { 'Fn::Sub': 's3://${BucketName}/78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197.txt' },
    HttpUrl: { 'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/${BucketName}/78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197.txt' },
  });

  expect(assetArtifact.contents).toEqual(expect.objectContaining({
    files: expect.objectContaining({
      '78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197': {
        destinations: {
          'current_account-current_region': {
            bucketName: 'write-bucket',
            objectKey: '78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197.txt',
          },
        },
        source: {
          packaging: 'file',
          path: 'asset.78add9eaf468dfa2191da44a7da92a21baba4c686cf6053d772556768ef21197.txt',
        },
      },
    }),
  }));
});

class CustomSynthesizer extends StackSynthesizer {
  private readonly manifest = new AssetManifestBuilder();
  private parameter?: CfnParameter;

  override bind(stack: Stack) {
    super.bind(stack);

    this.parameter = new CfnParameter(stack, 'BucketName');
  }

  addFileAsset(asset: FileAssetSource): FileAssetLocation {
    const dest = this.manifest.defaultAddFileAsset(this.boundStack, asset, {
      bucketName: 'write-bucket',
    });
    return this.cloudFormationLocationFromFileAsset({
      ...dest,
      bucketName: ['${', this.parameter!.logicalId, '}'].join(''),
    });
  }

  addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    void(asset);
    throw new Error('Docker images are not supported here');
  }

  synthesize(session: ISynthesisSession): void {
    const templateAsset = this.addFileAsset(this.synthesizeTemplate(session));
    const assetManifestId = this.manifest.emitManifest(this.boundStack, session);

    this.emitArtifact(session, {
      stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
      additionalDependencies: [assetManifestId],
    });
  }
}
