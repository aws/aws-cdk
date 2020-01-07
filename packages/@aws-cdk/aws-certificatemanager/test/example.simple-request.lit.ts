import { App, CfnOutput, Construct, Stack } from '@aws-cdk/core';
import * as certmgr from '../lib';

class CertStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    /// !show
    const cert = new certmgr.Certificate(this, 'Certificate', {
      domainName: 'example.com',
    });
    /// !hide

    new CfnOutput(this, 'Output', {
      value: cert.certificateArn
    });
  }
}

const app = new App();
new CertStack(app, 'MyStack4');
app.synth();
