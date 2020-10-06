from dataclasses import dataclass
import time
from typing import *
import logging

from botocore.exceptions import ClientError


@dataclass
class Route53RecordSetLocator:
    hosted_zone_id: str
    record_name: str


class Route53RecordSetAccessor:
    route53_client: Any
    locator: Route53RecordSetLocator
    ttl = 60

    def __init__(self, route53_client: Any):
        self.route53_client = route53_client

    def update(self, locator: Route53RecordSetLocator, ipv4s: Set[str] = None):
        ipv4s = set() if ipv4s is None else ipv4s

        record_set, is_new = retry_with_backoff(lambda: self.get_record_set(locator))

        if len(ipv4s) > 0:
            record_set['ResourceRecords'] = map_ips_to_resource_records(ipv4s)
            retry_with_backoff(lambda: self.upsert(locator, record_set))
        elif not is_new:
            retry_with_backoff(lambda: self.delete(locator, record_set))
        else:
            logging.info('Refusing to do anything with an new but empty recordset')

    def get_record_set(self, locator: Route53RecordSetLocator) -> Tuple[dict, bool]:
        record_type = 'A'
        result = self.route53_client.list_resource_record_sets(HostedZoneId=locator.hosted_zone_id,
                                                               StartRecordName=locator.record_name,
                                                               StartRecordType=record_type, MaxItems="1")

        record_sets = result['ResourceRecordSets']
        if len(record_sets) > 0:
            logging.info(f'Found a pre-existing record set: {record_sets[0]}')
            return record_sets[0], False

        logging.info('Creating a new record set')
        return {'Name': locator.record_name, 'Type': record_type, 'ResourceRecords': [], 'TTL': self.ttl}, True

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


def exponential_backoff(attempt: int):
    return 2**attempt


def retry_with_backoff(call: Callable, attempts=5, backoff=exponential_backoff):
    for attempt in range(0, attempts):
        try:
            return call()
        except ClientError as e:
            if e.response['Error']['Code'] == 'Throttling':
                backoff_seconds = backoff(attempt)
                logging.info(f'Attempt {attempt+1} throttled. Backing off for {backoff_seconds}.')
                time.sleep(backoff_seconds)
                continue
            raise


def map_ips_to_resource_records(ips: Set[str]):
    # Take up to the first 400 ips after sorting as the max recordset record quota is 400
    ips_sorted_limited = sorted(ips)[0:400]
    return [{'Value': ip} for ip in ips_sorted_limited]
