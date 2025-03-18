import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { CODECOMMIT_SOURCE_ACTION_DEFAULT_BRANCH_NAME, CODEPIPELINE_DEFAULT_PIPELINE_TYPE_TO_V2, PIPELINE_REDUCE_STAGE_ROLE_TRUST_SCOPE } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const defaultFeatureFlag = {
  [CODECOMMIT_SOURCE_ACTION_DEFAULT_BRANCH_NAME]: true,
  [CODEPIPELINE_DEFAULT_PIPELINE_TYPE_TO_V2]: false,
  [PIPELINE_REDUCE_STAGE_ROLE_TRUST_SCOPE]: false,
};
const app = new cdk.App({ postCliContext: defaultFeatureFlag });

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-main');

const repo = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});

new codepipeline.Pipeline(stack, 'Pipeline', {
  crossAccountKeys: true,
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
