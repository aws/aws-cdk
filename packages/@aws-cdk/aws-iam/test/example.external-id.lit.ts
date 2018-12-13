import cdk = require('@aws-cdk/cdk');
import iam = require('../lib');

export class ExampleConstruct extends cdk.Construct {
  constructor(parent: cdk.Construct, id: string) {
    super(parent, id);

    /// !show
    const role = new iam.Role(this, 'MyRole', {
      assumedBy: new iam.AccountPrincipal('123456789012'),
      externalId: 'SUPPLY-ME',
    });
    /// !hide

    Array.isArray(role);
  }
}