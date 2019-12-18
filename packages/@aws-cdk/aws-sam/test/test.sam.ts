import {expect} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { CfnApplication } from '../lib';

export = {
  'construct an AWS::Serverless::Application'(test: Test) {
    const stack = new cdk.Stack();

    new CfnApplication(stack, 'App', {
      location: {
        applicationId: 'arn:aws:serverlessrepo:us-east-1:077246666028:applications/aws-serverless-twitter-event-source',
        semanticVersion: '2.0.0'
      },
      parameters: {
        SearchText: '#serverless -filter:nativeretweets',
        TweetProcessorFunctionName: 'test'
      }
    });

    expect(stack).toMatch({
      Transform: 'AWS::Serverless-2016-10-31',
      Resources: {
        App: {
          Type: 'AWS::Serverless::Application',
          Properties: {
            Location: {
              ApplicationId: 'arn:aws:serverlessrepo:us-east-1:077246666028:applications/aws-serverless-twitter-event-source',
              SemanticVersion: '2.0.0'
            },
            Parameters: {
              SearchText: '#serverless -filter:nativeretweets',
              TweetProcessorFunctionName: 'test'
            }
          }
        }
      }
    });

    test.done();
  }
};
