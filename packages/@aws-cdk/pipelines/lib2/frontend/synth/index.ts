import { Construct } from 'constructs';
import { ExecutionGraph, PipelineGraph } from '../../graph';

export interface AddSynthToGraphOptions {
  readonly root: PipelineGraph;
  readonly parent: ExecutionGraph;
  readonly scope: Construct;
}

export abstract class Synth {
  public static standardNpm(props?: GenericSynthProps): Synth {
    return Synth.generic({
      ...props,
      installCommands: props?.installCommands ?? ['npm ci'],
      synthCommands: props?.synthCommands ?? ['npx cdk synth'],
    });
  }

  public static standardYarn(props?: GenericSynthProps): Synth {
    return Synth.generic({
      ...props,
      installCommands: props?.installCommands ?? ['yarn install --frozen-lockfile'],
      synthCommands: props?.synthCommands ?? ['yarn run cdk synth'],
    });
  }

  public static generic(props?: GenericSynthProps): Synth {
    return new GenericSynth(props);
  }

  public abstract addToExecutionGraph(options: AddSynthToGraphOptions): void;
}

import { GenericSynth, GenericSynthProps } from './generic-synth';