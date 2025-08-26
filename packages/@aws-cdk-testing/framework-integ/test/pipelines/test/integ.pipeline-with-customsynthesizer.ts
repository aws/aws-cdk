import { App, Stack, StackProps, DefaultStackSynthesizer, Stage, StageProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Notes on how to run this integ test
 * Replace 123456789012 with your own account number
 * Your account should be bootstrapped for us-east-1 with a custom qualifier 'dev'
 * cdk bootstrap aws://123456789012/us-east-1 --qualifier dev --toolkit-stack-name CDKToolkitDev
 **/

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'assetsBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const pipeline = new pipelines.CodePipeline(
      this,
      'Pipeline', {
        synth: new pipelines.ShellStep('Synth', {
          input: pipelines.CodePipelineSource.s3(
            bucket,
            'cdk-sample.zip',
          ),
          commands: ['npm ci', 'npm run build', 'npx cdk synth'],
        }),
        crossAccountKeys: true,
      });

    const stagingStage = new DeploymentStage(
      this, 'Staging', {
        environmentAbbreviation: 'dev',
        region: 'us-east-1',
      });
    pipeline.addStage(stagingStage);

    const productionStage = new DeploymentStage(
      this, 'Production', {
        environmentAbbreviation: 'prd',
        region: 'us-east-1',
      });
    pipeline.addStage(productionStage);
  }
}

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new lambda.Function(this, 'LambdaFN', {
      runtime: lambda.Runtime.PYTHON_3_10,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'testhelpers', 'assets')),
    });
  }
}

export interface DeploymentStageProps extends StageProps {
  environmentAbbreviation: string;
  region: string;
}

export class DeploymentStage extends Stage {
  constructor(scope: Construct, id: string, props: DeploymentStageProps) {
    super(scope, id, props);

    var synth = new DefaultStackSynthesizer();
    if (props.environmentAbbreviation == 'dev') {
      synth = new DefaultStackSynthesizer({
        qualifier: 'dev',
      });
    }
    new LambdaStack(
      this, `${props.environmentAbbreviation}-lambda-stack`, {
        env: {
          region: props.region,
        },
        synthesizer: synth,
      },
    );
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': true,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});
const env = { region: 'us-east-1' };
const stack = new PipelineStack(app, 'pipeline-asset-stack', { env });
new IntegTest(app, 'PipelineAssetsTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
