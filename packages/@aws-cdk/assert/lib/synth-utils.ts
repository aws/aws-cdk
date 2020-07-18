import * as fs from 'fs';
import * as path from 'path';
import * as core from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';

export class SynthUtils {
  public static synthesize(stack: core.Stack, options: core.SynthesisOptions = { }): cxapi.CloudFormationStackArtifact {
    // always synthesize against the root (be it an App or whatever) so all artifacts will be included
    const root = stack.node.root;

    // if the root is an app, invoke "synth" to avoid double synthesis
    const assembly = root instanceof core.App ? root.synth() : core.ConstructNode.synth(root.node, options);

    return assembly.getStackArtifact(stack.artifactId);
  }

  /**
   * Synthesizes the stack and returns the resulting CloudFormation template.
   */
  public static toCloudFormation(stack: core.Stack, options: core.SynthesisOptions = { }): any {
    const synth = this._synthesizeWithNested(stack, options);
    if (synth instanceof cxapi.CloudFormationStackArtifact) {
      return synth.template;
    } else {
      return synth;
    }
  }

  /**
   * @returns Returns a subset of the synthesized CloudFormation template (only specific resource types).
   */
  public static subset(stack: core.Stack, options: SubsetOptions): any {
    const template = this.toCloudFormation(stack);
    if (template.Resources) {
      for (const [key, resource] of Object.entries(template.Resources)) {
        if (options.resourceTypes && !options.resourceTypes.includes((resource as any).Type)) {
          delete template.Resources[key];
        }
      }
    }

    return template;
  }

  /**
   * Synthesizes the stack and returns a `CloudFormationStackArtifact` which can be inspected.
   * Supports nested stacks as well as normal stacks.
   *
   * @return CloudFormationStackArtifact for normal stacks or the actual template for nested stacks
   * @internal
   */
  public static _synthesizeWithNested(stack: core.Stack, options: core.SynthesisOptions = { }): cxapi.CloudFormationStackArtifact | object {
    // always synthesize against the root (be it an App or whatever) so all artifacts will be included
    const root = stack.node.root;

    // if the root is an app, invoke "synth" to avoid double synthesis
    const assembly = root instanceof core.App ? root.synth() : core.ConstructNode.synth(root.node, options);

    // if this is a nested stack (it has a parent), then just read the template as a string
    if (stack.nestedStackParent) {
      return JSON.parse(fs.readFileSync(path.join(assembly.directory, stack.templateFile)).toString('utf-8'));
    }

    return assembly.getStackArtifact(stack.artifactId);
  }
}

export interface SubsetOptions {
  /**
   * Match all resources of the given type
   */
  resourceTypes?: string[];
}
