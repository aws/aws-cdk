from aws_cdk import Stack
import aws_cdk as cdk
import aws_cdk.aws_s3 as s3
from constructs import Construct

"""
  AWS CloudFormation Sample Template S3_Website_Bucket_With_Retain_On_Delete: Sample template showing how to create a publicly accessible S3 bucket configured for website access with a deletion policy of retain on delete.
"""
class GoodPythonStack(Stack):
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
    s3Bucket.cfn_options.deletion_policy = cdk.CfnDeletionPolicy.RETAIN

    # Outputs
    """
      URL for website hosted on S3
    """
    self.website_url = s3Bucket.attr_website_url
    cdk.CfnOutput(self, 'CfnOutputWebsiteURL', 
      key = 'WebsiteURL',
      description = 'URL for website hosted on S3',
      value = str(self.website_url),
    )

    """
      Name of S3 bucket to hold website content
    """
    self.s3_bucket_secure_url = ''.join([
      'https://',
      s3Bucket.attr_domain_name,
    ])
    cdk.CfnOutput(self, 'CfnOutputS3BucketSecureURL', 
      key = 'S3BucketSecureURL',
      description = 'Name of S3 bucket to hold website content',
      value = str(self.s3_bucket_secure_url),
    )



