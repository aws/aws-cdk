import { Template } from '@aws-cdk/assertions';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { SecretValue, Stack } from '@aws-cdk/core';
import * as cpactions from '../lib';

/* eslint-disable quote-props */

describe('manual approval', () => {
  describe('manual approval Action', () => {
    test('allows passing an SNS Topic when constructing it', () => {
      const stack = new Stack();
      const topic = new sns.Topic(stack, 'Topic');
      const manualApprovalAction = new cpactions.ManualApprovalAction({
        actionName: 'Approve',
        notificationTopic: topic,
      });
      const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
      const stage = pipeline.addStage({ stageName: 'stage' });
      stage.addAction(manualApprovalAction);

      expect(manualApprovalAction.notificationTopic).toEqual(topic);


    });

    test('allows granting manual approval permissions to role', () => {
      const stack = new Stack();
      const role = new iam.Role(stack, 'Human', { assumedBy: new iam.AnyPrincipal() });
      const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
      pipeline.addStage({
        stageName: 'Source',
        actions: [new cpactions.GitHubSourceAction({
          actionName: 'Source',
          output: new codepipeline.Artifact(),
          oauthToken: SecretValue.unsafePlainText('secret'),
          owner: 'aws',
          repo: 'aws-cdk',
        })],
      });
      const stage = pipeline.addStage({ stageName: 'stage' });

      const manualApprovalAction = new cpactions.ManualApprovalAction({
        actionName: 'Approve',
      });
      stage.addAction(manualApprovalAction);

      manualApprovalAction.grantManualApproval(role);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': 'codepipeline:ListPipelines',
              'Effect': 'Allow',
              'Resource': '*',
            },
            {
              'Action': [
                'codepipeline:GetPipeline',
                'codepipeline:GetPipelineState',
                'codepipeline:GetPipelineExecution',
              ],
              'Effect': 'Allow',
              'Resource': {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { 'Ref': 'AWS::Partition' },
                    ':codepipeline:',
                    { 'Ref': 'AWS::Region' },
                    ':',
                    { 'Ref': 'AWS::AccountId' },
                    ':',
                    { 'Ref': 'pipelineDBECAE49' },
                  ],
                ],
              },
            },
            {
              'Action': 'codepipeline:PutApprovalResult',
              'Effect': 'Allow',
              'Resource': {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { 'Ref': 'AWS::Partition' },
                    ':codepipeline:',
                    { 'Ref': 'AWS::Region' },
                    ':',
                    { 'Ref': 'AWS::AccountId' },
                    ':',
                    { 'Ref': 'pipelineDBECAE49' },
                    '/stage/Approve',
                  ],
                ],
              },
            },
          ],
          'Version': '2012-10-17',
        },
        'PolicyName': 'HumanDefaultPolicy49346D53',
        'Roles': [
          {
            'Ref': 'HumanD337C84C',
          },
        ],
      });


    });

    test('rejects granting manual approval permissions before binding action to stage', () => {
      const stack = new Stack();
      const role = new iam.Role(stack, 'Human', { assumedBy: new iam.AnyPrincipal() });
      const manualApprovalAction = new cpactions.ManualApprovalAction({
        actionName: 'Approve',
      });

      expect(() => {
        manualApprovalAction.grantManualApproval(role);
      }).toThrow('Cannot grant permissions before binding action to a stage');


    });

    test('renders CustomData and ExternalEntityLink even if notificationTopic was not passed', () => {
      const stack = new Stack();
      new codepipeline.Pipeline(stack, 'pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.GitHubSourceAction({
              actionName: 'Source',
              output: new codepipeline.Artifact(),
              oauthToken: SecretValue.unsafePlainText('secret'),
              owner: 'aws',
              repo: 'aws-cdk',
            })],
          },
          {
            stageName: 'Approve',
            actions: [
              new cpactions.ManualApprovalAction({
                actionName: 'Approval',
                additionalInformation: 'extra info',
                externalEntityLink: 'external link',
              }),
            ],
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
          },
          {
            'Name': 'Approve',
            'Actions': [
              {
                'Name': 'Approval',
                'Configuration': {
                  'CustomData': 'extra info',
                  'ExternalEntityLink': 'external link',
                },
              },
            ],
          },
        ],
      });


    });
  });
});
