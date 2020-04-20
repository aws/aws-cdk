import { expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { CrossAccountDestination } from '../lib';

export = {
  'simple destination'(test: Test) {
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
    expect(stack).to(haveResource('AWS::Logs::Destination', {
      DestinationName: 'MyDestination',
      RoleArn: { 'Fn::GetAtt': [ 'Role1ABCC5F0', 'Arn' ] },
      TargetArn: 'arn:bogus',
    }));

    test.done();
  },

  'add policy to destination'(test: Test) {
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
    expect(stack).to(haveResource('AWS::Logs::Destination', (props: any) => {
      const pol = JSON.parse(props.DestinationPolicy);

      return pol.Statement[0].Action === 'logs:TalkToMe';
    }));

    test.done();
  },
};
