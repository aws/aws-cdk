import sys

from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext

spark_context = SparkContext()
glue_context = GlueContext(spark_context)
job = Job(glue_context)
args = getResolvedOptions(sys.argv, ["JOB_NAME"])
job.init(args["JOB_NAME"], args)

print("Hello, World!")

job.commit()
