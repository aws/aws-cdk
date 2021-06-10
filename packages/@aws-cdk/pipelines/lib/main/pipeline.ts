import { Construct } from 'constructs';
import { AddStageOpts, AddWaveOptions, Blueprint, Step } from '../blueprint';
import { IDeploymentEngine } from './engine';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Aspects, Construct as CoreConstruct, Stage } from '@aws-cdk/core';

export interface PipelineProps {
  readonly synthStep: Step;
  readonly engine: IDeploymentEngine;
}

export class Pipeline extends CoreConstruct {
  private readonly blueprint: Blueprint;
  private readonly engine: IDeploymentEngine;
  private built = false;

  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id);

    this.engine = props.engine;

    this.blueprint = new Blueprint({
      synthStep: props.synthStep,
    });

    Aspects.of(this).add({ visit: () => this.buildJustInTime() });
  }

  public addStage(stage: Stage, options?: AddStageOpts) {
    if (this.built) {
      throw new Error('addStage: can\'t add Stages anymore after build() has been called');
    }

    return this.blueprint.addStage(stage, options);
  }

  public addWave(id: string, options?: AddWaveOptions) {
    if (this.built) {
      throw new Error('addStage: can\'t add Stages anymore after build() has been called');
    }

    return this.blueprint.addWave(id, options);
  }

  public buildPipeline() {
    if (this.built) {
      throw new Error('build() has already been called: can only call it once');
    }
    this.engine.buildDeployment({ blueprint: this.blueprint, scope: this });
    this.built = true;
  }

  /**
   * Automatically call 'build()' just before synthesis if the user hasn't explicitly called it yet
   */
  private buildJustInTime() {
    if (!this.built) {
      this.buildPipeline();
    }
  }
}