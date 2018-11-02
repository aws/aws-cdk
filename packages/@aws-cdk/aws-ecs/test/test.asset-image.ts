import { expect, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import path = require('path');
import proxyquire = require('proxyquire');
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
  },

  async 'exercise handler'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
      'aws-sdk': { '@noCallThru': true, ECR }
    });

    let output;
    async function response(responseStatus: string, reason: string, physId: string, data: any) {
      output = { responseStatus, reason, physId, data };
    }

    await handler.handler({
      StackId: 'StackId',
      ResourceProperties: {
        RepositoryArn: 'RepositoryArn',
      },
      RequestType: 'Create',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(output, {
      responseStatus: 'SUCCESS',
      reason: 'OK',
      physId: '',
      data: { RepositoryUri: 'undefined.dkr.ecr.undefined.amazonaws.com/' }
    });

    test.done();
  },
};

class ECR {
  public getRepositoryPolicy() {
    return { async promise() { return {
      policyText: '{"asdf": "asdf"}'
    }; } };
  }

  public setRepositoryPolicy() {
    return { async promise() { return; } };
  }
}