import cdk = require('@aws-cdk/cdk');
import { Group } from '../lib';

export class ExampleConstruct extends cdk.Construct {
  constructor(parent: cdk.Construct, id: string) {
    super(parent, id);

    /// !show
    const group = new Group(this, 'MyGroup');
    group.attachManagedPolicy('arn:aws:iam::aws:policy/AdministratorAccess');
    /// !hide
  }
}
