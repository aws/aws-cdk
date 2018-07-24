using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.CrawlerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html </remarks>
    public class TargetsProperty : DeputyBase, ITargetsProperty
    {
        /// <summary>``CrawlerResource.TargetsProperty.JdbcTargets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-jdbctargets </remarks>
        [JsiiProperty("jdbcTargets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.CrawlerResource.JdbcTargetProperty\"}]}}}}]},\"optional\":true}", true)]
        public object JdbcTargets
        {
            get;
            set;
        }

        /// <summary>``CrawlerResource.TargetsProperty.S3Targets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-s3targets </remarks>
        [JsiiProperty("s3Targets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.CrawlerResource.S3TargetProperty\"}]}}}}]},\"optional\":true}", true)]
        public object S3Targets
        {
            get;
            set;
        }
    }
}