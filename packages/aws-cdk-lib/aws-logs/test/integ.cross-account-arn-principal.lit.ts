import type { StackProps } from '../../core';
import { App, RemovalPolicy, Stack } from '../../core';
import { ArnPrincipal, PolicyStatement } from '../../aws-iam';
import { LogGroup } from '../lib';

class CrossAccountArnPrincipalIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    /// !show
    logGroup.addToResourcePolicy(new PolicyStatement({
      actions: ['logs:PutLogEvents'],
      resources: ['*'],
      principals: [new ArnPrincipal('arn:aws:iam::211125612616:role/Reader')],
    }));
    /// !hide
  }
}

const app = new App();
new CrossAccountArnPrincipalIntegStack(app, 'aws-cdk-cross-account-arn-principal-integ');
app.synth();
