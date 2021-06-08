import { IFileSet } from './file-set';
import { RunScript } from './run-script';

export interface SynthStepProps {
  readonly commands: string[];
  readonly installCommands?: string[];
  readonly env?: Record<string, string>;

  readonly input?: IFileSet;
  readonly additionalInputs?: Record<string, IFileSet>;

  readonly cloudAssemblyOutputDirectory?: string;
  readonly additionalOutputDirectories?: Record<string, string>;
}

export class SynthStep extends RunScript {
  constructor(id: string, props: SynthStepProps) {
    super(id, {
      ...props,
      primaryOutputDirectory: props.cloudAssemblyOutputDirectory ?? 'cdk.out',
    });
  }
}