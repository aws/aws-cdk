import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { PositionFiltering, Tracker } from '../lib/tracker';
import { GeofenceCollection } from '../lib';
import { TrackerConsumer } from '../lib/tracker-consumer';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const geofenceCollection = new GeofenceCollection(this, 'GeofenceCollection', {
      geofenceCollectionName: 'MyGeofenceCollection',
      description: 'test',
    });

    const key = new kms.Key(this, 'Key', { removalPolicy: RemovalPolicy.DESTROY });

    const tracker = new Tracker(this, 'Tracker', {
      trackerName: 'MyTracker',
      description: 'test tracker',
      eventBridgeEnabled: true,
      kmsKeyEnableGeospatialQueries: true,
      kmsKey: key,
      positionFiltering: PositionFiltering.ACCURACY_BASED,
    });

    new TrackerConsumer(this, 'TrackerConsumer', {
      consumer: geofenceCollection,
      tracker,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'TrackerTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-tracker')],
});
