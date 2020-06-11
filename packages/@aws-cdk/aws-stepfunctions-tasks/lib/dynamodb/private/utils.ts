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
      transformedValue[key] = toObject(attrMap[key]);
    }
  }
  return attrMap ? transformedValue : undefined;
}

function toObject(value: DynamoAttributeValue): any {
  const attrCount = Object.keys(value).length;
  if (attrCount !== 1) {
    throw new Error(`exactly 1 attribute value must be supplied. received ${attrCount} attributes`);
  }

  if (value.s) {
    return { S: value.s };
  }

  if (value.n) {
    return { N: value.n };
  }

  if (value.b) {
    return { B: value.b };
  }

  if (value.ss) {
    return { SS: value.ss };
  }

  if (value.ns) {
    return { NS: value.ns };
  }

  if (value.bs) {
    return { BS: value.bs };
  }

  if (value.m) {
    return { M: transformAttributeValueMap(value.m) };
  }

  if (value.l) {
    return { L: value.l.map((val) => toObject(val)) };
  }

  if (value.nullValue) {
    return { NULL: value.nullValue };
  }

  if (value.booleanValue) {
    return { BOOL: value.booleanValue };
  }
}
