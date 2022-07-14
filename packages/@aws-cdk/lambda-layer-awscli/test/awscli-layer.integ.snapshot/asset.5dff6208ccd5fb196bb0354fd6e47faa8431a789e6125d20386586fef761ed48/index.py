import subprocess

def handler(event, context):
  subprocess.check_call(["/opt/awscli/aws", "--version"])
  return
