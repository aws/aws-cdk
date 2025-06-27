import { Construct } from 'constructs';
import { CfnManagedLoginBranding } from './cognito.generated';
import { IResource, Resource, Token } from '../../core';
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
 * The category that the image corresponds to in your managed login configuration.
 * Managed login has asset categories for different types of logos, backgrounds, and icons.
 */
export enum AssetCategory {
  /**
   * Favicon (ICO format)
   */
  FAVICON_ICO = 'FAVICON_ICO',

  /**
   * Favicon (SVG format)
   */
  FAVICON_SVG = 'FAVICON_SVG',

  /**
   * Email graphic
   */
  EMAIL_GRAPHIC = 'EMAIL_GRAPHIC',

  /**
   * SMS graphic
   */
  SMS_GRAPHIC = 'SMS_GRAPHIC',

  /**
   * Authentication app graphic
   */
  AUTH_APP_GRAPHIC = 'AUTH_APP_GRAPHIC',

  /**
   * Password graphic
   */
  PASSWORD_GRAPHIC = 'PASSWORD_GRAPHIC',

  /**
   * Passkey graphic
   */
  PASSKEY_GRAPHIC = 'PASSKEY_GRAPHIC',

  /**
   * Page header logo
   */
  PAGE_HEADER_LOGO = 'PAGE_HEADER_LOGO',

  /**
   * Page header background
   */
  PAGE_HEADER_BACKGROUND = 'PAGE_HEADER_BACKGROUND',

  /**
   * Page footer logo
   */
  PAGE_FOOTER_LOGO = 'PAGE_FOOTER_LOGO',

  /**
   * Page footer background
   */
  PAGE_FOOTER_BACKGROUND = 'PAGE_FOOTER_BACKGROUND',

  /**
   * Page background
   */
  PAGE_BACKGROUND = 'PAGE_BACKGROUND',

  /**
   * Form background
   */
  FORM_BACKGROUND = 'FORM_BACKGROUND',

  /**
   * Form logo
   */
  FORM_LOGO = 'FORM_LOGO',

  /**
   * Identity provider button icon
   */
  IDP_BUTTON_ICON = 'IDP_BUTTON_ICON',
}

/**
 * The display-mode target of the asset: light, dark, or dynamic (browser-adaptive).
 */
export enum ColorMode {
  /**
   * Light mode
   */
  LIGHT = 'LIGHT',

  /**
   * Dark mode
   */
  DARK = 'DARK',

  /**
   * Browser-adaptive mode (displays in all contexts)
   */
  DYNAMIC = 'DYNAMIC',
}

/**
 * The file type of the image file.
 */
export enum AssetExtension {
  /**
   * ICO file type
   */
  ICO = 'ICO',

  /**
   * JPEG file type
   */
  JPEG = 'JPEG',

  /**
   * PNG file type
   */
  PNG = 'PNG',

  /**
   * SVG file type
   */
  SVG = 'SVG',

  /**
   * WEBP file type
   */
  WEBP = 'WEBP',
}

/**
 * An asset for managed login branding
 */
export interface BrandingAsset {
  /**
   * The category that the image corresponds to in your managed login configuration.
   * Managed login has asset categories for different types of logos, backgrounds, and icons.
   */
  readonly category: AssetCategory;

  /**
   * The display-mode target of the asset: light, dark, or browser-adaptive.
   * For example, Amazon Cognito displays a dark-mode image only when the browser or application
   * is in dark mode, but displays a browser-adaptive file in all contexts.
   */
  readonly colorMode: ColorMode;

  /**
   * The file type of the image file.
   */
  readonly extension: AssetExtension;

  /**
   * The image file, in Base64-encoded binary.
   *
   * @default - No bytes are provided
   */
  readonly bytes?: string;

  /**
   * The ID of the asset.
   *
   * @default - No resource ID is provided
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
   * The user pool ID where the branding style is assigned.
   */
  readonly userPoolId: string;

  /**
   * The app client ID that you want to assign the branding style to.
   *
   * Each style is linked to an app client until it is deleted.
   *
   * @default - No specific client ID is assigned
   */
  readonly clientId?: string;

  /**
   * Name for the managed login branding.
   *
   * @default - A name is automatically generated.
   */
  readonly managedLoginBrandingName?: string;

  /**
   * An array of image files that you want to apply to roles like backgrounds, logos, and icons.
   *
   * Each object must also indicate whether it is for dark mode, light mode, or browser-adaptive mode.
   *
   * @default - No custom assets are provided
   */
  readonly assets?: BrandingAsset[];

  // TODO: create a detailed type for settings as there isn't a json schema published yet.
  /**
   * A JSON settings object with the settings that you want to apply to your style.
   *
   * The settings object has a complex structure with nested properties for components, componentClasses,
   * and categories. For the complete structure, refer to the AWS documentation or export existing branding
   * settings using the AWS CLI command:
   * `aws cognito-idp describe-managed-login-branding --user-pool-id YOUR_POOL_ID --managed-login-branding-id YOUR_BRANDING_ID`
   *
   * @default - No custom settings are provided
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-managedloginbranding.html
   */
  readonly settings?: Record<string, any>;

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
    super(scope, id, {
      physicalName: props.managedLoginBrandingName,
    });
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

    // Validate userPoolId length
    if (!Token.isUnresolved(props.userPoolId)) {
      if (props.userPoolId.length < 1 || props.userPoolId.length > 55) {
        throw new ValidationError(
          `userPoolId length must be between 1 and 55 characters, got: ${props.userPoolId.length}`,
          this,
        );
      }
    }

    // Validate assets array
    if (props.assets) {
      if (props.assets.length > 40) {
        throw new ValidationError(
          `assets array can have a maximum of 40 items, got: ${props.assets.length}`,
          this,
        );
      }

      // Validate each asset
      for (const asset of props.assets) {
        // Validate bytes length
        if (
          asset.bytes &&
          !Token.isUnresolved(asset.bytes) &&
          asset.bytes.length > 1000000
        ) {
          throw new ValidationError(
            `Asset bytes must not exceed 1000000 characters, got: ${asset.bytes.length}`,
            this,
          );
        }

        // Validate resourceId if provided
        if (asset.resourceId && !Token.isUnresolved(asset.resourceId)) {
          if (asset.resourceId.length < 1 || asset.resourceId.length > 40) {
            throw new ValidationError(
              `Asset resourceId length must be between 1 and 40 characters, got: ${asset.resourceId.length}`,
              this,
            );
          }
        }
      }
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
      userPoolId: props.userPoolId,
      clientId: props.clientId,
      assets: assets,
      settings: props.settings,
      returnMergedResources: props.returnMergedResources,
      useCognitoProvidedValues: props.useCognitoProvidedValues,
    });

    if (props.managedLoginBrandingName) {
      this.node.addMetadata(
        'aws:cdk:hasPhysicalName',
        props.managedLoginBrandingName,
      );
    }

    this.managedLoginBrandingId = this.resource.attrManagedLoginBrandingId;
  }
}
