import { Construct } from 'constructs';
import { PolicyStatement, Role, ServicePrincipal } from '../lib';

export class ExampleConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    /// !show
    const role = new Role(this, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com'),
    });

    role.addToPolicy(new PolicyStatement({
      resources: ['*'],
      actions: ['lambda:InvokeFunction'],
    }));
    /// !hide
  }
}
