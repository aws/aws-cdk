import * as sfn from '@aws-cdk/aws-stepfunctions';
import { integrationResourceArn } from '../../private/task-utils';
import { DynamoAttributeValue } from '../shared-types';

export enum DynamoMethod {
  GET = 'Get',
  PUT = 'Put',
  DELETE = 'Delete',
  UPDATE = 'Update',
}

export function getDynamoResourceArn(method: DynamoMethod) {
  return integrationResourceArn('dynamodb', `${method.toLowerCase()}Item`, sfn.IntegrationPattern.REQUEST_RESPONSE);
}

export function transformAttributeValueMap(attrMap?: { [key: string]: DynamoAttributeValue }) {
  const transformedValue: any = {};
  for (const key in attrMap) {
    if (key) {
      transformedValue[key] = attrMap[key].toObject();
    }
  }
  return attrMap ? transformedValue : undefined;
}

export function validateJsonPath(value: string) {
  if (!value.startsWith('$')) {
    throw new Error("Data JSON path values must either be exactly equal to '$' or start with '$.'");
  }
}
