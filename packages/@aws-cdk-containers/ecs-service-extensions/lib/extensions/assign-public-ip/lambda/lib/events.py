from lib.records import TaskInfo, EniInfo


def extract_event_task_info(task_description) -> TaskInfo:
    arn = task_description['taskArn']

    # Parse the eni info out of the the attachments
    enis = [
        EniInfo(eni_id=detail['value']) for network_interface in task_description['attachments']
        if network_interface['type'] == 'eni' for detail in network_interface['details']
        if detail['name'] == 'networkInterfaceId'
    ]

    # Create an object out of the extracted information
    return TaskInfo(task_arn=arn, enis=enis)