import * as iam from 'aws-cdk-lib/aws-iam';
import { ArnFormat, IResource, Lazy, Resource, Stack, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnPlaceIndex } from 'aws-cdk-lib/aws-location';
import { generateUniqueId } from './util';

/**
 * A Place Index
 */
export interface IPlaceIndex extends IResource {
  /**
   * The name of the place index
   *
   * @attribute
   */
  readonly placeIndexName: string;

  /**
   * The Amazon Resource Name (ARN) of the place index resource
   *
   * @attribute Arn,IndexArn
   */
  readonly placeIndexArn: string;
}

/**
 * Properties for a place index
 */
export interface PlaceIndexProps {
  /**
   * A name for the place index
   *
   * Must be between 1 and 100 characters and contain only alphanumeric characters,
   * hyphens, periods and underscores.
   *
   * @default - A name is automatically generated
   */
  readonly placeIndexName?: string;

  /**
   * Data source for the place index
   *
   * @default DataSource.ESRI
   */
  readonly dataSource?: DataSource;

  /**
   * Intend use for the results of an operation
   *
   * @default IntendedUse.SINGLE_USE
   */
  readonly intendedUse?: IntendedUse;

  /**
   * A description for the place index
   *
   * @default - no description
   */
  readonly description?: string;
}

/**
 * Data source for a place index
 */
export enum DataSource {
  /**
   * Esri
   *
   * @see https://docs.aws.amazon.com/location/latest/developerguide/esri.html
   */
  ESRI = 'Esri',

  /**
   * HERE
   *
   * @see https://docs.aws.amazon.com/location/latest/developerguide/HERE.html
   */
  HERE = 'Here',
}

/**
 * Intend use for the results of an operation
 */
export enum IntendedUse {
  /**
   * The results won't be stored
   */
  SINGLE_USE = 'SingleUse',

  /**
   * The result can be cached or stored in a database
   */
  STORAGE = 'Storage',
}

abstract class PlaceIndexBase extends Resource implements IPlaceIndex {
  public abstract readonly placeIndexName: string;
  public abstract readonly placeIndexArn: string;

  /**
   * Grant the given principal identity permissions to perform the actions on this place index.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: actions,
      resourceArns: [this.placeIndexArn],
    });
  }

  /**
   * Grant the given identity permissions to search using this index
   */
  public grantSearch(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee,
      'geo:SearchPlaceIndexForPosition',
      'geo:SearchPlaceIndexForSuggestions',
      'geo:SearchPlaceIndexForText',
    );
  }
}

/**
 * A Place Index
 *
 * @see https://docs.aws.amazon.com/location/latest/developerguide/places-concepts.html
 */
export class PlaceIndex extends PlaceIndexBase {
  /**
   * Use an existing place index by name
   */
  public static fromPlaceIndexName(scope: Construct, id: string, placeIndexName: string): IPlaceIndex {
    const placeIndexArn = Stack.of(scope).formatArn({
      service: 'geo',
      resource: 'place-index',
      resourceName: placeIndexName,
    });

    return PlaceIndex.fromPlaceIndexArn(scope, id, placeIndexArn);
  }

  /**
   * Use an existing place index by ARN
   */
  public static fromPlaceIndexArn(scope: Construct, id: string, placeIndexArn: string): IPlaceIndex {
    const parsedArn = Stack.of(scope).splitArn(placeIndexArn, ArnFormat.SLASH_RESOURCE_NAME);

    if (!parsedArn.resourceName) {
      throw new Error(`Place Index Arn ${placeIndexArn} does not have a resource name.`);
    }

    class Import extends PlaceIndexBase {
      public readonly placeIndexName = parsedArn.resourceName!;
      public readonly placeIndexArn = placeIndexArn;
    }

    return new Import(scope, id, {
      account: parsedArn.account,
      region: parsedArn.region,
    });
  }

  public readonly placeIndexName: string;

  public readonly placeIndexArn: string;

  /**
   * The timestamp for when the place index resource was created in ISO 8601 format
   *
   * @attribute
   */
  public readonly placeIndexCreateTime: string;

  /**
   * The timestamp for when the place index resource was last updated in ISO 8601 format
   *
   * @attribute
   */
  public readonly placeIndexUpdateTime: string;

  constructor(scope: Construct, id: string, props: PlaceIndexProps = {}) {
    if (props.description && !Token.isUnresolved(props.description) && props.description.length > 1000) {
      throw new Error(`\`description\` must be between 0 and 1000 characters. Received: ${props.description.length} characters`);
    }

    if (props.placeIndexName && !Token.isUnresolved(props.placeIndexName) && !/^[-.\w]{1,100}$/.test(props.placeIndexName)) {
      throw new Error(`Invalid place index name. The place index name must be between 1 and 100 characters and contain only alphanumeric characters, hyphens, periods and underscores. Received: ${props.placeIndexName}`);
    }

    super(scope, id, {
      physicalName: props.placeIndexName ?? Lazy.string({ produce: () => generateUniqueId(this) }),
    });

    const placeIndex = new CfnPlaceIndex(this, 'Resource', {
      indexName: this.physicalName,
      dataSource: props.dataSource ?? DataSource.ESRI,
      dataSourceConfiguration: props.intendedUse
        ? { intendedUse: props.intendedUse }
        : undefined,
      description: props.description,
    });

    this.placeIndexName = placeIndex.ref;
    this.placeIndexArn = placeIndex.attrArn;
    this.placeIndexCreateTime = placeIndex.attrCreateTime;
    this.placeIndexUpdateTime = placeIndex.attrUpdateTime;
  }

}
