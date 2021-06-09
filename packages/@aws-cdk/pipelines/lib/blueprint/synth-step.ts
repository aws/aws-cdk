import * as path from 'path';
import { toPosixPath } from '../private/fs';
import { mapValues, mkdict } from '../private/javascript';
import { IFileSet } from './file-set';
import { RunScript } from './run-script';

export interface SynthStepProps {
  readonly subdirectory?: string;
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
    const subdirectory = props.subdirectory ?? '.';

    super(id, {
      ...props,
      installCommands: [
        ...subdirectory !== '.' ? [`cd ${subdirectory}`] : [],
        ...props.installCommands ?? [],
      ],
      additionalInputs: mkdict(Object.entries(props.additionalInputs ?? {}).map(([dir, fileSet]) =>
        [toPosixPath(path.join(subdirectory, dir)), fileSet] as const,
      )),
      primaryOutputDirectory: props.cloudAssemblyOutputDirectory ?? 'cdk.out',
      additionalOutputDirectories: mapValues(props.additionalOutputDirectories ?? {}, dir => path.join(subdirectory, dir)),
    });
  }
}