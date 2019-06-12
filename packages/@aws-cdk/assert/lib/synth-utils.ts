import { ConstructNode, Stack, SynthesisOptions } from '@aws-cdk/cdk';
import cxapi = require('@aws-cdk/cx-api');

export class SynthUtils {
  /**
   * Synthesizes the stack and returns a `CloudFormationStackArtifact` which can be inspected.
   */
  public static synthesize(stack: Stack, options: SynthesisOptions = { }): cxapi.CloudFormationStackArtifact {
    // always synthesize against the root (be it an App or whatever) so all artifacts will be included
    const root = stack.node.root;
    const assembly = ConstructNode.synth(root.node, options);
    return assembly.getStack(stack.stackName);
  }

  /**
   * Synthesizes the stack and returns the resulting CloudFormation template.
   */
  public static toCloudFormation(stack: Stack, options: SynthesisOptions = { }): any {
    return this.synthesize(stack, options).template;
  }

  /**
   * @returns Returns a subset of the synthesized CloudFormation template (only specific resource types).
   */
  public static subset(stack: Stack, options: SubsetOptions): any {
    const template = SynthUtils.synthesize(stack).template;
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
