import type { Construct } from 'constructs';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { Stream } from '../../aws-kinesis';
import { DeliveryStream, S3Bucket } from '../../aws-kinesisfirehose';
import { Function, Code, Runtime } from '../../aws-lambda';
import { FirehoseDestination, KinesisDestination, LambdaDestination } from '../../aws-logs-destinations';
import { Bucket } from '../../aws-s3';
import { ArnFormat, Stack } from '../../core';
import type { ILogGroup, ILogSubscriptionDestination } from '../lib';
import { AccountPolicy, AccountPolicyDocument, Distribution, FilterPattern } from '../lib';

describe('account policy', () => {
  test('trivial instantiation of a subscription filter policy', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.subscriptionFilter({
        destination: new FakeDestination(),
        filterPattern: FilterPattern.literal('some pattern'),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      PolicyName: 'MyAccountPolicy',
      PolicyType: 'SUBSCRIPTION_FILTER_POLICY',
      PolicyDocument: JSON.stringify({
        DestinationArn: 'arn:bogus',
        FilterPattern: 'some pattern',
      }),
    });
  });

  test('excludeLogGroups is rendered as a NOT IN selectionCriteria expression', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.subscriptionFilter({
        destination: new FakeDestination(),
        filterPattern: FilterPattern.allEvents(),
        excludeLogGroups: ['/aws/lambda/excluded-one', '/aws/lambda/excluded-two'],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      SelectionCriteria: 'LogGroupName NOT IN ["/aws/lambda/excluded-one","/aws/lambda/excluded-two"]',
    });
  });

  test('excludeLogGroups and selectionCriteria cannot both be specified', () => {
    // GIVEN
    const stack = new Stack();

    // THEN
    expect(() => {
      new AccountPolicy(stack, 'AccountPolicy', {
        policyName: 'MyAccountPolicy',
        policy: AccountPolicyDocument.subscriptionFilter({
          destination: new FakeDestination(),
          filterPattern: FilterPattern.allEvents(),
          excludeLogGroups: ['/aws/lambda/excluded'],
          selectionCriteria: 'LogGroupNamePrefix = "/aws/lambda/"',
        }),
      });
    }).toThrow('excludeLogGroups and selectionCriteria cannot both be specified');
  });

  test('selectionCriteria escape hatch is passed through as-is', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.subscriptionFilter({
        destination: new FakeDestination(),
        filterPattern: FilterPattern.allEvents(),
        selectionCriteria: 'LogGroupNamePrefix = "/aws/lambda/"',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      SelectionCriteria: 'LogGroupNamePrefix = "/aws/lambda/"',
    });
  });

  test('subscription filter policy with KinesisDestination can have distribution set', () => {
    // GIVEN: an imported stream and role (both literal ARNs, no unresolved tokens) keep the
    // resulting PolicyDocument a plain, fully-deterministic JSON string.
    const stack = new Stack();
    const stream = Stream.fromStreamArn(stack, 'Stream', 'arn:aws:kinesis:us-east-1:123456789012:stream/MyStream');
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/MyRole');

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.subscriptionFilter({
        destination: new KinesisDestination(stream, { role }),
        filterPattern: FilterPattern.allEvents(),
        distribution: Distribution.RANDOM,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      PolicyDocument: JSON.stringify({
        DestinationArn: 'arn:aws:kinesis:us-east-1:123456789012:stream/MyStream',
        RoleArn: 'arn:aws:iam::123456789012:role/MyRole',
        FilterPattern: '',
        Distribution: 'Random',
      }),
    });
  });

  test('subscription filter policy with non-KinesisDestination cannot have distribution set', () => {
    // GIVEN
    const stack = new Stack();

    // THEN
    expect(() => {
      new AccountPolicy(stack, 'AccountPolicy', {
        policyName: 'MyAccountPolicy',
        policy: AccountPolicyDocument.subscriptionFilter({
          destination: new FakeDestination(),
          filterPattern: FilterPattern.allEvents(),
          distribution: Distribution.RANDOM,
        }),
      });
    }).toThrow('distribution property can only be used with KinesisDestination.');
  });

  test('LambdaDestination is scoped to a wildcard log group ARN covering the whole account', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new Function(stack, 'Function', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: Code.fromInline('exports.handler = async () => {};'),
    });

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.subscriptionFilter({
        destination: new LambdaDestination(fn),
        filterPattern: FilterPattern.allEvents(),
      }),
    });

    // THEN: hasResourceProperties compares against the already-resolved template, so the
    // expected ARN must be resolved too — otherwise it stays an unresolved token string and
    // never matches the synthesized Fn::Join.
    const wildcardLogGroupArn = stack.resolve(stack.formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: '*',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    }));
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'logs.amazonaws.com',
      SourceArn: wildcardLogGroupArn,
    });
  });

  test('FirehoseDestination can be used as a subscription filter policy destination', () => {
    // GIVEN
    const stack = new Stack();
    const bucket = new Bucket(stack, 'Bucket');
    const deliveryStream = new DeliveryStream(stack, 'DeliveryStream', {
      destination: new S3Bucket(bucket),
    });

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.subscriptionFilter({
        destination: new FirehoseDestination(deliveryStream),
        filterPattern: FilterPattern.allEvents(),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      PolicyType: 'SUBSCRIPTION_FILTER_POLICY',
    });
  });
});

class FakeDestination implements ILogSubscriptionDestination {
  public bind(_scope: Construct, _sourceLogGroup: ILogGroup) {
    return {
      arn: 'arn:bogus',
    };
  }
}
