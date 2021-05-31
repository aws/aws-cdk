import { Construct } from 'constructs';
import { RolloutWorkflow } from '../workflow';

export interface RenderBackendOptions {
  readonly scope: Construct;
  readonly workflow: RolloutWorkflow;
}


export abstract class Backend {
  public abstract renderBackend(options: RenderBackendOptions): void;
}
