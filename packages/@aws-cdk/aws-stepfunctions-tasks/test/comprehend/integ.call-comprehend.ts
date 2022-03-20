import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

/**
 *
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * *
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'output': should return the number 42
 */
class CallComprehendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const batchDetectDominantLanguageTask = new tasks.ComprehendBatchDetectDominantLanguage(this, 'ComprehendBatchDetectDominantLanguage', {
      textList: [
        'detecting dominant language from this phrase',
        'detecting dominant language from this phrase again',
      ],
    });

    const batchDetectEntitiesTask = new tasks.ComprehendBatchDetectEntities(this, 'ComprehendBatchDetectEntities', {
      languageCode: 'en',
      textList: [
        'detecting entities from this phrase',
        'detecting entities from this phrase again',
      ],
    });

    const batchDetectKeyPhrasesTask = new tasks.ComprehendBatchDetectKeyPhrases(this, 'ComprehendBatchDetectKeyPhrases', {
      languageCode: 'en',
      textList: [
        'detecting key phrases from this phrase',
        'detecting key phrases from this phrase again',
      ],
    });

    const batchDetectSentimentTask = new tasks.ComprehendBatchDetectSentiment(this, 'ComprehendBatchDetectSentiment', {
      languageCode: 'en',
      textList: [
        'detecting sentiment from this phrase',
        'detecting sentiment from this phrase again',
      ],
    });

    const batchDetectSyntaxTask = new tasks.ComprehendBatchDetectSyntax(this, 'ComprehendBatchDetectSyntax', {
      languageCode: 'en',
      textList: [
        'detecting syntax from this phrase',
        'detecting syntax from this phrase again',
      ],
    });

    const containsPiiEntitiesTask = new tasks.ComprehendContainsPiiEntities(this, 'ComprehendContainsPiiEntities', {
      languageCode: 'en',
      text: 'verify pii entities from this phrase',
    });

    const detectDominantLanguageTask = new tasks.ComprehendDetectDominantLanguage(this, 'ComprehendDetectDominantLanguage', {
      text: 'detecting dominant language from this phrase',
    });

    const detectEntitiesTask = new tasks.ComprehendDetectEntities(this, 'ComprehendDetectEntities', {
      languageCode: 'en',
      text: 'detecting entities from this phrase',
    });

    const detectKeyPhrasesTask = new tasks.ComprehendDetectKeyPhrases(this, 'ComprehendDetectKeyPhrases', {
      languageCode: 'en',
      text: 'detecting key phrases from this phrase',
    });

    const detectSentimentTask = new tasks.ComprehendDetectSentiment(this, 'ComprehendDetectSentiment', {
      languageCode: 'en',
      text: 'detecting sentiment from this phrase',
    });

    const detectSyntaxTask = new tasks.ComprehendDetectSyntax(this, 'ComprehendDetectSyntax', {
      languageCode: 'en',
      text: 'detecting syntax from this phrase',
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ bar: 'SomeValue' }),
    })
      .next(batchDetectDominantLanguageTask)
      .next(batchDetectEntitiesTask)
      .next(batchDetectKeyPhrasesTask)
      .next(batchDetectSentimentTask)
      .next(batchDetectSyntaxTask)
      .next(containsPiiEntitiesTask)
      .next(detectDominantLanguageTask)
      .next(detectEntitiesTask)
      .next(detectKeyPhrasesTask)
      .next(detectSentimentTask)
      .next(detectSyntaxTask);

    const sm = new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });

    new cdk.CfnOutput(this, 'stateMachineArn', {
      value: sm.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new CallComprehendStack(app, 'aws-stepfunctions-tasks-batch-detect-syntax-integ');
app.synth();