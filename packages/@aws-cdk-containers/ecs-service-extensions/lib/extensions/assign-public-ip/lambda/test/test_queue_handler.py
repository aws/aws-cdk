import unittest
import unittest.mock as mock

from lib.queue_handler import QueueHandler


class TestQueueHandler(unittest.TestCase):
    def test_queue_handler_sets_up(self):
        environ = {
            'HOSTED_ZONE_ID': 'HOSTED_ZONE_ID',
            'RECORD_NAME': 'RECORD_NAME',
            'RECORDS_TABLE': 'RECORDS_TABLE',
            'CLUSTER_ARN': 'CLUSTER_ARN',
            'SERVICE_NAME': 'SERVICE_NAME',
        }

        ec2_client = mock.Mock()
        route53_client = mock.Mock()
        dynamodb_resource = mock.Mock()

        # WHEN

        handler = QueueHandler(ec2_client=ec2_client, route53_client=route53_client,
                               dynamodb_resource=dynamodb_resource, environ=environ)

        # THEN
        dynamodb_resource.Table.called_width('RECORDS_TABLE')

        pass
