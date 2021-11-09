from math import ceil
from time import time
import json

class QueueHandler:
  def __init__(self, ecs_client, sqs_client, environ):
    self.ecs = ecs_client
    self.sqs = sqs_client
    self.cluster_name = environ['CLUSTER_NAME']
    self.service_name = environ['SERVICE_NAME']
    self.namespace = environ['NAMESPACE']
    self.queue_names = str(environ['QUEUE_NAMES']).split(',')

  def handler(self, event, context):
    try:
      runningCount = self.getRunningTaskCount()
      backlogs = [self.getQueueBacklog(queueName, runningCount) for queueName in self.queue_names]
      self.timestamp = int(time() * 1000)
      for backlog in backlogs:
        self.emitBacklogPerTaskMetric(backlog['queueName'], backlog['backlogPerTask'])
    except Exception as e:
      Exception('Exception: {}'.format(e))

  """
  This method writes the backlogPerTask metric to the stdout according to the Cloudwatch embedded metric format.
  """
  def emitBacklogPerTaskMetric(self, queueName, backlogPerTask):
    print(json.dumps({
      "_aws": {
        "Timestamp": self.timestamp,
        "CloudWatchMetrics": [{
          "Namespace": self.namespace,
          "Dimensions": [["QueueName"]],
          "Metrics": [{"Name":"BacklogPerTask", "Unit": "Count"}]
        }],
      },
      "QueueName": queueName,
      "BacklogPerTask": backlogPerTask,
    }))

  """
  This method is used to get the number of tasks in the 'RUNNING' state for the service 'serviceName'.
  """
  def getRunningTaskCount(self):
    serviceDesc = self.ecs.describe_services(
      cluster=self.cluster_name,
      services=[self.service_name],
    )
    if len(serviceDesc['services']) == 0:
      raise Exception('There are no services with name {} in cluster: {}'.format(self.service_name, self.cluster_name))
    return serviceDesc['services'][0]['runningCount']

  """
  This method calculates and returns the backlogPerTask metric for the given queue.
  """
  def getQueueBacklog(self, queueName, count):
    queue_url = self.sqs.get_queue_url(QueueName=queueName)
    runningCount = 1 if count == 0 else count

    def getBacklogPerTask(queue_url, runningCount):
      queueAttributes = self.sqs.get_queue_attributes(
        QueueUrl=queue_url,
        AttributeNames=['ApproximateNumberOfMessages']
      )
      numberOfMessages = int(queueAttributes['Attributes']['ApproximateNumberOfMessages'])
      return ceil(numberOfMessages/runningCount)

    return {
      'queueName': queueName,
      'backlogPerTask': getBacklogPerTask(queue_url['QueueUrl'], runningCount)
    }