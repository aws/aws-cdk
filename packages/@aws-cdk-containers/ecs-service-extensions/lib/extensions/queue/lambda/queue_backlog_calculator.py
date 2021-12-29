from math import ceil
import time
import json

class QueueHandler:
  def __init__(self, ecs_client, sqs_client, environ):
    self.ecs = ecs_client
    self.sqs = sqs_client
    self.cluster_name = environ['CLUSTER_NAME']
    self.service_name = environ['SERVICE_NAME']
    self.namespace = environ['NAMESPACE']
    self.queue_names = environ['QUEUE_NAMES'].split(',')

  def emit(self):
    try:
      running_count = self.get_running_task_count()
      backlogs = [self.get_queue_backlog(queue_name, running_count) for queue_name in self.queue_names]
      self.timestamp = int(time.time() * 1000)
      for backlog in backlogs:
        self.emit_backlog_per_task_metric(backlog['queueName'], backlog['backlogPerTask'])
    except Exception as e:
      Exception('Exception: {}'.format(e))

  """
  Write the backlogPerTask metric to the stdout according to the Cloudwatch embedded metric format.
  """
  def emit_backlog_per_task_metric(self, queue_name, backlog_per_task):
    print(json.dumps({
      "_aws": {
        "Timestamp": self.timestamp,
        "CloudWatchMetrics": [{
          "Namespace": self.namespace,
          "Dimensions": [["QueueName"]],
          "Metrics": [{"Name":"BacklogPerTask", "Unit": "Count"}]
        }],
      },
      "QueueName": queue_name,
      "BacklogPerTask": backlog_per_task,
    }))

  """
  Get the number of tasks in the 'RUNNING' state for the service 'service_name'.
  """
  def get_running_task_count(self):
    service_desc = self.ecs.describe_services(
      cluster=self.cluster_name,
      services=[self.service_name],
    )
    if len(service_desc['services']) == 0:
      raise Exception('There are no services with name {} in cluster: {}'.format(self.service_name, self.cluster_name))
    return service_desc['services'][0].get('runningCount', 0)

  """
  This method calculates and returns the backlogPerTask metric for the given queue.
  """
  def get_queue_backlog(self, queue_name, count):
    queue_url = self.sqs.get_queue_url(QueueName=queue_name)
    running_count = 1 if count == 0 else count

    def get_backlog_per_task():
      queue_attributes = self.sqs.get_queue_attributes(
        QueueUrl=queue_url['QueueUrl'],
        AttributeNames=['ApproximateNumberOfMessages']
      )
      num_of_msgs = int(queue_attributes['Attributes'].get('ApproximateNumberOfMessages', 0))
      return ceil(num_of_msgs/running_count)

    return {
      'queueName': queue_name,
      'backlogPerTask': get_backlog_per_task()
    }