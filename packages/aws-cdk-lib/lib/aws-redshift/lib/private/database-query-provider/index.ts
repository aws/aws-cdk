/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { HandlerName } from './handler-name';
import { handler as managePrivileges } from './privileges';
import { handler as manageTable } from './table';
import { handler as manageUser } from './user';

const HANDLERS: { [key in HandlerName]: ((props: any, event: AWSLambda.CloudFormationCustomResourceEvent) => Promise<any>) } = {
  [HandlerName.Table]: manageTable,
  [HandlerName.User]: manageUser,
  [HandlerName.UserTablePrivileges]: managePrivileges,
};

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const subHandler = HANDLERS[event.ResourceProperties.handler as HandlerName];
  if (!subHandler) {
    throw new Error(`Requested handler ${event.ResourceProperties.handler} is not in supported set: ${JSON.stringify(Object.keys(HANDLERS))}`);
  }
  return subHandler(event.ResourceProperties, event);
}
