import { expect, haveResource, SynthUtils } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import path = require('path');
import { DockerImageAsset } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'test instantiating Asset Image'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new DockerImageAsset(stack, 'Image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // THEN
    const template = SynthUtils.toCloudFormation(stack);

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
                  {
                      "Fn::GetAtt": [
                        "ImageAdoptRepositoryE1E84E35",
                        "RepositoryName"
                      ]
                  }
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
      .addPrincipal(new iam.ServicePrincipal('test.service')));

    // THEN
    expect(stack).to(haveResource('Custom::ECRAdoptedRepository', {
      "RepositoryName": {
        "Fn::Select": [ 0, { "Fn::Split": [ ":", { "Ref": "ImageImageName5E684353" } ] } ]
      },
      "PolicyDocument": {
        "Statement": [
          {
            "Action": "BOOM",
            "Effect": "Allow",
            "Principal": {
              "Service": "test.service"
            }
          }
        ],
        "Version": "2012-10-17"
      }
    }));

    test.done();
  },

  'fails if the directory does not exist'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => {
      new DockerImageAsset(stack, 'MyAsset', {
        directory: `/does/not/exist/${Math.floor(Math.random() * 9999)}`
      });
    }, /Cannot find image directory at/);
    test.done();
  },

  'fails if the directory does not contain a Dockerfile'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => {
      new DockerImageAsset(stack, 'Asset', {
        directory: __dirname
      });
    }, /No 'Dockerfile' found in/);
    test.done();
  }
};
