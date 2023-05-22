import * as core from 'aws-cdk-lib';
import { ServiceNetworkStack } from './servicenetwork/servicenetwork';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new core.App();
const stack = new ServiceNetworkStack(app, 'ServiceNetwork', {});

new integ.IntegTest(app, 'vpcLatticeTestStackInteg', {
  testCases: [stack],
});

app.synth();