import boto3  # type: ignore
import json
import logging
import urllib.request

s3 = boto3.client("s3")

EVENTBRIDGE_CONFIGURATION = 'EventBridgeConfiguration'
CONFIGURATION_TYPES = ["TopicConfigurations", "QueueConfigurations", "LambdaFunctionConfigurations"]

def handler(event: dict, context):
  response_status = "SUCCESS"
  error_message = ""
  try:
    props = event["ResourceProperties"]
    notification_configuration = props["NotificationConfiguration"]
    managed = props.get('Managed', 'true').lower() == 'true'
    stack_id = event['StackId']
    old = event.get("OldResourceProperties", {}).get("NotificationConfiguration", {})
    if managed:
      config = handle_managed(event["RequestType"], notification_configuration)
    else:
      config = handle_unmanaged(props["BucketName"], stack_id, event["RequestType"], notification_configuration, old)
    s3.put_bucket_notification_configuration(Bucket=props["BucketName"], NotificationConfiguration=config)
  except Exception as e:
    logging.exception("Failed to put bucket notification configuration")
    response_status = "FAILED"
    error_message = f"Error: {str(e)}. "
  finally:
    submit_response(event, context, response_status, error_message)

def handle_managed(request_type, notification_configuration):
  if request_type == 'Delete':
    return {}
  return notification_configuration

def handle_unmanaged(bucket, stack_id, request_type, notification_configuration, old):
  def with_id(n):
    n['Id'] = f"{stack_id}-{hash(json.dumps(n, sort_keys=True))}"
    return n

  # find external notifications
  external_notifications = {}
  existing_notifications = s3.get_bucket_notification_configuration(Bucket=bucket)
  for t in CONFIGURATION_TYPES:
    if request_type == 'Update':
        ids = [with_id(n) for n in old.get(t, [])]
        old_incoming_ids = [n['Id'] for n in ids]
        # if the notification was created by us, we know what id to expect so we can filter by it.
        external_notifications[t] = [n for n in existing_notifications.get(t, []) if not n['Id'] in old_incoming_ids]
    elif request_type == 'Create':
        # if this is a create event then all existing notifications are external
        external_notifications[t] = [n for n in existing_notifications.get(t, [])]
  # always treat EventBridge configuration as an external config if it already exists
  # as there is no way to determine whether it's managed by us or not
  if EVENTBRIDGE_CONFIGURATION in existing_notifications:
    external_notifications[EVENTBRIDGE_CONFIGURATION] = existing_notifications[EVENTBRIDGE_CONFIGURATION]

  # if delete, that's all we need
  if request_type == 'Delete':
    return external_notifications

  # otherwise, merge external with incoming config and augment with id
  notifications = {}
  for t in CONFIGURATION_TYPES:
    external = external_notifications.get(t, [])
    incoming = [with_id(n) for n in notification_configuration.get(t, [])]
    notifications[t] = external + incoming

  # EventBridge configuration is a special case because it's just an empty object if it exists
  if EVENTBRIDGE_CONFIGURATION in notification_configuration:
    notifications[EVENTBRIDGE_CONFIGURATION] = notification_configuration[EVENTBRIDGE_CONFIGURATION]
  elif EVENTBRIDGE_CONFIGURATION in external_notifications:
    notifications[EVENTBRIDGE_CONFIGURATION] = external_notifications[EVENTBRIDGE_CONFIGURATION]

  return notifications

def submit_response(event: dict, context, response_status: str, error_message: str):
  response_body = json.dumps(
    {
      "Status": response_status,
      "Reason": f"{error_message}See the details in CloudWatch Log Stream: {context.log_stream_name}",
      "PhysicalResourceId": event.get("PhysicalResourceId") or event["LogicalResourceId"],
      "StackId": event["StackId"],
      "RequestId": event["RequestId"],
      "LogicalResourceId": event["LogicalResourceId"],
      "NoEcho": False,
    }
  ).encode("utf-8")
  headers = {"content-type": "", "content-length": str(len(response_body))}
  try:
    req = urllib.request.Request(url=event["ResponseURL"], headers=headers, data=response_body, method="PUT")
    with urllib.request.urlopen(req) as response:
      print(response.read().decode("utf-8"))
    print("Status code: " + response.reason)
  except Exception as e:
      print("send(..) failed executing request.urlopen(..): " + str(e))
