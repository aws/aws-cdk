import * as core from 'aws-cdk-lib';
import { LatticeTestStack } from '../test/latticetests/latticetest';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new core.App();
const stack = new LatticeTestStack(app, 'ServiceNetwork', {});

new integ.IntegTest(app, 'vpcLatticeTestStackInteg', {
  testCases: [stack],
});

app.synth();