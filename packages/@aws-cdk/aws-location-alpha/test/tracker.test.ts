import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Stack } from 'aws-cdk-lib';
import { PositionFiltering, Tracker } from '../lib/tracker';
import { GeofenceCollection } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a tracker', () => {
  const key = new kms.Key(stack, 'Key');

  new Tracker(stack, 'Tracker', {
    trackerName: 'my_tracker',
    description: 'My Tracker',
    eventBridgeEnabled: true,
    kmsKeyEnableGeospatialQueries: true,
    kmsKey: key,
    positionFiltering: PositionFiltering.TIME_BASED,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::Tracker', {
    TrackerName: 'my_tracker',
    Description: 'My Tracker',
    EventBridgeEnabled: true,
    KmsKeyEnableGeospatialQueries: true,
    KmsKeyId: stack.resolve(key.keyArn),
    PositionFiltering: PositionFiltering.TIME_BASED,
  });
});

test('creates a tracker with empty description', () => {
  new Tracker(stack, 'Tracker');

  Template.fromStack(stack).hasResourceProperties('AWS::Location::Tracker', {
  });
});

test('creates a tracker with empty description', () => {
  new Tracker(stack, 'Tracker', {
    description: '',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::Tracker', {
    Description: '',
  });
});

test('creates a tracker with geofence collection', () => {
  const geofenceCollection = new GeofenceCollection(stack, 'GeofenceCollection');

  const tracker = new Tracker(stack, 'Tracker', {
    geofenceCollections: [geofenceCollection],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::TrackerConsumer', {
    ConsumerArn: stack.resolve(geofenceCollection.geofenceCollectionArn),
    TrackerName: stack.resolve(tracker.trackerName),
  });
});

test('add geofence collection after tracker is implemented', () => {
  const tracker = new Tracker(stack, 'Tracker');

  const geofenceCollection = new GeofenceCollection(stack, 'GeofenceCollection');

  tracker.addGeofenceCollections(geofenceCollection);

  Template.fromStack(stack).hasResourceProperties('AWS::Location::TrackerConsumer', {
    ConsumerArn: stack.resolve(geofenceCollection.geofenceCollectionArn),
    TrackerName: stack.resolve(tracker.trackerName),
  });
});

test('throws with invalid description', () => {
  expect(() => new Tracker(stack, 'Tracker', {
    description: 'a'.repeat(1001),
  })).toThrow('`description` must be between 0 and 1000 characters. Received: 1001 characters');
});

test.each(['', 'a'.repeat(101)])('throws with invalid name, got: %s', (trackerName) => {
  expect(() => new Tracker(stack, 'Tracker', {
    trackerName,
  })).toThrow(`\`trackerName\` must be between 1 and 100 characters, got: ${trackerName.length} characters.`);
});

test('throws with invalid name', () => {
  expect(() => new Tracker(stack, 'Tracker', {
    trackerName: 'inv@lid',
  })).toThrow('`trackerName` must contain only alphanumeric characters, hyphens, periods and underscores, got: inv@lid.');
});

test('throws when kmsKeyEnableGeospatialQueries is true without a customer managed key', () => {
  expect(() => new Tracker(stack, 'Tracker', {
    kmsKeyEnableGeospatialQueries: true,
  })).toThrow('`kmsKeyEnableGeospatialQueries` can only be enabled that are configured to use an AWS KMS customer managed key');
});

test('grant update device positions action', () => {
  const tracker = new Tracker(stack, 'Tracker', {});

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('foo'),
  });

  tracker.grantUpdateDevicePositions(role);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
    PolicyDocument: Match.objectLike({
      Statement: [
        {
          Action: 'geo:BatchUpdateDevicePosition',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'TrackerAF5FC55F',
              'Arn',
            ],
          },
        },
      ],
    }),
  }));
});

test('grant resd device positions actions', () => {
  const tracker = new Tracker(stack, 'Tracker', {});

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('foo'),
  });

  tracker.grantRead(role);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
    PolicyDocument: Match.objectLike({
      Statement: [
        {
          Action: [
            'geo:BatchGetDevicePosition',
            'geo:GetDevicePosition',
            'geo:GetDevicePositionHistory',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                {
                  'Fn::GetAtt':
                    [
                      'TrackerAF5FC55F',
                      'Arn',
                    ],
                },
                '/*',
              ],
            ],
          },
        },
      ],
    }),
  }));
});

test('import from arn', () => {
  const trackerArn = stack.formatArn({
    service: 'geo',
    resource: 'tracker',
    resourceName: 'MyTracker',
  });
  const tracker = Tracker.fromTrackerArn(stack, 'Tracker', trackerArn);

  // THEN
  expect(tracker.trackerName).toEqual('MyTracker');
  expect(tracker.trackerArn).toEqual(trackerArn);
});

test('import from name', () => {
  // WHEN
  const trackerName = 'MyTracker';
  const tracker = Tracker.fromTrackerName(stack, 'Tracker', trackerName);

  // THEN
  expect(tracker.trackerName).toEqual(trackerName);
  expect(tracker.trackerArn).toEqual(stack.formatArn({
    service: 'geo',
    resource: 'tracker',
    resourceName: 'MyTracker',
  }));
});
