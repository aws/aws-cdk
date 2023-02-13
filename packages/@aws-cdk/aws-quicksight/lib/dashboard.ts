import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { ArnFormat, ContextProvider, Resource, IResource, Stack, Tag } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, IConstruct } from 'constructs';
import { DataSet, IDataSet } from './data-set';
import { CfnDashboard } from './quicksight.generated';
import { ITemplate, Template } from './template';
import { Theme, ITheme } from './theme';

/**
 * A QuickSight Dashboard
 */
export interface IDashboard extends IResource {

  // Common QuickSight Resource properties

  /**
   * An ID for the Dashboard that you want to create. This ID is unique per AWS Region for each AWS account.
   *
   * @attribute
   */
  readonly resourceId: string;

  /**
   * The display name for the Dashboard.
   *
   * @attribute
   */
  readonly dashboardName?: string;

  /**
   * A list of Tags on this Dashboard.
   *
   * @attribute
   */
  readonly tags?: Tag[];

  /**
   * A list of resource permissions on the Dashboard.
   *
   * @attribute
   */
  readonly permissions?: CfnDashboard.ResourcePermissionProperty[];

  /**
   * The arn of this Dashboard.
   *
   * @attribute
   */
  readonly dashboardArn: string;

  // Dashboard Specific properties

  /**
   * A source entity to use for the dashboard that you're creating.
   */
  readonly sourceTemplate?: ITemplate;

  /**
   * The parameter names and override values that you want to use.
   */
  readonly parameters?: CfnDashboard.ParametersProperty;

  /**
   * The ARN for the theme to apply to the dashboard that you're creating.
   */
  readonly theme?: ITheme;

  /**
   * The DataSets that are part of this Dashboard.
   */
  readonly dataSets: IDataSet[];

  /**
   * Options for publishing the dashboard when you create it.
   */
  readonly dashboardPublishOptions?: CfnDashboard.DashboardPublishOptionsProperty;

  /**
   * A description for the first version of the dashboard being created.
   */
  readonly versionDescription: string;
}

abstract class DashboardBase extends Resource implements IDashboard {

  // Common QuickSight Resource Properties
  public abstract readonly resourceId: string;
  public abstract readonly dashboardName?: string;
  public abstract readonly tags?: Tag[];
  public abstract readonly permissions?: CfnDashboard.ResourcePermissionProperty[];
  public abstract readonly dashboardArn: string;

  // Dashboard specific properties
  public abstract readonly sourceTemplate?: ITemplate;
  public abstract readonly parameters?: CfnDashboard.ParametersProperty;
  public abstract readonly theme?: ITheme;
  public abstract readonly dataSets: IDataSet[];
  public abstract readonly dashboardPublishOptions?: CfnDashboard.DashboardPublishOptionsProperty;
  public abstract readonly versionDescription: string;
}

/**
 * Properties for a Dashboard.
 */
export interface DashboardProps {

  // Common QuickSight Resource properties

  /**
   * An ID for the dashboard that you want to create. This ID is unique per AWS Region for each AWS account.
   *
   * @default - A new UUID
   */
  readonly resourceId: string;

  /**
   * The display name for the dashboard.
   *
   * @default - An automatically generated name.
   */
  readonly dashboardName: string;

  /**
   * A list of Tags on this dashboard.
   *
   * @default - No tags.
   */
  readonly tags?: Tag[];

  /**
   * A list of resource permissions on the dashboard.
   *
   * @default - Empty permissions.
   */
  readonly permissions?: CfnDashboard.ResourcePermissionProperty[];

  // Dashboard Specific properties

  /**
   * A source entity to use for the dashboard that you're creating.
   *
   * @default - No Source Entity.
   */
  readonly sourceTemplate?: ITemplate;

  /**
   * The parameter names and override values that you want to use.
   *
   * @default - No Parameters
   */
  readonly parameters?: CfnDashboard.ParametersProperty;

  /**
   * The ARN for the theme to apply to the dashboard that you're creating.
   *
   * @default - The default theme.
   */
  readonly theme?: ITheme;

  /**
   * The DataSets that are part of this Dashboard.
   *
   * @default - Data Sets will come from sourceTemplate.
   */
  readonly dataSets?: IDataSet[];

  /**
   * Options for publishing the dashboard when you create it.
   *
   * @default - No options.
   */
  readonly dashboardPublishOptions?: CfnDashboard.DashboardPublishOptionsProperty;

  /**
   * A description for the first version of the dashboard being created.
   */
  readonly versionDescription: string;
}

/**
 * Define a QuickSight Dashboard.
 */
export class Dashboard extends Resource {

  /**
   * Imports a Dashboard based on its Id.
   */
  public static fromId(scope: Construct, id: string, dashboardId: string): IDashboard {

    class Import extends DashboardBase {

      private _dashboard: cxapi.QuickSightContextResponse.Dashboard | undefined;
      private get dashboard(): cxapi.QuickSightContextResponse.Dashboard {

        if (!this._dashboard) {
          let contextProps: cxschema.QuickSightDashboardContextQuery = {
            account: Stack.of(scope).account,
            region: Stack.of(scope).region,
            dashboardId: dashboardId,
          };

          this._dashboard = ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.QUICKSIGHT_DASHBOARD_PROVIDER,
            props: contextProps,
            dummyValue: undefined,
          }).value;

          if (!this._dashboard) {
            throw Error(`No Dashboard found in account ${contextProps.account} and region ${contextProps.region} with id ${contextProps.dashboardId}`);
          }
        }

        return this._dashboard;
      }

      private _dashboardPermissions: cxapi.QuickSightContextResponse.ResourcePermissionList | undefined;
      private get dashboardPermissions(): cxapi.QuickSightContextResponse.ResourcePermissionList {

        if (!this._dashboardPermissions) {
          let contextProps: cxschema.QuickSightDashboardContextQuery = {
            account: Stack.of(scope).account,
            region: Stack.of(scope).region,
            dashboardId: dashboardId,
          };

          this._dashboardPermissions = ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.QUICKSIGHT_DASHBOARD_PERMISSIONS_PROVIDER,
            props: contextProps,
            dummyValue: [],
          }).value;
        }

        return this._dashboardPermissions!;
      }

      private _dashboardTags: cxapi.QuickSightContextResponse.TagList | undefined;
      private get dashboardTags(): cxapi.QuickSightContextResponse.TagList {

        if (!this._dashboardTags) {
          let contextProps: cxschema.QuickSightTagsContextQuery = {
            account: Stack.of(scope).account,
            region: Stack.of(scope).region,
            resourceArn: this.dashboardArn,
          };

          this._dashboardTags = ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.QUICKSIGHT_TAGS_PROVIDER,
            props: contextProps,
            dummyValue: [],
          }).value;
        }

        return this._dashboardTags!;
      }

      public get dashboardName() {
        return this.dashboard.name;
      }

      public get permissions() {
        return this.dashboardPermissions;
      }

      public get tags() {
        let tags: Tag[] = [];

        if (this.dashboardTags) {
          this.dashboardTags.forEach(function(value) {
            tags.push(new Tag(value.key, value.value));
          });
        }

        return tags;
      }

      public get dashboardArn() {
        return this.dashboard.arn!;
      }

      public resourceId = this.dashboard.dashboardId!;

      // Dashboard specific properties
      public readonly parameters = undefined;
      public readonly dashboardPublishOptions? = undefined;

      public get versionDescription() {
        return this.dashboard.version?.description ?? '';
      };

      private _dataSets: IDataSet[] | undefined;
      public get dataSets(): IDataSet[] {
        if (!this._dataSets) {
          let dataSets: IDataSet[] = [];

          this.dashboard.version?.dataSetArns?.forEach(function (value) {
            let dataSetId: string = value.split('/')[1];
            dataSets.push(DataSet.fromId(scope, dataSetId, dataSetId));
          });

          this._dataSets = dataSets;
        }

        return this._dataSets;
      }

      private _sourceTemplate: ITemplate | undefined;
      public get sourceTemplate() {
        if (!this._sourceTemplate) {
          let templateId: string = this.dashboard.version?.sourceEntityArn?.split('/')[1]!;
          this._sourceTemplate = Template.fromId(scope, templateId, templateId);
        }

        return this._sourceTemplate;
      }

      private _theme: ITheme | undefined;
      public get theme() {
        if (!this._theme) {
          let themeId: string = this.dashboard.version?.themeArn?.split('/')[1]!;
          this._theme = Theme.fromId(scope, themeId, themeId);
        }

        return this._theme;
      }
    }

    return new Import(scope, id, {
      account: Stack.of(scope).account,
      region: Stack.of(scope).region,
    });
  }

  // Common QuickSight Resource properties
  /**
   * An ID for the dashboard that you want to create. This ID is unique per AWS Region for each AWS account.
   */
  public readonly resourceId: string;


  /**
   * The display name for the dashboard.
   *
   * @attribute
   */
  public readonly dashboardName?: string;

  /**
   * A list of Tags on this dashboard.
   *
   * @default - No tags.
   */
  public readonly tags?: Tag[];

  /**
   * A list of resource permissions on the dashboard.
   *
   * @default - Empty permissions.
   */
  public readonly permissions?: CfnDashboard.ResourcePermissionProperty[];

  /**
   * The arn of this dashboard.
   *
   * @attribute
   */
  public get dashboardArn(): string {
    return Stack.of(this.scope).formatArn({
      service: 'quicksight',
      resource: 'dataset',
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resourceName: this.resourceId,
    });
  };

  // Dashboard specific properties

  /**
   * A source entity to use for the dashboard that you're creating.
   *
   * @default - No Source Entity.
   */
  public readonly sourceTemplate?: ITemplate;

  /**
   * The parameter names and override values that you want to use.
   *
   * @default - No Parameters
   */
  public readonly parameters?: CfnDashboard.ParametersProperty;

  /**
   * The ARN for the theme to apply to the dashboard that you're creating.
   *
   * @default - The default theme.
   */
  public readonly theme?: ITheme;

  /**
   * The DataSets that are part of this Dashboard.
   */
  readonly dataSets: IDataSet[];

  /**
   * Options for publishing the dashboard when you create it.
   *
   * @attribute
   */
  readonly dashboardPublishOptions?: CfnDashboard.DashboardPublishOptionsProperty;

  /**
   * A description for the first version of the dashboard being created.
   */
  readonly versionDescription: string;

  private scope: IConstruct;

  constructor(scope: Construct, id: string, props: DashboardProps) {

    super(scope, id);

    this.resourceId = props.resourceId;
    this.scope = scope;

    this.dashboardName = props.dashboardName;
    this.tags = props.tags;
    this.permissions = props.permissions;

    this.sourceTemplate = props.sourceTemplate;
    this.parameters = props.parameters;
    this.theme = props.theme;
    this.dashboardPublishOptions = props.dashboardPublishOptions;
    this.versionDescription = props.versionDescription;

    let sourceTemplateArn: string = this.sourceTemplate!.templateArn;
    let placeholders: IDataSet[] = this.sourceTemplate!.placeholders;

    if (props.dataSets) {
      this.dataSets = props.dataSets;
    } else {
      this.dataSets = placeholders;
    }

    let dataSetReferences: CfnDashboard.DataSetReferenceProperty[] = [];

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

    //const resource: CfnDashboard =
    new CfnDashboard(this, 'Resource', {
      awsAccountId: Stack.of(scope).account,
      dashboardId: props.resourceId,
      sourceEntity: {
        sourceTemplate: {
          arn: sourceTemplateArn,
          dataSetReferences: dataSetReferences,
        },
      },

      // the properties below are optional
      dashboardPublishOptions: props.dashboardPublishOptions,
      name: this.dashboardName,
      parameters: this.parameters,
      permissions: this.permissions,
      tags: this.tags,
      themeArn: this.theme?.themeArn,
      versionDescription: this.versionDescription,
    });
  }
}