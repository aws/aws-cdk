import { expect, haveResource } from '@aws-cdk/assert';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { CfnElement, Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

describe('CodeBuild event target', () => {
  let stack: Stack;
  let project: codebuild.PipelineProject;
  let projectArn: any;

  beforeEach(() => {
    stack = new Stack();
    project = new codebuild.PipelineProject(stack, 'MyProject');
    projectArn = { 'Fn::GetAtt': ['MyProject39F7B0AE', 'Arn'] };
  });

  test('use codebuild project as an eventrule target', () => {
    // GIVEN
    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.expression('rate(1 min)'),
    });

    // WHEN
    rule.addTarget(new targets.CodeBuildProject(project));

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
      Targets: [
        {
          Arn: projectArn,
          Id: 'Target0',
          RoleArn: { 'Fn::GetAtt': ['MyProjectEventsRole5B7D93F5', 'Arn'] },
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'events.amazonaws.com' },
          },
        ],
        Version: '2012-10-17',
      },
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'codebuild:StartBuild',
            Effect: 'Allow',
            Resource: projectArn,
          },
        ],
        Version: '2012-10-17',
      },
    }));
  });

  test('specifying event for codebuild project target', () => {
    // GIVEN
    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.expression('rate(1 hour)'),
    });

    // WHEN
    const eventInput = {
      buildspecOverride: 'buildspecs/hourly.yml',
    };

    rule.addTarget(
      new targets.CodeBuildProject(project, {
        event: events.RuleTargetInput.fromObject(eventInput),
      }),
    );

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
      Targets: [
        {
          Arn: projectArn,
          Id: 'Target0',
          Input: JSON.stringify(eventInput),
          RoleArn: {
            'Fn::GetAtt': ['MyProjectEventsRole5B7D93F5', 'Arn'],
          },
        },
      ],
    }));
  });

  test('specifying custom role for codebuild project target', () => {
    // GIVEN
    const rule = new events.Rule(stack, 'Rule', {
      schedule: events.Schedule.expression('rate(1 hour)'),
    });
    const role = new iam.Role(stack, 'MyExampleRole', {
      assumedBy: new iam.AnyPrincipal(),
    });
    const roleResource = role.node.defaultChild as CfnElement;
    roleResource.overrideLogicalId('MyRole'); // to make it deterministic in the assertion below

    // WHEN
    rule.addTarget(new targets.CodeBuildProject(project, { eventRole: role }));

    // THEN
    expect(stack).to(haveResource('AWS::Events::Rule', {
      Targets: [
        {
          Arn: projectArn,
          Id: 'Target0',
          RoleArn: { 'Fn::GetAtt': ['MyRole', 'Arn'] },
        },
      ],
    }));
  });
});
