
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { BuildSpec, ComputeType, LinuxBuildImage, Project, ProjectProps } from 'aws-cdk-lib/aws-codebuild';
import { CompositePrincipal, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { CodeBuildStartBuild } from 'aws-cdk-lib/aws-scheduler-targets';

/*
 * Stack verification steps:
 * 1. Create a parameter 'MyParameter' in SystemsManager(SSM) with value '🌧️'
 * 2. The code build project updates the Parameter 'MyParameter' from value '🌧️' to '🌈':
 * 3. The code build project is invoked by the scheduler.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-scheduler-targets-codebuild-start-build');

const payload = {
  Name: 'MyParameter',
  Value: '🌈',
};

class TestCodeBuildProject extends Project {
  constructor(scope: Construct, id: string, props: ProjectProps) {
    const projectProps: ProjectProps = {
      role: props.role,
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              `aws ssm put-parameter --overwrite --name ${payload.Name} --value ${payload.Value}`,
            ],
          },
        },
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_7_0,
        computeType: ComputeType.SMALL,
      },
    };
    super(scope, id, projectProps);
  }
}

const parameter = new ssm.StringParameter(stack, 'MyParameter', {
  parameterName: payload.Name,
  stringValue: '🌧️',
});

const role = new Role(stack, 'SchedulerRole', {
  assumedBy: new CompositePrincipal(
    new ServicePrincipal('scheduler.amazonaws.com'),
    new ServicePrincipal('codebuild.amazonaws.com')),
});

const codebuildProject = new TestCodeBuildProject(stack, 'Project', {
  role: role,
});

new scheduler.Schedule(stack, 'Schedule', {
  schedule: scheduler.ScheduleExpression.rate(cdk.Duration.minutes(1)),
  target: new CodeBuildStartBuild(codebuildProject, {
    role: role,
  }),
});

parameter.grantWrite(role);

const integrationTest = new IntegTest(app, 'integrationtest-codebuild-start-build', {
  testCases: [stack],
  stackUpdateWorkflow: false, // this would cause the schedule to trigger with the old code
});

const getParameter = integrationTest.assertions.awsApiCall('SSM', 'getParameter', {
  Name: payload.Name,
});

// Verifies that expected parameter is created by the invoked step function
getParameter.expect(ExpectedResult.objectLike({
  Parameter: {
    Name: payload.Name,
    Value: payload.Value,
  },
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
});
