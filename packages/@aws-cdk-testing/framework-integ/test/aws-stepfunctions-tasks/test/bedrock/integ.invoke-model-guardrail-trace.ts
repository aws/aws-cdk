import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { BedrockInvokeModel, Guardrail } from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> : should return status as SUCCEEDED
 * This integ test does not actually verify a Step Functions execution, as not all AWS accounts have Bedrock model access.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-bedrock-invoke-model-guardrail-trace-integ');

const model = bedrock.FoundationModel.fromFoundationModelId(stack, 'Model', bedrock.FoundationModelIdentifier.AMAZON_TITAN_TEXT_G1_EXPRESS_V1);

const guardrail = new bedrock.CfnGuardrail(stack, 'Guardrail', {
  name: 'guardrail-invoke-model-trace-integ',
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

// Create Version 1
new bedrock.CfnGuardrailVersion(stack, 'GuardrailVersion', {
  guardrailIdentifier: guardrail.attrGuardrailId,
});

const prompt1 = new BedrockInvokeModel(stack, 'Prompt1', {
  model,
  body: sfn.TaskInput.fromObject(
    {
      inputText: 'tell me a story',
      textGenerationConfig: {
        maxTokenCount: 100,
        temperature: 1,
      },
    },
  ),
  guardrail: Guardrail.enableDraft(guardrail.attrGuardrailId),
  traceEnabled: true,
  resultSelector: {
    output: sfn.JsonPath.stringAt('$.Body.results[0].outputText'),
  },
  resultPath: '$',
});

const prompt2 = new BedrockInvokeModel(stack, 'Prompt2', {
  model,
  body: sfn.TaskInput.fromObject(
    {
      inputText: 'tell me a story',
      textGenerationConfig: {
        maxTokenCount: 100,
        temperature: 1,
      },
    },
  ),
  guardrail: Guardrail.enable(guardrail.attrGuardrailArn, 1),
  traceEnabled: true,
  resultSelector: {
    output: sfn.JsonPath.stringAt('$.Body.results[0].outputText'),
  },
  resultPath: '$',
});

const chain = sfn.Chain.start(prompt1).next(prompt2);

new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(chain),
  timeout: cdk.Duration.seconds(120),
});

new IntegTest(app, 'InvokeModel', {
  testCases: [stack],
});

app.synth();
