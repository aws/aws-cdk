import { Schedule, ScheduleExpression } from '@aws-cdk/aws-scheduler-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { BuildSpec, Project } from 'aws-cdk-lib/aws-codebuild';
import { CodeBuildStartBuild } from '../lib/codebuild-start-build';

describe('codebuild start build', () => {
  let app: App;
  let stack: Stack;
  let codebuildProject: Project;
  const expr = ScheduleExpression.at(new Date(Date.UTC(1991, 2, 24, 0, 0, 0)));

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    codebuildProject = new Project(stack, 'Project', {
      buildSpec: BuildSpec.fromObject({}),
    });
  });

  test('creates IAM role and IAM policy for step function target in the same account', () => {
    const codeBuildTarget = new CodeBuildStartBuild(codebuildProject, {

    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codeBuildTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: {
            'Fn::GetAtt': ['ProjectC78D97AD', 'Arn'],
          },
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'codebuild:StartBuild',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': ['ProjectC78D97AD', 'Arn'],
            },
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    });

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Condition: { StringEquals: { 'aws:SourceAccount': '123456789012' } },
            Principal: {
              Service: 'scheduler.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    });
  });
});
