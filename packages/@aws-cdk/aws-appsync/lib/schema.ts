import { CfnGraphQLSchema } from './appsync.generated';
import { Construct } from '@aws-cdk/core';
import { SchemaType } from './schema-util';

export interface SchemaProps {

}

export class Schema extends Construct {
  constructor(scope: Construct, id: string, props: SchemaProps) {
    super(scope, id);

  }
}