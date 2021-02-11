import { Construct } from 'constructs';
import { Group, ManagedPolicy } from '../lib';

export class ExampleConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    /// !show
    const group = new Group(this, 'MyGroup');
    group.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
    /// !hide
  }
}
