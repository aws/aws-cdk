import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AllowMapsAction, AllowPlacesAction, AllowRoutesAction, ApiKey } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create an api key', () => {
  new ApiKey(stack, 'ApiKey', {
    description: 'my-api-key-description',
    forceDelete: true,
    forceUpdate: true,
    noExpiry: true,
    allowMapsActions: [
      AllowMapsAction.ANY,
    ],
    allowPlacesActions: [
      AllowPlacesAction.ANY,
    ],
    allowRoutesActions: [
      AllowRoutesAction.ANY,
    ],
    allowReferers: ['https://example.com'],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::APIKey', {
    KeyName: 'ApiKey',
    Description: 'my-api-key-description',
    ForceDelete: true,
    ForceUpdate: true,
    NoExpiry: true,
    Restrictions: {
      AllowActions: [
        'geo-maps:*',
        'geo-places:*',
        'geo-routes:*',
      ],
      AllowResources: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':geo-maps:',
              { Ref: 'AWS::Region' },
              '::provider/default',
            ],
          ],
        },
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':geo-places:',
              { Ref: 'AWS::Region' },
              '::provider/default',
            ],
          ],
        },
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':geo-routes:',
              { Ref: 'AWS::Region' },
              '::provider/default',
            ],
          ],
        },
      ],
      AllowReferers: ['https://example.com'],
    },
  });
});

test('create an api key with `apiKeyName`', () => {
  new ApiKey(stack, 'ApiKey', {
    apiKeyName: 'my-api-key',
    noExpiry: true,
    allowMapsActions: [
      AllowMapsAction.ANY,
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::APIKey', {
    KeyName: 'my-api-key',
    NoExpiry: true,
    Restrictions: {
      AllowActions: [
        'geo-maps:*',
      ],
      AllowResources: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':geo-maps:',
              { Ref: 'AWS::Region' },
              '::provider/default',
            ],
          ],
        },
      ],
    },
  });
});

test('create an api key with `expireTime` when `noExpiry` is not set', () => {
  new ApiKey(stack, 'ApiKey', {
    apiKeyName: 'my-api-key',
    expireTime: new Date('2026-01-01T00:00:00Z'),
    allowMapsActions: [
      AllowMapsAction.ANY,
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::APIKey', {
    KeyName: 'my-api-key',
    ExpireTime: '2026-01-01T00:00:00.000Z',
    Restrictions: {
      AllowActions: [
        'geo-maps:*',
      ],
      AllowResources: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':geo-maps:',
              { Ref: 'AWS::Region' },
              '::provider/default',
            ],
          ],
        },
      ],
    },
  });
});

test('create an api key with `expireTime` when `noExpiry` is false', () => {
  new ApiKey(stack, 'ApiKey', {
    apiKeyName: 'my-api-key',
    expireTime: new Date('2026-01-01T00:00:00Z'),
    noExpiry: false,
    allowMapsActions: [
      AllowMapsAction.ANY,
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::APIKey', {
    KeyName: 'my-api-key',
    ExpireTime: '2026-01-01T00:00:00.000Z',
    NoExpiry: false,
    Restrictions: {
      AllowActions: [
        'geo-maps:*',
      ],
      AllowResources: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':geo-maps:',
              { Ref: 'AWS::Region' },
              '::provider/default',
            ],
          ],
        },
      ],
    },
  });
});

test('test `allowMapsActions`', () => {
  new ApiKey(stack, 'ApiKey', {
    noExpiry: true,
    allowMapsActions: [
      AllowMapsAction.GET_STATIC_MAP,
      AllowMapsAction.GET_TILE,
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::APIKey', {
    NoExpiry: true,
    Restrictions: {
      AllowActions: [
        'geo-maps:GetStaticMap',
        'geo-maps:GetTile',
      ],
      AllowResources: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':geo-maps:',
              { Ref: 'AWS::Region' },
              '::provider/default',
            ],
          ],
        },
      ],
    },
  });
});

test('test `allowPlacesActions`', () => {
  new ApiKey(stack, 'ApiKey', {
    noExpiry: true,
    allowPlacesActions: [
      AllowPlacesAction.AUTOCOMPLETE,
      AllowPlacesAction.GEOCODE,
      AllowPlacesAction.GET_PLACE,
      AllowPlacesAction.REVERSE_GEOCODE,
      AllowPlacesAction.SEARCH_NEARBY,
      AllowPlacesAction.SEARCH_TEXT,
      AllowPlacesAction.SUGGEST,
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::APIKey', {
    NoExpiry: true,
    Restrictions: {
      AllowActions: [
        'geo-places:Autocomplete',
        'geo-places:Geocode',
        'geo-places:GetPlace',
        'geo-places:ReverseGeocode',
        'geo-places:SearchNearby',
        'geo-places:SearchText',
        'geo-places:Suggest',
      ],
      AllowResources: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':geo-places:',
              { Ref: 'AWS::Region' },
              '::provider/default',
            ],
          ],
        },
      ],
    },
  });
});

test('test `allowRoutesActions`', () => {
  new ApiKey(stack, 'ApiKey', {
    noExpiry: true,
    allowRoutesActions: [
      AllowRoutesAction.CALCULATE_ISOLINES,
      AllowRoutesAction.CALCULATE_ROUTES,
      AllowRoutesAction.CALCULATE_ROUTE_MATRIX,
      AllowRoutesAction.OPTIMIZE_WAYPOINTS,
      AllowRoutesAction.SNAP_TO_ROADS,
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::APIKey', {
    NoExpiry: true,
    Restrictions: {
      AllowActions: [
        'geo-routes:CalculateIsolines',
        'geo-routes:CalculateRoutes',
        'geo-routes:CalculateRouteMatrix',
        'geo-routes:OptimizeWaypoints',
        'geo-routes:SnapToRoads',
      ],
      AllowResources: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':geo-routes:',
              { Ref: 'AWS::Region' },
              '::provider/default',
            ],
          ],
        },
      ],
    },
  });
});

test('throws with invalid description', () => {
  expect(() => new ApiKey(stack, 'ApiKey', {
    description: 'a'.repeat(1001),
    noExpiry: true,
    allowRoutesActions: [
      AllowRoutesAction.CALCULATE_ISOLINES,
    ],
  })).toThrow('`description` must be between 0 and 1000 characters. Received: 1001 characters');
});

test.each(['', 'a'.repeat(101)])('throws with invalid name, got: %s', (apiKeyName) => {
  expect(() => new ApiKey(stack, 'ApiKey', {
    apiKeyName,
    noExpiry: true,
    allowRoutesActions: [
      AllowRoutesAction.CALCULATE_ISOLINES,
    ],
  })).toThrow(`\`apiKeyName\` must be between 1 and 100 characters, got: ${apiKeyName.length} characters.`);
});

test('throws with invalid name', () => {
  expect(() => new ApiKey(stack, 'ApiKey', {
    apiKeyName: 'inv@lid',
    noExpiry: true,
    allowRoutesActions: [
      AllowRoutesAction.CALCULATE_ISOLINES,
    ],
  })).toThrow('`apiKeyName` must contain only alphanumeric characters, hyphens, periods and underscores, got: inv@lid.');
});

test('throws when `noExpiry` is true and `expireTime` is specified', () => {
  expect(() => {
    new ApiKey(stack, 'ApiKey', {
      expireTime: new Date('2026-01-01T00:00:00Z'),
      noExpiry: true,
      allowRoutesActions: [
        AllowRoutesAction.CALCULATE_ISOLINES,
      ],
    });
  }).toThrow('`expireTime` must not be set when `noExpiry` has value true.');
});

test('throws when `noExpiry` is not true and `expireTime` is not specified', () => {
  expect(() => {
    new ApiKey(stack, 'ApiKey', {
      allowRoutesActions: [
        AllowRoutesAction.CALCULATE_ISOLINES,
      ],
    });
  }).toThrow('`expireTime` must be set when `noExpiry` is false or undefined.');
});

test('throws when over 0 referers are set', () => {
  expect(() => {
    new ApiKey(stack, 'ApiKey', {
      noExpiry: true,
      allowRoutesActions: [
        AllowRoutesAction.CALCULATE_ISOLINES,
      ],
      allowReferers: [
      ],
    });
  }).toThrow('`allowReferers` must be between 1 and 5 elements, got: 0 elements.');
});

test('throws when over 5 referers are set', () => {
  expect(() => {
    new ApiKey(stack, 'ApiKey', {
      noExpiry: true,
      allowRoutesActions: [
        AllowRoutesAction.CALCULATE_ISOLINES,
      ],
      allowReferers: [
        'https://example.com',
        'https://example.com',
        'https://example.com',
        'https://example.com',
        'https://example.com',
        'https://example.com',
      ],
    });
  }).toThrow('`allowReferers` must be between 1 and 5 elements, got: 6 elements.');
});

test('import from arn', () => {
  const apiKeyArn = stack.formatArn({
    service: 'geo',
    resource: 'api-key',
    resourceName: 'my-api-key',
  });
  const apiKey = ApiKey.fromApiKeyArn(stack, 'ApiKey', apiKeyArn);

  // THEN
  expect(apiKey.apiKeyName).toEqual('my-api-key');
  expect(apiKey.apiKeyArn).toEqual(apiKeyArn);
});

test('import from name', () => {
  // WHEN
  const apiKeyName = 'my-api-key';
  const apiKey = ApiKey.fromApiKeyName(stack, 'ApiKey', apiKeyName);

  // THEN
  expect(apiKey.apiKeyName).toEqual(apiKeyName);
  expect(apiKey.apiKeyArn).toEqual(stack.formatArn({
    service: 'geo',
    resource: 'api-key',
    resourceName: 'my-api-key',
  }));
});
