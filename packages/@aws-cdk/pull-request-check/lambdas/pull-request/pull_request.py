import datetime
import boto3
codecommit_client = boto3.client('codecommit')

def lambda_handler(event, context):
    if event['detail']['event'] in ['pullRequestSourceBranchUpdated', 'pullRequestCreated']:
        pull_request_id = event['detail']['pullRequestId']
        repository_name = event['detail']['repositoryNames'][0]
        source_commit = event['detail']['sourceCommit']
        destination_commit = event['detail']['destinationCommit']
        codecommit_client.post_comment_for_pull_request(
            pullRequestId=pull_request_id,
            repositoryName=repository_name,
            beforeCommitId=source_commit,
            afterCommitId=destination_commit,
            content='**Build started at {}**'.format(datetime.datetime.utcnow().time())
        )
