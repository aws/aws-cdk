import * as AWS from 'aws-sdk';
import { Logger } from './logger';

/**
 * The properties of the CodeDeploy Deployment to create
 */
interface DeploymentProperties {
  description: string;
  /**
   * The name of an AWS CodeDeploy application. 
   */
  applicationName: string;
  /**
   * The name of a deployment configuration.  If not specified, the value 
   * configured in the deployment group is used as the default.  
   * If the deployment group does not have a deployment configuration associated with it, 
   * CodeDeployDefault.OneAtATime is used by default.
   */
  deploymentConfigName: string;
  /**
   * The name of the deployment group.
   */
  deploymentGroupName: string;
  /**
   * Indicates whether a defined automatic rollback configuration is currently enabled.
   */
  autoRollbackConfigurationEnabled: string;
  /**
   * The event type or types that trigger a rollback. 
   * Valid Values: DEPLOYMENT_FAILURE | DEPLOYMENT_STOP_ON_ALARM | DEPLOYMENT_STOP_ON_REQUEST
   */
  autoRollbackConfigurationEvents: string;
  /**
   * The content of an AppSpec file for an Amazon ECS deployment. 
   * The content is formatted as JSON or YAML and stored as a RawString.
   */
  revisionAppSpecContent: string;
}

/**
 * The properties in the Data object returned to CloudFormation 
 */
export interface DataAttributes {
  /**
   * ID of the CodeDeploy deployment
   */
  deploymentId: string;
}

/**
 * The request object that the custom resource lamba function receives from CloudFormation.
 */
export interface OnEventRequest {
  /**
   * The type of lifecycle event: Create, Update or Delete.
   */
  RequestType: string;
  /**
   * The template developer-chosen name (logical ID) of the custom resource in the AWS CloudFormation template.
   */
  LogicalResourceId: string;
  /**
   * This field will only be present for Update and Delete events and includes the value 
   * returned in PhysicalResourceId of the previous operation.
   */
  PhysicalResourceId: string;
  /**
   * This field contains the properties defined in the template for this custom resource.
   */
  ResourceProperties: DeploymentProperties;
  /**
   * This field will only be present for Update events and contains the resource properties 
   * that were declared previous to the update request.
   */
  OldResourceProperties: DeploymentProperties;
  /**
   * The resource type defined for this custom resource in the template. 
   * A provider may handle any number of custom resource types.
   */
  ResourceType: string;
  /**
   * A unique ID for the request.
   */
  RequestId: string;
  /**
   * The ARN that identifies the stack that contains the custom resource.
   */
  StackId: string;
}
/**
 * The response object that the custom resource lambda function returns to CloudFormation.
 */
export interface OnEventResponse {
  /**
   * The allocated/assigned physical ID of the resource. If omitted for Create events, 
   * the event's RequestId will be used. For Update, the current physical ID will be used. 
   * If a different value is returned, CloudFormation will follow with a subsequent Delete 
   * for the previous ID (resource replacement). For Delete, it will always return the current 
   * physical resource ID, and if the user returns a different one, an error will occur.
   */
  PhysicalResourceId?: string;
  /**
   * Resource attributes, which can later be retrieved through Fn::GetAtt on the custom resource object.
   */
  Data?: DataAttributes;
  /**
   * Whether to mask the output of the custom resource when retrieved by using the Fn::GetAtt function.
   */
  NoEcho?: boolean;
}

/**
 * The lambda function called from CloudFormation for this custom resource.
 * 
 * @param event 
 * @returns attribues of the deployment that was created
 */
export async function handler(event: OnEventRequest): Promise<OnEventResponse> {
  const logger = new Logger();
  const codedeployClient = new AWS.CodeDeploy();
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
      }).promise();
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
        }).promise();
        logger.info(`Stopped deployment: ${resp.status} ${resp.statusMessage}`);
      } catch (e) {
        logger.warn('Ignoring error', {error: e as Error});
      }

      return {
        PhysicalResourceId: event.PhysicalResourceId,
        Data: {
          deploymentId: event.PhysicalResourceId,
        },
      };
    default:
      logger.error('Unknown stack event');
      throw new Error(`Unknown request type: ${event.RequestType}`);
  }
}

