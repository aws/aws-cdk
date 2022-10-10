import * as AWS from 'aws-sdk';
import { Logger } from './logger';

export enum DeploymentStatus {
  CREATED = "Created",
  QUEUED = "Queued",
  IN_PROGRESS = "InProgress",
  BAKING = "Baking",
  SUCCEEDED = "Succeeded",
  FAILED = "Failed",
  STOPPED = "Stopped",
  READY = "Ready",
}

/**
 * The request object that the custom resource lamba function receives from CloudFormation.
 */
export interface IsCompleteRequest {
  /**
   * The type of CloudFormation request (e.g. 'Create', 'Update', or 'Delete')
   */
  RequestType: string;

  /**
   * The physical resource id.
   */
  PhysicalResourceId: string;
}

/**
 * The response object that the custom resource lambda function returns to CloudFormation.
 */
export interface IsCompleteResponse {
  /**
   * True if and only if the deployment is in a final state.
   */
  IsComplete: boolean;
}

/**
 * The lambda function called from CloudFormation for this custom resource.
 * 
 * @param event 
 * @returns whether the deployment is complete
 */
export async function handler(event: IsCompleteRequest): Promise<IsCompleteResponse> {
  const logger = new Logger();
  const codedeployClient = new AWS.CodeDeploy();
  try {
    const resp = await codedeployClient.getDeployment({ deploymentId: event.PhysicalResourceId }).promise();
    let rollbackResp: AWS.CodeDeploy.GetDeploymentOutput = {};
    if (resp.deploymentInfo?.rollbackInfo?.rollbackDeploymentId) {
      rollbackResp = await codedeployClient.getDeployment({ deploymentId: resp.deploymentInfo?.rollbackInfo?.rollbackDeploymentId }).promise();
    }
    logger.appendKeys({
      stackEvent: event.RequestType,
      deploymentId: event.PhysicalResourceId,
      deploymentStatus: resp.deploymentInfo?.status,
      rollbackStatus: rollbackResp?.deploymentInfo?.status,
    });
    logger.info('Checking deployment');

    // check if deployment id is complete
    switch (event.RequestType) {
      case 'Create':
      case 'Update':
        switch (resp.deploymentInfo?.status) {
          case DeploymentStatus.SUCCEEDED:
            logger.info('Deployment finished successfully', { complete: true });

            return { IsComplete: true };
          case DeploymentStatus.FAILED:
          case DeploymentStatus.STOPPED:
            if (rollbackResp.deploymentInfo?.status) {
              if (rollbackResp.deploymentInfo?.status == DeploymentStatus.SUCCEEDED ||
                rollbackResp.deploymentInfo?.status == DeploymentStatus.FAILED ||
                rollbackResp.deploymentInfo?.status == DeploymentStatus.STOPPED) {
                const errInfo = resp.deploymentInfo.errorInformation;
                const error = new Error(`Deployment ${resp.deploymentInfo.status}: [${errInfo?.code}] ${errInfo?.message}`);
                logger.error('Deployment failed', { complete: true, error });
                throw error;
              }
              logger.info('Waiting for final status from a rollback', { complete: false });

              return { IsComplete: false }; // waiting for final status from rollback
            } else {
              const errInfo = resp.deploymentInfo.errorInformation;
              const error = new Error(`Deployment ${resp.deploymentInfo.status}: [${errInfo?.code}] ${errInfo?.message}`);
              logger.error('No rollback to wait for', { complete: true, error });
              throw error;
            }
          default:
            logger.info('Waiting for final status from deployment', { complete: false });

            return { IsComplete: false };
        }
      case 'Delete':
        switch (resp.deploymentInfo?.status) {
          case DeploymentStatus.SUCCEEDED:
            logger.info('Deployment finished successfully - nothing to delete', { complete: true });

            return { IsComplete: true };
          case DeploymentStatus.FAILED:
          case DeploymentStatus.STOPPED:
            if (rollbackResp.deploymentInfo?.status) {
              if (rollbackResp.deploymentInfo?.status == DeploymentStatus.SUCCEEDED ||
                rollbackResp.deploymentInfo?.status == DeploymentStatus.FAILED ||
                rollbackResp.deploymentInfo?.status == DeploymentStatus.STOPPED) {
                logger.info('Rollback in final status', { complete: true });

                return { IsComplete: true }; // rollback finished, we're deleted
              }
              logger.info('Waiting for final status from a rollback', { complete: false });

              return { IsComplete: false }; // waiting for rollback
            }
            logger.info('No rollback to wait for', { complete: true });

            return { IsComplete: true };
          default:
            logger.info('Waiting for final status from deployment', { complete: false });

            return { IsComplete: false };
        }
      default:
        logger.error('Unknown request type');
        throw new Error(`Unknown request type: ${event.RequestType}`);
    }
  } catch (e) {
    logger.error('Unable to determine deployment status', {error: e as Error});
    if (event.RequestType === 'Delete') {
      logger.warn('Ignoring error - nothing to do', { complete: true });

      return { IsComplete: true };
    }
    throw e;
  }
}