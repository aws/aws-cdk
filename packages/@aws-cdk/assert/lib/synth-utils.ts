import { App, Stack, SynthesisOptions, Synthesizer } from '@aws-cdk/cdk';
import cxapi = require('@aws-cdk/cx-api');

export class SynthUtils {
  /**
   * @param stack
   * @param options
   */
  public static synthesize(stack: Stack, options: SynthesisOptions = { }): cxapi.CloudFormationStackArtifact {
    // if this stack has an App root, then use it for synthesis so that cross refereces would work
    let assembly;
    if (App.isApp(stack.node.root)) {
      assembly = stack.node.root.run();
    } else {
      const synth = new Synthesizer();
      assembly = synth.synthesize(stack, options);
    }

    return assembly.getStack(stack.name);
  }
}
