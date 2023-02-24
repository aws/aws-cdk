import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import { PlaceIndex } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new PlaceIndex(this, 'PlaceIndex');
  }
}

const app = new App();

new integ.IntegTest(app, 'PlaceIndexTest', {
  testCases: [new TestStack(app, 'cdk-integ-location-place-index')],
});
