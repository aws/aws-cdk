import { Stack, SynthesisOptions, Synthesizer } from '@aws-cdk/cdk';
import { CloudAssembly } from '@aws-cdk/cx-api';

export class SynthUtils {
  public static toCloudFormation(stack: Stack, options: SynthesisOptions = { }): any {
    const session = this.synthesize(stack, options);
    return this.templateForStackName(session, stack.name);
  }

  public static templateForStackName(assembly: CloudAssembly, stackName: string): any {
    return assembly.getStack(stackName).template;
  }

  public static synthesize(stack: Stack, options: SynthesisOptions): CloudAssembly {
    const synth = new Synthesizer();
    return synth.synthesize(stack, options);
  }
}
