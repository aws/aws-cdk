import { Template, Match } from '../../../assertions';
import * as codecommit from '../../../aws-codecommit';
import * as codepipeline from '../../../aws-codepipeline';
import { Stack } from '../../../core';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

describe('ServiceCatalog Deploy Action', () => {
  test('addAction succesfully leads to creation of codepipeline service catalog action with properly formatted TemplateFilePath', () => {
    // GIVEN
    const stack = new TestFixture();
    // WHEN
    stack.deployStage.addAction(new cpactions.ServiceCatalogDeployActionBeta1({
      actionName: 'ServiceCatalogTest',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      productVersionDescription: 'This is a description of the version.',
      productVersionName: 'VersionName',
      productId: 'prod-xxxxxxxxx',
    }));
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': Match.arrayWith([
        Match.objectLike({ 'Name': 'Source' /* don't care about the rest */ }),
        Match.objectLike({
          'Name': 'Deploy',
          'Actions': Match.arrayWith([
            Match.objectLike({
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
            }),
          ]),
        }),
      ]),
    });

  });
  test('deployment without a description works successfully', () => {
    // GIVEN
    const stack = new TestFixture();
    // WHEN
    stack.deployStage.addAction(new cpactions.ServiceCatalogDeployActionBeta1({
      actionName: 'ServiceCatalogTest',
      templatePath: stack.sourceOutput.atPath('template.yaml'),
      productVersionName: 'VersionName',
      productId: 'prod-xxxxxxxxx',
    }));
    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': Match.arrayWith([
        Match.objectLike({ 'Name': 'Source' /* don't care about the rest */ }),
        Match.objectLike({
          'Name': 'Deploy',
          'Actions': Match.arrayWith([
            Match.objectLike({
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
            }),
          ]),
        }),
      ]),
    });

  });
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
