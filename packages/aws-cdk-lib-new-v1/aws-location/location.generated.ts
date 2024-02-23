/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Location::GeofenceCollection` resource specifies the ability to detect and act when a tracked device enters or exits a defined geographical boundary known as a geofence.
 *
 * @cloudformationResource AWS::Location::GeofenceCollection
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-geofencecollection.html
 */
export class CfnGeofenceCollection extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Location::GeofenceCollection";

  /**
   * Build a CfnGeofenceCollection from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGeofenceCollection {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGeofenceCollectionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGeofenceCollection(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the geofence collection resource. Used when you need to specify a resource across all AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollection`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Synonym for `Arn` . The Amazon Resource Name (ARN) for the geofence collection resource. Used when you need to specify a resource across all AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollection`
   *
   * @cloudformationAttribute CollectionArn
   */
  public readonly attrCollectionArn: string;

  /**
   * The timestamp for when the geofence collection resource was created in [ISO 8601](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute CreateTime
   */
  public readonly attrCreateTime: string;

  /**
   * The timestamp for when the geofence collection resource was last updated in [ISO 8601](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute UpdateTime
   */
  public readonly attrUpdateTime: string;

  /**
   * A custom name for the geofence collection.
   */
  public collectionName: string;

  /**
   * An optional description for the geofence collection.
   */
  public description?: string;

  /**
   * A key identifier for an [AWS KMS customer managed key](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html) . Enter a key ID, key ARN, alias name, or alias ARN.
   */
  public kmsKeyId?: string;

  /**
   * @deprecated this property has been deprecated
   */
  public pricingPlan?: string;

  /**
   * @deprecated this property has been deprecated
   */
  public pricingPlanDataSource?: string;

  /**
   * Applies one or more tags to the geofence collection.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGeofenceCollectionProps) {
    super(scope, id, {
      "type": CfnGeofenceCollection.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "collectionName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCollectionArn = cdk.Token.asString(this.getAtt("CollectionArn", cdk.ResolutionTypeHint.STRING));
    this.attrCreateTime = cdk.Token.asString(this.getAtt("CreateTime", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateTime = cdk.Token.asString(this.getAtt("UpdateTime", cdk.ResolutionTypeHint.STRING));
    this.collectionName = props.collectionName;
    this.description = props.description;
    this.kmsKeyId = props.kmsKeyId;
    this.pricingPlan = props.pricingPlan;
    this.pricingPlanDataSource = props.pricingPlanDataSource;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "collectionName": this.collectionName,
      "description": this.description,
      "kmsKeyId": this.kmsKeyId,
      "pricingPlan": this.pricingPlan,
      "pricingPlanDataSource": this.pricingPlanDataSource,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGeofenceCollection.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGeofenceCollectionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGeofenceCollection`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-geofencecollection.html
 */
export interface CfnGeofenceCollectionProps {
  /**
   * A custom name for the geofence collection.
   *
   * Requirements:
   *
   * - Contain only alphanumeric characters (A–Z, a–z, 0–9), hyphens (-), periods (.), and underscores (_).
   * - Must be a unique geofence collection name.
   * - No spaces allowed. For example, `ExampleGeofenceCollection` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-geofencecollection.html#cfn-location-geofencecollection-collectionname
   */
  readonly collectionName: string;

  /**
   * An optional description for the geofence collection.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-geofencecollection.html#cfn-location-geofencecollection-description
   */
  readonly description?: string;

  /**
   * A key identifier for an [AWS KMS customer managed key](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html) . Enter a key ID, key ARN, alias name, or alias ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-geofencecollection.html#cfn-location-geofencecollection-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-geofencecollection.html#cfn-location-geofencecollection-pricingplan
   */
  readonly pricingPlan?: string;

  /**
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-geofencecollection.html#cfn-location-geofencecollection-pricingplandatasource
   */
  readonly pricingPlanDataSource?: string;

  /**
   * Applies one or more tags to the geofence collection.
   *
   * A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them.
   *
   * Format: `"key" : "value"`
   *
   * Restrictions:
   *
   * - Maximum 50 tags per resource
   * - Each resource tag must be unique with a maximum of one value.
   * - Maximum key length: 128 Unicode characters in UTF-8
   * - Maximum value length: 256 Unicode characters in UTF-8
   * - Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.
   * - Cannot use "aws:" as a prefix for a key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-geofencecollection.html#cfn-location-geofencecollection-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnGeofenceCollectionProps`
 *
 * @param properties - the TypeScript properties of a `CfnGeofenceCollectionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGeofenceCollectionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("collectionName", cdk.requiredValidator)(properties.collectionName));
  errors.collect(cdk.propertyValidator("collectionName", cdk.validateString)(properties.collectionName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("pricingPlan", cdk.validateString)(properties.pricingPlan));
  errors.collect(cdk.propertyValidator("pricingPlanDataSource", cdk.validateString)(properties.pricingPlanDataSource));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnGeofenceCollectionProps\"");
}

// @ts-ignore TS6133
function convertCfnGeofenceCollectionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGeofenceCollectionPropsValidator(properties).assertSuccess();
  return {
    "CollectionName": cdk.stringToCloudFormation(properties.collectionName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "PricingPlan": cdk.stringToCloudFormation(properties.pricingPlan),
    "PricingPlanDataSource": cdk.stringToCloudFormation(properties.pricingPlanDataSource),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnGeofenceCollectionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGeofenceCollectionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGeofenceCollectionProps>();
  ret.addPropertyResult("collectionName", "CollectionName", (properties.CollectionName != null ? cfn_parse.FromCloudFormation.getString(properties.CollectionName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("pricingPlan", "PricingPlan", (properties.PricingPlan != null ? cfn_parse.FromCloudFormation.getString(properties.PricingPlan) : undefined));
  ret.addPropertyResult("pricingPlanDataSource", "PricingPlanDataSource", (properties.PricingPlanDataSource != null ? cfn_parse.FromCloudFormation.getString(properties.PricingPlanDataSource) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Location::Map` resource specifies a map resource in your AWS account, which provides map tiles of different styles sourced from global location data providers.
 *
 * @cloudformationResource AWS::Location::Map
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-map.html
 */
export class CfnMap extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Location::Map";

  /**
   * Build a CfnMap from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMap {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMapPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMap(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the map resource. Used to specify a resource across all AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:maps/ExampleMap`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The timestamp for when the map resource was created in [ISO 8601](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute CreateTime
   */
  public readonly attrCreateTime: string;

  /**
   * @cloudformationAttribute DataSource
   */
  public readonly attrDataSource: string;

  /**
   * Synonym for `Arn` . The Amazon Resource Name (ARN) for the map resource. Used to specify a resource across all AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:maps/ExampleMap`
   *
   * @cloudformationAttribute MapArn
   */
  public readonly attrMapArn: string;

  /**
   * The timestamp for when the map resource was last updated in [ISO 8601](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute UpdateTime
   */
  public readonly attrUpdateTime: string;

  /**
   * Specifies the `MapConfiguration` , including the map style, for the map resource that you create.
   */
  public configuration: cdk.IResolvable | CfnMap.MapConfigurationProperty;

  /**
   * An optional description for the map resource.
   */
  public description?: string;

  /**
   * The name for the map resource.
   */
  public mapName: string;

  /**
   * No longer used. If included, the only allowed value is `RequestBasedUsage` .
   */
  public pricingPlan?: string;

  /**
   * Applies one or more tags to the map resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMapProps) {
    super(scope, id, {
      "type": CfnMap.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "configuration", this);
    cdk.requireProperty(props, "mapName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreateTime = cdk.Token.asString(this.getAtt("CreateTime", cdk.ResolutionTypeHint.STRING));
    this.attrDataSource = cdk.Token.asString(this.getAtt("DataSource", cdk.ResolutionTypeHint.STRING));
    this.attrMapArn = cdk.Token.asString(this.getAtt("MapArn", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateTime = cdk.Token.asString(this.getAtt("UpdateTime", cdk.ResolutionTypeHint.STRING));
    this.configuration = props.configuration;
    this.description = props.description;
    this.mapName = props.mapName;
    this.pricingPlan = props.pricingPlan;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configuration": this.configuration,
      "description": this.description,
      "mapName": this.mapName,
      "pricingPlan": this.pricingPlan,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMap.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMapPropsToCloudFormation(props);
  }
}

export namespace CfnMap {
  /**
   * Specifies the map tile style selected from an available provider.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-location-map-mapconfiguration.html
   */
  export interface MapConfigurationProperty {
    /**
     * Specifies the map political view selected from an available data provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-location-map-mapconfiguration.html#cfn-location-map-mapconfiguration-politicalview
     */
    readonly politicalView?: string;

    /**
     * Specifies the map style selected from an available data provider.
     *
     * Valid [Esri map styles](https://docs.aws.amazon.com/location/latest/developerguide/esri.html) :
     *
     * - `VectorEsriNavigation` – The Esri Navigation map style, which provides a detailed basemap for the world symbolized with a custom navigation map style that's designed for use during the day in mobile devices. It also includes a richer set of places, such as shops, services, restaurants, attractions, and other points of interest. Enable the `POI` layer by setting it in CustomLayers to leverage the additional places data.
     * - `RasterEsriImagery` – The Esri Imagery map style. A raster basemap that provides one meter or better satellite and aerial imagery in many parts of the world and lower resolution satellite imagery worldwide.
     * - `VectorEsriLightGrayCanvas` – The Esri Light Gray Canvas map style, which provides a detailed vector basemap with a light gray, neutral background style with minimal colors, labels, and features that's designed to draw attention to your thematic content.
     * - `VectorEsriTopographic` – The Esri Light map style, which provides a detailed vector basemap with a classic Esri map style.
     * - `VectorEsriStreets` – The Esri Street Map style, which provides a detailed vector basemap for the world symbolized with a classic Esri street map style. The vector tile layer is similar in content and style to the World Street Map raster map.
     * - `VectorEsriDarkGrayCanvas` – The Esri Dark Gray Canvas map style. A vector basemap with a dark gray, neutral background with minimal colors, labels, and features that's designed to draw attention to your thematic content.
     *
     * Valid [HERE Technologies map styles](https://docs.aws.amazon.com/location/latest/developerguide/HERE.html) :
     *
     * - `VectorHereExplore` – A default HERE map style containing a neutral, global map and its features including roads, buildings, landmarks, and water features. It also now includes a fully designed map of Japan.
     * - `RasterHereExploreSatellite` – A global map containing high resolution satellite imagery.
     * - `HybridHereExploreSatellite` – A global map displaying the road network, street names, and city labels over satellite imagery. This style will automatically retrieve both raster and vector tiles, and your charges will be based on total tiles retrieved.
     *
     * > Hybrid styles use both vector and raster tiles when rendering the map that you see. This means that more tiles are retrieved than when using either vector or raster tiles alone. Your charges will include all tiles retrieved.
     * - `VectorHereContrast` – The HERE Contrast (Berlin) map style is a high contrast detailed base map of the world that blends 3D and 2D rendering.
     *
     * > The `VectorHereContrast` style has been renamed from `VectorHereBerlin` . `VectorHereBerlin` has been deprecated, but will continue to work in applications that use it.
     * - `VectorHereExploreTruck` – A global map containing truck restrictions and attributes (e.g. width / height / HAZMAT) symbolized with highlighted segments and icons on top of HERE Explore to support use cases within transport and logistics.
     *
     * Valid [GrabMaps map styles](https://docs.aws.amazon.com/location/latest/developerguide/grab.html) :
     *
     * - `VectorGrabStandardLight` – The Grab Standard Light map style provides a basemap with detailed land use coloring, area names, roads, landmarks, and points of interest covering Southeast Asia.
     * - `VectorGrabStandardDark` – The Grab Standard Dark map style provides a dark variation of the standard basemap covering Southeast Asia.
     *
     * > Grab provides maps only for countries in Southeast Asia, and is only available in the Asia Pacific (Singapore) Region ( `ap-southeast-1` ). For more information, see [GrabMaps countries and area covered](https://docs.aws.amazon.com/location/latest/developerguide/grab.html#grab-coverage-area) .
     *
     * Valid [Open Data map styles](https://docs.aws.amazon.com/location/latest/developerguide/open-data.html) :
     *
     * - `VectorOpenDataStandardLight` – The Open Data Standard Light map style provides a detailed basemap for the world suitable for website and mobile application use. The map includes highways major roads, minor roads, railways, water features, cities, parks, landmarks, building footprints, and administrative boundaries.
     * - `VectorOpenDataStandardDark` – Open Data Standard Dark is a dark-themed map style that provides a detailed basemap for the world suitable for website and mobile application use. The map includes highways major roads, minor roads, railways, water features, cities, parks, landmarks, building footprints, and administrative boundaries.
     * - `VectorOpenDataVisualizationLight` – The Open Data Visualization Light map style is a light-themed style with muted colors and fewer features that aids in understanding overlaid data.
     * - `VectorOpenDataVisualizationDark` – The Open Data Visualization Dark map style is a dark-themed style with muted colors and fewer features that aids in understanding overlaid data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-location-map-mapconfiguration.html#cfn-location-map-mapconfiguration-style
     */
    readonly style: string;
  }
}

/**
 * Properties for defining a `CfnMap`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-map.html
 */
export interface CfnMapProps {
  /**
   * Specifies the `MapConfiguration` , including the map style, for the map resource that you create.
   *
   * The map style defines the look of maps and the data provider for your map resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-map.html#cfn-location-map-configuration
   */
  readonly configuration: cdk.IResolvable | CfnMap.MapConfigurationProperty;

  /**
   * An optional description for the map resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-map.html#cfn-location-map-description
   */
  readonly description?: string;

  /**
   * The name for the map resource.
   *
   * Requirements:
   *
   * - Must contain only alphanumeric characters (A–Z, a–z, 0–9), hyphens (-), periods (.), and underscores (_).
   * - Must be a unique map resource name.
   * - No spaces allowed. For example, `ExampleMap` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-map.html#cfn-location-map-mapname
   */
  readonly mapName: string;

  /**
   * No longer used. If included, the only allowed value is `RequestBasedUsage` .
   *
   * *Allowed Values* : `RequestBasedUsage`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-map.html#cfn-location-map-pricingplan
   */
  readonly pricingPlan?: string;

  /**
   * Applies one or more tags to the map resource.
   *
   * A tag is a key-value pair helps manage, identify, search, and filter your resources by labelling them.
   *
   * Format: `"key" : "value"`
   *
   * Restrictions:
   *
   * - Maximum 50 tags per resource
   * - Each resource tag must be unique with a maximum of one value.
   * - Maximum key length: 128 Unicode characters in UTF-8
   * - Maximum value length: 256 Unicode characters in UTF-8
   * - Can use alphanumeric characters (A–Z, a–z, 0–9), and the following characters: + - = . _ : / @.
   * - Cannot use "aws:" as a prefix for a key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-map.html#cfn-location-map-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `MapConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MapConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMapMapConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("politicalView", cdk.validateString)(properties.politicalView));
  errors.collect(cdk.propertyValidator("style", cdk.requiredValidator)(properties.style));
  errors.collect(cdk.propertyValidator("style", cdk.validateString)(properties.style));
  return errors.wrap("supplied properties not correct for \"MapConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnMapMapConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMapMapConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "PoliticalView": cdk.stringToCloudFormation(properties.politicalView),
    "Style": cdk.stringToCloudFormation(properties.style)
  };
}

// @ts-ignore TS6133
function CfnMapMapConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMap.MapConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMap.MapConfigurationProperty>();
  ret.addPropertyResult("politicalView", "PoliticalView", (properties.PoliticalView != null ? cfn_parse.FromCloudFormation.getString(properties.PoliticalView) : undefined));
  ret.addPropertyResult("style", "Style", (properties.Style != null ? cfn_parse.FromCloudFormation.getString(properties.Style) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMapProps`
 *
 * @param properties - the TypeScript properties of a `CfnMapProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMapPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configuration", cdk.requiredValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("configuration", CfnMapMapConfigurationPropertyValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("mapName", cdk.requiredValidator)(properties.mapName));
  errors.collect(cdk.propertyValidator("mapName", cdk.validateString)(properties.mapName));
  errors.collect(cdk.propertyValidator("pricingPlan", cdk.validateString)(properties.pricingPlan));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnMapProps\"");
}

// @ts-ignore TS6133
function convertCfnMapPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMapPropsValidator(properties).assertSuccess();
  return {
    "Configuration": convertCfnMapMapConfigurationPropertyToCloudFormation(properties.configuration),
    "Description": cdk.stringToCloudFormation(properties.description),
    "MapName": cdk.stringToCloudFormation(properties.mapName),
    "PricingPlan": cdk.stringToCloudFormation(properties.pricingPlan),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnMapPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMapProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMapProps>();
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? CfnMapMapConfigurationPropertyFromCloudFormation(properties.Configuration) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("mapName", "MapName", (properties.MapName != null ? cfn_parse.FromCloudFormation.getString(properties.MapName) : undefined));
  ret.addPropertyResult("pricingPlan", "PricingPlan", (properties.PricingPlan != null ? cfn_parse.FromCloudFormation.getString(properties.PricingPlan) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a place index resource in your AWS account.
 *
 * Use a place index resource to geocode addresses and other text queries by using the `SearchPlaceIndexForText` operation, and reverse geocode coordinates by using the `SearchPlaceIndexForPosition` operation, and enable autosuggestions by using the `SearchPlaceIndexForSuggestions` operation.
 *
 * > If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the [AWS service terms](https://docs.aws.amazon.com/service-terms) for more details.
 *
 * @cloudformationResource AWS::Location::PlaceIndex
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-placeindex.html
 */
export class CfnPlaceIndex extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Location::PlaceIndex";

  /**
   * Build a CfnPlaceIndex from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPlaceIndex {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPlaceIndexPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPlaceIndex(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the place index resource. Used to specify a resource across AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:place-index/ExamplePlaceIndex`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The timestamp for when the place index resource was created in [ISO 8601](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute CreateTime
   */
  public readonly attrCreateTime: string;

  /**
   * Synonym for `Arn` . The Amazon Resource Name (ARN) for the place index resource. Used to specify a resource across AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:place-index/ExamplePlaceIndex`
   *
   * @cloudformationAttribute IndexArn
   */
  public readonly attrIndexArn: string;

  /**
   * The timestamp for when the place index resource was last updated in [ISO 8601](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute UpdateTime
   */
  public readonly attrUpdateTime: string;

  /**
   * Specifies the geospatial data provider for the new place index.
   */
  public dataSource: string;

  /**
   * Specifies the data storage option requesting Places.
   */
  public dataSourceConfiguration?: CfnPlaceIndex.DataSourceConfigurationProperty | cdk.IResolvable;

  /**
   * The optional description for the place index resource.
   */
  public description?: string;

  /**
   * The name of the place index resource.
   */
  public indexName: string;

  /**
   * No longer used. If included, the only allowed value is `RequestBasedUsage` .
   */
  public pricingPlan?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPlaceIndexProps) {
    super(scope, id, {
      "type": CfnPlaceIndex.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dataSource", this);
    cdk.requireProperty(props, "indexName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreateTime = cdk.Token.asString(this.getAtt("CreateTime", cdk.ResolutionTypeHint.STRING));
    this.attrIndexArn = cdk.Token.asString(this.getAtt("IndexArn", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateTime = cdk.Token.asString(this.getAtt("UpdateTime", cdk.ResolutionTypeHint.STRING));
    this.dataSource = props.dataSource;
    this.dataSourceConfiguration = props.dataSourceConfiguration;
    this.description = props.description;
    this.indexName = props.indexName;
    this.pricingPlan = props.pricingPlan;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dataSource": this.dataSource,
      "dataSourceConfiguration": this.dataSourceConfiguration,
      "description": this.description,
      "indexName": this.indexName,
      "pricingPlan": this.pricingPlan,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPlaceIndex.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPlaceIndexPropsToCloudFormation(props);
  }
}

export namespace CfnPlaceIndex {
  /**
   * Specifies the data storage option requesting Places.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-location-placeindex-datasourceconfiguration.html
   */
  export interface DataSourceConfigurationProperty {
    /**
     * Specifies how the results of an operation will be stored by the caller.
     *
     * Valid values include:
     *
     * - `SingleUse` specifies that the results won't be stored.
     * - `Storage` specifies that the result can be cached or stored in a database.
     *
     * Default value: `SingleUse`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-location-placeindex-datasourceconfiguration.html#cfn-location-placeindex-datasourceconfiguration-intendeduse
     */
    readonly intendedUse?: string;
  }
}

/**
 * Properties for defining a `CfnPlaceIndex`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-placeindex.html
 */
export interface CfnPlaceIndexProps {
  /**
   * Specifies the geospatial data provider for the new place index.
   *
   * > This field is case-sensitive. Enter the valid values as shown. For example, entering `HERE` returns an error.
   *
   * Valid values include:
   *
   * - `Esri` – For additional information about [Esri](https://docs.aws.amazon.com/location/latest/developerguide/esri.html) 's coverage in your region of interest, see [Esri details on geocoding coverage](https://docs.aws.amazon.com/https://developers.arcgis.com/rest/geocode/api-reference/geocode-coverage.htm) .
   * - `Grab` – Grab provides place index functionality for Southeast Asia. For additional information about [GrabMaps](https://docs.aws.amazon.com/location/latest/developerguide/grab.html) ' coverage, see [GrabMaps countries and areas covered](https://docs.aws.amazon.com/location/latest/developerguide/grab.html#grab-coverage-area) .
   * - `Here` – For additional information about [HERE Technologies](https://docs.aws.amazon.com/location/latest/developerguide/HERE.html) ' coverage in your region of interest, see [HERE details on goecoding coverage](https://docs.aws.amazon.com/https://developer.here.com/documentation/geocoder/dev_guide/topics/coverage-geocoder.html) .
   *
   * > If you specify HERE Technologies ( `Here` ) as the data provider, you may not [store results](https://docs.aws.amazon.com//location-places/latest/APIReference/API_DataSourceConfiguration.html) for locations in Japan. For more information, see the [AWS Service Terms](https://docs.aws.amazon.com/service-terms/) for Amazon Location Service.
   *
   * For additional information , see [Data providers](https://docs.aws.amazon.com/location/latest/developerguide/what-is-data-provider.html) on the *Amazon Location Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-placeindex.html#cfn-location-placeindex-datasource
   */
  readonly dataSource: string;

  /**
   * Specifies the data storage option requesting Places.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-placeindex.html#cfn-location-placeindex-datasourceconfiguration
   */
  readonly dataSourceConfiguration?: CfnPlaceIndex.DataSourceConfigurationProperty | cdk.IResolvable;

  /**
   * The optional description for the place index resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-placeindex.html#cfn-location-placeindex-description
   */
  readonly description?: string;

  /**
   * The name of the place index resource.
   *
   * Requirements:
   *
   * - Contain only alphanumeric characters (A–Z, a–z, 0–9), hyphens (-), periods (.), and underscores (_).
   * - Must be a unique place index resource name.
   * - No spaces allowed. For example, `ExamplePlaceIndex` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-placeindex.html#cfn-location-placeindex-indexname
   */
  readonly indexName: string;

  /**
   * No longer used. If included, the only allowed value is `RequestBasedUsage` .
   *
   * *Allowed Values* : `RequestBasedUsage`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-placeindex.html#cfn-location-placeindex-pricingplan
   */
  readonly pricingPlan?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-placeindex.html#cfn-location-placeindex-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `DataSourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaceIndexDataSourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("intendedUse", cdk.validateString)(properties.intendedUse));
  return errors.wrap("supplied properties not correct for \"DataSourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlaceIndexDataSourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaceIndexDataSourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "IntendedUse": cdk.stringToCloudFormation(properties.intendedUse)
  };
}

// @ts-ignore TS6133
function CfnPlaceIndexDataSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaceIndex.DataSourceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaceIndex.DataSourceConfigurationProperty>();
  ret.addPropertyResult("intendedUse", "IntendedUse", (properties.IntendedUse != null ? cfn_parse.FromCloudFormation.getString(properties.IntendedUse) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPlaceIndexProps`
 *
 * @param properties - the TypeScript properties of a `CfnPlaceIndexProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaceIndexPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataSource", cdk.requiredValidator)(properties.dataSource));
  errors.collect(cdk.propertyValidator("dataSource", cdk.validateString)(properties.dataSource));
  errors.collect(cdk.propertyValidator("dataSourceConfiguration", CfnPlaceIndexDataSourceConfigurationPropertyValidator)(properties.dataSourceConfiguration));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("indexName", cdk.requiredValidator)(properties.indexName));
  errors.collect(cdk.propertyValidator("indexName", cdk.validateString)(properties.indexName));
  errors.collect(cdk.propertyValidator("pricingPlan", cdk.validateString)(properties.pricingPlan));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPlaceIndexProps\"");
}

// @ts-ignore TS6133
function convertCfnPlaceIndexPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaceIndexPropsValidator(properties).assertSuccess();
  return {
    "DataSource": cdk.stringToCloudFormation(properties.dataSource),
    "DataSourceConfiguration": convertCfnPlaceIndexDataSourceConfigurationPropertyToCloudFormation(properties.dataSourceConfiguration),
    "Description": cdk.stringToCloudFormation(properties.description),
    "IndexName": cdk.stringToCloudFormation(properties.indexName),
    "PricingPlan": cdk.stringToCloudFormation(properties.pricingPlan),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPlaceIndexPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaceIndexProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaceIndexProps>();
  ret.addPropertyResult("dataSource", "DataSource", (properties.DataSource != null ? cfn_parse.FromCloudFormation.getString(properties.DataSource) : undefined));
  ret.addPropertyResult("dataSourceConfiguration", "DataSourceConfiguration", (properties.DataSourceConfiguration != null ? CfnPlaceIndexDataSourceConfigurationPropertyFromCloudFormation(properties.DataSourceConfiguration) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("indexName", "IndexName", (properties.IndexName != null ? cfn_parse.FromCloudFormation.getString(properties.IndexName) : undefined));
  ret.addPropertyResult("pricingPlan", "PricingPlan", (properties.PricingPlan != null ? cfn_parse.FromCloudFormation.getString(properties.PricingPlan) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a route calculator resource in your AWS account.
 *
 * You can send requests to a route calculator resource to estimate travel time, distance, and get directions. A route calculator sources traffic and road network data from your chosen data provider.
 *
 * > If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the [AWS service terms](https://docs.aws.amazon.com/service-terms) for more details.
 *
 * @cloudformationResource AWS::Location::RouteCalculator
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-routecalculator.html
 */
export class CfnRouteCalculator extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Location::RouteCalculator";

  /**
   * Build a CfnRouteCalculator from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRouteCalculator {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRouteCalculatorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRouteCalculator(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the route calculator resource. Use the ARN when you specify a resource across all AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:route-calculator/ExampleCalculator`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Synonym for `Arn` . The Amazon Resource Name (ARN) for the route calculator resource. Use the ARN when you specify a resource across all AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:route-calculator/ExampleCalculator`
   *
   * @cloudformationAttribute CalculatorArn
   */
  public readonly attrCalculatorArn: string;

  /**
   * The timestamp for when the route calculator resource was created in [ISO 8601](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute CreateTime
   */
  public readonly attrCreateTime: string;

  /**
   * The timestamp for when the route calculator resource was last updated in [ISO 8601](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute UpdateTime
   */
  public readonly attrUpdateTime: string;

  /**
   * The name of the route calculator resource.
   */
  public calculatorName: string;

  /**
   * Specifies the data provider of traffic and road network data.
   */
  public dataSource: string;

  /**
   * The optional description for the route calculator resource.
   */
  public description?: string;

  /**
   * No longer used. If included, the only allowed value is `RequestBasedUsage` .
   */
  public pricingPlan?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRouteCalculatorProps) {
    super(scope, id, {
      "type": CfnRouteCalculator.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "calculatorName", this);
    cdk.requireProperty(props, "dataSource", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCalculatorArn = cdk.Token.asString(this.getAtt("CalculatorArn", cdk.ResolutionTypeHint.STRING));
    this.attrCreateTime = cdk.Token.asString(this.getAtt("CreateTime", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateTime = cdk.Token.asString(this.getAtt("UpdateTime", cdk.ResolutionTypeHint.STRING));
    this.calculatorName = props.calculatorName;
    this.dataSource = props.dataSource;
    this.description = props.description;
    this.pricingPlan = props.pricingPlan;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "calculatorName": this.calculatorName,
      "dataSource": this.dataSource,
      "description": this.description,
      "pricingPlan": this.pricingPlan,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRouteCalculator.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRouteCalculatorPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRouteCalculator`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-routecalculator.html
 */
export interface CfnRouteCalculatorProps {
  /**
   * The name of the route calculator resource.
   *
   * Requirements:
   *
   * - Can use alphanumeric characters (A–Z, a–z, 0–9) , hyphens (-), periods (.), and underscores (_).
   * - Must be a unique Route calculator resource name.
   * - No spaces allowed. For example, `ExampleRouteCalculator` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-routecalculator.html#cfn-location-routecalculator-calculatorname
   */
  readonly calculatorName: string;

  /**
   * Specifies the data provider of traffic and road network data.
   *
   * > This field is case-sensitive. Enter the valid values as shown. For example, entering `HERE` returns an error.
   *
   * Valid values include:
   *
   * - `Esri` – For additional information about [Esri](https://docs.aws.amazon.com/location/latest/developerguide/esri.html) 's coverage in your region of interest, see [Esri details on street networks and traffic coverage](https://docs.aws.amazon.com/https://doc.arcgis.com/en/arcgis-online/reference/network-coverage.htm) .
   *
   * Route calculators that use Esri as a data source only calculate routes that are shorter than 400 km.
   * - `Grab` – Grab provides routing functionality for Southeast Asia. For additional information about [GrabMaps](https://docs.aws.amazon.com/location/latest/developerguide/grab.html) ' coverage, see [GrabMaps countries and areas covered](https://docs.aws.amazon.com/location/latest/developerguide/grab.html#grab-coverage-area) .
   * - `Here` – For additional information about [HERE Technologies](https://docs.aws.amazon.com/location/latest/developerguide/HERE.html) ' coverage in your region of interest, see [HERE car routing coverage](https://docs.aws.amazon.com/https://developer.here.com/documentation/routing-api/dev_guide/topics/coverage/car-routing.html) and [HERE truck routing coverage](https://docs.aws.amazon.com/https://developer.here.com/documentation/routing-api/dev_guide/topics/coverage/truck-routing.html) .
   *
   * For additional information , see [Data providers](https://docs.aws.amazon.com/location/latest/developerguide/what-is-data-provider.html) on the *Amazon Location Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-routecalculator.html#cfn-location-routecalculator-datasource
   */
  readonly dataSource: string;

  /**
   * The optional description for the route calculator resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-routecalculator.html#cfn-location-routecalculator-description
   */
  readonly description?: string;

  /**
   * No longer used. If included, the only allowed value is `RequestBasedUsage` .
   *
   * *Allowed Values* : `RequestBasedUsage`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-routecalculator.html#cfn-location-routecalculator-pricingplan
   */
  readonly pricingPlan?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-routecalculator.html#cfn-location-routecalculator-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnRouteCalculatorProps`
 *
 * @param properties - the TypeScript properties of a `CfnRouteCalculatorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRouteCalculatorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("calculatorName", cdk.requiredValidator)(properties.calculatorName));
  errors.collect(cdk.propertyValidator("calculatorName", cdk.validateString)(properties.calculatorName));
  errors.collect(cdk.propertyValidator("dataSource", cdk.requiredValidator)(properties.dataSource));
  errors.collect(cdk.propertyValidator("dataSource", cdk.validateString)(properties.dataSource));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("pricingPlan", cdk.validateString)(properties.pricingPlan));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRouteCalculatorProps\"");
}

// @ts-ignore TS6133
function convertCfnRouteCalculatorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRouteCalculatorPropsValidator(properties).assertSuccess();
  return {
    "CalculatorName": cdk.stringToCloudFormation(properties.calculatorName),
    "DataSource": cdk.stringToCloudFormation(properties.dataSource),
    "Description": cdk.stringToCloudFormation(properties.description),
    "PricingPlan": cdk.stringToCloudFormation(properties.pricingPlan),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRouteCalculatorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRouteCalculatorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRouteCalculatorProps>();
  ret.addPropertyResult("calculatorName", "CalculatorName", (properties.CalculatorName != null ? cfn_parse.FromCloudFormation.getString(properties.CalculatorName) : undefined));
  ret.addPropertyResult("dataSource", "DataSource", (properties.DataSource != null ? cfn_parse.FromCloudFormation.getString(properties.DataSource) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("pricingPlan", "PricingPlan", (properties.PricingPlan != null ? cfn_parse.FromCloudFormation.getString(properties.PricingPlan) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a tracker resource in your AWS account , which lets you receive current and historical location of devices.
 *
 * @cloudformationResource AWS::Location::Tracker
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html
 */
export class CfnTracker extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Location::Tracker";

  /**
   * Build a CfnTracker from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTracker {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTrackerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTracker(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the tracker resource. Used when you need to specify a resource across all AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:tracker/ExampleTracker`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The timestamp for when the tracker resource was created in [ISO 8601](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute CreateTime
   */
  public readonly attrCreateTime: string;

  /**
   * Synonym for `Arn` . The Amazon Resource Name (ARN) for the tracker resource. Used when you need to specify a resource across all AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:tracker/ExampleTracker`
   *
   * @cloudformationAttribute TrackerArn
   */
  public readonly attrTrackerArn: string;

  /**
   * The timestamp for when the tracker resource was last updated in [ISO 8601](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute UpdateTime
   */
  public readonly attrUpdateTime: string;

  /**
   * An optional description for the tracker resource.
   */
  public description?: string;

  public eventBridgeEnabled?: boolean | cdk.IResolvable;

  public kmsKeyEnableGeospatialQueries?: boolean | cdk.IResolvable;

  /**
   * A key identifier for an [AWS KMS customer managed key](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html) . Enter a key ID, key ARN, alias name, or alias ARN.
   */
  public kmsKeyId?: string;

  /**
   * Specifies the position filtering for the tracker resource.
   */
  public positionFiltering?: string;

  /**
   * @deprecated this property has been deprecated
   */
  public pricingPlan?: string;

  /**
   * @deprecated this property has been deprecated
   */
  public pricingPlanDataSource?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The name for the tracker resource.
   */
  public trackerName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTrackerProps) {
    super(scope, id, {
      "type": CfnTracker.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "trackerName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreateTime = cdk.Token.asString(this.getAtt("CreateTime", cdk.ResolutionTypeHint.STRING));
    this.attrTrackerArn = cdk.Token.asString(this.getAtt("TrackerArn", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateTime = cdk.Token.asString(this.getAtt("UpdateTime", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.eventBridgeEnabled = props.eventBridgeEnabled;
    this.kmsKeyEnableGeospatialQueries = props.kmsKeyEnableGeospatialQueries;
    this.kmsKeyId = props.kmsKeyId;
    this.positionFiltering = props.positionFiltering;
    this.pricingPlan = props.pricingPlan;
    this.pricingPlanDataSource = props.pricingPlanDataSource;
    this.tags = props.tags;
    this.trackerName = props.trackerName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "eventBridgeEnabled": this.eventBridgeEnabled,
      "kmsKeyEnableGeospatialQueries": this.kmsKeyEnableGeospatialQueries,
      "kmsKeyId": this.kmsKeyId,
      "positionFiltering": this.positionFiltering,
      "pricingPlan": this.pricingPlan,
      "pricingPlanDataSource": this.pricingPlanDataSource,
      "tags": this.tags,
      "trackerName": this.trackerName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTracker.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTrackerPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTracker`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html
 */
export interface CfnTrackerProps {
  /**
   * An optional description for the tracker resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html#cfn-location-tracker-description
   */
  readonly description?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html#cfn-location-tracker-eventbridgeenabled
   */
  readonly eventBridgeEnabled?: boolean | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html#cfn-location-tracker-kmskeyenablegeospatialqueries
   */
  readonly kmsKeyEnableGeospatialQueries?: boolean | cdk.IResolvable;

  /**
   * A key identifier for an [AWS KMS customer managed key](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html) . Enter a key ID, key ARN, alias name, or alias ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html#cfn-location-tracker-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * Specifies the position filtering for the tracker resource.
   *
   * Valid values:
   *
   * - `TimeBased` - Location updates are evaluated against linked geofence collections, but not every location update is stored. If your update frequency is more often than 30 seconds, only one update per 30 seconds is stored for each unique device ID.
   * - `DistanceBased` - If the device has moved less than 30 m (98.4 ft), location updates are ignored. Location updates within this area are neither evaluated against linked geofence collections, nor stored. This helps control costs by reducing the number of geofence evaluations and historical device positions to paginate through. Distance-based filtering can also reduce the effects of GPS noise when displaying device trajectories on a map.
   * - `AccuracyBased` - If the device has moved less than the measured accuracy, location updates are ignored. For example, if two consecutive updates from a device have a horizontal accuracy of 5 m and 10 m, the second update is ignored if the device has moved less than 15 m. Ignored location updates are neither evaluated against linked geofence collections, nor stored. This can reduce the effects of GPS noise when displaying device trajectories on a map, and can help control your costs by reducing the number of geofence evaluations.
   *
   * This field is optional. If not specified, the default value is `TimeBased` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html#cfn-location-tracker-positionfiltering
   */
  readonly positionFiltering?: string;

  /**
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html#cfn-location-tracker-pricingplan
   */
  readonly pricingPlan?: string;

  /**
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html#cfn-location-tracker-pricingplandatasource
   */
  readonly pricingPlanDataSource?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html#cfn-location-tracker-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name for the tracker resource.
   *
   * Requirements:
   *
   * - Contain only alphanumeric characters (A-Z, a-z, 0-9) , hyphens (-), periods (.), and underscores (_).
   * - Must be a unique tracker resource name.
   * - No spaces allowed. For example, `ExampleTracker` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-tracker.html#cfn-location-tracker-trackername
   */
  readonly trackerName: string;
}

/**
 * Determine whether the given properties match those of a `CfnTrackerProps`
 *
 * @param properties - the TypeScript properties of a `CfnTrackerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrackerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("eventBridgeEnabled", cdk.validateBoolean)(properties.eventBridgeEnabled));
  errors.collect(cdk.propertyValidator("kmsKeyEnableGeospatialQueries", cdk.validateBoolean)(properties.kmsKeyEnableGeospatialQueries));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("positionFiltering", cdk.validateString)(properties.positionFiltering));
  errors.collect(cdk.propertyValidator("pricingPlan", cdk.validateString)(properties.pricingPlan));
  errors.collect(cdk.propertyValidator("pricingPlanDataSource", cdk.validateString)(properties.pricingPlanDataSource));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("trackerName", cdk.requiredValidator)(properties.trackerName));
  errors.collect(cdk.propertyValidator("trackerName", cdk.validateString)(properties.trackerName));
  return errors.wrap("supplied properties not correct for \"CfnTrackerProps\"");
}

// @ts-ignore TS6133
function convertCfnTrackerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrackerPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "EventBridgeEnabled": cdk.booleanToCloudFormation(properties.eventBridgeEnabled),
    "KmsKeyEnableGeospatialQueries": cdk.booleanToCloudFormation(properties.kmsKeyEnableGeospatialQueries),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "PositionFiltering": cdk.stringToCloudFormation(properties.positionFiltering),
    "PricingPlan": cdk.stringToCloudFormation(properties.pricingPlan),
    "PricingPlanDataSource": cdk.stringToCloudFormation(properties.pricingPlanDataSource),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TrackerName": cdk.stringToCloudFormation(properties.trackerName)
  };
}

// @ts-ignore TS6133
function CfnTrackerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrackerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrackerProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("eventBridgeEnabled", "EventBridgeEnabled", (properties.EventBridgeEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EventBridgeEnabled) : undefined));
  ret.addPropertyResult("kmsKeyEnableGeospatialQueries", "KmsKeyEnableGeospatialQueries", (properties.KmsKeyEnableGeospatialQueries != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KmsKeyEnableGeospatialQueries) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("positionFiltering", "PositionFiltering", (properties.PositionFiltering != null ? cfn_parse.FromCloudFormation.getString(properties.PositionFiltering) : undefined));
  ret.addPropertyResult("pricingPlan", "PricingPlan", (properties.PricingPlan != null ? cfn_parse.FromCloudFormation.getString(properties.PricingPlan) : undefined));
  ret.addPropertyResult("pricingPlanDataSource", "PricingPlanDataSource", (properties.PricingPlanDataSource != null ? cfn_parse.FromCloudFormation.getString(properties.PricingPlanDataSource) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("trackerName", "TrackerName", (properties.TrackerName != null ? cfn_parse.FromCloudFormation.getString(properties.TrackerName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Location::TrackerConsumer` resource specifies an association between a geofence collection and a tracker resource.
 *
 * The geofence collection is referred to as the *consumer* of the tracker. This allows the tracker resource to communicate location data to the linked geofence collection.
 *
 * > Currently not supported — Cross-account configurations, such as creating associations between a tracker resource in one account and a geofence collection in another account.
 *
 * @cloudformationResource AWS::Location::TrackerConsumer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-trackerconsumer.html
 */
export class CfnTrackerConsumer extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Location::TrackerConsumer";

  /**
   * Build a CfnTrackerConsumer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTrackerConsumer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTrackerConsumerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTrackerConsumer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the geofence collection to be associated to tracker resource.
   */
  public consumerArn: string;

  /**
   * The name for the tracker resource.
   */
  public trackerName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTrackerConsumerProps) {
    super(scope, id, {
      "type": CfnTrackerConsumer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "consumerArn", this);
    cdk.requireProperty(props, "trackerName", this);

    this.consumerArn = props.consumerArn;
    this.trackerName = props.trackerName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "consumerArn": this.consumerArn,
      "trackerName": this.trackerName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTrackerConsumer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTrackerConsumerPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTrackerConsumer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-trackerconsumer.html
 */
export interface CfnTrackerConsumerProps {
  /**
   * The Amazon Resource Name (ARN) for the geofence collection to be associated to tracker resource.
   *
   * Used when you need to specify a resource across all AWS .
   *
   * - Format example: `arn:aws:geo:region:account-id:geofence-collection/ExampleGeofenceCollectionConsumer`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-trackerconsumer.html#cfn-location-trackerconsumer-consumerarn
   */
  readonly consumerArn: string;

  /**
   * The name for the tracker resource.
   *
   * Requirements:
   *
   * - Contain only alphanumeric characters (A-Z, a-z, 0-9) , hyphens (-), periods (.), and underscores (_).
   * - Must be a unique tracker resource name.
   * - No spaces allowed. For example, `ExampleTracker` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-trackerconsumer.html#cfn-location-trackerconsumer-trackername
   */
  readonly trackerName: string;
}

/**
 * Determine whether the given properties match those of a `CfnTrackerConsumerProps`
 *
 * @param properties - the TypeScript properties of a `CfnTrackerConsumerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrackerConsumerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("consumerArn", cdk.requiredValidator)(properties.consumerArn));
  errors.collect(cdk.propertyValidator("consumerArn", cdk.validateString)(properties.consumerArn));
  errors.collect(cdk.propertyValidator("trackerName", cdk.requiredValidator)(properties.trackerName));
  errors.collect(cdk.propertyValidator("trackerName", cdk.validateString)(properties.trackerName));
  return errors.wrap("supplied properties not correct for \"CfnTrackerConsumerProps\"");
}

// @ts-ignore TS6133
function convertCfnTrackerConsumerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrackerConsumerPropsValidator(properties).assertSuccess();
  return {
    "ConsumerArn": cdk.stringToCloudFormation(properties.consumerArn),
    "TrackerName": cdk.stringToCloudFormation(properties.trackerName)
  };
}

// @ts-ignore TS6133
function CfnTrackerConsumerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrackerConsumerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrackerConsumerProps>();
  ret.addPropertyResult("consumerArn", "ConsumerArn", (properties.ConsumerArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConsumerArn) : undefined));
  ret.addPropertyResult("trackerName", "TrackerName", (properties.TrackerName != null ? cfn_parse.FromCloudFormation.getString(properties.TrackerName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The API key resource in your AWS account, which lets you grant actions for Amazon Location resources to the API key bearer.
 *
 * @cloudformationResource AWS::Location::APIKey
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-apikey.html
 */
export class CfnAPIKey extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Location::APIKey";

  /**
   * Build a CfnAPIKey from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAPIKey {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAPIKeyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAPIKey(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the resource. Used when you need to specify a resource across all AWS .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The timestamp for when the API key resource was created in ISO 8601 format: YYYY-MM-DDThh:mm:ss.sssZ.
   *
   * @cloudformationAttribute CreateTime
   */
  public readonly attrCreateTime: string;

  /**
   * The Amazon Resource Name (ARN) for the API key resource. Used when you need to specify a resource across all AWS .
   *
   * @cloudformationAttribute KeyArn
   */
  public readonly attrKeyArn: string;

  /**
   * The timestamp for when the API key resource was last updated in ISO 8601 format: `YYYY-MM-DDThh:mm:ss.sssZ` .
   *
   * @cloudformationAttribute UpdateTime
   */
  public readonly attrUpdateTime: string;

  /**
   * Updates the description for the API key resource.
   */
  public description?: string;

  /**
   * The optional timestamp for when the API key resource will expire in [ISO 8601 format](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) .
   */
  public expireTime?: string;

  /**
   * ForceDelete bypasses an API key's expiry conditions and deletes the key.
   */
  public forceDelete?: boolean | cdk.IResolvable;

  /**
   * The boolean flag to be included for updating `ExpireTime` or Restrictions details.
   */
  public forceUpdate?: boolean | cdk.IResolvable;

  /**
   * A custom name for the API key resource.
   */
  public keyName: string;

  /**
   * Whether the API key should expire.
   */
  public noExpiry?: boolean | cdk.IResolvable;

  /**
   * The API key restrictions for the API key resource.
   */
  public restrictions: CfnAPIKey.ApiKeyRestrictionsProperty | cdk.IResolvable;

  /**
   * Applies one or more tags to the map resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAPIKeyProps) {
    super(scope, id, {
      "type": CfnAPIKey.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "keyName", this);
    cdk.requireProperty(props, "restrictions", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreateTime = cdk.Token.asString(this.getAtt("CreateTime", cdk.ResolutionTypeHint.STRING));
    this.attrKeyArn = cdk.Token.asString(this.getAtt("KeyArn", cdk.ResolutionTypeHint.STRING));
    this.attrUpdateTime = cdk.Token.asString(this.getAtt("UpdateTime", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.expireTime = props.expireTime;
    this.forceDelete = props.forceDelete;
    this.forceUpdate = props.forceUpdate;
    this.keyName = props.keyName;
    this.noExpiry = props.noExpiry;
    this.restrictions = props.restrictions;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "expireTime": this.expireTime,
      "forceDelete": this.forceDelete,
      "forceUpdate": this.forceUpdate,
      "keyName": this.keyName,
      "noExpiry": this.noExpiry,
      "restrictions": this.restrictions,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAPIKey.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAPIKeyPropsToCloudFormation(props);
  }
}

export namespace CfnAPIKey {
  /**
   * API Restrictions on the allowed actions, resources, and referers for an API key resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-location-apikey-apikeyrestrictions.html
   */
  export interface ApiKeyRestrictionsProperty {
    /**
     * A list of allowed actions that an API key resource grants permissions to perform.
     *
     * You must have at least one action for each type of resource. For example, if you have a place resource, you must include at least one place action.
     *
     * The following are valid values for the actions.
     *
     * - *Map actions*
     *
     * - `geo:GetMap*` - Allows all actions needed for map rendering.
     * - *Place actions*
     *
     * - `geo:SearchPlaceIndexForText` - Allows geocoding.
     * - `geo:SearchPlaceIndexForPosition` - Allows reverse geocoding.
     * - `geo:SearchPlaceIndexForSuggestions` - Allows generating suggestions from text.
     * - `geo:GetPlace` - Allows finding a place by place ID.
     * - *Route actions*
     *
     * - `geo:CalculateRoute` - Allows point to point routing.
     * - `geo:CalculateRouteMatrix` - Allows calculating a matrix of routes.
     *
     * > You must use these strings exactly. For example, to provide access to map rendering, the only valid action is `geo:GetMap*` as an input to the list. `["geo:GetMap*"]` is valid but `["geo:GetMapTile"]` is not. Similarly, you cannot use `["geo:SearchPlaceIndexFor*"]` - you must list each of the Place actions separately.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-location-apikey-apikeyrestrictions.html#cfn-location-apikey-apikeyrestrictions-allowactions
     */
    readonly allowActions: Array<string>;

    /**
     * An optional list of allowed HTTP referers for which requests must originate from.
     *
     * Requests using this API key from other domains will not be allowed.
     *
     * Requirements:
     *
     * - Contain only alphanumeric characters (A–Z, a–z, 0–9) or any symbols in this list `$\-._+!*`(),;/?:@=&`
     * - May contain a percent (%) if followed by 2 hexadecimal digits (A-F, a-f, 0-9); this is used for URL encoding purposes.
     * - May contain wildcard characters question mark (?) and asterisk (*).
     *
     * Question mark (?) will replace any single character (including hexadecimal digits).
     *
     * Asterisk (*) will replace any multiple characters (including multiple hexadecimal digits).
     * - No spaces allowed. For example, `https://example.com` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-location-apikey-apikeyrestrictions.html#cfn-location-apikey-apikeyrestrictions-allowreferers
     */
    readonly allowReferers?: Array<string>;

    /**
     * A list of allowed resource ARNs that a API key bearer can perform actions on.
     *
     * - The ARN must be the correct ARN for a map, place, or route ARN. You may include wildcards in the resource-id to match multiple resources of the same type.
     * - The resources must be in the same `partition` , `region` , and `account-id` as the key that is being created.
     * - Other than wildcards, you must include the full ARN, including the `arn` , `partition` , `service` , `region` , `account-id` and `resource-id` delimited by colons (:).
     * - No spaces allowed, even with wildcards. For example, `arn:aws:geo:region: *account-id* :map/ExampleMap*` .
     *
     * For more information about ARN format, see [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-location-apikey-apikeyrestrictions.html#cfn-location-apikey-apikeyrestrictions-allowresources
     */
    readonly allowResources: Array<string>;
  }
}

/**
 * Properties for defining a `CfnAPIKey`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-apikey.html
 */
export interface CfnAPIKeyProps {
  /**
   * Updates the description for the API key resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-apikey.html#cfn-location-apikey-description
   */
  readonly description?: string;

  /**
   * The optional timestamp for when the API key resource will expire in [ISO 8601 format](https://docs.aws.amazon.com/https://www.iso.org/iso-8601-date-and-time-format.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-apikey.html#cfn-location-apikey-expiretime
   */
  readonly expireTime?: string;

  /**
   * ForceDelete bypasses an API key's expiry conditions and deletes the key.
   *
   * Set the parameter `true` to delete the key or to `false` to not preemptively delete the API key.
   *
   * Valid values: `true` , or `false` .
   *
   * > This action is irreversible. Only use ForceDelete if you are certain the key is no longer in use.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-apikey.html#cfn-location-apikey-forcedelete
   */
  readonly forceDelete?: boolean | cdk.IResolvable;

  /**
   * The boolean flag to be included for updating `ExpireTime` or Restrictions details.
   *
   * Must be set to `true` to update an API key resource that has been used in the past 7 days. `False` if force update is not preferred.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-apikey.html#cfn-location-apikey-forceupdate
   */
  readonly forceUpdate?: boolean | cdk.IResolvable;

  /**
   * A custom name for the API key resource.
   *
   * Requirements:
   *
   * - Contain only alphanumeric characters (A–Z, a–z, 0–9), hyphens (-), periods (.), and underscores (_).
   * - Must be a unique API key name.
   * - No spaces allowed. For example, `ExampleAPIKey` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-apikey.html#cfn-location-apikey-keyname
   */
  readonly keyName: string;

  /**
   * Whether the API key should expire.
   *
   * Set to `true` to set the API key to have no expiration time.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-apikey.html#cfn-location-apikey-noexpiry
   */
  readonly noExpiry?: boolean | cdk.IResolvable;

  /**
   * The API key restrictions for the API key resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-apikey.html#cfn-location-apikey-restrictions
   */
  readonly restrictions: CfnAPIKey.ApiKeyRestrictionsProperty | cdk.IResolvable;

  /**
   * Applies one or more tags to the map resource.
   *
   * A tag is a key-value pair that helps manage, identify, search, and filter your resources by labelling them.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-location-apikey.html#cfn-location-apikey-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ApiKeyRestrictionsProperty`
 *
 * @param properties - the TypeScript properties of a `ApiKeyRestrictionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAPIKeyApiKeyRestrictionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowActions", cdk.requiredValidator)(properties.allowActions));
  errors.collect(cdk.propertyValidator("allowActions", cdk.listValidator(cdk.validateString))(properties.allowActions));
  errors.collect(cdk.propertyValidator("allowReferers", cdk.listValidator(cdk.validateString))(properties.allowReferers));
  errors.collect(cdk.propertyValidator("allowResources", cdk.requiredValidator)(properties.allowResources));
  errors.collect(cdk.propertyValidator("allowResources", cdk.listValidator(cdk.validateString))(properties.allowResources));
  return errors.wrap("supplied properties not correct for \"ApiKeyRestrictionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAPIKeyApiKeyRestrictionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAPIKeyApiKeyRestrictionsPropertyValidator(properties).assertSuccess();
  return {
    "AllowActions": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowActions),
    "AllowReferers": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowReferers),
    "AllowResources": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowResources)
  };
}

// @ts-ignore TS6133
function CfnAPIKeyApiKeyRestrictionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAPIKey.ApiKeyRestrictionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAPIKey.ApiKeyRestrictionsProperty>();
  ret.addPropertyResult("allowActions", "AllowActions", (properties.AllowActions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowActions) : undefined));
  ret.addPropertyResult("allowReferers", "AllowReferers", (properties.AllowReferers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowReferers) : undefined));
  ret.addPropertyResult("allowResources", "AllowResources", (properties.AllowResources != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowResources) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAPIKeyProps`
 *
 * @param properties - the TypeScript properties of a `CfnAPIKeyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAPIKeyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("expireTime", cdk.validateString)(properties.expireTime));
  errors.collect(cdk.propertyValidator("forceDelete", cdk.validateBoolean)(properties.forceDelete));
  errors.collect(cdk.propertyValidator("forceUpdate", cdk.validateBoolean)(properties.forceUpdate));
  errors.collect(cdk.propertyValidator("keyName", cdk.requiredValidator)(properties.keyName));
  errors.collect(cdk.propertyValidator("keyName", cdk.validateString)(properties.keyName));
  errors.collect(cdk.propertyValidator("noExpiry", cdk.validateBoolean)(properties.noExpiry));
  errors.collect(cdk.propertyValidator("restrictions", cdk.requiredValidator)(properties.restrictions));
  errors.collect(cdk.propertyValidator("restrictions", CfnAPIKeyApiKeyRestrictionsPropertyValidator)(properties.restrictions));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAPIKeyProps\"");
}

// @ts-ignore TS6133
function convertCfnAPIKeyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAPIKeyPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExpireTime": cdk.stringToCloudFormation(properties.expireTime),
    "ForceDelete": cdk.booleanToCloudFormation(properties.forceDelete),
    "ForceUpdate": cdk.booleanToCloudFormation(properties.forceUpdate),
    "KeyName": cdk.stringToCloudFormation(properties.keyName),
    "NoExpiry": cdk.booleanToCloudFormation(properties.noExpiry),
    "Restrictions": convertCfnAPIKeyApiKeyRestrictionsPropertyToCloudFormation(properties.restrictions),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAPIKeyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAPIKeyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAPIKeyProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("expireTime", "ExpireTime", (properties.ExpireTime != null ? cfn_parse.FromCloudFormation.getString(properties.ExpireTime) : undefined));
  ret.addPropertyResult("forceDelete", "ForceDelete", (properties.ForceDelete != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ForceDelete) : undefined));
  ret.addPropertyResult("forceUpdate", "ForceUpdate", (properties.ForceUpdate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ForceUpdate) : undefined));
  ret.addPropertyResult("keyName", "KeyName", (properties.KeyName != null ? cfn_parse.FromCloudFormation.getString(properties.KeyName) : undefined));
  ret.addPropertyResult("noExpiry", "NoExpiry", (properties.NoExpiry != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NoExpiry) : undefined));
  ret.addPropertyResult("restrictions", "Restrictions", (properties.Restrictions != null ? CfnAPIKeyApiKeyRestrictionsPropertyFromCloudFormation(properties.Restrictions) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}