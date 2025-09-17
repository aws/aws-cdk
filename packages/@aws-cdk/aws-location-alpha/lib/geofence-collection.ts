import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { ArnFormat, IResource, Lazy, Resource, Stack, Token, UnscopedValidationError, ValidationError } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnGeofenceCollection } from 'aws-cdk-lib/aws-location';
import { generateUniqueId } from './util';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';

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
  readonly kmsKey?: kms.IKeyRef;
}

/**
 * A Geofence Collection
 *
 * @see https://docs.aws.amazon.com/location/latest/developerguide/geofence-tracker-concepts.html#geofence-overview
 */
@propertyInjectable
export class GeofenceCollection extends Resource implements IGeofenceCollection {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-location-alpha.GeofenceCollection';

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
      throw new UnscopedValidationError(`Geofence Collection Arn ${geofenceCollectionArn} does not have a resource name.`);
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
    super(scope, id, {
      physicalName: props.geofenceCollectionName ?? Lazy.string({ produce: () => generateUniqueId(this) }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.description && !Token.isUnresolved(props.description) && props.description.length > 1000) {
      throw new ValidationError(`\`description\` must be between 0 and 1000 characters. Received: ${props.description.length} characters`, this);
    }

    if (props.geofenceCollectionName !== undefined && !Token.isUnresolved(props.geofenceCollectionName)) {
      if (props.geofenceCollectionName.length < 1 || props.geofenceCollectionName.length > 100) {
        throw new ValidationError(`\`geofenceCollectionName\` must be between 1 and 100 characters, got: ${props.geofenceCollectionName.length} characters.`, this);
      }

      if (!/^[-._\w]+$/.test(props.geofenceCollectionName)) {
        throw new ValidationError(`\`geofenceCollectionName\` must contain only alphanumeric characters, hyphens, periods and underscores, got: ${props.geofenceCollectionName}.`, this);
      }
    }
    const geofenceCollection = new CfnGeofenceCollection(this, 'Resource', {
      collectionName: this.physicalName,
      description: props.description,
      kmsKeyId: props.kmsKey?.keyRef.keyArn,
    });

    this.geofenceCollectionName = geofenceCollection.ref;
    this.geofenceCollectionArn = geofenceCollection.attrArn;
    this.geofenceCollectionCreateTime = geofenceCollection.attrCreateTime;
    this.geofenceCollectionUpdateTime = geofenceCollection.attrUpdateTime;
  }

  /**
   * Grant the given principal identity permissions to perform the actions on this geofence collection.
   */
  @MethodMetadata()
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
  @MethodMetadata()
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee,
      'geo:ListGeofences',
      'geo:GetGeofence',
    );
  }
}
