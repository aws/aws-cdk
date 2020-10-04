from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import *


@dataclass
class EniInfo:
  eni_id: str
  public_ipv4: Optional[str] = None


@dataclass
class TaskInfo:
  task_arn: str
  enis: List[EniInfo]
  stopped_datetime: Optional[datetime] = None

  # Tombstone information for the dynamodb record.

  def set_stopped_marker(self):
    """
    Mark this task as stopped.
    """

    self.stopped_datetime = datetime.utcnow()

  def is_stopped(self):
    """
    Check if this task is stopped.
    """
    return True if self.stopped_datetime is not None else False


class RunningTaskCollector:
  """
  Collects descriptions of running tasks, extracting basic information out of
  the task description-esque structure and stores them. After collecting several
  tasks, when `fill_eni_info_from_eni_query()` is called, the collector queries
  for the ip addresses of the tasks and fills in the appropriate records.
  """

  ec2_client: Any
  tasks: List[TaskInfo]
  enis_by_id: Dict[str, EniInfo]

  def __init__(self, ec2_client):
    self.ec2_client = ec2_client
    self.tasks = list()
    self.enis_by_id = dict()

  def collect(self, task_info):
    # Append the task info to the master list
    self.tasks.append(task_info)

    # Collect enis indexed by their ids
    for eni in task_info.enis:
      self.enis_by_id[eni.eni_id] = eni

  def fill_eni_info_from_eni_query(self):
    for eni_description in self.describe_enis():
      eni_id = eni_description['NetworkInterfaceId']

      if 'Association' in eni_description:
        public_ipv4 = eni_description['Association']['PublicIp']
        if public_ipv4 and eni_id in self.enis_by_id:
          self.enis_by_id[eni_id].public_ipv4 = public_ipv4

  def describe_enis(self):
    paginator = self.ec2_client.get_paginator('describe_network_interfaces')

    eni_ids = list(self.enis_by_id.keys())
    for page in paginator.paginate(NetworkInterfaceIds=eni_ids):
      for eni in page['NetworkInterfaces']:
        yield eni

  def get_ips(self):
    return [eni.public_ipv4 for eni in self.enis_by_id.values()]


def extract_task_info(task_description) -> TaskInfo:
  arn = task_description['taskArn']

  # Parse the eni info out of the the attachments
  enis = network_interface_ids = [
      EniInfo(eni_id=detail['value']) for network_interface in task_description['attachments']
      if network_interface['type'] == 'eni' for detail in network_interface['details']
      if detail['name'] == 'networkInterfaceId'
  ]

  # Create an object out of the extracted information
  return TaskInfo(task_arn=arn, enis=enis)
