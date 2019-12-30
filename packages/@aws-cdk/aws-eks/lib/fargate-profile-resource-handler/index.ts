// tslint:disable: no-console
// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';

const eks = new aws.EKS();

export async function onEvent(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create': return onCreate(event);
    case 'Update': return onUpdate(event);
    case 'Delete': return onDelete(event);
  }
}

async function onCreate(event: AWSLambda.CloudFormationCustomResourceCreateEvent) {
  const fargateProfileName = event.ResourceProperties.Config.fargateProfileName ?? generateProfileName(event);

  const createFargateProfile: aws.EKS.CreateFargateProfileRequest = {
    fargateProfileName,
    ...event.ResourceProperties.Config
  };

  const response = await eks.createFargateProfile(createFargateProfile).promise();

  return {
    PhysicalResourceId: response.fargateProfile?.fargateProfileName,
    Data: {
      fargateProfileArn: response.fargateProfile?.fargateProfileArn,
    }
  };
}

async function onUpdate(event: AWSLambda.CloudFormationCustomResourceUpdateEvent) {
  // all updates require a replacement. as long as name is generated, we are good. if name is explicit, we cant update
  return onCreate({ ...event, RequestType: 'Create' });
}

async function onDelete(event: AWSLambda.CloudFormationCustomResourceDeleteEvent) {
  const deleteFargateProfile: aws.EKS.DeleteFargateProfileRequest = {
    clusterName: event.ResourceProperties.Config.clusterName,
    fargateProfileName: event.PhysicalResourceId!
  };

  await eks.deleteFargateProfile(deleteFargateProfile).promise();
}

export async function isComplete(event: AWSCDKAsyncCustomResource.IsCompleteRequest): Promise<AWSCDKAsyncCustomResource.IsCompleteResponse> {
  const status = await getProfileStatus(event);

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    return {
      IsComplete: status === 'ACTIVE'
    };
  }

  if (event.RequestType === 'Delete') {
    return {
      IsComplete: status === 'NOT_FOUND'
    };
  }

  throw new Error(`Invalid request type ${event.RequestType}`);
}

function generateProfileName(event: AWSLambda.CloudFormationCustomResourceCreateEvent) {
  return `${event.LogicalResourceId}-${event.RequestId}`;
}

async function getProfileStatus(event: AWSCDKAsyncCustomResource.IsCompleteRequest): Promise<aws.EKS.FargateProfileStatus | 'NOT_FOUND' | undefined> {
  const describeFargateProfile: aws.EKS.DescribeFargateProfileRequest = {
    clusterName: event.ResourceProperties.Config.clusterName,
    fargateProfileName: event.PhysicalResourceId!
  };

  try {

    console.log(JSON.stringify({ describeFargateProfile }, undefined,  2));
    const profile = await eks.describeFargateProfile(describeFargateProfile).promise();
    console.log('describeFargateProfile returned:', JSON.stringify(profile, undefined, 2));
    const status = profile.fargateProfile?.status;

    if (status === 'CREATE_FAILED' || status === 'DELETE_FAILED') {
      throw new Error(status);
    }

    return status;
  } catch (e) {
    if (e.code === 'ResourceNotFoundException') {
      console.log('received ResourceNotFoundException, this means the profile has been deleted (or never existed)');
      return 'NOT_FOUND';
    }

    console.log('describeFargateProfile error:', e);
    throw e;
  }
}
