import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';

const app = new App();
const stack = new Stack(app, 'PipelineArtifactBucketRemovalStack', {
  env: { account: '123456789012', region: 'us-east-1' },
});

new pipelines.CodePipeline(stack, 'Pipeline', {
  artifactBucketRemovalPolicy: RemovalPolicy.DESTROY,
  artifactBucketAutoDeleteObjects: true,
  synth: new pipelines.ShellStep('Synth', {
    input: pipelines.CodePipelineSource.connection('owner/repo', 'main', {
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/00000000-0000-0000-0000-000000000000',
    }),
    commands: ['npm ci', 'npx cdk synth'],
  }),
});

new IntegTest(app, 'PipelineArtifactBucketRemovalInteg', {
  testCases: [stack],
});
