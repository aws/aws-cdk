import { App, Stack } from '@aws-cdk/core';
import { Policy, PolicyStatement } from '../lib';
import { User } from '../lib/user';

const app = new App();

const stack = new Stack(app, 'aws-cdk-iam-policy');

const user = new User(stack, 'MyUser');

const policy = new Policy(stack, 'HelloPolicy', { policyName: 'Default' });
policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
policy.attachToUser(user);

const policy2 = new Policy(stack, 'GoodbyePolicy');
policy2.addStatements(new PolicyStatement({ resources: ['*'], actions: ['lambda:InvokeFunction'] }));
policy2.attachToUser(user);

app.synth();
