import { SecretValue } from '../../core';
import { Construct } from 'constructs';
import { Group, Policy, User } from '../lib';

export class ExampleConstruct extends Construct {
  constructor(scope: Construct, id: string) {
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
