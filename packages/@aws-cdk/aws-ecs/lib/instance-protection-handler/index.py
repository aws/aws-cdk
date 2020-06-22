import boto3, os
client = boto3.client('autoscaling')
def on_event(event, context):
  asg_name = os.environ['autoscaling_group_name']
  client.update_auto_scaling_group(
      AutoScalingGroupName=asg_name,
      NewInstancesProtectedFromScaleIn=True 
  )
  response = client.describe_auto_scaling_groups(
      AutoScalingGroupNames=[
          asg_name,
      ],
      MaxRecords=1
  )
  asg_arn = response['AutoScalingGroups'][0]['AutoScalingGroupARN']
  instances = response['AutoScalingGroups'][0]['Instances']
  instanceIds = [ i['InstanceId'] for i in instances if 'InstanceId' in i and i['ProtectedFromScaleIn']==False ]
  if len(instanceIds) > 0:
    client.set_instance_protection(
        AutoScalingGroupName=asg_name,
        InstanceIds=instanceIds,
        ProtectedFromScaleIn=True,
    )
  return { 'PhysicalResourceId': asg_name, 'Data': { 'AutoScalingGroupARN': asg_arn } }