import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { PositionFiltering, Tracker } from '../lib/tracker';
import { GeofenceCollection } from '../lib';

class TestStack extends Stack {
  public readonly tracker: Tracker;
  public readonly geofenceCollection1: GeofenceCollection;
  public readonly geofenceCollection2: GeofenceCollection;
  public readonly geofenceCollectionForAdd1: GeofenceCollection;
  public readonly geofenceCollectionForAdd2: GeofenceCollection;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const geofenceCollection1 = new GeofenceCollection(this, 'GeofenceCollection1', {});
    const geofenceCollection2 = new GeofenceCollection(this, 'GeofenceCollection2', {});
    const geofenceCollectionForAdd1 = new GeofenceCollection(this, 'GeofenceCollectionForAdd1', {});
    const geofenceCollectionForAdd2 = new GeofenceCollection(this, 'GeofenceCollectionForAdd2', {});

    const key = new kms.Key(this, 'Key', { removalPolicy: RemovalPolicy.DESTROY });

    const tracker = new Tracker(this, 'Tracker', {
      trackerName: 'My_Tracker',
      description: 'test tracker',
      eventBridgeEnabled: true,
      kmsKeyEnableGeospatialQueries: true,
      kmsKey: key,
      positionFiltering: PositionFiltering.ACCURACY_BASED,
      geofenceCollections: [geofenceCollection1, geofenceCollection2],
    });

    tracker.addGeofenceCollections(geofenceCollectionForAdd1, geofenceCollectionForAdd2);

    this.tracker = tracker;
    this.geofenceCollection1 = geofenceCollection1;
    this.geofenceCollection2 = geofenceCollection2;
    this.geofenceCollectionForAdd1 = geofenceCollectionForAdd1;
    this.geofenceCollectionForAdd2 = geofenceCollectionForAdd2;
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-location-tracker');

const test = new integ.IntegTest(app, 'TrackerTest', {
  testCases: [stack],
});

test.assertions.awsApiCall('location', 'ListTrackerConsumersCommand', { TrackerName: stack.tracker.trackerName })
  .expect(integ.ExpectedResult.objectLike({
    ConsumerArns: [
      stack.geofenceCollection1.geofenceCollectionArn,
      stack.geofenceCollection2.geofenceCollectionArn,
      stack.geofenceCollectionForAdd1.geofenceCollectionArn,
      stack.geofenceCollectionForAdd2.geofenceCollectionArn,
    ],
  }));
