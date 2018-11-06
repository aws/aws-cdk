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

  async 'exercise handler create'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'images', 'adopt-repository', 'handler'), {
      'aws-sdk': {
        '@noCallThru': true,
        "ECR": ECRWithEmptyPolicy,
      }
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

  async 'exercise handler delete'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'images', 'adopt-repository', 'handler'), {
      'aws-sdk': { '@noCallThru': true, "ECR": ECRWithOwningPolicy }
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
      RequestType: 'Delete',
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

function ECRWithEmptyPolicy() {
  return new ECR({ asdf: 'asdf' });
}

function ECRWithOwningPolicy() {
  return new ECR({
    Statement: [
      {
        Sid: 'StackId',
        Effect: "Deny",
        Action: "OwnedBy:CDKStack",
        Principal: "*"
      }
    ]
  });
}

class ECR {
  public constructor(private policy: any) {
  }

  public getRepositoryPolicy() {
    const self = this;
    return { async promise() { return {
      policyText: JSON.stringify(self.policy)
    }; } };
  }

  public setRepositoryPolicy() {
    return { async promise() { return; } };
  }

  public listImages() {
    return { async promise() {
      return { imageIds: [] };
    } };
  }

  public batchDeleteImage() {
    return { async promise() {
      return {};
    } };
  }

  public deleteRepository() {
    return { async promise() {
      return {};
    } };
  }
}