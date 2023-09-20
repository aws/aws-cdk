// eslint-disable-next-line import/no-extraneous-dependencies
import {
  StartSchemaMergeCommand,
  AppSyncClient,
  SourceApiAssociationStatus,
  GetSourceApiAssociationCommand,
  GetSourceApiAssociationCommandInput,
} from '@aws-sdk/client-appsync';

const appSyncClient = new AppSyncClient();

type SchemaMergeResult = {
  associationId?: string,
  mergedApiIdentifier?: string,
  PhysicalResourceId: string,
  sourceApiAssociationStatus?: SourceApiAssociationStatus,
};

type IsCompleteResult = {
  IsComplete: boolean,
  Data?: Object
}

export async function onEvent(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<SchemaMergeResult> {
  const params = {
    associationId: event.ResourceProperties.associationId,
    mergedApiIdentifier: event.ResourceProperties.mergedApiIdentifier,
  };

  switch (event.RequestType) {
    case 'Update':
    case 'Create':
      return performSchemaMerge(params);
    case 'Delete':
    default:
      return {
        ...params,
        PhysicalResourceId: params.associationId,
      };
  }
}

export async function isComplete(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<IsCompleteResult> {
  const params = {
    associationId: event.ResourceProperties.associationId,
    mergedApiIdentifier: event.ResourceProperties.mergedApiIdentifier,
  };

  return getSchemaMergeStatus(params);
}

async function performSchemaMerge(params: any): Promise<SchemaMergeResult> {
  const command = new StartSchemaMergeCommand(params);

  try {
    const response = await appSyncClient.send(command);
    switch (response.sourceApiAssociationStatus) {
      case SourceApiAssociationStatus.MERGE_SCHEDULED:
      case SourceApiAssociationStatus.MERGE_IN_PROGRESS:
      case SourceApiAssociationStatus.MERGE_SUCCESS:
        break;
      default:
        throw new Error('Unexpected status after starting schema merge:' + response.sourceApiAssociationStatus);
    }

    return {
      ...params,
      PhysicalResourceId: params.associationId,
      sourceApiAssociationStatus: response.sourceApiAssociationStatus,
    };
  } catch (error: any) {

    // eslint-disable-next-line no-console
    console.error('An error occurred submitting the schema merge', error);
    throw error;
  }
}

async function getSchemaMergeStatus(params: GetSourceApiAssociationCommandInput): Promise<IsCompleteResult> {
  const command = new GetSourceApiAssociationCommand(params);
  var response;

  try {
    response = await appSyncClient.send(command);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error starting the schema merge operation', error);
    throw error;
  }

  if (!response.sourceApiAssociation) {
    throw new Error(`SourceApiAssociation ${params.associationId} not found.`);
  }

  switch (response.sourceApiAssociation.sourceApiAssociationStatus) {
    case SourceApiAssociationStatus.MERGE_SCHEDULED:
    case SourceApiAssociationStatus.MERGE_IN_PROGRESS:
    case SourceApiAssociationStatus.DELETION_SCHEDULED:
    case SourceApiAssociationStatus.DELETION_IN_PROGRESS:
      return {
        IsComplete: false,
      };

    case SourceApiAssociationStatus.MERGE_SUCCESS:
      return {
        IsComplete: true,
        Data: {
          ...params,
          sourceApiAssociationStatus: response.sourceApiAssociation.sourceApiAssociationStatus,
          sourceApiAssociationStatusDetail: response.sourceApiAssociation.sourceApiAssociationStatusDetail,
          lastSuccessfulMergeDate: response.sourceApiAssociation.lastSuccessfulMergeDate?.toString(),
        },
      };

    case SourceApiAssociationStatus.MERGE_FAILED:
    case SourceApiAssociationStatus.DELETION_FAILED:
    case SourceApiAssociationStatus.AUTO_MERGE_SCHEDULE_FAILED:
      throw new Error(`Source API Association: ${response.sourceApiAssociation.associationArn} failed to merge with status: `
        + `${response.sourceApiAssociation.sourceApiAssociationStatus} and message: ${response.sourceApiAssociation.sourceApiAssociationStatusDetail}`);

    default:
      throw new Error(`Unexpected source api association status: ${response.sourceApiAssociation.sourceApiAssociationStatus}`);
  }
}