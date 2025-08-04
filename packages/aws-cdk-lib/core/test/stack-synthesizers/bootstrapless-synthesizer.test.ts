import { FileAssetPackaging } from '@aws-cdk/cloud-assembly-schema';
import { App } from '../../lib/app';
import { Stack } from '../../lib/stack';
import { BootstraplessSynthesizer } from '../../lib/stack-synthesizers/bootstrapless-synthesizer';

describe('BootstraplessSynthesizer', () => {
  test('differs from DefaultStackSynthesizer in bootstrap requirements', () => {
    // GIVEN
    const app = new App();
    new Stack(app, 'BootstraplessStack', {
      synthesizer: new BootstraplessSynthesizer(),
      env: {
        account: '111111111111',
        region: 'us-east-1',
      },
    });

    const assembly = app.synth();

    // THEN - bootstrapless stack has no bootstrap requirements
    const bootstraplessArtifact = assembly.getStackArtifact('BootstraplessStack');
    expect(bootstraplessArtifact.requiresBootstrapStackVersion).toBeUndefined();
    expect(bootstraplessArtifact.template.Parameters?.BootstrapVersion).toBeUndefined();
    expect(bootstraplessArtifact.template.Parameters?.FileAssetsBucketName).toBeUndefined();
    expect(bootstraplessArtifact.template.Parameters?.ImageRepositoryName).toBeUndefined();
  });

  test('throws when attempting to add assets', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      synthesizer: new BootstraplessSynthesizer(),
      env: {
        account: '111111111111',
        region: 'us-east-1',
      },
    });

    // THEN
    expect(() => stack.synthesizer.addFileAsset({
      fileName: __filename,
      packaging: FileAssetPackaging.FILE,
      sourceHash: 'file-hash',
    })).toThrow('Cannot add assets to a Stack that uses the BootstraplessSynthesizer');

    expect(() => stack.synthesizer.addDockerImageAsset({
      directoryName: '.',
      sourceHash: 'docker-hash',
    })).toThrow('Cannot add assets to a Stack that uses the BootstraplessSynthesizer');
  });

  test('uses qualifier in deployment and execution roles', () => {
    // GIVEN
    const qualifier = 'custom-qualifier';
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      synthesizer: new BootstraplessSynthesizer({
        qualifier,
      }),
      env: {
        account: '111111111111',
        region: 'us-east-1',
      },
    });

    // WHEN
    const assembly = app.synth();
    const artifact = assembly.getStackArtifact('Stack');

    // THEN
    // The deployment role should contain the custom qualifier and use AWS::Partition placeholder
    expect(artifact.assumeRoleArn).toBe(`arn:\${AWS::Partition}:iam::111111111111:role/cdk-${qualifier}-deploy-role-111111111111-us-east-1`);

    // The CloudFormation execution role should contain the custom qualifier and use AWS::Partition placeholder
    expect(artifact.cloudFormationExecutionRoleArn).toBe(`arn:\${AWS::Partition}:iam::111111111111:role/cdk-${qualifier}-cfn-exec-role-111111111111-us-east-1`);
  });
});
