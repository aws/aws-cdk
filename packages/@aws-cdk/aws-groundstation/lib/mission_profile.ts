import { IResource, Resource } from '@aws-cdk/core';
import type { Construct } from 'constructs';
import type { TrackingConfig } from './config';
import { CfnMissionProfile } from './groundstation.generated';

export interface IMissionProfile extends IResource {}

export interface DataflowEdge {
  destination: string
  source: string
}

export interface MissionProfileProps {
  ContactPostPassDurationSeconds?: number;
  ContactPrePassDurationSeconds?: number;
  DataflowEdges: DataflowEdge[];
  MinimumViableContactDurationSeconds: number;
  Name: string;
  TrackingConfig: TrackingConfig;
}

export abstract class MissionProfile extends Resource implements IMissionProfile {
  private readonly _resource: CfnMissionProfile;

  public readonly arn: string;
  public readonly id: string
  public readonly region: string

  constructor(scope: Construct, id: string, props: MissionProfileProps) {
    super(scope, id, {
      physicalName: props.Name,
    });

    const {
      ContactPostPassDurationSeconds,
      ContactPrePassDurationSeconds,
      DataflowEdges,
      MinimumViableContactDurationSeconds,
      Name,
      TrackingConfig,
    } = props;

    const resource = new CfnMissionProfile(this, 'Resource', {
      contactPostPassDurationSeconds: ContactPostPassDurationSeconds,
      contactPrePassDurationSeconds: ContactPrePassDurationSeconds,
      dataflowEdges: DataflowEdges,
      minimumViableContactDurationSeconds: MinimumViableContactDurationSeconds,
      name: Name,
      trackingConfigArn: TrackingConfig.arn,
    });

    this._resource = resource;

    this.arn = this._resource.attrArn;
    this.id = this._resource.attrId;
    this.region = this._resource.attrRegion;
  }
}
