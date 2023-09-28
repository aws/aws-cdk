using Amazon.CDK;
using Amazon.CDK.AWS.S3;
using Constructs;
using System.Collections.Generic;

namespace GoodCSharpStack
{
    public class GoodCSharpStackProps : StackProps
    {
    }

    /// <summary>
    /// AWS CloudFormation Sample Template S3_Website_Bucket_With_Retain_On_Delete: Sample template showing how to create a publicly accessible S3 bucket configured for website access with a deletion policy of retain on delete.
    /// </summary>
    public class GoodCSharpStack : Stack
    {
        /// <summary>
        /// URL for website hosted on S3
        /// </summary>
        public object WebsiteURL { get; } 

        /// <summary>
        /// Name of S3 bucket to hold website content
        /// </summary>
        public object S3BucketSecureURL { get; } 

        public GoodCSharpStack(Construct scope, string id, GoodCSharpStackProps props = null) : base(scope, id, props)
        {

            // Resources
            var s3Bucket = new CfnBucket(this, "S3Bucket", new CfnBucketProps
            {
                AccessControl = "PublicRead",
                WebsiteConfiguration = new CfnBucket.WebsiteConfigurationProperty
                {
                    IndexDocument = "index.html",
                    ErrorDocument = "error.html",
                },
            });

            // Outputs
            WebsiteURL = s3Bucket.AttrWebsiteURL;
            S3BucketSecureURL = string.Join("", new []
            {
                "https://",
                s3Bucket.AttrDomainName,
            });
        }
    }
}
