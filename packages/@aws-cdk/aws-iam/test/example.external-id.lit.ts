import cdk = require('@aws-cdk/core');
import iam = require('../lib');

export class ExampleConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    /// !show
    const role = new iam.Role(this, 'MyRole', {
      assumedBy: new iam.AccountPrincipal('123456789012'),
      externalIds: ['SUPPLY-ME'],
    });
    /// !hide

    Array.isArray(role);
  }
}