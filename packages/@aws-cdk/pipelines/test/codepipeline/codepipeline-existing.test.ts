import * as codePipeline from '@aws-cdk/aws-codepipeline';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as cdkp from '../../lib';

describeDeprecated('codepipeline existing', () => {

  test('Does not allow setting a pipelineName if an existing CodePipeline is given', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'PipelineStack');
    const existingCodePipeline = new codePipeline.Pipeline(stack, 'CustomCodePipeline');

    expect(() => {
      new cdkp.CdkPipeline(stack, 'CDKPipeline', {
        pipelineName: 'CustomPipelineName',
        codePipeline: existingCodePipeline,
        cloudAssemblyArtifact: new codePipeline.Artifact(),
      });
    }).toThrow("Cannot set 'pipelineName' if an existing CodePipeline is given using 'codePipeline'");
  });

  test('Does not allow enabling crossAccountKeys if an existing CodePipeline is given', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'PipelineStack');
    const existingCodePipeline = new codePipeline.Pipeline(stack, 'CustomCodePipeline');

    expect(() => {
      new cdkp.CdkPipeline(stack, 'CDKPipeline', {
        crossAccountKeys: true,
        codePipeline: existingCodePipeline,
        cloudAssemblyArtifact: new codePipeline.Artifact(),
      });
    }).toThrow("Cannot set 'crossAccountKeys' if an existing CodePipeline is given using 'codePipeline'");
  });

  test('Does not allow enabling key rotation if an existing CodePipeline is given', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'PipelineStack');
    const existingCodePipeline = new codePipeline.Pipeline(stack, 'CustomCodePipeline');

    expect(() => {
      new cdkp.CdkPipeline(stack, 'CDKPipeline', {
        enableKeyRotation: true,
        codePipeline: existingCodePipeline,
        cloudAssemblyArtifact: new codePipeline.Artifact(),
      });
    }).toThrow("Cannot set 'enableKeyRotation' if an existing CodePipeline is given using 'codePipeline'");
  });
});