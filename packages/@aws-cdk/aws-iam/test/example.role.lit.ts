import cdk = require('@aws-cdk/cdk');
import { PolicyStatement, Role, ServicePrincipal } from '../lib';

export class ExampleConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    /// !show
    const role = new Role(this, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com')
    });

    role.addToPolicy(new PolicyStatement()
        .addAllResources()
        .addAction('lambda:InvokeFunction'));
    /// !hide
  }
}
