import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { RouteCalculator } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new RouteCalculator(this, 'RouteCalculator');
  }
}

const app = new App();

new integ.IntegTest(app, 'RouteCalculatorTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-route-calculator')],
});
