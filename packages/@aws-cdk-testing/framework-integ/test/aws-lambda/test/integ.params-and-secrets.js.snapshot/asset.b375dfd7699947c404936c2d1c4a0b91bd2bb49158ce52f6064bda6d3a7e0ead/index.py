import requests
import os

def handler(event, context):
    # authentication header
    session_token = os.environ.get('AWS_SESSION_TOKEN')
    headers = {'X-Aws-Parameters-Secrets-Token': session_token}

    # request to parameter store
    parameter_url = 'http://localhost:2773/systemsmanager/parameters/get?name=email_url'
    response = requests.get(parameter_url, headers=headers)
    print(f'response status code from HTTP for parameters request was {response.status_code}')
    print(f'response json is {response.json()}')

    # request to secrets manager
    secrets_url = 'https://localhost:2773/secretsmanager/get?secretId=MySecret'
    response = requests.get(secrets_url, headers=headers)
    print(f'response status code from HTTP for secrets request was {response.status_code}')
    print(f'response json is {response.json()}')
