import unittest
import unittest.mock as mock
import logging

import boto3

from lib.route53 import *


class TestRoute53(unittest.TestCase):
  def xtest_live(self):
    """
    Test with route53 live. Remove the x before xtest_live to run this test with
    the other tests and enter your zone id in hosted_zone_id below.
    """
    merger = Route53RecordSetMerger(boto3.client('route53'))

    locator = Route53RecordSetLocator(hosted_zone_id='enter your myexample.com zone id here',
                                      record_name='testing.myexample.com')

    merger.merge(locator=locator, adds=['1.2.3.4'])
    merger.merge(locator=locator, adds=['1.2.3.4'])  # Should not cause an error
    merger.merge(locator=locator, adds=['4.5.6.7'])
    merger.merge(locator=locator, removes=['1.2.3.4'])
    merger.merge(locator=locator, removes=['4.5.6.7'])

  def getRoute53ClientMock(self):
    route53_client = mock.Mock()
    record_set_value = None

    route53_client.list_resource_record_sets = mock.Mock(
        side_effect=lambda **kwargs: {'ResourceRecordSets': [record_set_value] if record_set_value is not None else []})

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

  def test_merger_creates_records(self):
    # GIVEN
    route53_client = self.getRoute53ClientMock()
    merger = Route53RecordSetMerger(route53_client)
    locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='foo.myexample.com')

    # WHEN
    merger.merge(locator=locator, adds=['1.1.1.1'])

    # THEN
    route53_client.change_resource_record_sets.assert_called_with(
        HostedZoneId='foo', ChangeBatch={
            'Comment':
            'Automatic',
            'Changes': [{
                'Action': 'UPSERT',
                'ResourceRecordSet': {
                    'Name': 'foo.myexample.com',
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

  def test_merger_merges_records(self):
    # GIVEN
    route53_client = self.getRoute53ClientMock()
    merger = Route53RecordSetMerger(route53_client)
    locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='foo.myexample.com')

    # WHEN
    merger.merge(locator=locator, adds=['1.1.1.1'])
    merger.merge(locator=locator, adds=['1.1.1.2'])
    merger.merge(locator=locator, adds=['1.1.1.3'], removes=['1.1.1.1'])

    # THEN
    route53_client.change_resource_record_sets.assert_called_with(
        HostedZoneId='foo', ChangeBatch={
            'Comment':
            'Automatic',
            'Changes': [{
                'Action': 'UPSERT',
                'ResourceRecordSet': {
                    'Name': 'foo.myexample.com',
                    'Type': 'A',
                    'ResourceRecords': [
                        {
                            'Value': '1.1.1.2'
                        },
                        {
                            'Value': '1.1.1.3'
                        },
                    ],
                    'TTL': 60
                }
            }]
        })

  def test_merger_deletes_records(self):
    # GIVEN
    route53_client = self.getRoute53ClientMock()
    merger = Route53RecordSetMerger(route53_client)
    locator = Route53RecordSetLocator(hosted_zone_id='foo', record_name='foo.myexample.com')

    # WHEN
    merger.merge(locator=locator, adds=['1.1.1.1'])
    merger.merge(locator=locator, removes=['1.1.1.1'])

    # THEN
    route53_client.change_resource_record_sets.assert_called_with(
        HostedZoneId='foo', ChangeBatch={
            'Comment':
            'Automatic',
            'Changes': [{
                'Action': 'DELETE',
                'ResourceRecordSet': {
                    'Name': 'foo.myexample.com',
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

  def test_merging_record_changes(self):
    # GIVEN
    records = [{'Value': '1.2.3.4'}, {'Value': '8.8.8.8'}]
    adds = ['4.3.2.1', '1.2.3.4']
    removes = ['8.8.8.8']

    # WHEN
    merged_records = merge_record_changes(records=records, adds=adds, removes=removes)

    # THEN
    self.assertTrue(any([record['Value'] == '1.2.3.4' for record in merged_records]))
    self.assertTrue(any([record['Value'] == '4.3.2.1' for record in merged_records]))
    self.assertFalse(any([record['Value'] == '8.8.8.8' for record in merged_records]))
    self.assertEqual(len(merged_records), 2)


if __name__ == "__main__":
  logging.getLogger().setLevel(logging.INFO)
  unittest.main()
