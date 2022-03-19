import * as sfn from '@aws-cdk/aws-stepfunctions';
import { integrationResourceArn } from '../../private/task-utils';

export enum ComprehendMethod {
  BATCH_DETECT_DOMINANT_LANGUAGE = 'batchDetectDominantLanguage',
  BATCH_DETECT_ENTITIES = 'batchDetectEntities',
  BATCH_DETECT_KEY_PHRASES = 'batchDetectKeyPhrases',
  BATCH_DETECT_SENTIMENT = 'batchDetectSentiment',
  BATCH_DETECT_SYNTAX = 'batchDetectSyntax',
  CLASSIFY_DOCUMENT = 'classifyDocument',
  CONTAINS_PII_ENTITIES = 'containsPiiEntities',
  CREATE_DOCUMENT_CLASSIFIER = 'createDocumentClassifier',

  DETECT_DOMINANT_LANGUAGE = 'detectDominantLanguage',
  DETECT_ENTITIES = 'detectEntities',
}

export function getComprehendResourceArn(method: ComprehendMethod) {
  return integrationResourceArn('aws-sdk:comprehend', `${method}`, sfn.IntegrationPattern.REQUEST_RESPONSE);
}