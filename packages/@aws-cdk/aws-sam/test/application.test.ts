import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import { CfnApplication } from '../lib';

test('construct an AWS::Serverless::Application', () => {
  const stack = new cdk.Stack();

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

  expect(stack).toMatchTemplate({
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
