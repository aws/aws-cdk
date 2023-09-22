from aws_cdk import Stack
import aws_cdk as cdk
import aws_cdk.aws_s3 as s3
from constructs import Construct

"""
  AWS CloudFormation Sample Template S3_Website_Bucket_With_Retain_On_Delete: Sample template showing how to create a publicly accessible S3 bucket configured for website access with a deletion policy of retain on delete.
"""
class GoodPythonStack(Stack):
  """
    URL for website hosted on S3
  """
  global website_u_r_l
  """
    Name of S3 bucket to hold website content
  """
  global s3_bucket_secure_u_r_l

  def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
    super().__init__(scope, construct_id, **kwargs)

    # Resources
    s3Bucket = s3.CfnBucket(self, 'S3Bucket',
          access_control = 'PublicRead',
          website_configuration = {
            'indexDocument': 'index.html',
            'errorDocument': 'error.html',
          },
        )
    s3Bucket.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN

    # Outputs
    self.website_u_r_l = s3Bucket.attr_website_u_r_l
    cdk.CfnOutput(self, 'WebsiteURL', 
      description = 'URL for website hosted on S3',
      value = self.website_u_r_l,
    )
    self.s3_bucket_secure_u_r_l = [
      'https://',
      s3Bucket.attr_domain_name,
    ].join('')
    cdk.CfnOutput(self, 'S3BucketSecureURL', 
      description = 'Name of S3 bucket to hold website content',
      value = self.s3_bucket_secure_u_r_l,
    )


