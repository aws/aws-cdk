import boto3
import json
import time

cp = boto3.client('codepipeline')

def handler(event, context):
  time.sleep(10) # wait 10 seconds for manual approval action to run
  pipeline_name = event['PipelineName']
  stage_name = event['StageName']
  action_name = event['ActionName']

  response = cp.get_pipeline_state(name=pipeline_name)
  token = parse_pipeline_state(response, stage_name, action_name)

  if token:
    cp.put_approval_result(
      pipelineName=pipeline_name,
      stageName=stage_name,
      actionName=action_name,
      result={
        'summary': 'No security changes detected. Automatically approved by Lambda.',
        'status': 'Approved',
      },
      token=token
    )

def parse_pipeline_state(response, stageName, actionName):
  stages = response['stageStates']
  selected_stages = [s for s in stages if s['stageName'] == stageName]
  if len(selected_stages) == 0:
    return
  manual_approval_action = [a for a in selected_stages[0]['actionStates'] if a['actionName'] == actionName]
  if len(manual_approval_action) == 0:
    return
  latest = manual_approval_action[0]['latestExecution']
  return latest['token']
