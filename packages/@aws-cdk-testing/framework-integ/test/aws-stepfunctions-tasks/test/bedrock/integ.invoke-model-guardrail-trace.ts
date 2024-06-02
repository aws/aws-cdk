import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { BedrockInvokeModel, Trace } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-bedrock-invoke-model-guardrail-trace-integ');

const model = bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.AMAZON_TITAN_TEXT_G1_EXPRESS_V1);

const guardrail = new bedrock.CfnGuardrail(stack, 'Guardrail', {
  name: 'MyGuardrail',
  blockedInputMessaging: 'blocked input message by guardrail',
  blockedOutputsMessaging: 'blocked output message by guardrail',
  contentPolicyConfig: {
    filtersConfig: [{
      inputStrength: 'LOW',
      outputStrength: 'NONE',
      type: 'PROMPT_ATTACK',
    }],
  },
  wordPolicyConfig: {
    wordsConfig: [{
      text: 'attack',
    }],
  },
});

const prompt = new BedrockInvokeModel(stack, 'Prompt', {
  model,
  body: sfn.TaskInput.fromObject(
    {
      inputText: 'test attack',
      textGenerationConfig: {
        maxTokenCount: 100,
        temperature: 1,
      },
    },
  ),
  guardrailConfiguration: {
    guardrailIdentifier: guardrail.attrGuardrailId,
    guardrailVersion: guardrail.attrVersion,
  },
  trace: Trace.ENABLED,
  resultSelector: {
    output: sfn.JsonPath.stringAt('$.Body.results[0].outputText'),
  },
  resultPath: '$',
});

const chain = sfn.Chain.start(prompt);

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(chain),
  timeout: cdk.Duration.seconds(30),
});

const testCase = new IntegTest(app, 'InvokeModel', {
  testCases: [stack],
});

testCase.assertions
  .awsApiCall('StepFunctions', 'describeStateMachine', {
    stateMachineArn: stateMachine.stateMachineArn,
  })
  .expect(ExpectedResult.objectLike({ status: 'ACTIVE' }))
  .waitForAssertions({
    interval: cdk.Duration.seconds(10),
    totalTimeout: cdk.Duration.minutes(5),
  });

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});
start.next(describe);

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(5),
});

app.synth();
