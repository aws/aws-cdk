import json
import logging
from typing import Any

from lib.events import extract_event_task_info
from lib.records import DdbRecordKey, DdbRecord
from lib.records_table import RecordsTableAccessor, RecordUpdate
from lib.route53 import Route53RecordSetLocator, Route53RecordSetAccessor
from lib.running_task_collector import RunningTaskCollector


class QueueHandler:
    def __init__(self, ec2_client, route53_client, dynamodb_resource, environ):
        self.ec2_client = ec2_client
        self.route53_client = route53_client

        hosted_zone_id = environ['HOSTED_ZONE_ID']
        record_name = environ['RECORD_NAME']
        records_table = environ['RECORDS_TABLE']

        cluster_arn = environ['CLUSTER_ARN']
        self.service_name = environ['SERVICE_NAME']

        self.records_table_key = DdbRecordKey(cluster_arn=cluster_arn, service_name=self.service_name)
        self.records_table_accessor = RecordsTableAccessor(table_client=dynamodb_resource.Table(records_table))

        self.record_set_locator = Route53RecordSetLocator(hosted_zone_id=hosted_zone_id, record_name=record_name)
        self.record_set_accessor = Route53RecordSetAccessor(route53_client=self.route53_client)

    def handle(self, event, context):
        logging.info(f'event = {json.dumps(event)}')

        # Get a reference record from the records table to check for incoming
        # event inconsistencies.
        reference_record = self.records_table_accessor.get_record(self.records_table_key)

        # Collect running and stopped tasks from the status change events
        running_tasks, stopped_tasks = self.collect_event_task_info(event, reference_record)

        # Build up a set of updates for the record
        update = RecordUpdate(running_tasks=running_tasks, stopped_tasks=stopped_tasks)

        # Record the current record set locator
        update.current_record_set(self.record_set_locator)

        # Clean any extra record sets in case the recordset has moved.
        for record_set_locator in reference_record.record_sets:
            if not record_set_locator.matches(self.record_set_locator):
                update.extra_record_set(record_set_locator)
                self.try_to_delete_record(record_set_locator)

        # Introduce some delay
        # records_table.optimistic_simulation_delay = 5

        # Update the record
        ddb_record = self.records_table_accessor.put_update(key=self.records_table_key, update=update)

        # Update DNS
        self.record_set_accessor.update(locator=self.record_set_locator, ipv4s=ddb_record.ipv4s)

    def collect_event_task_info(self, event, reference_record: DdbRecord):
        running_task_collector = RunningTaskCollector(ec2_client=self.ec2_client, reference_record=reference_record)
        stopped_tasks = []
        for message in decode_records(event):
            if 'details' not in message:
                logging.info(f'Received a non-task state message {message}')
                continue

            task_description = message['details']

            group = task_description['group']
            if group != f'service:{self.service_name}':
                logging.info(f'Skipping irrelevant task description from group {group}')
                continue

            task_info = extract_event_task_info(task_description)
            logging.info(f'extracted task_info = {task_info}')

            last_status = task_description['lastStatus']
            if last_status == 'RUNNING':
                logging.info(f'Collecting {task_info.task_arn} as running')
                running_task_collector.collect(task_info)

            elif last_status == 'STOPPED':
                logging.info(f'Collecting {task_info.task_arn} as stopped')
                stopped_tasks.append(task_info)

            else:
                logging.warning(f'{task_info.task_arn} had an unexpected status: {last_status}')

        # Query the ENIs store-back public IPs.
        running_task_collector.fill_eni_info_from_eni_query()

        running_tasks = running_task_collector.tasks

        return running_tasks, stopped_tasks

    def try_to_delete_record(self, record_set_locator: Route53RecordSetLocator):
        """
        Try to delete the given record set. This may not be possible if the
        record is in a hosted zone we don't have access to. This may happen
        when the user changes dns zones at the service extension level.
        """

        try:
            self.record_set_accessor.delete(record_set_locator)

        except:
            # We give up pretty easily if the record set accessor can't delete
            # the extraneous record for any reason that the accessor can't
            # handle.
            logging.warning(f'Could not delete the extraneous record set {record_set_locator}')


def decode_records(sqs_event):
    logging.info(f'sqs_event = {json.dumps(sqs_event)}')
    return [json.loads(sqs_record['body']) for sqs_record in sqs_event['Records']]
