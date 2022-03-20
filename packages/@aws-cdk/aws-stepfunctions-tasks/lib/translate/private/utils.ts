import * as sfn from '@aws-cdk/aws-stepfunctions';
import { integrationResourceArn } from '../../private/task-utils';

export enum TranslateMethod {
  TRANSLATE_TEXT = 'translateText',
}

export function getTranslateResourceArn(method: TranslateMethod) {
  return integrationResourceArn('aws-sdk:translate', `${method}`, sfn.IntegrationPattern.REQUEST_RESPONSE);
}