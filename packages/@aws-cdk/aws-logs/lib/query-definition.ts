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
  * One or more statements for parsing data from a log field and creating ephemeral fields that can
  * be processed further in the query. Each statement provided generates a separate parse line in
  * the query string.
  *
  * @default - no parse in QueryString
  */
  readonly parse?: string | string[];

  /**
  * One or more statements for filtering the results of a query based on a boolean expression. Each
  * statement provided generates a separate filter line in the query string.
  *
  * @default - no filter in QueryString
  */
  readonly filter?: string | string[];

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

/**
 * Define a QueryString
 */
export class QueryString {
  private readonly fields?: string[];
  private readonly parse?: string | string[];
  private readonly filter?: string | string[];
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
    return [
      ...this.buildQueryLines('fields', this.fields?.join(', ')),
      ...this.buildQueryLines('parse', this.parse),
      ...this.buildQueryLines('filter', this.filter),
      ...this.buildQueryLines('stats', this.stats),
      ...this.buildQueryLines('sort', this.sort),
      ...this.buildQueryLines('limit', this.limit?.toString()),
      ...this.buildQueryLines('display', this.display),
    ].filter(
      (queryLine) => queryLine !== undefined && queryLine.length > 0,
    ).join('\n| ');
  }

  /**
   * Build an array of query lines given a command and statement(s).
   *
   * @param command a query command
   * @param statements one or more query statements for the specified command, or undefined
   * @returns an array of the query string lines generated from the provided command and statements
   */
  buildQueryLines(command: string, statements: string[] | string | undefined): string[] {
    if (statements === undefined) {
      return [];
    }

    return (typeof statements === 'string' ? [statements] : statements).map(
      (statement: string | undefined): string => this.buildQueryLine(command, statement!),
    );
  }

  /**
   * Build a single query line given a command and statement.
   *
   * @param command a query command
   * @param statement a single query statement
   * @returns a single query string line generated from the provided command and statement
   */
  buildQueryLine(command: string, statement: string): string {
    return statement ? `${command} ${statement}` : '';
  }
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
