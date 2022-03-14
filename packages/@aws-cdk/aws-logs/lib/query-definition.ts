import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnQueryDefinition } from '.';


/**
 * Properties for a QueryString
 */
export interface QueryStringProps {
  /**
  * Retrieves the specified fields from log events for display.
  *
  * @default no fields in QueryString
  */
  readonly fields?: string;

  /**
  * Extracts data from a log field and creates one or more ephemeral fields that you can process further in the query.
  *
  * @default no parse in QueryString
  */
  readonly parse?: string;

  /**
  * Filters the results of a query that's based on one or more conditions.
  *
  * @default no filter in QueryString
  */
  readonly filter?: string;

  /**
  * Uses log field values to calculate aggregate statistics.
  *
  * @default no stats in QueryString
  */
  readonly stats?: string;

  /**
  * Sorts the retrieved log events.
  *
  * @default no sort in QueryString
  */
  readonly sort?: string;

  /**
  * Specifies the number of log events returned by the query.
  *
  * @default no limit in QueryString
  */
  readonly limit?: Number;

  /**
  * Specifies which fields to display in the query results.
  *
  * @default no display in QueryString
  */
  readonly display?: string;
}

/**
 * Define a QueryString
 */
export class QueryString {
  /**
  * Retrieves the specified fields from log events for display.
  */
  private fields?: string;

  /**
  * Extracts data from a log field and creates one or more ephemeral fields that you can process further in the query.
  */
  private parse?: string;

  /**
  * Filters the results of a query that's based on one or more conditions.
  */
  private filter?: string;

  /**
  * Uses log field values to calculate aggregate statistics.
  */
  private stats?: string;

  /**
  * Sorts the retrieved log events.
  */
  private sort?: string;

  /**
  * Specifies the number of log events returned by the query.
  */
  private limit?: Number;

  /**
  * Specifies which fields to display in the query results.
  */
  private display?: string;

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
  * Adds fields to QueryString of the query definition.
  */
  public addFields(fields: string) {
    this.fields = fields;
  }

  /**
  * Adds parse to QueryString of the query definition.
  */
  public addParse(parse: string) {
    this.parse = parse;
  }

  /**
  * Adds filter to QueryString of the query definition.
  */
  public addFilter(filter: string) {
    this.filter = filter;
  }

  /**
  * Adds stats to QueryString of the query definition.
  */
  public addStats(stats: string) {
    this.stats = stats;
  }

  /**
  * Adds sort to QueryString of the query definition.
  */
  public addSort(sort: string) {
    this.sort = sort;
  }

  /**
  * Adds limit to QueryString of the query definition.
  */
  public addLimit(limit: Number) {
    this.limit = limit;
  }

  /**
  * Adds display to QueryString of the query definition.
  */
  public addDisplay(display: string) {
    this.display = display;
  }

  /**
  * String representation of this QueryString.
  */
  public toString(): string {
    let queryStringMap = {
      fields: this.fields,
      parse: this.parse,
      filter: this.filter,
      stats: this.stats,
      sort: this.sort,
      limit: this.limit,
      display: this.display,
    };

    return noUndef(queryStringMap).join(' | ');
  }
}

function noUndef(x: any): any {
  const ret: any = [];
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
  * @default - No log groups.
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
      queryString: props.queryString.toString(),
      logGroupNames: props.logGroupNames,
    });

    this.queryDefinitionId = resource.attrQueryDefinitionId;
  }
}
