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

  public static subset(stack: Stack, options: SubsetOptions): any {
    const template = SynthUtils.toCloudFormation(stack);
    if (template.Resources) {
      for (const [key, resource] of Object.entries(template.Resources)) {
        if (options.resourceTypes && !options.resourceTypes.includes((resource as any).Type)) {
          delete template.Resources[key];
        }
      }
    }

    return template;
  }
}

export interface SubsetOptions {
  /**
   * Match all resources of the given type
   */
  resourceTypes?: string[];
}
