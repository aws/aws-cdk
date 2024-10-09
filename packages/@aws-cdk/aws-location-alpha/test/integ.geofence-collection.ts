import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { GeofenceCollection } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const kmsKey = new kms.Key(this, 'key', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new GeofenceCollection(this, 'GeofenceCollection', {
      geofenceCollectionName: 'MyGeofenceCollection',
      description: 'test',
      kmsKey,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'GeofenceCollectionTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-geofence-collection')],
});
