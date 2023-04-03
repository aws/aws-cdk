import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
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
    * A single statement for parsing data from a log field and creating ephemeral fields that can
    * be processed further in the query.
    *
    * @deprecated Use `parseStatements` instead
    * @default - no parse in QueryString
    */
    readonly parse?: string;
    /**
    * An array of one or more statements for parsing data from a log field and creating ephemeral
    * fields that can be processed further in the query. Each provided statement generates a separate
    * parse line in the query string.
    *
    * Note: If provided, this property overrides any value provided for the `parse` property.
    *
    * @default - no parse in QueryString
    */
    readonly parseStatements?: string[];
    /**
    * A single statement for filtering the results of a query based on a boolean expression.
    *
    * @deprecated Use `filterStatements` instead
    * @default - no filter in QueryString
    */
    readonly filter?: string;
    /**
    * An array of one or more statements for filtering the results of a query based on a boolean
    * expression. Each provided statement generates a separate filter line in the query string.
    *
    * Note: If provided, this property overrides any value provided for the `filter` property.
    *
    * @default - no filter in QueryString
    */
    readonly filterStatements?: string[];
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
export declare class QueryString {
    private readonly fields?;
    private readonly parse;
    private readonly filter;
    private readonly stats?;
    private readonly sort?;
    private readonly limit?;
    private readonly display?;
    constructor(props?: QueryStringProps);
    /**
    * String representation of this QueryString.
    */
    toString(): string;
    /**
     * Build an array of query lines given a command and statement(s).
     *
     * @param command a query command
     * @param statements one or more query statements for the specified command, or undefined
     * @returns an array of the query string lines generated from the provided command and statements
     */
    private buildQueryLines;
    /**
     * Build a single query line given a command and statement.
     *
     * @param command a query command
     * @param statement a single query statement
     * @returns a single query string line generated from the provided command and statement
     */
    private buildQueryLine;
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
export declare class QueryDefinition extends Resource {
    /**
     * The ID of the query definition.
     *
     * @attribute
     */
    readonly queryDefinitionId: string;
    constructor(scope: Construct, id: string, props: QueryDefinitionProps);
}
