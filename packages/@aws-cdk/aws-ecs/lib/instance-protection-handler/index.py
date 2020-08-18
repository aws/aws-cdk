import boto3, os

client = boto3.client('autoscaling')

def on_event(event, context):
  print(event)
  request_type = event['RequestType']
  if request_type == 'Create': return on_create(event)
  if request_type == 'Update': return on_update(event)
  if request_type == 'Delete': return on_delete(event)
  raise Exception("Invalid request type: %s" % request_type)

def on_create(event):
  props = event['ResourceProperties']
  managed_termination_protection = props['ManagedTerminationProtection'] == 'true'
  asg_name = props['AutoscalingGroupName']
  # update NewInstancesProtectedFromScaleIn for ASG depends on managed_termination_protection
  client.update_auto_scaling_group(
      AutoScalingGroupName=asg_name,
      NewInstancesProtectedFromScaleIn=managed_termination_protection 
  )
  response = client.describe_auto_scaling_groups(
      AutoScalingGroupNames=[
          asg_name,
      ],
      MaxRecords=1
  )
  asg_arn = response['AutoScalingGroups'][0]['AutoScalingGroupARN']
  instances = response['AutoScalingGroups'][0]['Instances']
  # update ProtectedFromScaleIn for instances depends on managed_termination_protection
  instanceIds = [ i['InstanceId'] for i in instances if 'InstanceId' in i ]
  if len(instanceIds) > 0:
    client.set_instance_protection(
        AutoScalingGroupName=asg_name,
        InstanceIds=instanceIds,
        ProtectedFromScaleIn=managed_termination_protection,
    )
  return { 'PhysicalResourceId': asg_name, 'Data': { 'AutoScalingGroupARN': asg_arn } }

def on_update(event):
  return on_create(event)

def on_delete(event):
  props = event['ResourceProperties']
  managed_termination_protection = props['ManagedTerminationProtection'] == 'true'
  asg_name = props['AutoscalingGroupName']
  # remove NewInstancesProtectedFromScaleIn for the ASG if managed_termination_protection
  if managed_termination_protection:
    client.update_auto_scaling_group(
      AutoScalingGroupName=asg_name,
      NewInstancesProtectedFromScaleIn=False 
    )

  response = client.describe_auto_scaling_groups(
      AutoScalingGroupNames=[
          asg_name,
      ],
      MaxRecords=1
  )

  asg_arn = response['AutoScalingGroups'][0]['AutoScalingGroupARN']
  instances = response['AutoScalingGroups'][0]['Instances']
  instanceIds = [ i['InstanceId'] for i in instances if 'InstanceId' in i and i['ProtectedFromScaleIn']==True ]
  # remove ProtectedFromScaleIn for the instances if managed_termination_protection
  if managed_termination_protection and len(instanceIds) > 0:
    client.set_instance_protection(
      AutoScalingGroupName=asg_name,
      InstanceIds=instanceIds,
      ProtectedFromScaleIn=False,
    ) 
  return { 'PhysicalResourceId': asg_name, 'Data': { 'AutoScalingGroupARN': asg_arn } }
