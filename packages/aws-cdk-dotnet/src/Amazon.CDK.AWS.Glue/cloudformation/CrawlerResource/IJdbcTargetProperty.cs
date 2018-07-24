using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.CrawlerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-jdbctarget.html </remarks>
    [JsiiInterface(typeof(IJdbcTargetProperty), "@aws-cdk/aws-glue.cloudformation.CrawlerResource.JdbcTargetProperty")]
    public interface IJdbcTargetProperty
    {
        /// <summary>``CrawlerResource.JdbcTargetProperty.ConnectionName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-jdbctarget.html#cfn-glue-crawler-jdbctarget-connectionname </remarks>
        [JsiiProperty("connectionName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ConnectionName
        {
            get;
            set;
        }

        /// <summary>``CrawlerResource.JdbcTargetProperty.Exclusions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-jdbctarget.html#cfn-glue-crawler-jdbctarget-exclusions </remarks>
        [JsiiProperty("exclusions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Exclusions
        {
            get;
            set;
        }

        /// <summary>``CrawlerResource.JdbcTargetProperty.Path``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-jdbctarget.html#cfn-glue-crawler-jdbctarget-path </remarks>
        [JsiiProperty("path", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Path
        {
            get;
            set;
        }
    }
}