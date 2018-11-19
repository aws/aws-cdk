import boto3, json, os, time

ecs = boto3.client('ecs')
autoscaling = boto3.client('autoscaling')


def lambda_handler(event, context):
  print(json.dumps(event))
  cluster = os.environ['CLUSTER']
  snsTopicArn = event['Records'][0]['Sns']['TopicArn']
  lifecycle_event = json.loads(event['Records'][0]['Sns']['Message'])
  instance_id = lifecycle_event.get('EC2InstanceId')
  if not instance_id:
    print('Got event without EC2InstanceId: %s', json.dumps(event))
    return

  instance_arn = container_instance_arn(cluster, instance_id)
  print('Instance %s has container instance ARN %s' % (lifecycle_event['EC2InstanceId'], instance_arn))

  if not instance_arn:
    return

  while has_tasks(cluster, instance_arn):
    time.sleep(10)

  try:
    print('Terminating instance %s' % instance_id)
    autoscaling.complete_lifecycle_action(
        LifecycleActionResult='CONTINUE',
        **pick(lifecycle_event, 'LifecycleHookName', 'LifecycleActionToken', 'AutoScalingGroupName'))
  except Exception as e:
    # Lifecycle action may have already completed.
    print(str(e))


def container_instance_arn(cluster, instance_id):
  """Turn an instance ID into a container instance ARN."""
  arns = ecs.list_container_instances(cluster=cluster, filter='ec2InstanceId==' + instance_id)['containerInstanceArns']
  if not arns:
    return None
  return arns[0]


def has_tasks(cluster, instance_arn):
  """Return True if the instance is running tasks for the given cluster."""
  instances = ecs.describe_container_instances(cluster=cluster, containerInstances=[instance_arn])['containerInstances']
  if not instances:
    return False
  instance = instances[0]

  if instance['status'] == 'ACTIVE':
    # Start draining, then try again later
    set_container_instance_to_draining(cluster, instance_arn)
    return True

  tasks = instance['runningTasksCount'] + instance['pendingTasksCount']
  print('Instance %s has %s tasks' % (instance_arn, tasks))

  return tasks > 0


def set_container_instance_to_draining(cluster, instance_arn):
  ecs.update_container_instances_state(
      cluster=cluster,
      containerInstances=[instance_arn], status='DRAINING')


def pick(dct, *keys):
  """Pick a subset of a dict."""
  return {k: v for k, v in dct.items() if k in keys}
