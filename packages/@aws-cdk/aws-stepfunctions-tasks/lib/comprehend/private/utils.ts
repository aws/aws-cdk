import * as sfn from '@aws-cdk/aws-stepfunctions';
import { integrationResourceArn } from '../../private/task-utils';

export enum ComprehendMethod {
  BATCHDETECTDOMINANTLANGUAGE = 'batchDetectDominantLanguage',
  BATCHDETECTENTITIES = 'batchDetectEntities',
  BATCHDETECTKEYPHRASES = 'batchDetectKeyPhrases',
  BATCHDETECTSENTIMENT = 'batchDetectSentiment',
  BATCHDETECTSYNTAX = 'batchDetectSyntax',

  DETECTDOMINANTLANGUAGE = 'detectDominantLanguage',
}

export function getComprehendResourceArn(method: ComprehendMethod) {
  return integrationResourceArn('comprehend', `${method}`, sfn.IntegrationPattern.REQUEST_RESPONSE);
}