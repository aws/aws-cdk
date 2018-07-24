using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.CrawlerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html </remarks>
    [JsiiInterfaceProxy(typeof(ITargetsProperty), "@aws-cdk/aws-glue.cloudformation.CrawlerResource.TargetsProperty")]
    internal class TargetsPropertyProxy : DeputyBase, ITargetsProperty
    {
        private TargetsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``CrawlerResource.TargetsProperty.JdbcTargets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-jdbctargets </remarks>
        [JsiiProperty("jdbcTargets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.CrawlerResource.JdbcTargetProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object JdbcTargets
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``CrawlerResource.TargetsProperty.S3Targets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-targets.html#cfn-glue-crawler-targets-s3targets </remarks>
        [JsiiProperty("s3Targets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.CrawlerResource.S3TargetProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object S3Targets
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}