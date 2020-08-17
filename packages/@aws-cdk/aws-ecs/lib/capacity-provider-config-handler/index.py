import boto3
import os
import json
from uuid import uuid4

client = boto3.client('ecs')

def on_event(event, context):
  print(event)
  request_type = event['RequestType']
  if request_type == 'Create': return on_create(event)
  if request_type == 'Update': return on_update(event)
  if request_type == 'Delete': return on_delete(event)
  raise Exception("Invalid request type: %s" % request_type)

def on_create(event):
  props = event['ResourceProperties']
  cluster_name = props['cluster']
  capacity_providers = json.loads(props['capacityProviders'])
  defaultCapacityProviderStrategy = gen_default_cp_strategy(capacity_providers)
  physical_id = "%s/%s" % (cluster_name, str(uuid4()))
  if len(capacity_providers) > 0:
    client.put_cluster_capacity_providers(
      cluster=cluster_name,
      capacityProviders=[ x.get('name', None) for x in capacity_providers ],
      defaultCapacityProviderStrategy=defaultCapacityProviderStrategy
    ) 
  return { 'PhysicalResourceId': physical_id, 'Data': {} }

def on_update(event):
  props = event['ResourceProperties']
  cluster_name = props['cluster']
  capacity_providers = json.loads(props['capacityProviders'])
  defaultCapacityProviderStrategy = gen_default_cp_strategy(capacity_providers)
  physical_id = event.get('PhysicalResourceId', None)
  client.put_cluster_capacity_providers(
    cluster=cluster_name,
    capacityProviders=[ x.get('name', None) for x in capacity_providers ],
    defaultCapacityProviderStrategy=defaultCapacityProviderStrategy
  )
  
  return on_create(event)

def on_delete(event):
  props = event['ResourceProperties']
  cluster_name = props['cluster']
  physical_id = event.get('PhysicalResourceId', None)
  client.put_cluster_capacity_providers(
    cluster=cluster_name,
    capacityProviders=[],
    defaultCapacityProviderStrategy=[]
  )
  return { 'PhysicalResourceId': physical_id, 'Data': {} }

def gen_default_cp_strategy(capacity_providers):
  default_cp_strategy = []
  for cp in capacity_providers:
    strategy = {}
    if cp.get('name'):
      strategy['capacityProvider'] = cp.get('name')
    if cp.get('defaultStrategy').get('weight'):
      strategy['weight'] = cp.get('defaultStrategy').get('weight')
    if cp.get('defaultStrategy').get('base'):
      strategy['base'] = cp.get('defaultStrategy').get('base')
    default_cp_strategy.append(strategy)
  return default_cp_strategy
