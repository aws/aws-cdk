import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { LATEST_VERSION } from './private/constants';
import type { IWorkflow } from './workflow';
import { Workflow, WorkflowType } from './workflow';

/**
 * Properties for an EC2 Image Builder Amazon-managed workflow
 */
export interface AmazonManagedWorkflowAttributes {
  /**
   * The name of the Amazon-managed workflow
   */
  readonly workflowName: string;

  /**
   * The type of the Amazon-managed workflow
   */
  readonly workflowType: WorkflowType;
}

/**
 * Helper class for working with Amazon-managed workflows
 */
export class AmazonManagedWorkflow {
  /**
   * Imports the build-container Amazon-managed workflow
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   */
  public static buildContainer(scope: Construct, id: string): IWorkflow {
    return this.fromAmazonManagedWorkflowAttributes(scope, id, {
      workflowName: 'build-container',
      workflowType: WorkflowType.BUILD,
    });
  }

  /**
   * Imports the build-image AWS-managed workflow
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   */
  public static buildImage(scope: Construct, id: string): IWorkflow {
    return this.fromAmazonManagedWorkflowAttributes(scope, id, {
      workflowName: 'build-image',
      workflowType: WorkflowType.BUILD,
    });
  }

  /**
   * Imports the distribute-container AWS-managed workflow
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   */
  public static distributeContainer(scope: Construct, id: string): IWorkflow {
    return this.fromAmazonManagedWorkflowAttributes(scope, id, {
      workflowName: 'distribute-container',
      workflowType: WorkflowType.DISTRIBUTION,
    });
  }

  /**
   * Imports the distribute-image AWS-managed workflow
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   */
  public static distributeImage(scope: Construct, id: string): IWorkflow {
    return this.fromAmazonManagedWorkflowAttributes(scope, id, {
      workflowName: 'distribute-image',
      workflowType: WorkflowType.DISTRIBUTION,
    });
  }

  /**
   * Imports the test-container AWS-managed workflow
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   */
  public static testContainer(scope: Construct, id: string): IWorkflow {
    return this.fromAmazonManagedWorkflowAttributes(scope, id, {
      workflowName: 'test-container',
      workflowType: WorkflowType.TEST,
    });
  }

  /**
   * Imports the test-image AWS-managed workflow
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   */
  public static testImage(scope: Construct, id: string): IWorkflow {
    return this.fromAmazonManagedWorkflowAttributes(scope, id, {
      workflowName: 'test-image',
      workflowType: WorkflowType.TEST,
    });
  }

  /**
   * Imports an AWS-managed workflow from its attributes
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The attributes of the AWS-managed workflow
   */
  public static fromAmazonManagedWorkflowAttributes(
    scope: Construct,
    id: string,
    attrs: AmazonManagedWorkflowAttributes,
  ): IWorkflow {
    if (cdk.Token.isUnresolved(attrs.workflowType)) {
      throw new cdk.ValidationError('workflowType cannot be a token', scope);
    }

    return Workflow.fromWorkflowArn(
      scope,
      id,
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        account: 'aws',
        resource: 'workflow',
        resourceName: `${attrs.workflowType.toLowerCase()}/${attrs.workflowName}/${LATEST_VERSION}`,
      }),
    );
  }
}
