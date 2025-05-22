import { Construct } from 'constructs';
import { CfnManagedLoginBranding } from './cognito.generated';
import { IUserPool } from './user-pool';
import { UserPoolClient } from './user-pool-client';
import { IResource, Resource } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Creates a new set of branding settings for a user pool style and associates it with an
 * app client. This operation is the programmatic option for the creation of a new style in
 * the branding designer.
 *
 * The ManagedLoginBranding construct allows customization of the look and feel of the
 * managed login UI for your Amazon Cognito User Pool.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-managedloginbranding.html
 */

/**
 * The category of image assets
 */
export enum BrandingAssetCategory {
  /**
   * Background image
   */
  BACKGROUND = 'BACKGROUND',

  /**
   * Company logo
   */
  LOGO = 'LOGO',

  /**
   * Favicon
   */
  FAVICON = 'FAVICON',

  /**
   * Brand square logo
   */
  BRAND_SQUARE_LOGO = 'BRAND_SQUARE_LOGO',
}

/**
 * The color mode for branding assets
 */
export enum BrandingColorMode {
  /**
   * Light mode
   */
  LIGHT = 'LIGHT',

  /**
   * Dark mode
   */
  DARK = 'DARK',

  /**
   * Browser-adaptive mode
   */
  BROWSER_ADAPTIVE = 'BROWSER_ADAPTIVE',
}

/**
 * An asset for managed login branding
 */
export interface BrandingAsset {
  /**
   * The category of the asset
   */
  readonly category: BrandingAssetCategory;

  /**
   * The color mode of the asset
   */
  readonly colorMode: BrandingColorMode;

  /**
   * The file extension of the asset
   */
  readonly extension: string;

  /**
   * The bytes of the asset
   * This should be a base64-encoded string of the image file
   */
  readonly bytes?: string;

  /**
   * Resource ID of the asset
   */
  readonly resourceId?: string;
}

/**
 * Represents a managed login branding for an Amazon Cognito User Pool.
 */
export interface IManagedLoginBranding extends IResource {
  /**
   * The ID of the managed login branding style.
   * @attribute
   */
  readonly managedLoginBrandingId: string;
}

/**
 * Properties for creating a ManagedLoginBranding
 */
export interface ManagedLoginBrandingProps {
  /**
   * The user pool where the branding style is assigned.
   */
  readonly userPool: IUserPool;

  /**
   * The app client to assign the branding style to.
   *
   * Each style is linked to an app client until it is deleted.
   *
   * @default - No specific client ID is assigned
   */
  readonly client?: UserPoolClient;

  /**
   * An array of image files that you want to apply to roles like backgrounds, logos, and icons.
   *
   * Each object must also indicate whether it is for dark mode, light mode, or browser-adaptive mode.
   *
   * @default - No custom assets are provided
   */
  readonly assets?: BrandingAsset[];

  /**
   * A JSON settings object with the settings that you want to apply to your style.
   *
   * The settings object has a complex structure with nested properties for components, componentClasses,
   * and categories. For the complete structure, refer to the AWS documentation or export existing branding
   * settings using the AWS CLI command:
   * `aws cognito-idp describe-managed-login-branding --user-pool-id YOUR_POOL_ID`
   *
   * Example:
   * ```ts
   * settings: {
   *   components: {
   *     primaryButton: {
   *       lightMode: {
   *         defaults: {
   *           backgroundColor: '0972d3ff',
   *           textColor: 'ffffffff',
   *         }
   *       }
   *     },
   *     pageBackground: {
   *       lightMode: { color: 'ffffffff' },
   *       darkMode: { color: '0f1b2aff' }
   *     }
   *   },
   *   categories: {
   *     global: {
   *       colorSchemeMode: 'LIGHT',
   *       spacingDensity: 'REGULAR'
   *     }
   *   }
   * }
   * ```
   *
   * @default - No custom settings are provided
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-managedloginbranding.html
   */
  readonly settings?: any;

  /**
   * When true, returns values for branding options that are unchanged from Amazon Cognito defaults.
   *
   * When false or omitted, returns only values that you customized in your branding style.
   *
   * @default false
   */
  readonly returnMergedResources?: boolean;

  /**
   * When true, applies the default branding style options.
   *
   * This option reverts to default style options that are managed by Amazon Cognito.
   * You can modify them later in the branding editor.
   *
   * When you specify true for this option, you must also omit values for settings and assets.
   *
   * @default false
   */
  readonly useCognitoProvidedValues?: boolean;
}

/**
 * A managed login branding for an Amazon Cognito User Pool.
 *
 * This allows you to customize the look and feel of the managed login UI for your Cognito User Pool.
 */
@propertyInjectable
export class ManagedLoginBranding
  extends Resource
  implements IManagedLoginBranding {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string =
    'aws-cdk-lib.aws-cognito.ManagedLoginBranding';

  /**
   * Import an existing ManagedLoginBranding given its ID
   */
  public static fromManagedLoginBrandingId(
    scope: Construct,
    id: string,
    managedLoginBrandingId: string,
  ): IManagedLoginBranding {
    class Import extends Resource implements IManagedLoginBranding {
      public readonly managedLoginBrandingId = managedLoginBrandingId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of the managed login branding style.
   */
  public readonly managedLoginBrandingId: string;

  private readonly resource: CfnManagedLoginBranding;

  constructor(scope: Construct, id: string, props: ManagedLoginBrandingProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Validation
    if (
      props.useCognitoProvidedValues === true &&
      (props.settings !== undefined || props.assets !== undefined)
    ) {
      throw new ValidationError(
        'When useCognitoProvidedValues is true, settings and assets must be omitted',
        this,
      );
    }

    // Convert assets to the format expected by L1 construct
    const assets = props.assets?.map((asset) => {
      return {
        category: asset.category,
        colorMode: asset.colorMode,
        extension: asset.extension,
        bytes: asset.bytes,
        resourceId: asset.resourceId,
      };
    });

    this.resource = new CfnManagedLoginBranding(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      clientId: props.client?.userPoolClientId,
      assets: assets,
      settings: props.settings,
      returnMergedResources: props.returnMergedResources,
      useCognitoProvidedValues: props.useCognitoProvidedValues,
    });

    this.managedLoginBrandingId = this.resource.attrManagedLoginBrandingId;
  }
}
