import * as cdk from '@aws-cdk/core';
import * as iam from '../lib';

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
