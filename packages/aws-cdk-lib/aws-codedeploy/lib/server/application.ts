import type { Construct } from 'constructs';
import type { IResource } from '../../../core';
import { ArnFormat, Resource, Stack, Arn } from '../../../core';
import { memoizedGetter } from '../../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
import type { ApplicationReference, IApplicationRef } from '../../../interfaces/generated/aws-codedeploy-interfaces.generated';
import { CfnApplication } from '../codedeploy.generated';
import { arnForApplication, validateName } from '../private/utils';

/**
 * Represents a reference to a CodeDeploy Application deploying to EC2/on-premise instances.
 *
 * If you're managing the Application alongside the rest of your CDK resources,
 * use the `ServerApplication` class.
 *
 * If you want to reference an already existing Application,
 * or one defined in a different CDK Stack,
 * use the `#fromServerApplicationName` method.
 */
export interface IServerApplication extends IResource, IApplicationRef {
  /** @attribute */
  readonly applicationArn: string;

  /** @attribute */
  readonly applicationName: string;
}

/**
 * Construction properties for `ServerApplication`.
 */
export interface ServerApplicationProps {
  /**
   * The physical, human-readable name of the CodeDeploy Application.
   *
   * @default an auto-generated name will be used
   */
  readonly applicationName?: string;
}

/**
 * A CodeDeploy Application that deploys to EC2/on-premise instances.
 *
 * @resource AWS::CodeDeploy::Application
 */
@propertyInjectable
export class ServerApplication extends Resource implements IServerApplication {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-codedeploy.ServerApplication';

  /**
   * Import an Application defined either outside the CDK app, or in a different region.
   *
   * The Application's account and region are assumed to be the same as the stack it is being imported
   * into. If not, use `fromServerApplicationArn`.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param serverApplicationName the name of the application to import
   * @returns a Construct representing a reference to an existing Application
   */
  public static fromServerApplicationName(scope: Construct, id: string, serverApplicationName: string): IServerApplication {
    class Import extends Resource implements IServerApplication {
      public readonly applicationArn = arnForApplication(Stack.of(scope), serverApplicationName);
      public readonly applicationName = serverApplicationName;
      public get applicationRef(): ApplicationReference {
        return {
          applicationName: this.applicationName,
        };
      }
    }

    return new Import(scope, id);
  }

  /**
   * Import an Application defined either outside the CDK, or in a different CDK Stack, by ARN.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param serverApplicationArn the ARN of the application to import
   * @returns a Construct representing a reference to an existing Application
   */
  public static fromServerApplicationArn(scope: Construct, id: string, serverApplicationArn: string): IServerApplication {
    return new class extends Resource implements IServerApplication {
      public applicationArn = serverApplicationArn;
      public applicationName = Arn.split(serverApplicationArn, ArnFormat.COLON_RESOURCE_NAME).resourceName ?? '<invalid arn>';
      public get applicationRef(): ApplicationReference {
        return {
          applicationName: this.applicationName,
        };
      }
    }(scope, id, { environmentFromArn: serverApplicationArn });
  }

  private readonly resource: CfnApplication;

  @memoizedGetter
  public get applicationArn(): string {
    return this.getResourceArnAttribute(arnForApplication(Stack.of(this), this.resource.ref), {
      service: 'codedeploy',
      resource: 'application',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  @memoizedGetter
  public get applicationName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  public get applicationRef(): ApplicationReference {
    return {
      applicationName: this.applicationName,
    };
  }

  constructor(scope: Construct, id: string, props: ServerApplicationProps = {}) {
    super(scope, id, {
      physicalName: props.applicationName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.resource = new CfnApplication(this, 'Resource', {
      applicationName: this.physicalName,
      computePlatform: 'Server',
    });

    this.node.addValidation({ validate: () => validateName('Application', this.physicalName) });
  }
}
