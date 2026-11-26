import utils

args = utils.get_job_args(['JOB_NAME', 'JOB_RUN_ID'], ['--s3-py-modules'])
print(args)
