import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { DataSource, IntendedUse, PlaceIndex } from '../lib/place-index';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a place index', () => {
  new PlaceIndex(stack, 'PlaceIndex');

  Template.fromStack(stack).hasResourceProperties('AWS::Location::PlaceIndex', {
    DataSource: 'Esri',
    IndexName: 'PlaceIndex',
  });
});

test('throws with invalid name', () => {
  expect(() => new PlaceIndex(stack, 'PlaceIndex', {
    placeIndexName: 'inv@lid',
  })).toThrow(/Invalid place index name/);
});

test('grant search actions', () => {
  const placeIndex = new PlaceIndex(stack, 'PlaceIndex', {
    dataSource: DataSource.HERE,
    intendedUse: IntendedUse.STORAGE,
  });

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('foo'),
  });

  placeIndex.grantSearch(role);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
    PolicyDocument: Match.objectLike({
      Statement: [
        {
          Action: [
            'geo:SearchPlaceIndexForPosition',
            'geo:SearchPlaceIndexForSuggestions',
            'geo:SearchPlaceIndexForText',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'PlaceIndex21B3574E',
              'Arn',
            ],
          },
        },
      ],
    }),
  }));
});

test('import from arn', () => {
  const placeIndexArn = stack.formatArn({
    service: 'geo',
    resource: 'place-index',
    resourceName: 'MyPlaceIndex',
  });
  const placeIndex = PlaceIndex.fromPlaceIndexArn(stack, 'PlaceIndex', placeIndexArn);

  // THEN
  expect(placeIndex.placeIndexName).toEqual('MyPlaceIndex');
  expect(placeIndex.placeIndexArn).toEqual(placeIndexArn);
});

test('import from name', () => {
  // WHEN
  const placeIndexName = 'MyPlaceIndex';
  const placeIndex = PlaceIndex.fromPlaceIndexName(stack, 'PlaceIndex', placeIndexName);

  // THEN
  expect(placeIndex.placeIndexName).toEqual(placeIndexName);
  expect(placeIndex.placeIndexArn).toEqual(stack.formatArn({
    service: 'geo',
    resource: 'place-index',
    resourceName: 'MyPlaceIndex',
  }));
});
