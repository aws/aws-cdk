import { expect, haveResource } from '@aws-cdk/assert';
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import sources = require('../lib');
import { TestFunction } from './test-function';

/* eslint-disable quote-props */

export = {
  'sufficiently complex example'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const topic = new sns.Topic(stack, 'T');

    // WHEN
    fn.addEventSource(new sources.SnsEventSource(topic));

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      "Action": "lambda:InvokeFunction",
      "FunctionName": {
        "Fn::GetAtt": [
          "Fn9270CBC0",
          "Arn"
        ]
      },
      "Principal": "sns.amazonaws.com",
      "SourceArn": {
        "Ref": "TD925BC7E"
      }
    }));

    expect(stack).to(haveResource('AWS::SNS::Subscription', {
      "Endpoint": {
        "Fn::GetAtt": [
          "Fn9270CBC0",
          "Arn"
        ]
      },
      "Protocol": "lambda",
      "TopicArn": {
        "Ref": "TD925BC7E"
      }
    }));

    test.done();
  }
};
