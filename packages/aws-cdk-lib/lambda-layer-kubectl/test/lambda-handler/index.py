import subprocess

def handler(event, context):
  subprocess.check_call(["/opt/kubectl/kubectl", "config", "view"])
  subprocess.check_call(["/opt/helm/helm", "version"])
  return