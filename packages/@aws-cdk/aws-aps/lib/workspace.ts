import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnWorkspace } from './aps.generated';

/**
 * Represents the Prometheus WorkSpace.
 */
export interface IWorkspace extends cdk.IResource {
  /**
   * The ARN of the Workspace.
   */
  readonly workspaceArn: string;

  /**
   * The prometheus endpoint of the Workspace.
   */
  readonly prometheusEndpoint: string;

  /**
   * The workspaceId of the Workspace.
   */
  readonly workspaceId: string;
}

/**
 * Attributes for the Workspace.
 */
export interface WorkspaceAttributes {

  /**
   * The ARN of the Workspace.
   */
  readonly workspaceArn: string;

  /**
   * The prometheus endpoint of the Workspace.
   */
  readonly prometheusEndpoint: string;

  /**
   * The workspaceId of the Workspace.
   */
  readonly workspaceId: string;
}

export interface WorkspaceProps {
  /**
   * The alert manager definition for the workspace, as a string. For more information,
   * @see [Alert manager and templating](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html).
   * @default - no values will be passed.
   */
  readonly alertManagerDefinition?: string;

  /**
   * An alias that you assign to this workspace to help you identify it. It does not need to be unique.
   * The alias can be as many as 100 characters and can include any type of characters.
   * Amazon Managed Service for Prometheus automatically strips any blank spaces from the beginning and end of the alias that you specify.
   * @default - none.
   */
  readonly alias?: string;
}

/**
 * The Workspace type specifies an Amazon Managed Service for Prometheus (Amazon Managed Service for Prometheus) workspace.
 */
export class Workspace extends cdk.Resource {
  /**
   * Import from workspace attributes.
   */
  public static fromWorkSpaceAttributes(scope: Construct, id: string, attrs: WorkspaceAttributes): IWorkspace {
    const workspaceArn = attrs.workspaceArn;
    const workspaceId = attrs.workspaceId;
    const prometheusEndpoint = attrs.prometheusEndpoint;

    class Import extends cdk.Resource {
      public workspaceArn = workspaceArn;
      public workspaceId = workspaceId;
      public prometheusEndpoint = prometheusEndpoint;
    }

    return new Import(scope, id);
  }

  /**
   * Import from workspace Id.
   */
  public static fromWorkspaceId(scope: Construct, id: string, workspaceId: string): IWorkspace {
    const region = cdk.Stack.of(scope).region;
    const urlSuffix = cdk.Stack.of(scope).urlSuffix;
    class Import extends cdk.Resource {
      public workspaceArn = cdk.Stack.of(this).formatArn({
        resource: 'workspace',
        service: 'aps',
        resourceName: workspaceId,
      });
      public workspaceId = workspaceId;
      public prometheusEndpoint = `https://aps-workspaces.${region}.${urlSuffix}/workspaces/${workspaceId}/`;
    }

    return new Import(scope, id);
  }

  private alertManagerDefinition?: string;
  private alias?: string;

  /**
   * The ARN of the workspace.
   * For example: `arn:aws:aps:us-west-2:123456789012:workspace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f`.
   * @attribute
   */
  readonly workspaceArn: string;

  /**
   * The Prometheus endpoint attribute of the workspace.
   * This is the endpoint prefix without the remote_write or query API appended.
   * For example: https://aps-workspaces.us-west-2.amazonaws.com/workspaces/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f/.
   * @attribute
   */
  readonly prometheusEndpoint: string;

  /**
   * The workspace ID. For example: `ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f`.
   * @attribute
   */
  readonly workspaceId: string;

  public constructor(scope: Construct, id: string, props?: WorkspaceProps) {
    super(scope, id);
    this.alertManagerDefinition = props?.alertManagerDefinition;
    this.alias = props?.alias;

    const resource = new CfnWorkspace(this, 'Resource', {
      alertManagerDefinition: this.alertManagerDefinition,
      alias: this.alias,
    });


    this.workspaceArn = resource.ref;
    this.workspaceId = resource.attrWorkspaceId;
    this.prometheusEndpoint = resource.attrPrometheusEndpoint;

  }
}