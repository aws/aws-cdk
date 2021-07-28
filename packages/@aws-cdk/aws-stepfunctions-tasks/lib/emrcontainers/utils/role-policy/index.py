import subprocess as sp
import os
import logging

def handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    command = f"/opt/awscli/aws emr-containers update-role-trust-policy --cluster-name {os.environ['eksClusterId']} --namespace {os.environ['eksNamespace']} --role-name {os.environ['roleName']}"
    try:
        res = sp.check_output(command, shell=True)
        logger.info(f"Successfully ran {command}")
    except Exception as e:
        logger.info(f"ERROR: {str(e)}")
    
