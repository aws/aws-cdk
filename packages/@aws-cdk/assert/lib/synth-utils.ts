import { App, ConstructNode, Stack, SynthesisOptions } from '@aws-cdk/core';
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');

export class SynthUtils {
  public static synthesize(stack: Stack, options: SynthesisOptions = { }): cxapi.CloudFormationStackArtifact {
    // always synthesize against the root (be it an App or whatever) so all artifacts will be included
    const root = stack.node.root;

    // if the root is an app, invoke "synth" to avoid double synthesis
    const assembly = root instanceof App ? root.synth() : ConstructNode.synth(root.node, options);

    return assembly.getStack(stack.stackName);
  }

  /**
   * Synthesizes the stack and returns a `CloudFormationStackArtifact` which can be inspected.
   * Supports nested stacks as well as normal stacks.
   */
  public static synthesizeWithNested(stack: Stack, options: SynthesisOptions = { }): cxapi.CloudFormationStackArtifact | object {
    // always synthesize against the root (be it an App or whatever) so all artifacts will be included
    const root = stack.node.root;

    // if the root is an app, invoke "synth" to avoid double synthesis
    const assembly = root instanceof App ? root.synth() : ConstructNode.synth(root.node, options);

    // if this is a nested stack (it has a parent), then just read the template as a string
    if (stack.parentStack) {
      return JSON.parse(fs.readFileSync(path.join(assembly.directory, stack.templateFile)).toString('utf-8'));
    }

    return assembly.getStack(stack.stackName);
  }

  /**
   * Synthesizes the stack and returns the resulting CloudFormation template.
   */
  public static toCloudFormation(stack: Stack, options: SynthesisOptions = { }): any {
    const synth = this.synthesizeWithNested(stack, options);
    if (synth instanceof cxapi.CloudFormationStackArtifact) {
      return synth.template;
    } else {
      return synth;
    }
  }

  /**
   * @returns Returns a subset of the synthesized CloudFormation template (only specific resource types).
   */
  public static subset(stack: Stack, options: SubsetOptions): any {
    const synth = this.synthesize(stack);
    const template = synth instanceof cxapi.CloudFormationStackArtifact ? synth.template : synth;
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
