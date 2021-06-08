import * as cdk from '@aws-cdk/core';
import { Step } from './step';
import { AddStageOptions, Wave } from './wave';

export interface BlueprintProps {
  readonly synthStep: Step;
}

export class Blueprint {
  public readonly synthStep: Step;
  public readonly waves: Wave[];

  constructor(props: BlueprintProps) {
    this.synthStep = props.synthStep;
    this.waves = [];
  }

  public addWave(id: string, options: AddWaveOptions = {}) {
    const wave = new Wave(id, options);
    this.waves.push(wave);
    return wave;
  }

  public addStage(stage: cdk.Stage, options: AddStageOptions = {}) {
    // FIXME: we might want an anonymous wave here
    return this.addWave(stage.stageName).addStage(stage, options);
  }
}

export interface AddWaveOptions {
}