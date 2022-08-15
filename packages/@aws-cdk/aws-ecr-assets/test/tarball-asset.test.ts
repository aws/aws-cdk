import * as fs from 'fs';
import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import { testFutureBehavior } from '@aws-cdk/cdk-build-tools/lib/feature-flag';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { App, Stack, DefaultStackSynthesizer } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { TarballImageAsset } from '../lib';

/* eslint-disable quote-props */

const flags = { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: true };

describe('image asset', () => {
  testFutureBehavior('test instantiating Asset Image', flags, App, (app) => {
    // GIVEN
    const stack = new Stack(app);
    const asset = new TarballImageAsset(stack, 'Image', {
      tarballFile: __dirname + '/demo-tarball/empty.tar',
    });

    // WHEN
    const asm = app.synth();

    // THEN
    const manifestArtifact = getAssetManifest(asm);
    const manifest = readAssetManifest(manifestArtifact);

    expect(Object.keys(manifest.files ?? {}).length).toBe(1);
    expect(Object.keys(manifest.dockerImages ?? {}).length).toBe(1);

    expect(manifest.dockerImages?.[asset.assetHash]?.destinations?.['current_account-current_region']).toStrictEqual(
      {
        assumeRoleArn: 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-image-publishing-role-${AWS::AccountId}-${AWS::Region}',
        imageTag: asset.assetHash,
        repositoryName: 'cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}',
      },
    );

    expect(manifest.dockerImages?.[asset.assetHash]?.source).toStrictEqual(
      {
        executable: [
          'sh',
          '-c',
          `docker load -i asset.${asset.assetHash}.tar | sed "s/Loaded image: //g"`,
        ],
      },
    );

    // AssetStaging in TarballImageAsset uses `this` as scope'
    expect(asset.node.tryFindChild('Staging')).toBeDefined();
  });

  testFutureBehavior('asset.repository.grantPull can be used to grant a principal permissions to use the image', flags, App, (app) => {
    // GIVEN
    const stack = new Stack(app);
    const user = new iam.User(stack, 'MyUser');
    const asset = new TarballImageAsset(stack, 'Image', {
      tarballFile: 'test/demo-tarball/empty.tar',
    });

    // WHEN
    asset.repository.grantPull(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        'Statement': [
          {
            'Action': [
              'ecr:BatchCheckLayerAvailability',
              'ecr:GetDownloadUrlForLayer',
              'ecr:BatchGetImage',
            ],
            'Effect': 'Allow',
            'Resource': {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    'Ref': 'AWS::Partition',
                  },
                  ':ecr:',
                  {
                    'Ref': 'AWS::Region',
                  },
                  ':',
                  {
                    'Ref': 'AWS::AccountId',
                  },
                  ':repository/',
                  {
                    'Fn::Sub': 'cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}',
                  },
                ],
              ],
            },
          },
          {
            'Action': 'ecr:GetAuthorizationToken',
            'Effect': 'Allow',
            'Resource': '*',
          },
        ],
        'Version': '2012-10-17',
      },
      'PolicyName': 'MyUserDefaultPolicy7B897426',
      'Users': [
        {
          'Ref': 'MyUserDC45028B',
        },
      ],
    });
  });

  testFutureBehavior('docker directory is staged if asset staging is enabled', flags, App, (app) => {
    const stack = new Stack(app);
    const image = new TarballImageAsset(stack, 'MyAsset', {
      tarballFile: 'test/demo-tarball/empty.tar',
    });

    const session = app.synth();

    expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}.tar`))).toBe(true);
  });

  test('fails if the file does not exist', () => {
    const stack = new Stack();
    // THEN
    expect(() => {
      new TarballImageAsset(stack, 'MyAsset', {
        tarballFile: `/does/not/exist/${Math.floor(Math.random() * 9999)}`,
      });
    }).toThrow(/Cannot find file at/);

  });

  describe('synthesizedTag is correct for different stack synthesizers', () => {
    const stack1 = new Stack();
    const stack2 = new Stack(undefined, undefined, {
      synthesizer: new DefaultStackSynthesizer({
        dockerTagPrefix: 'banana',
      }),
    });
    const asset1 = new TarballImageAsset(stack1, 'MyAsset', {
      tarballFile: 'test/demo-tarball/empty.tar',
    });
    const asset2 = new TarballImageAsset(stack2, 'MyAsset', {
      tarballFile: 'test/demo-tarball/empty.tar',
    });

    test('stack with default synthesizer', () => {
      expect(asset1.assetHash).toEqual('95c924c84f5d023be4edee540cb2cb401a49f115d01ed403b288f6cb412771df');
      expect(asset1.synthesizedTag).toEqual('95c924c84f5d023be4edee540cb2cb401a49f115d01ed403b288f6cb412771df');
    });

    test('stack with overwritten synthesizer', () => {
      expect(asset2.assetHash).toEqual('95c924c84f5d023be4edee540cb2cb401a49f115d01ed403b288f6cb412771df');
      expect(asset2.synthesizedTag).toEqual('banana95c924c84f5d023be4edee540cb2cb401a49f115d01ed403b288f6cb412771df');
    });
  });

});

function isAssetManifest(x: cxapi.CloudArtifact): x is cxapi.AssetManifestArtifact {
  return x instanceof cxapi.AssetManifestArtifact;
}

function getAssetManifest(asm: cxapi.CloudAssembly): cxapi.AssetManifestArtifact {
  const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
  if (!manifestArtifact) { throw new Error('no asset manifest in assembly'); }
  return manifestArtifact;
}

function readAssetManifest(manifestArtifact: cxapi.AssetManifestArtifact): cxschema.AssetManifest {
  return JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
}
