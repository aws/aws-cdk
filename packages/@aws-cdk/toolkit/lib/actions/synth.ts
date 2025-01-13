import { StackSelector } from '../types';

export interface SynthOptions {
  /**
   * Select the stacks
   */
  readonly stacks: StackSelector;

  /**
   * After synthesis, validate stacks with the "validateOnSynth" attribute set (can also be controlled with CDK_VALIDATION)
   * @default true
   */
  readonly validateStacks?: boolean;
}

/**
 * Remove any template elements that we don't want to show users.
 */
export function obscureTemplate(template: any = {}) {
  if (template.Rules) {
    // see https://github.com/aws/aws-cdk/issues/17942
    if (template.Rules.CheckBootstrapVersion) {
      if (Object.keys(template.Rules).length > 1) {
        delete template.Rules.CheckBootstrapVersion;
      } else {
        delete template.Rules;
      }
    }
  }

  return template;
}
