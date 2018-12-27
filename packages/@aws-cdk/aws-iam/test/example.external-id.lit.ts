import cdk = require('@aws-cdk/cdk');
import iam = require('../lib');

export class ExampleConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, scid: string) {
    super(scope, scid);

    /// !show
    const role = new iam.Role(this, 'MyRole', {
      assumedBy: new iam.AccountPrincipal('123456789012'),
      externalId: 'SUPPLY-ME',
    });
    /// !hide

    Array.isArray(role);
  }
}