import { ArnFormat, Resource, IResource, Stack, Tag } from '@aws-cdk/core';
//import * as cr from '@aws-cdk/custom-resources';
import { QuickSight } from 'aws-sdk';
import { Construct, IConstruct } from 'constructs';
import { QsFunctions } from './qs-functions';
import { CfnTheme } from './quicksight.generated';

/**
 * A QuickSight Theme
 */
export interface ITheme extends IResource {

  // Common QuickSight Resource properties

  /**
   * An ID for the Theme that you want to create. This ID is unique per AWS Region for each AWS account.
   *
   * @attribute
   */
  readonly resourceId: string;

  /**
   * The display name for the Theme.
   *
   * @attribute
   */
  readonly themeName?: string;

  /**
   * A list of Tags on this Theme.
   *
   * @attribute
   */
  readonly tags?: Tag[];

  /**
   * A list of resource permissions on the Theme.
   *
   * @attribute
   */
  readonly permissions?: CfnTheme.ResourcePermissionProperty[];

  /**
   * The arn of this Theme.
   *
   * @attribute
   */
  readonly themeArn: string;

  // Theme specific properties

  /**
   * The theme that a custom theme will inherit from. All themes inherit from
   * one of the starting themes defined by Amazon QuickSight. For a list of the
   * starting themes, use ListThemes or choose Themes from within an analysis.
   *
   * @attribute
   */
  readonly baseTheme?: ITheme;

  /**
   * The theme configuration, which contains the theme display properties
   *
   * @attribute
   */
  readonly configuration?: CfnTheme.ThemeConfigurationProperty;

  /**
   * A description of the first version of the theme that you're creating. Every
   * time UpdateTheme is called, a new version is created. Each version of the
   * theme has a description of the version in the VersionDescription field.
   *
   * @attribute
   */
  readonly versionDescription: string;

}

abstract class ThemeBase extends Resource implements ITheme {

  // Common QuickSight Resource Properties
  public abstract readonly resourceId: string;
  public abstract readonly themeName?: string;
  public abstract readonly tags?: Tag[];
  public abstract readonly permissions?: CfnTheme.ResourcePermissionProperty[];
  public abstract readonly themeArn: string;

  // Theme specific properties
  public abstract readonly baseTheme: ITheme;
  public abstract readonly configuration?: CfnTheme.ThemeConfigurationProperty;
  public abstract readonly versionDescription: string;
}

/**
 * Properties for a Theme.
 */
export interface ThemeProps {

  // Common QuickSight Resource properties

  /**
   * An ID for the theme that you want to create. This ID is unique per AWS Region for each AWS account.
   *
   * @default - A new UUID
   */
  readonly resourceId: string;

  /**
   * The display name for the theme.
   *
   * @default - An automatically generated name.
   */
  readonly themeName: string;

  /**
   * A list of Tags on this theme.
   *
   * @default - No tags.
   */
  readonly tags?: Tag[];

  /**
   * A list of resource permissions on the theme.
   *
   * @default - Empty permissions.
   */
  readonly permissions?: CfnTheme.ResourcePermissionProperty[];

  // Theme specific properties

  /**
   * The theme that a custom theme will inherit from. All themes inherit from
   * one of the starting themes defined by Amazon QuickSight. For a list of the
   * starting themes, use ListThemes or choose Themes from within an analysis.
   *
   * @attribute
   */
  readonly baseTheme: ITheme;

  /**
   * The theme configuration, which contains the theme display properties
   *
   * @default - TODO
   */
  readonly configuration?: CfnTheme.ThemeConfigurationProperty;

  /**
   * A description of the first version of the theme that you're creating. Every
   * time UpdateTheme is called, a new version is created. Each version of the
   * theme has a description of the version in the VersionDescription field.
   *
   * @attribute
   */
  readonly versionDescription: string;
}

/**
 * Define a QuickSight Theme.
 */
export class Theme extends Resource {

  /**
   * Imports a Theme based on its Id.
   */
  public static fromId(scope: Construct, id: string, themeId: string): ITheme {

    class Import extends ThemeBase {

      private _theme: QuickSight.Theme | undefined;
      private get theme(): QuickSight.Theme {

        if (!this._theme) {
          let theme: QuickSight.Theme = {};

          Theme.quickSight.describeTheme({
            AwsAccountId: Stack.of(scope).account,
            ThemeId: themeId,
          },
          function (err, data) {
            if (!err && data.Theme) {
              theme = data.Theme;
            } else if (err) {
              throw new Error(err.message);
            } else {
              throw new Error('Theme does not exist.');
            }
          });

          this._theme = theme;
        }

        return this._theme;
      }

      private _themePermissions: QuickSight.ResourcePermission[] | undefined;
      private get themePermissions(): QuickSight.ResourcePermission[] {

        if (!this._themePermissions) {
          let permissions: QuickSight.ResourcePermission[] = [];

          Theme.quickSight.describeThemePermissions({
            AwsAccountId: Stack.of(scope).account,
            ThemeId: themeId,
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

          this._themePermissions = permissions;
        }

        return this._themePermissions;
      }

      private _themeTags: QuickSight.Tag[] | undefined;
      private get themeTags(): QuickSight.Tag[] {

        if (!this._themeTags) {
          let tags: QuickSight.Tag[] = [];

          Theme.quickSight.listTagsForResource({
            ResourceArn: this.themeArn,
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

          this._themeTags = tags;
        }

        return this._themeTags;
      }

      public get themeName() {
        return this.theme.Name;
      }

      public get permissions() {
        let permissions: CfnTheme.ResourcePermissionProperty[] = [];

        this.themePermissions.forEach(function(value: any) {
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

        if (this.themeTags) {
          this.themeTags.forEach(function(value: any) {
            if (value.Key && value.Value) {
              tags.push(new Tag(value.Key, value.Value));
            }
          });
        }

        return tags;
      }

      public get themeArn() {
        return this.theme.Arn ?? '';
      }

      public get resourceId(): string {
        return this.theme.ThemeId ?? '';
      }

      // Theme specific properties

      public get configuration() {
        let configuration: CfnTheme.ThemeConfigurationProperty | undefined;

        if (this.theme.Version?.Configuration) {
          configuration = QsFunctions.mapToCamelCase(this.theme.Version.Configuration);
        }

        return configuration;
      }

      public get versionDescription() {
        let versionDescription: string;

        if (this.theme.Version?.Description) {
          versionDescription = this.theme.Version.Description;
        } else {
          versionDescription = '';
        }

        return versionDescription;
      }

      private _baseTheme: ITheme | undefined;
      public get baseTheme(): ITheme {
        if (!this._baseTheme) {
          let baseThemeId: string = this.theme.Version?.BaseThemeId ?? '';
          this._baseTheme = Theme.fromId(scope, baseThemeId, baseThemeId);
        }

        return this._baseTheme;
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
   * An ID for the theme that you want to create. This ID is unique per AWS Region for each AWS account.
   */
  public readonly resourceId: string;

  /**
   * The display name for the theme.
   *
   * @attribute
   */
  public readonly themeName?: string;

  /**
   * A list of Tags on this theme.
   *
   * @default - No tags.
   */
  public readonly tags?: Tag[];

  /**
   * A list of resource permissions on the theme.
   *
   * @default - Empty permissions.
   */
  public readonly permissions?: CfnTheme.ResourcePermissionProperty[];

  /**
   * The arn of this theme.
   *
   * @attribute
   */
  public get themeArn(): string {
    return Stack.of(this.scope).formatArn({
      service: 'quicksight',
      resource: 'dataset',
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resourceName: this.resourceId,
    });
  };

  // Theme specific properties

  /**
   * The theme that a custom theme will inherit from. All themes inherit from
   * one of the starting themes defined by Amazon QuickSight. For a list of the
   * starting themes, use ListThemes or choose Themes from within an analysis.
   *
   * @attribute
   */
  readonly baseTheme: ITheme;

  /**
   * The theme configuration, which contains the theme display properties
   *
   * @default - TODO
   */
  readonly configuration?: CfnTheme.ThemeConfigurationProperty;

  /**
   * A description of the first version of the theme that you're creating. Every
   * time UpdateTheme is called, a new version is created. Each version of the
   * theme has a description of the version in the VersionDescription field.
   *
   * @attribute
   */
  readonly versionDescription: string;

  private scope: IConstruct;

  constructor(scope: Construct, id: string, props: ThemeProps) {

    super(scope, id);

    this.resourceId = props.resourceId;
    this.scope = scope;

    this.themeName = props.themeName;
    this.tags = props.tags;
    this.permissions = props.permissions;

    this.baseTheme = props.baseTheme;
    this.configuration = props.configuration;
    this.versionDescription = props.versionDescription;

    //const resource: CfnTheme =
    new CfnTheme(this, 'Resource', {
      awsAccountId: Stack.of(scope).account,
      themeId: this.resourceId,

      // the properties below are optional
      baseThemeId: this.baseTheme.resourceId,
      configuration: this.configuration,
      name: this.themeName,
      permissions: this.permissions,
      tags: this.tags,
      versionDescription: this.versionDescription,
    });
  }
}