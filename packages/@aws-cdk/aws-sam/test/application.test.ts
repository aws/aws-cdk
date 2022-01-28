import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { CfnApplication } from '../lib';

test('construct an AWS::Serverless::Application', () => {
  const app = new cdk.App({
    context: {
      '@aws-cdk/core:newStyleStackSynthesis': false,
    },
  });
  const stack = new cdk.Stack(app);

  new CfnApplication(stack, 'App', {
    location: {
      applicationId: 'arn:aws:serverlessrepo:us-east-1:077246666028:applications/aws-serverless-twitter-event-source',
      semanticVersion: '2.0.0',
    },
    parameters: {
      SearchText: '#serverless -filter:nativeretweets',
      TweetProcessorFunctionName: 'test',
    },
  });

  Template.fromStack(stack).templateMatches({
    Transform: 'AWS::Serverless-2016-10-31',
    Resources: {
      App: {
        Type: 'AWS::Serverless::Application',
        Properties: {
          Location: {
            ApplicationId: 'arn:aws:serverlessrepo:us-east-1:077246666028:applications/aws-serverless-twitter-event-source',
            SemanticVersion: '2.0.0',
          },
          Parameters: {
            SearchText: '#serverless -filter:nativeretweets',
            TweetProcessorFunctionName: 'test',
          },
        },
      },
    },
  });
});
