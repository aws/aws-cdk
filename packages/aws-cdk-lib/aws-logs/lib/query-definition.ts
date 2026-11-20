import type { Construct } from 'constructs';
import { CfnQueryDefinition } from '.';
import { Annotations, Resource, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { ILogGroupRef } from '../../interfaces/generated/aws-logs-interfaces.generated';

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
   * A single statement for using log field values to calculate aggregate statistics.
   *
   * @deprecated Use `statsStatements` instead
   * @default - no stats in QueryString
   */
  readonly stats?: string;

  /**
   * An array of one or more statements for calculating aggregate statistics.
   * CloudWatch Logs Insights supports up to two stats commands in a single query.
   * Each provided statement generates a separate stats line in the query string.
   *
   * Note: If provided, this property overrides any value provided for the `stats` property.
   *
   * @default - no stats in QueryString
   */
  readonly statsStatements?: string[];

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
  /**
   * Use the given text as the query string.
   *
   * Use this for OpenSearch SQL and OpenSearch PPL queries, and for Logs Insights QL
   * queries that the `QueryString` properties can't express. The text is used as is.
   *
   * @param queryString the query text
   */
  public static fromString(queryString: string): QueryString {
    return new LiteralQueryString(queryString);
  }

  private readonly fields?: string[];
  private readonly parse: string[];
  private readonly filter: string[];
  private readonly stats: string[];
  private readonly sort?: string;
  private readonly limit?: Number;
  private readonly display?: string;

  /**
   * Length of statsStatements
   */
  public readonly statsStatementsLength?: number;
  /**
   * If the props for the query string have both stats and statsStatements
   */
  public readonly hasStatsAndStatsStatements: boolean;

  constructor(props: QueryStringProps = {}) {
    this.fields = props.fields;
    this.sort = props.sort;
    this.limit = props.limit;
    this.display = props.display;
    this.statsStatementsLength = props.statsStatements?.length;
    this.hasStatsAndStatsStatements = !!(props.statsStatements && props.stats);

    // Determine parsing by either the parseStatements or parse properties, or default to empty array
    if (props.parseStatements) {
      this.parse = props.parseStatements;
    } else if (props.parse) {
      this.parse = [props.parse];
    } else {
      this.parse = [];
    }

    // Determine filtering by either the filterStatements or filter properties, or default to empty array
    if (props.filterStatements) {
      this.filter = props.filterStatements;
    } else if (props.filter) {
      this.filter = [props.filter];
    } else {
      this.filter = [];
    }

    if (props.statsStatements) {
      this.stats = props.statsStatements;
    } else if (props.stats) {
      this.stats = [props.stats];
    } else {
      this.stats = [];
    }
  }

  /**
   * String representation of this QueryString.
   */
  public toString(): string {
    return [
      this.buildQueryLine('fields', this.fields?.join(', ')),
      ...this.buildQueryLines('parse', this.parse),
      ...this.buildQueryLines('filter', this.filter),
      ...this.buildQueryLines('stats', this.stats),
      this.buildQueryLine('sort', this.sort),
      this.buildQueryLine('limit', this.limit?.toString()),
      this.buildQueryLine('display', this.display),
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
  private buildQueryLines(command: string, statements?: string[]): string[] {
    if (statements === undefined) {
      return [];
    }

    return statements.map(
      (statement: string): string => this.buildQueryLine(command, statement),
    );
  }

  /**
   * Build a single query line given a command and statement.
   *
   * @param command a query command
   * @param statement a single query statement
   * @returns a single query string line generated from the provided command and statement
   */
  private buildQueryLine(command: string, statement?: string): string {
    return statement ? `${command} ${statement}` : '';
  }
}

/**
 * A query string that is used as is.
 */
class LiteralQueryString extends QueryString {
  constructor(private readonly queryString: string) {
    super();
  }

  public toString(): string {
    return this.queryString;
  }
}

/**
 * The query language of a query definition.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_Languages.html
 */
export enum QueryLanguage {
  /**
   * CloudWatch Logs Insights query language (Logs Insights QL).
   */
  CWLI = 'CWLI',

  /**
   * OpenSearch Service SQL.
   */
  SQL = 'SQL',

  /**
   * OpenSearch Service Piped Processing Language (PPL).
   */
  PPL = 'PPL',
}

/**
 * A parameter of a query definition.
 *
 * The query string refers to the parameter as `{{name}}`, and the value is supplied
 * when the query runs.
 */
export interface QueryParameter {
  /**
   * The name of the parameter.
   *
   * Must start with a letter or underscore and contain only letters, digits and underscores,
   * up to 128 characters.
   */
  readonly name: string;

  /**
   * The value to use when no value is supplied when the query runs.
   *
   * @default - no default value
   */
  readonly defaultValue?: string;

  /**
   * A description of the parameter.
   *
   * @default - no description
   */
  readonly description?: string;
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
   * For OpenSearch SQL queries, CloudWatch Logs reads the log groups from the query string
   * instead.
   *
   * @default - no specified log groups
   */
  readonly logGroups?: ILogGroupRef[];

  /**
   * The query language of the query string.
   *
   * `QueryString` built from properties produces a Logs Insights QL query. For OpenSearch
   * SQL and PPL, pass the query with `QueryString.fromString()`.
   *
   * @default - not set in the template; CloudWatch Logs uses Logs Insights QL (`CWLI`)
   */
  readonly queryLanguage?: QueryLanguage;

  /**
   * Parameters that the query string refers to as `{{name}}`.
   *
   * Only supported for Logs Insights QL queries. Up to 20 parameters.
   *
   * @default - no parameters
   */
  readonly parameters?: QueryParameter[];
}

/**
 * Define a query definition for CloudWatch Logs Insights
 */
@propertyInjectable
export class QueryDefinition extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-logs.QueryDefinition';
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
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.queryString.statsStatementsLength && props.queryString.statsStatementsLength > 2) {
      throw new ValidationError(lit`CloudWatchLogsInsightsSupports`, `CloudWatch Logs Insights only supports up to two stats commands in a single query, received ${props.queryString.statsStatementsLength}.`, this);
    }

    if (props.queryString.hasStatsAndStatsStatements) {
      Annotations.of(this).addWarningV2('QueryDefinitionStatsWarning',
        'Both stats and statsStatements properties are provided. The stats property is deprecated and will be ignored in favor of statsStatements.');
    }

    this.validateParameters(props.parameters, props.queryLanguage);

    const queryDefinition = new CfnQueryDefinition(this, 'Resource', {
      name: props.queryDefinitionName,
      queryString: props.queryString.toString(),
      logGroupNames: typeof props.logGroups === 'undefined' ? [] : props.logGroups.flatMap(logGroup => logGroup.logGroupRef.logGroupName),
      queryLanguage: props.queryLanguage,
      // `QueryParameter` has the same shape as the L1 property, so the list is passed as is.
      // This also keeps an unresolved list intact.
      parameters: props.parameters,
    });

    this.queryDefinitionId = queryDefinition.attrQueryDefinitionId;
  }

  private validateParameters(parameters: QueryParameter[] | undefined, queryLanguage: QueryLanguage | undefined): void {
    if (parameters === undefined || Token.isUnresolved(parameters)) {
      return;
    }

    if (parameters.length > 0 && queryLanguage !== undefined && !Token.isUnresolved(queryLanguage) && queryLanguage !== QueryLanguage.CWLI) {
      throw new ValidationError(lit`QueryParametersRequireLogsInsights`, `query parameters are only supported for Logs Insights QL queries, got queryLanguage ${JSON.stringify(queryLanguage)}; remove parameters or use QueryLanguage.CWLI`, this);
    }

    if (parameters.length > 20) {
      throw new ValidationError(lit`QueryParametersMaximum`, `a query definition supports at most 20 parameters, got ${parameters.length}`, this);
    }

    const names = new Set<string>();
    for (const parameter of parameters) {
      const name = parameter.name;
      if (!Token.isUnresolved(name)) {
        if (name.length > 128 || !/^[A-Za-z_][0-9A-Za-z_]*$/.test(name)) {
          throw new ValidationError(lit`QueryParameterNameInvalid`, `invalid query parameter name ${JSON.stringify(name)}: it must start with a letter or underscore, contain only letters, digits and underscores, and be at most 128 characters long`, this);
        }
        if (names.has(name)) {
          throw new ValidationError(lit`QueryParameterNameDuplicate`, `query parameter name ${JSON.stringify(name)} is used more than once`, this);
        }
        names.add(name);
      }
      if (parameter.defaultValue !== undefined && !Token.isUnresolved(parameter.defaultValue) && parameter.defaultValue.length > 1024) {
        throw new ValidationError(lit`QueryParameterDefaultValueLength`, `the default value of query parameter ${JSON.stringify(name)} must be at most 1024 characters long, got ${parameter.defaultValue.length}`, this);
      }
      if (parameter.description !== undefined && !Token.isUnresolved(parameter.description) && parameter.description.length > 512) {
        throw new ValidationError(lit`QueryParameterDescriptionLength`, `the description of query parameter ${JSON.stringify(name)} must be at most 512 characters long, got ${parameter.description.length}`, this);
      }
    }
  }
}
