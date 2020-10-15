import logging
from typing import *

from lib.records import DdbRecord, EniInfo, TaskInfo


class RunningTaskCollector:
    """
    Collects information about running tasks. After collecting all task info,
    when `fill_eni_info_from_eni_query()` is called, the collector queries
    for the ip addresses of the tasks and fills in the appropriate records.
    """

    ec2_client: Any
    tasks: List[TaskInfo]
    enis_by_id: Dict[str, EniInfo]

    def __init__(self, ec2_client, reference_record: DdbRecord):
        self.ec2_client = ec2_client
        self.tasks = list()
        self.enis_by_id = dict()
        self.reference_record = reference_record

    def collect(self, task_info):
        # Check to see if the task we've received is already stopped. If so,
        # we refuse to collect it on the basis that we'll just get an eni
        # doesn't exist error anyway.
        if self.reference_record.task_is_stopped(task_info):
            logging.info(f'Refusing to collect {task_info.task_arn} as it has already been deleted')
            return

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
