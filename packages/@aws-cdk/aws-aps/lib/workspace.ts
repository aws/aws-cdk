import { Construct } from 'constructs';
import * as cdk from '@aws-cdk/core';
import { CfnWorkspace } from './aps.generated';


/**
 * Represents the Prometheus WorkSpace.
 */
 export interface IWorkSpace extends cdk.IResource { 
     /**
   * The ARN of the WorkSpace.
   */
  readonly workspaceArn: string;

  /**
   * The prometheus endpoint of the WorkSpace.
   */
  readonly prometheusEndpoint: string;

  /**
   * The workspaceId of the WorkSpace.
   */
  readonly workspaceId: string;
}

/**
 * Attributes for the WorkSpace.
 */
 export interface WorkSpaceAttributes {

  /**
   * The ARN of the WorkSpace.
   */
  readonly workspaceArn: string;

  /**
   * The prometheus endpoint of the WorkSpace.
   */
  readonly prometheusEndpoint: string;

  /**
   * The workspaceId of the WorkSpace.
   */
  readonly workspaceId: string;
}

export interface WorkSpaceProps {
  /**
   * The alert manager definition for the workspace, as a string. For more information,
   * @see [Alert manager and templating](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html). 
   */
  readonly alertManagerDefinition?: string;

  /**
   * An alias that you assign to this workspace to help you identify it. It does not need to be unique.
   * The alias can be as many as 100 characters and can include any type of characters.
   * Amazon Managed Service for Prometheus automatically strips any blank spaces from the beginning and end of the alias that you specify.
   */
  readonly alias?: string; 
}

export class WorkSpace extends cdk.Resource {
  private alertManagerDefinition?: string;
  private alias?: string;

  /**
   * The ARN of the workspace. 
   * For example: `arn:aws:aps:us-west-2:123456789012:workspace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f`.
   * @attribute
   */
  public workspaceArn: string;

  /**
   * The Prometheus endpoint attribute of the workspace. 
   * This is the endpoint prefix without the remote_write or query API appended.
   * For example: https://aps-workspaces.us-west-2.amazonaws.com/workspaces/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f/.
   * @attribute
   */
  public prometheusEndpoint: string;

  /**
   * The workspace ID. For example: `ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f`.
   * @attribute
   */
  public workspaceId: string;

  /**
   * Import from workspace attributes.
   */
  public static fromWorkSpaceAttributes(scope: Construct, id: string, attrs: WorkSpaceAttributes): IWorkSpace {
    const workspaceArn = attrs.workspaceArn;
    const workspaceId = attrs.workspaceId;
    const prometheusEndpoint = attrs.prometheusEndpoint;

    class Import extends cdk.Resource {
      public readonly workspaceArn = workspaceArn;
      public readonly workspaceId = workspaceId;
      public readonly prometheusEndpoint = prometheusEndpoint;
    }

    return new Import(scope, id);
  }

  /**
   * Import from workspace Id.
   */
   public static fromWorkSpaceId(scope: Construct, id: string, workspaceId: string): IWorkSpace {
    
    class Import extends cdk.Resource {
      public readonly workspaceArn = `arn:aws:aps:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:workspace/${workspaceId}`;;
      public readonly workspaceId = workspaceId;
      public readonly prometheusEndpoint = `https://aps-workspaces.${cdk.Stack.of(this).region}.amazonaws.com/workspaces/${workspaceId}/`;
    }

    return new Import(scope, id);
  }

  public constructor(scope: Construct, id: string, props?: WorkSpaceProps) {
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