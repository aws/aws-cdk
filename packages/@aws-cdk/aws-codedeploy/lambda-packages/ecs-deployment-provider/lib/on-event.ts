import { Logger } from '@aws-lambda-powertools/logger';
import { CodeDeploy } from '@aws-sdk/client-codedeploy';

const logger = new Logger({ serviceName: 'ecsDeploymentProviderOnEvent' });
const codedeployClient = new CodeDeploy({});

/**
 * The properties of the CodeDeploy Deployment to create
 */
interface DeploymentProperties {
  description: string;
  applicationName: string;
  deploymentConfigName: string;
  deploymentGroupName: string;
  autoRollbackConfigurationEnabled: string;
  autoRollbackConfigurationEvents: string;
  revisionAppSpecContent: string;
}

/**
 * The properties in the Data object returned to CloudFormation 
 */
export interface DataAttributes {
  deploymentId: string;
}

/**
 * The request object that the custom resource lamba function receives from CloudFormation.
 */
export interface OnEventRequest {
  RequestType: string;
  LogicalResourceId: string;
  PhysicalResourceId: string;
  ResourceProperties: DeploymentProperties;
  OldResourceProperties: DeploymentProperties;
  ResourceType: string;
  RequestId: string;
  StackId: string;
}
/**
 * The response object that the custom resource lambda function returns to CloudFormation.
 */
export interface OnEventResponse {
  PhysicalResourceId?: string;
  Data?: DataAttributes;
  NoEcho?: boolean;
}

/**
 * The lambda function called from CloudFormation for this custom resource.
 * 
 * @param event 
 * @returns attribues of the deployment that was created
 */
export async function handler(event: OnEventRequest): Promise<OnEventResponse> {
  logger.appendKeys({
    stackEvent: event.RequestType,
  });
  switch (event.RequestType) {
    case 'Create':
    case 'Update': {
      // create deployment
      const props = event.ResourceProperties;
      const resp = await codedeployClient.createDeployment({
        applicationName: props.applicationName,
        deploymentConfigName: props.deploymentConfigName,
        deploymentGroupName: props.deploymentGroupName,
        autoRollbackConfiguration: {
          enabled: props.autoRollbackConfigurationEnabled === 'true',
          events: props.autoRollbackConfigurationEvents?.split(','),
        },
        description: props.description,
        revision: {
          revisionType: 'AppSpecContent',
          appSpecContent: {
            content: props.revisionAppSpecContent,
          },
        },
      });
      if (!resp.deploymentId) {
        throw new Error('No deploymentId received from call to CreateDeployment');
      }
      logger.appendKeys({
        deploymentId: resp.deploymentId,
      });
      logger.info('Created new deployment');

      return {
        PhysicalResourceId: resp.deploymentId,
        Data: {
          deploymentId: resp.deploymentId,
        },
      };
    }
    case 'Delete':
      logger.appendKeys({
        deploymentId: event.PhysicalResourceId,
      });
      // cancel deployment and rollback
      try {
        const resp = await codedeployClient.stopDeployment({
          deploymentId: event.PhysicalResourceId,
          autoRollbackEnabled: true,
        });
        logger.info(`Stopped deployment: ${resp.status} ${resp.statusMessage}`);
      } catch (e) {
        logger.warn('Ignoring error', e as Error);
      }

      return {};
    default:
      logger.error('Unknown stack event');
      throw new Error(`Unknown request type: ${event.RequestType}`);
  }
}

