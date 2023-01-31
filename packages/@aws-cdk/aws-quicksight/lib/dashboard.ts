import { ArnFormat, Resource, IResource, Stack, Tag } from '@aws-cdk/core';
//import * as cr from '@aws-cdk/custom-resources';
import { QuickSight } from 'aws-sdk';
import { Construct, IConstruct } from 'constructs';
import { DataSet, IDataSet } from './data-set';
//import { QsFunctions } from './qs-functions';
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

      private _dashboard: QuickSight.Dashboard | undefined;
      private get dashboard(): QuickSight.Dashboard {

        if (!this._dashboard) {
          let dashboard: QuickSight.Dashboard = {};

          Dashboard.quickSight.describeDashboard({
            AwsAccountId: Stack.of(scope).account,
            DashboardId: dashboardId,
          },
          function (err, data) {
            if (!err && data.Dashboard) {
              dashboard = data.Dashboard;
            } else if (err) {
              throw new Error(err.message);
            } else {
              throw new Error('Dashboard does not exist.');
            }
          });

          this._dashboard = dashboard;
        }

        return this._dashboard;
      }

      private _dashboardPermissions: QuickSight.ResourcePermission[] | undefined;
      private get dashboardPermissions(): QuickSight.ResourcePermission[] {

        if (!this._dashboardPermissions) {
          let permissions: QuickSight.ResourcePermission[] = [];

          Dashboard.quickSight.describeDashboardPermissions({
            AwsAccountId: Stack.of(scope).account,
            DashboardId: dashboardId,
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

          this._dashboardPermissions = permissions;
        }

        return this._dashboardPermissions;
      }

      private _dashboardTags: QuickSight.Tag[] | undefined;
      private get dashboardTags(): QuickSight.Tag[] {

        if (!this._dashboardTags) {
          let tags: QuickSight.Tag[] = [];

          Dashboard.quickSight.listTagsForResource({
            ResourceArn: this.dashboardArn,
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

          this._dashboardTags = tags;
        }

        return this._dashboardTags;
      }

      public get dashboardName() {
        return this.dashboard.Name;
      }

      public get permissions() {
        let permissions: CfnDashboard.ResourcePermissionProperty[] = [];

        this.dashboardPermissions.forEach(function(value: any) {
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

        if (this.dashboardTags) {
          this.dashboardTags.forEach(function(value: any) {
            if (value.Key && value.Value) {
              tags.push(new Tag(value.Key, value.Value));
            }
          });
        }

        return tags;
      }

      public get dashboardArn() {
        return this.dashboard.Arn ?? '';
      }

      public get resourceId(): string {
        return this.dashboard.DashboardId ?? '';
      }

      // Dashboard specific properties
      public readonly parameters = undefined;
      public readonly dashboardPublishOptions? = undefined;

      public get versionDescription() {
        let versionDescription: string;
        if (this.dashboard.Version?.Description) {
          versionDescription = this.dashboard.Version?.Description;
        } else {
          versionDescription = '';
        }

        return versionDescription;
      };

      private _dataSets: IDataSet[] | undefined;
      public get dataSets(): IDataSet[] {
        if (!this._dataSets) {
          let dataSets: IDataSet[] = [];

          this.dashboard.Version?.DataSetArns?.forEach(function (value: any) {
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
          let templateId: string = this.dashboard.Version?.SourceEntityArn?.split('/')[1] ?? '';
          this._sourceTemplate = Template.fromId(scope, templateId, templateId);
        }

        return this._sourceTemplate;
      }

      private _theme: ITheme | undefined;
      public get theme() {
        if (!this._theme) {
          let themeId: string = this.dashboard.Version?.ThemeArn?.split('/')[1] ?? '';
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

  private static quickSight: QuickSight = new QuickSight;

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