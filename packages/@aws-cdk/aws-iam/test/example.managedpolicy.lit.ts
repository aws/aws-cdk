import * as cdk from '@aws-cdk/core';
import { Group, ManagedPolicy } from '../lib';

export class ExampleConstruct extends cdk.Construct {
  public constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    /// !show
    const group = new Group(this, 'MyGroup');
    group.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('policy/AdministratorAccess'));
    /// !hide
  }
}
