/// !cdk-integ StackOutputPipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
import { IStage } from 'aws-cdk-lib/aws-codepipeline';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, Stack, StackProps, CfnOutput, Stage, StageProps, RemovalPolicy } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { ICodePipelineActionFactory, Step } from 'aws-cdk-lib/pipelines';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class CustomStep extends Step implements ICodePipelineActionFactory {
  constructor(private readonly stackOutput: CfnOutput) {
    super('CustomStep');
  }

  public produceAction(stage: IStage, options: pipelines.ProduceActionOptions): pipelines.CodePipelineActionFactoryResult {
    const [outputRef] = this.consumedStackOutputs;

    const handler = new lambda.Function(options.scope, 'CustomFunction', {
      runtime: STANDARD_NODEJS_RUNTIME,
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Hello world.')
        };
      `),
      handler: 'index.handler',
    });

    stage.addAction(
      new cpactions.LambdaInvokeAction({
        actionName: options.actionName,
        runOrder: options.runOrder,
        userParameters: { stackOutput: options.stackOutputsMap.toCodePipeline(outputRef) },
        lambda: handler,
      }));
    return { runOrdersConsumed: 1 };
  }

  public get consumedStackOutputs(): pipelines.StackOutputReference[] {
    return [pipelines.StackOutputReference.fromCfnOutput(this.stackOutput)];
  }
}

class AppStage extends Stage {
  public readonly output: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'Stack');
    this.output = new CfnOutput(stack, 'OutputVariable', { value: 'Hello' });
  }
}

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const repository = new ecr.Repository(this, 'Source', { removalPolicy: RemovalPolicy.DESTROY });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.ecr(repository),
        commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
      }),
      selfMutation: false,
    });
    const stage = new AppStage(this, 'AppStage');

    const postStep = new CustomStep(stage.output);

    // WHEN

    pipeline.addStage(stage, { post: [postStep] });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/core:newStyleStackSynthesis': '1',
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': true,
  },
});

const stack = new PipelineStack(app, 'StackOutputPipelineStack');

new integ.IntegTest(app, 'PipelineWithCustomStepStackOutputTest', {
  testCases: [stack],
});

app.synth();
