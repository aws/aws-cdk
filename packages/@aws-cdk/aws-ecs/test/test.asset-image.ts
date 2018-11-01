import { expect, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import path = require('path');
import ecs = require('../lib');

export = {
  'test instantiating Asset Image'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecs.AssetImage(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // THEN
    expect(stack).toMatch({
      ImageRepositoryC2BE7AD4: {
        Type: "String",
        Description: "Repository ARN for asset \"Image\""
      },
      ImageTagE17D8A6B: {
        Type: "String",
        Description: "Tag for asset \"Image\""
      },
    }, MatchStyle.SUPERSET);

    test.done();
  }
};
