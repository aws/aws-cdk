import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { ArnFormat, IResource, Lazy, Resource, Stack, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnGeofenceCollection } from 'aws-cdk-lib/aws-location';
import { generateUniqueId } from './util';

/**
 * A Geofence Collection
 */
export interface IGeofenceCollection extends IResource {
  /**
   * The name of the geofence collection
   *
   * @attribute
   */
  readonly geofenceCollectionName: string;

  /**
   * The Amazon Resource Name (ARN) of the geofence collection resource
   *
   * @attribute Arn, CollectionArn
   */
  readonly geofenceCollectionArn: string;
}

/**
 * Properties for a geofence collection
 */
export interface GeofenceCollectionProps {
  /**
   * A name for the geofence collection
   *
   * Must be between 1 and 100 characters and contain only alphanumeric characters,
   * hyphens, periods and underscores.
   *
   * @default - A name is automatically generated
   */
  readonly geofenceCollectionName?: string;

  /**
   * A description for the geofence collection
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The customer managed to encrypt your data.
   *
   * @default - Use an AWS managed key
   * @see https://docs.aws.amazon.com/location/latest/developerguide/encryption-at-rest.html
   */
  readonly kmsKey?: kms.IKey;
}

/**
 * A Geofence Collection
 *
 * @see https://docs.aws.amazon.com/location/latest/developerguide/geofence-tracker-concepts.html#geofence-overview
 */
export class GeofenceCollection extends Resource implements IGeofenceCollection {
  /**
   * Use an existing geofence collection by name
   */
  public static fromGeofenceCollectionName(scope: Construct, id: string, geofenceCollectionName: string): IGeofenceCollection {
    const geofenceCollectionArn = Stack.of(scope).formatArn({
      service: 'geo',
      resource: 'geofence-collection',
      resourceName: geofenceCollectionName,
    });

    return GeofenceCollection.fromGeofenceCollectionArn(scope, id, geofenceCollectionArn);
  }

  /**
   * Use an existing geofence collection by ARN
   */
  public static fromGeofenceCollectionArn(scope: Construct, id: string, geofenceCollectionArn: string): IGeofenceCollection {
    const parsedArn = Stack.of(scope).splitArn(geofenceCollectionArn, ArnFormat.SLASH_RESOURCE_NAME);

    if (!parsedArn.resourceName) {
      throw new Error(`Geofence Collection Arn ${geofenceCollectionArn} does not have a resource name.`);
    }

    class Import extends Resource implements IGeofenceCollection {
      public readonly geofenceCollectionName = parsedArn.resourceName!;
      public readonly geofenceCollectionArn = geofenceCollectionArn;
    }

    return new Import(scope, id, {
      account: parsedArn.account,
      region: parsedArn.region,
    });
  }

  public readonly geofenceCollectionName: string;

  public readonly geofenceCollectionArn: string;

  /**
   * The timestamp for when the geofence collection resource was created in ISO 8601 format
   *
   * @attribute
   */
  public readonly geofenceCollectionCreateTime: string;

  /**
   * The timestamp for when the geofence collection resource was last updated in ISO 8601 format
   *
   * @attribute
   */
  public readonly geofenceCollectionUpdateTime: string;

  constructor(scope: Construct, id: string, props: GeofenceCollectionProps = {}) {

    if (props.description && !Token.isUnresolved(props.description) && props.description.length > 1000) {
      throw new Error(`\`description\` must be between 0 and 1000 characters. Received: ${props.description.length} characters`);
    }

    if (props.geofenceCollectionName && !Token.isUnresolved(props.geofenceCollectionName) && !/^[-.\w]{1,100}$/.test(props.geofenceCollectionName)) {
      throw new Error(`Invalid geofence collection name. The geofence collection name must be between 1 and 100 characters and contain only alphanumeric characters, hyphens, periods and underscores. Received: ${props.geofenceCollectionName}`);
    }

    super(scope, id, {
      physicalName: props.geofenceCollectionName ?? Lazy.string({ produce: () => generateUniqueId(this) }),
    });

    const geofenceCollection = new CfnGeofenceCollection(this, 'Resource', {
      collectionName: this.physicalName,
      description: props.description,
      kmsKeyId: props.kmsKey?.keyArn,
    });

    this.geofenceCollectionName = geofenceCollection.ref;
    this.geofenceCollectionArn = geofenceCollection.attrArn;
    this.geofenceCollectionCreateTime = geofenceCollection.attrCreateTime;
    this.geofenceCollectionUpdateTime = geofenceCollection.attrUpdateTime;
  }

  /**
   * Grant the given principal identity permissions to perform the actions on this geofence collection.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: actions,
      resourceArns: [this.geofenceCollectionArn],
    });
  }

  /**
   * Grant the given identity permissions to read this geofence collection
   *
   * @see https://docs.aws.amazon.com/location/latest/developerguide/security_iam_id-based-policy-examples.html#security_iam_id-based-policy-examples-read-only-geofences
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee,
      'geo:ListGeofences',
      'geo:GetGeofence',
    );
  }
}
