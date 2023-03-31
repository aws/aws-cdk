import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as STS from 'aws-sdk/clients/sts';
import * as codebuild from '../lib';

void (async () => {

  const stsClient = new STS({ apiVersion: '2011-06-15' });
  let accountId: string | undefined = undefined;
  const resp = stsClient.getCallerIdentity().promise();
  await resp.then( (data) => { accountId = data.Account; }).catch( (err) => { return Error(`Error had occurred when executing the STS API: "GetCallerIdentity". Credentials may not be configured. Actual error message: ${err}`); });

  const app = new cdk.App();

  /**
   * Resource Policies will appear under an agnostic stack + role that isn't from the "same" stack (we can trick the stack by hardcoding in an Accoun ID instead).
   * Don't define an env config nor directly reference an IAM Role for it's ARN.
   */
  const stack = new cdk.Stack(app, 'aws-cdk-codebuild-suppress-resource-policy');

  // Role must exist so that CodeBuild can assume it during stack events
  const fakeRole = new iam.Role(stack, 'FakeImportedRole', { assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com') });
  const importedRole = iam.Role.fromRoleArn(stack, 'SomeRole', `arn:aws:iam::${accountId}:role/${fakeRole.roleName}`);
  new codebuild.PipelineProject(stack, 'BuildProjectRemovedResourcePolicy', {
    projectName: 'build-project-removed-resource-policy',
    role: importedRole,
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        build: {
          commands: ['echo "Hello, CodeBuild!"'],
        },
      },
    }),
    logging: {
      cloudWatch: {
        logGroup: new logs.LogGroup(stack, 'my-log-group-label', {
          logGroupName: 'my-log-group-name',
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
        suppressResourcePolicy: true,
      },
    },
  });

  new codebuild.PipelineProject(stack, 'BuildProjectWithResourcePolicy', {
    projectName: 'build-project-with-resource-policy',
    role: importedRole,
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        build: {
          commands: ['echo "Hello, CodeBuild!"'],
        },
      },
    }),
    logging: {
      cloudWatch: {
        logGroup: new logs.LogGroup(stack, 'my-log-group-label2', {
          logGroupName: 'my-log-group-name2',
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
        suppressResourcePolicy: false,
      },
    },
  });

  new IntegTest(app, 'AssetBuildSpecTest', { testCases: [stack] });

  app.synth();

})();