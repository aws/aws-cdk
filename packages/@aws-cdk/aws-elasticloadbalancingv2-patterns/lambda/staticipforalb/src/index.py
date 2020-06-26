import json
import tempfile
from datetime import datetime
import os
import random
import sys
from botocore.exceptions import ClientError
import boto3
import dns.resolver



'''
This function checks the DNS records for an internal Application Load Balancer IP addresses.
It populates a Network Load Balancer's target group with Application Load Balancer's IP addresses

WARNING: This function perform multiple DNS looks per each invocation. It is not guaranteed that all
Application Load Balancer IP will be detected by a single invocation. However, the result converges
when more invocations are triggered. This function perform registration aggressively
and deregistration cautiously.

Configure these environment variables in your Lambda environment (CloudFormation Inputs)
1. ALB_DNS_NAME - The full DNS name of the internal Application Load Balancer
2. ALB_LISTENER - The traffic listener port of the internal Application Load Balancer
3. S3_BUCKET - Bucket to track changes between Lambda invocations
4. NLB_TG_ARN - The ARN of the Network Load Balancer's target group
5. MAX_LOOKUP_PER_INVOCATION - The max times of DNS look per invocation
6. INVOCATIONS_BEFORE_DEREGISTRATION  - Then number of required Invocations before a IP is deregistered
7. CW_METRIC_FLAG_IP_COUNT - The controller flag that enables CloudWatch metric of IP count
'''

ALB_DNS_NAME = os.environ['ALB_DNS_NAME']
ALB_LISTENER = int(os.environ['ALB_LISTENER'])
S3_BUCKET = os.environ['S3_BUCKET']
NLB_TG_ARN = os.environ['NLB_TG_ARN']
MAX_LOOKUP_PER_INVOCATION = int(os.environ['MAX_LOOKUP_PER_INVOCATION'])
INVOCATIONS_BEFORE_DEREGISTRATION = int(os.environ['INVOCATIONS_BEFORE_DEREGISTRATION'])
CW_METRIC_FLAG_IP_COUNT  = os.environ['CW_METRIC_FLAG_IP_COUNT']


ACTIVE_FILENAME = 'Active IP list of {}.json'.format(ALB_DNS_NAME)
PENDING_DEREGISTRATION_FILENAME = 'Pending deregisteration IP list of {}.json'.format(ALB_DNS_NAME)
ACTIVE_IP_LIST_KEY = "{}-active-registered-IPs/{}"\
	.format(ALB_DNS_NAME, ACTIVE_FILENAME)
PENDING_IP_LIST_KEY = "{}-pending-deregisteration-IPs/{}"\
	.format(ALB_DNS_NAME, PENDING_DEREGISTRATION_FILENAME)
TIME = datetime.strftime(((datetime.utcnow())), '%Y-%m-%d %H:%M:%S')

try:
    s3 = boto3.resource('s3')
except Exception as e:
    print("ERROR: failed to connect to S3")
    sys.exit(1)

try:
    cwclient = boto3.client('cloudwatch')
except ClientError as e:
    print(e.response['Error']['Message'])
    sys.exit(1)
try:
    elbv2client = boto3.client('elbv2')
except ClientError as e:
    print(e.response['Error']['Message'])
    sys.exit(1)


def put_metric_data(ip_dict):
    """
    Put metric -- IPCount to CloudWatch
    """
    try:
        cwclient.put_metric_data(
            Namespace='AWS/ApplicationELB',
            MetricData=[
                {
                    'MetricName': "LoadBalancerIPCount",
                    'Dimensions': [
                        {
                            'Name': 'LoadBalancerName',
                            'Value': ip_dict['LoadBalancerName']
                        },
                    ],
                    'Value': float(ip_dict['IPCount']),
                    'Unit': 'Count'
                },
            ]
        )
    except ClientError as e:
        print(e.response['Error']['Message'])


def upload_ip_list(s3_bucket, file_name, json_object, object_key):
    """
    Upload a IP address list to S3
    """
    temp_file = tempfile.NamedTemporaryFile()
    with open(temp_file.name, 'w') as f:
        json.dump(json_object, f)

    try:
        s3.meta.client.upload_file(temp_file.name, s3_bucket, object_key)
    except Exception as e:
        print(e.response['Error']['Message'])


def download_ip_list(s3_bucket, object_key):
    """
    Download a IP address list of Load Balancer IP to S3
    """
    try:
        s3client = boto3.client('s3')
    except Exception as e:
        print("ERROR: failed to connect to S3")
        print(e)

    try:
        response = s3client.get_object(Bucket=s3_bucket, Key=object_key)
    except Exception as e:
        print("ERROR: Failed to download IP list from S3. " \
              "It is normal to see this message " \
              "if it is the first time the Lambda function is triggered.")
        print(e)
        return '{}'
    ip_str = response['Body'].read()
    old_ip_dict = json.loads(ip_str)
    return old_ip_dict


def register_target(tg_arn, new_target_list):
    """
      Register ALB's IP to NLB's target group
    """
    print("INFO: Register new_target_list:{}".format(new_target_list))
    try:
        elbv2client.register_targets(
            TargetGroupArn=tg_arn,
            Targets=new_target_list
        )
    except ClientError as e:
        print(e.response['Error']['Message'])


def deregister_target(tg_arn, new_target_list):
    """
      Deregister ALB's IP from NLB's target group
    """
    try:
        print("INFO: Deregistering targets: {}".format(new_target_list))
        elbv2client.deregister_targets(
            TargetGroupArn=tg_arn,
            Targets=new_target_list
        )
    except ClientError as e:
        print(e.response['Error']['Message'])


def target_group_list(ip_list):
    """
          Render a list of targets for registration
    """
    target_list = []
    for ip in ip_list:
        target = {
            'Id': ip,
            'Port': ALB_LISTENER,
        }
        target_list.append(target)
    return target_list


def describe_target_health(tg_arn):
    """
      Get a IP address list of registered targets in the NLB's target group
    """
    registered_ip_list = []
    try:
        response = elbv2client.describe_target_health(
            TargetGroupArn=tg_arn)
        registered_ip_count = len(response['TargetHealthDescriptions'])
        print("INFO: Number of currently registered IP: ", registered_ip_count)
        for target in response['TargetHealthDescriptions']:
            registered_ip = target['Target']['Id']
            registered_ip_list.append(registered_ip)
    except ClientError as e:
        print(e.response['Error']['Message'])
    return registered_ip_list


def dns_lookup(domainname, record_type, *dnsserver):
    """
    Get dns lookup results
    :param domain:
    :return: list of dns lookup results
    """
    lookup_result_list = []
    myResolver = dns.resolver.Resolver()
    if not dnsserver:
        lookupAnswer = myResolver.query(domainname, record_type)
    else:
        myResolver.nameservers = random.choice(dnsserver)
        lookupAnswer = myResolver.query(domainname, record_type)
    for answer in lookupAnswer:
        lookup_result_list.append(str(answer))
    return lookup_result_list


def lambda_handler(event, context):
    """
        Main Lambda handler
        This is invoked when Lambda is called
        """
    if MAX_LOOKUP_PER_INVOCATION <= 0:
        print("ERROR: MAX_LOOKUP_PER_INVOCATION is negative or zero, try again")
        sys.exit(1)
    if INVOCATIONS_BEFORE_DEREGISTRATION  <= 0:
        print("ERROR: INVOCATIONS_BEFORE_DEREGISTRATION  is negative or zero, try again")
        sys.exit(1)
    regional_name = '.'.join(ALB_DNS_NAME.split('.')[1:])
    authoritative_server_ip_list = []
    regular_record_set = []
    registered_ip_list = describe_target_health(NLB_TG_ARN)
    # Get authoritative name server IP
    authoritative_server_domain_list = set(dns_lookup(regional_name, "NS"))
    for nameserver_domain in authoritative_server_domain_list:
        authoritative_server_ip_list += dns_lookup(nameserver_domain, "A")
    print("INFO: Authoritative name server: {}".format(authoritative_server_ip_list))

    i = 1
    while i <= MAX_LOOKUP_PER_INVOCATION:
        dns_lookup_result = dns_lookup(ALB_DNS_NAME, "A", authoritative_server_ip_list)
        regular_record_set = set(dns_lookup_result) | set(regular_record_set)
        if len(dns_lookup_result) < 8:
            break
        i+=1
    print("INFO: IPs detected by DNS lookup:", regular_record_set)
    print("INFO: Number of IPs detected by DNS lookup: ", len(regular_record_set))

    # At this point if the actual_ip_list is empty then something has gone really wrong
    # An ALB should never have zero IPs in DNS; if it looks like that, bail out
    if not regular_record_set:
        print("ERROR: The number of IPs in DNS for the ALB is" \
              " showing up as zero. This cannot be correct.")
        print("ERROR: Script will not proceed with " \
              "making changes to the NLB target group.")
        sys.exit(1)

    new_active_ip_dict = {"LoadBalancerName": ALB_DNS_NAME, "TimeStamp": TIME}
    new_active_ip_dict["IPList"] = list(regular_record_set)
    new_active_ip_dict["IPCount"] = len(regular_record_set)
    active_ip_json = json.dumps(new_active_ip_dict)
    if CW_METRIC_FLAG_IP_COUNT.lower() == "true":
        put_metric_data(new_active_ip_dict)
    #construct set of new active IPs and registered IPs
    new_active_ip_set = set(new_active_ip_dict['IPList'])
    registered_ip_set = set(registered_ip_list)
    #down load old active IPs and old pending IPs from S3
    old_active_ip_dict = json.loads(download_ip_list(S3_BUCKET, ACTIVE_IP_LIST_KEY))
    old_pending_ip_dict = json.loads(download_ip_list(S3_BUCKET, PENDING_IP_LIST_KEY))
    print("INFO: Active IPs from last invocation: {}".format(old_active_ip_dict))
    print("INFO: Pending deregistration IP from last invocation: {}".format(old_pending_ip_dict))
    print("INFO: Active IPs from the current invocation {}".format(new_active_ip_dict))
    # Check for Registration
    # IPs that have not been registered, and missing from the old active IP list
    new_diff_ip_set_from_descibe = new_active_ip_set - registered_ip_set
    if old_active_ip_dict:
        old_active_ip_set = set(old_active_ip_dict['IPList'])
        new_diff_ip_set_from_s3 = new_active_ip_set - old_active_ip_set
        registration_ip_list = list(new_diff_ip_set_from_s3 | new_diff_ip_set_from_descibe)
    # IPs that have not been registered
    else:
        registration_ip_list = list(new_diff_ip_set_from_descibe)

    # Check for Deregistration
    new_pending_ip_dict = {}
    if old_active_ip_dict:
        old_diff_ip_set_from_s3 = old_active_ip_set - new_active_ip_set
        old_diff_ip_set_from_descibe = registered_ip_set - new_active_ip_set
        deregiter_ip_diff_set = old_diff_ip_set_from_s3 | old_diff_ip_set_from_descibe
        print("INFO: Pending deregistration IPs from current invocation - {}".\
            format(deregiter_ip_diff_set))
        if old_pending_ip_dict:
            old_pending_ip_set = set(old_pending_ip_dict.keys())
            print("INFO: Pending deregistration IPs from last invocation - {}" \
                .format(old_pending_ip_set))
            # Additional IPs are not in the old pending list
            additional_ip_set = deregiter_ip_diff_set - old_pending_ip_set
            print("INFO: Additional pending IPs " \
                  "(pending IPs in the current but not the last invocation) - {}"\
                .format(additional_ip_set))
            for ip in additional_ip_set:
                old_pending_ip_dict[ip] = 1
            # Existing IPs that already in the old pending list
            existing_ip_set = deregiter_ip_diff_set & old_pending_ip_set
            print("INFO: Existing pending IPs (pending " \
                  "IPs in both current and the last invocation) - {}"\
                .format(existing_ip_set))
            for ip in existing_ip_set:
                old_pending_ip_dict[ip] += 1
            # Missing IPs -- In old pending list but no longer in the new pending list
            missing_ip_set = old_pending_ip_set - deregiter_ip_diff_set
            print("INFO: Missing pending IPs (pending " \
                  "IPs in the last but not the current invocation) - {}".format(missing_ip_set))
            for ip in missing_ip_set:
                old_pending_ip_dict.pop(ip)
            new_pending_ip_dict = old_pending_ip_dict
        else:
            for ip in deregiter_ip_diff_set:
                new_pending_ip_dict[ip] = 1
        print("INFO: New pending deregisration IP- {}" .format(new_pending_ip_dict))
    else:
        print("INFO: No active IP List from last invocation")
    pending_ip_json = json.dumps(new_pending_ip_dict)
    upload_ip_list(S3_BUCKET, ACTIVE_FILENAME, active_ip_json, ACTIVE_IP_LIST_KEY)
    upload_ip_list(S3_BUCKET, PENDING_DEREGISTRATION_FILENAME, pending_ip_json, PENDING_IP_LIST_KEY)

    if registration_ip_list:
        registerTarget_list = target_group_list(registration_ip_list)
        register_target(NLB_TG_ARN, registerTarget_list)
        print("INFO: Registering {}".format(registration_ip_list))

    else:
        print("INFO: No new target registered")

    deregistration_ip_list = []
    if new_pending_ip_dict:
        pending_ip_list = new_pending_ip_dict.keys()
        for ip in pending_ip_list:
            if new_pending_ip_dict[ip] >= INVOCATIONS_BEFORE_DEREGISTRATION :
                deregistration_ip_list.append(ip)
                print("INFO: Deregistering IP: {}".format(ip))
                deregisterTarget_list = target_group_list(deregistration_ip_list)
                deregister_target(NLB_TG_ARN, deregisterTarget_list)
    else:
        print("INFO: No old target deregistered")
