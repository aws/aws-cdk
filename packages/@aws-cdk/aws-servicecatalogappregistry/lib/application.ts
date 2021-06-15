import * as cdk from '@aws-cdk/core';
import { CfnApplication } from './servicecatalogappregistry.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/**
 * A Service Catalog AppRegistry Application.
 */
export interface IApplication extends cdk.IResource {
  /**
   * The ARN of the application.
   * @attribute
   */
  readonly applicationArn: string;

  /**
   * The ID of the application.
   * @attribute
   */
  readonly applicationId: string;
}

/**
 * Properties for a Service Catalog AppRegistry Application
 */
export interface ApplicationProps {
  /**
   * Enforces a particular physical application name.
   */
  readonly applicationName: string;

  /**
   * Description for application.
   * @default - No description provided
   */
  readonly description?: string;
}

abstract class ApplicationBase extends cdk.Resource implements IApplication {
  public abstract readonly applicationArn: string;
  public abstract readonly applicationId: string;
}

/**
 * A Service Catalog AppRegistry Application.
 */
export class Application extends ApplicationBase implements IApplication {
  /**
   * Imports an Application construct that represents an external application.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param applicationArn the Amazon Resource Name of the existing AppRegistry Application
   */
  public static fromApplicationArn(scope: Construct, id: string, applicationArn: string): IApplication {
    const applicationId = applicationArn.split('/').pop()!;

    if (applicationArn.split('/').length != 3 || applicationId.length == 0) {
      throw new Error('Malformed ARN, cannot determine application ID from: ' + applicationArn);
    }

    class Import extends ApplicationBase {
      public readonly applicationArn = applicationArn;
      public readonly applicationId = applicationId!;
    }

    return new Import(scope, id, {
      environmentFromArn: applicationArn,
    });
  }

  public readonly applicationArn: string;
  public readonly applicationId: string;
  private readonly application: CfnApplication;

  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, {
    });

    this.application = new CfnApplication(this, 'Resource', {
      name: props.applicationName,
      description: props.description,
    });

    this.applicationId = cdk.Token.asString(this.application.getAtt('Id'));
    this.applicationArn = cdk.Token.asString(this.application.getAtt('Arn'));
  }
}