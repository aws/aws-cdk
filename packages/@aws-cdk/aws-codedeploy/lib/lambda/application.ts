import { ArnFormat, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnApplication } from '../codedeploy.generated';
import { arnForApplication, validateName } from '../utils';

/**
 * Represents a reference to a CodeDeploy Application deploying to AWS Lambda.
 *
 * If you're managing the Application alongside the rest of your CDK resources,
 * use the {@link LambdaApplication} class.
 *
 * If you want to reference an already existing Application,
 * or one defined in a different CDK Stack,
 * use the {@link LambdaApplication#fromLambdaApplicationName} method.
 */
export interface ILambdaApplication extends IResource {
  /** @attribute */
  readonly applicationArn: string;

  /** @attribute */
  readonly applicationName: string;
}

/**
 * Construction properties for {@link LambdaApplication}.
 */
export interface LambdaApplicationProps {
  /**
   * The physical, human-readable name of the CodeDeploy Application.
   *
   * @default an auto-generated name will be used
   */
  readonly applicationName?: string;
}

/**
 * A CodeDeploy Application that deploys to an AWS Lambda function.
 *
 * @resource AWS::CodeDeploy::Application
 */
export class LambdaApplication extends Resource implements ILambdaApplication {
  /**
   * Import an Application defined either outside the CDK, or in a different CDK Stack.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param lambdaApplicationName the name of the application to import
   * @returns a Construct representing a reference to an existing Application
   */
  public static fromLambdaApplicationName(scope: Construct, id: string, lambdaApplicationName: string): ILambdaApplication {
    class Import extends Resource implements ILambdaApplication {
      public applicationArn = arnForApplication(lambdaApplicationName);
      public applicationName = lambdaApplicationName;
    }

    return new Import(scope, id);
  }

  public readonly applicationArn: string;
  public readonly applicationName: string;

  constructor(scope: Construct, id: string, props: LambdaApplicationProps = {}) {
    super(scope, id, {
      physicalName: props.applicationName,
    });

    const resource = new CfnApplication(this, 'Resource', {
      applicationName: this.physicalName,
      computePlatform: 'Lambda',
    });

    this.applicationName = this.getResourceNameAttribute(resource.ref);
    this.applicationArn = this.getResourceArnAttribute(arnForApplication(resource.ref), {
      service: 'codedeploy',
      resource: 'application',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    this.node.addValidation({ validate: () => validateName('Application', this.physicalName) });
  }
}
