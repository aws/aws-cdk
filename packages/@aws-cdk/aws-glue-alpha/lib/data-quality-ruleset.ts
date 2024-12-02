import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import { IResource, Resource } from 'aws-cdk-lib/core';
import { CfnDataQualityRuleset } from 'aws-cdk-lib/aws-glue';

/**
 * Properties of a DataQualityTargetTable.
 */
export class DataQualityTargetTable {
  /**
   * The database name of the target table.
   */
  readonly databaseName: string;

  /**
   * The table name of the target table.
   */
  readonly tableName: string;

  constructor(databaseName: string, tableName: string) {
    this.databaseName = databaseName;
    this.tableName = tableName;
  }
}

export interface IDataQualityRuleset extends IResource {
  /**
   * The ARN of the ruleset
   * @attribute
   */
  readonly rulesetArn: string;

  /**
   * The name of the ruleset
   * @attribute
   */
  readonly rulesetName: string;
}

/**
 * Construction properties for `DataQualityRuleset`
 */
export interface DataQualityRulesetProps {
  /**
   * The name of the ruleset
   * @default cloudformation generated name
   */
  readonly rulesetName?: string;

  /**
   * The client token of the ruleset
   * @attribute
   */
  readonly clientToken?: string;

  /**
   * The description of the ruleset
   * @attribute
   */
  readonly description?: string;

  /**
   * The dqdl of the ruleset
   * @attribute
   */
  readonly rulesetDqdl: string;

  /**
   *  Key-Value pairs that define tags for the ruleset.
   *  @default empty tags
   */
  readonly tags?: { [key: string]: string };

  /**
   * The target table of the ruleset
   * @attribute
   */
  readonly targetTable: DataQualityTargetTable;
}

/**
 * A Glue Data Quality ruleset.
 */
export class DataQualityRuleset extends Resource implements IDataQualityRuleset {
  public static fromRulesetArn(scope: constructs.Construct, id: string, rulesetArn: string): IDataQualityRuleset {
    class Import extends Resource implements IDataQualityRuleset {
      public rulesetArn = rulesetArn;
      public rulesetName = cdk.Arn.extractResourceName(rulesetArn, 'dataqualityruleset');
    }

    return new Import(scope, id);
  }

  public static fromRulesetName(scope: constructs.Construct, id: string, rulesetName: string): IDataQualityRuleset {
    class Import extends Resource implements IDataQualityRuleset {
      public rulesetArn = DataQualityRuleset.buildRulesetArn(scope, rulesetName);
      public rulesetName = rulesetName;
    }

    return new Import(scope, id);
  }

  private static buildRulesetArn(scope: constructs.Construct, rulesetName: string) : string {
    return cdk.Stack.of(scope).formatArn({
      service: 'glue',
      resource: 'dataqualityruleset',
      resourceName: rulesetName,
    });
  }

  /**
   * Name of this ruleset.
   */
  public readonly rulesetName: string;

  /**
   * ARN of this ruleset.
   */
  public readonly rulesetArn: string;

  constructor(scope: constructs.Construct, id: string, props: DataQualityRulesetProps) {
    super(scope, id, {
      physicalName: props.rulesetName,
    });

    const rulesetResource = new CfnDataQualityRuleset(this, 'Resource', {
      clientToken: props.clientToken,
      description: props.description,
      name: props.rulesetName,
      ruleset: props.rulesetDqdl,
      tags: props.tags,
      targetTable: props.targetTable,
    });

    const resourceName = this.getResourceNameAttribute(rulesetResource.ref);
    this.rulesetArn = DataQualityRuleset.buildRulesetArn(this, resourceName);
    this.rulesetName = resourceName;
  }
}
