import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-project-codeconnections');

const gitHubSource = codebuild.Source.gitHub({
  owner: 'aws',
  repo: 'aws-cdk',
  reportBuildStatus: false,
});

const project = new codebuild.Project(stack, 'MyProject', {
  source: gitHubSource,
  grantReportGroupPermissions: false,
});

// Override source to use CODECONNECTIONS authentication
const cfnProject = project.node.defaultChild as codebuild.CfnProject;
cfnProject.source = {
  type: 'GITHUB',
  location: 'https://github.com/aws/aws-cdk.git',
  auth: {
    type: 'CODECONNECTIONS',
    resource: 'arn:aws:codeconnections:us-east-1:123456789012:connection/84941bd4-6795-4871-99f6-e2e4697138da',
  },
};

project.addToRolePolicy(new iam.PolicyStatement({
  actions: ['codeconnections:UseConnection'],
  resources: ['*'],
}));

new IntegTest(app, 'integ-codebuild-project-codeconnections', {
  testCases: [stack],
});
