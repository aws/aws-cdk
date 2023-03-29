/**
 * This file asserts that it is possible to write a custom stacksynthesizer that will synthesize
 * ONE thing to the asset manifest, while returning another thing (including tokens) to the
 * CloudFormation template -- without reaching into the library internals
 */

import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import { StackSynthesizer, FileAssetSource, FileAssetLocation, DockerImageAssetSource, DockerImageAssetLocation, ISynthesisSession, App, Stack, AssetManifestBuilder, CfnParameter, CfnResource } from '@aws-cdk/core';
import { AssetManifestArtifact } from '@aws-cdk/cx-api';
import { DockerImageAsset } from '../lib';

test('use custom synthesizer', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    synthesizer: new CustomSynthesizer(),
  });

  // WHEN
  const asset = new DockerImageAsset(stack, 'MyAsset', {
    directory: path.join(__dirname, 'demo-image'),
  });
  new CfnResource(stack, 'TestResource', {
    type: 'CDK::TestResource',
    properties: {
      ImageUri: asset.imageUri,
      ImageTag: asset.imageTag,
    },
  });

  // THEN
  const assembly = app.synth();
  const stackArtifact = assembly.getStackArtifact(stack.artifactId);
  const assetArtifact = stackArtifact.dependencies[0] as AssetManifestArtifact;

  const stackTemplate = Template.fromJSON(stackArtifact.template);
  stackTemplate.hasResourceProperties('CDK::TestResource', {
    ImageUri: { 'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/${RepositoryName}:0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14' },
    ImageTag: '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
  });

  expect(assetArtifact.contents).toEqual(expect.objectContaining({
    dockerImages: expect.objectContaining({
      '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14': {
        destinations: {
          'current_account-current_region': {
            repositoryName: 'write-repo',
            imageTag: '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
          },
        },
        source: {
          directory: 'asset.0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
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

    this.parameter = new CfnParameter(stack, 'RepositoryName');
  }

  addFileAsset(asset: FileAssetSource): FileAssetLocation {
    void(asset);
    throw new Error('file assets not supported here');
  }

  addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    const dest = this.manifest.defaultAddDockerImageAsset(this.boundStack, asset, {
      repositoryName: 'write-repo',
    });
    return this.cloudFormationLocationFromDockerImageAsset({
      ...dest,
      repositoryName: ['${', this.parameter!.logicalId, '}'].join(''),
    });
  }

  synthesize(session: ISynthesisSession): void {
    // NOTE: Explicitly not adding template to asset manifest
    this.synthesizeTemplate(session);
    const assetManifestId = this.manifest.emitManifest(this.boundStack, session);

    this.emitArtifact(session, {
      additionalDependencies: [assetManifestId],
    });
  }
}
