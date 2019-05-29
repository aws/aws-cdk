import { ISynthesisSession, Stack, SynthesisOptions, Synthesizer } from '@aws-cdk/cdk';

export class SynthUtils {
  public static toCloudFormation(stack: Stack, options: SynthesisOptions = { }): any {
    const session = this.synthesize(stack, options);
    return this.templateForStackName(session, stack.name);
  }

  public static templateForStackName(session: ISynthesisSession, stackName: string): any {
    return session.store.readJson(session.getArtifact(stackName).properties!.templateFile);
  }

  public static synthesize(stack: Stack, options: SynthesisOptions): ISynthesisSession {
    const synth = new Synthesizer();
    return synth.synthesize(stack, options);
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
