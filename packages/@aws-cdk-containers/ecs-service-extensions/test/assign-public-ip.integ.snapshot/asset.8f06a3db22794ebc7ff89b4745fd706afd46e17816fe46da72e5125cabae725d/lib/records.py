from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List, Dict, Set

from boto3.dynamodb.conditions import Key

from lib.route53 import Route53RecordSetLocator


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


@dataclass
class DdbRecordKey:
    cluster_arn: str
    service_name: str

    def to_composite(self):
        return f'{self.cluster_arn}#{self.service_name}'

    @staticmethod
    def from_composite(composite: str):
        cluster_arn, service_name = composite.split('#')
        return DdbRecordKey(cluster_arn=cluster_arn, service_name=service_name)


@dataclass
class DdbRecord:
    key: DdbRecordKey
    ipv4s: Set[str] = field(default_factory=set)
    task_info: Dict[str, TaskInfo] = field(default_factory=dict)
    record_sets: Set[Route53RecordSetLocator] = field(default_factory=set)
    version: int = 0

    def task_is_stopped(self, task_info: TaskInfo):
        """
        Check if a task has already stopped.
        """

        return task_info.task_arn in self.task_info and self.task_info[task_info.task_arn].is_stopped()


class DdbRecordEncoding:
    PK_NAME = 'cluster_service'
    ATTR_VERSION = 'version'
    ATTR_IPV4S = 'ipv4s'
    ATTR_TASK_INFO = 'task_info'
    ATTR_TASK_ARN = 'task_arn'
    ATTR_TASK_ENIS = 'enis'
    ATTR_TASK_STOPPED_DATETIME = 'stopped_datetime'
    ATTR_ENI_ID = 'eni_id'
    ATTR_ENI_PUBLIC_IPV4 = 'public_ipv4'
    ATTR_RECORD_SETS = 'record_sets'
    ATTR_RECORD_SET_ZONE = 'hosted_zone_id'
    ATTR_RECORD_SET_NAME = 'record_name'

    def get_identity(self, key: DdbRecordKey):
        return {self.PK_NAME: key.to_composite()}

    def get_identity_expression(self, key: DdbRecordKey):
        return Key(self.PK_NAME).eq(key.to_composite())

    def encode(self, record: DdbRecord) -> dict:
        data = dict()
        data[self.PK_NAME] = record.key.to_composite()
        data[self.ATTR_VERSION] = record.version

        if len(record.ipv4s) > 0:
            # Sorting only matters here for repeatability in tests, as set ordering
            # isn't easily predictable.
            data[self.ATTR_IPV4S] = [v for v in sorted(record.ipv4s)]

        if len(record.record_sets) > 0:
            data[self.ATTR_RECORD_SETS] = [self.encode_record_set(v) for v in sorted(record.record_sets)]

        if len(record.task_info) > 0:
            data[self.ATTR_TASK_INFO] = {
                task_info.task_arn: self.encode_task_info(task_info)
                for task_info in record.task_info.values()
            }

        return data

    def encode_record_set(self, record_set: Route53RecordSetLocator):
        return {
            self.ATTR_RECORD_SET_ZONE: record_set.hosted_zone_id,
            self.ATTR_RECORD_SET_NAME: record_set.record_name,
        }

    def encode_task_info(self, task_info: TaskInfo) -> dict:
        data = dict()
        data[self.ATTR_TASK_ARN] = task_info.task_arn

        if task_info.stopped_datetime is not None:
            data[self.ATTR_TASK_STOPPED_DATETIME] = task_info.stopped_datetime.isoformat()

        if len(task_info.enis) > 0:
            data[self.ATTR_TASK_ENIS] = [self.encode_eni_info(eni_info) for eni_info in task_info.enis]

        return data

    def encode_eni_info(self, eni_info: EniInfo) -> dict:
        data = dict()
        data[self.ATTR_ENI_ID] = eni_info.eni_id
        if eni_info.public_ipv4 is not None:
            data[self.ATTR_ENI_PUBLIC_IPV4] = eni_info.public_ipv4

        return data

    def decode(self, data: dict) -> DdbRecord:
        key = DdbRecordKey.from_composite(data[self.PK_NAME])
        version = int(data[self.ATTR_VERSION])

        ipv4s = set()
        if self.ATTR_IPV4S in data:
            ipv4s = {ip for ip in data[self.ATTR_IPV4S]}

        record_sets = set()
        if self.ATTR_RECORD_SETS in data:
            for record_set_data in data[self.ATTR_RECORD_SETS]:
                record_set = self.decode_record_set(record_set_data)
                record_sets.add(record_set)

        task_info = dict()
        if self.ATTR_TASK_INFO in data:
            task_info = {
                k: self.decode_task_info(task_info_data)
                for (k, task_info_data) in data[self.ATTR_TASK_INFO].items()
            }

        record = DdbRecord(key=key, version=version, ipv4s=ipv4s, task_info=task_info, record_sets=record_sets)

        return record

    def decode_record_set(self, data) -> Route53RecordSetLocator:
        hosted_zone_id = data[self.ATTR_RECORD_SET_ZONE]
        record_name = data[self.ATTR_RECORD_SET_NAME]

        return Route53RecordSetLocator(hosted_zone_id=hosted_zone_id, record_name=record_name)

    def decode_task_info(self, data) -> TaskInfo:
        task_arn = data[self.ATTR_TASK_ARN]

        stopped_datetime = None
        if self.ATTR_TASK_STOPPED_DATETIME in data:
            stopped_datetime = datetime.fromisoformat(data[self.ATTR_TASK_STOPPED_DATETIME])

        enis = []
        if self.ATTR_TASK_ENIS in data:
            enis = [self.decode_eni_info(eni_info_data) for eni_info_data in data[self.ATTR_TASK_ENIS]]

        return TaskInfo(task_arn=task_arn, stopped_datetime=stopped_datetime, enis=enis)

    def decode_eni_info(self, data) -> EniInfo:
        eni_id = data[self.ATTR_ENI_ID]

        public_ipv4 = None
        if self.ATTR_ENI_PUBLIC_IPV4 in data:
            public_ipv4 = data[self.ATTR_ENI_PUBLIC_IPV4]

        return EniInfo(eni_id=eni_id, public_ipv4=public_ipv4)
