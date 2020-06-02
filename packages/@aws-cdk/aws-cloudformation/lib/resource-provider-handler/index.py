
import json
import logging
import boto3
import rpdk.core
from botocore.exceptions import ClientError
from rpdk.core.project import Project

LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.DEBUG)
LOGGER.info('Dependency "boto" version: %s' % boto3.__version__)
LOGGER.info('Dependency "cfn-cli" version: %s' % rpdk.core.__version__)


def on_event(event, context):
  LOGGER.debug(event)
  request_type = event['RequestType']
  props = event['ResourceProperties']
  session = boto3.Session(region_name=props['Region'])
  cfn_client = session.client('cloudformation')
  if request_type == 'Create': return on_create(cfn_client, event)
  if request_type == 'Update': return on_update(cfn_client, event)
  if request_type == 'Delete': return on_delete(cfn_client, event)
  raise Exception('Invalid request type: %s' % request_type)


def on_create(client, event):
  props = event['ResourceProperties']
  LOGGER.info('Register resource with properties %s' % props)

  registration_token = None
  physical_id = props['TypeName']
  execution_role_arn = props.get('ExecutionRoleArn')
  logging_config = props.get('LoggingConfig')
  kwargs = {
    'Type': props['Type'],
    'TypeName': physical_id,
    'SchemaHandlerPackage': props['SchemaHandlerPackage'],
    'ClientRequestToken': event['RequestId'],
  }
  if logging_config is not None:
    kwargs['LoggingConfig'] = logging_config
  if execution_role_arn is not None:
    kwargs['ExecutionRoleArn'] = execution_role_arn
  try:
    response = client.register_type(**kwargs)
    LOGGER.debug(response)
    registration_token = response['RegistrationToken']
  except ClientError as e:
    LOGGER.debug('Registering type resulted in unknown ClientError', exc_info=e)
    raise e

  event['ResourceProperties'] = { **props, **kwargs }
  return {
    'PhysicalResourceId': physical_id,
    'RegistrationToken': registration_token,
  }


def remove_previous_versions(client, props, deregister_completely=False):
  """Delete all previous versions of this resource type."""
  name = props['TypeName']

  try:
    response = client.list_type_versions(Type=props['Type'], TypeName=name)
    LOGGER.debug(response)
    summaries = response['TypeVersionSummaries']
    if summaries:
      if not summaries[0]['IsDefaultVersion']:
        initial_version_arn = summaries[0]['Arn']
        response = client.set_type_default_version(Arn=initial_version_arn)
        LOGGER.debug(response)
      for i, resource_type in reversed(list(enumerate(summaries))):
        deregister_arn = resource_type['Arn']
        if i == 0:
          if deregister_completely == True:
            deregister_arn = deregister_arn[:-9]
          else:
            deregister_arn = None
            LOGGER.info('Resource type with name %s will be kept' % name)
        if deregister_arn is not None:
          response = client.deregister_type(Arn=deregister_arn)
          LOGGER.debug(response)
  except ClientError as e:
    LOGGER.debug('Registering type resulted in unknown ClientError', exc_info=e)
    raise e


def on_update(client, event):
  physical_id = event['PhysicalResourceId']
  new_props = event['ResourceProperties']
  LOGGER.info('Update resource %s with properties %s' % (physical_id, new_props))

  newVersion = new_props['SemanticVersion']
  old_props = event['OldResourceProperties']
  oldVersion = old_props['SemanticVersion']

  if newVersion == oldVersion:
    return {
        'PhysicalResourceId': physical_id,
        'RegistrationToken': None,
      }
  else:
    remove_previous_versions(client, old_props, deregister_completely=False)
    return on_create(client, event)


def on_delete(client, event):
  physical_id = event['PhysicalResourceId']
  props = event['ResourceProperties']
  LOGGER.info('Delete resource %s with properties %s' % (physical_id, props))
  
  remove_previous_versions(client, props, deregister_completely=True)
  
  return {
    'PhysicalResourceId': physical_id,
  }


def is_complete(event, context):
  LOGGER.debug(event)
  physical_id = event['PhysicalResourceId']
  request_type = event['RequestType']
  props = event['ResourceProperties']
  LOGGER.info('Complete resource %s with properties %s' % (physical_id, props))

  # check if resource is stable based on request_type
  is_ready = False

  if request_type == 'Create' or request_type == 'Update':
    registration_token = event['RegistrationToken']

    if registration_token is None:
      return { 'IsComplete': True }

    session = boto3.Session(region_name=props['Region'])
    client = session.client('cloudformation')

    response = client.describe_type_registration(
      RegistrationToken=registration_token
    )
    LOGGER.debug(response)
    if response['ProgressStatus'] == 'COMPLETE':
      arn = response['TypeArn']
      version_arn = response['TypeVersionArn']
      try:
        response = client.set_type_default_version(Arn=version_arn)
        LOGGER.debug(response)
      except ClientError as e:
        LOGGER.debug(
            'Setting default version resulted in unknown ClientError',
            exc_info=e,
        )
        raise e
      LOGGER.info('Set default version to %s' % version_arn)
      response = client.describe_type(Arn=arn)
      LOGGER.debug(response)
      return {
        'IsComplete': True,
        'Data': {
          'TypeName': props['TypeName'],
          'TypeArn': arn,
          'Description': response['Description'],
          'TypeVersionArn': version_arn,
          'DefaultVersionId': response['DefaultVersionId'],
          'SemanticVersion': props['SemanticVersion'],
        },
      }
    elif response['ProgressStatus'] == 'IN_PROGRESS':
      is_ready = False
    else:
      is_ready = True    
  else:
    is_ready = True

  return { 'IsComplete': is_ready }
