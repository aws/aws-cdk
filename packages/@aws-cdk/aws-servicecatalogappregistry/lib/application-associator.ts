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
 * An AppRegistry construct to automatically create applications with the given name and description
 * in the desired regions.
 *
 * The application name must be unique at the account level and it's immutable.
 * Only one application per region should be specified because a stack can only be associated with
 * one application in a region.
 * This construct will automatically associate all stacks in the given scope, however
 * in case of a `Pipeline` stack, stage underneath the pipeline will not automatically be associated and
 * needs to be associated separately.
 *
 * If cross region stack is detected, then this construct will give a warning and skip that association.
 * Only stacks and an application within the same region will be associated.
 *
 * If cross account stack is detected, then this construct will automatically share the application to consumer accounts.
 * Cross account feature will only work for non environment agnostic stacks.
 */
export class ApplicationAssociator extends Construct {
  /**
   * Maps one region to exactly one application.
   * The mapping is 1:1 because a stack can only be associated
   * with one application in a region.
   */
  private readonly regionToApplication: Map<string, IApplication> = new Map();
  private readonly associatedStages: Set<cdk.Stage> = new Set();

  constructor(scope: cdk.App, id: string, props: ApplicationAssociatorProps) {
    super(scope, id);

    if (props.applications.length == 0) {
      throw new Error('Please pass at least 1 instance of TargetApplication.createApplicationStack() or TargetApplication.existingApplicationFromArn() into the "applications" property');
    }

    props.applications.forEach((targetApplication) => {
      const application = targetApplication.bind(scope).application;
      const arnComponent = cdk.Arn.split(application.applicationArn, cdk.ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME);
      const region = arnComponent.region!;
      this.regionToApplication.set(region, application);
      cdk.Aspects.of(scope).add(new CheckedStageStackAssociator(this, region));
    });
  }

  /**
   * Associate an application with the given stage of the same region.
   * If there does not exist an application for the given region, then skip the
   * association.
   *
   */
  public associateStage(stage: cdk.Stage): cdk.Stage {
    this.associatedStages.add(stage);
    const application = this.regionToApplication.get(stage.region!);
    if (application) {
      cdk.Aspects.of(stage).add(new CheckedStageStackAssociator(this, stage.region!));
    } else {
      cdk.Annotations.of(stage).addWarning(`There is no application defined in ${stage.region}. Skipping association.`);
    }
    return stage;
  }

  /**
   * Validates if a stage is already associated with the applications.
   *
   */
  public isStageAssociated(stage: cdk.Stage): boolean {
    return this.associatedStages.has(stage);
  }

  /**
   * Array of all created or imported applications from all regions.
   *
   */
  public appRegistryApplications(): IApplication[] {
    return Array.from(this.regionToApplication.values());
  }

  /**
   * Get the application for the specified region.
   *
   */
  public getApplication(region: string): IApplication {
    const application = this.regionToApplication.get(region)!;
    return application;
  }
}
