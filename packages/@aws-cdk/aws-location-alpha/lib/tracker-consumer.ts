import { Resource } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnTrackerConsumer } from 'aws-cdk-lib/aws-location';
import { ITracker } from './tracker';
import { IGeofenceCollection } from './geofence-collection';

/**
 * Properties for a tracker consumer
 */
export interface TrackerConsumerProps {
  /**
   * The geofence collection to be associated to tracker resource. Used when you need to specify a resource across all AWS.
   */
  readonly consumer: IGeofenceCollection;

  /**
   * The tracker associated with the geofence collection.
   */
  readonly tracker: ITracker;
}

/**
 * A Tracker Consumer
 */
export class TrackerConsumer extends Resource {

  constructor(scope: Construct, id: string, props: TrackerConsumerProps) {

    super(scope, id, {});

    new CfnTrackerConsumer(this, 'Resource', {
      consumerArn: props.consumer.geofenceCollectionArn,
      trackerName: props.tracker.trackerName,
    });

  }
}
