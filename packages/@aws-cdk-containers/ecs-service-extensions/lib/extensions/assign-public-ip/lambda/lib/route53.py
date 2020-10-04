from dataclasses import dataclass
from typing import *
import logging


@dataclass
class Route53RecordSetLocator:
  hosted_zone_id: str
  record_name: str


# TODO: NEEDS OVERHAUL
class Route53RecordSetMerger:
  route53_client: Any
  dynamo_table_client: Any

  def __init__(self, route53_client):
    self.route53_client = route53_client

  def merge(self, locator: Route53RecordSetLocator, adds: List[str] = [], removes: List[str] = []):
    record_set, is_new = self.get_record_set(locator)
    new_record_set = merge_record_set_changes(record_set=record_set, adds=adds, removes=removes)

    if len(new_record_set['ResourceRecords']) > 0:
      self.upsert(locator, new_record_set)
    elif not is_new:
      self.delete(locator, record_set)
    else:
      logging.warn('Refusing to do anything with an new but empty recordset')

  def get_record_set(self, locator: Route53RecordSetLocator):
    record_type = 'A'
    result = self.route53_client.list_resource_record_sets(HostedZoneId=locator.hosted_zone_id,
                                                           StartRecordName=locator.record_name,
                                                           StartRecordType=record_type, MaxItems="1")

    record_sets = result['ResourceRecordSets']
    if len(record_sets) > 0:
      logging.info(f'Found a pre-existing record set: {record_sets[0]}')
      return record_sets[0], False

    logging.info('Creating a new record set')
    return {'Name': locator.record_name, 'Type': record_type, 'ResourceRecords': [], 'TTL': 60}, True

  def upsert(self, locator: Route53RecordSetLocator, record_set):
    logging.info(f'Upserting record set {record_set}')
    self.route53_client.change_resource_record_sets(
        HostedZoneId=locator.hosted_zone_id, ChangeBatch={
            'Comment': 'Automatic',
            'Changes': [{
                'Action': 'UPSERT',
                'ResourceRecordSet': record_set
            }]
        })

  def delete(self, locator: Route53RecordSetLocator, record_set):
    logging.info(f'Deleting record set: {record_set}')
    self.route53_client.change_resource_record_sets(
        HostedZoneId=locator.hosted_zone_id, ChangeBatch={
            'Comment': 'Automatic',
            'Changes': [{
                'Action': 'DELETE',
                'ResourceRecordSet': record_set,
            }]
        })


def merge_record_set_changes(record_set, adds: List[str], removes: List[str]):
  merged_record_set = record_set.copy()
  merged_record_set['ResourceRecords'] = merge_record_changes(records=merged_record_set['ResourceRecords'], adds=adds,
                                                              removes=removes)

  return merged_record_set


def merge_record_changes(records, adds: List[str], removes: List[str]):
  ips = {record['Value'] for record in records}

  # Add new ips to the set
  for add_ip in adds:
    ips.add(add_ip)

  # Remove ips from the set
  for remove_ip in removes:
    if remove_ip in ips:
      ips.remove(remove_ip)

  return [{'Value': ip} for ip in sorted(ips)]
