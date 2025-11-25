/* eslint-disable @cdklabs/no-throw-default-error */
import { Stack } from 'aws-cdk-lib';
import { CfnRule, Rule, type EventPattern } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { BucketEvents } from '../../lib/services/aws-s3/events';
import { Template } from 'aws-cdk-lib/assertions';
import { AutoScalingGroupEvents } from '../../lib/services/aws-autoscaling/events.generated';
import type { AutoScalingGroupReference } from 'aws-cdk-lib/aws-autoscaling';

describe.each([
  ['CfnRule', (scope: Construct, eventPattern: EventPattern) => {
    new CfnRule(scope, 'MyRule', { eventPattern, state: 'ENABLED' });
  }],
  ['Rule', (scope: Construct, eventPattern: EventPattern) => {
    new Rule(scope, 'MyRule', { eventPattern });
  }],
] satisfies Array<[string, (scope: Construct, pattern: EventPattern) => void]>)('for %p', (_, newRule) => {
  let stack: Stack;
  beforeEach(() => {
    stack = new Stack();
  });

  test('can render event with lowercase props', () => {
    // GIVEN
    const bucketEvents = BucketEvents.fromBucket(new class extends Construct {
      public readonly bucketRef = {
        bucketArn: 'arn',
        bucketName: 'the-bucket',
      };
      public readonly env = { account: '11111111111', region: 'us-east-1' };
    }(stack, 'Bucket'));

    // WHEN
    newRule(stack, bucketEvents.objectCreatedPattern({
      object: {
        key: ['file.zip'],
      },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['Object Created'],
        'source': ['aws.s3'],
        'detail': {
          object: { key: ['file.zip'] },
          bucket: { name: ['the-bucket'] }, // <-- from the bucket
        },
      },
    });
  });

  test('can render event with uppercase props', () => {
    // GIVEN
    const asgEvents = AutoScalingGroupEvents.fromAutoScalingGroup(new class extends Construct {
      public readonly autoScalingGroupRef: AutoScalingGroupReference = {
        autoScalingGroupName: 'asdf',
      };
      public readonly env = { account: '11111111111', region: 'us-east-1' };
    }(stack, 'Group'));

    // WHEN
    newRule(stack, asgEvents.eC2InstanceLaunchUnsuccessfulPattern({
      cause: ['explosion'],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['EC2 Instance Launch Unsuccessful'],
        'source': ['aws.autoscaling'],
        'detail': {
          Cause: ['explosion'],
        },
      },
    });
  });
});
