import * as iam from 'aws-cdk-lib/aws-iam';
import { ArnFormat, IResource, Lazy, Resource, Stack, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnMap } from 'aws-cdk-lib/aws-location';
import { generateUniqueId } from './util';

/**
 * Represents the Amazon Location Service Map
 */
export interface IMap extends IResource {
  /**
   * The name of the map
   *
   * @attribute
   */
  readonly mapName: string;

  /**
   * The Amazon Resource Name (ARN) of the Map
   *
   * @attribute Arn, MapArn
   */
  readonly mapArn: string;
}

/**
 * Properties for the Amazon Location Service Map
 */
export interface MapProps {
  /**
   * A name for the map
   *
   * Must be between 1 and 100 characters and contain only alphanumeric characters,
   * hyphens, periods and underscores.
   *
   * @default - A name is automatically generated
   */
  readonly mapName?: string;

  /**
   * A description for the map
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * Specifies the map style selected from an available data provider.
   */
  readonly style: Style;

  /**
   * Specifies the custom layers for the style.
   *
   * @default - no custom layes
   */
  readonly customLayers?: CustomLayer[];

  /**
   * Specifies the map political view selected from an available data provider.
   *
   * The political view must be used in compliance with applicable laws, including those laws about mapping of the country or region where the maps,
   * images, and other data and third-party content which you access through Amazon Location Service is made available.
   *
   * @see https://docs.aws.amazon.com/location/latest/developerguide/map-concepts.html#political-views
   *
   * @default - no political view
   */
  readonly politicalView?: PoliticalView;
}

/**
 * An additional layer you can enable for a map style.
 */
export enum CustomLayer {
  /**
   * The POI custom layer adds a richer set of places, such as shops, services, restaurants, attractions, and other points of interest to your map.
   * Currently only the VectorEsriNavigation map style supports the POI custom layer.
   */
  POI = 'POI',
}

/**
 * The map style selected from an available data provider.
 *
 * @see https://docs.aws.amazon.com/location/latest/developerguide/what-is-data-provider.html
 */
export enum Style {

  /**
   * The Esri Navigation map style, which provides a detailed basemap for the world symbolized
   * with a custom navigation map style that's designed for use during the day in mobile devices.
   * It also includes a richer set of places, such as shops, services, restaurants, attractions,
   * and other points of interest. Enable the POI layer by setting it in CustomLayers to leverage
   * the additional places data.
   */
  VECTOR_ESRI_NAVIGATION = 'VectorEsriNavigation',

  /**
   * The Esri Imagery map style. A raster basemap that provides one meter or better
   * satellite and aerial imagery in many parts of the world and lower resolution
   * satellite imagery worldwide.
   */
  RASTER_ESRI_IMAGERY = 'RasterEsriImagery',

  /**
   * The Esri Light Gray Canvas map style, which provides a detailed vector basemap
   * with a light gray, neutral background style with minimal colors, labels, and features
   * that's designed to draw attention to your thematic content.
   */
  VECTOR_ESRI_LIGHT_GRAY_CANVAS = 'VectorEsriLightGrayCanvas',

  /**
   * The Esri Light map style, which provides a detailed vector basemap
   * with a classic Esri map style.
   */
  VECTOR_ESRI_TOPOGRAPHIC = 'VectorEsriTopographic',

  /**
   * The Esri Street Map style, which provides a detailed vector basemap for the world
   * symbolized with a classic Esri street map style. The vector tile layer is similar
   * in content and style to the World Street Map raster map.
   */
  VECTOR_ESRI_STREETS = 'VectorEsriStreets',

  /**
   * The Esri Dark Gray Canvas map style. A vector basemap with a dark gray,
   * neutral background with minimal colors, labels, and features that's designed
   * to draw attention to your thematic content.
   */
  VECTOR_ESRI_DARK_GRAY_CANVAS = 'VectorEsriDarkGrayCanvas',

  /**
   * A default HERE map style containing a neutral, global map and its features
   * including roads, buildings, landmarks, and water features. It also now includes
   * a fully designed map of Japan.
   */
  VECTOR_HERE_EXPLORE = 'VectorHereExplore',

  /**
   * A global map containing high resolution satellite imagery.
   */
  RASTER_HERE_EXPLORE_SATELLITE = 'RasterHereExploreSatellite',

  /**
   * A global map displaying the road network, street names, and city labels
   * over satellite imagery. This style will automatically retrieve both raster
   * and vector tiles, and your charges will be based on total tiles retrieved.
   */
  HYBRID_HERE_EXPLORE_SATELLITE = 'HybridHereExploreSatellite',

  /**
   * The HERE Contrast (Berlin) map style is a high contrast detailed base map
   * of the world that blends 3D and 2D rendering.
   */
  VECTOR_HERE_CONTRAST = 'VectorHereContrast',

  /**
   * A global map containing truck restrictions and attributes (e.g. width / height / HAZMAT)
   * symbolized with highlighted segments and icons on top of HERE Explore to support
   * use cases within transport and logistics.
   */
  VECTOR_HERE_EXPLORE_TRUCK = 'VectorHereExploreTruck',

  /**
   * The Grab Standard Light map style provides a basemap with detailed land use coloring,
   * area names, roads, landmarks, and points of interest covering Southeast Asia.
   */
  VECTOR_GRAB_STANDARD_LIGHT = 'VectorGrabStandardLight',

  /**
   * The Grab Standard Dark map style provides a dark variation of the standard basemap
   * covering Southeast Asia.
   */
  VECTOR_GRAB_STANDARD_DARK = 'VectorGrabStandardDark',

  /**
   * The Open Data Standard Light map style provides a detailed basemap for the world
   * suitable for website and mobile application use. The map includes highways major roads,
   * minor roads, railways, water features, cities, parks, landmarks, building footprints,
   * and administrative boundaries.
   */
  VECTOR_OPEN_DATA_STANDARD_LIGHT = 'VectorOpenDataStandardLight',

  /**
   * Open Data Standard Dark is a dark-themed map style that provides a detailed basemap
   * for the world suitable for website and mobile application use. The map includes highways
   * major roads, minor roads, railways, water features, cities, parks, landmarks,
   * building footprints, and administrative boundaries.
   */
  VECTOR_OPEN_DATA_STANDARD_DARK = 'VectorOpenDataStandardDark',

  /**
   * The Open Data Visualization Light map style is a light-themed style with muted colors
   * and fewer features that aids in understanding overlaid data.
   */
  VECTOR_OPEN_DATA_VISUALIZATION_LIGHT = 'VectorOpenDataVisualizationLight',

  /**
   * The Open Data Visualization Dark map style is a dark-themed style with muted colors
   * and fewer features that aids in understanding overlaid data.
   */
  VECTOR_OPEN_DATA_VISUALIZATION_DARK = 'VectorOpenDataVisualizationDark',

}

/**
 * The map political view.
 */
export enum PoliticalView {
  /**
   * An India (IND) political view
   */
  INDIA = 'IND',
}

/**
 * The Amazon Location Service Map
 *
 * @see https://docs.aws.amazon.com/location/latest/developerguide/map-concepts.html
 */
export class Map extends Resource implements IMap {
  /**
   * Use an existing map by name
   */
  public static fromMapName(scope: Construct, id: string, mapName: string): IMap {
    const mapArn = Stack.of(scope).formatArn({
      service: 'geo',
      resource: 'map',
      resourceName: mapName,
    });

    return Map.fromMapArn(scope, id, mapArn);
  }

  /**
   * Use an existing map by ARN
   */
  public static fromMapArn(scope: Construct, id: string, mapArn: string): IMap {
    const parsedArn = Stack.of(scope).splitArn(mapArn, ArnFormat.SLASH_RESOURCE_NAME);

    if (!parsedArn.resourceName) {
      throw new Error(`Map Arn ${mapArn} does not have a resource name.`);
    }

    class Import extends Resource implements IMap {
      public readonly mapName = parsedArn.resourceName!;
      public readonly mapArn = mapArn;
    }

    return new Import(scope, id, {
      account: parsedArn.account,
      region: parsedArn.region,
    });
  }

  public readonly mapName: string;

  public readonly mapArn: string;

  /**
   * The timestamp for when the map resource was created in ISO 8601 format
   *
   * @attribute
   */
  public readonly mapCreateTime: string;

  /**
   * The timestamp for when the map resource was last updated in ISO 8601 format
   *
   * @attribute
   */
  public readonly mapUpdateTime: string;

  constructor(scope: Construct, id: string, props: MapProps) {
    if (props.description && !Token.isUnresolved(props.description) && props.description.length > 1000) {
      throw new Error(`\`description\` must be between 0 and 1000 characters, got: ${props.description.length} characters.`);
    }

    if (props.mapName !== undefined && !Token.isUnresolved(props.mapName)) {
      if (props.mapName.length < 1 || props.mapName.length > 100) {
        throw new Error(`\`mapName\` must be between 1 and 100 characters, got: ${props.mapName.length} characters.`);
      }

      if (!/^[-._\w]+$/.test(props.mapName)) {
        throw new Error(`\`mapName\` must contain only alphanumeric characters, hyphens, periods and underscores, got: ${props.mapName}.`);
      }
    }

    super(scope, id, {
      physicalName: props.mapName ?? Lazy.string({ produce: () => generateUniqueId(this) }),
    });

    const map = new CfnMap(this, 'Resource', {
      configuration: {
        style: props.style,
        customLayers: props.customLayers,
        politicalView: props.politicalView,
      },
      mapName: this.physicalName,
      description: props.description,
    });

    this.mapName = map.ref;
    this.mapArn = map.attrArn;
    this.mapCreateTime = map.attrCreateTime;
    this.mapUpdateTime = map.attrUpdateTime;
  }

  /**
   * Grant the given principal identity permissions to perform the actions on this map.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: actions,
      resourceArns: [this.mapArn],
    });
  }

  /**
   * Grant the given identity permissions to rendering a map resource
   * @See https://docs.aws.amazon.com/location/latest/developerguide/security_iam_id-based-policy-examples.html#security_iam_id-based-policy-examples-get-map-tiles
   */
  public grantRendering(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee,
      'geo:GetMapTile',
      'geo:GetMapSprites',
      'geo:GetMapGlyphs',
      'geo:GetMapStyleDescriptor',
    );
  }
}
