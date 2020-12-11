import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import { Group, ManagedPolicy } from '../lib';

export class ExampleConstruct extends cdk.Construct {
  constructor(scope: constructs.Construct, id: string) {
    super(scope, id);

    /// !show
    const group = new Group(this, 'MyGroup');
    group.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
    /// !hide
  }
}
