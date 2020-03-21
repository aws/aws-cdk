import '@aws-cdk/assert/jest';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import * as iam from '../lib';

test('use of cross-stack role reference does not lead to URLSuffix being exported', () => {
  // GIVEN
  const app = new App();
  const first = new Stack(app, 'First');
  const second = new Stack(app, 'Second');

  // WHEN
  const role = new iam.Role(first, 'Role', {
    assumedBy: new iam.ServicePrincipal('s3.amazonaws.com')
  });

  new CfnOutput(second, 'Output', {
    value: role.roleArn
  });

  // THEN
  app.synth();

  expect(first).toMatchTemplate({
    Resources: {
      Role1ABCC5F0: {
        Type: "AWS::IAM::Role",
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: "sts:AssumeRole",
                Effect: "Allow",
                Principal: { Service: "s3.amazonaws.com" }
              }
            ],
            Version: "2012-10-17"
          }
        }
      }
    },
    Outputs: {
      ExportsOutputFnGetAttRole1ABCC5F0ArnB4C0B73E: {
        Value: { "Fn::GetAtt": [ "Role1ABCC5F0", "Arn" ] },
        Export: {
          Name: "First:ExportsOutputFnGetAttRole1ABCC5F0ArnB4C0B73E"
        }
      }
    }
  });
});

// TODO: may well belong in policy-document.test.ts
test('can create principal with conditions', () => {
  // GIVEN
  const accountId = '012345678910';
  const app = new App();
  const stack = new Stack(app, 'Stack');

  // WHEN
  const conditions = {
    StringEquals: {
      "s3:x-amz-acl": [
        "public-read"
      ]
    }
  };
  const principal = new iam.AccountPrincipal(accountId).withConditions(conditions);
  new iam.Role(stack, 'Role', {
    assumedBy: principal,
  });

  // THEN
  app.synth();

  expect(stack).toMatchTemplate({
    Resources: {
      Role1ABCC5F0: { // how is this name set? Seems to be used a lot of places so I guess it's the one that'll be generated...
        Type: "AWS::IAM::Role",
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: "sts:AssumeRole",
                Condition: {
                  StringEquals: {
                    "s3:x-amz-acl": [
                      "public-read"
                    ]
                  }
                },
                Effect: "Allow",
                Principal: {
                  AWS: {
                    'Fn::Join': [
                      '',
                      [ 'arn:', { Ref: 'AWS::Partition' }, `:iam::${accountId}:root` ]
                    ]
                  }
                },
              }
            ],
            Version: "2012-10-17"
          }
        }
      }
    }
  });
});