import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as path from 'path';
import * as apigw from '../lib';

export = {
  'apigateway.ApiDefinition.fromInline': {
    'fails if inline definition is empty'(test: Test) {
      test.throws(
        () => defineRestApi(apigw.ApiDefinition.fromInline('')),
        /cannot be empty/);
      test.done();
    },
  },

  'apigateway.ApiDefinition.fromAsset': {
    'fails if a directory is given for an asset'(test: Test) {
      // GIVEN
      const fileAsset = apigw.ApiDefinition.fromAsset(path.join(__dirname, 'authorizers'));

      // THEN
      test.throws(() => defineRestApi(fileAsset), /Asset cannot be a \.zip file or a directory/);
      test.done();
    },

    'only one Asset object gets created even if multiple functions use the same AssetApiDefinition'(test: Test) {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'MyStack');
      const directoryAsset = apigw.ApiDefinition.fromAsset(path.join(__dirname, 'sample-definition.yaml'));

      // WHEN
      new apigw.SpecRestApi(stack, 'API1', {
        apiDefinition: directoryAsset,
      });

      new apigw.SpecRestApi(stack, 'API2', {
        apiDefinition: directoryAsset,
      });

      // THEN
      const assembly = app.synth();
      const synthesized = assembly.stacks[0];

      // API1 has an asset, API2 does not
      test.deepEqual(synthesized.assets.length, 1);
      test.done();
    },
  },
};

function defineRestApi(definition: apigw.ApiDefinition) {
  const stack = new cdk.Stack();
  return new apigw.SpecRestApi(stack, 'API', {
    apiDefinition: definition,
  });
}
