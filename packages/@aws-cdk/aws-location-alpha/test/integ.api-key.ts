import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { AllowMapsAction, AllowPlacesAction, AllowRoutesAction, ApiKey } from '../lib';
import { LOCATION_SUPPORTED_REGIONS } from './integ-tests-regions';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new ApiKey(this, 'APIKey', {
      apiKeyName: 'my-api-key',
      description: 'my api key for test',
      expireTime: new Date('2036-01-01T00:00:00Z'),
      noExpiry: false,
      allowMapsActions: [
        AllowMapsAction.GET_STATIC_MAP,
        AllowMapsAction.GET_TILE,
      ],
      allowPlacesActions: [
        AllowPlacesAction.AUTOCOMPLETE,
        AllowPlacesAction.GEOCODE,
        AllowPlacesAction.GET_PLACE,
        AllowPlacesAction.REVERSE_GEOCODE,
        AllowPlacesAction.SEARCH_NEARBY,
        AllowPlacesAction.SEARCH_TEXT,
        AllowPlacesAction.SUGGEST,
      ],
      allowRoutesActions: [
        AllowRoutesAction.CALCULATE_ISOLINES,
        AllowRoutesAction.CALCULATE_ROUTES,
        AllowRoutesAction.CALCULATE_ROUTE_MATRIX,
        AllowRoutesAction.OPTIMIZE_WAYPOINTS,
        AllowRoutesAction.SNAP_TO_ROADS,
      ],
      allowReferers: ['https://example.com'],
    });

    new ApiKey(this, 'APIKeyAny', {
      apiKeyName: 'my-api-key-allowd-any-actions',
      noExpiry: true,
      forceUpdate: true,
      forceDelete: true,
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
  }
}

const app = new App();

new integ.IntegTest(app, 'ApiKeyTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-api-key')],
  regions: LOCATION_SUPPORTED_REGIONS,
});
