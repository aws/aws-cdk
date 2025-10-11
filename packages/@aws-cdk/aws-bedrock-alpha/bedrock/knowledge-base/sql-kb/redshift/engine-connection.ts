import * as bedrock from "aws-cdk-lib/aws-bedrock";
import { RedshiftAuth } from "./engine-auth";

/******************************************************************************
 *                              ENUMS
 *****************************************************************************/
export enum RedshiftComputeType {
  /**
   * TODO
   */
  SERVERLESS = "SERVERLESS",
  /**
   * TODO
   */
  PROVISIONED = "PROVISIONED",
}

/******************************************************************************
 *                             COMMON INTERFACES
 *****************************************************************************/
export class RedshiftQueryEngine {
  /**
   * Static method to configure using an existing Amazon Redshift Serverless workgroup.
   * Uses low level abstractions. If an L2 gets released a more abstracted method will be created.
   */
  public static fromServerlessL1(
    workgroupArn: string,
    authMethod: RedshiftAuth
  ): RedshiftQueryEngine {
    return new RedshiftQueryEngine(
      RedshiftComputeType.SERVERLESS,
      authMethod,
      undefined,
      workgroupArn
    );
  }
  /**
   * Static method to configure using an existing Amazon Redshift cluster. Uses low level
   * abstractions. If an L2 gets released a more abstracted method will be created.
   */
  public static fromProvisionedL1(
    clusterIdentifier: string,
    authMethod: RedshiftAuth
  ): RedshiftQueryEngine {
    return new RedshiftQueryEngine(RedshiftComputeType.PROVISIONED, authMethod, clusterIdentifier);
  }

  public readonly computeType: RedshiftComputeType;
  public readonly authMethod: RedshiftAuth;
  public readonly clusterIdentifier?: string;
  public readonly workgroupArn?: string;

  /** Constructor of the class */
  constructor(
    computeType: RedshiftComputeType,
    authMethod: RedshiftAuth,
    clusterIdentifier?: string,
    workgroupArn?: string
  ) {
    this.computeType = computeType;
    this.authMethod = authMethod;
    this.clusterIdentifier = clusterIdentifier;
    this.workgroupArn = workgroupArn;
  }

  /** Transforms internal properties into a CloudFormation compatible JSON */
  render(): bedrock.CfnKnowledgeBase.RedshiftQueryEngineConfigurationProperty {
    return {
      type: this.computeType,
      ...(this.computeType === RedshiftComputeType.SERVERLESS && {
        serverlessConfiguration: {
          workgroupArn: this.workgroupArn!,
          authConfiguration: this.authMethod.render(),
        },
      }),
      ...(this.computeType === RedshiftComputeType.PROVISIONED && {
        provisionedConfiguration: {
          clusterIdentifier: this.clusterIdentifier!,
          authConfiguration: this.authMethod.render(),
        },
      }),
    };
  }
}
