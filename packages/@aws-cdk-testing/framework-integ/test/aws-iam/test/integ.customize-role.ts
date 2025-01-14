import { App, Fn, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Group, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

const app = new App();

const stack = new Stack(app, 'integ-customize-role');

Role.customizeRoles(stack, {
  usePrecreatedRoles: {
    'integ-customize-role/TestRole': 'my-precreated-role',
  },
});

const group = new Group(stack, 'MyGroup');

const role = new Role(stack, 'TestRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

role.addToPolicy(new PolicyStatement({
  resources: [
    'arn:aws:s3:::abc/xyz/123.txt',
    Fn.ref('AWS::NoValue'),
    `arn:${Fn.ref('AWS::Partition')}:iam:${Fn.ref('AWS::Region')}:${Fn.ref('AWS::AccountId')}/role/FakeRole'`,
    `${group.groupArn}/*`,
    group.groupArn,
  ],
  actions: ['sqs:SendMessage'],
}));

new IntegTest(app, 'integ-iam-customize-role', {
  testCases: [stack],
});

app.synth();
