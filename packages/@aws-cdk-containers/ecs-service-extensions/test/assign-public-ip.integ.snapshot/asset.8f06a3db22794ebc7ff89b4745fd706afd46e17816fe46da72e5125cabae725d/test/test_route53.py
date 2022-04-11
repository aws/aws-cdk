import unittest
import unittest.mock as mock

from botocore.exceptions import ClientError

from lib.route53 import Route53RecordSetLocator, Route53RecordSetAccessor, exponential_backoff, retry_with_backoff, \
    map_ips_to_resource_records, find_locator_record_set


class TestRoute53(unittest.TestCase):
    def get_route53_client_mock(self):
        route53_client = mock.Mock()
        record_set_value = None

        route53_client.list_resource_record_sets = mock.Mock(
            side_effect=lambda **kwargs:
            {'ResourceRecordSets': [record_set_value] if record_set_value is not None else []})

        def change_resource_record_sets(HostedZoneId, ChangeBatch):
            nonlocal record_set_value
            change = ChangeBatch['Changes'][0]
            change_action = change['Action']

            if change_action == 'UPSERT':
                record_set_value = change['ResourceRecordSet']
            elif change_action == 'DELETE':
                record_set_value = None

        route53_client.change_resource_record_sets = mock.Mock(side_effect=change_resource_record_sets)

        return route53_client

    def test_creating_records(self):
        # GIVEN
        route53_client = self.get_route53_client_mock()
        locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='foo.myexample.com')
        merger = Route53RecordSetAccessor(route53_client)

        # WHEN
        merger.update(locator, ipv4s={'1.1.1.1'})

        # THEN
        route53_client.change_resource_record_sets.assert_called_with(
            HostedZoneId='foo', ChangeBatch={
                'Comment':
                'Automatic',
                'Changes': [{
                    'Action': 'UPSERT',
                    'ResourceRecordSet': {
                        'Name': 'foo.myexample.com.',
                        'Type': 'A',
                        'ResourceRecords': [
                            {
                                'Value': '1.1.1.1'
                            },
                        ],
                        'TTL': 60
                    }
                }]
            })

    def test_creating_empty_records(self):
        # GIVEN
        route53_client = self.get_route53_client_mock()
        locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='foo.myexample.com')
        merger = Route53RecordSetAccessor(route53_client)

        # WHEN
        merger.update(locator, ipv4s=set())

        # THEN
        route53_client.change_resource_record_sets.assert_not_called()

    def test_deleting_records(self):
        # GIVEN
        route53_client = self.get_route53_client_mock()
        locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='foo.myexample.com')
        record_set = Route53RecordSetAccessor(route53_client)

        # Set up the mock with a record.
        record_set.update(locator, ipv4s={'1.1.1.1'})

        # WHEN
        record_set.update(locator, ipv4s=set())

        # THEN
        route53_client.change_resource_record_sets.assert_called_with(
            HostedZoneId='foo', ChangeBatch={
                'Comment':
                'Automatic',
                'Changes': [{
                    'Action': 'DELETE',
                    'ResourceRecordSet': {
                        'Name': 'foo.myexample.com.',
                        'Type': 'A',
                        'ResourceRecords': [
                            {
                                'Value': '1.1.1.1'
                            },
                        ],
                        'TTL': 60
                    }
                }]
            })

    def test_deleting_records_with_frontend(self):
        # GIVEN
        route53_client = self.get_route53_client_mock()
        locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='foo.myexample.com')
        record_set = Route53RecordSetAccessor(route53_client)

        # Set up the mock with a record.
        record_set.update(locator, ipv4s={'1.1.1.1'})

        # WHEN
        record_set.delete(locator)

        # THEN
        self.assertEqual(route53_client.list_resource_record_sets.call_count, 2)
        route53_client.change_resource_record_sets.assert_called_with(
            HostedZoneId='foo', ChangeBatch={
                'Comment':
                'Automatic',
                'Changes': [{
                    'Action': 'DELETE',
                    'ResourceRecordSet': {
                        'Name': 'foo.myexample.com.',
                        'Type': 'A',
                        'ResourceRecords': [
                            {
                                'Value': '1.1.1.1'
                            },
                        ],
                        'TTL': 60
                    }
                }]
            })

    def test_deleting_no_records_with_frontend(self):
        # GIVEN
        route53_client = self.get_route53_client_mock()
        locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='foo.myexample.com')
        record_set = Route53RecordSetAccessor(route53_client)

        # WHEN
        record_set.delete(locator)

        # THEN
        self.assertEqual(route53_client.list_resource_record_sets.call_count, 1)
        route53_client.change_resource_record_sets.assert_not_called()

    def test_checks_not_exists(self):
        # GIVEN
        route53_client = self.get_route53_client_mock()
        locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='foo.myexample.com')
        record_set = Route53RecordSetAccessor(route53_client)

        # WHEN
        exists = record_set.exists(locator)

        # THEN
        self.assertTrue(not exists)

    def test_checks_exists(self):
        # GIVEN
        route53_client = self.get_route53_client_mock()
        locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='foo.myexample.com')
        record_set = Route53RecordSetAccessor(route53_client)

        # WHEN
        record_set.update(locator, ipv4s={'1.1.1.1'})
        exists = record_set.exists(locator)

        # THEN
        self.assertTrue(exists)

    def test_exponential_backoff(self):
        self.assertEqual(exponential_backoff(0), 1)
        self.assertEqual(exponential_backoff(1), 2)
        self.assertEqual(exponential_backoff(2), 4)

    def test_retry_with_backoff_throttling(self):
        # GIVEN
        call = mock.Mock(side_effect=ClientError(error_response={'Error': {
            'Code': 'Throttling'
        }}, operation_name='any'))

        # WHEN
        retry_with_backoff(call, attempts=5, backoff=lambda x: 0)

        # THEN
        self.assertEqual(call.call_count, 5)

    def test_retry_with_backoff_prior_request_not_complete(self):
        # GIVEN
        call = mock.Mock(side_effect=ClientError(error_response={'Error': {
            'Code': 'PriorRequestNotComplete'
        }}, operation_name='any'))

        # WHEN
        retry_with_backoff(call, attempts=5, backoff=lambda x: 0)

        # THEN
        self.assertEqual(call.call_count, 5)

    def test_retry_with_backoff_other_client_errors(self):
        # GIVEN
        call = mock.Mock(side_effect=ClientError(error_response={'Error': {
            'Code': 'SomethingElse'
        }}, operation_name='any'))

        # WHEN/THEN
        with self.assertRaisesRegex(ClientError, r'SomethingElse'):
            retry_with_backoff(call, attempts=5, backoff=lambda x: 0)
        self.assertEqual(call.call_count, 1)

    def test_retry_with_backoff_other_errors(self):
        # GIVEN
        call = mock.Mock(side_effect=Exception('very good reason'))

        # WHEN/THEN
        with self.assertRaisesRegex(Exception, r'very good reason'):
            retry_with_backoff(call, attempts=5, backoff=lambda x: 0)
        self.assertEqual(call.call_count, 1)

    def test_map_ips_to_resource_records(self):
        # GIVEN
        ips = {'1.1.1.1', '1.1.1.2'}

        # WHEN
        output = map_ips_to_resource_records(ips)

        # THEN
        self.assertEqual(output, [{'Value': '1.1.1.1'}, {'Value': '1.1.1.2'}])

    def test_map_ips_to_resource_records_truncates_to_400(self):
        # GIVEN
        ips = {f'1.1.{a}.{b}' for a in range(1, 255) for b in range(1, 255)}

        # WHEN
        output = map_ips_to_resource_records(ips)

        # THEN
        self.assertEqual(len(output), 400)

    def test_find_locator_record_set_ignores_irrelevant_records(self):
        # GIVEN
        locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='test-record.myexample.com')
        record_sets = [{
            'Name': 'u-record.myexample.com.',
            'Type': 'A',
            'TTL': 60,
            'ResourceRecords': [{
                'Value': '1.1.1.1'
            }]
        }]

        # WHEN
        result = find_locator_record_set(locator, 'A', record_sets)

        # THEN
        self.assertIsNone(result)

    def test_find_locator_record_set_finds_it(self):
        # GIVEN
        locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='test-record.myexample.com')
        matching_record = {
            'Name': 'test-record.myexample.com.',
            'Type': 'A',
            'TTL': 60,
            'ResourceRecords': [{
                'Value': '1.1.1.1'
            }]
        }
        record_sets = [matching_record]

        # WHEN
        result = find_locator_record_set(locator, 'A', record_sets)

        # THEN
        self.assertEqual(result, matching_record)
