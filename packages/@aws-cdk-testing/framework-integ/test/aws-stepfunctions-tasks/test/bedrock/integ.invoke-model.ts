import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { BedrockInvokeModel } from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 * This integ test does not actually verify a Step Functions execution, as not all AWS accounts have Bedrock model access.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-bedrock-invoke-model-integ');

const model = bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.AMAZON_TITAN_TEXT_G1_EXPRESS_V1);

const prompt1 = new BedrockInvokeModel(stack, 'Prompt1', {
  model,
  body: sfn.TaskInput.fromObject(
    {
      inputText: 'Generate a list of five first names.',
      textGenerationConfig: {
        maxTokenCount: 100,
        temperature: 1,
      },
    },
  ),
  resultSelector: {
    names: sfn.JsonPath.stringAt('$.Body.results[0].outputText'),
  },
  resultPath: '$',
});

const prompt2 = new BedrockInvokeModel(stack, 'Prompt2', {
  model,
  body: sfn.TaskInput.fromObject(
    {
      inputText: sfn.JsonPath.format(
        'Alphabetize this list of first names:\n{}',
        sfn.JsonPath.stringAt('$.names'),
      ),
      textGenerationConfig: {
        maxTokenCount: 100,
        temperature: 1,
      },
    },
  ),
  resultSelector: {
    names: sfn.JsonPath.stringAt('$.Body.results[0].outputText'),
  },
  resultPath: '$',
});

const chain = sfn.Chain.start(prompt1).next(prompt2);

new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(chain),
  timeout: cdk.Duration.seconds(30),
});

new IntegTest(app, 'InvokeModel', {
  testCases: [stack],
});

app.synth();
