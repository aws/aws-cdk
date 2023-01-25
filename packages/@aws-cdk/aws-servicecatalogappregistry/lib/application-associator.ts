import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IApplication } from './application';
import { CheckedStageStackAssociator } from './aspects/stack-associator';
import { TargetApplication } from './target-application';

/**
 * Properties for Service Catalog AppRegistry Application Associator
 */
export interface ApplicationAssociatorProps {
  /**
   * Application associator properties.
   *
   * @default - Empty array.
   */
  readonly applications: TargetApplication[];
}

/**
 * An AppRegistry construct to automatically create an application with the given name and description.
 *
 * The application name must be unique at the account level per region and it's immutable.
 * This construct will automatically associate all stacks in the given scope, however
 * in case of a `Pipeline` stack, stage underneath the pipeline will not automatically be associated and
 * needs to be associated separately.
 *
 * If cross account stack is detected, then this construct will automatically share the application to consumer accounts.
 * Cross account feature will only work for non environment agnostic stacks.
 */
export class ApplicationAssociator extends Construct {
  /**
   * Created or imported application.
   */
  private readonly application: IApplication;
  private readonly associatedStages: Set<cdk.Stage> = new Set();

  constructor(scope: cdk.App, id: string, props: ApplicationAssociatorProps) {
    super(scope, id);

    if (props.applications.length != 1) {
      throw new Error('Please pass exactly 1 instance of TargetApplication.createApplicationStack() or TargetApplication.existingApplicationFromArn() into the "applications" property');
    }

    const targetApplication = props.applications[0];
    this.application = targetApplication.bind(scope).application;
    cdk.Aspects.of(scope).add(new CheckedStageStackAssociator(this));
  }

  /**
   * Associate this application with the given stage.
   *
   */
  public associateStage(stage: cdk.Stage): cdk.Stage {
    this.associatedStages.add(stage);
    cdk.Aspects.of(stage).add(new CheckedStageStackAssociator(this));
    return stage;
  }

  /**
   * Validates if a stage is already associated to the application.
   *
   */
  public isStageAssociated(stage: cdk.Stage): boolean {
    return this.associatedStages.has(stage);
  }

  /**
   * Get the AppRegistry application.
   *
   */
  public appRegistryApplication(): IApplication {
    return this.application;
  }
}
