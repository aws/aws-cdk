import json
import logging
import os
import time
from dataclasses import dataclass
from typing import *

import boto3

from lib.route53 import Route53RecordSetMerger, Route53RecordSetLocator
from lib.tasks import RunningTaskCollector, extract_task_info
from lib.records_table import RecordsTable
from lib.records import DdbRecordKey


logging.getLogger().setLevel(logging.INFO)


def queue_handler(event, context):
  cluster_arn = os.environ['CLUSTER_ARN']
  service_arn = os.environ['SERVICE_ARN']
  hosted_zone_id = os.environ['HOSTED_ZONE_ID']
  record_name = os.environ['RECORD_NAME']
  records_table = os.environ['RECORDS_TABLE']

  ec2_client = boto3.client('ec2')
  route53_client = boto3.client('route53')
  dynamodb_table_client = boto3.resource('dynamodb').Table(records_table)

  logging.info(f'event = {json.dumps(event)}')

  # Collect running and stopped tasks from the status change events
  running_task_collector = RunningTaskCollector(ec2_client=ec2_client)
  stopped_tasks = []

  for task_description in decode_state_change_events(event):
    task_info = extract_task_info(task_description)
    logging.info(f'extracted task_info = {task_info}')

    last_status = task_description['lastStatus']
    if last_status == 'RUNNING':
      logging.info(f'Collecting {task_info.task_arn} as running')
      running_task_collector.collect(task_info)
    elif last_status == 'STOPPED':
      logging.info(f'Collecting {task_info.task_arn} as stopped')
      stopped_tasks.append(task_info)
    else:
      logging.warn(f'{task_info.task_arn} had an unexpected status: {last_status}')

  # Query the ENIs store-back public IPs.
  running_task_collector.fill_eni_info_from_eni_query()

  # Put the tasks into the records table using optimistic locking
  records_table = RecordsTable(table_client=dynamodb_table_client)
  # records_table.optimistic_simulation_delay = 5
  records_table_key = DdbRecordKey(hosted_zone_id=hosted_zone_id, record_name=record_name)
  records_table.put_tasks(key=records_table_key, running=running_task_collector.tasks, stopped=stopped_tasks)


def decode_state_change_events(sqs_event):
  logging.info(f'sqs_event = {json.dumps(sqs_event)}')
  return [json.loads(sqs_record['body'])['detail'] for sqs_record in sqs_event['Records']]
