import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { PositionFiltering, Tracker } from '../lib/tracker';
import { GeofenceCollection } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const geofenceCollection1 = new GeofenceCollection(this, 'GeofenceCollection1', {});
    const geofenceCollection2 = new GeofenceCollection(this, 'GeofenceCollection2', {});
    const geofenceCollectionForAdd1 = new GeofenceCollection(this, 'GeofenceCollectionForAdd1', {});
    const geofenceCollectionForAdd2 = new GeofenceCollection(this, 'GeofenceCollectionForAdd2', {});

    const key = new kms.Key(this, 'Key', { removalPolicy: RemovalPolicy.DESTROY });

    const tracker = new Tracker(this, 'Tracker', {
      trackerName: 'MyTracker',
      description: 'test tracker',
      eventBridgeEnabled: true,
      kmsKeyEnableGeospatialQueries: true,
      kmsKey: key,
      positionFiltering: PositionFiltering.ACCURACY_BASED,
      geofenceCollections: [geofenceCollection1, geofenceCollection2],
    });

    tracker.addGeofenceCollections(geofenceCollectionForAdd1, geofenceCollectionForAdd2);
  }
}

const app = new App();

new integ.IntegTest(app, 'TrackerTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-tracker')],
});
