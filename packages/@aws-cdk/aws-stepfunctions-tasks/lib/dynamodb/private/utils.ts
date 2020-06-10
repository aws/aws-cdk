import * as sfn from '@aws-cdk/aws-stepfunctions';
import { integrationResourceArn } from '../../private/task-utils';
import { DynamoAttribute, DynamoAttributeValueMap } from '../shared-types';

export enum DynamoMethod {
  GET = 'Get',
  PUT = 'Put',
  DELETE = 'Delete',
  UPDATE = 'Update',
}

export function getDynamoResourceArn(method: DynamoMethod) {
  return integrationResourceArn('dynamodb', `${method.toLowerCase()}Item`, sfn.IntegrationPattern.REQUEST_RESPONSE);
}

export function configurePrimaryKey(partitionKey: DynamoAttribute, sortKey?: DynamoAttribute) {
  const key = {
    [partitionKey.name]: partitionKey.value.toObject(),
  };

  if (sortKey) {
    key[sortKey.name] = sortKey.value.toObject();
  }

  return key;
}

export function transformAttributeValueMap(attrMap?: DynamoAttributeValueMap) {
  const transformedValue: any = {};
  for (const key in attrMap) {
    if (key) {
      transformedValue[key] = attrMap[key].toObject();
    }
  }
  return attrMap ? transformedValue : undefined;
}
