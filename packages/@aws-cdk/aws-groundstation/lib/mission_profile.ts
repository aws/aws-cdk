import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { TrackingConfig } from './config';
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

export abstract class MissionProfie extends Resource implements IMissionProfile {
  private readonly _resource: CfnMissionProfile;

  constructor(scope: Construct, id: string, props: MissionProfileProps) {
    super(scope, id, {
      physicalName: props.Name,
    });

    const resource = new CfnMissionProfile(this, 'Resource', {
      contactPostPassDurationSeconds: props.ContactPostPassDurationSeconds,
      contactPrePassDurationSeconds: props.ContactPrePassDurationSeconds,
      dataflowEdges: props.DataflowEdges,
      minimumViableContactDurationSeconds: props.MinimumViableContactDurationSeconds,
      name: props.Name,
      trackingConfigArn: props.TrackingConfig.trackingConfigArn,
    });

    this._resource = resource;
  }
}
