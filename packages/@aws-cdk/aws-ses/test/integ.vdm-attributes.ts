import { App, Stack, StackProps } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import { VdmAttributes } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new VdmAttributes(this, 'Vdm');
  }
}

const app = new App();

new integ.IntegTest(app, 'VdmAttribtuesInteg', {
  testCases: [new TestStack(app, 'cdk-integ-ses-vdm-attributes')],
});

app.synth();
