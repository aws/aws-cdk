import { expect, haveResource } from '@aws-cdk/assert';
import codebuild = require('@aws-cdk/aws-codebuild');
import events = require('@aws-cdk/aws-events');
import { Stack } from '@aws-cdk/cdk';
import targets = require('../../lib');

test('use codebuild project as an eventrule target', () => {
  // GIVEN
  const stack = new Stack();
  const project = new codebuild.PipelineProject(stack, 'MyProject');
  const rule = new events.Rule(stack, 'Rule', { scheduleExpression: 'rate(1 min)' });

  // WHEN
  rule.addTarget(new targets.CodeBuildProject(project));

  // THEN
  expect(stack).to(haveResource('AWS::Events::Rule', {
    Targets: [
      {
        Arn: {
          "Fn::GetAtt": [
            "MyProject39F7B0AE",
            "Arn"
          ]
        },
        Id: "MyProject",
        RoleArn: {
          "Fn::GetAtt": [
            "MyProjectEventsRole5B7D93F5",
            "Arn"
          ]
        }
      }
    ]
  }));

  expect(stack).to(haveResource('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: { Service: { "Fn::Join": [ "", [ "events.", { Ref: "AWS::URLSuffix" } ] ] } }
        }
      ],
      Version: "2012-10-17"
    }
  }));

  expect(stack).to(haveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: "codebuild:StartBuild",
          Effect: "Allow",
          Resource: {
            "Fn::GetAtt": [
              "MyProject39F7B0AE",
              "Arn"
            ]
          }
        }
      ],
      Version: "2012-10-17"
    }
  }));
});
