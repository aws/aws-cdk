import { IResource, Resource } from '@aws-cdk/core';
import type { Construct } from 'constructs';
import type { TrackingConfig } from './config';
import { CfnMissionProfile } from './groundstation.generated';

export interface IMissionProfile extends IResource {}

export interface DataflowEdge {
  readonly destination: string
  readonly source: string
}

export interface MissionProfileProps {
  readonly contactPostPassDurationSeconds?: number;
  readonly contactPrePassDurationSeconds?: number;
  readonly dataflowEdges: DataflowEdge[];
  readonly minimumViableContactDurationSeconds: number;
  readonly name: string;
  readonly trackingConfig: TrackingConfig;
}

export abstract class MissionProfile extends Resource implements IMissionProfile {
  private readonly _resource: CfnMissionProfile;

  public readonly arn: string;
  public readonly id: string
  public readonly region: string

  constructor(scope: Construct, id: string, props: MissionProfileProps) {
    const {
      contactPostPassDurationSeconds,
      contactPrePassDurationSeconds,
      dataflowEdges,
      minimumViableContactDurationSeconds,
      name,
      trackingConfig,
    } = props;

    super(scope, id, {
      physicalName: name,
    });

    const resource = new CfnMissionProfile(this, 'Resource', {
      contactPostPassDurationSeconds,
      contactPrePassDurationSeconds,
      dataflowEdges,
      minimumViableContactDurationSeconds,
      name,
      trackingConfigArn: trackingConfig.arn,
    });

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
    this.region = this._resource.attrRegion;
  }
}
