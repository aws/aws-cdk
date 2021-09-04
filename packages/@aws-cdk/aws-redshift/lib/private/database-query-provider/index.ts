/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { handler as manageTable } from './table';
import { handler as manageUser } from './user';
import { handler as managePrivileges } from './privileges';

const HANDLERS: { [key: string]: ((props: any, event: AWSLambda.CloudFormationCustomResourceEvent) => Promise<any>) } = {
  'table': manageTable,
  'user': manageUser,
  'user-table-privileges': managePrivileges,
};

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const subHandler = HANDLERS[event.ResourceProperties.handler];
  if (!subHandler) {
    throw new Error(`Requested ${process.env.handler} handler is not in supported set: ${JSON.stringify(Object.keys(HANDLERS))}`);
  }
  return subHandler(event.ResourceProperties, event);
}
