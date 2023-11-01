import boto3, json, os, time

ecs = boto3.client('ecs')
autoscaling = boto3.client('autoscaling')


def lambda_handler(event, context):
  print(json.dumps(dict(event, ResponseURL='...')))

  cluster = os.environ['CLUSTER']
  lifecycle_event = json.loads(event['Records'][0]['Sns']['Message'])
  instance_id = lifecycle_event.get('EC2InstanceId', None)

  if not instance_id:
    print(f'Got event without EC2InstanceId: {json.dumps(dict(event, ResponseURL="..."))}')
    return

  instance_arn = container_instance_arn(cluster, instance_id)
  print(f'Instance {lifecycle_event["EC2InstanceId"]} has container instance ARN {instance_arn}')

  if not instance_arn:
    return

  task_arns = container_instance_task_arns(cluster, instance_arn)

  if task_arns:
    print(f'Instance ARN {instance_arn} has task ARNs {", ".join(task_arns)}')

  while has_tasks(cluster, instance_arn, task_arns):
    time.sleep(10)

  complete_lifecycle_action(instance_id, lifecycle_event)


def complete_lifecycle_action(instance_id, lifecycle_event):
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
  arns = list_container_instances(cluster, instance_id)
  if not arns:
    return None
  return arns[0]

 
def list_container_instances(cluster, instance_id):
  return ecs.list_container_instances(cluster=cluster, filter='ec2InstanceId==' + instance_id)['containerInstanceArns']


def container_instance_task_arns(cluster, instance_arn):
  """Fetch tasks for a container instance ARN."""
  arns = list_tasks(cluster, instance_arn)
  return arns


def list_tasks(cluster, instance_arn):
  return ecs.list_tasks(cluster=cluster, containerInstance=instance_arn)['taskArns']


def has_tasks(cluster, instance_arn, task_arns):
  """Return True if the instance is running tasks for the given cluster."""
  instances = describe_container_instances(cluster, instance_arn)
  if not instances:
    return False
  instance = instances[0]

  if instance['status'] == 'ACTIVE':
    # Start draining, then try again later
    set_container_instance_to_draining(cluster, instance_arn)
    return True

  task_count = None

  if task_arns:
    # Fetch details for tasks running on the container instance
    tasks = describe_tasks(cluster, task_arns)
    if tasks:
      # Consider any non-stopped tasks as running
      task_count = sum(task['lastStatus'] != 'STOPPED' for task in tasks) + instance['pendingTasksCount']

  if not task_count:
    # Fallback to instance task counts if detailed task information is unavailable
    task_count = instance['runningTasksCount'] + instance['pendingTasksCount']

  print('Instance %s has %s tasks' % (instance_arn, task_count))

  return task_count > 0


def describe_container_instances(cluster, instance_arn):
  return ecs.describe_container_instances(cluster=cluster, containerInstances=[instance_arn])['containerInstances']


def describe_tasks(cluster, task_arns):
  return ecs.describe_tasks(cluster=cluster, tasks=task_arns)['tasks']


def set_container_instance_to_draining(cluster, instance_arn):
  ecs.update_container_instances_state(
      cluster=cluster,
      containerInstances=[instance_arn], status='DRAINING')


def pick(dct, *keys):
  """Pick a subset of a dict."""
  return {k: v for k, v in dct.items() if k in keys}
