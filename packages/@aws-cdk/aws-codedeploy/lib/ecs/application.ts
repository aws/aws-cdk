import { ArnFormat, IResource, Resource, Stack, Arn } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnApplication } from '../codedeploy.generated';
import { arnForApplication, validateName } from '../private/utils';

/**
 * Represents a reference to a CodeDeploy Application deploying to Amazon ECS.
 *
 * If you're managing the Application alongside the rest of your CDK resources,
 * use the `EcsApplication` class.
 *
 * If you want to reference an already existing Application,
 * or one defined in a different CDK Stack,
 * use the `EcsApplication#fromEcsApplicationName` method.
 */
export interface IEcsApplication extends IResource {
  /** @attribute */
  readonly applicationArn: string;

  /** @attribute */
  readonly applicationName: string;
}

/**
 * Construction properties for `EcsApplication`.
 */
export interface EcsApplicationProps {
  /**
   * The physical, human-readable name of the CodeDeploy Application.
   *
   * @default an auto-generated name will be used
   */
  readonly applicationName?: string;
}

/**
 * A CodeDeploy Application that deploys to an Amazon ECS service.
 *
 * @resource AWS::CodeDeploy::Application
 */
export class EcsApplication extends Resource implements IEcsApplication {
  /**
   * Import an Application defined either outside the CDK, or in a different CDK Stack.
   *
   * The Application's account and region are assumed to be the same as the stack it is being imported
   * into. If not, use `fromEcsApplicationArn`.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param ecsApplicationName the name of the application to import
   * @returns a Construct representing a reference to an existing Application
   */
  public static fromEcsApplicationName(scope: Construct, id: string, ecsApplicationName: string): IEcsApplication {
    class Import extends Resource implements IEcsApplication {
      public applicationArn = arnForApplication(Stack.of(scope), ecsApplicationName);
      public applicationName = ecsApplicationName;
    }

    return new Import(scope, id);
  }

  /**
   * Import an Application defined either outside the CDK, or in a different CDK Stack, by ARN.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param ecsApplicationArn the ARN of the application to import
   * @returns a Construct representing a reference to an existing Application
   */
  public static fromEcsApplicationArn(scope: Construct, id: string, ecsApplicationArn: string): IEcsApplication {
    return new class extends Resource implements IEcsApplication {
      public applicationArn = ecsApplicationArn;
      public applicationName = Arn.split(ecsApplicationArn, ArnFormat.COLON_RESOURCE_NAME).resourceName ?? '<invalid arn>';
    } (scope, id, { environmentFromArn: ecsApplicationArn });
  }

  public readonly applicationArn: string;
  public readonly applicationName: string;

  constructor(scope: Construct, id: string, props: EcsApplicationProps = {}) {
    super(scope, id, {
      physicalName: props.applicationName,
    });

    const resource = new CfnApplication(this, 'Resource', {
      applicationName: this.physicalName,
      computePlatform: 'ECS',
    });

    this.applicationName = this.getResourceNameAttribute(resource.ref);
    this.applicationArn = this.getResourceArnAttribute(arnForApplication(Stack.of(scope), resource.ref), {
      service: 'codedeploy',
      resource: 'application',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    this.node.addValidation({ validate: () => validateName('Application', this.physicalName) });
  }
}
