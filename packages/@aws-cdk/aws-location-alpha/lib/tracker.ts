import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { ArnFormat, IResource, Lazy, Resource, Stack, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnTracker, CfnTrackerConsumer } from 'aws-cdk-lib/aws-location';
import { generateUniqueId } from './util';
import { IGeofenceCollection } from './geofence-collection';

/**
 * A Tracker
 */
export interface ITracker extends IResource {
  /**
   * The name of the tracker
   *
   * @attribute
   */
  readonly trackerName: string;

  /**
   * The Amazon Resource Name (ARN) of the tracker resource
   *
   * @attribute Arn, TrackerArn
   */
  readonly trackerArn: string;
}

/**
 * Properties for a tracker
 */
export interface TrackerProps {
  /**
   * A name for the tracker
   *
   * Must be between 1 and 100 characters and contain only alphanumeric characters,
   * hyphens, periods and underscores.
   *
   * @default - A name is automatically generated
   */
  readonly trackerName?: string;

  /**
   * A description for the tracker
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * Send filtered device position updates to default EventBridge bus.
   *
   * @default false
   */
  readonly eventBridgeEnabled?: boolean;

  /**
   * The customer managed key to encrypt data.
   * If you set customer managed key, the Bounding Polygon Queries feature will be disabled by default.
   * You can choose to opt-in to the Bounding Polygon Queries feature by setting the kmsKeyEnableGeospatialQueries parameter to true.
   *
   * @default - Use an AWS managed key
   */
  readonly kmsKey?: kms.IKey;

  /**
   * Whether to opt-in to the Bounding Polygon Queries feature with customer managed key
   *
   * @default false
   */
  readonly kmsKeyEnableGeospatialQueries?: boolean;

  /**
   * The position filtering for the tracker resource
   *
   * @default PositionFiltering.TIME_BASED
   */
  readonly positionFiltering?: PositionFiltering;

  /**
   * An optional list of geofence collections to associate with the tracker resource
   *
   * @default - no geofence collections are associated
   */
  readonly geofenceCollections?: IGeofenceCollection[];
}

/**
 * The position filtering for the tracker resource
 */
export enum PositionFiltering {
  /**
   * Location updates are evaluated against linked geofence collections, but not every location update is stored.
   * If your update frequency is more often than 30 seconds, only one update per 30 seconds is stored for each unique device ID.
   */
  TIME_BASED = 'TimeBased',

  /**
   * If the device has moved less than 30 m (98.4 ft), location updates are ignored.
   * Location updates within this area are neither evaluated against linked geofence collections, nor stored.
   * This helps control costs by reducing the number of geofence evaluations and historical device positions to paginate through.
   * Distance-based filtering can also reduce the effects of GPS noise when displaying device trajectories on a map.
   */
  DISTANCE_BASED = 'DistanceBased',

  /**
   * If the device has moved less than the measured accuracy, location updates are ignored.
   * For example, if two consecutive updates from a device have a horizontal accuracy of 5 m and 10 m,
   * the second update is ignored if the device has moved less than 15 m.
   * Ignored location updates are neither evaluated against linked geofence collections, nor stored.
   * This can reduce the effects of GPS noise when displaying device trajectories on a map,
   * and can help control your costs by reducing the number of geofence evaluations.
   */
  ACCURACY_BASED = 'AccuracyBased',
}

/**
 * A Tracker
 *
 * @see https://docs.aws.amazon.com/location/latest/developerguide/geofence-tracker-concepts.html#tracking-overview
 */
export class Tracker extends Resource implements ITracker {
  /**
   * Use an existing tracker by name
   */
  public static fromTrackerName(scope: Construct, id: string, trackerName: string): ITracker {
    const trackerArn = Stack.of(scope).formatArn({
      service: 'geo',
      resource: 'tracker',
      resourceName: trackerName,
    });

    return Tracker.fromTrackerArn(scope, id, trackerArn);
  }

  /**
   * Use an existing tracker by ARN
   */
  public static fromTrackerArn(scope: Construct, id: string, trackerArn: string): ITracker {
    const parsedArn = Stack.of(scope).splitArn(trackerArn, ArnFormat.SLASH_RESOURCE_NAME);

    if (!parsedArn.resourceName) {
      throw new Error(`Tracker Arn ${trackerArn} does not have a resource name.`);
    }

    class Import extends Resource implements ITracker {
      public readonly trackerName = parsedArn.resourceName!;
      public readonly trackerArn = trackerArn;
    }

    return new Import(scope, id, {
      account: parsedArn.account,
      region: parsedArn.region,
    });
  }

  public readonly trackerName: string;

  public readonly trackerArn: string;

  /**
   * The timestamp for when the tracker resource was created in ISO 8601 format
   *
   * @attribute
   */
  public readonly trackerCreateTime: string;

  /**
   * The timestamp for when the tracker resource was last updated in ISO 8601 format
   *
   * @attribute
   */
  public readonly trackerUpdateTime: string;

  constructor(scope: Construct, id: string, props: TrackerProps = {}) {

    if (props.description && !Token.isUnresolved(props.description) && props.description.length > 1000) {
      throw new Error(`\`description\` must be between 0 and 1000 characters. Received: ${props.description.length} characters`);
    }

    if (props.trackerName !== undefined && !Token.isUnresolved(props.trackerName)) {
      if (props.trackerName.length < 1 || props.trackerName.length > 100) {
        throw new Error(`\`trackerName\` must be between 1 and 100 characters, got: ${props.trackerName.length} characters.`);
      }

      if (!/^[-._\w]+$/.test(props.trackerName)) {
        throw new Error(`\`trackerName\` must contain only alphanumeric characters, hyphens, periods and underscores, got: ${props.trackerName}.`);
      }
    }

    if (!Token.isUnresolved(props.kmsKey)
      && !props.kmsKey
      && props.kmsKeyEnableGeospatialQueries
    ) {
      throw new Error('`kmsKeyEnableGeospatialQueries` can only be enabled that are configured to use an AWS KMS customer managed key');
    }

    super(scope, id, {
      physicalName: props.trackerName ?? Lazy.string({ produce: () => generateUniqueId(this) }),
    });

    const tracker = new CfnTracker(this, 'Resource', {
      trackerName: this.physicalName,
      description: props.description,
      eventBridgeEnabled: props.eventBridgeEnabled,
      kmsKeyEnableGeospatialQueries: props.kmsKeyEnableGeospatialQueries,
      kmsKeyId: props.kmsKey?.keyArn,
      positionFiltering: props.positionFiltering,
    });

    props.geofenceCollections?.forEach((collection) => {
      new CfnTrackerConsumer(this, `TrackerConsumer${collection.node.id}`, {
        consumerArn: collection.geofenceCollectionArn,
        trackerName: Lazy.string({ produce: () => this.trackerName }),
      });
    });

    this.trackerName = tracker.ref;
    this.trackerArn = tracker.attrArn;
    this.trackerCreateTime = tracker.attrCreateTime;
    this.trackerUpdateTime = tracker.attrUpdateTime;
  }

  /**
   * Add Geofence Collections which are associated to the tracker resource.
   */
  public addGeofenceCollections(...geofenceCollections: IGeofenceCollection[]) {
    geofenceCollections.forEach((collection) => {
      new CfnTrackerConsumer(this, `TrackerConsumer${collection.node.id}`, {
        consumerArn: collection.geofenceCollectionArn,
        trackerName: Lazy.string({ produce: () => this.trackerName }),
      });
    });
  }

  /**
   * Grant the given principal identity permissions to perform the actions on this tracker.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: actions,
      resourceArns: [this.trackerArn],
    });
  }

  /**
   * Grant the given identity permissions to update device positions for a tracker
   *
   * @see https://docs.aws.amazon.com/location/latest/developerguide/security_iam_id-based-policy-examples.html#security_iam_id-based-policy-examples-read-only-trackers
   */
  public grantUpdateDevicePositions(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee,
      'geo:BatchUpdateDevicePosition',
    );
  }

  /**
   * Grant the given identity permissions to read device positions from a tracker
   *
   * @see https://docs.aws.amazon.com/location/latest/developerguide/security_iam_id-based-policy-examples.html#security_iam_id-based-policy-examples-read-only-trackers
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: [
        'geo:BatchGetDevicePosition',
        'geo:GetDevicePosition',
        'geo:GetDevicePositionHistory',
      ],
      resourceArns: [`${this.trackerArn}/*`],
    });
  }
}
