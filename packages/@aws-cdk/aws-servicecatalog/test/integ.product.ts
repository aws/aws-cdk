import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalog-product');

new servicecatalog.Product(stack, 'TestProduct', {
  productName: 'testProduct',
  owner: 'testOwner',
  provisioningArtifacts: [{ templateUrl: 'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template' }],
});

app.synth();
