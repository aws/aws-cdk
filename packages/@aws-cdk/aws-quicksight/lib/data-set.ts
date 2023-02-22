import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { ArnFormat, ContextProvider, Resource, IResource, Stack, Tag } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, IConstruct } from 'constructs';
import { CfnDataSet } from './quicksight.generated';

/**
 * A QuickSight DataSet.
 */
export interface IDataSet extends IResource {

  // Common QuickSight Resource properties

  /**
   * An ID for the dataset that you want to create. This ID is unique per AWS Region for each AWS account.
   *
   * @attribute
   */
  readonly resourceId: string;

  /**
   * The display name for the dataset.
   *
   * @attribute
   */
  readonly dataSetName?: string;

  /**
   * A list of Tags on this DataSet.
   *
   * @attribute
   */
  readonly tags?: Tag[];

  /**
   * A list of resource permissions on the dataset.
   *
   * @attribute
   */
  readonly permissions?: CfnDataSet.ResourcePermissionProperty[];

  /**
   * The arn of this DataSet.
   *
   * @attribute
   */
  readonly dataSetArn: string;

  // DataSet Specific properties

  /**
   * Groupings of columns that work together in certain Amazon QuickSight features.
   * Currently, only geospatial hierarchy is supported.
   *
   * @attribute
   */
  readonly columnGroups?: CfnDataSet.ColumnGroupProperty[]

  /**
   * A set of one or more definitions of a ColumnLevelPermissionRule .
   *
   * @attribute
   */
  readonly columnLevelPermissionRules?: CfnDataSet.ColumnLevelPermissionRuleProperty[];

  /**
   * The usage configuration to apply to child datasets that reference this dataset as a source.
   *
   * @attribute
   */
  readonly dataSetUsageConfiguration?: CfnDataSet.DataSetUsageConfigurationProperty;

  /**
   * The folder that contains fields and nested subfolders for your dataset.
   *
   * @attribute
   */
  readonly fieldFolders?: { [key: string]: CfnDataSet.FieldFolderProperty };

  /**
   * Indicates whether you want to import the data into SPICE.
   *
   * @attribute
   */
  readonly importMode?: string;

  /**
   * The wait policy to use when creating or updating a Dataset. The default is
   * to wait for SPICE ingestion to finish with timeout of 36 hours.
   *
   * @attribute
   */
  readonly ingestionWaitPolicy?: CfnDataSet.IngestionWaitPolicyProperty;

  /**
   * Configures the combination and transformation of the data from the physical tables.
   *
   * @attribute
   */
  readonly logicalTableMap?: { [key: string]: CfnDataSet.LogicalTableProperty };

  /**
   * Declares the physical tables that are available in the underlying data sources.
   *
   * @attribute
   */
  readonly physicalTableMap?: { [key: string]: CfnDataSet.PhysicalTableProperty };

  /**
   * The row-level security configuration for the data that you want to create.
   *
   * @attribute
   */
  readonly rowLevelPermissionDataSet?: CfnDataSet.RowLevelPermissionDataSetProperty;
}

abstract class DataSetBase extends Resource implements IDataSet {

  // Common QuickSight Resource properties
  public abstract readonly resourceId: string;
  public abstract readonly dataSetName?: string;
  public abstract readonly tags?: Tag[];
  public abstract readonly permissions?: CfnDataSet.ResourcePermissionProperty[];
  public abstract readonly dataSetArn: string;

  // DataSet Specific properties
  public abstract readonly columnGroups?: CfnDataSet.ColumnGroupProperty[]
  public abstract readonly columnLevelPermissionRules?: CfnDataSet.ColumnLevelPermissionRuleProperty[];
  public abstract readonly dataSetUsageConfiguration?: CfnDataSet.DataSetUsageConfigurationProperty;
  public abstract readonly fieldFolders?: { [key: string]: CfnDataSet.FieldFolderProperty };
  public abstract readonly importMode?: string;
  public abstract readonly ingestionWaitPolicy?: CfnDataSet.IngestionWaitPolicyProperty;
  public abstract readonly logicalTableMap?: { [key: string]: CfnDataSet.LogicalTableProperty };
  public abstract readonly physicalTableMap?: { [key: string]: CfnDataSet.PhysicalTableProperty };
  public abstract readonly rowLevelPermissionDataSet?: CfnDataSet.RowLevelPermissionDataSetProperty;
}

/**
 * Properties for a DataSet.
 */
export interface DataSetProps {

  // Common QuickSight Resource properties

  /**
   * An ID for the dataset that you want to create. This ID is unique per AWS Region for each AWS account.
   *
   * @default - A new UUID
   */
  readonly resourceId: string;

  /**
   * The display name for the dataset.
   *
   * @default - An automatically generated name.
   */
  readonly dataSetName: string;

  /**
   * A list of Tags on this DataSet.
   *
   * @default - No tags.
   */
  readonly tags?: Tag[];

  /**
   * A list of resource permissions on the dataset.
   *
   * @default - Empty permissions.
   */
  readonly permissions?: CfnDataSet.ResourcePermissionProperty[];

  // DataSet Specific properties

  /**
   * Groupings of columns that work together in certain Amazon QuickSight features.
   * Currently, only geospatial hierarchy is supported.
   *
   * @default - undefined.
   */
  readonly columnGroups?: CfnDataSet.ColumnGroupProperty[]

  /**
   * A set of one or more definitions of a ColumnLevelPermissionRule .
   *
   * @default - undefined.
   */
  readonly columnLevelPermissionRules?: CfnDataSet.ColumnLevelPermissionRuleProperty[];

  /**
   * The usage configuration to apply to child datasets that reference this dataset as a source.
   *
   * @default - undefined.
   */
  readonly dataSetUsageConfiguration?: CfnDataSet.DataSetUsageConfigurationProperty;

  /**
   * The folder that contains fields and nested subfolders for your dataset.
   *
   * @default - undefined.
   */
  readonly fieldFolders?: { [key: string]: CfnDataSet.FieldFolderProperty };

  /**
   * Indicates whether you want to import the data into SPICE.
   *
   * @default - undefined.
   */
  readonly importMode?: string;

  /**
   * The wait policy to use when creating or updating a Dataset. The default is
   * to wait for SPICE ingestion to finish with timeout of 36 hours.
   *
   * @default - undefined.
   */
  readonly ingestionWaitPolicy?: CfnDataSet.IngestionWaitPolicyProperty;

  /**
   * Configures the combination and transformation of the data from the physical tables.
   *
   * @default - undefined.
   */
  readonly logicalTableMap?: { [key: string]: CfnDataSet.LogicalTableProperty };

  /**
   * Declares the physical tables that are available in the underlying data sources.
   *
   * @default - undefined.
   */
  readonly physicalTableMap?: { [key: string]: CfnDataSet.PhysicalTableProperty };

  /**
   * The row-level security configuration for the data that you want to create.
   *
   * @default - undefined.
   */
  readonly rowLevelPermissionDataSet?: CfnDataSet.RowLevelPermissionDataSetProperty;
}

/**
 * Define a QuickSight DataSet.
 */
export class DataSet extends Resource {

  /**
   * Imports a DataSet based on its Id.
   */
  public static fromId(scope: Construct, id: string, dataSetId: string): IDataSet {

    class Import extends DataSetBase {

      private _dataSet: cxapi.QuickSightContextResponse.DataSet | undefined;
      private get dataSet(): cxapi.QuickSightContextResponse.DataSet {

        if (!this._dataSet) {
          let contextProps: cxschema.QuickSightDataSetContextQuery = {
            account: Stack.of(scope).account,
            region: Stack.of(scope).region,
            dataSetId: dataSetId,
          };

          this._dataSet = ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.QUICKSIGHT_DATA_SET_PROVIDER,
            props: contextProps,
            dummyValue: undefined,
          }).value;

          if (!this._dataSet) {
            throw Error(`No DataSet found in account ${contextProps.account} and region ${contextProps.region} with id ${contextProps.dataSetId}`);
          }
        }

        return this._dataSet;
      }

      private _dataSetPermissions: cxapi.QuickSightContextResponse.ResourcePermissionList | undefined;
      private get dataSetPermissions(): cxapi.QuickSightContextResponse.ResourcePermissionList {

        if (!this._dataSetPermissions) {
          let contextProps: cxschema.QuickSightDataSetContextQuery = {
            account: Stack.of(scope).account,
            region: Stack.of(scope).region,
            dataSetId: dataSetId,
          };

          this._dataSetPermissions = ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.QUICKSIGHT_DATA_SET_PERMISSIONS_PROVIDER,
            props: contextProps,
            dummyValue: [],
          }).value;
        }

        return this._dataSetPermissions!;
      }

      private _dataSetTags: cxapi.QuickSightContextResponse.TagList | undefined;
      private get dataSetTags(): cxapi.QuickSightContextResponse.TagList {

        if (!this._dataSetTags) {
          let contextProps: cxschema.QuickSightTagsContextQuery = {
            account: Stack.of(scope).account,
            region: Stack.of(scope).region,
            resourceArn: this.dataSetArn,
          };

          this._dataSetTags = ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.QUICKSIGHT_TAGS_PROVIDER,
            props: contextProps,
            dummyValue: [],
          }).value;
        }

        return this._dataSetTags!;
      }

      public readonly ingestionWaitPolicy = undefined;

      public get dataSetName() {
        return this.dataSet.name;
      }

      public get permissions() {
        return this.dataSetPermissions;
      }

      public get tags() {
        let tags: Tag[] = [];

        if (this.dataSetTags) {
          this.dataSetTags.forEach(function(value) {
            tags.push(new Tag(value.key, value.value));
          });
        }

        return tags;
      }

      public get dataSetArn() {
        return this.dataSet.arn!;
      }

      public resourceId = this.dataSet.dataSetId!;

      public get columnGroups() {
        return this.dataSet.columnGroups;
      }

      public get columnLevelPermissionRules() {
        return this.dataSet.columnLevelPermissionRules;
      }

      public get dataSetUsageConfiguration() {
        return this.dataSet.dataSetUsageConfiguration;
      }

      public get fieldFolders() {
        return this.dataSet.fieldFolders;
      }

      public get importMode() {
        return this.dataSet.importMode;
      }

      public get logicalTableMap() {
        return this.dataSet.logicalTableMap;
      }

      public get physicalTableMap() {
        return this.dataSet.physicalTableMap;
      }

      public get rowLevelPermissionDataSet() {
        return this.dataSet.rowLevelPermissionDataSet;
      }
    }

    return new Import(scope, id, {
      account: Stack.of(scope).account,
      region: Stack.of(scope).region,
    });
  }

  // Common QuickSight Resource properties
  /**
   * An ID for the dataset that you want to create. This ID is unique per AWS Region for each AWS account.
   */
  public readonly resourceId: string;

  /**
   * The display name for the dataset.
   *
   * @attribute
   */
  public readonly dataSetName?: string;

  /**
   * A list of Tags on this DataSet.
   *
   * @default - No tags.
   */
  public readonly tags?: Tag[];

  /**
   * A list of resource permissions on the dataset.
   *
   * @default - Empty permissions.
   */
  public readonly permissions?: CfnDataSet.ResourcePermissionProperty[];

  /**
   * The arn of this DataSet.
   *
   * @attribute
   */
  public get dataSetArn(): string {
    return Stack.of(this.scope).formatArn({
      service: 'quicksight',
      resource: 'dataset',
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resourceName: this.resourceId,
    });
  };

  // DataSet Specific properties

  /**
   * Groupings of columns that work together in certain Amazon QuickSight features.
   * Currently, only geospatial hierarchy is supported.
   */
  public readonly columnGroups?: CfnDataSet.ColumnGroupProperty[]

  /**
   * A set of one or more definitions of a ColumnLevelPermissionRule .
   */
  public readonly columnLevelPermissionRules?: CfnDataSet.ColumnLevelPermissionRuleProperty[];

  /**
   * The usage configuration to apply to child datasets that reference this dataset as a source.
   *
   * @attribute
   */
  public readonly dataSetUsageConfiguration?: CfnDataSet.DataSetUsageConfigurationProperty;

  /**
   * The folder that contains fields and nested subfolders for your dataset.
   */
  public readonly fieldFolders?: { [key: string]: CfnDataSet.FieldFolderProperty };

  /**
   * Indicates whether you want to import the data into SPICE.
   */
  public readonly importMode?: string;

  /**
   * The wait policy to use when creating or updating a Dataset. The default is
   * to wait for SPICE ingestion to finish with timeout of 36 hours.
   */
  public readonly ingestionWaitPolicy?: CfnDataSet.IngestionWaitPolicyProperty;

  /**
   * Configures the combination and transformation of the data from the physical tables.
   */
  public readonly logicalTableMap?: { [key: string]: CfnDataSet.LogicalTableProperty };

  /**
   * Declares the physical tables that are available in the underlying data sources.
   */
  public readonly physicalTableMap?: { [key: string]: CfnDataSet.PhysicalTableProperty };

  /**
   * The row-level security configuration for the data that you want to create.
   *
   * @attribute
   */
  readonly rowLevelPermissionDataSet?: CfnDataSet.RowLevelPermissionDataSetProperty;

  private scope: IConstruct;

  constructor(scope: Construct, id: string, props: DataSetProps) {

    super(scope, id);

    this.resourceId = props.resourceId;
    this.scope = scope;

    this.dataSetName = props.dataSetName;
    this.tags = props.tags;
    this.permissions = props.permissions;

    this.columnGroups = props.columnGroups;
    this.columnLevelPermissionRules = props.columnLevelPermissionRules;
    this.dataSetUsageConfiguration = props.dataSetUsageConfiguration;
    this.fieldFolders = props.fieldFolders;
    this.importMode = props.importMode;
    this.ingestionWaitPolicy = props.ingestionWaitPolicy;
    this.logicalTableMap = props.logicalTableMap;
    this.physicalTableMap = props.physicalTableMap;
    this.rowLevelPermissionDataSet = props.rowLevelPermissionDataSet;

    new CfnDataSet(this, 'Resource', {
      awsAccountId: Stack.of(scope).account,
      columnGroups: this.columnGroups,
      columnLevelPermissionRules: this.columnLevelPermissionRules,
      dataSetId: this.resourceId,
      dataSetUsageConfiguration: this.dataSetUsageConfiguration,
      fieldFolders: this.fieldFolders,
      importMode: this.importMode,
      ingestionWaitPolicy: this.ingestionWaitPolicy,
      logicalTableMap: this.logicalTableMap,
      name: this.dataSetName,
      permissions: this.permissions,
      physicalTableMap: this.physicalTableMap,
      rowLevelPermissionDataSet: this.rowLevelPermissionDataSet,
      tags: this.tags,
    });
  }
}