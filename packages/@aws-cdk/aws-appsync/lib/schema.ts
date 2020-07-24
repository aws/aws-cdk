import { CfnGraphQLSchema } from './appsync.generated';
import { Construct } from '@aws-cdk/core';
import { SchemaType } from './schema-util';

export interface SchemaProps {
  custom?: string;
}

export class Schema extends Construct {

  public readonly custom?: string;

  constructor(scope: Construct, id: string, props?: SchemaProps) {
    super(scope, id);
    this.custom = props?.custom;
  }
  
}