import boto3
codecommit_client = boto3.client('codecommit')

def lambda_handler(event, context):
    for item in event['detail']['additional-information']['environment']['environment-variables']:
        if item['name'] == 'pullRequestId': pull_request_id = item['value']
        if item['name'] == 'repositoryName': repository_name = item['value']
        if item['name'] == 'sourceCommit': before_commit_id = item['value']
        if item['name'] == 'destinationCommit': after_commit_id = item['value']
    
    s3_prefix = 's3-{0}'.format(event['region']) if event['region'] != 'us-east-1' else 's3'
    
    for phase in event['detail']['additional-information']['phases']:
        if phase.get('phase-status') == 'FAILED':
            badge = 'https://{0}.amazonaws.com/codefactory-{1}-prod-default-build-badges/failing.svg'.format(s3_prefix, event['region'])
            content = '![Failing]({0} "Failing") - See the [Logs]({1})'.format(badge, event['detail']['additional-information']['logs']['deep-link'])
            break
        else:
            badge = 'https://{0}.amazonaws.com/codefactory-{1}-prod-default-build-badges/passing.svg'.format(s3_prefix, event['region'])
            content = '![Passing]({0} "Passing") - See the [Logs]({1})'.format(badge, event['detail']['additional-information']['logs']['deep-link'])
    
    codecommit_client.post_comment_for_pull_request(
        pullRequestId=pull_request_id,
        repositoryName=repository_name,
        beforeCommitId=before_commit_id,
        afterCommitId=after_commit_id,
        content=content
    )
