import { Schedule, ScheduleExpression } from '@aws-cdk/aws-scheduler-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { BuildSpec, Project } from 'aws-cdk-lib/aws-codebuild';
import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { CodeBuildStartBuild } from '../lib/codebuild-start-build';

describe('codebuild start build', () => {
  let app: App;
  let stack: Stack;
  let codebuildProject: Project;

  const codebuildArnRef = { 'Fn::GetAtt': ['ProjectC78D97AD', 'Arn'] };
  const codebuildAction = 'codebuild:StartBuild';
  const expr = ScheduleExpression.at(new Date(Date.UTC(1991, 2, 24, 0, 0, 0)));

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
    codebuildProject = new Project(stack, 'Project', {
      buildSpec: BuildSpec.fromObject({}),
    });
  });

  test('creates IAM role and IAM policy for step function target in the same account', () => {
    const codeBuildTarget = new CodeBuildStartBuild(codebuildProject, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codeBuildTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: codebuildArnRef,
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTarget1441a743A31888', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
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

  test('creates IAM policy for provided IAM role', () => {
    const targetExecutionRole = new Role(stack, 'ProvidedTargetRole', {
      assumedBy: new AccountRootPrincipal(),
    });

    const codeBuildTarget = new CodeBuildStartBuild(codebuildProject, {
      role: targetExecutionRole,
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
          RoleArn: { 'Fn::GetAtt': ['ProvidedTargetRole8CFDD54A', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
          },
        ],
      },
      Roles: [{ Ref: 'ProvidedTargetRole8CFDD54A' }],
    });
  });

  test('reuses IAM role and IAM policy for two schedules from the same account', () => {
    const codeBuildTarget = new CodeBuildStartBuild(codebuildProject, {});

    new Schedule(stack, 'MyScheduleDummy1', {
      schedule: expr,
      target: codeBuildTarget,
    });

    new Schedule(stack, 'MyScheduleDummy2', {
      schedule: expr,
      target: codeBuildTarget,
    });

    const template = Template.fromStack(stack);

    template.resourcePropertiesCountIs('AWS::IAM::Role', {
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
    }, 1);

    template.resourcePropertiesCountIs('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTarget1441a743A31888' }],
    }, 1);
  });

  test('creates IAM policy for imported state machine in the same account', () => {
    const importedCodeBuildArn = 'arn:aws:codebuild:us-east-1:123456789012:project/myproject';
    const importedCodeBuild = Project.fromProjectArn(stack, 'ImportedProject', importedCodeBuildArn);

    const codeBuildTarget = new CodeBuildStartBuild(importedCodeBuild, {});

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codeBuildTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedCodeBuildArn,
          RoleArn: { 'Fn::GetAtt': ['SchedulerRoleForTargete199e0B863F6C1', 'Arn'] },
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: importedCodeBuildArn,
          },
        ],
      },
      Roles: [{ Ref: 'SchedulerRoleForTargete199e0B863F6C1' }],
    });
  });

  test('creates IAM policy for imported role for code build in the same account', () => {
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const stepFunctionTarget = new CodeBuildStartBuild(codebuildProject, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: stepFunctionTarget,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: codebuildArnRef,
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: codebuildArnRef,
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test('creates IAM policy for imported code build project with imported IAM role in the same account', () => {
    const importedCodeBuildArn = 'arn:aws:codebuild:us-east-1:123456789012:project/myproject';
    const importedCodeBuild = Project.fromProjectArn(stack, 'ImportedProject', importedCodeBuildArn);
    const importedRoleArn = 'arn:aws:iam::123456789012:role/someRole';
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', importedRoleArn);

    const codeBuildTarget = new CodeBuildStartBuild(importedCodeBuild, {
      role: importedRole,
    });

    new Schedule(stack, 'MyScheduleDummy', {
      schedule: expr,
      target: codeBuildTarget,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::Scheduler::Schedule', {
      Properties: {
        Target: {
          Arn: importedCodeBuildArn,
          RoleArn: importedRoleArn,
          RetryPolicy: {},
        },
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: codebuildAction,
            Effect: 'Allow',
            Resource: importedCodeBuildArn,
          },
        ],
      },
      Roles: ['someRole'],
    });
  });

  test.each([
    ['account', 'arn:aws:codebuild:us-east-1:999999999999:project/myproject', /Both the schedule and the project must be in the same account./],
    ['region', 'arn:aws:codebuild:eu-central-1:123456789012:project/myproject', /Both the schedule and the project must be in the same region./],
  ])('throws when codebuild project is imported from different %s', (_, arn: string, expectedError: RegExp) => {
    const importedProject = Project.fromProjectArn(stack, 'ImportedProject', arn);
    const codeBuildTarget = new CodeBuildStartBuild(importedProject, {});

    expect(() =>
      new Schedule(stack, 'MyScheduleDummy', {
        schedule: expr,
        target: codeBuildTarget,
      })).toThrow(expectedError);
  });

});
