import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { CustomLayer, Map, PoliticalView, Style } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a map', () => {
  new Map(stack, 'Map', {
    mapName: 'my-map',
    description: 'my map for test',
    style: Style.VECTOR_ESRI_NAVIGATION,
    customLayers: [CustomLayer.POI],
    politicalView: PoliticalView.INDIA,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::Map', {
    MapName: 'my-map',
    Description: 'my map for test',
    Configuration: {
      CustomLayers: ['POI'],
      PoliticalView: 'IND',
      Style: 'VectorEsriNavigation',
    },
  });
});

test('creates a map with empty description', () => {
  new Map(stack, 'Map', {
    description: '',
    style: Style.VECTOR_ESRI_NAVIGATION,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::Map', {
    Description: '',
  });
});

test('throws with invalid description', () => {
  expect(() => new Map(stack, 'Map', {
    description: 'a'.repeat(1001),
    style: Style.VECTOR_ESRI_NAVIGATION,
  })).toThrow('`description` must be between 0 and 1000 characters, got: 1001 characters.');
});

test('throws with invalid name', () => {
  expect(() => new Map(stack, 'Map', {
    mapName: 'inv@lid',
    style: Style.VECTOR_ESRI_NAVIGATION,
  })).toThrow('`mapName` must contain only alphanumeric characters, hyphens, periods and underscores, got: inv@lid.');
});

test.each(['', 'a'.repeat(101)])('throws with invalid name, got: %s', (mapName) => {
  expect(() => new Map(stack, 'Map', {
    mapName,
    style: Style.VECTOR_ESRI_NAVIGATION,
  })).toThrow(`\`mapName\` must be between 1 and 100 characters, got: ${mapName.length} characters.`);
});

test('grant rendering ', () => {
  const map = new Map(stack, 'Map', {
    style: Style.VECTOR_ESRI_NAVIGATION,
  });

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('foo'),
  });

  map.grantRendering(role);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
    PolicyDocument: Match.objectLike({
      Statement: [
        {
          Action: [
            'geo:GetMapTile',
            'geo:GetMapSprites',
            'geo:GetMapGlyphs',
            'geo:GetMapStyleDescriptor',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'Map207736EC',
              'Arn',
            ],
          },
        },
      ],
    }),
  }));
});

test('import from arn', () => {
  const mapArn = stack.formatArn({
    service: 'geo',
    resource: 'map',
    resourceName: 'MyMap',
  });
  const map = Map.fromMapArn(stack, 'Map', mapArn);

  // THEN
  expect(map.mapName).toEqual('MyMap');
  expect(map.mapArn).toEqual(mapArn);
});

test('import from name', () => {
  // WHEN
  const mapName = 'MyMap';
  const map = Map.fromMapName(stack, 'Map', mapName);

  // THEN
  expect(map.mapName).toEqual(mapName);
  expect(map.mapArn).toEqual(stack.formatArn({
    service: 'geo',
    resource: 'map',
    resourceName: 'MyMap',
  }));
});
