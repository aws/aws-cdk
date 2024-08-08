import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Stack } from 'aws-cdk-lib';
import { GeofenceCollection } from '../lib/geofence-collection';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a geofence collection', () => {
  new GeofenceCollection(stack, 'GeofenceCollection', { description: 'test' });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::GeofenceCollection', {
    CollectionName: 'GeofenceCollection',
    Description: 'test',
  });
});

test('creates geofence collection with empty description', () => {
  new GeofenceCollection(stack, 'GeofenceCollection', { description: '' });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::GeofenceCollection', {
    Description: '',
  });
});

test('throws with invalid description', () => {
  expect(() => new GeofenceCollection(stack, 'GeofenceCollection', {
    description: 'a'.repeat(1001),
  })).toThrow('`description` must be between 0 and 1000 characters. Received: 1001 characters');
});

test('throws with invalid name', () => {
  expect(() => new GeofenceCollection(stack, 'GeofenceCollection', {
    geofenceCollectionName: 'inv@lid',
  })).toThrow('Invalid geofence collection name. The geofence collection name must be between 1 and 100 characters and contain only alphanumeric characters, hyphens, periods and underscores. Received: inv@lid');
});

test('grant read actions', () => {
  const geofenceCollection = new GeofenceCollection(stack, 'GeofenceCollection', {
  });

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('foo'),
  });

  geofenceCollection.grantRead(role);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
    PolicyDocument: Match.objectLike({
      Statement: [
        {
          Action: [
            'geo:ListGeofences',
            'geo:GetGeofence',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'GeofenceCollection6FAC681F',
              'Arn',
            ],
          },
        },
      ],
    }),
  }));
});

test('import from arn', () => {
  const geofenceCollectionArn = stack.formatArn({
    service: 'geo',
    resource: 'geofence-collection',
    resourceName: 'MyGeofenceCollection',
  });
  const geofenceCollection = GeofenceCollection.fromGeofenceCollectionArn(stack, 'GeofenceCollection', geofenceCollectionArn);

  // THEN
  expect(geofenceCollection.geofenceCollectionName).toEqual('MyGeofenceCollection');
  expect(geofenceCollection.geofenceCollectionArn).toEqual(geofenceCollectionArn);
});

test('import from name', () => {
  // WHEN
  const geofenceCollectionName = 'MyGeofenceCollection';
  const geofenceCollection = GeofenceCollection.fromGeofenceCollectionName(stack, 'GeofenceCollection', geofenceCollectionName);

  // THEN
  expect(geofenceCollection.geofenceCollectionName).toEqual(geofenceCollectionName);
  expect(geofenceCollection.geofenceCollectionArn).toEqual(stack.formatArn({
    service: 'geo',
    resource: 'geofence-collection',
    resourceName: 'MyGeofenceCollection',
  }));
});

test('create a geofence collection with a customer managed key)', () => {
  // GIVEN
  const kmsKey = new kms.Key(stack, 'Key');

  // WHEN
  new GeofenceCollection(stack, 'GeofenceCollection',
    { kmsKey },
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Location::GeofenceCollection', {
    KmsKeyId: stack.resolve(kmsKey.keyArn),
  });
});
