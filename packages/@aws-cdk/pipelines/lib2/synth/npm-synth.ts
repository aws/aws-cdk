import { AddSynthToGraphOptions, Synth } from '.';
import { ExecutionArtifact, ShellCommandAction } from '../graph';
import { CommandImage } from '../image';

export interface StandardSynthProps {
  readonly installCommands?: string[];
  readonly buildCommands?: string[];
  readonly synthCommands?: string[];
  readonly testCommands?: string[];
  readonly image?: CommandImage;
  readonly synthBuildsDockerImages?: boolean;
  readonly testReports?: boolean;
  readonly subdirectory?: string;
  readonly environmentVariables?: Record<string, string>;
}

export class NpmSynth extends Synth {
  constructor(private readonly props: StandardSynthProps) {
    super();
  }

  public addToExecutionGraph(options: AddSynthToGraphOptions): void {
    const action = new ShellCommandAction('Synth', {
      installCommands: this.props.installCommands ?? ['npm install'],
      buildCommands: [
        ...this.props.buildCommands ?? [],
        ...this.props.synthCommands ?? ['npx cdk synth'],
      ],
      testCommands: this.props.testCommands,
      image: this.props.image,
      subdirectory: 'SDF',
      buildsDockerImages: this.props.synthBuildsDockerImages,
      testReports: this.props.testReports,
      environmentVariables: this.props.environmentVariables,
      inpu
      outputArtifacts: [
        {

        },
      ],
    });
    const asm = new ExecutionArtifact('CloudAssemblyArtifact', action);

    options.parent.add(action);
    options.root.setCloudAssemblyArtifact(asm);
  }
}