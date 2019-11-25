import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
// import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import glue = require('../lib');

export = {
  'connection happy path'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-stack');

    new glue.Connection(stack, 'Connection', {
      connectionInput: {
        properties: {},
        type: glue.ConnectionInputTypes.JDBC
      }
    });

    expect(stack).to(haveResource('AWS::Glue::Connection', {
      Type: "AWS::Glue::Connection",
      CatalogId: "",
      ConnectionInput: {
        ConnectionProperties: JSON.stringify({}),
        ConnectionType: 'JDBC'
      }
    }, ResourcePart.CompleteDefinition));
    test.done();
  },
}
