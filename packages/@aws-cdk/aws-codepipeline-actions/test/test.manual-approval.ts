import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as sns from '@aws-cdk/aws-sns';
import { SecretValue, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as cpactions from '../lib';

/* eslint-disable quote-props */

export = {
  'manual approval Action': {
    'allows passing an SNS Topic when constructing it'(test: Test) {
      const stack = new Stack();
      const topic = new sns.Topic(stack, 'Topic');
      const manualApprovalAction = new cpactions.ManualApprovalAction({
        actionName: 'Approve',
        notificationTopic: topic,
      });
      const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
      const stage = pipeline.addStage({ stageName: 'stage' });
      stage.addAction(manualApprovalAction);

      test.equal(manualApprovalAction.notificationTopic, topic);

      test.done();
    },

    'renders CustomData and ExternalEntityLink even if notificationTopic was not passed'(test: Test) {
      const stack = new Stack();
      new codepipeline.Pipeline(stack, 'pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [new cpactions.GitHubSourceAction({
              actionName: 'Source',
              output: new codepipeline.Artifact(),
              oauthToken: SecretValue.plainText('secret'),
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

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
      }));

      test.done();
    },
  },
};
