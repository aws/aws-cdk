import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { DataSource } from '../lib';
import { LOCATION_SUPPORTED_REGIONS } from './integ-tests-regions';
import { RouteCalculator } from '../lib/route-calculator';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new RouteCalculator(this, 'RouteCalculator', {
      dataSource: DataSource.ESRI,
      routeCalculatorName: 'my_route_calculator',
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'RouteCalculatorTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-route-calculator')],
  regions: LOCATION_SUPPORTED_REGIONS,
});
