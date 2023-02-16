import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { ArnFormat, ContextProvider, Resource, IResource, Stack, Tag } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, IConstruct } from 'constructs';
import { DataSet, IDataSet } from './data-set';
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

      private _analysis: cxapi.QuickSightContextResponse.Analysis | undefined;
      private get analysis(): cxapi.QuickSightContextResponse.Analysis {

        if (!this._analysis) {
          let contextProps: cxschema.QuickSightAnalysisContextQuery = {
            account: Stack.of(scope).account,
            region: Stack.of(scope).region,
            analysisId: analysisId,
          };

          this._analysis = ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.QUICKSIGHT_ANALYSIS_PROVIDER,
            props: contextProps,
            dummyValue: undefined,
          }).value;

          if (!this._analysis) {
            throw Error(`No Analysis found in account ${contextProps.account} and region ${contextProps.region} with id ${contextProps.analysisId}`);
          }
        }

        return this._analysis;
      }

      private _analysisPermissions: cxapi.QuickSightContextResponse.ResourcePermissionList | undefined;
      private get analysisPermissions(): cxapi.QuickSightContextResponse.ResourcePermissionList {

        if (!this._analysisPermissions) {
          let contextProps: cxschema.QuickSightAnalysisContextQuery = {
            account: Stack.of(scope).account,
            region: Stack.of(scope).region,
            analysisId: analysisId,
          };

          this._analysisPermissions = ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.QUICKSIGHT_ANALYSIS_PERMISSIONS_PROVIDER,
            props: contextProps,
            dummyValue: [],
          }).value;
        }

        return this._analysisPermissions!;
      }

      private _analysisTags: cxapi.QuickSightContextResponse.TagList | undefined;
      private get analysisTags(): cxapi.QuickSightContextResponse.TagList {

        if (!this._analysisTags) {
          let contextProps: cxschema.QuickSightTagsContextQuery = {
            account: Stack.of(scope).account,
            region: Stack.of(scope).region,
            resourceArn: this.analysisArn,
          };

          this._analysisTags = ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.QUICKSIGHT_TAGS_PROVIDER,
            props: contextProps,
            dummyValue: [],
          }).value;
        }

        return this._analysisTags!;
      }

      public get analysisName() {
        return this.analysis.name;
      }

      public get permissions() {
        return this.analysisPermissions;
      }

      public get tags() {
        let tags: Tag[] = [];

        if (this.analysisTags) {
          this.analysisTags.forEach(function(value) {
            tags.push(new Tag(value.key, value.value));
          });
        }

        return tags;
      }

      public get analysisArn() {
        return this.analysis.arn!;
      }

      public resourceId = this.analysis.analysisId!;

      // Analysis specific properties
      public readonly sourceTemplate = undefined;
      public readonly parameters = undefined;

      private _theme: ITheme | undefined;
      public get theme(): ITheme {
        if (!this._theme) {
          let themeId: string = this.analysis.themeArn!.split('/')[1]!;
          this._theme = Theme.fromId(scope, themeId, themeId);
        }

        return this._theme;
      }

      private _dataSets: IDataSet[] | undefined;
      public get dataSets(): IDataSet[] {
        if (!this._dataSets) {
          let dataSets: IDataSet[] = [];
          this.analysis.dataSetArns?.forEach(function(value) {
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

    let sourceTemplateArn: string = this.sourceTemplate!.templateArn;
    let placeholders: IDataSet[] = this.sourceTemplate!.placeholders;

    if (props.dataSets) {
      this.dataSets = props.dataSets;
    } else {
      this.dataSets = placeholders;
    }

    let dataSetReferences: CfnAnalysis.DataSetReferenceProperty[] = [];

    if (this.dataSets.length != placeholders.length) {
      throw new Error(`The number of DataSets (${this.dataSets.length}) must be
      equal to the number of DataSets in the sourceTemplate (${placeholders.length})`);
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