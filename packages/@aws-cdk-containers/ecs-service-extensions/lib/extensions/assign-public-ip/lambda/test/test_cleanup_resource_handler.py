import unittest
import unittest.mock as mock

from lib.cleanup_resource_handler import CleanupResourceHandler
from lib.route53 import Route53RecordSetLocator


class TestCleanupResourceHandler(unittest.TestCase):
    def test_handler_rejects_invalid_properties(self):
        handler = CleanupResourceHandler(route53_client=mock.Mock())
        with self.assertRaises(Exception):
            handler.handle_event({'RequestType': 'Delete', 'ResourceProperties': {'Invalid': 'Invalid'}}, {})

    def test_handling_delete(self):
        handler = CleanupResourceHandler(route53_client=mock.Mock(), monitor_interval=0)
        record_set_accessor = mock.Mock()
        record_set_accessor.delete = mock.Mock(return_value=True)  # True = Deleted

        exists_count = 0

        def exists_side_effect(*args):
            nonlocal exists_count
            exists_count += 1
            return True if exists_count < 3 else False

        record_set_accessor.exists = mock.Mock(side_effect=exists_side_effect)

        handler.record_set_accessor = record_set_accessor

        event = {
            'RequestType': 'Delete',
            'ResourceProperties': {
                'ServiceToken': 'Something',
                'HostedZoneId': 'ZONE',
                'RecordName': 'something.mydomain.com'
            }
        }

        # WHEN
        handler.handle_event(event, {})

        # THEN
        expected_locator = Route53RecordSetLocator(hosted_zone_id='ZONE', record_name='something.mydomain.com')
        record_set_accessor.delete.assert_called_with(locator=expected_locator)
        record_set_accessor.exists.assert_called()
        self.assertEqual(record_set_accessor.exists.call_count, 3)
