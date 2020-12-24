import { Construct } from 'constructs';
import { ExecutionGraph, ExecutionPipeline } from '../graph';
import { NpmSynth, StandardSynthProps } from './npm-synth';

export interface AddSynthToGraphOptions {
  readonly root: ExecutionPipeline;
  readonly parent: ExecutionGraph;
  readonly scope: Construct;
}

export abstract class Synth {
  public static standardNpm(props: StandardSynthProps): Synth {
    return new NpmSynth(props);
  }

  public abstract addToExecutionGraph(options: AddSynthToGraphOptions): void;
}
