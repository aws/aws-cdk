import { ArnFormat, Resource, IResource, Stack, Tag } from '@aws-cdk/core';
//import * as cr from '@aws-cdk/custom-resources';
import { QuickSight } from 'aws-sdk';
import { Construct, IConstruct } from 'constructs';
import { DataSet, IDataSet } from './data-set';
//import { QsFunctions } from './qs-functions';
import { CfnAnalysis } from './quicksight.generated';
import { ITemplate } from './template';
import { ITheme, Theme } from './theme';

/**
 * A QuickSight Analysis
 */
export interface IAnalysis extends IResource {

  // Common QuickSight Resource properties

  /**
   * An ID for the Analysis that you want to create. This ID is unique per AWS Region for each AWS account.
   *
   * @attribute
   */
  readonly resourceId: string;

  /**
   * The display name for the Analysis.
   *
   * @attribute
   */
  readonly analysisName?: string;

  /**
   * A list of Tags on this Analysis.
   *
   * @attribute
   */
  readonly tags?: Tag[];

  /**
   * A list of resource permissions on the Analysis.
   *
   * @attribute
   */
  readonly permissions?: CfnAnalysis.ResourcePermissionProperty[];

  /**
   * The arn of this Analysis.
   *
   * @attribute
   */
  readonly analysisArn: string;

  // Analysis Specific properties

  /**
   * A source entity to use for the analysis that you're creating.
   */
  readonly sourceTemplate?: ITemplate;

  /**
   * The parameter names and override values that you want to use.
   */
  readonly parameters?: CfnAnalysis.ParametersProperty;

  /**
   * The ARN for the theme to apply to the analysis that you're creating.
   */
  readonly theme?: ITheme;

  /**
   * The DataSets that are part of this Analysis.
   */
  readonly dataSets: IDataSet[];
}

abstract class AnalysisBase extends Resource implements IAnalysis {

  // Common QuickSight Resource Properties
  public abstract readonly resourceId: string;
  public abstract readonly analysisName?: string;
  public abstract readonly tags?: Tag[];
  public abstract readonly permissions?: CfnAnalysis.ResourcePermissionProperty[];
  public abstract readonly analysisArn: string;

  // Analysis specific properties
  public abstract readonly sourceTemplate?: ITemplate;
  public abstract readonly parameters?: CfnAnalysis.ParametersProperty;
  public abstract readonly theme?: ITheme;
  public abstract readonly dataSets: IDataSet[];
}

/**
 * Properties for a Analysis.
 */
export interface AnalysisProps {

  // Common QuickSight Resource properties

  /**
   * An ID for the analysis that you want to create. This ID is unique per AWS Region for each AWS account.
   *
   * @default - A new UUID
   */
  readonly resourceId: string;

  /**
   * The display name for the analysis.
   *
   * @default - An automatically generated name.
   */
  readonly analysisName: string;

  /**
   * A list of Tags on this analysis.
   *
   * @default - No tags.
   */
  readonly tags?: Tag[];

  /**
   * A list of resource permissions on the analysis.
   *
   * @default - Empty permissions.
   */
  readonly permissions?: CfnAnalysis.ResourcePermissionProperty[];

  // Analysis Specific properties

  /**
   * A source entity to use for the analysis that you're creating.
   */
  readonly sourceTemplate: ITemplate;

  /**
   * The parameter names and override values that you want to use.
   *
   * @default - No Parameters
   */
  readonly parameters?: CfnAnalysis.ParametersProperty;

  /**
   * The ARN for the theme to apply to the analysis that you're creating.
   *
   * @default - The default theme.
   */
  readonly theme?: ITheme;

  /**
   * The DataSets that are part of this Analysis.
   *
   * @default - DataSets will be taken from the Template.
   */
  readonly dataSets?: IDataSet[];
}

/**
 * Define a QuickSight Analysis.
 */
export class Analysis extends Resource {

  /**
   * Imports a Analysis based on its Id.
   */
  public static fromId(scope: Construct, id: string, analysisId: string): IAnalysis {

    class Import extends AnalysisBase {

      private _analysis: QuickSight.Analysis | undefined;
      private get analysis(): QuickSight.Analysis {

        if (!this._analysis) {
          let analysis: QuickSight.Analysis = {};

          Analysis.quickSight.describeAnalysis({
            AwsAccountId: Stack.of(scope).account,
            AnalysisId: analysisId,
          },
          function (err, data) {
            if (!err && data.Analysis) {
              analysis = data.Analysis;
            } else if (err) {
              throw new Error(err.message);
            } else {
              throw new Error('Analysis does not exist.');
            }
          });

          this._analysis = analysis;
        }

        return this._analysis;
      }

      private _analysisPermissions: QuickSight.ResourcePermission[] | undefined;
      private get analysisPermissions(): QuickSight.ResourcePermission[] {

        if (!this._analysisPermissions) {
          let permissions: QuickSight.ResourcePermission[] = [];

          Analysis.quickSight.describeAnalysisPermissions({
            AwsAccountId: Stack.of(scope).account,
            AnalysisId: analysisId,
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

          this._analysisPermissions = permissions;
        }

        return this._analysisPermissions;
      }

      private _analysisTags: QuickSight.Tag[] | undefined;
      private get analysisTags(): QuickSight.Tag[] {

        if (!this._analysisTags) {
          let tags: QuickSight.Tag[] = [];

          Analysis.quickSight.listTagsForResource({
            ResourceArn: this.analysisArn,
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

          this._analysisTags = tags;
        }

        return this._analysisTags;
      }

      public get analysisName() {
        return this.analysis.Name;
      }

      public get permissions() {
        let permissions: CfnAnalysis.ResourcePermissionProperty[] = [];

        this.analysisPermissions.forEach(function(value: any) {
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

        if (this.analysisTags) {
          this.analysisTags.forEach(function(value: any) {
            if (value.Key && value.Value) {
              tags.push(new Tag(value.Key, value.Value));
            }
          });
        }

        return tags;
      }

      public get analysisArn() {
        return this.analysis.Arn ?? '';
      }

      public get resourceId(): string {
        return this.analysis.AnalysisId ?? '';
      }

      // Analysis specific properties
      public readonly sourceTemplate = undefined;
      public readonly parameters = undefined;

      private _theme: ITheme | undefined;
      public get theme(): ITheme {
        if (!this._theme) {
          let themeId: string = this.resourceId;
          this._theme = Theme.fromId(scope, themeId, themeId);
        }

        return this._theme;
      }

      private _dataSets: IDataSet[] | undefined;
      public get dataSets(): IDataSet[] {
        if (!this._dataSets) {
          let dataSets: IDataSet[] = [];
          this.analysis.DataSetArns?.forEach(function(value: any) {
            let dataSetId: string = value.split('/')[1];
            dataSets.push(DataSet.fromId(scope, dataSetId, dataSetId));
          });

          this._dataSets = dataSets;
        }

        return this._dataSets;
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
   * An ID for the analysis that you want to create. This ID is unique per AWS Region for each AWS account.
   */
  public readonly resourceId: string;


  /**
   * The display name for the analysis.
   *
   * @attribute
   */
  public readonly analysisName?: string;

  /**
   * A list of Tags on this analysis.
   *
   * @default - No tags.
   */
  public readonly tags?: Tag[];

  /**
   * A list of resource permissions on the analysis.
   *
   * @default - Empty permissions.
   */
  public readonly permissions?: CfnAnalysis.ResourcePermissionProperty[];

  /**
   * The arn of this analysis.
   *
   * @attribute
   */
  public get analysisArn(): string {
    return Stack.of(this.scope).formatArn({
      service: 'quicksight',
      resource: 'dataset',
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resourceName: this.resourceId,
    });
  };

  // Analysis specific properties

  /**
   * A source entity to use for the analysis that you're creating.
   *
   * @default - No Source Entity.
   */
  public readonly sourceTemplate?: ITemplate;

  /**
   * The parameter names and override values that you want to use.
   *
   * @default - No Parameters
   */
  public readonly parameters?: CfnAnalysis.ParametersProperty;

  /**
   * The ARN for the theme to apply to the analysis that you're creating.
   *
   * @default - The default theme.
   */
  public readonly theme?: ITheme;

  /**
   * The DataSets that are part of this Analysis.
   */
  readonly dataSets: IDataSet[];

  private scope: IConstruct;

  constructor(scope: Construct, id: string, props: AnalysisProps) {

    super(scope, id);

    this.resourceId = props.resourceId;
    this.scope = scope;

    this.analysisName = props.analysisName;
    this.tags = props.tags;
    this.permissions = props.permissions;

    this.sourceTemplate = props.sourceTemplate;
    this.parameters = props.parameters;
    this.theme = props.theme;

    if (!this.sourceTemplate) {
      throw new Error('sourceTemplate missing');
    }
    let sourceTemplateArn: string = this.sourceTemplate.templateArn;
    let placeholders: IDataSet[] = this.sourceTemplate.placeholders;

    if (props.dataSets) {
      this.dataSets = props.dataSets;
    } else {
      this.dataSets = placeholders;
    }

    let dataSetReferences: CfnAnalysis.DataSetReferenceProperty[] = [];

    if (this.dataSets.length != placeholders.length) {
      throw new Error('The number of DataSets must be equal to the number of ' +
        'DataSets in the sourceTemplate');
    }

    for (let i = 0; i < this.dataSets.length; i++) {
      dataSetReferences.push({
        dataSetArn: this.dataSets[i].dataSetArn,
        dataSetPlaceholder: placeholders[i].dataSetArn,
      });
    }

    //const resource: CfnAnalysis =
    new CfnAnalysis(this, 'Resource', {
      analysisId: props.resourceId,
      awsAccountId: Stack.of(scope).account,
      sourceEntity: {
        sourceTemplate: {
          arn: sourceTemplateArn,
          dataSetReferences: dataSetReferences,
        },
      },
      name: this.analysisName,
      parameters: this.parameters,
      permissions: this.permissions,
      tags: this.tags,
      themeArn: this.theme?.themeArn,
    });
  }
}