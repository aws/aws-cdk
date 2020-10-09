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
    ttl = 60

    def __init__(self, route53_client: Any):
        self.route53_client = route53_client

    def update(self, locator: Route53RecordSetLocator, ipv4s: Set[str] = None):
        ipv4s = set() if ipv4s is None else ipv4s

        record_set, is_new = retry_with_backoff(lambda: self.get_record_set(locator))
        if is_new:
            logging.info(f'Found a pre-existing record set: {record_set}')
        else:
            logging.info('Creating a new record set')

        if len(ipv4s) > 0:
            record_set['ResourceRecords'] = map_ips_to_resource_records(ipv4s)
            retry_with_backoff(lambda: self.request_upsert(locator, record_set))
        elif not is_new:
            retry_with_backoff(lambda: self.request_delete(locator, record_set))
        else:
            logging.info('Refusing to do anything with an new but empty recordset')

    def get_record_set(self, locator: Route53RecordSetLocator) -> Tuple[dict, bool]:
        record_type = 'A'
        result = self.route53_client.list_resource_record_sets(HostedZoneId=locator.hosted_zone_id,
                                                               StartRecordName=locator.record_name,
                                                               StartRecordType=record_type, MaxItems="1")

        existing_record_set = find_locator_record_set(locator, record_type, result['ResourceRecordSets'])
        if existing_record_set:
            return existing_record_set, False
        else:
            return {'Name': locator.record_name, 'Type': record_type, 'ResourceRecords': [], 'TTL': self.ttl}, True

    def request_upsert(self, locator: Route53RecordSetLocator, record_set):
        logging.info(f'Upserting record set {record_set}')
        self.route53_client.change_resource_record_sets(
            HostedZoneId=locator.hosted_zone_id, ChangeBatch={
                'Comment': 'Automatic',
                'Changes': [{
                    'Action': 'UPSERT',
                    'ResourceRecordSet': record_set
                }]
            })

    def delete(self, locator: Route53RecordSetLocator):
        """
        Delete the record. Returns true if it found and deleted the record.
        Returns false if it didn't need to delete anything.
        """

        record_set, is_new = retry_with_backoff(lambda: self.get_record_set(locator))

        if not is_new:
            retry_with_backoff(lambda: self.request_delete(locator, record_set))
            logging.info(f'Deleted record set {record_set}')
            return True

        else:
            return False

    def exists(self, locator: Route53RecordSetLocator):
        """
        Returns true if the record exists. False otherwise.
        """

        _, is_new = retry_with_backoff(lambda: self.get_record_set(locator))

        return not is_new

    def request_delete(self, locator: Route53RecordSetLocator, record_set):
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

            if e.response['Error']['Code'] == 'PriorRequestNotComplete':
                backoff_seconds = backoff(attempt)
                logging.info(
                    f'Attempt {attempt+1} discovered the prior request is not yet complete. Backing off for {backoff_seconds}.'
                )
                time.sleep(backoff_seconds)
                continue

            raise


def map_ips_to_resource_records(ips: Set[str]):
    # Take up to the first 400 ips after sorting as the max recordset record quota is 400
    ips_sorted_limited = sorted(ips)[0:400]
    return [{'Value': ip} for ip in ips_sorted_limited]


def find_locator_record_set(locator: Route53RecordSetLocator, record_type: str, record_sets: list):
    for record_set in record_sets:
        if record_set['Name'] == locator.record_name and record_set['Type'] == record_type:
            return record_set

    return None
