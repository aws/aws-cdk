import { Construct } from 'constructs';
import { ExecutionGraph, PipelineGraph } from '../../graph';
import { NpmSynth, StandardSynthProps } from './npm-synth';

export interface AddSynthToGraphOptions {
  readonly root: PipelineGraph;
  readonly parent: ExecutionGraph;
  readonly scope: Construct;
}

export abstract class Synth {
  public static standardNpm(props: StandardSynthProps): Synth {
    return new NpmSynth(props);
  }

  public abstract addToExecutionGraph(options: AddSynthToGraphOptions): void;
}
