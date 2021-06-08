import * as cdk from '@aws-cdk/core';
import { StageDeployment } from './stage-deployment';
import { Step } from './step';

export interface WaveProps {
  readonly pre?: Step[];
  readonly post?: Step[];
}

export class Wave {
  public readonly pre: Step[];
  public readonly post: Step[];
  public readonly stages: StageDeployment[] = [];

  constructor(public readonly id: string, props: WaveProps = {}) {
    this.pre = props.pre ?? [];
    this.post = props.post ?? [];
  }

  public addStage(stage: cdk.Stage, options: AddStageOptions = {}) {
    const ret = StageDeployment.fromStage(stage, options);
    this.stages.push(ret);
    return ret;
  }

  public addPre(...steps: Step[]) {
    this.pre.push(...steps);
  }

  public addPost(...steps: Step[]) {
    this.post.push(...steps);
  }
}

export interface AddStageOptions {
  readonly pre?: Step[];
  readonly post?: Step[];
}