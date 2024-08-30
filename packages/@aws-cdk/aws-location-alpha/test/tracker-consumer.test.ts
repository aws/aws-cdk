import { Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib';
import { Tracker } from '../lib/tracker';
import { GeofenceCollection } from '../lib';
import { TrackerConsumer } from '../lib/tracker-consumer';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a tracker consumer', () => {
  const geofenceCollection = new GeofenceCollection(stack, 'GeofenceCollection', {});
  const tracker = new Tracker(stack, 'Tracker', {});

  new TrackerConsumer(stack, 'TrackerConsumer', {
    tracker,
    consumer: geofenceCollection,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::TrackerConsumer', {
    ConsumerArn: stack.resolve(geofenceCollection.geofenceCollectionArn),
    TrackerName: stack.resolve(tracker.trackerName),
  });
});
