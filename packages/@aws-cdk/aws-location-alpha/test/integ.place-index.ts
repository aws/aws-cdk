import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { PlaceIndex } from '../lib';
import { LOCATION_SUPPORTED_REGIONS } from './integ-tests-regions';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new PlaceIndex(this, 'PlaceIndex', {
      placeIndexName: 'my_place_index',
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'PlaceIndexTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-place-index')],
  regions: LOCATION_SUPPORTED_REGIONS,
});
