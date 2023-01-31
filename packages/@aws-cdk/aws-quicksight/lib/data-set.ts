import { ArnFormat, Resource, IResource, Stack, Tag } from '@aws-cdk/core';
//import * as cr from '@aws-cdk/custom-resources';
import { QuickSight } from 'aws-sdk';
import { Construct, IConstruct } from 'constructs';
import { QsFunctions } from './qs-functions';
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

      private _dataSet: QuickSight.DataSet | undefined;
      private get dataSet(): QuickSight.DataSet {

        if (!this._dataSet) {
          let dataSet: QuickSight.DataSet = {};

          DataSet.quickSight.describeDataSet({
            AwsAccountId: Stack.of(scope).account,
            DataSetId: dataSetId,
          },
          function (err, data) {
            if (!err && data.DataSet) {
              dataSet = data.DataSet;
            } else if (err) {
              throw new Error(err.message);
            } else {
              throw new Error('DataSet does not exist.');
            }
          });

          this._dataSet = dataSet;
        }

        return this._dataSet;
      }

      private _dataSetPermissions: QuickSight.ResourcePermission[] | undefined;
      private get dataSetPermissions(): QuickSight.ResourcePermission[] {

        if (!this._dataSetPermissions) {
          let permissions: QuickSight.ResourcePermission[] = [];

          DataSet.quickSight.describeDataSetPermissions({
            AwsAccountId: Stack.of(scope).account,
            DataSetId: dataSetId,
          },
          function (err, data) {
            if (!err && data.Permissions) {
              permissions = data.Permissions;
            } else if (err) {
              throw new Error(err.message);
            } else {
              throw new Error('Permissions does not exist.');
            }
          });

          this._dataSetPermissions = permissions;
        }

        return this._dataSetPermissions;
      }

      private _dataSetTags: QuickSight.Tag[] | undefined;
      private get dataSetTags(): QuickSight.Tag[] {

        if (!this._dataSetTags) {
          let tags: QuickSight.Tag[] = [];

          DataSet.quickSight.listTagsForResource({
            ResourceArn: this.dataSetArn,
          },
          function (err, data) {
            if (!err && data.Tags) {
              tags = data.Tags;
            } else if (err) {
              throw new Error(err.message);
            } else {
              throw new Error('Tags does not exist.');
            }
          });

          this._dataSetTags = tags;
        }

        return this._dataSetTags;
      }

      public readonly ingestionWaitPolicy = undefined;

      public get dataSetName() {
        return this.dataSet.Name;
      }

      public get permissions() {
        let permissions: CfnDataSet.ResourcePermissionProperty[] = [];

        this.dataSetPermissions.forEach(function(value: any) {
          if (value.Principal && value.Actions) {
            permissions.push({
              principal: value.Principal,
              actions: value.Actions,
            });
          }
        });

        return permissions;
      }

      public get tags() {
        let tags: Tag[] = [];

        if (this.dataSetTags) {
          this.dataSetTags.forEach(function(value: any) {
            if (value.Key && value.Value) {
              tags.push(new Tag(value.Key, value.Value));
            }
          });
        }

        return tags;
      }

      public get dataSetArn() {
        return this.dataSet.Arn ?? '';
      }

      public get resourceId(): string {
        return this.dataSet.DataSetId ?? '';
      }

      public get columnGroups() {
        let columnGroups: CfnDataSet.ColumnGroupProperty[] = [];

        this.dataSet.ColumnGroups?.forEach(function(value: any) {
          if (value.GeoSpatialColumnGroup) {
            columnGroups.push({
              geoSpatialColumnGroup: {
                columns: value.GeoSpatialColumnGroup.Columns,
                countryCode: value.GeoSpatialColumnGroup.CountryCode,
                name: value.GeoSpatialColumnGroup.Name,
              },
            });
          }
        });

        return columnGroups;
      }

      public get columnLevelPermissionRules() {
        let columnLevelPermissionRules: CfnDataSet.ColumnLevelPermissionRuleProperty[] = [];

        this.dataSet.ColumnLevelPermissionRules?.forEach(function(value: any) {
          columnLevelPermissionRules.push({
            columnNames: value.ColumnNames,
            principals: value.Principals,
          });
        });

        return columnLevelPermissionRules;
      }

      public get dataSetUsageConfiguration() {
        let dataSetUsageConfiguration: CfnDataSet.DataSetUsageConfigurationProperty | undefined;

        if (this.dataSet.DataSetUsageConfiguration) {
          dataSetUsageConfiguration = QsFunctions.mapToCamelCase(this.dataSet.DataSetUsageConfiguration);
        };

        return dataSetUsageConfiguration;
      }

      public get fieldFolders() {
        let fieldFolders: { [key: string]: CfnDataSet.FieldFolderProperty } = {};

        if (this.dataSet.FieldFolders) {
          fieldFolders = QsFunctions.mapToCamelCase(this.dataSet.FieldFolders) as { [key: string]: CfnDataSet.FieldFolderProperty };
        }

        return fieldFolders;
      }

      public get importMode() {
        return this.dataSet.ImportMode;
      }

      public get logicalTableMap() {
        let logicalTableMap: { [key: string]: CfnDataSet.LogicalTableProperty } = {};

        if (this.dataSet.LogicalTableMap) {
          logicalTableMap = QsFunctions.mapToCamelCase(this.dataSet.LogicalTableMap, [[]]) as { [key: string]: CfnDataSet.LogicalTableProperty };
        }

        return logicalTableMap;
      }

      public get physicalTableMap() {
        let physicalTableMap: { [key: string]: CfnDataSet.PhysicalTableProperty } = {};

        if (this.dataSet.PhysicalTableMap) {
          physicalTableMap = QsFunctions.mapToCamelCase(this.dataSet.PhysicalTableMap, [[]]) as { [key: string]: CfnDataSet.PhysicalTableProperty };
        }

        return physicalTableMap;
      }

      public get rowLevelPermissionDataSet() {
        let rowLevelPermissionDataSet: CfnDataSet.RowLevelPermissionDataSetProperty | undefined;

        if (this.dataSet.RowLevelPermissionDataSet) {
          rowLevelPermissionDataSet = {
            arn: this.dataSet.RowLevelPermissionDataSet.Arn,
            formatVersion: this.dataSet.RowLevelPermissionDataSet.FormatVersion,
            namespace: this.dataSet.RowLevelPermissionDataSet.Namespace,
            permissionPolicy: this.dataSet.RowLevelPermissionDataSet.PermissionPolicy,
          };
        }

        return rowLevelPermissionDataSet;
      }
    }

    return new Import(scope, id, {
      account: Stack.of(scope).account,
      region: Stack.of(scope).region,
    });
  }

  private static quickSight: QuickSight = new QuickSight;

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