import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnQueryDefinition } from '.';
import { ILogGroup } from './log-group';


/**
 * Properties for a QueryString
 */
export interface QueryStringProps {
  /**
  * Retrieves the specified fields from log events for display.
  *
  * @default - no fields in QueryString
  */
  readonly fields?: string[];

  /**
  * Extracts data from a log field and creates one or more ephemeral fields that you can process further in the query.
  *
  * @default - no parse in QueryString
  */
  readonly parse?: string;

  /**
  * Filters the results of a query that's based on one or more conditions.
  *
  * @default - no filter in QueryString
  */
  readonly filter?: string;

  /**
  * Uses log field values to calculate aggregate statistics.
  *
  * @default - no stats in QueryString
  */
  readonly stats?: string;

  /**
  * Sorts the retrieved log events.
  *
  * @default - no sort in QueryString
  */
  readonly sort?: string;

  /**
  * Specifies the number of log events returned by the query.
  *
  * @default - no limit in QueryString
  */
  readonly limit?: Number;

  /**
  * Specifies which fields to display in the query results.
  *
  * @default - no display in QueryString
  */
  readonly display?: string;
}

interface QueryStringMap {
  readonly fields?: string,
  readonly parse?: string,
  readonly filter?: string,
  readonly stats?: string,
  readonly sort?: string,
  readonly limit?: Number,
  readonly display?: string,
}

/**
 * Define a QueryString
 */
export class QueryString {
  private readonly fields?: string[];
  private readonly parse?: string;
  private readonly filter?: string;
  private readonly stats?: string;
  private readonly sort?: string;
  private readonly limit?: Number;
  private readonly display?: string;

  constructor(props: QueryStringProps = {}) {
    this.fields = props.fields;
    this.parse = props.parse;
    this.filter = props.filter;
    this.stats = props.stats;
    this.sort = props.sort;
    this.limit = props.limit;
    this.display = props.display;
  }

  /**
  * String representation of this QueryString.
  */
  public toString(): string {
    return noUndef({
      fields: this.fields !== undefined ? this.fields.join(', ') : this.fields,
      parse: this.parse,
      filter: this.filter,
      stats: this.stats,
      sort: this.sort,
      limit: this.limit,
      display: this.display,
    }).join('\n| ');
  }
}

function noUndef(x: QueryStringMap): string[] {
  const ret: string[] = [];
  for (const [key, value] of Object.entries(x)) {
    if (value !== undefined) {
      ret.push(`${key} ${value}`);
    }
  }
  return ret;
}

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
  readonly queryString: QueryString;

  /**
  * Specify certain log groups for the query definition.
  *
  * @default - no specified log groups
  */
  readonly logGroups?: ILogGroup[];
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

    const queryDefinition = new CfnQueryDefinition(this, 'Resource', {
      name: props.queryDefinitionName,
      queryString: props.queryString.toString(),
      logGroupNames: typeof props.logGroups === 'undefined' ? [] : props.logGroups.flatMap(logGroup => logGroup.logGroupName),
    });

    this.queryDefinitionId = queryDefinition.attrQueryDefinitionId;
  }
}
