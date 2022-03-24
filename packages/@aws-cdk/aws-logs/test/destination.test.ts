import { Template, Match } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { CrossAccountDestination } from '../lib';

describe('destination', () => {
  test('simple destination', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('logs.us-east-2.amazonaws.com'),
    });

    // WHEN
    new CrossAccountDestination(stack, 'Dest', {
      destinationName: 'MyDestination',
      role,
      targetArn: 'arn:bogus',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Destination', {
      DestinationName: 'MyDestination',
      RoleArn: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
      TargetArn: 'arn:bogus',
    });
  });

  test('add policy to destination', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('logs.us-east-2.amazonaws.com'),
    });

    const dest = new CrossAccountDestination(stack, 'Dest', {
      destinationName: 'MyDestination',
      role,
      targetArn: 'arn:bogus',
    });

    // WHEN
    dest.addToPolicy(new iam.PolicyStatement({
      actions: ['logs:TalkToMe'],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Destination', {
      DestinationName: 'MyDestination',
      DestinationPolicy: Match.serializedJson({
        Statement: [
          {
            Action: 'logs:TalkToMe',
            Effect: 'Allow',
          },
        ],
        Version: '2012-10-17',
      }),
      RoleArn: {
        'Fn::GetAtt': [
          'Role1ABCC5F0',
          'Arn',
        ],
      },
      TargetArn: 'arn:bogus',
    });
  });
});
