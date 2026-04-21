import { Stack } from 'aws-cdk-lib';
import { CfnRule, Rule } from 'aws-cdk-lib/aws-events';
import { Template } from 'aws-cdk-lib/assertions';
import { AWSAPICallViaCloudTrail, ObjectCreated, ObjectDeleted } from '../../../lib/services/aws-s3/events.generated';

describe('with L2 Rule', () => {
  let stack: Stack;
  beforeEach(() => {
    stack = new Stack();
  });

  test('awsAPICallViaCloudTrailPattern with tlsDetails and eventMetadata', () => {
    new Rule(stack, 'Rule', {
      eventPattern: AWSAPICallViaCloudTrail.eventPattern({
        tlsDetails: { tlsVersion: ['TLSv1.3'] },
        eventMetadata: { region: ['us-east-1'] },
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['AWS API Call via CloudTrail'],
        'source': ['aws.s3'],
        'detail': {
          tlsDetails: { tlsVersion: ['TLSv1.3'] },
        },
        'region': ['us-east-1'],
      },
    });
  });

  test('awsAPICallViaCloudTrailPattern bare call', () => {
    new Rule(stack, 'Rule', {
      eventPattern: AWSAPICallViaCloudTrail.eventPattern(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['AWS API Call via CloudTrail'],
        'source': ['aws.s3'],
      },
    });
  });

  test('objectCreatedPattern with reason filter', () => {
    new Rule(stack, 'Rule', {
      eventPattern: ObjectCreated.eventPattern({ reason: ['PutObject'] }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['Object Created'],
        'source': ['aws.s3'],
        'detail': { reason: ['PutObject'] },
      },
    });
  });

  test('objectDeletedPattern with reason filter', () => {
    new Rule(stack, 'Rule', {
      eventPattern: ObjectDeleted.eventPattern({ reason: ['DeleteObject'] }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['Object Deleted'],
        'source': ['aws.s3'],
        'detail': { reason: ['DeleteObject'] },
      },
    });
  });
});

describe('with L1 CfnRule', () => {
  let stack: Stack;
  beforeEach(() => {
    stack = new Stack();
  });

  test('awsAPICallViaCloudTrailPattern with tlsDetails and eventMetadata', () => {
    new CfnRule(stack, 'Rule', {
      state: 'ENABLED',
      eventPattern: AWSAPICallViaCloudTrail.eventPattern({
        tlsDetails: { tlsVersion: ['TLSv1.3'] },
        eventMetadata: { region: ['us-east-1'] },
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['AWS API Call via CloudTrail'],
        'source': ['aws.s3'],
        'detail': {
          tlsDetails: { tlsVersion: ['TLSv1.3'] },
        },
        'region': ['us-east-1'],
      },
    });
  });

  test('awsAPICallViaCloudTrailPattern bare call', () => {
    new CfnRule(stack, 'Rule', {
      state: 'ENABLED',
      eventPattern: AWSAPICallViaCloudTrail.eventPattern(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['AWS API Call via CloudTrail'],
        'source': ['aws.s3'],
      },
    });
  });

  test('objectCreatedPattern with reason filter', () => {
    new CfnRule(stack, 'Rule', {
      state: 'ENABLED',
      eventPattern: ObjectCreated.eventPattern({ reason: ['PutObject'] }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['Object Created'],
        'source': ['aws.s3'],
        'detail': { reason: ['PutObject'] },
      },
    });
  });

  test('objectDeletedPattern with reason filter', () => {
    new CfnRule(stack, 'Rule', {
      state: 'ENABLED',
      eventPattern: ObjectDeleted.eventPattern({ reason: ['DeleteObject'] }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['Object Deleted'],
        'source': ['aws.s3'],
        'detail': { reason: ['DeleteObject'] },
      },
    });
  });
});
