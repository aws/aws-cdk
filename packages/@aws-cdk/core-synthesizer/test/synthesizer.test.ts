import * as fs from 'fs';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { App, Stack, CfnResource, FileAssetPackaging, Aws } from '@aws-cdk/core';
import { evaluateCFN } from '@aws-cdk/core/test/evaluate-cfn';
import * as cxapi from '@aws-cdk/cx-api';
import { AppScopedStagingSynthesizer } from '../lib';

const CFN_CONTEXT = {
  'AWS::Region': 'the_region',
  'AWS::AccountId': 'the_account',
  'AWS::URLSuffix': 'domain.aws',
};

describe(AppScopedStagingSynthesizer, () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App({
      defaultStackSynthesizer: new AppScopedStagingSynthesizer(),
    });
    stack = new Stack(app, 'Stack', {
      env: {
        account: '000000000000',
        region: 'us-east-1',
      },
    });
    // TODO: test with tokens
  });

  test('stack template is in asset manifest', () => {
    // GIVEN
    new CfnResource(stack, 'Resource', {
      type: 'Some::Resource',
    });

    // WHEN
    const asm = app.synth();

    // THEN -- the S3 url is advertised on the stack artifact
    const stackArtifact = asm.getStackArtifact('Stack');

    const templateObjectKey = last(stackArtifact.stackTemplateAssetObjectUrl?.split('/'));
    expect(stackArtifact.stackTemplateAssetObjectUrl).toEqual(`s3://cdk-000000000000-us-east-1-stagingstackc8adc83b19/${templateObjectKey}`);

    // THEN - the template is in the asset manifest
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    expect(manifestArtifact).toBeDefined();
    const manifest: cxschema.AssetManifest = JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));

    const firstFile = (manifest.files ? manifest.files[Object.keys(manifest.files)[0]] : undefined) ?? {};

    expect(firstFile).toEqual({
      source: { path: 'Stack.template.json', packaging: 'file' },
      destinations: {
        '000000000000-us-east-1': {
          bucketName: 'cdk-000000000000-us-east-1-stagingstackc8adc83b19',
          objectKey: templateObjectKey,
          region: 'us-east-1',
          assumeRoleArn: 'arn:' + Aws.PARTITION + ':iam:us-east-1:000000000000:role:cdk-file-publishing-role-000000000000-us-east-1-stagingstackc8a',
        },
      },
    });
  });

  test('stack depends on staging stack', () => {
    // WHEN
    stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'abcdef',
    });

    // THEN - we have a stack dependency on the staging stack
    expect(stack.dependencies.length).toEqual(1);
    const depStack = stack.dependencies[0];
    expect(depStack.stackName).toEqual('StagingStackc8adc83b19');
  });

  test('add file asset', () => {
    // WHEN
    const location = stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'abcdef',
    });

    // THEN - we have a fixed asset location
    expect(evalCFN(location.bucketName)).toEqual('cdk-000000000000-us-east-1-stagingstackc8adc83b19');
    expect(evalCFN(location.httpUrl)).toEqual('https://s3.us-east-1.domain.aws/cdk-000000000000-us-east-1-stagingstackc8adc83b19/abcdef.js');

    // THEN - object key contains source hash somewhere
    expect(location.objectKey.indexOf('abcdef')).toBeGreaterThan(-1);
  });

  test('add docker image asset', () => {
    // WHEN
    const location = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      uniqueId: 'abcdef',
    });

    // THEN - we have a fixed asset location
    const repo = 'abcdefrepo';
    expect(evalCFN(location.repositoryName)).toEqual(repo);
    expect(evalCFN(location.imageUri)).toEqual(`000000000000.dkr.ecr.us-east-1.domain.aws/${repo}:abcdef`);
  });

  test('throws with docker image asset without uniqueId', () => {
    expect(() => stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
    })).toThrowError('Assets synthesized with AppScopedStagingSynthesizer must include a \'uniqueId\' in the asset source definition.');
  });

  test('separate docker image assets have separate repos', () => {
    // WHEN
    const location1 = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      uniqueId: 'abcdef',
    });

    const location2 = stack.synthesizer.addDockerImageAsset({
      directoryName: './hello',
      sourceHash: 'abcdefg',
      uniqueId: 'abcdefg',
    });

    // THEN - images have different asset locations
    expect(evalCFN(location1.repositoryName)).not.toEqual(evalCFN(location2.repositoryName));
  });

  test('docker image assets with same unique id have same repos', () => {
    // WHEN
    const location1 = stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'abcdef',
      uniqueId: 'abcdef',
    });

    const location2 = stack.synthesizer.addDockerImageAsset({
      directoryName: './hello',
      sourceHash: 'abcdefg',
      uniqueId: 'abcdef',
    });

    // THEN - images share same ecr repo
    const repo = 'abcdefrepo';
    expect(evalCFN(location1.repositoryName)).toEqual(repo);
    expect(evalCFN(location1.repositoryName)).toEqual(evalCFN(location2.repositoryName));
  });

  test('file asset depends on staging stack', () => {
    // WHEN
    const location = stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'abcdef',
    });

    // THEN - we have a fixed asset location
    console.log(location.bucketName);
  });

  /**
  * Evaluate a possibly string-containing value the same way CFN would do
  *
  * (Be invariant to the specific Fn::Sub or Fn::Join we would output)
  */
  function evalCFN(value: any) {
    return evaluateCFN(stack.resolve(value), CFN_CONTEXT);
  }

});

function isAssetManifest(x: cxapi.CloudArtifact): x is cxapi.AssetManifestArtifact {
  return x instanceof cxapi.AssetManifestArtifact;
}

function last<A>(xs?: A[]): A | undefined {
  return xs ? xs[xs.length - 1] : undefined;
}
