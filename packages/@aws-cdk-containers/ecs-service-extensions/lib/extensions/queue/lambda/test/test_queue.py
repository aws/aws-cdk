import json
import io
import unittest
import unittest.mock as mock
from time import time
from botocore.exceptions import ClientError
from lib.queue import QueueHandler


class TestQueueAutoscaling(unittest.TestCase):
  '''
  Test for unexpected error.
  '''
  def test_unexpected_error(self):
    ecs_client = mock.Mock()
    ecs_client.describe_services = mock.Mock(side_effect=ClientError({'Error': {'Code': 'UnexpectedError'}}, 'DescribeServices'))

    sqs_client = mock.Mock()
    environ = {
      'CLUSTER_NAME': 'TEST_CLUSTER',
      'SERVICE_NAME': 'TEST_SERVICE',
      'NAMESPACE': 'TEST',
      'QUEUE_NAMES': 'queue1'
    }

    queue_handler = QueueHandler(ecs_client, sqs_client, environ)
    queue_handler.handler({},{})

    self.assertRaisesRegex(Exception, r'UnexpectedError')

  '''
  Test for Exception when the service doesn't exist in cluster.
  '''
  @mock.patch('sys.stdout', new_callable=io.StringIO)
  def test_no_services_in_cluster(self, mock_stdout):
    ecs_client = mock.Mock()
    ecs_client.describe_services = mock.Mock(return_value={'services': []})

    sqs_client = mock.Mock()
    environ = {
      'CLUSTER_NAME': 'TEST_CLUSTER',
      'SERVICE_NAME': 'TEST_SERVICE',
      'NAMESPACE': 'TEST',
      'QUEUE_NAMES': 'queue1'
    }

    queue_handler = QueueHandler(ecs_client, sqs_client, environ)
    queue_handler.handler({},{})

    self.assertRaisesRegex(Exception, r'There are no services with name {} in cluster: {}'.format(environ['SERVICE_NAME'], environ['CLUSTER_NAME']))

  '''
  Test 'backPerTask' value is equal to 'ApproximateNumberOfMessages' in the queue when no tasks are running.
  '''
  @mock.patch('time.time', side_effect=mock.Mock(return_value=time()))
  @mock.patch('sys.stdout', new_callable=io.StringIO)
  def test_backlog_with_no_running_tasks(self, mock_stdout, mock_time):
    ecs_client = mock.Mock()
    ecs_client.describe_services = mock.Mock(return_value={'services': [{'runningCount': 0}]})

    sqs_client = mock.Mock()
    sqs_client.get_queue_url = mock.Mock('queue1', return_value= {'QueueUrl': 'queue1_url'})
    sqs_client.get_queue_attributes = mock.Mock('queue1_url', return_value={'Attributes': {'ApproximateNumberOfMessages':100}})
    environ = {
      'CLUSTER_NAME': 'TEST_CLUSTER',
      'SERVICE_NAME': 'TEST_SERVICE',
      'NAMESPACE': 'TEST',
      'QUEUE_NAMES': 'queue1'
    }

    queue_handler = QueueHandler(ecs_client, sqs_client, environ)
    queue_handler.handler({},{})

    metric = json.dumps({
      "_aws": {
        "Timestamp": int(time()*1000),
        "CloudWatchMetrics": [{
          "Namespace": "TEST",
          "Dimensions": [["QueueName"]],
          "Metrics": [{"Name":"BacklogPerTask", "Unit": "Count"}]
        }],
      },
      "QueueName": "queue1",
      "BacklogPerTask": 100,
    })
    self.assertEqual(mock_stdout.getvalue(), metric+'\n') 

  '''
  Test 'backPerTask' metric is generated correctly for each queue.
  '''
  @mock.patch('time.time', side_effect=mock.Mock(return_value=time()))
  @mock.patch('sys.stdout', new_callable=io.StringIO)
  def test_metric_generation_per_queue(self, mock_stdout, mock_time):
    ecs_client = mock.Mock()
    ecs_client.describe_services = mock.Mock(return_value={'services': [{'runningCount': 2}]})

    val1 = {
      'queue1': {'QueueUrl': 'queue1_url'},
      'queue2': {'QueueUrl': 'queue2_url'}
    }
    val2 = {
      'queue1_url': {'Attributes': {'ApproximateNumberOfMessages':101}},
      'queue2_url': {'Attributes': {'ApproximateNumberOfMessages':200}}
    }
    
    sqs_client = mock.Mock()
    sqs_client.get_queue_url.side_effect = [val1['queue1'], val1['queue2']]
    sqs_client.get_queue_attributes.side_effect = [val2['queue1_url'], val2['queue2_url']]
    environ = {
      'CLUSTER_NAME': 'TEST_CLUSTER',
      'SERVICE_NAME': 'TEST_SERVICE',
      'NAMESPACE': 'TEST',
      'QUEUE_NAMES': 'queue1,queue2'
    }
    
    queue_handler = QueueHandler(ecs_client, sqs_client, environ)
    queue_handler.handler({},{})
    
    metric1 = json.dumps({
      "_aws": {
        "Timestamp": int(time()*1000),
        "CloudWatchMetrics": [{
          "Namespace": "TEST",
          "Dimensions": [["QueueName"]],
          "Metrics": [{"Name":"BacklogPerTask", "Unit": "Count"}]
        }],
      },
      "QueueName": "queue1",
      "BacklogPerTask": 51,
    })
    metric2 = json.dumps({
      "_aws": {
        "Timestamp": int(time()*1000),
        "CloudWatchMetrics": [{
          "Namespace": "TEST",
          "Dimensions": [["QueueName"]],
          "Metrics": [{"Name":"BacklogPerTask", "Unit": "Count"}]
        }],
      },
      "QueueName": "queue2",
      "BacklogPerTask": 100,
    })
    
    self.assertEqual(mock_stdout.getvalue(), metric1+'\n'+metric2+'\n')


    
