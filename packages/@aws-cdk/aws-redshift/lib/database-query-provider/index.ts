/* eslint-disable-next-line import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { handler as createTable } from './create-table';
import { handler as createUser } from './create-user';
import { handler as grantPrivileges } from './grant-privileges';
import { getResourceProperty } from './util';

const HANDLERS: { [key: string]: ((event: AWSLambda.CloudFormationCustomResourceEvent) => Promise<any>) } = {
  'create-table': createTable,
  'create-user': createUser,
  'grant-privileges': grantPrivileges,
};

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const subHandler = HANDLERS[getResourceProperty('handler', event.ResourceProperties)];
  if (!subHandler) {
    throw new Error(`Requested ${process.env.handler} handler is not in supported set: ${JSON.stringify(Object.keys(HANDLERS))}`);
  }
  return subHandler(event);
}
