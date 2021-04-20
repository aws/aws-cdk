import * as codepipeline from '@aws-cdk/aws-codepipeline';

/**
 * Low-level class for generic CodePipeline Actions.
 * If you're implementing your own IAction,
 * prefer to use the Action class from the codepipeline module.
 */
export abstract class Action extends codepipeline.Action {
  protected readonly providedActionProperties: codepipeline.ActionProperties;

  protected constructor(actionProperties: codepipeline.ActionProperties) {
    super();
    this.providedActionProperties = actionProperties;
  }
}
