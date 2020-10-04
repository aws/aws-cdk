from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging
import time
from typing import *

from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

from lib.tasks import TaskInfo, EniInfo
from lib.records import DdbRecord, DdbRecordKey, DdbRecordEncoding


class RecordsTable:
  """
  Abstracts management of the task records to putting running and stopped tasks.
  """

  table_client: Any
  ddb_record_encoding: DdbRecordEncoding

  # Max number of attempts at optimistic put_tasks
  max_attempts = 50

  # Amount of lag to add (if any) to simulate concurrent locking conflicts in
  # lambda
  optimistic_simulation_delay = 0

  def __init__(self, table_client):
    """
    Initializes a RecordsTable. Provide a boto3.resource
    """
    self.table_client = table_client
    self.ddb_record_encoding = DdbRecordEncoding()

  def delete(self, key: DdbRecordKey):
    """
    Delete a record by record key.
    """

    logging.info(f'Deleting {key}')
    self.table_client.delete_item(Key=self.ddb_record_encoding.get_identity(key))

  def put_tasks(self, **kwargs) -> Tuple[List[str], List[str]]:
    """
    Retries putting tasks into the table record with optimistic locking.
    """

    for attempt in range(0, self.max_attempts):
      try:
        logging.info(f'Attempting to put the task optimistically (attempt {attempt+1})')
        return self.put_tasks_optimistically(**kwargs)
      except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
          logging.info(f'Check condition was rejected')
          continue
        else:
          raise

    # Ran out of retries!!
    raise Exception('Exceeded maximum retries while optimistically putting changes')

  def get_record(self, key: DdbRecordKey) -> DdbRecord:
    """
    Gets the record by key or provides a blank record.
    """

    # Search for the pertient record
    response = self.table_client.query(KeyConditionExpression=self.ddb_record_encoding.get_identity_expression(key))

    if len(response['Items']) > 0:
      # Decode a pre-existing record
      logging.info(f'Found a pre-existing record')
      return self.ddb_record_encoding.decode(response['Items'][0])
    else:
      logging.info(f'Creating a new record')
      # Create a new record
      return DdbRecord(key=key)

  def put_tasks_optimistically(self, key: DdbRecordKey, running: List[TaskInfo] = [],
                               stopped: List[TaskInfo] = []) -> Tuple[List[str], List[str]]:
    """
    Optimistically record running and stopped tasks for this record.
    """

    ddb_record = self.get_record(key=key)

    # Add some lag (if any) to simulate concurrent locking conflicts in lambda
    if self.optimistic_simulation_delay > 0:
      time.sleep(self.optimistic_simulation_delay)

    # Update the record with the running and stopped task info
    update_ddb_record(ddb_record=ddb_record, running=running, stopped=stopped)

    # Optimistic locking condition
    optimisic_lock_condition = Attr(self.ddb_record_encoding.ATTR_VERSION).not_exists() \
      | Attr(self.ddb_record_encoding.ATTR_VERSION).eq(ddb_record.version)

    # Prepare the record for updating
    ddb_record.version += 1
    item = self.ddb_record_encoding.encode(ddb_record)

    # Put it up
    self.table_client.put_item(Item=item, ConditionExpression=optimisic_lock_condition)

    return ddb_record


def update_ddb_record(ddb_record: DdbRecord, running: List[TaskInfo] = [], stopped: List[TaskInfo] = []) -> DdbRecord:
  """
  Updates a DynamoDB record with the list of running and stopped tasks.
  """

  # Add running task info to the record
  for running_task in running:
    # Don't add a task as running when it previously stopped (out-of-order receive)
    if running_task.task_arn in ddb_record.task_info and ddb_record.task_info[running_task.task_arn].is_stopped():
      logging.info(f'Received {running_task.task_arn} transition to RUNNING, but it was already stopped. Ignored.')
      continue

    # Record info about the running task
    ddb_record.task_info[running_task.task_arn] = running_task

    # Add all public ips to the public ip set
    for eni in running_task.enis:
      if eni.public_ipv4 is not None:
        ddb_record.ipv4s.add(eni.public_ipv4)

    logging.info(f'Recorded {running_task.task_arn} as RUNNING.')

  # Remove stopped task ips from the record and set "stopped" markers on the
  # stored task info.
  for stopped_task in stopped:
    # When the stopped task was previously represented in the task info list,
    # then we fetch the old representation for its potential ip address info.
    if stopped_task.task_arn in ddb_record.task_info:
      task_arn = stopped_task.task_arn
      stored_task = ddb_record.task_info[task_arn]

      # When the task is not yet marked as stopped, we need to mark it as such
      # and remove its eni ips from the ip list.
      if not stored_task.is_stopped():
        stored_task.set_stopped_marker()

        for eni in stored_task.enis:
          if eni.public_ipv4 is not None and eni.public_ipv4 in ddb_record.ipv4s:
            ddb_record.ipv4s.remove(eni.public_ipv4)

        logging.info(f'Recorded {task_arn} as STOPPED.')

      else:
        # Stored task already marked as stopped, so the received task is a
        # duplicate. Ignore it.
        logging.info(f'Received {task_arn} which was already STOPPED. Ignoring.')
        pass

    else:
      # Stopped task isn't in the task list, so we've received an out-of-order
      # STOPPED transition. We don't know this task, but we know that if we
      # receive a running task in the future, that we don't want to accept it.
      stopped_task.set_stopped_marker()
      ddb_record.task_info[stopped_task.task_arn] = stopped_task
      logging.info(f'Recorded {stopped_task.task_arn} as STOPPED even though we have never seen it.')

  # Expunge expired tasks. Use a copy of the dict items to avoid errors from the
  # dictionary changing while iterating.
  for (key, task) in list(ddb_record.task_info.items()):
    if task_info_has_expired(task):
      logging.info(f'Expunging {task.task_arn} as expired.')
      del ddb_record.task_info[key]

  return ddb_record


# The the length of time that a task marked as stopped may continue to exist
# in the task info list befor eit it is expunged.
STOPPED_MARKER_EXPIRATION = timedelta(minutes=30)


def task_info_has_expired(task_info: TaskInfo):
  """
  Determine if this task info can be deleted from the DDB record. If the task
  has stopped and the stopped marker expiration has elapsed, then we can
  delete, otherwise the task info must be kept to filter out-of-order duplicate
  RUNNING state transition events.
  """

  if not task_info.is_stopped():
    return False

  stopped_marker_age = datetime.utcnow() - task_info.stopped_datetime
  return True if stopped_marker_age > STOPPED_MARKER_EXPIRATION else False
