import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { DataSource, PlaceIndex } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new PlaceIndex(this, 'PlaceIndex', {
      dataSource: DataSource.ESRI,
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'PlaceIndexTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-place-index')],
});
