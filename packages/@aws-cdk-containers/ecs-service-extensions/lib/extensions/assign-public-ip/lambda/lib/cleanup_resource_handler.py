import time
from dataclasses import dataclass
import logging
from typing import Any

from lib.route53 import Route53RecordSetAccessor, Route53RecordSetLocator


@dataclass
class CleanupResourceProperties:
    HostedZoneId: str
    RecordName: str
    ServiceToken: str


class CleanupResourceHandler:
    route53_client: Any
    monitor_interval: int

    def __init__(self, route53_client, monitor_interval=5):
        self.record_set_accessor = Route53RecordSetAccessor(route53_client=route53_client)
        self.monitor_interval = monitor_interval

    def handle_event(self, event, context):
        request_type = event['RequestType']
        resource_properties = event['ResourceProperties']
        logging.info(f'Handling a {request_type} event with properties {resource_properties}')

        # Decode resource properties right away so that mis-configured
        # properties will always fail quickly.
        resource_properties = CleanupResourceProperties(**resource_properties)

        if request_type == 'Delete':
            return self.on_delete(resource_properties)

    def on_delete(self, resource_properties: CleanupResourceProperties):
        locator = Route53RecordSetLocator(hosted_zone_id=resource_properties.HostedZoneId,
                                          record_name=resource_properties.RecordName)

        deleted = self.record_set_accessor.delete(locator=locator)

        if deleted:
            logging.info(f'Monitoring for the record deletion')
            for interval_number in range(1, 10):
                if not self.record_set_accessor.exists(locator):
                    logging.info(f'The record has been deleted')
                    return
                else:
                    logging.info(f'The record still exists')
                    if self.monitor_interval > 0:
                        time.sleep(self.monitor_interval)
