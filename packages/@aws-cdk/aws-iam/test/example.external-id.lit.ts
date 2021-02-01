import * as constructs from 'constructs';
import * as iam from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

export class ExampleConstruct extends Construct {
  constructor(scope: constructs.Construct, id: string) {
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
