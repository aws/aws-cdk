import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { CustomLayer, Map, PoliticalView, Style } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Map(this, 'Map', {
      mapName: 'my-map',
      description: 'my map for test',
      style: Style.VECTOR_ESRI_NAVIGATION,
      customLayers: [CustomLayer.POI],
      politicalView: PoliticalView.INDIA,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'MapTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-map')],
});
