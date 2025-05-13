import { ArnFormat, Aws, IResource, Lazy, Resource, Stack, Token, UnscopedValidationError, ValidationError } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnAPIKey } from 'aws-cdk-lib/aws-location';
import { generateUniqueId } from './util';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * An API Key
 */
export interface IApiKey extends IResource {
  /**
   * The name of the api key
   *
   * @attribute
   */
  readonly apiKeyName: string;

  /**
   * The Amazon Resource Name (ARN) of the api key resource
   *
   * @attribute Arn, apiKeyArn
   */
  readonly apiKeyArn: string;
}

/**
 * Properties for an API Key
 */
export interface ApiKeyProps {
  /**
   * A name for the api key
   *
   * Must be between 1 and 100 characters and contain only alphanumeric characters,
   * hyphens, periods and underscores.
   *
   * Must be a unique API key name.
   *
   * @default - A name is automatically generated
   */
  readonly apiKeyName?: string;

  /**
   * A description for the api key
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The optional timestamp for when the API key resource will expire
   *
   * `expireTime` must be set when `noExpiry` is false or undefined.
   * When `expireTime` is not set, `noExpiry` must be `true`.
   *
   * @default undefined - The API Key never expires
   */
  readonly expireTime?: Date;

  /**
   * `forceDelete` bypasses an API key's expiry conditions and deletes the key.
   * Set the parameter true to delete the key or to false to not preemptively delete the API key.
   *
   * @default undefined - not force delete
   */
  readonly forceDelete?: boolean;

  /**
   * The boolean flag to be included for updating ExpireTime or Restrictions details.
   * Must be set to true to update an API key resource that has been used in the past 7 days.
   * False if force update is not preferred.
   *
   * @default undefined - not force update
   */
  readonly forceUpdate?: boolean;

  /**
   * Whether the API key should expire.
   *
   * Set to `true` when `expireTime` is not set.
   * When you set `expireTime`, `noExpiry` must be `false` or `undefined`.
   *
   * @default undefined - The API Key expires at `expireTime`
   */
  readonly noExpiry?: boolean;

  /**
   * A list of allowed actions for Maps that an API key resource grants permissions to perform.
   *
   * @default - no actions for Maps are permitted
   */
  readonly allowMapsActions?: AllowMapsAction[];

  /**
   * A list of allowed actions for Places that an API key resource grants permissions to perform.
   *
   * @default - no actions for Places are permitted
   */
  readonly allowPlacesActions?: AllowPlacesAction[];

  /**
   * A list of allowed actions for Routes that an API key resource grants permissions to perform.
   *
   * @default - no actions for Routes are permitted
   */
  readonly allowRoutesActions?: AllowRoutesAction[];

  /**
   * An optional list of allowed HTTP referers for which requests must originate from.
   * Requests using this API key from other domains will not be allowed.
   *
   * @see https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-properties-location-apikey-apikeyrestrictions.html#cfn-location-apikey-apikeyrestrictions-allowreferers
   * @default - no Referer
   */
  readonly allowReferers?: string[];
}

/**
 * Actions for Maps that an API key resource grants permissions to perform.
 *
 * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonlocationservicemaps.html
 */
export enum AllowMapsAction {
  /**
   * Allows getting static map images.
   */
  GET_STATIC_MAP = 'geo-maps:GetStaticMap',

  /**
   * Allows getting map tiles for rendering.
   */
  GET_TILE = 'geo-maps:GetTile',

  /**
   * Allows any maps actions.
   */
  ANY = 'geo-maps:*',
}

/**
 * Actions for Places that an API key resource grants permissions to perform.
 *
 * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonlocationserviceplaces.html
 */
export enum AllowPlacesAction {
  /**
   * Allows auto-completion of search text.
   */
  AUTOCOMPLETE = 'geo-places:Autocomplete',

  /**
   * Allows finding geo coordinates of a known place.
   */
  GEOCODE = 'geo-places:Geocode',

  /**
   * Allows getting details of a place.
   */
  GET_PLACE = 'geo-places:GetPlace',

  /**
   * Allows getting nearest address to geo coordinates.
   */
  REVERSE_GEOCODE = 'geo-places:ReverseGeocode',

  /**
   * Allows category based places search around geo coordinates.
   */
  SEARCH_NEARBY = 'geo-places:SearchNearby',

  /**
   * Allows place or address search based on free-form text.
   */
  SEARCH_TEXT = 'geo-places:SearchText',

  /**
   * Allows suggestions based on an incomplete or misspelled query.
   */
  SUGGEST = 'geo-places:Suggest',

  /**
   * Allows any places actions.
   */
  ANY = 'geo-places:*',
}

/**
 * Actions for Routes that an API key resource grants permissions to perform.
 *
 * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonlocationserviceroutes.html
 */
export enum AllowRoutesAction {
  /**
   * Allows isoline calculation.
   */
  CALCULATE_ISOLINES = 'geo-routes:CalculateIsolines',

  /**
   * Allows point to point routing.
   */
  CALCULATE_ROUTES = 'geo-routes:CalculateRoutes',

  /**
   * Allows matrix routing.
   */
  CALCULATE_ROUTE_MATRIX = 'geo-routes:CalculateRouteMatrix',

  /**
   * Allows computing the best sequence of waypoints.
   */
  OPTIMIZE_WAYPOINTS = 'geo-routes:OptimizeWaypoints',

  /**
   * Allows snapping GPS points to a likely route.
   */
  SNAP_TO_ROADS = 'geo-routes:SnapToRoads',

  /**
   * Allows any routes actions.
   */
  ANY = 'geo-routes:*',
}

/**
 * An API Key
 *
 * @see https://docs.aws.amazon.com/location/latest/developerguide/using-apikeys.html
 */
export class ApiKey extends Resource implements IApiKey {
  /**
   * Use an existing api key by name
   */
  public static fromApiKeyName(scope: Construct, id: string, apiKeyName: string): IApiKey {
    const apiKeyArn = Stack.of(scope).formatArn({
      service: 'geo',
      resource: 'api-key',
      resourceName: apiKeyName,
    });

    return ApiKey.fromApiKeyArn(scope, id, apiKeyArn);
  }

  /**
   * Use an existing api key by ARN
   */
  public static fromApiKeyArn(scope: Construct, id: string, apiKeyArn: string): IApiKey {
    const parsedArn = Stack.of(scope).splitArn(apiKeyArn, ArnFormat.SLASH_RESOURCE_NAME);

    if (!parsedArn.resourceName) {
      throw new UnscopedValidationError(`API Key Arn ${apiKeyArn} does not have a resource name.`);
    }

    class Import extends Resource implements IApiKey {
      public readonly apiKeyName = parsedArn.resourceName!;
      public readonly apiKeyArn = apiKeyArn;
    }

    return new Import(scope, id, {
      account: parsedArn.account,
      region: parsedArn.region,
    });
  }

  public readonly apiKeyName: string;

  public readonly apiKeyArn: string;

  /**
   * The timestamp for when the api key resource was created in ISO 8601 format
   *
   * @attribute
   */
  public readonly apiKeyCreateTime: string;

  /**
   * The timestamp for when the api key resource was last updated in ISO 8601 format
   *
   * @attribute
   */
  public readonly apiKeyUpdateTime: string;

  constructor(scope: Construct, id: string, props: ApiKeyProps = {}) {
    super(scope, id, {
      physicalName: props.apiKeyName ?? Lazy.string({ produce: () => generateUniqueId(this) }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.description && !Token.isUnresolved(props.description) && props.description.length > 1000) {
      throw new ValidationError(`\`description\` must be between 0 and 1000 characters. Received: ${props.description.length} characters`, this);
    }

    if (props.apiKeyName !== undefined && !Token.isUnresolved(props.apiKeyName)) {
      if (props.apiKeyName.length < 1 || props.apiKeyName.length > 100) {
        throw new ValidationError(`\`apiKeyName\` must be between 1 and 100 characters, got: ${props.apiKeyName.length} characters.`, this);
      }

      if (!/^[-._\w]+$/.test(props.apiKeyName)) {
        throw new ValidationError(`\`apiKeyName\` must contain only alphanumeric characters, hyphens, periods and underscores, got: ${props.apiKeyName}.`, this);
      }
    }

    if (props.expireTime !== undefined && props.noExpiry === true) {
      throw new ValidationError('`expireTime` must not be set when `noExpiry` has value true.', this);
    }

    if (props.expireTime === undefined && props.noExpiry !== true) {
      throw new ValidationError('`expireTime` must be set when `noExpiry` is false or undefined.', this);
    }

    if (!props.allowMapsActions && !props.allowPlacesActions && !props.allowRoutesActions) {
      throw new ValidationError('At least one of `allowMapsActions`, `allowPlacesActions`, or `allowRoutesActions` must be specified.', this);
    }

    if (props.allowReferers !== undefined &&
      (props.allowReferers.length < 1 || props.allowReferers.length > 5)) {
      throw new ValidationError(`\`allowReferers\` must be between 1 and 5 elements, got: ${props.allowReferers.length} elements.`, this);
    }

    const apiKey = new CfnAPIKey(this, 'Resource', {
      keyName: this.physicalName,
      description: props.description,
      expireTime: props.expireTime?.toISOString(),
      forceDelete: props.forceDelete,
      forceUpdate: props.forceUpdate,
      noExpiry: props.noExpiry,
      restrictions: this._renderRestrictions(props),
    });

    this.apiKeyName = apiKey.ref;
    this.apiKeyArn = apiKey.attrArn;
    this.apiKeyCreateTime = apiKey.attrCreateTime;
    this.apiKeyUpdateTime = apiKey.attrUpdateTime;
  }

  /**
   * Renders the restrictions property for API Keys
   *
   * NOTE: added allowResources are AWS managed resources.
   */
  private _renderRestrictions(props: ApiKeyProps): CfnAPIKey.ApiKeyRestrictionsProperty {
    let allowResources = [];
    if (props.allowMapsActions) {
      allowResources.push(`arn:${Aws.PARTITION}:geo-maps:${Stack.of(this).region}::provider/default`);
    }
    if (props.allowPlacesActions) {
      allowResources.push(`arn:${Aws.PARTITION}:geo-places:${Stack.of(this).region}::provider/default`);
    }
    if (props.allowRoutesActions) {
      allowResources.push(`arn:${Aws.PARTITION}:geo-routes:${Stack.of(this).region}::provider/default`);
    }

    return {
      allowActions: [
        ...props.allowMapsActions ?? [],
        ...props.allowPlacesActions ?? [],
        ...props.allowRoutesActions ?? [],
      ].map((action) => action.toString()),
      allowReferers: props.allowReferers,
      allowResources,
    };
  }
}
