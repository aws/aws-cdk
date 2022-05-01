import { Template } from '@aws-cdk/assertions';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { Duration, SecretValue, Stack } from '@aws-cdk/core';
import * as targets from '../../lib';


describe('with basic auth connection', () => {
  let stack: Stack;
  let connection: events.Connection;
  let destination: events.ApiDestination;
  let rule: events.Rule;

  beforeEach(() => {
    stack = new Stack();
    connection = new events.Connection(stack, 'Connection', {
      authorization: events.Authorization.basic('username', SecretValue.unsafePlainText('password')),
      description: 'ConnectionDescription',
      connectionName: 'testConnection',
    });

    destination = new events.ApiDestination(stack, 'Destination', {
      connection,
      endpoint: 'https://endpoint.com',
    });

    rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.rate(Duration.minutes(1)),
    });
  });

  test('use api destination as an eventrule target', () => {
    // WHEN
    rule.addTarget(new targets.ApiDestination(destination));

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::Rule', {
      ScheduleExpression: 'rate(1 minute)',
      State: 'ENABLED',
      Targets: [
        {
          Arn: { 'Fn::GetAtt': ['DestinationApiDestinationA879FAE5', 'Arn'] },
          Id: 'Target0',
          RoleArn: { 'Fn::GetAtt': ['DestinationEventsRole7DA63556', 'Arn'] },
        },
      ],
    });
  });

  test('with an explicit event role', () => {
    // WHEN
    const eventRole = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
    });
    rule.addTarget(new targets.ApiDestination(destination, { eventRole }));

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::Rule', {
      Targets: [
        {
          RoleArn: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
          Id: 'Target0',
        },
      ],
    });
  });
});
