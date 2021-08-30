/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { handler as createTable } from './create-table';
import { handler as createUser } from './create-user';
import { handler as grantUserTablePrivileges } from './grant-user-table-privileges';

const HANDLERS: { [key: string]: ((props: any, event: AWSLambda.CloudFormationCustomResourceEvent) => Promise<any>) } = {
  'create-table': createTable,
  'create-user': createUser,
  'grant-user-table-privileges': grantUserTablePrivileges,
};

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const subHandler = HANDLERS[event.ResourceProperties.handler];
  if (!subHandler) {
    throw new Error(`Requested ${process.env.handler} handler is not in supported set: ${JSON.stringify(Object.keys(HANDLERS))}`);
  }
  return subHandler(event.ResourceProperties, event);
}
