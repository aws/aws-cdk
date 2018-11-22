import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import path = require('path');
import proxyquire = require('proxyquire');
import { DockerImageAsset } from '../lib';

// tslint:disable:object-literal-key-quotes

let ecrMock: any;

export = {
  'test instantiating Asset Image'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // THEN
    const template = stack.toCloudFormation();

    test.deepEqual(template.Parameters.ImageImageName5E684353, {
      Type: 'String',
      Description: 'ECR repository name and tag asset "Image"'
    });

    test.done();
  },

  'asset.repository.grantPull can be used to grant a principal permissions to use the image'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'MyUser');
    const asset = new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image')
    });

    // WHEN
    asset.repository.grantPull(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        "Statement": [
          {
            "Action": [
              "ecr:BatchCheckLayerAvailability",
              "ecr:GetDownloadUrlForLayer",
              "ecr:BatchGetImage"
            ],
            "Effect": "Allow",
            "Resource": {
              "Fn::Join": [
                "",
                [
                  "arn:",
                  { "Ref": "AWS::Partition" },
                  ":ecr:",
                  { "Ref": "AWS::Region" },
                  ":",
                  { "Ref": "AWS::AccountId" },
                  ":repository/",
                  { "Fn::Select": [ 0, { "Fn::Split": [ ":", { "Ref": "ImageImageName5E684353" } ] } ] }
                ]
              ]
            }
          },
          {
            "Action": [
              "ecr:GetAuthorizationToken",
              "logs:CreateLogStream",
              "logs:PutLogEvents"
            ],
            "Effect": "Allow",
            "Resource": "*"
          }
        ],
        "Version": "2012-10-17"
      },
      "PolicyName": "MyUserDefaultPolicy7B897426",
      "Users": [
        {
          "Ref": "MyUserDC45028B"
        }
      ]
    }));

    test.done();
  },

  'asset.repository.addToResourcePolicy can be used to modify the ECR resource policy via the adoption custom resource'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const asset = new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image')
    });

    // WHEN
    asset.repository.addToResourcePolicy(new iam.PolicyStatement()
      .addAction('BOOM')
      .addPrincipal(new iam.ServicePrincipal('DAMN')));

    // THEN
    expect(stack).to(haveResource('Custom::CDKECRRepositoryAdoption', {
      "RepositoryArn": {
        "Fn::Join": [
          "",
          [
            "arn:",
            { "Ref": "AWS::Partition" },
            ":ecr:",
            { "Ref": "AWS::Region" },
            ":",
            { "Ref": "AWS::AccountId" },
            ":repository/",
            {
              "Fn::Select": [ 0, { "Fn::Split": [ ":", { "Ref": "ImageImageName5E684353" } ] } ]
            }
          ]
        ]
      },
      "PolicyDocument": {
        "Statement": [
          {
            "Action": "BOOM",
            "Effect": "Allow",
            "Principal": {
              "Service": "DAMN"
            }
          }
        ],
        "Version": "2012-10-17"
      }
    }));

    test.done();
  },

  async 'exercise handler create with policy'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
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
        PolicyDocument: {
          Version: '2008-10-01',
          My: 'Document'
        }
      },
      RequestType: 'Create',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(JSON.parse(ecrMock.lastSetRepositoryPolicyRequest.policyText), {
      My: "Document",
      Version: '2008-10-01',
      Statement: [
        { Sid: "StackId", Effect: "Deny", Action: "OwnedBy:CDKStack", Principal: "*" }
      ]
    });

    test.deepEqual(output, {
      responseStatus: 'SUCCESS',
      reason: 'OK',
      physId: '',
      data: { }
    });

    test.done();
  },

  async 'exercise handler create with policy with object statement'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
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
        PolicyDocument: {
          Statement: { Action: 'boom' }
        }
      },
      RequestType: 'Create',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(JSON.parse(ecrMock.lastSetRepositoryPolicyRequest.policyText), {
      Version: '2008-10-17',
      Statement: [
        { Action: 'boom' },
        { Sid: "StackId", Effect: "Deny", Action: "OwnedBy:CDKStack", Principal: "*" }
      ]
    });

    test.deepEqual(output, {
      responseStatus: 'SUCCESS',
      reason: 'OK',
      physId: '',
      data: { }
    });

    test.done();
  },

  async 'exercise handler create with policy with array statement'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
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
        PolicyDocument: {
          Statement: [ { Action: 'boom' }, { Resource: "foo" }  ]
        }
      },
      RequestType: 'Create',
      ResponseURL: 'https://localhost/test'
    }, {
      logStreamName: 'xyz',
    }, undefined, response);

    test.deepEqual(JSON.parse(ecrMock.lastSetRepositoryPolicyRequest.policyText), {
      Version: '2008-10-17',
      Statement: [
        { Action: "boom" },
        { Resource: "foo" },
        { Sid: "StackId", Effect: "Deny", Action: "OwnedBy:CDKStack", Principal: "*" }
      ]
    });

    test.deepEqual(output, {
      responseStatus: 'SUCCESS',
      reason: 'OK',
      physId: '',
      data: { }
    });

    test.done();
  },

  async 'exercise handler create'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
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
      data: { }
    });

    test.done();
  },

  async 'exercise handler delete'(test: Test) {
    const handler = proxyquire(path.resolve(__dirname, '..', 'lib', 'adopt-repository', 'handler'), {
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
      data: { }
    });

    test.done();
  },
};

function ECRWithEmptyPolicy() {
  ecrMock = new ECR({ asdf: 'asdf' });
  return ecrMock;
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
  public lastSetRepositoryPolicyRequest: any;

  public constructor(private policy: any) {
  }

  public getRepositoryPolicy() {
    const self = this;
    return { async promise() { return {
      policyText: JSON.stringify(self.policy)
    }; } };
  }

  public setRepositoryPolicy(req: any) {
    this.lastSetRepositoryPolicyRequest = req;

    return {
      async promise() {
        return;
      }
    };
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
