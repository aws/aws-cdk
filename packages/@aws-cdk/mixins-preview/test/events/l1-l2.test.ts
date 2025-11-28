/* eslint-disable @cdklabs/no-throw-default-error */
import { App, Stack } from 'aws-cdk-lib';
import { CfnRule, Rule } from 'aws-cdk-lib/aws-events';
import type { EventPattern } from 'aws-cdk-lib/aws-events';
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

  test('can override bucket in the detail', () => {
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
      bucket: { name: ['anotherBucketName'] },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['Object Created'],
        'source': ['aws.s3'],
        'detail': {
          bucket: { name: ['anotherBucketName'] },
        },
      },
    });
  });

  test('should always have a bucketRef when no props is passed', () => {
    // GIVEN
    const bucketEvents = BucketEvents.fromBucket(new class extends Construct {
      public readonly bucketRef = {
        bucketArn: 'arn',
        bucketName: 'the-bucket',
      };
      public readonly env = { account: '11111111111', region: 'us-east-1' };
    }(stack, 'Bucket'));

    // WHEN
    newRule(stack, bucketEvents.objectCreatedPattern());

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['Object Created'],
        'source': ['aws.s3'],
        'detail': {
          bucket: { name: ['the-bucket'] },
        },
      },
    });
  });

  test('should always have a bucketRef when empty props is passed', () => {
    // GIVEN
    const bucketEvents = BucketEvents.fromBucket(new class extends Construct {
      public readonly bucketRef = {
        bucketArn: 'arn',
        bucketName: 'the-bucket',
      };
      public readonly env = { account: '11111111111', region: 'us-east-1' };
    }(stack, 'Bucket'));

    // WHEN
    newRule(stack, bucketEvents.objectCreatedPattern({}));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['Object Created'],
        'source': ['aws.s3'],
        'detail': {
          bucket: { name: ['the-bucket'] },
        },
      },
    });
  });

  test('should always have a bucketRef when empty props is passed', () => {
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
      eventMetadata: {
        region: ['my-region'],
      },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['Object Created'],
        'source': ['aws.s3'],
        'detail': {
          bucket: { name: ['the-bucket'] },
        },
        'region': ['my-region'],
      },
    });
  });
});

test('creates multiple rules for different event types', () => {
  const app = new App();
  const stack = new Stack(app);
  // GIVEN
  const bucketEvents = BucketEvents.fromBucket(new class extends Construct {
    public readonly bucketRef = {
      bucketArn: 'arn',
      bucketName: 'the-bucket',
    };
    public readonly env = { account: '11111111111', region: 'us-east-1' };
  }(stack, 'Bucket'));

  // WHEN
  new Rule(stack, 'CreatedRule', {
    eventPattern: bucketEvents.objectCreatedPattern(),
  });
  new Rule(stack, 'DeletedRule', {
    eventPattern: bucketEvents.objectDeletedPattern(),
  });

  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 2);
});
