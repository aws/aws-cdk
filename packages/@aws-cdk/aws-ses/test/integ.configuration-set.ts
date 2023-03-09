import { App, Stack, StackProps } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ses from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new ses.ConfigurationSet(this, 'ConfigurationSet');
  }
}

const app = new App();

new integ.IntegTest(app, 'ConfigurationSetInteg', {
  testCases: [new TestStack(app, 'cdk-ses-configuration-set-integ')],
});

app.synth();
