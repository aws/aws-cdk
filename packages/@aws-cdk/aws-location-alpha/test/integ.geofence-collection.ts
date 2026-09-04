import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import type { Construct } from 'constructs';
import { GeofenceCollection } from '../lib';
import { LOCATION_SUPPORTED_REGIONS } from './integ-tests-regions';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const kmsKey = new kms.Key(this, 'key', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new GeofenceCollection(this, 'GeofenceCollection', {
      geofenceCollectionName: 'my_geofence_collection',
      description: 'test',
      kmsKey,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'GeofenceCollectionTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-geofence-collection')],
  regions: LOCATION_SUPPORTED_REGIONS,
});
