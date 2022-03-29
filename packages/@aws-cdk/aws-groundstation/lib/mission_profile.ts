import { Duration, IResource, Resource } from '@aws-cdk/core';
import type { Construct } from 'constructs';
import { CfnMissionProfile } from './groundstation.generated';

/**
 * Interface for a Mission Profile
 */
export interface IMissionProfile extends IResource {}

/**
 * A dataflow edge defines from where and to where data will flow during a contact.
 */
export interface DataflowEdge {
  /**
   *   The ARN of the destination for this dataflow edge. For example, specify the ARN of a dataflow endpoint config for a downlink edge or an antenna uplink config for an uplink edge.
   */
  readonly destination: string

  /**
   *  The ARN of the source for this dataflow edge. For example, specify the ARN of an antenna downlink config for a downlink edge or a dataflow endpoint config for an uplink edge.
   */
  readonly source: string
}


/**
 *  Mission profiles specify parameters and provide references to config objects to define how Ground Station lists and executes contacts.
 */
export interface MissionProfileProps {
  /**
   *  Amount of time in seconds after a contact ends that you’d like to receive a CloudWatch Event indicating the pass has finished. For more information on CloudWatch Events, see the What Is CloudWatch Events?
   *
   * @default None
   */
  readonly contactPostPassDuration?: Duration;

  /**
   *  Amount of time in seconds prior to contact start that you'd like to receive a CloudWatch Event indicating an upcoming pass. For more information on CloudWatch Events, see the What Is CloudWatch Events?
   *
   * @default None
   */
  readonly contactPrePassDuration?: Duration;

  /**
   *  A list containing lists of config ARNs. Each list of config ARNs is an edge, with a "from" config and a "to" config.
   */
  readonly dataflowEdges: DataflowEdge[];

  /**
   *  Minimum length of a contact in seconds that Ground Station will return when listing contacts. Ground Station will not return contacts shorter than this duration.
   */
  readonly minimumViableContactDuration: Duration;

  /**
   *  The name of the mission profile.
   */
  readonly name: string;

  /**
   *  The ARN of a tracking config objects that defines how to track the satellite through the sky during a contact.
   */
  readonly trackingConfigArn: string;
}

/**
 *  Mission profiles specify parameters and provide references to config objects to define how Ground Station lists and executes contacts.
 */
export abstract class MissionProfile extends Resource implements IMissionProfile {
  private readonly _resource: CfnMissionProfile;

  /**
   * The ARN of the mission profile
   */
  public readonly arn: string;

  /**
   * The logical Id of the mission profile
   */
  public readonly id: string

  /**
   * The region of the mission profile
   */
  public readonly region: string

  constructor(scope: Construct, id: string, props: MissionProfileProps) {
    const {
      contactPostPassDuration,
      contactPrePassDuration,
      dataflowEdges,
      minimumViableContactDuration,
      name,
      trackingConfigArn,
    } = props;

    super(scope, id, {
      physicalName: name,
    });

    const resource = new CfnMissionProfile(this, 'Resource', {
      contactPostPassDurationSeconds: contactPostPassDuration?.toSeconds(),
      contactPrePassDurationSeconds: contactPrePassDuration?.toSeconds(),
      dataflowEdges,
      minimumViableContactDurationSeconds: minimumViableContactDuration.toSeconds(),
      name,
      trackingConfigArn,
    });

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
    this.region = this._resource.attrRegion;
  }
}
