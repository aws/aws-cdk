import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnQueryDefinition } from '.';


/**
 * Properties for a QueryDefinition
 */
export interface QueryDefinitionProps {
  /**
  * Name of the query definition.
  */
  readonly queryDefinitionName: string;

  /**
   * The query string to use for this query definition.
   */
  readonly queryString: string;

  /**
  * Specify certain log groups for the query definition.
  *
  * @default - Undefine log groups will query all log groups.
  */
  readonly logGroupNames?: string[];
}

/**
 * Define a query definition for CloudWatch Logs Insights
 */
export class QueryDefinition extends Resource {
  /**
   * The ID of the query definition.
   *
   * @attribute
   */
  public readonly queryDefinitionId: string;

  constructor(scope: Construct, id: string, props: QueryDefinitionProps) {
    super(scope, id, {
      physicalName: props.queryDefinitionName,
    });

    const resource = new CfnQueryDefinition(this, 'Resource', {
      name: props.queryDefinitionName,
      queryString: props.queryString,
      logGroupNames: props.logGroupNames,
    });

    this.queryDefinitionId = resource.attrQueryDefinitionId;
  }
}