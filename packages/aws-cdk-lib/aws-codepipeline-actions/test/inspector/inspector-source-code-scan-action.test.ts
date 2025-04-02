import { Match, Template } from '../../../assertions';
import * as codepipeline from '../../../aws-codepipeline';
import * as ecr from '../../../aws-ecr';
import { Bucket } from '../../../aws-s3';
import { Stack } from '../../../core';
import * as cpactions from '../../lib';

describe('InspectorSourceCodeScanAction', () => {
  let stack: Stack;
  let sourceOutput: codepipeline.Artifact;
  let scanOutput: codepipeline.Artifact;
  let pipeline: codepipeline.Pipeline;

  beforeEach(() => {
    // GIVEN
    stack = new Stack();
    sourceOutput = new codepipeline.Artifact('SourceArtifact');
    scanOutput = new codepipeline.Artifact('ScanArtifact');
    pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'Source',
          bucket: new Bucket(stack, 'SourceBucket'),
          bucketKey: 'sample.zip',
          output: sourceOutput,
        }),
      ],
    });
  });

  test('pipeline with InspectorSourceCodeScanAction', () => {
    // WHEN
    const inspectorSourceCodeScanAction = new cpactions.InspectorSourceCodeScanAction({
      actionName: 'InspectorScan',
      output: scanOutput,
      input: sourceOutput,
      criticalThreshold: 1,
      highThreshold: 1,
      mediumThreshold: 1,
      lowThreshold: 1,
    });

    pipeline.addStage({
      stageName: 'InspectorScan',
      actions: [inspectorSourceCodeScanAction],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([
        {
          Name: 'InspectorScan',
          Actions: [
            {
              ActionTypeId: {
                Category: 'Invoke',
                Owner: 'AWS',
                Provider: 'InspectorScan',
                Version: '1',
              },
              Configuration: {
                InspectorRunMode: 'SourceCodeScan',
                CriticalThreshold: 1,
                HighThreshold: 1,
                MediumThreshold: 1,
                LowThreshold: 1,
              },
              InputArtifacts: [
                {
                  Name: 'SourceArtifact',
                },
              ],
              OutputArtifacts: [
                {
                  Name: 'ScanArtifact',
                },
              ],
              Name: 'InspectorScan',
              RoleArn: {
                'Fn::GetAtt': [
                  'PipelineInspectorScanCodePipelineActionRole0903FD68',
                  'Arn',
                ],
              },
              RunOrder: 1,
            },
          ],
        },
      ]),
    });
  });

  test('can get variables', () => {
    // WHEN
    const inspectorSourceCodeScanAction = new cpactions.InspectorSourceCodeScanAction({
      actionName: 'InspectorScan',
      output: scanOutput,
      input: sourceOutput,
    });

    // THEN
    expect(inspectorSourceCodeScanAction.variables.highestScannedSeverity).toMatch(/^#{\${Token\[TOKEN\.[0-9]*\]}.HighestScannedSeverity}$/);
  });

  describe('grant policy', () => {
    test('grant policy for inspector', () => {
      // WHEN
      const inspectorSourceCodeScanAction = new cpactions.InspectorSourceCodeScanAction({
        actionName: 'InspectorScan',
        output: scanOutput,
        input: sourceOutput,
      });

      pipeline.addStage({
        stageName: 'InspectorScan',
        actions: [inspectorSourceCodeScanAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineInspectorScanCodePipelineActionRoleDefaultPolicy0D7A49CF',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: 'inspector-scan:ScanSbom',
              Effect: 'Allow',
              Resource: '*',
            },
          ]),
        },
      });
    });

    test('grant policy for logs', () => {
      // WHEN
      const inspectorSourceCodeScanAction = new cpactions.InspectorSourceCodeScanAction({
        actionName: 'InspectorScan',
        output: scanOutput,
        input: sourceOutput,
      });

      pipeline.addStage({
        stageName: 'InspectorScan',
        actions: [inspectorSourceCodeScanAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineInspectorScanCodePipelineActionRoleDefaultPolicy0D7A49CF',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':log-group:/aws/codepipeline/',
                      {
                        Ref: 'PipelineC660917D',
                      },
                    ],
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':log-group:/aws/codepipeline/',
                      {
                        Ref: 'PipelineC660917D',
                      },
                      ':*',
                    ],
                  ],
                },
              ],
            },
          ]),
        },
      });
    });

    test('grant write policy for buckets', () => {
      // WHEN
      const inspectorSourceCodeScanAction = new cpactions.InspectorSourceCodeScanAction({
        actionName: 'InspectorScan',
        output: scanOutput,
        input: sourceOutput,
      });

      pipeline.addStage({
        stageName: 'InspectorScan',
        actions: [inspectorSourceCodeScanAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineRoleDefaultPolicyC7A05455',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': [
                    'PipelineArtifactsBucket22248F97',
                    'Arn',
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      {
                        'Fn::GetAtt': [
                          'PipelineArtifactsBucket22248F97',
                          'Arn',
                        ],
                      },
                      '/*',
                    ],
                  ],
                },
              ],
            },
          ]),
        },
      });
    });

    test('grant read policy for buckets', () => {
      // WHEN
      const inspectorSourceCodeScanAction = new cpactions.InspectorSourceCodeScanAction({
        actionName: 'InspectorScan',
        output: scanOutput,
        input: sourceOutput,
      });

      pipeline.addStage({
        stageName: 'InspectorScan',
        actions: [inspectorSourceCodeScanAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineInspectorScanCodePipelineActionRoleDefaultPolicy0D7A49CF',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': [
                    'PipelineArtifactsBucket22248F97',
                    'Arn',
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      {
                        'Fn::GetAtt': [
                          'PipelineArtifactsBucket22248F97',
                          'Arn',
                        ],
                      },
                      '/*',
                    ],
                  ],
                },
              ],
            },
          ]),
        },
      });
    });
  });
});
