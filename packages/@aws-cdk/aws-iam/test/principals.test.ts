import '@aws-cdk/assert/jest';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import iam = require('../lib');

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
  }
  );
});