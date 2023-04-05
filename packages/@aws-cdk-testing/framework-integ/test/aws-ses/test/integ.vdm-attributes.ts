import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { VdmAttributes } from 'aws-cdk-lib/aws-ses';

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
