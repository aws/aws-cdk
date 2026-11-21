import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * A CodeBuild action that runs its builds as an explicit `serviceRoleOverride`
 * role, scoped to the single repository cloned by a Full Clone CodeConnections
 * source. The action renders `ServiceRoleArnOverride` and the pipeline role gets
 * `iam:PassRole` on the override role.
 *
 * The test deploys the stack but does not run the pipeline: by default the source
 * uses a mock connection. To run a build by hand, set CONNECTION_ARN, REPO_OWNER,
 * REPO_NAME and BRANCH to a real connection and repository.
 */

const app = new cdk.App();

const stack = new cdk.Stack(app, 'codebuild-service-role-override');

const connectionArn = process.env.CONNECTION_ARN || 'arn:aws:codeconnections:us-east-1:123456789012:connection/MOCK';
const owner = process.env.REPO_OWNER || 'test-owner';
const repo = process.env.REPO_NAME || 'test-repo';
const branch = process.env.BRANCH || 'main';

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.CodeStarConnectionsSourceAction({
  actionName: 'CodeStarConnectionsSourceAction',
  output: sourceOutput,
  connectionArn,
  owner,
  repo,
  branch,
  codeBuildCloneOutput: true,
});

const project = new codebuild.PipelineProject(stack, 'MyBuildProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: { build: { commands: ['echo "Full Clone source checked out by the override role"'] } },
  }),
});

const buildRole = new iam.Role(stack, 'BuildRole', {
  assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
});

const buildAction = new cpactions.CodeBuildAction({
  actionName: 'CodeBuildFullCloneAction',
  project,
  input: sourceOutput,
  serviceRoleOverride: buildRole,
});

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Build',
      actions: [buildAction],
    },
  ],
});

pipeline.artifactBucket.grantRead(buildRole);

const logGroupArn = stack.formatArn({
  service: 'logs',
  resource: 'log-group',
  arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
  resourceName: `/aws/codebuild/${project.projectName}`,
});
buildRole.addToPolicy(new iam.PolicyStatement({
  actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
  resources: [logGroupArn, `${logGroupArn}:*`],
}));

buildRole.addToPolicy(new iam.PolicyStatement({
  actions: [
    'codebuild:CreateReportGroup',
    'codebuild:CreateReport',
    'codebuild:UpdateReport',
    'codebuild:BatchPutTestCases',
    'codebuild:BatchPutCodeCoverages',
  ],
  resources: [stack.formatArn({ service: 'codebuild', resource: 'report-group', resourceName: `${project.projectName}-*` })],
}));

const connectionService = cdk.Arn.split(connectionArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).service;
buildRole.addToPolicy(new iam.PolicyStatement({
  actions: [`${connectionService}:UseConnection`],
  resources: [connectionArn],
  conditions: { StringEquals: { [`${connectionService}:FullRepositoryId`]: `${owner}/${repo}` } },
}));

new IntegTest(app, 'codebuild-service-role-override-test', {
  testCases: [stack],
  diffAssets: true,
});
