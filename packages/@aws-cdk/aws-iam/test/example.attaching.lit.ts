import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import { Group, Policy, User } from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

export class ExampleConstruct extends Construct {
  constructor(scope: constructs.Construct, id: string) {
    super(scope, id);

    /// !show
    const user = new User(this, 'MyUser', { password: cdk.SecretValue.plainText('1234') });
    const group = new Group(this, 'MyGroup');

    const policy = new Policy(this, 'MyPolicy');
    policy.attachToUser(user);
    group.attachInlinePolicy(policy);
    /// !hide
  }
}
