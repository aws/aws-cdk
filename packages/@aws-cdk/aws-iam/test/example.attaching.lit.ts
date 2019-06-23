import cdk = require('@aws-cdk/core');
import { SecretValue } from '@aws-cdk/core';
import { Group, Policy, User } from '../lib';

export class ExampleConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    /// !show
    const user = new User(this, 'MyUser', { password: SecretValue.plainText('1234') });
    const group = new Group(this, 'MyGroup');

    const policy = new Policy(this, 'MyPolicy');
    policy.attachToUser(user);
    group.attachInlinePolicy(policy);
    /// !hide
  }
}