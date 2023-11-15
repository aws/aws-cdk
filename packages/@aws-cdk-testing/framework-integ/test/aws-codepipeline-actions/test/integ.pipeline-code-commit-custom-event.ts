import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { CODECOMMIT_SOURCE_ACTION_DEFAULT_BRANCH_NAME } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Code, Runtime, Function } from 'aws-cdk-lib/aws-lambda';

const defaultBranchFeatureFlag = { [CODECOMMIT_SOURCE_ACTION_DEFAULT_BRANCH_NAME]: true };
const app = new cdk.App({ postCliContext: defaultBranchFeatureFlag });

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit-custom-event');

const repo = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});

const eventPattern
      = {
        'detail-type': ['CodeCommit Repository State Change'],
        'resources': ['foo'],
        'source': ['aws.codecommit'],
        'detail': {
          referenceType: ['branch'],
          event: ['referenceCreated', 'referenceUpdated'],
          referenceName: ['master'],
        },
      };

new codepipeline.Pipeline(stack, 'Pipeline', {
  stages: [
    {
      stageName: 'source',
      actions: [
        new cpactions.CodeCommitSourceAction({
          actionName: 'source',
          repository: repo,
          output: new codepipeline.Artifact('SourceArtifact'),
          customEventRule: {
            eventPattern,
            target: new LambdaFunction(
              new Function(stack, 'TestFunction', {
                code: Code.fromInline('foo'),
                handler: 'index.handler',
                runtime: Runtime.NODEJS_LATEST,
              }),
            ),
          },
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
