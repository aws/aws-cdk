import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

nodeunitShim({
  'addAction succesfully leads to creation of codepipeline service catalog action with properly formatted TemplateFilePath'(test: Test) {
    // GIVEN
    const stack = new TestFixture();
    // WHEN
    stack.deployStage.addAction(new cpactions.ServiceCatalogDeployAction({
      actionName: 'ServiceCatalogTest',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      productVersionDescription: 'This is a description of the version.',
      productVersionName: 'VersionName',
      productId: 'prod-xxxxxxxxx',
    }));
    // THEN
    expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
      'Stages': [
        { 'Name': 'Source' /* don't care about the rest */ },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'ActionTypeId': {
                'Category': 'Deploy',
                'Owner': 'AWS',
                'Provider': 'ServiceCatalog',
                'Version': '1',
              },
              'Configuration': {
                'TemplateFilePath': 'template.yaml',
                'ProductVersionDescription': 'This is a description of the version.',
                'ProductVersionName': 'VersionName',
                'ProductType': 'CLOUD_FORMATION_TEMPLATE',
                'ProductId': 'prod-xxxxxxxxx',
              },
              'InputArtifacts': [
                {
                  'Name': 'SourceArtifact',
                },
              ],
              'Name': 'ServiceCatalogTest',
            },
          ],
        },
      ],
    }));

    test.done();
  },
  'deployment without a description works successfully'(test: Test) {
    // GIVEN
    const stack = new TestFixture();
    // WHEN
    stack.deployStage.addAction(new cpactions.ServiceCatalogDeployAction({
      actionName: 'ServiceCatalogTest',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      productVersionName: 'VersionName',
      productId: 'prod-xxxxxxxxx',
    }));
    // THEN
    expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
      'Stages': [
        { 'Name': 'Source' /* don't care about the rest */ },
        {
          'Name': 'Deploy',
          'Actions': [
            {
              'ActionTypeId': {
                'Category': 'Deploy',
                'Owner': 'AWS',
                'Provider': 'ServiceCatalog',
                'Version': '1',
              },
              'Configuration': {
                'TemplateFilePath': 'template.yaml',
                'ProductVersionName': 'VersionName',
                'ProductType': 'CLOUD_FORMATION_TEMPLATE',
                'ProductId': 'prod-xxxxxxxxx',
              },
              'InputArtifacts': [
                {
                  'Name': 'SourceArtifact',
                },
              ],
              'Name': 'ServiceCatalogTest',
            },
          ],
        },
      ],
    }));

    test.done();
  },
});

/**
 * A test stack with a half-prepared pipeline ready to add CloudFormation actions to
 */
class TestFixture extends Stack {
  public readonly pipeline: codepipeline.Pipeline;
  public readonly sourceStage: codepipeline.IStage;
  public readonly deployStage: codepipeline.IStage;
  public readonly repo: codecommit.Repository;
  public readonly sourceOutput: codepipeline.Artifact;

  constructor() {
    super();

    this.pipeline = new codepipeline.Pipeline(this, 'Pipeline');
    this.sourceStage = this.pipeline.addStage({ stageName: 'Source' });
    this.deployStage = this.pipeline.addStage({ stageName: 'Deploy' });
    this.repo = new codecommit.Repository(this, 'MyVeryImportantRepo', {
      repositoryName: 'my-very-important-repo',
    });
    this.sourceOutput = new codepipeline.Artifact('SourceArtifact');
    const source = new cpactions.CodeCommitSourceAction({
      actionName: 'Source',
      output: this.sourceOutput,
      repository: this.repo,
    });
    this.sourceStage.addAction(source);
  }
}