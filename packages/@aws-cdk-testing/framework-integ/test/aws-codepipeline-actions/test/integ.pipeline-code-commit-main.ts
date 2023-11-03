import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { CODECOMMIT_SOURCE_ACTION_DEFAULT_BRANCH_NAME } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const defaultBranchFeatureFlag = { [CODECOMMIT_SOURCE_ACTION_DEFAULT_BRANCH_NAME]: true };
const app = new cdk.App({ postCliContext: defaultBranchFeatureFlag });

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-main');

const repo = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});

new codepipeline.Pipeline(stack, 'Pipeline', {
  stages: [
    {
      stageName: 'source',
      actions: [
        new cpactions.CodeCommitSourceAction({
          actionName: 'source',
          repository: repo,
          output: new codepipeline.Artifact('SourceArtifact'),
        }),
      ],
    },
    {
      stageName: 'build',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'manual' }),
      ],
    },
  ],
});

new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});
