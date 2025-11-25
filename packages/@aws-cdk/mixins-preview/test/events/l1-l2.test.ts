/* eslint-disable @cdklabs/no-throw-default-error */
import { Stack } from 'aws-cdk-lib';
import { CfnRule, Rule, type EventPattern } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { BucketEvents } from '../../lib/services/aws-s3/events';
import { Template } from 'aws-cdk-lib/assertions';
import { GroupEvents } from '../../lib/services/aws-xray/events';

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
        key: 'file.zip', // FIXME: Should be ['file.zip']
      },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['Object Created'],
        'source': ['aws.s3'],
        'detail': {
          object: { key: 'file.zip' },
          bucket: { name: 'the-bucket' }, // <-- from the bucket
        },
      },
    });
  });

  test('can render event with uppercase props', () => {
    // GIVEN
    const xrayEvents = GroupEvents.fromGroup(new class extends Construct {
      public readonly groupRef = {
        groupArn: 'arn',
      };
      public readonly env = { account: '11111111111', region: 'us-east-1' };
    }(stack, 'Group'));

    // WHEN
    newRule(stack, xrayEvents.aWSXRayInsightUpdatePattern({
      summary: 'asdf',
    } as any)); // Cast away requiredness of this field

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        'detail-type': ['AWS X-Ray Insight Update'],
        'source': ['aws.xray'],
        'detail': {
          Summary: 'asdf',
        },
      },
    });
  });
});
