import { Duration } from "aws-cdk-lib";
import { ISqlKnowledgeBase, SqlKnowledgeBaseBase, SqlQueryEngineType } from "../sql-kb";
import { RedshiftQueryEngine } from "./engine-connection";
import * as bedrock from "aws-cdk-lib/aws-bedrock";
import { generatePhysicalNameV2 } from "../../../utils";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { CommonKnowledgeBaseProps } from "../../knowledge-base";
import { RedshiftQueryData } from "./engine-storage";

/******************************************************************************
 *                             COMMON INTERFACES
 *****************************************************************************/
/**
 * Configuration for Amazon Redshift query engine.
 */
export interface RedshiftQueryGenerationConfig {
  /**
   * The time after which query generation will time out.
   * Value will be rounded up to seconds.
   */
  readonly executionTimeout: Duration;
  /**
   * A list of curated queries that will be used to train the knowledge base.
   * These queries serve as examples to help the model understand the schema and generate better queries.
   */
  readonly curatedQueries: bedrock.CfnKnowledgeBase.CuratedQueryProperty[];
  /**
   * Metadata about the tables in your database that will be used for query generation.
   * This includes information about your table data structure and tells the model whether
   * the column should be included or excluded in query generation.
   */
  readonly tableMetadata: bedrock.CfnKnowledgeBase.QueryGenerationTableProperty[];
}

export interface SqlRedshiftKnowledgeBaseProps extends CommonKnowledgeBaseProps {
  /**
   * The compute engine that powers the query process.
   */
  readonly queryEngine: RedshiftQueryEngine;
  /**
   * The data query-able through the knowledge base.
   */
  readonly queryData: RedshiftQueryData[];
  /**
   *  Configuration including additional metadata that help with query generation.
   *
   * @default - No additional metadata, 30s execution timeout
   */
  readonly queryGenerationConfig?: RedshiftQueryGenerationConfig;
}
/**
 * Interface for a SQL Knowledge Base using Amazon Redshift
 */
export interface ISqlRedshiftKnowledgeBase extends ISqlKnowledgeBase {
  /**
   * The compute engine.
   */
  readonly queryEngine: RedshiftQueryEngine;
  /**
   * The data query-able through the knowledge base.
   */
  readonly queryData: RedshiftQueryData[];
  /**
   *  Configuration including additional metadata that help with query generation.
   */
  readonly queryGenerationConfig: RedshiftQueryGenerationConfig;
}

export class SqlRedshiftKnowledgeBase extends SqlKnowledgeBaseBase {
  public readonly queryEngineType: SqlQueryEngineType = SqlQueryEngineType.REDSHIFT;
  // ------------------------------------------------------
  // Inherited Attributes - COMMON
  // ------------------------------------------------------
  public readonly knowledgeBaseArn: string;
  public readonly knowledgeBaseId: string;
  public readonly role: iam.IRole;
  public readonly description?: string;
  // ------------------------------------------------------
  // Inherited Attributes - SQL Only
  // ------------------------------------------------------
  public readonly queryEngine: RedshiftQueryEngine;
  public readonly queryData: RedshiftQueryData[];
  public readonly queryGenerationConfig: RedshiftQueryGenerationConfig;
  // ------------------------------------------------------
  // CDK Class Only
  // ------------------------------------------------------
  public readonly name: string;
  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  private readonly _resource: bedrock.CfnKnowledgeBase;

  constructor(scope: Construct, id: string, props: SqlRedshiftKnowledgeBaseProps) {
    super(scope, id);
    // ------------------------------------------------------
    // Set properties or defaults
    // ------------------------------------------------------
    // Create a new graph if not specified.
    this.name =
      props.name ??
      generatePhysicalNameV2(this, "sql-reshift-kb", { maxLength: 32, separator: "-" });

    this.queryEngine = props.queryEngine;
    this.queryData = props.queryData;
    this.queryGenerationConfig = props.queryGenerationConfig ?? {
      curatedQueries: [],
      executionTimeout: Duration.seconds(30),
      tableMetadata: [],
    };
    // ------------------------------------------------------
    // Role
    // ------------------------------------------------------
    // Use existing role if provided, otherwise create a new one
    this.role = props.existingRole ?? this.createKnowledgeBaseServiceRole(this);

    // ------------------------------------------------------
    // Permissions
    // ------------------------------------------------------

    // ------------------------------------------------------
    // Props Handling
    // ------------------------------------------------------
    let cfnProps: bedrock.CfnKnowledgeBaseProps = {
      name: this.name,
      roleArn: this.role.roleArn,
      knowledgeBaseConfiguration: {
        type: this.knowledgeBaseType,
        sqlKnowledgeBaseConfiguration: {
          type: this.queryEngineType,
          redshiftConfiguration: {
            queryEngineConfiguration: props.queryEngine.render(),
            storageConfigurations: props.queryData.flatMap((dataSource) => dataSource.render()),
            ...(props.queryGenerationConfig && {
              queryGenerationConfiguration: {
                executionTimeoutSeconds: props.queryGenerationConfig.executionTimeout.toSeconds(),
                generationContext: {
                  curatedQueries: props.queryGenerationConfig.curatedQueries,
                  tables: props.queryGenerationConfig.tableMetadata,
                },
              },
            }),
          },
        },
      },
    };

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this._resource = new bedrock.CfnKnowledgeBase(this, "Resource", cfnProps);

    // ------------------------------------------------------
    this.knowledgeBaseArn = this._resource.attrKnowledgeBaseArn;
    this.knowledgeBaseId = this._resource.attrKnowledgeBaseId;

    // ------------------------------------------------------
  }
}
